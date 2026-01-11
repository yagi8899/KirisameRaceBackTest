# 開発ロードマップ

## 📌 概要

このロードマップは、競馬バックテストシステムを段階的に開発するための具体的な手順書です。
各ステップは **動作確認可能な単位** で区切られており、段階的に機能を追加していきます。

**開発期間目安**: 2-3週間（1日4-6時間作業想定）

---

## 🎯 開発戦略

### 原則
1. **バックエンド優先**: APIを先に完成させる
2. **最小機能から**: MVP（Minimum Viable Product）を先に作る
3. **段階的テスト**: 各ステップで動作確認
4. **ドキュメント参照**: 詳細は各設計書を参照

### 優先度
- **Phase 1-3 (Week 1)**: 必須機能（P0）- 単勝戦略のみで動くシステム
- **Phase 4-5 (Week 2)**: 推奨機能（P1）- 全戦略対応
- **Phase 6 (Week 3)**: 拡張機能（P2）- 比較・最適化

---

## 📅 Phase 1: 環境セットアップ（Day 1: 2-3時間）

### ✅ Step 1.1: プロジェクト構造作成

```bash
# ルートディレクトリで実行
cd d:/src/Python/KirisameRaceBackTest

# バックエンドディレクトリ作成
mkdir -p backend/app/{api,models,schemas,services/strategies,utils,core,middleware}
mkdir -p backend/tests/{test_api,test_services,fixtures}

# フロントエンドディレクトリ作成（後で Vite で初期化）
# mkdir frontend
```

**確認**: `tree backend` でディレクトリ構造を確認

---

### ✅ Step 1.2: バックエンド初期化

```bash
cd backend

# 仮想環境作成
python -m venv venv

# 仮想環境有効化 (Windows)
venv\Scripts\activate

# 仮想環境有効化 (Mac/Linux)
# source venv/bin/activate
```

**ファイル作成**: `backend/requirements.txt`

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
black==23.12.1
ruff==0.1.11
```

```bash
# パッケージインストール
pip install -r requirements.txt
```

**確認**: `pip list` でパッケージ確認

---

### ✅ Step 1.3: フロントエンド初期化

```bash
cd ..  # ルートディレクトリに戻る

# Vite + React + TypeScript プロジェクト作成
npm create vite@latest frontend -- --template react-ts

cd frontend

# 依存パッケージインストール
npm install

# 追加パッケージインストール
npm install axios zustand react-router-dom react-hook-form zod @hookform/resolvers
npm install recharts react-dropzone
npm install clsx tailwind-merge

# shadcn/ui 準備
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node

# Tailwind CSS 初期化
npx tailwindcss init -p
```

**確認**: `npm run dev` で開発サーバーが起動することを確認（Ctrl+C で停止）

---

### ✅ Step 1.4: 設定ファイル作成

#### backend/.env
```ini
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=http://localhost:5173
MAX_UPLOAD_SIZE=52428800
UPLOAD_DIR=./tmp/uploads
```

#### frontend/.env
```ini
VITE_API_BASE_URL=http://localhost:8000/api
```

#### frontend/tailwind.config.js (上書き)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
    },
  },
  plugins: [],
}
```

**確認**: ファイルが正しく作成されていることを確認

---

## 📅 Phase 2: バックエンド基盤構築（Day 2-3: 8-10時間）

### ✅ Step 2.1: 基本構造とHello World

#### backend/app/main.py
```python
"""FastAPI アプリケーション"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title="Kirisame Race BackTest API",
    version="1.0.0",
    description="競馬バックテストシステム API"
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Kirisame Race BackTest API"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
```

#### backend/app/config.py
```python
"""設定管理"""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]
    MAX_UPLOAD_SIZE: int = 52428800  # 50MB
    UPLOAD_DIR: str = "./tmp/uploads"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

#### backend/app/__init__.py
```python
"""App package"""
```

**テスト実行**:
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**確認**: ブラウザで `http://localhost:8000` にアクセス → JSONが表示される  
**確認**: `http://localhost:8000/docs` にアクセス → Swagger UIが表示される

**重要**: この段階でバックエンドが起動することを確認！

---

### ✅ Step 2.2: データモデル作成

