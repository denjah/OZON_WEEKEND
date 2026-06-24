'use client';

import { create } from 'zustand';
import { AggregatedProduct } from '../model/types';

interface SelectedProductState {
  product: AggregatedProduct | null;
  isOpen: boolean;
  open: (product: AggregatedProduct) => void;
  close: () => void;
}

export const useSelectedProduct = create<SelectedProductState>((set) => ({
  product: null,
  isOpen: false,
  open: (product) => set({ product, isOpen: true }),
  close: () => set({ isOpen: false }),
}));
