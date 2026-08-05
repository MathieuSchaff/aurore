// Backfill `product_ingredients` from `products.inci`. Reads that column only: no network,
// no scraping, and it never creates ingredient rows. Dry-run unless `--write`.
// Idempotent — the eligible query re-selects whatever is unlinked, so a re-run is safe.
// Flags are documented on the `link-ingredients` just recipe.

import { normalize, splitINCI } from 'algo-derm'
import {
  buildAliasIndex,
  lookupIngredient,
  MERGED_EVIDENCE_DB,
  stripBotanicalParts,
} from 'algo-derm/engine'
import { and, asc, eq, inArray, isNotNull, isNull, sql } from 'drizzle-orm'

import { parseIntEnv, parseWriteSlugArgs } from '../../../../features/auto-tagging/runners/cli-args'
import { addManyIngredientsToProduct } from '../../../../features/products/product-ingredients/product-ingredients.service'
import { freqTable } from '../../../../lib/report'
import type { DatabaseTransaction } from '../../../index'
import { withAdminRls } from '../../../rls'
import { ingredients, productIngredients, products } from '../../../schema'
import { INGREDIENT_SLUGS } from '../../data/ingredients/ingredient-slugs'
import { FILLER_SLUGS } from '../../data/ingredients/skincare/seed-dermo-profiles-fillers'
import {
  buildInciIndex,
  buildNonDiscriminantSlugs,
  buildSlugDomainMap,
  foldScraperDelimiters,
  getDomainAllowlist,
  NON_DISCRIMINANT_TOKENS,
  normalizeInciToken,
  stripInciArtefacts,
} from '../index'
import { bridgeEvidenceToSlug, buildSlugByHumanized } from './bridge'
import { type CurrentLink, planReconcile, type ReconcilePlan } from './reconcile'

const { write: WRITE, slug: SLUG_ARG } = parseWriteSlugArgs()
// Corpus re-link: recompute every product that has an INCI, not just the unlinked ones.
const RELINK = process.argv.includes('--relink')
const LIMIT = parseIntEnv('LIMIT')
if (LIMIT !== null && LIMIT < 0) throw new Error(`LIMIT must be at least 0, got "${LIMIT}"`)

function parseOnlySlugs(raw = process.env.ONLY_SLUGS): Set<string> | null {
  if (raw === undefined || raw.trim() === '') return null
  const slugs = raw
    .split(',')
    .map((slug) => slug.trim())
    .filter(Boolean)
  if (slugs.length === 0) return null
  for (const slug of slugs) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`ONLY_SLUGS must be comma-separated slugs, got "${slug}"`)
    }
  }
  return new Set(slugs)
}

const ONLY_SLUGS = parseOnlySlugs()
if (ONLY_SLUGS && !RELINK) throw new Error('ONLY_SLUGS requires RELINK=1')
if (ONLY_SLUGS && SLUG_ARG) throw new Error('ONLY_SLUGS cannot be combined with SLUG')

export interface EligibleProduct {
  id: string
  slug: string
  inci: string | null
  category: string
}

export interface CorpusSnapshot {
  ingredientRows: Array<{
    id: string
    slug: string
    key: string | null
    type: string | null
  }>
  eligible: EligibleProduct[]
  currentLinks: Map<string, CurrentLink[]>
}

export interface CorpusSnapshotSource {
  load(): Promise<CorpusSnapshot>
}

export interface ComputeResult {
  slugs: string[]
  unbridged: string[]
  blocked: string[]
  /** Resolved and unblocked, but its domain is foreign to the product category. */
  domainDropped: string[]
  collisions: string[]
  uppercaseMegaTokens: string[]
  nonUppercaseMegaTokens: string[]
}

// Lets the local audits ask "what if the excipient list were different?" without copying the
// resolver to parameterise it. Those copies always drift: they miss whatever lands here after
// them. Unset means the real configuration.
export interface ResolverOverrides {
  nonDiscriminantTokens?: ReadonlySet<string>
  blockedSlugs?: ReadonlySet<string>
}

