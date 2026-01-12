# Kirisame Race BackTest

[![Phase 10](https://img.shields.io/badge/Phase-10-brightgreen)](docs/development_roadmap.md)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-blue)](https://www.python.org/)
[![Node.js 16+](https://img.shields.io/badge/Node.js-16+-blue)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 競馬予測モデルのバックテストプラットフォーム

**Kirisame Race BackTest** は、競馬レースデータを活用して、複数の投資戦略を科学的にシミュレーション・比較・最適化できるWebアプリケーションです。

---

## 🎯 主な特徴

- ✅ **複数賭式対応**: 単勝・複勝・馬連・ワイド・馬単・三連複の6種類に対応
- 📊 **高度な分析**: ROI、的中率、利益推移、オッズ分布などを可視化
- 🔍 **グリッドサーチ**: 投資パラメータの最適組合せを自動探索
- 🔄 **戦略比較**: 複数の投資戦略を並べて比較検証
- 🎛️ **柔軟なフィルタ**: 競馬場・馬場・距離・オッズ条件で細かく絞り込み
- ⚡ **高速処理**: 1000+レースのバックテストを数秒で完了

---

## 📚 ドキュメント

| ドキュメント | 対象者 | 内容 |
|----------|--------|------|
| [ユーザーガイド](docs/USER_GUIDE.md) | **一般ユーザー** | システムの目的・機能・使い方・FAQ |
| [システム概要](docs/SYSTEM_OVERVIEW.md) | **技術者** | アーキテクチャ・データフロー・API仕様 |
| [要件仕様](docs/requirements.md) | **開発者** | 機能要件・非機能要件・制約条件 |
| [API設計](docs/api_design.md) | **API開発者** | エンドポイント詳細・リクエスト/レスポンス仕様 |
| [フロントエンド設計](docs/frontend_design.md) | **フロントエンド開発者** | UI/UX設計・レイアウト・コンポーネント |
| [システム設計](docs/system_design.md) | **システムアーキテクト** | 全体設計・技術スタック・DBスキーマ |
| [開発ロードマップ](docs/development_roadmap.md) | **プロジェクト管理者** | Phase進捗・マイルストーン・完成度 |
| [ディレクトリ構造](docs/directory_structure.md) | **開発者** | フォルダ構成・ファイル説明 |

**📖 最初に読むべきドキュメント**:
1. 一般ユーザー → [ユーザーガイド](docs/USER_GUIDE.md)
2. 技術者 → [システム概要](docs/SYSTEM_OVERVIEW.md)
3. 開発者 → [API設計](docs/api_design.md) + [フロントエンド設計](docs/frontend_design.md)

---

## 🚀 クイックスタート

### 前提条件

- Python 3.10 以上
- Node.js 16 以上（npm）
- Git

### インストール

#### 1. リポジトリクローン

```bash
git clone <repository-url>
cd KirisameRaceBackTest
```

#### 2. バックエンド環境構築

```bash
cd backend

# 仮想環境作成
python -m venv venv

# 仮想環境有効化
source venv/Scripts/activate  # Windows
# または
source venv/bin/activate      # macOS/Linux

# 依存パッケージインストール
pip install -r requirements.txt
```

#### 3. フロントエンド環境構築

```bash
cd ../frontend

# 依存パッケージインストール
npm install
```

### 実行

#### ターミナル1: バックエンド起動

```bash
cd backend
source venv/Scripts/activate  # 仮想環境有効化
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

出力例:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete
```

#### ターミナル2: フロントエンド起動

```bash
cd frontend
npm run dev
```

出力例:
```
  VITE v5.4.21  ready in 245 ms

  ➜  Local:   http://localhost:5174/
  ➜  press h to show help
```

#### 3. ブラウザで開く

```
http://localhost:5174
```

---

## 💡 使い方の流れ

```
1. TSVファイルをアップロード
       ↓
2. 競馬場・馬場などのフィルタ設定
       ↓
3. 投資戦略設定（賭式・パラメータ）
       ↓
4. バックテスト実行
       ↓
5. 結果分析（ROI・的中率・グラフ表示）
       ↓
6. グリッドサーチで最適パラメータ探索
       ↓
7. 複数戦略を比較検証
```

詳細は [ユーザーガイド](docs/USER_GUIDE.md) を参照

---

## 🏗️ システム構成

### バックエンド

- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn
- **Language**: Python 3.10+
- **Key Libraries**:
  - pandas: データ処理
  - numpy: 数値計算
  - pydantic: データバリデーション

### フロントエンド

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5.4.21
- **Styling**: Tailwind CSS 3.3.6
- **Charts**: Recharts 2.12.7
- **Icons**: Lucide React 0.408.0

### その他

- **CORS対応**: 開発環境 (localhost:5174)
- **データ保持期間**: 24時間（アップロード後自動削除）

---

## 📊 データフォーマット

アップロード対象: **TSV形式**（Tab-Separated Values）

### 必須カラム（例）

```
日付	競馬場	レース	距離	馬場	馬番	馬名	予想オッズ	予測ランク	着順	配当
2024-01-01	中山	1	1600	芝	2	キタサンブラック	2.50	1	1	250
2024-01-01	中山	1	1600	芝	5	トーセンスナップ	5.20	2	2	0
...
```

詳細は [ユーザーガイド - データアップロード](docs/USER_GUIDE.md#📍-ステップ1データアップロード) を参照

---

## 🔌 API エンドポイント

| Method | Endpoint | 機能 |
|--------|----------|------|
| POST | `/api/upload` | ファイルアップロード |
| POST | `/api/backtest` | バックテスト実行 |
| POST | `/api/grid-search` | グリッドサーチ実行 |
| POST | `/api/compare` | 戦略比較 |
| GET | `/api/health` | ヘルスチェック |

詳細は [API設計](docs/api_design.md) を参照

---

## 📁 プロジェクト構造

```
KirisameRaceBackTest/
├── docs/
│   ├── USER_GUIDE.md              # ユーザーマニュアル
│   ├── SYSTEM_OVERVIEW.md         # システム概要
│   ├── requirements.md            # 要件仕様
│   ├── api_design.md              # API設計
│   ├── frontend_design.md         # フロントエンド設計
│   ├── system_design.md           # システム設計
│   ├── development_roadmap.md     # 開発ロードマップ
│   └── directory_structure.md     # ディレクトリ構造
├── backend/
│   ├── app/
│   │   ├── main.py               # メインアプリケーション
│   │   ├── config.py             # 設定管理
│   │   ├── routers/
│   │   │   ├── upload.py         # アップロードエンドポイント
│   │   │   ├── backtest.py       # バックテストエンドポイント
│   │   │   ├── grid_search.py    # グリッドサーチエンドポイント
│   │   │   └── compare.py        # 戦略比較エンドポイント
│   │   ├── models/
│   │   │   ├── data_models.py    # データ構造
│   │   │   └── response_models.py# レスポンス形式
│   │   └── services/
│   │       ├── data_store.py     # データ保管
│   │       ├── backtest_engine.py# バックテストロジック
│   │       └── optimizer.py      # 最適化ロジック
│   ├── venv/                      # 仮想環境
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/           # Reactコンポーネント
│   │   ├── contexts/             # React Context
│   │   ├── types/                # TypeScript型定義
│   │   ├── App.tsx               # メインアプリケーション
│   │   ├── App.css               # スタイル
│   │   └── main.tsx              # エントリーポイント
│   ├── public/                   # 静的ファイル
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── .gitignore
└── README.md                      # このファイル
```

詳細は [ディレクトリ構造](docs/directory_structure.md) を参照

---

## 🧪 テスト

### バックエンド

```bash
cd backend
pytest tests/ -v
```

### フロントエンド

```bash
cd frontend
npm run test
```

---

## 🐛 トラブルシューティング

### よくある問題

#### ❌ "Failed to upload file"
- ファイルがTSV形式か確認
- 必須カラムが揃っているか確認
- ファイルサイズが100MB以下か確認

詳細は [ユーザーガイド - トラブルシューティング](docs/USER_GUIDE.md#トラブルシューティング) を参照

#### ❌ "Connection refused"
- バックエンドサーバーが起動しているか確認
- ポート8000が使用可能か確認
```bash
# ポート確認
netstat -ano | findstr 8000
```

#### ❌ "CORS error"
- フロントエンドが `http://localhost:5174` で起動しているか確認
- バックエンドのCORS設定を確認

---

## 📈 パフォーマンス

| 操作 | データサイズ | 実行時間 |
|------|----------|--------|
| アップロード | 100MB | 1〜3秒 |
| バックテスト | 1000レース | 0.5〜2秒 |
| グリッドサーチ | 100組合せ | 30〜120秒 |
| 戦略比較 | 5戦略 | 2〜10秒 |

---

## 🤝 コントリビューション

バグ報告や機能リクエストは、GitHubのIssueでお知らせください。

プルリクエストも大歓迎です！

### 開発ワークフロー

1. Issue作成 (何をしたいか説明)
2. ブランチ作成 (`git checkout -b feature/xxx`)
3. コード実装
4. テスト実行
5. コミット (`git commit -m "fix: xxx"`)
6. プッシュ (`git push origin feature/xxx`)
7. プルリクエスト作成

---

## 📝 ライセンス

MIT License - [LICENSE](LICENSE) を参照

---

## 📧 サポート

- **ドキュメント**: [docs/](docs/)
- **Issue報告**: GitHub Issues
- **質問**: GitHub Discussions

---

## 🎉 謝辞

このプロジェクトは、競馬データ分析コミュニティからのフィードバックを基に開発されました。

---

## 📅 更新履歴

### Phase 10 (2026-01-13)
- ✅ モダンUI実装（カード型レイアウト + 2カラムグリッド）
- ✅ Accordionコンポーネント追加
- ✅ FilterPanel視覚フィードバック強化
- ✅ ユーザーガイド・システム概要ドキュメント作成
- ✅ 全機能完成

### Phase 9 (2026-01-13)
- ✅ 包括的なドキュメント更新
- ✅ システム設計最適化

### Phase 7-8 (2026-01-13)
- ✅ グリッドサーチ実装
- ✅ 追加グラフ実装
- ✅ 戦略比較機能実装
- ✅ バグ修正 (CORS, 型定義等)

詳細は [開発ロードマップ](docs/development_roadmap.md) を参照

---

**バージョン**: Phase 10  
**最終更新**: 2026年1月13日  
**ステータス**: ✅ 完成
