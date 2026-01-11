"""共通スキーマ"""
from pydantic import BaseModel
from typing import Any, Optional, Dict


class ApiResponse(BaseModel):
    """API成功レスポンス"""
    success: bool = True
    data: Any
    message: str = ""


class ErrorDetail(BaseModel):
    """エラー詳細"""
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None


class ErrorResponse(BaseModel):
    """APIエラーレスポンス"""
    success: bool = False
    error: ErrorDetail
