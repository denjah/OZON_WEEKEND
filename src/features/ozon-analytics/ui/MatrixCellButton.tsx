'use client';

import React from 'react';
import styles from '@/styles/sales-matrix.module.css';
import { MatrixCellData } from '../model/useExportedMatrix';
import { useGlobalFilters } from '../model/useGlobalFilters';

interface Props {
  cell: MatrixCellData;
  onClick?: () => void;
  isClickable?: boolean;
}

export function MatrixCellButton({ cell, onClick, isClickable = true }: Props) {
  const { metricMode } = useGlobalFilters();
  if (cell.products.length === 0) return <div className={styles.emptyCell}>-</div>;

  const share = cell.shareInColumn || 0;
  
  let shareColorClass = styles.shareNeutral;
  let barColor = '#9CA3AF';
  if (share > 25) {
    shareColorClass = styles.shareHigh;
    barColor = '#10B981';
  } else if (share < 5) {
    shareColorClass = styles.shareLow;
    barColor = '#EF4444';
  }

  if (metricMode === 'funnel') {
    return (
      <div className={styles.cellButtonContent}>
        <div className={styles.cellFunnelGrid}>
          <div className={styles.funnelStat}>
            <span className={styles.funnelIcon}>👁</span>
            <span className={styles.funnelVal}>{(cell.funnel.impressions / 1000).toFixed(1)}K</span>
          </div>
          <div className={styles.funnelStat}>
            <span className={styles.funnelLabel}>CTR</span>
            <span className={styles.funnelVal}>{cell.funnel.ctr.toFixed(1)}%</span>
          </div>
          <div className={styles.funnelStat}>
            <span className={styles.funnelIcon}>🛒</span>
            <span className={styles.funnelVal}>{cell.funnel.addToCartPercent.toFixed(1)}%</span>
          </div>
          <div className={styles.funnelStat}>
            <span className={styles.funnelLabel}>ДРР</span>
            <span className={styles.funnelVal}>{cell.funnel.drr.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cellButtonContent}>
      <div className={styles.cellMain}>
        <span className={styles.cellRevenue}>{cell.revenue.toLocaleString('ru-RU')} ₽</span>
        <span className={styles.cellUnits}>{cell.sales} шт</span>
      </div>
      
      <div className={styles.cellFooter}>
        <div className={styles.shareBarContainer}>
          <div className={styles.shareBar}>
            <div 
              className={styles.shareBarFill} 
              style={{ width: `${Math.min(share, 100)}%`, backgroundColor: barColor }} 
            />
          </div>
          <span className={`${styles.cellShare} ${shareColorClass}`}>
            {share.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
