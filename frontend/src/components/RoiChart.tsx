import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface RoiChartProps {
  data: Array<{
    raceNumber: number;
    cumulativeProfit: number;
    cumulativeInvestment: number;
  }>;
}

export function RoiChart({ data }: RoiChartProps) {
  // ROIを計算
  const chartData = data.map((item) => ({
    raceNumber: item.raceNumber,
    roi: item.cumulativeInvestment > 0 ? (item.cumulativeProfit / item.cumulativeInvestment) * 100 : 0,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">ROI推移</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="raceNumber"
            label={{ value: 'レース数', position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
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
            formatter={(value) => [`${typeof value === 'number' ? value.toFixed(1) : 0}%`, 'ROI']}
            labelFormatter={(label) => `レース${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="roi"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="ROI"
          />
          {/* 100%基準線 */}
          <Line
            type="monotone"
            data={[
              { raceNumber: chartData[0]?.raceNumber || 0, roi: 100 },
              { raceNumber: chartData[chartData.length - 1]?.raceNumber || 0, roi: 100 },
            ]}
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="損益分岐点 (100%)"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>読み方:</strong> ROI (投資利益率) = (総払戻金 / 総投資額) × 100。
          100%を超えると利益が出ている状態です。
        </p>
      </div>
    </div>
  );
}
