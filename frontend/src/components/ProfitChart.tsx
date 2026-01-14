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

// 開催年と開催日をyyyy/MM/dd形式に変換
const formatRaceDate = (year: number, day: number): string => {
  const dayStr = String(day).padStart(3, '0');
  const month = dayStr.substring(0, dayStr.length - 2);
  const date = dayStr.substring(dayStr.length - 2);
  return `${year}/${month.padStart(2, '0')}/${date}`;
};

export default function ProfitChart({ data }: ProfitChartProps) {
  // X軸ラベルを間引く（50レースごとまたは月が変わる時だけ表示）
  const tickFormatter = (value: any, index: number) => {
    if (index === 0 || index === data.length - 1) {
      // 最初と最後は必ず表示
      return formatRaceDate(data[index].開催年, data[index].開催日);
    }
    // 50レースごと、または月が変わる時に表示
    if (index % 50 === 0) {
      return formatRaceDate(data[index].開催年, data[index].開催日);
    }
    if (index > 0) {
      const prevMonth = Math.floor(data[index - 1].開催日 / 100);
      const currMonth = Math.floor(data[index].開催日 / 100);
      if (prevMonth !== currMonth) {
        return formatRaceDate(data[index].開催年, data[index].開催日);
      }
    }
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">📈 収支推移グラフ</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
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
