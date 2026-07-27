const CHUNK_RELOAD_MAX_TRIES = 2

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
