import { create } from 'zustand';

interface MatrixDrilldownState {
  expandedRows: Set<string>;
  expandedCells: Set<string>; // Format: "rowId-sizeFt"

  toggleRow: (rowId: string) => void;
  toggleCell: (rowId: string, sizeFt: string) => void;
  collapseAll: () => void;
}

export const useMatrixDrilldown = create<MatrixDrilldownState>((set) => ({
  expandedRows: new Set(),
  expandedCells: new Set(),

  toggleRow: (rowId) => set((state) => {
    const newExpanded = new Set(state.expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
      // Optional: automatically collapse children when closing parent
      // This logic can be added if needed, but for now we just toggle the parent.
    } else {
      newExpanded.add(rowId);
    }
    return { expandedRows: newExpanded };
  }),

  toggleCell: (rowId, sizeFt) => set((state) => {
    const cellId = `${rowId}-${sizeFt}`;
    const newExpanded = new Set(state.expandedCells);
    if (newExpanded.has(cellId)) {
      newExpanded.delete(cellId);
    } else {
      newExpanded.add(cellId);
    }
    return { expandedCells: newExpanded };
  }),

  collapseAll: () => set({
    expandedRows: new Set(),
    expandedCells: new Set(),
  })
}));
