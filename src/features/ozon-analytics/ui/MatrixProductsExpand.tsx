'use client';

import React from 'react';
import styles from '@/styles/matrix-expand.module.css';
import { MatrixCellData } from '../model/useExportedMatrix';
import { ProductSkuCard } from './ProductSkuCard';

interface Props {
  cell: MatrixCellData;
  title: string;
  onClose: () => void;
  colSpan: number;
}

export function MatrixProductsExpand({ cell, title, onClose, colSpan }: Props) {
  return (
    <tr className={styles.expandRow}>
      <td colSpan={colSpan} className={styles.expandCell}>
        <div className={styles.expandContainer}>
          <div className={styles.expandHeader}>
            <div className={styles.expandTitleInfo}>
              <h3 className={styles.expandTitle}>{title}</h3>
              <span className={styles.expandCount}>{cell.products.length} SKU</span>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
          
          <div className={styles.skuGrid}>
            {cell.products.map((p, i) => (
              <ProductSkuCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
}
