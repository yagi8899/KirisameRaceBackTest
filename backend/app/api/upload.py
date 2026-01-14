"""アップロードAPI"""
import os
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from fastapi.responses import JSONResponse

from app.schemas.common import ApiResponse, ErrorResponse, ErrorDetail
from app.schemas.upload import (
    UploadResponseData,
    DataStats,
    DateRange,
    DistanceRange,
    PredictionAccuracy,
    DataPreviewResponse,
)
from app.services.data_loader import (
    load_tsv_file,
    validate_columns,
    calculate_data_stats,
    get_preview_data,
)
from app.core.data_store import DataStore
from app.utils.exceptions import FileFormatError, ValidationError

router = APIRouter(prefix="/api/upload", tags=["Upload"])


@router.post("", response_model=ApiResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    TSVファイルをアップロードして検証
    
    Args:
        file: アップロードされたTSVファイル
        
    Returns:
        UploadResponseData: アップロード結果とデータ統計
    """
    # ファイル拡張子チェック
    if not file.filename or not file.filename.endswith((".tsv", ".txt")):
        error_response = ErrorResponse(
            error=ErrorDetail(
                code="INVALID_FILE_TYPE",
                message="TSVファイルのみアップロード可能です",
                details={"filename": file.filename}
            )
        )
        return JSONResponse(
            status_code=400,
            content=error_response.model_dump()
        )
    
    # 一時ファイルに保存
    temp_dir = Path("temp")
    temp_dir.mkdir(exist_ok=True)
    temp_file_path = temp_dir / f"{datetime.now().timestamp()}_{file.filename}"
    
    try:
        # ファイルを一時保存
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # TSVファイル読み込み
        try:
            df = load_tsv_file(str(temp_file_path))
        except Exception as e:
            error_response = ErrorResponse(
                error=ErrorDetail(
                    code="FILE_READ_ERROR",
                    message=f"ファイルの読み込みに失敗しました: {str(e)}",
                    details={"filename": file.filename}
                )
            )
            return JSONResponse(
                status_code=400,
                content=error_response.model_dump()
            )
        
        # カラム検証
        try:
            validate_columns(df)
        except ValidationError as e:
            error_response = ErrorResponse(
                error=ErrorDetail(
                    code="VALIDATION_ERROR",
                    message=str(e),
                    details={"filename": file.filename}
                )
            )
            return JSONResponse(
                status_code=400,
                content=error_response.model_dump()
            )
        
        # データストアに保存（新規アップロード時は既存データを削除）
        data_store = DataStore.get_instance()
        data_store.clear_all()  # 古いデータを削除
        file_id = data_store.save(df)
        
        # 統計情報計算
        stats_dict = calculate_data_stats(df)
        
        # レスポンス作成
        stats = DataStats(
            totalRaces=stats_dict["totalRaces"],
            totalHorses=stats_dict["totalHorses"],
            averageHorsesPerRace=stats_dict["averageHorsesPerRace"],
            dateRange=DateRange(
                start=stats_dict["dateRange"]["start"],
                end=stats_dict["dateRange"]["end"]
            ),
            racecourses=stats_dict["racecourses"],
            surfaces=stats_dict["surfaces"],
            distanceRange=DistanceRange(
                min=stats_dict["distanceRange"]["min"],
                max=stats_dict["distanceRange"]["max"]
            ),
            predictionAccuracy=PredictionAccuracy(
                rank1HitRate=stats_dict["predictionAccuracy"]["rank1HitRate"],
                rank1_3HitRate=stats_dict["predictionAccuracy"]["rank1_3HitRate"],
                averagePredictionError=stats_dict["predictionAccuracy"]["averagePredictionError"]
            )
        )
        
        file_size = os.path.getsize(temp_file_path)
        
        response_data = UploadResponseData(
            fileId=file_id,
            fileName=file.filename,
            fileSize=file_size,
            rowCount=len(df),
            columnCount=len(df.columns),
            uploadedAt=datetime.now(),
            stats=stats
        )
        
        return ApiResponse(
            success=True,
            data=response_data.model_dump(),
            message="ファイルのアップロードが完了しました"
        )
        
    finally:
        # 一時ファイル削除
        if temp_file_path.exists():
            temp_file_path.unlink()


@router.get("/{file_id}/preview", response_model=ApiResponse)
async def preview_data(
    file_id: str,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """
    アップロード済みデータのプレビュー取得
    
    Args:
        file_id: ファイルID
        limit: 取得件数
        offset: オフセット
        
    Returns:
        DataPreviewResponse: プレビューデータ
    """
    data_store = DataStore.get_instance()
    df = data_store.get(file_id)
    
    if df is None:
        error_response = ErrorResponse(
            error=ErrorDetail(
                code="FILE_NOT_FOUND",
                message="指定されたファイルIDが見つかりません",
                details={"file_id": file_id}
            )
        )
        return JSONResponse(
            status_code=404,
            content=error_response.model_dump()
        )
    
    preview_data = get_preview_data(df, limit=limit, offset=offset)
    
    response_data = DataPreviewResponse(
        rows=preview_data["rows"],
        total=preview_data["total"],
        limit=limit,
        offset=offset
    )
    
    return ApiResponse(
        success=True,
        data=response_data.model_dump(),
        message="データプレビューを取得しました"
    )


@router.delete("/{file_id}", response_model=ApiResponse)
async def delete_file(file_id: str):
    """
    アップロード済みデータの削除
    
    Args:
        file_id: ファイルID
        
    Returns:
        削除結果
    """
    data_store = DataStore.get_instance()
    deleted = data_store.delete(file_id)
    
    if not deleted:
        error_response = ErrorResponse(
            error=ErrorDetail(
                code="FILE_NOT_FOUND",
                message="指定されたファイルIDが見つかりません",
                details={"file_id": file_id}
            )
        )
        return JSONResponse(
            status_code=404,
            content=error_response.model_dump()
        )
    
    return ApiResponse(
        success=True,
        data={"file_id": file_id},
        message="ファイルを削除しました"
    )
