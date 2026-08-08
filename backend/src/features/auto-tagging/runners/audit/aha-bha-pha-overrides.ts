// Audit manual AHA / BHA / PHA tags that the detector does NOT emit. Read-only. The three
// acid clusters cap at position 10 by design (pH-dependent acid past pos 10 reads as pH
// adjuster / preservative trace, not a functional exfoliant), so the drift against manual
// tags is expected and kept. Manual annotations are concentration-agnostic and tag any
// product containing the molecule, so 254 manual pairs survive past the cap.

import type { ProductKind } from '@aurore/shared'

import { normalize, splitINCI } from 'algo-derm'
import { inArray, sql } from 'drizzle-orm'

import { withAdminRls } from '../../../../db/rls'
import { products, productTagLinks, productTagTypes } from '../../../../db/schema'
import { freqTable } from '../../../../lib/report'
import { ACTIF_CLASS_DEFS, detectActifClasses } from '../../passes/actif-class-detection'
import { exitOnError } from '../cli-args'
import { fetchEligibleProducts, fetchProductTagSlugsByProduct } from './db'
import { LIMIT } from './env'

const TARGET_SLUGS = ['aha', 'bha', 'pha'] as const
type TargetSlug = (typeof TARGET_SLUGS)[number]

// Derived from the detector's own ACTIF_CLASS_DEFS so the audit can never drift
// from what the pass actually matches (BHA has 2 defs, flatMap merges them).
const collectPatterns = (slug: TargetSlug): string[] =>
  ACTIF_CLASS_DEFS.filter((d) => d.slug === slug).flatMap((d) => d.patterns)

const PATTERNS: Record<TargetSlug, readonly string[]> = {
  aha: collectPatterns('aha'),
  bha: collectPatterns('bha'),
  pha: collectPatterns('pha'),
}

// Env: CSV_OUT, CSV_DIR (see below), LIMIT (cap product count, debug), APPLY=1 (destructive:
// delete pairs from APPLY_FROM_CSV, skips the audit pass), APPLY_FROM_CSV (path to CSV with
// product_slug,tag_slug columns; deleted via composite productId/productTagId lookup).
const CSV_OUT = process.env.CSV_OUT
const CSV_DIR = process.env.CSV_DIR
const APPLY = process.env.APPLY === '1'
const APPLY_FROM_CSV = process.env.APPLY_FROM_CSV

interface OverrideRow {
  productSlug: string
  tagSlug: TargetSlug
  ingredient: string
  position: number
  kind: ProductKind
  name: string
  inciExcerpt: string
}

type Verdict = 'delete' | 'keep' | 'borderline'

// Heuristic auto-classification for the drift the detector keeps by design.
// Marketing intent overrides chemistry when the product is sold as an exfoliant
// (Dermalogica Daily Microfoliant BHA at pos 23 is functionally a peel despite the cap).
const MARKET_MARKERS = [
  'aha',
  'bha',
  'pha',
  'salicylic',
  'salicyclique',
  'glycolic',
  'glycolique',
  'mandelic',
  'lactobionic',
  'peel',
  'peeling',
  'foliant', // microfoliant / superfoliant / exfoliant
  'exfolian',
  'exfoliating',
  'exfoliant',
]

// Hair / scalp products: delete, irrelevant to face exfoliant tags.
const HAIR_MARKERS = [
  'shampoo',
  'shampoing',
  'shampooing',
  'dercos',
  'antipelliculaire',
  'anti-pelliculaire',
  'anti pelliculaire',
  'anti-chute',
  'antichute',
  'cuir chevelu',
  'kerium',
  'ilcapil',
]

// Acne / pigmentation product positioning: when the product is sold as
// an acne or pigmentation treatment, AHA/BHA in the middle of the list (pos 11-19,
// ~0.5-1%) is the canonical functional adjunct (not pH adjuster). Keep these
// regardless of the molecule's exact INCI position up to 19.
const ACNE_MARKERS = [
  'sebium',
  'sebiaclear',
  'sebio', // sebionex, sebium etc
  'acniben',
  'keracnyl',
  'normaderm',
  'effaclar',
  'blemish',
  'acne ', // trailing space avoids matching "menacne" or substrings; "acne-" / "acne " covered
  'acne-',
  'anti-imperfection',
  'antiimperfection',
  'imperfection',
  'spot ',
  'spot-treatment',
  'pore ',
  'pore-',
  'oily skin',
  'peau grasse',
  'peaux grasses',
  'redness reform',
  'breakout',
]

