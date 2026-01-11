"""レースデータモデル"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class RaceData:
    """レースデータ"""
    # 基本情報
    racecourse: str           # 競馬場
    year: int                 # 開催年
    date: str                 # 開催日 (YYYYMMDD形式の文字列)
    race_number: int          # レース番号
    surface: str              # 芝ダ区分
    distance: int             # 距離
    
    # 馬情報
    horse_number: int         # 馬番
    horse_name: str           # 馬名
    win_odds: float           # 単勝オッズ
    popularity: int           # 人気順
    final_rank: int           # 確定着順
    predicted_rank: int       # 予測順位
    predicted_score: float    # 予測スコア
    
    # 払戻情報
    place_1st_horse: Optional[int] = None      # 複勝1着馬番
    place_1st_odds: Optional[float] = None     # 複勝1着オッズ
    place_1st_popularity: Optional[int] = None # 複勝1着人気
    place_2nd_horse: Optional[int] = None
    place_2nd_odds: Optional[float] = None
    place_2nd_popularity: Optional[int] = None
    place_3rd_horse: Optional[int] = None
    place_3rd_odds: Optional[float] = None
    place_3rd_popularity: Optional[int] = None
    
    # 馬連情報
    bracket_horse1: Optional[int] = None
    bracket_horse2: Optional[int] = None
    bracket_odds: Optional[float] = None
    
    # ワイド情報
    wide_1_2_horse1: Optional[int] = None
    wide_1_2_horse2: Optional[int] = None
    wide_2_3_horse1: Optional[int] = None
    wide_2_3_horse2: Optional[int] = None
    wide_1_3_horse1: Optional[int] = None
    wide_1_3_horse2: Optional[int] = None
    wide_1_2_odds: Optional[float] = None
    wide_2_3_odds: Optional[float] = None
    wide_1_3_odds: Optional[float] = None
    
    # 馬単情報
    exacta_horse1: Optional[int] = None
    exacta_horse2: Optional[int] = None
    exacta_odds: Optional[float] = None
    
    # 3連複情報
    trio_odds: Optional[float] = None
