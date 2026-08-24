import type { UpdateUserPreferencesInput } from '@aurore/shared'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type ApiData, api } from '../api'
import { unwrapData } from '../helpers/apiError'

export type UserPreferences = ApiData<typeof api.profile.preferences.$get>

const userPreferenceKeys = {
  all: ['user-preferences'] as const,
}

export const userPreferenceQueries = {
  get: () => ({
    queryKey: userPreferenceKeys.all,
    queryFn: async () => {
      const res = await api.profile.preferences.$get()
      return unwrapData(res)
    },
  }),
}

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['user-preferences', 'update'],
    mutationFn: async (input: UpdateUserPreferencesInput) => {
      const res = await api.profile.preferences.$patch({ json: input })
      return unwrapData(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userPreferenceKeys.all })
    },
    meta: { errorMessage: 'Mise à jour des préférences impossible.' },
  })
}