**GitHub Copilot に依頼**:
```
「backend/app/models/enums.py を作成してください。
- StrategyType (WIN, PLACE, BRACKET, WIDE, EXACTA, TRIO)
- SurfaceType (芝, ダート)
の列挙型を定義してください。」
```

**GitHub Copilot に依頼**:
```
「backend/app/models/race.py を作成してください。
docs/system_design.md の RaceData モデルを参考に、
Pandasで読み込むTSVデータに対応したデータクラスを作成してください。
dataclassを使用し、型ヒントを完全につけてください。」
```

作成するファイル:
- `backend/app/models/__init__.py`
- `backend/app/models/enums.py`
- `backend/app/models/race.py`
- `backend/app/models/strategy.py`
- `backend/app/models/result.py`

**確認**: Pythonインタプリタで `from app.models.enums import StrategyType` が動作することを確認

---

### ✅ Step 2.3: Pydanticスキーマ作成

**GitHub Copilot に依頼**:
```
「backend/app/schemas/common.py を作成してください。
- ApiResponse (success, data, message)
- ErrorResponse (success, error)
などの共通レスポンススキーマを定義してください。」
```

作成するファイル:
- `backend/app/schemas/__init__.py`
- `backend/app/schemas/common.py`
- `backend/app/schemas/upload.py` (UploadResponse, DataStats)
- `backend/app/schemas/strategy.py` (StrategyConfig, RaceFilter)
- `backend/app/schemas/result.py` (BacktestResult, Summary, Timeline)

**参考**: `docs/api_design.md` のスキーマ定義

---

### ✅ Step 2.4: ユーティリティ作成

```python
# backend/app/utils/__init__.py
"""Utilities"""

# backend/app/utils/constants.py
"""定数定義"""
REQUIRED_COLUMNS = [
    "競馬場", "開催年", "開催日", "レース番号", 
    "馬番", "馬名", "単勝オッズ", "人気順", 
    "確定着順", "予測順位", "予測スコア"
]

# backend/app/utils/exceptions.py
"""カスタム例外"""
class FileFormatError(Exception):
    """ファイル形式エラー"""
    pass

class ValidationError(Exception):
    """バリデーションエラー"""
    pass
```

作成するファイル:
- `backend/app/utils/constants.py`
- `backend/app/utils/exceptions.py`
- `backend/app/utils/calculations.py` (ROI計算など)

---

### ✅ Step 2.5: データローダー実装（重要！）

**GitHub Copilot に依頼**:
```
「backend/app/services/data_loader.py を作成してください。
- load_tsv_file(file_path: str) -> pd.DataFrame
- validate_columns(df: pd.DataFrame) -> bool
- parse_race_data(df: pd.DataFrame) -> list[RaceData]
TSVファイルを読み込み、バリデーションし、RaceDataのリストに変換する関数を実装してください。
エラーハンドリングも含めてください。」
```

#### backend/app/services/data_loader.py (骨格)
```python
"""データローダー"""
import pandas as pd
from pathlib import Path
from app.utils.constants import REQUIRED_COLUMNS
from app.utils.exceptions import FileFormatError, ValidationError

def load_tsv_file(file_path: str) -> pd.DataFrame:
    """TSVファイルを読み込む"""
    try:
        df = pd.read_csv(file_path, sep='\t', encoding='utf-8')
        return df
    except Exception as e:
        raise FileFormatError(f"Failed to load TSV file: {e}")

def validate_columns(df: pd.DataFrame) -> bool:
    """必須カラムの存在確認"""
    missing = set(REQUIRED_COLUMNS) - set(df.columns)
    if missing:
        raise ValidationError(f"Missing required columns: {missing}")
    return True

# ... 他の関数を実装
```

**テスト**:
```bash
cd backend
python -c "from app.services.data_loader import load_tsv_file; df = load_tsv_file('../predicted_results/predicted_results_all.tsv'); print(df.shape)"
```

**確認**: `(864, 37)` のような形状が表示される

---

### ✅ Step 2.6: データストア実装

