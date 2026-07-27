import { StartClient } from '@tanstack/react-start/client'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { type ChunkReloadState, nextChunkReloadState } from './lib/chunkReload'
import { initFaro } from './lib/observability/faro'

initFaro()

// A deploy renames every hashed chunk. A tab opened before it 404s on its next lazy
// import and nginx answers with the SSR HTML shell, so the navigation dies on a
// module that parses as text/html. Reload to pick up the new build.
const CHUNK_RELOAD_KEY = 'aurore:chunk-reload'
let chunkReloadScheduled = false

function readChunkReloadState(): ChunkReloadState {
  try {
    const raw = sessionStorage.getItem(CHUNK_RELOAD_KEY)
    const parsed = raw ? (JSON.parse(raw) as Partial<ChunkReloadState>) : null
    return { at: Number(parsed?.at) || 0, tries: Number(parsed?.tries) || 0 }
  } catch {
    return { at: 0, tries: 0 }
  }
}

window.addEventListener('vite:preloadError', (event) => {
  if (chunkReloadScheduled) {
    event.preventDefault()
    return
  }

  const now = Date.now()
  const next = nextChunkReloadState(readChunkReloadState(), now)
  if (!next) return

  try {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, JSON.stringify(next))
  } catch {
    // Storage is unavailable (private mode, quota), so the counter cannot be trusted.
    // Reloading without it is the loop this guard exists to prevent.
    return
  }

  chunkReloadScheduled = true
  event.preventDefault()
  window.location.reload()
})

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>
  )
})
