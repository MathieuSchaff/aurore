// fallow-ignore-file unused-file
// One-shot: strip marketing prose prefix from products.inci by truncating
// to the last occurrence of "Ingrédients :" / "INCI :".
// Covers cases the anchored stripPreamble can't reach: prose blurb then
// the real header mid-string (korean-skincare.fr scrapes).
// Dry-run by default. Pass --apply to UPDATE.
import { SQL } from 'bun'

const apply = process.argv.includes('--apply')

// Marker: "Ingrédients :" / "Ingredients :" / "INCI :" — case-insensitive,
// optional plural-final s on "Ingrédients".
const MARKER_RX = /(ingredients?|ingrédients?|inci)\s*:\s*/gi

// Prose detectors — used to bucket previews, not to gate strip (strip is
// safe whenever marker exists; idempotent if no prose).
const PROSE_RX =
  /(Conseils d'utilisation|Recommandé pour|Découvre|Sa formule|sa texture|Applique\b|Améliore ta routine|ton allié)/i

// Quality filter on stripped result.
const MIN_LEN = 50
const MIN_COMMAS = 5

function cutAfterMarker(
  inci: string,
  hasProse: boolean
): { stripped: string; skipReason?: string } | null {
  const matches = [...inci.matchAll(MARKER_RX)]
  if (matches.length === 0) return null
  // Single marker → safe strip (covers anchored preamble residue + svr/garancia
  // single-section noise prefix like "LAB20.04 - INGREDIENTS :").
  // Multi-marker → only strip-to-last when prose detected (korean prose case).
  // Multi-marker without prose = likely bundle/coffret (Garancia trousse) —
  // taking either first or last loses sibling INCI sections, so skip.
  if (matches.length > 1 && !hasProse) {
    return { stripped: inci, skipReason: 'multi-marker bundle (no prose)' }
  }
  const last = matches[matches.length - 1]
  if (last.index === undefined) return null
  return { stripped: inci.slice(last.index + last[0].length).trimStart() }
}

const sql = new SQL(process.env.DATABASE_URL ?? 'postgres://app:devpassword@app_db:5432/appdb')

const rows = await sql<Array<{ id: string; slug: string; inci: string }>>`
  SELECT id, slug, inci
  FROM products
  WHERE inci IS NOT NULL
    AND inci ~* '(ingredients?|ingrédients?|inci)[[:space:]]*:'
`

console.log(`Marker-bearing rows: ${rows.length}`)

let updated = 0
let skippedQuality = 0
let skippedIdempotent = 0
let skippedBundle = 0
const previewsProse: Array<{ slug: string; before: string; after: string }> = []
const previewsNoProse: Array<{ slug: string; before: string; after: string }> = []
const previewsBundle: Array<{ slug: string; preview: string }> = []
const dropped: Array<{ slug: string; reason: string; preview: string }> = []

for (const row of rows) {
  const hasProse = PROSE_RX.test(row.inci)
  const result = cutAfterMarker(row.inci, hasProse)
  if (result === null) continue
  if (result.skipReason) {
    skippedBundle++
    if (previewsBundle.length < 5)
      previewsBundle.push({ slug: row.slug, preview: row.inci.slice(0, 180) })
    continue
  }
  const stripped = result.stripped
  if (stripped === row.inci) {
    skippedIdempotent++
    continue
  }

  const commas = (stripped.match(/,/g) ?? []).length
  if (stripped.length < MIN_LEN || commas < MIN_COMMAS) {
    if (dropped.length < 10)
      dropped.push({
        slug: row.slug,
        reason: `len=${stripped.length} commas=${commas}`,
        preview: stripped.slice(0, 120),
      })
    skippedQuality++
    continue
  }

  const bucket = hasProse ? previewsProse : previewsNoProse
  if (bucket.length < 6) {
    bucket.push({ slug: row.slug, before: row.inci.slice(0, 140), after: stripped.slice(0, 140) })
  }

  if (apply) {
    await sql`UPDATE products SET inci = ${stripped} WHERE id = ${row.id}`
  }
  updated++
}

console.log(`\n=== Prose-prefixed (${previewsProse.length} samples) ===`)
for (const p of previewsProse) {
  console.log(`\n  ${p.slug}`)
  console.log(`    before: ${p.before}`)
  console.log(`    after:  ${p.after}`)
}

console.log(`\n=== Header-only, no prose (${previewsNoProse.length} samples) ===`)
for (const p of previewsNoProse) {
  console.log(`\n  ${p.slug}`)
  console.log(`    before: ${p.before}`)
  console.log(`    after:  ${p.after}`)
}

if (dropped.length > 0) {
  console.log(`\n=== Dropped by quality (${dropped.length} of ${skippedQuality} shown) ===`)
  for (const d of dropped) console.log(`  ${d.slug} [${d.reason}] :: ${d.preview}`)
}

if (previewsBundle.length > 0) {
  console.log(
    `\n=== Skipped multi-marker bundles (${previewsBundle.length} of ${skippedBundle} shown) ===`
  )
  for (const b of previewsBundle) console.log(`  ${b.slug} :: ${b.preview}`)
}

console.log(
  `\n${apply ? 'Updated' : 'Would update'} ${updated} rows.` +
    `\n  skipped idempotent (marker only at start, already clean): ${skippedIdempotent}` +
    `\n  skipped quality (post-strip too short / too few commas): ${skippedQuality}` +
    `\n  skipped multi-marker bundle (no prose):                  ${skippedBundle}`
)
if (!apply) console.log('\nRe-run with --apply to commit.')

await sql.end()
