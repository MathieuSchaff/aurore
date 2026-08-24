import { waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const clientStart = vi.hoisted(() => ({ events: [] as string[] }))

vi.mock('@tanstack/react-router', () => ({ RouterProvider: () => null }))
vi.mock('@tanstack/react-start/client', () => ({
  hydrateStart: vi.fn(async () => {
    clientStart.events.push('hydrateStart')
    return {}
  }),
}))
vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  startTransition: (publish: () => void) => publish(),
}))
vi.mock('react-dom/client', () => ({
  hydrateRoot: vi.fn(() => {
    clientStart.events.push('hydrateRoot')
  }),
}))
vi.mock('./lib/chunkReload', () => ({ installChunkReloadGuard: vi.fn() }))
vi.mock('./lib/observability/faro', () => ({ initFaro: vi.fn() }))

describe('client hydration', () => {
  it('hydrates the router before React mounts', async () => {
    await import('./client')

    await waitFor(() => {
      expect(clientStart.events).toEqual(['hydrateStart', 'hydrateRoot'])
    })
  })
})
