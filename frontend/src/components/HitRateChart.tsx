import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';

interface HitRateChartProps {
  details: any[];
}

type ViewMode = 'venue' | 'distance' | 'surface';

export function HitRateChart({ details }: HitRateChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('venue');

  // 競馬場別的中率
  const getVenueData = () => {
    const venueStats: Record<string, { total: number; hits: number }> = {};
    
    details.forEach((detail) => {
      const venue = detail.競馬場;
      if (!venueStats[venue]) {
        venueStats[venue] = { total: 0, hits: 0 };
      }
      venueStats[venue].total++;
      if (detail.的中) venueStats[venue].hits++;
    });

    return Object.entries(venueStats).map(([venue, stats]) => ({
      name: venue,
      hitRate: (stats.hits / stats.total) * 100,
      hits: stats.hits,
      total: stats.total,
    })).sort((a, b) => b.hitRate - a.hitRate);
  };

  // 距離別的中率 (1000～1600m と 1700m以上)
  const getDistanceData = () => {
    const distanceStats: Record<string, { total: number; hits: number }> = {};
    
    details.forEach((detail) => {
      if (!detail.距離) return;
      const key = detail.距離 <= 1600 ? '1000～1600m' : '1700m以上';
      
      if (!distanceStats[key]) {
        distanceStats[key] = { total: 0, hits: 0 };
      }
      distanceStats[key].total++;
      if (detail.的中) distanceStats[key].hits++;
    });

    return Object.entries(distanceStats).map(([range, stats]) => ({
      name: range,
      hitRate: (stats.hits / stats.total) * 100,
      hits: stats.hits,
      total: stats.total,
    })).sort((a, b) => {
      // 1000～1600mを先に表示
      if (a.name.includes('1000')) return -1;
      if (b.name.includes('1000')) return 1;
      return 0;
    });
  };

  // 馬場別的中率
  const getSurfaceData = () => {
    const surfaceStats: Record<string, { total: number; hits: number }> = {};
    
    details.forEach((detail) => {
      const surface = detail.芝ダ区分;
      if (!surfaceStats[surface]) {
        surfaceStats[surface] = { total: 0, hits: 0 };
      }
      surfaceStats[surface].total++;
      if (detail.的中) surfaceStats[surface].hits++;
    });

    return Object.entries(surfaceStats).map(([surface, stats]) => ({
      name: surface,
      hitRate: (stats.hits / stats.total) * 100,
      hits: stats.hits,
      total: stats.total,
    })).sort((a, b) => b.hitRate - a.hitRate);
  };

  const getData = () => {
    switch (viewMode) {
      case 'venue':
        return getVenueData();
      case 'distance':
        return getDistanceData();
      case 'surface':
        return getSurfaceData();
      default:
        return [];
    }
  };

  const chartData = getData();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-gray-900">的中率分析</h3>
        </div>
        
        {/* タブ切り替え */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('venue')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'venue'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            競馬場別
          </button>
          <button
            onClick={() => setViewMode('distance')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'distance'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            距離別
          </button>
          <button
            onClick={() => setViewMode('surface')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'surface'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            馬場別
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            angle={viewMode === 'venue' ? -45 : 0}
            textAnchor={viewMode === 'venue' ? 'end' : 'middle'}
            height={viewMode === 'venue' ? 80 : 60}
          />
          <YAxis
            label={{ value: '的中率 (%)', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            formatter={(value, _name, props: any) => [
              `${typeof value === 'number' ? value.toFixed(1) : 0}% (${props.payload.hits}/${props.payload.total})`,
              '的中率',
            ]}
          />
          <Legend />
          <Bar
            dataKey="hitRate"
            fill="#fb923c"
            name="的中率"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-xs text-orange-800">
          💡 <strong>活用方法:</strong> 的中率が高い条件を見つけて、フィルタ機能で絞り込むことで、
          より精度の高いバックテストができます。
        </p>
      </div>
    </div>
  );
}
