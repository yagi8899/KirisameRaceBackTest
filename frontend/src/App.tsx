import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles } from 'lucide-react';
import UploadSection from './components/UploadSection';
import StatisticsCards from './components/StatisticsCards';
import StrategySelector from './components/StrategySelector';
import ResultsSummary from './components/ResultsSummary';
import ProfitChart from './components/ProfitChart';
import ResultsTable from './components/ResultsTable';
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
      const response = await axios.post(API_BASE_URL + '/api/backtest', {
        fileId: uploadResult.fileId,
        strategy: { strategyType: selectedStrategy, betAmount: 100, minOdds: 1.0, maxOdds: 100.0 },
      });
      setBacktestResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'バックテストに失敗しました');
    } finally {
      setBacktesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kirisame Race BackTest
              </h1>
              <p className="text-sm text-gray-600">競馬予測モデルのバックテストシステム</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* アップロードセクション */}
        <UploadSection
          file={file}
          uploading={uploading}
          error={error}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
        />

        {/* データ統計 */}
        {uploadResult && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                📊 データ統計
              </h2>
              <StatisticsCards stats={uploadResult.stats} />
            </div>

            {/* 戦略選択 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <StrategySelector
                selectedStrategy={selectedStrategy}
                onSelectStrategy={setSelectedStrategy}
              />
            </div>

            {/* バックテスト実行ボタン */}
            <button
              onClick={handleBacktest}
              disabled={backtesting}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg
                hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed
                transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:scale-100 disabled:shadow-none
                flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {backtesting ? 'バックテスト実行中...' : `バックテストを実行（${
                selectedStrategy === 'WIN' ? '単勝' :
                selectedStrategy === 'PLACE' ? '複勝' :
                selectedStrategy === 'BRACKET' ? '馬連' :
                selectedStrategy === 'WIDE' ? 'ワイド' :
                selectedStrategy === 'EXACTA' ? '馬単' :
                '3連複'
              }戦略）`}
            </button>
          </div>
        )}

        {/* バックテスト結果 */}
        {backtestResult && (
          <div className="space-y-6">
            {/* 結果サマリー */}
            <ResultsSummary
              summary={backtestResult.summary}
              strategyType={backtestResult.strategy.strategyType}
            />
            
            {/* 収支推移グラフ */}
            {backtestResult.profitData && backtestResult.profitData.length > 0 && (
              <ProfitChart data={backtestResult.profitData} />
            )}
            
            {/* 詳細結果テーブル */}
            {backtestResult.details && backtestResult.details.length > 0 && (
              <ResultsTable details={backtestResult.details} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
