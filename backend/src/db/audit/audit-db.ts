import {
  DOMAIN_NEUTRAL_PRODUCT_TAG_TYPES,
  DOMAIN_PRODUCT_FILTER_CATEGORIES,
  PRODUCT_CATEGORY_TO_DOMAIN_TAB,
} from '@aurore/shared'

import { and, count, eq, isNull, ne, notInArray, or, sql } from 'drizzle-orm'

import { AUTO_TAG_ELIGIBLE_CATEGORIES } from '../../features/auto-tagging/lib/eligibility'
import type { DatabaseTransaction } from '..'
import { withAdminRls } from '../rls'
import {
  ingredientDermoProfiles,
  ingredients,
  productIngredients,
  products,
  productTagLinks,
  productTagTypes,
} from '../schema'

// 'error' fails the run (exit 1): genuine corruption the DB does not enforce.
// 'info' is reported but never fails: accepted coverage gaps (missing data ≠ broken data).
type Severity = 'error' | 'info'
type Finding = { description: string }
type CheckResult = { name: string; severity: Severity; findings: Finding[] }
type Checker = (db: DatabaseTransaction) => Promise<CheckResult>

async function checkTagProductDomainConsistency(db: DatabaseTransaction): Promise<CheckResult> {
  const rows = await db
    .select({
      productSlug: products.slug,
      productCategory: products.category,
      tagSlug: productTagTypes.slug,
      tagType: productTagTypes.tagType,
    })
    .from(productTagLinks)
    .innerJoin(products, eq(productTagLinks.productId, products.id))
    .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))

  const findings: Finding[] = []
  for (const row of rows) {
    const domain = PRODUCT_CATEGORY_TO_DOMAIN_TAB[row.productCategory]
    if (!domain) {
      findings.push({
        description: `unknown product.category="${row.productCategory}" on product ${row.productSlug}`,
      })
      continue
    }
    const validTagTypes = DOMAIN_PRODUCT_FILTER_CATEGORIES[domain] as readonly string[]
    if (
      !validTagTypes.includes(row.tagType) &&
      !DOMAIN_NEUTRAL_PRODUCT_TAG_TYPES.includes(row.tagType)
    ) {
      findings.push({
        description: `${row.productSlug} (${row.productCategory}/${domain}) → tag "${row.tagSlug}" type="${row.tagType}" not in [${validTagTypes.join(', ')}]`,
      })
    }
  }
  return { name: 'tag-product-domain-consistency', severity: 'error', findings }
}

// Auto-tags surviving on products whose category left the auto-tag corpus. Error-level:
// every sweeping runner selects via fetchEligibleProducts(), so these links are unreachable
// by reconcile/purge-stale and stay stale forever. Raw-SQL recategorisation (`.db-fixes`)
// bypasses the API purge, so this check is the only thing that catches the next one.
// Fix: `WRITE=1 just autotag-purge-off-corpus`.
async function checkAutoTagsOutsideCorpus(db: DatabaseTransaction): Promise<CheckResult> {
  const rows = await db
    .select({
      productSlug: products.slug,
      productCategory: products.category,
      tagSlug: productTagTypes.slug,
    })
    .from(productTagLinks)
    .innerJoin(products, eq(productTagLinks.productId, products.id))
    .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
    .where(
      and(
        ne(productTagLinks.source, 'manual'),
        notInArray(products.category, [...AUTO_TAG_ELIGIBLE_CATEGORIES])
      )
    )

  const findings: Finding[] = rows.map((r) => ({
    description: `${r.productSlug} (${r.productCategory}) → auto-tag "${r.tagSlug}"`,
  }))
  return { name: 'auto-tags-outside-eligible-corpus', severity: 'error', findings }
}

// Visible products with no image. Accepted gap (image acquisition is a separate
// domain), so info-only. Surfaced by brand to spot which brands need a fetch pass.
async function checkImageCoverage(db: DatabaseTransaction): Promise<CheckResult> {
  const rows = await db
    .select({ brand: products.brand, n: count() })
    .from(products)
    .where(
      and(
        eq(products.moderationStatus, 'visible'),
        or(isNull(products.imageUrl), eq(products.imageUrl, ''))
      )
    )
    .groupBy(products.brand)
    .orderBy(sql`count(*) desc`)

  const findings: Finding[] = rows.map((r) => ({ description: `${r.brand}: ${r.n}` }))
  if (rows.length > 0) {
    const total = rows.reduce((s, r) => s + Number(r.n), 0)
    findings.unshift({
      description: `${total} visible products without image across ${rows.length} brands`,
    })
  }
  return { name: 'image-coverage', severity: 'info', findings }
}

