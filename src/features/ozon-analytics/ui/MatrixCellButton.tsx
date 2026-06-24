'use client';

import React from 'react';
import styles from '@/styles/sales-matrix.module.css';
import { MatrixCellData } from '../model/useExportedMatrix';

interface Props {
  cell: MatrixCellData;
  onClick?: () => void;
  isClickable?: boolean;
}

export function MatrixCellButton({ cell, onClick, isClickable = true }: Props) {
  if (cell.products.length === 0) return <div className={styles.emptyCell}>-</div>;

  const share = cell.shareInColumn || 0;
  
  let shareColorClass = styles.shareNeutral;
  if (share > 30) shareColorClass = styles.shareHigh;
  else if (share < 5) shareColorClass = styles.shareLow;

  return (
    <div className={styles.cellButtonContent}>
      <div className={styles.cellMain}>
        <span className={styles.cellRevenue}>{cell.revenue.toLocaleString('ru-RU')} ₽</span>
        <span className={styles.cellUnits}>{cell.sales} шт</span>
      </div>
      
      <div className={styles.cellFooter}>
        <span className={`${styles.cellShare} ${shareColorClass}`}>
          {share.toFixed(1)}%
        </span>
        
        {/* Mock Sparkline */}
        <div className={styles.sparkline}>
          <svg viewBox="0 0 50 15" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              points="0,10 10,12 20,8 30,10 40,5 50,2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