const aliasIndex = buildAliasIndex(MERGED_EVIDENCE_DB)
const inciIndex = buildInciIndex()
const slugByHumanized = buildSlugByHumanized(Object.values(INGREDIENT_SLUGS))
// Full slug-to-domain map (not just inci-indexed slugs) so a humanised-word-bridged slug
// gets the same category filter as a direct hit. See computeLinks domain guard below.
const slugToDomain = buildSlugDomainMap()

// Drop resolved slugs that are fillers or non-discriminant, whichever raw token produced them.
// Union of the is_filler taxonomy (FILLER_SLUGS) and the slugs NON_DISCRIMINANT_TOKENS reaches.
// Checked on the RESOLVED slug so a synonym that bridges onto a listed substance (e.g.
// `Gomme Xanthane` maps to xanthan-gum) is caught. resolveToken's raw-token check only sees
// literal list entries.
const blockedSlugs = new Set<string>([...FILLER_SLUGS, ...buildNonDiscriminantSlugs()])

const GENERIC_FALLBACK_BY_PROPRIETARY_SLUG = new Map([
  ['angiopausine', 'silybum-marianum-fruit-extract'],
  ['comedoclastin', 'silybum-marianum-fruit-extract'],
])

// Parentheses normally carry a non-substantive gloss, so normalizeInciToken folds them away.
// These two strings are deferred on purpose: folding them onto the plain Flower/Bud
// declarations would silently extend the four-product Eugenia Caryophyllus merge to more rows.
// Keep the deferment ahead of both direct matching and the algo-derm bridge.
const DEFERRED_PARENTHESIZED_INCI_TOKENS = new Set([
  'EUGENIA CARYOPHYLLUS (CLOVE) FLOWER EXTRACT',
  'EUGENIA CARYOPHYLLUS (CLOVE) BUD EXTRACT',
])

function normalizeParenthesizedInciToken(raw: string): string {
  return stripInciArtefacts(raw)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
}

// A deferred token resolves to nothing on purpose, so an audit must not count it as a coverage
// gap. The normalisation above is the only way to ask.
export function isDeferredInciToken(raw: string): boolean {
  return DEFERRED_PARENTHESIZED_INCI_TOKENS.has(normalizeParenthesizedInciToken(raw))
}

// A token resolves to an aurore slug, or to algo-derm evidence that bridges to no aurore
// slug (unbridged), or to nothing (null). Discriminated so a bridge miss can
// never masquerade as an empty-string slug.
export type Resolved =
  | { kind: 'slug'; slug: string; viaCanonicalKey?: true }
  | { kind: 'unbridged'; evidenceInci: string }

interface ResolutionCandidate {
  result: Resolved
  identities: Set<string>
  wholeTokenHit: boolean
}

function identitiesOfResolution(
  result: Resolved,
  evidenceInci: string | null,
  canonicalKeyBySlug: Map<string, string>
): Set<string> {
  const identities = new Set<string>()
  if (result.kind === 'slug') {
    const bareSlug = result.slug.replace(/-hair$/, '')
    identities.add(`slug:${bareSlug}`)
    identities.add(`key:${normalize(bareSlug.replace(/-/g, ' '))}`)

    const canonicalKey = canonicalKeyBySlug.get(result.slug)
    if (canonicalKey) identities.add(`key:${normalize(canonicalKey)}`)
  }
  if (evidenceInci) identities.add(`key:${normalize(evidenceInci)}`)
  return identities
}

// Only lookupIngredient's slash fallback needs the all-segments agreement check.
function hasWholeTokenHit(cleaned: string): boolean {
  const normalized = normalize(cleaned)
  if (aliasIndex.has(normalized)) return true
  const stripped = stripBotanicalParts(normalized)
  if (stripped && aliasIndex.has(stripped)) return true

  const dehyphenated = normalized.replace(/-/g, ' ').replace(/\s+/g, ' ').trim()
  return dehyphenated !== normalized && aliasIndex.has(dehyphenated)
}

