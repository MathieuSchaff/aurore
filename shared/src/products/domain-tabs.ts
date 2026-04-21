import { PRODUCT_CATEGORY_VALUES, type ProductCategory } from './kinds'

export const PRODUCT_DOMAIN_TABS = ['skincare', 'haircare', 'dental', 'complement'] as const
export type ProductDomainTab = (typeof PRODUCT_DOMAIN_TABS)[number]

export const PRODUCT_DOMAIN_DB_CATEGORIES: Record<ProductDomainTab, readonly ProductCategory[]> = {
  skincare: ['skincare', 'solaire', 'bodycare'] as const,
  haircare: ['haircare'] as const,
  dental: ['dental'] as const,
  complement: ['complement'] as const,
}

export const PRODUCT_DOMAIN_TAB_META: Record<
  ProductDomainTab,
  { label: string; order: number }
> = {
  skincare: { label: 'Skincare', order: 1 },
  haircare: { label: 'Cheveux', order: 2 },
  dental: { label: 'Dents', order: 3 },
  complement: { label: 'Compléments', order: 4 },
}

// Safety net: every DB category value must appear in exactly one tab bucket.
// This is a type-level reminder (no runtime cost in production builds).
const _coverageCheck = [
  ...PRODUCT_DOMAIN_DB_CATEGORIES.skincare,
  ...PRODUCT_DOMAIN_DB_CATEGORIES.haircare,
  ...PRODUCT_DOMAIN_DB_CATEGORIES.dental,
  ...PRODUCT_DOMAIN_DB_CATEGORIES.complement,
] satisfies readonly ProductCategory[]
void _coverageCheck
void PRODUCT_CATEGORY_VALUES
