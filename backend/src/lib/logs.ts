import {
  type FieldChange,
  type IngredientChanges,
  ingredientChangesSchema,
  type ProductChanges,
  productChangesSchema,
} from '@aurore/shared'

import type { ZodType } from 'zod'

import type { DbOrTransaction } from '../db'
import { ingredientEdits, productEdits } from '../db/schema'
import { areEqual } from './helpers'

interface EditTableConfig<TChanges> {
  table: typeof productEdits | typeof ingredientEdits
  entityIdColumn: string
  schema: ZodType<TChanges>
}

// Legacy rows still store '' where the convention says null. Left alone it reaches the enum
// members of productChangesSchema, the parse throws, and a valid product edit returns 500.
// Fold both sides, or an unchanged '' would be logged as a change.
function normalizeForDiff(value: unknown): unknown {
  if (value == null || value === '') return null

  // Treat empty object as null so the diff stays simple.
  if (typeof value === 'object' && Object.keys(value).length === 0) return null

  return value
}

export function buildChanges(
  oldEntity: Record<string, unknown>,
  newEntity: Record<string, unknown>,
  trackedFields: readonly string[]
): Record<string, FieldChange<unknown>> {
  const changes: Record<string, FieldChange<unknown>> = {}

  for (const key of trackedFields) {
    const oldVal = normalizeForDiff(oldEntity[key])
    const newVal = normalizeForDiff(newEntity[key])

    if (!areEqual(oldVal, newVal)) {
      changes[key] = { old: oldVal, new: newVal }
    }
  }

  return changes
}

export async function logEdit(
  database: DbOrTransaction,
  config: EditTableConfig<unknown>,
  params: {
    entityId: string
    editedBy: string
    summary: string | null
    changes: Record<string, FieldChange<unknown>>
  }
) {
  if (Object.keys(params.changes).length === 0) return

  const parsed = config.schema.parse(params.changes)

  await database.insert(config.table).values({
    [config.entityIdColumn]: params.entityId,
    editedBy: params.editedBy,
    summary: params.summary,
    changes: parsed,
    // biome-ignore lint/suspicious/noExplicitAny: Drizzle loses types with dynamic column names
  } as any)
}

export const productEditConfig: EditTableConfig<ProductChanges> = {
  table: productEdits,
  entityIdColumn: 'productId',
  schema: productChangesSchema,
}

export const ingredientEditConfig: EditTableConfig<IngredientChanges> = {
  table: ingredientEdits,
  entityIdColumn: 'ingredientId',
  schema: ingredientChangesSchema,
}
