import type { FeedOrder, PostTone, ReactableType, SkinConcern } from '@aurore/shared'

import type { QueryClient } from '@tanstack/react-query'

// profile.ts needs these keys and social.ts imports profile.ts, so they cannot live in social.ts
// social.ts does not re-export them either, or profile.ts would import social.ts and close the cycle
export const socialKeys = {
  all: ['social'] as const,
  similar: () => [...socialKeys.all, 'similar'] as const,
  profileSearch: (concern: SkinConcern) =>
    [...socialKeys.all, 'profiles', 'search', concern] as const,
  feed: (params: { tone: PostTone; order: FeedOrder; concern?: SkinConcern }) =>
    [...socialKeys.all, 'feed', params] as const,
  // Viewer identity prevents reaction summaries from leaking the previous session state
  reactions: (reactableType: ReactableType, reactableId: string, userId: string | null) =>
    [...socialKeys.all, 'reactions', reactableType, reactableId, userId] as const,
}

export function invalidateSocialReads(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: socialKeys.all })
}
