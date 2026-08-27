import type { AdminBanListItem } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import { adminQueries, useCreateBan, useLiftBan } from '../admin'

const userId = 'user-1'

function makeBan(id: string): AdminBanListItem {
  return {
    id,
    userId,
    scope: 'social_post',
    reason: 'Test convergence',
    bannedBy: 'admin-1',
    expiresAt: null,
    createdAt: '2026-08-20T10:00:00.000Z',
    status: 'active',
  }
}

function renderBanQueries(initialBans: AdminBanListItem[]) {
  let bans = initialBans
  let listRequests = 0

  server.use(
    http.get('*/api/admin/users/:id/bans', () => {
      listRequests += 1
      return HttpResponse.json({ success: true, data: bans })
    }),
    http.post('*/api/admin/users/:id/bans', () => {
      const created = makeBan('ban-created')
      bans = [created, ...bans]
      return HttpResponse.json({ success: true, data: created }, { status: 201 })
    }),
    http.delete('*/api/admin/bans/:banId', ({ params }) => {
      bans = bans.filter((ban) => ban.id !== params.banId)
      return HttpResponse.json({ success: true, data: null })
    })
  )

  const queryClient = createTestQueryClient()
  const hook = renderHookWithProviders(
    () => ({
      bans: useQuery(adminQueries.userBans(userId)),
      createBan: useCreateBan(userId),
      liftBan: useLiftBan(userId),
    }),
    { queryClient }
  )

  return { ...hook, getListRequests: () => listRequests }
}

describe('admin ban query convergence', () => {
  it('refetches the mounted list after creating a ban', async () => {
    const view = renderBanQueries([])
    await waitFor(() => expect(view.result.current.bans.data).toEqual([]))

    await act(() => view.result.current.createBan.mutateAsync({ scope: 'social_post' }))

    await waitFor(() => {
      expect(view.result.current.bans.data?.map((ban) => ban.id)).toEqual(['ban-created'])
    })
    expect(view.getListRequests()).toBe(2)
  })

  it('refetches the mounted list after lifting a ban', async () => {
    const view = renderBanQueries([makeBan('ban-existing')])
    await waitFor(() => expect(view.result.current.bans.data).toHaveLength(1))

    await act(() => view.result.current.liftBan.mutateAsync('ban-existing'))

    await waitFor(() => expect(view.result.current.bans.data).toEqual([]))
    expect(view.getListRequests()).toBe(2)
  })
})
