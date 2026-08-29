import type { QueryClient } from '@tanstack/react-query'

import { awaitBootRefresh } from '@/lib/auth/awaitBootRefresh'
import {
  viewerId as getSessionViewerId,
  readClientSession,
  readRequestSession,
} from '@/lib/auth/session'
import { isServer } from '@/lib/helpers/isServer'

export async function resolveProductDetailViewer(
  queryClient: QueryClient,
  parentMatchPromise: Promise<unknown>
): Promise<string | null> {
  if (isServer) {
    await parentMatchPromise
    return getSessionViewerId(readRequestSession(queryClient))
  }

  await awaitBootRefresh(queryClient)
  return getSessionViewerId(readClientSession())
}