const PIGMENTATION_MARKERS = [
  'anti-taches',
  'anti taches',
  'antitaches',
  'anti-tache',
  'dark spot',
  'mela b3',
  'mela ',
  'melaclear',
  'depiwhite',
  'depigment',
  'brightening',
  'eclaircissant',
  'illuminating',
  'pigmentaires',
  'pigmenta',
  'glutathiosome',
  'neotone',
  'meno 5',
]

function classify(row: OverrideRow): Verdict {
  const name = row.name.toLowerCase()
  const slug = row.productSlug.toLowerCase()
  const haystack = `${name} ${slug}`

  if (MARKET_MARKERS.some((m) => haystack.includes(m))) return 'keep'
  if (HAIR_MARKERS.some((m) => haystack.includes(m))) return 'delete'
  const isAcne = ACNE_MARKERS.some((m) => haystack.includes(m))
  const isPigmentation = PIGMENTATION_MARKERS.some((m) => haystack.includes(m))
  if ((isAcne || isPigmentation) && row.position <= 19) return 'keep'
  if (row.position >= 20) return 'delete'
  if (row.position >= 15) return 'delete'
  return 'borderline'
}

async function main() {
  if (APPLY) {
    await applyDeletions()
    return
  }

  console.log(`🔍 Audit overrides AHA / BHA / PHA (manual past cap=10)`)
  console.log(`   targets=${TARGET_SLUGS.join(',')}${LIMIT ? ` · limit=${LIMIT}` : ''}\n`)

  const subset = await fetchEligibleProducts({ limit: LIMIT ?? undefined })

  // SQL-filtered to TARGET_SLUGS, so the narrowing cast is sound.
  const manualByProduct = (await fetchProductTagSlugsByProduct([...TARGET_SLUGS])) as Map<
    string,
    Set<TargetSlug>
  >

  const overrides: OverrideRow[] = []
  let scanned = 0
  let withManual = 0
  let detectorAgrees = 0

  for (const p of subset) {
    const manual = manualByProduct.get(p.id)
    if (!manual || manual.size === 0) continue
    withManual++
    if (!p.inci?.trim()) continue
    scanned++

    const detected = new Set<string>(detectActifClasses(p.inci))
    const tokens = splitINCI(p.inci).map(normalize).filter(Boolean)

    for (const slug of manual) {
      if (detected.has(slug)) {
        detectorAgrees++
        continue
      }
      let bestIdx = -1
      let bestPattern = ''
      for (let i = 0; i < tokens.length; i++) {
        for (const pat of PATTERNS[slug]) {
          if (tokens[i].includes(pat)) {
            if (bestIdx === -1 || i < bestIdx) {
              bestIdx = i
              bestPattern = pat
            }
          }
        }
      }
      if (bestIdx === -1) {
        // No pattern hit: orphan annotation, no calibration fix can recover it.
        overrides.push({
          productSlug: p.slug,
          tagSlug: slug,
          ingredient: '(none)',
          position: 0,
          kind: p.kind as ProductKind,
          name: p.name,
          inciExcerpt: tokens.slice(0, 5).join(', '),
        })
        continue
      }

      const start = Math.max(0, bestIdx - 1)
      const end = Math.min(tokens.length, bestIdx + 5)
      const inciExcerpt = tokens.slice(start, end).join(', ')

      overrides.push({
        productSlug: p.slug,
        tagSlug: slug,
        ingredient: bestPattern,
        position: bestIdx + 1,
        kind: p.kind as ProductKind,
        name: p.name,
        inciExcerpt,
      })
    }
  }

  console.log(`📊 Stats`)
  console.log(`   ${subset.length} produits éligibles`)
  console.log(`   ${withManual} avec ≥ 1 tag manual aha/bha/pha`)
  console.log(`   ${scanned} scannés (INCI non-vide)`)
  console.log(`   ${detectorAgrees} où détecteur fire (cap respecté → no override)`)
  console.log(`   ${overrides.length} overrides (manual past cap)\n`)

  if (overrides.length === 0) {
    console.log(`   ✅ Aucun override à reviewer.\n`)
    return
  }

  const byTag: Record<TargetSlug, number> = { aha: 0, bha: 0, pha: 0 }
  for (const o of overrides) byTag[o.tagSlug]++
  console.log(`📦 Par cluster`)
  console.table(byTag)

  const buckets: Record<TargetSlug, [number, number, number, number]> = {
    aha: [0, 0, 0, 0],
    bha: [0, 0, 0, 0],
    pha: [0, 0, 0, 0],
  }
  for (const o of overrides) {
    const b = buckets[o.tagSlug]
    if (o.position === 0)
      b[3]++ // orphan (no pattern hit)
    else if (o.position <= 14) b[0]++
    else if (o.position <= 19) b[1]++
    else b[2]++
  }
  console.log(`📐 Position buckets`)
  console.table(
    TARGET_SLUGS.map((slug) => {
      const [near, mid, deep, orphan] = buckets[slug]
      return { slug, '10–14': near, '15–19': mid, '20+': deep, orphan }
    })
  )

  const byTagIng = new Map<TargetSlug, Map<string, number>>()
  for (const o of overrides) {
    let ingMap = byTagIng.get(o.tagSlug)
    if (!ingMap) {
      ingMap = new Map()
      byTagIng.set(o.tagSlug, ingMap)
    }
    ingMap.set(o.ingredient, (ingMap.get(o.ingredient) ?? 0) + 1)
  }
  for (const slug of TARGET_SLUGS) {
    const ingMap = byTagIng.get(slug)
    if (!ingMap) continue
    console.log(`🧪 ${slug.toUpperCase()} top ingredients`)
    console.table(freqTable(ingMap, ingMap.size, 'ingredient'))
  }

  const byTagKind = new Map<TargetSlug, Map<string, number>>()
  for (const o of overrides) {
    let kindMap = byTagKind.get(o.tagSlug)
    if (!kindMap) {
      kindMap = new Map()
      byTagKind.set(o.tagSlug, kindMap)
    }
    kindMap.set(o.kind, (kindMap.get(o.kind) ?? 0) + 1)
  }
  for (const slug of TARGET_SLUGS) {
    const kindMap = byTagKind.get(slug)
    if (!kindMap) continue
    console.log(`📦 ${slug.toUpperCase()} top kinds`)
    console.table(freqTable(kindMap, 5, 'kind'))
  }

  overrides.sort((a, b) => {
    if (a.tagSlug !== b.tagSlug) return a.tagSlug.localeCompare(b.tagSlug)
    if (a.position !== b.position) return a.position - b.position
    return a.productSlug.localeCompare(b.productSlug)
  })

  const verdicts: Verdict[] = overrides.map(classify)
  const counts: Record<Verdict, number> = { delete: 0, keep: 0, borderline: 0 }
  for (const v of verdicts) counts[v]++
  console.log(`🧮 Auto-classification`)
  console.table(counts)

  // CSV_OUT writes one file; CSV_DIR splits into delete/keep/borderline.csv. The keep/delete
  // call itself is offline, case-by-case.
  if (CSV_OUT) {
    const lines = [csvHeader()]
    for (const o of overrides) lines.push(csvLine(o))
    await Bun.write(CSV_OUT, `${lines.join('\n')}\n`)
    console.log(`📄 CSV écrit : ${CSV_OUT} (${overrides.length} lignes)\n`)
  }

  if (CSV_DIR) {
    const buckets: Record<Verdict, string[]> = {
      delete: [csvHeader()],
      keep: [csvHeader()],
      borderline: [csvHeader()],
    }
    for (let i = 0; i < overrides.length; i++) {
      buckets[verdicts[i]].push(csvLine(overrides[i]))
    }
    for (const v of ['delete', 'keep', 'borderline'] as Verdict[]) {
      const path = `${CSV_DIR.replace(/\/$/, '')}/${v}.csv`
      await Bun.write(path, `${buckets[v].join('\n')}\n`)
      console.log(`📄 CSV écrit : ${path} (${buckets[v].length - 1} lignes)`)
    }
    console.log()
  }
}

