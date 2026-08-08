// Hono's testClient narrows `res.status` to the literal union the route returns via
// `c.json(..., STATUS)`. Routes that throw and rely on the global error handler expose
// only the success status in their type, so `expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)`
// clashes. This helper erases the narrowing for those assertions.

import { expect } from 'bun:test'

import type { ApiError } from '@aurore/shared'
import { HTTP_STATUS } from '@aurore/shared'

export function expectStatus(res: { status: number }, code: number): void {
  expect(res.status as number).toBe(code)
}

type OkEnvelope<T> = { success: true; data: T } | { success: false }
type JsonResponse<T> = { status: number; json(): Promise<OkEnvelope<T>> }

// The typed overload infers T from a testClient response. A bare `Response`
// (app.request) types json() as unknown, so those callers name T themselves:
// same escape hatch expectError already offers on the failure side.
export function expectOk<T>(
  resOrPromise: JsonResponse<T> | Promise<JsonResponse<T>>,
  status?: number
): Promise<T>
export function expectOk<T = unknown>(
  resOrPromise: Response | Promise<Response>,
  status?: number
): Promise<T>
export async function expectOk<T>(
  resOrPromise: JsonResponse<T> | Promise<JsonResponse<T>> | Response | Promise<Response>,
  status: number = HTTP_STATUS.OK
): Promise<T> {
  const res = await resOrPromise
  expect(res.status as number).toBe(status)
  const data = (await res.json()) as OkEnvelope<T>
  if (!data.success) throw new Error(`expected ok (status ${status}), got ${JSON.stringify(data)}`)
  return data.data
}

// Error responses never appear in the route's return type, so `json()` is typed
// structurally here and the body is cast back to the real envelope. `D` types
// the free-form `details` payload without widening `ApiError` itself.
export async function expectError<D = unknown>(
  resOrPromise:
    | { status: number; json(): Promise<unknown> }
    | Promise<{ status: number; json(): Promise<unknown> }>,
  status: number,
  code?: string
): Promise<ApiError & { details?: D }> {
  const res = await resOrPromise
  expect(res.status as number).toBe(status)
  const body = (await res.json()) as ApiError & { details?: D }
  if (body?.success !== false)
    throw new Error(`expected error (status ${status}), got ${JSON.stringify(body)}`)
  if (code !== undefined) expect(body.error).toBe(code)
  return body
}
