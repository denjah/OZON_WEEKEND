'use client';

import { create } from 'zustand';
import { AggregatedProduct } from '../model/types';

const MAX_COMPARE = 4;

interface ComparedProductsState {
  products: AggregatedProduct[];
  isComparing: boolean;
  add: (product: AggregatedProduct) => void;
  remove: (id: string) => void;
  toggle: (product: AggregatedProduct) => void;
  isSelected: (id: string) => boolean;
  clear: () => void;
  startComparing: () => void;
  stopComparing: () => void;
}

export const useComparedProducts = create<ComparedProductsState>((set, get) => ({
  products: [],
  isComparing: false,

  add: (product) => {
    const { products } = get();
    if (products.length >= MAX_COMPARE) return;
    if (products.some((p) => p.id === product.id)) return;
    set({ products: [...products, product] });
  },

  remove: (id) => {
    set({ products: get().products.filter((p) => p.id !== id) });
  },

  toggle: (product) => {
    const { products, add, remove } = get();
    if (products.some((p) => p.id === product.id)) {
      remove(product.id);
    } else {
      add(product);
    }
  },

  isSelected: (id) => get().products.some((p) => p.id === id),

  clear: () => set({ products: [], isComparing: false }),

  startComparing: () => set({ isComparing: true }),

  stopComparing: () => set({ isComparing: false }),
}));