// DB-backed fallback: algo-derm's `evidence.inci` is exactly what backfill-canonical-key.ts
// stores in `ingredients.canonical_key`, so a bridge miss can still land on an aurore slug
// whose only link to this substance is that shared identity (the humanised bridge misses
// `-hair` shadows and FR slugs: `zinc oxyde` is not `zinc oxide`). The category domain guard in
// computeLinks still filters the resolved slug, so a mismatch drops instead of mis-linking.
function resolveCandidate(
  raw: string,
  canonicalKeyToSlug: Map<string, string>,
  canonicalKeyBySlug: Map<string, string>,
  overrides?: ResolverOverrides
): ResolutionCandidate | null {
  if (isDeferredInciToken(raw)) return null

  const nonDiscriminant = overrides?.nonDiscriminantTokens ?? NON_DISCRIMINANT_TOKENS
  const normAurore = normalizeInciToken(raw)
  if (!normAurore || nonDiscriminant.has(normAurore)) return null

  const direct = inciIndex.get(normAurore)
  if (direct) {
    const result: Resolved = { kind: 'slug', slug: direct.slug }
    return {
      result,
      identities: identitiesOfResolution(result, null, canonicalKeyBySlug),
      wholeTokenHit: true,
    }
  }

  // algo-derm's normalize keeps bracket contents as words (`zinc oxide [nano]` becomes `zinc
  // oxide nano`), so the artefacts have to go before it too, not only inside normalizeInciToken.
  const cleaned = stripInciArtefacts(raw)
  const evidence = lookupIngredient(cleaned, aliasIndex)
  if (!evidence) return null

  const bridgedSlug = bridgeEvidenceToSlug(evidence, inciIndex, slugByHumanized)
  const canonicalSlug = bridgedSlug ? undefined : canonicalKeyToSlug.get(evidence.inci)
  const slug = bridgedSlug ?? canonicalSlug
  const result: Resolved = slug
    ? { kind: 'slug', slug, ...(canonicalSlug ? { viaCanonicalKey: true as const } : {}) }
    : { kind: 'unbridged', evidenceInci: evidence.inci }
  return {
    result,
    identities: identitiesOfResolution(result, evidence.inci, canonicalKeyBySlug),
    wholeTokenHit: hasWholeTokenHit(cleaned),
  }
}

