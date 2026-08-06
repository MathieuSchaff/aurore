import { vi } from 'vitest'

import { useAuthStore } from '@/store/auth'

// Requires the file to also call vi.mock('@/store/auth', () => ({ useAuthStore: vi.fn() })).
export function setAuthRole(role: 'user' | 'admin' | 'contributor') {
  vi.mocked(useAuthStore).mockImplementation(
    (selector: unknown) => (selector as (s: { role: typeof role }) => unknown)({ role }) as never
  )
}
