import { CalcInput, LogisticsResult, LocalityStats, LogisticsTariff } from './types';
import { parseVolumeToBucket } from './helpers';

// These should be fetched from the API / JSON in a real scenario
import localityStatsJson from '@/data/ozon/reference-data/locality-stats.json';
import tariffsJson from '@/data/ozon/reference-data/logistics-tariffs.json';

const localityStats = localityStatsJson as LocalityStats;
const tariffs = tariffsJson as LogisticsTariff[];

export function calculateFBO(input: CalcInput): LogisticsResult {
  if (!input.dimensions || input.dimensions.volume <= 0) {
    return { cost: 0, returnCost: 0, details: 'Нет габаритов' };
  }

  const bucket = parseVolumeToBucket(input.dimensions.volume);
  
  // Filter tariffs for this bucket
  const bucketTariffs = tariffs.filter(t => t.volume === bucket);
  
  if (bucketTariffs.length === 0) {
    return { cost: 0, returnCost: 0, details: `Нет тарифа для объема ${bucket}` };
  }

  const LAST_MILE = 25; // per unit

  let logisticsCost = 0;
  let details = '';

  if (input.method === 'median_top5') {
    // Top 5 routes
    const top5 = localityStats.top5;
    const costs: number[] = [];
    
    top5.forEach(route => {
      const tariff = bucketTariffs.find(t => t.from === route.from && t.to === route.to);
      if (tariff) {
        costs.push(input.sellingPrice > 300 ? tariff.price_over_300 : tariff.price_under_300);
      }
    });

    if (costs.length > 0) {
      costs.sort((a, b) => a - b);
      const mid = Math.floor(costs.length / 2);
      const median = costs.length % 2 !== 0 ? costs[mid] : (costs[mid - 1] + costs[mid]) / 2;
      logisticsCost = median;
      details = `Медиана по Топ-5 (${costs.length} найдено): ${median.toFixed(2)}₽`;
    }
  } else {
    // Weighted Average
    const allRoutes = localityStats.all_routes;
    let totalWeightedCost = 0;
    let matchedWeight = 0;

    allRoutes.forEach(route => {
      const tariff = bucketTariffs.find(t => t.from === route.from && t.to === route.to);
      if (tariff) {
        const cost = input.sellingPrice > 300 ? tariff.price_over_300 : tariff.price_under_300;
        totalWeightedCost += cost * route.weight;
        matchedWeight += route.weight;
      }
    });

    if (matchedWeight > 0) {
      // Normalize if some routes didn't match a tariff
      logisticsCost = totalWeightedCost / matchedWeight;
      details = `Взвешенное среднее: ${logisticsCost.toFixed(2)}₽`;
    }
  }

  const totalLogistics = logisticsCost + LAST_MILE;
  
  // Return cost is usually ~50 rubles + last mile reverse + processing, but for simplicity we'll just say return logistics is same as forward FBO logistics
  const returnCost = totalLogistics * (input.returnsPercent / 100);

  return {
    cost: totalLogistics,
    returnCost: returnCost,
    details: `${details} + LastMile 25₽ = ${totalLogistics.toFixed(2)}₽`
  };
}
