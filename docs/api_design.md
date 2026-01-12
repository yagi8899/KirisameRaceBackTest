# API設計書

## 1. API概要

### 1.1 基本情報

- **Base URL**: `http://localhost:8000/api`
- **Protocol**: HTTP/REST
- **Data Format**: JSON
- **Character Encoding**: UTF-8
- **CORS**: 開発環境は localhost:5173 を許可

### 1.2 共通レスポンス形式

#### 成功レスポンス
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

#### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": { ... }
  }
}
```

### 1.3 HTTPステータスコード

| Status Code | 説明 |
|-------------|------|
| 200 OK | リクエスト成功 |
| 201 Created | リソース作成成功 |
| 400 Bad Request | リクエストパラメータエラー |
| 413 Payload Too Large | ファイルサイズ超過 |
| 415 Unsupported Media Type | 非対応ファイル形式 |
| 422 Unprocessable Entity | バリデーションエラー |
| 500 Internal Server Error | サーバーエラー |

---

## 2. エンドポイント詳細

### 2.1 ファイルアップロード API

#### POST /api/upload

TSVファイルをアップロードし、データを読み込む。

**Request**
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  ```typescript
  {
    file: File  // TSVファイル（最大50MB）
  }
  ```

**Request Example (cURL)**
```bash
curl -X POST http://localhost:8000/api/upload \
  -F "file=@predicted_results_all.tsv"
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "fileId": "uuid-v4-string",
    "fileName": "predicted_results_all.tsv",
    "fileSize": 1048576,
    "rowCount": 864,
    "columnCount": 37,
    "uploadedAt": "2026-01-11T10:30:00Z",
    "stats": {
      "totalRaces": 72,
      "totalHorses": 864,
      "dateRange": {
        "start": "20240127",
        "end": "20240203"
      },
      "racecourses": ["東京", "中山", "阪神"],
      "surfaces": ["芝", "ダート"],
      "distanceRange": {
        "min": 1200,
        "max": 3600
      }
    }
  },
  "message": "File uploaded successfully"
}
```

**Error Response (400 Bad Request)**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_FORMAT",
    "message": "アップロードされたファイルはTSV形式ではありません",
    "details": {
      "expectedFormat": "text/tab-separated-values",
      "actualFormat": "text/plain"
    }
  }
}
```

**Error Response (422 Unprocessable Entity)**
```json
{
  "success": false,
  "error": {
    "code": "MISSING_REQUIRED_COLUMNS",
    "message": "必須カラムが不足しています",
    "details": {
      "missingColumns": ["予測順位", "予測スコア"],
      "requiredColumns": ["競馬場", "開催年", "開催日", "レース番号", ...]
    }
  }
}
```

---

### 2.2 データプレビュー API

#### GET /api/data/preview

アップロードされたデータの先頭N件を取得。

**Request**
- **Query Parameters**:
  ```typescript
  {
    fileId: string;      // ファイルID
    limit?: number;      // 取得件数（デフォルト: 20）
    offset?: number;     // オフセット（デフォルト: 0）
  }
  ```

**Request Example**
```
GET /api/data/preview?fileId=uuid-v4-string&limit=10
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "rows": [
      {
        "racecourse": "東京",
        "year": 2024,
        "date": "127",
        "raceNumber": 11,
        "surface": "芝",
        "distance": 2000,
        "horseNumber": 1,
        "horseName": "ロードデルレイ",
        "winOdds": 1.4,
        "popularity": 1,
        "finalRank": 1,
        "predictedRank": 1,
        "predictedScore": 0.5483372386889384,
        // ... other fields
      },
      // ... more rows
    ],
    "total": 864,
    "limit": 10,
    "offset": 0
  }
}
```

---

### 2.3 データ統計情報 API

#### GET /api/data/stats

アップロードされたデータの統計情報を取得。