// Commas also occur in nutrition tables and reviews, so these buckets cannot prove a linking gap
async function checkProductsWithoutIngredients(db: DatabaseTransaction): Promise<CheckResult> {
  const rows = await db
    .select({
      slug: products.slug,
      brand: products.brand,
      inci: products.inci,
      category: products.category,
    })
    .from(products)
    .leftJoin(productIngredients, eq(productIngredients.productId, products.id))
    .where(and(eq(products.moderationStatus, 'visible'), isNull(productIngredients.productId)))

  let noInci = 0
  let commaless = 0
  const commaSeparatedUnlinked: Finding[] = []
  const byCategory = new Map<string, number>()
  for (const r of rows) {
    const inci = r.inci?.trim() ?? ''
    if (!inci) noInci++
    else if (!inci.includes(',')) commaless++
    else {
      commaSeparatedUnlinked.push({ description: `${r.slug} (${r.brand}; ${r.category})` })
      byCategory.set(r.category, (byCategory.get(r.category) ?? 0) + 1)
    }
  }

  const categories = [...byCategory]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([category, count]) => `${category}: ${count}`)
    .join(', ')
  const findings: Finding[] = commaSeparatedUnlinked
  findings.unshift(
    { description: `${noInci} with empty INCI input and 0 links` },
    {
      description: `${commaless} with nonempty INCI input without a comma and 0 links`,
    },
    {
      description: `${commaSeparatedUnlinked.length} with comma-containing input and 0 links (format heuristic, not INCI validation; ${categories || 'no products'})`,
    }
  )
  return { name: 'products-without-ingredients', severity: 'info', findings }
}

// Visible products with zero tag links (invisible to the catalogue filters).
async function checkProductsWithoutTags(db: DatabaseTransaction): Promise<CheckResult> {
  const rows = await db
    .select({ slug: products.slug, brand: products.brand })
    .from(products)
    .leftJoin(productTagLinks, eq(productTagLinks.productId, products.id))
    .where(and(eq(products.moderationStatus, 'visible'), isNull(productTagLinks.productId)))

  const findings: Finding[] = rows.map((r) => ({ description: `${r.slug} (${r.brand})` }))
  return { name: 'products-without-tags', severity: 'info', findings }
}

// Ingredients used by ≥1 product but lacking a dermo profile row. The dermo SCORE
// comes from algo-derm at runtime, not this table. The only consumer reads `is_filler`
// (user-products/dermo-signal), and a missing row defaults to not being a filler. So this is a
// filler-classification coverage gap, not a scoring blind spot.
async function checkIngredientsWithoutDermoProfile(db: DatabaseTransaction): Promise<CheckResult> {
  const rows = await db
    .select({ slug: ingredients.slug })
    .from(ingredients)
    .innerJoin(productIngredients, eq(productIngredients.ingredientId, ingredients.id))
    .leftJoin(ingredientDermoProfiles, eq(ingredientDermoProfiles.ingredientId, ingredients.id))
    .where(isNull(ingredientDermoProfiles.ingredientId))
    .groupBy(ingredients.slug)

  const findings: Finding[] = rows.map((r) => ({ description: r.slug }))
  return { name: 'ingredients-without-dermo-profile', severity: 'info', findings }
}

const checkers: Checker[] = [
  checkTagProductDomainConsistency,
  checkAutoTagsOutsideCorpus,
  checkImageCoverage,
  checkProductsWithoutIngredients,
  checkProductsWithoutTags,
  checkIngredientsWithoutDermoProfile,
]

// File output wants every finding; interactive console stays capped.
const MAX_LINES_PER_CHECKER = process.env.AUDIT_DB_FULL ? Number.POSITIVE_INFINITY : 30

async function main() {
  const results = await withAdminRls((tx) => Promise.all(checkers.map((c) => c(tx))))
  let errorViolations = 0
  let failedCheckers = 0

  for (const r of results) {
    if (r.findings.length === 0) {
      console.log(`✓ ${r.name}`)
      continue
    }
    if (r.severity === 'info') {
      console.log(`ℹ ${r.name} (${r.findings.length})`)
    } else {
      failedCheckers += 1
      errorViolations += r.findings.length
      console.log(`✗ ${r.name} (${r.findings.length} violations)`)
    }
    for (const f of r.findings.slice(0, MAX_LINES_PER_CHECKER)) {
      console.log(`  - ${f.description}`)
    }
    if (r.findings.length > MAX_LINES_PER_CHECKER) {
      console.log(`  … and ${r.findings.length - MAX_LINES_PER_CHECKER} more`)
    }
  }

  if (errorViolations > 0) {
    console.error(
      `\nFAILED: ${errorViolations} violation(s) across ${failedCheckers} error checker(s)`
    )
    process.exit(1)
  }
  console.log(`\n✓ All ${checkers.length} checker(s) ran; no error-level violations`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
