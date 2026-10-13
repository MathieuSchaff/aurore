import type { AuthInput, PrivacyAccessOperation } from '@aurore/shared'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { captureClientSession, endSession } from '../auth/session'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'
import { downloadBlobAsFile, parseAttachmentFilename } from '../helpers/download'

export function usePrivacyExport() {
  return useMutation({
    mutationKey: ['profile', 'access', 'export'],
    gcTime: 0,
    mutationFn: async (credentials: AuthInput) => {
      const res = await api.profile.access.export.$post({ json: credentials })
      await throwIfNotOk(res)
      downloadBlobAsFile(
        await res.blob(),
        parseAttachmentFilename(res.headers.get('Content-Disposition')) ?? 'aurore-export.json'
      )
    },
    meta: { handledErrorCodes: ['invalid_credentials', 'rate_limit_exceeded', 'forbidden'] },
  })
}

export function usePrivacyDelete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['profile', 'access', 'delete'],
    gcTime: 0,
    mutationFn: async (credentials: AuthInput) => {
      const res = await api.profile.access['delete-account'].$post({ json: credentials })
      await throwIfNotOk(res)
    },
    onMutate: () => captureClientSession(),
    onSuccess: (_, credentials, owner) => {
      if (!owner?.isCurrent()) return
      if (
        owner.session.status === 'authenticated' &&
        owner.session.user.email !== credentials.email
      )
        return
      endSession(queryClient, 'account-deleted')
    },
    meta: { handledErrorCodes: ['invalid_credentials'] },
  })
}

const accessKey = ['profile', 'access', 'google'] as const
const accessMeta = {
  handledErrorCodes: [
    'invalid_credentials',
    'rate_limit_exceeded',
    'too_many_requests',
    'forbidden',
  ],
}

export function useGooglePrivacyAccess() {
  return useQuery({
    queryKey: accessKey,
    queryFn: async () => unwrapData(await api.profile.access.google.$get()),
    enabled: !import.meta.env.SSR,
    retry: false,
    gcTime: 0,
    staleTime: 0,
  })
}

export function useStartGooglePrivacyAccess() {
  return useMutation({
    mutationKey: [...accessKey, 'start'],
    gcTime: 0,
    mutationFn: async (operation: PrivacyAccessOperation) =>
      unwrapData(await api.profile.access.google.start.$post({ json: { operation } })),
    onSuccess: ({ url }) => window.location.assign(url),
    meta: accessMeta,
  })
}

export function useGooglePrivacyExport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [...accessKey, 'export'],
    gcTime: 0,
    mutationFn: async (userId: string) => {
      const res = await api.profile.access.google.export.$post({ json: { userId } })
      await throwIfNotOk(res)
      downloadBlobAsFile(
        await res.blob(),
        parseAttachmentFilename(res.headers.get('Content-Disposition')) ?? 'aurore-export.json'
      )
    },
    onSuccess: () => queryClient.setQueryData(accessKey, null),
    meta: accessMeta,
  })
}

export function useGooglePrivacyDelete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [...accessKey, 'delete'],
    gcTime: 0,
    mutationFn: async (userId: string) => {
      const res = await api.profile.access.google['delete-account'].$post({ json: { userId } })
      await throwIfNotOk(res)
    },
    onMutate: () => captureClientSession(),
    onSuccess: (_, userId, owner) => {
      queryClient.setQueryData(accessKey, null)
      if (!owner?.isCurrent()) return
      if (owner.session.status === 'authenticated' && owner.session.user.id !== userId) return
      endSession(queryClient, 'account-deleted')
    },
    meta: accessMeta,
  })
}
