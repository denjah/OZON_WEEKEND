'use client';

import React from 'react';
import styles from '@/styles/ozon.module.css';
import { IconSearch, IconFilter, IconRefresh } from '@/components/icons';
import { useOzonFilters } from '../hooks/useOzonFilters';
import { Brand, WorkScheme, ProductTag, ProductClass, ProductCategory } from '../model/types';

const ALL_CLASSES: ProductClass[] = ['Теннисный стол', 'Бильярд', 'Настольный футбол', 'Настольный хоккей', 'Стол-трансформер', 'Аксессуары'];
// Categories depend on classes, but for the filter we can list common ones or unique ones.
const ALL_CATEGORIES: ProductCategory[] = ['Outdoor', 'Indoor', '2 фута', '3 фута', '4 фута', '5 футов', '6 футов', '7 футов', '8 футов', '2 в 1', '3 в 1', '4 в 1', '6 в 1', '10+ в 1'];


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
    selectedClasses,
    selectedCategories,
    selectedTags,
    hasVideoOnly,
    searchQuery,
    toggleBrand,
    toggleSize,
    toggleScheme,
    toggleClass,
    toggleCategory,
    toggleTag,
    setHasVideoOnly,
    setSearchQuery,
    resetFilters,
  } = useOzonFilters();

  const hasActiveFilters =
    selectedBrandIds.length > 0 ||
    selectedSizes.length > 0 ||
    selectedSchemes.length > 0 ||
    selectedClasses.length > 0 ||
    selectedCategories.length > 0 ||
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

      {/* Classes */}
      <div className={styles.filterGroup}>
        {ALL_CLASSES.map((cls) => (
          <button
            key={cls}
            className={`${styles.filterChip} ${selectedClasses.includes(cls) ? styles.active : ''}`}
            onClick={() => toggleClass(cls)}
            id={`filter-class-${cls.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {cls}
          </button>
        ))}
      </div>

      <div className={styles.filterDivider} />

      {/* Categories */}
      <div className={styles.filterGroup}>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterChip} ${selectedCategories.includes(cat) ? styles.active : ''}`}
            onClick={() => toggleCategory(cat)}
            id={`filter-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {cat}
          </button>
        ))}
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
