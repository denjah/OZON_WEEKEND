import { VariantMetrics } from '../model/types';

export function calcRedeemedUnits(orderedUnits: number, buyoutPercent: number): number {
  return orderedUnits * (buyoutPercent / 100);
}

export function calcRevenue(redeemedUnits: number, retailPrice: number): number {
  return redeemedUnits * retailPrice;
}

export function calcVelocity(redeemedUnits: number, daysInStock: number): number {
  if (daysInStock <= 0) return 0;
  return redeemedUnits / daysInStock;
}

export function calcASP(revenue: number, redeemedUnits: number): number {
  if (redeemedUnits <= 0) return 0;
  return revenue / redeemedUnits;
}

export function calcSizeShare(sizeRevenue: number, brandTotalRevenue: number): number {
  if (brandTotalRevenue <= 0) return 0;
  return (sizeRevenue / brandTotalRevenue) * 100;
}

/**
 * Расчет всех агрегированных показателей по одной карточке/варианту
 */
export function calculateVariantTotals(metric: VariantMetrics) {
  const redeemedUnits = calcRedeemedUnits(metric.orderedUnits, metric.buyoutPercent);
  const revenue = calcRevenue(redeemedUnits, metric.retailPrice);
  const velocity = calcVelocity(redeemedUnits, metric.daysInStock);
  const asp = calcASP(revenue, redeemedUnits);

  return {
    redeemedUnits,
    revenue,
    velocity,
    asp
  };
}

/**
 * Глобальная агрегация для верхних KPI
 */
export function calculateGlobalKpis(metricsList: VariantMetrics[]) {
  let totalOrderedUnits = 0;
  let totalRedeemedUnits = 0;
  let totalRevenue = 0;
  let totalVelocitySum = 0;
  let totalRatingSum = 0;
  const totalContentScoreSum = 0; // if we pass content scores here, or calculate separately
  
  metricsList.forEach(m => {
    const redeemed = calcRedeemedUnits(m.orderedUnits, m.buyoutPercent);
    const rev = calcRevenue(redeemed, m.retailPrice);
    
    totalOrderedUnits += m.orderedUnits;
    totalRedeemedUnits += redeemed;
    totalRevenue += rev;
    totalVelocitySum += calcVelocity(redeemed, m.daysInStock);
    totalRatingSum += m.rating;
  });

  const avgBuyoutPercent = totalOrderedUnits > 0 ? (totalRedeemedUnits / totalOrderedUnits) * 100 : 0;
  const asp = totalRedeemedUnits > 0 ? totalRevenue / totalRedeemedUnits : 0;
  const avgVelocity = metricsList.length > 0 ? totalVelocitySum / metricsList.length : 0;
  const avgRating = metricsList.length > 0 ? totalRatingSum / metricsList.length : 0;

  return {
    totalOrderedUnits,
    totalRedeemedUnits,
    totalRevenue,
    avgBuyoutPercent,
    asp,
    avgVelocity,
    avgRating
  };
}

