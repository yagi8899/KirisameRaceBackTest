# システム設計書

## 0. システム概要

**KirisameRace BackTest System (KRBS)** は、過去の競馬レースデータと機械学習予測結果を用いて、予測モデルの実際の収益性を評価するための事後分析型バックテストシステムである。

### システムの性質
- **バックテスト（事後分析）**: 確定した過去データを使用して、予測結果の性能を評価
- **非リアルタイム**: 将来のレースに対する投資判断システムではなく、過去データの分析ツール
- **オッズの扱い**:
  - **購入判断**: 予測時点で得られる情報（単勝オッズ等）を使用
  - **払戻計算**: 実際の確定払戻オッズを使用し、リアルな収益性を評価

---

## 1. システムアーキテクチャ

### 1.1 全体構成

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Upload Page │  │Strategy Page │  │ Results Page │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                  │                  │         │
│         └──────────────────┴──────────────────┘         │
│                           │                             │
│                    ┌──────▼──────┐                      │
│                    │  API Client │                      │
│                    └──────┬──────┘                      │
└───────────────────────────┼──────────────────────────────┘
                            │ HTTP/REST
┌───────────────────────────▼──────────────────────────────┐
│                   Backend (FastAPI)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │File Upload   │  │ Backtest     │  │ Analysis     │  │
│  │Handler       │  │ Engine       │  │ Engine       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
│                           │                              │
│                    ┌──────▼──────┐                       │
│                    │  Data Layer │                       │
│                    └──────┬──────┘                       │
└───────────────────────────┼───────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  In-Memory     │
                    │  Data Store    │
                    │  (Pandas DF)   │
                    └────────────────┘
