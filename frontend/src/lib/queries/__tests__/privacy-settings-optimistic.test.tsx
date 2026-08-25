import { act } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import { privacySettingsQueries, useUpdatePrivacySettings } from '../profile'

describe('useUpdatePrivacySettings', () => {
  it('keeps an absent cache empty after a failed optimistic update', async () => {
    server.use(
      http.patch('*/api/profile/privacy-settings', () =>
        HttpResponse.json({ success: false, error: 'server_error' }, { status: 500 })
      )
    )
    const queryClient = createTestQueryClient()
    const key = privacySettingsQueries.get().queryKey
    const { result } = renderHookWithProviders(() => useUpdatePrivacySettings(), { queryClient })

    await act(async () => {
      await expect(result.current.mutateAsync({ profilePublic: true })).rejects.toBeDefined()
    })

    expect(queryClient.getQueryData(key)).toBeUndefined()
  })
})
