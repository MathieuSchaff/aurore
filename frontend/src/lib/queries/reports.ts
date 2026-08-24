import type { CreateReportInput } from '@aurore/shared'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { unwrapData } from '../helpers/apiError'
import { invalidateAdminDashboard, invalidateOpenAdminReports } from './admin'

export function useCreateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['reports', 'create'],
    mutationFn: async (body: CreateReportInput) => {
      const res = await api.reports.$post({ json: body })
      return unwrapData(res)
    },
    onSuccess: () =>
      Promise.all([invalidateAdminDashboard(queryClient), invalidateOpenAdminReports(queryClient)]),
  })
}
