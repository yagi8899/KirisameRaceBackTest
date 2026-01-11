"""アップロード関連スキーマ"""
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime


class DateRange(BaseModel):
    """日付範囲"""
    start: str
    end: str


class DistanceRange(BaseModel):
    """距離範囲"""
    min: int
    max: int


class PredictionAccuracy(BaseModel):
    """予測精度"""
    rank1HitRate: float
    rank1_3HitRate: float
    averagePredictionError: float


class DataStats(BaseModel):
    """データ統計情報"""
    totalRaces: int
    totalHorses: int
    averageHorsesPerRace: float
    dateRange: DateRange
    racecourses: List[str]
    surfaces: List[str]
    distanceRange: DistanceRange
    predictionAccuracy: PredictionAccuracy


class UploadResponseData(BaseModel):
    """アップロードレスポンスデータ"""
    fileId: str
    fileName: str
    fileSize: int
    rowCount: int
    columnCount: int
    uploadedAt: datetime
    stats: DataStats


class DataPreviewResponse(BaseModel):
    """データプレビューレスポンス"""
    rows: List[Dict]
    total: int
    limit: int
    offset: int
