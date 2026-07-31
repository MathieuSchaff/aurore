import { sql } from 'drizzle-orm'
import { boolean, check, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core'

import { ingredients } from './ingredients'

// No `irritation_potential` here on purpose: algo-derm grades irritation per axis on a 1-5
// scale, weighted by leave-on/rinse-off, and only for a third of our ingredients. A three-value
// column with no NULL could not carry any of that: it read `low` on all 740 rows, SLS included.
// Read the risk axes from algo-derm at the point of use instead of caching a lossy copy.
export const ingredientDermoProfiles = pgTable(
  'ingredient_dermo_profiles',
  {
    ingredientId: uuid('ingredient_id')
      .primaryKey()
      .references(() => ingredients.id, { onDelete: 'cascade' }),
    // nullable: no algo-derm evidence or curation yet. Unknown, not a "does not clog pores" claim.
    comedogenicity: integer('comedogenicity'),
    isFiller: boolean('is_filler').notNull().default(false),
    // CosIng functional labels slugified as-is; no curated taxonomy yet
    functions: text('functions').array().notNull().default([]),
    skinTargets: text('skin_targets').array().notNull().default([]),
  },
  (t) => [check('comedogenicity_range', sql`${t.comedogenicity} BETWEEN 0 AND 5`)]
)

export type IngredientDermoProfile = typeof ingredientDermoProfiles.$inferSelect
export type IngredientDermoProfileInsert = typeof ingredientDermoProfiles.$inferInsert
