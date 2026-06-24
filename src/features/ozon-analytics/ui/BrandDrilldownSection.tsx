import React from 'react';
import styles from '@/styles/ozon.module.css';
import { AggregatedProduct, Brand } from '../model/types';
import { formatCurrency, formatNumber, formatPercent } from '../lib/formatters';

interface Props {
  brands: Brand[];
  products: AggregatedProduct[];
}

export function BrandDrilldownSection({ brands, products }: Props) {
  const totalMarketRevenue = products.reduce((acc, p) => acc + p.revenue, 0);

  const brandStats = brands.map(brand => {
    const brandProducts = products.filter(p => p.brandId === brand.id);
    const revenue = brandProducts.reduce((sum, p) => sum + p.revenue, 0);
    const units = brandProducts.reduce((sum, p) => sum + p.ordered, 0);
    const avgPrice = brandProducts.length ? brandProducts.reduce((sum, p) => sum + p.price, 0) / brandProducts.length : 0;
    const share = totalMarketRevenue ? (revenue / totalMarketRevenue) * 100 : 0;
    
    return { ...brand, revenue, units, avgPrice, share, count: brandProducts.length };
  }).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className={styles.sectionCard} style={{ padding: '24px', background: 'var(--surface)' }}>
      <h3 style={{ margin: '0 0 24px 0', fontSize: '16px' }}>Аналитика по брендам</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {brandStats.map(b => (
          <div key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 12, height: 12, borderRadius: '2px', backgroundColor: b.color || '#ccc' }} />
                <span style={{ fontWeight: 'bold' }}>{b.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.competitorType}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>{formatCurrency(b.revenue)}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatNumber(b.units)} шт. · Ср. чек {formatCurrency(b.avgPrice)}</div>
              </div>
            </div>
            {/* Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(b.share, 100)}%`, height: '100%', backgroundColor: b.color || '#005BFF' }} />
              </div>
              <span style={{ fontSize: '12px', width: '48px', textAlign: 'right', fontWeight: 'bold' }}>{formatPercent(b.share)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
