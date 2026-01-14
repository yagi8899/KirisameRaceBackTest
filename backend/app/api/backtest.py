"""バックテストAPI"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import itertools

from app.schemas.common import ApiResponse, ErrorResponse, ErrorDetail
from app.schemas.backtest import (
    BacktestRequest,
    BacktestResultResponse,
    BacktestSummaryResponse,
    BetResultDetail,
    StrategyConfig,
    RaceProfitData,
)
from app.schemas.grid_search import (
    GridSearchRequest,
    GridSearchResponse,
    GridSearchResultItem,
)
from app.schemas.strategy_comparison import (
    ComparisonRequest,
    ComparisonResponse,
    ComparisonResultItem,
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
            top_n=strategy_config.topN,
            min_odds=strategy_config.minOdds or 1.0,
            max_odds=strategy_config.maxOdds or 100.0,
        )
    elif strategy_config.strategyType == StrategyType.PLACE:
        return PlaceStrategy(
            bet_amount=strategy_config.betAmount,
            top_n=strategy_config.topN,
            min_odds=strategy_config.minOdds or 1.0,
            max_odds=strategy_config.maxOdds or 100.0,
        )
    elif strategy_config.strategyType == StrategyType.BRACKET:
        return UmarenStrategy(
            bet_amount=strategy_config.betAmount,
            top_n=strategy_config.topN,
            min_odds=strategy_config.minOdds or 1.0,
            max_odds=strategy_config.maxOdds or 1000.0,
        )
    elif strategy_config.strategyType == StrategyType.WIDE:
        return WideStrategy(
            bet_amount=strategy_config.betAmount,
            top_n=strategy_config.topN,
            min_odds=strategy_config.minOdds or 1.0,
            max_odds=strategy_config.maxOdds or 100.0,
        )
    elif strategy_config.strategyType == StrategyType.EXACTA:
        return UmatanStrategy(
            bet_amount=strategy_config.betAmount,
            top_n=strategy_config.topN,
            min_odds=strategy_config.minOdds or 1.0,
            max_odds=strategy_config.maxOdds or 10000.0,
        )
    elif strategy_config.strategyType == StrategyType.TRIO:
        return TrioStrategy(
            bet_amount=strategy_config.betAmount,
            top_n=strategy_config.topN,
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
        
        # バックテスト実行 (フィルタを適用)
        engine = BacktestEngine(strategy)
        filters = request.strategy.filters if hasattr(request.strategy, 'filters') else None
        summary = engine.run(df, filters=filters)
        
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


@router.post("/grid-search", response_model=ApiResponse)
async def run_grid_search(request: GridSearchRequest):
    """
    グリッドサーチを実行
    
    複数のパラメータ組み合わせで自動的にバックテストを実行し、
    最適なパラメータを発見します。
    
    Args:
        request: グリッドサーチリクエスト
        
    Returns:
        グリッドサーチ結果 (ROI降順)
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
        # パラメータ範囲からすべての組み合わせを生成
        bet_amounts = request.paramRanges.betAmounts or [100]
        top_n_values = request.paramRanges.topNValues or [1]
        score_thresholds = request.paramRanges.scoreThresholds or [0.0]
        
        combinations = list(itertools.product(bet_amounts, top_n_values, score_thresholds))
        total_combinations = len(combinations)
        
        results: List[GridSearchResultItem] = []
        
        # 各組み合わせでバックテストを実行
        for bet_amount, top_n, score_threshold in combinations:
            # 戦略設定を作成
            strategy_config = StrategyConfig(
                strategyType=request.strategyType,
                betAmount=bet_amount,
                topN=top_n,
                scoreThreshold=score_threshold,
                minOdds=1.0,
                maxOdds=100.0,
                filters=request.filters,
            )
            
            # 戦略作成
            strategy = create_strategy(strategy_config)
            
            # バックテスト実行
            engine = BacktestEngine(strategy)
            summary = engine.run(df, filters=request.filters)
            
            # 結果を追加
            result_item = GridSearchResultItem(
                betAmount=bet_amount,
                topN=top_n,
                scoreThreshold=score_threshold,
                totalRaces=summary.total_races,
                betRaces=summary.bet_races,
                totalBets=summary.total_bets,
                totalInvestment=summary.total_investment,
                totalPayout=summary.total_payout,
                totalProfit=summary.total_profit,
                roi=summary.roi,
                hitRate=summary.hit_rate,
                hitCount=summary.hit_count,
            )
            results.append(result_item)
        
        # ROI降順でソート
        results.sort(key=lambda x: x.roi, reverse=True)
        
        # 最良の結果を取得
        best_result = results[0] if results else None
        
        if not best_result:
            raise ValueError("グリッドサーチの結果が得られませんでした")
        
        # レスポンス作成
        grid_search_response = GridSearchResponse(
            totalCombinations=total_combinations,
            results=results,
            bestResult=best_result,
            strategyType=request.strategyType,
        )
        
        return ApiResponse(
            success=True,
            data=grid_search_response.model_dump(),
            message=f"グリッドサーチが完了しました ({total_combinations}通りの組み合わせを検証)"
        )
        
    except Exception as e:
        error_response = ErrorResponse(
            error=ErrorDetail(
                code="GRID_SEARCH_ERROR",
                message=f"グリッドサーチ実行中にエラーが発生しました: {str(e)}",
                details={"error": str(e)}
            )
        )
        return JSONResponse(
            status_code=500,
            content=error_response.model_dump()
        )


