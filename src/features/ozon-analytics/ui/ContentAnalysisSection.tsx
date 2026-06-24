import React from 'react';
import styles from '@/styles/ozon.module.css';
import { AggregatedProduct } from '../model/types';

interface Props {
  products: AggregatedProduct[];
}

export function ContentAnalysisSection({ products }: Props) {
  const avgScore = products.length 
    ? Math.round(products.reduce((acc, p) => acc + (p.contentScore || 0), 0) / products.length)
    : 0;

  const sortedProducts = [...products].sort((a, b) => (b.contentScore || 0) - (a.contentScore || 0));

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // green
    if (score >= 50) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className={styles.sectionCard} style={{ padding: '24px', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Средний Контент-Скор</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: getScoreColor(avgScore) }}>{avgScore}/100</div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            Контент-скор отражает качество заполнения карточек (наличие видео, рич-контента, характеристик и фото). 
            Оптимизация контента может увеличить конверсию на 15-20%.
          </p>
        </div>
      </div>

      <div className={styles.sectionCard} style={{ padding: '24px', background: 'var(--surface)' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Аудит карточек</h3>
        <table className={styles.matrixTable} style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 8px' }}>Товар</th>
              <th style={{ padding: '12px 8px' }}>Бренд</th>
              <th style={{ padding: '12px 8px', textAlign: 'center' }}>Видео</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Скор</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 8px' }}>{p.title} ({p.sizeFt}ft)</td>
                <td style={{ padding: '12px 8px' }}>{p.brandName}</td>
                <td style={{ padding: '12px 8px', textAlign: 'center' }}>{p.hasVideo ? '✅' : '❌'}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '4px', backgroundColor: getScoreColor(p.contentScore || 0) + '20', color: getScoreColor(p.contentScore || 0), fontWeight: 'bold' }}>
                    {p.contentScore || 0}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
