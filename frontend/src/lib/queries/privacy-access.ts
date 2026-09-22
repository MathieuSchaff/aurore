import type { AuthInput } from '@aurore/shared'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { captureClientSession, endSession } from '../auth/session'
import { throwIfNotOk } from '../helpers/apiError'
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
