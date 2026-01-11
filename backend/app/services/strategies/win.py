"""単勝戦略"""
from typing import List
import pandas as pd

from app.models.enums import StrategyType
from app.services.strategies.base import BaseStrategy, BetDecision


class WinStrategy(BaseStrategy):
    """単勝戦略（予測1位の馬に単勝購入）"""
    
    def __init__(self, bet_amount: int = 100, min_odds: float = 1.0, max_odds: float = 100.0):
        """
        Args:
            bet_amount: 1レースあたりの購入金額
            min_odds: 最小オッズ（これ以下は購入しない）
            max_odds: 最大オッズ（これ以上は購入しない）
        """
        super().__init__(StrategyType.WIN, bet_amount)
        self.min_odds = min_odds
        self.max_odds = max_odds
    
    def should_bet(self, race_data: pd.DataFrame) -> bool:
        """購入すべきかを判定
        
        Args:
            race_data: 1レース分のデータ
            
        Returns:
            購入すべきならTrue
        """
        # 予測1位の馬が存在するか
        pred_1st = race_data[race_data['予測順位'] == 1]
        if len(pred_1st) == 0:
            return False
        
        # オッズが範囲内か
        odds = pred_1st['単勝オッズ'].iloc[0]
        if pd.isna(odds):
            return False
        
        return self.min_odds <= odds <= self.max_odds
    
    def get_bet_decisions(self, race_data: pd.DataFrame) -> List[BetDecision]:
        """購入判断を取得
        
        Args:
            race_data: 1レース分のデータ
            
        Returns:
            購入判断のリスト
        """
        if not self.should_bet(race_data):
            return []
        
        # 予測1位の馬を取得
        pred_1st = race_data[race_data['予測順位'] == 1].iloc[0]
        
        bet_decision = BetDecision(
            race_id=self.get_race_id(race_data),
            horse_number=int(pred_1st['馬番']),
            bet_amount=self.bet_amount,
            bet_type="単勝",
            odds=float(pred_1st['単勝オッズ'])
        )
        
        return [bet_decision]
    
    def calculate_payout(self, bet_decision: BetDecision, race_data: pd.DataFrame) -> float:
        """払戻金額を計算
        
        Args:
            bet_decision: 購入判断
            race_data: 1レース分のデータ
            
        Returns:
            払戻金額
        """
        # 購入した馬のデータを取得
        horse_data = race_data[race_data['馬番'] == bet_decision.horse_number]
        if len(horse_data) == 0:
            return 0.0
        
        actual_rank = horse_data['確定着順'].iloc[0]
        
        # 単勝は1着のみ的中
        if actual_rank == 1:
            return bet_decision.bet_amount * bet_decision.odds
        
        return 0.0
