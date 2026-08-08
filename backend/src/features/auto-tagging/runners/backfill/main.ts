// Backfill INCI-derived and kind-derived tags for all skincare/solaire/bodycare products
// already in DB. Each page is planned and written independently so memory stays tied to
// PAGE_SIZE and an interrupted write can converge on a plain rerun.

import { inArray, sql } from 'drizzle-orm'

import { db } from '../../../../db'
import type { DatabaseTransaction } from '../../../../db/index'
import { withAdminRls } from '../../../../db/rls'
import { productTagLinks } from '../../../../db/schema'
import { loadAutoTagFetchBundle } from '../../lib/fetch-auto-tag-bundle'
import { type AutoTagFetchBundle, computeTagRowsForProduct } from '../../lib/orchestrator-input'
import { TAG_CONFIG } from '../../passes/algo-derm-detection'
import { fetchEligibleProductPage } from '../audit/db'
import { chunk } from '../chunk'
import { exitOnError, parseIntEnv, parseWriteSlugArgs } from '../cli-args'
import { type Candidate, classifyCandidates, type Relevance } from './classify'
import { filterBackfillPlan } from './filter'
import { runBackfillPages } from './pagination'
import { type BackfillReportSnapshot, type BackfillSampleRow, createBackfillReport } from './report'
import { assertSafeBackfillExecution } from './safety'

const { write: WRITE, slug: SLUG_ARG } = parseWriteSlugArgs()
// Raise every algo-derm per-tag confidenceFloor/computed_score to this.
const CONF_OVERRIDE = process.env.CONF_OVERRIDE ? Number(process.env.CONF_OVERRIDE) : null
// INCLUDE_DROPPED=1: surface allow:false tags in report; still no writes.
const INCLUDE_DROPPED = process.env.INCLUDE_DROPPED === '1'
const LIMIT = parseIntEnv('LIMIT')
const PAGE_SIZE = parseIntEnv('PAGE_SIZE') ?? 100
const TAG = process.env.TAG || null
const EXCLUDE_TAG = process.env.EXCLUDE_TAG || null
const SAMPLE = parseIntEnv('SAMPLE')
const SEED = parseIntEnv('SEED') ?? 42
const CSV_OUT = process.env.CSV_OUT || '/app/backend/tmp/backfill-sample.csv'

type ProductRow = Awaited<ReturnType<typeof fetchEligibleProductPage>>[number]

// Only product_type_v2 primaries count as "auto": concern primaries must not
// block V2 from firing on products V1 already touched (see classify.ts gate).
const AUTO_PRIMARY_TAG_TYPES = new Set(['product_type_v2'])

function validateParams(): void {
  assertSafeBackfillExecution({
    nodeEnv: process.env.NODE_ENV,
    isolatedRunner: process.env.AUTOTAG_BACKFILL_RUNNER === 'isolated',
  })
  if (
    CONF_OVERRIDE !== null &&
    (Number.isNaN(CONF_OVERRIDE) || CONF_OVERRIDE < 0 || CONF_OVERRIDE > 1)
  ) {
    throw new Error(`CONF_OVERRIDE must be in [0,1], got "${process.env.CONF_OVERRIDE}"`)
  }
  if (LIMIT !== null && LIMIT < 0) {
    throw new Error(`LIMIT must be a non-negative integer, got "${process.env.LIMIT}"`)
  }
  if (PAGE_SIZE < 1) {
    throw new Error(`PAGE_SIZE must be a positive integer, got "${process.env.PAGE_SIZE}"`)
  }
  if (SAMPLE !== null && SAMPLE < 0) {
    throw new Error(`SAMPLE must be a non-negative integer, got "${process.env.SAMPLE}"`)
  }
}

function logHeader(): void {
  const allowedTagCount = Object.values(TAG_CONFIG).filter((r) => r.allow).length
  console.log('🏷  Backfill auto-tags')
  console.log(
    `   mode=${WRITE ? 'WRITE' : 'DRY-RUN'} · page_size=${PAGE_SIZE} · ${allowedTagCount} algo-derm tags allow=true${
      CONF_OVERRIDE !== null ? ` · conf_override=${CONF_OVERRIDE}` : ''
    }${SLUG_ARG ? ` · slug=${SLUG_ARG}` : ''}${LIMIT !== null ? ` · limit=${LIMIT}` : ''}${
      TAG ? ` · tag=${TAG}` : ''
    }${SAMPLE !== null ? ` · sample=${SAMPLE} seed=${SEED}` : ''}\n`
  )
}

