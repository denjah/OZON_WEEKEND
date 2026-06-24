'use client';

import React from 'react';
import styles from '@/styles/global-filters.module.css';
import { useGlobalFilters } from '../model/useGlobalFilters';

export function ShareModeToggle() {
  const { shareMode, setShareMode } = useGlobalFilters();

  return (
    <div className={styles.filterGroup}>
      <span className={styles.filterLabel}>Доля %:</span>
      <button
        className={`${styles.toggleButton} ${shareMode === 'column' ? styles.active : ''}`}
        onClick={() => setShareMode('column')}
        title="Доля конкурента внутри конкретного размера (фута)"
      >
        Внутри фута
      </button>
      <button
        className={`${styles.toggleButton} ${shareMode === 'total' ? styles.active : ''}`}
        onClick={() => setShareMode('total')}
        title="Доля конкурента от общего рынка всех размеров"
      >
        От всего рынка
      </button>
    </div>
  );
}
