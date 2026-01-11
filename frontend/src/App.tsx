import { useState } from 'react';
import axios from 'axios';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
      setBacktestResult(null);
      setError(null);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">��� Kirisame Race BackTest</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. TSVファイルアップロード</h2>
          <div className="flex items-center gap-4">
            <input type="file" accept=".tsv,.txt" onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <button onClick={handleUpload} disabled={!file || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
              {uploading ? 'アップロード中...' : 'アップロード'}
            </button>
          </div>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
        {uploadResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">📊 データ統計</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded"><div className="text-sm text-gray-600">総レース数</div><div className="text-2xl font-bold text-blue-600">{uploadResult.stats.totalRaces}</div></div>
              <div className="bg-green-50 p-4 rounded"><div className="text-sm text-gray-600">総頭数</div><div className="text-2xl font-bold text-green-600">{uploadResult.stats.totalHorses}</div></div>
              <div className="bg-purple-50 p-4 rounded"><div className="text-sm text-gray-600">予測1位的中率</div><div className="text-2xl font-bold text-purple-600">{(uploadResult.stats.predictionAccuracy.rank1HitRate * 100).toFixed(1)}%</div></div>
              <div className="bg-orange-50 p-4 rounded"><div className="text-sm text-gray-600">1-3位的中率</div><div className="text-2xl font-bold text-orange-600">{(uploadResult.stats.predictionAccuracy.rank1_3HitRate * 100).toFixed(1)}%</div></div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">2. 戦略を選択</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setSelectedStrategy('WIN')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedStrategy === 'WIN'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="font-bold">単勝（WIN）</div>
                  <div className="text-xs mt-1">1着のみ的中</div>
                </button>
                <button
                  onClick={() => setSelectedStrategy('PLACE')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedStrategy === 'PLACE'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="font-bold">複勝（PLACE）</div>
                  <div className="text-xs mt-1">1-3着で的中</div>
                </button>
                <button
                  onClick={() => setSelectedStrategy('BRACKET')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedStrategy === 'BRACKET'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="font-bold">馬連（UMAREN）</div>
                  <div className="text-xs mt-1">予測1-2位が1-2着</div>
                </button>
                <button
                  onClick={() => setSelectedStrategy('WIDE')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedStrategy === 'WIDE'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 bg-white hover:border-yellow-300'
                  }`}
                >
                  <div className="font-bold">ワイド（WIDE）</div>
                  <div className="text-xs mt-1">予測1-2位が1-3着</div>
                </button>
                <button
                  onClick={() => setSelectedStrategy('EXACTA')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedStrategy === 'EXACTA'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="font-bold">馬単（UMATAN）</div>
                  <div className="text-xs mt-1">予測1位→2位が1着→2着</div>
                </button>
                <button
                  onClick={() => setSelectedStrategy('TRIO')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedStrategy === 'TRIO'
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 bg-white hover:border-pink-300'
                  }`}
                >
                  <div className="font-bold">3連複（TRIO）</div>
                  <div className="text-xs mt-1">予測1-3位が1-3着</div>
                </button>
              </div>
            </div>
            
            <button onClick={handleBacktest} disabled={backtesting}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg font-semibold">
              {backtesting ? 'バックテスト実行中...' : `3. バックテストを実行（${
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
        {backtestResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold">🎯 バックテスト結果</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                backtestResult.strategy.strategyType === 'WIN' ? 'bg-blue-100 text-blue-700' :
                backtestResult.strategy.strategyType === 'PLACE' ? 'bg-green-100 text-green-700' :
                backtestResult.strategy.strategyType === 'BRACKET' ? 'bg-purple-100 text-purple-700' :
                backtestResult.strategy.strategyType === 'WIDE' ? 'bg-yellow-100 text-yellow-700' :
                backtestResult.strategy.strategyType === 'EXACTA' ? 'bg-orange-100 text-orange-700' :
                'bg-pink-100 text-pink-700'
              }`}>
                {
                  backtestResult.strategy.strategyType === 'WIN' ? '単勝戦略' :
                  backtestResult.strategy.strategyType === 'PLACE' ? '複勝戦略' :
                  backtestResult.strategy.strategyType === 'BRACKET' ? '馬連戦略' :
                  backtestResult.strategy.strategyType === 'WIDE' ? 'ワイド戦略' :
                  backtestResult.strategy.strategyType === 'EXACTA' ? '馬単戦略' :
                  '3連複戦略'
                }
              </span>
            </div>
            
            {/* 収支推移グラフ */}
            {backtestResult.profitData && backtestResult.profitData.length > 0 && (
              <ProfitChart data={backtestResult.profitData} />
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded"><div className="text-sm text-gray-600">購入レース数</div><div className="text-xl font-bold">{backtestResult.summary.betRaces}</div></div>
              <div className="bg-blue-50 p-4 rounded"><div className="text-sm text-gray-600">総投資額</div><div className="text-xl font-bold text-blue-600">¥{backtestResult.summary.totalInvestment.toLocaleString()}</div></div>
              <div className="bg-green-50 p-4 rounded"><div className="text-sm text-gray-600">総払戻額</div><div className="text-xl font-bold text-green-600">¥{backtestResult.summary.totalPayout.toLocaleString()}</div></div>
              <div className={(backtestResult.summary.totalProfit >= 0 ? 'bg-green-50' : 'bg-red-50') + ' p-4 rounded'}><div className="text-sm text-gray-600">総利益</div><div className={(backtestResult.summary.totalProfit >= 0 ? 'text-green-600' : 'text-red-600') + ' text-xl font-bold'}>¥{backtestResult.summary.totalProfit.toLocaleString()}</div></div>
              <div className={(backtestResult.summary.roi >= 0 ? 'bg-green-50' : 'bg-red-50') + ' p-4 rounded'}><div className="text-sm text-gray-600">ROI</div><div className={(backtestResult.summary.roi >= 0 ? 'text-green-600' : 'text-red-600') + ' text-xl font-bold'}>{backtestResult.summary.roi.toFixed(1)}%</div></div>
              <div className="bg-purple-50 p-4 rounded"><div className="text-sm text-gray-600">的中率</div><div className="text-xl font-bold text-purple-600">{backtestResult.summary.hitRate.toFixed(1)}%</div></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded"><div className="text-sm text-gray-600">的中数</div><div className="text-xl font-bold">{backtestResult.summary.hitCount} / {backtestResult.summary.totalBets}</div></div>
              <div className="bg-blue-50 p-4 rounded"><div className="text-sm text-gray-600">平均オッズ</div><div className="text-xl font-bold text-blue-600">{backtestResult.summary.averageOdds.toFixed(2)}倍</div></div>
              <div className="bg-yellow-50 p-4 rounded"><div className="text-sm text-gray-600">1着的中数</div><div className="text-xl font-bold text-yellow-600">{backtestResult.summary.winCount}</div></div>
            </div>
          </div>
        )}
        
        {/* 詳細結果テーブル */}
        {backtestResult && backtestResult.details && backtestResult.details.length > 0 && (
          <ResultsTable details={backtestResult.details} />
        )}
      </div>
    </div>
  );
}

export default App;
