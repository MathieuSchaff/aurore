import { describe, expect, it, vi } from 'vitest'

import {
  CHUNK_RELOAD_RESET_MS,
  type ChunkReloadState,
  installChunkReloadGuard,
  nextChunkReloadState,
} from '../chunkReload'

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

describe('installChunkReloadGuard', () => {
  function fakeStorage(writable = true) {
    const entries = new Map<string, string>()
    return {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string) => {
        if (!writable) throw new Error('storage unavailable')
        entries.set(key, value)
      },
    }
  }

  function firePreloadError(target: EventTarget) {
    const event = new Event('vite:preloadError', { cancelable: true })
    target.dispatchEvent(event)
    return event
  }

  it('ne programme qu’un seul reload pour une rafale d’events', () => {
    const reload = vi.fn()
    const target = new EventTarget()
    const storage = fakeStorage()
    installChunkReloadGuard({ target, storage: () => storage, reload, now: () => 1_000 })

    const events = [firePreloadError(target), firePreloadError(target), firePreloadError(target)]

    expect(reload).toHaveBeenCalledTimes(1)
    // Vite rethrows an event it was not told about, so every one of them must be prevented.
    expect(events.every((event) => event.defaultPrevented)).toBe(true)
  })

  it('ne recharge pas quand le storage refuse d’écrire', () => {
    const reload = vi.fn()
    const target = new EventTarget()
    const storage = fakeStorage(false)
    installChunkReloadGuard({ target, storage: () => storage, reload, now: () => 1_000 })

    const event = firePreloadError(target)

    expect(reload).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(false)
  })

  it('compte les essais à travers les reloads et s’arrête au troisième', () => {
    const storage = fakeStorage()
    const reloads: number[] = []

    // One install per page load, sharing the storage the reload does not clear.
    for (const now of [1_000, 2_000, 3_000]) {
      const target = new EventTarget()
      installChunkReloadGuard({
        target,
        storage: () => storage,
        reload: () => reloads.push(now),
        now: () => now,
      })
      firePreloadError(target)
    }

    expect(reloads).toEqual([1_000, 2_000])
  })
})
