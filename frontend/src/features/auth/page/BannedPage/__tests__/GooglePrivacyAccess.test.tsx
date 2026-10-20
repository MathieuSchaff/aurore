import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw/http'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { installSession, readClientSession } from '@/lib/auth/session'
import { downloadBlobAsFile } from '@/lib/helpers/download'
import { useGooglePrivacyDelete } from '@/lib/queries/privacy-access'
import { resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders, renderWithProviders } from '@/test/utils'
import { GooglePrivacyAccess } from '../GooglePrivacyAccess'

vi.mock('@/lib/helpers/download', async (original) => ({
  ...(await original<typeof import('@/lib/helpers/download')>()),
  downloadBlobAsFile: vi.fn(),
}))

const identity = { userId: '00000000-0000-4000-8000-000000000001', email: 'google@example.com' }

describe('Google privacy access', () => {
  beforeEach(() => {
    resetTestAuthStore()
    vi.mocked(downloadBlobAsFile).mockClear()
  })

  it('exports for the confirmed identity without requiring a password', async () => {
    server.use(
      http.get('*/api/profile/access/google', () =>
        HttpResponse.json({ success: true, data: { ...identity, operation: 'export' } })
      ),
      http.post('*/api/profile/access/google/export', async ({ request }) => {
        expect(await request.json()).toEqual({ userId: identity.userId })
        return HttpResponse.json(
          { _meta: { userId: identity.userId } },
          { headers: { 'Content-Disposition': 'attachment; filename="google.json"' } }
        )
      })
    )
    renderWithProviders(<GooglePrivacyAccess />)
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: 'Télécharger mes données Google' }))
    await waitFor(() =>
      expect(downloadBlobAsFile).toHaveBeenCalledWith(expect.any(Blob), 'google.json')
    )
    expect(await screen.findByText('Votre export a été téléchargé.')).toBeInTheDocument()
    expect(screen.queryByText(/Compte confirmé/)).not.toBeInTheDocument()
  })

  it('requires deletion confirmation and preserves the form on server failure', async () => {
    let deletions = 0
    server.use(
      http.get('*/api/profile/access/google', () =>
        HttpResponse.json({ success: true, data: { ...identity, operation: 'delete-account' } })
      ),
      http.post('*/api/profile/access/google/delete-account', async ({ request }) => {
        expect(await request.json()).toEqual({ userId: identity.userId })
        deletions++
        return HttpResponse.json({ success: false, error: 'server_error' }, { status: 500 })
      })
    )
    renderWithProviders(<GooglePrivacyAccess />)
    const confirm = await screen.findByRole('button', {
      name: 'Confirmer la suppression du compte Google',
    })
    expect(deletions).toBe(0)
    expect(screen.getByText('Compte confirmé : google@example.com')).toBeInTheDocument()
    await userEvent.setup().click(confirm)
    expect(await screen.findByRole('alert')).toHaveTextContent('Opération impossible. Réessayez.')
    expect(deletions).toBe(1)
    expect(confirm).toBeEnabled()
  })

  it('does not clear a different session when Google deletion completes', async () => {
    const qc = createTestQueryClient()
    const started = Promise.withResolvers<void>()
    const release = Promise.withResolvers<void>()
    server.use(
      http.post('*/api/profile/access/google/delete-account', async () => {
        started.resolve()
        await release.promise
        return new HttpResponse(null, { status: 204 })
      })
    )
    const { result } = renderHookWithProviders(() => useGooglePrivacyDelete(), { queryClient: qc })
    let deletion!: Promise<void>
    act(() => {
      deletion = result.current.mutateAsync(identity.userId)
    })
    await started.promise
    act(() =>
      installSession(qc, {
        accessToken: 'other-bearer',
        user: {
          id: 'other-user',
          email: 'other@example.com',
          role: 'user',
          isDemo: false,
          emailVerified: true,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      })
    )
    await act(async () => {
      release.resolve()
      await deletion
    })
    expect(readClientSession()).toMatchObject({
      status: 'authenticated',
      user: { id: 'other-user' },
    })
  })

  it('explains an expired or rejected Google confirmation', async () => {
    server.use(
      http.get('*/api/profile/access/google', () =>
        HttpResponse.json({ success: false, error: 'invalid_credentials' }, { status: 401 })
      )
    )
    renderWithProviders(<GooglePrivacyAccess />)
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /confirmation Google a échoué ou a expiré/
    )
    expect(screen.getByRole('button', { name: 'Exporter avec Google' })).toBeEnabled()
    expect(
      screen.queryByRole('button', { name: 'Confirmer la suppression du compte Google' })
    ).not.toBeInTheDocument()
  })
})
