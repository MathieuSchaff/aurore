import type { LogHabitCheckInput, LogWellbeingInput } from '@habit-tracker/shared'

import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { habitKeys } from './habits'

export const logKeys = {
  all: ['logs'] as const,
  today: (date: string) => [...logKeys.all, 'today', date] as const,
}

export const logQueries = {
  today: (date: string) =>
    queryOptions({
      queryKey: logKeys.today(date),
      queryFn: async () => {
        const res = await api.logs.today.$get({ query: { date } })
        if (!res.ok) throw new Error('Failed to fetch today logs')
        const json = await res.json()
        return json.data
      },
      enabled: !!date,
    }),
}

export function useLogHabitCheck() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: LogHabitCheckInput) => {
      const res = await api.logs['habit-check'].$post({ json: data })
      if (!res.ok) throw new Error('Failed to log habit check')
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: logKeys.all })
      qc.invalidateQueries({ queryKey: habitKeys.today() })
    },
  })
}

export function useLogWellbeing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: LogWellbeingInput) => {
      const res = await api.logs.wellbeing.$post({ json: data })
      if (!res.ok) throw new Error('Failed to log wellbeing')
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: logKeys.all })
    },
  })
}
