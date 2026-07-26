// Backfill `product_ingredients` from `products.inci` for products that carry an
// INCI string but have zero ingredient links today. Reads the `inci` column only;
// no network, no scraping, never creates ingredient rows. Idempotent: the eligible
// query re-selects whatever is unlinked, so it is safe to re-run after a db reset.
//
// Writes reconcile, they never replace: existing rows are left untouched, only the
// missing links are inserted, and a link the recompute no longer derives is deleted
// ONLY when `product_ingredients.source` says the linker wrote it. Everything else is
// kept and reported for manual arbitration instead of being silently rewritten.
//
// Pipeline per token: aurore inci-index direct hit first; on a miss, resolve through
// algo-derm's alias index (+ botanical strip) to canonical evidence, then bridge that
// evidence back onto an aurore slug. Order follows the INCI order (concentration desc)
// and excipients are dropped. No count cap: INCI order is concentration order, so a cap
// keeps the structuring agents at the top of the list and drops the actives dosed below
// them, measured at 2079 evicted links, mostly hyaluronates, ceramides and centella.
//
// Usage (dry-run by default):
//   bun run backend/src/db/seed/inci/link-ingredients/main.ts            # dry-run report
//   bun run backend/src/db/seed/inci/link-ingredients/main.ts --write    # apply inserts
//   bun run backend/src/db/seed/inci/link-ingredients/main.ts --slug <s> # single product
//   bun run backend/src/db/seed/inci/link-ingredients/main.ts --relink   # every product with INCI
//   LIMIT=200 bun run .../main.ts                                        # cap product count (dev)

import { normalize, splitINCI } from 'algo-derm'
import { buildAliasIndex, MERGED_EVIDENCE_DB, stripBotanicalParts } from 'algo-derm/engine'
import { and, eq, inArray, isNotNull, isNull, sql } from 'drizzle-orm'

import { parseIntEnv, parseWriteSlugArgs } from '../../../../features/auto-tagging/runners/cli-args'
import { addManyIngredientsToProduct } from '../../../../features/products/product-ingredients/product-ingredients.service'
import { freqTable } from '../../../../lib/report'
import type { Transaction } from '../../../index'
import { withAdminRls } from '../../../rls'
import { ingredients, productIngredients, products } from '../../../schema'
import { INGREDIENT_SLUGS } from '../../data/ingredients/ingredient-slugs'
import { FILLER_SLUGS } from '../../data/ingredients/skincare/seed-dermo-profiles-fillers'
import { fetchIdMaps } from '../../utils/id-maps'
import {
  buildExcipientSlugs,
  buildInciIndex,
  buildSlugDomainMap,
  EXCIPIENT_BLOCKLIST,
  foldScraperDelimiters,
  getDomainAllowlist,
  normalizeInciToken,
  stripInciArtefacts,
} from '../index'
import { bridgeEvidenceToSlug, buildSlugByHumanized } from './bridge'
import { type CurrentLink, planReconcile } from './reconcile'

const { write: WRITE, slug: SLUG_ARG } = parseWriteSlugArgs()
// Corpus re-link: recompute every product that has an INCI, not just the unlinked ones.
const RELINK = process.argv.includes('--relink')
const LIMIT = parseIntEnv('LIMIT')
if (LIMIT !== null && LIMIT < 0) throw new Error(`LIMIT must be at least 0, got "${LIMIT}"`)

interface EligibleProduct {
  id: string
  slug: string
  inci: string | null
  category: string
}

interface ComputeResult {
  slugs: string[]
  unbridged: string[]
  blocked: string[]
  uppercaseMegaTokens: string[]
  nonUppercaseMegaTokens: string[]
}

const aliasIndex = buildAliasIndex(MERGED_EVIDENCE_DB)
const inciIndex = buildInciIndex()
const slugByHumanized = buildSlugByHumanized(Object.values(INGREDIENT_SLUGS))
// Full slug → domain map (not just inci-indexed slugs) so a humanised-word-bridged slug
// gets the same category filter as a direct hit. See computeLinks domain guard below.
const slugToDomain = buildSlugDomainMap()