@router.post("/compare", response_model=ApiResponse)
async def compare_strategies(request: ComparisonRequest):
    """複数の戦略を同時にバックテストして比較する
    
    Args:
        request: 比較リクエスト（複数の戦略設定を含む）
        
    Returns:
        各戦略の結果と最良の戦略
    """
    try:
        data_store = DataStore.get_instance()
        
        # データファイルの読み込み
        data = data_store.get(request.dataFile)
        
        if data is None or data.empty:
            raise ValueError(f"データファイル {request.dataFile} が見つからないか空です")
        
        # 各戦略でバックテストを実行
        comparison_results: List[ComparisonResultItem] = []
        
        for strategy_config in request.strategies:
            # 戦略インスタンスを作成
            strategy = create_strategy(strategy_config)
            
            # バックテストエンジンを初期化
            engine = BacktestEngine(strategy=strategy)
            
            # バックテストを実行 (フィルタも渡す)
            summary = engine.run(
                df=data,
                filters=strategy_config.filters,
            )
            
            # 結果をまとめる
            comparison_item = ComparisonResultItem(
                strategyName=strategy_config.strategyName or strategy_config.strategyType.value,
                totalRaces=summary.total_races,
                totalBets=summary.total_bets,
                hits=summary.hit_count,
                hitRate=summary.hit_rate,
                totalInvestment=int(summary.total_investment),
                totalReturn=int(summary.total_payout),
                totalProfit=int(summary.total_profit),
                roi=summary.roi,
                averageOdds=summary.average_odds,
                maxDrawdown=0,  # TODO: maxDrawdown計算機能を実装する
            )
            print(f"[DEBUG] ComparisonResultItem created")
            comparison_results.append(comparison_item)
        
        # ROIでソート（降順）
        comparison_results.sort(key=lambda x: x.roi, reverse=True)
        の戦略を取得
        best_strategy = comparison_results[0] if comparison_results else None
        
        if not best_strategy:
            raise ValueError("比較結果が得られませんでした")
        
        # レスポンス作成
        comparison_response = ComparisonResponse(
            results=comparison_results,
            bestStrategy=best_strategy,
        )
        
        return ApiResponse(
            success=True,
            data=comparison_response.model_dump(),
            message=f"{len(request.strategies)}つの戦略を比較しました"
        )
        
    except Exception as e:
        error_response = ErrorResponse(
            error=ErrorDetail(
                code="COMPARISON_ERROR",
                message=f"戦略比較中にエラーが発生しました: {str(e)}",
                details={"error": str(e)}
            )
        )
        return JSONResponse(
            status_code=500,
            content=error_response.model_dump()
        )