#### backend/app/core/data_store.py
```python
"""インメモリデータストア"""
import uuid
from datetime import datetime, timedelta
from typing import Dict, Optional
import pandas as pd

class DataStore:
    """データを一時保存するストア"""
    
    def __init__(self):
        self._storage: Dict[str, dict] = {}
    
    def save(self, df: pd.DataFrame, retention_minutes: int = 60) -> str:
        """データを保存し、IDを返す"""
        file_id = str(uuid.uuid4())
        self._storage[file_id] = {
            "data": df,
            "uploaded_at": datetime.now(),
            "expires_at": datetime.now() + timedelta(minutes=retention_minutes)
        }
        return file_id
    
    def get(self, file_id: str) -> Optional[pd.DataFrame]:
        """データを取得"""
        if file_id not in self._storage:
            return None
        
        item = self._storage[file_id]
        if datetime.now() > item["expires_at"]:
            del self._storage[file_id]
            return None
        
        return item["data"]
    
    def delete(self, file_id: str):
        """データを削除"""
        if file_id in self._storage:
            del self._storage[file_id]

# グローバルインスタンス
data_store = DataStore()
```

---

## 📅 Phase 3: バックエンドAPI実装（Day 4-5: 10-12時間）

### ✅ Step 3.1: アップロードAPI実装

**GitHub Copilot に依頼**:
```
「backend/app/api/upload.py を作成してください。
docs/api_design.md のアップロードAPIを参考に、
POST /api/upload エンドポイントを実装してください。
- UploadFile を受け取る
- data_loader で読み込み
- data_store に保存
- 統計情報を返す
エラーハンドリングも含めてください。」
```

#### backend/app/api/upload.py (骨格)
```python
"""アップロードAPI"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.data_loader import load_tsv_file, validate_columns
from app.core.data_store import data_store
from app.schemas.upload import UploadResponse, DataStats
import tempfile
from pathlib import Path

router = APIRouter(prefix="/api", tags=["upload"])

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """TSVファイルをアップロード"""
    # ファイル形式チェック
    if not file.filename.endswith('.tsv'):
        raise HTTPException(status_code=415, detail="Only TSV files are supported")
    
    # 一時ファイルに保存
    with tempfile.NamedTemporaryFile(delete=False, suffix='.tsv') as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        # データ読み込み
        df = load_tsv_file(tmp_path)
        validate_columns(df)
        
        # データストアに保存
        file_id = data_store.save(df)
        
        # 統計情報計算
        stats = calculate_stats(df)
        
        return {
            "success": True,
            "data": {
                "fileId": file_id,
                "fileName": file.filename,
                "fileSize": len(content),
                "rowCount": len(df),
                "columnCount": len(df.columns),
                "stats": stats
            },
            "message": "File uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
    finally:
        Path(tmp_path).unlink()  # 一時ファイル削除

def calculate_stats(df):
    """統計情報を計算"""
    # 実装...
    pass
```

#### backend/app/main.py に追加
```python
from app.api import upload

app.include_router(upload.router)
```

**テスト**:
```bash
# 別ターミナルでサーバー起動
cd backend
uvicorn app.main:app --reload

# curlでテスト
curl -X POST "http://localhost:8000/api/upload" \
  -F "file=@../predicted_results/predicted_results_all.tsv"
```

**確認**: JSONレスポンスが返ってくること、fileIdが含まれていること

---

### ✅ Step 3.2: 単勝戦略実装（MVP）

**GitHub Copilot に依頼**:
```
「backend/app/services/strategies/base.py を作成してください。
BaseStrategy抽象クラスを定義し、
- execute(races: list[RaceData], params: StrategyParams) -> list[BetResult]
メソッドをabstractmethodとして定義してください。」
```

**GitHub Copilot に依頼**:
```
「backend/app/services/strategies/win.py を作成してください。
BaseStrategyを継承し、単勝戦略を実装してください。
- 予測1位の馬に単勝を購入
- 的中判定
- 払戻金計算
を行ってください。」
```

作成するファイル:
- `backend/app/services/strategies/__init__.py`
- `backend/app/services/strategies/base.py`
- `backend/app/services/strategies/win.py`

---

### ✅ Step 3.3: バックテストエンジン実装

**GitHub Copilot に依頼**:
```
「backend/app/services/backtest_engine.py を作成してください。
BacktestEngine クラスを実装し、
1. データストアからデータ取得
2. フィルタ適用
3. 戦略実行
4. 結果集計（ROI、的中率等）
5. 時系列データ生成
を行うexecute()メソッドを実装してください。」
```

