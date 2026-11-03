// One-shot: tokenize single-line INCI strings whose scraper lost separators.
// Two strategies: (1) trivial-separator split for " - " / " • " / " / " forms,
// (2) longest-match against algo-derm alias index for uppercase blobs.
// Dry-run by default. After --apply, regenerate snapshot + audit again.
import { SQL } from 'bun'

import { normalize, splitINCI } from 'algo-derm'
import { buildAliasIndex, MERGED_EVIDENCE_DB } from 'algo-derm/engine'

import { qualifyInciInput } from '../../../../lib/inci-input-quality'
import { foldKnownInciLines } from '../../../../lib/inci-line-breaks'
import { partitionInciPresence } from '../../../../lib/inci-presence'

const args = process.argv.slice(2)
// Ignoring a misspelled limit could turn an apply run into an unbounded write
if (args.some((arg) => arg !== '--apply' && !arg.startsWith('--limit='))) {
  throw new Error('Unsupported resplit argument; expected --apply or --limit=N')
}
const apply = args.includes('--apply')
const limit = (() => {
  const limits = args.filter((arg) => arg.startsWith('--limit='))
  if (limits.length > 1) throw new Error('--limit must be specified at most once')
  const arg = limits[0]
  if (!arg) return Number.POSITIVE_INFINITY
  const value = arg.slice('--limit='.length)
  const parsed = Number(value)
  if (value.trim() === '' || !Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error('--limit must be a non-negative safe integer')
  }
  return parsed
})()

const aliasIndex = buildAliasIndex(MERGED_EVIDENCE_DB)
console.log(`Alias index: ${aliasIndex.size} keys`)

const sql = new SQL(process.env.DATABASE_URL ?? 'postgres://app:devpassword@app_db:5432/appdb')
// Supplements excluded: their `inci` holds nutrition text ("Extrait de X 500 mg,
// enveloppe des gélules…") that longest-match happily shreds into noise. This caused most
// of the historical 288-row false-positive dry-run.
const rows = await sql<Array<{ id: string; slug: string; inci: string }>>`
  SELECT id, slug, inci
  FROM products
  WHERE inci IS NOT NULL AND length(inci) > 10 AND category <> 'complement'
`

// Patterns that are not INCI: pure-oil descriptors, dental fibre blurbs, "see packaging".
// These exist because the catalog mixes cosmetics with dental/supplement SKUs.
const NON_INCI_RX =
  /^(fibres |caoutchouc|tige |pour la liste|voir (la )?composition|100% |arcilla|nitrizinc|collag[èe]ne hydrolys|pulpe|butyrospermum parkii butter\*|sa formule|formule inci\s*:\s*$)/i

// Strip marketing or brand-name prefixes glued to the first ingredient.
// Caps preserved because actual INCI tokens are also caps in these strings.
const LEADING_PREFIX_RX = /^(FORMULE INCI\s*:\s*|BRUME HYDRATANTE INVISIBLE|FORMULE\s*:\s*)/i

