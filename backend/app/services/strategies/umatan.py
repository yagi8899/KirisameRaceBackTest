"""馬単戦略"""
from typing import List
import pandas as pd

from app.models.enums import StrategyType
from app.services.strategies.base import BaseStrategy, BetDecision


class UmatanStrategy(BaseStrategy):
    """馬単戦略（予測上位N頭の順列で馬単購入）"""
    
    def __init__(self, bet_amount: int = 100, top_n: int = 2, min_odds: float = 1.0, max_odds: float = 10000.0):
        """
        Args:
            bet_amount: 1レースあたりの購入金額
            top_n: 購入対象とする上位N頭（順列数: P(N,2)）
            min_odds: 最小オッズ（これ以下は購入しない）
            max_odds: 最大オッズ（これ以上は購入しない）
        """
        super().__init__(StrategyType.EXACTA, bet_amount)
        self.top_n = max(2, top_n)  # 最低2頭
        self.min_odds = min_odds
        self.max_odds = max_odds
    
    def should_bet(self, race_data: pd.DataFrame) -> bool:
        """購入すべきかを判定
        
        Args:
            race_data: 1レース分のデータ
            
        Returns:
            購入すべきならTrue
        """
        # 予測1位と2位の馬が存在するか
        pred_1st = race_data[race_data['予測順位'] == 1]
        pred_2nd = race_data[race_data['予測順位'] == 2]
        
        if len(pred_1st) == 0 or len(pred_2nd) == 0:
            return False
        
        # 馬単オッズをチェック（データに含まれている場合）
        if '馬単オッズ' in race_data.columns:
            umatan_odds = race_data['馬単オッズ'].iloc[0]
            if not pd.isna(umatan_odds):
                return self.min_odds <= umatan_odds <= self.max_odds
        
        # オッズ情報がない場合は常に購入
        return True
    
    def get_bet_decisions(self, race_data: pd.DataFrame) -> List[BetDecision]:
        """購入判断を取得
        
        Args:
            race_data: 1レース分のデータ
            
        Returns:
            購入判断のリスト
        """
        if not self.should_bet(race_data):
            return []
        
        # 予測順位1～topNに重複や欠損がないかチェック
        for rank in range(1, self.top_n + 1):
            pred_horses = race_data[race_data['予測順位'] == rank]
            if len(pred_horses) != 1:
                # 該当順位が0頭または2頭以上の場合はスキップ
                return []
        
        bet_decisions = []
        
        # 予測上位N頭を取得
        top_horses = []
        for rank in range(1, self.top_n + 1):
            pred_horse = race_data[race_data['予測順位'] == rank]
            if len(pred_horse) > 0:
                top_horses.append(pred_horse.iloc[0])
        
        if len(top_horses) < 2:
            return []
        
        # 全ての2頭順列で馬単を購入（1着→2着）
        from itertools import permutations
        for horse1, horse2 in permutations(top_horses, 2):
            win_odds_1 = horse1['単勝オッズ']
            win_odds_2 = horse2['単勝オッズ']
            
            if pd.isna(win_odds_1) or pd.isna(win_odds_2):
                continue
            
            # 馬単オッズを推定（単勝オッズの積の50%）
            umatan_odds = win_odds_1 * win_odds_2 * 0.5
            
            # オッズ範囲チェック
            if not (self.min_odds <= umatan_odds <= self.max_odds):
                continue
            
            h1 = int(horse1['馬番'])
            h2 = int(horse2['馬番'])
            
            bet_decision = BetDecision(
                race_id=self.get_race_id(race_data),
                horse_number=h1,
                bet_amount=self.bet_amount,
                bet_type="馬単",
                odds=float(umatan_odds),
                combinations=[h1, h2],
                additional_info={"horse1": h1, "horse2": h2}
            )
            bet_decisions.append(bet_decision)
        
        return bet_decisions
    
    def calculate_payout(self, bet_decision: BetDecision, race_data: pd.DataFrame) -> float:
        """払戻金額を計算
        
        Args:
            bet_decision: 購入判断
            race_data: 1レース分のデータ
            
        Returns:
            払戻金額
        """
        horse1 = bet_decision.additional_info.get("horse1")
        horse2 = bet_decision.additional_info.get("horse2")
        
        # 購入した2頭のデータを取得
        horse1_data = race_data[race_data['馬番'] == horse1]
        horse2_data = race_data[race_data['馬番'] == horse2]
        
        if len(horse1_data) == 0 or len(horse2_data) == 0:
            return 0.0
        
        rank1 = horse1_data['確定着順'].iloc[0]
        rank2 = horse2_data['確定着順'].iloc[0]
        
        # 1着と2着が完全に一致していれば的中
        if rank1 == 1 and rank2 == 2:
            # 実際の馬単オッズを使用
            if '馬単オッズ' in race_data.columns:
                actual_odds = race_data['馬単オッズ'].iloc[0]
                if not pd.isna(actual_odds):
                    return bet_decision.bet_amount * actual_odds
            
            # 実際のオッズが取得できない場合は推定オッズを使用
            return bet_decision.bet_amount * bet_decision.odds
        
        return 0.0
