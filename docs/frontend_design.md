# フロントエンド設計書

## 1. UI/UX設計

### 1.1 デザインコンセプト

- **モダン**: shadcn/ui + Tailwind CSSによる洗練されたUI
- **ダークモード対応**: 目に優しい暗色テーマ
- **レスポンシブ**: デスクトップとタブレットに対応
- **視覚的**: データビジュアライゼーション重視
- **直感的**: 操作フローが自然でわかりやすい

### 1.2 カラーパレット

```css
/* ライトモード */
--primary: 222.2 47.4% 11.2%;        /* ダークブルー */
--secondary: 210 40% 96.1%;          /* ライトグレー */
--accent: 210 40% 96.1%;             /* アクセント */
--destructive: 0 84.2% 60.2%;        /* レッド（エラー） */
--success: 142 71% 45%;              /* グリーン（成功） */
--warning: 38 92% 50%;               /* オレンジ（警告） */

/* ダークモード */
--primary: 210 40% 98%;
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
```

### 1.3 タイポグラフィ

- **見出し**: Inter, Noto Sans JP（Bold, 700）
- **本文**: Inter, Noto Sans JP（Regular, 400）
- **数値**: JetBrains Mono（等幅フォント）

---

## 2. 画面設計

### 2.1 レイアウト構成 (Phase 10: モダンUI改善版)

**設計コンセプト**: カード型レイアウト + 2カラムグリッドによるモダンなUI

