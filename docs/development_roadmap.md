# 開発ロードマップ

## 📌 概要

このロードマップは、競馬バックテストシステムを段階的に開発するための具体的な手順書です。
各ステップは **動作確認可能な単位** で区切られており、段階的に機能を追加していきます。

**開発期間目安**: 2-3週間（1日4-6時間作業想定）  
**最終更新日**: 2026年1月13日  
**プロジェクト状態**: ✅ **完成・完了**

---

## 📊 開発状況サマリー

### 全体進捗: 98% → 100% (Phase 1-10完了)

| Phase | タイトル | 進捗率 | 状態 | 完了日 |
|-------|----------|--------|------|--------|
| Phase 1 | 環境セットアップ | 100% | ✅ 完了 | 2026/01/10 |
| Phase 2 | バックエンド基盤構築 | 100% | ✅ 完了 | 2026/01/10 |
| Phase 3 | バックエンドAPI実装 | 100% | ✅ 完了 | 2026/01/10 |
| Phase 4 | フロントエンド基本実装 | 100% | ✅ 完了 | 2026/01/10 |
| Phase 5 | 全戦略実装と拡張 | 100% | ✅ 完了 | 2026/01/11 |
| Phase 6 | パラメータ最適化機能 | 100% | ✅ 完了 | 2026/01/11 |
| Phase 7 | 高度な分析機能 | 100% | ✅ 完了 | 2026/01/13 |
| Phase 8 | テストとデバッグ | 100% | ✅ 完了 | 2026/01/13 |
| Phase 9 | ドキュメント整備 | 100% | ✅ 完了 | 2026/01/13 |
| Phase 10 | モダンUI改善 + ドキュメント | 100% | ✅ 完了 | 2026/01/13 |

### マイルストーン達成状況

- ✅ **Milestone 1: MVP完成** (Phase 1-3) - **100% 達成** (2026/01/10)
  - ファイルアップロード機能
  - 6種類の戦略全て実装 (単勝・複勝・馬連・ワイド・馬単・三連複)
  - 基本的な結果表示 (グラフ・テーブル)
  - データ永続化 (24時間保持)

- ✅ **Milestone 2: 利益最適化機能** (Phase 4-6) - **100% 完了** (2026/01/11)
  - ✅ 基本UI実装
  - ✅ パラメータ設定UI (FR-004)
  - ✅ フィルタ設定機能 (FR-005)
  - ✅ グリッドサーチ実装 (FR-007) - Phase 7で実装完了

- ✅ **Milestone 3: データドリブン最適化** (Phase 7-8) - **100% 達成** (2026/01/13)
  - ✅ グリッドサーチ機能 (FR-007) - パラメータ組み合わせ自動最適化
  - ✅ 追加グラフ (FR-009) - ROI推移、的中率分析、オッズ分布
  - ✅ テーブル拡張 (FR-010) - ページネーション(50件/ページ)、全列ソート、CSVエクスポート
  - ✅ 戦略比較機能 (FR-011) - 複数戦略並列実行、レーダーチャート、比較テーブル
  - ✅ バグ修正完了 - CORS、型定義、戦略比較エラー、距離分類変更(1000-1600m/1700m以上)、二軸グラフ

- ✅ **Milestone 4: モダンUI** (Phase 10) - **100% 達成** (2026/01/13)
  - ✅ カード型レイアウト実装
  - ✅ 2カラムグリッドシステム実装
  - ✅ Accordionコンポーネント実装
  - ✅ FilterPanel視覚フィードバック強化 (色変更・スケール・シャドウ)
  - ✅ Animationシステム (slideDown, fadeIn, scaleIn)

- ✅ **Milestone 5: ドキュメント完成** (Phase 9-10) - **100% 達成** (2026/01/13)
  - ✅ ユーザーガイド (USER_GUIDE.md)
  - ✅ システム概要 (SYSTEM_OVERVIEW.md)
  - ✅ プロジェクトREADME (README.md)
  - ✅ 全要件・設計ドキュメント統一

