'use client';

import React from 'react';
import styles from '@/styles/ozon.module.css';
import { IconArrowUp, IconArrowDown, IconMinus } from '@/components/icons';

interface OzonKpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'stable';
  deltaLabel?: string;
  details?: string;
}

export function OzonKpiCard({
  icon,
  label,
  value,
  delta,
  deltaDirection = 'stable',
  deltaLabel,
  details,
}: OzonKpiCardProps) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiHeader}>
        <span className={styles.kpiIcon}>{icon}</span>
        <span className={styles.kpiLabel}>{label}</span>
      </div>
      <div className={styles.kpiValue}>{value}</div>
      {delta && (
        <span className={`${styles.kpiDelta} ${styles[deltaDirection]}`}>
          {deltaDirection === 'up' && <IconArrowUp size={12} />}
          {deltaDirection === 'down' && <IconArrowDown size={12} />}
          {deltaDirection === 'stable' && <IconMinus size={12} />}
          {delta}
          {deltaLabel && <span style={{ marginLeft: 4, opacity: 0.7 }}>{deltaLabel}</span>}
        </span>
      )}
      {details && (
        <div style={{ marginTop: 'auto', fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: 1.3, paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
          {details}
        </div>
      )}
    </div>
  );
}

export default OzonKpiCard;
