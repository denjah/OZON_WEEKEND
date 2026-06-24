'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from '@/styles/global-filters.module.css';
import { useGlobalFilters } from '../model/useGlobalFilters';
import { useOzonAnalytics } from '../hooks/useOzonAnalytics';

export function SellerFilter() {
  const { selectedSellers, toggleSeller } = useGlobalFilters();
  const { brands } = useOzonAnalytics();
  
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract unique sellers from data
  // Assuming products have 'seller' field since we added it to ExportedProduct,
  // but AggregatedProduct currently doesn't have it explicitly.
  // Wait, let's use a mock list for now until data model fully syncs in Stage 4.
  // We can just use the unique brands for now, or just mock the sellers.
  // Let's extract from brands if seller isn't available, but we'll adapt to 'brands' for now if needed.
  // Actually, we'll just extract from data.brands.
  const sellersList = useMemo(() => {
    if (!brands) return [];
    // For now we map brands to sellers as a fallback until seller field is fully propagated
    return brands.map(b => b.name).sort();
  }, [brands]);

  const filteredSellers = sellersList.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  const displayLabel = selectedSellers.length === 0 
    ? 'Все продавцы' 
    : `Продавцы: ${selectedSellers.length}`;

  return (
    <div className={styles.dropdownContainer} ref={containerRef}>
      <button className={styles.dropdownTrigger} onClick={() => setIsOpen(!isOpen)}>
        🏪 {displayLabel}
      </button>
      
      {isOpen && (
        <div className={styles.dropdownMenu} style={{ minWidth: '240px' }}>
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder="Поиск продавца..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {filteredSellers.map((seller) => {
              const isChecked = selectedSellers.includes(seller);
              return (
                <div
                  key={seller}
                  className={`${styles.dropdownItem} ${isChecked ? styles.active : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSeller(seller);
                  }}
                >
                  <div className={`${styles.checkbox} ${isChecked ? styles.checked : ''}`} />
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {seller}
                  </span>
                </div>
              );
            })}
            
            {filteredSellers.length === 0 && (
              <div style={{ padding: '8px 12px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                Ничего не найдено
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
