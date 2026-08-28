import type { CreateReportInput } from '@aurore/shared'

import { useMutation } from '@tanstack/react-query'

import { api } from '../api'
import { unwrapData } from '../helpers/apiError'

export function useCreateReport() {
  return useMutation({
    mutationKey: ['reports', 'create'],
    mutationFn: async (body: CreateReportInput) => {
      const res = await api.reports.$post({ json: body })
      return unwrapData(res)
    },
  })
}
