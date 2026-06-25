'use client';

import React from 'react';
import styles from '@/styles/sales-matrix.module.css';
import { FEET_COLUMNS, MatrixRowData, MatrixCellData } from '../model/useExportedMatrix';
import { useMatrixDrilldown } from '../model/useMatrixDrilldown';
import { useGlobalFilters } from '../model/useGlobalFilters';
import { MatrixProductsExpand } from './MatrixProductsExpand';
import { MatrixCellButton } from './MatrixCellButton';

interface Props {
  row: MatrixRowData;
  isLevel2?: boolean;
  maxRevenue: number;
  maxSales: number;
}

export function MatrixRow({ row, isLevel2 = false, maxRevenue, maxSales }: Props) {
  const { expandedRows, toggleRow, expandedCells, toggleCell } = useMatrixDrilldown();
  const { metricMode } = useGlobalFilters();

  const isExpanded = expandedRows.has(row.id);

  const renderCellValue = (cell: MatrixCellData) => {
    switch (metricMode) {
      case 'revenue':
      case 'funnel':
        return <MatrixCellButton cell={cell} />;
      case 'buyoutPercent': return `${Math.round(cell.buyoutPercent)}%`;
      default: return '-';
    }
  };

  const getHeatmapColor = (cell: MatrixCellData) => {
    if (metricMode === 'funnel' || cell.products.length === 0) return 'transparent';
    let intensity = 0;
    if (metricMode === 'revenue' && maxRevenue > 0) {
      intensity = cell.revenue / maxRevenue;
    }
    // Deep blue/cyan heatmap
    if (intensity === 0) return 'transparent';
    return `rgba(56, 189, 248, ${Math.max(0.05, intensity * 0.5)})`;
  };

  return (
    <>
      <tr className={`${styles.row} ${isLevel2 ? styles.drilldownRowLevel2 : ''}`}>
        <td className={styles.cell}>
          <div className={styles.rowLabel}>
            {!isLevel2 && row.children.length > 0 && (
              <button 
                className={`${styles.expander} ${isExpanded ? styles.expanded : ''}`}
                onClick={() => toggleRow(row.id)}
              >
                ▶
              </button>
            )}
            {isLevel2 && <div style={{ width: 24, marginRight: 12 }} />}
            {row.name}
          </div>
        </td>
        
        {FEET_COLUMNS.map(ft => {
          const cell = row.cells[ft];
          const hasProducts = cell && cell.products.length > 0;
          const cellId = `${row.id}-${ft}`;

          return (
            <td key={ft} className={styles.cell}>
              {hasProducts ? (
                <button 
                  className={`${styles.heatmapCell} ${expandedCells.has(cellId) ? styles.cellActive : ''}`} 
                  style={{ background: getHeatmapColor(cell) }}
                  onClick={() => toggleCell(row.id, ft)}
                >
                  {renderCellValue(cell)}
                </button>
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.2)' }}>-</div>
              )}
            </td>
          );
        })}
      </tr>

      {/* Render Expanded Cells Inline */}
      {FEET_COLUMNS.map(ft => {
        const cellId = `${row.id}-${ft}`;
        if (expandedCells.has(cellId) && row.cells[ft] && row.cells[ft].products.length > 0) {
          return (
            <MatrixProductsExpand 
              key={`expand-${cellId}`}
              cell={row.cells[ft]}
              title={`${row.name} × ${ft}`}
              onClose={() => toggleCell(row.id, ft)}
              colSpan={FEET_COLUMNS.length + 1}
            />
          );
        }
        return null;
      })}

      {/* Render L2 Children */}
      {isExpanded && !isLevel2 && row.children.map(child => (
        <React.Fragment key={child.id}>
          <MatrixRow 
            row={child} 
            isLevel2={true} 
            maxRevenue={maxRevenue} 
            maxSales={maxSales} 
          />
        </React.Fragment>
      ))}
    </>
  );
}