- ✅ **Milestone 4: プロダクション準備** (Phase 9) - **100% 完了** (2026/01/13)
  - ✅ 設計ドキュメント更新 (requirements.md, api_design.md, frontend_design.md)
  - ✅ プロジェクト管理ドキュメント更新 (development_roadmap.md)
  - ✅ アーキテクチャドキュメント更新 (system_design.md, directory_structure.md)
  - ✅ ユーザードキュメント更新 (frontend/README.md)

- 🚧 **Milestone 5: モダンUI** (Phase 10) - **20% 進行中**
  - 🚧 カード型レイアウト導入
  - 🚧 2カラムグリッドシステム
  - ⏳ アコーディオン/折りたたみ機能
  - ⏳ ホバーエフェクト・トランジション
  - ⏳ 視覚的ヒエラルキーの改善
  - ✅ 設計ドキュメント更新 (requirements.md, api_design.md, frontend_design.md)
  - 🚧 プロジェクト管理ドキュメント更新 (development_roadmap.md進行中)
  - ⏳ アーキテクチャドキュメント更新 (system_design.md, directory_structure.md)
  - ⏳ ユーザードキュメント更新 (frontend/README.md)

### 重要な実装機能 (要件定義ベース)

**P0 (必須) - 利益最適化に必要**
- ✅ FR-004: パラメータ設定 (購入金額範囲、N頭数、スコア閾値、軸馬) - 完了 (2026/01/11)
- ✅ FR-005: フィルタ設定 (競馬場、馬場、距離、日付、オッズ範囲) - 完了 (2026/01/11)
- ✅ FR-007: グリッドサーチ (複数パラメータ組み合わせ自動実行) - 完了 (2026/01/13)

**P1 (推奨)**
- ✅ FR-009: 追加グラフ (ROI推移、的中率分析、オッズ分布) - 完了 (2026/01/13)
- ✅ FR-010: テーブル拡張 (ページネーション、ソート、CSV/Excelエクスポート) - 完了 (2026/01/13)
- ✅ FR-011: 戦略比較 (複数戦略並列実行、レーダーチャート) - 完了 (2026/01/13)

**P2 (将来対応)**
- ❌ FR-012: レポート生成 (PDF/HTML)
- ❌ NFR-003: ダークモード対応
- ❌ NFR-007: ユニットテスト (カバレッジ70%以上)

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

**状態**: ✅ 完了 (2026/01/10)  
**進捗**: 100%

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

**状態**: ✅ 完了 (2026/01/10)  
**進捗**: 100%

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
**状態**: ✅ 完了 (2026/01/10)  
**進捗**: 100%


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
**状態**: 🚧 進行中  
**進捗**: 70%


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
実装状況**: ❌ 未実装 (App.tsxのuseStateで代用中)

~~**GitHub Copilot に依頼**:~~
~~「frontend/src/store/uploadStore.ts を作成してください。~~
~~Zustandを使用して、~~
~~- file: File | null~~
~~- fileId: string | null~~
~~- dataStats: DataStats | null~~
~~- isUploading: boolean~~
~~- error: string | null~~
~~の状態と、それらを更新するアクションを定義してください。」~~

**注**: 現状はApp.tsxのuseStateで状態管理しているため、Zustand導入は後回し

作成するファイル:
- `frontend/src/store/uploadStore.ts` ❌
- `frontend/src/store/strategyStore.ts` ❌
- `frontend/src/store/resultsStore.ts` ❌
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
「f実装状況**: ❌ 未実装 (Phase 6で実装予定)

**GitHub Copilot に依頼**:
```
「frontend/src/components/strategy/ParameterForm.tsx を作成してください。
react-hook-formとzodを使用し、
- betAmount (100-10000) - スライダー
- topN (1-10) - セレクトボックス
- scoreThreshold (0.0-1.0) - スライダー
- pivotHorse (オプション) - 馬番入力
のパラメータ入力フォームを作成してください。
FR-004要件に準拠omponents/strategy/ParameterForm.tsx を作成してください。
react-hook-formとzodを使用し、
- 実装状況**: ❌ 未実装 (1ページ構成のためページ分割なし)

~~**GitHub Copilot に依頼**:~~
~~「frontend/src/pages/StrategyPage.tsx を作成してください。~~
~~StrategySelector, ParameterForm, FilterPanelを統合し、~~
~~バックテストを実行するページを作成してください。」~~

**注**: 現状はApp.tsxに全て統合されているため、ページ分割は不要

作成するファイル:
- ✅ `frontend/src/components/StrategySelector.tsx` (完了)
- ❌ `frontend/src/components/strategy/ParameterForm.tsx` (未実装 → Phase 6)
- ❌ `frontend/src/components/strategy/FilterPanel.tsx` (未実装 → Phase 6)
- ❌ `frontend/src/pages/StrategyPage.tsx` (不要)

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

**状態**: 🚧 進行中  
**進捗**: 50%

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
```

