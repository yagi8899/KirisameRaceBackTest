# Kirisame Race BackTest - システム概要

## 概要

**Kirisame Race BackTest** は、競馬予測モデルのバックテストプラットフォームです。歴史的なレースデータを用いて、複数の投資戦略をシミュレーション・比較・最適化できます。

---

## システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│  Web Browser (React + TypeScript)                           │
│  - データアップロード                                         │
│  - 戦略設定・パラメータ調整                                   │
│  - 結果ビジュアライゼーション                                │
└─────────────────────────────────────────────────────────────┘
                          ↕ (HTTP/REST API)
┌─────────────────────────────────────────────────────────────┐
│  FastAPI Backend (Python)                                   │
│  - ファイル処理 (/api/upload)                                │
│  - バックテスト実行 (/api/backtest)                          │
│  - グリッドサーチ (/api/grid-search)                         │
│  - 戦略比較 (/api/compare)                                   │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│  Data Store (In-Memory + Disk)                              │
│  - アップロードファイル管理                                  │
│  - 分析結果キャッシュ                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 主要コンポーネント

### フロントエンド (React + TypeScript + Vite)

| モジュール | 機能 |
|-----------|------|
| `App.tsx` | メインアプリケーションロジック・状態管理 |
| `UploadSection` | ファイルアップロード入力 |
| `StrategySelector` | 賭式選択UI |
| `ParameterForm` | パラメータ入力フォーム |
| `FilterPanel` | フィルタ条件設定 |
| `GridSearchPanel` | グリッドサーチ実行UI |
| `ComparisonView` | 戦略比較UI |
| `ResultsSummary` | KPI表示（ROI、的中率等） |
| `ProfitChart` | 収支推移グラフ |
| `RoiChart` | ROI推移グラフ |
| `HitRateChart` | 的中率レーダーチャート |
| `OddsDistributionChart` | オッズ分布ヒストグラム |
| `ResultsTable` | 詳細結果テーブル |

### バックエンド (FastAPI + Python)

| エンドポイント | 機能 | 入力 | 出力 |
|--------------|------|------|------|
| `POST /api/upload` | ファイルアップロード | TSVファイル | fileId, 統計情報 |
| `POST /api/backtest` | バックテスト実行 | fileId, 戦略設定 | サマリー, 詳細結果 |
| `POST /api/grid-search` | グリッドサーチ | fileId, パラメータ範囲 | 最適パラメータ, 比較表 |
| `POST /api/compare` | 戦略比較 | fileId, 複数戦略設定 | 比較結果 |
| `GET /api/health` | ヘルスチェック | - | OK |

---

## データフロー

### 1. ファイルアップロード
```
User selects TSV file
  ↓
POST /api/upload
  ├→ Parse TSV
  ├→ Validate columns
  ├→ Generate statistics
  └→ Store in DataStore
  ↓
Return fileId + stats to UI
```

### 2. バックテスト実行
```
User clicks "バックテスト実行"
  ↓
POST /api/backtest with (fileId, strategy_params)
  ├→ Load data by fileId
  ├→ Apply filters
  ├→ For each race:
  │   ├→ Check filter conditions
  │   ├→ Check prediction score vs threshold
  │   ├→ Simulate bet
  │   └→ Calculate payout
  ├→ Aggregate results
  └→ Generate visualizations
  ↓
Return summary + details to UI
```

### 3. グリッドサーチ
```
User sets parameter ranges + clicks search
  ↓
POST /api/grid-search
  ├→ Generate all combinations
  ├→ For each combination:
  │   └→ Execute backtest
  ├→ Sort by ROI
  └→ Return best combination + results table
  ↓
Auto-populate best params in UI
```

---

## データ構造

