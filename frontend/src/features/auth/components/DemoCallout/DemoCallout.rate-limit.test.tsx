import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('react-hot-toast', () => ({
  toast: { error: vi.fn() },
}))

import { toast } from 'react-hot-toast'

import { makeQueryClient } from '@/lib/queryClient'
import { resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { DemoCallout } from './DemoCallout'

describe('DemoCallout rate limit', () => {
  beforeEach(() => {
    resetTestAuthStore()
    vi.mocked(toast.error).mockReset()
  })

  it('toasts the retry delay returned by the demo endpoint', async () => {
    server.use(
      http.post('*/api/auth/demo', () =>
        HttpResponse.json(
          {
            success: false,
            error: 'too_many_requests',
            details: { retryAfter: '720' },
          },
          { status: 429 }
        )
      )
    )
    renderWithProviders(<DemoCallout />, { queryClient: makeQueryClient() })

    await userEvent.setup().click(screen.getByRole('button', { name: /Essayer la démo/ }))

    // A 429 used to keep the generic demo toast and hide the retry delay
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Trop de requêtes, réessayez dans 12 min.', {
        id: 'Trop de requêtes, réessayez dans 12 min.',
      })
    )
  })
})
