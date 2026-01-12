import { Settings, TrendingUp, Filter, Target } from 'lucide-react';
import type { ParameterSettings } from '../types';

interface ParameterFormProps {
  parameters: ParameterSettings;
  onParametersChange: (params: ParameterSettings) => void;
}

export function ParameterForm({ parameters, onParametersChange }: ParameterFormProps) {
  const { betAmount, topN, scoreThreshold, pivotHorse } = parameters;

  const updateParameter = (updates: Partial<ParameterSettings>) => {
    onParametersChange({
      ...parameters,
      ...updates,
    });
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParameter({ betAmount: parseInt(e.target.value) });
  };

  const handleTopNChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParameter({ topN: parseInt(e.target.value) });
  };

  const handleScoreThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParameter({ scoreThreshold: parseFloat(e.target.value) });
  };

  const handlePivotHorseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateParameter({ pivotHorse: value ? parseInt(value) : null });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">パラメータ設定</h3>
      </div>

      <div className="space-y-6">
        {/* 購入金額 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <TrendingUp className="w-4 h-4 text-green-600" />
              購入金額
            </label>
            <span className="text-lg font-bold text-blue-600">{betAmount}円</span>
          </div>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={betAmount}
            onChange={handleBetAmountChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>100円</span>
            <span>10,000円</span>
          </div>
        </div>

        {/* 上位N頭数 */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Target className="w-4 h-4 text-orange-600" />
            上位N頭まで購入
          </label>
          <select
            value={topN}
            onChange={handleTopNChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                上位 {n} 頭
              </option>
            ))}
          </select>
        </div>

        {/* スコア閾値 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4 text-purple-600" />
              予測スコア閾値
            </label>
            <span className="text-lg font-bold text-purple-600">{scoreThreshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={scoreThreshold}
            onChange={handleScoreThresholdChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.00</span>
            <span>1.00</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            この値以上のスコアの馬のみ購入対象になります
          </p>
        </div>

        {/* 軸馬設定 (オプション) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <span className="text-yellow-600">⭐</span>
            軸馬設定 (オプション)
          </label>
          <input
            type="number"
            min="1"
            max="18"
            placeholder="馬番を入力 (例: 3)"
            value={pivotHorse || ''}
            onChange={handlePivotHorseChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            馬単・3連複で必ず含める馬番を指定できます
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>ヒント:</strong> パラメータを調整することで、購入条件を細かく制御できます。
          グリッドサーチ機能を使えば、最適なパラメータの組み合わせを自動的に発見できます。
        </p>
      </div>
    </div>
  );
}
