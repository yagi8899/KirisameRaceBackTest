import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Settings, Moon } from 'lucide-react';
import UploadSection from './components/UploadSection';
import StatisticsCards from './components/StatisticsCards';
import StrategySelector from './components/StrategySelector';
import { ParameterForm } from './components/ParameterForm';
import { FilterPanel } from './components/FilterPanel';
import type { ParameterSettings, RaceFilters } from './types';
import { GridSearchPanel } from './components/GridSearchPanel';
import ResultsSummary from './components/ResultsSummary';
import ProfitChart from './components/ProfitChart';
import { RoiChart } from './components/RoiChart';
import { HitRateChart } from './components/HitRateChart';
import { OddsDistributionChart } from './components/OddsDistributionChart';
import ResultsTable from './components/ResultsTable';
import ComparisonView from './components/ComparisonView';
import { Card } from './components/common/Card';
import { Accordion } from './components/common/Accordion';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

interface DataStats {
  totalRaces: number;
  totalHorses: number;
  averageHorsesPerRace: number;
  dateRange: { start: string; end: string };
  racecourses: string[];
  surfaces: string[];
  distanceRange: { min: number; max: number };
  predictionAccuracy: {
    rank1HitRate: number;
    rank1_3HitRate: number;
    averagePredictionError: number;
  };
}

interface UploadResult {
  fileId: string;
  fileName: string;
  fileSize: number;
  rowCount: number;
  columnCount: number;
  stats: DataStats;
}

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
  placeCount: number;
}

interface BacktestResult {
  summary: BacktestSummary;
  details: any[];
  strategy: any;
  profitData: Array<{
    raceNumber: number;
    cumulativeProfit: number;
  }>;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [backtesting, setBacktesting] = useState(false);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<'WIN' | 'PLACE' | 'BRACKET' | 'WIDE' | 'EXACTA' | 'TRIO'>('WIN');
  
