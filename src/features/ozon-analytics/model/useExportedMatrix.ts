import { useMemo } from 'react';
import productsData from '../../../data/ozon/products-export.json';
import { ExportedProduct, FunnelMetrics } from './types';
import { useGlobalFilters } from './useGlobalFilters';
import { classifyProduct } from '../lib/product-classifier';

export const FEET_COLUMNS = ['-3ft', '3ft', '4ft', '5ft', '6ft', '7ft'];

export interface MatrixCellData {
  revenue: number;
  sales: number;
  price: number; // avg price
  buyoutPercent: number; // avg buyout
  funnel: FunnelMetrics;
  products: ExportedProduct[];
  shareInColumn: number;
}

export interface MatrixRowData {
  id: string; // seller or brand name
  name: string;
  cells: Record<string, MatrixCellData>;
  totalRevenue: number;
  totalSales: number;
  children: MatrixRowData[]; // L2 rows
}

function createEmptyCell(): MatrixCellData {
  return {
    revenue: 0,
    sales: 0,
    price: 0,
    buyoutPercent: 0,
    funnel: { impressions: 0, clicks: 0, ctr: 0, addToCartPercent: 0, drr: 0 },
    products: [],
    shareInColumn: 0
  };
}

function aggregateCells(products: ExportedProduct[], columnTotalsAll: Record<string, number>): Record<string, MatrixCellData> {
  const cells: Record<string, MatrixCellData> = {};
  FEET_COLUMNS.forEach(ft => cells[ft] = createEmptyCell());

  products.forEach(p => {
    const ft = p.feetCategory || 'Unknown';
    if (!cells[ft]) cells[ft] = createEmptyCell();
    
    // Calculate product's share in column
    if (columnTotalsAll[ft] > 0) {
      p.shareInColumn = (p.revenue / columnTotalsAll[ft]) * 100;
    } else {
      p.shareInColumn = 0;
    }

    const cell = cells[ft];
    cell.revenue += p.revenue;
    cell.sales += p.sales;
    cell.products.push(p);
    
    cell.funnel.impressions += p.funnel.impressions;
    cell.funnel.clicks += p.funnel.clicks;
  });

  // Calculate averages
  Object.entries(cells).forEach(([ft, cell]) => {
    if (columnTotalsAll[ft] > 0) {
      cell.shareInColumn = (cell.revenue / columnTotalsAll[ft]) * 100;
    }
    if (cell.products.length > 0) {
      cell.price = cell.revenue / (cell.sales || 1); // rough avg
      cell.buyoutPercent = cell.products.reduce((acc, p) => acc + p.buyoutPercent, 0) / cell.products.length;
      if (cell.funnel.impressions > 0) {
        cell.funnel.ctr = (cell.funnel.clicks / cell.funnel.impressions) * 100;
      }

      let totalAdSpend = 0;
      let totalAddToCartEvents = 0;
      cell.products.forEach(p => {
        totalAdSpend += (p.revenue * p.funnel.drr) / 100;
        totalAddToCartEvents += (p.funnel.clicks * p.funnel.addToCartPercent) / 100;
      });

      cell.funnel.addToCartPercent = cell.funnel.clicks > 0 ? (totalAddToCartEvents / cell.funnel.clicks) * 100 : 0;
      cell.funnel.drr = cell.revenue > 0 ? (totalAdSpend / cell.revenue) * 100 : 0;
    }
  });

  return cells;
}

export function useExportedMatrix() {
  const { groupingMode, selectedSellers } = useGlobalFilters();

  const matrix = useMemo(() => {
    const rawProductsUnfiltered = (productsData as unknown[]).map((p) => {
      const prod = p as Record<string, unknown>;
      const funnel = prod.funnel as Record<string, number>;
      return {
        ...prod,
        shareInColumn: 0,
        funnel: {
          ...funnel,
          clicks: funnel.cardViews
        },
        tags: classifyProduct(p.name as string).tags,
      };
    }) as ExportedProduct[];

    const columnTotalsAll: Record<string, number> = {};
    FEET_COLUMNS.forEach(ft => columnTotalsAll[ft] = 0);
    rawProductsUnfiltered.forEach(p => {
      const ft = p.feetCategory || 'Unknown';
      if (columnTotalsAll[ft] !== undefined) {
        columnTotalsAll[ft] += p.revenue;
      }
    });

    let rawProducts = rawProductsUnfiltered;

    // Filter by selected sellers
    if (selectedSellers.length > 0) {
      rawProducts = rawProducts.filter(p => selectedSellers.includes(p.seller));
    }

    const rowsMap = new Map<string, ExportedProduct[]>();

    rawProducts.forEach(p => {
      const primaryKey = groupingMode === 'competitor' ? p.seller : p.brand;
      if (!primaryKey) return;
      if (!rowsMap.has(primaryKey)) rowsMap.set(primaryKey, []);
      rowsMap.get(primaryKey)!.push(p);
    });

    const rows: MatrixRowData[] = [];

    Array.from(rowsMap.entries()).forEach(([primaryKey, primaryProducts]) => {
      // Group L2
      const l2Map = new Map<string, ExportedProduct[]>();
      primaryProducts.forEach(p => {
        const secondaryKey = groupingMode === 'competitor' ? p.brand : p.seller;
        const key = secondaryKey || 'Unknown';
        if (!l2Map.has(key)) l2Map.set(key, []);
        l2Map.get(key)!.push(p);
      });

      const children: MatrixRowData[] = [];
      Array.from(l2Map.entries()).forEach(([secondaryKey, secondaryProducts]) => {
        children.push({
          id: `${primaryKey}-${secondaryKey}`,
          name: secondaryKey,
          cells: aggregateCells(secondaryProducts, columnTotalsAll),
          totalRevenue: secondaryProducts.reduce((acc, p) => acc + p.revenue, 0),
          totalSales: secondaryProducts.reduce((acc, p) => acc + p.sales, 0),
          children: []
        });
      });

      // Sort children by revenue
      children.sort((a, b) => b.totalRevenue - a.totalRevenue);

      rows.push({
        id: primaryKey,
        name: primaryKey,
        cells: aggregateCells(primaryProducts, columnTotalsAll),
        totalRevenue: primaryProducts.reduce((acc, p) => acc + p.revenue, 0),
        totalSales: primaryProducts.reduce((acc, p) => acc + p.sales, 0),
        children
      });
    });

    // Sort rows by revenue
    rows.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Calculate max values for heatmap
    let maxRevenue = 0;
    let maxSales = 0;
    rows.forEach(r => {
      Object.values(r.cells).forEach(c => {
        if (c.revenue > maxRevenue) maxRevenue = c.revenue;
        if (c.sales > maxSales) maxSales = c.sales;
      });
    });

    return { rows, maxRevenue, maxSales, columnTotalsAll };
  }, [groupingMode, selectedSellers]);

  return matrix;
}
