import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { type BunnyConfig, existsBunny } from './bunny'

const cfg: BunnyConfig = {
  hostname: 'storage.example.test',
  zone: 'test',
  prefix: 'products/',
  password: 'test-password',
  cdnBase: 'https://cdn.example.test',
}

afterEach(() => {
  spyOn(globalThis, 'fetch').mockRestore()
})

describe('existsBunny', () => {
  it('checks the exact storage object and cancels its image body', async () => {
    const cancel = mock(() => {})
    const body = new ReadableStream({ cancel })
    const fetch = spyOn(globalThis, 'fetch').mockResolvedValue(new Response(body))

    expect(await existsBunny(cfg, 'old.webp')).toBe(true)
    expect(fetch).toHaveBeenCalledWith('https://storage.example.test/test/products/old.webp', {
      headers: { AccessKey: 'test-password' },
    })
    expect(cancel).toHaveBeenCalledTimes(1)
  })

  it('reports a missing file only for HTTP 404', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 404 }))

    expect(await existsBunny(cfg, 'missing.webp')).toBe(false)
  })

  it.each([403, 500])('rejects HTTP %s instead of treating the file as missing', async (status) => {
    spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status }))

    await expect(existsBunny(cfg, 'old.webp')).rejects.toThrow(`GET old.webp: HTTP ${status}`)
  })

  it('propagates network failures instead of treating the file as missing', async () => {
    spyOn(globalThis, 'fetch').mockRejectedValue(new Error('storage unavailable'))

    await expect(existsBunny(cfg, 'old.webp')).rejects.toThrow('storage unavailable')
  })
})