**Request**
- **Query Parameters**:
  ```typescript
  {
    fileId: string;  // ファイルID
  }
  ```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRaces": 72,
      "totalHorses": 864,
      "averageHorsesPerRace": 12
    },
    "dateRange": {
      "start": "20240127",
      "end": "20240203"
    },
    "racecourses": {
      "東京": 36,
      "中山": 24,
      "阪神": 12
    },
    "surfaces": {
      "芝": 48,
      "ダート": 24
    },
    "distances": {
      "1200": 10,
      "1400": 12,
      "1600": 15,
      "1800": 10,
      "2000": 10,
      "2400": 5
    },
    "predictionAccuracy": {
      "rank1HitRate": 0.35,
      "rank1_3HitRate": 0.68,
      "averagePredictionError": 2.3
    }
  }
}
```

---

### 2.4 バックテスト実行 API

#### POST /api/backtest/execute

指定された戦略でバックテストを実行。

**Request**
- **Content-Type**: `application/json`
- **Body**:
  ```typescript
  {
    fileId: string;              // ファイルID
    strategy: {
      type: 'WIN' | 'PLACE' | 'BRACKET' | 'WIDE' | 'EXACTA' | 'TRIO';
      betAmount: number;         // 1レースあたり購入金額 (100-10000)
      topN?: number;             // 購入対象頭数 (1-10)
      scoreThreshold?: number;   // スコア閾値 (0.0-1.0)
      axisHorse?: number;        // 軸馬（馬番）
    };
    filters?: {
      racecourses?: string[];    // 競馬場フィルタ
      surfaces?: ('芝' | 'ダート')[];
      distanceMin?: number;      // 最小距離
      distanceMax?: number;      // 最大距離
      dateStart?: string;        // 開始日 (YYYYMMDD)
      dateEnd?: string;          // 終了日 (YYYYMMDD)
      oddsMin?: number;          // 最小オッズ
      oddsMax?: number;          // 最大オッズ
      popularityMax?: number;    // 最大人気（この値以下の人気を含む）
    };
  }
  ```

**Request Example**
```json
{
  "fileId": "uuid-v4-string",
  "strategy": {
    "type": "WIN",
    "betAmount": 100,
    "topN": 1
  },
  "filters": {
    "racecourses": ["東京"],
    "surfaces": ["芝"],
    "distanceMin": 1600,
    "distanceMax": 2400
  }
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "executionId": "uuid-v4-string",
    "strategy": {
      "type": "WIN",
      "betAmount": 100,
      "topN": 1
    },
    "filters": { ... },
    "summary": {
      "totalInvestment": 7200,
      "totalReturn": 8350,
      "profit": 1150,
      "roi": 115.97,
      "hitRate": 33.33,
      "hitCount": 24,
      "totalRaces": 72,
      "totalBets": 72,
      "averageReturn": 2.89,
      "maxConsecutiveWins": 5,
      "maxConsecutiveLosses": 8,
      "maxDrawdown": -1200
    },
    "timeline": [
      {
        "date": "20240127",
        "raceNumber": 11,
        "investment": 100,
        "return": 140,
        "profit": 40,
        "cumulativeProfit": 40,
        "roi": 140.0
      },
      // ... more timeline data
    ],
    "details": [
      {
        "racecourse": "東京",
        "date": "20240127",
        "raceNumber": 11,
        "betType": "WIN",
        "betHorses": [1],
        "betAmount": 100,
        "winHorse": 1,
        "winOdds": 1.4,
        "isHit": true,
        "return": 140,
        "profit": 40
      },
      // ... more details
    ],
    "analysis": {
      "byRacecourse": {
        "東京": {
          "totalRaces": 36,
          "hitRate": 38.89,
          "roi": 122.45,
          "profit": 808
        },
        "中山": {
          "totalRaces": 24,
          "hitRate": 29.17,
          "roi": 105.32,
          "profit": 128
        },
        "阪神": {
          "totalRaces": 12,
          "hitRate": 25.0,
          "roi": 98.56,
          "profit": -17
        }
      },
      "bySurface": {
        "芝": {
          "totalRaces": 48,
          "hitRate": 35.42,
          "roi": 118.23,
          "profit": 876
        },
        "ダート": {
          "totalRaces": 24,
          "hitRate": 29.17,
          "roi": 111.43,
          "profit": 274
        }
      },
      "byDistance": {
        "1200": { "hitRate": 40.0, "roi": 125.6 },
        "1400": { "hitRate": 33.3, "roi": 115.2 },
        // ...
      },
      "oddsDistribution": [
        { "oddsRange": "1.0-2.0", "count": 15, "hitRate": 53.3 },
        { "oddsRange": "2.0-3.0", "count": 8, "hitRate": 37.5 },
        { "oddsRange": "3.0-5.0", "count": 5, "hitRate": 20.0 },
        // ...
      ]
    }
  },
  "message": "Backtest completed successfully"
}
```

**Error Response (422 Unprocessable Entity)**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STRATEGY_PARAMS",
    "message": "戦略パラメータが不正です",
    "details": {
      "field": "betAmount",
      "error": "betAmount must be between 100 and 10000"
    }
  }
}
```

