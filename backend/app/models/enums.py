"""列挙型定義"""
from enum import Enum


class StrategyType(str, Enum):
    """馬券戦略タイプ"""
    WIN = "WIN"          # 単勝
    PLACE = "PLACE"      # 複勝
    BRACKET = "BRACKET"  # 馬連
    WIDE = "WIDE"        # ワイド
    EXACTA = "EXACTA"    # 馬単
    TRIO = "TRIO"        # 3連複


class SurfaceType(str, Enum):
    """芝/ダート区分"""
    TURF = "芝"
    DIRT = "ダート"
