import type { CreateSuggestedEditInput } from '@aurore/shared'

import { useMutation } from '@tanstack/react-query'

import { api } from '../api'
import { unwrapData } from '../helpers/apiError'

export function useProposeSuggestedEdit() {
  return useMutation({
    mutationKey: ['suggested-edits', 'propose'],
    mutationFn: async (body: CreateSuggestedEditInput) => {
      const res = await api['suggested-edits'].$post({ json: body })
      return unwrapData(res)
    },
  })
}