---

### 2.5 グリッドサーチ API

#### POST /api/backtest/grid-search

パラメータの複数の組み合わせを自動的に試し、最適なパラメータを探索する。

**Request**
- **Content-Type**: `application/json`
- **Body**:
  ```typescript
  {
    dataFile: string;           // ファイルID
    strategy: {
      strategyType: "WIN" | "PLACE" | "BRACKET" | "WIDE" | "EXACTA" | "TRIO";
      betAmountRange: number[]; // 例: [100, 200, 500]
      topNRange: number[];      // 例: [1, 2, 3]
      scoreThresholdRange: number[]; // 例: [0.0, 0.3, 0.5]
      pivotHorse?: number;      // 軸馬（オプション）
      minOdds?: number;
      maxOdds?: number;
      filters?: {
        racecourses?: string[];
        surfaces?: string[];
        distanceMin?: number;
        distanceMax?: number;
        dateFrom?: string;
        dateTo?: string;
        oddsMin?: number;
        oddsMax?: number;
      };
    };
  }
  ```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "betAmount": 500,
        "topN": 2,
        "scoreThreshold": 0.3,
        "totalRaces": 72,
        "totalBets": 144,
        "hits": 52,
        "hitRate": 36.11,
        "totalInvestment": 72000,
        "totalReturn": 89450,
        "totalProfit": 17450,
        "roi": 124.24,
        "averageOdds": 3.45,
        "maxDrawdown": 0
      }
      // ... 最大10件（ROI降順）
    ],
    "bestParameters": {
      "betAmount": 500,
      "topN": 2,
      "scoreThreshold": 0.3,
      "roi": 124.24
    },
    "totalCombinations": 27
  },
  "message": "Grid search completed. 27 combinations tested."
}
```

---

### 2.6 戦略比較 API

#### POST /api/backtest/compare

複数の戦略を同時に実行し、結果を比較する。

**Request**
- **Content-Type**: `application/json`
- **Body**:
  ```typescript
  {
    dataFile: string;  // ファイルID
    strategies: [
      {
        strategyType: "WIN" | "PLACE" | "BRACKET" | "WIDE" | "EXACTA" | "TRIO";
        strategyName?: string;    // 戦略の名前（比較用）
        betAmount: number;        // 100-10000
        topN: number;            // 1-10
        scoreThreshold: number;  // 0.0-1.0
        pivotHorse?: number;     // 1-18（オプション）
        minOdds?: number;
        maxOdds?: number;
        filters?: {
          racecourses?: string[];
          surfaces?: string[];
          distanceMin?: number;
          distanceMax?: number;
          dateFrom?: string;
          dateTo?: string;
          oddsMin?: number;
          oddsMax?: number;
        };
      }
      // ... 複数の戦略
    ];
  }
  ```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "strategyName": "単勝戦略A",
        "totalRaces": 72,
        "totalBets": 72,
        "hits": 24,
        "hitRate": 33.33,
        "totalInvestment": 7200,
        "totalReturn": 8350,
        "totalProfit": 1150,
        "roi": 115.97,
        "averageOdds": 3.48,
        "maxDrawdown": 0
      },
      {
        "strategyName": "単勝戦略B",
        "totalRaces": 72,
        "totalBets": 144,
        "hits": 52,
        "hitRate": 36.11,
        "totalInvestment": 14400,
        "totalReturn": 17895,
        "totalProfit": 3495,
        "roi": 124.27,
        "averageOdds": 3.44,
        "maxDrawdown": 0
      }
    ],
    "bestStrategy": {
      "strategyName": "単勝戦略B",
      "totalRaces": 72,
      "totalBets": 144,
      "hits": 52,
      "hitRate": 36.11,
      "totalInvestment": 14400,
      "totalReturn": 17895,
      "totalProfit": 3495,
      "roi": 124.27,
      "averageOdds": 3.44,
      "maxDrawdown": 0
    }
  },
  "message": "2つの戦略を比較しました"
}
```

---

### 2.7 複数戦略一括実行 API (旧版・非推奨)

**Note**: この API は古いバージョンです。新しい実装では `/api/backtest/compare` を使用してください。

#### POST /api/backtest/batch

複数の戦略を一括で実行し、結果を比較。

