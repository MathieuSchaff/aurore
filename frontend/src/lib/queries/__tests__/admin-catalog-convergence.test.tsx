import type { ReportView } from '@aurore/shared'

import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { ApiError } from '@/lib/helpers/apiError'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import {
  useEscalateReport,
  useModerateContent,
  useResolveReport,
  useVerifyCatalogItem,
} from '../admin'

const PRODUCT = { id: '11111111-1111-4111-8111-111111111111' }

const REPORT = {
  id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  reporterId: '55555555-5555-4555-8555-555555555555',
  targetType: 'review',
  targetId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  reason: 'Spam',
  status: 'open',
  reviewedBy: null,
  reviewedAt: null,
  escalatedAt: null,
  escalatedBy: null,
  createdAt: '2026-08-20T10:00:00.000Z',
} satisfies ReportView

describe('admin catalog convergence', () => {
  it('preserves the API error contract when catalog moderation fails', async () => {
    server.use(
      http.patch('*/api/admin/moderation/products/:id', () =>
        HttpResponse.json({ success: false, error: 'invalid_input' }, { status: 400 })
      )
    )
    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(() => useModerateContent(), { queryClient })

    await act(async () => {
      await expect(
        result.current.mutateAsync({
          target: 'products',
          id: PRODUCT.id,
          body: { status: 'hidden' },
        })
      ).rejects.toMatchObject({ code: 'invalid_input', status: 400 })
    })

    await waitFor(() => expect(result.current.error).toBeInstanceOf(ApiError))
  })

  it('preserves the API error contract when catalog verification fails', async () => {
    server.use(
      http.patch('*/api/products/:id/quality', () =>
        HttpResponse.json({ success: false, error: 'not_found' }, { status: 404 })
      )
    )
    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(() => useVerifyCatalogItem(), { queryClient })

    await act(async () => {
      await expect(
        result.current.mutateAsync({ kind: 'product', id: PRODUCT.id })
      ).rejects.toMatchObject({ code: 'not_found', status: 404 })
    })

    await waitFor(() => expect(result.current.error).toBeInstanceOf(ApiError))
  })

  it('preserves the API error contract for report decisions', async () => {
    server.use(
      http.patch('*/api/admin/reports/:id', () =>
        HttpResponse.json({ success: false, error: 'forbidden' }, { status: 403 })
      ),
      http.patch('*/api/admin/reports/:id/escalate', () =>
        HttpResponse.json({ success: false, error: 'not_found' }, { status: 404 })
      )
    )
    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({ resolve: useResolveReport(), escalate: useEscalateReport() }),
      { queryClient }
    )

    await act(async () => {
      await expect(
        result.current.resolve.mutateAsync({ id: REPORT.id, body: { status: 'resolved' } })
      ).rejects.toMatchObject({ code: 'forbidden', status: 403 })
      await expect(result.current.escalate.mutateAsync(REPORT.id)).rejects.toMatchObject({
        code: 'not_found',
        status: 404,
      })
    })

    await waitFor(() => {
      expect(result.current.resolve.error).toBeInstanceOf(ApiError)
      expect(result.current.escalate.error).toBeInstanceOf(ApiError)
    })
  })
})
