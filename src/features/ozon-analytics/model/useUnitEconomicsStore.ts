import { create } from 'zustand';
import { AggregationMethod, DLDiscounts, Dimensions, calculateEconomics } from '../lib/unit-economics-calculator';

export type Scheme = 'fbo' | 'fbs' | 'rfbs';

export interface UnitEconomicsState {
  scheme: Scheme;
  sellingPrice: number;
  cogs: number;
  commissionPercent: number;
  acquiringPercent: number;
  returnsPercent: number;
  taxPercent: number;
  
  // New calculator parameters
  selectedSku: string | null;
  dimensions: Dimensions | null;
  method: AggregationMethod;
  dlDiscounts: DLDiscounts;

  setScheme: (scheme: Scheme) => void;
  setField: (field: string, value: unknown) => void;
  setDlDiscount: (key: keyof DLDiscounts, value: number) => void;
}

export const useUnitEconomicsStore = create<UnitEconomicsState>((set) => ({
  scheme: 'fbo',
  sellingPrice: 15000,
  cogs: 6000,
  commissionPercent: 15,
  acquiringPercent: 1.5,
  returnsPercent: 5,
  taxPercent: 6,
  
  selectedSku: null,
  dimensions: null,
  method: 'median_top5',
  dlDiscounts: {
    packaging: 50,
    expediting: 20,
    transportation: 10,
    tracking: 100,
    loading: 40
  },

  setScheme: (scheme) => set({ scheme }),
  setField: (field, value) => set({ [field]: value }),
  setDlDiscount: (key, value) => set((state) => ({ 
    dlDiscounts: { ...state.dlDiscounts, [key]: value } 
  })),
}));

export function useUnitEconomicsCalculations() {
  const store = useUnitEconomicsStore();

  const calcResult = calculateEconomics({
    sellingPrice: store.sellingPrice,
    cogs: store.cogs,
    commissionPercent: store.commissionPercent,
    acquiringPercent: store.acquiringPercent,
    taxPercent: store.taxPercent,
    returnsPercent: store.returnsPercent,
    dimensions: store.dimensions,
    method: store.method,
    dlDiscounts: store.dlDiscounts
  }, store.scheme);

  return {
    ...calcResult
  };
}
