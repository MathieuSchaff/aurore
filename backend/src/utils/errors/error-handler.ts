import {
  articleErrorMapping,
  type ContentfulHttpStatus,
  discussionErrorMapping,
  err,
  errorToStatus,
  HTTP_STATUS,
  type HttpStatus,
  ingredientErrorMapping,
  productComparisonErrorMapping,
  productErrorMapping,
  productIngredientErrorMapping,
  profileErrorMapping,
  purchaseErrorMapping,
  socialPostErrorMapping,
  socialReactionErrorMapping,
  tagErrorMapping,
  userProductErrorMapping,
} from '@aurore/shared'

import { SpanStatusCode, trace } from '@opentelemetry/api'
import type { Context } from 'hono'

import type { AppEnv } from '../../app-env'
import { logger } from '../../lib/logger'

interface AppError extends Error {
  code: string
  details?: unknown
}

interface HttpError extends Error {
  status: number
}

const errorMappingRegistry = new Map<string, Record<string, HttpStatus>>([
  ['ProductError', productErrorMapping as Record<string, HttpStatus>],
  ['ProductComparisonError', productComparisonErrorMapping as Record<string, HttpStatus>],
  ['IngredientError', ingredientErrorMapping as Record<string, HttpStatus>],
  ['ProductIngredientError', productIngredientErrorMapping as Record<string, HttpStatus>],
  ['PurchaseError', purchaseErrorMapping as Record<string, HttpStatus>],
  ['TagError', tagErrorMapping as Record<string, HttpStatus>],
  ['UserProductError', userProductErrorMapping as Record<string, HttpStatus>],
  ['BlogError', articleErrorMapping as Record<string, HttpStatus>],
  ['DiscussionError', discussionErrorMapping as Record<string, HttpStatus>],
  ['ProfileError', profileErrorMapping as Record<string, HttpStatus>],
  ['SocialPostError', socialPostErrorMapping as Record<string, HttpStatus>],
  ['SocialReactionError', socialReactionErrorMapping as Record<string, HttpStatus>],
])

export async function globalErrorHandler(error: Error, c: Context<AppEnv>) {
  const requestContext = {
    requestId: c.get('requestId'),
    path: c.req.path,
    method: c.req.method,
  }

  if ('code' in error && typeof (error as AppError).code === 'string') {
    const appError = error as AppError
    const mapping = errorMappingRegistry.get(appError.constructor.name) ?? {}
    const code = appError.code
    const details = appError.details
    const status = errorToStatus(code, mapping) as ContentfulHttpStatus

    // errorToStatus falls back to 500 on an unmapped code, so a domain error could answer
    // 500 with no trace at all. 4xx stays silent here: the request middleware already
    // records it, and only a 5xx is worth a stack in Grafana.
    if (status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      logger.error(
        {
          err: appError,
          code,
          ...requestContext,
        },
        'Domain error'
      )
    }

    return c.json(err(code, details), status)
  }

  if ('status' in error && typeof (error as HttpError).status === 'number') {
    const httpError = error as HttpError
    const status = httpError.status as ContentfulHttpStatus
    // 4xx = client mistake, logged info and kept local only (dropped at Alloy, which ships >= warn).
    // 5xx = real server problem, logged error and shipped to Grafana Cloud.
    const logHttpError = status >= HTTP_STATUS.INTERNAL_SERVER_ERROR ? logger.error : logger.info
    logHttpError.call(logger, { err: httpError, ...requestContext }, 'HTTP error')
    // Don't leak arbitrary error messages (libs/framework) to clients in prod; keep them server-side.
    return c.json(
      err('http_error', process.env.NODE_ENV === 'development' ? httpError.message : undefined),
      status
    )
  }

  const span = trace.getActiveSpan()
  span?.recordException(error)
  span?.setAttribute('http.method', c.req.method)
  span?.setAttribute('http.route', c.req.path)
  span?.setAttribute('http.status_code', HTTP_STATUS.INTERNAL_SERVER_ERROR)
  span?.setStatus({ code: SpanStatusCode.ERROR, message: error.message })

  logger.error({ err: error, ...requestContext }, 'Unhandled internal error')

  return c.json(
    err('server_error', process.env.NODE_ENV === 'development' ? error.stack : undefined),
    HTTP_STATUS.INTERNAL_SERVER_ERROR
  )
}
