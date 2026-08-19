import type { QueryClient } from '@tanstack/react-query'

const PUBLIC_QUERY_ROOTS: ReadonlySet<string> = new Set([
  'articles',
  'brands',
  'health',
  'ingredients',
  'product-tags',
  'products',
])

// Same root as the catalogue,
// but this one is which products the user owns
// Keep it and the next account reads the previous user collection
const USER_SCOPED_SUBTREES: ReadonlyArray<readonly [string, string]> = [
  ['products', 'shelf-status'],
]

// if a user is disconnected and was on the products page
// we don't want the product page to be refetch,
// so we don't want to kill the query list of products
// but just what was the specific data of the user
// the userStatus for exemple
function isSessionScoped(queryKey: readonly unknown[]): boolean {
  const [root, second] = queryKey
  if (typeof root !== 'string' || !PUBLIC_QUERY_ROOTS.has(root)) return true
  return USER_SCOPED_SUBTREES.some(
    ([scopedRoot, scopedSecond]) => scopedRoot === root && scopedSecond === second
  )
}

type CachedProductList = { items?: { userStatus?: unknown }[] }

// we do'nt delete all the list of products, but we delete
// the user status that can be displayed if a user is connected
// like when a user  has a product in his collection
function withoutShelfStatus(
  productList: CachedProductList | undefined
): CachedProductList | undefined {
  if (productList?.items === undefined) return productList
  return {
    ...productList,
    items: productList?.items?.map((product) => {
      return { ...product, userStatus: null }
    }),
  }
}

function clearShelfStatusInListCache(queryClient: QueryClient): void {
  // Two segments only, so every list is caught whatever its filters and its user
  for (const query of queryClient.getQueryCache().findAll({ queryKey: ['products', 'list'] })) {
    queryClient.setQueryData<CachedProductList>(query.queryKey, withoutShelfStatus)
  }
}

/**
 * Runs when a session dies on its own, never on logout: logout calls queryClient.clear().
 * Everything that belongs to the session goes.
 * The catalogue stays, so the page being read does not blank out, and the private field
 * on its rows is erased
 */
export function dropSessionScopedQueries(queryClient: QueryClient): void {
  queryClient.removeQueries({ predicate: (query) => isSessionScoped(query.queryKey) })
  clearShelfStatusInListCache(queryClient)
}
