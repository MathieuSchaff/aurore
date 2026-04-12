import { queryOptions } from '@tanstack/react-query'

import { api } from '../api'

export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (category?: string) => [...tagKeys.lists(), { category }] as const,
}

export const tagQueries = {
  list: (category?: string) =>
    queryOptions({
      queryKey: tagKeys.list(category),
      queryFn: async () => {
        const res = await api.tags.$get({ query: { category } })
        if (!res.ok) throw new Error('Failed to fetch tags')
        const json = await res.json()
        // Map new field names (label, tagType) to the shape useFormTags expects (name, category)
        return json.data.map((t: (typeof json.data)[number]) => ({
          ...t,
          name: t.label,
          category: t.tagType,
        }))
      },
    }),
}
