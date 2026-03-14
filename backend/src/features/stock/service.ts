import type { AddStockEntryInput, UpdateStockInput } from '@habit-tracker/shared'

import { and, desc, eq, sql } from 'drizzle-orm'

import { db } from '../../db'
import type { Database } from '../../db/index'
import { type ProductStock, productStock, products } from '../../db/schema/products'
import { type StockEntry, stockEntries } from '../../db/schema/stock-entries'
import { StockError } from './stock-error'

export async function getUserStock(userId: string, database: Database = db) {
  return database
    .select({
      id: productStock.id,
      userId: productStock.userId,
      productId: productStock.productId,
      qty: productStock.qty,
      updatedAt: productStock.updatedAt,
      product: {
        id: products.id,
        createdBy: products.createdBy,
        name: products.name,
        slug: products.slug,
        brand: products.brand,
        kind: products.kind,
        unit: products.unit,
        inci: products.inci,
        description: products.description,
        totalAmount: products.totalAmount,
        amountUnit: products.amountUnit,
        url: products.url,
        notes: products.notes,
        priceCents: products.priceCents,
        expiresAt: products.expiresAt,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      },
    })
    .from(productStock)
    .innerJoin(products, eq(productStock.productId, products.id))
    .where(eq(productStock.userId, userId))
    .orderBy(products.name)
}

export async function getStockByProduct(
  userId: string,
  productId: string,
  database: Database = db
) {
  const rows = await database
    .select({
      id: productStock.id,
      userId: productStock.userId,
      productId: productStock.productId,
      qty: productStock.qty,
      updatedAt: productStock.updatedAt,
      product: {
        id: products.id,
        createdBy: products.createdBy,
        name: products.name,
        slug: products.slug,
        brand: products.brand,
        kind: products.kind,
        unit: products.unit,
        inci: products.inci,
        description: products.description,
        totalAmount: products.totalAmount,
        amountUnit: products.amountUnit,
        url: products.url,
        notes: products.notes,
        priceCents: products.priceCents,
        expiresAt: products.expiresAt,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      },
    })
    .from(productStock)
    .innerJoin(products, eq(productStock.productId, products.id))
    .where(and(eq(productStock.userId, userId), eq(productStock.productId, productId)))

  const row = rows[0]
  if (!row) throw new StockError('stock_not_found')
  return row
}

export async function upsertStock(
  userId: string,
  productId: string,
  input: UpdateStockInput,
  database: Database = db
): Promise<ProductStock> {
  const [row] = await database
    .insert(productStock)
    .values({ userId, productId, qty: input.qty })
    .onConflictDoUpdate({
      target: [productStock.userId, productStock.productId],
      set: { qty: input.qty },
    })
    .returning()

  if (!row) throw new StockError('stock_update_failed')
  return row
}

export async function deleteStock(
  userId: string,
  productId: string,
  database: Database = db
): Promise<void> {
  const rows = await database
    .delete(productStock)
    .where(and(eq(productStock.userId, userId), eq(productStock.productId, productId)))
    .returning({ id: productStock.id })

  if (!rows[0]) throw new StockError('stock_not_found')
}

export async function addStockEntry(
  userId: string,
  productId: string,
  input: AddStockEntryInput,
  database: Database = db
): Promise<{ entry: StockEntry; stock: ProductStock }> {
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
      .insert(productStock)
      .values({ userId, productId, qty: input.qty })
      .onConflictDoUpdate({
        target: [productStock.userId, productStock.productId],
        set: { qty: sql`${productStock.qty} + ${input.qty}` },
      })
      .returning()

    if (!stock) throw new StockError('stock_entry_failed')

    return { entry, stock }
  })
}
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
