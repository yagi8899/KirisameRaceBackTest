import { useState } from 'react';
import { Search, Loader2, Crown, CheckCircle2 } from 'lucide-react';

interface GridSearchPanelProps {
  fileId: string | null;
  strategyType: string;
  filters: any;
  onSearchComplete?: (bestParams: any) => void;
}

interface GridSearchResult {
  betAmount: number;
  topN: number;
  scoreThreshold: number;
  totalRaces: number;
  betRaces: number;
  totalBets: number;
  totalInvestment: number;
  totalPayout: number;
  totalProfit: number;
  roi: number;
  hitRate: number;
  hitCount: number;
}

interface GridSearchResponse {
  totalCombinations: number;
  results: GridSearchResult[];
  bestResult: GridSearchResult;
  strategyType: string;
}

const API_BASE_URL = 'http://localhost:8000';

export function GridSearchPanel({ fileId, strategyType, filters, onSearchComplete }: GridSearchPanelProps) {
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<GridSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // パラメータ範囲設定
  const [betAmounts, setBetAmounts] = useState<number[]>([100, 200, 500]);
  const [topNValues, setTopNValues] = useState<number[]>([1, 2, 3]);
  const [scoreThresholds, setScoreThresholds] = useState<number[]>([0.0, 0.3, 0.5, 0.7]);

  const handleGridSearch = async () => {
    if (!fileId) {
      setError('ファイルがアップロードされていません');
      return;
    }

    setSearching(true);
    setError(null);
    setSearchResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/backtest/grid-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId,
          strategyType,
          paramRanges: {
            betAmounts,
            topNValues,
            scoreThresholds,
          },
          filters: Object.keys(filters).length > 0 ? filters : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSearchResult(data.data);
        if (onSearchComplete && data.data.bestResult) {
          onSearchComplete({
            betAmount: data.data.bestResult.betAmount,
            topN: data.data.bestResult.topN,
            scoreThreshold: data.data.bestResult.scoreThreshold,
          });
        }
      } else {
        setError(data.error?.message || 'グリッドサーチに失敗しました');
      }
    } catch (err: any) {
      setError(err.message || 'グリッドサーチ実行中にエラーが発生しました');
    } finally {
      setSearching(false);
    }
  };

  const handleBetAmountsChange = (value: string) => {
    const amounts = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    setBetAmounts(amounts);
  };

  const handleTopNChange = (value: string) => {
    const values = value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    setTopNValues(values);
  };

  const handleScoreThresholdsChange = (value: string) => {
    const thresholds = value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    setScoreThresholds(thresholds);
  };

  const totalCombinations = betAmounts.length * topNValues.length * scoreThresholds.length;

  return (
    <div className="space-y-4">
      {/* パラメータ範囲設定 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            購入金額 (カンマ区切り)
          </label>
          <input
            type="text"
            value={betAmounts.join(', ')}
            onChange={(e) => handleBetAmountsChange(e.target.value)}
            placeholder="例: 100, 200, 500, 1000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            上位N頭 (カンマ区切り)
          </label>
          <input
            type="text"
            value={topNValues.join(', ')}
            onChange={(e) => handleTopNChange(e.target.value)}
            placeholder="例: 1, 2, 3, 4, 5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            スコア閾値 (カンマ区切り)
          </label>
          <input
            type="text"
            value={scoreThresholds.join(', ')}
            onChange={(e) => handleScoreThresholdsChange(e.target.value)}
            placeholder="例: 0.0, 0.3, 0.5, 0.7, 0.9"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-800">
            🔍 <strong>検証する組み合わせ数:</strong> {totalCombinations}通り
          </p>
        </div>
      </div>

      {/* 実行ボタン */}
      <button
        onClick={handleGridSearch}
        disabled={searching || !fileId || totalCombinations === 0}
        className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold
          hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed
          transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
      >
        {searching ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            グリッドサーチ実行中...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            グリッドサーチを実行
          </>
        )}
      </button>

      {/* エラー表示 */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* 結果表示 */}
      {searchResult && (
        <div className="mt-6 space-y-6">
          {/* 最良の結果 */}
          <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-400">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-yellow-600" />
              <h4 className="text-lg font-bold text-gray-900">🏆 最適パラメータ</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600">購入金額</p>
                <p className="text-xl font-bold text-blue-600">{searchResult.bestResult.betAmount}円</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">上位N頭</p>
                <p className="text-xl font-bold text-orange-600">{searchResult.bestResult.topN}頭</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">スコア閾値</p>
                <p className="text-xl font-bold text-purple-600">
                  {searchResult.bestResult.scoreThreshold.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">ROI</p>
                <p className="text-2xl font-bold text-green-600">
                  {searchResult.bestResult.roi.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-yellow-300">
              <div>
                <p className="text-xs text-gray-600">総収支</p>
                <p className={`text-lg font-bold ${searchResult.bestResult.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {searchResult.bestResult.totalProfit >= 0 ? '+' : ''}
                  {searchResult.bestResult.totalProfit.toLocaleString()}円
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">的中率</p>
                <p className="text-lg font-bold text-blue-600">
                  {searchResult.bestResult.hitRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">的中回数</p>
                <p className="text-lg font-bold text-indigo-600">
                  {searchResult.bestResult.hitCount}/{searchResult.bestResult.totalBets}
                </p>
              </div>
            </div>
          </div>

          {/* 全結果リスト */}
          <div>
            <h4 className="text-md font-bold text-gray-900 mb-3">
              📊 全結果 (ROI順)
            </h4>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {searchResult.results.slice(0, 10).map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all ${
                    index === 0
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {index === 0 && <Crown className="w-5 h-5 text-yellow-600" />}
                      {index < 3 && index > 0 && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-sm text-gray-700">
                        {result.betAmount}円 / 上位{result.topN}頭 / 閾値{result.scoreThreshold.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-lg font-bold ${result.roi >= 100 ? 'text-green-600' : result.roi >= 80 ? 'text-blue-600' : 'text-gray-600'}`}>
                        ROI {result.roi.toFixed(1)}%
                      </span>
                      <span className={`text-sm ${result.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {result.totalProfit >= 0 ? '+' : ''}{result.totalProfit.toLocaleString()}円
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-xs text-purple-800">
          💡 <strong>使い方:</strong> パラメータ範囲を設定して実行すると、すべての組み合わせを自動的に検証します。
          最もROIが高い組み合わせが最適パラメータとして表示されます。
        </p>
      </div>
    </div>
  );
}