### Upload Result
```json
{
  "fileId": "uuid-xxxxx",
  "fileName": "races_2024.tsv",
  "fileSize": 5242880,
  "rowCount": 1234,
  "columnCount": 15,
  "stats": {
    "totalRaces": 1200,
    "totalHorses": 8500,
    "averageHorsesPerRace": 7.1,
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-12-31"
    },
    "racecourses": ["中山", "阪神", "東京"],
    "surfaces": ["芝", "ダート"],
    "distanceRange": {
      "min": 1200,
      "max": 3200
    },
    "predictionAccuracy": {
      "rank1HitRate": 0.28,
      "rank1_3HitRate": 0.62,
      "averagePredictionError": 0.15
    }
  }
}
```

### Backtest Result
```json
{
  "summary": {
    "totalRaces": 1200,
    "betRaces": 380,
    "totalBets": 38000,
    "totalInvestment": 38000,
    "totalPayout": 42500,
    "totalProfit": 4500,
    "roi": 11.84,
    "hitRate": 0.434,
    "hitCount": 165,
    "averageOdds": 1.82,
    "winCount": 120,
    "placeCount": 45
  },
  "details": [
    {
      "raceId": "20240101_001",
      "date": "2024-01-01",
      "racecourse": "中山",
      "raceNumber": 1,
      "distance": 1600,
      "surface": "芝",
      "betAmount": 100,
      "selectedHorses": [2, 5],
      "result": "WIN",
      "payout": 280,
      "profit": 180
    },
    // ...
  ],
  "profitData": [
    { "raceNumber": 1, "cumulativeProfit": -100 },
    { "raceNumber": 2, "cumulativeProfit": -150 },
    { "raceNumber": 3, "cumulativeProfit": 80 },
    // ...
  ]
}
```

---

## 主要機能の実装方式

### 1. ファイル処理
- **形式**: TSV（Tab-Separated Values）
- **エンコーディング**: UTF-8 推奨
- **バリデーション**: 
  - 必須カラムの存在確認
  - データ型チェック
  - 重複行削除
- **保存**: DataStore（24時間有効）

### 2. バックテストロジック
```python
for race in races:
    if not passes_filters(race, filters):
        continue
    
    for horse in horses:
        if horse.prediction_score >= threshold:
            investment = bet_amount
            payout = horse.odds * investment if horse.finishes_well else 0
            profit = payout - investment
            cumulative_profit += profit
            results.append({...})
```

### 3. グリッドサーチ
```python
best_roi = -infinity
best_params = None

for bet_amount in bet_amounts:
    for topN in top_ns:
        for threshold in thresholds:
            params = {bet_amount, topN, threshold}
            result = run_backtest(data, params)
            roi = calculate_roi(result)
            if roi > best_roi:
                best_roi = roi
                best_params = params

return best_params
```

### 4. 戦略比較
- 複数の戦略設定で個別にバックテスト実行
- 結果をROI、的中率、利益で比較表示
- パラメータの差分を視覚化

---

## パフォーマンス特性

| 操作 | 対象データサイズ | 実行時間 | 計算複雑度 |
|------|--------|--------|---------|
| アップロード | 100MB | 1～3秒 | O(n) |
| バックテスト | 1000レース | 0.5～2秒 | O(n×m) |
| グリッドサーチ | 1000レース, 100組合せ | 30～120秒 | O(n×m×c) |
| 戦略比較 | 5戦略 | 2～10秒 | O(5×n×m) |

*n = レース数, m = 平均馬数, c = 組合せ数*

---

## API仕様

### 1. Upload
```
POST /api/upload
Content-Type: multipart/form-data

Request:
  file: <TSV file>

Response (200):
{
  "data": { UploadResult }
}

Error (400):
{
  "detail": "Invalid file format"
}
```

### 2. Backtest
```
POST /api/backtest
Content-Type: application/json

Request:
{
  "fileId": "uuid",
  "strategyType": "WIN",
  "parameters": {
    "betAmount": 100,
    "topN": 1,
    "scoreThreshold": 0.5,
    "pivotHorse": null
  },
  "filters": {
    "racecourses": ["中山"],
    "surfaces": ["芝"],
    "distanceMin": 1200,
    "distanceMax": 1600,
    "dateFrom": "2024-01-01",
    "dateTo": "2024-12-31",
    "oddsMin": null,
    "oddsMax": null
  }
}

Response (200):
{
  "data": { BacktestResult }
}
```

