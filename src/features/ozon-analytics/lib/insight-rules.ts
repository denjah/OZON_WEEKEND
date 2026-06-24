import { AggregatedProduct, Brand, InsightItem, SizeMatrixRow } from '../model/types';

export function generateInsights(
  products: AggregatedProduct[],
  matrixRows: SizeMatrixRow[],
  categoryAvgBuyout: number
): InsightItem[] {
  const insights: InsightItem[] = [];
  let idCounter = 1;

  // 1. Размер-доминант (если один размер дает > 45% оборота)
  for (const row of matrixRows) {
    for (const sizeStr of Object.keys(row.cells)) {
      const size = Number(sizeStr);
      const cell = row.cells[size];
      if (cell.sharePercent > 45 && cell.revenue > 100000) {
        insights.push({
          id: `ins-${idCounter++}`,
          type: 'success',
          title: 'Размер-доминант',
          description: `У бренда ${row.brand.name} размер ${size} ft формирует ${Math.round(cell.sharePercent)}% оборота (${Math.round(cell.revenue / 1000)}k ₽). Это ядро размерной матрицы.`,
          relatedBrandId: row.brand.id,
          relatedSize: size,
          score: 8
        });
      }

      // 2. Высокий velocity + низкий общий оборот (потенциальная ниша)
      if (cell.velocity > 5 && cell.sharePercent < 15 && cell.revenue > 0) {
        insights.push({
          id: `ins-${idCounter++}`,
          type: 'opportunity',
          title: 'Скрытый спрос',
          description: `Размер ${size} ft у ${row.brand.name} имеет высокий темп продаж (${cell.velocity.toFixed(1)} шт/день), но низкую представленность (${Math.round(cell.sharePercent)}%). Возможна рыночная ниша.`,
          relatedBrandId: row.brand.id,
          relatedSize: size,
          score: 9
        });
      }
    }
  }

  // Анализ по карточкам
  for (const p of products) {
    // 3. Хорошие продажи + слабый контент
    if (p.revenue > 300000 && p.contentScore < 65) {
      insights.push({
        id: `ins-${idCounter++}`,
        type: 'opportunity',
        title: 'Уязвимый лидер',
        description: `Карточка «${p.title}» (${p.brandName}) делает оборот ${Math.round(p.revenue/1000)}k ₽ несмотря на слабый контент (Score: ${p.contentScore}). Есть потенциал обогнать её качеством оформления.`,
        relatedProductId: p.id,
        relatedBrandId: p.brandId,
        score: 10
      });
    }

    // 4. Низкий выкуп
    if (p.ordered > 10 && p.buyoutPercent < (categoryAvgBuyout - 15)) {
      insights.push({
        id: `ins-${idCounter++}`,
        type: 'risk',
        title: 'Проблема с выкупом',
        description: `У карточки «${p.title}» низкий выкуп (${Math.round(p.buyoutPercent)}%). Возможные причины: цена, ожидания, описание, доставка, качество.`,
        relatedProductId: p.id,
        relatedBrandId: p.brandId,
        score: 7
      });
    }

    // 5. Топовая карточка без видео
    if (p.revenue > 500000 && !p.hasVideo) {
      insights.push({
        id: `ins-${idCounter++}`,
        type: 'warning',
        title: 'Слабое место конкурента',
        description: `У топовой карточки «${p.title}» (оборот ${Math.round(p.revenue/1000)}k ₽) нет видео. Вы можете перехватить внимание покупателей, добавив видео-обзор.`,
        relatedProductId: p.id,
        relatedBrandId: p.brandId,
        score: 8
      });
    }
  }

  // Сортировка по важности
  insights.sort((a, b) => b.score - a.score);

  return insights;
}
