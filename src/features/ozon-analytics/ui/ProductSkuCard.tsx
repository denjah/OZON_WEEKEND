'use client';

import React from 'react';
import styles from '@/styles/product-slide-panel.module.css';
import { ExportedProduct } from '../model/types';

interface Props {
  product: ExportedProduct;
  index: number;
}

export function ProductSkuCard({ product, index }: Props) {
  const animationDelay = `${index * 50}ms`;

  return (
    <div 
      className={styles.skuCard}
      style={{ animationDelay }}
    >
      <div className={styles.skuHeader}>
        <div className={styles.skuTitleWrap}>
          <a href={product.url} target="_blank" rel="noopener noreferrer" className={styles.skuTitle}>
            {product.name}
          </a>
          <span className={styles.skuId}>SKU: {product.id}</span>
        </div>
      </div>

      <div className={styles.skuCommerce}>
        <div className={styles.commerceItem}>
          <span className={styles.commerceLabel}>Цена</span>
          <span className={styles.commerceValueAccent}>{product.price.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div className={styles.commerceItem}>
          <span className={styles.commerceLabel}>Выручка</span>
          <span className={styles.commerceValueAccent}>{product.revenue.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div className={styles.commerceItem}>
          <span className={styles.commerceLabel}>Продажи</span>
          <span className={styles.commerceValue}>{product.sales} шт</span>
        </div>
        <div className={styles.commerceItem}>
          <span className={styles.commerceLabel}>Выкуп</span>
          <span className={styles.commerceValue}>{Math.round(product.buyoutPercent)}%</span>
        </div>
      </div>

      <div className={styles.skuFunnel}>
        <div className={styles.funnelItem}>
          <span className={styles.funnelLabel}>Показы</span>
          <span className={styles.funnelValue}>{product.funnel.impressions.toLocaleString('ru-RU')}</span>
        </div>
        <div className={styles.funnelItem}>
          <span className={styles.funnelLabel}>Клики</span>
          <span className={styles.funnelValue}>{product.funnel.clicks.toLocaleString('ru-RU')}</span>
        </div>
        <div className={styles.funnelItem}>
          <span className={styles.funnelLabel}>CTR</span>
          <span className={styles.funnelValue}>{product.funnel.ctr.toFixed(1)}%</span>
        </div>
        <div className={styles.funnelItem}>
          <span className={styles.funnelLabel}>В корзину</span>
          <span className={styles.funnelValue}>{product.funnel.addToCartPercent.toFixed(1)}%</span>
        </div>
        <div className={styles.funnelItem}>
          <span className={styles.funnelLabel}>ДРР</span>
          <span 
            className={styles.funnelValue}
            style={{
              color: product.funnel.drr > 15 ? '#EF4444' : product.funnel.drr < 5 ? '#10B981' : 'var(--text-primary)'
            }}
          >
            {product.funnel.drr.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