// Drop resolved slugs that are fillers/excipients, whichever raw token produced them.
// Union of the is_filler taxonomy (FILLER_SLUGS) and slugs reachable from EXCIPIENT_BLOCKLIST
// tokens. Checked on the RESOLVED slug so a non-blocklisted synonym that bridges to an excipient
// (e.g. `Gomme Xanthane` → xanthan-gum) is caught. resolveToken's raw-token check only sees
// literal blocklist strings.
const blockedSlugs = new Set<string>([...FILLER_SLUGS, ...buildExcipientSlugs()])

// A token resolves to an aurore slug, or to algo-derm evidence that bridges to no aurore
// slug (unbridged), or to nothing (null). Discriminated so a bridge miss can
// never masquerade as an empty-string slug.
type Resolved = { kind: 'slug'; slug: string } | { kind: 'unbridged' }

// DB-backed fallback: algo-derm's `evidence.inci` is exactly what backfill-canonical-key.ts
// stores in `ingredients.canonical_key`, so a bridge miss can still land on an aurore slug
// whose only link to this substance is that shared identity (the humanised bridge misses
// `-hair` shadows and FR slugs: `zinc oxyde` is not `zinc oxide`). The category domain guard in
// computeLinks still filters the resolved slug, so a mismatch drops instead of mis-linking.
function resolveToken(raw: string, canonicalKeyToSlug: Map<string, string>): Resolved | null {
  const normAurore = normalizeInciToken(raw)
  if (!normAurore || EXCIPIENT_BLOCKLIST.has(normAurore)) return null

  const direct = inciIndex.get(normAurore)
  if (direct) return { kind: 'slug', slug: direct.slug }

  // algo-derm's normalize keeps bracket contents as words (`zinc oxide [nano]` → `zinc oxide
  // nano`), so the artefacts have to go before it too, not only inside normalizeInciToken.
  const normAd = normalize(stripInciArtefacts(raw))
  let evidence = aliasIndex.get(normAd)
  if (!evidence) {
    const stripped = stripBotanicalParts(normAd)
    if (stripped) evidence = aliasIndex.get(stripped)
  }
  if (!evidence) return null

  const bridged = bridgeEvidenceToSlug(evidence, inciIndex, slugByHumanized)
  if (bridged) return { kind: 'slug', slug: bridged }

  const byCanonical = canonicalKeyToSlug.get(evidence.inci)
  if (byCanonical) return { kind: 'slug', slug: byCanonical }

  return { kind: 'unbridged' }
}

// A single "token" carrying this many words is far past the longest real INCI name
// (~6 words). The string most likely lost its separators upstream. Uppercase share
// splits glued INCI (`AQUA CYCLOPENTASILOXANE …`) from French prose/nutrition text
// (descriptions, supplement composition), which is expected non-INCI content.
const SUSPECT_TOKEN_WORDS = 8

function isUppercaseDominant(s: string): boolean {
  const letters = s.replace(/[^A-Za-zÀ-ÿ]/g, '')
  if (letters.length === 0) return false
  const upper = letters.replace(/[^A-ZÀ-Þ]/g, '')
  return upper.length / letters.length >= 0.6
}

