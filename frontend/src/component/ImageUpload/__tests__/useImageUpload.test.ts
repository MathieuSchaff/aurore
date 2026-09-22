import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { readBearerForTransport } from '@/lib/auth/credential'
import { ensureFresh } from '@/lib/auth/freshness'
import { useImageUpload } from '../useImageUpload'

vi.mock('@/lib/auth/credential', () => ({
  readBearerForTransport: vi.fn(),
}))

// Stub only the network side of the freshness engine; keep real isExpired/scheduling.
vi.mock('@/lib/auth/freshness', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/auth/freshness')>()
  return { ...actual, ensureFresh: vi.fn() }
})

function installCanvasMock(blobSize = 50_000) {
  const originalToBlob = HTMLCanvasElement.prototype.toBlob
  const originalGetContext = HTMLCanvasElement.prototype.getContext

  // jsdom does not implement canvas 2d, so provide a no-op context stub
  ;(HTMLCanvasElement.prototype.getContext as unknown) = () => ({ drawImage: () => {} })
  ;(HTMLCanvasElement.prototype.toBlob as unknown) = (cb: BlobCallback) => {
    cb(new Blob([new Uint8Array(blobSize)], { type: 'image/webp' }))
  }
  return () => {
    HTMLCanvasElement.prototype.toBlob = originalToBlob
    HTMLCanvasElement.prototype.getContext = originalGetContext
  }
}

function installXhrMock(opts: {
  status: number
  responseJson: object
  defer?: (complete: () => void) => void
}) {
  class FakeXhr {
    upload = { onprogress: null as ((e: ProgressEvent) => void) | null }
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    status = opts.status
    responseText = JSON.stringify(opts.responseJson)
    open() {}
    setRequestHeader() {}
    send() {
      const complete = () => {
        this.upload.onprogress?.(new ProgressEvent('progress', { loaded: 50, total: 100 }))
        this.onload?.()
      }
      if (opts.defer) opts.defer(complete)
      else complete()
    }
  }
  const original = globalThis.XMLHttpRequest
  // MSW patches XMLHttpRequest via defineProperty (no writable:true), so direct
  // assignment throws. Use defineProperty to bypass that restriction.
  Object.defineProperty(globalThis, 'XMLHttpRequest', {
    value: FakeXhr,
    writable: true,
    configurable: true,
  })
  return () => {
    Object.defineProperty(globalThis, 'XMLHttpRequest', {
      value: original,
      writable: true,
      configurable: true,
    })
  }
}

