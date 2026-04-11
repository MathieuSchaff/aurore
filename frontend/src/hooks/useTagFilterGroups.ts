import { useMemo } from 'react'

import type { FilterGroupConfig, FilterOption } from '@/component/Filter'
import type { TagCategoryMeta } from '@habit-tracker/shared'

type TagItem = { name: string; slug: string }

/**
 * Build FilterGroupConfig[] from domain category metadata and a filter-options payload.
 *
 * @param categories — category keys to include (product or ingredient)
 * @param tagsByCategory — tag items per category (from API filter-options)
 * @param categoryMeta — PRODUCT_TAG_CATEGORY_META or INGREDIENT_TAG_CATEGORY_META
 * @param labelOverrides — slug → label overrides (optional)
 */
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
      }))

      return {
        id: cat,
        label: meta.label,
        defaultOpen: meta.tier === 'essential',
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
