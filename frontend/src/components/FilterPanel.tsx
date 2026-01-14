import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, MapPin, Calendar, TrendingUp } from 'lucide-react';
import type { RaceFilters } from '../types';

interface FilterPanelProps {
  onFiltersChange: (filters: RaceFilters) => void;
}

const RACECOURSES = [
  '東京', '中山', '阪神', '京都', '中京', 
  '新潟', '福島', '小倉', '札幌', '函館'
];

const SURFACES = ['芝', 'ダート'];

export function FilterPanel({ onFiltersChange }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true); // デフォルトで展開
  const [selectedRacecourses, setSelectedRacecourses] = useState<string[]>([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [distanceMin, setDistanceMin] = useState<number>(1000);
  const [distanceMax, setDistanceMax] = useState<number>(3600);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [oddsMin, setOddsMin] = useState<number>(1.0);
  const [oddsMax, setOddsMax] = useState<number>(100.0);

  const handleChange = () => {
    const filters: RaceFilters = {
      racecourses: selectedRacecourses.length > 0 ? selectedRacecourses : [],
      surfaces: selectedSurfaces.length > 0 ? selectedSurfaces : [],
      distanceMin: distanceMin !== 1000 ? distanceMin : null,
      distanceMax: distanceMax !== 3600 ? distanceMax : null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      oddsMin: oddsMin !== 1.0 ? oddsMin : null,
      oddsMax: oddsMax !== 100.0 ? oddsMax : null,
    };
    onFiltersChange(filters);
  };

  const handleRacecourseToggle = (racecourse: string) => {
    const newSelection = selectedRacecourses.includes(racecourse)
      ? selectedRacecourses.filter(r => r !== racecourse)
      : [...selectedRacecourses, racecourse];
    setSelectedRacecourses(newSelection);
    handleChange();
  };

  const handleSurfaceToggle = (surface: string) => {
    const newSelection = selectedSurfaces.includes(surface)
      ? selectedSurfaces.filter(s => s !== surface)
      : [...selectedSurfaces, surface];
    setSelectedSurfaces(newSelection);
    handleChange();
  };

  const handleDistanceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setDistanceMin(value);
    handleChange();
  };

  const handleDistanceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setDistanceMax(value);
    handleChange();
  };

  const handleOddsMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setOddsMin(value);
    handleChange();
  };

  const handleOddsMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setOddsMax(value);
    handleChange();
  };

  const handleClearFilters = () => {
    setSelectedRacecourses([]);
    setSelectedSurfaces([]);
    setDistanceMin(1000);
    setDistanceMax(3600);
    setDateFrom('');
    setDateTo('');
    setOddsMin(1.0);
    setOddsMax(100.0);
    
    // stateは非同期で更新されるため、直接空のfiltersを送信
    onFiltersChange({
      racecourses: [],
      surfaces: [],
      distanceMin: null,
      distanceMax: null,
      dateFrom: null,
      dateTo: null,
      oddsMin: null,
      oddsMax: null,
    });
  };

  const activeFilterCount = 
    selectedRacecourses.length + 
    selectedSurfaces.length + 
    (distanceMin !== 1000 ? 1 : 0) + 
    (distanceMax !== 3600 ? 1 : 0) + 
    (dateFrom ? 1 : 0) + 
    (dateTo ? 1 : 0) + 
    (oddsMin !== 1.0 ? 1 : 0) + 
    (oddsMax !== 100.0 ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* ヘッダー */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">フィルタ設定</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 text-xs font-bold text-white bg-purple-600 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* コンテンツ */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-gray-200 pt-6">
          {/* 競馬場選択 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <MapPin className="w-4 h-4 text-blue-600" />
              競馬場
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {RACECOURSES.map((racecourse) => (
                <button
                  key={racecourse}
                  onClick={() => handleRacecourseToggle(racecourse)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all transform hover:scale-105 active:scale-95 shadow-sm ${
                    selectedRacecourses.includes(racecourse)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md hover:shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {racecourse}
                </button>
              ))}
            </div>
          </div>

          {/* 馬場タイプ */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <span className="text-green-600">🌱</span>
              馬場タイプ
            </label>
            <div className="flex gap-2">
              {SURFACES.map((surface) => (
                <button
                  key={surface}
                  onClick={() => handleSurfaceToggle(surface)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-all transform hover:scale-105 active:scale-95 shadow-sm ${
                    selectedSurfaces.includes(surface)
                      ? 'bg-green-600 text-white border-green-600 shadow-md hover:shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  {surface}
                </button>
              ))}
            </div>
          </div>

          {/* 距離範囲 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              距離範囲
            </label>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>最小距離</span>
                  <span className="font-bold text-orange-600">{distanceMin}m</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="3600"
                  step="100"
                  value={distanceMin}
                  onChange={handleDistanceMinChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>最大距離</span>
                  <span className="font-bold text-orange-600">{distanceMax}m</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="3600"
                  step="100"
                  value={distanceMax}
                  onChange={handleDistanceMaxChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>
            </div>
          </div>

          {/* 日付範囲 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Calendar className="w-4 h-4 text-indigo-600" />
              日付範囲
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">開始日</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    handleChange();
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">終了日</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    handleChange();
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* オッズ範囲 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <TrendingUp className="w-4 h-4 text-red-600" />
              オッズ範囲
            </label>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>最小オッズ</span>
                  <span className="font-bold text-red-600">{oddsMin.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="0.5"
                  value={oddsMin}
                  onChange={handleOddsMinChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>最大オッズ</span>
                  <span className="font-bold text-red-600">{oddsMax.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="0.5"
                  value={oddsMax}
                  onChange={handleOddsMaxChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>
          </div>

          {/* クリアボタン */}
          <button
            onClick={handleClearFilters}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            フィルタをクリア
          </button>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-800">
              💡 <strong>ヒント:</strong> フィルタを設定することで、特定の条件下でのバックテスト結果を確認できます。
              例: 「東京競馬場の芝2000m以上」など
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