```
┌──────────────────────────────────────────────────────────────┐
│  🌟 Kirisame Race BackTest        [ダーク切替] [設定]       │
│  競馬予測モデルのバックテストシステム                         │
├──────────────────────────────────────────────────────────────┤
│  max-w-7xl container                                         │
│                                                              │
│  【データアップロードセクション - 1カラム】                    │
│  ┌─────────────────────┬─────────────────────┐              │
│  │ 📤 データアップロード │  📊 データ概要       │              │
│  │ [ドラッグ&ドロップ]  │  総レース: 1,234    │              │
│  │  Card Component     │  期間: 2024/1-12   │              │
│  └─────────────────────┴─────────────────────┘              │
│                                                              │
│  【戦略設定セクション - 1カラム】                             │
│  ┌────────────────────────────────────────────┐              │
│  │ 🎯 戦略設定                      [プリセット▼]│              │
│  ├────────────────────────────────────────────┤              │
│  │ [単勝][複勝][馬連][ワイド][馬単][三連複]    │              │
│  │ 購入額: [100] topN: [1▼] 閾値: [0.0]     │              │
│  │                                            │              │
│  │ 🔧 詳細設定 (Accordion - 折りたたみ可能)    │              │
│  │   └→ パラメータフォーム・フィルタパネル    │              │
│  └────────────────────────────────────────────┘              │
│                                                              │
│  【高度な機能セクション - 2カラムグリッド】                    │
│  ┌─────────────────────┬─────────────────────┐              │
│  │ 🔍 グリッドサーチ    │  🆚 戦略比較        │              │
│  │ [範囲指定して実行]   │  [複数戦略を比較]   │              │
│  │  Accordion Collapse │  Accordion Collapse│              │
│  └─────────────────────┴─────────────────────┘              │
│                                                              │
│  【実行ボタン - 1カラム】                                     │
│  ┌────────────────────────────────────────────┐              │
│  │         [⚡ バックテストを実行]              │              │
│  │  グラデーション + ホバーエフェクト           │              │
│  └────────────────────────────────────────────┘              │
│                                                              │
│  【結果表示セクション - 動的レイアウト】                       │
│  ┌──────────────────────────────────────────┐                │
│  │ 💰 サマリーカード (4カラムグリッド)       │                │
│  │ ROI | 的中率 | 総利益 | 実行数            │                │
│  └──────────────────────────────────────────┘                │
│                                                              │
│  ┌─────────────────────┬─────────────────────┐              │
│  │ 📈 収支推移グラフ    │  📊 ROI推移グラフ   │              │
│  │  (2カラムグリッド)   │                     │              │
│  └─────────────────────┴─────────────────────┘              │
│                                                              │
│  ┌─────────────────────┬─────────────────────┐              │
│  │ 🎯 的中率分析        │  📊 オッズ分布      │              │
│  │  (2カラムグリッド)   │                     │              │
│  └─────────────────────┴─────────────────────┘              │
│                                                              │
│  ┌────────────────────────────────────────────┐              │
│  │ 📋 詳細結果テーブル (1カラム)              │              │
│  └────────────────────────────────────────────┘              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**レイアウト原則**:
1. **カード型UI**: すべてのセクションをCardコンポーネントでラップ
   - 背景: `bg-white`
   - 影: `shadow-lg` / `shadow-sm`
   - 角丸: `rounded-2xl`
   - 境界: `border border-gray-200`
   - パディング: `p-6` または `p-8`

2. **グリッドシステム**:
   - 基本: 1カラム (縦スタック)
   - 高度な機能: 2カラム `grid md:grid-cols-2 gap-6`
   - グラフ: 2カラム `grid md:grid-cols-2 gap-6`
   - サマリーカード: 4カラム `grid grid-cols-2 md:grid-cols-4 gap-4`

3. **折りたたみ機能**:
   - 詳細設定: Accordion/Collapse
   - グリッドサーチ: Accordion (初期状態: 閉じる)
   - 戦略比較: Accordion (初期状態: 閉じる)

4. **視覚的ヒエラルキー**:
   - Level 1: メインアクション (実行ボタン) - 大きく目立つ
   - Level 2: 主要設定 (戦略・パラメータ) - カードで明確に
   - Level 3: 高度な機能 (グリッドサーチ・比較) - 折りたたみ可能
   - Level 4: 結果表示 - データビジュアライゼーション重視

5. **レスポンシブ対応**:
   - `max-w-7xl mx-auto px-4`: コンテナ幅制限
   - `md:grid-cols-2`: タブレット以上で2カラム
   - `grid-cols-1`: モバイルでは1カラム

---

### 2.2 ページ別設計

#### 2.2.1 アップロードページ (`/upload`)

**目的**: TSVファイルのアップロードとデータプレビュー

**レイアウト**:
```
┌─────────────────────────────────────────────────────────────┐
│                    ファイルアップロード                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │         📁 ファイルをドラッグ&ドロップ                   │ │
│  │         または クリックしてファイルを選択                │ │
│  │                                                         │ │
│  │         TSV形式 (最大50MB)                              │ │
│  │                                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [アップロード進捗バー] ────────────── 75%                    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    データ統計情報                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ 総レース数│  │ 総馬数   │  │  期間    │  │ 競馬場数 │   │
│  │   72     │  │  864     │  │ 7日間    │  │   3      │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    データプレビュー                          │
├─────────────────────────────────────────────────────────────┤
│  [テーブル: 先頭20件を表示]                                   │
│                                                              │
│  [次へ: 戦略設定ページ] ボタン                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**コンポーネント構成**:
```typescript
<UploadPage>
  <PageHeader title="ファイルアップロード" />
  <FileUploader 
    onUploadSuccess={handleUploadSuccess}
    onUploadError={handleUploadError}
  />
  {uploadProgress > 0 && (
    <UploadProgress progress={uploadProgress} />
  )}
  {dataStats && (
    <DataStatsCards stats={dataStats} />
  )}
  {uploadedData && (
    <DataPreviewTable data={uploadedData} />
  )}
  <Button onClick={() => navigate('/strategy')}>
    次へ: 戦略設定
  </Button>
</UploadPage>
```

---

#### 2.2.2 戦略設定ページ (`/strategy`)

**目的**: バックテスト戦略とパラメータの設定

