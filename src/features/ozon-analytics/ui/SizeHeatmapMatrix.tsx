'use client';

import React, { useMemo } from 'react';
import styles from '@/styles/ozon.module.css';
import { SizeMatrixRow, SizeMatrixCell } from '../model/types';
import { useOzonFilters } from '../hooks/useOzonFilters';
import { formatCurrency, formatNumber, formatPercent, formatVelocity } from '../lib/formatters';

interface SizeHeatmapMatrixProps {
  matrixRows: SizeMatrixRow[];
  availableSizes: number[];
}

export function SizeHeatmapMatrix({ matrixRows, availableSizes }: SizeHeatmapMatrixProps) {
  const { metricMode } = useOzonFilters();

  const getCellValue = (cell: SizeMatrixCell | undefined, mode: typeof metricMode): number => {
    if (!cell) return 0;
    if (mode === 'units') return cell.orderedUnits;
    // We can cast the rest because the remaining metricMode values map exactly to keys on SizeMatrixCell
    return cell[mode as keyof SizeMatrixCell] as number;
  };

  // Find max value to calculate opacity/color intensity
  const maxValue = useMemo(() => {
    let max = 0;
    for (const row of matrixRows) {
      for (const size of availableSizes) {
        const val = getCellValue(row.cells[size], metricMode);
        if (val > max) max = val;
      }
    }
    return max || 1; // prevent division by zero
  }, [matrixRows, availableSizes, metricMode]);

  const formatCellValue = (val: number) => {
    if (val === 0) return '-';
    switch (metricMode) {
      case 'revenue': return formatCurrency(val);
      case 'units': return formatNumber(val);
      case 'sharePercent': return formatPercent(val);
      case 'velocity': return formatVelocity(val);
      case 'asp': return formatCurrency(val);
      case 'buyoutPercent': return formatPercent(val);
      default: return val.toString();
    }
  };

  const getHeatmapColor = (val: number, brandColor: string) => {
    if (val === 0) return 'transparent';
    const intensity = Math.max(0.1, val / maxValue);
    
    // Parse hex to rgb for rgba manipulation
    const hex = brandColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 91;
    const b = parseInt(hex.substring(4, 6), 16) || 255;
    
    return `rgba(${r}, ${g}, ${b}, ${intensity})`;
  };

  if (matrixRows.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyText}>Нет данных для матрицы</div>
      </div>
    );
  }

  return (
    <div className={styles.matrixWrapper}>
      <table className={styles.matrixTable}>
        <thead>
          <tr>
            <th>Бренд</th>
            {availableSizes.map(size => (
              <th key={size} style={{ textAlign: 'center' }}>{size}ft</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrixRows.map(row => (
            <tr key={row.brand.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span 
                    style={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: row.brand.color || '#005BFF' 
                    }} 
                  />
                  <span style={{ fontWeight: 600 }}>{row.brand.name}</span>
                </div>
              </td>
              {availableSizes.map(size => {
                const cell = row.cells[size];
                const val = getCellValue(cell, metricMode);
                
                return (
                  <td key={size} style={{ textAlign: 'center', padding: '4px' }}>
                    {val > 0 ? (
                      <div 
                        className={styles.matrixCell}
                        style={{ backgroundColor: getHeatmapColor(val, row.brand.color || '#005BFF') }}
                        title={`${row.brand.name} (${size}ft): ${formatCellValue(val)}`}
                      >
                        <span className={styles.cellValue}>{formatCellValue(val)}</span>
                      </div>
                    ) : (
                      <span className={styles.cellEmpty}>-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SizeHeatmapMatrix;
