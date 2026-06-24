'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/global-filters.module.css';
import { useGlobalFilters, DateRange } from '../model/useGlobalFilters';

const PRESETS: { value: DateRange['preset']; label: string }[] = [
  { value: 'today', label: 'Сегодня' },
  { value: 'yesterday', label: 'Вчера' },
  { value: '7days', label: 'Последние 7 дней' },
  { value: '28days', label: 'Последние 28 дней' },
  { value: 'quarter', label: 'Текущий квартал' },
  { value: 'year', label: 'Текущий год' },
];

export function DateRangePicker() {
  const { dateRange, setDateRange } = useGlobalFilters();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPresetLabel = PRESETS.find((p) => p.value === dateRange.preset)?.label || 'Выбрать период';

  return (
    <div className={styles.dropdownContainer} ref={containerRef}>
      <button className={styles.dropdownTrigger} onClick={() => setIsOpen(!isOpen)}>
        📅 {currentPresetLabel}
      </button>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {PRESETS.map((preset) => (
            <div
              key={preset.value}
              className={`${styles.dropdownItem} ${dateRange.preset === preset.value ? styles.active : ''}`}
              onClick={() => {
                setDateRange({ preset: preset.value });
                setIsOpen(false);
              }}
            >
              {preset.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
