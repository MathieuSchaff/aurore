import { sql } from 'drizzle-orm'
import {
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { catalogPolicies } from '../_policies'
import { ingredients } from '../ingredients/ingredients'
import { products } from './products'

// Who wrote the row. The INCI linker deletes a link it no longer derives, and without this it
// could only guess from a concentration or a note being set, which a hand-added link often lacks.
// Default `manual` on purpose: an unmarked writer must be treated as human and left alone.
export const productIngredientSourceEnum = pgEnum('product_ingredient_source', ['manual', 'linker'])

export const productIngredients = pgTable(
  'product_ingredients',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    ingredientId: uuid('ingredient_id')
      .notNull()
      .references(() => ingredients.id, { onDelete: 'cascade' }),
    // Concentration examples: 10% is value: 10, unit: "%"; 2500 IU/drop is
    // value: 2500, unit: "IU", per: "goutte"
    concentrationValue: numeric('concentration_value'),
    concentrationUnit: text('concentration_unit'), // "%", "IU", "mg", "mcg"
    concentrationPer: text('concentration_per'), // "drop", "capsule", "mL"
    notes: text('notes'), // "liposomal", "encapsulated"
    source: productIngredientSourceEnum('source').notNull().default('manual'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex('product_ingredients_unique').on(t.productId, t.ingredientId),
    index('product_ingredients_product_idx').on(t.productId),
    index('product_ingredients_ingredient_idx').on(t.ingredientId),
    ...catalogPolicies('product_ingredients', 'contributor'),
  ]
).enableRLS()

export type ProductIngredient = typeof productIngredients.$inferSelect
