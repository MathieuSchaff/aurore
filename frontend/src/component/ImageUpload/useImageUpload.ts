import { useCallback, useEffect, useRef, useState } from 'react'

import { readBearerForTransport } from '@/lib/auth/credential'
import { ensureFresh } from '@/lib/auth/freshness'
import { queryClient } from '@/lib/queryClient'

type Phase =
  | { phase: 'idle' }
  | { phase: 'cropping'; sourceUrl: string; sourceFile: File; sourceImage: HTMLImageElement }
  | { phase: 'compressing' }
  | { phase: 'uploading'; progress: number }
  | { phase: 'error'; message: string; code: string }

type CropArea = { x: number; y: number; size: number }

export type UseImageUploadOptions = {
  endpoint: string
  outputSize: 1024 | 1200
  maxOutputBytes?: number
  // jsdom has neither File nor createObjectURL, so a test hands the crop step an image instead of
  // going through the picker. Declared here rather than grafted onto the returned object: the
  // coupling is real, and a contract states it where a hidden property could not.
  sourceImageForTest?: HTMLImageElement
}

const ERROR_MESSAGES: Record<string, string> = {
  upload_invalid_format: 'Format invalide',
  upload_too_large: 'Image trop volumineuse',
  upload_invalid_dimensions: 'Dimensions incorrectes',
  upload_storage_failed: 'Échec serveur, réessayez',
  compress_too_large: 'Compression impossible',
  source_too_large: 'Image source > 8 Mo',
  not_found: 'Produit introuvable',
  unknown: 'Erreur inconnue',
}

const SOURCE_MAX_BYTES = 8 * 1024 * 1024
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

// Extracted from the hook so the compiler can optimize confirmCrop's useCallback.
// React Compiler bails on try/finally inside a hook body; a plain async function is fine.
async function runConfirmCrop(
  image: HTMLImageElement,
  releaseSourceUrl: (() => void) | null,
  area: CropArea,
  compress: (image: HTMLImageElement, area: CropArea) => Promise<Blob>,
  uploadXhr: (blob: Blob) => Promise<{ url: string }>,
  setState: (phase: Phase) => void
): Promise<{ url: string }> {
  try {
    setState({ phase: 'compressing' })
    const blob = await compress(image, area)
    setState({ phase: 'uploading', progress: 0 })
    const result = await uploadXhr(blob)
    setState({ phase: 'idle' })
    return result
  } catch (e) {
    const code = (e as { code?: string }).code ?? 'unknown'
    setState({ phase: 'error', code, message: ERROR_MESSAGES[code] ?? ERROR_MESSAGES.unknown })
    throw e
  } finally {
    releaseSourceUrl?.()
  }
}

// Raw XHR (for progress events) bypasses the fetch 401-interceptor in lib/api; mirror it here so
// an expired session recovers via one silent-refresh + retry. Module-level keeps the try/catch out
// of the hook body so the React Compiler can still optimize the wrapping useCallback.
async function uploadWithRetry(
  blob: Blob,
  endpoint: string,
  setState: (phase: Phase) => void
): Promise<{ url: string }> {
  const form = new FormData()
  form.append('image', blob, 'image.webp')

  const sendOnce = (token: string | null): Promise<{ url: string }> =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.onprogress = (ev) => {
        if (ev.total > 0) {
          setState({ phase: 'uploading', progress: Math.round((ev.loaded / ev.total) * 100) })
        }
      }
      xhr.onload = () => {
        try {
          const body = JSON.parse(xhr.responseText) as
            | { success: true; data: { url: string } }
            | { success: false; error: string }
          if (xhr.status >= 200 && xhr.status < 300 && body.success) {
            resolve(body.data)
          } else {
            const code = (body as { error?: string }).error ?? 'unknown'
            reject(Object.assign(new Error(code), { code, status: xhr.status }))
          }
        } catch {
          reject(Object.assign(new Error('unknown'), { code: 'unknown', status: xhr.status }))
        }
      }
      xhr.onerror = () =>
        reject(
          Object.assign(new Error('upload_storage_failed'), {
            code: 'upload_storage_failed',
            status: 0,
          })
        )
      xhr.open('POST', endpoint)
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.send(form)
    })

  try {
    return await sendOnce(readBearerForTransport())
  } catch (e) {
    if ((e as { status?: number }).status !== 401) throw e
    const result = await ensureFresh(queryClient)
    const token = readBearerForTransport()
    if ((result !== 'ok' && result !== 'superseded') || !token) throw e
    return sendOnce(token)
  }
}

