import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { products } from './products'
import { users } from './users'

export const stockEntries = pgTable(
  'stock_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    qty: integer('qty').notNull(),
    pricePaidCents: integer('price_paid_cents'),
    purchasedAt: text('purchased_at').notNull(), // YYYY-MM-DD
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('stock_entries_user_product_idx').on(t.userId, t.productId),
    index('stock_entries_user_date_idx').on(t.userId, t.purchasedAt),
  ]
)

export type StockEntry = typeof stockEntries.$inferSelect
export type StockEntryInsert = typeof stockEntries.$inferInsert
