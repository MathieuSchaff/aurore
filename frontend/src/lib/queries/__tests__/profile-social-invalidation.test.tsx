import { act } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import {
  profileKeys,
  useUpdateDermoProfile,
  useUpdatePrivacySettings,
  useUpdateProfile,
} from '../profile'
import { socialKeys } from '../social'

function seedProfileDependentReads() {
  const queryClient = createTestQueryClient()
  const publicProfileKey = profileKeys.publicProfiles()
  const socialKey = socialKeys.similar()

  for (const queryKey of [publicProfileKey, socialKey]) {
    queryClient.setQueryDefaults(queryKey, { gcTime: Number.POSITIVE_INFINITY })
  }
  queryClient.setQueryData(publicProfileKey, { username: 'viewer' })
  queryClient.setQueryData(socialKey, { profiles: [] })

  return { publicProfileKey, queryClient, socialKey }
}

function expectProfileDependentReadsInvalidated(
  queryClient: ReturnType<typeof createTestQueryClient>,
  publicProfileKey: ReturnType<typeof profileKeys.publicProfiles>,
  socialKey: ReturnType<typeof socialKeys.similar>
) {
  expect(queryClient.getQueryState(publicProfileKey)?.isInvalidated).toBe(true)
  expect(queryClient.getQueryState(socialKey)?.isInvalidated).toBe(true)
}

describe('profile mutation invalidation', () => {
  it('invalidates public and social reads after updating the profile', async () => {
    server.use(
      http.patch('*/api/profile', () =>
        HttpResponse.json({ success: true, data: { username: 'viewer', bio: 'Nouveau texte' } })
      )
    )
    const { publicProfileKey, queryClient, socialKey } = seedProfileDependentReads()
    const { result } = renderHookWithProviders(() => useUpdateProfile(), { queryClient })

    await act(() => result.current.mutateAsync({ bio: 'Nouveau texte' }))

    expectProfileDependentReadsInvalidated(queryClient, publicProfileKey, socialKey)
  })

  it('invalidates public and social reads after updating the dermo profile', async () => {
    server.use(
      http.patch('*/api/profile/dermo', () =>
        HttpResponse.json({ success: true, data: { skinTypes: [] } })
      )
    )
    const { publicProfileKey, queryClient, socialKey } = seedProfileDependentReads()
    const { result } = renderHookWithProviders(() => useUpdateDermoProfile(), { queryClient })

    await act(() => result.current.mutateAsync({ skinTypes: [] }))

    expectProfileDependentReadsInvalidated(queryClient, publicProfileKey, socialKey)
  })

  it('invalidates public and social reads after updating privacy', async () => {
    server.use(
      http.patch('*/api/profile/privacy-settings', () =>
        HttpResponse.json({ success: true, data: { profilePublic: true } })
      )
    )
    const { publicProfileKey, queryClient, socialKey } = seedProfileDependentReads()
    const { result } = renderHookWithProviders(() => useUpdatePrivacySettings(), { queryClient })

    await act(() => result.current.mutateAsync({ profilePublic: true }))

    expectProfileDependentReadsInvalidated(queryClient, publicProfileKey, socialKey)
  })
})
