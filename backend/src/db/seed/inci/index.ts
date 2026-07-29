/**
 * INCI-token to slug index for auto-filling candidate keyIngredients.
 *
 * Two parsing sources, first-write wins on collisions:
 *   1. ingredientData[].content markdown: `## INCI\n**Token**` block
 *   2. data/ingredients/<domain>/ingredient-slugs.ts: inline `// [INCI:] Token | desc` comments
 *
 * NON_DISCRIMINANT_TOKENS answers one question: does this token say anything about *this*
 * product? Water and glycerin do not, whatever they do to skin. It does not answer "does this
 * deserve a page" — a listed substance keeps its ingredient row, its /ingredients entry and its
 * clickable driver in the formula reading, it only never becomes a product link.
 *
 * So the index carries these tokens. Dropping them at construction hid them from the algo-derm
 * bridge, which then landed a synonym on an unblocked slug. Both cuts happen at link time
 * instead: resolveToken on the raw token, buildNonDiscriminantSlugs on the resolved slug.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ingredientData } from '../data/ingredients'
import { INGREDIENT_SLUGS } from '../data/ingredients/ingredient-slugs'

// One rule: a token belongs here only if it blocks a link measured on the corpus, or is common
// enough (>=300 of 6769 products) that a fiche written later would chip it onto thousands of
// sheets. Measured with audit-blocklist-purge.ts.
//
// The 2026-07 sweeps are retired with their criteria: algo-derm axis thresholds measured intensity,
// never how much a token tells a reader about *this* product, and the "no resolvable slug" branch
// took the absence of a fiche as proof none was wanted. Between them they listed 268 tokens that
// cut nothing at all — peptides, ferments, botanicals, CI colours — and pre-empted the fiches
// nobody had written yet.
//
// Most of the common excipients are already dropped by FILLER_SLUGS (the is_filler taxonomy), on
// the resolved slug. What this list adds is sixteen slugs that taxonomy does not carry.
//
// Entries are normalised at module load via normalizeInciToken to match real INCI conventions
// (dashes, slashes, parens, accents). The source keeps the original orthography, grep-friendly.
const NON_DISCRIMINANT_SOURCE: string[] = [
  // Solvents, humectants, preservatives, pH and chelation
  'Aqua',
  'Glycerin',
  'Alcohol',
  'Alcohol Denat',
  'Butylene Glycol',
  'Propylene Glycol',
  'Pentylene Glycol',
  'Dipropylene Glycol',
  'Methylpropanediol',
  '1,2-Hexanediol',
  'Caprylyl Glycol',
  'Parfum',
  'Phenoxyethanol',
  'Benzyl Alcohol',
  'Ethylhexylglycerin',
  'Citric Acid',
  'Sodium Hydroxide',
  'Disodium EDTA',
  'Sodium Phytate',
  'Sodium Chloride',
  'Potassium Sorbate',
  'Sodium Benzoate',
  // Texture and rheology polymers
  'Xanthan Gum',
  'Carbomer',
  'Acrylates Copolymer',
  'Acrylates/C10-30 Alkyl Acrylate Crosspolymer',
  'Ammonium Acryloyldimethyltaurate/VP Copolymer',
  'Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer',
  // Silicones
  'Dimethicone',
  // Fatty alcohols
  'Cetearyl Alcohol',
  'Cetyl Alcohol',
  'Behenyl Alcohol',
  // Emulsifiers and solubilisers
  'Glyceryl Stearate',
  'PEG-40 Hydrogenated Castor Oil',
  'Cetearyl Glucoside',
  'Polysorbate 20',
  'Polysorbate 60',
  'Polysorbate 80',
  'Sorbitan Isostearate',
  'Sorbitan Olivate',
  'Sodium Stearoyl Glutamate',
  'Hydrogenated Lecithin',
  // Bland emollients and esters
  'Caprylic/Capric Triglyceride',
  'Coco-Caprylate/Caprate',
  'Octyldodecanol',
  'Butyloctyl Salicylate',
  // `Jojoba Esters` was also kept here because the bridge lands it on `hydrolyzed-jojoba-protein`,
  // said to be a different substance. Measured 2026-07-29: it is not. algo-derm files
  // `Hydrolyzed Jojoba Esters` as an alias of this very record (CosIng 34778), so the bridge is
  // right and only the fiche was misnamed. What still justifies the entry is the first reason:
  // 183 occurrences, a bland ester that tells a reader nothing about a formula.
  'Jojoba Esters',
  // Wash surfactants present in nearly every cleanser and shampoo
  'Cocamidopropyl Betaine',
  'Sodium Cocoamphoacetate',
  'Disodium Cocoamphodiacetate',
  'Decyl Glucoside',
  'Coco-Glucoside',
  'Lauryl Glucoside',
  'Caprylyl/Capryl Glucoside',
  // Conditioning polymers
  'Polyquaternium-10',
  'Polyquaternium-7',
  'Guar Hydroxypropyltrimonium Chloride',
  // Vitamin E derivatives, trace-level stabilisers
  'Tocopherol',
  'Tocopheryl Acetate',
  'Tocopheryl Glucoside',
  // Carbohydrate carriers
  'Maltodextrin',
  // Lake pigments. The CI family was settled by the 106-token pass; these three escaped it only
  // because `Colour N Lake (CI …)` hides the code from normalizeInciToken, which erases the
  // parenthetical outright — `Blue 1 Lake (CI 42090)` normalises to `BLUE 1 LAKE` and the resolver
  // never sees 42090. Listing the wrapped spelling is what closes that hole. This is not the
  // retired sweep re-listing colours: the decision is the family's, and it was already taken.
  'Blue 1 Lake (CI 42090)',
  'Red 7 Lake (CI 15850)',
  'Yellow 5 Lake (CI 19140)',
  // pH adjuster, BUFFERING and nothing else in CosIng — same family as Citric Acid and Sodium
  // Hydroxide above.
  'Aminomethyl Propanol',
]

export const NON_DISCRIMINANT_TOKENS = new Set<string>(
  NON_DISCRIMINANT_SOURCE.map((s) => normalizeInciToken(s))
)

export type IngredientDomain = 'skincare' | 'haircare' | 'dental' | 'supplements'

export interface InciIndexEntry {
  slug: string
}

export type InciIndex = Map<string, InciIndexEntry>

const INGREDIENTS_ROOT = join(import.meta.dir, '..', 'data', 'ingredients')

const SLUG_FILES: Array<{ rel: string; domain: IngredientDomain }> = [
  { rel: 'skincare/ingredient-slugs.ts', domain: 'skincare' },
  { rel: 'haircare/ingredient-slugs.ts', domain: 'haircare' },
  { rel: 'dental/ingredient-slugs.ts', domain: 'dental' },
  { rel: 'supplements/ingredient-slugs.ts', domain: 'supplements' },
]

/**
 * For a given product category, which ingredient domains should be considered when
 * inferring keyIngredients. Skincare is a generic base included for non-skincare
 * categories so shared actives (vitamins, soothing extracts) still match. Bodycare and
 * solaire ride the skincare ingredient taxonomy; their candidates only match skincare slugs.
 */
