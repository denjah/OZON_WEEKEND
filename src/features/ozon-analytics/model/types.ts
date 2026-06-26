export type Marketplace = 'ozon';
export type WorkScheme = 'FBS' | 'FBO' | 'Crossborder';
export type CompetitorType = 'direct' | 'indirect' | 'potential' | 'niche';
export type SnapshotSource = 'parser' | 'manual' | 'import' | 'api';

export type Seller = {
  id: string;
  name: string;
  marketplace: Marketplace;
};

export type Brand = {
  id: string;
  name: string;
  competitorType?: CompetitorType;
  marketplace: Marketplace;
  color?: string; // для графиков и UI
};

export type ParentProduct = {
  id: string;
  brandId: string;
  marketplace: Marketplace;
  ozonProductId: string;
  url: string;
  title: string;
  categoryId?: string;
};

export type ProductVariant = {
  id: string;
  parentProductId: string;
  sku: string;
  barcode?: string;
  sizeFt: number;
  workScheme: WorkScheme;
};

export type Snapshot = {
  id: string;
  periodStart: string;
  periodEnd: string;
  capturedAt: string;
  source: SnapshotSource;
};

export type VariantMetrics = {
  id: string;
  snapshotId: string;
  variantId: string;

  orderedUnits: number;
  buyoutPercent: number;
  retailPrice: number;

  reviewsCount: number;
  reviewsDelta: number;
  questionsCount: number;
  rating: number;

  daysInStock: number;
};

export type CardContent = {
  id: string;
  snapshotId: string;
  parentProductId: string;

  mainImageUrl?: string;
  imageUrls: string[];
  hasVideo: boolean;
  videoUrl?: string;

  title: string;
  characteristics: Record<string, string | number | boolean>;
  description: string;

  contentScore?: number;
};

// --- UI Derived Types ---

// Тэги для фильтрации и классификации товаров
export type ProductTag =
  | 'Настольный'
  | 'Напольный'
  | 'Складной'
  | 'Подсветка'
  | 'Электронный счётчик';

export const ALL_PRODUCT_TAGS: ProductTag[] = [
  'Настольный',
  'Напольный',
  'Складной',
  'Подсветка',
  'Электронный счётчик',
];

export type AggregatedProduct = {
  // Базовая инфа
  id: string;
  parentProductId: string;
  variantId: string;
  title: string;
  brandName: string;
  brandId: string;
  sizeFt: number;
  workScheme: WorkScheme;
  sku: string;
  url: string;

  // Контент
  mainImage: string;
  hasVideo: boolean;
  contentScore: number;
  imageUrls?: string[];

  // Тэги (классификация категории) — опционально в static data, inferTags заполняет в хуке
  tags?: ProductTag[];

  // Продажи
  price: number;
  ordered: number;
  buyoutPercent: number;
  revenue: number;
  asp: number;
  velocity: number;

  // Социальные док-ва
  rating: number;
  reviews: number;
  reviewsDelta: number;
  questions: number;
};

export type MetricMode = 'revenue' | 'buyoutPercent' | 'funnel';

export type GroupingMode = 'competitor' | 'brand';
export type DrilldownLevel = 1 | 2 | 3;

export type FunnelMetrics = {
  impressions: number;
  clicks: number;
  ctr: number;
  addToCartPercent: number;
  drr: number;
};

export type ExportedProduct = {
  id: string;
  name: string;
  url: string;
  seller: string;
  brand: string;
  sizeText: string;
  feetCategory: string;
  exactSize?: string;
  revenue: number;
  sales: number;
  price: number;
  buyoutPercent: number;
  funnel: FunnelMetrics;
  shareInColumn: number;
};

export type SizeMatrixCell = {
  brandId: string;
  sizeFt: number;
  parentCards: number;
  childSkus: number;
  
  orderedUnits: number;
  buyoutPercent: number;
  asp: number;
  revenue: number;
  velocity: number;
  sharePercent: number; // доля этого размера внутри бренда (от 0 до 100)
};

export type MatrixCellExpanded = SizeMatrixCell & {
  funnel?: FunnelMetrics;
};

export type SizeMatrixRow = {
  brand: Brand;
  cells: Record<number, SizeMatrixCell>; // key is sizeFt
  totalRevenue: number;
  totalUnits: number;
  avgBuyout: number;
  avgVelocity: number;
};

export type ContentScoreBreakdown = {
  photos: number;
  video: number;
  title: number;
  characteristics: number;
  description: number;
  socialProof: number;
  totalScore: number; // 0-100
};

export type InsightType = 'opportunity' | 'warning' | 'risk' | 'success';

export type InsightItem = {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  relatedBrandId?: string;
  relatedSize?: number;
  relatedProductId?: string;
  score: number; // Важность инсайта 1-10 для сортировки
};

// --- Юнит-Экономика ---

export type EconomicsFBO = {
  commission: number;
  logistics: number;
  lastMile: number;
  expense: number;
  tax: number;
  profit: number;
  margin: number;
};

export type EconomicsFBS = {
  commission: number;
  processing: number;
  logistics: number;
  lastMile: number;
  expense: number;
  tax: number;
  profit: number;
  margin: number;
};

export type EconomicsRFBS = {
  commission: number;
  logistics: number;
  expense: number;
  tax: number;
  profit: number;
  margin: number;
};

export type UnitEconomics = {
  sku: string;
  title: string;
  priceForBuyer: number;
  calculatedPrice: number;
  costPrice: number;
  drr: number;
  acquiring: number;
  
  fbo: EconomicsFBO;
  fbs: EconomicsFBS;
  rfbs: EconomicsRFBS;
  
  marketAverage: number;
  
  // Для связывания
  relatedOzonUrl?: string;
  competitorSku?: string;
};

export interface OzonAnalyticsData {
  isLoading: boolean;
  error: string | null;

  brands: Brand[];
  snapshot: Snapshot | null;

  products: AggregatedProduct[];
  matrixRows: SizeMatrixRow[];

  insights: InsightItem[];

  kpi: {
    totalRevenue: number;
    totalOrdered: number;
    avgBuyout: number;
    asp: number;
    avgVelocity: number;
    avgRating: number;
    totalBrands: number;
    totalSKUs: number;
  };

  availableSizes: number[];
  
  reviewsData?: ScrapedProductData[];
}

export type ScrapedReview = {
  author: string;
  date: string;
  rating: number;
  text: string;
  photos: string[];
};

export type ScrapedQuestion = {
  question: string;
  answer: string;
  fullText: string;
};

export type ScrapedProductData = {
  productId: string;
  productName: string;
  brand: string;
  url: string;
  mainImages?: string[];
  reviews: {
    total: number;
    items: ScrapedReview[];
  };
  questions: {
    total: number;
    items: ScrapedQuestion[];
  };
};