---

### ✅ Step 5.2: データプレビューAPI実装

**実装状況**: ✅ 完了 (Phase 3で実装済み)

**実装内容**: backend/app/api/upload.py に GET /api/data/preview エンドポイント実装完了。fileId, limit, offset をクエリパラメータで受け取り、指定範囲のデータを返す。ページネーション対応済み。

---

### ✅ Step 5.3: フィルタ機能実装 (FR-005)

**実装状況**: ✅ 完了 (Phase 6で実装完了: 2026/01/11)

**バックエンド**: BacktestEngineの`_apply_filters()`メソッドを実装完了
- ✅ 競馬場フィルタ (複数選択)
- ✅ 馬場タイプフィルタ (芝/ダート)
- ✅ 距離範囲フィルタ
- ✅ 日付範囲フィルタ
- ✅ オッズ範囲フィルタ

**フロントエンド**: FilterForm.tsx でUI実装完了

---

### ✅ Step 5.4: 追加グラフ実装 (FR-009)

**実装状況**: ✅ 完了 (Phase 7で実装完了: 2026/01/13)
- ✅ 利益推移グラフ (ProfitChart.tsx) - Phase 5で完了
- ✅ ROI推移グラフ (RoiChart.tsx) - Phase 7で実装完了、100%基準線付き
- ✅ 的中率分析 (HitRateChart.tsx) - Phase 7で実装完了、3タブ (競馬場別・距離別・馬場別)、距離分類: 1000-1600m / 1700m以上
- ✅ オッズ分布ヒストグラム (OddsDistributionChart.tsx) - Phase 7で実装完了、二軸グラフ: 的中回数 (左軸) + 払戻総額 (右軸)
「frontend/src/components/results/RoiChart.tsx を作成してください。
Rechartsの折れ線グラフを使用し、ROI推移を表示してください。」

「frontend/src/components/results/HitRateChart.tsx を作成してください。
Rechartsの棒グラフを使用し、競馬場別・距離別（1000～1600m / 1700m以上）・馬場別の的中率を
タブ切り替えで表示してください。」

「f実装状況**:
- ✅ ResultsTable.tsx - 基本実装完了
- ❌ ページネーション (50件/ページ) - 未実装
- ❌ ソート機能 - 未実装
- ❌ CSVエクスポート - 未実装
- ❌ Excelエクスポート - 未実装

**GitHub Copilot に依頼**:
```
「frontend/src/components/results/ResultsTable.tsx を拡張してください。
- react-table を使用したソート機能
- ページネーション (50件/ページ)
- CSV/Excelエクスポートボタン
を追加してください。」
```

--目的**: ユーザーが購入条件を細かく設定できるようにする

#### Step 6.1.1: バックエンドスキーマ拡張

**GitHub Copilot に依頼**:
```
「backend/app/schemas/strategy.py の StrategyConfig を拡張してください。
以下のフィールドを追加:
- bet_amount_min: int = 100  # 最小購入金額
- bet_amount_max: int = 100  # 最大購入金額
- top_n: int = 1  # 上位N頭まで購入
- score_threshold: float = 0.0  # 予測スコア閾値
- pivot_horse: Optional[int] = None  # 軸馬の馬番
#### Step 7.1.1: バックエンド追加データ生成

**GitHub Copilot に依頼**:
```
「backend/app/services/backtest_engine.py に以下のメソッドを追加してください。
- _calculate_roi_timeline(): ROI推移データ生成
- _calculate_hit_rate_by_venue(): 競馬場別的中率
- _calculate_hit_rate_by_distance(): 距離別的中率
- _calculate_hit_rate_by_surface(): 馬場別的中率
- _calculate_odds_distribution(): 的中オッズ分布 (ヒストグラム用)

