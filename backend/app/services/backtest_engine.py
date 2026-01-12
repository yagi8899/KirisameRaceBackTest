"""バックテストエンジン"""
from typing import List, Dict, Optional
from dataclasses import dataclass, asdict
import pandas as pd

from app.services.strategies.base import BaseStrategy, BetResult
from app.utils.calculations import calculate_roi, calculate_hit_rate
from app.schemas.backtest import RaceFilter


@dataclass
class BacktestSummary:
    """バックテスト結果サマリ"""
    total_races: int  # 総レース数
    bet_races: int  # 購入したレース数
    total_bets: int  # 総購入数
    total_investment: float  # 総投資額
    total_payout: float  # 総払戻額
    total_profit: float  # 総利益
    roi: float  # ROI（投資利益率）
    hit_rate: float  # 的中率
    hit_count: int  # 的中数
    average_odds: float  # 平均オッズ
    win_count: int  # 1着的中数
    place_count: int  # 3着以内的中数


@dataclass
class RaceResult:
    """レース結果"""
    race_id: str
    race_info: Dict  # レース情報（競馬場、日付など）
    bet_results: List[BetResult]  # 購入結果のリスト
    race_investment: float  # このレースの投資額
    race_payout: float  # このレースの払戻額
    race_profit: float  # このレースの利益


