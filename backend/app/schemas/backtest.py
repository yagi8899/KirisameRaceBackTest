"""バックテスト関連スキーマ"""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from app.models.enums import StrategyType


class RaceFilter(BaseModel):
    """レースフィルタ設定"""
    racecourses: Optional[List[str]] = Field(default=None, description="競馬場リスト")
    surfaces: Optional[List[str]] = Field(default=None, description="馬場タイプ (芝/ダート)")
    distanceMin: Optional[int] = Field(default=None, ge=1000, le=3600, description="最小距離")
    distanceMax: Optional[int] = Field(default=None, ge=1000, le=3600, description="最大距離")
    dateFrom: Optional[str] = Field(default=None, description="開始日 (YYYYMMDD)")
    dateTo: Optional[str] = Field(default=None, description="終了日 (YYYYMMDD)")
    oddsMin: Optional[float] = Field(default=None, ge=1.0, description="最小オッズ")
    oddsMax: Optional[float] = Field(default=None, le=1000.0, description="最大オッズ")


class StrategyConfig(BaseModel):
    """戦略設定"""
    strategyType: StrategyType
    strategyName: Optional[str] = Field(default=None, description="戦略の名前 (比較用)")
    betAmount: int = Field(default=100, ge=1, le=100000, description="1レースあたりの購入金額")
    betAmountMin: Optional[int] = Field(default=None, ge=1, le=100000, description="最小購入金額 (グリッドサーチ用)")
    betAmountMax: Optional[int] = Field(default=None, ge=1, le=100000, description="最大購入金額 (グリッドサーチ用)")
    topN: int = Field(default=1, ge=1, le=10, description="上位N頭まで購入")
    scoreThreshold: float = Field(default=0.0, ge=0.0, le=1.0, description="予測スコア閾値")
    pivotHorse: Optional[int] = Field(default=None, ge=1, le=18, description="軸馬の馬番 (馬単・3連複用)")
    minOdds: Optional[float] = Field(default=1.0, ge=0.1, description="最小オッズ (非推奨: filtersを使用)")
    maxOdds: Optional[float] = Field(default=100.0, le=1000.0, description="最大オッズ (非推奨: filtersを使用)")
    filters: Optional[RaceFilter] = Field(default=None, description="レースフィルタ")


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