BacktestResultスキーマにこれらのデータを追加してください。」
```

#### Step 7.1.2: フロントエンド グラフコンポーネント作成

**GitHub Copilot に依頼**:
```
「以下のグラフコンポーネントを作成してください。

1. frontend/src/components/results/RoiChart.tsx
   - Recharts折れ線グラフ
   - ROI推移を表示

2. frontend/src/components/results/HitRateChart.tsx
  GitHub Copilot に依頼**:
```
「frontend/src/components/comparison/StrategyComparisonView.tsx を作成してください。
- 複数戦略の結果をサイド・バイ・サイド表示
- 比較テーブル (ROI, 的中率, 収支等)
- Rechartsレーダーチャート (6軸: ROI, 的中率, 総収支, 的中回数, 平均払戻, リスク)
- 利益推移グラフ (複数戦略を1つのグラフに重ねて表示)

App.tsx に「比較」タブを追加してください。」
```

**ファイル**: 
- `frontend/src/components/comparison/StrategyComparisonView.tsx`
- `frontend/src/components/comparison/ComparisonTable.tsx`
- `frontend/src/components/comparison/ComparisonRadarChart.tsx`

**確認**: 複数戦略を同時実行して結果を比較できること

---

### ❌ Step 7.4: データプレビュー実装

**GitHub Copilot に依頼**:
```
「backend/app/api/upload.py に GET /api/data/preview エンドポイントを追加してください。
クエリパラメータ:
- file_id: str
- limit: int = 50
- offset: int = 0

指定範囲のデータをJSON形式で返してください。」

「frontend/src/components/upload/DataPreview.tsx を作成してください。
アップロード後にデータの先頭50件をテーブル表示するコンポーネントです。」
```

**確認**: アップロード後にデータプレビューが表示されること

---

**確認**: テストカバレッジが70%以上であること

---

### ❌ Step 8.2: フロントエンドテスト

**GitHub Copilot に依頼**:
```
「frontend/src/components/__tests__/ 配下にテストファイルを作成してください。
- UploadSection.test.tsx
- StrategySelector.test.tsx
- ResultsTable.test.tsx

React Testing Library と Vitest を使用してください。」
```

**必要パッケージ**:
```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**確認**: 全てのフローが正常に動作すること

---

### ⚠️ Step 8.4NFR-003)
- ✅ ローディング状態の改善 (完了)
- ✅ エラーメッセージの改善 (完了)
- ❌ トースト通知の実装 (react-hot-toast 使用)
- ⚠️ アニメーション追加 (部分的)

**GitHub Copilot に依頼**:
```
「ダークモード対応を実装してください。
- TailwindのdarkMode設定
- ダークモード切り替えボタン
- localStorage にテーマ保存
- すべてのコンポーネントでdark:クラス追加」

「react-hot-toastを使用してトースト通知を実装してください。
- 成功通知 (アップロード成功、バックテスト完了)
- エラー通知 (ファイル形式エラー、実行エラー)」
```

**必要パッケージ**:
**実装状況**: ⚠️ 部分的に完了

---

### ❌ Step 8.5act-hot-toast
```

---
**確認**: 大量データでも快適に動作すること

---

## 📅 Phase 9: ドキュメント整備とデプロイ準備（Day 20-21: 6-8時間）

**状態**: 📋 未着手  
**進捗**: 5%  
**優先度**: P2 (将来対応)

### ❌ Step 9
**優先度**: P1 (推奨)

### ❌ Step 8または TanStack Table を使用してください。」
```

#### Step 7.2.2: ソート機能実装

**GitHub Copilot に依頼**:
```
「ResultsTable.tsx にソート機能を追加してください。
- 各カラムヘッダーをクリックでソート
- 昇順/降順切り替え
- ソートインジケーター表示」
```

#### Step 7.2.3: エクスポート機能実装

**GitHub Copilot に依頼**:
```
「ResultsTable.tsx にエクスポート機能を追加してください。
- CSVエクスポート: papaparse 使用
- Excelエクスポート: xlsx 使用
- ダウンロードボタン追加」
```

**必要パッケージ**:
```bash
cd frontend
npm install papaparse xlsx
npm install -D @types/papaparse
```

**確認**: ページネーション、ソート、エクスポートが動作すること

---

### ❌ Step 7.3: 戦略比較機能実装 (FR-011)

#### Step 7.3.1: バックエンド複数戦略一括実行API

**GitHub Copilot に依頼**:
```
「backend/app/api/backtest.py に POST /api/backtest/batch エンドポイントを追加してください。
リクエストボディ:
- strategies: list[StrategyConfig] (複数戦略の設定)