**レイアウト**:
```
┌─────────────────────────────────────────────────────────────┐
│                    戦略設定                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  【Step 1】戦略タイプを選択                                   │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌────┐│
│  │ 単勝 │  │ 複勝 │  │ 馬連 │  │ ワイド│  │ 馬単 │  │3連複││
│  │ WIN  │  │PLACE │  │BRACKET│ │ WIDE │  │EXACTA│  │TRIO││
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └────┘│
│                                                              │
│  【Step 2】パラメータ設定                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1レースあたりの購入金額:  [___100___] 円               │  │
│  │ 購入対象頭数 (topN):      [____1____] 頭               │  │
│  │ 予測スコア閾値:           [__0.50__] (0.0-1.0)        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  【Step 3】フィルタ設定 (オプション)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 競馬場:     [ ] 東京  [ ] 中山  [ ] 阪神  [全選択]    │  │
│  │ 芝/ダート:  [ ] 芝    [ ] ダート                      │  │
│  │ 距離:       [1200] m 〜 [3600] m                      │  │
│  │ 日付範囲:   [2024/01/27] 〜 [2024/02/03]             │  │
│  │ オッズ範囲: [1.0] 〜 [100.0]                          │  │
│  │ 人気:       上位 [3] 番人気まで                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [キャンセル]  [設定をリセット]  [バックテストを実行] ──▶   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**コンポーネント構成**:
```typescript
<StrategyPage>
  <PageHeader title="戦略設定" />
  
  <Section title="Step 1: 戦略タイプを選択">
    <StrategySelector 
      selectedStrategy={strategy}
      onStrategyChange={setStrategy}
    />
  </Section>
  
  <Section title="Step 2: パラメータ設定">
    <ParameterForm 
      strategy={strategy}
      parameters={parameters}
      onParameterChange={setParameters}
    />
  </Section>
  
  <Section title="Step 3: フィルタ設定">
    <FilterPanel 
      filters={filters}
      onFilterChange={setFilters}
      dataStats={dataStats}
    />
  </Section>
  
  <ActionButtons>
    <Button variant="outline" onClick={handleReset}>
      設定をリセット
    </Button>
    <Button 
      variant="default" 
      onClick={handleExecute}
      disabled={isRunning}
    >
      {isRunning ? (
        <><Spinner /> 実行中...</>
      ) : (
        'バックテストを実行'
      )}
    </Button>
  </ActionButtons>
</StrategyPage>
```

---

#### 2.2.3 結果表示ページ (`/results`)

**目的**: バックテスト結果の表示と分析

**レイアウト**:
```
┌─────────────────────────────────────────────────────────────┐
│                    バックテスト結果                          │
├─────────────────────────────────────────────────────────────┤
│  【サマリー】                                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │総投資額  │ │総払戻金 │ │ 収支    │ │ 回収率  │          │
│  │¥7,200   │ │¥8,350   │ │+¥1,150  │ │115.97% │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │的中率    │ │的中回数 │ │総レース │ │平均倍率 │          │
│  │33.33%   │ │24回     │ │72回     │ │2.89倍  │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  【グラフ】                                                  │
│  [タブ: 収支推移 | 回収率推移 | 的中率分析 | オッズ分布]      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │         [インタラクティブグラフエリア]                 │  │
│  │                                                       │  │
│  │              (Recharts使用)                           │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  【詳細データ】                                              │
│  [エクスポート: CSV | Excel]  [フィルタ]  [ソート]          │
│                                                              │
│  [データテーブル: ページネーション付き]                       │
│                                                              │
│  [新しいバックテストを実行]  [戦略を比較]                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**コンポーネント構成**:
```typescript
<ResultsPage>
  <PageHeader title="バックテスト結果" />
  
  <Section title="サマリー">
    <SummaryCards summary={result.summary} />
  </Section>
  
  <Section title="グラフ">
    <Tabs defaultValue="profit">
      <TabsList>
        <TabsTrigger value="profit">収支推移</TabsTrigger>
        <TabsTrigger value="roi">回収率推移</TabsTrigger>
        <TabsTrigger value="hitRate">的中率分析</TabsTrigger>
        <TabsTrigger value="odds">オッズ分布</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profit">
        <ProfitChart data={result.timeline} />
      </TabsContent>
      
      <TabsContent value="roi">
        <RoiChart data={result.timeline} />
      </TabsContent>
      
      <TabsContent value="hitRate">
        <HitRateChart data={result.analysis} />
      </TabsContent>
      
      <TabsContent value="odds">
        <OddsDistributionChart data={result.analysis.oddsDistribution} />
      </TabsContent>
    </Tabs>
  </Section>
  
  <Section title="詳細データ">
    <DataTableToolbar>
      <ExportButton formats={['csv', 'excel']} />
      <FilterInput />
      <SortSelect />
    </DataTableToolbar>
    
    <DetailTable 
      data={result.details}
      pageSize={50}
    />
  </Section>
  
  <ActionButtons>
    <Button onClick={() => navigate('/strategy')}>
      新しいバックテストを実行
    </Button>
    <Button variant="outline" onClick={() => navigate('/compare')}>
      戦略を比較
    </Button>
  </ActionButtons>
</ResultsPage>
```

