// 型定義を集約

export interface ParameterSettings {
  betAmount: number;
  topN: number;
  scoreThreshold: number;
  pivotHorse: number | null;
}

export interface RaceFilters {
  racecourses: string[];
  surfaces: string[];
  distanceMin: number | null;
  distanceMax: number | null;
  dateFrom: string | null;
  dateTo: string | null;
  oddsMin: number | null;
  oddsMax: number | null;
}
