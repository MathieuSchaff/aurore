/**
 * inci-index.ts — INCI-token → slug index for auto-filling candidate keyIngredients.
 *
 * Two parsing sources, first-write wins on collisions:
 *   1. ingredientData[].content markdown — `## INCI\n**Token**` block
 *   2. data/ingredients/*&#47;ingredient-slugs.ts — inline `// [INCI:] Token | desc` comments
 *
 * Excipient blocklist filters out tokens that are too common to be informative
 * (water, glycerin, denat. alcohol, EDTA…). Even when present in the index sources,
 * blocked tokens never make it into the result of inferKeyIngredients.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ingredientData } from '../../data/ingredients'
import { INGREDIENT_SLUGS } from '../../data/ingredients/ingredient-slugs'

export const EXCIPIENT_BLOCKLIST = new Set<string>([
  'AQUA', 'WATER', 'EAU',
  'GLYCERIN', 'GLYCERINE',
  'ALCOHOL', 'ALCOHOL DENAT', 'DENATURED ALCOHOL', 'ETHANOL',
  'BUTYLENE GLYCOL', 'PROPYLENE GLYCOL', 'PENTYLENE GLYCOL',
  'PARFUM', 'FRAGRANCE',
  'PHENOXYETHANOL', 'BENZYL ALCOHOL', 'ETHYLHEXYLGLYCERIN',
  'CITRIC ACID',
  'SODIUM HYDROXIDE',
  'DISODIUM EDTA', 'EDTA', 'TETRASODIUM EDTA',
  'BHT',
  'XANTHAN GUM',
  'CARBOMER',
  'SODIUM CHLORIDE',
])

export type InciIndex = Map<string, string>

const INGREDIENTS_ROOT = join(import.meta.dir, '..', '..', 'data', 'ingredients')

const SLUG_FILES = [
  'skincare/ingredient-slugs.ts',
  'haircare/ingredient-slugs.ts',
  'dental/ingredient-slugs.ts',
  'supplements/ingredient-slugs.ts',
]

export function normalizeInciToken(s: string): string {
  return s
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

  return candidates.flatMap((c) => c.split(/\s+ou\s+|\s*\/\s*|,/i)).map((t) => t.trim()).filter(Boolean)
}

/** Parse `SLUG_KEY: 'slug-value', // [INCI:] Token / Token | desc`. Returns null when format unfamiliar. */
export function parseInciFromSlugLine(line: string): { slug: string; tokens: string[] } | null {
  const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*:\s*['"]([^'"]+)['"]\s*,\s*\/\/\s*(.+?)\s*$/)
  if (!m) return null

  const slug = m[2]
  let comment = m[3]

  let inciSegment = comment
  if (/^INCI:\s*/i.test(comment)) {
    inciSegment = comment.replace(/^INCI:\s*/i, '')
  }
  const pipe = inciSegment.indexOf('|')
  if (pipe >= 0) inciSegment = inciSegment.slice(0, pipe)
  inciSegment = inciSegment.trim()

  if (!inciSegment) return null
  if (!/^[A-Z]/.test(inciSegment)) return null
  // Reject French descriptors: any apostrophe variant or any lowercase-starting word
  // that isn't a recognised INCI connector.
  if (/['']/.test(inciSegment)) return null

  const allowedLowercase = new Set(['or', 'and'])
  const words = inciSegment.split(/\s+/).filter(Boolean)
  for (const w of words) {
    const cleaned = w.replace(/[(),./&\-]/g, '')
    if (!cleaned) continue
    if (/^[a-z]/.test(cleaned) && !allowedLowercase.has(cleaned.toLowerCase())) return null
  }

  const tokens = inciSegment
    .split(/\s+ou\s+|\s*\/\s*|,/i)
    .map((t) => t.trim())
    .filter(Boolean)

  return { slug, tokens }
}

export function buildInciIndex(): InciIndex {
  const index: InciIndex = new Map()
  const validSlugs = new Set<string>(Object.values(INGREDIENT_SLUGS))

  const add = (rawToken: string, slug: string): void => {
    if (!validSlugs.has(slug)) return
    const norm = normalizeInciToken(rawToken)
    if (norm.length < 2) return
    if (!/^[A-Z]/.test(norm)) return
    if (EXCIPIENT_BLOCKLIST.has(norm)) return
    if (!index.has(norm)) index.set(norm, slug)
  }

  // Source 1: slug-file inline comments first — explicit `INCI:` prefix is the most
  // predictable signal, and the file order (skincare → haircare → dental → supplements)
  // resolves shared tokens like NIACINAMIDE to the canonical skincare slug rather than
  // a domain-suffixed variant (niacinamide-hair, etc.).
  for (const rel of SLUG_FILES) {
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

export interface InferKeyIngredientsOptions {
  max?: number
}

/** Match each comma-separated token in `inci` against the index. Order = INCI order. */
export function inferKeyIngredients(
  inci: string,
  index: InciIndex,
  options: InferKeyIngredientsOptions = {}
): string[] {
  const max = options.max ?? 8
  if (!inci) return []

  const tokens = inci
    .split(/[,;]/)
    .map(normalizeInciToken)
    .filter(Boolean)

  const seen = new Set<string>()
  const result: string[] = []
  for (const tok of tokens) {
    if (EXCIPIENT_BLOCKLIST.has(tok)) continue
    const slug = index.get(tok)
    if (!slug || seen.has(slug)) continue
    seen.add(slug)
    result.push(slug)
    if (result.length >= max) break
  }
  return result
}
