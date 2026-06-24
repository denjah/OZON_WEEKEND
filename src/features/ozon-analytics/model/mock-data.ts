import {
  Brand,
  ParentProduct,
  ProductVariant,
  Snapshot,
  VariantMetrics,
  CardContent,
  WorkScheme,
  CompetitorType,
  SnapshotSource
} from './types';
import { calcContentScore } from '../lib/content-score';

export const mockBrands: Brand[] = [
  { id: 'b-weekend', name: 'Weekend', marketplace: 'ozon', competitorType: 'direct', color: '#00B4D8' },
  { id: 'b-startline', name: 'Start Line', marketplace: 'ozon', competitorType: 'direct', color: '#10B981' },
  { id: 'b-dynamic', name: 'Dynamic Billard', marketplace: 'ozon', competitorType: 'indirect', color: '#F59E0B' },
  { id: 'b-ruptur', name: 'РуптуР', marketplace: 'ozon', competitorType: 'niche', color: '#8B5CF6' },
  { id: 'b-luza', name: 'Luza', marketplace: 'ozon', competitorType: 'direct', color: '#EF4444' },
  { id: 'b-fortuna', name: 'Fortuna', marketplace: 'ozon', competitorType: 'potential', color: '#6366F1' },
  { id: 'b-rasson', name: 'Rasson', marketplace: 'ozon', competitorType: 'indirect', color: '#EC4899' },
];

export const mockSnapshot: Snapshot = {
  id: 'snap-001',
  periodStart: '2026-05-01T00:00:00Z',
  periodEnd: '2026-05-31T23:59:59Z',
  capturedAt: '2026-06-01T10:00:00Z',
  source: 'parser'
};

// Функция-утилита для генерации градиентного плейсхолдера
function getGradientPlaceholder(seed: string): string {
  // Простой hash для цвета
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color1 = Math.abs(hash).toString(16).substring(0, 6).padStart(6, '0');
  const color2 = Math.abs(hash * 3).toString(16).substring(0, 6).padStart(6, '0');
  
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g${hash}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23${color1}"/><stop offset="100%" stop-color="%23${color2}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g${hash})"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">${seed}</text></svg>`;
}

const parentTitles = [
  'Бильярдный стол для пула',
  'Стол бильярдный русская пирамида',
  'Снукерный стол профессиональный',
  'Бильярдный стол складной',
  'Стол для бильярда домашний',
];

export const mockParents: ParentProduct[] = [];
export const mockVariants: ProductVariant[] = [];
export const mockMetrics: VariantMetrics[] = [];
export const mockContents: CardContent[] = [];

let parentIdCounter = 1;
let variantIdCounter = 1;

const sizes = [5, 6, 7, 8, 9, 10, 12];
const schemes: WorkScheme[] = ['FBS', 'FBO'];

mockBrands.forEach((brand) => {
  // Генерируем 4-6 родительских карточек для каждого бренда
  const parentCount = Math.floor(Math.random() * 3) + 4; 
  
  for (let p = 0; p < parentCount; p++) {
    const pId = `p-${parentIdCounter++}`;
    const baseTitle = parentTitles[Math.floor(Math.random() * parentTitles.length)];
    const title = `${baseTitle} ${brand.name} Модель ${p + 1}`;
    
    mockParents.push({
      id: pId,
      brandId: brand.id,
      marketplace: 'ozon',
      ozonProductId: `oz-${Math.floor(Math.random() * 10000000)}`,
      url: `https://ozon.ru/product/${pId}`,
      title,
    });

    // Для каждого родителя 1-4 размера
    const variantCount = Math.floor(Math.random() * 4) + 1;
    const shuffledSizes = [...sizes].sort(() => 0.5 - Math.random());
    const selectedSizes = shuffledSizes.slice(0, variantCount);

    selectedSizes.forEach((size) => {
      const vId = `v-${variantIdCounter++}`;
      const scheme = schemes[Math.floor(Math.random() * schemes.length)];
      
      mockVariants.push({
        id: vId,
        parentProductId: pId,
        sku: `SKU-${brand.name.substring(0,3).toUpperCase()}-${size}-${vId}`,
        sizeFt: size,
        workScheme: scheme,
      });

      // Метрики
      // Задаем базовую цену в зависимости от размера
      const basePrice = size * 15000 + (Math.random() * 20000);
      const buyout = 45 + (Math.random() * 45); // 45% - 90%
      const ordered = Math.floor(Math.random() * 50); // 0 - 50 штук за период
      const rating = ordered > 0 ? 3.5 + (Math.random() * 1.5) : 0; // 3.5 - 5.0

      mockMetrics.push({
        id: `m-${vId}`,
        snapshotId: mockSnapshot.id,
        variantId: vId,
        orderedUnits: ordered,
        buyoutPercent: buyout,
        retailPrice: basePrice,
        reviewsCount: Math.floor(ordered * 1.5),
        reviewsDelta: Math.floor(Math.random() * 5),
        questionsCount: Math.floor(Math.random() * 10),
        rating: Number(rating.toFixed(1)),
        daysInStock: 30 - Math.floor(Math.random() * 10), // 20 - 30 дней
      });
    });

    // Контент для родительской карточки
    const hasVideo = Math.random() > 0.5;
    const descLength = Math.floor(Math.random() * 1000) + 100;
    const desc = "A".repeat(descLength); // dummy text length
    
    const content: CardContent = {
      id: `c-${pId}`,
      snapshotId: mockSnapshot.id,
      parentProductId: pId,
      mainImageUrl: getGradientPlaceholder(`${brand.name} ${p+1}`),
      imageUrls: Array(Math.floor(Math.random() * 6) + 1).fill('').map((_, i) => getGradientPlaceholder(`Img ${i+1}`)),
      hasVideo,
      title,
      characteristics: {
        'Материал': 'МДФ / Камень',
        'Сукно': 'Зеленое',
        'Бренд': brand.name,
      },
      description: desc,
    };

    content.contentScore = calcContentScore(content).totalScore;
    mockContents.push(content);
  }
});

// Добавим несколько выбросов для инсайтов (ручное вмешательство)
// 1. Супер карточка для Weekend (доминант)
if (mockVariants.length > 0) {
  const weekendParent = mockParents.find(p => p.brandId === 'b-weekend');
  if (weekendParent) {
    const weekendVariant = mockVariants.find(v => v.parentProductId === weekendParent.id);
    if (weekendVariant) {
      const metric = mockMetrics.find(m => m.variantId === weekendVariant.id);
      if (metric) {
        metric.orderedUnits = 120; // Очень много заказов
        metric.retailPrice = 45000; 
        metric.buyoutPercent = 88;
        // Это создаст инсайт "Размер-доминант"
      }
    }
  }
}