**Request**
- **Content-Type**: `application/json`
- **Body**:
  ```typescript
  {
    fileId: string;
    strategies: Array<{
      name: string;              // 戦略名（ユーザー定義）
      type: StrategyType;
      betAmount: number;
      topN?: number;
      scoreThreshold?: number;
      axisHorse?: number;
    }>;
    filters?: RaceFilter;        // 共通フィルタ
  }
  ```

**Request Example**
```json
{
  "fileId": "uuid-v4-string",
  "strategies": [
    {
      "name": "単勝予測1位",
      "type": "WIN",
      "betAmount": 100,
      "topN": 1
    },
    {
      "name": "複勝予測1-3位",
      "type": "PLACE",
      "betAmount": 100,
      "topN": 3
    },
    {
      "name": "馬連予測1-2位",
      "type": "BRACKET",
      "betAmount": 100,
      "topN": 2
    }
  ],
  "filters": {
    "surfaces": ["芝"]
  }
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "batchId": "uuid-v4-string",
    "results": [
      {
        "strategyName": "単勝予測1位",
        "summary": { ... },
        "timeline": [ ... ],
        "analysis": { ... }
      },
      {
        "strategyName": "複勝予測1-3位",
        "summary": { ... },
        "timeline": [ ... ],
        "analysis": { ... }
      },
      {
        "strategyName": "馬連予測1-2位",
        "summary": { ... },
        "timeline": [ ... ],
        "analysis": { ... }
      }
    ],
    "comparison": {
      "bestRoi": {
        "strategyName": "単勝予測1位",
        "roi": 115.97
      },
      "bestHitRate": {
        "strategyName": "複勝予測1-3位",
        "hitRate": 68.5
      },
      "bestProfit": {
        "strategyName": "単勝予測1位",
        "profit": 1150
      }
    }
  },
  "message": "Batch backtest completed"
}
```

---

### 2.8 利用可能な戦略一覧 API

#### GET /api/backtest/strategies

利用可能な戦略タイプとそれぞれの説明を取得。

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "strategies": [
      {
        "type": "WIN",
        "name": "単勝",
        "description": "予測順位に基づいて単勝馬券を購入します",
        "params": {
          "betAmount": { "type": "number", "required": true, "min": 100, "max": 10000 },
          "topN": { "type": "number", "required": false, "min": 1, "max": 10, "default": 1 },
          "scoreThreshold": { "type": "number", "required": false, "min": 0, "max": 1 }
        }
      },
      {
        "type": "PLACE",
        "name": "複勝",
        "description": "予測順位に基づいて複勝馬券を購入します",
        "params": {
          "betAmount": { "type": "number", "required": true, "min": 100, "max": 10000 },
          "topN": { "type": "number", "required": false, "min": 1, "max": 10, "default": 1 }
        }
      },
      {
        "type": "BRACKET",
        "name": "馬連",
        "description": "予測上位の馬で馬連を購入します",
        "params": {
          "betAmount": { "type": "number", "required": true, "min": 100, "max": 10000 },
          "topN": { "type": "number", "required": true, "min": 2, "max": 10 }
        }
      },
      {
        "type": "WIDE",
        "name": "ワイド",
        "description": "予測上位の馬でワイドを購入します",
        "params": {
          "betAmount": { "type": "number", "required": true, "min": 100, "max": 10000 },
          "topN": { "type": "number", "required": true, "min": 2, "max": 10 }
        }
      },
      {
        "type": "EXACTA",
        "name": "馬単",
        "description": "予測1位→2位で馬単を購入します",
        "params": {
          "betAmount": { "type": "number", "required": true, "min": 100, "max": 10000 },
          "topN": { "type": "number", "required": false, "min": 2, "max": 10 },
          "axisHorse": { "type": "number", "required": false, "description": "軸馬の予測順位" }
        }
      },
      {
        "type": "TRIO",
        "name": "3連複",
        "description": "予測上位3頭で3連複を購入します",
        "params": {
          "betAmount": { "type": "number", "required": true, "min": 100, "max": 10000 },
          "topN": { "type": "number", "required": true, "min": 3, "max": 10 }
        }
      }
    ]
  }
}
```

---

### 2.10 戦略比較分析 API (旧版・非推奨)

**Note**: この API は古いバージョンです。新しい実装では `/api/backtest/compare` を使用してください。

#### POST /api/analysis/compare

複数のバックテスト結果を詳細比較。

**Request**
```typescript
{
  executionIds: string[];  // 比較する実行ID配列
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "comparison": {
      "summary": [
        {
          "executionId": "uuid-1",
          "strategyName": "単勝予測1位",
          "roi": 115.97,
          "hitRate": 33.33,
          "profit": 1150,
          "maxDrawdown": -1200
        },
        {
          "executionId": "uuid-2",
          "strategyName": "複勝予測1-3位",
          "roi": 98.5,
          "hitRate": 68.5,
          "profit": -108,
          "maxDrawdown": -850
        }
      ],
      "radarChart": {
        "metrics": ["ROI", "HitRate", "Profit", "Stability"],
        "data": [
          {
            "strategyName": "単勝予測1位",
            "ROI": 115.97,
            "HitRate": 33.33,
            "Profit": 1150,
            "Stability": 75.5
          },
          // ...
        ]
      }
    }
  }
}
```

---

### 2.9 結果エクスポート API

#### GET /api/analysis/export

バックテスト結果をCSV/Excel形式でエクスポート。

**Request**
- **Query Parameters**:
  ```typescript
  {
    executionId: string;        // 実行ID
    format: 'csv' | 'excel';    // エクスポート形式
    includeDetails?: boolean;   // 詳細データを含むか（デフォルト: true）
  }
  ```

**Response (200 OK)**
- **Content-Type**: `application/octet-stream` or `text/csv`
- **Headers**: `Content-Disposition: attachment; filename="backtest_result.csv"`

---

## 3. データモデル（Pydantic Schemas）

### 3.1 リクエストスキーマ

#### UploadRequest
```python
from pydantic import BaseModel
from fastapi import UploadFile