各戦略を並列実行し、結果をまとめて返してください。
結果には戦略名も含めてください。」
```

**ファイル**: `backend/app/api/backtest.py`

#### Step 7.3.2: フロントエンド 戦略比較コンポーネントtrategy/ParameterForm.tsx を作成してください。
- 購入金額範囲: スライダー (100-10000円)
- 上位N頭: セレクトボックス (1-10頭)
- スコア閾値: スライダー (0.0-1.0)
- 軸馬設定: 馬番入力フィールド (オプション)
各パラメータの説明ツールチップも追加してください。」
```

**ファイル**: `frontend/src/components/strategy/ParameterForm.tsx`

**確認**: パラメータ設定UIが表示され、値が変更できること

---

### ❌ Step 6.2: フィルタ設定UI実装 (FR-005)

**目的**: レース条件で絞り込んでバックテストできるようにする

#### Step 6.2.1: バックエンドフィルタロジック実装

**GitHub Copilot に依頼**:
```
「backend/app/services/backtest_engine.py の _apply_filters() メソッドを実装してください。
RaceFilterスキーマを受け取り、以下のフィルタを適用:
- racecourses: list[str] - 競馬場リスト
- surfaces: list[str] - 馬場タイプ (芝/ダート)
- distance_min, distance_max: int - 距離範囲
- date_from, date_to: str - 日付範囲 (YYYYMMDD)
- odds_min, odds_max: float - オッズ範囲
Pandasのquery()を使用してください。」
```

**ファイル**: `backend/app/services/backtest_engine.py`

#### Step 6.2.2: フロントエンド FilterPanel 作成

**GitHub Copilot に依頼**:
```
「frontend/src/components/strategy/FilterPanel.tsx を作成してください。
- 競馬場選択: チェックボックスグループ (東京, 中山, 阪神, 京都, 中京, 新潟, 福島, 小倉, 札幌, 函館)
- 馬場タイプ: チェックボックス (芝, ダート)
- 距離範囲: 範囲スライダー (1000m-3600m)
- 日付範囲: 日付ピッカー (開始日〜終了日)
- オッズ範囲: 範囲スライダー (1.0-100.0)
折りたたみ可能なアコーディオンUIにしてください。」
```

**ファイル**: `frontend/src/components/strategy/FilterPanel.tsx`

**確認**: フィルタUIが表示され、条件を設定してバックテスト実行できること

---

### ❌ Step 6.3: グリッドサーチ機能実装 (FR-007)

**目的**: 複数のパラメータ組み合わせを自動的に試して最適解を発見

#### Step 6.3.1: バックエンドグリッドサーチAPI

**GitHub Copilot に依頼**:
```
「backend/app/api/backtest.py に POST /api/backtest/grid-search エンドポイントを追加してください。
リクエストボディ:
- strategy_type: str
- param_ranges: dict (例: {"top_n": [1,2,3], "score_threshold": [0.5, 0.7, 0.9]})
- filters: RaceFilter

すべての組み合わせでバックテストを実行し、
ROI降順でソートした結果リストを返してください。
進捗状況も返せるようにしてください。」
```

**ファイル**: `backend/app/api/backtest.py`

#### Step 6.3.2: フロントエンド GridSearch コンポーネント

**GitHub Copilot に依頼**:
```
「frontend/src/components/strategy/GridSearchPanel.tsx を作成してください。
- 各パラメータの範囲指定UI
**確認**: README.md が完成していること

---

### ⚠️ Step 9順に表示)
- 最適パラメータのハイライト表示
を実装してください。」
```

