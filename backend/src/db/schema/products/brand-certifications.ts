import { sql } from 'drizzle-orm'
import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

// Brand-level claims (vegan / cruelty-free / natural-or-organic certified) keyed by
// `lower(trim(brand))`, since `products.brand` is free-text with no FK. `sources` records
// provenance per claim so one source (OBF, PETA, Leaping Bunny, Cosmos...) can be
// ingested again without losing the others; empty array means the claim is currently false.

export type BrandCertificationSource =
  | 'manual'
  | 'obf'
  | 'peta'
  | 'leaping-bunny'
  | 'cosmos'
  | 'ecocert'
  | 'nature-progres'
  | 'vegan-society'

export interface BrandCertificationSources {
  vegan?: BrandCertificationSource[]
  cruelty_free?: BrandCertificationSource[]
  natural?: BrandCertificationSource[]
}

export const brandCertifications = pgTable('brand_certifications', {
  brandNormalized: text('brand_normalized').primaryKey(),
  brandDisplay: text('brand_display').notNull(),
  isVegan: boolean('is_vegan').notNull().default(false),
  isCrueltyFree: boolean('is_cruelty_free').notNull().default(false),
  isNaturalCertified: boolean('is_natural_certified').notNull().default(false),
  sources: jsonb('sources').$type<BrandCertificationSources>().notNull().default(sql`'{}'::jsonb`),
  notes: text('notes'),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
})

export type BrandCertification = typeof brandCertifications.$inferSelect
export type BrandCertificationInsert = typeof brandCertifications.$inferInsert

export function normalizeBrand(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').toLowerCase()
}
