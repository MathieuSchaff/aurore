import type {
  CreateProductDraftInput,
  ProductRecord,
  UpdateProductDraftInput,
} from '@aurore/shared'

import { eq } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db'
import { productIngredients } from '../../db/schema'
import type { CatalogRole } from '../../lib/catalog'
import { writeTagsForProductFailSoft } from '../auto-tagging'
import { replaceProductTags } from '../product-tags/service'
import { ProductError } from './product-error'
import { replaceProductIngredients } from './product-ingredients/product-ingredients.service'
import { assertTagsMatchProductDomain } from './product-tags/domain-validation'
import { createProduct, updateProduct } from './write.service'

function assertDraftPermission(
  role: CatalogRole,
  input: CreateProductDraftInput | UpdateProductDraftInput
) {
  if (role === 'user' && (input.tags !== undefined || input.ingredients !== undefined)) {
    throw new ProductError('unauthorized_access')
  }
}

async function saveDraftLinks(
  db: DatabaseTransaction,
  productId: string,
  input: UpdateProductDraftInput
) {
  if (input.ingredients !== undefined) {
    const existing = await db
      .select({
        ingredientId: productIngredients.ingredientId,
        source: productIngredients.source,
      })
      .from(productIngredients)
      .where(eq(productIngredients.productId, productId))
    const sources = new Map(
      existing.map((ingredient) => [ingredient.ingredientId.toLowerCase(), ingredient.source])
    )
    await replaceProductIngredients(
      db,
      productId,
      input.ingredients.map((ingredient) => ({
        ingredientId: ingredient.ingredientId,
        // Keep linker ownership so INCI reconciliation can still remove stale links
        source: sources.get(ingredient.ingredientId.toLowerCase()) ?? 'manual',
        concentrationValue:
          ingredient.concentrationValue == null ? null : String(ingredient.concentrationValue),
        concentrationUnit: ingredient.concentrationUnit ?? null,
        concentrationPer: ingredient.concentrationPer ?? null,
        notes: ingredient.notes ?? null,
      }))
    )
  }
  if (input.tags !== undefined) {
    await assertTagsMatchProductDomain(
      db,
      productId,
      input.tags.map((tag) => tag.tagId)
    )
    await replaceProductTags(db, productId, input.tags)
  }
}

// The request RLS transaction also owns these writes, so failed links undo the fiche
export async function createProductDraft(
  userId: string,
  role: CatalogRole,
  input: CreateProductDraftInput,
  db: DatabaseTransaction
): Promise<ProductRecord> {
  assertDraftPermission(role, input)
  const { ingredients, tags, ...fields } = input
  const product = await createProduct(userId, role, fields, db, { autoTag: false })
  await saveDraftLinks(db, product.id, { ingredients, tags })
  await writeTagsForProductFailSoft(db, product.id, { operation: 'create', userId })
  return product
}

export async function updateProductDraft(
  userId: string,
  role: CatalogRole,
  id: string,
  input: UpdateProductDraftInput,
  db: DatabaseTransaction
): Promise<ProductRecord> {
  assertDraftPermission(role, input)
  const { ingredients, tags, ...fields } = input
  const product = await updateProduct(userId, id, fields, db)
  await saveDraftLinks(db, product.id, { ingredients, tags })
  if (ingredients !== undefined)
    await writeTagsForProductFailSoft(db, product.id, { operation: 'update', userId })
  return product
}
