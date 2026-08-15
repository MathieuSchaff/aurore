// Pure module (no DB / no env imports) so it unit-tests without a database

import type { ProductCategory, ProductKind, ProductTexture } from '@aurore/shared'

import {
  type AutoTagSource,
  buildOrchestratorInput,
  detectAllAutoTags,
  partitionEczemaReview,
} from '../../../features/auto-tagging'
import type { BrandCertificationInsert } from '../../schema/products/brand-certifications'
import {
  type AvoidManualConflict,
  mergeProductTagPairs,
  type SeedProductTagPair,
} from './merge-product-tag-pairs'

// Only the fields the orchestrator reads. Structural, not the seed row type:
// the caller passes allProductData, a test passes two literals. The optional
// ones are declared rather than cast at the read site, so a seed shape that
// stops carrying one fails compilation instead of silently reading undefined
export type PlannedProduct = {
  slug: string
  kind: string
  category: string
  brand: string
  name?: string | null
  description?: string | null
  inci?: string | null
  texture?: ProductTexture | null
}

export type PlannedPercentClaim = {
  productSlug: string
  ingredientSlug?: string | null
  concentrationValue?: string | number | null
  concentrationUnit?: string | null
}

export interface EczemaReviewEntry {
  slug: string
  name: string
  description: string
}

export interface ProductTagPlan {
  pairs: SeedProductTagPair[]
  // Counted before the merge, which is what the two backfill lines report
  autoSecondaryCount: number
  avoidCount: number
  secondaryBySource: Record<AutoTagSource, number>
  avoidBySource: Record<AutoTagSource, number>
  eczemaReviewQueue: EczemaReviewEntry[]
  dupes: number
  conflicts: AvoidManualConflict[]
}

// Brand certifications are inserted later in this same transaction, but the
// auto-tag pass runs in-memory, so build the lookup straight from the curated
// list. The Insert shape has optional booleans (DB defaults), so coerce to
// Select shape so the orchestrator's ReadonlyMap<string, BrandCertification>
// type matches
function buildBrandCertificationMap(rows: readonly BrandCertificationInsert[]) {
  return new Map(
    rows.map((r) => [
      r.brandNormalized,
      {
        brandNormalized: r.brandNormalized,
        brandDisplay: r.brandDisplay,
        isVegan: r.isVegan ?? false,
        isCrueltyFree: r.isCrueltyFree ?? false,
        isNaturalCertified: r.isNaturalCertified ?? false,
        sources: r.sources ?? {},
        notes: r.notes ?? null,
        updatedAt: new Date().toISOString(),
      },
    ])
  )
}

function indexPercentClaimsByProduct(rows: readonly PlannedPercentClaim[]) {
  const percentClaimsByProduct = new Map<
    string,
    {
      ingredientSlug: string
      concentrationValue: number
      concentrationUnit: string
    }[]
  >()
  for (const row of rows) {
    if (!row.ingredientSlug || row.concentrationValue == null || !row.concentrationUnit) continue
    const arr = percentClaimsByProduct.get(row.productSlug) ?? []
    arr.push({
      ingredientSlug: row.ingredientSlug,
      concentrationValue: Number(row.concentrationValue),
      concentrationUnit: row.concentrationUnit,
    })
    percentClaimsByProduct.set(row.productSlug, arr)
  }
  return percentClaimsByProduct
}

// Exhaustive by construction: a new AutoTagSource fails compilation here
// instead of vanishing from the seed stats
const zeroBySource = (): Record<AutoTagSource, number> => ({
  'algo-derm': 0,
  'actif-class': 0,
  kind: 0,
  formula: 0,
  'cross-signal': 0,
  interaction: 0,
  concentration: 0,
  brand: 0,
  'percent-claim': 0,
})

const formatBySource = (counts: Record<AutoTagSource, number>): string =>
  Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([source, n]) => `${source} ${n}`)
    .join(' · ')

