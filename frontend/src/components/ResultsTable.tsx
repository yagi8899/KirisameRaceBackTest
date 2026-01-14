import { useState, useMemo } from 'react';
import Papa from 'papaparse';

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

type SortKey = keyof BetResultDetail | null;
type SortDirection = 'asc' | 'desc';

export default function ResultsTable({ details }: ResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const itemsPerPage = 50;

  // 開催年と開催日をyyyy/MM/dd形式に変換
  const formatRaceDate = (year: number, day: number): string => {
    const dayStr = String(day).padStart(3, '0');
    const month = dayStr.substring(0, dayStr.length - 2);
    const date = dayStr.substring(dayStr.length - 2);
    return `${year}/${month.padStart(2, '0')}/${date}`;
  };

  // ソート処理
  const sortedDetails = useMemo(() => {
    if (!sortKey) return details;

    return [...details].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal == null || bVal == null) return 0;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        comparison = aVal === bVal ? 0 : aVal ? 1 : -1;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [details, sortKey, sortDirection]);

  // ページネーション処理
  const totalPages = Math.ceil(sortedDetails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDetails = sortedDetails.slice(startIndex, endIndex);

  // ソートハンドラー
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // CSVエクスポート
  const exportToCSV = () => {
    const csv = Papa.unparse(sortedDetails.map(d => ({
      競馬場: d.競馬場,
      開催年: d.開催年,
      開催日: d.開催日,
      レース番号: d.レース番号,
      芝ダ区分: d.芝ダ区分,
      距離: d.距離,
      馬番: d.馬番,
      購入タイプ: d.購入タイプ,
      オッズ: d.オッズ,
      購入金額: d.購入金額,
      実際の着順: d.実際の着順,
      的中: d.的中 ? '的中' : '不的中',
      払戻金額: d.払戻金額,
      利益: d.利益,
    })));

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backtest_results_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // ソートアイコン
  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <span className="text-gray-400 ml-1">⇅</span>;
    return sortDirection === 'asc' ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">📋 レース別詳細結果</h3>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span>📥</span>
          CSV出力
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={() => handleSort('競馬場')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                競馬場<SortIcon columnKey="競馬場" />
              </th>
              <th 
                onClick={() => handleSort('開催年')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                開催日時<SortIcon columnKey="開催年" />
              </th>
              <th 
                onClick={() => handleSort('レース番号')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                R<SortIcon columnKey="レース番号" />
              </th>
              <th 
                onClick={() => handleSort('芝ダ区分')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                芝/ダ<SortIcon columnKey="芝ダ区分" />
              </th>
              <th 
                onClick={() => handleSort('距離')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                距離<SortIcon columnKey="距離" />
              </th>
              <th 
                onClick={() => handleSort('馬番')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                馬番<SortIcon columnKey="馬番" />
              </th>
              <th 
                onClick={() => handleSort('購入タイプ')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                購入<SortIcon columnKey="購入タイプ" />
              </th>
              <th 
                onClick={() => handleSort('オッズ')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                オッズ<SortIcon columnKey="オッズ" />
              </th>
              <th 
                onClick={() => handleSort('実際の着順')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                着順<SortIcon columnKey="実際の着順" />
              </th>
              <th 
                onClick={() => handleSort('的中')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                的中<SortIcon columnKey="的中" />
              </th>
              <th 
                onClick={() => handleSort('払戻金額')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                払戻<SortIcon columnKey="払戻金額" />
              </th>
              <th 
                onClick={() => handleSort('利益')}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                損益<SortIcon columnKey="利益" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentDetails.map((detail, index) => (
              <tr key={index} className={detail.的中 ? 'bg-green-50' : ''}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{detail.競馬場}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{formatRaceDate(detail.開催年, detail.開催日)}</td>
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

      {/* ページネーションコントロール */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="text-sm text-gray-700">
            {startIndex + 1}〜{Math.min(endIndex, sortedDetails.length)}件 / 全{sortedDetails.length}件
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ≪
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ＜
            </button>
            <span className="px-4 py-1 text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ＞
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ≫
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
