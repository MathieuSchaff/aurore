import { sql } from 'drizzle-orm'
import { index, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

import { ingredients } from './ingredients'
import { products } from './products'

export const tags = pgTable(
  'tags',
  {
    // id: uuid('id').defaultRandom().primaryKey(),
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    category: text('category'), // "concern", "skin_type", "routine_step"
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('tags_slug_unique').on(t.slug), index('tags_category_idx').on(t.category)]
)

export const relevanceEnum = pgEnum('relevance', ['primary', 'secondary', 'avoid'])

export const productTags = pgTable(
  'product_tags',
  {
    // id: uuid('id').defaultRandom().primaryKey(),
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    relevance: relevanceEnum('relevance').notNull().default('secondary'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('product_tags_unique').on(t.productId, t.tagId),
    index('product_tags_product_idx').on(t.productId),
    index('product_tags_tag_idx').on(t.tagId),
  ]
)

export const ingredientTags = pgTable(
  'ingredient_tags',
  {
    // id: uuid('id').defaultRandom().primaryKey(),
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    ingredientId: uuid('ingredient_id')
      .notNull()
      .references(() => ingredients.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    relevance: relevanceEnum('relevance').notNull().default('secondary'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('ingredient_tags_unique').on(t.ingredientId, t.tagId),
    index('ingredient_tags_ingredient_idx').on(t.ingredientId),
    index('ingredient_tags_tag_idx').on(t.tagId),
  ]
)

export type Tag = typeof tags.$inferSelect
export type ProductTag = typeof productTags.$inferSelect
export type IngredientTag = typeof ingredientTags.$inferSelect