```

### 1.2 技術スタック

#### フロントエンド
- **Framework**: React 18.2+
- **Language**: TypeScript 5.0+
- **Build Tool**: Vite 5.0+
- **State Management**: Zustand 4.0+
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Charts**: Recharts 2.5+
- **Form**: React Hook Form + Zod
- **HTTP Client**: Axios 1.6+
- **File Upload**: react-dropzone 14.0+

#### バックエンド
- **Framework**: FastAPI 0.109+
- **Language**: Python 3.10+
- **Data Processing**: Pandas 2.1+, NumPy 1.26+
- **Validation**: Pydantic 2.5+
- **CORS**: fastapi-cors
- **Server**: Uvicorn

#### 開発ツール
- **Linter**: ESLint (Frontend), Ruff (Backend)
- **Formatter**: Prettier (Frontend), Black (Backend)
- **Type Checker**: TypeScript, MyPy
- **Testing**: Vitest (Frontend), Pytest (Backend)

---

## 2. ディレクトリ構成

```
KirisameRaceBackTest/
├── frontend/                    # フロントエンド
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reactコンポーネント
│   │   │   ├── layout/          # レイアウトコンポーネント
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── upload/          # アップロード関連
│   │   │   │   ├── FileUploader.tsx
│   │   │   │   ├── DataPreview.tsx
│   │   │   │   └── UploadProgress.tsx
│   │   │   ├── strategy/        # 戦略設定
│   │   │   │   ├── StrategySelector.tsx
│   │   │   │   ├── ParameterForm.tsx
│   │   │   │   └── FilterPanel.tsx
│   │   │   ├── results/         # 結果表示
│   │   │   │   ├── SummaryCards.tsx
│   │   │   │   ├── ChartsContainer.tsx
│   │   │   │   ├── ProfitChart.tsx
│   │   │   │   ├── RoiChart.tsx
│   │   │   │   ├── HitRateChart.tsx
│   │   │   │   └── DetailTable.tsx
│   │   │   ├── common/          # 共通コンポーネント
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   └── ui/              # shadcn/ui コンポーネント
│   │   ├── pages/               # ページコンポーネント
│   │   │   ├── UploadPage.tsx
│   │   │   ├── StrategyPage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   └── ComparePage.tsx
│   │   ├── hooks/               # カスタムフック
│   │   │   ├── useFileUpload.ts
│   │   │   ├── useBacktest.ts
│   │   │   └── useResults.ts
│   │   ├── store/               # 状態管理
│   │   │   ├── uploadStore.ts
│   │   │   ├── strategyStore.ts
│   │   │   └── resultsStore.ts
│   │   ├── services/            # API通信
│   │   │   ├── api.ts
│   │   │   ├── uploadService.ts
│   │   │   └── backtestService.ts
│   │   ├── types/               # 型定義
│   │   │   ├── race.ts
│   │   │   ├── strategy.ts
│   │   │   └── result.ts
│   │   ├── utils/               # ユーティリティ
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── calculations.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                     # バックエンド
│   ├── app/
│   │   ├── main.py              # FastAPIエントリーポイント
│   │   ├── config.py            # 設定
│   │   ├── api/                 # APIエンドポイント
│   │   │   ├── __init__.py
│   │   │   ├── upload.py        # ファイルアップロードAPI
│   │   │   ├── backtest.py      # バックテストAPI
│   │   │   └── analysis.py      # 分析API
│   │   ├── models/              # データモデル
│   │   │   ├── __init__.py
│   │   │   ├── race.py          # レースデータモデル
│   │   │   ├── strategy.py      # 戦略モデル
│   │   │   └── result.py        # 結果モデル
│   │   ├── services/            # ビジネスロジック
│   │   │   ├── __init__.py
│   │   │   ├── data_loader.py   # データ読み込み
│   │   │   ├── validator.py     # データ検証
│   │   │   ├── backtest_engine.py  # バックテストエンジン
│   │   │   ├── strategies/      # 戦略実装
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py      # 基底クラス
│   │   │   │   ├── win.py       # 単勝戦略
│   │   │   │   ├── place.py     # 複勝戦略
│   │   │   │   ├── bracket.py   # 馬連戦略
│   │   │   │   ├── wide.py      # ワイド戦略
│   │   │   │   ├── exacta.py    # 馬単戦略
│   │   │   │   └── trio.py      # 3連複戦略
│   │   │   └── analyzer.py      # 結果分析
│   │   ├── utils/               # ユーティリティ
│   │   │   ├── __init__.py
│   │   │   ├── file_handler.py
│   │   │   └── calculations.py
│   │   └── schemas/             # Pydanticスキーマ
│   │       ├── __init__.py
│   │       ├── upload.py
│   │       ├── strategy.py
│   │       └── result.py
│   ├── tests/                   # テスト
│   │   ├── __init__.py
│   │   ├── test_api/
│   │   └── test_services/
│   ├── requirements.txt
│   └── pyproject.toml
│
├── docs/                        # ドキュメント
│   ├── requirements.md          # 要件定義書
│   ├── system_design.md         # システム設計書（本ファイル）
│   ├── api_design.md            # API設計書
│   └── frontend_design.md       # フロントエンド設計書
│
├── predicted_results/           # 予測結果データ
│   └── predicted_results_all.tsv
│
├── README.md
└── .gitignore
```

---

## 3. データフロー

### 3.1 ファイルアップロードフロー

```
User → FileUploader Component → useFileUpload Hook → Upload API
  ↓                                                       ↓
  File Selection                                    Validation
  ↓                                                       ↓
  Drag & Drop                                      Parse TSV
  ↓                                                       ↓
  Progress Display ← Upload Progress ← Store in Memory (Pandas)
  ↓
  Data Preview ← API Response (sample data + stats)
```

### 3.2 バックテスト実行フロー

```
User → Strategy Selection → Parameter Form → Filter Panel
  ↓                                              ↓
  Strategy Config                           Filter Config
  ↓                                              ↓
  ───────────────────────┬────────────────────────
                         ↓
                   Backtest API
                         ↓
                   Backtest Engine
                         ↓
          ┌──────────────┴──────────────┐
          ↓                             ↓
    Strategy Execution            Data Filtering
          ↓                             ↓
    Calculate Purchases          Apply Race Filters
          ↓                             ↓
    Calculate Returns            Calculate Odds
          ↓                             ↓
    ──────────────────┬──────────────────
                      ↓
                 Result Analysis
                      ↓
          ┌───────────┴───────────┐
          ↓                       ↓
    Summary Stats             Chart Data
          ↓                       ↓
          └───────────┬───────────┘
                      ↓
                  API Response
                      ↓
                Results Page
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
  Summary Cards   Charts      Detail Table
```

---

## 4. コンポーネント設計

### 4.1 主要コンポーネント

#### FileUploader Component
```typescript
interface FileUploaderProps {
  onUploadSuccess: (data: UploadResponse) => void;
  onUploadError: (error: Error) => void;
}

