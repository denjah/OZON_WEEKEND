import React, { useState } from 'react';
import styles from '@/styles/ozon.module.css';
import { AggregatedProduct, Brand } from '../model/types';
import { formatCurrency, formatNumber } from '../lib/formatters';
import { Brand3DPointCloud } from './Brand3DPointCloud';
import { BrandTreemap } from './BrandTreemap';
import { Brand3DBarChart } from './Brand3DBarChart';
import { BrandHorizontalBarChart } from './BrandHorizontalBarChart';

interface Props {
  brands: Brand[];
  products: AggregatedProduct[];
}

export function OzonOverviewSection({ brands, products }: Props) {
  const [chartType, setChartType] = useState<'3d-cloud' | 'treemap' | '3d-bars' | 'bars'>('3d-cloud');

  // Вычисляем топ брендов по выручке
  const brandStats = brands.map(brand => {
    const brandProducts = products.filter(p => p.brandId === brand.id);
    const rev = brandProducts.reduce((sum, p) => sum + p.revenue, 0);
    return { ...brand, revenue: rev, count: brandProducts.length };
  }).sort((a, b) => b.revenue - a.revenue);

  const topProducts = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
      <div className={styles.sectionCard} style={{ padding: '24px', background: 'var(--surface)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: '0', fontSize: '16px' }}>Топ Брендов по Выручке</h3>
          
          {/* Chart View Switcher */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-alt)', padding: '4px', borderRadius: '8px' }}>
            {[
              { id: '3d-cloud', label: '3D Cloud' },
              { id: 'treemap', label: 'Treemap' },
              { id: '3d-bars', label: '3D Bars' },
              { id: 'bars', label: 'Bars' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id as '3d-cloud' | 'treemap' | '3d-bars' | 'bars')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: chartType === type.id ? 'var(--accent-primary)' : 'transparent',
                  color: chartType === type.id ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {chartType === '3d-cloud' && <Brand3DPointCloud data={brandStats} />}
          {chartType === 'treemap' && <BrandTreemap data={brandStats} />}
          {chartType === '3d-bars' && <Brand3DBarChart data={brandStats} />}
          {chartType === 'bars' && <BrandHorizontalBarChart data={brandStats} />}
        </div>
      </div>

      <div className={styles.sectionCard} style={{ padding: '24px', background: 'var(--surface)' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Топ 5 Товаров</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {topProducts.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                {p.mainImage && (
                  <a href={p.mainImage} target="_blank" rel="noreferrer" style={{ flexShrink: 0, display: 'block' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={p.mainImage} 
                      alt="" 
                      style={{ 
                        width: 48, 
                        height: 64, 
                        borderRadius: '4px', 
                        objectFit: 'contain', 
                        backgroundColor: 'var(--bg-primary)',
                        cursor: 'pointer' 
                      }} 
                     onError={(e) => { e.currentTarget.src = "https://placehold.co/300x400/1E293B/FFFFFF?text=No+Photo" }} />
                  </a>
                )}
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{p.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span>{p.brandName}</span>
                    <span>·</span>
                    <span>{p.sizeFt}ft</span>
                    <span>·</span>
                    <a 
                      href={p.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: '#005BFF', textDecoration: 'none' }}
                      onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                      На Ozon ↗
                    </a>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600 }}>{formatCurrency(p.revenue)}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Оборот</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
