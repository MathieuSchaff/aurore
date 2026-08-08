import { describe, expect, it } from 'bun:test'

import { putToBunny } from '../bunny-client'
import { UploadError } from '../upload-error'
import { stubBunnyFetch } from './uploads-test.setup'

describe('putToBunny', () => {
  const bunny = stubBunnyFetch()

  it('PUTs to Bunny URL with AccessKey header', async () => {
    await putToBunny('avatars/abc.webp', Buffer.from([1, 2, 3]))
    expect(bunny.mock).toHaveBeenCalledTimes(1)
    const [url, init] = bunny.mock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://storage.bunnycdn.com/test-zone/avatars/abc.webp')
    expect(init.method).toBe('PUT')
    expect((init.headers as Record<string, string>).AccessKey).toBe('test-password')
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('image/webp')
  })

  it('throws UploadError(upload_storage_failed) on non-2xx', async () => {
    bunny.respondWith(() => new Response('boom', { status: 500 }))
    await expect(putToBunny('x.webp', Buffer.from([1]))).rejects.toBeInstanceOf(UploadError)
  })

  it('throws UploadError(upload_storage_failed) on network error', async () => {
    bunny.respondWith(() => {
      throw new TypeError('fetch failed')
    })
    await expect(putToBunny('x.webp', Buffer.from([1]))).rejects.toBeInstanceOf(UploadError)
  })
})
