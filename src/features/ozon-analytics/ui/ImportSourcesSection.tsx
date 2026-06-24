import React from 'react';
import styles from '@/styles/ozon.module.css';

export function ImportSourcesSection() {
  return (
    <div className={styles.sectionCard} style={{ padding: '24px', background: 'var(--surface)' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Управление источниками данных Ozon</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
        <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>Apify Ozon Scraper</span>
            <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#10B98120', color: '#10B981', borderRadius: '4px' }}>Активен</span>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            Ежедневный парсинг топ-100 товаров по запросу &quot;бильярдный стол&quot;. Последний запуск: сегодня в 03:00.
          </p>
        </div>

        <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>Ozon Seller API (Ключ конкурента)</span>
            <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#F59E0B20', color: '#F59E0B', borderRadius: '4px' }}>Требует настройки</span>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            Доступ к API метрикам для точного расчета выручки. Введите API-ключ в настройках проекта.
          </p>
        </div>

        <button style={{ 
          marginTop: '8px',
          padding: '12px', 
          backgroundColor: 'var(--bg-primary)', 
          border: '1px dashed var(--border)', 
          borderRadius: '8px',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          + Добавить новый источник (CSV / Excel)
        </button>
      </div>
    </div>
  );
}