// 責務:
// - ファイル選択UI提供
// - ドラッグ&ドロップ処理
// - アップロード進捗表示
// - エラーハンドリング
```

#### StrategySelector Component
```typescript
interface StrategySelectorProps {
  onStrategyChange: (strategy: StrategyType) => void;
  selectedStrategy: StrategyType;
}

// 責務:
// - 戦略タイプの選択UI
// - 戦略説明の表示
// - 選択状態の管理
```

#### ParameterForm Component
```typescript
interface ParameterFormProps {
  strategy: StrategyType;
  onParameterChange: (params: StrategyParams) => void;
  initialValues?: StrategyParams;
}

// 責務:
// - 戦略パラメータの入力フォーム
// - バリデーション
// - フォーム送信
```

#### ChartsContainer Component
```typescript
interface ChartsContainerProps {
  results: BacktestResult;
  chartType: 'profit' | 'roi' | 'hitRate' | 'odds';
}

// 責務:
// - グラフの表示
// - インタラクティブ機能
// - データの整形
```

---

## 5. API設計概要

### 5.1 エンドポイント一覧

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | /api/upload | TSVファイルアップロード |
| GET | /api/data/preview | データプレビュー取得 |
| GET | /api/data/stats | データ統計情報取得 |
| POST | /api/backtest/execute | バックテスト実行 |
| POST | /api/backtest/batch | 複数戦略一括実行 |
| GET | /api/backtest/strategies | 利用可能な戦略一覧 |
| POST | /api/analysis/compare | 戦略比較分析 |
| GET | /api/analysis/export | 結果エクスポート |

詳細は `api_design.md` を参照。

---

## 6. データモデル

### 6.1 レースデータ (RaceData)

```typescript
interface RaceData {
  racecourse: string;        // 競馬場
  year: number;              // 開催年
  date: string;              // 開催日 (YYYYMMDD)
  raceNumber: number;        // レース番号
  surface: '芝' | 'ダート';  // 芝ダ区分
  distance: number;          // 距離
  horseNumber: number;       // 馬番
  horseName: string;         // 馬名
  winOdds: number;           // 単勝オッズ
  popularity: number;        // 人気順
  finalRank: number;         // 確定着順
  predictedRank: number;     // 予測順位
  predictedScore: number;    // 予測スコア
  // オッズ情報
  placeOdds: PlaceOdds;
  bracketOdds: number;
  wideOdds: WideOdds;
  exactaOdds: number;
  trioOdds: number;
}
```

### 6.2 戦略設定 (StrategyConfig)

```typescript
interface StrategyConfig {
  type: StrategyType;        // 戦略タイプ
  betAmount: number;         // 1レースあたり購入金額
  topN?: number;             // 購入対象頭数
  scoreThreshold?: number;   // スコア閾値
  axisHorse?: number;        // 軸馬番号
  filters: RaceFilter;       // フィルタ条件
}

type StrategyType = 
  | 'WIN'           // 単勝
  | 'PLACE'         // 複勝
  | 'BRACKET'       // 馬連
  | 'WIDE'          // ワイド
  | 'EXACTA'        // 馬単
  | 'TRIO';         // 3連複
```

### 6.3 バックテスト結果 (BacktestResult)

```typescript
interface BacktestResult {
  summary: {
    totalInvestment: number;     // 総投資額
    totalReturn: number;         // 総払戻金
    profit: number;              // 収支
    roi: number;                 // 回収率
    hitRate: number;             // 的中率
    hitCount: number;            // 的中回数
    totalRaces: number;          // 総レース数
    averageReturn: number;       // 平均払戻倍率
  };
  timeline: TimelineData[];      // 時系列データ
  details: RaceResult[];         // 詳細データ
  analysis: {
    byRacecourse: Record<string, AnalysisData>;
    bySurface: Record<string, AnalysisData>;
    byDistance: Record<string, AnalysisData>;
    oddsDistribution: DistributionData[];
  };
}
```

---

## 7. 状態管理

### 7.1 Zustandストア構成

#### Upload Store
```typescript
interface UploadState {
  file: File | null;
  isUploading: boolean;
  uploadProgress: number;
  uploadedData: RaceData[] | null;
  dataStats: DataStats | null;
  error: string | null;
  
