// Hono narrows status to what the route returns with c.json
// Errors thrown to the global handler are absent from that union
// Widen status so error assertions keep compiling

import { expect } from 'bun:test'

import type { ApiFailure, ApiSuccess } from '@aurore/shared'
import { HTTP_STATUS } from '@aurore/shared'

export function expectStatus(res: { status: number }, code: number): void {
  expect(res.status as number).toBe(code)
}

type OkEnvelope<T> = ApiSuccess<T> | Pick<ApiFailure, 'success'>
type JsonResponse<T> = { status: number; json(): Promise<OkEnvelope<T>> }

// testClient infers T, while app.request returns an untyped Response
// Bare Response callers must provide T explicitly
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

// Thrown errors are absent from the route's return type
// Accept json() structurally so assertions also work with Hono responses
// D narrows the details returned to the client
export async function expectError<D = unknown>(
  resOrPromise:
    | { status: number; json(): Promise<unknown> }
    | Promise<{ status: number; json(): Promise<unknown> }>,
  status: number,
  code?: string
): Promise<ApiFailure<string, D>> {
  const res = await resOrPromise
  expect(res.status as number).toBe(status)
  const body = (await res.json()) as ApiFailure<string, D>
  if (body?.success !== false)
    throw new Error(`expected error (status ${status}), got ${JSON.stringify(body)}`)
  if (code !== undefined) expect(body.error).toBe(code)
  return body
}
