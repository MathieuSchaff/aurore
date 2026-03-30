import type {
  CreateHabitInput,
  Frequency,
  HabitProductInput,
  Period,
  SetRemindersWithTimingInput,
  Timing,
  UpdateHabitInput,
} from '@habit-tracker/shared'

import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '../api'

export const habitKeys = {
  all: ['habits'] as const,
  list: () => [...habitKeys.all, 'list'] as const,
  today: (date?: string) => [...habitKeys.all, 'today', date] as const,
  detail: (id: string) => [...habitKeys.all, 'detail', id] as const,
  checks: (id: string, startDate: string, endDate: string) =>
    [...habitKeys.all, 'checks', id, startDate, endDate] as const,
  stats: (id: string, startDate: string, endDate: string) =>
    [...habitKeys.all, 'stats', id, startDate, endDate] as const,
  archived: () => [...habitKeys.all, 'archived'] as const,
  checkProducts: (id: string, startDate: string, endDate: string) =>
    [...habitKeys.all, 'check-products', id, startDate, endDate] as const,
}

export const habitQueries = {
  list: () =>
    queryOptions({
      queryKey: habitKeys.list(),
      queryFn: async () => {
        const res = await api.habits.$get()
        if (!res.ok) throw new Error('Failed to fetch habits')
        const json = await res.json()
        return json.data
      },
    }),

  today: (date?: string) =>
    queryOptions({
      queryKey: habitKeys.today(date),
      queryFn: async () => {
        const res = await api.habits.today.$get({ query: { date } })
        if (!res.ok) throw new Error('Failed to fetch today habits')
        const json = await res.json()
        return json.data
      },
      staleTime: 5 * 60 * 1000,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: habitKeys.detail(id),
      queryFn: async () => {
        const res = await api.habits[':id'].$get({ param: { id } })
        if (!res.ok) throw new Error('Failed to fetch habit')
        const json = await res.json()
        return json.data
      },
      enabled: !!id,
    }),

  checks: (id: string, startDate: string, endDate: string) =>
    queryOptions({
      queryKey: habitKeys.checks(id, startDate, endDate),
      queryFn: async () => {
        const res = await api.habits[':id'].checks.$get({
          param: { id },
          query: { startDate, endDate },
        })
        if (!res.ok) throw new Error('Failed to fetch checks')
        const json = await res.json()
        return json.data
      },
      enabled: !!id && !!startDate && !!endDate,
    }),

  stats: (id: string, startDate: string, endDate: string) =>
    queryOptions({
      queryKey: habitKeys.stats(id, startDate, endDate),
      queryFn: async () => {
        const res = await api.habits[':id'].stats.$get({
          param: { id },
          query: { startDate, endDate },
        })
        if (!res.ok) throw new Error('Failed to fetch stats')
        const json = await res.json()
        return json.data
      },
      enabled: !!id && !!startDate && !!endDate,
    }),

  archived: () =>
    queryOptions({
      queryKey: habitKeys.archived(),
      queryFn: async () => {
        const res = await api.habits.archived.$get()
        if (!res.ok) throw new Error('Failed to fetch archived habits')
        const json = await res.json()
        return json.data
      },
    }),

  checkProducts: (id: string, startDate: string, endDate: string) =>
    queryOptions({
      queryKey: habitKeys.checkProducts(id, startDate, endDate),
      queryFn: async () => {
        const res = await api.habits[':id']['check-products'].$get({
          param: { id },
          query: { startDate, endDate },
        })
        if (!res.ok) throw new Error('Failed to fetch check products')
        const json = await res.json()
        return json.data
      },
      enabled: !!id && !!startDate && !!endDate,
    }),
}

export function useCreateHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateHabitInput) => {
      const res = await api.habits.$post({ json: data })
      if (!res.ok) throw new Error('Failed to create habit')
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: habitKeys.list() })
      qc.invalidateQueries({ queryKey: habitKeys.today() })
    },
  })
}

export function useUpdateHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & UpdateHabitInput) => {
      const res = await api.habits[':id'].$patch({ param: { id }, json: data })
      if (!res.ok) throw new Error('Failed to update habit')
      const json = await res.json()
      return json.data
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: habitKeys.detail(id) })
      qc.invalidateQueries({ queryKey: habitKeys.list() })
      qc.invalidateQueries({ queryKey: habitKeys.today() })
    },
  })
}

export function useDeleteHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.habits[':id'].$delete({ param: { id } })
      if (!res.ok) throw new Error('Failed to delete habit')
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: habitKeys.all })
    },
  })
}