  // Actions
  setFile: (file: File) => void;
  uploadFile: (file: File) => Promise<void>;
  clearUpload: () => void;
}
```

#### Strategy Store
```typescript
interface StrategyState {
  selectedStrategy: StrategyType;
  parameters: StrategyParams;
  filters: RaceFilter;
  
  // Actions
  setStrategy: (strategy: StrategyType) => void;
  updateParameters: (params: Partial<StrategyParams>) => void;
  updateFilters: (filters: Partial<RaceFilter>) => void;
  resetStrategy: () => void;
}
```

#### Results Store
```typescript
interface ResultsState {
  isRunning: boolean;
  currentResult: BacktestResult | null;
  savedResults: BacktestResult[];
  error: string | null;
  
  // Actions
  executeBacktest: (config: StrategyConfig) => Promise<void>;
  saveResult: (result: BacktestResult) => void;
  clearResults: () => void;
}
```

---

## 8. エラーハンドリング

### 8.1 エラータイプ

```typescript
enum ErrorType {
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  FILE_FORMAT_ERROR = 'FILE_FORMAT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  BACKTEST_ERROR = 'BACKTEST_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}
```

### 8.2 エラーハンドリング戦略

1. **ファイルアップロードエラー**
   - ファイル形式チェック（拡張子、MIME type）
   - ファイルサイズチェック
   - エンコーディングチェック
   - ユーザーフレンドリーなエラーメッセージ

2. **データ検証エラー**
   - 必須カラムの存在確認
   - データ型の検証
   - 範囲チェック（オッズ、順位など）
   - エラー箇所の行番号を通知

3. **バックテストエラー**
   - パラメータ検証
   - 実行中のエラーハンドリング
   - タイムアウト処理

---

## 9. パフォーマンス最適化

### 9.1 フロントエンド

- **Code Splitting**: React.lazy で各ページを遅延ロード
- **Memoization**: React.memo, useMemo, useCallback の活用
- **Virtual Scrolling**: 大量データテーブルの仮想スクロール
- **Debounce**: フィルタ入力のデバウンス処理
- **Web Workers**: 大規模データ処理のオフロード（将来対応）

### 9.2 バックエンド

- **Pandas最適化**: ベクトル演算の活用
- **並列処理**: 複数戦略の並列実行（ProcessPoolExecutor）
- **キャッシング**: 計算結果のメモ化
- **チャンク処理**: 大量データの分割処理

---

## 10. セキュリティ対策

### 10.1 ファイルアップロード

- ファイルタイプの厳格なチェック
- ファイルサイズ制限（50MB）
- ファイル名のサニタイズ
- 一時ファイルの自動削除

### 10.2 API

- CORS設定（開発環境: localhost許可、本番環境: ホワイトリスト）
- リクエストレート制限
- 入力値の検証（Pydantic）

---

## 11. テスト戦略

### 11.1 フロントエンド

- **Unit Tests**: Vitest + React Testing Library
  - コンポーネント単体テスト
  - フック単体テスト
  - ユーティリティ関数テスト

- **Integration Tests**: コンポーネント統合テスト
- **E2E Tests**: Playwright（将来対応）

### 11.2 バックエンド

- **Unit Tests**: Pytest
  - 戦略ロジックテスト
  - データ処理テスト
  - 計算ロジックテスト

- **API Tests**: FastAPI TestClient
  - エンドポイントテスト
  - レスポンス検証

---

## 12. デプロイメント

### 12.1 開発環境

```bash
# Frontend
cd frontend
npm install
npm run dev  # http://localhost:5173

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload  # http://localhost:8000
```

### 12.2 本番環境（将来対応）

- Frontend: Vercel / Netlify
- Backend: Docker コンテナ化 → AWS EC2 / GCP
- CI/CD: GitHub Actions

---

## 13. 制約事項と今後の展望

### 13.1 現行制約

- シングルユーザー前提（認証なし）
- データ永続化なし（セッション毎にリセット）
- オフライン動作のみ

### 13.2 将来拡張

- ユーザー認証・管理機能
- データベース永続化（PostgreSQL）
- リアルタイム予測API連携
- クラウドストレージ対応
- モバイルアプリ化

---

**作成日**: 2026年1月11日  
**バージョン**: 1.0  
**作成者**: GitHub Copilot Assistant
