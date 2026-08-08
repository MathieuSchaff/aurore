// Curated brand-level certifications for vegan / cruelty-free / natural-or-organic
// claims. Brand names match `lower(trim(products.brand))` so casing/whitespace never miss.
//
// Skeleton: the full curated list lives in the SQL snapshot, not here. These two
// entries are a shape example: add rows back here and run the seed again to refresh from TS.

import type {
  BrandCertificationInsert,
  BrandCertificationSources,
} from '../../schema/products/brand-certifications'
import { normalizeBrand } from '../../schema/products/brand-certifications'

interface BrandCertSeed {
  brandDisplay: string
  vegan?: boolean
  crueltyFree?: boolean
  naturalCertified?: boolean
  sources: BrandCertificationSources
  notes?: string
}

const BRAND_CERTS: BrandCertSeed[] = [
  {
    brandDisplay: 'COSRX',
    crueltyFree: true,
    sources: { cruelty_free: ['manual'] },
  },
  {
    brandDisplay: 'Innisfree',
    crueltyFree: true,
    sources: { cruelty_free: ['peta'] },
  },
]

export const BRAND_CERTIFICATION_INSERTS: BrandCertificationInsert[] = BRAND_CERTS.map((b) => ({
  brandNormalized: normalizeBrand(b.brandDisplay),
  brandDisplay: b.brandDisplay,
  isVegan: b.vegan ?? false,
  isCrueltyFree: b.crueltyFree ?? false,
  isNaturalCertified: b.naturalCertified ?? false,
  sources: b.sources,
  notes: b.notes ?? null,
}))
