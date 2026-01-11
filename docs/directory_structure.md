# プロジェクト構成ガイド

## 1. プロジェクト全体構成

```
KirisameRaceBackTest/
├── frontend/                           # フロントエンド (React + TypeScript)
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── components/                 # Reactコンポーネント
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── upload/
│   │   │   │   ├── FileUploader.tsx
│   │   │   │   ├── DataPreview.tsx
│   │   │   │   ├── DataStatsCards.tsx
│   │   │   │   └── UploadProgress.tsx
│   │   │   ├── strategy/
│   │   │   │   ├── StrategySelector.tsx
│   │   │   │   ├── ParameterForm.tsx
│   │   │   │   ├── FilterPanel.tsx
│   │   │   │   └── StrategyCard.tsx
│   │   │   ├── results/
│   │   │   │   ├── SummaryCards.tsx
│   │   │   │   ├── ChartsContainer.tsx
│   │   │   │   ├── ProfitChart.tsx
│   │   │   │   ├── RoiChart.tsx
│   │   │   │   ├── HitRateChart.tsx
│   │   │   │   ├── OddsDistributionChart.tsx
│   │   │   │   ├── DetailTable.tsx
│   │   │   │   └── ExportButton.tsx
│   │   │   ├── compare/
│   │   │   │   ├── ComparisonTable.tsx
│   │   │   │   ├── RadarChart.tsx
│   │   │   │   └── StrategySelectList.tsx
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Checkbox.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── Modal.tsx
│   │   │   └── ui/                     # shadcn/ui コンポーネント
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── input.tsx
│   │   │       ├── select.tsx
│   │   │       ├── tabs.tsx
│   │   │       ├── table.tsx
│   │   │       └── ...
│   │   ├── pages/
│   │   │   ├── UploadPage.tsx
│   │   │   ├── StrategyPage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   ├── ComparePage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── hooks/
│   │   │   ├── useFileUpload.ts
│   │   │   ├── useBacktest.ts
│   │   │   ├── useResults.ts
│   │   │   ├── useDataStats.ts
│   │   │   └── useExport.ts
│   │   ├── store/
│   │   │   ├── uploadStore.ts
│   │   │   ├── strategyStore.ts
│   │   │   ├── resultsStore.ts
│   │   │   └── uiStore.ts
│   │   ├── services/
│   │   │   ├── api.ts                  # Axiosインスタンス設定
│   │   │   ├── uploadService.ts
│   │   │   ├── backtestService.ts
│   │   │   ├── analysisService.ts
│   │   │   └── exportService.ts
│   │   ├── types/
│   │   │   ├── race.ts                 # レースデータ型定義
│   │   │   ├── strategy.ts             # 戦略型定義
│   │   │   ├── result.ts               # 結果型定義
│   │   │   ├── api.ts                  # APIレスポンス型定義
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts           # 日付、数値フォーマット
│   │   │   ├── validators.ts           # バリデーション関数
│   │   │   ├── calculations.ts         # 計算ユーティリティ
│   │   │   ├── constants.ts            # 定数定義
│   │   │   └── helpers.ts              # ヘルパー関数
│   │   ├── styles/
│   │   │   ├── globals.css             # グローバルスタイル
│   │   │   └── themes.css              # テーマ設定
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   └── README.md
│
├── backend/                            # バックエンド (FastAPI + Python)
│   ├── app/
│   │   ├── main.py                     # FastAPIアプリケーション
│   │   ├── config.py                   # 設定管理
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes.py               # ルーター統合
│   │   │   ├── upload.py               # ファイルアップロードエンドポイント
│   │   │   ├── backtest.py             # バックテストエンドポイント
│   │   │   ├── analysis.py             # 分析エンドポイント
│   │   │   └── health.py               # ヘルスチェック
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── race.py                 # レースデータモデル
│   │   │   ├── strategy.py             # 戦略モデル
│   │   │   ├── result.py               # 結果モデル
│   │   │   └── enums.py                # 列挙型定義
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── upload.py               # アップロードスキーマ
│   │   │   ├── strategy.py             # 戦略スキーマ
│   │   │   ├── result.py               # 結果スキーマ
│   │   │   └── common.py               # 共通スキーマ
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── data_loader.py          # TSVデータ読み込み
│   │   │   ├── validator.py            # データ検証
│   │   │   ├── file_handler.py         # ファイル管理
│   │   │   ├── backtest_engine.py      # バックテストエンジン
│   │   │   ├── strategies/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── base.py             # 基底戦略クラス
│   │   │   │   ├── win.py              # 単勝戦略
│   │   │   │   ├── place.py            # 複勝戦略
│   │   │   │   ├── bracket.py          # 馬連戦略
│   │   │   │   ├── wide.py             # ワイド戦略
│   │   │   │   ├── exacta.py           # 馬単戦略
│   │   │   │   └── trio.py             # 3連複戦略
│   │   │   ├── analyzer.py             # 結果分析
│   │   │   └── exporter.py             # データエクスポート
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── calculations.py         # 回収率等の計算
│   │   │   ├── formatters.py           # データフォーマット
│   │   │   ├── constants.py            # 定数定義
│   │   │   └── exceptions.py           # カスタム例外
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── data_store.py           # インメモリデータストア
│   │   │   └── cache.py                # キャッシュ管理
│   │   └── middleware/
│   │       ├── __init__.py
│   │       ├── error_handler.py        # エラーハンドリング
│   │       └── cors.py                 # CORS設定
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py                 # pytest設定
│   │   ├── test_api/
│   │   │   ├── __init__.py
│   │   │   ├── test_upload.py
│   │   │   ├── test_backtest.py
│   │   │   └── test_analysis.py
│   │   ├── test_services/
│   │   │   ├── __init__.py
│   │   │   ├── test_data_loader.py
│   │   │   ├── test_backtest_engine.py
│   │   │   ├── test_strategies.py
│   │   │   └── test_analyzer.py
│   │   └── fixtures/
│   │       ├── sample_data.tsv
│   │       └── expected_results.json
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── pyproject.toml
│   ├── .env.example
│   ├── .pylintrc
│   └── README.md
│
├── docs/                               # ドキュメント
│   ├── requirements.md                 # 要件定義書
│   ├── system_design.md                # システム設計書
│   ├── api_design.md                   # API設計書
│   ├── frontend_design.md              # フロントエンド設計書
│   ├── directory_structure.md          # 本ファイル
│   └── development_guide.md            # 開発ガイド（後で追加）
│
├── predicted_results/                  # 予測結果データ
│   └── predicted_results_all.tsv
│
├── scripts/                            # ユーティリティスクリプト
│   ├── setup.sh                        # 環境セットアップ
│   ├── dev.sh                          # 開発サーバー起動
│   └── test.sh                         # テスト実行
│
├── .gitignore
├── .editorconfig
├── README.md
└── LICENSE
```

