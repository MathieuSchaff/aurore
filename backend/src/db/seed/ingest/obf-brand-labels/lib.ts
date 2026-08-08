// Pure logic for the OBF brand-label ingestion. The runner that wraps this
// module owns I/O (download, gunzip, DB upsert) so the per-brand aggregation
// and threshold rules stay unit-testable on small fixtures.

import type {
  BrandCertificationSource,
  BrandCertificationSources,
} from '../../../schema/products/brand-certifications'

// OBF CSV columns, language-prefixed slugs:
//   brands_tags  e.g. "xx:l-oreal,xx:cerave"
//   labels_tags  e.g. "en:vegan,en:cruelty-free,fr:ecocert" (multiple languages)
export interface ObfRow {
  brandTags: string[]
  labelTags: string[]
}

// OBF slug format: lowercase ASCII, accents stripped, any non-[a-z0-9] run
// collapsed to a single `-`. Mirrors the OBF Perl `prodsuf:get_string_id_for_lang`
// well enough for our top-corpus brands (verified manually against the dump:
// "L'Oréal" gives "l-oreal", "La Roche-Posay" gives "la-roche-posay", "Avène" gives "avene").
export function brandToObfSlug(brand: string): string {
  return brand
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Strip the language prefix from an OBF tag: `xx:l-oreal` gives `l-oreal`,
// `en:vegan` gives `vegan`. Tags without a prefix (rare) pass through.
export function stripObfPrefix(tag: string): string {
  const colon = tag.indexOf(':')
  return colon === -1 ? tag : tag.slice(colon + 1)
}

// Map OBF label slugs to our brand-level certification flags. Labels coming from
// several sources can collapse onto the same flag.
const VEGAN_LABELS = new Set(['vegan'])
const CRUELTY_FREE_LABELS = new Set([
  'cruelty-free',
  'not-tested-on-animals',
  'peta-cruelty-free',
  'leaping-bunny',
  'one-voice',
])
// `naturel` is excluded on purpose: it is a self-declared marketing tag, not
// a certification, and the flag it feeds is named isNaturalCertified. We keep
// regulated `organic`/`bio` (EU-governed terms) plus the named schemes.

// `en:bio` / `en:organic` are used inconsistently in OBF (some FR-only brands
// tag `fr:cosmetique-bio-charte-cosmebio` instead), so we accept the union and
// trust the per-brand ratio threshold to discount outliers.
const NATURAL_LABELS = new Set([
  'organic',
  'cosmos-organic',
  'cosmos-natural',
  'ecocert',
  'bio',
  'nature-progres',
  'cosmetique-bio-charte-cosmebio',
  'cosmebio',
  'cosmetique-bio',
  'eu-organic',
  'natrue',
])

export type CertFlag = 'vegan' | 'crueltyFree' | 'naturalCertified'

// Unrecognized labels are silently dropped to keep the rule set conservative.
export function classifyLabel(prefixedTag: string): CertFlag | null {
  const slug = stripObfPrefix(prefixedTag)
  if (VEGAN_LABELS.has(slug)) return 'vegan'
  if (CRUELTY_FREE_LABELS.has(slug)) return 'crueltyFree'
  if (NATURAL_LABELS.has(slug)) return 'naturalCertified'
  return null
}

interface BrandStats {
  total: number
  vegan: number
  crueltyFree: number
  naturalCertified: number
}

export interface BrandClaimRollup {
  obfSlug: string
  total: number
  vegan: { count: number; ratio: number; claim: boolean }
  crueltyFree: { count: number; ratio: number; claim: boolean }
  naturalCertified: { count: number; ratio: number; claim: boolean }
}

export interface AggregateOptions {
  ratioThreshold: number
  minProducts: number
  // Absolute label-count fallback : a brand qualifies if at least
  // `minLabelCount` of its OBF products carry the matching label, even
  // when the ratio is low. Default 3, high enough to filter noise on
  // small brands but reachable for big ones with sparse tagging.
  minLabelCount: number
  // Set of OBF brand slugs we care about (= our corpus + manual seed).
  // Rows whose brands don't intersect this set are skipped, which keeps the
  // rollup dataset small and relevant.
  brandWhitelist?: ReadonlySet<string>
}

export function aggregateBrandClaims(
  rows: Iterable<ObfRow>,
  options: AggregateOptions
): Map<string, BrandClaimRollup> {
  const stats = new Map<string, BrandStats>()

  for (const row of rows) {
    if (row.brandTags.length === 0) continue
    const flagsThisRow = new Set<CertFlag>()
    for (const t of row.labelTags) {
      const f = classifyLabel(t)
      if (f) flagsThisRow.add(f)
    }

    for (const brandTag of row.brandTags) {
      const obfSlug = stripObfPrefix(brandTag)
      if (options.brandWhitelist && !options.brandWhitelist.has(obfSlug)) continue
      let s = stats.get(obfSlug)
      if (!s) {
        s = { total: 0, vegan: 0, crueltyFree: 0, naturalCertified: 0 }
        stats.set(obfSlug, s)
      }
      s.total++
      if (flagsThisRow.has('vegan')) s.vegan++
      if (flagsThisRow.has('crueltyFree')) s.crueltyFree++
      if (flagsThisRow.has('naturalCertified')) s.naturalCertified++
    }
  }

  const out = new Map<string, BrandClaimRollup>()
  for (const [obfSlug, s] of stats) {
    const ratio = (n: number) => (s.total === 0 ? 0 : n / s.total)
    const meetsRule = (n: number) => {
      // Ratio rule: catches brands that consistently tag their lineup.
      const ratioPass = s.total >= options.minProducts && ratio(n) >= options.ratioThreshold
      // Count rule: catches big brands where most rows lack labels (Garnier:
      // 758 products, only 40 tag vegan = 5% ratio, but 40 is still strong evidence).
      const countPass = n >= options.minLabelCount
      // OR-combined (OBF tagging is sparse). False positives stay rare:
      // crowdsourced OBF labels are backed by real packaging/logo, so a few
      // mistags don't reach minLabelCount across thousands of rows.
      return ratioPass || countPass
    }

    out.set(obfSlug, {
      obfSlug,
      total: s.total,
      vegan: { count: s.vegan, ratio: ratio(s.vegan), claim: meetsRule(s.vegan) },
      crueltyFree: {
        count: s.crueltyFree,
        ratio: ratio(s.crueltyFree),
        claim: meetsRule(s.crueltyFree),
      },
      naturalCertified: {
        count: s.naturalCertified,
        ratio: ratio(s.naturalCertified),
        claim: meetsRule(s.naturalCertified),
      },
    })
  }
  return out
}

// Merge an OBF rollup into an existing sources jsonb without dropping
// claims from other sources (manual seed, future PETA/LB scrapers). For
// each claim where OBF asserts true, append `obf` to that claim's source
// list (dedup). Existing claims stay even if OBF didn't assert them: we
// only ADD evidence, never remove it.
export function mergeObfSourcesIntoExisting(
  existing: BrandCertificationSources,
  rollup: BrandClaimRollup
): BrandCertificationSources {
  const out: BrandCertificationSources = { ...existing }
  const addObf = (key: keyof BrandCertificationSources) => {
    const current = out[key] ?? []
    if (!current.includes('obf' as BrandCertificationSource)) {
      out[key] = [...current, 'obf']
    }
  }
  if (rollup.vegan.claim) addObf('vegan')
  if (rollup.crueltyFree.claim) addObf('cruelty_free')
  if (rollup.naturalCertified.claim) addObf('natural')
  return out
}

// CSV parsing: OBF dumps use tab separators with no embedded tabs. Empty
// fields stay empty strings; trailing newline is dropped. Streaming-safe
// (one line at a time) so we don't keep the full 120 MB decompressed CSV
// in memory simultaneously while building rollups.
export interface ObfColumns {
  brands: number
  labels: number
}

// Resolve the brands_tags / labels_tags column positions from the dump's
// header row instead of hardcoding them. OBF occasionally reorders columns;
// a hardcoded index would then silently read the wrong field. Throwing here
// turns that into a loud failure at ingest start.
export function resolveObfColumns(headerLine: string): ObfColumns {
  const cols = headerLine.split('\t')
  const brands = cols.indexOf('brands_tags')
  const labels = cols.indexOf('labels_tags')
  if (brands === -1 || labels === -1) {
    throw new Error(
      `OBF header missing expected columns (brands_tags=${brands}, labels_tags=${labels}). ` +
        'Dump format changed — update the ingest mapping.'
    )
  }
  return { brands, labels }
}

export function parseObfCsvLine(line: string, columns: ObfColumns): ObfRow | null {
  if (line.length === 0) return null
  const cols = line.split('\t')
  if (cols.length <= Math.max(columns.brands, columns.labels)) return null
  const brandTags = cols[columns.brands]
    ? cols[columns.brands].split(',').filter((t) => t.length > 0)
    : []
  const labelTags = cols[columns.labels]
    ? cols[columns.labels].split(',').filter((t) => t.length > 0)
    : []
  if (brandTags.length === 0 && labelTags.length === 0) return null
  return { brandTags, labelTags }
}