#### backend/app/services/backtest_engine.py (骨格)
```python
"""バックテストエンジン"""
from app.models.strategy import StrategyConfig
from app.schemas.result import BacktestResult, Summary
from app.core.data_store import data_store
from app.services.strategies.win import WinStrategy
import pandas as pd

class BacktestEngine:
    """バックテスト実行エンジン"""
    
    def execute(self, file_id: str, strategy_config: StrategyConfig) -> BacktestResult:
        """バックテストを実行"""
        # 1. データ取得
        df = data_store.get(file_id)
        if df is None:
            raise ValueError("File not found")
        
        # 2. フィルタ適用
        filtered_df = self._apply_filters(df, strategy_config.filters)
        
        # 3. 戦略実行
        strategy = self._get_strategy(strategy_config.type)
        bet_results = strategy.execute(filtered_df, strategy_config)
        
        # 4. 結果集計
        summary = self._calculate_summary(bet_results)
        timeline = self._generate_timeline(bet_results)
        
        return BacktestResult(
            summary=summary,
            timeline=timeline,
            details=bet_results
        )
    
    def _get_strategy(self, strategy_type: str):
        """戦略インスタンスを取得"""
        if strategy_type == "WIN":
            return WinStrategy()
        # ... 他の戦略
        raise ValueError(f"Unknown strategy: {strategy_type}")
    
    # ... 他のメソッド実装
```

---

### ✅ Step 3.4: バックテストAPI実装

**GitHub Copilot に依頼**:
```
「backend/app/api/backtest.py を作成してください。
POST /api/backtest/execute エンドポイントを実装し、
BacktestEngineを呼び出してバックテストを実行してください。」
```

#### backend/app/main.py に追加
```python
from app.api import backtest

app.include_router(backtest.router)
```

**テスト**:
```bash
# リクエスト例
curl -X POST "http://localhost:8000/api/backtest/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "取得したfileId",
    "strategy": {
      "type": "WIN",
      "betAmount": 100,
      "topN": 1
    }
  }'
```

**確認**: バックテスト結果（ROI、的中率等）が返ってくること

---

## 📅 Phase 4: フロントエンド基本実装（Day 6-7: 10-12時間）

### ✅ Step 4.1: 型定義とユーティリティ

**ファイル作成**:
```bash
cd frontend/src
mkdir -p types utils services store hooks components/{common,layout,upload,strategy,results} pages
```

**GitHub Copilot に依頼**:
```
「frontend/src/types/race.ts を作成してください。
バックエンドのRaceDataに対応する型定義を作成してください。」
```

作成するファイル:
- `frontend/src/types/race.ts`
- `frontend/src/types/strategy.ts`
- `frontend/src/types/result.ts`
- `frontend/src/types/api.ts`
- `frontend/src/utils/constants.ts`
- `frontend/src/utils/formatters.ts`

---

### ✅ Step 4.2: APIサービス作成

**GitHub Copilot に依頼**:
```
「frontend/src/services/api.ts を作成してください。
Axiosインスタンスを設定し、
- baseURL: import.meta.env.VITE_API_BASE_URL
- headers: Content-Type: application/json
- エラーハンドリング
を実装してください。」
```

**GitHub Copilot に依頼**:
```
「frontend/src/services/uploadService.ts を作成してください。
uploadFile(file: File): Promise<UploadResponse>
関数を実装してください。FormDataを使用し、
/api/upload にPOSTリクエストを送信してください。」
```

作成するファイル:
- `frontend/src/services/api.ts`
- `frontend/src/services/uploadService.ts`
- `frontend/src/services/backtestService.ts`

---

### ✅ Step 4.3: 状態管理 (Zustand)

**GitHub Copilot に依頼**:
```
「frontend/src/store/uploadStore.ts を作成してください。
Zustandを使用して、
- file: File | null
- fileId: string | null
- dataStats: DataStats | null
- isUploading: boolean
- error: string | null
の状態と、それらを更新するアクションを定義してください。」
```

作成するファイル:
- `frontend/src/store/uploadStore.ts`
- `frontend/src/store/strategyStore.ts`
- `frontend/src/store/resultsStore.ts`

---

### ✅ Step 4.4: 共通コンポーネント作成

**GitHub Copilot に依頼**:
```
「frontend/src/components/common/Button.tsx を作成してください。
Tailwind CSSを使用し、
- variant: 'default' | 'outline' | 'destructive'
- size: 'sm' | 'md' | 'lg'
- loading: boolean
プロパティを持つButtonコンポーネントを作成してください。」
```