# FastAPIではUploadFileを直接使用
```

#### StrategyConfig
```python
from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum

class StrategyType(str, Enum):
    WIN = "WIN"
    PLACE = "PLACE"
    BRACKET = "BRACKET"
    WIDE = "WIDE"
    EXACTA = "EXACTA"
    TRIO = "TRIO"

class StrategyConfig(BaseModel):
    type: StrategyType
    betAmount: int = Field(ge=100, le=10000)
    topN: Optional[int] = Field(default=None, ge=1, le=10)
    scoreThreshold: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    axisHorse: Optional[int] = Field(default=None, ge=1, le=18)
```

#### RaceFilter
```python
from typing import Optional, List

class RaceFilter(BaseModel):
    racecourses: Optional[List[str]] = None
    surfaces: Optional[List[Literal["芝", "ダート"]]] = None
    distanceMin: Optional[int] = Field(default=None, ge=1000, le=3600)
    distanceMax: Optional[int] = Field(default=None, ge=1000, le=3600)
    dateStart: Optional[str] = Field(default=None, regex=r'^\d{8}$')
    dateEnd: Optional[str] = Field(default=None, regex=r'^\d{8}$')
    oddsMin: Optional[float] = Field(default=None, ge=1.0)
    oddsMax: Optional[float] = None
    popularityMax: Optional[int] = Field(default=None, ge=1, le=18)
```

#### BacktestRequest
```python
class BacktestRequest(BaseModel):
    fileId: str
    strategy: StrategyConfig
    filters: Optional[RaceFilter] = None
```

#### BatchBacktestRequest
```python
class NamedStrategy(StrategyConfig):
    name: str

class BatchBacktestRequest(BaseModel):
    fileId: str
    strategies: List[NamedStrategy]
    filters: Optional[RaceFilter] = None
```

### 3.2 レスポンススキーマ

#### UploadResponse
```python
from datetime import datetime

class DataStats(BaseModel):
    totalRaces: int
    totalHorses: int
    dateRange: dict
    racecourses: List[str]
    surfaces: List[str]
    distanceRange: dict

class UploadResponseData(BaseModel):
    fileId: str
    fileName: str
    fileSize: int
    rowCount: int
    columnCount: int
    uploadedAt: datetime
    stats: DataStats

class UploadResponse(BaseModel):
    success: bool
    data: UploadResponseData
    message: str
```

#### BacktestResponse
```python
class Summary(BaseModel):
    totalInvestment: int
    totalReturn: float
    profit: float
    roi: float
    hitRate: float
    hitCount: int
    totalRaces: int
    totalBets: int
    averageReturn: float
    maxConsecutiveWins: int
    maxConsecutiveLosses: int
    maxDrawdown: float

class TimelineItem(BaseModel):
    date: str
    raceNumber: int
    investment: int
    return_: float = Field(alias="return")
    profit: float
    cumulativeProfit: float
    roi: float

