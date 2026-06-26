'use client';

import React, { useState, useMemo } from 'react';
import styles from '@/styles/ozon.module.css';
import { AggregatedProduct, ProductTag, ALL_PRODUCT_TAGS } from '../model/types';
import { formatCurrency, formatNumber, formatPercent } from '../lib/formatters';

interface Props {
  products: AggregatedProduct[];
  onRowClick: (product: AggregatedProduct) => void;
}

type SortField = 'revenue' | 'ordered' | 'price' | 'contentScore' | 'rating' | 'velocity' | 'tags';

const TAG_EMOJI: Record<ProductTag, string> = {
  'Настольный': '🔲',
  'Напольный': '🏗️',
  'Складной': '📦',
  'Подсветка': '✨',
  'Электронный счётчик': '📊',
};

const TAG_COLORS: Record<ProductTag, { bg: string; color: string; border: string }> = {
  'Настольный':          { bg: 'rgba(99,179,237,0.12)', color: '#63B3ED', border: 'rgba(99,179,237,0.3)' },
  'Напольный':           { bg: 'rgba(99,179,237,0.12)', color: '#63B3ED', border: 'rgba(99,179,237,0.3)' },
  'Складной':            { bg: 'rgba(99,179,237,0.12)', color: '#63B3ED', border: 'rgba(99,179,237,0.3)' },
  'Подсветка':           { bg: 'rgba(246,173,85,0.12)',  color: '#F6AD55', border: 'rgba(246,173,85,0.3)' },
  'Электронный счётчик': { bg: 'rgba(246,173,85,0.12)',  color: '#F6AD55', border: 'rgba(246,173,85,0.3)' },
};

export function ProductCardsTable({ products, onRowClick }: Props) {
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDesc, setSortDesc] = useState(true);
  const [tagFilter, setTagFilter] = useState<ProductTag[]>([]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(field !== 'tags');
    }
  };

  const toggleTagFilter = (tag: ProductTag) => {
    setTagFilter(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const sortedProducts = useMemo(() => {
    let result = [...products];

    if (tagFilter.length > 0) {
      result = result.filter(p =>
        tagFilter.some(tag => p.tags?.includes(tag))
      );
    }

    return result.sort((a, b) => {
      if (sortField === 'tags') {
        const aTag = (a.tags?.[0] ?? 'я');
        const bTag = (b.tags?.[0] ?? 'я');
        return sortDesc ? bTag.localeCompare(aTag, 'ru') : aTag.localeCompare(bTag, 'ru');
      }
      const aVal = (a[sortField] as number) || 0;
      const bVal = (b[sortField] as number) || 0;
      return sortDesc ? bVal - aVal : aVal - bVal;
    });
  }, [products, sortField, sortDesc, tagFilter]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <span style={{ fontSize: '10px', marginLeft: '4px', opacity: 0.3 }}>⇅</span>;
    return <span style={{ fontSize: '10px', marginLeft: '4px' }}>{sortDesc ? '▼' : '▲'}</span>;
  };

  return (
    <div className={styles.sectionCard} style={{ background: 'var(--surface)', overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
        borderBottom: '1px solid var(--border)', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginRight: '4px' }}>
          Тэги:
        </span>
        {ALL_PRODUCT_TAGS.map(tag => {
          const active = tagFilter.includes(tag);
          const c = TAG_COLORS[tag];
          return (
            <button
              key={tag}
              onClick={() => toggleTagFilter(tag)}
              title={`Показать только «${tag}»`}
              style={{
                padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
                background: active ? c.color : c.bg,
                color: active ? '#fff' : c.color,
                border: `1px solid ${c.border}`,
                letterSpacing: '0.02em',
              }}
            >
              {TAG_EMOJI[tag]} {tag}
            </button>
          );
        })}
        {tagFilter.length > 0 && (
          <button
            onClick={() => setTagFilter([])}
            style={{ marginLeft: '4px', padding: '3px 10px', borderRadius: '12px', fontSize: '11px',
              background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            ✕ Сбросить
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>
          {sortedProducts.length} из {products.length}
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className={styles.matrixTable} style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>Товар</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>Бренд</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>Размер</th>
              <th
                style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                onClick={() => handleSort('tags')}
                title="Сортировать по тэгам (A→Z)"
              >
                Тэги {renderSortIcon('tags')}
              </th>
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
                <td style={{ padding: '12px 16px', minWidth: '180px' }}>
                  {p.tags && p.tags.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                      {p.tags.map(tag => {
                        const c = TAG_COLORS[tag];
                        return (
                          <span
                            key={tag}
                            title={tag}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '2px',
                              padding: '2px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
                              background: c.bg, color: c.color, border: `1px solid ${c.border}`,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {TAG_EMOJI[tag]} {tag}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', opacity: 0.5 }}>—</span>
                  )}
                </td>
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
