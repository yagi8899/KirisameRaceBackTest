import { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ComparisonResultItem {
  strategyName: string;
  totalRaces: number;
  totalBets: number;
  hits: number;
  hitRate: number;
  totalInvestment: number;
  totalReturn: number;
  totalProfit: number;
  roi: number;
  averageOdds: number;
  maxDrawdown: number;
}

interface ComparisonViewProps {
  onCompare: (strategies: any[]) => void;
  comparisonResults: ComparisonResultItem[] | null;
  isComparing: boolean;
}

export default function ComparisonView({ onCompare, comparisonResults, isComparing }: ComparisonViewProps) {
  const [strategies, setStrategies] = useState([
    { 
      strategyName: '単勝戦略A',
      strategyType: 'WIN',
      betAmount: 100,
      topN: 1,
      scoreThreshold: 0.0,
    },
    { 
      strategyName: '単勝戦略B',
      strategyType: 'WIN',
      betAmount: 200,
      topN: 2,
      scoreThreshold: 0.3,
    },
  ]);

  const addStrategy = () => {
    setStrategies([
      ...strategies,
      {
        strategyName: `戦略${strategies.length + 1}`,
        strategyType: 'WIN',
        betAmount: 100,
        topN: 1,
        scoreThreshold: 0.0,
      },
    ]);
  };

  const removeStrategy = (index: number) => {
    setStrategies(strategies.filter((_, i) => i !== index));
  };

  const updateStrategy = (index: number, field: string, value: any) => {
    const newStrategies = [...strategies];
    newStrategies[index] = { ...newStrategies[index], [field]: value };
    setStrategies(newStrategies);
  };

  const handleCompare = () => {
    onCompare(strategies);
  };

  // レーダーチャート用データの作成
  const radarData = comparisonResults
    ? [
        {
          metric: 'ROI',
          ...Object.fromEntries(
            comparisonResults.map(r => [
              r.strategyName,
              Math.max(0, Math.min(200, r.roi)), // 0-200%にクリップ
            ])
          ),
        },
        {
          metric: '的中率',
          ...Object.fromEntries(
            comparisonResults.map(r => [r.strategyName, r.hitRate])
          ),
        },
        {
          metric: '購入数',
          ...Object.fromEntries(
            comparisonResults.map(r => [
              r.strategyName,
              (r.totalBets / Math.max(...comparisonResults.map(x => x.totalBets))) * 100,
            ])
          ),
        },
        {
          metric: '平均オッズ',
          ...Object.fromEntries(
            comparisonResults.map(r => [
              r.strategyName,
              Math.min(100, (r.averageOdds / 10) * 100), // 10倍オッズを100として正規化
            ])
          ),
        },
        {
          metric: '総利益',
          ...Object.fromEntries(
            comparisonResults.map(r => [
              r.strategyName,
              (r.totalProfit / Math.max(...comparisonResults.map(x => Math.abs(x.totalProfit)))) * 100,
            ])
          ),
        },
      ]
    : [];

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* 戦略設定リスト */}
      <div className="space-y-4">
        {strategies.map((strategy, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={strategy.strategyName}
                onChange={(e) => updateStrategy(index, 'strategyName', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded font-semibold"
              />
              <button
                onClick={() => removeStrategy(index)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                disabled={strategies.length <= 1}
              >
                削除
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">戦略タイプ</label>
                <select
                  value={strategy.strategyType}
                  onChange={(e) => updateStrategy(index, 'strategyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="win">単勝</option>
                  <option value="place">複勝</option>
                  <option value="bracket">馬連</option>
                  <option value="wide">ワイド</option>
                  <option value="exacta">馬単</option>
                  <option value="trio">3連複</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">購入額</label>
                <input
                  type="number"
                  value={strategy.betAmount}
                  onChange={(e) => updateStrategy(index, 'betAmount', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  min="100"
                  max="10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">上位N頭</label>
                <input
                  type="number"
                  value={strategy.topN}
                  onChange={(e) => updateStrategy(index, 'topN', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">スコア閾値</label>
                <input
                  type="number"
                  value={strategy.scoreThreshold}
                  onChange={(e) => updateStrategy(index, 'scoreThreshold', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  min="0"
                  max="1"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={addStrategy}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ 戦略追加
        </button>
        <button
          onClick={handleCompare}
          disabled={isComparing || strategies.length === 0}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {isComparing ? '比較中...' : '🔍 比較実行'}
        </button>
      </div>

      {/* 比較結果 */}
      {comparisonResults && comparisonResults.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4">📊 比較結果</h4>

          {/* レーダーチャート */}
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                {comparisonResults.map((result, index) => (
                  <Radar
                    key={result.strategyName}
                    name={result.strategyName}
                    dataKey={result.strategyName}
                    stroke={colors[index % colors.length]}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.3}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 詳細テーブル */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">戦略名</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">総レース</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">購入数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">的中</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">的中率</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">投資額</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">払戻額</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">総利益</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">平均オッズ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comparisonResults.map((result, index) => (
                  <tr 
                    key={result.strategyName} 
                    className={index === 0 ? 'bg-yellow-50 font-semibold' : ''}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {index === 0 && '👑 '}
                      {result.strategyName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{result.totalRaces}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{result.totalBets}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{result.hits}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{result.hitRate.toFixed(1)}%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">¥{result.totalInvestment.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">¥{result.totalReturn.toLocaleString()}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${result.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.totalProfit >= 0 ? '+' : ''}¥{result.totalProfit.toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${result.roi >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.roi.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{result.averageOdds.toFixed(1)}倍</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ベスト戦略のハイライト */}
          {comparisonResults[0] && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg">
              <h5 className="text-lg font-bold mb-2 flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                最優秀戦略: {comparisonResults[0].strategyName}
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ROI:</span>
                  <span className={`ml-2 font-bold ${comparisonResults[0].roi >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {comparisonResults[0].roi.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">的中率:</span>
                  <span className="ml-2 font-bold text-blue-600">
                    {comparisonResults[0].hitRate.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">総利益:</span>
                  <span className={`ml-2 font-bold ${comparisonResults[0].totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {comparisonResults[0].totalProfit >= 0 ? '+' : ''}¥{comparisonResults[0].totalProfit.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">平均オッズ:</span>
                  <span className="ml-2 font-bold text-purple-600">
                    {comparisonResults[0].averageOdds.toFixed(1)}倍
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