---

#### 2.2.4 グリッドサーチパネル (Phase 7新機能)

**目的**: パラメータの最適化探索

**配置**: 結果表示ページ内のアコーディオンまたはタブ

**機能**:
- パラメータ範囲の入力 (カンマ区切り)
  - 購入金額: 例 `100,200,500`
  - 上位N頭: 例 `1,2,3`
  - スコア閾値: 例 `0.0,0.3,0.5`
- 組み合わせ総数の表示
- 実行ボタン
- 結果リスト (ROI降順、上位10件)
- 最良パラメータの自動適用

**レイアウト**:
```
┌─────────────────────────────────────────────────────────────┐
│  🔍 グリッドサーチ                                            │
├─────────────────────────────────────────────────────────────┤
│  購入金額: [100,200,500              ]                       │
│  上位N頭:  [1,2,3                    ]                       │
│  閾値:     [0.0,0.3,0.5              ]                       │
│                                                              │
│  組み合わせ総数: 27通り                                       │
│  [グリッドサーチ実行]                                         │
│                                                              │
│  【結果】(ROI降順)                                            │
│  👑 #1: 購入額500 / topN 2 / 閾値0.3 → ROI: 124.24%         │
│     #2: 購入額200 / topN 3 / 閾値0.5 → ROI: 118.50%         │
│     #3: 購入額100 / topN 1 / 閾値0.0 → ROI: 115.97%         │
│     ...                                                      │
└─────────────────────────────────────────────────────────────┘
```

---

#### 2.2.5 追加グラフ (Phase 7新機能)

**配置**: 結果表示ページ内のグラフタブ

**1. ROI推移グラフ**
- レース経過に伴うROIの推移
- 折れ線グラフ (Recharts LineChart)
- 100%基準線 (損益分岐点)

**2. 的中率分析グラフ**
- 3つのタブ切り替え
  - 競馬場別: 10競馬場の的中率 (棒グラフ)
  - 距離帯別: 1000～1600m / 1700m以上 (棒グラフ)
  - 芝ダート別: 芝 / ダート (棒グラフ)

**3. オッズ分布グラフ**
- 的中したオッズの分布 (ヒストグラム)
- 二軸グラフ: 左軸=的中回数、右軸=総払戻額
- 7つのオッズ範囲
- 統計カード: 総的中回数、平均オッズ、最高オッズ

---

#### 2.2.6 テーブル拡張機能 (Phase 7新機能)

**機能追加**:
1. **ページネーション**
   - 50件/ページ
   - ページ番号表示
   - 前後・最初/最後のページへのナビゲーション

2. **全カラムソート**
   - 12カラムすべてでソート可能
   - 昇順/降順の切り替え
   - ソートアイコン表示 (⇅ → ↑ → ↓)

