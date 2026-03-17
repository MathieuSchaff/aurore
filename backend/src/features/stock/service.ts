import type { AddStockEntryInput } from '@habit-tracker/shared'

import { desc, eq, sql } from 'drizzle-orm'

import { db } from '../../db'
import type { DB as Database } from '../../db'
import { products } from '../../db/schema/products'
import { type StockEntry, stockEntries } from '../../db/schema/stock-entries'
import { type UserProduct, userProducts } from '../../db/schema/user-products'
import { StockError } from './stock-error'

export async function getStockEntries(userId: string, database: Database = db) {
  return database
    .select({
      id: stockEntries.id,
      productId: stockEntries.productId,
      qty: stockEntries.qty,
      pricePaidCents: stockEntries.pricePaidCents,
      purchasedAt: stockEntries.purchasedAt,
      createdAt: stockEntries.createdAt,
      product: {
        name: products.name,
        brand: products.brand,
      },
    })
    .from(stockEntries)
    .innerJoin(products, eq(stockEntries.productId, products.id))
    .where(eq(stockEntries.userId, userId))
    .orderBy(desc(stockEntries.purchasedAt), desc(stockEntries.createdAt))
}

export async function addStockEntry(
  userId: string,
  productId: string,
  input: AddStockEntryInput,
  database: Database = db
): Promise<{ entry: StockEntry; stock: UserProduct }> {
  return database.transaction(async (tx) => {
    const [productExists] = await tx
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    if (!productExists) throw new StockError('product_not_found')

    const [entry] = await tx
      .insert(stockEntries)
      .values({
        userId,
        productId,
        qty: input.qty,
        pricePaidCents: input.pricePaidCents ?? null,
        purchasedAt: input.purchasedAt,
      })
      .returning()

    if (!entry) throw new StockError('stock_entry_failed')

    const [stock] = await tx
      .insert(userProducts)
      .values({ userId, productId, qty: input.qty, status: 'in_stock' })
      .onConflictDoUpdate({
        target: [userProducts.userId, userProducts.productId],
        set: {
          qty: sql`${userProducts.qty} + ${input.qty}`,
          status: 'in_stock',
          updatedAt: new Date(),
        },
      })
      .returning()

    if (!stock) throw new StockError('stock_entry_failed')

    return { entry, stock }
  })
}