作成するファイル:
- `frontend/src/components/common/Button.tsx`
- `frontend/src/components/common/Card.tsx`
- `frontend/src/components/common/Input.tsx`
- `frontend/src/components/common/Spinner.tsx`

---

### ✅ Step 4.5: レイアウト作成

**GitHub Copilot に依頼**:
```
「frontend/src/components/layout/Header.tsx を作成してください。
ナビゲーションリンク（Upload, Strategy, Results）を含む
ヘッダーコンポーネントを作成してください。
React RouterのuseNavigateを使用してください。」
```

**GitHub Copilot に依頼**:
```
「frontend/src/components/layout/Layout.tsx を作成してください。
Header, Footer, 子コンポーネントを含むレイアウトを作成してください。」
```

---

### ✅ Step 4.6: アップロードページ実装

**GitHub Copilot に依頼**:
```
「frontend/src/components/upload/FileUploader.tsx を作成してください。
react-dropzoneを使用し、
- ドラッグ&ドロップ対応
- TSVファイルのみ受け付ける
- アップロード進捗表示
- エラー表示
を実装してください。」
```

**GitHub Copilot に依頼**:
```
「frontend/src/pages/UploadPage.tsx を作成してください。
FileUploaderコンポーネントを使用し、
アップロード後にデータ統計とプレビューを表示するページを作成してください。」
```

作成するファイル:
- `frontend/src/components/upload/FileUploader.tsx`
- `frontend/src/components/upload/DataStatsCards.tsx`
- `frontend/src/components/upload/DataPreview.tsx`
- `frontend/src/pages/UploadPage.tsx`

---

### ✅ Step 4.7: 戦略設定ページ実装

**GitHub Copilot に依頼**:
```
「frontend/src/components/strategy/StrategySelector.tsx を作成してください。
6種類の戦略（WIN, PLACE, BRACKET, WIDE, EXACTA, TRIO）を
カード形式で表示し、選択できるコンポーネントを作成してください。」
```

**GitHub Copilot に依頼**:
```
「frontend/src/components/strategy/ParameterForm.tsx を作成してください。
react-hook-formとzodを使用し、
- betAmount (100-10000)
- topN (1-10)
- scoreThreshold (0.0-1.0)
のパラメータ入力フォームを作成してください。」
```

**GitHub Copilot に依頼**:
```
「frontend/src/pages/StrategyPage.tsx を作成してください。
StrategySelector, ParameterForm, FilterPanelを統合し、
バックテストを実行するページを作成してください。」
```

作成するファイル:
- `frontend/src/components/strategy/StrategySelector.tsx`
- `frontend/src/components/strategy/ParameterForm.tsx`
- `frontend/src/components/strategy/FilterPanel.tsx`
- `frontend/src/pages/StrategyPage.tsx`

---

### ✅ Step 4.8: 結果表示ページ実装

**GitHub Copilot に依頼**:
```
「frontend/src/components/results/SummaryCards.tsx を作成してください。
総投資額、総払戻金、収支、回収率、的中率、的中回数の
6つのカードを表示するコンポーネントを作成してください。」
```

**GitHub Copilot に依頼**:
```
「frontend/src/components/results/ProfitChart.tsx を作成してください。
Rechartsを使用し、収支推移を折れ線グラフで表示する
コンポーネントを作成してください。」
```

**GitHub Copilot に依頼**:
```
「frontend/src/pages/ResultsPage.tsx を作成してください。
SummaryCards, ProfitChart, DetailTableを統合した
結果表示ページを作成してください。」
```

作成するファイル:
- `frontend/src/components/results/SummaryCards.tsx`
- `frontend/src/components/results/ProfitChart.tsx`
- `frontend/src/components/results/RoiChart.tsx`
- `frontend/src/components/results/DetailTable.tsx`
- `frontend/src/pages/ResultsPage.tsx`

---

### ✅ Step 4.9: ルーティング設定

**GitHub Copilot に依頼**:
```
「frontend/src/App.tsx を更新してください。
React RouterのBrowserRouterを使用し、
- / → /upload へリダイレクト
- /upload → UploadPage
- /strategy → StrategyPage
- /results → ResultsPage
のルーティングを設定してください。」
```

**テスト実行**:
```bash
cd frontend
npm run dev
```

