import { CalcInput, LogisticsResult } from './types';

// In a real scenario, we would parse the tables from dl-tariffs-msk.json here.
// Since PDF parsing yields unstructured tables, we use an approximation based on dimensions and weight.
export function calculateRFBS(input: CalcInput): LogisticsResult {
  if (!input.dimensions || input.dimensions.volume <= 0) {
    return { cost: 0, returnCost: 0, details: 'Нет габаритов' };
  }

  // Base DL transport cost (mock fallback for PDF data)
  let baseTransport = 1000 + (input.dimensions.volume * 50);
  if (input.dimensions.weight > 50000) {
    baseTransport += 500; // heavy surcharge
  }

  // Apply discounts
  const d = input.dlDiscounts;
  const packaging = 300 * (1 - d.packaging / 100);
  const expediting = 400 * (1 - d.expediting / 100);
  const transport = baseTransport * (1 - d.transportation / 100);
  const tracking = 50 * (1 - d.tracking / 100); // Usually 0 with 100% discount
  const loading = 150 * (1 - d.loading / 100);
  
  const totalCost = packaging + expediting + transport + tracking + loading;
  
  // Return for rFBS usually includes full reverse logistics, but we just approximate
  const returnCost = totalCost * (input.returnsPercent / 100);

  return {
    cost: totalCost,
    returnCost,
    details: `Упаковка(${packaging.toFixed(0)}) + Эксп(${expediting.toFixed(0)}) + Трансп(${transport.toFixed(0)}) + Отслеж(${tracking.toFixed(0)}) + ПРР(${loading.toFixed(0)}) = ${totalCost.toFixed(0)}₽`
  };
}
