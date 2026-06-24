import { create } from 'zustand';
import { GroupingMode, MetricMode } from './types';

export type ShareMode = 'column' | 'total';

export type DateRange = {
  preset: 'today' | 'yesterday' | '7days' | '28days' | 'quarter' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
};

interface GlobalFiltersState {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;

  selectedSellers: string[];
  setSelectedSellers: (sellers: string[]) => void;
  toggleSeller: (seller: string) => void;

  groupingMode: GroupingMode;
  setGroupingMode: (mode: GroupingMode) => void;

  metricMode: MetricMode;
  setMetricMode: (mode: MetricMode) => void;

  shareMode: ShareMode;
  setShareMode: (mode: ShareMode) => void;
}

export const useGlobalFilters = create<GlobalFiltersState>((set) => ({
  dateRange: { preset: '28days' },
  setDateRange: (range) => set({ dateRange: range }),

  selectedSellers: [], // empty means all
  setSelectedSellers: (sellers) => set({ selectedSellers: sellers }),
  toggleSeller: (seller) => set((state) => ({
    selectedSellers: state.selectedSellers.includes(seller)
      ? state.selectedSellers.filter((s) => s !== seller)
      : [...state.selectedSellers, seller]
  })),

  groupingMode: 'competitor',
  setGroupingMode: (mode) => set({ groupingMode: mode }),

  metricMode: 'revenue',
  setMetricMode: (mode) => set({ metricMode: mode }),

  shareMode: 'column',
  setShareMode: (mode) => set({ shareMode: mode }),
}));