**確認**: `http://localhost:5173` にアクセスしてページが表示されること

---

## 📅 Phase 5: 全戦略実装と拡張（Day 8-10: 12-15時間）

### ✅ Step 5.1: 残りの戦略実装

**GitHub Copilot に順次依頼**:
```
「backend/app/services/strategies/place.py を作成してください。
複勝戦略を実装してください。」

「backend/app/services/strategies/bracket.py を作成してください。
馬連戦略を実装してください。」

「backend/app/services/strategies/wide.py を作成してください。
ワイド戦略を実装してください。」

「backend/app/services/strategies/exacta.py を作成してください。
馬単戦略を実装してください。」

「backend/app/services/strategies/trio.py を作成してください。
3連複戦略を実装してください。」
```

各戦略を実装後、BacktestEngineの`_get_strategy()`メソッドを更新

---

### ✅ Step 5.2: データプレビューAPI実装

**GitHub Copilot に依頼**:
```
「backend/app/api/upload.py に GET /api/data/preview エンドポイントを追加してください。
fileId, limit, offset をクエリパラメータで受け取り、
指定範囲のデータを返してください。」
```

---

### ✅ Step 5.3: フィルタ機能実装

**バックエンド**: BacktestEngineの`_apply_filters()`メソッドを実装

**フロントエンド**: FilterPanelコンポーネントを完全実装

---

### ✅ Step 5.4: 追加のグラフ実装

**GitHub Copilot に依頼**:
```
「frontend/src/components/results/HitRateChart.tsx を作成してください。
Rechartsの棒グラフを使用し、競馬場別の的中率を表示してください。」

「frontend/src/components/results/OddsDistributionChart.tsx を作成してください。
ヒストグラムで的中したオッズの分布を表示してください。」
```

---

### ✅ Step 5.5: 詳細データテーブル実装

**GitHub Copilot に依頼**:
```
「frontend/src/components/results/DetailTable.tsx を完全実装してください。
- ページネーション
- ソート機能
- フィルタ機能
- CSVエクスポート
を含めてください。」
```

---

## 📅 Phase 6: 高度な機能実装（Day 11-14: 12-16時間）

### ✅ Step 6.1: 複数戦略一括実行API

**GitHub Copilot に依頼**:
```
「backend/app/api/backtest.py に POST /api/backtest/batch エンドポイントを追加してください。
複数の戦略を一括で実行し、結果を比較できるようにしてください。」
```

---

### ✅ Step 6.2: 戦略比較ページ実装

**GitHub Copilot に依頼**:
```
「frontend/src/pages/ComparePage.tsx を作成してください。
複数のバックテスト結果を並べて比較し、
レーダーチャートで視覚化するページを作成してください。」
```

---

### ✅ Step 6.3: エクスポート機能実装

**バックエンド**: CSV/Excelエクスポート機能

**フロントエンド**: ダウンロードボタン実装

---

### ✅ Step 6.4: パラメータ最適化（オプション）

グリッドサーチで最適なパラメータを探索する機能

---

### ✅ Step 6.5: UI/UX改善

- ダークモード対応
- ローディング状態の改善
- エラーメッセージの改善
- トースト通知の実装
- アニメーション追加

---

## 📅 Phase 7: テストとデバッグ（Day 15-17: 8-10時間）

### ✅ Step 7.1: バックエンドテスト

```bash
cd backend

# テストファイル作成
# tests/test_api/test_upload.py
# tests/test_services/test_strategies.py

# テスト実行
pytest -v

# カバレッジ確認
pytest --cov=app --cov-report=html
```

---

### ✅ Step 7.2: 統合テスト

1. ファイルアップロード → データ確認
2. 戦略設定 → バックテスト実行
3. 結果表示 → グラフ確認
4. フィルタ変更 → 再実行
5. 複数戦略比較

各フローをマニュアルテスト

---

### ✅ Step 7.3: エラーハンドリング確認

- 不正なファイル形式
- 必須カラム不足
- 不正なパラメータ
- ネットワークエラー
- データが見つからない

各エラーケースを確認

---

### ✅ Step 7.4: パフォーマンステスト

- 大量データ（10,000レース以上）での動作確認
- 同時複数戦略実行
- メモリ使用量確認

---

## 📅 Phase 8: ドキュメント整備とデプロイ準備（Day 18-21: 6-8時間）