function computeLinks(
  inci: string,
  category: string,
  canonicalKeyToSlug: Map<string, string>,
  canonicalKeyBySlug: Map<string, string>
): ComputeResult {
  const allowed = getDomainAllowlist(category)
  // splitINCI only splits on commas (+ protects decimals). Fold scraper artifacts first.
  // Supplement text keeps list separators because its dashes and semicolons separate doses.
  const tokens = splitINCI(
    foldScraperDelimiters(inci, { foldListSeparators: category !== 'complement' })
  )

  const seen = new Set<string>()
  // A declaration often names one substance twice (`Sodium Hyaluronate` beside `Hyaluronic
  // Acid`). They are separate `ingredients` rows sharing one canonical_key, which is the
  // project's identity for an ingredient, so linking both shows the same thing twice on the
  // sheet. INCI order is concentration order: the first spelling wins.
  const seenIdentities = new Set<string>()
  const slugs: string[] = []
  const unbridged: string[] = []
  const blocked: string[] = []
  const uppercaseMegaTokens: string[] = []
  const nonUppercaseMegaTokens: string[] = []

  for (const raw of tokens) {
    const resolved = resolveToken(raw, canonicalKeyToSlug)
    if (!resolved) {
      const trimmed = raw.trim()
      if (trimmed.split(/\s+/).length >= SUSPECT_TOKEN_WORDS) {
        ;(isUppercaseDominant(trimmed) ? uppercaseMegaTokens : nonUppercaseMegaTokens).push(trimmed)
      }
      continue
    }
    if (resolved.kind === 'unbridged') {
      unbridged.push(raw.trim())
      continue
    }
    const { slug } = resolved
    // F2: drop filler/excipient by resolved slug, whichever raw token produced it.
    if (blockedSlugs.has(slug)) {
      blocked.push(slug)
      continue
    }
    if (seen.has(slug)) continue
    const domain = slugToDomain.get(slug)
    // Fail closed: drop a slug whose domain is unknown or foreign to the product category.
    if (allowed && (!domain || !allowed.has(domain))) continue
    const identity = canonicalKeyBySlug.get(slug)
    if (identity) {
      if (seenIdentities.has(identity)) continue
      seenIdentities.add(identity)
    }
    seen.add(slug)
    slugs.push(slug)
  }

  return { slugs, unbridged, blocked, uppercaseMegaTokens, nonUppercaseMegaTokens }
}

async function readEligible(tx: Transaction): Promise<EligibleProduct[]> {
  if (SLUG_ARG) {
    // --slug: load unconditionally (re-link override), ignore the 0-link filter.
    return tx
      .select({
        id: products.id,
        slug: products.slug,
        inci: products.inci,
        category: products.category,
      })
      .from(products)
      .where(eq(products.slug, SLUG_ARG))
  }

  if (RELINK) {
    const all = await tx
      .select({
        id: products.id,
        slug: products.slug,
        inci: products.inci,
        category: products.category,
      })
      .from(products)
      .where(and(isNotNull(products.inci), sql`btrim(${products.inci}) <> ''`))
    return LIMIT === null ? all : all.slice(0, LIMIT)
  }

  const rows = await tx
    .select({
      id: products.id,
      slug: products.slug,
      inci: products.inci,
      category: products.category,
    })
    .from(products)
    .leftJoin(productIngredients, eq(productIngredients.productId, products.id))
    .where(
      and(
        isNotNull(products.inci),
        sql`btrim(${products.inci}) <> ''`,
        isNull(productIngredients.productId)
      )
    )

  return LIMIT === null ? rows : rows.slice(0, LIMIT)
}

// Thrown to roll back the read-only dry-run transaction so nothing persists.
class DryRunRollback extends Error {}

