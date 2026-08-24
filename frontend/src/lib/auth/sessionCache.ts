import type { Query, QueryClient } from '@tanstack/react-query'

const PUBLIC_QUERY_ROOTS: ReadonlySet<string> = new Set(['articles', 'product-tags'])

interface SessionCacheDropOptions {
  preserveAnonymousViewerQueries?: boolean
}

function isSessionScoped(queryKey: readonly unknown[]): boolean {
  const [root] = queryKey
  return typeof root !== 'string' || !PUBLIC_QUERY_ROOTS.has(root)
}

function isAnonymousViewerQuery(query: Query): boolean {
  return query.meta?.sessionScope?.viewerId === null
}

// Catalogue roots stay viewer-scoped because RLS can expose hidden rows to moderators
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
