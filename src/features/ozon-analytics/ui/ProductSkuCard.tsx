'use client';

import React from 'react';
import styles from '@/styles/matrix-expand.module.css';
import { ExportedProduct } from '../model/types';

interface Props {
  product: ExportedProduct;
  index: number;
}

export function ProductSkuCard({ product, index }: Props) {
  const animationDelay = `${index * 50}ms`;

  const drr = product.funnel.drr;
  let drrClass = styles.drrGood;
  if (drr > 15) drrClass = styles.drrBad;
  else if (drr >= 5) drrClass = styles.drrWarning;

  const share = product.shareInColumn || 0;

  return (
    <div 
      className={styles.skuInlineCard}
      style={{ animationDelay }}
    >
      <div className={styles.skuHeader}>
        <div className={styles.skuTitleWrap}>
          <a href={product.url} target="_blank" rel="noopener noreferrer" className={styles.skuTitle}>
            {product.name}
          </a>
          <div className={styles.skuMeta}>
            <span className={styles.skuId}>ID: {product.id}</span>
            {product.exactSize && <span className={styles.skuSize}>· {product.exactSize}</span>}
          </div>
        </div>
      </div>

      <div className={styles.commerceGrid}>
        <div className={styles.commerceStat}>
          <span className={styles.commerceLabel}>Выручка</span>
          <span className={styles.commerceValAccent}>{product.revenue.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div className={styles.commerceStat}>
          <span className={styles.commerceLabel}>Цена</span>
          <span className={styles.commerceVal}>{product.price.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div className={styles.commerceStat}>
          <span className={styles.commerceLabel}>Кол-во</span>
          <span className={styles.commerceVal}>{product.sales} шт</span>
        </div>
        <div className={styles.commerceStat}>
          <span className={styles.commerceLabel}>Доля</span>
          <div className={styles.shareBarContainer}>
            <span className={styles.commerceVal}>{share.toFixed(1)}%</span>
            <div className={styles.shareBar}>
              <div 
                className={styles.shareBarFill} 
                style={{ width: `${Math.min(share, 100)}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.funnelStrip}>
        <div className={styles.funnelItem}>
          <span className={styles.funnelLabel}>👁 Показы</span>
          <span className={styles.funnelVal}>{product.funnel.impressions.toLocaleString('ru-RU')}</span>
        </div>
        <div className={styles.funnelItem}>
          <span className={styles.funnelLabel}>👆 Клики</span>
          <span className={styles.funnelVal}>{product.funnel.clicks.toLocaleString('ru-RU')}</span>
        </div>
        <div className={styles.funnelItem}>
          <span className={styles.funnelLabel}>CTR</span>
          <span className={styles.funnelVal}>{product.funnel.ctr.toFixed(1)}%</span>
        </div>
        <div className={styles.funnelItem}>
          <span className={styles.funnelLabel}>🛒 Корзина</span>
          <span className={styles.funnelVal}>{product.funnel.addToCartPercent.toFixed(1)}%</span>
        </div>
        <div className={styles.funnelItem}>
          <span className={styles.funnelLabel}>📈 ДРР</span>
          <span className={`${styles.funnelVal} ${drrClass}`}>{drr.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
