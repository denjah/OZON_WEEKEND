'use client';

import React, { useState } from 'react';
import styles from '@/styles/unit-economics.module.css';
import { useUnitEconomicsStore, useUnitEconomicsCalculations, Scheme } from '../model/useUnitEconomicsStore';
import { EconomicsInputGroup } from './EconomicsInputGroup';
import { EconomicsOutputGrid } from './EconomicsOutputGrid';
import { WhatIfSlider } from './WhatIfSlider';
import { useExportXlsx } from '../hooks/useExportXlsx';
import { AggregationMethod } from '../lib/unit-economics-calculator';

// Mock products for the API simulation
const MOCK_PRODUCTS = [
  { id: 'SKU1', name: 'Бильярдный стол Weekend 1', length: 2500, width: 1500, height: 400, weight: 150000, volume: 1500 },
  { id: 'SKU2', name: 'Кий ручной работы', length: 1600, width: 50, height: 50, weight: 600, volume: 4 },
  { id: 'SKU3', name: 'Набор шаров Aramith', length: 250, width: 250, height: 60, weight: 3000, volume: 3.75 },
];

export function UnitEconomicsSection() {
  const store = useUnitEconomicsStore();
  const calc = useUnitEconomicsCalculations();
  const { exportToExcel } = useExportXlsx();

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sku = e.target.value;
    store.setField('selectedSku', sku);
    
    const prod = MOCK_PRODUCTS.find(p => p.id === sku);
    if (prod) {
      store.setField('dimensions', {
        length: prod.length,
        width: prod.width,
        height: prod.height,
        weight: prod.weight,
        volume: prod.volume
      });
    } else {
      store.setField('dimensions', null);
    }
  };

  const handleExport = () => {
    const data = [{
      SKU: store.selectedSku || 'Custom',
      Scheme: store.scheme,
      Method: store.method,
      SellingPrice: store.sellingPrice,
      COGS: store.cogs,
      Commission: calc.commission.toFixed(2),
      Acquiring: calc.acquiring.toFixed(2),
      LogisticsCost: calc.logistics.cost.toFixed(2),
      ReturnCost: calc.logistics.returnCost.toFixed(2),
      NetProfit: calc.netProfit.toFixed(2),
      MarginPercent: calc.marginPercent.toFixed(2),
      ROI: calc.roiPercent.toFixed(2),
      BreakEven: calc.breakEven.toFixed(2)
    }];
    exportToExcel(data, `Economics_${store.scheme}_${store.selectedSku || 'custom'}`, 'Economics');
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputsPanel}>
        
        {/* Source Status & Product Selector */}
        <div className={styles.cardHeader}>
          <h3>Настройки товара (Ozon API)</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className={styles.dataSourceStatus}>
              <span className={styles.statusSuccess}>●</span> DL PDF Парсинг: Успех
            </div>
            <button className={styles.exportButton} onClick={handleExport}>
              ⬇ Экспорт (.xlsx)
            </button>
          </div>
        </div>

        <select 
          className={styles.selectInput}
          value={store.selectedSku || ''}
          onChange={handleProductSelect}
        >
          <option value="">-- Выберите товар --</option>
          {MOCK_PRODUCTS.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {store.dimensions && (
          <div className={styles.dimensionsInfo}>
            Д: {store.dimensions.length}мм, Ш: {store.dimensions.width}мм, В: {store.dimensions.height}мм, Вес: {store.dimensions.weight}г (Объем: {store.dimensions.volume}л)
          </div>
        )}

        <div className={styles.schemeSwitcher}>
          {(['fbo', 'fbs', 'rfbs'] as Scheme[]).map(scheme => (
            <button
              key={scheme}
              className={`${styles.schemeButton} ${store.scheme === scheme ? styles.active : ''}`}
              onClick={() => store.setScheme(scheme)}
            >
              {scheme.toUpperCase()}
            </button>
          ))}
        </div>

        {(store.scheme === 'fbo' || store.scheme === 'fbs') && (
          <div className={styles.methodSwitcher}>
            <label>Метод расчета логистики:</label>
            <select 
              className={styles.selectInput}
              value={store.method}
              onChange={(e) => store.setField('method', e.target.value as AggregationMethod)}
            >
              <option value="median_top5">Медиана по Топ-5 маршрутам</option>
              <option value="weighted_average">Взвешенное среднее по всем</option>
            </select>
          </div>
        )}

        <WhatIfSlider
          label="Цена продажи (What-If)"
          value={store.sellingPrice}
          min={100} max={200000} step={100} unit="₽"
          onChange={(v) => store.setField('sellingPrice', v)}
        />
        
        <EconomicsInputGroup 
          label="Себестоимость"
          value={store.cogs}
          min={0} max={100000} step={100} unit="₽"
          onChange={(v) => store.setField('cogs', v)}
        />
        <EconomicsInputGroup 
          label="Комиссия маркетплейса"
          value={store.commissionPercent}
          min={0} max={30} step={0.5} unit="%"
          onChange={(v) => store.setField('commissionPercent', v)}
        />
        <EconomicsInputGroup 
          label="Эквайринг"
          value={store.acquiringPercent}
          min={0} max={5} step={0.1} unit="%"
          onChange={(v) => store.setField('acquiringPercent', v)}
        />
        <EconomicsInputGroup 
          label="Процент возвратов"
          value={store.returnsPercent}
          min={0} max={50} step={1} unit="%"
          onChange={(v) => store.setField('returnsPercent', v)}
        />
        <EconomicsInputGroup 
          label="Налог (УСН/ОСНО)"
          value={store.taxPercent}
          min={0} max={20} step={1} unit="%"
          onChange={(v) => store.setField('taxPercent', v)}
        />

        {store.scheme === 'rfbs' && (
          <div className={styles.dlDiscountsBlock}>
            <h4>Скидки Деловых Линий (%)</h4>
            <div className={styles.discountsGrid}>
              <EconomicsInputGroup label="Упаковка" value={store.dlDiscounts.packaging} min={0} max={100} step={1} unit="%" onChange={(v) => store.setDlDiscount('packaging', v)} />
              <EconomicsInputGroup label="Экспедирование" value={store.dlDiscounts.expediting} min={0} max={100} step={1} unit="%" onChange={(v) => store.setDlDiscount('expediting', v)} />
              <EconomicsInputGroup label="Межтерм. Транспорт" value={store.dlDiscounts.transportation} min={0} max={100} step={1} unit="%" onChange={(v) => store.setDlDiscount('transportation', v)} />
              <EconomicsInputGroup label="ПРР" value={store.dlDiscounts.loading} min={0} max={100} step={1} unit="%" onChange={(v) => store.setDlDiscount('loading', v)} />
            </div>
          </div>
        )}
      </div>

      <div className={styles.outputsPanel}>
        <EconomicsOutputGrid 
          netProfit={calc.netProfit} 
          marginPercent={calc.marginPercent} 
          roiPercent={calc.roiPercent} 
        />

        <div className={styles.logisticsDetails}>
          <h4>Детали Логистики ({store.scheme.toUpperCase()})</h4>
          <p>{calc.logistics.details}</p>
          <p>Вперед: <strong>{calc.logistics.cost.toFixed(2)} ₽</strong></p>
          <p>Возвраты (учет {store.returnsPercent}%): <strong>{calc.logistics.returnCost.toFixed(2)} ₽</strong></p>
        </div>

        <div className={styles.chartContainer}>
          <div className={styles.chartTitle}>Точка безубыточности: {calc.breakEven.toFixed(0)} ₽</div>
          
          <div className={styles.chartBarWrapper}>
            {store.sellingPrice > 0 ? (
              <>
                <div className={`${styles.chartSegment} ${styles.segmentCogs}`} style={{ width: `${(store.cogs / store.sellingPrice) * 100}%` }}>Закупка</div>
                <div className={`${styles.chartSegment} ${styles.segmentCommission}`} style={{ width: `${((calc.commission + calc.acquiring + calc.tax) / store.sellingPrice) * 100}%` }}>Комиссии</div>
                <div className={`${styles.chartSegment} ${styles.segmentLogistics}`} style={{ width: `${((calc.logistics.cost + calc.logistics.returnCost) / store.sellingPrice) * 100}%` }}>Логистика</div>
                {calc.netProfit > 0 && (
                  <div className={`${styles.chartSegment} ${styles.segmentProfit}`} style={{ width: `${(calc.netProfit / store.sellingPrice) * 100}%` }}>Прибыль</div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