// Numeric ranges and prefixes with one letter belong to the ingredient name
// An entity's semicolon must remain intact for later decoding
const SEPARATOR_RX =
  /(?<=\S{2})\s+-\s+(?=[A-Za-zÀ-ÿ])|\s•\s|(?<!&(?:[A-Za-z][A-Za-z\d]*|#\d+|#[xX][\dA-Fa-f]+));\s+/

function containsKnownSlashName(parts: readonly string[]): boolean {
  const first = parts[0].split(/\s+/)
  const last = parts[parts.length - 1].split(/\s+/)
  for (let start = 0; start < first.length; start++) {
    for (let end = last.length; end > 0; end--) {
      const name = [
        first.slice(start).join(' '),
        ...parts.slice(1, -1),
        last.slice(0, end).join(' '),
      ].join(' / ')
      if (aliasIndex.has(normalize(name))) return true
    }
  }
  return false
}

function splitSlashNames(part: string): string[] {
  const parts = part
    // A mass ratio slash belongs to the quantity, not a list boundary
    .split(/(?<!\d\s*mg\s*)\s\/\s|\s\/\s(?!\s*g\b)/i)
    .map((value) => value.trim())
    .filter(Boolean)
  const names: string[] = []
  for (let start = 0; start < parts.length; ) {
    let end = parts.length
    // Prefer a recognized name before treating its slash as a list boundary
    while (end > start + 1 && !containsKnownSlashName(parts.slice(start, end))) end--
    names.push(parts.slice(start, end).join(' / '))
    start = end
  }
  return names
}

function trivialSplit(inci: string): string[] | null {
  const stripped = inci.replace(LEADING_PREFIX_RX, '').trim()
  if (!SEPARATOR_RX.test(stripped) && !stripped.includes(' / ')) return null
  const parts = stripped.split(SEPARATOR_RX).flatMap(splitSlashNames)
  const cleaned = parts.map((p) => p.trim()).filter((p) => p.length > 0)
  if (cleaned.length < 2) return null
  return cleaned
}

// Longest-match resplit: walk tokens, at each position try windows of
// 5..1 against aliasIndex, longer for known names; emit matched span as 1 token, accumulate unmatched
// words into a single trailing token until next match.
const MAX_WINDOW = 5
const MAX_ALIAS_WINDOW = [...aliasIndex.keys()].reduce(
  (max, name) => Math.max(max, name.split(/\s+/).length),
  MAX_WINDOW
)
let heldNanoRegions = 0
let heldPercentageRegions = 0
let heldPpmRegions = 0
let heldMassRatioRegions = 0

function retainsDeclarationSpans(
  source: string,
  tokens: readonly string[],
  pattern: RegExp
): boolean {
  // Consume each occurrence so an intact copy cannot hide another split declaration
  let retained = tokens.join('\n')
  for (const match of source.matchAll(pattern)) {
    const declaration = match[0].replace(/\s+/g, ' ')
    if (!retained.includes(declaration)) return false
    retained = retained.replace(declaration, '\n')
  }
  return true
}

type AnnotationSpan = { start: number; end: number }

function annotationStart(source: string, index: number, spans: AnnotationSpan[]): number {
  const previous = spans.at(-1)
  if (previous && source.slice(previous.end, index).trim() === '') {
    spans.pop()
    return previous.start
  }
  const word = source.slice(0, index).match(/[^,\s;•()[\]]+\s*$/u)
  return word && /[\p{L}\p{N}]/u.test(word[0]) ? (word.index ?? index) : index
}

function closingBracket(char: string | undefined): string | null {
  if (char === '(') return ')'
  if (char === '[') return ']'
  return null
}

function annotationSpans(source: string): AnnotationSpan[] | null {
  const spans: Array<{ start: number; end: number }> = []
  const closing: string[] = []
  let start = 0
  for (let index = 0; index < source.length; index++) {
    const char = source[index]
    const expectedClosing = closingBracket(char)
    if (expectedClosing) {
      if (closing.length === 0) start = annotationStart(source, index, spans)
      closing.push(expectedClosing)
      continue
    }
    if (char !== ')' && char !== ']') continue
    if (closing.pop() !== char) return null
    if (closing.length === 0) spans.push({ start, end: index + 1 })
  }
  return closing.length > 0 ? null : spans
}

function retainsAnnotations(source: string, result: string): boolean {
  const spans = annotationSpans(source)
  if (spans === null) return false
  let retained = result.replace(/\s+/g, ' ')
  for (const span of spans) {
    const declaration = source.slice(span.start, span.end).replace(/\s+/g, ' ')
    if (!retained.includes(declaration)) return false
    retained = retained.replace(declaration, '\n')
  }
  return true
}

function retainsOptionalDeclarations(source: string, result: string): boolean {
  const optionalRegions = (inci: string) =>
    partitionInciPresence(inci)
      .filter(({ optional }) => optional)
      // List separators can change without moving text out of an optional region
      .map(({ raw }) => raw.replace(/[\s,;]+/g, ''))
  const before = optionalRegions(source)
  const after = optionalRegions(result)
  return before.length === after.length && before.every((region, index) => region === after[index])
}

function retainsInputQuality(source: string, result: string): boolean {
  const proposedQuality = qualifyInciInput(result)
  return qualifyInciInput(source).reasons.every((reason) =>
    proposedQuality.reasons.includes(reason)
  )
}

function findLongestAlias(words: string[], start: number): number | null {
  let matched: number | null = null
  const maxWindow = words.includes('/', start)
    ? words.length - start
    : Math.min(MAX_ALIAS_WINDOW, words.length - start)
  for (let n = maxWindow; n >= 1; n--) {
    const candidate = words.slice(start, start + n).join(' ')
    const norm = normalize(candidate)
    // Short aliases keep their existing annotation window
    if (n > MAX_WINDOW && !candidate.includes(' / ') && norm.split(/\s+/).length <= MAX_WINDOW)
      continue
    if (aliasIndex.has(norm)) {
      matched = n
      break
    }
  }
  return matched
}

function retainsSplitQuantities(stripped: string, out: string[]): boolean {
  if (!retainsDeclarationSpans(stripped, out, /\S+?\s*(?:\[\s*nano\s*\]|\(\s*nano\s*\))/gi)) {
    heldNanoRegions++
    return false
  }
  // A comparison or range detached from its label would become a separate list entry
  if (
    !retainsDeclarationSpans(
      stripped,
      out,
      /\S+\s+(?:\(\s*)?(?:(?:[<>]=?|[≤≥≈~])\s*)?(?:\d+(?:[.,]\d+)?|[.,]\d+)(?:[eE][+-]?\d+)?(?:\s*(?:[-\u2013\u2014\u2212]|to|à)\s*(?:\d+(?:[.,]\d+)?|[.,]\d+)(?:[eE][+-]?\d+)?)?\s*%(?:\s*\))?/gi
    )
  ) {
    heldPercentageRegions++
    return false
  }
  // A ppm quantity must keep qualifying its source word after repair
  if (
    !retainsDeclarationSpans(
      stripped,
      out,
      /\S+\s+(?:\(\s*)?(?:(?:[<>]=?|[≤≥≈~])\s*)?(?:\d+(?:[.,]\d+)?|[.,]\d+)(?:[eE][+-]?\d+)?(?:\s*(?:[-\u2013\u2014\u2212]|to|à)\s*(?:\d+(?:[.,]\d+)?|[.,]\d+)(?:[eE][+-]?\d+)?)?\s*ppm\b(?:\s*\))?/gi
    )
  ) {
    heldPpmRegions++
    return false
  }
  // A mass ratio must keep qualifying its source word after repair
  if (
    !retainsDeclarationSpans(
      stripped,
      out,
      /\S+\s+(?:\(\s*)?(?:(?:[<>]=?|[≤≥≈~])\s*)?(?:\d+(?:[.,]\d+)?|[.,]\d+)(?:[eE][+-]?\d+)?(?:\s*(?:[-\u2013\u2014\u2212]|to|à)\s*(?:\d+(?:[.,]\d+)?|[.,]\d+)(?:[eE][+-]?\d+)?)?\s*mg\s*\/\s*g\b(?:\s*\))?/gi
    )
  ) {
    heldMassRatioRegions++
    return false
  }
  return true
}

function longestMatchSplit(inci: string): string[] | null {
  const stripped = inci.replace(LEADING_PREFIX_RX, '').trim()
  const words = stripped.split(/\s+/).filter((w) => w.length > 0)
  if (words.length < 4) return null

  const out: string[] = []
  let buf: string[] = []
  let i = 0
  let matchedSpans = 0
  let unmatchedSpans = 0
  while (i < words.length) {
    const matched = findLongestAlias(words, i)
    if (matched !== null) {
      if (buf.length > 0) {
        out.push(buf.join(' '))
        buf = []
        unmatchedSpans++
      }
      out.push(words.slice(i, i + matched).join(' '))
      i += matched
      matchedSpans++
    } else {
      buf.push(words[i])
      i++
    }
  }
  if (buf.length > 0) {
    out.push(buf.join(' '))
    unmatchedSpans++
  }

  if (matchedSpans < 3) return null
  if (out.length < 2) return null
  // Tight quality filter: at least half the emitted spans must be matched,
  // otherwise the resplit is likely shredding a marketing blob into noise.
  const ratio = matchedSpans / (matchedSpans + unmatchedSpans)
  if (ratio < 0.7) return null
  if (!retainsSplitQuantities(stripped, out)) return null
  return out
}

// A glued blob is a "token" carrying this many space-separated words, well
// past the longest real INCI name (~6 words), so it cannot be a single
// ingredient.
const BLOB_WORDS = 8
const wordCount = (s: string): number => s.trim().split(/\s+/).length

const candidates = rows.filter((r) => {
  if (r.inci.length <= 80) return false
  if (NON_INCI_RX.test(r.inci)) return false
  const tokens = splitINCI(r.inci)
  if (tokens.length === 1) return true
  // Too few tokens: a few comma-tokens but one is a long space-glued blob
  // (slash-prefixed synonyms + comma-less body, e.g. "AQUA / WATER / EAU
  // AZELAIC ACID C15-19 ALKANE ...").
  return tokens.length <= 3 && tokens.some((t) => wordCount(t) >= BLOB_WORDS)
})
console.log(`Candidates: ${candidates.length}`)

let updated = 0
let trivialCount = 0
let blobCount = 0
let skipped = 0
let heldAnnotationRows = 0
let heldOptionalRows = 0
let heldDamageEvidenceRows = 0
let skippedLineBoundaries = 0
let skippedStaleRows = 0
const previews: Array<{ slug: string; strategy: string; before: string; after: string[] }> = []

for (const row of candidates) {
  if (updated >= limit) break

  // Whitespace recovery must not erase an ambiguous or unknown line boundary
  if (foldKnownInciLines(row.inci) === null) {
    skippedLineBoundaries++
    skipped++
    continue
  }

  let tokens: string[] | null = trivialSplit(row.inci)
  let strategy = 'trivial'
  if (tokens !== null) {
    // A trivial split can still leave a space-glued blob in one chunk; expand
    // those via longest-match so the comma-less tail is tokenized too.
    tokens = tokens.flatMap((p) =>
      wordCount(p) >= BLOB_WORDS ? (longestMatchSplit(p) ?? [p]) : [p]
    )
  } else {
    tokens = longestMatchSplit(row.inci)
    strategy = 'longest-match'
  }
  if (tokens === null) {
    skipped++
    continue
  }
  const recombined = tokens.reduce((joined, token) => {
    if (!joined) return token
    // Reuse a source comma instead of adding an empty list entry beside it
    const separator = joined.endsWith(',') || token.startsWith(',') ? ' ' : ', '
    return joined + separator + token
  }, '')
  if (recombined === row.inci) {
    skipped++
    continue
  }

  // A new boundary must not change a note or detach it from its preceding word
  if (!retainsAnnotations(row.inci, recombined)) {
    heldAnnotationRows++
    skipped++
    continue
  }

  // Losing a marker would turn possible ingredients into certain links
  if (!retainsOptionalDeclarations(row.inci, recombined)) {
    heldOptionalRows++
    skipped++
    continue
  }

  // Later tagging must still see every suspicion reason from the source
  if (!retainsInputQuality(row.inci, recombined)) {
    heldDamageEvidenceRows++
    skipped++
    continue
  }

  if (apply) {
    // A repair computed from an older declaration must not overwrite a concurrent edit
    const written = await sql`
      UPDATE products SET inci = ${recombined}
      WHERE id = ${row.id} AND inci = ${row.inci}
      RETURNING id
    `
    if (written.length === 0) {
      skippedStaleRows++
      skipped++
      continue
    }
  }

  if (previews.length < 12)
    previews.push({ slug: row.slug, strategy, before: row.inci, after: tokens })
  if (strategy === 'trivial') trivialCount++
  else blobCount++

  updated++
}

console.log(`\n=== Preview (${previews.length} samples) ===`)
for (const p of previews) {
  console.log(`\n  [${p.strategy}] ${p.slug}`)
  console.log(`    before: ${p.before.slice(0, 140)}`)
  console.log(
    `    after:  ${p.after.slice(0, 8).join(' | ')}${p.after.length > 8 ? ` | ... (+${p.after.length - 8})` : ''}`
  )
}

console.log(`\n${apply ? 'Updated' : 'Would update'} ${updated} rows.`)
console.log(`  trivial: ${trivialCount}`)
console.log(`  blob:    ${blobCount}`)
console.log(`  skipped: ${skipped}`)
console.log(`Nano regions kept unsplit: ${heldNanoRegions}`)
console.log(`Percentage regions kept unsplit: ${heldPercentageRegions}`)
console.log(`PPM regions kept unsplit: ${heldPpmRegions}`)
console.log(`Mass-ratio regions kept unsplit: ${heldMassRatioRegions}`)
console.log(`Annotation rows kept unchanged: ${heldAnnotationRows}`)
console.log(`Optional-declaration rows kept unchanged: ${heldOptionalRows}`)
console.log(`Damage-evidence rows kept unchanged: ${heldDamageEvidenceRows}`)
console.log(`Skipped unresolved line boundaries: ${skippedLineBoundaries}`)
console.log(`Skipped stale rows: ${skippedStaleRows}`)
if (!apply) console.log('\nRe-run with --apply to commit.')

await sql.end()
