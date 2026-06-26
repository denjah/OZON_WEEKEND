'use client';

import React from 'react';
import styles from '@/styles/sales-matrix.module.css';
import { useExportedMatrix, FEET_COLUMNS } from '../model/useExportedMatrix';
import { useGlobalFilters } from '../model/useGlobalFilters';
import { MatrixRow } from './MatrixRow';

export function SalesMatrix() {
  const { rows, maxRevenue, maxSales } = useExportedMatrix();
  const { groupingMode } = useGlobalFilters();

  const firstColumnHeader = groupingMode === 'competitor' ? 'Конкурент / Бренд' : 'Бренд / Конкурент';

  if (!rows || rows.length === 0) {
    return (
      <div className={styles.container} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
        Нет данных для отображения. Проверьте фильтры.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th} style={{ minWidth: '250px' }}>
              {firstColumnHeader}
            </th>
            {FEET_COLUMNS.map(ft => (
              <th key={ft} className={styles.th}>
                {ft}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <MatrixRow 
              key={row.id} 
              row={row} 
              maxRevenue={maxRevenue} 
              maxSales={maxSales} 
            />
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default SalesMatrix;
