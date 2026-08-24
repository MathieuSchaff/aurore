import { type Mutation, MutationCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { isApiError, isRateLimitError, rateLimitMessage } from './helpers/apiError'
import { captureFrontendError } from './observability/faro'

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: {
      sessionScope?: { viewerId: string | null }
    }
    mutationMeta: {
      errorMessage?: string
      handledErrorCodes?: readonly string[]
    }
  }
}

export function handleMutationError(error: unknown, mutation: Pick<Mutation, 'meta' | 'options'>) {
  const apiError = isApiError(error) ? error : null
  const isHandled =
    apiError?.code === 'banned' ||
    isRateLimitError(error) ||
    (apiError !== null && mutation.meta?.handledErrorCodes?.includes(apiError.code) === true)

  if (!isHandled) {
    captureFrontendError(error, {
      source: 'mutation',
      ...(apiError && { errorCode: apiError.code, status: apiError.status }),
      mutationKey: mutation.options.mutationKey,
    })
  }
  const fallbackMessage = mutation.meta?.errorMessage
  const message = fallbackMessage ? (rateLimitMessage(error) ?? fallbackMessage) : undefined
  // `id` dedupes identical toasts from parallel failures (e.g. unreachable backend).
  if (message) toast.error(message, { id: message })
}
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        // 4xx won't recover on retry; only retry transient failures once.
        retry: (failureCount, err) => {
          if (isApiError(err) && err.status >= 400 && err.status < 500) return false
          return failureCount < 1
        },
      },
    },
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) => handleMutationError(error, mutation),
    }),
  })
}
export const queryClient = makeQueryClient()
