import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProfitChartProps {
  data: Array<{
    raceNumber: number;
    cumulativeProfit: number;
  }>;
}

export default function ProfitChart({ data }: ProfitChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">📈 収支推移グラフ</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="raceNumber" 
            label={{ value: 'レース番号', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: '累積収支 (円)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => `¥${value.toLocaleString()}`}
            labelFormatter={(label) => `レース ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="cumulativeProfit" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="累積収支"
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
