import { authSchema } from '@aurore/shared'

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw/http'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { readClientSession, recordBan } from '@/lib/auth/session'
import { downloadBlobAsFile } from '@/lib/helpers/download'
import { resetTestAuthStore } from '@/test/authSession'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { PrivacyAccessForm } from '../PrivacyAccessForm'

vi.mock('@/lib/helpers/download', async (original) => ({
  ...(await original<typeof import('@/lib/helpers/download')>()),
  downloadBlobAsFile: vi.fn(),
}))

describe('privacy password access', () => {
  beforeEach(() => {
    resetTestAuthStore()
    vi.mocked(downloadBlobAsFile).mockClear()
  })

  it('exports without a session and requires confirmation before deletion', async () => {
    const credentials = authSchema.parse({
      email: 'private@example.com',
      password: 'Passphrase123!',
    })
    let exports = 0
    let deletions = 0
    server.use(
      http.post('*/api/profile/access/export', async ({ request }) => {
        expect(await request.json()).toEqual(credentials)
        exports++
        return HttpResponse.json(
          { _meta: { userId: 'private-owner' } },
          {
            headers: { 'Content-Disposition': 'attachment; filename="private.json"' },
          }
        )
      }),
      http.post('*/api/profile/access/delete-account', async ({ request }) => {
        expect(await request.json()).toEqual(credentials)
        deletions++
        return new HttpResponse(null, { status: 204 })
      })
    )
    const queryClient = createTestQueryClient()
    recordBan(queryClient, { scope: 'global', reason: null, expiresAt: null })
    renderWithProviders(<PrivacyAccessForm />, { queryClient })
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Adresse email'), credentials.email)
    await user.type(screen.getByLabelText('Mot de passe'), credentials.password)
    await user.click(screen.getByRole('button', { name: 'Exporter mes données' }))
    await waitFor(() =>
      expect(downloadBlobAsFile).toHaveBeenCalledWith(expect.any(Blob), 'private.json')
    )
    expect(exports).toBe(1)
    await user.click(screen.getByRole('button', { name: 'Supprimer mon compte' }))
    expect(deletions).toBe(0)
    await user.click(screen.getByRole('button', { name: 'Confirmer la suppression' }))
    await waitFor(() => expect(queryClient.isMutating()).toBe(0))
    expect(deletions).toBe(1)
    expect(readClientSession().status).toBe('anonymous')
  })

  it('clears a rejected deletion when the following export succeeds', async () => {
    server.use(
      http.post('*/api/profile/access/delete-account', () =>
        HttpResponse.json({ success: false, error: 'invalid_credentials' }, { status: 401 })
      ),
      http.post('*/api/profile/access/export', () =>
        HttpResponse.json({ _meta: { userId: 'owner' } })
      )
    )
    renderWithProviders(<PrivacyAccessForm />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Adresse email'), 'private@example.com')
    await user.type(screen.getByLabelText('Mot de passe'), 'Passphrase123!')
    await user.click(screen.getByRole('button', { name: 'Supprimer mon compte' }))
    await user.click(screen.getByRole('button', { name: 'Confirmer la suppression' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/incorrect/i)
    await user.click(screen.getByRole('button', { name: 'Exporter mes données' }))
    await waitFor(() => expect(downloadBlobAsFile).toHaveBeenCalled())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('replaces an old export error with the deletion rate limit message', async () => {
    const deletionResponse = Promise.withResolvers<void>()
    server.use(
      http.post('*/api/profile/access/export', () =>
        HttpResponse.json({ success: false, error: 'invalid_credentials' }, { status: 401 })
      ),
      http.post('*/api/profile/access/delete-account', async () => {
        await deletionResponse.promise
        return HttpResponse.json({ success: false, error: 'too_many_requests' }, { status: 429 })
      })
    )
    renderWithProviders(<PrivacyAccessForm />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Adresse email'), 'private@example.com')
    await user.type(screen.getByLabelText('Mot de passe'), 'Passphrase123!')
    await user.click(screen.getByRole('button', { name: 'Exporter mes données' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/incorrect/i)
    await user.click(screen.getByRole('button', { name: 'Supprimer mon compte' }))
    await user.click(screen.getByRole('button', { name: 'Confirmer la suppression' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    deletionResponse.resolve()
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(/trop de tentatives.*patienter/i)
    )
  })

  it('shows a local error when the password is rejected', async () => {
    server.use(
      http.post('*/api/profile/access/export', () =>
        HttpResponse.json({ success: false, error: 'invalid_credentials' }, { status: 401 })
      )
    )
    renderWithProviders(<PrivacyAccessForm />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Adresse email'), 'private@example.com')
    await user.type(screen.getByLabelText('Mot de passe'), 'WrongPassword123!')
    await user.click(screen.getByRole('button', { name: 'Exporter mes données' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/incorrect/i)
    expect(downloadBlobAsFile).not.toHaveBeenCalled()
  })
})
