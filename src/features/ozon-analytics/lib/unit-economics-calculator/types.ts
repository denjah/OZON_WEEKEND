export type AggregationMethod = 'median_top5' | 'weighted_average';

export interface DLDiscounts {
  packaging: number; // e.g. 50%
  expediting: number; // e.g. 20%
  transportation: number; // e.g. 10%
  tracking: number; // e.g. 100%
  loading: number; // e.g. 40%
}

export interface Dimensions {
  length: number; // mm
  width: number;  // mm
  height: number; // mm
  weight: number; // g
  volume: number; // liters
}

export interface LogisticsTariff {
  from: string;
  to: string;
  volume: string; // e.g. '0-0,200 л'
  price_under_300: number;
  price_over_300: number;
}

export interface RouteStats {
  from: string;
  to: string;
  count: number;
  weight: number;
}

export interface LocalityStats {
  top5: RouteStats[];
  all_routes: RouteStats[];
}

export interface CalcInput {
  sellingPrice: number;
  cogs: number;
  commissionPercent: number;
  acquiringPercent: number;
  taxPercent: number;
  returnsPercent: number;
  dimensions: Dimensions | null;
  method: AggregationMethod;
  dlDiscounts: DLDiscounts;
}

export interface LogisticsResult {
  cost: number;
  returnCost: number;
  details: string; // Breakdown or explanation
}

export interface CalcResult {
  totalExpenses: number;
  netProfit: number;
  marginPercent: number;
  roiPercent: number;
  breakEven: number;
  commission: number;
  acquiring: number;
  tax: number;
  logistics: LogisticsResult;
}
