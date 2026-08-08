import { afterEach, beforeEach, mock } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { expectOk } from '../../../tests/helpers/expectStatus'

export const AVATAR_SIZE = 1024
export const PRODUCT_SIZE = 1200

// The validator only reads the RIFF header and the first chunk, so these
// containers carry no pixel data. One builder per chunk type: each stores the
// canvas size in its own layout.

// VP8L payload: 0x2f signature, then 4 packed bytes holding ((h-1) << 14) | (w-1).
export function buildVp8l(width: number, height: number, padBytes = 100): Buffer {
  const bits = (width - 1) | ((height - 1) << 14)
  const payload = Buffer.alloc(5 + padBytes)
  payload[0] = 0x2f
  payload[1] = bits & 0xff
  payload[2] = (bits >> 8) & 0xff
  payload[3] = (bits >> 16) & 0xff
  payload[4] = (bits >> 24) & 0xff
  return wrapRiff('VP8L', payload)
}

// VP8 (lossy) frame header at bytes 23..29: start code 0x9d 0x01 0x2a, then
// 14-bit width (LE) and 14-bit height (LE).
export function buildVp8Lossy(width: number, height: number, padBytes = 100): Buffer {
  const payload = Buffer.alloc(13 + padBytes)
  payload[3] = 0x9d
  payload[4] = 0x01
  payload[5] = 0x2a
  payload[6] = width & 0xff
  payload[7] = (width >> 8) & 0x3f
  payload[8] = height & 0xff
  payload[9] = (height >> 8) & 0x3f
  return wrapRiff('VP8 ', payload)
}

// VP8X (extended) canvas size at bytes 24..29: 24-bit LE width-1, then height-1.
export function buildVp8x(width: number, height: number, padBytes = 100): Buffer {
  const w = width - 1
  const h = height - 1
  const payload = Buffer.alloc(10 + padBytes)
  payload[4] = w & 0xff
  payload[5] = (w >> 8) & 0xff
  payload[6] = (w >> 16) & 0xff
  payload[7] = h & 0xff
  payload[8] = (h >> 8) & 0xff
  payload[9] = (h >> 16) & 0xff
  return wrapRiff('VP8X', payload)
}

function wrapRiff(chunkType: string, payload: Buffer): Buffer {
  const chunkSize = Buffer.alloc(4)
  chunkSize.writeUInt32LE(payload.length, 0)
  const riffPayload = Buffer.concat([
    Buffer.from('WEBP', 'ascii'),
    Buffer.from(chunkType, 'ascii'),
    chunkSize,
    payload,
  ])
  const riffSize = Buffer.alloc(4)
  riffSize.writeUInt32LE(riffPayload.length, 0)
  return Buffer.concat([Buffer.from('RIFF', 'ascii'), riffSize, riffPayload])
}

export function webpBlob(size: number, padBytes = 100): Blob {
  return webpPart(buildVp8l(size, size, padBytes))
}

// PNG magic bytes behind a WebP content type: the route must trust the bytes.
export function notWebpBlob(): Blob {
  return webpPart(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]))
}

// Copy into a plain Uint8Array: Buffer's backing store is typed ArrayBufferLike,
// which BlobPart rejects.
function webpPart(buf: Buffer): Blob {
  return new Blob([new Uint8Array(buf)], { type: 'image/webp' })
}

// Multipart uploads go through app.request(), whose Response#json() is typed
// unknown, so expectOk cannot infer the envelope. Narrowed once here instead of
// a cast at every call site.
type UploadEnvelope = {
  status: number
  json(): Promise<{ success: true; data: { url: string } } | { success: false }>
}

export async function expectUploadedUrl(res: Response | Promise<Response>): Promise<string> {
  const body = await expectOk<{ url: string }>(
    res as unknown as Promise<UploadEnvelope>,
    HTTP_STATUS.CREATED
  )
  return body.url
}

type Responder = () => Response | Promise<Response>

const CREATED: Responder = () => new Response(null, { status: 201 })

export type BunnyStub = {
  mock: ReturnType<typeof mock>
  respondWith(responder: Responder): void
  putUrls(): string[]
}

// Bunny is the only outbound fetch of the feature, so stubbing the global keeps
// the suites offline and lets them read back what would have reached the CDN.
// Armed again per test, and the default 201 is restored so one failure case does
// not leak into the next test.
export function stubBunnyFetch(): BunnyStub {
  const originalFetch = globalThis.fetch
  let responder = CREATED

  const stub: BunnyStub = {
    mock: mock(),
    respondWith(next) {
      responder = next
    },
    putUrls() {
      return stub.mock.mock.calls.map((call) => String(call[0]))
    },
  }

  beforeEach(() => {
    responder = CREATED
    stub.mock = mock(async () => responder())
    globalThis.fetch = stub.mock as unknown as typeof fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  return stub
}
