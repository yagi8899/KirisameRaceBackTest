"""ベース戦略クラス"""
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List, Dict, Optional
import pandas as pd

from app.models.enums import StrategyType


@dataclass
class BetDecision:
    """購入判断"""
    race_id: str  # レース識別子（競馬場_年_日_レース番号）
    horse_number: int  # 馬番
    bet_amount: int  # 購入金額
    bet_type: str  # 購入タイプ（単勝、複勝など）
    odds: float  # オッズ
    combinations: Optional[List[int]] = None  # 馬連・3連複などの組み合わせ
    additional_info: Optional[Dict] = None  # 追加情報（複数馬番など）


@dataclass
class BetResult:
    """購入結果"""
    bet_decision: BetDecision
    is_hit: bool  # 的中したか
    payout: float  # 払戻金額
    profit: float  # 利益（払戻 - 購入金額）
    actual_rank: int  # 実際の着順


class BaseStrategy(ABC):
    """戦略のベースクラス"""
    
    def __init__(self, strategy_type: StrategyType, bet_amount: int = 100):
        """
        Args:
            strategy_type: 戦略タイプ
            bet_amount: 1レースあたりの購入金額
        """
        self.strategy_type = strategy_type
        self.bet_amount = bet_amount
    
    @abstractmethod
    def should_bet(self, race_data: pd.DataFrame) -> bool:
        """購入すべきかを判定
        
        Args:
            race_data: 1レース分のデータ（複数頭）
            
        Returns:
            購入すべきならTrue
        """
        pass
    
    @abstractmethod
    def get_bet_decisions(self, race_data: pd.DataFrame) -> List[BetDecision]:
        """購入判断を取得
        
        Args:
            race_data: 1レース分のデータ（複数頭）
            
        Returns:
            購入判断のリスト
        """
        pass
    
    @abstractmethod
    def calculate_payout(self, bet_decision: BetDecision, race_data: pd.DataFrame) -> float:
        """払戻金額を計算
        
        Args:
            bet_decision: 購入判断
            race_data: 1レース分のデータ（実際の着順含む）
            
        Returns:
            払戻金額
        """
        pass
    
    def evaluate_bet(self, bet_decision: BetDecision, race_data: pd.DataFrame) -> BetResult:
        """購入結果を評価
        
        Args:
            bet_decision: 購入判断
            race_data: 1レース分のデータ（実際の着順含む）
            
        Returns:
            購入結果
        """
        payout = self.calculate_payout(bet_decision, race_data)
        is_hit = payout > 0
        profit = payout - bet_decision.bet_amount
        
        # 実際の着順を取得
        horse_data = race_data[race_data['馬番'] == bet_decision.horse_number]
        actual_rank = horse_data['確定着順'].iloc[0] if len(horse_data) > 0 else 99
        
        return BetResult(
            bet_decision=bet_decision,
            is_hit=is_hit,
            payout=payout,
            profit=profit,
            actual_rank=int(actual_rank)
        )
    
    def get_race_id(self, race_data: pd.DataFrame) -> str:
        """レースIDを生成
        
        Args:
            race_data: 1レース分のデータ
            
        Returns:
            レースID
        """
        first_row = race_data.iloc[0]
        return f"{first_row['競馬場']}_{first_row['開催年']}_{first_row['開催日']}_{first_row['レース番号']}"
