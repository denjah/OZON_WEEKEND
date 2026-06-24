import {
  Brand,
  ParentProduct,
  ProductVariant,
  Snapshot,
  VariantMetrics,
  CardContent,
} from '../model/types';

/**
 * Абстрактный интерфейс репозитория.
 * Когда появится реальный парсер/API — заменить MockOzonAnalyticsRepository
 * на RealOzonAnalyticsRepository без изменения hooks и UI.
 */
export interface OzonAnalyticsRepository {
  getBrands(): Promise<Brand[]>;
  getSnapshot(snapshotId?: string): Promise<Snapshot>;
  getParents(brandIds?: string[]): Promise<ParentProduct[]>;
  getVariants(parentIds?: string[]): Promise<ProductVariant[]>;
  getMetrics(snapshotId: string, variantIds?: string[]): Promise<VariantMetrics[]>;
  getContents(snapshotId: string, parentIds?: string[]): Promise<CardContent[]>;
}