3. **CSV出力**
   - UTF-8 BOM付き (Excel対応)
   - ファイル名: `backtest_results_YYYY-MM-DD.csv`
   - 全データをエクスポート

---

#### 2.2.7 戦略比較パネル (Phase 7新機能)

**目的**: 複数戦略の同時実行と比較

**レイアウト**:
```
┌─────────────────────────────────────────────────────────────┐
│  🔍 戦略比較                                                  │
├─────────────────────────────────────────────────────────────┤
│  【戦略1】                                                    │
│  戦略名: [単勝戦略A            ]                              │
│  タイプ: [単勝 ▼]  購入額: [100   ]  topN: [1 ▼]           │
│  閾値:   [0.0                 ]  [削除]                      │
│                                                              │
│  【戦略2】                                                    │
│  戦略名: [単勝戦略B            ]                              │
│  タイプ: [単勝 ▼]  購入額: [200   ]  topN: [2 ▼]           │
│  閾値:   [0.3                 ]  [削除]                      │
│                                                              │
│  [➕ 戦略追加]  [🔍 比較実行]                                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  【レーダーチャート】                                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         ROI                                           │  │
│  │         /|\                                           │  │
│  │        / | \                                          │  │
│  │  的中率──┼──総利益                                     │  │
│  │        \|/                                            │  │
│  │     購入数─平均オッズ                                  │  │
│  │                                                       │  │
│  │  凡例: ■ 単勝戦略A  ■ 単勝戦略B                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  【比較テーブル】                                             │
│  ┌────┬────────┬────┬────┬────┬────┬────┬────┬────┬────┐│
│  │    │戦略名  │総R │購入│的中│的中率│投資│払戻│利益│ROI │││
│  ├────┼────────┼────┼────┼────┼────┼────┼────┼────┼────┤│
│  │👑  │単勝戦略B│ 72 │144 │ 52 │36.1%│14K │17K │3.5K│124%│││
│  │    │単勝戦略A│ 72 │ 72 │ 24 │33.3%│7.2K│8.4K│1.2K│116%│││
│  └────┴────────┴────┴────┴────┴────┴────┴────┴────┴────┘│
│                                                              │
│  🏆 最優秀戦略: 単勝戦略B                                     │
│  ROI: 124.27% | 的中率: 36.11% | 総利益: ¥3,495             │
└─────────────────────────────────────────────────────────────┘
```

---

#### 2.2.8 旧: 比較ページ (非推奨)

**目的**: 複数の戦略結果を比較

