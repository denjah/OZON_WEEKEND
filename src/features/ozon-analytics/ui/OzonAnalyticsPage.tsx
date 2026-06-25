'use client';

import React, { useState } from 'react';
import styles from '@/styles/layout.module.css';
import ozon from '@/styles/ozon.module.css';
import StyleSwitcher from '@/components/ui/StyleSwitcher';
import DatabaseTelemetry from '@/components/ui/DatabaseTelemetry';
import {
  IconChartBar,
  IconNetwork,
  IconTelescope,
  IconSparkles,
  IconShoppingBag,
  IconPlus,
  IconFilter,
  IconRefresh,
  IconGrid,
  IconPackage,
  IconTarget,
  IconTrendingUp,
  IconClock,
} from '@/components/icons';
import { useOzonAnalytics } from '../hooks/useOzonAnalytics';
import { OzonKpiGrid } from './OzonKpiGrid';
import { OzonOverviewSection } from './OzonOverviewSection';
import { GlobalFiltersBar } from './GlobalFiltersBar';
import { SalesMatrix } from './SalesMatrix';
import { ContentAnalysisSection } from './ContentAnalysisSection';
import { BrandDrilldownSection } from './BrandDrilldownSection';
import { InsightsSection } from './InsightsSection';
import { ImportSourcesSection } from './ImportSourcesSection';
import { ProductCardsTable } from './ProductCardsTable';
import { ProductCardDrawer } from './ProductCardDrawer';
import { UnitEconomicsSection } from './UnitEconomicsSection';
import { ReviewsAnalysisSection } from './ReviewsAnalysisSection';
import { AggregatedProduct } from '../model/types';
import { ProductSlidePanel } from './ProductSlidePanel';

/* ============================================================
   QUICK ACTIONS MOCK
   ============================================================ */
// Placeholders for quick actions if needed


/* ============================================================
   TAB DEFINITIONS
   ============================================================ */

type OzonTab = 'dashboard' | 'cards' | 'economics' | 'reviews' | 'content' | 'brands' | 'insights' | 'import';

const tabs: { id: OzonTab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'DASHBOARD', icon: <IconChartBar size={14} /> },
  { id: 'cards', label: 'Карточки', icon: <IconPackage size={14} /> },
  { id: 'economics', label: 'Юнит-Экономика', icon: <IconTarget size={14} /> },
  { id: 'reviews', label: 'Отзывы', icon: <IconSparkles size={14} /> },
  { id: 'content', label: 'Контент-анализ', icon: <IconTarget size={14} /> },
  { id: 'brands', label: 'Бренды', icon: <IconTrendingUp size={14} /> },
  { id: 'insights', label: 'Инсайты', icon: <IconSparkles size={14} /> },
  { id: 'import', label: 'Источники', icon: <IconRefresh size={14} /> },
];

/* ============================================================
   PAGE COMPONENT
   ============================================================ */

