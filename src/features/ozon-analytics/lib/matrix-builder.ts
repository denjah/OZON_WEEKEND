import { Brand, MetricMode, ParentProduct, ProductVariant, SizeMatrixCell, SizeMatrixRow, VariantMetrics } from '../model/types';
import { calcRedeemedUnits, calcRevenue, calcVelocity, calcASP } from './aggregations';

export function buildSizeMatrix(
  brands: Brand[],
  parents: ParentProduct[],
  variants: ProductVariant[],
  metrics: VariantMetrics[],
  mode: MetricMode
): SizeMatrixRow[] {
  
  const rows: SizeMatrixRow[] = [];

  for (const brand of brands) {
    // Найти все карточки и варианты бренда
    const brandParents = parents.filter(p => p.brandId === brand.id);
    const parentIds = brandParents.map(p => p.id);
    const brandVariants = variants.filter(v => parentIds.includes(v.parentProductId));
    
    // Сгруппировать по размерам
    const sizeMap: Record<number, SizeMatrixCell> = {};
    let brandTotalRevenue = 0;
    let brandTotalUnits = 0;
    let brandTotalBuyoutSum = 0;
    let brandTotalVelocitySum = 0;
    let variantCount = 0;

    // Инициализировать ячейки по доступным размерам в бренде
    const uniqueSizes = Array.from(new Set(brandVariants.map(v => v.sizeFt)));
    
    uniqueSizes.forEach(size => {
      sizeMap[size] = {
        brandId: brand.id,
        sizeFt: size,
        parentCards: 0,
        childSkus: 0,
        orderedUnits: 0,
        buyoutPercent: 0,
        asp: 0,
        revenue: 0,
        velocity: 0,
        sharePercent: 0
      };
    });

    brandVariants.forEach(variant => {
      const metric = metrics.find(m => m.variantId === variant.id);
      if (!metric) return;

      const cell = sizeMap[variant.sizeFt];
      const redeemed = calcRedeemedUnits(metric.orderedUnits, metric.buyoutPercent);
      const rev = calcRevenue(redeemed, metric.retailPrice);
      const vel = calcVelocity(redeemed, metric.daysInStock);

      cell.childSkus++;
      cell.orderedUnits += metric.orderedUnits;
      // Временно накапливаем сумму процентов, потом усредним
      cell.buyoutPercent += metric.buyoutPercent; 
      cell.revenue += rev;
      cell.velocity += vel;
      // Временно храним сумму выкупленных для ASP
      cell.asp += redeemed; // this will hold total redeemed units temporarily

      brandTotalRevenue += rev;
      brandTotalUnits += metric.orderedUnits;
      brandTotalBuyoutSum += metric.buyoutPercent;
      brandTotalVelocitySum += vel;
      variantCount++;
    });

    // Финализация расчетов в ячейках
    uniqueSizes.forEach(size => {
      const cell = sizeMap[size];
      if (cell.childSkus > 0) {
        cell.buyoutPercent = cell.buyoutPercent / cell.childSkus; // avg
        cell.velocity = cell.velocity / cell.childSkus; // avg
        // cell.asp сейчас хранит total redeemed
        cell.asp = cell.asp > 0 ? cell.revenue / cell.asp : 0;
        
        // Родительские карточки в этом размере
        const pIds = new Set(brandVariants.filter(v => v.sizeFt === size).map(v => v.parentProductId));
        cell.parentCards = pIds.size;
      }
    });

    // Расчет доли размера в бренде (sharePercent)
    if (brandTotalRevenue > 0) {
      uniqueSizes.forEach(size => {
        sizeMap[size].sharePercent = (sizeMap[size].revenue / brandTotalRevenue) * 100;
      });
    }

    if (variantCount > 0) {
      rows.push({
        brand,
        cells: sizeMap,
        totalRevenue: brandTotalRevenue,
        totalUnits: brandTotalUnits,
        avgBuyout: brandTotalBuyoutSum / variantCount,
        avgVelocity: brandTotalVelocitySum / variantCount
      });
    }
  }

  // Сортировка по убыванию Revenue (по умолчанию)
  rows.sort((a, b) => b.totalRevenue - a.totalRevenue);

  return rows;
}
