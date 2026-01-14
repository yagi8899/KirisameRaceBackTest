import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProfitChartProps {
  data: Array<{
    raceNumber: number;
    cumulativeProfit: number;
    開催年: number;
    開催日: number;
    競馬場: string;
    レース番号: number;
  }>;
}

type ViewMode = 'all' | 'yearly';

// 開催年と開催日をyyyy/MM/dd形式に変換
const formatRaceDate = (year: number, day: number): string => {
  const dayStr = String(day).padStart(3, '0');
  const month = dayStr.substring(0, dayStr.length - 2);
  const date = dayStr.substring(dayStr.length - 2);
  return `${year}/${month.padStart(2, '0')}/${date}`;
};

export default function ProfitChart({ data }: ProfitChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // 年度リストを取得
  const years = useMemo(() => {
    const yearSet = new Set(data.map(d => d.開催年));
    return Array.from(yearSet).sort((a, b) => a - b);
  }, [data]);

  // 選択された年度のデータをフィルタ
  const displayData = useMemo(() => {
    if (viewMode === 'all') {
      return data;
    }
    
    const year = selectedYear || years[years.length - 1]; // デフォルトは最新年
    const yearData = data.filter(d => d.開催年 === year);
    
    // 年度別表示の場合、累積収支を年初からの相対値に変換
    if (yearData.length > 0) {
      const startProfit = yearData[0].cumulativeProfit;
      return yearData.map((item, index) => ({
        ...item,
        cumulativeProfit: item.cumulativeProfit - startProfit,
        raceNumber: index + 1, // 年内のレース番号に振り直し
      }));
    }
    return yearData;
  }, [data, viewMode, selectedYear, years]);
  // X軸ラベルを間引く（50レースごとまたは月が変わる時だけ表示）
  const tickFormatter = (value: any, index: number) => {
    if (index === 0 || index === displayData.length - 1) {
      // 最初と最後は必ず表示
      return formatRaceDate(displayData[index].開催年, displayData[index].開催日);
    }
    // 50レースごと、または月が変わる時に表示
    if (index % 50 === 0) {
      return formatRaceDate(displayData[index].開催年, displayData[index].開催日);
    }
    if (index > 0) {
      const prevMonth = Math.floor(displayData[index - 1].開催日 / 100);
      const currMonth = Math.floor(displayData[index].開催日 / 100);
      if (prevMonth !== currMonth) {
        return formatRaceDate(displayData[index].開催年, displayData[index].開催日);
      }
    }
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">📈 収支推移グラフ</h3>
        
        <div className="flex items-center gap-3">
          {/* タブ切り替え */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全期間
            </button>
            <button
              onClick={() => {
                setViewMode('yearly');
                if (!selectedYear) setSelectedYear(years[years.length - 1]);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              年度別
            </button>
          </div>

          {/* 年度選択 */}
          {viewMode === 'yearly' && (
            <select
              value={selectedYear || years[years.length - 1]}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={displayData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="raceNumber"
            tickFormatter={tickFormatter}
            label={{ value: '開催日時', position: 'insideBottom', offset: -5 }}
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            label={{ value: '累積収支 (円)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => `¥${value.toLocaleString()}`}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                const item = payload[0].payload;
                return `${formatRaceDate(item.開催年, item.開催日)} ${item.競馬場} ${item.レース番号}R (第${item.raceNumber}戦)`;
              }
              return `レース ${label}`;
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="cumulativeProfit" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="累積収支"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
