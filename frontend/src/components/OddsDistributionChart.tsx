import { useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface OddsDistributionChartProps {
  details: any[];
}

type ViewMode = 'all' | 'year';

export function OddsDistributionChart({ details }: OddsDistributionChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  
  // 的中したレースのオッズ分布を計算
  const hitDetails = details.filter(d => d.的中);

  // オッズを範囲別に集計
  const getOddsDistribution = () => {
    const ranges = [
      { label: '1.0-2.0', min: 1.0, max: 2.0 },
      { label: '2.0-3.0', min: 2.0, max: 3.0 },
      { label: '3.0-5.0', min: 3.0, max: 5.0 },
      { label: '5.0-10.0', min: 5.0, max: 10.0 },
      { label: '10.0-20.0', min: 10.0, max: 20.0 },
      { label: '20.0-50.0', min: 20.0, max: 50.0 },
      { label: '50.0+', min: 50.0, max: Infinity },
    ];

    const distribution = ranges.map(range => {
      const count = hitDetails.filter(
        d => d.オッズ >= range.min && d.オッズ < range.max
      ).length;
      
      const totalPayout = hitDetails
        .filter(d => d.オッズ >= range.min && d.オッズ < range.max)
        .reduce((sum, d) => sum + d.払戻金額, 0);

      return {
        name: range.label,
        count,
        totalPayout,
        percentage: hitDetails.length > 0 ? (count / hitDetails.length) * 100 : 0,
      };
    });

    return distribution;
  };

  // 年度別のオッズ分布を計算
  const getYearlyOddsDistribution = () => {
    const yearlyData: Record<string, any> = {};
    
    hitDetails.forEach((detail) => {
      const year = detail.開催年;
      if (!yearlyData[year]) {
        yearlyData[year] = {
          totalHits: 0,
          totalPayout: 0,
          avgOdds: 0,
          oddsSum: 0,
        };
      }
      yearlyData[year].totalHits++;
      yearlyData[year].totalPayout += detail.払戻金額;
      yearlyData[year].oddsSum += detail.オッズ;
    });

    return Object.entries(yearlyData)
      .map(([year, data]) => ({
        name: `${year}年`,
        totalHits: data.totalHits,
        totalPayout: data.totalPayout,
        avgOdds: data.oddsSum / data.totalHits,
      }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  };

  const chartData = viewMode === 'all' ? getOddsDistribution() : getYearlyOddsDistribution();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-bold text-gray-900">的中オッズ分布</h3>
        </div>
        
        {/* タブ切り替え */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            オッズ帯別
          </button>
          <button
            onClick={() => setViewMode('year')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'year'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            年度別
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {viewMode === 'all' ? (
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            label={{ value: 'オッズ範囲', position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          {/* 左軸: 的中回数 */}
          <YAxis
            yAxisId="left"
            label={{ value: '的中回数', angle: -90, position: 'insideLeft' }}
            stroke="#ef4444"
          />
          {/* 右軸: 総払戻額 */}
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: '総払戻額 (円)', angle: 90, position: 'insideRight' }}
            stroke="#f59e0b"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            formatter={(value, name, props: any) => {
              if (name === 'count' || name === '的中回数') {
                return [
                  `${value || 0}回 (${(props.payload.percentage || 0).toFixed(1)}%)`,
                  '的中回数',
                ];
              }
              if (name === 'totalPayout' || name === '総払戻額') {
                return [`${(value || 0).toLocaleString()}円`, '総払戻額'];
              }
              return [value, name];
            }}
          />
          <Legend />
          {/* 棒グラフ: 的中回数 (左軸) */}
          <Bar
            yAxisId="left"
            dataKey="count"
            fill="#ef4444"
            name="的中回数"
            radius={[8, 8, 0, 0]}
          />
          {/* 折れ線グラフ: 総払戻額 (右軸) */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="totalPayout"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="総払戻額"
          />
        </ComposedChart>
        ) : (
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            label={{ value: '年度', position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
          />
          {/* 左軸: 的中回数 */}
          <YAxis
            yAxisId="left"
            label={{ value: '的中回数', angle: -90, position: 'insideLeft' }}
            stroke="#ef4444"
          />
          {/* 右軸: 平均オッズ */}
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: '平均オッズ', angle: 90, position: 'insideRight' }}
            stroke="#3b82f6"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            formatter={(value, name) => {
              if (name === 'totalHits' || name === '的中回数') {
                return [`${value || 0}回`, '的中回数'];
              }
              if (name === 'avgOdds' || name === '平均オッズ') {
                return [`${typeof value === 'number' ? value.toFixed(1) : 0}倍`, '平均オッズ'];
              }
              if (name === 'totalPayout' || name === '総払戻額') {
                return [`${(value || 0).toLocaleString()}円`, '総払戻額'];
              }
              return [value, name];
            }}
          />
          <Legend />
          {/* 棒グラフ: 的中回数 (左軸) */}
          <Bar
            yAxisId="left"
            dataKey="totalHits"
            fill="#ef4444"
            name="的中回数"
            radius={[8, 8, 0, 0]}
          />
          {/* 折れ線グラフ: 平均オッズ (右軸) */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgOdds"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="平均オッズ"
          />
        </ComposedChart>
        )}
      </ResponsiveContainer>

      {/* 統計情報 */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-xs text-gray-600 mb-1">総的中回数</p>
          <p className="text-2xl font-bold text-red-600">{hitDetails.length}回</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-xs text-gray-600 mb-1">平均的中オッズ</p>
          <p className="text-2xl font-bold text-orange-600">
            {hitDetails.length > 0
              ? (hitDetails.reduce((sum, d) => sum + d.オッズ, 0) / hitDetails.length).toFixed(1)
              : '0.0'}
          </p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-gray-600 mb-1">最高的中オッズ</p>
          <p className="text-2xl font-bold text-yellow-600">
            {hitDetails.length > 0
              ? Math.max(...hitDetails.map(d => d.オッズ)).toFixed(1)
              : '0.0'}
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-xs text-red-800">
          💡 <strong>分析ポイント:</strong> 低オッズ帯の的中が多い場合は堅実、高オッズ帯が多い場合は
          ハイリスク・ハイリターンな戦略となっています。
        </p>
      </div>
    </div>
  );
}
