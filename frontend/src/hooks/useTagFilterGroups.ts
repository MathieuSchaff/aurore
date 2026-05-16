import type { TagCategoryMeta } from '@habit-tracker/shared'

import { useMemo } from 'react'

import type { FilterGroupConfig, FilterOption } from '@/component/Filter'

type TagItem = { name: string; slug: string; count?: number }

export function useTagFilterGroups<K extends string>(
  categories: readonly K[],
  tagsByCategory: Partial<Record<K, TagItem[]>> | undefined,
  categoryMeta: Record<K, TagCategoryMeta>,
  labelOverrides: Record<string, string> = {}
): FilterGroupConfig<K>[] {
  return useMemo(() => {
    if (!tagsByCategory) return []

    return categories.map((cat) => {
      const meta = categoryMeta[cat]
      const options: FilterOption[] = (tagsByCategory[cat] ?? []).map((t) => ({
        value: t.slug,
        label: labelOverrides[t.slug] ?? t.name,
        count: t.count,
      }))

      return {
        id: cat,
        label: meta.label,
        defaultOpen: meta.defaultOpen ?? meta.tier === 'essential',
        tier: meta.tier,
        subFilters: [
          {
            key: cat,
            label: meta.label,
            placeholder: meta.placeholder,
            options,
          },
        ],
      }
    })
  }, [categories, tagsByCategory, categoryMeta, labelOverrides])
}