---

## 2. ファイル作成順序（GitHub Copilot向け）

### Phase 1: プロジェクト初期化

#### 1.1 バックエンド初期化
```bash
# 1. ディレクトリ作成
mkdir -p backend/app/{api,models,schemas,services/strategies,utils,core,middleware}
mkdir -p backend/tests/{test_api,test_services,fixtures}

# 2. 初期ファイル作成
touch backend/app/__init__.py
touch backend/app/main.py
touch backend/app/config.py
touch backend/requirements.txt
touch backend/pyproject.toml
```

**作成するファイル**:
1. `backend/requirements.txt` - 依存パッケージ
2. `backend/app/config.py` - 設定管理
3. `backend/app/main.py` - FastAPIエントリーポイント

#### 1.2 フロントエンド初期化
```bash
# Vite + React + TypeScript プロジェクト作成
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# 必要なパッケージをインストール
npm install axios zustand react-router-dom react-hook-form zod
npm install recharts react-dropzone
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node

# Tailwind CSS初期化
npx tailwindcss init -p
```

**設定ファイル**:
1. `frontend/tsconfig.json` - TypeScript設定
2. `frontend/vite.config.ts` - Vite設定
3. `frontend/tailwind.config.js` - Tailwind設定
4. `frontend/.eslintrc.cjs` - ESLint設定

---

### Phase 2: バックエンド基本実装

#### 2.1 データモデル・スキーマ
```
backend/app/models/enums.py          # 列挙型定義
backend/app/models/race.py           # レースデータモデル
backend/app/models/strategy.py       # 戦略モデル
backend/app/models/result.py         # 結果モデル
backend/app/schemas/common.py        # 共通スキーマ
backend/app/schemas/upload.py        # アップロードスキーマ
backend/app/schemas/strategy.py      # 戦略スキーマ
backend/app/schemas/result.py        # 結果スキーマ
```

#### 2.2 ユーティリティ
```
backend/app/utils/constants.py       # 定数
backend/app/utils/exceptions.py      # カスタム例外
backend/app/utils/calculations.py    # 計算関数
backend/app/utils/formatters.py      # フォーマット関数
```

#### 2.3 コアサービス
```
backend/app/core/data_store.py       # データストア
backend/app/services/file_handler.py # ファイル管理
backend/app/services/data_loader.py  # データ読み込み
backend/app/services/validator.py    # データ検証
```

