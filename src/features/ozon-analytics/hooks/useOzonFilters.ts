'use client';

import { create } from 'zustand';
import { WorkScheme, ProductTag } from '../model/types';

export type SortField =
  | 'revenue'
  | 'ordered'
  | 'buyoutPercent'
  | 'rating'
  | 'reviews'
  | 'contentScore'
  | 'velocity'
  | 'price'
  | 'asp';

export type SortDirection = 'asc' | 'desc';

export interface OzonFilters {
  // Фильтры
  selectedBrandIds: string[];
  selectedSizes: number[];
  selectedSchemes: WorkScheme[];
  selectedTags: ProductTag[];
  hasVideoOnly: boolean;
  minRating: number | null;   // null = без ограничений
  minContentScore: number | null;
  searchQuery: string;

  // Сортировка таблицы
  sortField: SortField;
  sortDirection: SortDirection;

  // Активный режим матрицы
  metricMode: 'revenue' | 'units' | 'sharePercent' | 'velocity' | 'asp' | 'buyoutPercent';

  // Actions
  setSelectedBrands: (ids: string[]) => void;
  toggleBrand: (id: string) => void;
  setSelectedSizes: (sizes: number[]) => void;
  toggleSize: (size: number) => void;
  setSelectedSchemes: (schemes: WorkScheme[]) => void;
  toggleScheme: (scheme: WorkScheme) => void;
  setSelectedTags: (tags: ProductTag[]) => void;
  toggleTag: (tag: ProductTag) => void;
  setHasVideoOnly: (value: boolean) => void;
  setMinRating: (value: number | null) => void;
  setMinContentScore: (value: number | null) => void;
  setSearchQuery: (query: string) => void;
  setSort: (field: SortField, direction?: SortDirection) => void;
  setMetricMode: (mode: OzonFilters['metricMode']) => void;
  resetFilters: () => void;
}

const defaultState = {
  selectedBrandIds: [] as string[],
  selectedSizes: [] as number[],
  selectedSchemes: [] as WorkScheme[],
  selectedTags: [] as ProductTag[],
  hasVideoOnly: false,
  minRating: null as number | null,
  minContentScore: null as number | null,
  searchQuery: '',
  sortField: 'revenue' as SortField,
  sortDirection: 'desc' as SortDirection,
  metricMode: 'revenue' as OzonFilters['metricMode'],
};

export const useOzonFilters = create<OzonFilters>((set, get) => ({
  ...defaultState,

  setSelectedBrands: (ids) => set({ selectedBrandIds: ids }),

  toggleBrand: (id) => {
    const current = get().selectedBrandIds;
    set({
      selectedBrandIds: current.includes(id)
        ? current.filter((b) => b !== id)
        : [...current, id],
    });
  },

  setSelectedSizes: (sizes) => set({ selectedSizes: sizes }),

  toggleSize: (size) => {
    const current = get().selectedSizes;
    set({
      selectedSizes: current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size],
    });
  },

  setSelectedSchemes: (schemes) => set({ selectedSchemes: schemes }),

  toggleScheme: (scheme) => {
    const current = get().selectedSchemes;
    set({
      selectedSchemes: current.includes(scheme)
        ? current.filter((s) => s !== scheme)
        : [...current, scheme],
    });
  },

  setHasVideoOnly: (value) => set({ hasVideoOnly: value }),
  setMinRating: (value) => set({ minRating: value }),
  setMinContentScore: (value) => set({ minContentScore: value }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedTags: (tags) => set({ selectedTags: tags }),

  toggleTag: (tag) => {
    const current = get().selectedTags;
    set({
      selectedTags: current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
    });
  },

  setSort: (field, direction) => {
    const current = get();
    // Если та же колонка — инвертировать направление, иначе сбросить на desc
    const newDirection =
      direction ?? (current.sortField === field && current.sortDirection === 'desc' ? 'asc' : 'desc');
    set({ sortField: field, sortDirection: newDirection });
  },

  setMetricMode: (mode) => set({ metricMode: mode }),

  resetFilters: () => set({ ...defaultState }),
}));
