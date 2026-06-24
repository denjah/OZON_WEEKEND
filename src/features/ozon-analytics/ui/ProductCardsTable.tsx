'use client';

import React, { useState, useMemo } from 'react';
import styles from '@/styles/ozon.module.css';
import { AggregatedProduct } from '../model/types';
import { formatCurrency, formatNumber, formatPercent } from '../lib/formatters';

interface Props {
  products: AggregatedProduct[];
  onRowClick: (product: AggregatedProduct) => void;
}

type SortField = 'revenue' | 'ordered' | 'price' | 'contentScore' | 'rating' | 'velocity';

export function ProductCardsTable({ products, onRowClick }: Props) {
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDesc, setSortDesc] = useState(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aVal = a[sortField] || 0;
      const bVal = b[sortField] || 0;
      return sortDesc ? bVal - aVal : aVal - bVal;
    });
  }, [products, sortField, sortDesc]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return <span style={{ fontSize: '10px', marginLeft: '4px' }}>{sortDesc ? '▼' : '▲'}</span>;
  };

  return (
    <div className={styles.sectionCard} style={{ background: 'var(--surface)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className={styles.matrixTable} style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>Товар</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>Бренд</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>Размер</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => handleSort('price')}>
                Цена {renderSortIcon('price')}
              </th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => handleSort('ordered')}>
                Заказано {renderSortIcon('ordered')}
              </th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>Выкуп</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => handleSort('revenue')}>
                Оборот {renderSortIcon('revenue')}
              </th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => handleSort('velocity')}>
                Velocity {renderSortIcon('velocity')}
              </th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>Схема</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'center' }} onClick={() => handleSort('contentScore')}>
                Контент {renderSortIcon('contentScore')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map(p => (
              <tr 
                key={p.id} 
                onClick={() => onRowClick(p)}
                style={{ cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '12px 16px', maxWidth: '300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {p.mainImage && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.mainImage} alt="" style={{ width: 45, height: 60, minWidth: 45, borderRadius: '4px', objectFit: 'cover' }}  onError={(e) => { e.currentTarget.src = "https://placehold.co/300x400/1E293B/FFFFFF?text=No+Photo" }} />
                    )}
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <div style={{ fontWeight: 500, fontSize: '13px' }}>{p.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SKU: {p.sku}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.brandName}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center' }}>{p.sizeFt}ft</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{formatCurrency(p.price)}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{formatNumber(p.ordered)}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{formatPercent(p.buyoutPercent)}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{formatCurrency(p.revenue)}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>{p.velocity.toFixed(1)}/дн</td>
                <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                  <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', fontSize: '11px' }}>
                    {p.workScheme}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: p.contentScore >= 80 ? '#10B981' : p.contentScore >= 50 ? '#F59E0B' : '#EF4444' }}>
                    {p.contentScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
