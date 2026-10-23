import { create } from 'zustand'

import { readClientSession, subscribeClientSessionBoundary, useSession } from '@/lib/auth/session'

type Draft = { productIds: string[]; name: string }
type DraftState = {
  generation: symbol
  drafts: Record<string, Draft>
}

const useDraftStore = create<DraftState>(() => ({ generation: Symbol(), drafts: {} }))

// Keep invalidation alive during visits to public detail pages
const unsubscribe = subscribeClientSessionBoundary(() => {
  useDraftStore.setState({ generation: Symbol(), drafts: {} })
})
if (import.meta.hot) import.meta.hot.dispose(unsubscribe)

function writeDraft(key: string, draft: Draft, generation: symbol) {
  if (readClientSession().status !== 'authenticated') return
  useDraftStore.setState((state) =>
    state.generation === generation ? { drafts: { ...state.drafts, [key]: draft } } : state
  )
}

export function useComparisonDraft(key: string, seedProductId?: string) {
  const session = useSession()
  const generation = useDraftStore((state) => state.generation)
  const stored = useDraftStore((state) => state.drafts[key])
  const draft = session.status === 'authenticated' ? stored : undefined
  const productIds = draft?.productIds ?? (seedProductId ? [seedProductId] : [])
  const name = draft?.name ?? ''

  const clearDraft = () => {
    useDraftStore.setState((state) => {
      if (state.generation !== generation) return state
      const drafts = { ...state.drafts }
      delete drafts[key]
      return { drafts }
    })
  }

  return {
    productIds,
    name,
    setProductIds: (next: string[]) => writeDraft(key, { productIds: next, name }, generation),
    setName: (next: string) => writeDraft(key, { productIds, name: next }, generation),
    clearDraft,
  }
}