async function readCurrentLinks(
  tx: Transaction,
  productIds: string[]
): Promise<Map<string, CurrentLink[]>> {
  if (productIds.length === 0) return new Map()
  const rows = await tx
    .select({
      id: productIngredients.id,
      productId: productIngredients.productId,
      slug: ingredients.slug,
      canonicalKey: ingredients.canonicalKey,
      value: productIngredients.concentrationValue,
      unit: productIngredients.concentrationUnit,
      per: productIngredients.concentrationPer,
      notes: productIngredients.notes,
      source: productIngredients.source,
    })
    .from(productIngredients)
    .innerJoin(ingredients, eq(ingredients.id, productIngredients.ingredientId))
    .where(inArray(productIngredients.productId, productIds))

  const byProduct = new Map<string, CurrentLink[]>()
  for (const r of rows) {
    // `source` is the real signal. The concentration/notes test stays as a second chance for
    // rows written before the column existed, where every link was backfilled as `linker`.
    const curated =
      r.source === 'manual' ||
      r.value !== null ||
      r.unit !== null ||
      r.per !== null ||
      (r.notes?.trim() ?? '') !== ''
    const list = byProduct.get(r.productId)
    const link: CurrentLink = { id: r.id, slug: r.slug, canonicalKey: r.canonicalKey, curated }
    if (list) list.push(link)
    else byProduct.set(r.productId, [link])
  }
  return byProduct
}

// Bucket observed signals, not assumed causes. Every bucket keeps samples for review.
type ZeroBucket =
  | 'uppercase-mega-token'
  | 'non-uppercase-mega-token'
  | 'resolved-but-unbridged'
  | 'blocked-only'
  | 'nothing-recognized'
  | 'no-inci'

function classifyZeroLink(r: ComputeResult): ZeroBucket {
  if (r.uppercaseMegaTokens.length > 0) return 'uppercase-mega-token'
  if (r.nonUppercaseMegaTokens.length > 0) return 'non-uppercase-mega-token'
  if (r.unbridged.length > 0) return 'resolved-but-unbridged'
  if (r.blocked.length > 0) return 'blocked-only'
  return 'nothing-recognized'
}

interface RunStats {
  withLinks: number
  zeroLinks: number
  totalPairs: number
  removedRows: number
  keptCurated: number
  untouchedNoTarget: number
  changedProducts: number
  aliasConflicts: number
  missingId: number
  slugFreq: Map<string, number>
  unbridgedFreq: Map<string, number>
  blockedFreq: Map<string, number>
  removedFreq: Map<string, number>
  keptCuratedSamples: string[]
  aliasConflictSamples: string[]
  zeroBuckets: Map<ZeroBucket, string[]>
}

const ZERO_BUCKET_LABELS: Record<ZeroBucket, string> = {
  'uppercase-mega-token': 'uppercase mega-token (possible missing separators, review)',
  'non-uppercase-mega-token': 'non-uppercase mega-token (possible prose or malformed INCI, review)',
  'resolved-but-unbridged': 'resolved by algo-derm but missing an aurore bridge (review)',
  'blocked-only': 'all resolved slugs are known fillers/excipients',
  'nothing-recognized': 'nothing recognized (obscure botanicals or index gap, review)',
  'no-inci': 'no INCI on the requested product',
}

