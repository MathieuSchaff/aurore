import { describe, expect, it } from 'bun:test'

import { validateWebpUpload } from '../validate-image'
import { AVATAR_SIZE, buildVp8Lossy, buildVp8l, buildVp8x } from './uploads-test.setup'

const AVATAR_OPTS = { maxBytes: 200_000, expectedSize: AVATAR_SIZE } as const

const BUILDERS: [string, (width: number, height: number, padBytes?: number) => Buffer][] = [
  ['VP8L (lossless)', buildVp8l],
  ['VP8 (lossy)', buildVp8Lossy],
  ['VP8X (extended)', buildVp8x],
]

describe('validateWebpUpload', () => {
  it.each(BUILDERS)('accepts a valid %s WebP at the expected size', (_label, build) => {
    expect(() => validateWebpUpload(build(1024, 1024), AVATAR_OPTS)).not.toThrow()
  })

  it('rejects non-WebP magic bytes (PNG header)', () => {
    // Padded past the 30-byte floor so the RIFF check is what rejects it,
    // not the truncation check below.
    const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47]), Buffer.alloc(40, 0)])
    expect(() => validateWebpUpload(png, AVATAR_OPTS)).toThrow(/upload_invalid_format/)
  })

  it('rejects buffers exceeding maxBytes', () => {
    expect(() => validateWebpUpload(buildVp8l(1024, 1024, 200_000), AVATAR_OPTS)).toThrow(
      /upload_too_large/
    )
  })

  it('rejects WebP with wrong dimensions', () => {
    expect(() => validateWebpUpload(buildVp8l(800, 800), AVATAR_OPTS)).toThrow(
      /upload_invalid_dimensions/
    )
  })

  it('rejects VP8 (lossy) with missing start code', () => {
    const buf = buildVp8Lossy(1024, 1024)
    buf[23] = 0x00
    expect(() => validateWebpUpload(buf, AVATAR_OPTS)).toThrow(/upload_invalid_format/)
  })

  it('rejects a chunk type it cannot read dimensions from', () => {
    const buf = buildVp8l(1024, 1024)
    buf.write('ANIM', 12, 'ascii')
    expect(() => validateWebpUpload(buf, AVATAR_OPTS)).toThrow(/upload_invalid_format/)
  })

  it('rejects truncated/empty buffers', () => {
    expect(() => validateWebpUpload(Buffer.alloc(0), AVATAR_OPTS)).toThrow(/upload_invalid_format/)
    expect(() => validateWebpUpload(Buffer.from('RIFF'), AVATAR_OPTS)).toThrow(
      /upload_invalid_format/
    )
  })
})
