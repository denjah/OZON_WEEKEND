'use client';

import React from 'react';
import styles from '@/styles/unit-economics.module.css';

interface WhatIfSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  unit?: string;
}

export function WhatIfSlider({ label, value, min, max, step, onChange, unit = '' }: WhatIfSliderProps) {
  return (
    <div className={styles.whatIfContainer}>
      <div className={styles.whatIfHeader}>
        <span className={styles.whatIfLabel}>{label}</span>
        <span className={styles.whatIfValue}>{value} {unit}</span>
      </div>
      <input 
        type="range"
        className={styles.whatIfRange}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className={styles.whatIfMinMax}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
