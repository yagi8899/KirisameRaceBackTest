# 霧雨競馬バックテストシステム - フロントエンド

競馬予測AIのバックテストを行うWebアプリケーションのフロントエンドです。React + TypeScript + Vite で構築されています。

## 🚀 主な機能

### Phase 1-6: MVP機能
- ✅ **ファイルアップロード**: TSVファイルのドラッグ&ドロップ対応
- ✅ **6種類の戦略**: 単勝・複勝・馬連・ワイド・馬単・三連複
- ✅ **パラメータ設定**: 購入金額・N頭数・スコア閾値・軸馬
- ✅ **フィルタ機能**: 競馬場・馬場・距離・日付・オッズ範囲
- ✅ **基本グラフ**: 利益推移グラフ

### Phase 7: データドリブン最適化機能 (2026/01/13完成)
- ✅ **グリッドサーチ**: パラメータ範囲を指定して最適値を自動探索
- ✅ **追加グラフ**:
  - ROI推移グラフ (100%基準線付き)
  - 的中率分析 (競馬場別・距離別・馬場別、距離分類: 1000-1600m / 1700m以上)
  - オッズ分布ヒストグラム (二軸: 的中回数 + 払戻総額)
- ✅ **テーブル拡張**:
  - ページネーション (50件/ページ)
  - 全列ソート機能 (12列対応)
  - CSVエクスポート (UTF-8 BOM、Excel対応)
- ✅ **戦略比較**:
  - 複数戦略の並列実行
  - レーダーチャート比較
  - 比較テーブル with ベスト戦略ハイライト

## 🛠️ 技術スタック

- **React 18**: UIライブラリ
- **TypeScript**: 型安全な開発
- **Vite 5.4.21**: 高速ビルドツール (ポート: 5174)
- **Recharts**: グラフ可視化ライブラリ
- **Axios**: HTTP通信
- **TailwindCSS**: ユーティリティファーストCSS
- **shadcn/ui**: UIコンポーネントライブラリ

## 📁 プロジェクト構成

```
frontend/
├── src/
│   ├── components/       # 再利用可能コンポーネント
│   │   ├── upload/      # アップロード関連
│   │   ├── strategy/    # 戦略設定・グリッドサーチ
│   │   ├── results/     # 結果表示・比較
│   │   ├── compare/     # 戦略比較ビュー
│   │   └── common/      # 共通UI部品
│   ├── pages/           # ページコンポーネント
│   ├── types/           # 型定義 (TypeScript)
│   │   └── index.tsx    # メイン型定義ファイル
│   ├── services/        # API通信レイヤー
│   ├── utils/           # ユーティリティ関数
│   ├── App.tsx          # ルートコンポーネント
│   └── main.tsx         # エントリポイント
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🚀 セットアップ & 実行

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 開発サーバー起動
```bash
npm run dev
```
→ ブラウザで http://localhost:5174 を開く

### 3. ビルド (本番環境用)
```bash
npm run build
```

### 4. プレビュー (ビルド結果確認)
```bash
npm run preview
```

## 🐛 重要な技術的注意点

### Vite + TypeScript 型解決問題
Viteは型のみをエクスポートするTSXファイルでモジュール解決エラーが発生することがあります。

**解決策**: 
- `src/types/index.tsx` に全ての共通型定義を集約
- 全コンポーネントで `import type { ... } from '../types'` を使用
- TSXコンポーネントで直接型をエクスポートしない

### Controlled Component パターン
ParameterForm は Controlled Component として実装されています:
- 親コンポーネント (App.tsx) から `parameters` prop を受け取る
- フォーム入力時に `onParametersChange` コールバックで親に通知
- 状態は親コンポーネントで一元管理

### Recharts 二軸グラフ
オッズ分布グラフは ComposedChart で実装:
```tsx
<ComposedChart>
  <YAxis yAxisId="left" />   {/* 的中回数 */}
  <YAxis yAxisId="right" orientation="right" />  {/* 払戻総額 */}
  <Bar yAxisId="left" dataKey="count" />
  <Line yAxisId="right" dataKey="totalPayout" />
</ComposedChart>
```

## 📡 API エンドポイント

バックエンド (FastAPI) との通信:
- Base URL: `http://localhost:8000/api`
- `/upload`: ファイルアップロード
- `/data/preview`: データプレビュー
- `/backtest/execute`: バックテスト実行
- `/backtest/grid-search`: グリッドサーチ実行 (Phase 7新規)
- `/backtest/compare`: 戦略比較実行 (Phase 7新規)

詳細は `docs/api_design.md` 参照

## 🧪 開発ガイドライン

### 型定義の追加
新しい型は `src/types/index.tsx` に追加:
```tsx
export interface NewType {
  field: string;
}
```

### 新しいコンポーネントの作成
1. `src/components/` に適切なカテゴリフォルダを選択
2. TypeScript + TSX で実装
3. 型は `import type { ... } from '../types'` でインポート
4. PropTypes はTypeScript interfaceで定義

### グラフコンポーネントの追加
Rechartsを使用:
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const MyChart: React.FC<Props> = ({ data }) => (
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
  </LineChart>
);
```

## 📝 Phase 7 で追加された主要コンポーネント

| コンポーネント名 | 説明 |
|----------------|------|
| `GridSearchPanel.tsx` | グリッドサーチ実行パネル (パラメータ範囲入力・結果リスト) |
| `RoiChart.tsx` | ROI推移グラフ (100%基準線付き) |
| `HitRateChart.tsx` | 的中率分析グラフ (3タブ: 競馬場・距離・馬場) |
| `OddsDistributionChart.tsx` | オッズ分布ヒストグラム (二軸グラフ) |
| `ComparisonView.tsx` | 戦略比較ビュー (入力フォーム・レーダーチャート・比較テーブル) |
| `ResultsTable.tsx` | バックテスト結果テーブル (ページネーション・ソート・CSVエクスポート拡張) |

## 🔧 トラブルシューティング

### 白紙画面が表示される
- ブラウザコンソールで型関連エラーを確認
- `src/types/index.tsx` からの型インポートを確認
- Vite開発サーバーを再起動: `npm run dev`

### CORS エラー
- バックエンド `app/config.py` の `CORS_ORIGINS` を確認
- 現在の設定: `http://localhost:5173,http://localhost:5174`

### グラフが表示されない
- ブラウザコンソールでデータ構造を確認
- Recharts の dataKey がデータのキーと一致しているか確認

## 📚 関連ドキュメント

- [要件定義書](../docs/requirements.md)
- [フロントエンド設計書](../docs/frontend_design.md)
- [API設計書](../docs/api_design.md)
- [開発ロードマップ](../docs/development_roadmap.md)

## 🎯 今後の予定

Phase 8-9完了後:
- パフォーマンス最適化
- UIデザイン改善
- モバイル対応検討
- 追加グラフ機能

---

**バージョン**: Phase 7完成版 (2026/01/13)  
**開発**: GitHub Copilot + 霧雨チーム