// Loads tagType per tagId to distinguish curated primaries from V1 auto primaries.
// Scoped to the product subset: under SLUG/LIMIT there is no reason to fold the
// whole table.
async function fetchExistingState(
  tagIdToType: Map<string, string>,
  productIds: readonly string[]
): Promise<{
  existingMap: Map<string, Relevance>
  productsWithCuratedPrimary: Set<string>
  manualPairs: Set<string>
}> {
  const existingRows = await db
    .select({
      productId: productTagLinks.productId,
      productTagId: productTagLinks.productTagId,
      rel: productTagLinks.relevance,
      source: productTagLinks.source,
    })
    .from(productTagLinks)
    .where(inArray(productTagLinks.productId, [...productIds]))
  const existingMap = new Map<string, Relevance>()
  const productsWithCuratedPrimary = new Set<string>()
  const manualPairs = new Set<string>()
  for (const r of existingRows) {
    const pairKey = `${r.productId}:${r.productTagId}`
    existingMap.set(pairKey, r.rel as Relevance)
    if (r.source === 'manual') manualPairs.add(pairKey)
    if (r.rel !== 'primary') continue
    const type = tagIdToType.get(r.productTagId)
    if (type && !AUTO_PRIMARY_TAG_TYPES.has(type)) productsWithCuratedPrimary.add(r.productId)
  }
  return { existingMap, productsWithCuratedPrimary, manualPairs }
}

// Orchestrator already dedups within a product (avoid > secondary). This map
// translates tagSlug to tagId and drops candidates whose slug is unknown
// to the current product_tags_defs (legacy slug remap).
function detectCandidates(
  subset: readonly ProductRow[],
  bundle: AutoTagFetchBundle
): {
  candidateMap: Map<string, Candidate>
  noInci: number
  eczemaReviewQueue: { slug: string; name: string; description: string }[]
} {
  const candidateMap = new Map<string, Candidate>()
  let noInci = 0
  // computeTagRowsForProduct withholds eczema-atopie when the description names
  // atopy under a contraindication (inverted claim); withheld products surface
  // for manual review.
  const eczemaReviewQueue: { slug: string; name: string; description: string }[] = []
  for (const p of subset) {
    if (!p.inci?.trim()) noInci++

    const { rows, withheld } = computeTagRowsForProduct(p, bundle, {
      ...(CONF_OVERRIDE !== null ? { confOverride: CONF_OVERRIDE } : {}),
      includeDropped: INCLUDE_DROPPED,
    })
    if (withheld) {
      eczemaReviewQueue.push({
        slug: p.slug,
        name: p.name ?? p.slug,
        description: p.description ?? '',
      })
    }
    for (const r of rows) {
      candidateMap.set(`${p.id}:${r.tagId}`, {
        productId: p.id,
        productTagId: r.tagId,
        slug: p.slug,
        tagSlug: r.tagSlug,
        relevance: r.relevance,
        source: r.source,
      })
    }
  }
  return { candidateMap, noInci, eczemaReviewQueue }
}

function reportPlan(report: BackfillReportSnapshot): void {
  const { sourceCountInsert, avoidUpserts, primaryPromotions } = report
  console.log(
    `📊 Produits : ${report.products} scannés en ${report.pages} lot(s) · ${report.noInci} sans INCI`
  )
  console.log(`   Candidats (après dédup intra-produit) : ${report.candidateCount}`)
  console.log(`   Déjà à jour                           : ${report.skipped}`)
  console.log(`   À insérer                             : ${report.insertCount}`)
  console.log(`   ├ algo-derm      : ${sourceCountInsert['algo-derm']}`)
  console.log(`   ├ actif-class    : ${sourceCountInsert['actif-class']}`)
  console.log(`   ├ kind           : ${sourceCountInsert.kind}`)
  console.log(`   ├ formula        : ${sourceCountInsert.formula}`)
  console.log(`   ├ cross-signal   : ${sourceCountInsert['cross-signal']}`)
  console.log(`   ├ percent-claim  : ${sourceCountInsert['percent-claim']}`)
  console.log(`   ├ brand          : ${sourceCountInsert.brand}`)
  console.log(`   ├ interaction    : ${sourceCountInsert.interaction}`)
  console.log(`   └ concentration  : ${sourceCountInsert.concentration}`)
  // Relevance precedence: avoid > primary > secondary. Detected `primary` (kind-derived
  // TYPE_* headline) upserts over existing `secondary` so backfill heals products whose
  // primary was never curated manually. Existing manual `primary` is preserved when the
  // detector only emits `secondary` for that pair (no demotion).
  if (avoidUpserts > 0) {
    console.log(`   Corrections avoid (→avoid)             : ${avoidUpserts}`)
  }
  if (primaryPromotions > 0) {
    console.log(`   Promotions primary (secondary→primary) : ${primaryPromotions}`)
  }

  if (SLUG_ARG) {
    if (report.planDetails.length > 0) {
      console.log('\n   Tags :')
      for (const { action, candidate } of report.planDetails) {
        console.log(
          `     [${action} ${candidate.relevance}] [${candidate.source}] ${candidate.tagSlug}`
        )
      }
    }
    return
  }

  reportTagBreakdown(report.tagInsertCounts)
  if (TAG) reportTagDetail(report.insertDetails, report.insertCount)
}