#### 2.4 戦略実装
```
backend/app/services/strategies/base.py      # 基底クラス
backend/app/services/strategies/win.py       # 単勝
backend/app/services/strategies/place.py     # 複勝
backend/app/services/strategies/bracket.py   # 馬連
backend/app/services/strategies/wide.py      # ワイド
backend/app/services/strategies/exacta.py    # 馬単
backend/app/services/strategies/trio.py      # 3連複
```

#### 2.5 バックテストエンジン
```
backend/app/services/backtest_engine.py  # バックテスト実行
backend/app/services/analyzer.py         # 結果分析
```

#### 2.6 APIエンドポイント
```
backend/app/api/health.py            # ヘルスチェック
backend/app/api/upload.py            # アップロードAPI
backend/app/api/backtest.py          # バックテストAPI
backend/app/api/analysis.py          # 分析API
backend/app/api/routes.py            # ルーター統合
```

#### 2.7 ミドルウェア
```
backend/app/middleware/error_handler.py  # エラーハンドリング
backend/app/middleware/cors.py           # CORS設定
```

---

### Phase 3: フロントエンド基本実装

#### 3.1 型定義
```
frontend/src/types/race.ts           # レースデータ型
frontend/src/types/strategy.ts       # 戦略型
frontend/src/types/result.ts         # 結果型
frontend/src/types/api.ts            # APIレスポンス型
frontend/src/types/index.ts          # エクスポート
```

#### 3.2 ユーティリティ
```
frontend/src/utils/constants.ts      # 定数
frontend/src/utils/formatters.ts     # フォーマット関数
frontend/src/utils/validators.ts     # バリデーション
frontend/src/utils/calculations.ts   # 計算関数
frontend/src/utils/helpers.ts        # ヘルパー関数
```

#### 3.3 APIサービス
```
frontend/src/services/api.ts             # Axiosインスタンス
frontend/src/services/uploadService.ts   # アップロードサービス
frontend/src/services/backtestService.ts # バックテストサービス
frontend/src/services/analysisService.ts # 分析サービス
frontend/src/services/exportService.ts   # エクスポートサービス
```

#### 3.4 状態管理 (Zustand)
```
frontend/src/store/uploadStore.ts    # アップロード状態
frontend/src/store/strategyStore.ts  # 戦略設定状態
frontend/src/store/resultsStore.ts   # 結果状態
frontend/src/store/uiStore.ts        # UI状態
```

#### 3.5 カスタムフック
```
frontend/src/hooks/useFileUpload.ts  # ファイルアップロード
frontend/src/hooks/useBacktest.ts    # バックテスト実行
frontend/src/hooks/useResults.ts     # 結果取得
frontend/src/hooks/useDataStats.ts   # データ統計
frontend/src/hooks/useExport.ts      # エクスポート
```

#### 3.6 共通コンポーネント
```
frontend/src/components/common/Button.tsx       # ボタン
frontend/src/components/common/Card.tsx         # カード
frontend/src/components/common/Input.tsx        # 入力フォーム
frontend/src/components/common/Select.tsx       # セレクトボックス
frontend/src/components/common/Spinner.tsx      # ローディング
frontend/src/components/common/ProgressBar.tsx  # プログレスバー
frontend/src/components/common/Toast.tsx        # トースト通知
```

#### 3.7 レイアウトコンポーネント
```
frontend/src/components/layout/Header.tsx   # ヘッダー
frontend/src/components/layout/Footer.tsx   # フッター
frontend/src/components/layout/Layout.tsx   # レイアウト
```

#### 3.8 アップロード関連コンポーネント
```
frontend/src/components/upload/FileUploader.tsx    # ファイルアップローダー
frontend/src/components/upload/DataPreview.tsx     # データプレビュー
frontend/src/components/upload/DataStatsCards.tsx  # 統計カード
frontend/src/components/upload/UploadProgress.tsx  # 進捗表示
```

#### 3.9 戦略設定コンポーネント
```
frontend/src/components/strategy/StrategySelector.tsx  # 戦略選択
frontend/src/components/strategy/ParameterForm.tsx     # パラメータフォーム
frontend/src/components/strategy/FilterPanel.tsx       # フィルタパネル
```

