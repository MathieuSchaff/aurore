import { SQL } from 'bun'

import { cleanInciString, splitINCI, stripPreamble } from 'algo-derm'

import { qualifyInciInput } from '../../../../lib/inci-input-quality'
import { foldKnownInciLines } from '../../../../lib/inci-line-breaks'

const args = process.argv.slice(2)
for (const arg of args) {
  if (arg !== '--apply') throw new Error(`Unknown argument: ${arg}`)
}

// Dry-run by default. Pass --apply to UPDATE.
const apply = args.includes('--apply')

const tokensOf = (inci: string): number => splitINCI(stripPreamble(inci)).length

const sql = new SQL(process.env.DATABASE_URL ?? 'postgres://app:devpassword@app_db:5432/appdb')

const rows = await sql<Array<{ id: string; slug: string; inci: string }>>`
  SELECT id, slug, inci FROM products WHERE inci IS NOT NULL
`

console.log(`Scanning ${rows.length} products with INCI.\n`)

let touched = 0
let skippedGuardrail = 0
let skippedUnresolvedLines = 0
let skippedDamageEvidence = 0
let skippedNoop = 0
let skippedStaleRows = 0
const previews: Array<{ slug: string; before: string; after: string }> = []
const guardrailDrops: Array<{
  slug: string
  before: string
  after: string
  tokensBefore: number
  tokensAfter: number
}> = []

for (const row of rows) {
  // The cleaner erases line boundaries even when both readings have the same token count
  const prepared = foldKnownInciLines(row.inci)
  if (prepared === null) {
    skippedUnresolvedLines++
    continue
  }
  const final = cleanInciString(prepared)
  if (final === row.inci) {
    skippedNoop++
    continue
  }

  // Losing a truncation marker would let later tagging infer absences from damaged input
  const finalQuality = qualifyInciInput(final)
  if (qualifyInciInput(row.inci).reasons.some((reason) => !finalQuality.reasons.includes(reason))) {
    skippedDamageEvidence++
    continue
  }

  const tBefore = tokensOf(row.inci)
  const tAfter = tokensOf(final)
  // Guardrail: skip if the clean drops below 3 tokens or under 50% of the original count;
  // defends against a transform eating the list.
  if (tAfter < 3 || tAfter * 2 < tBefore) {
    skippedGuardrail++
    if (guardrailDrops.length < 6)
      guardrailDrops.push({
        slug: row.slug,
        before: row.inci.slice(0, 160),
        after: final.slice(0, 160),
        tokensBefore: tBefore,
        tokensAfter: tAfter,
      })
    continue
  }

  if (apply) {
    // An edit after selection must not be replaced by a proposal from the old INCI
    const updated = await sql<Array<{ id: string }>>`
      UPDATE products SET inci = ${final}
      WHERE id = ${row.id} AND inci = ${row.inci}
      RETURNING id
    `
    if (updated.length === 0) {
      skippedStaleRows++
      continue
    }
  }

  touched++
  if (previews.length < 12)
    previews.push({
      slug: row.slug,
      before: row.inci.slice(0, 180),
      after: final.slice(0, 180),
    })
}

console.log(`Touched: ${touched}`)
console.log(`Skipped noop: ${skippedNoop}`)
console.log(`Skipped stale rows: ${skippedStaleRows}`)
console.log(`Skipped unresolved line boundaries: ${skippedUnresolvedLines}`)
console.log(`Skipped damage evidence loss: ${skippedDamageEvidence}`)
console.log(`Skipped guardrail (token count halved): ${skippedGuardrail}`)

console.log(`\n=== Previews ===`)
for (const p of previews) {
  console.log(`\n  ${p.slug}`)
  console.log(`    before: ${p.before}`)
  console.log(`    after:  ${p.after}`)
}

if (guardrailDrops.length > 0) {
  console.log(`\n=== Guardrail drops (${guardrailDrops.length} of ${skippedGuardrail}) ===`)
  for (const d of guardrailDrops) {
    console.log(`\n  ${d.slug}  tokens=${d.tokensBefore} → ${d.tokensAfter}`)
    console.log(`    before: ${d.before}`)
    console.log(`    after:  ${d.after}`)
  }
}

console.log(`\n${apply ? 'Updated' : 'Would update'} ${touched} rows.`)
if (!apply) console.log('Re-run with --apply to commit.')

await sql.end()
