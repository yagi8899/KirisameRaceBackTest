"""グリッドサーチ関連スキーマ"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from app.models.enums import StrategyType
from app.schemas.backtest import RaceFilter


class ParameterRange(BaseModel):
    """パラメータ範囲"""
    betAmounts: Optional[List[int]] = Field(default=None, description="購入金額リスト")
    topNValues: Optional[List[int]] = Field(default=None, description="上位N頭リスト")
    scoreThresholds: Optional[List[float]] = Field(default=None, description="スコア閾値リスト")


class GridSearchRequest(BaseModel):
    """グリッドサーチリクエスト"""
    fileId: str = Field(..., description="ファイルID")
    strategyType: StrategyType = Field(..., description="戦略タイプ")
    paramRanges: ParameterRange = Field(..., description="パラメータ範囲")
    filters: Optional[RaceFilter] = Field(default=None, description="レースフィルタ")


class GridSearchResultItem(BaseModel):
    """グリッドサーチ結果アイテム"""
    betAmount: int
    topN: int
    scoreThreshold: float
    totalRaces: int
    betRaces: int
    totalBets: int
    totalInvestment: float
    totalPayout: float
    totalProfit: float
    roi: float
    hitRate: float
    hitCount: int


class GridSearchResponse(BaseModel):
    """グリッドサーチレスポンス"""
    totalCombinations: int = Field(..., description="総組み合わせ数")
    results: List[GridSearchResultItem] = Field(..., description="結果リスト (ROI降順)")
    bestResult: GridSearchResultItem = Field(..., description="最良の結果")
    strategyType: StrategyType
