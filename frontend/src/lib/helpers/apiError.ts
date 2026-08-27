import type { ApiFailure, ApiResponse } from '@aurore/shared'

export class ApiError extends Error {
  status: number
  code: string
  details?: unknown

  constructor(code: string, status: number, details?: unknown) {
    super(code)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError
}

export function isApiErrorCode<E extends string>(
  err: unknown,
  code: E
): err is ApiError & { code: E } {
  return isApiError(err) && err.code === code
}

export function apiErrorMessage<E extends string>(
  err: unknown,
  messages: Partial<Record<E, string>>,
  fallback: string
): string {
  if (!isApiError(err)) return fallback
  return messages[err.code as E] ?? fallback
}

export async function throwIfNotOk(res: Response): Promise<void> {
  if (res.ok) return
  let code = 'http_error'
  let details: unknown
  try {
    const body = (await res.json()) as Partial<ApiFailure>
    if (body.success === false && typeof body.error === 'string') {
      code = body.error
      details = body.details
    }
  } catch {
    // Body isn't JSON: fall back to status-only branching.
  }
  throw new ApiError(code, res.status, details)
}

export async function unwrapData<T>(
  res: Response & { json(): Promise<ApiResponse<T>> }
): Promise<T> {
  await throwIfNotOk(res)
  const json = await res.json()
  if (!json.success) throw new ApiError(json.error, res.status, json.details)
  return json.data
}

export function isRateLimitError(err: unknown): err is ApiError {
  return (
    isApiError(err) &&
    err.status === 429 &&
    (err.code === 'rate_limit_exceeded' ||
      err.code === 'too_many_requests' ||
      err.code === 'ingredient_rate_limited' ||
      err.code === 'product_rate_limited')
  )
}

export function rateLimitRetryAfter(err: unknown): number | null {
  if (!isRateLimitError(err)) return null
  const raw = (err.details as { retryAfter?: number | string | null } | undefined)?.retryAfter
  // Retry-After is an HTTP header, so the backend forwards details.retryAfter as a string
  const sec = typeof raw === 'string' ? Number(raw) : raw
  return typeof sec === 'number' && Number.isFinite(sec) ? sec : null
}

export function formatRetryDelay(seconds: number): string {
  return seconds >= 60 ? `${Math.ceil(seconds / 60)} min` : `${seconds} s`
}

export function rateLimitMessage(err: unknown): string | null {
  if (!isRateLimitError(err)) return null
  const sec = rateLimitRetryAfter(err)
  return sec === null
    ? 'Trop de requêtes, réessayez dans un instant.'
    : `Trop de requêtes, réessayez dans ${formatRetryDelay(sec)}.`
}

export type FormErrorMap<F extends string = string, E extends string = string> = Partial<
  Record<E, { field?: F; message: string }>
>

export function extractFormError<F extends string, E extends string>(
  err: unknown,
  map: FormErrorMap<F, E>,
  fallback = 'Une erreur est survenue lors de la sauvegarde.'
): { field?: F; message: string } {
  if (isApiError(err)) {
    const entry = map[err.code as E]
    if (entry) return entry
  }
  return { message: fallback }
}