export function useToggleCheck() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      timingId,
      actualTime,
      products,
    }: {
      habitId: string
      date: string
      timingId?: string
      actualTime?: string
      products?: Array<{
        habitProductId: string
        productId: string
        used: boolean
        actualDosage?: string
      }>
    }) => {
      const res = await api.habits[':id'].check.$post({
        param: { id: habitId },
        json: { date, timingId, actualTime, products },
      })
      if (!res.ok) throw new Error('Failed to toggle check')
      const json = await res.json()
      return json.data
    },
    onMutate: async ({ habitId, date, timingId }) => {
      // Cancel background queries so server response won't overwrite our optimistic update
      await qc.cancelQueries({ queryKey: habitKeys.today(date) })
      const todayOpts = habitQueries.today(date)
      const snapshot = qc.getQueryData(todayOpts.queryKey)

      qc.setQueryData(todayOpts.queryKey, (old) => {
        if (!old) return old
        return old.map((item) => {
          if (item.habit.id !== habitId) return item

          const alreadyChecked = timingId
            ? item.checks.some((c) => c.timingId === timingId)
            : item.checks.length > 0

          const checks = alreadyChecked
            ? item.checks.filter((c) => (timingId ? c.timingId !== timingId : false))
            : [
                ...item.checks,
                {
                  id: `optimistic-${Date.now()}`,
                  userId: item.habit.userId,
                  habitId,
                  scheduledDate: date || new Date().toISOString().split('T')[0],
                  timingId: timingId ?? null,
                  actualTime: null,
                  completedAt: new Date().toISOString(),
                  status: 'done' as const,
                  createdAt: new Date().toISOString(),
                },
              ]

          const requiredCount = item.timings.length || 1
          return { ...item, checks, isCompleted: checks.length >= requiredCount }
        })
      })

      return { snapshot, date }
    },
    onSuccess: () => {},
    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        qc.setQueryData(habitKeys.today(context.date), context.snapshot)
      }
      toast.error('Impossible de sauvegarder, réessaye.')
    },
    onSettled: (_, __, { date }) => {
      qc.invalidateQueries({ queryKey: habitKeys.today(date) })
    },
  })
}

export function useArchiveHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.habits[':id'].archive.$post({ param: { id } })
      if (!res.ok) throw new Error('Failed to archive habit')
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: habitKeys.all })
    },
  })
}

export function useRestoreHabit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.habits[':id'].restore.$post({ param: { id } })
      if (!res.ok) throw new Error('Failed to restore habit')
      const json = await res.json()
      return json.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: habitKeys.all })
    },
  })
}

export function useUpdateFrequency() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Frequency) => {
      const res = await api.habits[':id'].frequency.$put({ param: { id }, json: data })
      if (!res.ok) throw new Error('Failed to update frequency')
      const json = await res.json()
      return json.data
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: habitKeys.detail(id) })
      qc.invalidateQueries({ queryKey: habitKeys.today() })
    },
  })
}

export function useSetTimings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, timings }: { id: string; timings: Timing[] }) => {
      const res = await api.habits[':id'].timings.$put({ param: { id }, json: timings })
      if (!res.ok) throw new Error('Failed to update timings')
      const json = await res.json()
      return json.data
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: habitKeys.detail(id) })
      qc.invalidateQueries({ queryKey: habitKeys.today() })
    },
  })
}

export function useSetReminders() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      reminders,
    }: {
      id: string
      reminders: SetRemindersWithTimingInput
    }) => {
      const res = await api.habits[':id'].reminders.$put({ param: { id }, json: reminders })
      if (!res.ok) throw new Error('Failed to update reminders')
      const json = await res.json()
      return json.data
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: habitKeys.detail(id) })
    },
  })
}

export function useSetPeriod() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...period }: { id: string } & Period) => {
      const res = await api.habits[':id'].period.$put({ param: { id }, json: period })
      if (!res.ok) throw new Error('Failed to update period')
      const json = await res.json()
      return json.data
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: habitKeys.detail(id) })
      qc.invalidateQueries({ queryKey: habitKeys.today() })
    },
  })
}

export function useSetProducts() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, products }: { id: string; products: HabitProductInput[] }) => {
      const res = await api.habits[':id'].products.$put({
        param: { id },
        json: products,
      })
      if (!res.ok) throw new Error('Failed to update products')
      const json = await res.json()
      return json.data
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: habitKeys.detail(id) })
      qc.invalidateQueries({ queryKey: habitKeys.today() })
    },
  })
}

export function useReorderHabits() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (habits: Array<{ id: string; position: number }>) => {
      const res = await api.habits.reorder.$patch({
        json: { habits },
      })
      if (!res.ok) throw new Error('Failed to reorder habits')
    },
    onMutate: async (newOrder) => {
      // Same optimistic update strategy: update UI immediately before server responds
      await qc.cancelQueries({ queryKey: habitKeys.list() })
      const snapshot = qc.getQueryData(habitKeys.list())
      qc.setQueryData(habitKeys.list(), (old) => {
        if (!old || !Array.isArray(old)) return old
        const posMap = new Map(newOrder.map((h) => [h.id, h.position]))
        return [...old].sort(
          (a: { id: string; position: number }, b: { id: string; position: number }) => {
            const posA = posMap.get(a.id) ?? a.position
            const posB = posMap.get(b.id) ?? b.position
            return posA - posB
          }
        )
      })
      return { snapshot }
    },
    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        qc.setQueryData(habitKeys.list(), context.snapshot)
      }
      toast.error('Impossible de réordonner.')
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: habitKeys.list() })
      qc.invalidateQueries({ queryKey: habitKeys.today() })
    },
  })
}