function csvHeader(): string {
  return 'product_slug,tag_slug,ingredient,position,kind,name,inci_excerpt'
}

function csvLine(o: OverrideRow): string {
  return [
    o.productSlug,
    o.tagSlug,
    csvEscape(o.ingredient),
    String(o.position),
    o.kind,
    csvEscape(o.name),
    csvEscape(o.inciExcerpt),
  ].join(',')
}

// Reads (product_slug, tag_slug) from a reviewed CSV as data, not policy,
// so cleanup decisions stay offline and the verdict logic stays out of code.
async function applyDeletions(): Promise<void> {
  if (!APPLY_FROM_CSV) {
    throw new Error('APPLY=1 requires APPLY_FROM_CSV (path to CSV inside container)')
  }

  console.log(`🗑  APPLY mode — DELETE pairs from ${APPLY_FROM_CSV}`)

  const file = Bun.file(APPLY_FROM_CSV)
  const text = await file.text()
  const lines = text.split('\n').filter((l) => l.trim() !== '')
  if (lines.length < 2) {
    throw new Error(`${APPLY_FROM_CSV}: empty or missing header`)
  }
  const header = lines[0].split(',')
  const colSlug = header.indexOf('product_slug')
  const colTag = header.indexOf('tag_slug')
  if (colSlug < 0 || colTag < 0) {
    throw new Error(
      `${APPLY_FROM_CSV}: header must include product_slug and tag_slug (got ${lines[0]})`
    )
  }

  type Pair = { productSlug: string; tagSlug: string }
  const pairs: Pair[] = []
  for (const line of lines.slice(1)) {
    // Runner-generated CSVs: slugs are kebab-case ASCII, no embedded quotes.
    const cols = line.split(',')
    const productSlug = (cols[colSlug] ?? '').trim()
    const tagSlug = (cols[colTag] ?? '').trim()
    if (!productSlug || !tagSlug) continue
    if (!TARGET_SLUGS.includes(tagSlug as TargetSlug)) {
      throw new Error(`${APPLY_FROM_CSV}: tag_slug ${tagSlug} outside ${TARGET_SLUGS.join(',')}`)
    }
    pairs.push({ productSlug, tagSlug })
  }

  console.log(`   ${pairs.length} pairs à supprimer\n`)

  // SET LOCAL is tx-scoped: wrap the write block so RLS sees the elevated role.
  let deleted = 0
  let missing = 0
  let notFound = 0
  await withAdminRls(async (tx) => {
    const slugSet = new Set(pairs.map((p) => p.productSlug))
    const productRows = await tx
      .select({ id: products.id, slug: products.slug })
      .from(products)
      .where(inArray(products.slug, [...slugSet]))
    const productIdBySlug = new Map<string, string>()
    for (const r of productRows) productIdBySlug.set(r.slug, r.id)

    const tagDefRows = await tx
      .select({ id: productTagTypes.id, slug: productTagTypes.slug })
      .from(productTagTypes)
      .where(inArray(productTagTypes.slug, [...TARGET_SLUGS]))
    const tagIdBySlug = new Map<string, string>()
    for (const r of tagDefRows) tagIdBySlug.set(r.slug, r.id)

    for (const { productSlug, tagSlug } of pairs) {
      const pid = productIdBySlug.get(productSlug)
      const tid = tagIdBySlug.get(tagSlug)
      if (!pid || !tid) {
        missing++
        console.log(`   ⚠ unresolved ${productSlug} / ${tagSlug}`)
        continue
      }
      // Inside a transaction this driver carries no affected-row count (only db.delete() does),
      // so RETURNING is the only way to tell a removed pair from an already-absent one.
      const rows = await tx
        .delete(productTagLinks)
        .where(
          sql`${productTagLinks.productId} = ${pid} AND ${productTagLinks.productTagId} = ${tid}`
        )
        .returning({ productId: productTagLinks.productId })
      if (rows.length === 0) notFound++
      else deleted += rows.length
    }
  })

  console.log(`\n📊 APPLY summary`)
  console.log(`   ${deleted} pairs supprimées`)
  if (notFound > 0) console.log(`   ${notFound} pairs déjà absentes (no-op)`)
  if (missing > 0) console.log(`   ${missing} pairs avec slug/tag introuvable (skipped)`)
  console.log()
}

function csvEscape(v: string): string {
  if (v.includes(',') || v.includes('"') || v.includes('\n')) {
    return `"${v.replace(/"/g, '""')}"`
  }
  return v
}

if (import.meta.main) {
  main().catch(exitOnError)
}
