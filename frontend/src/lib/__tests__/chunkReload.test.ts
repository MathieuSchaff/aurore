import { describe, expect, it } from 'vitest'

import { CHUNK_RELOAD_RESET_MS, type ChunkReloadState, nextChunkReloadState } from '../chunkReload'

describe('nextChunkReloadState', () => {
  const empty: ChunkReloadState = { at: 0, tries: 0 }

  it('autorise deux retries successifs sans cooldown', () => {
    const first = nextChunkReloadState(empty, 1_000)
    expect(first).toEqual({ at: 1_000, tries: 1 })
    if (!first) throw new Error('first retry unexpectedly refused')

    const second = nextChunkReloadState(first, 1_001)
    expect(second).toEqual({ at: 1_001, tries: 2 })
  })

  it('refuse un troisième retry dans la même fenêtre', () => {
    expect(nextChunkReloadState({ at: 1_001, tries: 2 }, 1_002)).toBeNull()
  })

  it('repart à un retry après la fenêtre de reset', () => {
    const now = 1_001 + CHUNK_RELOAD_RESET_MS + 1
    expect(nextChunkReloadState({ at: 1_001, tries: 2 }, now)).toEqual({ at: now, tries: 1 })
  })
})
