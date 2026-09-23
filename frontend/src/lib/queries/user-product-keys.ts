// Separate root so history invalidates independently of the current collection
const userProductHistoryRoot = ['user-product-history'] as const

export const userProductKeys = {
  all: ['user-products'] as const,
  lists: () => [...userProductKeys.all, 'list'] as const,
  list: () => [...userProductKeys.lists()] as const,
  historyRoot: () => userProductHistoryRoot,
  history: (id: string) => [...userProductHistoryRoot, id] as const,
}
