import { create } from 'zustand';
import { ExportedProduct } from './types';

interface CellContext {
  title: string;
}

interface ProductSlidePanelState {
  isOpen: boolean;
  products: ExportedProduct[];
  cellContext: CellContext | null;
  openPanel: (products: ExportedProduct[], context: CellContext) => void;
  closePanel: () => void;
}

export const useProductSlidePanel = create<ProductSlidePanelState>((set) => ({
  isOpen: false,
  products: [],
  cellContext: null,
  openPanel: (products, cellContext) => set({ isOpen: true, products, cellContext }),
  closePanel: () => set({ isOpen: false, products: [], cellContext: null }),
}));
