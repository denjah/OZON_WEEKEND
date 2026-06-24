'use client';

import React from 'react';
import styles from '@/styles/ozon.module.css';
import { AggregatedProduct } from '../model/types';
import { formatCurrency, formatNumber, formatPercent } from '../lib/formatters';

interface Props {
  product: AggregatedProduct | null;
  onClose: () => void;
}

export function ProductCardDrawer({ product, onClose }: Props) {
  if (!product) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          backdropFilter: 'blur(2px)'
        }}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '500px',
          maxWidth: '100%',
          backgroundColor: 'var(--surface)',
          zIndex: 1001,
          boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          transform: 'translateX(0)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Детали карточки</h2>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '24px', color: 'var(--text-muted)' }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            {product.mainImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={product.mainImage} alt={product.title} style={{ width: '120px', height: '120px', borderRadius: '8px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '120px', height: '120px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }} />
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', lineHeight: 1.4 }}>{product.title}</h3>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Бренд: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.brandName}</span></div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>SKU: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.sku}</span></div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Размер: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.sizeFt} ft</span></div>
              <a href={product.url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#005BFF', textDecoration: 'none' }}>Открыть на Ozon ↗</a>
            </div>
          </div>

          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Продажи (30 дней)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Оборот</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatCurrency(product.revenue)}</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Заказано</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatNumber(product.ordered)} шт.</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Выкуп</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatPercent(product.buyoutPercent)}</div>
            </div>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Velocity</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{product.velocity.toFixed(1)} шт/дн</div>
            </div>
          </div>

          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Контент и Социальные доказательства</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Контент-скор:</span>
              <span style={{ fontWeight: 600, color: product.contentScore >= 80 ? '#10B981' : '#F59E0B' }}>{product.contentScore}/100</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Видео:</span>
              <span style={{ fontWeight: 600 }}>{product.hasVideo ? 'Есть' : 'Нет'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Рейтинг:</span>
              <span style={{ fontWeight: 600 }}>⭐ {product.rating}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Отзывов:</span>
              <span style={{ fontWeight: 600 }}>{product.reviews} (+{product.reviewsDelta})</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
          <button className={styles.actionBtn} style={{ flex: 1, justifyContent: 'center' }}>
            Сравнить
          </button>
          <button className={styles.actionBtn} style={{ flex: 1, justifyContent: 'center', background: '#005BFF', color: '#FFF', borderColor: '#005BFF' }}>
            В наблюдение
          </button>
        </div>
      </div>
    </>
  );
}