  // 戦略比較
  const [comparing, setComparing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  
  // パラメータ設定
  const [parameters, setParameters] = useState<ParameterSettings>({
    betAmount: 100,
    topN: 1,
    scoreThreshold: 0.0,
    pivotHorse: null,
  });
  
  // フィルタ設定
  const [filters, setFilters] = useState<RaceFilters>({
    racecourses: [],
    surfaces: [],
    distanceMin: null,
    distanceMax: null,
    dateFrom: null,
    dateTo: null,
    oddsMin: null,
    oddsMax: null,
  });

  // ページ読み込み時に保存されたファイル情報を復元
  useEffect(() => {
    const savedUploadResult = localStorage.getItem('uploadResult');
    if (savedUploadResult) {
      try {
        const parsed = JSON.parse(savedUploadResult);
        setUploadResult(parsed);
        console.log('✓ アップロード情報を復元しました:', parsed.fileId);
      } catch (e) {
        console.error('✗ アップロード情報の復元に失敗:', e);
        localStorage.removeItem('uploadResult');
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
      setBacktestResult(null);
      setError(null);
      // 新しいファイル選択時は保存された情報をクリア
      localStorage.removeItem('uploadResult');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(API_BASE_URL + '/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadResult(response.data.data);
      // アップロード成功時にlocalStorageに保存
      localStorage.setItem('uploadResult', JSON.stringify(response.data.data));
      console.log('✓ アップロード情報を保存しました:', response.data.data.fileId);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleBacktest = async () => {
    if (!uploadResult) return;
    setBacktesting(true);
    setError(null);
    try {
      // フィルタ設定を構築
      const filterConfig: any = {};
      if (filters.racecourses.length > 0) filterConfig.racecourses = filters.racecourses;
      if (filters.surfaces.length > 0) filterConfig.surfaces = filters.surfaces;
      if (filters.distanceMin !== null) filterConfig.distanceMin = filters.distanceMin;
      if (filters.distanceMax !== null) filterConfig.distanceMax = filters.distanceMax;
      if (filters.dateFrom) filterConfig.dateFrom = filters.dateFrom.replace(/-/g, '');
      if (filters.dateTo) filterConfig.dateTo = filters.dateTo.replace(/-/g, '');
      if (filters.oddsMin !== null) filterConfig.oddsMin = filters.oddsMin;
      if (filters.oddsMax !== null) filterConfig.oddsMax = filters.oddsMax;
      
      const response = await axios.post(API_BASE_URL + '/api/backtest', {
        fileId: uploadResult.fileId,
        strategy: {
          strategyType: selectedStrategy,
          betAmount: parameters.betAmount,
          topN: parameters.topN,
          scoreThreshold: parameters.scoreThreshold,
          pivotHorse: parameters.pivotHorse,
          minOdds: 1.0,
          maxOdds: 100.0,
          filters: Object.keys(filterConfig).length > 0 ? filterConfig : null,
        },
      });
      setBacktestResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'バックテストに失敗しました');
    } finally {
      setBacktesting(false);
    }
  };

  const handleCompare = async (strategies: any[]) => {
    if (!uploadResult) return;
    setComparing(true);
    setError(null);
    try {
      // フィルタ設定を構築
      const filterConfig: any = {};
      if (filters.racecourses.length > 0) filterConfig.racecourses = filters.racecourses;
      if (filters.surfaces.length > 0) filterConfig.surfaces = filters.surfaces;
      if (filters.distanceMin !== null) filterConfig.distanceMin = filters.distanceMin;
      if (filters.distanceMax !== null) filterConfig.distanceMax = filters.distanceMax;
      if (filters.dateFrom) filterConfig.dateFrom = filters.dateFrom.replace(/-/g, '');
      if (filters.dateTo) filterConfig.dateTo = filters.dateTo.replace(/-/g, '');
      if (filters.oddsMin !== null) filterConfig.oddsMin = filters.oddsMin;
      if (filters.oddsMax !== null) filterConfig.oddsMax = filters.oddsMax;

      const strategiesWithFilters = strategies.map(s => ({
        strategyType: s.strategyType,
        strategyName: s.strategyName,
        betAmount: s.betAmount,
        topN: s.topN,
        scoreThreshold: s.scoreThreshold,
        pivotHorse: s.pivotHorse || null,
        minOdds: 1.0,
        maxOdds: 100.0,
        filters: Object.keys(filterConfig).length > 0 ? filterConfig : null,
      }));

      const response = await axios.post(API_BASE_URL + '/api/backtest/compare', {
        dataFile: uploadResult.fileId,
        strategies: strategiesWithFilters,
      });
      setComparisonResults(response.data.data.results);
    } catch (err: any) {
      console.error('戦略比較エラー(詳細):', JSON.stringify(err.response?.data, null, 2));
      setError(err.response?.data?.error?.message || err.response?.data?.detail || '戦略比較に失敗しました');
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Kirisame Race BackTest
                </h1>
                <p className="text-sm text-gray-600">競馬予測モデルのバックテストシステム</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Moon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* アップロードセクション - 2カラムグリッド */}
        <div className="grid md:grid-cols-2 gap-6 animate-fadeIn">
          <Card title="データアップロード" icon="📤" hover>
            <UploadSection
              file={file}
              uploading={uploading}
              error={error}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
            />
          </Card>

          {uploadResult && (
            <Card title="データ概要" icon="📊" badge={`${uploadResult.stats.totalRaces}レース`} className="animate-scaleIn">
              <StatisticsCards stats={uploadResult.stats} />
            </Card>
          )}
        </div>

        {/* 戦略設定セクション */}
        {uploadResult && (
          <div className="space-y-6 animate-fadeIn">
            <Card title="戦略設定" icon="🎯" badge="Step 1">
              <StrategySelector
                selectedStrategy={selectedStrategy}
                onSelectStrategy={setSelectedStrategy}
              />
              
              <div className="mt-6">
                <ParameterForm parameters={parameters} onParametersChange={setParameters} />
              </div>
            </Card>

            {/* 詳細設定・高度な機能 - アコーディオン */}
            <Accordion title="詳細フィルタ設定" icon="🔧" badge="オプション">
              <FilterPanel onFiltersChange={setFilters} />
            </Accordion>

            {/* 高度な機能 - 2カラムグリッド */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Accordion title="グリッドサーチ" icon="🔍" badge="最適化">
                  <GridSearchPanel
                    fileId={uploadResult.fileId}
                    strategyType={selectedStrategy}
                    filters={filters}
                    onSearchComplete={(bestParams) => {
                      setParameters({
                        betAmount: bestParams.betAmount,
                        topN: bestParams.topN,
                        scoreThreshold: bestParams.scoreThreshold,
                        pivotHorse: bestParams.pivotHorse || null,
                      });
                    }}
                  />
                </Accordion>
              </div>

              <div>
                <Accordion title="戦略比較" icon="🆚" badge="分析">
                  <ComparisonView
                    onCompare={handleCompare}
                    comparisonResults={comparisonResults}
                    isComparing={comparing}
                  />
                </Accordion>
              </div>
            </div>

            {/* バックテスト実行ボタン */}
            <button
              onClick={handleBacktest}
              disabled={backtesting}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg
                hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed
                transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:scale-100 disabled:shadow-none
                flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              {backtesting ? 'バックテスト実行中...' : `⚡ バックテストを実行 - ${
                selectedStrategy === 'WIN' ? '単勝' :
                selectedStrategy === 'PLACE' ? '複勝' :
                selectedStrategy === 'BRACKET' ? '馬連' :
                selectedStrategy === 'WIDE' ? 'ワイド' :
                selectedStrategy === 'EXACTA' ? '馬単' :
                '3連複'
              }戦略`}
            </button>
          </div>
        )}

        {/* バックテスト結果 */}
        {backtestResult && (
          <div className="space-y-6 animate-fadeIn">
            {/* 結果サマリー */}
            <Card title="実行結果サマリー" icon="💰" badge="完了" hover>
              <ResultsSummary
                summary={backtestResult.summary}
                strategyType={backtestResult.strategy.strategyType}
                details={backtestResult.details}
              />
            </Card>
            
            {/* グラフエリア - 2カラムグリッド */}
            {backtestResult.details && backtestResult.details.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card title="収支推移" icon="📈" className="animate-scaleIn">
                  <ProfitChart data={backtestResult.details.map((detail, index) => {
                    const cumulativeProfit = backtestResult.details
                      .slice(0, index + 1)
                      .reduce((sum, d) => sum + d.利益, 0);
                    return {
                      raceNumber: index + 1,
                      cumulativeProfit,
                      開催年: detail.開催年,
                      開催日: detail.開催日,
                      競馬場: detail.競馬場,
                      レース番号: detail.レース番号,
                    };
                  })} />
                </Card>
                
                <Card title="ROI推移" icon="📊" className="animate-scaleIn">
                  <RoiChart
                    data={backtestResult.details.map((detail, index) => {
                      const cumulativeInvestment = backtestResult.details
                        .slice(0, index + 1)
                        .reduce((sum, d) => sum + d.購入金額, 0);
                      const cumulativeProfit = backtestResult.details
                        .slice(0, index + 1)
                        .reduce((sum, d) => sum + d.利益, 0);
                      return {
                        raceNumber: index + 1,
                        cumulativeProfit,
                        cumulativeInvestment,
                      };
                    })}
                  />
                </Card>
              </div>
            )}
            
            {/* 分析グラフ - 2カラムグリッド */}
            {backtestResult.details && backtestResult.details.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="animate-scaleIn">
                  <HitRateChart details={backtestResult.details} />
                </div>
                <div className="animate-scaleIn">
                  <OddsDistributionChart details={backtestResult.details} />
                </div>
              </div>
            )}
            
            {/* 詳細結果テーブル */}
            {backtestResult.details && backtestResult.details.length > 0 && (
              <div className="animate-fadeIn">
                <ResultsTable details={backtestResult.details} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
