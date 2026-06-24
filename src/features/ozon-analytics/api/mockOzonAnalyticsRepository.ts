import {
  Brand,
  CardContent,
  ParentProduct,
  ProductVariant,
  Snapshot,
  VariantMetrics,
} from '../model/types';
import {
  mockBrands,
  mockContents,
  mockMetrics,
  mockParents,
  mockSnapshot,
  mockVariants,
} from '../model/mock-data';
import { OzonAnalyticsRepository } from './ozonAnalyticsRepository';

/**
 * Mock-реализация репозитория.
 * Эмулирует задержку сети (200ms) для реалистичного UX loading-состояний.
 * Когда появится API — заменить этот класс без изменения hooks.
 */
function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export class MockOzonAnalyticsRepository implements OzonAnalyticsRepository {
  async getBrands(): Promise<Brand[]> {
    return delay([...mockBrands]);
  }

  async getSnapshot(): Promise<Snapshot> {
    return delay({ ...mockSnapshot });
  }

  async getParents(brandIds?: string[]): Promise<ParentProduct[]> {
    const result = brandIds?.length
      ? mockParents.filter((p) => brandIds.includes(p.brandId))
      : [...mockParents];
    return delay(result);
  }

  async getVariants(parentIds?: string[]): Promise<ProductVariant[]> {
    const result = parentIds?.length
      ? mockVariants.filter((v) => parentIds.includes(v.parentProductId))
      : [...mockVariants];
    return delay(result);
  }

  async getMetrics(snapshotId: string, variantIds?: string[]): Promise<VariantMetrics[]> {
    const result = mockMetrics.filter(
      (m) =>
        m.snapshotId === snapshotId &&
        (variantIds?.length ? variantIds.includes(m.variantId) : true)
    );
    return delay(result);
  }

  async getContents(snapshotId: string, parentIds?: string[]): Promise<CardContent[]> {
    const result = mockContents.filter(
      (c) =>
        c.snapshotId === snapshotId &&
        (parentIds?.length ? parentIds.includes(c.parentProductId) : true)
    );
    return delay(result);
  }
}

// Singleton-инстанс для всего приложения
export const ozonRepository: OzonAnalyticsRepository = new MockOzonAnalyticsRepository();