#### 3.10 結果表示コンポーネント
```
frontend/src/components/results/SummaryCards.tsx           # サマリーカード
frontend/src/components/results/ChartsContainer.tsx       # チャートコンテナ
frontend/src/components/results/ProfitChart.tsx           # 収支グラフ
frontend/src/components/results/RoiChart.tsx              # 回収率グラフ
frontend/src/components/results/HitRateChart.tsx          # 的中率グラフ
frontend/src/components/results/OddsDistributionChart.tsx # オッズ分布
frontend/src/components/results/DetailTable.tsx           # 詳細テーブル
frontend/src/components/results/ExportButton.tsx          # エクスポートボタン
```

#### 3.11 ページコンポーネント
```
frontend/src/pages/UploadPage.tsx      # アップロードページ
frontend/src/pages/StrategyPage.tsx    # 戦略設定ページ
frontend/src/pages/ResultsPage.tsx     # 結果ページ
frontend/src/pages/ComparePage.tsx     # 比較ページ
frontend/src/pages/NotFoundPage.tsx    # 404ページ
```

#### 3.12 アプリケーションエントリー
```
frontend/src/App.tsx                   # アプリケーション本体
frontend/src/main.tsx                  # エントリーポイント
frontend/src/styles/globals.css        # グローバルスタイル
```

---

### Phase 4: テスト実装

#### 4.1 バックエンドテスト
```
backend/tests/conftest.py                        # pytest設定
backend/tests/fixtures/sample_data.tsv           # テストデータ
backend/tests/test_api/test_upload.py            # アップロードAPIテスト
backend/tests/test_api/test_backtest.py          # バックテストAPIテスト
backend/tests/test_services/test_data_loader.py  # データローダーテスト
backend/tests/test_services/test_strategies.py   # 戦略テスト
```

#### 4.2 フロントエンドテスト（将来対応）
```
frontend/src/components/__tests__/...   # コンポーネントテスト
frontend/src/hooks/__tests__/...        # フックテスト
```

---

## 3. 開発の進め方（GitHub Copilot活用）

### 3.1 ファイル生成時のプロンプト例

#### バックエンド
```
「backend/app/models/race.py を作成してください。
- RaceDataクラスを定義
- TSVファイルのカラムに対応したフィールド
- Pydantic BaseModelを継承
- 型ヒント付き
- ドキュメント文字列付き
docs/system_design.md のデータモデルを参照してください。」
```

#### フロントエンド
```
「frontend/src/components/upload/FileUploader.tsx を作成してください。
- react-dropzone を使用
- ドラッグ&ドロップ対応
- アップロード進捗表示
- エラーハンドリング
- TypeScript型定義付き
docs/frontend_design.md の FileUploader Component を参照してください。」
```

### 3.2 実装順序の推奨

1. **バックエンドから実装** → APIを先に完成させる
2. **データモデル → サービス → API** の順
3. **フロントエンドは型定義 → サービス → コンポーネント**
4. **共通コンポーネントから個別コンポーネントへ**
5. **各機能ごとにテストを追加**

---

## 4. 環境変数設定

### 4.1 バックエンド (.env)
```ini
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS
CORS_ORIGINS=http://localhost:5173

# File Upload
MAX_UPLOAD_SIZE=52428800  # 50MB
UPLOAD_DIR=./tmp/uploads

# Data
DATA_RETENTION_MINUTES=60
```

### 4.2 フロントエンド (.env)
```ini
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Kirisame Race BackTest System
```

---

## 5. package.json / requirements.txt

### 5.1 バックエンド (requirements.txt)
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6
pydantic==2.5.3
pydantic-settings==2.1.0
pandas==2.1.4
numpy==1.26.3
python-dotenv==1.0.0

# Development
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
black==23.12.1
ruff==0.1.11
mypy==1.8.0
```

### 5.2 フロントエンド (package.json)
```json
{
  "name": "kirisame-race-backtest-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1",
    "axios": "^1.6.5",
    "zustand": "^4.4.7",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "recharts": "^2.10.3",
    "react-dropzone": "^14.2.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "lucide-react": "^0.303.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.33",
    "prettier": "^3.2.2",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.11"
  }
}
```

---

## 6. 開発コマンド

### 6.1 バックエンド
```bash
# 開発サーバー起動
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# テスト実行
pytest

# コードフォーマット
black app/
ruff check app/

# 型チェック
mypy app/
```

### 6.2 フロントエンド
```bash
# 開発サーバー起動
cd frontend
npm run dev

# ビルド
npm run build

# リント
npm run lint

# フォーマット
npm run format
```

---

## 7. Git設定

### .gitignore
```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.env
.venv

# Node
node_modules/
dist/
.cache/
.vite/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Project specific
backend/tmp/
backend/uploads/
frontend/dist/
*.log
```

---

**作成日**: 2026年1月11日  
**バージョン**: 1.0  
**作成者**: GitHub Copilot Assistant
