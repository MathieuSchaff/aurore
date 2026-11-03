import { getProductTagLabel, isDisplayedProductTag } from '@aurore/shared'

import { and, eq } from 'drizzle-orm'

import type { DbOrTransaction } from '../../db'
import { products } from '../../db/schema/products'
import { productTagLinks, productTagTypes } from '../../db/schema/tags/tags'
import { visibleInferredTagCondition } from '../../lib/product-tag-visibility'

export async function listVisibleProductTags(database: DbOrTransaction, productId: string) {
  const rows = await database
    .select({
      productTagId: productTagLinks.productTagId,
      productId: productTagLinks.productId,
      relevance: productTagLinks.relevance,
      source: productTagLinks.source,
      tagName: productTagTypes.label,
      tagSlug: productTagTypes.slug,
      tagCategory: productTagTypes.tagType,
    })
    .from(productTagLinks)
    .innerJoin(productTagTypes, eq(productTagLinks.productTagId, productTagTypes.id))
    .innerJoin(products, eq(productTagLinks.productId, products.id))
    .where(and(eq(productTagLinks.productId, productId), visibleInferredTagCondition))
  return rows
    .filter((row) => isDisplayedProductTag(row.tagSlug, row.relevance))
    .map((row) => ({
      ...row,
      tagName:
        row.tagSlug === 'peau-sensible' || row.tagSlug === 'comedogene'
          ? (getProductTagLabel(row.tagSlug, row.source) ?? row.tagName)
          : row.tagName,
    }))
}
