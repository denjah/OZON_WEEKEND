'use client';

import React from 'react';
import styles from '@/styles/unit-economics.module.css';

interface Props {
  netProfit: number;
  marginPercent: number;
  roiPercent: number;
}

export function EconomicsOutputGrid({ netProfit, marginPercent, roiPercent }: Props) {
  let roiClass = styles.roiGood;
  if (roiPercent < 10) roiClass = styles.roiDanger;
  else if (roiPercent < 30) roiClass = styles.roiWarning;

  return (
    <div className={styles.outputGrid}>
      <div className={styles.outputWidget}>
        <span className={styles.widgetLabel}>Чистая прибыль</span>
        <span 
          className={styles.widgetValue}
          style={{ color: netProfit < 0 ? '#EF4444' : 'var(--text-primary)' }}
        >
          {netProfit > 0 ? '+' : ''}{Math.round(netProfit).toLocaleString('ru-RU')} ₽
        </span>
      </div>
      
      <div className={styles.outputWidget}>
        <span className={styles.widgetLabel}>Маржинальность</span>
        <span className={styles.widgetValue}>
          {marginPercent.toFixed(1)}%
        </span>
      </div>
      
      <div className={styles.outputWidget}>
        <span className={styles.widgetLabel}>ROI</span>
        <span className={`${styles.widgetValue} ${roiClass}`}>
          {roiPercent.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