function printReport(s: RunStats): void {
  console.log('Summary')
  console.table({
    'products ≥1 link': s.withLinks,
    'products 0 link': s.zeroLinks,
    'products changed': s.changedProducts,
    'links to insert': s.totalPairs,
    'links to delete': s.removedRows,
    'human links kept (stale but owned)': s.keptCurated,
    'inserts held back (same substance already linked)': s.aliasConflicts,
    'products left alone (nothing derived)': s.untouchedNoTarget,
    ...(s.missingId > 0 ? { 'slugs w/o id row (dropped)': s.missingId } : {}),
  })

  console.log('top 10 linked slugs')
  const topLinked = freqTable(s.slugFreq, 10, 'slug')
  if (topLinked.length > 0) console.table(topLinked)

  // Unbridged tokens should be excipients algo-derm knows without an aurore
  // row (1,2-hexanediol, fatty esters, CI colours). Actives here = a bridge gap → investigate.
  console.log('top 20 resolved-but-unbridged tokens (expect excipients, not actives)')
  const topUnbridged = freqTable(s.unbridgedFreq, 20, 'token')
  if (topUnbridged.length > 0) console.table(topUnbridged)

  console.log('top 15 slugs dropped as filler/excipient (F2 slug-level block)')
  const topBlocked = freqTable(s.blockedFreq, 15, 'slug')
  if (topBlocked.length > 0) console.table(topBlocked)

  console.log('top 15 slugs the recompute drops (uncurated rows only)')
  const topRemoved = freqTable(s.removedFreq, 15, 'slug')
  if (topRemoved.length > 0) console.table(topRemoved)

  if (s.keptCurated > 0) {
    console.log(`human links kept despite the recompute (${s.keptCurated}), sample`)
    for (const line of s.keptCuratedSamples) console.log(`  ${line}`)
  }

  // The derived slug and the kept row are the same substance under one canonical_key. Inserting
  // both puts the ingredient on the sheet twice, so the insert waits for a human call.
  if (s.aliasConflicts > 0) {
    console.log(`inserts held back on an already-linked substance (${s.aliasConflicts}), sample`)
    for (const line of s.aliasConflictSamples) console.log(`  ${line}`)
  }

  console.log('0-link products by cause')
  for (const [bucket, slugs] of s.zeroBuckets) {
    console.log(`  ${slugs.length}\t${ZERO_BUCKET_LABELS[bucket]}`)
    if (slugs.length > 0) console.log(`  \tsample: ${slugs.slice(0, 8).join(', ')}`)
  }
}

