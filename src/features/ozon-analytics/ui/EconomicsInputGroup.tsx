'use client';

import React from 'react';
import styles from '@/styles/unit-economics.module.css';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export function EconomicsInputGroup({ label, value, min, max, step = 1, unit = '', onChange }: Props) {
  return (
    <div className={styles.inputGroup}>
      <div className={styles.inputHeader}>
        <span className={styles.inputLabel}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input 
            type="number"
            className={styles.inputValue}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          {unit && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{unit}</span>}
        </div>
      </div>
      <input 
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
