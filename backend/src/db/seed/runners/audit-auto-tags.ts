// Dry-run audit for INCI-derived auto-tags via algo-derm `tagProduct`.
//
// Read-only. Reads every skincare product with a non-empty INCI from the
// live DB, runs `analyzeINCI` + `tagProduct`, applies `TAG_CONFIG` (per-tag
// allow / minConf / excludeRinseOff calibrated 2026-05-07 — see
// docs/tags/AUTO-TAGS.md §7.4–7.6), and reports per-tag stats:
//   - hit:    number of products that would receive the tag
//   - agree:  hit ∩ already-present in tag_products (recall on existing manual labels)
//   - new:    hit \ already-present (proposed additions)
//   - avg_conf: average algo-derm confidence over hits
//
// No writes. The companion runner `backfill-auto-tags.ts` (TODO) will do
// the actual INSERT once thresholds are calibrated.
//
// Tunables via env:
//   CONF_OVERRIDE    optional       — global floor; raises every per-tag minConf to this value (debug)
//   CSV_OUT          optional       — path to write per-pair CSV for spot-check
//   LIMIT            optional       — cap product count (debug)
//   INCLUDE_DROPPED  optional 1     — include allow:false tags in the report (debug)

import { eq, sql } from 'drizzle-orm'

import { db } from '../..'
import { products, productTagsDefs, tagProducts } from '../../schema'
import { detectAutoTags, TAG_CONFIG, type TagRule } from '../utils/auto-tag-detection'

interface TagStat {
  hit: number
  agree: number
  new: number
  sumConf: number
  minConf: number
  maxConf: number
}

const CONF_OVERRIDE = process.env.CONF_OVERRIDE ? Number(process.env.CONF_OVERRIDE) : null
const CSV_OUT = process.env.CSV_OUT
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : null
const INCLUDE_DROPPED = process.env.INCLUDE_DROPPED === '1'