**レイアウト**:
```
┌─────────────────────────────────────────────────────────────┐
│                    戦略比較                                  │
├─────────────────────────────────────────────────────────────┤
│  【比較する戦略を選択】                                       │
│  [ ] 単勝予測1位 (ROI: 115.97%)                             │
│  [ ] 複勝予測1-3位 (ROI: 98.5%)                             │
│  [ ] 馬連予測1-2位 (ROI: 105.3%)                            │
│  [比較を実行]                                                │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  【レーダーチャート】                                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    ROI                                │  │
│  │                     /\                                │  │
│  │                    /  \                               │  │
│  │        的中率 ────┼────── 利益                        │  │
│  │                   │                                   │  │
│  │                安定性                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  【比較テーブル】                                             │
│  ┌─────────────┬─────┬──────┬────┬─────────┐            │
│  │ 戦略        │ ROI │的中率│利益│最大DD   │            │
│  ├─────────────┼─────┼──────┼────┼─────────┤            │
│  │単勝予測1位  │115.9│33.3% │1150│-1200    │            │
│  │複勝予測1-3位│98.5 │68.5% │-108│-850     │            │
│  │馬連予測1-2位│105.3│45.8% │380 │-950     │            │
│  └─────────────┴─────┴──────┴────┴─────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. コンポーネント詳細設計

### 3.1 共通コンポーネント

#### Button Component
```typescript
// components/common/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  loading = false,
  icon,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        loading && 'btn-loading'
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner className="mr-2" />}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
```

#### Card Component
```typescript
// components/common/Card.tsx
interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  value: string | number;
  change?: number;  // 前回比（%）
  trend?: 'up' | 'down' | 'neutral';
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  value,
  change,
  trend,
}) => {
  return (
    <div className="card">
      <div className="card-header">
        {icon && <div className="card-icon">{icon}</div>}
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
      <div className="card-body">
        <p className="card-value">{value}</p>
        {change !== undefined && (
          <p className={cn('card-change', `trend-${trend}`)}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        )}
      </div>
    </div>
  );
};
```

---

### 3.2 アップロード関連コンポーネント

#### FileUploader Component
```typescript
// components/upload/FileUploader.tsx
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onUploadSuccess: (data: UploadResponse) => void;
  onUploadError: (error: Error) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/tab-separated-values': ['.tsv'],
      'text/plain': ['.tsv'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    onDrop: handleDrop,
  });

  const handleDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadFile(formData, (progress) => {
        setProgress(progress);
      });
      
      onUploadSuccess(response);
    } catch (error) {
      onUploadError(error as Error);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="file-uploader">
      <div
        {...getRootProps()}
        className={cn(
          'dropzone',
          isDragActive && 'dropzone-active',
          isUploading && 'dropzone-uploading'
        )}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="upload-progress">
            <Spinner size="lg" />
            <p>アップロード中... {progress}%</p>
            <ProgressBar value={progress} />
          </div>
        ) : (
          <div className="dropzone-content">
            <FolderIcon size={48} />
            <p className="text-lg font-semibold">
              ファイルをドラッグ&ドロップ
            </p>
            <p className="text-sm text-gray-500">
              または クリックしてファイルを選択
            </p>
            <p className="text-xs text-gray-400 mt-2">
              TSV形式 (最大50MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
```

#### DataPreviewTable Component
```typescript
// components/upload/DataPreviewTable.tsx
interface DataPreviewTableProps {
  data: RaceData[];
  total: number;
}

export const DataPreviewTable: React.FC<DataPreviewTableProps> = ({
  data,
  total,
}) => {
  return (
    <div className="data-preview">
      <div className="preview-header">
        <h3>データプレビュー</h3>
        <p className="text-sm text-gray-500">
          先頭20件を表示 (全{total}件)
        </p>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>競馬場</th>
              <th>日付</th>
              <th>R</th>
              <th>馬番</th>
              <th>馬名</th>
              <th>人気</th>
              <th>着順</th>
              <th>予測順位</th>
              <th>予測スコア</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.racecourse}</td>
                <td>{formatDate(row.date)}</td>
                <td>{row.raceNumber}</td>
                <td>{row.horseNumber}</td>
                <td>{row.horseName}</td>
                <td>{row.popularity}</td>
                <td className={cn(
                  row.finalRank <= 3 && 'text-success font-bold'
                )}>
                  {row.finalRank}
                </td>
                <td>{row.predictedRank}</td>
                <td>{row.predictedScore.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

### 3.3 戦略設定コンポーネント

#### StrategySelector Component
```typescript
// components/strategy/StrategySelector.tsx
interface StrategySelectorProps {
  selectedStrategy: StrategyType;
  onStrategyChange: (strategy: StrategyType) => void;
}

const STRATEGIES = [
  { type: 'WIN', name: '単勝', icon: '🎯', description: '予測1位の馬に単勝購入' },
  { type: 'PLACE', name: '複勝', icon: '🎪', description: '予測上位の馬に複勝購入' },
  { type: 'BRACKET', name: '馬連', icon: '🔗', description: '予測上位2頭で馬連購入' },
  { type: 'WIDE', name: 'ワイド', icon: '↔️', description: '予測上位2頭でワイド購入' },
  { type: 'EXACTA', name: '馬単', icon: '➡️', description: '予測1位→2位で馬単購入' },
  { type: 'TRIO', name: '3連複', icon: '🎲', description: '予測上位3頭で3連複購入' },
] as const;

export const StrategySelector: React.FC<StrategySelectorProps> = ({
  selectedStrategy,
  onStrategyChange,
}) => {
  return (
    <div className="strategy-selector">
      <div className="strategy-grid">
        {STRATEGIES.map((strategy) => (
          <button
            key={strategy.type}
            className={cn(
              'strategy-card',
              selectedStrategy === strategy.type && 'strategy-card-selected'
            )}
            onClick={() => onStrategyChange(strategy.type)}
          >
            <div className="strategy-icon">{strategy.icon}</div>
            <h4 className="strategy-name">{strategy.name}</h4>
            <p className="strategy-type">{strategy.type}</p>
            <p className="strategy-description">{strategy.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
```

#### ParameterForm Component
```typescript
// components/strategy/ParameterForm.tsx
interface ParameterFormProps {
  strategy: StrategyType;
  parameters: StrategyParams;
  onParameterChange: (params: StrategyParams) => void;
}

export const ParameterForm: React.FC<ParameterFormProps> = ({
  strategy,
  parameters,
  onParameterChange,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: parameters,
    resolver: zodResolver(parameterSchema),
  });

  return (
    <form className="parameter-form">
      <div className="form-group">
        <label htmlFor="betAmount">1レースあたりの購入金額</label>
        <Input
          id="betAmount"
          type="number"
          min={100}
          max={10000}
          step={100}
          {...register('betAmount')}
          suffix="円"
        />
        {errors.betAmount && (
          <p className="error-message">{errors.betAmount.message}</p>
        )}
      </div>

      {strategy !== 'WIN' && (
        <div className="form-group">
          <label htmlFor="topN">購入対象頭数</label>
          <Input
            id="topN"
            type="number"
            min={1}
            max={10}
            {...register('topN')}
            suffix="頭"
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="scoreThreshold">予測スコア閾値（オプション）</label>
        <Input
          id="scoreThreshold"
          type="number"
          min={0}
          max={1}
          step={0.01}
          {...register('scoreThreshold')}
          placeholder="0.5"
        />
        <p className="helper-text">
          この値以上のスコアの馬のみ購入対象にします
        </p>
      </div>
    </form>
  );
};
```

---

### 3.4 結果表示コンポーネント

#### SummaryCards Component
```typescript
// components/results/SummaryCards.tsx
interface SummaryCardsProps {
  summary: Summary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const cards = [
    {
      title: '総投資額',
      value: `¥${summary.totalInvestment.toLocaleString()}`,
      icon: <WalletIcon />,
    },
    {
      title: '総払戻金',
      value: `¥${summary.totalReturn.toLocaleString()}`,
      icon: <CoinsIcon />,
    },
    {
      title: '収支',
      value: `${summary.profit >= 0 ? '+' : ''}¥${summary.profit.toLocaleString()}`,
      icon: <TrendingUpIcon />,
      trend: summary.profit >= 0 ? 'up' : 'down',
    },
    {
      title: '回収率',
      value: `${summary.roi.toFixed(2)}%`,
      icon: <PercentIcon />,
      trend: summary.roi >= 100 ? 'up' : 'down',
    },
    {
      title: '的中率',
      value: `${summary.hitRate.toFixed(2)}%`,
      icon: <TargetIcon />,
    },
    {
      title: '的中回数',
      value: `${summary.hitCount}/${summary.totalRaces}`,
      icon: <CheckCircleIcon />,
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <Card key={card.title} {...card} />
      ))}
    </div>
  );
};
```

#### ProfitChart Component
```typescript
// components/results/ProfitChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ProfitChartProps {
  data: TimelineItem[];
}

export const ProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">収支推移</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => formatDate(date)}
          />
          <YAxis 
            tickFormatter={(value) => `¥${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value: number) => `¥${value.toLocaleString()}`}
            labelFormatter={(date) => formatDate(date)}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="cumulativeProfit" 
            stroke="#8884d8" 
            name="累積収支"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="profit" 
            stroke="#82ca9d" 
            name="レース収支"
            strokeWidth={1}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
```

#### HitRateChart Component
```typescript
// components/results/HitRateChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface HitRateChartProps {
  data: Analysis;
}

export const HitRateChart: React.FC<HitRateChartProps> = ({ data }) => {
  const chartData = Object.entries(data.byRacecourse).map(([name, stats]) => ({
    name,
    hitRate: stats.hitRate,
    roi: stats.roi,
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">競馬場別パフォーマンス</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey="hitRate" 
            fill="#8884d8" 
            name="的中率 (%)"
          />
          <Bar 
            yAxisId="right"
            dataKey="roi" 
            fill="#82ca9d" 
            name="回収率 (%)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
```

---

## 4. カスタムフック

### 4.1 useFileUpload
```typescript
// hooks/useFileUpload.ts
export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadService.upload(formData, (progress) => {
        setProgress(progress);
      });
      
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };
  
  return { uploadFile, isUploading, progress, error };
};
```

### 4.2 useBacktest
```typescript
// hooks/useBacktest.ts
export const useBacktest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const execute = async (request: BacktestRequest) => {
    setIsRunning(true);
    setError(null);
    
    try {
      const response = await backtestService.execute(request);
      setResult(response.data);
      return response.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsRunning(false);
    }
  };
  
  return { execute, isRunning, result, error };
};
```

---

## 5. 状態管理 (Zustand)

### 5.1 uploadStore
```typescript
// store/uploadStore.ts
import create from 'zustand';

interface UploadState {
  file: File | null;
  fileId: string | null;
  uploadedData: RaceData[] | null;
  dataStats: DataStats | null;
  isUploading: boolean;
  error: string | null;
  
  setFile: (file: File) => void;
  setFileId: (fileId: string) => void;
  setUploadedData: (data: RaceData[]) => void;
  setDataStats: (stats: DataStats) => void;
  setIsUploading: (isUploading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  file: null,
  fileId: null,
  uploadedData: null,
  dataStats: null,
  isUploading: false,
  error: null,
  
  setFile: (file) => set({ file }),
  setFileId: (fileId) => set({ fileId }),
  setUploadedData: (uploadedData) => set({ uploadedData }),
  setDataStats: (dataStats) => set({ dataStats }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setError: (error) => set({ error }),
  reset: () => set({
    file: null,
    fileId: null,
    uploadedData: null,
    dataStats: null,
    isUploading: false,
    error: null,
  }),
}));
```

---

## 6. スタイリング (Tailwind CSS)

### 6.1 カスタムテーマ設定

```typescript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        success: {
          DEFAULT: 'hsl(142, 71%, 45%)',
          foreground: 'hsl(142, 71%, 95%)',
        },
        warning: {
          DEFAULT: 'hsl(38, 92%, 50%)',
          foreground: 'hsl(38, 92%, 95%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

---

## 7. ルーティング (React Router)

```typescript
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/strategy" element={<StrategyPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
```

---

## 8. アクセシビリティ

- すべてのフォーム要素に`label`を付与
- キーボードナビゲーション対応（Tab, Enter, Escape）
- `aria-label`, `aria-describedby`の適切な使用
- コントラスト比4.5:1以上を保証
- スクリーンリーダー対応

---

## 9. パフォーマンス最適化

- React.lazy によるコード分割
- useMemo, useCallback による不要な再レンダリング防止
- 仮想スクロール（react-virtualized）でテーブル表示
- 画像の遅延読み込み
- Bundle サイズ監視

---

**作成日**: 2026年1月11日  
**バージョン**: 1.0  
**作成者**: GitHub Copilot Assistant