class BacktestEngine:
    """バックテストエンジン"""
    
    def __init__(self, strategy: BaseStrategy):
        """
        Args:
            strategy: 使用する戦略
        """
        self.strategy = strategy
        self.race_results: List[RaceResult] = []
    
    def run(self, df: pd.DataFrame, filters: Optional[RaceFilter] = None) -> BacktestSummary:
        """バックテストを実行
        
        Args:
            df: 全データのDataFrame
            filters: レースフィルタ設定 (オプション)
            
        Returns:
            バックテスト結果サマリ
        """
        self.race_results = []
        
        # フィルタを適用
        if filters:
            df = self._apply_filters(df, filters)
        
        # レースごとにグループ化
        race_groups = df.groupby(['競馬場', '開催年', '開催日', 'レース番号'])
        
        for race_key, race_data in race_groups:
            self._process_race(race_data)
        
        return self._calculate_summary()
    
    def _process_race(self, race_data: pd.DataFrame):
        """1レースを処理
        
        Args:
            race_data: 1レース分のデータ
        """
        # 購入判断を取得
        bet_decisions = self.strategy.get_bet_decisions(race_data)
        
        if not bet_decisions:
            return
        
        # 各購入を評価
        bet_results = []
        race_investment = 0
        race_payout = 0
        
        for bet_decision in bet_decisions:
            bet_result = self.strategy.evaluate_bet(bet_decision, race_data)
            bet_results.append(bet_result)
            race_investment += bet_decision.bet_amount
            race_payout += bet_result.payout
        
        race_profit = race_payout - race_investment
        
        # レース情報を抽出
        first_row = race_data.iloc[0]
        race_info = {
            "競馬場": first_row['競馬場'],
            "開催年": int(first_row['開催年']),
            "開催日": int(first_row['開催日']),
            "レース番号": int(first_row['レース番号']),
            "距離": int(first_row['距離']) if pd.notna(first_row['距離']) else None,
            "芝ダ区分": first_row['芝ダ区分'],
        }
        
        race_result = RaceResult(
            race_id=self.strategy.get_race_id(race_data),
            race_info=race_info,
            bet_results=bet_results,
            race_investment=race_investment,
            race_payout=race_payout,
            race_profit=race_profit
        )
        
        self.race_results.append(race_result)
    
    def _calculate_summary(self) -> BacktestSummary:
        """サマリを計算
        
        Returns:
            バックテスト結果サマリ
        """
        if not self.race_results:
            return BacktestSummary(
                total_races=0,
                bet_races=0,
                total_bets=0,
                total_investment=0,
                total_payout=0,
                total_profit=0,
                roi=0,
                hit_rate=0,
                hit_count=0,
                average_odds=0,
                win_count=0,
                place_count=0
            )
        
        # 全購入結果を集計
        all_bet_results = [
            bet_result
            for race_result in self.race_results
            for bet_result in race_result.bet_results
        ]
        
        total_bets = len(all_bet_results)
        total_investment = sum(br.bet_decision.bet_amount for br in all_bet_results)
        total_payout = sum(br.payout for br in all_bet_results)
        total_profit = total_payout - total_investment
        
        hit_count = sum(1 for br in all_bet_results if br.is_hit)
        hit_rate = calculate_hit_rate(hit_count, total_bets)
        roi = calculate_roi(total_profit, total_investment)
        
        average_odds = sum(br.bet_decision.odds for br in all_bet_results) / total_bets if total_bets > 0 else 0
        
        win_count = sum(1 for br in all_bet_results if br.actual_rank == 1)
        place_count = sum(1 for br in all_bet_results if br.actual_rank <= 3)
        
        return BacktestSummary(
            total_races=len(self.race_results),
            bet_races=len(self.race_results),
            total_bets=total_bets,
            total_investment=total_investment,
            total_payout=total_payout,
            total_profit=total_profit,
            roi=roi,
            hit_rate=hit_rate,
            hit_count=hit_count,
            average_odds=round(average_odds, 2),
            win_count=win_count,
            place_count=place_count
        )
    
    def _apply_filters(self, df: pd.DataFrame, filters: RaceFilter) -> pd.DataFrame:
        """レースフィルタを適用
        
        Args:
            df: 全データのDataFrame
            filters: レースフィルタ設定
            
        Returns:
            フィルタ適用後のDataFrame
        """
        filtered_df = df.copy()
        
        # 競馬場フィルタ
        if filters.racecourses and len(filters.racecourses) > 0:
            filtered_df = filtered_df[filtered_df['競馬場'].isin(filters.racecourses)]
        
        # 馬場タイプフィルタ
        if filters.surfaces and len(filters.surfaces) > 0:
            filtered_df = filtered_df[filtered_df['芝ダ区分'].isin(filters.surfaces)]
        
        # 距離範囲フィルタ
        if filters.distanceMin is not None:
            filtered_df = filtered_df[filtered_df['距離'] >= filters.distanceMin]
        if filters.distanceMax is not None:
            filtered_df = filtered_df[filtered_df['距離'] <= filters.distanceMax]
        
        # 日付範囲フィルタ
        if filters.dateFrom is not None:
            date_from = int(filters.dateFrom)
            filtered_df = filtered_df[filtered_df['開催日'] >= date_from]
        if filters.dateTo is not None:
            date_to = int(filters.dateTo)
            filtered_df = filtered_df[filtered_df['開催日'] <= date_to]
        
        # オッズ範囲フィルタ (単勝オッズで判定)
        if filters.oddsMin is not None:
            filtered_df = filtered_df[filtered_df['単勝オッズ'] >= filters.oddsMin]
        if filters.oddsMax is not None:
            filtered_df = filtered_df[filtered_df['単勝オッズ'] <= filters.oddsMax]
        
        return filtered_df
    
    def get_results_dataframe(self) -> pd.DataFrame:
        """レース結果をDataFrameとして取得
        
        Returns:
            レース結果のDataFrame
        """
        rows = []
        for race_result in self.race_results:
            for bet_result in race_result.bet_results:
                row = {
                    "race_id": race_result.race_id,
                    "競馬場": race_result.race_info["競馬場"],
                    "開催年": race_result.race_info["開催年"],
                    "開催日": race_result.race_info["開催日"],
                    "レース番号": race_result.race_info["レース番号"],
                    "距離": race_result.race_info["距離"],
                    "芝ダ区分": race_result.race_info["芝ダ区分"],
                    "馬番": bet_result.bet_decision.horse_number,
                    "購入タイプ": bet_result.bet_decision.bet_type,
                    "オッズ": bet_result.bet_decision.odds,
                    "購入金額": bet_result.bet_decision.bet_amount,
                    "実際の着順": bet_result.actual_rank,
                    "的中": bet_result.is_hit,
                    "払戻金額": bet_result.payout,
                    "利益": bet_result.profit,
                }
                rows.append(row)
        
        return pd.DataFrame(rows)
