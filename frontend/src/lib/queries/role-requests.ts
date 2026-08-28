import type { SubmitRoleRequestErrorCode, SubmitRoleRequestInput } from '@aurore/shared'

import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { unwrapData } from '../helpers/apiError'

const roleRequestKeys = {
  mine: ['role-requests', 'me'] as const,
}

const SUBMIT_ROLE_REQUEST_HANDLED_ERROR_CODES = [
  'already_pending',
  'already_elevated',
] as const satisfies readonly SubmitRoleRequestErrorCode[]

export const roleRequestQueries = {
  mine: () =>
    queryOptions({
      queryKey: roleRequestKeys.mine,
      queryFn: async () => {
        const res = await api['role-requests'].me.$get()
        return unwrapData(res)
      },
    }),
}

export function useSubmitRoleRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['role-requests', 'submit'],
    meta: { handledErrorCodes: SUBMIT_ROLE_REQUEST_HANDLED_ERROR_CODES },
    mutationFn: async (body: SubmitRoleRequestInput) => {
      const res = await api['role-requests'].$post({ json: body })
      return unwrapData(res)
    },
    // Response is the new RoleRequestView (same shape as GET /me). Write it straight
    // to cache so the section flips to "pending" without a blank-form refetch flash.
    onSuccess: (data) => qc.setQueryData(roleRequestKeys.mine, data),
  })
}

export function useCancelRoleRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['role-requests', 'cancel'],
    mutationFn: async (id: string) => {
      const res = await api['role-requests'][':id'].cancel.$post({ param: { id } })
      return unwrapData(res)
    },
    onSuccess: (data) => qc.setQueryData(roleRequestKeys.mine, data),
  })
}
