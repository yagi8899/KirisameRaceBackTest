interface BetResultDetail {
  raceId: string;
  競馬場: string;
  開催年: number;
  開催日: number;
  レース番号: number;
  距離: number | null;
  芝ダ区分: string;
  馬番: number;
  購入タイプ: string;
  オッズ: number;
  購入金額: number;
  実際の着順: number;
  的中: boolean;
  払戻金額: number;
  利益: number;
}

interface ResultsTableProps {
  details: BetResultDetail[];
}

export default function ResultsTable({ details }: ResultsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">📋 レース別詳細結果</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">競馬場</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">R</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">芝/ダ</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">距離</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">馬番</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">購入</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">オッズ</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">着順</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">的中</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">払戻</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">損益</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {details.map((detail, index) => (
              <tr key={index} className={detail.的中 ? 'bg-green-50' : ''}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{detail.競馬場}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{detail.開催年}/{detail.開催日}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{detail.レース番号}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{detail.芝ダ区分}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{detail.距離}m</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{detail.馬番}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{detail.購入タイプ}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{detail.オッズ.toFixed(1)}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{detail.実際の着順}着</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {detail.的中 ? (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      的中
                    </span>
                  ) : (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      不的中
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">¥{detail.払戻金額.toLocaleString()}</td>
                <td className={`px-3 py-2 whitespace-nowrap text-sm font-medium ${detail.利益 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {detail.利益 >= 0 ? '+' : ''}¥{detail.利益.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
