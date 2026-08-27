import type { ProductSearchPage, ProductSearchResult } from '@aurore/shared'
import { PRODUCT_DOMAIN_DB_CATEGORIES, type ProductDomainTab } from '@aurore/shared'

import { and, inArray, or, type SQL, sql } from 'drizzle-orm'

import type { DbOrTransaction } from '../../db/index'
import { products } from '../../db/schema/products'
import { escapeLike } from '../../lib/helpers'

// Used by the autocomplete (`searchProducts`) and by the list (`?q=`),
// so "Voir tous les résultats" finds and sorts exactly like the dropdown did
export function productSearchMatch(q: string) {
  const escapedQuery = escapeLike(q)
  return {
    condition: or(
      sql`search_norm(${products.name}) LIKE '%' || search_norm(${escapedQuery}) || '%' ESCAPE '\\'`,
      sql`search_norm(${products.brand}) LIKE '%' || search_norm(${escapedQuery}) || '%' ESCAPE '\\'`,
      // % is the form of similarity() > threshold that can use the GIN trgm index
      sql`search_norm(${products.name}) % search_norm(${q})`,
      sql`search_norm(${products.brand}) % search_norm(${q})`
    ) as SQL,
    // We rank by hand. With similarity alone a short word found in the middle beats
    // a long name that starts with the query, and the order looks random
    rank: sql`CASE
        WHEN search_norm(${products.name}) = search_norm(${q})
          OR search_norm(${products.brand}) = search_norm(${q}) THEN 0
        WHEN search_norm(${products.name}) LIKE search_norm(${escapedQuery}) || '%' ESCAPE '\\'
          OR search_norm(${products.brand}) LIKE search_norm(${escapedQuery}) || '%' ESCAPE '\\' THEN 1
        WHEN search_norm(${products.name}) LIKE '%' || search_norm(${escapedQuery}) || '%' ESCAPE '\\'
          OR search_norm(${products.brand}) LIKE '%' || search_norm(${escapedQuery}) || '%' ESCAPE '\\' THEN 2
        ELSE 3
      END`,
    similarityDesc: sql`GREATEST(
        similarity(search_norm(${products.name}), search_norm(${q})),
        similarity(search_norm(${products.brand}), search_norm(${q}))
      ) DESC`,
  }
}

export async function findSimilarProducts(
  name: string,
  brand: string,
  database: DbOrTransaction
): Promise<ProductSearchResult[]> {
  const trimmedName = name.trim()
  const trimmedBrand = brand.trim()
  if (!trimmedName || !trimmedBrand) return []
  const escapedName = escapeLike(trimmedName)

  return database
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      kind: products.kind,
      slug: products.slug,
    })
    .from(products)
    .where(
      and(
        or(
          sql`search_norm(${products.brand}) = search_norm(${trimmedBrand})`,
          // % lets this branch use the index. 0.5 is still the real cutoff
          sql`(search_norm(${products.brand}) % search_norm(${trimmedBrand})
            AND similarity(search_norm(${products.brand}), search_norm(${trimmedBrand})) > 0.5)`
        ),
        or(
          // % is the form of similarity() > threshold that can use the GIN trgm index
          sql`search_norm(${products.name}) % search_norm(${trimmedName})`,
          sql`search_norm(${products.name}) LIKE '%' || search_norm(${escapedName}) || '%' ESCAPE '\\'`
        )
      )
    )
    .limit(5)
    .orderBy(
      sql`similarity(search_norm(${products.name}), search_norm(${trimmedName})) DESC`,
      products.name
    )
}

export async function searchProducts(
  filters: { q: string; limit?: number; offset?: number; category?: ProductDomainTab },
  database: DbOrTransaction
): Promise<ProductSearchPage> {
  const limit = filters.limit ?? 8
  const offset = filters.offset ?? 0
  const match = productSearchMatch(filters.q.trim())
  // Same category filter as listProducts
  // The dropdown must show the same products as the page it links to
  const where = filters.category
    ? and(
        match.condition,
        inArray(products.category, [...PRODUCT_DOMAIN_DB_CATEGORIES[filters.category]])
      )
    : match.condition
  const rows = await database
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      kind: products.kind,
      slug: products.slug,
    })
    .from(products)
    .where(where)
    .limit(limit + 1)
    .offset(offset)
    .orderBy(match.rank, match.similarityDesc, products.name)
  const hasMore = rows.length > limit
  const items = hasMore ? rows.slice(0, limit) : rows
  return { items, hasMore, nextOffset: offset + limit }
}
