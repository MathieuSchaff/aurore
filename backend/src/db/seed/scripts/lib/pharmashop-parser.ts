/**
 * pharmashop-parser.ts — pure parser for Pharmashop scrapper output.
 *
 * Input  : the textual content of a single product `description.txt` file (or the
 *          flat `*_html.txt` variant that lives at the root of `output/product-details/`).
 * Output : `ParsedPharmashopProduct` capturing URL, slug, brand, title, format, prices,
 *          full description, raw INCI text (still upper-cased markup), and usage tips.
 *
 * The parser does NOT touch INCI cleanup or kind/unit inference — those live in
 * `migration-helpers.ts` and run on top of this output inside the pipeline script.
 */

export interface ParsedPharmashopProduct {
  url: string
  /** Last URL path segment, no `.html`. */
  slug: string
  /** Free-form brand label, taken from the `LA MARQUE …` heading. */
  brand: string
  /** Raw caps title — may still contain brand prefix and trailing volume. */
  title: string
  /** Barcode / EAN. */
  ref: string
  /** Untouched `Ref :` middle field, e.g. `Tube 50ml`, `Flacon Pompe 1L`. */
  formatText: string
  totalAmount: number
  amountUnit: string
  /** Container hint derived from formatText (`tube`, `bottle`, `jar`, …). Empty if unknown. */
  unitHint: string
  /** Discounted price (or list price when no discount). */
  priceCents: number
  /** Pre-discount list price. Equals priceCents when no discount. */
  priceCentsList: number
  /** Full DESCRIPTION block (paragraphs preserved). */
  description: string
  /** Raw INCI paragraph extracted from COMPOSITION (still mixed-case). */
  inciRaw: string
  /** Full CONSEILS D'UTILISATION block. */
  conseils: string
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function parsePharmashopDescription(text: string): ParsedPharmashopProduct | null {
  const lines = text.split(/\r?\n/)

  const urlLine = lines.find((l) => l.startsWith('URL:'))
  if (!urlLine) return null
  const url = urlLine.replace(/^URL:\s*/, '').trim()
  const slug = extractSlugFromUrl(url)

  // Anchor: title is the line directly above "Ajouter à ma liste …".
  const ajouterIdx = lines.findIndex((l) => /Ajouter\s+[àa]\s+ma\s+liste/i.test(l))
  if (ajouterIdx < 1) return null
  const title = lines[ajouterIdx - 1].trim()
  if (!title) return null

  // Ref line lives in the few lines right after the title block.
  let ref = ''
  let formatText = ''
  const refLine = lines.slice(ajouterIdx + 1, ajouterIdx + 6).find((l) => /^Ref\s*:/i.test(l))
  if (refLine) {
    const parsed = parseRefLine(refLine)
    ref = parsed.ref
    formatText = parsed.formatText
  }

  const { totalAmount, amountUnit, unitHint } = parseFormat(formatText)

  // Price block: standalone "XX,XX € [YY,YY €]" line between title and "Quantité:".
  let priceCents = 0
  let priceCentsList = 0
  const quantiteIdx = lines.findIndex((l, i) => i > ajouterIdx && /^Quantit[ée]\s*:/i.test(l))
  const priceEnd = quantiteIdx > ajouterIdx ? quantiteIdx : lines.length
  for (let i = ajouterIdx; i < priceEnd; i++) {
    const m = lines[i].match(/^\s*([\d][\d\s.,]*)\s*€(?:\s+([\d][\d\s.,]*)\s*€)?\s*$/)
    if (!m) continue
    const a = parseEuroToCents(m[1])
    if (m[2]) {
      priceCentsList = a
      priceCents = parseEuroToCents(m[2])
    } else {
      priceCents = a
      priceCentsList = a
    }
    break
  }

  // Sections
  const sections = extractSections(lines)
  const description = sections.DESCRIPTION ?? ''
  const compositionBlock = sections.COMPOSITION ?? ''
  const conseils = sections.CONSEILS ?? ''

  // Brand: prefer the "LA MARQUE …" section heading, fall back to URL path or breadcrumb.
  // The heading is reliably all-caps in Pharmashop output. Lower-cased "La marque" appears
  // in prose paragraphs (e.g. "La marque Biarritz propose…") and must NOT match.
  let brand = ''
  const marqueHeader = lines.find((l) => /^LA\s+MARQUE\s+.+/.test(l.trim()))
  if (marqueHeader) {
    brand = marqueHeader.trim().replace(/^LA\s+MARQUE\s+/, '').trim()
  }
  if (!brand) brand = extractBrandFromUrl(url)
  if (!brand) brand = extractBrandFromBreadcrumb(lines, ajouterIdx)

  const inciRaw = extractInciFromComposition(compositionBlock)

  return {
    url,
    slug,
    brand,
    title,
    ref,
    formatText,
    totalAmount,
    amountUnit,
    unitHint,
    priceCents,
    priceCentsList,
    description,
    inciRaw,
    conseils,
  }
}

// ─── URL / breadcrumb helpers ───────────────────────────────────────────────

export function extractSlugFromUrl(url: string): string {
  // Strip query/fragment then take the last path segment minus .html.
  const noQuery = url.split('?')[0].split('#')[0]
  const m = noQuery.match(/\/([^/]+)\.html?$/i)
  return m ? m[1] : ''
}

function extractBrandFromUrl(url: string): string {
  const noQuery = url.split('?')[0]
  const m = noQuery.match(/pharmashopdiscount\.com\/[a-z]{2}\/([^/]+)\/([^/]+)\//i)
  if (!m) return ''
  // /<section>/<brand>/...  e.g. /fr/beaute/eucerin/...
  // /<section>/<subsection>/<brand>/... — caught later by URL fallback
  // The 2nd segment is usually the brand for /fr/beaute/<brand>/. Assume that here.
  return m[2]
}

function extractBrandFromBreadcrumb(lines: string[], ajouterIdx: number): string {
  // Breadcrumb: Accueil → Beauté|… → Brand → [Subcat] → TITLE
  // Title is at lines[ajouterIdx - 1]. Walk up looking for the second non-empty line above
  // that is not itself the title repeat / discount badge.
  const ignored = /^(?:-?\d+%|\(Photo non contractuelle\))\s*$/
  for (let i = ajouterIdx - 2; i >= 0; i--) {
    const v = lines[i].trim()
    if (!v) continue
    if (ignored.test(v)) continue
    if (v === lines[ajouterIdx - 1].trim()) continue
    if (/^Accueil$/i.test(v)) return ''
    // Stop on the first plausible brand-cell (Title-Cased word, not all caps, not a section header).
    if (/^[A-ZÀ-ÿ][\wÀ-ÿ \-’']*$/.test(v) && v.length < 60) return v
  }
  return ''
}

// ─── Ref / format ───────────────────────────────────────────────────────────

export function parseRefLine(line: string): { ref: string; formatText: string } {
  // "Ref : 4005800350504 -  Tube 50ml -  Prix au kg/L : 293,25 €"
  // "Ref : 3574661618869 -  Flacon Pompe 1L - "          ← no price-per-L
  // The format block always sits between the first " - " and the next " - ".
  const refMatch = line.match(/^Ref\s*:\s*([^\s-][^-]*?)\s+-\s+(.+?)(?:\s+-\s*(?:Prix\s+au|$).*)?$/i)
  if (!refMatch) return { ref: '', formatText: '' }
  return { ref: refMatch[1].trim(), formatText: refMatch[2].trim() }
}

const FORMAT_KEYWORDS: Array<[RegExp, string]> = [
  [/\bcompte[\s-]gouttes\b/i, 'dropper'],
  [/\bpipette\b/i, 'dropper'],
  [/\broll[\s-]on\b/i, 'roller'],
  [/\bpulv[eé]risateur\b/i, 'spray'],
  [/\bspray\b/i, 'spray'],
  [/\bstick\b/i, 'stick'],
  [/\bpot\b/i, 'jar'],
  [/\btube\b/i, 'tube'],
  [/\bflacon\b/i, 'bottle'],
  [/\ba[ée]rosol\b/i, 'aerosol'],
  [/\bsachet\b/i, 'sachet'],
  // "Recharge" / "Eco-Recharge" containers carry no canonical unit value in the seed
  // schema — leave the hint empty so downstream inferUnit picks the right one from kind.
]

export function parseFormat(formatText: string): { totalAmount: number; amountUnit: string; unitHint: string } {
  const m = formatText.match(/(\d+(?:[.,]\d+)?)\s*(ml|cl|l|kg|mg|oz|g)\b/i)
  const totalAmount = m ? parseFloat(m[1].replace(',', '.')) : 0
  const amountUnit = m ? m[2].toLowerCase() : ''

  let unitHint = ''
  for (const [re, u] of FORMAT_KEYWORDS) {
    if (re.test(formatText)) { unitHint = u; break }
  }
  return { totalAmount, amountUnit, unitHint }
}

export function parseEuroToCents(s: string): number {
  // "1 260,83" → 1260.83 ; "14,66" → 14.66 ; "12.85" → 12.85
  const cleaned = s.replace(/\s/g, '').replace(',', '.')
  const n = parseFloat(cleaned)
  if (!isFinite(n) || n < 0) return 0
  return Math.round(n * 100)
}

// ─── Section split ──────────────────────────────────────────────────────────

// All-caps anchors only — Pharmashop section headings are reliably uppercase. Matching
// case-insensitively would catch lowercase prose mentions (e.g. "La marque X propose…")
// inside the DESCRIPTION block and split sections incorrectly.
const SECTION_HEADERS: Array<{ key: 'DESCRIPTION' | 'COMPOSITION' | 'CONSEILS' | 'MARQUE' | 'BESTSELLERS' | 'AVIS' | 'POINTS'; re: RegExp }> = [
  { key: 'DESCRIPTION', re: /^DESCRIPTION$/ },
  { key: 'COMPOSITION', re: /^COMPOSITION$/ },
  { key: 'CONSEILS', re: /^CONSEILS\s+D[' ’‘`]\s*UTILISATION$/ },
  { key: 'MARQUE', re: /^LA\s+MARQUE\s+.+/ },
  { key: 'BESTSELLERS', re: /^LES\s+BEST[\s-]SELLERS\s+.+/ },
  { key: 'AVIS', re: /^\s*AVIS\s+CLIENTS\s*$/ },
  { key: 'POINTS', re: /^\s*POINTS\s+FID[ÉE]LIT[ÉE]\s*$/ },
]

export function extractSections(lines: string[]): Partial<Record<'DESCRIPTION' | 'COMPOSITION' | 'CONSEILS' | 'MARQUE' | 'BESTSELLERS' | 'AVIS' | 'POINTS', string>> {
  const sections: Record<string, string> = {}
  let currentKey = ''
  let buffer: string[] = []

  const flush = () => {
    if (currentKey) sections[currentKey] = buffer.join('\n').trim()
    buffer = []
  }

  for (const line of lines) {
    const trimmed = line.trim()
    let matched = false
    for (const h of SECTION_HEADERS) {
      if (h.re.test(trimmed)) {
        flush()
        currentKey = h.key
        matched = true
        break
      }
    }
    if (!matched && currentKey) buffer.push(line)
  }
  flush()
  return sections as ReturnType<typeof extractSections>
}

// ─── INCI extraction from COMPOSITION block ─────────────────────────────────

const INCI_PARAGRAPH_BLOCKERS: RegExp[] = [
  /^pour\s+la\s+composition\s+et\s+les\s+ingr[eé]dients/i,
  /^merci\s+de\s+vous\s+r[eé]f[eé]rer/i,
  /^test[eé]e?\s+(sous|cliniquement)/i,
  /^vegan,?\s+sans/i,
  /^la\s+liste\s+des\s+ingr[eé]dients\s+peut\s+[eê]tre/i,
  /^les\s+listes\s+d[' ’‘`]ingr[eé]dients/i,
  /^\d+\s*%\s+(?:du\s+total|des\s+ingr[eé]dients)/i,
  /^conseils?\s+d[' ’‘`]utilisation/i,
  /^mode\s+d[' ’‘`]emploi/i,
  /^\*+\s*ingr[eé]dients/i,
  /^composition\s+susceptible/i,
  /^veuillez\s+lire/i,
]

// Common ingredient tokens. A paragraph containing any of these is almost certainly
// the INCI list, regardless of which separator the source uses (`,`, `. `, ` - `, `•`).
const INCI_HALLMARK = /\b(?:aqua|water|glycerin|cetearyl\s+alcohol|sodium\s+(?:laureth|lauryl|cocoate|olivate)|helianthus|butyrospermum|caprylic\/capric|alcohol\s+denat|dimethicone|phenoxyethanol|tocopherol|titanium\s+dioxide|parfum|fragrance|niacinamide|prunus\s+amygdalus|olea\s+europaea|cocos\s+nucifera|paraffinum\s+liquidum)\b/i

// Token separators: commas, periods, bullets, " - " (dash with surrounding spaces).
const INCI_SEP_RE = /[,•]|\.\s+|\s+-\s+/g

export function extractInciFromComposition(block: string): string {
  if (!block) return ''
  const paragraphs = block
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  if (paragraphs.length === 0) return ''

  const scored = paragraphs
    .filter((p) => !INCI_PARAGRAPH_BLOCKERS.some((re) => re.test(p)))
    .map((p) => {
      const seps = (p.match(INCI_SEP_RE) || []).length
      const hasHallmark = INCI_HALLMARK.test(p)
      const len = p.length
      // Hallmark is the strong signal — bias score so any paragraph carrying a known
      // INCI starter beats every paragraph without one.
      const score = (hasHallmark ? 10000 : 0) + seps + (len >= 100 ? 50 : 0)
      return { p, seps, len, hasHallmark, score }
    })
    .filter((c) => c.hasHallmark || (c.seps >= 5 && c.len >= 80))
    .sort((a, b) => b.score - a.score || b.len - a.len)

  return scored[0]?.p ?? ''
}