async function main() {
  console.log(
    `\n🔗 INCI → product_ingredients linking (${WRITE ? 'WRITE' : 'DRY-RUN'})` +
      (SLUG_ARG ? ` · slug=${SLUG_ARG}` : RELINK ? ' · relink=all' : '') +
      (LIMIT !== null ? ` · limit=${LIMIT}` : '')
  )
  console.log(`   alias index: ${aliasIndex.size} keys · inci index: ${inciIndex.size} tokens\n`)

  await withAdminRls(async (tx) => {
    const { ingredientSlugToId } = await fetchIdMaps(tx)

    // canonical_key → slug fallback map. Prefer a non `-hair` slug so a skincare product
    // lands on the bare slug instead of its haircare shadow (both share the key).
    const keyRows = await tx
      .select({ slug: ingredients.slug, key: ingredients.canonicalKey })
      .from(ingredients)
      .where(isNotNull(ingredients.canonicalKey))
    const canonicalKeyToSlug = new Map<string, string>()
    // Reverse direction: the identity of a slug, used to keep one substance off a product twice.
    const canonicalKeyBySlug = new Map<string, string>()
    for (const { slug, key } of keyRows) {
      if (!key) continue
      canonicalKeyBySlug.set(slug, key)
      const cur = canonicalKeyToSlug.get(key)
      if (!cur || (cur.endsWith('-hair') && !slug.endsWith('-hair'))) {
        canonicalKeyToSlug.set(key, slug)
      }
    }
    console.log(`   canonical_key fallback map: ${canonicalKeyToSlug.size} keys`)

    const eligible = await readEligible(tx)
    console.log(`   eligible products: ${eligible.length}\n`)

    const currentLinks = await readCurrentLinks(
      tx,
      eligible.map((p) => p.id)
    )

    let withLinks = 0
    let zeroLinks = 0
    let totalPairs = 0
    let removedRows = 0
    let keptCurated = 0
    let untouchedNoTarget = 0
    let changedProducts = 0
    let aliasConflicts = 0
    const removedFreq = new Map<string, number>()
    const keptCuratedSamples: string[] = []
    const aliasConflictSamples: string[] = []
    const slugFreq = new Map<string, number>()
    const unbridgedFreq = new Map<string, number>()
    const blockedFreq = new Map<string, number>()
    const zeroBuckets = new Map<ZeroBucket, string[]>([
      ['uppercase-mega-token', []],
      ['non-uppercase-mega-token', []],
      ['resolved-but-unbridged', []],
      ['blocked-only', []],
      ['nothing-recognized', []],
      ['no-inci', []],
    ])
    let missingId = 0

    for (const product of eligible) {
      const current = currentLinks.get(product.id) ?? []
      if (!product.inci) {
        zeroLinks++
        zeroBuckets.get('no-inci')?.push(product.slug)
        continue
      }
      const computed = computeLinks(
        product.inci,
        product.category,
        canonicalKeyToSlug,
        canonicalKeyBySlug
      )
      const { slugs, unbridged, blocked } = computed
      for (const u of unbridged) {
        unbridgedFreq.set(u, (unbridgedFreq.get(u) ?? 0) + 1)
      }
      for (const b of blocked) {
        blockedFreq.set(b, (blockedFreq.get(b) ?? 0) + 1)
      }

      const targetIds = new Map<string, string>()
      for (const slug of slugs) {
        const ingredientId = ingredientSlugToId.get(slug)
        if (!ingredientId) {
          missingId++
          continue
        }
        slugFreq.set(slug, (slugFreq.get(slug) ?? 0) + 1)
        targetIds.set(slug, ingredientId)
      }

      if (targetIds.size === 0) {
        zeroLinks++
        // Resolved slugs without an id row are seed↔DB drift: counted by missingId,
        // not a linking-cause bucket.
        if (slugs.length === 0) zeroBuckets.get(classifyZeroLink(computed))?.push(product.slug)
        // Deriving nothing means the parser failed on this INCI (prose, glued tokens), not
        // that the existing links are wrong. Never let an empty target delete anything.
        if (current.length > 0) untouchedNoTarget++
        continue
      }
      withLinks++

      const plan = planReconcile(current, targetIds.keys(), canonicalKeyBySlug)
      const pairs = plan.add.map((slug) => ({
        productId: product.id,
        // planReconcile only ever returns slugs taken from targetIds.
        ingredientId: targetIds.get(slug) as string,
        source: 'linker' as const,
      }))
      const toRemove = plan.remove
      for (const c of plan.remove) {
        removedFreq.set(c.slug, (removedFreq.get(c.slug) ?? 0) + 1)
      }
      for (const c of plan.keptCurated) {
        keptCurated++
        if (keptCuratedSamples.length < 20) keptCuratedSamples.push(`${product.slug} · ${c.slug}`)
      }
      for (const { slug, heldBy } of plan.aliasConflicts) {
        aliasConflicts++
        if (aliasConflictSamples.length < 20)
          aliasConflictSamples.push(`${product.slug} · ${slug} shadowed by ${heldBy.slug}`)
      }

      totalPairs += pairs.length
      removedRows += toRemove.length
      if (pairs.length > 0 || toRemove.length > 0) changedProducts++

      if (WRITE) {
        if (pairs.length > 0) await addManyIngredientsToProduct(tx, pairs)
        if (toRemove.length > 0) {
          await tx.delete(productIngredients).where(
            inArray(
              productIngredients.id,
              toRemove.map((c) => c.id)
            )
          )
        }
      }
    }

    printReport({
      withLinks,
      zeroLinks,
      totalPairs,
      removedRows,
      keptCurated,
      untouchedNoTarget,
      changedProducts,
      aliasConflicts,
      missingId,
      slugFreq,
      unbridgedFreq,
      blockedFreq,
      removedFreq,
      keptCuratedSamples,
      aliasConflictSamples,
      zeroBuckets,
    })

    if (!WRITE) {
      console.log(
        `\n  Would insert ${totalPairs} rows and delete ${removedRows} on ${changedProducts} products. Re-run with --write.\n`
      )
      // Roll back the read-only transaction so nothing persists.
      throw new DryRunRollback()
    }
    console.log(
      `\n  Reconciled ${changedProducts} products: +${totalPairs} / -${removedRows} rows (${keptCurated} human links kept).\n`
    )
  }).catch((err) => {
    if (err instanceof DryRunRollback) return
    throw err
  })
}

await main()