describe('useImageUpload', () => {
  let restoreCanvas: () => void
  let restoreXhr: (() => void) | undefined

  beforeEach(() => {
    restoreCanvas = installCanvasMock()
    vi.mocked(readBearerForTransport).mockReturnValue(null)
  })
  afterEach(() => {
    restoreCanvas()
    restoreXhr?.()
    restoreXhr = undefined
    vi.mocked(ensureFresh).mockReset()
    vi.mocked(readBearerForTransport).mockReset()
  })

  it('moves through compressing → uploading → idle on success', async () => {
    restoreXhr = installXhrMock({
      status: 201,
      responseJson: { success: true, data: { url: 'https://cdn/x.webp?v=1' } },
    })
    const { result } = renderHook(() =>
      useImageUpload({
        endpoint: '/api/uploads/avatar',
        outputSize: 1024,
        sourceImageForTest: new Image(),
        notFoundLabel: 'Avatar',
      })
    )

    await act(async () => {
      await result.current.confirmCrop({ x: 0, y: 0, size: 1024 })
    })
    await waitFor(() => expect(result.current.state.phase).toBe('idle'))
  })

  it.each([201, 500])(
    'locks selection until the pending upload settles with %s',
    async (status) => {
      let finishCompression: BlobCallback | undefined
      let finishUpload: (() => void) | undefined
      HTMLCanvasElement.prototype.toBlob = (callback) => {
        finishCompression = callback
      }
      restoreXhr = installXhrMock({
        status,
        responseJson:
          status === 201
            ? { success: true, data: { url: 'https://cdn/x.webp' } }
            : { success: false, error: 'upload_storage_failed' },
        defer: (complete) => {
          finishUpload = complete
        },
      })
      const picker = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
      const { result } = renderHook(() =>
        useImageUpload({
          endpoint: '/api/uploads/avatar',
          outputSize: 1024,
          sourceImageForTest: new Image(),
          notFoundLabel: 'Avatar',
        })
      )
      const previous = result.current
      let pending: Promise<unknown> | undefined
      try {
        act(() => {
          pending = previous
            .confirmCrop({ x: 0, y: 0, size: 1024 })
            .catch((error: unknown) => error)
          previous.pickFile()
          previous.dropFile(new File(['x'], 'invalid.txt', { type: 'text/plain' }))
          previous.cancel()
        })
        // A stale callback must not replace the in-flight phase before React has rendered the lock.
        expect(result.current.state.phase).toBe('compressing')
        expect(picker).not.toHaveBeenCalled()
        await expect(previous.confirmCrop({ x: 0, y: 0, size: 1024 })).rejects.toThrow(
          'upload_in_progress'
        )
        await act(async () => {
          finishCompression?.(new Blob(['image'], { type: 'image/webp' }))
        })
        expect(result.current.state.phase).toBe('uploading')
        act(() => {
          result.current.pickFile()
          previous.cancel()
        })
        expect(picker).not.toHaveBeenCalled()
        expect(result.current.state.phase).toBe('uploading')
        await act(async () => {
          finishUpload?.()
          await pending
        })
        expect(result.current.state.phase).toBe(status === 201 ? 'idle' : 'error')
        act(() => {
          result.current.pickFile()
        })
        expect(picker).toHaveBeenCalledOnce()
      } finally {
        picker.mockRestore()
      }
    }
  )

  it('reports error when XHR returns non-2xx with mapped code', async () => {
    restoreXhr = installXhrMock({
      status: 400,
      responseJson: { success: false, error: 'upload_too_large' },
    })
    const { result } = renderHook(() =>
      useImageUpload({
        endpoint: '/api/uploads/avatar',
        outputSize: 1024,
        sourceImageForTest: new Image(),
        notFoundLabel: 'Avatar',
      })
    )
    await act(async () => {
      try {
        await result.current.confirmCrop({ x: 0, y: 0, size: 1024 })
      } catch {
        /* expected reject */
      }
    })
    await waitFor(() => expect(result.current.state.phase).toBe('error'))
    if (result.current.state.phase === 'error') {
      expect(result.current.state.code).toBe('upload_too_large')
    }
  })

  it('names the caller subject in the not_found message', async () => {
    restoreXhr = installXhrMock({
      status: 404,
      responseJson: { success: false, error: 'not_found' },
    })
    const { result } = renderHook(() =>
      useImageUpload({
        endpoint: '/api/uploads/product/foo',
        outputSize: 1200,
        sourceImageForTest: new Image(),
        notFoundLabel: 'Produit',
      })
    )
    await act(async () => {
      try {
        await result.current.confirmCrop({ x: 0, y: 0, size: 1200 })
      } catch {
        /* expected reject */
      }
    })
    await waitFor(() => expect(result.current.state.phase).toBe('error'))
    if (result.current.state.phase === 'error') {
      expect(result.current.state.message).toMatch(/produit.*introuvable.*rechargez.*page/i)
    }
  })

  it('rejects a non-image file on drop', () => {
    const { result } = renderHook(() =>
      useImageUpload({
        endpoint: '/api/uploads/avatar',
        outputSize: 1024,
        sourceImageForTest: new Image(),
        notFoundLabel: 'Avatar',
      })
    )
    act(() => {
      result.current.dropFile(new File(['x'], 'note.txt', { type: 'text/plain' }))
    })
    expect(result.current.state.phase).toBe('error')
    if (result.current.state.phase === 'error') {
      expect(result.current.state.code).toBe('upload_invalid_format')
    }
  })

  it('accepts an image MIME on drop', () => {
    const orig = URL.createObjectURL
    URL.createObjectURL = () => 'blob:mock'
    try {
      const { result } = renderHook(() =>
        useImageUpload({
          endpoint: '/api/uploads/avatar',
          outputSize: 1024,
          sourceImageForTest: new Image(),
          notFoundLabel: 'Avatar',
        })
      )
      act(() => {
        result.current.dropFile(new File(['x'], 'photo.jpg', { type: 'image/jpeg' }))
      })
      // Accepted MIME must not hit the rejection branch; image load is a no-op in jsdom so it stays idle.
      expect(result.current.state.phase).toBe('idle')
    } finally {
      URL.createObjectURL = orig
    }
  })

  it('revokes the source URL when the browser cannot decode the image', () => {
    const originalImage = globalThis.Image
    const originalCreateObjectURL = URL.createObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL
    const image = document.createElement('img')
    const revokeObjectURL = vi.fn()

    function MockImage() {
      return image
    }
    Object.defineProperty(globalThis, 'Image', {
      value: MockImage,
      writable: true,
      configurable: true,
    })
    URL.createObjectURL = () => 'blob:invalid'
    URL.revokeObjectURL = revokeObjectURL

    try {
      const { result } = renderHook(() =>
        useImageUpload({
          endpoint: '/api/uploads/avatar',
          outputSize: 1024,
          sourceImageForTest: new Image(),
          notFoundLabel: 'Avatar',
        })
      )

      act(() => {
        result.current.dropFile(new File(['x'], 'broken.jpg', { type: 'image/jpeg' }))
        image.onerror?.call(image, new Event('error'))
      })

      expect(revokeObjectURL).toHaveBeenCalledWith('blob:invalid')
      expect(result.current.state.phase).toBe('error')
    } finally {
      Object.defineProperty(globalThis, 'Image', {
        value: originalImage,
        writable: true,
        configurable: true,
      })
      URL.createObjectURL = originalCreateObjectURL
      URL.revokeObjectURL = originalRevokeObjectURL
    }
  })

  it('revokes a pending source URL when the hook unmounts', () => {
    const originalCreateObjectURL = URL.createObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL
    const revokeObjectURL = vi.fn()
    URL.createObjectURL = () => 'blob:pending'
    URL.revokeObjectURL = revokeObjectURL

    try {
      const { result, unmount } = renderHook(() =>
        useImageUpload({
          endpoint: '/api/uploads/avatar',
          outputSize: 1024,
          sourceImageForTest: new Image(),
          notFoundLabel: 'Avatar',
        })
      )

      act(() => {
        result.current.dropFile(new File(['x'], 'photo.jpg', { type: 'image/jpeg' }))
      })
      unmount()

      expect(revokeObjectURL).toHaveBeenCalledWith('blob:pending')
    } finally {
      URL.createObjectURL = originalCreateObjectURL
      URL.revokeObjectURL = originalRevokeObjectURL
    }
  })

  it('returns to idle on cancel', () => {
    const { result } = renderHook(() =>
      useImageUpload({
        endpoint: '/api/uploads/avatar',
        outputSize: 1024,
        sourceImageForTest: new Image(),
        notFoundLabel: 'Avatar',
      })
    )
    act(() => {
      result.current.cancel()
    })
    expect(result.current.state.phase).toBe('idle')
  })

  it('sets Authorization header when the transport credential is present', async () => {
    vi.mocked(readBearerForTransport).mockReturnValue('test-tok-abc')
    const capturedHeaders: Array<[string, string]> = []
    const original = globalThis.XMLHttpRequest

    class CapturingXhr {
      upload = { onprogress: null as ((e: ProgressEvent) => void) | null }
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      status = 201
      responseText = JSON.stringify({ success: true, data: { url: 'https://cdn/x.webp?v=1' } })
      open() {}
      setRequestHeader(name: string, value: string) {
        capturedHeaders.push([name, value])
      }
      send() {
        this.onload?.()
      }
    }
    Object.defineProperty(globalThis, 'XMLHttpRequest', {
      value: CapturingXhr,
      writable: true,
      configurable: true,
    })

    try {
      const { result } = renderHook(() =>
        useImageUpload({
          endpoint: '/api/uploads/product/test-slug',
          outputSize: 1200,
          sourceImageForTest: new Image(),
          notFoundLabel: 'Produit',
        })
      )
      await act(async () => {
        await result.current.confirmCrop({ x: 0, y: 0, size: 1200 })
      })
      await waitFor(() => expect(result.current.state.phase).toBe('idle'))
      expect(capturedHeaders).toContainEqual(['Authorization', 'Bearer test-tok-abc'])
    } finally {
      Object.defineProperty(globalThis, 'XMLHttpRequest', {
        value: original,
        writable: true,
        configurable: true,
      })
    }
  })

  it('omits Authorization header when the transport credential is absent', async () => {
    const capturedHeaders: Array<[string, string]> = []
    const original = globalThis.XMLHttpRequest

    class CapturingXhr {
      upload = { onprogress: null as ((e: ProgressEvent) => void) | null }
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      status = 201
      responseText = JSON.stringify({ success: true, data: { url: 'https://cdn/x.webp?v=1' } })
      open() {}
      setRequestHeader(name: string, value: string) {
        capturedHeaders.push([name, value])
      }
      send() {
        this.onload?.()
      }
    }
    Object.defineProperty(globalThis, 'XMLHttpRequest', {
      value: CapturingXhr,
      writable: true,
      configurable: true,
    })

    try {
      const { result } = renderHook(() =>
        useImageUpload({
          endpoint: '/api/uploads/avatar',
          outputSize: 1024,
          sourceImageForTest: new Image(),
          notFoundLabel: 'Avatar',
        })
      )
      await act(async () => {
        await result.current.confirmCrop({ x: 0, y: 0, size: 1024 })
      })
      await waitFor(() => expect(result.current.state.phase).toBe('idle'))
      expect(capturedHeaders.find(([name]) => name === 'Authorization')).toBeUndefined()
    } finally {
      Object.defineProperty(globalThis, 'XMLHttpRequest', {
        value: original,
        writable: true,
        configurable: true,
      })
    }
  })

  it('retries compression quality when first blob exceeds maxOutputBytes', async () => {
    // First toBlob call returns 250_000 bytes (> default 200_000),
    // second returns 150_000 (under budget).
    const originalToBlob = HTMLCanvasElement.prototype.toBlob
    let callCount = 0
    ;(HTMLCanvasElement.prototype.toBlob as unknown) = (cb: BlobCallback) => {
      callCount++
      const size = callCount === 1 ? 250_000 : 150_000
      cb(new Blob([new Uint8Array(size)], { type: 'image/webp' }))
    }
    try {
      restoreXhr = installXhrMock({
        status: 201,
        responseJson: { success: true, data: { url: 'https://cdn/x.webp?v=1' } },
      })
      const { result } = renderHook(() =>
        useImageUpload({
          endpoint: '/api/uploads/avatar',
          outputSize: 1024,
          sourceImageForTest: new Image(),
          notFoundLabel: 'Avatar',
        })
      )
      await act(async () => {
        await result.current.confirmCrop({ x: 0, y: 0, size: 1024 })
      })
      await waitFor(() => expect(result.current.state.phase).toBe('idle'))
      expect(callCount).toBe(2)
    } finally {
      HTMLCanvasElement.prototype.toBlob = originalToBlob
    }
  })

  it('refreshes and retries once with the rotated token on a 401', async () => {
    vi.mocked(readBearerForTransport).mockReturnValueOnce('stale-tok').mockReturnValue('fresh-tok')
    const sentAuth: Array<string | undefined> = []
    const original = globalThis.XMLHttpRequest

    class RetryXhr {
      upload = { onprogress: null as ((e: ProgressEvent) => void) | null }
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      status = 0
      responseText = ''
      private authHeader: string | undefined
      open() {}
      setRequestHeader(name: string, value: string) {
        if (name === 'Authorization') this.authHeader = value
      }
      send() {
        sentAuth.push(this.authHeader)
        if (sentAuth.length === 1) {
          this.status = 401
          this.responseText = JSON.stringify({ success: false, error: 'unauthorized' })
        } else {
          this.status = 201
          this.responseText = JSON.stringify({ success: true, data: { url: 'https://cdn/x?v=2' } })
        }
        this.onload?.()
      }
    }
    Object.defineProperty(globalThis, 'XMLHttpRequest', {
      value: RetryXhr,
      writable: true,
      configurable: true,
    })

    vi.mocked(ensureFresh).mockResolvedValue('ok')

    try {
      const { result } = renderHook(() =>
        useImageUpload({
          endpoint: '/api/uploads/avatar',
          outputSize: 1024,
          sourceImageForTest: new Image(),
          notFoundLabel: 'Avatar',
        })
      )
      await act(async () => {
        await result.current.confirmCrop({ x: 0, y: 0, size: 1024 })
      })
      await waitFor(() => expect(result.current.state.phase).toBe('idle'))
      expect(ensureFresh).toHaveBeenCalledOnce()
      expect(sentAuth).toEqual(['Bearer stale-tok', 'Bearer fresh-tok'])
    } finally {
      Object.defineProperty(globalThis, 'XMLHttpRequest', {
        value: original,
        writable: true,
        configurable: true,
      })
    }
  })

  it('surfaces the auth error when the silent refresh fails after a 401', async () => {
    vi.mocked(readBearerForTransport).mockReturnValue('stale-tok')
    vi.mocked(ensureFresh).mockResolvedValue('failed')
    restoreXhr = installXhrMock({
      status: 401,
      responseJson: { success: false, error: 'unauthorized' },
    })
    const { result } = renderHook(() =>
      useImageUpload({
        endpoint: '/api/uploads/avatar',
        outputSize: 1024,
        sourceImageForTest: new Image(),
        notFoundLabel: 'Avatar',
      })
    )
    await act(async () => {
      try {
        await result.current.confirmCrop({ x: 0, y: 0, size: 1024 })
      } catch {
        /* expected reject */
      }
    })
    await waitFor(() => expect(result.current.state.phase).toBe('error'))
    expect(ensureFresh).toHaveBeenCalledOnce()
    if (result.current.state.phase === 'error') {
      expect(result.current.state.code).toBe('unauthorized')
    }
  })
})