**ファイル**: `frontend/src/components/strategy/GridSearchPanel.tsx`

**確認**: グリッドサーチを実行して、最適なパラメータの組み合わせが発見できること

---

### ❌ Step 6.4: App.tsx への統合

**GitHub Copilot に依頼**:
```
「frontend/src/App.tsx を更新してください。
StrategySelector の下に以下を追加:
**実装状況**: ⚠️ 部分的に完了

**確認**: Lintエラーが0件であること

---

### ❌ Step 9hPanel コンポーネント (タブ切り替え)

通常実行とグリッドサーチをタブで切り替えられるようにしてください。」
```

**確認**: 全てのパラメータ・フィルタ・グリッドサーチUIが統合されていること

---

## 📅 Phase 7: 高度な分析機能（Day 14-16: 10-12時間）

**状態**: 📋 未着手  
**進捗**: 0%  
**優先度**: P1 (推奨)

このPhaseは **要件定義のFR-009, FR-010, FR-011** を実装します。

### ❌ Step 7.1: 追加グラフ実装 (FR-009)R-005, FR-007** を実装します。

### ❌ Step 6.1: パラメータ設定UI実装 (FR-004)
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

**確認**: 本番環境用の設定が整っていること

---

**GitHub Copilot に依頼**:
```
「Dockerfile と docker-compose.yml を作成してください。
- backend: Python FastAPI
- frontend: Nginx でビルド済みアプリを配信
- 環境変数は .env から読み込み」
```

**確認**: `docker-compose up` でアプリが起動すること

---

### ❌ Step 9.5: レポート生成機能 (FR-012) - オプション

**GitHub Copilot に依頼**:
```
「backend/app/api/report.py を作成してください。
POST /api/report/generate エンドポイント:
- result_id: str を受け取る
- PDF または HTML でレポートを生成
- サマリー、グラフ、詳細テーブルを含める
- reportlab または weasyprint を使用」
```

**必要パッケージ**:
```bash
cd backend
pip install reportlab weasyprint
```

---

## 🎯 マイルストーン

### ✅ Milestone 1: MVP完成（2026/01/10完了）
- ✅ ファイルアップロード機能  
- ✅ 6種類の戦略全て実装  
- ✅ 基本的な結果表示 (グラフ・テーブル)
- ✅ データ永続化 (24時間保持)

**動作確認**: TSVファイルをアップロードし、6種類の戦略でバックテストを実行し、結果が表示される ✅

---

### 🚧 Milestone 2: 利益最適化機能（Phase 6完了時）
- ✅ 基本UI実装
- ❌ パラメータ設定UI (FR-004)
- ❌ フィルタ設定機能 (FR-005)
- ❌ グリッドサーチ (FR-007)

**目標**: パラメータとフィルタを調整して、利益が最大化できる買い方を発見できる

**動作確認**: 
1. パラメータ(購入金額、N頭数、スコア閾値)を設定してバックテスト実行
2. フィルタ(競馬場、馬場、距離等)を設定してバックテスト実行
3. グリッドサーチで最適パラメータを自動発見

---

### 📋 Milestone 3: 完全版（Phase 7完了時）
- ❌ 追加グラフ4種類 (FR-009)
- ❌ テーブル拡張 (ページネーション、ソート、エクスポート) (FR-010)
- ❌ 戦略比較機能 (FR-011)
- ❌ データプレビュー
- ❌ UI/UX改善 (ダークモード、トースト通知)

**目標**: 詳細な分析と複数戦略の比較ができる

**動作確認**: すべての戦略を比較し、最も優れた戦略を判断できる

---

### 📋 Milestone 4: 製品版（Phase 9完了時）
- ❌ ユニットテスト (カバレッジ70%以上)
- ❌ 統合テスト完了
- ⚠️ エラーハンドリング完備
- ❌ README・ドキュメント完成
- ❌ Docker対応

**目標**: 製品として使用できるレベルの品質

**動作確認**: 全機能が安定動作し、ドキュメントが整備されている
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

---Phase 1-3: MVP (完了)
- [x] TSVファイルアップロード (FR-001)
- [x] 6種類の戦略すべて実装 (FR-003)
- [x] バックテスト実行 (FR-006)
- [x] サマリー表示 (FR-008)
- [x] 利益推移グラフ (FR-009部分)
- [x] 詳細データテーブル基本版 (FR-010部分)
- [x] データ永続化 (24時間保持)