// Global per-tag view of the insert plan, the sampling entry point: innocuity
// claims (non-irritant, hypoallergenique, sans-*) must be spotted here before
// any mass write.
const TAG_BREAKDOWN_MAX = 40

function reportTagBreakdown(tagInsertCounts: ReadonlyMap<string, number>): void {
  if (tagInsertCounts.size === 0) return
  const rows = [...tagInsertCounts.entries()].sort((a, b) => b[1] - a[1])
  console.log(`\n   À insérer par tag (${tagInsertCounts.size} tags) :`)
  for (const [slug, n] of rows.slice(0, TAG_BREAKDOWN_MAX)) {
    console.log(`     ${String(n).padStart(5)}  ${slug}`)
  }
  if (rows.length > TAG_BREAKDOWN_MAX) {
    const rest = rows.slice(TAG_BREAKDOWN_MAX).reduce((s, [, n]) => s + n, 0)
    console.log(`     … +${rows.length - TAG_BREAKDOWN_MAX} tags (${rest} liens)`)
  }
}

const TAG_DETAIL_MAX = 50

function reportTagDetail(toInsert: readonly Candidate[], insertCount: number): void {
  console.log(`\n   Produits à taguer [${TAG}] :`)
  for (const c of toInsert) {
    console.log(`     [${c.relevance}] [${c.source}] ${c.slug}`)
  }
  if (insertCount > TAG_DETAIL_MAX) {
    console.log(`     … +${insertCount - TAG_DETAIL_MAX} de plus (SAMPLE=N pour un tirage CSV)`)
  }
}

const csvField = (v: string): string => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)

async function writeSampleCsv(sample: readonly BackfillSampleRow[]): Promise<void> {
  const rows = ['product_slug,product_name,tag_slug,relevance,source,inci']
  for (const { candidate, productName, inci } of sample) {
    rows.push(
      [candidate.slug, productName, candidate.tagSlug, candidate.relevance, candidate.source, inci]
        .map(csvField)
        .join(',')
    )
  }
  await Bun.write(CSV_OUT, `${rows.join('\n')}\n`)
  console.log(`\n📄 Échantillon (seed=${SEED}) : ${CSV_OUT} (${sample.length} lignes)`)
}

async function reportPeakMemory(): Promise<void> {
  const processPeakMiB = process.resourceUsage().maxRSS / 1024
  try {
    const bytes = Number((await Bun.file('/sys/fs/cgroup/memory.peak').text()).trim())
    if (Number.isFinite(bytes)) {
      console.log(`   Pic mémoire (cgroup) : ${(bytes / 1024 / 1024).toFixed(1)} MiB`)
      return
    }
  } catch {
    // Hosts that aren't Linux still expose the process peak below.
  }
  console.log(`   Pic mémoire (process) : ${processPeakMiB.toFixed(1)} MiB`)
}

const CHUNK = 500

// onConflictDoNothing preserves manual tags.
async function insertNewPairs(tx: DatabaseTransaction, toInsert: Candidate[]): Promise<number> {
  let inserted = 0
  for (const batch of chunk(toInsert, CHUNK)) {
    await tx
      .insert(productTagLinks)
      .values(
        batch.map(({ productId, productTagId, relevance, source }) => ({
          productId,
          productTagId,
          relevance,
          source,
        }))
      )
      .onConflictDoNothing()
    inserted += batch.length
    if (toInsert.length > CHUNK) {
      process.stdout.write(`\r   Inséré : ${inserted}/${toInsert.length}`)
    }
  }
  if (toInsert.length > CHUNK) console.log()
  return inserted
}

