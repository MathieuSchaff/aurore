import { notFound } from '@tanstack/react-router'

import { GlobalError } from '@/component/Feedback/app/GlobalError/GlobalError'
import { isApiError } from './helpers/apiError'

// Only API 404s enter the not found route
// Other errors must reach the real error UI

export function notFoundOn404(err: unknown): never {
  if (isApiError(err) && err.status === 404) throw notFound()
  throw err
}

export function RouteNotFound() {
  return <GlobalError error={new Error('not_found')} is404 />
}