export const CATEGORY_DOMAIN_ALLOWLIST: Record<string, IngredientDomain[]> = {
  skincare: ['skincare'],
  bodycare: ['skincare'],
  solaire: ['skincare'],
  haircare: ['haircare', 'skincare'],
  dental: ['dental', 'skincare'],
  complement: ['supplements', 'skincare'],
}

// Repair scraper-mangled delimiters before splitINCI (which only splits on commas).
// Entities decode first: the `;` inside `&lt;` must not become a comma.
// `&amp;` decodes last so `&amp;lt;` cannot cascade into a real `<`.
const HTML_ENTITY_DECODES: Array<[RegExp, string]> = [
  [/&lt;/gi, '<'],
  [/&gt;/gi, '>'],
  [/&nbsp;/gi, ' '],
  [/&trade;/gi, '™'],
  [/&reg;/gi, '®'],
  [/&Eacute;/g, 'É'],
  [/&eacute;/g, 'é'],
  [/&Egrave;/g, 'È'],
  [/&egrave;/g, 'è'],
  [/&Agrave;/g, 'À'],
  [/&agrave;/g, 'à'],
  [/&rsquo;/gi, '’'],
  [/&amp;/gi, '&'],
]

const HTML_ENTITY_OR_SEMICOLON = /&(?:#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]+);|\s*;\s*/gi

// The dash fold requires two letters on each side (trademark/asterisk markers may
// trail the left side): a digit neighbour is a mangled hyphen (`2-BROMO-2 -NITRO`,
// `C12 - 16`), a single letter a chemical prefix (`P - fenilendiammina`), `[+/-` a
// may-contain marker. Real INCI names never carry a space before a hyphen (`PEG-60`,
// `C10-30`). `repair-and-fold-inci-delimiters-v2.sql` mirrors this for the stored
// column. Keep both in sync.
export interface FoldScraperDelimiterOptions {
  foldListSeparators?: boolean
}

export function foldScraperDelimiters(
  inci: string,
  { foldListSeparators = true }: FoldScraperDelimiterOptions = {}
): string {
  const decoded = HTML_ENTITY_DECODES.reduce((acc, [rx, sub]) => acc.replace(rx, sub), inci)
  if (!foldListSeparators) return decoded

  return decoded
    .replace(HTML_ENTITY_OR_SEMICOLON, (match) => (match.startsWith('&') ? match : ', '))
    .replace(/([A-Za-zÀ-ÿ]{2}[™®*]{0,2})\s+-\s*(?=[A-Za-zÀ-ÿ]{2})/g, '$1, ')
}

// Scraper/label artefacts that hide a substance we already resolve: organic markers, supplier
// bracket notes, a paren the split cut open, formulation doses. `[nano]` folds onto the plain
// name on purpose: the two are regulatorily distinct but share one `ingredients` row today.
// Slashes are deliberately left alone: `Phytosteryl/Isostearyl/Cetyl Dimer Dilinoleate` is one
// compound name, not a double nomenclature, and splitting on them fabricates links.
// Applied before BOTH lookup paths, so keep it out of normalizeInciToken's uppercasing.
export function stripInciArtefacts(s: string): string {
  return s
    .replace(/[*†‡•°]+/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\([^)]*$/, ' ')
    .replace(/\d[\d.,]*\s*(%|ppm\b)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,;:-]+$/, '')
    .trim()
}

