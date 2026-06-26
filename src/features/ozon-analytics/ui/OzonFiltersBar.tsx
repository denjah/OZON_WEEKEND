'use client';

import React from 'react';
import styles from '@/styles/ozon.module.css';
import { IconSearch, IconFilter, IconRefresh } from '@/components/icons';
import { useOzonFilters } from '../hooks/useOzonFilters';
import { Brand, WorkScheme, ALL_PRODUCT_TAGS, ProductTag } from '../model/types';

interface OzonFiltersBarProps {
  brands: Brand[];
  availableSizes: number[];
}

const WORK_SCHEMES: { value: WorkScheme; label: string }[] = [
  { value: 'FBS', label: 'FBS' },
  { value: 'FBO', label: 'FBO' },
  { value: 'Crossborder', label: 'Crossborder' },
];

export function OzonFiltersBar({ brands, availableSizes }: OzonFiltersBarProps) {
  const {
    selectedBrandIds,
    selectedSizes,
    selectedSchemes,
    selectedTags,
    hasVideoOnly,
    searchQuery,
    toggleBrand,
    toggleSize,
    toggleScheme,
    toggleTag,
    setHasVideoOnly,
    setSearchQuery,
    resetFilters,
  } = useOzonFilters();

  const hasActiveFilters =
    selectedBrandIds.length > 0 ||
    selectedSizes.length > 0 ||
    selectedSchemes.length > 0 ||
    selectedTags.length > 0 ||
    hasVideoOnly ||
    searchQuery.trim().length > 0;

  return (
    <div className={styles.filtersBar} id="ozon-filters">
      <span className={styles.filtersLabel}>
        <IconFilter size={12} /> Фильтры
      </span>

      <div className={styles.filterDivider} />

      {/* Size chips */}
      <div className={styles.filterGroup}>
        {availableSizes.map((size) => (
          <button
            key={size}
            className={`${styles.filterChip} ${selectedSizes.includes(size) ? styles.active : ''}`}
            onClick={() => toggleSize(size)}
            id={`filter-size-${size}`}
          >
            {size}ft
          </button>
        ))}
      </div>

      <div className={styles.filterDivider} />

      {/* Tag chips — тэги категории */}
      <div className={styles.filterGroup}>
        {ALL_PRODUCT_TAGS.map((tag: ProductTag) => {
          const isActive = selectedTags.includes(tag);
          const isStructural = tag === 'Настольный' || tag === 'Напольный' || tag === 'Складной';
          return (
            <button
              key={tag}
              className={`${styles.filterChip} ${isActive ? styles.active : ''}`}
              onClick={() => toggleTag(tag)}
              id={`filter-tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
              title={`Фильтр: ${tag}`}
              style={isActive ? {} : {
                borderColor: isStructural ? 'rgba(99, 179, 237, 0.4)' : 'rgba(246, 173, 85, 0.4)',
                color: isStructural ? '#63B3ED' : '#F6AD55',
              }}
            >
              {tag === 'Настольный' && '🔲 '}
              {tag === 'Напольный' && '🏗️ '}
              {tag === 'Складной' && '📦 '}
              {tag === 'Подсветка' && '✨ '}
              {tag === 'Электронный счётчик' && '📊 '}
              {tag}
            </button>
          );
        })}
      </div>

      <div className={styles.filterDivider} />

      {/* Work scheme chips */}
      <div className={styles.filterGroup}>
        {WORK_SCHEMES.map((scheme) => (
          <button
            key={scheme.value}
            className={`${styles.filterChip} ${selectedSchemes.includes(scheme.value) ? styles.active : ''}`}
            onClick={() => toggleScheme(scheme.value)}
            id={`filter-scheme-${scheme.value}`}
          >
            {scheme.label}
          </button>
        ))}
      </div>

      <div className={styles.filterDivider} />

      {/* Video filter */}
      <button
        className={`${styles.filterChip} ${hasVideoOnly ? styles.active : ''}`}
        onClick={() => setHasVideoOnly(!hasVideoOnly)}
        id="filter-video"
      >
        📹 Видео
      </button>

      {/* Brand dropdown chips (показываем первые 5) */}
      {brands.length > 0 && (
        <>
          <div className={styles.filterDivider} />
          <div className={styles.filterGroup}>
            {brands.slice(0, 5).map((brand) => (
              <button
                key={brand.id}
                className={`${styles.filterChip} ${selectedBrandIds.includes(brand.id) ? styles.active : ''}`}
                onClick={() => toggleBrand(brand.id)}
                id={`filter-brand-${brand.id}`}
                style={{
                  borderLeft: `3px solid ${brand.color || 'var(--accent-primary)'}`,
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                {brand.name}
              </button>
            ))}
            {brands.length > 5 && (
              <span className={styles.filterChip} style={{ cursor: 'default', opacity: 0.6 }}>
                +{brands.length - 5}
              </span>
            )}
          </div>
        </>
      )}

      {/* Search */}
      <div className={styles.filterSearch}>
        <IconSearch size={12} className={styles.filterSearchIcon} />
        <input
          type="text"
          className={styles.filterSearchInput}
          placeholder="Поиск товаров, SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="ozon-search-input"
        />
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          className={styles.filterResetBtn}
          onClick={resetFilters}
          id="ozon-filter-reset"
        >
          <IconRefresh size={12} /> Сбросить
        </button>
      )}
    </div>
  );
}

export default OzonFiltersBar;
