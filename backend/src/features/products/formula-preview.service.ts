import {
  isDisplayedProductTag,
  type ProductFormulaPreviewInput,
  type ProductKind,
} from '@aurore/shared'

import { normalize } from 'algo-derm'
import { eq, inArray } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db/index'
import { ingredients } from '../../db/schema/ingredients/ingredients'
import { brandCertifications, normalizeBrand } from '../../db/schema/products/brand-certifications'
import { foldScraperDelimiters } from '../../lib/inci-delimiters'
import { qualifyInciInput } from '../../lib/inci-input-quality'
import { foldKnownInciLines } from '../../lib/inci-line-breaks'
import {
  buildOrchestratorInput,
  detectAllAutoTags,
  isAutoTagEligibleCategory,
  loadTagSlugToInfo,
  resolveTagRows,
} from '../auto-tagging'
import { resolveFormulaPreviewTokens } from './formula-preview-tokens'

type FormulaPreviewToken = {
  raw: string
  normalized: string
  canonicalKey: string | null
  ingredient: { id: string; name: string; slug: string } | null
}

export type FormulaPreviewResult = {
  tokens: FormulaPreviewToken[]
  suggestedTags: { tagSlug: string; relevance: 'primary' | 'secondary' | 'avoid'; source: string }[]
  autoTagEligible: boolean
}

type IngredientRow = { id: string; name: string; slug: string; type: string }

// `-hair` shadow rows share name and canonical_key with their canonical sibling;
// outside haircare they must lose the tie. Locale pinned for determinism.
function sortPreferred(rows: IngredientRow[], category: string): IngredientRow[] {
  const hairPenalty = (r: IngredientRow) =>
    category !== 'haircare' && r.type === 'haircare' ? 1 : 0
  return [...rows].sort(
    (a, b) => hairPenalty(a) - hairPenalty(b) || a.name.localeCompare(b.name, 'en')
  )
}

function indexPreviewNames(rows: IngredientRow[], category: string): Map<string, IngredientRow> {
  const byNorm = new Map<string, IngredientRow>()
  for (const row of sortPreferred(rows, category)) {
    const variants = [normalize(row.name)]
    for (const m of row.name.matchAll(/\(([^)]*)\)/g)) {
      for (const part of m[1].split('/')) variants.push(normalize(part))
    }
    for (const v of variants) {
      if (v && !byNorm.has(v)) byNorm.set(v, row)
    }
  }

  return byNorm
}

async function loadPreviewIngredientIndexes(
  tokenMeta: ReturnType<typeof resolveFormulaPreviewTokens>,
  category: string,
  db: DatabaseTransaction
) {
  const ingredientColumns = {
    id: ingredients.id,
    name: ingredients.name,
    slug: ingredients.slug,
    type: ingredients.type,
  }

  const distinctKeys = [...new Set(tokenMeta.map((t) => t.canonicalKey).filter((k) => k !== null))]
  const keyRows =
    distinctKeys.length > 0
      ? await db
          .select({ ...ingredientColumns, canonicalKey: ingredients.canonicalKey })
          .from(ingredients)
          .where(inArray(ingredients.canonicalKey, distinctKeys))
      : []

  const byKey = new Map<string, IngredientRow>()
  for (const row of sortPreferred(keyRows, category)) {
    const key = (row as (typeof keyRows)[number]).canonicalKey
    if (key && !byKey.has(key)) byKey.set(key, row)
  }

  // Fallback for tokens without a usable canonical key: accent-folded name match.
  // Postgres lower() keeps accents while normalize() strips them, so the fold must
  // happen in JS: the table is small enough (~700 rows) for a full lightweight scan.
  const needFallback = tokenMeta.some(
    (t) => t.allowNameFallback && (t.canonicalKey === null || !byKey.has(t.canonicalKey))
  )
  const allRows = needFallback ? await db.select(ingredientColumns).from(ingredients) : []

  // FR display names embed INCI variants in parentheses ("Tocophérol (Tocopherol /
  // Vitamine E)"); index the folded base name plus each parenthesised variant.
  const byNorm = indexPreviewNames(allRows, category)
  return { byKey, byNorm }
}

function previewOrchestratorInput(
  input: ProductFormulaPreviewInput,
  tagInci: string,
  brand: string | null
) {
  return buildOrchestratorInput({
    inci: tagInci,
    kind: input.kind as ProductKind,
    category: input.category,
    brand,
    texture: input.texture ?? null,
    name: input.name ?? null,
    description: input.description ?? null,
  })
}

async function previewSuggestedTags(
  input: ProductFormulaPreviewInput,
  inci: string,
  db: DatabaseTransaction
): Promise<FormulaPreviewResult['suggestedTags']> {
  const autoTagEligible = isAutoTagEligibleCategory(input.category)
  const brand = input.brand?.trim() ? input.brand : null

  // The brand pass needs the certification row, else vegan/cruelty-free/
  // bio-naturel silently vanish from the preview while intake would emit them.
  // percentClaims/knownConcentrations stay absent: no product_ingredients rows
  // exist before submit.
  const certRows =
    autoTagEligible && brand
      ? await db
          .select()
          .from(brandCertifications)
          .where(eq(brandCertifications.brandNormalized, normalizeBrand(brand)))
      : []

  const suggestedTags: FormulaPreviewResult['suggestedTags'] = []
  if (autoTagEligible) {
    // Line folding drops trailing separators that must still veto absence inference
    const tagInci =
      qualifyInciInput(inci).status === 'suspect' ? inci : (foldKnownInciLines(inci) ?? inci)
    const pairs = detectAllAutoTags(previewOrchestratorInput(input, tagInci, brand), {
      brandCertifications: new Map(certRows.map((r) => [r.brandNormalized, r])),
    })
    // Same persist-filter as the writers (resolveTagRows): the preview must not
    // suggest a tag the save would withhold (eczema contraindication) or drop
    // (domain filter). Parity pinned by formula-preview.test.ts.
    const tagSlugToInfo = await loadTagSlugToInfo(db)
    const { rows } = resolveTagRows(
      pairs,
      { category: input.category, description: input.description ?? null },
      tagSlugToInfo
    )
    for (const { tagSlug, relevance, source } of rows.filter((row) =>
      isDisplayedProductTag(row.tagSlug, row.relevance)
    )) {
      suggestedTags.push({ tagSlug, relevance, source })
    }
  }

  return suggestedTags
}

export async function previewProductFormula(
  input: ProductFormulaPreviewInput,
  db: DatabaseTransaction
): Promise<FormulaPreviewResult> {
  const inci = foldScraperDelimiters(input.inci, {
    foldListSeparators: input.category !== 'complement',
  })
  const tokenMeta = resolveFormulaPreviewTokens(inci)

  const { byKey, byNorm } = await loadPreviewIngredientIndexes(tokenMeta, input.category, db)

  // Expanded pigments retain the source declaration and its position in the list
  const tokens: FormulaPreviewToken[] = tokenMeta.map(
    ({ raw, normalized, canonicalKey, allowNameFallback }) => {
      const keyRow = canonicalKey ? byKey.get(canonicalKey) : undefined
      const match = keyRow ?? (allowNameFallback && normalized ? byNorm.get(normalized) : undefined)
      return {
        raw,
        normalized,
        canonicalKey,
        ingredient: match ? { id: match.id, name: match.name, slug: match.slug } : null,
      }
    }
  )

  const autoTagEligible = isAutoTagEligibleCategory(input.category)
  const suggestedTags = await previewSuggestedTags(input, inci, db)

  return { tokens, suggestedTags, autoTagEligible }
}