async function main() {
  if (
    CONF_OVERRIDE !== null &&
    (Number.isNaN(CONF_OVERRIDE) || CONF_OVERRIDE < 0 || CONF_OVERRIDE > 1)
  ) {
    throw new Error(`CONF_OVERRIDE must be in [0,1], got "${process.env.CONF_OVERRIDE}"`)
  }

  const allowedCount = Object.values(TAG_CONFIG).filter((r) => r.allow).length
  console.log(`🔍 Audit auto-tags (dry-run)`)
  console.log(
    `   ${allowedCount}/${Object.keys(TAG_CONFIG).length} tags allow=true${
      CONF_OVERRIDE !== null ? ` · conf_override=${CONF_OVERRIDE}` : ''
    }${INCLUDE_DROPPED ? ` · include_dropped=true` : ''}${LIMIT ? ` · limit=${LIMIT}` : ''}${
      CSV_OUT ? ` · csv=${CSV_OUT}` : ''
    }\n`
  )

  // Bypass RLS so the audit sees the full skincare catalogue.
  await db.execute(sql`SET LOCAL app.role = 'admin'`)

  const skincare = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      kind: products.kind,
      inci: products.inci,
    })
    .from(products)
    .where(eq(products.category, 'skincare'))

  const subset = LIMIT ? skincare.slice(0, LIMIT) : skincare

  // Pre-fetch existing (productId, tagSlug) pairs so we can label each
  // emitted tag as agree (already manually present) vs new (proposal).
  const existingRows = await db
    .select({ pId: tagProducts.productId, slug: productTagsDefs.slug })
    .from(tagProducts)
    .innerJoin(productTagsDefs, eq(tagProducts.productTagId, productTagsDefs.id))

  const existingByProduct = new Map<string, Set<string>>()
  for (const r of existingRows) {
    let set = existingByProduct.get(r.pId)
    if (!set) {
      set = new Set()
      existingByProduct.set(r.pId, set)
    }
    set.add(r.slug)
  }

  const tagFreq = new Map<string, TagStat>()
  const csvRows: string[] = []
  if (CSV_OUT) {
    csvRows.push('product_slug,product_name,tag_slug,confidence,source,already_present')
  }

  let withInci = 0
  let withTags = 0
  let totalEmitted = 0
  let totalAgree = 0
  let totalNew = 0
  let totalManualSkincare = 0

  for (const p of subset) {
    if (!p.inci?.trim()) continue
    withInci++

    const detected = detectAutoTags(p.inci, p.kind, {
      ...(CONF_OVERRIDE !== null ? { confOverride: CONF_OVERRIDE } : {}),
      includeDropped: INCLUDE_DROPPED,
    })
    const existingSet = existingByProduct.get(p.id) ?? new Set<string>()
    totalManualSkincare += existingSet.size

    let emittedHere = 0
    for (const t of detected) {
      emittedHere++
      const stat = tagFreq.get(t.slug) ?? {
        hit: 0,
        agree: 0,
        new: 0,
        sumConf: 0,
        minConf: 1,
        maxConf: 0,
      }
      stat.hit++
      stat.sumConf += t.confidence
      stat.minConf = Math.min(stat.minConf, t.confidence)
      stat.maxConf = Math.max(stat.maxConf, t.confidence)
      const isAgree = existingSet.has(t.slug)
      if (isAgree) {
        stat.agree++
        totalAgree++
      } else {
        stat.new++
        totalNew++
      }
      tagFreq.set(t.slug, stat)

      if (CSV_OUT) {
        const safeName = (p.name ?? '').replaceAll('"', '""')
        csvRows.push(
          `${p.slug},"${safeName}",${t.slug},${t.confidence.toFixed(3)},${t.source},${isAgree}`
        )
      }
    }

    if (emittedHere > 0) withTags++
    totalEmitted += emittedHere
  }

  // ── Reporting ────────────────────────────────────────────────────────
  console.log(`📊 Couverture`)
  console.log(`   ${subset.length} produits skincare`)
  console.log(
    `   ${withInci} avec INCI (${pct(withInci, subset.length)}) · ${withTags} taggés (${pct(withTags, withInci)} parmi INCI)`
  )
  console.log(
    `   ${totalEmitted} paires émises · agree=${totalAgree} · new=${totalNew} · manual_total=${totalManualSkincare}\n`
  )

  console.log(`📋 Par tag (trié par hit DESC)`)
  console.log(
    `   ${pad('tag_slug', 28)} ${rpad('hit', 6)} ${rpad('agree', 6)} ${rpad('new', 6)} ${rpad('avg', 8)} ${rpad('min', 6)} ${rpad('max', 6)} ${rpad('rule', 14)}`
  )
  console.log(
    `   ${'─'.repeat(28)} ${'─'.repeat(6)} ${'─'.repeat(6)} ${'─'.repeat(6)} ${'─'.repeat(8)} ${'─'.repeat(6)} ${'─'.repeat(6)} ${'─'.repeat(14)}`
  )
  // Reverse-lookup auroreSlug → rule for the report column.
  const ruleBySlug = new Map<string, TagRule>()
  for (const r of Object.values(TAG_CONFIG)) ruleBySlug.set(r.auroreSlug, r)

  const sorted = [...tagFreq.entries()].sort((a, b) => b[1].hit - a[1].hit)
  for (const [slug, s] of sorted) {
    const r = ruleBySlug.get(slug)
    const tag = r
      ? `${r.allow ? '✓' : '✗'} ${r.minConf.toFixed(2)}${r.excludeRinseOff ? ' L' : ''}`
      : '?'
    console.log(
      `   ${pad(slug, 28)} ${rpad(String(s.hit), 6)} ${rpad(String(s.agree), 6)} ${rpad(String(s.new), 6)} ${rpad((s.sumConf / s.hit).toFixed(3), 8)} ${rpad(s.minConf.toFixed(2), 6)} ${rpad(s.maxConf.toFixed(2), 6)} ${rpad(tag, 14)}`
    )
  }

  // Mapped slugs that emitted nothing — useful sanity check.
  const emittedSlugs = new Set(tagFreq.keys())
  const silent = Object.values(TAG_CONFIG)
    .filter((r) => r.allow && !emittedSlugs.has(r.auroreSlug))
    .map((r) => r.auroreSlug)
  if (silent.length > 0) {
    console.log(`\n⚪ Tags allow=true mais 0 hit : ${silent.join(', ')}`)
  }

  if (CSV_OUT) {
    await Bun.write(CSV_OUT, csvRows.join('\n'))
    console.log(`\n📄 CSV écrit : ${CSV_OUT} (${csvRows.length - 1} lignes)`)
  }

  console.log(`\n✨ Audit terminé. Aucun INSERT effectué.\n`)
}

function pct(n: number, d: number): string {
  return d === 0 ? '0 %' : `${((n / d) * 100).toFixed(1)} %`
}

function pad(s: string, w: number): string {
  return s.length >= w ? s : s + ' '.repeat(w - s.length)
}

function rpad(s: string, w: number): string {
  return s.length >= w ? s : ' '.repeat(w - s.length) + s
}

if (import.meta.main || process.argv[1]?.endsWith('audit-auto-tags.ts')) {
  main().catch((err) => {
    console.error('\n💥 Erreur :', err instanceof Error ? err.message : err)
    if (err instanceof Error && err.stack) console.error(err.stack)
    process.exit(1)
  })
}
