import { notFound } from '@tanstack/react-router'

import { GlobalError } from '@/component/Feedback/app/GlobalError/GlobalError'
import { isApiError } from './helpers/apiError'

// The two ends of one rule: a 404 from the API becomes the router's notFound, every
// other status stays on the real error UI. Written once so no loader can drop the
// rethrow and swallow a 500

export function notFoundOn404(err: unknown): never {
  if (isApiError(err) && err.status === 404) throw notFound()
  throw err
}

export function RouteNotFound() {
  return <GlobalError error={new Error('not_found')} is404 />
}
