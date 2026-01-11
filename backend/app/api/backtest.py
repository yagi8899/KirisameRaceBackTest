"""バックテストAPI"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.schemas.common import ApiResponse, ErrorResponse, ErrorDetail
from app.schemas.backtest import (
    BacktestRequest,
    BacktestResultResponse,
    BacktestSummaryResponse,
    BetResultDetail,
    StrategyConfig,
    RaceProfitData,
)
from app.models.enums import StrategyType
from app.core.data_store import DataStore
from app.services.backtest_engine import BacktestEngine
from app.services.strategies.win import WinStrategy
from app.services.strategies.place import PlaceStrategy
from app.services.strategies.umaren import UmarenStrategy
from app.services.strategies.wide import WideStrategy
from app.services.strategies.umatan import UmatanStrategy
from app.services.strategies.trio import TrioStrategy

router = APIRouter(prefix="/api/backtest", tags=["Backtest"])


def create_strategy(strategy_config: StrategyConfig):
    """戦略インスタンスを作成
    
    Args:
        strategy_config: 戦略設定
        
    Returns:
        戦略インスタンス
    """
    if strategy_config.strategyType == StrategyType.WIN:
        return WinStrategy(
            bet_amount=strategy_config.betAmount,
            min_odds=strategy_config.minOdds or 1.0,
            max_odds=strategy_config.maxOdds or 100.0,
        )
    elif strategy_config.strategyType == StrategyType.PLACE:
        return PlaceStrategy(
            bet_amount=strategy_config.betAmount,
            min_odds=strategy_config.minOdds or 1.0,
            max_odds=strategy_config.maxOdds or 100.0,
        )
    elif strategy_config.strategyType == StrategyType.BRACKET:
        return UmarenStrategy(
            bet_amount=strategy_config.betAmount,
            min_odds=strategy_config.minOdds or 1.0,
            max_odds=strategy_config.maxOdds or 1000.0,
        )
    elif strategy_config.strategyType == StrategyType.WIDE:
        return WideStrategy(
            bet_amount=strategy_config.betAmount,
            min_odds=strategy_config.minOdds or 1.0,
            max_odds=strategy_config.maxOdds or 100.0,
        )
    elif strategy_config.strategyType == StrategyType.EXACTA:
        return UmatanStrategy(
            bet_amount=strategy_config.betAmount,
            min_odds=strategy_config.minOdds or 1.0,
            max_odds=strategy_config.maxOdds or 10000.0,
        )
    elif strategy_config.strategyType == StrategyType.TRIO:
        return TrioStrategy(
            bet_amount=strategy_config.betAmount,
            min_odds=strategy_config.minOdds or 1.0,
            max_odds=strategy_config.maxOdds or 10000.0,
        )
    else:
        raise ValueError(f"Unsupported strategy type: {strategy_config.strategyType}")


@router.post("", response_model=ApiResponse)
async def run_backtest(request: BacktestRequest):
    """
    バックテストを実行
    
    Args:
        request: バックテストリクエスト
        
    Returns:
        バックテスト結果
    """
    # データ取得
    data_store = DataStore.get_instance()
    df = data_store.get(request.fileId)
    
    if df is None:
        error_response = ErrorResponse(
            error=ErrorDetail(
                code="FILE_NOT_FOUND",
                message="指定されたファイルIDが見つかりません",
                details={"file_id": request.fileId}
            )
        )
        return JSONResponse(
            status_code=404,
            content=error_response.model_dump()
        )
    
    try:
        # 戦略作成
        strategy = create_strategy(request.strategy)
        
        # バックテスト実行
        engine = BacktestEngine(strategy)
        summary = engine.run(df)
        
        # 詳細結果取得
        results_df = engine.get_results_dataframe()
        
        # レスポンス作成
        summary_response = BacktestSummaryResponse(
            totalRaces=summary.total_races,
            betRaces=summary.bet_races,
            totalBets=summary.total_bets,
            totalInvestment=summary.total_investment,
            totalPayout=summary.total_payout,
            totalProfit=summary.total_profit,
            roi=summary.roi,
            hitRate=summary.hit_rate,
            hitCount=summary.hit_count,
            averageOdds=summary.average_odds,
            winCount=summary.win_count,
            placeCount=summary.place_count,
        )
        
        # 詳細データをリストに変換
        details = []
        cumulative_profit = 0.0
        profit_data = []
        race_counter = 0
        
        for _, row in results_df.iterrows():
            detail = BetResultDetail(
                raceId=row['race_id'],
                競馬場=row['競馬場'],
                開催年=int(row['開催年']),
                開催日=int(row['開催日']),
                レース番号=int(row['レース番号']),
                距離=int(row['距離']) if row['距離'] is not None else None,
                芝ダ区分=row['芝ダ区分'],
                馬番=int(row['馬番']),
                購入タイプ=row['購入タイプ'],
                オッズ=float(row['オッズ']),
                購入金額=int(row['購入金額']),
                実際の着順=int(row['実際の着順']),
                的中=bool(row['的中']),
                払戻金額=float(row['払戻金額']),
                利益=float(row['利益']),
            )
            details.append(detail)
            
            # 累積収支を計算
            race_counter += 1
            cumulative_profit += float(row['利益'])
            profit_data.append(RaceProfitData(
                raceNumber=race_counter,
                cumulativeProfit=cumulative_profit
            ))
        
        result_response = BacktestResultResponse(
            summary=summary_response,
            details=details,
            strategy=request.strategy,
            profitData=profit_data,
        )
        
        return ApiResponse(
            success=True,
            data=result_response.model_dump(),
            message="バックテストが完了しました"
        )
        
    except Exception as e:
        error_response = ErrorResponse(
            error=ErrorDetail(
                code="BACKTEST_ERROR",
                message=f"バックテスト実行中にエラーが発生しました: {str(e)}",
                details={"error": str(e)}
            )
        )
        return JSONResponse(
            status_code=500,
            content=error_response.model_dump()
        )
