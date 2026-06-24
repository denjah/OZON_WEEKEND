'use client';

import React from 'react';
import styles from '@/styles/global-filters.module.css';
import { DateRangePicker } from './DateRangePicker';
import { SellerFilter } from './SellerFilter';
import { GroupingToggle } from './GroupingToggle';
import { ShareModeToggle } from './ShareModeToggle';
import { MetricModeSwitch } from './MetricModeSwitch';

export function GlobalFiltersBar() {
  return (
    <div className={styles.bar}>
      <DateRangePicker />
      <SellerFilter />
      
      <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
      
      <GroupingToggle />
      <ShareModeToggle />
      
      <div style={{ flex: 1 }} />
      
      <MetricModeSwitch />
    </div>
  );
}

export default GlobalFiltersBar;
