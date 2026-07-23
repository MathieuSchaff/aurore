import type { QueryClient } from '@tanstack/react-query'

// Query roots serving the same payload to every visitor. Kept as string literals rather than
// imported from the key factories: `lib/queries/*` imports `lib/api`, which imports the caller
// of this module, so importing them back would close an import cycle.
const PUBLIC_QUERY_ROOTS: ReadonlySet<string> = new Set([
  'articles',
  'brands',
  'health',
  'ingredients',
  'product-tags',
  'products',
])

// Lives under a public root but holds the signed-in user's own view of the catalog
// (`productKeys.shelfStatuses()`), so it goes with the session.
const USER_SCOPED_SUBTREES: ReadonlyArray<readonly [string, string]> = [
  ['products', 'shelf-status'],
]

/**
 * Drop every cached query that could carry the ending session's data.
 * Public catalog and editorial queries survive, so the page the user is reading does not blank out.
 */
export function dropSessionScopedQueries(queryClient: QueryClient): void {
  queryClient.removeQueries({
    predicate: (query) => {
      const [root, second] = query.queryKey
      if (typeof root !== 'string' || !PUBLIC_QUERY_ROOTS.has(root)) return true
      return USER_SCOPED_SUBTREES.some(([r, s]) => r === root && s === second)
    },
  })
}
