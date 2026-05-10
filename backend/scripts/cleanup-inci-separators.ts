// fallow-ignore-file unused-file
// One-shot: normalize broken INCI separators left by site-specific scrapers
// (Avène, Vichy, Eucerin, Clinique, Klorane, Ducray, La Roche-Posay, …).
//
// The parser already handles classic comma- and period-as-separator INCI, but
// trips on:
//   - Period-as-separator strings that also carry commas in chemical names
//     (PEG-40, C12-15, etc.) → `looksPeriodSeparated` heuristic falls back to
//     comma split, glueing real ingredients across periods.
//   - Pipe / middle-dot / underscore separators (Eucerin, Clarins, Clinique).
//   - Marketing tokens injected before the INCI body ("SANS PARFUM, AQUA, …").
//   - Trailing marketing prose glued to the last ingredient
//     ("…DISUCCINATE91% d'ingrédients d'origine naturelle…").
//
// Transforms are ordered, idempotent, and gated by a token-count guardrail —
// if the post-transform INCI has fewer than half the tokens of the pre-transform
// string, the row is skipped (defensive against malformed splits).
//
// Dry-run by default. Pass --apply to UPDATE.
//
// See backend/src/db/seed/docs/audits/INCI-QUALITY-AUDIT.md §6 Phase 4 item B.
import { SQL } from 'bun'

import { splitINCI, stripPreamble } from 'algo-derm'

const apply = process.argv.includes('--apply')

const tokensOf = (inci: string): number => splitINCI(stripPreamble(inci)).length

// Marketing prefix tokens: emitted *before* the INCI body by some scrapers
// (eucerin, vichy, clinique baume démaquillant). The list is conservative —
// only claims that are NOT also valid INCI ingredients.
const MARKETING_PREFIX_RX =
  /^(?:\s*(?:SANS\s+PARAB[EÈ]NES?(?:\s+ET\s+SANS\s+PARFUM)?|SANS\s+PARFUM|SANS\s+ALCOOL|SANS\s+SAVON|NON\s+COM[EÉ]DOG[EÈ]NE|CLINIQUEMENT\s+PROUV[EÉ]E?|TEST[EÉ]E?\s+SOUS\s+CONTR[OÔ]LE\s+(?:DERMATOLOGIQUE|D'ALLERGIE\s+ET\s+D'OPHTALMOLOGIE)|HYPOALLERG[EÉ]NIQUE)\s*[,;.]?\s*)+/i

// Glued chemical names where the scraper dropped a space inside a canonical
// multi-word INCI token. Whitelist — manual & narrow. Word-boundary anchored
// on both sides to avoid mangling complete forms.
const GLUED_FIXES: Array<[RegExp, string]> = [
  [/\bCAPRICTRYGLYCERIDES?\b/gi, 'CAPRIC TRIGLYCERIDES'],
  [/\bCAPRICTRIGLYCERIDE\b/gi, 'CAPRIC TRIGLYCERIDE'],
  [/\bDIPROPYLENEGLYCOL\b/gi, 'DIPROPYLENE GLYCOL'],
  [/\bSALICYLICACID\b/gi, 'SALICYLIC ACID'],
  [/\bBUTYROSPERMUMPARKII\b/gi, 'BUTYROSPERMUM PARKII'],
]

// Trailing marketing prose glued to the last ingredient. Triggers when a
// percentage or capitalised French marketing word is glued (no separator)
// onto a preceding uppercase token.
//   "…DISUCCINATE91% d'ingrédients d'origine naturelle…"
//   "…EXTRACT99% d'origine naturelle…"
// Cut at the digit boundary or marketing word boundary, keep the ingredient.
const TAIL_PROSE_RX =
  /([A-Z]{4,})(\d{1,3}\s*%|\s*\*?\s*(?:Pour la liste|Présente dans|Apaise|d'ingrédients d'origine|Ingrédient(?:s)?\s+issu|Issu de l'agriculture|Recommandé pour|Conseil(?:s)?\s+d'utilisation))/

const stripMarketingPrefix = (inci: string): string => inci.replace(MARKETING_PREFIX_RX, '')

const stripTailProse = (inci: string): string => {
  const m = inci.match(TAIL_PROSE_RX)
  if (!m || m.index === undefined) return inci
  return inci.slice(0, m.index + m[1].length).trimEnd()
}

// Period-as-separator: at least 4 period-then-letter occurrences indicates
// period is the list delimiter. Replace `\.\s+` with `, ` between letters.
// Allow lowercase RHS (italian/spanish "Aqua purificata. Cocamide dea…") and
// trailing `*` (Klorane natural-origin marker: "GLYCERIN*. PANTHENOL.").
const PERIOD_SEP_RX = /([a-zA-Z)\]*\d])\.\s+(?=[A-Za-z\d])/g
const periodSepCount = (inci: string): number => (inci.match(PERIOD_SEP_RX) ?? []).length
const normalizePeriodSeparator = (inci: string): string =>
  periodSepCount(inci) >= 4 ? inci.replace(PERIOD_SEP_RX, '$1, ') : inci

