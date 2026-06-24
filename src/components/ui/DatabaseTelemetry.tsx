'use client';

import React from 'react';
import { IconDatabase, IconShoppingBag } from '@/components/icons';

export default function DatabaseTelemetry() {
  return (
    <div style={{
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: 'var(--spacing-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'all var(--transition-default)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>
        <IconDatabase size={16} color="var(--accent-primary)" />
        БД Конкурентов
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>ОБНОВЛЕНО</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>20.06.26</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>ВРЕМЯ СБОРА</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>1ч 14м</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>ЗАПИСЕЙ</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>142 850</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>АГЕНТОВ</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>12 AI</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, marginTop: '8px' }}>
        <IconShoppingBag size={14} color="#005BFF" />
        OZON Парсинг
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>БРЕНДОВ</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>6</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>КАРТОЧЕК</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>41</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>ОТЗЫВОВ</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>418</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>HI-RES МЕДИА</span>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>205</span>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginTop: '4px', 
        paddingTop: '12px', 
        borderTop: '1px solid var(--border-subtle)' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>STORAGE (ХРАНИЛИЩЕ)</span>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', opacity: 0.7 }}>App + DB + Media</span>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--status-success)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>1.0 GB</span>
      </div>
    </div>
  );
}
