"""バックテスト関連スキーマ"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from app.models.enums import StrategyType


class StrategyConfig(BaseModel):
    """戦略設定"""
    strategyType: StrategyType
    betAmount: int = Field(default=100, ge=1, description="1レースあたりの購入金額")
    minOdds: Optional[float] = Field(default=1.0, ge=0.1, description="最小オッズ")
    maxOdds: Optional[float] = Field(default=100.0, le=1000.0, description="最大オッズ")


class BacktestRequest(BaseModel):
    """バックテストリクエスト"""
    fileId: str = Field(..., description="ファイルID")
    strategy: StrategyConfig = Field(..., description="戦略設定")


class BacktestSummaryResponse(BaseModel):
    """バックテスト結果サマリ"""
    totalRaces: int
    betRaces: int
    totalBets: int
    totalInvestment: float
    totalPayout: float
    totalProfit: float
    roi: float
    hitRate: float
    hitCount: int
    averageOdds: float
    winCount: int
    placeCount: int


class BetResultDetail(BaseModel):
    """購入結果詳細"""
    raceId: str
    競馬場: str
    開催年: int
    開催日: int
    レース番号: int
    距離: Optional[int]
    芝ダ区分: str
    馬番: int
    購入タイプ: str
    オッズ: float
    購入金額: int
    実際の着順: int
    的中: bool
    払戻金額: float
    利益: float
    

class RaceProfitData(BaseModel):
    """レースごとの収支データ"""
    raceNumber: int
    cumulativeProfit: float


class BacktestResultResponse(BaseModel):
    """バックテスト結果レスポンス"""
    summary: BacktestSummaryResponse
    details: List[BetResultDetail]
    strategy: StrategyConfig
    profitData: List[RaceProfitData]
