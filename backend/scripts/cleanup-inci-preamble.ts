// One-shot: strip "Ingrédients :" / "Composition :" / "INCI :" preamble
// from products.inci. Aligns DB with what the auto-tag orchestrator already
// sees via stripMarketingPreamble — but anchored at start only (Phase 1.1
// scope per INCI-QUALITY-AUDIT.md §6). Prose-contamination is deferred to
// Phase 2.5.
//
// Dry-run by default. Pass --apply to UPDATE. After --apply, regenerate the
// snapshot: `just db-snapshot` then re-run scripts/audit-inci-quality.ts to
// confirm the preamble bucket dropped to 0.
import { SQL } from 'bun'

// Mirrors audit-inci-quality.ts PREAMBLE_RX exactly (anchored, case-insensitive)
// plus a trailing \s* so the replacement also eats post-colon spaces.
const PREAMBLE_DETECT_RX = /^(ingredients?|ingrédients?|composition|inci)\s*[:-]/i
const PREAMBLE_STRIP_RX = /^(ingredients?|ingrédients?|composition|inci)\s*[:-]\s*/i

const apply = process.argv.includes('--apply')
const sql = new SQL(process.env.DATABASE_URL ?? 'postgres://app:devpassword@app_db:5432/appdb')

const rows = await sql<Array<{ id: string; slug: string; inci: string }>>`
  SELECT id, slug, inci
  FROM products
  WHERE inci IS NOT NULL AND length(inci) > 10
`

const matched = rows.filter((r) => PREAMBLE_DETECT_RX.test(r.inci))
console.log(`Matched ${matched.length} / ${rows.length} products with preamble.\n`)

let updated = 0
for (const row of matched) {
  const stripped = row.inci.replace(PREAMBLE_STRIP_RX, '').trimStart()
  if (stripped === row.inci) continue
  if (updated < 5) {
    console.log(`  ${row.slug}`)
    console.log(`    before: ${row.inci.slice(0, 90)}`)
    console.log(`    after:  ${stripped.slice(0, 90)}\n`)
  }
  if (apply) {
    await sql`UPDATE products SET inci = ${stripped} WHERE id = ${row.id}`
  }
  updated++
}

console.log(`${apply ? 'Updated' : 'Would update'} ${updated} rows.`)
if (!apply) console.log('Re-run with --apply to commit.')