export default function OzonAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<OzonTab>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<AggregatedProduct | null>(null);
  const data = useOzonAnalytics();

  return (
    <div className={styles.layout}>
      {/* ---- SIDEBAR ---- */}
      <aside className={styles.sidebar} id="sidebar">
        <div className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_icon.svg" alt="Weekend Ozon Manager" className={styles.logoIcon} />
          <span className={styles.logoText}>Ozon Manager</span>
        </div>
        <div className={styles.logoSubtitle}>Weekend Intelligence</div>

        <DatabaseTelemetry />

        <div className={styles.sectionLabel}>Навигация Ozon</div>
        <nav className={styles.navList} id="nav-main">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`nav-${tab.id}`}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <span className={styles.navIcon}>{tab.icon}</span>
              {tab.label}
              {tab.id === 'cards' && (
                <span className={ozon.tabBtnBadge} style={{ marginLeft: 'auto' }}>{data.products.length}</span>
              )}
              {tab.id === 'insights' && (
                <span className={ozon.tabBtnBadge} style={{ marginLeft: 'auto' }}>{data.insights.length}</span>
              )}
              {tab.id === 'brands' && (
                <span className={ozon.tabBtnBadge} style={{ marginLeft: 'auto' }}>{data.brands.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={styles.sectionLabel}>Быстрые действия</div>
        <div className={styles.groupList} id="quick-actions">
          <button className={styles.addGroupBtn}>
            <IconRefresh size={14} /> Обновить данные Ozon
          </button>
          <button className={styles.addGroupBtn}>
            <IconFilter size={14} /> Сбросить фильтры
          </button>
        </div>

        <div className={styles.userCard} id="user-card" style={{ marginTop: 'auto' }}>
          <div className={styles.userAvatar}>DP</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>Denis Polotsk</div>
            <div className={styles.userEmail}>denis@weekend.ru</div>
          </div>
        </div>
      </aside>

      {/* ---- MAIN CONTENT ---- */}
      <main className={styles.mainContent}>
        <div className={ozon.page}>

          <StyleSwitcher />

          {/* Header */}
          <div className={ozon.header}>
            <div className={ozon.headerLeft}>
              <h1 className={ozon.pageTitle}>
                <IconShoppingBag size={28} className={ozon.pageTitleIcon} />
                Ozon Market Intelligence
                <span className={ozon.ozonBadge}>BETA</span>
                <div className={ozon.liveStatus} id="ozon-live-status" style={{ marginLeft: '8px' }}>
                  <span className={ozon.liveDot} />
                  MOCK
                </div>
              </h1>
              <p className={ozon.pageSubtitle}>
                Анализ конкурентов на маркетплейсе · Бильярдные столы
                {data.snapshot && (
                  <> · Снимок {new Date(data.snapshot.capturedAt).toLocaleDateString('ru-RU')}</>
                )}
              </p>
            </div>
          </div>

          {/* Snapshot Info */}
          {data.snapshot && (
            <div className={ozon.snapshotInfo}>
              <IconClock size={14} />
              <span className={ozon.snapshotInfoLabel}>Снимок:</span>
              {new Date(data.snapshot.periodStart).toLocaleDateString('ru-RU')} –{' '}
              {new Date(data.snapshot.periodEnd).toLocaleDateString('ru-RU')}
              <span style={{ marginLeft: 'auto', opacity: 0.6 }}>
                Источник: {data.snapshot.source}
              </span>
              <button className={ozon.actionBtn} id="ozon-btn-refresh" style={{ marginLeft: '12px' }}>
                <IconRefresh size={14} /> Обновить
              </button>
            </div>
          )}

          {/* Loading */}
          {data.isLoading && (
            <div className={ozon.loadingContainer}>
              <div className={ozon.loadingSpinner} />
              <div className={ozon.loadingText}>Загрузка данных Ozon...</div>
            </div>
          )}

          {/* Error */}
          {data.error && (
            <div className={ozon.errorContainer}>
              <div className={ozon.errorText}>⚠️ {data.error}</div>
              <button className={ozon.errorRetry} onClick={() => window.location.reload()}>
                Повторить
              </button>
            </div>
          )}

          {/* Main content (when loaded) */}
          {!data.isLoading && !data.error && (
            <>
              {/* KPI Row */}
              <OzonKpiGrid kpi={data.kpi} snapshotDate={data.snapshot?.capturedAt} />

              {activeTab === 'dashboard' && (
                <>
                  <div style={{ marginTop: '24px' }}>
                    <OzonOverviewSection brands={data.brands} products={data.products} />
                  </div>

                  {/* Top Filters & Interactive Matrix */}
                  <div style={{ marginTop: '24px' }}>
                    <GlobalFiltersBar />
                    <SalesMatrix />
                  </div>
                </>
              )}

              {/* Tab Bar removed as it is now in the sidebar */}

              {/* Tab Content (placeholders for Этапы 4-6) */}
              {activeTab !== 'dashboard' && (
                <div className={ozon.sectionCard}>
                  <div className={ozon.sectionHeader}>
                    <div className={ozon.sectionTitle}>
                      {tabs.find(t => t.id === activeTab)?.icon}
                      {tabs.find(t => t.id === activeTab)?.label}
                    </div>
                    <span className={ozon.sectionSubtitle}>
                      {activeTab === 'cards' && `${data.products.length} карточек товаров`}
                      {activeTab === 'economics' && `Юнит-экономика FBO / FBS / rFBS`}
                      {activeTab === 'reviews' && `Семантический анализ отзывов покупателей`}
                      {activeTab === 'content' && `Анализ качества контента`}
                      {activeTab === 'brands' && `${data.brands.length} брендов`}
                      {activeTab === 'insights' && `${data.insights.length} AI-инсайтов`}
                      {activeTab === 'import' && `Управление источниками данных`}
                    </span>
                  </div>
                  <div className={ozon.sectionBody}>
                    {activeTab === 'cards' && (
                      <ProductCardsTable products={data.products} onRowClick={setSelectedProduct} />
                    )}
                    {activeTab === 'economics' && (
                      <UnitEconomicsSection />
                    )}
                    {activeTab === 'reviews' && (
                      <ReviewsAnalysisSection reviewsData={data.reviewsData} />
                    )}
                    {activeTab === 'content' && (
                      <ContentAnalysisSection products={data.products} />
                    )}
                    {activeTab === 'brands' && (
                      <BrandDrilldownSection brands={data.brands} products={data.products} />
                    )}
                    {activeTab === 'insights' && (
                      <InsightsSection insights={data.insights} />
                    )}
                    {activeTab === 'import' && (
                      <ImportSourcesSection />
                    )}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* Drawer */}
      <ProductCardDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <ProductSlidePanel />
    </div>
  );
}
