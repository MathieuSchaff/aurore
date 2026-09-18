import type { ReplaceIngredientTagsInput } from '@aurore/shared'

import { and, eq, sql } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../../db'
import { ingredients } from '../../../db/schema/ingredients/ingredients'
import { replaceIngredientTags } from '../../ingredient-tags/service'
import { IngredientError } from '../ingredients-error'

export async function replaceIngredientTagsWithVersion(
  database: DatabaseTransaction,
  ingredientId: string,
  input: ReplaceIngredientTagsInput
) {
  const [updated] = await database
    .update(ingredients)
    .set({
      updatedAt: sql`greatest(
        now(),
        date_trunc('milliseconds', ${ingredients.updatedAt}) + interval '1 millisecond'
      )`,
    })
    .where(
      and(
        eq(ingredients.id, ingredientId),
        sql`date_trunc('milliseconds', ${ingredients.updatedAt}) = ${input.expectedUpdatedAt}::timestamptz`
      )
    )
    .returning({ id: ingredients.id })

  if (!updated) throw new IngredientError('ingredient_update_conflict')

  return replaceIngredientTags(database, ingredientId, input.tags)
}
