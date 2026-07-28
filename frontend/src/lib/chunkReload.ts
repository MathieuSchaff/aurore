const CHUNK_RELOAD_MAX_TRIES = 2
const CHUNK_RELOAD_KEY = 'aurore:chunk-reload'

// Older than this and the previous failure belongs to another deploy, so counting restarts.
export const CHUNK_RELOAD_RESET_MS = 60_000

export type ChunkReloadState = {
  at: number
  tries: number
}

export function nextChunkReloadState(
  previous: ChunkReloadState,
  now: number
): ChunkReloadState | null {
  const tries = now - previous.at > CHUNK_RELOAD_RESET_MS ? 1 : previous.tries + 1
  if (tries > CHUNK_RELOAD_MAX_TRIES) return null

  return { at: now, tries }
}

export type ChunkReloadGuardDeps = {
  target: EventTarget
  // Read lazily: touching sessionStorage throws outright when storage is blocked, and that
  // must be caught here rather than at boot.
  storage: () => Pick<Storage, 'getItem' | 'setItem'>
  reload: () => void
  now: () => number
}

function readChunkReloadState(storage: ChunkReloadGuardDeps['storage']): ChunkReloadState {
  try {
    const raw = storage().getItem(CHUNK_RELOAD_KEY)
    const parsed = raw ? (JSON.parse(raw) as Partial<ChunkReloadState>) : null
    return { at: Number(parsed?.at) || 0, tries: Number(parsed?.tries) || 0 }
  } catch {
    return { at: 0, tries: 0 }
  }
}

// A deploy renames every hashed chunk. A tab opened before it 404s on its next lazy
// import and nginx answers with the SSR HTML shell, so the navigation dies on a
// module that parses as text/html. Reload to pick up the new build.
export function installChunkReloadGuard(deps: ChunkReloadGuardDeps): void {
  let scheduled = false

  deps.target.addEventListener('vite:preloadError', (event) => {
    if (scheduled) {
      event.preventDefault()
      return
    }

    const next = nextChunkReloadState(readChunkReloadState(deps.storage), deps.now())
    // Out of tries: leave the event alone so Vite rethrows instead of reloading forever.
    if (!next) return

    try {
      deps.storage().setItem(CHUNK_RELOAD_KEY, JSON.stringify(next))
    } catch {
      // Storage is unavailable (private mode, quota), so the counter cannot be trusted.
      // Reloading without it is the loop this guard exists to prevent.
      return
    }

    scheduled = true
    event.preventDefault()
    deps.reload()
  })
}