class RaceDetail(BaseModel):
    racecourse: str
    date: str
    raceNumber: int
    betType: str
    betHorses: List[int]
    betAmount: int
    winHorse: Optional[int]
    winOdds: Optional[float]
    isHit: bool
    return_: float = Field(alias="return")
    profit: float

class AnalysisData(BaseModel):
    totalRaces: int
    hitRate: float
    roi: float
    profit: float

class BacktestResponseData(BaseModel):
    executionId: str
    strategy: StrategyConfig
    filters: Optional[RaceFilter]
    summary: Summary
    timeline: List[TimelineItem]
    details: List[RaceDetail]
    analysis: dict

class BacktestResponse(BaseModel):
    success: bool
    data: BacktestResponseData
    message: str
```

---

## 4. エラーコード一覧

| エラーコード | HTTPステータス | 説明 |
|-------------|---------------|------|
| INVALID_FILE_FORMAT | 415 | ファイル形式が不正 |
| FILE_TOO_LARGE | 413 | ファイルサイズが上限超過 |
| MISSING_REQUIRED_COLUMNS | 422 | 必須カラムが不足 |
| INVALID_DATA_TYPE | 422 | データ型が不正 |
| INVALID_STRATEGY_PARAMS | 422 | 戦略パラメータが不正 |
| FILE_NOT_FOUND | 404 | ファイルIDが見つからない |
| BACKTEST_EXECUTION_ERROR | 500 | バックテスト実行中のエラー |
| DATA_PROCESSING_ERROR | 500 | データ処理エラー |
| UNKNOWN_ERROR | 500 | 不明なエラー |

---

## 5. 実装ガイドライン

### 5.1 FastAPI実装例

```python
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Kirisame Race BackTest API", version="1.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    TSVファイルをアップロード
    
    Args:
        file: TSVファイル
        
    Returns:
        UploadResponse
        
    Raises:
        HTTPException: ファイル形式エラー、バリデーションエラー
    """
    # 実装
    pass

@app.post("/api/backtest/execute")
async def execute_backtest(request: BacktestRequest):
    """
    バックテストを実行
    
    Args:
        request: バックテスト設定
        
    Returns:
        BacktestResponse
        
    Raises:
        HTTPException: パラメータエラー、実行エラー
    """
    # 実装
    pass
```

### 5.2 フロントエンド実装例

```typescript
// services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// services/backtestService.ts
export const executeBacktest = async (
  request: BacktestRequest
): Promise<BacktestResponse> => {
  const response = await apiClient.post<BacktestResponse>(
    '/backtest/execute',
    request
  );
  return response.data;
};

// Component内での使用例
const { data, isLoading, error } = useQuery(
  ['backtest', strategyConfig],
  () => executeBacktest({ fileId, strategy: strategyConfig, filters })
);
```

---

## 6. セキュリティ考慮事項

### 6.1 ファイルアップロード
- ファイルサイズ制限: 50MB
- ファイルタイプ検証: `text/tab-separated-values`, `text/plain`
- ファイル名サニタイズ: 特殊文字の除去

### 6.2 入力検証
- すべての入力パラメータをPydanticで検証
- SQLインジェクション対策（該当なし、DBなし）
- XSS対策（フロントエンドでサニタイズ）

### 6.3 レート制限
- 将来的にはリクエストレート制限を実装（例: 100req/min）

---

## 7. テストケース

### 7.1 アップロードAPI

```python
def test_upload_valid_tsv():
    """正常なTSVファイルのアップロード"""
    with open("test_data.tsv", "rb") as f:
        response = client.post("/api/upload", files={"file": f})
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert "fileId" in response.json()["data"]

def test_upload_invalid_format():
    """不正なファイル形式"""
    with open("test.csv", "rb") as f:
        response = client.post("/api/upload", files={"file": f})
    assert response.status_code == 415
    assert response.json()["success"] is False
```

### 7.2 バックテストAPI

```python
def test_execute_backtest_win_strategy():
    """単勝戦略のバックテスト"""
    request = {
        "fileId": "test-uuid",
        "strategy": {
            "type": "WIN",
            "betAmount": 100,
            "topN": 1
        }
    }
    response = client.post("/api/backtest/execute", json=request)
    assert response.status_code == 200
    assert response.json()["data"]["summary"]["roi"] > 0
```

---

**作成日**: 2026年1月11日  
**バージョン**: 1.0  
**作成者**: GitHub Copilot Assistant
