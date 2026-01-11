"""計算関数"""
from typing import List, Dict, Any


def calculate_roi(total_return: float, total_investment: float) -> float:
    """回収率を計算
    
    Args:
        total_return: 総払戻金
        total_investment: 総投資額
        
    Returns:
        回収率（%）
    """
    if total_investment == 0:
        return 0.0
    return (total_return / total_investment) * 100


def calculate_hit_rate(hit_count: int, total_bets: int) -> float:
    """的中率を計算
    
    Args:
        hit_count: 的中回数
        total_bets: 総購入回数
        
    Returns:
        的中率（%）
    """
    if total_bets == 0:
        return 0.0
    return (hit_count / total_bets) * 100


def calculate_profit(total_return: float, total_investment: float) -> float:
    """収支を計算
    
    Args:
        total_return: 総払戻金
        total_investment: 総投資額
        
    Returns:
        収支
    """
    return total_return - total_investment


def calculate_average_return(total_return: float, hit_count: int) -> float:
    """平均払戻倍率を計算
    
    Args:
        total_return: 総払戻金
        hit_count: 的中回数
        
    Returns:
        平均払戻倍率
    """
    if hit_count == 0:
        return 0.0
    return total_return / hit_count