// Underscore-as-separator: only fire when `_` appears ≥3 times between
// uppercase letters (catches Clinique superdefense, leaves `BETA_GLUCAN`).
const underscoreSepCount = (inci: string): number => (inci.match(/[A-Z]_[A-Z]/g) ?? []).length
const normalizeUnderscoreSeparator = (inci: string): string =>
  underscoreSepCount(inci) >= 3 ? inci.replace(/([A-Z])_([A-Z])/g, '$1, $2') : inci

// Pipe and middle-dot are unambiguous list separators when they appear.
// `·` (U+00B7 middle dot, Clarins) and `•` (U+2022 bullet, Uriage) both occur.
const normalizePipe = (inci: string): string => inci.replace(/\s*\|\s*/g, ', ')
const normalizeMiddleDot = (inci: string): string => inci.replace(/\s*[·•]\s*/g, ', ')

// Collapse whitespace runs (line breaks inside ingredient names from scrapers).
// Do NOT normalize `,\s*` spacing — `1,2-HEXANEDIOL` MUST keep `,` followed by
// digit, otherwise the parser's `commaSeparator = /,(?!\d)/` splits the
// chemical token across the comma.
const collapseWhitespace = (inci: string): string => inci.replace(/\s+/g, ' ').trim()

const applyGluedFixes = (inci: string): string =>
  GLUED_FIXES.reduce((acc, [rx, sub]) => acc.replace(rx, sub), inci)

type Transform = { name: string; fn: (s: string) => string }

const TRANSFORMS: Transform[] = [
  { name: 'whitespace', fn: collapseWhitespace },
  { name: 'pipe', fn: normalizePipe },
  { name: 'middle-dot', fn: normalizeMiddleDot },
  { name: 'underscore-sep', fn: normalizeUnderscoreSeparator },
  { name: 'period-sep', fn: normalizePeriodSeparator },
  { name: 'glued-chem', fn: applyGluedFixes },
  { name: 'marketing-prefix', fn: stripMarketingPrefix },
  { name: 'tail-prose', fn: stripTailProse },
  { name: 'whitespace-final', fn: collapseWhitespace },
]

type Step = { name: string; before: string; after: string }

function runPipeline(inci: string): { final: string; touched: string[]; steps: Step[] } {
  let cur = inci
  const touched: string[] = []
  const steps: Step[] = []
  for (const t of TRANSFORMS) {
    const next = t.fn(cur)
    if (next !== cur) {
      touched.push(t.name)
      steps.push({ name: t.name, before: cur, after: next })
      cur = next
    }
  }
  return { final: cur, touched, steps }
}

const sql = new SQL(process.env.DATABASE_URL ?? 'postgres://app:devpassword@app_db:5432/appdb')

const rows = await sql<Array<{ id: string; slug: string; inci: string }>>`
  SELECT id, slug, inci FROM products WHERE inci IS NOT NULL
`

console.log(`Scanning ${rows.length} products with INCI.\n`)

let touched = 0
let skippedGuardrail = 0
let skippedNoop = 0
const byTransform = new Map<string, number>()
const previews: Array<{ slug: string; touched: string[]; before: string; after: string }> = []
const guardrailDrops: Array<{
  slug: string
  before: string
  after: string
  tokensBefore: number
  tokensAfter: number
}> = []

for (const row of rows) {
  const { final, touched: ts } = runPipeline(row.inci)
  if (final === row.inci) {
    skippedNoop++
    continue
  }

  const tBefore = tokensOf(row.inci)
  const tAfter = tokensOf(final)
  // Guardrail: token count must not collapse to <50% of original (and ≥3 tokens
  // total after — defensive against transforms eating the whole INCI).
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
  for (const t of ts) byTransform.set(t, (byTransform.get(t) ?? 0) + 1)
  if (previews.length < 12)
    previews.push({
      slug: row.slug,
      touched: ts,
      before: row.inci.slice(0, 180),
      after: final.slice(0, 180),
    })

  if (apply) await sql`UPDATE products SET inci = ${final} WHERE id = ${row.id}`
}

console.log(`Touched: ${touched}`)
console.log(`Skipped noop: ${skippedNoop}`)
console.log(`Skipped guardrail (token count halved): ${skippedGuardrail}`)
console.log(`\nBy transform:`)
for (const [name, n] of [...byTransform.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${name.padEnd(20)} ${n}`)
}

console.log(`\n=== Previews ===`)
for (const p of previews) {
  console.log(`\n  ${p.slug}  [${p.touched.join(', ')}]`)
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
