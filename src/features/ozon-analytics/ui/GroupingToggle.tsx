'use client';

import React from 'react';
import styles from '@/styles/global-filters.module.css';
import { useGlobalFilters } from '../model/useGlobalFilters';

export function GroupingToggle() {
  const { groupingMode, setGroupingMode } = useGlobalFilters();

  return (
    <div className={styles.filterGroup}>
      <span className={styles.filterLabel}>Группировка:</span>
      <button
        className={`${styles.toggleButton} ${groupingMode === 'competitor' ? styles.active : ''}`}
        onClick={() => setGroupingMode('competitor')}
      >
        Конкурент
      </button>
      <button
        className={`${styles.toggleButton} ${groupingMode === 'brand' ? styles.active : ''}`}
        onClick={() => setGroupingMode('brand')}
      >
        Бренд
      </button>
    </div>
  );
}
