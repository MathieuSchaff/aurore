import type { ComparisonActiveIngredient, ProductCategory } from '@aurore/shared'

import { buildAliasIndex, lookupIngredient, MERGED_EVIDENCE_DB } from 'algo-derm/engine'
import { and, eq, exists, inArray, or } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db'
import { ingredients, ingredientTagLinks, ingredientTagTypes } from '../../db/schema'
import { listInciTokens } from '../../lib/inci-facts'

let aliasIndex: ReturnType<typeof buildAliasIndex> | undefined

function resolveFormula(inci: string | null) {
  aliasIndex ??= buildAliasIndex(MERGED_EVIDENCE_DB)
  const resolved = new Map<
    string,
    { label: string; functions: string[]; cosingRef: string | null }
  >()
  for (const token of listInciTokens(inci) ?? []) {
    const evidence = lookupIngredient(token.label, aliasIndex)
    if (!evidence || resolved.has(evidence.inci)) continue
    const { functions = [], cosingRef = null } = evidence.identity ?? {}
    resolved.set(evidence.inci, { label: token.label, functions, cosingRef })
  }
  return resolved
}

async function readActiveSheets(keys: string[], database: DatabaseTransaction) {
  if (keys.length === 0) return []
  const activeFamily = database
    .select({ id: ingredientTagLinks.ingredientId })
    .from(ingredientTagLinks)
    .innerJoin(ingredientTagTypes, eq(ingredientTagTypes.id, ingredientTagLinks.ingredientTagId))
    .where(
      and(
        eq(ingredientTagLinks.ingredientId, ingredients.id),
        eq(ingredientTagTypes.tagType, 'actif_class')
      )
    )

  return database
    .select({
      key: ingredients.canonicalKey,
      name: ingredients.name,
      slug: ingredients.slug,
      type: ingredients.type,
    })
    .from(ingredients)
    .where(
      and(
        inArray(ingredients.canonicalKey, keys),
        eq(ingredients.moderationStatus, 'visible'),
        inArray(ingredients.type, ['skincare', 'haircare', 'dental']),
        or(eq(ingredients.category, 'actif'), exists(activeFamily))
      )
    )
}

export async function getComparisonActives(
  formulas: Array<{ id: string; inci: string | null; category: ProductCategory }>,
  database: DatabaseTransaction
): Promise<Map<string, ComparisonActiveIngredient[]>> {
  const resolved = formulas.map((p) => ({
    id: p.id,
    category: p.category,
    ingredients: resolveFormula(p.inci),
  }))
  const keys = [...new Set(resolved.flatMap((p) => [...p.ingredients.keys()]))]
  const sheets = await readActiveSheets(keys, database)
  const byKey = new Map<string, typeof sheets>()
  for (const sheet of sheets) {
    if (!sheet.key) continue
    const matches = byKey.get(sheet.key) ?? []
    matches.push(sheet)
    byKey.set(sheet.key, matches)
  }

  return new Map(
    resolved.map((product) => {
      const actives: ComparisonActiveIngredient[] = []
      for (const [key, evidence] of product.ingredients) {
        const matches = byKey.get(key)?.filter((sheet) => sheet.type === product.category)
        if (!matches?.length) continue
        // A substance match cannot choose between distinct visible catalogue sheets.
        const sheet = matches.length === 1 ? matches[0] : undefined
        actives.push({
          key,
          name: sheet?.name ?? evidence.label,
          ingredientSlug: sheet?.slug ?? null,
          functions: evidence.functions,
          cosingRef: evidence.cosingRef,
        })
      }
      return [product.id, actives]
    })
  )
}
