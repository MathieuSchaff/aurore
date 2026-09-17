import type { DiscussionEntityType } from '@/lib/queries/discussions'

// Deriving both routes here keeps the list link, the back link and the redirect after deletion
// redirect from drifting apart

export function threadListRoute(entityType: DiscussionEntityType) {
  return entityType === 'product'
    ? ('/products/$slug/discussions' as const)
    : ('/ingredients/$slug/discussions' as const)
}

export function threadDetailRoute(entityType: DiscussionEntityType) {
  return entityType === 'product'
    ? ('/products/$slug/discussions/$threadId' as const)
    : ('/ingredients/$slug/discussions/$threadId' as const)
}
