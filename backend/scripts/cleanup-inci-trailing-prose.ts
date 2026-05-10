// fallow-ignore-file unused-file
// One-shot: strip trailing marketing/legal prose glued after the INCI body.
//
// L'Oréal-family scrapers (Redken, LRP, Vichy) append a French legal
// disclaimer ("Les listes d'ingrédients entrant dans la composition…
// vous êtes invités à lire la liste d'ingrédients … utilisation personnelle")
// directly to the INCI string. The disclaimer carries no INCI signal and
// pollutes top-unmatched audit buckets (30 products, ~600 spurious tokens).
//
// Separate from cleanup-inci-prose.ts (which strips prose PREFIX before
// "Ingrédients :" markers) — trailing disclaimer has no marker to anchor on.
//
// Dry-run by default. Pass --apply to UPDATE.
//
// See backend/src/db/seed/docs/audits/INCI-QUALITY-AUDIT.md §6 Phase 4 item M.
import { SQL } from 'bun'

import { splitINCI, stripPreamble } from 'algo-derm'

const apply = process.argv.includes('--apply')

const tokensOf = (inci: string): number => splitINCI(stripPreamble(inci)).length

// L'Oréal-family disclaimer. Anchored on the unique "Les listes
// d['/'/’]ingr[ée]dients entrant dans la composition" header and the
// closing "utilisation personnelle". Accepts ASCII (') and curly (’)
// apostrophes plus accent variants.
const DISCLAIMER_RX =
  /\s*Les\s+listes\s+d['’']ingr[ée]dients\s+entrant\s+dans\s+la\s+composition[\s\S]*?utilisation\s+personnelle\.?\s*$/iu

// Standalone "Avant d'utiliser…" closure — defensive, mirrors the prompt's
// listed variant. Currently 0 hits in corpus but cheap to keep.
const SHORT_DISCLAIMER_RX =
  /\s*Avant\s+d['’']utiliser\s+un\s+produit[\s\S]*?utilisation\s+personnelle\.?\s*$/iu

// Run as a single transform: only touch rows where a disclaimer regex
// actually matched, then trim residual separators on the result. Avoids
// firing on every product that happens to end with a period.
function stripTrailingDisclaimer(inci: string): { final: string; matched: boolean } {
  let cur = inci
  let matched = false
  const next1 = cur.replace(DISCLAIMER_RX, '')
  if (next1 !== cur) {
    matched = true
    cur = next1
  }
  const next2 = cur.replace(SHORT_DISCLAIMER_RX, '')
  if (next2 !== cur) {
    matched = true
    cur = next2
  }
  if (!matched) return { final: inci, matched: false }
  return { final: cur.replace(/[\s,.;]+$/u, '').trim(), matched: true }
}

const sql = new SQL(process.env.DATABASE_URL ?? 'postgres://app:devpassword@app_db:5432/appdb')

const rows = await sql<Array<{ id: string; slug: string; inci: string }>>`
  SELECT id, slug, inci FROM products WHERE inci IS NOT NULL
`

console.log(`Scanning ${rows.length} products with INCI.\n`)

let touched = 0
let skippedGuardrail = 0
let skippedNoop = 0
const previews: Array<{ slug: string; before: string; after: string }> = []
const guardrailDrops: Array<{
  slug: string
  before: string
  after: string
  tokensBefore: number
  tokensAfter: number
}> = []

for (const row of rows) {
  const { final, matched } = stripTrailingDisclaimer(row.inci)
  if (!matched) {
    skippedNoop++
    continue
  }

  const tBefore = tokensOf(row.inci)
  const tAfter = tokensOf(final)
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

  touched++
  if (previews.length < 12)
    previews.push({
      slug: row.slug,
      before: row.inci.slice(Math.max(0, row.inci.length - 220)),
      after: final.slice(Math.max(0, final.length - 220)),
    })

  if (apply) await sql`UPDATE products SET inci = ${final} WHERE id = ${row.id}`
}

console.log(`Touched: ${touched}`)
console.log(`Skipped noop: ${skippedNoop}`)
console.log(`Skipped guardrail (token count halved): ${skippedGuardrail}`)

console.log(`\n=== Previews (tail ~220 chars) ===`)
for (const p of previews) {
  console.log(`\n  ${p.slug}`)
  console.log(`    before: …${p.before}`)
  console.log(`    after:  …${p.after}`)
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
