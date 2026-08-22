import { eq } from 'drizzle-orm'

import type { DbOrTransaction } from '../../db/index'
import { products } from '../../db/schema/products'
import { computeInciFacts } from '../../lib/inci-facts'
import { normalizeInstant } from '../../utils/dates'
import { ProductError } from './product-error'

// One call for Layout, Info, Edit and Sheet, so they all share the same cache entry
export async function getProductFullBySlug(slug: string, database: DbOrTransaction) {
  const row = await database.query.products.findFirst({
    where: eq(products.slug, slug),
    columns: {
      id: true,
      slug: true,
      name: true,
      brand: true,
      category: true,
      description: true,
      inci: true,
      totalAmount: true,
      amountUnit: true,
      url: true,
      imageUrl: true,
      unit: true,
      priceCents: true,
      kind: true,
      texture: true,
      notes: true,
      catalogQuality: true,
      moderationStatus: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      productIngredients: {
        columns: {
          productId: true,
          ingredientId: true,
          concentrationValue: true,
          concentrationUnit: true,
          concentrationPer: true,
          notes: true,
        },
        with: {
          ingredient: {
            columns: {
              name: true,
              slug: true,
              category: true,
              description: true,
              canonicalKey: true,
            },
          },
        },
      },
      productTagLinks: {
        columns: {
          productTagId: true,
          productId: true,
          relevance: true,
        },
        with: {
          productTag: {
            columns: {
              label: true,
              slug: true,
              tagType: true,
            },
          },
        },
      },
    },
  })
  if (!row) throw new ProductError('product_not_found')

  const { productIngredients: ingredientLinks, productTagLinks: tagLinks, ...product } = row
  const ingredients = ingredientLinks
    .map((link) => ({
      productId: link.productId,
      ingredientId: link.ingredientId,
      concentrationValue: link.concentrationValue,
      concentrationUnit: link.concentrationUnit,
      concentrationPer: link.concentrationPer,
      notes: link.notes,
      ingredientName: link.ingredient.name,
      ingredientSlug: link.ingredient.slug,
      ingredientCategory: link.ingredient.category,
      ingredientDescription: link.ingredient.description,
      ingredientCanonicalKey: link.ingredient.canonicalKey,
    }))
    .sort((a, b) => a.ingredientName.localeCompare(b.ingredientName, 'en'))
  // We send every tag, even the internal ones
  // ProductEditPage fills its tag form from here and posts it back,
  // so dropping a tag here would erase it on every admin save
  // Nothing shows on screen today: the detail page reads `tags` through PROFILE_CATEGORIES,
  // which has no product_characteristic
  // That is luck, not a guard. Add it to that list and the marketing claims appear
  const tags = tagLinks
    .map((link) => ({
      productTagId: link.productTagId,
      productId: link.productId,
      relevance: link.relevance,
      tagName: link.productTag.label,
      tagSlug: link.productTag.slug,
      tagCategory: link.productTag.tagType,
    }))
    .sort(
      (a, b) =>
        a.tagCategory.localeCompare(b.tagCategory, 'en') || a.tagName.localeCompare(b.tagName, 'en')
    )
  // We name the two fields instead of spreading
  // A rename in computeInciFacts must break the build, not silently rename a payload key
  const { inciCount, hasFragrance } = computeInciFacts(product.inci)
  return {
    ...product,
    createdAt: normalizeInstant(product.createdAt),
    updatedAt: normalizeInstant(product.updatedAt),
    inciCount,
    hasFragrance,
    ingredients,
    tags,
  }
}
