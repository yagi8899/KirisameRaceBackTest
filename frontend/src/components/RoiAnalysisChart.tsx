import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface RoiAnalysisChartProps {
  details: any[];
}

type ViewMode = 'venue' | 'distance' | 'surface' | 'year' | 'odds';

export function RoiAnalysisChart({ details }: RoiAnalysisChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('venue');

  // 競馬場別ROI
  const getVenueData = () => {
    const venueStats: Record<string, { investment: number; payout: number; bets: number }> = {};
    
    details.forEach((detail) => {
      const venue = detail.競馬場;
      if (!venueStats[venue]) {
        venueStats[venue] = { investment: 0, payout: 0, bets: 0 };
      }
      venueStats[venue].investment += detail.購入金額;
      venueStats[venue].payout += detail.払戻金額;
      venueStats[venue].bets++;
    });

    return Object.entries(venueStats).map(([venue, stats]) => ({
      name: venue,
      roi: stats.investment > 0 ? (stats.payout / stats.investment) * 100 : 0,
      investment: stats.investment,
      payout: stats.payout,
      bets: stats.bets,
    })).sort((a, b) => b.roi - a.roi);
  };

  // 距離別ROI
  const getDistanceData = () => {
    const distanceStats: Record<string, { investment: number; payout: number; bets: number }> = {};
    
    details.forEach((detail) => {
      if (!detail.距離) return;
      
      let distanceRange = '';
      const dist = detail.距離;
      if (dist < 1400) distanceRange = '1000-1399m';
      else if (dist < 1800) distanceRange = '1400-1799m';
      else if (dist < 2200) distanceRange = '1800-2199m';
      else if (dist < 2600) distanceRange = '2200-2599m';
      else distanceRange = '2600m以上';
      
      if (!distanceStats[distanceRange]) {
        distanceStats[distanceRange] = { investment: 0, payout: 0, bets: 0 };
      }
      distanceStats[distanceRange].investment += detail.購入金額;
      distanceStats[distanceRange].payout += detail.払戻金額;
      distanceStats[distanceRange].bets++;
    });

    return Object.entries(distanceStats).map(([range, stats]) => ({
      name: range,
      roi: stats.investment > 0 ? (stats.payout / stats.investment) * 100 : 0,
      investment: stats.investment,
      payout: stats.payout,
      bets: stats.bets,
    })).sort((a, b) => b.roi - a.roi);
  };

  // 馬場別ROI
  const getSurfaceData = () => {
    const surfaceStats: Record<string, { investment: number; payout: number; bets: number }> = {};
    
    details.forEach((detail) => {
      const surface = detail.芝ダ区分;
      if (!surfaceStats[surface]) {
        surfaceStats[surface] = { investment: 0, payout: 0, bets: 0 };
      }
      surfaceStats[surface].investment += detail.購入金額;
      surfaceStats[surface].payout += detail.払戻金額;
      surfaceStats[surface].bets++;
    });

    return Object.entries(surfaceStats).map(([surface, stats]) => ({
      name: surface,
      roi: stats.investment > 0 ? (stats.payout / stats.investment) * 100 : 0,
      investment: stats.investment,
      payout: stats.payout,
      bets: stats.bets,
    })).sort((a, b) => b.roi - a.roi);
  };

  // 年度別ROI
  const getYearData = () => {
    const yearStats: Record<string, { investment: number; payout: number; bets: number }> = {};
    
    details.forEach((detail) => {
      const year = detail.開催年;
      if (!yearStats[year]) {
        yearStats[year] = { investment: 0, payout: 0, bets: 0 };
      }
      yearStats[year].investment += detail.購入金額;
      yearStats[year].payout += detail.払戻金額;
      yearStats[year].bets++;
    });

    return Object.entries(yearStats)
      .map(([year, stats]) => ({
        name: `${year}年`,
        roi: stats.investment > 0 ? (stats.payout / stats.investment) * 100 : 0,
        investment: stats.investment,
        payout: stats.payout,
        bets: stats.bets,
      }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  };

  // オッズ帯別ROI（重要）
  const getOddsData = () => {
    const oddsRanges = [
      { label: '1.0-2.0倍', min: 1.0, max: 2.0 },
      { label: '2.1-4.0倍', min: 2.0, max: 4.0 },
      { label: '4.1-8.0倍', min: 4.0, max: 8.0 },
      { label: '8.1-15.0倍', min: 8.0, max: 15.0 },
      { label: '15.1倍以上', min: 15.0, max: Infinity },
    ];

    const oddsStats: Record<string, { investment: number; payout: number; bets: number }> = {};
    
    oddsRanges.forEach(range => {
      oddsStats[range.label] = { investment: 0, payout: 0, bets: 0 };
    });

    details.forEach((detail) => {
      const odds = detail.オッズ;
      if (!odds) return;

      for (const range of oddsRanges) {
        if (odds >= range.min && odds < range.max) {
          oddsStats[range.label].investment += detail.購入金額;
          oddsStats[range.label].payout += detail.払戻金額;
          oddsStats[range.label].bets++;
          break;
        }
      }
    });

    return oddsRanges.map(range => {
      const stats = oddsStats[range.label];
      return {
        name: range.label,
        roi: stats.investment > 0 ? (stats.payout / stats.investment) * 100 : 0,
        investment: stats.investment,
        payout: stats.payout,
        bets: stats.bets,
      };
    });
  };

  const getData = () => {
    switch (viewMode) {
      case 'venue':
        return getVenueData();
      case 'distance':
        return getDistanceData();
      case 'surface':
        return getSurfaceData();
      case 'year':
        return getYearData();
      case 'odds':
        return getOddsData();
      default:
        return [];
    }
  };

  const chartData = useMemo(() => getData(), [details, viewMode]);

  // ROIに応じて色を決定
  const getBarColor = (roi: number) => {
    if (roi >= 100) return '#10b981'; // 緑（利益）
    return '#ef4444'; // 赤（損失）
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">回収率（ROI）分析</h3>
      </div>

      {/* タブ切り替え */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setViewMode('venue')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            viewMode === 'venue'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          競馬場別
        </button>
        <button
          onClick={() => setViewMode('distance')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            viewMode === 'distance'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          距離別
        </button>
        <button
          onClick={() => setViewMode('surface')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            viewMode === 'surface'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          馬場別
        </button>
        <button
          onClick={() => setViewMode('year')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            viewMode === 'year'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          年度別
        </button>
        <button
          onClick={() => setViewMode('odds')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            viewMode === 'odds'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          オッズ帯別
        </button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            label={{ value: viewMode === 'venue' ? '競馬場' : 
                          viewMode === 'distance' ? '距離' : 
                          viewMode === 'surface' ? '馬場' : 
                          viewMode === 'year' ? '年度' : 'オッズ帯', 
                    position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
            angle={viewMode === 'odds' ? -45 : 0}
            textAnchor={viewMode === 'odds' ? 'end' : 'middle'}
            height={viewMode === 'odds' ? 80 : 60}
          />
          <YAxis
            label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            formatter={(value: any, name: string, props: any) => {
              if (name === 'roi') {
                const data = props.payload;
                return [
                  <div key="tooltip" className="space-y-1">
                    <div className="font-bold">{value.toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">
                      投資: ¥{data.investment.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      払戻: ¥{data.payout.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      購入数: {data.bets}回
                    </div>
                  </div>,
                  'ROI'
                ];
              }
              return [value, name];
            }}
            labelFormatter={(label) => label}
          />
          <Legend />
          {/* 損益分岐点（100%）の基準線 */}
          <ReferenceLine 
            y={100} 
            stroke="#ef4444" 
            strokeDasharray="5 5" 
            strokeWidth={2}
            label={{ value: '損益分岐点 (100%)', position: 'right', fill: '#ef4444', fontSize: 12 }}
          />
          <Bar
            dataKey="roi"
            name="ROI"
            radius={[8, 8, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="roi" fill={getBarColor(entry.roi)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>読み方:</strong> ROI（回収率）は投資額に対する払戻額の割合。
          100%以上（緑）なら利益、100%未満（赤）なら損失です。
          {viewMode === 'odds' && <span className="block mt-1">
            <strong>オッズ帯別が最重要！</strong> どのオッズ帯で勝負すべきか一目瞭然です。
          </span>}
        </p>
      </div>
    </div>
  );
}
