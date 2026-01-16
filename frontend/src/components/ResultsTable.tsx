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

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export default function ResultsTable({ details }: ResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);
  const itemsPerPage = 50;

  // 開催年と開催日をyyyy/MM/dd形式に変換
  const formatRaceDate = (year: number, day: number): string => {
    const dayStr = String(day).padStart(3, '0');
    const month = dayStr.substring(0, dayStr.length - 2);
    const date = dayStr.substring(dayStr.length - 2);
    return `${year}/${month.padStart(2, '0')}/${date}`;
  };

  // ソート処理（マルチソート対応）
  const sortedDetails = useMemo(() => {
    if (sortConfigs.length === 0) return details;

    return [...details].sort((a, b) => {
      // 複数のソート条件を順番に適用
      for (const config of sortConfigs) {
        if (!config.key) continue;

        let aVal = a[config.key];
        let bVal = b[config.key];

        // 開催年でソートする場合は、開催日も考慮した複合値を使用
        if (config.key === '開催年') {
          aVal = a['開催年'] * 10000 + a['開催日'];
          bVal = b['開催年'] * 10000 + b['開催日'];
        }

        if (aVal == null && bVal == null) continue;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let comparison = 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
          // booleanの場合: true(的中)を前に、false(不的中)を後に
          comparison = aVal === bVal ? 0 : (aVal ? -1 : 1);
        } else {
          comparison = String(aVal).localeCompare(String(bVal));
        }

        if (comparison !== 0) {
          return config.direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }, [details, sortConfigs]);

  // ページネーション処理
  const totalPages = Math.ceil(sortedDetails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDetails = sortedDetails.slice(startIndex, endIndex);

  // ソートハンドラー（マルチソート対応）
  const handleSort = (key: SortKey, event: React.MouseEvent) => {
    if (!key) return;

    const ctrlPressed = event.ctrlKey || event.metaKey; // Ctrl/Cmd押下で単一ソート

    setSortConfigs(prevConfigs => {
      const existingIndex = prevConfigs.findIndex(config => config.key === key);

      if (ctrlPressed) {
        // Ctrl/Cmd押下時：単一ソート（リセット）
        if (existingIndex === 0 && prevConfigs.length === 1) {
          // 既に単一ソート中の同じ列なら方向を反転
          return [{ key, direction: prevConfigs[0].direction === 'asc' ? 'desc' : 'asc' }];
        } else {
          // 新しい単一ソート
          return [{ key, direction: 'asc' }];
        }
      } else {
        // 通常クリック：マルチソート（既存のソートに追加）
        if (existingIndex >= 0) {
          // 既存の条件がある場合：方向を反転
          const newConfigs = [...prevConfigs];
          newConfigs[existingIndex] = {
            key,
            direction: newConfigs[existingIndex].direction === 'asc' ? 'desc' : 'asc',
          };
          return newConfigs;
        } else {
          // 新しい条件を追加
          return [...prevConfigs, { key, direction: 'asc' }];
        }
      }
    });
  };

  // ソートクリア
  const clearSort = () => {
    setSortConfigs([]);
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

  // ソートアイコン（マルチソート対応）
  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    const configIndex = sortConfigs.findIndex(config => config.key === columnKey);
    
    if (configIndex === -1) {
      return <span className="text-gray-400 ml-1">⇅</span>;
    }

    const config = sortConfigs[configIndex];
    const arrow = config.direction === 'asc' ? '↑' : '↓';
    const badge = sortConfigs.length > 1 ? `${configIndex + 1}` : '';

    return (
      <span className="ml-1 inline-flex items-center gap-0.5">
        {arrow}
        {badge && (
          <span className="text-xs bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
            {badge}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold">📋 レース別詳細結果</h3>
          {sortConfigs.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {sortConfigs.length > 1 ? `${sortConfigs.length}列でソート中` : 'ソート中'}
              </span>
              <button
                onClick={clearSort}
                className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                クリア
              </button>
            </div>
          )}
        </div>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span>📥</span>
          CSV出力
        </button>
      </div>

      {/* マルチソートのヒント */}
      <div className="mb-3 text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded px-3 py-2">
        💡 <strong>ソート方法:</strong> 列ヘッダークリックで追加ソート（順序番号表示）。Ctrl/Cmd + クリックでその列のみソート
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                onClick={(e) => handleSort('競馬場', e)}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                競馬場<SortIcon columnKey="競馬場" />
              </th>
              <th 
                onClick={(e) => handleSort('開催年', e)}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                開催日時<SortIcon columnKey="開催年" />
              </th>
              <th 
                onClick={(e) => handleSort('レース番号', e)}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                R<SortIcon columnKey="レース番号" />
              </th>
              <th 
                onClick={(e) => handleSort('芝ダ区分', e)}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                芝/ダ<SortIcon columnKey="芝ダ区分" />
              </th>
              <th 
                onClick={(e) => handleSort('距離', e)}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                距離<SortIcon columnKey="距離" />
              </th>
              <th 
                onClick={(e) => handleSort('馬番', e)}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                馬番<SortIcon columnKey="馬番" />
              </th>
              <th 
                onClick={(e) => handleSort('購入タイプ', e)}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                購入<SortIcon columnKey="購入タイプ" />
              </th>
              <th 
                onClick={(e) => handleSort('オッズ', e)}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                オッズ<SortIcon columnKey="オッズ" />
              </th>
              <th 
                onClick={(e) => handleSort('実際の着順', e)}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                着順<SortIcon columnKey="実際の着順" />
              </th>
              <th 
                onClick={(e) => handleSort('的中', e)}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                的中<SortIcon columnKey="的中" />
              </th>
              <th 
                onClick={(e) => handleSort('払戻金額', e)}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                払戻<SortIcon columnKey="払戻金額" />
              </th>
              <th 
                onClick={(e) => handleSort('利益', e)}
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
