from pydantic import BaseModel
from typing import List
from app.schemas.backtest import StrategyConfig


class ComparisonRequest(BaseModel):
    """複数戦略の比較リクエスト"""
    strategies: List[StrategyConfig]
    dataFile: str


class ComparisonResultItem(BaseModel):
    """個別戦略の結果"""
    strategyName: str
    totalRaces: int
    totalBets: int
    hits: int
    hitRate: float
    totalInvestment: int
    totalReturn: int
    totalProfit: int
    roi: float
    averageOdds: float
    maxDrawdown: int


class ComparisonResponse(BaseModel):
    """戦略比較のレスポンス"""
    results: List[ComparisonResultItem]
    bestStrategy: ComparisonResultItem
