import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { adminQueries } from '@/lib/queries/admin'
import { server } from '@/test/msw/server'
import { createTestQueryClient } from '@/test/utils'
import { loadAdminUserDetailQueries } from '../loadAdminUserDetail'

function serveDetailRequests(calls: { bans: number; detail: number; directory: number }) {
  server.use(
    http.get('*/api/admin/users/:id/bans', () => {
      calls.bans += 1
      return HttpResponse.json({ success: true, data: [] })
    }),
    http.get('*/api/admin/users/:id', () => {
      calls.detail += 1
      return HttpResponse.json({ success: false, error: 'server_error' }, { status: 500 })
    }),
    http.get('*/api/admin/users', () => {
      calls.directory += 1
      return HttpResponse.json({ success: true, data: { items: [] } })
    })
  )
}

describe('loadAdminUserDetailQueries', () => {
  it('loads bans without any account PII request for a contributor', async () => {
    const calls = { bans: 0, detail: 0, directory: 0 }
    serveDetailRequests(calls)
    const queryClient = createTestQueryClient()

    await loadAdminUserDetailQueries(queryClient, 'usr-1', 'contributor')

    expect(calls).toEqual({ bans: 1, detail: 0, directory: 0 })
    expect(queryClient.getQueryData(adminQueries.userBans('usr-1').queryKey)).toEqual([])
  })

  it('does not fail navigation when the admin account enrichment fails', async () => {
    const calls = { bans: 0, detail: 0, directory: 0 }
    serveDetailRequests(calls)
    const queryClient = createTestQueryClient()

    await expect(loadAdminUserDetailQueries(queryClient, 'usr-1', 'admin')).resolves.toBeDefined()

    expect(calls).toEqual({ bans: 1, detail: 1, directory: 0 })
    expect(queryClient.getQueryData(adminQueries.userBans('usr-1').queryKey)).toEqual([])
  })
})
