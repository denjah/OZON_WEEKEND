'use client';

import React from 'react';
import styles from '@/styles/ozon.module.css';
import { useGlobalFilters } from '../model/useGlobalFilters';
import { MetricMode } from '../model/types';

const METRIC_OPTIONS: { value: MetricMode; label: string }[] = [
  { value: 'revenue', label: 'Выручка / Штуки' },
  { value: 'buyoutPercent', label: 'Выкуп %' },
  { value: 'funnel', label: 'Воронка Ozon' },
];

export function MetricModeSwitch() {
  const { metricMode, setMetricMode } = useGlobalFilters();

  return (
    <div className={styles.metricSwitcher}>
      {METRIC_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`${styles.metricOption} ${metricMode === option.value ? styles.active : ''}`}
          onClick={() => setMetricMode(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default MetricModeSwitch;