### 3. Grid Search
```
POST /api/grid-search
Content-Type: application/json

Request:
{
  "fileId": "uuid",
  "strategyType": "WIN",
  "paramRanges": {
    "betAmounts": [100, 200, 300],
    "topNs": [1, 2],
    "thresholds": [0.0, 0.5, 0.8]
  },
  "filters": { RaceFilters }
}

Response (200):
{
  "data": {
    "bestParams": { ParameterSettings },
    "bestROI": 25.3,
    "results": [
      { "params": { ... }, "roi": 25.3, "hitRate": 0.45 },
      ...
    ]
  }
}
```

### 4. Compare
```
POST /api/compare
Content-Type: application/json

Request:
{
  "fileId": "uuid",
  "strategies": [
    {
      "name": "Strategy A",
      "strategyType": "WIN",
      "parameters": { ... },
      "filters": { ... }
    },
    {
      "name": "Strategy B",
      "strategyType": "PLACE",
      "parameters": { ... },
      "filters": { ... }
    }
  ]
}

Response (200):
{
  "data": {
    "strategies": [
      { "name": "Strategy A", "roi": 15.2, "hitRate": 0.42, ... },
      { "name": "Strategy B", "roi": 12.1, "hitRate": 0.55, ... }
    ]
  }
}
```

---

## エラーハンドリング

| エラー | ステータス | 対応 |
|-------|----------|------|
| Invalid file format | 400 | ファイル形式確認 |
| Missing columns | 400 | 必須カラム確認 |
| File too large | 413 | ファイルサイズ削減 |
| Server error | 500 | ログ確認・サーバー再起動 |
| Timeout (>60s) | 504 | リクエスト簡略化・パラメータ削減 |

---

## セキュリティ考慮事項

- **CORS**: localhost:5174 からのみ許可
- **ファイル検証**: アップロード時のMIME type/内容チェック
- **データ保持**: アップロード後24時間で自動削除
- **エラーメッセージ**: スタックトレース非表示（本番環境）

---

## 開発ガイド

### 新機能追加の流れ

1. **要件定義**: `docs/requirements.md` に追記
2. **API設計**: `docs/api_design.md` に追記
3. **フロントエンド設計**: `docs/frontend_design.md` に追記
4. **実装**: backend/frontend のコード作成
5. **テスト**: 手動テスト + 自動テスト
6. **ドキュメント更新**: このファイル + ユーザーガイド更新
7. **デプロイ**: 本番環境へ反映

### フォルダ構造

```
KirisameRaceBackTest/
├── docs/                    # ドキュメント
│   ├── requirements.md
│   ├── api_design.md
│   ├── frontend_design.md
│   ├── system_design.md
│   ├── USER_GUIDE.md       # ← 新規
│   └── SYSTEM_OVERVIEW.md  # ← このファイル
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── routers/
│   │   ├── models/
│   │   └── services/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
└── README.md
```

---

## 今後の拡張可能性

### 短期（Phase 11）
- [ ] 複数ファイルの同時アップロード
- [ ] バックテスト結果のCSV/Excel エクスポート
- [ ] 更なる可視化オプション（ボックスプロット等）

### 中期（Phase 12）
- [ ] 機械学習モデルの統合（予測精度向上）
- [ ] リアルタイムバックテスト（逐次更新）
- [ ] ユーザーアカウント・保存機能

### 長期（Phase 13+）
- [ ] 実際の賭けAPIとの連携
- [ ] 多言語対応
- [ ] モバイルアプリ化

---

## 関連資料

- [ユーザーガイド](USER_GUIDE.md) - 一般ユーザー向け
- [要件仕様](requirements.md) - 機能要件
- [API設計](api_design.md) - エンドポイント詳細
- [フロントエンド設計](frontend_design.md) - UI/UX設計
- [システム設計](system_design.md) - 全体アーキテクチャ

---

**最終更新**: 2026年1月13日  
**バージョン**: Phase 10
