import type { Query, QueryClient } from '@tanstack/react-query'

const PUBLIC_QUERY_ROOTS: ReadonlySet<string> = new Set(['product-tags'])

interface SessionCacheDropOptions {
  preserveAnonymousViewerQueries?: boolean
}

function isPublicArticleQuery(queryKey: readonly unknown[]): boolean {
  const [, scope, filters] = queryKey
  if (scope === 'categoryCounts') return queryKey.length === 2
  if (scope !== 'list' || queryKey.length !== 3) return false
  if (typeof filters !== 'object' || filters === null) return false

  return (
    !('publishedOnly' in filters) ||
    filters.publishedOnly === undefined ||
    filters.publishedOnly === true
  )
}

function isSessionScoped(queryKey: readonly unknown[]): boolean {
  const [root] = queryKey
  if (root === 'articles') return !isPublicArticleQuery(queryKey)
  return typeof root !== 'string' || !PUBLIC_QUERY_ROOTS.has(root)
}

function isAnonymousViewerQuery(query: Query): boolean {
  return query.meta?.sessionScope?.viewerId === null
}

// Draft articles and hidden catalogue rows depend on the session role
export function dropSessionScopedQueries(
  queryClient: QueryClient,
  { preserveAnonymousViewerQueries = false }: SessionCacheDropOptions = {}
): void {
  queryClient.removeQueries({
    predicate: (query) =>
      isSessionScoped(query.queryKey) &&
      !(preserveAnonymousViewerQueries && isAnonymousViewerQuery(query)),
  })
}