export function planProductTagPairs(input: {
  products: readonly PlannedProduct[]
  manual: readonly SeedProductTagPair[]
  percentClaims: readonly PlannedPercentClaim[]
  brandCertifications: readonly BrandCertificationInsert[]
}): ProductTagPlan {
  const brandCertMap = buildBrandCertificationMap(input.brandCertifications)
  const percentClaimsByProduct = indexPercentClaimsByProduct(input.percentClaims)

  // `'cross-signal'` source overlaps between secondary and avoid streams:
  // disambiguate by AutoTagPair.relevance
  const secondaryBySource = zeroBySource()
  const avoidBySource = zeroBySource()
  const autoSecondaryPairs: {
    slug: string
    tagSlug: string
    relevance: 'secondary'
    source: string
  }[] = []
  const avoidPairs: {
    slug: string
    tagSlug: string
    relevance: 'avoid'
    source: string
  }[] = []
  // Sentinel queue: products whose description names atopy under a
  // contraindication. The eczema-atopie tag is withheld (it would invert the
  // claim) and the product is surfaced for manual review at end of run
  // Guards the future import, see partitionEczemaReview
  const eczemaReviewQueue: EczemaReviewEntry[] = []

  // Auto-derive product tags via the shared orchestrator (AUTO_TAG_PASSES, run in
  // order) on every skincare/solaire/bodycare product. Single source of truth
  // shared with `features/auto-tagging/runners/backfill/main.ts`; seed-core
  // followed by a backfill run is a no-op on auto-tag pairs, enforced by
  // `features/auto-tagging/tests/auto-tag-orchestrator-parity.test.ts`
  for (const product of input.products) {
    const { inci, name, description, texture } = product
    // knownConcentrations stays absent at seed time (product_ingredients rows
    // do not exist yet); the backfill run after the seed supplies dose-gated emissions
    const pairs = detectAllAutoTags(
      buildOrchestratorInput(
        {
          inci,
          kind: product.kind as ProductKind,
          category: product.category as ProductCategory,
          brand: product.brand,
          texture: texture ?? null,
          name: name ?? null,
          description: description ?? null,
        },
        { percentClaims: percentClaimsByProduct.get(product.slug) ?? [] }
      ),
      { brandCertifications: brandCertMap }
    )
    const { kept, withheld } = partitionEczemaReview(pairs, description)
    if (withheld) {
      eczemaReviewQueue.push({
        slug: product.slug,
        name: name ?? product.slug,
        description: description ?? '',
      })
    }
    for (const p of kept) {
      if (p.relevance === 'avoid') {
        avoidBySource[p.source] += 1
        avoidPairs.push({
          slug: product.slug,
          tagSlug: p.tagSlug,
          relevance: 'avoid',
          source: p.source,
        })
      } else {
        secondaryBySource[p.source] += 1
        autoSecondaryPairs.push({
          slug: product.slug,
          tagSlug: p.tagSlug,
          relevance: 'secondary',
          source: p.source,
        })
      }
    }
  }

  // Manual wins every collision, same invariant as write.ts (DELETE scoped
  // to rows that are not manual) and backfill classify.ts (!isManual). A diverging auto
  // `avoid` is dropped and reported below: the seed TS is the only home of
  // curation, so a pair silently replaced here is unrecoverable by retags
  const { pairs, conflicts, dupes } = mergeProductTagPairs({
    manual: [...input.manual],
    avoid: avoidPairs,
    auto: autoSecondaryPairs,
  })

  return {
    pairs,
    autoSecondaryCount: autoSecondaryPairs.length,
    avoidCount: avoidPairs.length,
    secondaryBySource,
    avoidBySource,
    eczemaReviewQueue,
    dupes,
    conflicts,
  }
}

export function printProductTagPlan(plan: ProductTagPlan): void {
  if (plan.autoSecondaryCount > 0) {
    console.log(
      `🏷  Backfill auto-tags: +${plan.autoSecondaryCount} pair(s) (${formatBySource(plan.secondaryBySource)})`
    )
  }
  if (plan.avoidCount > 0) {
    console.log(
      `🛡  Backfill avoid: +${plan.avoidCount} pair(s) (${formatBySource(plan.avoidBySource)})`
    )
  }
  if (plan.eczemaReviewQueue.length > 0) {
    console.warn(
      `⚠  eczema-atopie review queue: ${plan.eczemaReviewQueue.length} product(s) name atopy under a contraindication — NOT auto-tagged, review manually:`
    )
    for (const f of plan.eczemaReviewQueue) {
      console.warn(`    • ${f.name} [${f.slug}] — ${f.description.slice(0, 160)}`)
    }
  }
  if (plan.dupes > 0) console.log(`ℹ️  ${plan.dupes} doublon(s) productTags fusionné(s)`)
  if (plan.conflicts.length > 0) {
    console.warn(
      `⚠  ${plan.conflicts.length} 'avoid' auto en conflit avec une curation manuelle — ignorés, à arbitrer :`
    )
    for (const c of plan.conflicts) {
      console.warn(
        `    • ${c.slug} · ${c.tagSlug} (manual ${c.manualRelevance} vs avoid ${c.avoidSource})`
      )
    }
  }
}
