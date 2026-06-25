'use client';

import React from 'react';
import styles from '@/styles/ozon.module.css';
import { OzonKpiCard } from './OzonKpiCard';
import {
  IconDollarSign,
  IconShoppingBag,
  IconActivity,
  IconTrendingUp,
  IconStar,
  IconPackage,
} from '@/components/icons';
import { OzonAnalyticsData } from '../model/types';
import { formatCurrency, formatPercent, formatNumber, formatVelocity } from '../lib/formatters';

interface OzonKpiGridProps {
  kpi: OzonAnalyticsData['kpi'];
  snapshotDate?: string;
}

export function OzonKpiGrid({ kpi, snapshotDate }: OzonKpiGridProps) {
  const kpis = [
    {
      icon: <IconDollarSign size={16} />,
      label: 'Выручка рынка',
      value: formatCurrency(kpi.totalRevenue),
      delta: `${kpi.totalBrands} брендов`,
      deltaDirection: 'stable' as const,
      details: 'Суммарная выручка всех отслеживаемых конкурентов и товаров на Ozon',
    },
    {
      icon: <IconShoppingBag size={16} />,
      label: 'Заказов',
      value: formatNumber(kpi.totalOrdered),
      delta: `${kpi.totalSKUs} SKU`,
      deltaDirection: 'stable' as const,
      details: 'Общее количество заказов по всем карточкам за выбранный период',
    },
    {
      icon: <IconActivity size={16} />,
      label: 'Средний выкуп',
      value: formatPercent(kpi.avgBuyout),
      delta: kpi.avgBuyout >= 70 ? 'Здоровый рынок' : 'Ниже нормы',
      deltaDirection: kpi.avgBuyout >= 70 ? ('up' as const) : ('down' as const),
      details: 'Отношение доставленных заказов к заказанным (доля выкупа FBO/FBS)',
    },
    {
      icon: <IconDollarSign size={16} />,
      label: 'Средний чек',
      value: formatCurrency(kpi.asp),
      deltaDirection: 'stable' as const,
      details: 'Средняя стоимость одного выкупленного заказа (Выручка / Заказы)',
    },
    {
      icon: <IconTrendingUp size={16} />,
      label: 'Velocity',
      value: formatVelocity(kpi.avgVelocity),
      delta: 'шт/день',
      deltaDirection: 'stable' as const,
      details: 'Средняя скорость продаж одного SKU в день (Шт. / Дней в стоке)',
    },
    {
      icon: <IconStar size={14} />,
      label: 'Средний рейтинг',
      value: kpi.avgRating.toFixed(1),
      delta: kpi.avgRating >= 4.5 ? 'Отлично' : kpi.avgRating >= 4.0 ? 'Хорошо' : 'Ниже 4.0',
      deltaDirection: kpi.avgRating >= 4.5 ? ('up' as const) : kpi.avgRating >= 4.0 ? ('stable' as const) : ('down' as const),
      details: 'Усредненная оценка покупателей по всем анализируемым товарам',
    },
  ];

  return (
    <div className={styles.kpiRow} id="ozon-kpi-row">
      {snapshotDate && (
        <div style={{ gridColumn: '1 / -1', textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
          Данные актуальны на: {new Date(snapshotDate).toLocaleString('ru-RU')}
        </div>
      )}
      {kpis.map((kpi, i) => (
        <OzonKpiCard
          key={i}
          icon={kpi.icon}
          label={kpi.label}
          value={kpi.value}
          delta={kpi.delta}
          deltaDirection={kpi.deltaDirection}
          details={kpi.details}
        />
      ))}
    </div>
  );
}

export default OzonKpiGrid;