// Overrides lower-precedence rows: avoid > secondary/primary, primary > secondary.
// Drizzle's set clause uses EXCLUDED.{relevance, source}.
async function upsertExistingPairs(
  tx: DatabaseTransaction,
  toUpsert: Candidate[]
): Promise<number> {
  let upserted = 0
  for (const batch of chunk(toUpsert, CHUNK)) {
    await tx
      .insert(productTagLinks)
      .values(
        batch.map(({ productId, productTagId, relevance, source }) => ({
          productId,
          productTagId,
          relevance,
          source,
        }))
      )
      .onConflictDoUpdate({
        target: [productTagLinks.productTagId, productTagLinks.productId],
        set: { relevance: sql`excluded.relevance`, source: sql`excluded.source` },
      })
    upserted += batch.length
  }
  return upserted
}

async function main() {
  validateParams()
  logHeader()

  const reportAccumulator = createBackfillReport({ sampleSize: SAMPLE, seed: SEED })
  let requestedTagDetected = TAG === null
  let inserted = 0

  await runBackfillPages<ProductRow>(
    { pageSize: PAGE_SIZE, limit: LIMIT, slug: SLUG_ARG },
    {
      fetchPage: fetchEligibleProductPage,
      processPage: async (products) => {
        const productIds = products.map((product) => product.id)
        const bundle = await loadAutoTagFetchBundle(productIds, db)
        const tagIdToType = new Map(
          [...bundle.tagSlugToInfo.values()].map((tag) => [tag.id, tag.tagType])
        )
        const { existingMap, productsWithCuratedPrimary, manualPairs } = await fetchExistingState(
          tagIdToType,
          productIds
        )
        const { candidateMap, noInci, eczemaReviewQueue } = detectCandidates(products, bundle)
        let result = classifyCandidates(
          candidateMap,
          existingMap,
          productsWithCuratedPrimary,
          manualPairs
        )

        if (TAG !== null && !requestedTagDetected) {
          requestedTagDetected = [...candidateMap.values()].some(
            (candidate) => candidate.tagSlug === TAG
          )
        }
        if (TAG || EXCLUDE_TAG) {
          result = filterBackfillPlan(result, { tag: TAG, excludeTag: EXCLUDE_TAG })
        }

        reportAccumulator.addPage({
          products,
          noInci,
          candidateCount: candidateMap.size,
          result,
          eczemaReviewQueue,
        })

        if (WRITE && (result.toInsert.length > 0 || result.toUpsert.length > 0)) {
          inserted += await withAdminRls(async (tx) => {
            const pageInserted = await insertNewPairs(tx, result.toInsert)
            await upsertExistingPairs(tx, result.toUpsert)
            return pageInserted
          })
        }
      },
    }
  )

  const report = reportAccumulator.snapshot()
  if (SLUG_ARG && report.products === 0) {
    throw new Error(`Product slug "${SLUG_ARG}" not found in DB (or not in an eligible category)`)
  }
  if (!requestedTagDetected) {
    console.warn(`⚠  TAG="${TAG}" absent des candidats détectés (typo ?)`)
  }

  reportPlan(report)
  await reportPeakMemory()
  if (SAMPLE !== null) await writeSampleCsv(report.sample)

  if (report.eczemaReviewCount > 0) {
    console.warn(
      `⚠  eczema-atopie review queue: ${report.eczemaReviewCount} product(s) name atopy under a contraindication — NOT auto-tagged, review manually:`
    )
    for (const f of report.eczemaReviewSample) {
      console.warn(`    • ${f.name} [${f.slug}] — ${f.description.slice(0, 160)}`)
    }
    if (report.eczemaReviewCount > report.eczemaReviewSample.length) {
      console.warn(`    … +${report.eczemaReviewCount - report.eczemaReviewSample.length} de plus`)
    }
  }

  if (report.insertCount === 0 && report.upsertCount === 0) {
    console.log('\n✨ Rien à insérer. Base à jour.')
    return
  }
  if (!WRITE) {
    console.log('\nRun avec --write pour appliquer.')
    return
  }

  console.log(
    `\n✅ ${inserted} insérées · ${report.avoidUpserts} corrections avoid · ${report.primaryPromotions} promotions primary.\n`
  )
}

main().catch(exitOnError)