export function normalizeInciToken(s: string): string {
  return stripInciArtefacts(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
}

/** Pull tokens out of a `## INCI` markdown section. Returns raw (non-normalized) strings. */
export function parseInciFromContent(content: string): string[] {
  const lines = content.split('\n')
  const blockLines: string[] = []
  let inBlock = false
  for (const line of lines) {
    const trim = line.trim()
    if (/^##\s+INCI\b/i.test(trim)) {
      inBlock = true
      continue
    }
    if (!inBlock) continue
    if (/^##\s/.test(trim) || trim === '---') break
    blockLines.push(line)
  }
  if (blockLines.length === 0) return []

  const block = blockLines.join('\n')
  const boldTokens = [...block.matchAll(/\*\*([^*\n]+?)\*\*/g)].map((m) => m[1])

  let candidates: string[]
  if (boldTokens.length > 0) {
    candidates = boldTokens
  } else {
    const firstLine = blockLines.map((l) => l.trim().replace(/[`,]/g, '')).find(Boolean)
    candidates = firstLine ? [firstLine] : []
  }

  return candidates
    .flatMap((c) => c.split(/\s+ou\s+|\s*\/\s*|,/i))
    .map((t) => t.trim())
    .filter(Boolean)
}

// Preparations, never a substance on their own. Used to expand the `Juice / Extract` shorthand
// of a declaration, and to refuse the key when the expansion cannot apply.
const NOMENCLATURE_NOUNS = new Set(['EXTRACT', 'OIL', 'JUICE', 'WATER', 'POLYSACCHARIDE'])

// The plant parts an organ list enumerates (`Flower/Leaf/Stem Water`). Same rule as above: they
// qualify a species, they never name one.
const ORGAN_NOUNS = new Set([
  'BARK',
  'BUD',
  'FLOWER',
  'FRUIT',
  'KERNEL',
  'LEAF',
  'PEEL',
  'RHIZOME',
  'ROOT',
  'SEED',
  'SPROUT',
  'STEM',
])

// Never a substance: every word only qualifies one. `Stem Water` and `Leaf` are what an organ
// list leaves behind once the species name has been consumed by the head segment.
function isPartOnlyPhrase(s: string): boolean {
  const words = s.toUpperCase().split(/\s+/).filter(Boolean)
  return words.length > 0 && words.every((w) => ORGAN_NOUNS.has(w) || NOMENCLATURE_NOUNS.has(w))
}

// Grammar words an INCI name never carries. Checked casing-blind because the guard that rejects
// all-lowercase words cannot see a French note written in Title Case.
// `a` is deliberately absent: `Vitamin A` is a real declaration.
const FRENCH_GRAMMAR_WORDS = new Set([
  'au',
  'aux',
  'avec',
  'dans',
  'de',
  'des',
  'du',
  'en',
  'la',
  'le',
  'les',
  'par',
  'pour',
  'que',
  'qui',
  'sans',
  'sur',
  'un',
  'une',
])

/** Parse `SLUG_KEY: 'slug-value', // [INCI:] Token / Token | desc`. Returns null when format unfamiliar. */
export function parseInciFromSlugLine(line: string): { slug: string; tokens: string[] } | null {
  const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*:\s*['"]([^'"]+)['"]\s*,\s*\/\/\s*(.+?)\s*$/)
  if (!m) return null

  const slug = m[2]
  const comment = m[3]

  let inciSegment = comment
  if (/^INCI:\s*/i.test(comment)) {
    inciSegment = comment.replace(/^INCI:\s*/i, '')
  }
  const pipe = inciSegment.indexOf('|')
  if (pipe >= 0) inciSegment = inciSegment.slice(0, pipe)
  // A parenthesised gloss (`(butcher's broom)`, `(Biosol)`) and a dashed trailing note are
  // English prose the descriptor guard below reads as a French description, which drops the
  // whole declaration. `normalizeInciToken` erases parentheses at lookup time anyway, so
  // cutting them here changes no key.
  inciSegment = inciSegment
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s[–—-]\s.*$/, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!inciSegment) return null
  if (/['']/.test(inciSegment)) return null
  // INCI nomenclature is plain ASCII, so an accent means the comment is a French description.
  // Catches a Title-Case one the word-level guard below would wave through.
  if (/[À-ÿ]/.test(inciSegment)) return null

  // Reject French descriptors. An INCI name capitalises its substance words, but a locant can
  // be lowercase (`o-Cymen-5-ol`, `p-Cresol`) or numeric (`3-O-Ethyl Ascorbic Acid`), so the
  // test is "the word carries an uppercase letter somewhere", not "it starts with one".
  // Capitalisation alone is too weak: a French note written in Title Case passes it, which is
  // how `Category` and `Variable INCI` reached the index. Grammar words are checked casing-blind.
  const allowedLowercase = new Set(['or', 'and'])
  const words = inciSegment.split(/\s+/).filter(Boolean)
  for (const w of words) {
    const cleaned = w.replace(/[(),./&-]/g, '')
    if (!cleaned) continue
    if (FRENCH_GRAMMAR_WORDS.has(cleaned.toLowerCase())) return null
    if (!/[a-z]/i.test(cleaned)) continue
    if (/[A-Z]/.test(cleaned)) continue
    if (!allowedLowercase.has(cleaned.toLowerCase())) return null
  }

  // Split on aliases only: a comma inside a declared name belongs to it
  // (`2-Oleamido-1,3-Octadecanediol`), it never separates two names.
  const [head, ...rest] = inciSegment
    .split(/\s+ou\s+|\s*\/\s*/i)
    .map((t) => t.trim())
    .filter(Boolean)
  if (!head) return null

  const headWords = head.split(/\s+/)
  const tokens = [head]
  for (const seg of rest) {
    // `Aloe Barbadensis Leaf Juice / Extract` is a shorthand for two names sharing a stem, not
    // a name followed by a bare noun. Split literally it minted an `EXTRACT` key that captured
    // every product token spelled that way, and lost `Aloe Barbadensis Leaf Extract` itself.
    // A three-organ list (`Flower/Leaf/Stem Water`) leaves a two-word tail the same way, so the
    // test is "this segment only qualifies a species", not "this segment is one known noun".
    if (headWords.length > 1 && isPartOnlyPhrase(seg))
      tokens.push([...headWords.slice(0, -1), seg].join(' '))
    else tokens.push(seg)
  }

  return { slug, tokens }
}

// Editorial markers (`// Alias`, `// Category - variable INCI`). They name no substance, and a
// short key captures every product token spelled that way.
const NON_SUBSTANCE_KEYS = new Set(['ALIAS', 'CATEGORY', 'VARIABLE INCI'])

export function buildInciIndex(): InciIndex {
  const index: InciIndex = new Map()
  const validSlugs = new Set<string>(Object.values(INGREDIENT_SLUGS))

  const add = (rawToken: string, slug: string): void => {
    if (!validSlugs.has(slug)) return
    const norm = normalizeInciToken(rawToken)
    if (norm.length < 2) return
    // Digits lead real INCI names (`3-O-Ethyl Ascorbic Acid`); only punctuation is junk.
    if (!/^[A-Z0-9]/.test(norm)) return
    if (NON_SUBSTANCE_KEYS.has(norm) || isPartOnlyPhrase(norm)) return
    if (!index.has(norm)) index.set(norm, { slug })
  }

  // Source 1: slug-file inline comments first. The explicit `INCI:` prefix is the most
  // predictable signal, and the file order (skincare → haircare → dental → supplements)
  // resolves shared tokens like NIACINAMIDE to the canonical skincare slug rather than
  // a domain-suffixed variant (niacinamide-hair, etc.).
  for (const { rel } of SLUG_FILES) {
    const path = join(INGREDIENTS_ROOT, rel)
    let text: string
    try {
      text = readFileSync(path, 'utf-8')
    } catch {
      continue
    }
    for (const line of text.split('\n')) {
      const parsed = parseInciFromSlugLine(line)
      if (!parsed) continue
      for (const tok of parsed.tokens) add(tok, parsed.slug)
    }
  }

  // Source 2: markdown `## INCI` blocks fill any token the slug-file pass missed.
  for (const ing of ingredientData) {
    for (const tok of parseInciFromContent(ing.content)) add(tok, ing.slug)
  }

  return index
}

/**
 * Slugs whose canonical INCI token is non-discriminant. Lets a *resolved* slug be dropped even
 * when the raw token that produced it was a listed substance under another name (e.g.
 * `Polydimethylsiloxane` → dimethicone, `Gomme Xanthane` → xanthan-gum).
 */
export function buildNonDiscriminantSlugs(): Set<string> {
  const slugs = new Set<string>()
  for (const [token, entry] of buildInciIndex()) {
    if (NON_DISCRIMINANT_TOKENS.has(token)) slugs.add(entry.slug)
  }
  // A slug that declares no `// INCI:` comment never enters the index, so the loop above cannot
  // see it. The bridge can still reach it from the literal slug spelling (`polyquaternium-10`)
  // or its humanised words (`butylene glycol`). Mirror both key shapes here.
  for (const slug of Object.values(INGREDIENT_SLUGS)) {
    const literal = normalizeInciToken(slug)
    const humanized = normalizeInciToken(slug.replace(/-/g, ' '))
    if (NON_DISCRIMINANT_TOKENS.has(literal) || NON_DISCRIMINANT_TOKENS.has(humanized)) {
      slugs.add(slug)
    }
  }
  return slugs
}

/**
 * Every ingredient slug → its source-file domain. Unlike the inci index (which only carries
 * slugs that expose an INCI token), this covers the full slug set, so a slug reached by the
 * humanised-word bridge still gets domain-filtered. First file wins on cross-domain collision.
 */
export function buildSlugDomainMap(): Map<string, IngredientDomain> {
  const validSlugs = new Set<string>(Object.values(INGREDIENT_SLUGS))
  const map = new Map<string, IngredientDomain>()
  for (const { rel, domain } of SLUG_FILES) {
    // Fail loud: a swallowed read would silently drop this domain's slugs, letting them
    // bypass the category filter (cross-domain leak). A missing seed file is a bug, not a skip.
    const text = readFileSync(join(INGREDIENTS_ROOT, rel), 'utf-8')
    for (const m of text.matchAll(/^\s*[A-Z][A-Z0-9_]*\s*:\s*['"]([^'"]+)['"]/gm)) {
      const slug = m[1]
      if (validSlugs.has(slug) && !map.has(slug)) map.set(slug, domain)
    }
  }
  return map
}

export function getDomainAllowlist(category: string | undefined): Set<IngredientDomain> | null {
  if (!category) return null
  const list = CATEGORY_DOMAIN_ALLOWLIST[category]
  return list ? new Set(list) : null
}