### ✅ Step 8.1: README作成

- プロジェクト概要
- セットアップ手順
- 使い方
- スクリーンショット

---

### ✅ Step 8.2: コードクリーンアップ

- 不要なコメント削除
- コードフォーマット
- Lint エラー修正
- 未使用のimport削除

```bash
# Backend
cd backend
black app/
ruff check app/ --fix

# Frontend
cd frontend
npm run lint
npm run format
```

---

### ✅ Step 8.3: 本番用設定

- 環境変数の整理
- セキュリティ設定確認
- CORS設定の見直し
- ログ設定

---

### ✅ Step 8.4: Docker対応（オプション）

Dockerfile作成とdocker-compose.yml作成

---

## 🎯 マイルストーン

### Milestone 1: MVP完成（Day 5終了時）
✅ ファイルアップロード機能  
✅ 単勝戦略のバックテスト  
✅ 基本的な結果表示  

**動作確認**: TSVファイルをアップロードし、単勝戦略でバックテストを実行し、結果（ROI、的中率）が表示される

---

### Milestone 2: 全機能実装（Day 10終了時）
✅ 6種類の戦略すべて実装  
✅ フィルタ機能  
✅ 詳細なグラフ表示  
✅ データテーブル表示  

**動作確認**: すべての戦略でバックテストが実行でき、詳細な分析結果が表示される

---

### Milestone 3: 製品版（Day 17終了時）
✅ 戦略比較機能  
✅ エクスポート機能  
✅ テスト完了  
✅ エラーハンドリング完備  

**動作確認**: 製品として使用できるレベルの品質

---

## 📝 開発時のTips

### GitHub Copilotの効果的な使い方

1. **具体的なプロンプト**
   - ❌ 「FileUploaderを作って」
   - ✅ 「react-dropzoneを使用し、TSVファイルのみ受け付け、アップロード進捗を表示するFileUploaderコンポーネントを作成してください。TypeScript型定義とエラーハンドリングを含めてください。」

2. **設計書を参照させる**
   - 「docs/frontend_design.md の FileUploader Component を参照してください」

3. **段階的に作成**
   - まず骨格を作成 → 詳細実装 → エラーハンドリング追加

---

### デバッグ方法

**バックエンド**:
```python
# ログ追加
import logging
logger = logging.getLogger(__name__)
logger.info(f"Data shape: {df.shape}")
```

**フロントエンド**:
```typescript
// コンソールログ
console.log('Upload response:', response);

// React Developer Tools使用
```

---

### よくある問題と解決策

**問題1**: CORSエラー  
**解決**: `backend/app/main.py` のCORS設定を確認

**問題2**: 型エラー  
**解決**: 型定義を明示的に指定

**問題3**: データが取得できない  
**解決**: fileIdが正しく渡されているか確認

---

## ✅ 完成チェックリスト

### 機能
- [ ] TSVファイルアップロード
- [ ] データプレビュー表示
- [ ] 6種類の戦略すべて実装
- [ ] パラメータ設定
- [ ] フィルタ機能
- [ ] バックテスト実行
- [ ] サマリー表示
- [ ] グラフ表示（4種類）
- [ ] 詳細データテーブル
- [ ] 戦略比較（オプション）
- [ ] エクスポート機能（オプション）

### 品質
- [ ] エラーハンドリング実装
- [ ] レスポンシブデザイン
- [ ] ローディング状態表示
- [ ] バリデーション
- [ ] テストコード作成
- [ ] コードフォーマット済み

### ドキュメント
- [ ] README.md作成
- [ ] APIドキュメント（Swagger）
- [ ] コメント記述

---

## 🚀 次のステップ

このロードマップに沿って開発を進めてください！

**開発開始時**:
1. Phase 1 から順番に進める
2. 各Stepを完了したらチェック
3. 動作確認を必ず行う
4. 問題があればドキュメントを参照

**困ったら**:
- `docs/` 配下の設計書を確認
- GitHub Copilot にプロンプトで質問
- Swagger UI (`http://localhost:8000/docs`) でAPI確認

**完成したら**:
- 実際のデータでバックテスト実行
- 最適な戦略を発見
- 結果を分析

頑張って！🎉

---

**作成日**: 2026年1月11日  
**バージョン**: 1.0  
**作成者**: GitHub Copilot Assistant