export function useImageUpload(opts: UseImageUploadOptions) {
  const maxOutputBytes = opts.maxOutputBytes ?? (opts.outputSize === 1024 ? 200_000 : 500_000)
  const [state, setState] = useState<Phase>({ phase: 'idle' })
  const inputRef = useRef<HTMLInputElement | null>(null)
  const sourceUrlRef = useRef<string | null>(null)

  const revokeSourceUrl = useCallback((expectedUrl?: string) => {
    const sourceUrl = sourceUrlRef.current
    if (!sourceUrl || (expectedUrl !== undefined && sourceUrl !== expectedUrl)) return
    URL.revokeObjectURL(sourceUrl)
    sourceUrlRef.current = null
  }, [])

  // The hidden input is appended to document.body in pickFile; remove it on
  // unmount so repeated mounts don't accumulate orphaned inputs or Blob URLs.
  useEffect(() => {
    return () => {
      inputRef.current?.remove()
      inputRef.current = null
      revokeSourceUrl()
    }
  }, [revokeSourceUrl])

  const acceptFile = useCallback(
    (file: File) => {
      if (file.size > SOURCE_MAX_BYTES) {
        setState({
          phase: 'error',
          code: 'source_too_large',
          message: ERROR_MESSAGES.source_too_large,
        })
        return
      }
      revokeSourceUrl()
      const url = URL.createObjectURL(file)
      sourceUrlRef.current = url
      const img = new Image()
      img.onload = () => {
        if (sourceUrlRef.current !== url) return
        setState({ phase: 'cropping', sourceUrl: url, sourceFile: file, sourceImage: img })
      }
      img.onerror = () => {
        if (sourceUrlRef.current !== url) return
        revokeSourceUrl(url)
        setState({
          phase: 'error',
          code: 'upload_invalid_format',
          message: ERROR_MESSAGES.upload_invalid_format,
        })
      }
      img.src = url
    },
    [revokeSourceUrl]
  )

  const pickFile = useCallback(() => {
    if (!inputRef.current) {
      const el = document.createElement('input')
      el.type = 'file'
      el.accept = 'image/jpeg,image/png,image/webp'
      el.style.display = 'none'
      el.onchange = () => {
        const file = el.files?.[0]
        if (!file) return
        acceptFile(file)
      }
      document.body.appendChild(el)
      inputRef.current = el
    }
    // Clear any prior error so opening the picker again (or cancelling it) leaves a usable idle state.
    if (state.phase === 'error') setState({ phase: 'idle' })
    inputRef.current.value = ''
    inputRef.current.click()
  }, [acceptFile, state.phase])

  // Drag-and-drop bypasses the file input's `accept`, so check the MIME type again here.
  const dropFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.has(file.type)) {
        setState({
          phase: 'error',
          code: 'upload_invalid_format',
          message: ERROR_MESSAGES.upload_invalid_format,
        })
        return
      }
      acceptFile(file)
    },
    [acceptFile]
  )

  const cancel = useCallback(() => {
    revokeSourceUrl()
    setState({ phase: 'idle' })
  }, [revokeSourceUrl])

  const compress = useCallback(
    async (image: HTMLImageElement, area: CropArea): Promise<Blob> => {
      const canvas = document.createElement('canvas')
      canvas.width = opts.outputSize
      canvas.height = opts.outputSize
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('canvas context unavailable')
      ctx.drawImage(
        image,
        area.x,
        area.y,
        area.size,
        area.size,
        0,
        0,
        opts.outputSize,
        opts.outputSize
      )

      for (const quality of [0.85, 0.7, 0.5]) {
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob((b) => res(b), 'image/webp', quality)
        )
        if (!blob) continue
        if (blob.size <= maxOutputBytes) return blob
      }
      throw Object.assign(new Error('compress_too_large'), { code: 'compress_too_large' })
    },
    [opts.outputSize, maxOutputBytes]
  )

  const uploadXhr = useCallback(
    (blob: Blob) => uploadWithRetry(blob, opts.endpoint, setState),
    [opts.endpoint]
  )

  const confirmCrop = useCallback(
    async (area: CropArea): Promise<{ url: string }> => {
      let image: HTMLImageElement | null = null
      let releaseSourceUrl: (() => void) | null = null
      if (state.phase === 'cropping') {
        image = state.sourceImage
        releaseSourceUrl = () => revokeSourceUrl(state.sourceUrl)
      }
      if (!image) image = opts.sourceImageForTest ?? null
      if (!image) throw new Error('no_source')
      return runConfirmCrop(image, releaseSourceUrl, area, compress, uploadXhr, setState)
    },
    [state, compress, uploadXhr, revokeSourceUrl, opts.sourceImageForTest]
  )

  return { state, pickFile, dropFile, confirmCrop, cancel }
}
