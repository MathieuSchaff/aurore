import { sql } from 'drizzle-orm'
import { date, index, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

import { products } from './products'
import { users } from './users'

export const stockEntries = pgTable(
  'stock_entries',
  {
    id: uuid('id').primaryKey().default(sql`uuidv7()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    qty: integer('qty').notNull(),
    pricePaidCents: integer('price_paid_cents'),
    purchasedAt: date('purchased_at').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('stock_entries_user_product_idx').on(t.userId, t.productId),
    index('stock_entries_user_date_idx').on(t.userId, t.purchasedAt),
  ]
)

export type StockEntry = typeof stockEntries.$inferSelect
export type StockEntryInsert = typeof stockEntries.$inferInsert
