'use client';

import React, { useEffect } from 'react';
import styles from '@/styles/product-slide-panel.module.css';
import { useProductSlidePanel } from '../model/useProductSlidePanel';
import { ProductSkuCard } from './ProductSkuCard';
import { useExportXlsx } from '../hooks/useExportXlsx';

export function ProductSlidePanel() {
  const { isOpen, products, cellContext, closePanel } = useProductSlidePanel();
  const { exportToExcel } = useExportXlsx();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closePanel]);

  if (!isOpen) return null;

  const handleExport = () => {
    // Export raw products to excel
    exportToExcel(products, `Export_${cellContext?.title || 'Products'}`, 'SKUs');
  };

  return (
    <div className={styles.overlay} onClick={closePanel}>
      <div 
        className={styles.panel} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{cellContext?.title}</h2>
            <p className={styles.subtitle}>{products.length} SKU(s)</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className={styles.exportButton} onClick={handleExport}>
              ⬇ Экспорт (.xlsx)
            </button>
            <button className={styles.closeButton} onClick={closePanel}>✕</button>
          </div>
        </div>

        <div className={styles.content}>
          {products.map((p, i) => (
            <ProductSkuCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
