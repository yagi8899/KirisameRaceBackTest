import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  BarChart3,
  Trophy,
  BadgeCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useMemo } from 'react';

interface BacktestSummary {
  totalRaces: number;
  betRaces: number;
  totalBets: number;
  totalInvestment: number;
  totalPayout: number;
  totalProfit: number;
  roi: number;
  hitRate: number;
  hitCount: number;
  averageOdds: number;
  winCount: number;
}

interface BetResultDetail {
  開催年: number;
  購入金額: number;
  払戻金額: number;
  利益: number;
  的中: boolean;
}

interface ResultsSummaryProps {
  summary: BacktestSummary;
  strategyType: string;
  details?: BetResultDetail[];
}

export default function ResultsSummary({ summary, strategyType, details }: ResultsSummaryProps) {
  const strategyNames: Record<string, string> = {
    WIN: '単勝',
    PLACE: '複勝',
    BRACKET: '馬連',
    WIDE: 'ワイド',
    EXACTA: '馬単',
    TRIO: '3連複',
  };

  const strategyColors: Record<string, { from: string; to: string; text: string; bg: string }> = {
    WIN: { from: 'from-blue-500', to: 'to-blue-600', text: 'text-blue-600', bg: 'bg-blue-50' },
    PLACE: { from: 'from-green-500', to: 'to-green-600', text: 'text-green-600', bg: 'bg-green-50' },
    BRACKET: { from: 'from-purple-500', to: 'to-purple-600', text: 'text-purple-600', bg: 'bg-purple-50' },
    WIDE: { from: 'from-yellow-500', to: 'to-yellow-600', text: 'text-yellow-600', bg: 'bg-yellow-50' },
    EXACTA: { from: 'from-orange-500', to: 'to-orange-600', text: 'text-orange-600', bg: 'bg-orange-50' },
    TRIO: { from: 'from-pink-500', to: 'to-pink-600', text: 'text-pink-600', bg: 'bg-pink-50' },
  };

  // 年度別統計を計算
  const yearlyStats = useMemo(() => {
    if (!details || details.length === 0) return [];

    const yearMap = new Map<number, {
      bets: number;
      investment: number;
      payout: number;
      profit: number;
      hits: number;
    }>();

    details.forEach(detail => {
      const year = detail.開催年;
      const existing = yearMap.get(year) || { bets: 0, investment: 0, payout: 0, profit: 0, hits: 0 };
      
      yearMap.set(year, {
        bets: existing.bets + 1,
        investment: existing.investment + detail.購入金額,
        payout: existing.payout + detail.払戻金額,
        profit: existing.profit + detail.利益,
        hits: existing.hits + (detail.的中 ? 1 : 0),
      });
    });

    return Array.from(yearMap.entries())
      .map(([year, stats]) => ({
        year,
        ...stats,
        roi: (stats.profit / stats.investment) * 100,
        hitRate: (stats.hits / stats.bets) * 100,
      }))
      .sort((a, b) => a.year - b.year);
  }, [details]);

  const colors = strategyColors[strategyType] || strategyColors.WIN;
  const isProfit = summary.totalProfit >= 0;

  const mainStats = [
    {
      icon: BarChart3,
      label: '購入レース数',
      value: summary.betRaces,
      color: 'gray',
    },
    {
      icon: DollarSign,
      label: '総投資額',
      value: `¥${summary.totalInvestment.toLocaleString()}`,
      color: 'blue',
    },
    {
      icon: DollarSign,
      label: '総払戻額',
      value: `¥${summary.totalPayout.toLocaleString()}`,
      color: 'green',
    },
    {
      icon: isProfit ? TrendingUp : TrendingDown,
      label: '総利益',
      value: `¥${summary.totalProfit.toLocaleString()}`,
      color: isProfit ? 'green' : 'red',
      highlight: true,
    },
    {
      icon: isProfit ? TrendingUp : TrendingDown,
      label: 'ROI',
      value: `${summary.roi.toFixed(1)}%`,
      color: isProfit ? 'green' : 'red',
      highlight: true,
    },
    {
      icon: Target,
      label: '的中率',
      value: `${summary.hitRate.toFixed(1)}%`,
      color: 'purple',
    },
  ];

  const subStats = [
    {
      icon: Trophy,
      label: '的中数',
      value: `${summary.hitCount} / ${summary.totalBets}`,
    },
    {
      icon: BadgeCheck,
      label: '平均オッズ',
      value: `${summary.averageOdds.toFixed(2)}倍`,
    },
    {
      icon: Award,
      label: '1着的中数',
      value: summary.winCount,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl bg-gradient-to-br", colors.from, colors.to)}>
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">バックテスト結果</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-semibold",
              colors.bg,
              colors.text
            )}>
              {strategyNames[strategyType] || strategyType}戦略
            </span>
          </div>
        </div>
      </div>

      {/* メイン統計 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            gray: { bg: 'bg-gray-50', text: 'text-gray-600', iconBg: 'bg-gray-100' },
            blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
            green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
            red: { bg: 'bg-red-50', text: 'text-red-600', iconBg: 'bg-red-100' },
            purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100' },
          }[stat.color];

          return (
            <div
              key={index}
              className={cn(
                "relative overflow-hidden rounded-xl p-4 transition-all duration-300",
                stat.highlight ? "ring-2 ring-offset-2" : "",
                stat.highlight && isProfit ? "ring-green-500" : "",
                stat.highlight && !isProfit ? "ring-red-500" : "",
                colorClasses?.bg || '',
                "hover:shadow-md"
              )}
            >
              <div className={cn("inline-flex p-2 rounded-lg mb-2", colorClasses?.iconBg || '')}>
                <Icon className={cn("w-4 h-4", colorClasses?.text || '')} />
              </div>
              <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
              <div className={cn("text-xl font-bold", colorClasses?.text || '')}>{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* サブ統計 */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        {subStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="p-2 bg-white rounded-lg">
                <Icon className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <div className="text-xs text-gray-600">{stat.label}</div>
                <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 年度別統計テーブル */}
      {yearlyStats.length > 1 && (
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 年度別統計</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    年度
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    購入数
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    投資額
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    払戻額
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    利益
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    的中率
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    的中数
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {yearlyStats.map((stat) => (
                  <tr key={stat.year} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.year}年
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">
                      {stat.bets}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">
                      ¥{stat.investment.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">
                      ¥{stat.payout.toLocaleString()}
                    </td>
                    <td className={cn(
                      "px-4 py-3 whitespace-nowrap text-sm text-right font-semibold",
                      stat.profit >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {stat.profit >= 0 ? '+' : ''}¥{stat.profit.toLocaleString()}
                    </td>
                    <td className={cn(
                      "px-4 py-3 whitespace-nowrap text-sm text-right font-semibold",
                      stat.roi >= 100 ? "text-green-600" : "text-red-600"
                    )}>
                      {stat.roi.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-purple-600 font-semibold">
                      {stat.hitRate.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">
                      {stat.hits}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