export function resolveToken(
  raw: string,
  canonicalKeyToSlug: Map<string, string>,
  canonicalKeyBySlug: Map<string, string>,
  overrides?: ResolverOverrides
): Resolved | null {
  const candidate = resolveCandidate(raw, canonicalKeyToSlug, canonicalKeyBySlug, overrides)
  if (!candidate) return null

  const cleaned = stripInciArtefacts(raw)
  if (!/[\\/]/.test(cleaned) || candidate.wholeTokenHit) return candidate.result

  // A slash fallback is safe only when every segment resolves to one identity.
  const segments = cleaned
    .split(/[\\/]/)
    .map((segment) => segment.trim())
    .filter(Boolean)
  if (segments.length < 2) return null

  const segmentCandidates = segments.map((segment) =>
    resolveCandidate(segment, canonicalKeyToSlug, canonicalKeyBySlug, overrides)
  )
  if (segmentCandidates.some((segment) => segment === null)) return null

  const completeCandidates = segmentCandidates as ResolutionCandidate[]
  const first = completeCandidates[0]
  if (!first) return null
  const sharedIdentity = [...first.identities].some((identity) =>
    completeCandidates.every((segment) => segment.identities.has(identity))
  )
  return sharedIdentity ? candidate.result : null
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

export function computeLinks(
  inci: string,
  category: string,
  canonicalKeyToSlug: Map<string, string>,
  canonicalKeyBySlug: Map<string, string>,
  slugsByCanonicalKey: Map<string, SiblingRow[]> = new Map(),
  overrides?: ResolverOverrides
): ComputeResult {
  const allowed = getDomainAllowlist(category)
  const excipients = overrides?.blockedSlugs ?? blockedSlugs
  // splitINCI splits on commas (+ protects decimals); its period fallback needs a comma-sparse
  // list, so a real declaration never reaches it. Fold scraper artifacts first.
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
  const domainDropped: string[] = []
  const collisions: string[] = []
  const uppercaseMegaTokens: string[] = []
  const nonUppercaseMegaTokens: string[] = []

  for (const raw of tokens) {
    const resolved = resolveToken(raw, canonicalKeyToSlug, canonicalKeyBySlug, overrides)
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
    // F2: drop filler/excipient by resolved slug, whichever raw token produced it.
    if (excipients.has(resolved.slug)) {
      blocked.push(resolved.slug)
      continue
    }
    const slug = preferDomainSibling(
      resolved.slug,
      category,
      slugsByCanonicalKey,
      canonicalKeyBySlug,
      resolved.viaCanonicalKey === true
    )
    if (!slug) {
      const key = canonicalKeyBySlug.get(resolved.slug)
      if (key && !collisions.includes(key)) collisions.push(key)
      continue
    }
    // Re-checked: the excipient list holds only bare slugs, and the swap can land on one.
    if (excipients.has(slug)) {
      blocked.push(slug)
      continue
    }
    if (seen.has(slug)) continue
    const domain = slugToDomain.get(slug)
    // Fail closed: drop a slug whose domain is unknown or foreign to the product category.
    if (allowed && (!domain || !allowed.has(domain))) {
      domainDropped.push(slug)
      continue
    }
    const identity = canonicalKeyBySlug.get(slug)
    if (identity) {
      if (seenIdentities.has(identity)) continue
      seenIdentities.add(identity)
    }
    seen.add(slug)
    slugs.push(slug)
  }

  // Order follows INCI order (concentration desc); no count cap. Capping would keep
  // structuring agents at the top and drop the actives dosed below them
  // (measured: 2079 evicted links, mostly hyaluronates, ceramides, centella).
  return {
    slugs,
    unbridged,
    blocked,
    domainDropped,
    collisions,
    uppercaseMegaTokens,
    nonUppercaseMegaTokens,
  }
}

async function readEligible(tx: DatabaseTransaction): Promise<EligibleProduct[]> {
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

async function readCurrentLinks(
  tx: DatabaseTransaction,
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

export type SiblingRow = { slug: string; type: string | null }

// Fallback map for callers with no product category in scope (the algo-derm bridge): it can only
// express "prefer the bare slug". The category-aware choice lives in computeLinks.
export function buildCanonicalKeyMaps(
  keyRows: Iterable<{ slug: string; key: string | null; type?: string | null }>
): {
  canonicalKeyToSlug: Map<string, string>
  canonicalKeyBySlug: Map<string, string>
  slugsByCanonicalKey: Map<string, SiblingRow[]>
} {
  const canonicalKeyToSlug = new Map<string, string>()
  const canonicalKeyBySlug = new Map<string, string>()
  const slugsByCanonicalKey = new Map<string, SiblingRow[]>()
  for (const { slug, key, type } of keyRows) {
    if (!key) continue
    canonicalKeyBySlug.set(slug, key)

    const siblings = slugsByCanonicalKey.get(key)
    if (siblings) siblings.push({ slug, type: type ?? null })
    else slugsByCanonicalKey.set(key, [{ slug, type: type ?? null }])

    const cur = canonicalKeyToSlug.get(key)
    if (!cur || (cur.endsWith('-hair') && !slug.endsWith('-hair'))) {
      canonicalKeyToSlug.set(key, slug)
    }
  }
  return { canonicalKeyToSlug, canonicalKeyBySlug, slugsByCanonicalKey }
}

// Which `ingredients.type` a product of this category should land on. Same mapping as
// dermo-score/service.ts:sortPreferred: the sheet and the link have to agree on the domain.
function preferredIngredientType(category: string): string {
  if (category === 'haircare' || category === 'dental') return category
  if (category === 'complement') return 'supplement'
  return 'skincare'
}

// A shadow row (`-hair`, `-dental`) shares its canonical_key with the bare sibling: one substance
// seen from two domains, so a shampoo's Niacinamide belongs on the haircare sheet. Ranks on
// `ingredients.type`, never the slug suffix or the declaring file (19 `-hair` slugs live in the
// skincare file). Swapping keeps the key, and an absent sibling keeps the incumbent.
function preferDomainSibling(
  slug: string,
  category: string,
  slugsByCanonicalKey: Map<string, SiblingRow[]>,
  canonicalKeyBySlug: Map<string, string>,
  refuseAmbiguousFallback: boolean
): string | null {
  const key = canonicalKeyBySlug.get(slug)
  if (!key) return slug
  const siblings = slugsByCanonicalKey.get(key)
  if (!siblings || siblings.length < 2) return slug

  const preferred = preferredIngredientType(category)
  const preferredSiblings = siblings
    .filter((s) => s.type === preferred)
    .sort((a, b) => a.slug.localeCompare(b.slug, 'en'))
  if (preferredSiblings.length > 1 && refuseAmbiguousFallback) return null
  if (siblings.find((s) => s.slug === slug)?.type === preferred) return slug
  const firstPreferred = preferredSiblings[0]
  if (firstPreferred) return firstPreferred.slug

  const incumbentType = siblings.find((s) => s.slug === slug)?.type ?? null
  const fallbackSiblings = siblings.filter((s) => s.type === incumbentType)
  return fallbackSiblings.length > 1 && refuseAmbiguousFallback ? null : slug
}

// Bucket observed signals, not assumed causes. Every bucket keeps samples for review.
type ZeroBucket =
  | 'uppercase-mega-token'
  | 'non-uppercase-mega-token'
  | 'resolved-but-unbridged'
  | 'blocked-only'
  | 'ambiguous-canonical-key'
  | 'nothing-recognized'
  | 'no-inci'

function classifyZeroLink(r: ComputeResult): ZeroBucket {
  if (r.uppercaseMegaTokens.length > 0) return 'uppercase-mega-token'
  if (r.nonUppercaseMegaTokens.length > 0) return 'non-uppercase-mega-token'
  if (r.unbridged.length > 0) return 'resolved-but-unbridged'
  if (r.blocked.length > 0) return 'blocked-only'
  if (r.collisions.length > 0) return 'ambiguous-canonical-key'
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
  collisionFreq: Map<string, number>
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
  'ambiguous-canonical-key': 'ambiguous canonical_key fallback (review)',
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
  // row (1,2-hexanediol, fatty esters, CI colours). Actives here mean a bridge gap, investigate.
  console.log('top 20 resolved-but-unbridged tokens (expect excipients, not actives)')
  const topUnbridged = freqTable(s.unbridgedFreq, 20, 'token')
  if (topUnbridged.length > 0) console.table(topUnbridged)

  console.log('top 15 slugs dropped as filler/excipient (F2 slug-level block)')
  const topBlocked = freqTable(s.blockedFreq, 15, 'slug')
  if (topBlocked.length > 0) console.table(topBlocked)

  console.log('canonical_key collisions left unlinked')
  const topCollisions = freqTable(s.collisionFreq, 20, 'canonical_key')
  if (topCollisions.length > 0) console.table(topCollisions)

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

interface LinkInsert {
  productId: string
  ingredientId: string
  source: 'linker'
}

// One product's write, held until every product is planned so the decision stays out of the
// transaction and stays inspectable in a dry-run.
interface ProductWrite {
  inserts: LinkInsert[]
  removeIds: string[]
}

export function scopeReconcilePlan(
  plan: ReconcilePlan,
  onlySlugs: ReadonlySet<string> | null
): ReconcilePlan {
  if (!onlySlugs) return plan
  return {
    add: plan.add.filter((slug) => onlySlugs.has(slug)),
    remove: [],
    keptCurated: [],
    aliasConflicts: plan.aliasConflicts.filter(({ slug }) => onlySlugs.has(slug)),
  }
}

function planCorpusReconcile(input: {
  eligible: EligibleProduct[]
  currentLinks: Map<string, CurrentLink[]>
  ingredientSlugToId: Map<string, string>
  canonicalKeyToSlug: Map<string, string>
  canonicalKeyBySlug: Map<string, string>
  slugsByCanonicalKey: Map<string, SiblingRow[]>
  onlySlugs: ReadonlySet<string> | null
}): { writes: ProductWrite[]; stats: RunStats } {
  const {
    eligible,
    currentLinks,
    ingredientSlugToId,
    canonicalKeyToSlug,
    canonicalKeyBySlug,
    slugsByCanonicalKey,
    onlySlugs,
  } = input

  const writes: ProductWrite[] = []
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
  const collisionFreq = new Map<string, number>()
  const zeroBuckets = new Map<ZeroBucket, string[]>([
    ['uppercase-mega-token', []],
    ['non-uppercase-mega-token', []],
    ['resolved-but-unbridged', []],
    ['blocked-only', []],
    ['ambiguous-canonical-key', []],
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
      canonicalKeyBySlug,
      slugsByCanonicalKey
    )
    const { unbridged, blocked, collisions } = computed
    const heldGenericSlugs = new Set(
      current
        .filter((link) => link.curated)
        .map((link) => GENERIC_FALLBACK_BY_PROPRIETARY_SLUG.get(link.slug))
        .filter((slug): slug is string => slug !== undefined)
    )
    const slugs = computed.slugs.filter((slug) => !heldGenericSlugs.has(slug))
    if (onlySlugs && !slugs.some((slug) => onlySlugs.has(slug))) continue
    for (const u of unbridged) {
      unbridgedFreq.set(u, (unbridgedFreq.get(u) ?? 0) + 1)
    }
    for (const b of blocked) {
      blockedFreq.set(b, (blockedFreq.get(b) ?? 0) + 1)
    }
    for (const key of collisions) {
      collisionFreq.set(key, (collisionFreq.get(key) ?? 0) + 1)
    }

    const targetIds = new Map<string, string>()
    for (const slug of slugs) {
      if (onlySlugs && !onlySlugs.has(slug)) continue
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
      const collisionKeys = new Set(collisions)
      const collisionLinks = current.filter(
        (link) =>
          !link.curated && link.canonicalKey !== null && collisionKeys.has(link.canonicalKey)
      )
      if (collisionLinks.length > 0) {
        for (const link of collisionLinks) {
          removedFreq.set(link.slug, (removedFreq.get(link.slug) ?? 0) + 1)
        }
        removedRows += collisionLinks.length
        changedProducts++
        writes.push({ inserts: [], removeIds: collisionLinks.map((link) => link.id) })
      } else if (current.length > 0) {
        // A parser miss is not evidence that unrelated existing links are wrong.
        untouchedNoTarget++
      }
      continue
    }
    withLinks++

    // Write policy — what gets inserted, kept or deleted — lives in reconcile.ts,
    // unit-tested separately from this file.
    const plan = scopeReconcilePlan(
      planReconcile(current, targetIds.keys(), canonicalKeyBySlug),
      onlySlugs
    )
    const inserts = plan.add.map((slug) => ({
      productId: product.id,
      // planReconcile only ever returns slugs taken from targetIds.
      ingredientId: targetIds.get(slug) as string,
      source: 'linker' as const,
    }))
    const removeIds = plan.remove.map((c) => c.id)
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

    totalPairs += inserts.length
    removedRows += removeIds.length
    if (inserts.length > 0 || removeIds.length > 0) {
      changedProducts++
      writes.push({ inserts, removeIds })
    }
  }

  return {
    writes,
    stats: {
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
      collisionFreq,
      removedFreq,
      keptCuratedSamples,
      aliasConflictSamples,
      zeroBuckets,
    },
  }
}

function comparableCorpusSnapshot(snapshot: CorpusSnapshot) {
  const ingredientRows = [...snapshot.ingredientRows].sort((a, b) => a.id.localeCompare(b.id))
  const eligible = [...snapshot.eligible].sort((a, b) => a.id.localeCompare(b.id))
  const currentLinks = [...snapshot.currentLinks]
    .flatMap(([productId, links]) => links.map((link) => ({ productId, ...link })))
    .sort((a, b) => a.id.localeCompare(b.id))

  return { ingredientRows, eligible, currentLinks }
}

export function assertCorpusSnapshotUnchanged(
  planned: CorpusSnapshot,
  current: CorpusSnapshot
): void {
  if (
    JSON.stringify(comparableCorpusSnapshot(planned)) !==
    JSON.stringify(comparableCorpusSnapshot(current))
  ) {
    throw new Error('Corpus changed while links were planned; rerun link-ingredients')
  }
}

export async function prepareCorpusReconcile(
  source: CorpusSnapshotSource,
  onlySlugs: ReadonlySet<string> | null = null
) {
  const snapshot = await source.load()
  const ingredientSlugToId = new Map(snapshot.ingredientRows.map((row) => [row.slug, row.id]))
  const { canonicalKeyToSlug, canonicalKeyBySlug, slugsByCanonicalKey } = buildCanonicalKeyMaps(
    snapshot.ingredientRows
  )
  const plan = planCorpusReconcile({
    eligible: snapshot.eligible,
    currentLinks: snapshot.currentLinks,
    ingredientSlugToId,
    canonicalKeyToSlug,
    canonicalKeyBySlug,
    slugsByCanonicalKey,
    onlySlugs,
  })

  return { snapshot, canonicalKeyCount: canonicalKeyToSlug.size, ...plan }
}

async function readCorpusSnapshot(tx: DatabaseTransaction): Promise<CorpusSnapshot> {
  const ingredientRows = await tx
    .select({
      id: ingredients.id,
      slug: ingredients.slug,
      key: ingredients.canonicalKey,
      type: ingredients.type,
    })
    .from(ingredients)
    .orderBy(asc(ingredients.slug))
  const eligible = await readEligible(tx)
  const currentLinks = await readCurrentLinks(
    tx,
    eligible.map((product) => product.id)
  )

  return { ingredientRows, eligible, currentLinks }
}

async function applyReconcilePlans(tx: DatabaseTransaction, writes: ProductWrite[]): Promise<void> {
  for (const { inserts, removeIds } of writes) {
    if (inserts.length > 0) await addManyIngredientsToProduct(tx, inserts)
    if (removeIds.length > 0) {
      await tx.delete(productIngredients).where(inArray(productIngredients.id, removeIds))
    }
  }
}

async function main() {
  console.log(
    `\n🔗 INCI → product_ingredients linking (${WRITE ? 'WRITE' : 'DRY-RUN'})` +
      (SLUG_ARG ? ` · slug=${SLUG_ARG}` : RELINK ? ' · relink=all' : '') +
      (ONLY_SLUGS ? ` · only=${[...ONLY_SLUGS].join(',')}` : '') +
      (LIMIT !== null ? ` · limit=${LIMIT}` : '')
  )
  console.log(`   alias index: ${aliasIndex.size} keys · inci index: ${inciIndex.size} tokens\n`)

  const prepared = await prepareCorpusReconcile(
    { load: () => withAdminRls(readCorpusSnapshot) },
    ONLY_SLUGS
  )
  const { snapshot, writes, stats } = prepared
  console.log(`   canonical_key fallback map: ${prepared.canonicalKeyCount} keys`)
  console.log(`   eligible products: ${snapshot.eligible.length}\n`)

  if (WRITE) {
    await withAdminRls(async (tx) => {
      // Keep the optimistic re-check true until every planned write commits.
      await tx.execute(
        sql`LOCK TABLE ingredients, products, product_ingredients IN SHARE ROW EXCLUSIVE MODE`
      )
      const current = await readCorpusSnapshot(tx)
      assertCorpusSnapshotUnchanged(snapshot, current)
      await applyReconcilePlans(tx, writes)
    })
  }

  printReport(stats)

  if (!WRITE) {
    console.log(
      `\n  Would insert ${stats.totalPairs} rows and delete ${stats.removedRows} on ${stats.changedProducts} products. Re-run with --write.\n`
    )
    return
  }
  console.log(
    `\n  Reconciled ${stats.changedProducts} products: +${stats.totalPairs} / -${stats.removedRows} rows (${stats.keptCurated} human links kept).\n`
  )
}

if (import.meta.main) await main()