### Phase 4-5: 拡張機能 (進行中)
- [x] 基本UI実装
- [x] StatisticsCards (データ統計表示)
- [x] ResultsSummary (結果サマリー)
- [ ] データプレビュー表示 (FR-002)
- [ ] ページネーション (FR-010)
- [ ] ソート機能 (FR-010)

### Phase 6: パラメータ最適化 (未着手) - P0必須
- [ ] パラメータ設定UI (FR-004)
  - [ ] 購入金額範囲スライダー
  - [ ] 上位N頭セレクト
  - [ ] スコア閾値スライダー
  - [ ] 軸馬設定
- [ ] フィルタ機能 (FR-005)
  - [ ] 競馬場選択
  - [ ] 馬場タイプ選択
  - [ ] 距離範囲設定
  - [ ] 日付範囲設定
  - [ ] オッズ範囲設定
- [ ] グリッドサーチ (FR-007)
  - [ ] パラメータ範囲指定UI
  - [ ] 自動最適化実行
  - [ ] 最適解表示

### Phase 7: 高度な分析 (未着手) - P1推奨
- [ ] 追加グラフ (FR-009)
  - [x] 利益推移グラフ
  - [ ] ROI推移グラフ
  - [ ] 的中率分析 (競馬場別・距離別・馬場別)
  - [ ] オッズ分布ヒストグラム
- [ ] テーブル拡張 (FR-010)
  - [ ] ページネーション (50件/ページ)
  - [ ] ソート機能
  - [ ] CSVエクスポート
  - [ ] Excelエクスポート
- [ ] 戦略比較 (FR-011)
  - [ ] 複数戦略一括実行
  - [ ] 比較テーブル
  - [ ] レーダーチャート

### Phase 8-9: 品質・ドキュメント (未着手)
- [ ] エラーハンドリング実装
## 📝 開発履歴

### 2026/01/10
- ✅ Phase 1完了: 環境セットアップ
- ✅ Phase 2完了: バックエンド基盤構築
- ✅ Phase 3完了: バックエンドAPI実装
- ✅ 6種類の戦略全て実装 (WIN, PLACE, BRACKET, WIDE, EXACTA, TRIO)
- ✅ フロントエンドUI実装 (React + TypeScript + Tailwind CSS)
- ✅ データ永続化機能追加 (ディスク保存 + 24時間保持)
- ✅ **Milestone 1 (MVP) 達成**

### 2026/01/11
- 📋 要件定義とロードマップの照合
- 📋 未実装機能の洗い出し
- 📋 Phase 6-9の詳細計画追加
- 📋 進捗管理セクション追加
- ✅ **Phase 6完了**: パラメータ最適化機能 (FR-004, FR-005)
  - ✅ ParameterForm: 購入金額、N頭数、スコア閾値、軸馬設定
  - ✅ FilterPanel: 競馬場、馬場、距離、日付、オッズフィルタ
  - ✅ バックエンドフィルタロジック実装
  - ✅ App.tsx統合
- ✅ **Milestone 2 (利益最適化機能) 達成**

### 次回作業予定
- 🎯 Phase 7: 高度な分析機能の実装
  - Step 7.0: グリッドサーチ機能 (FR-007)
  - Step 7.1: 追加グラフ (ROI推移、的中率分析、オッズ分布)
  - Step 7.2: テーブル拡張 (ページネーション、ソート、エクスポート)
  - Step 7.3: 戦略比較機能

---

**作成日**: 2026年1月11日  
**最終更新**: 2026年1月11日  
**バージョン**: 2状態表示
- [x] バリデーション (部分的)
- [ ] テストコード作成 (カバレッジ70%以上)
- [ ] コードフォーマット済み
- [ ] README.md作成
- [x] APIドキュメント (Swagger)
- [ ] コメント記述

### オプション機能 (P2)
- [ ] レポート生成 (FR-012)
- [ ] ダークモード対応 (NFR-003)
- [ ] トースト通知
- [ ] Docker対応
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
