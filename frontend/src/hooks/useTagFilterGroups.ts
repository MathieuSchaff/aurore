import { useMemo } from 'react'

import { TAG_CATEGORY_META, type TagCategory } from '@habit-tracker/shared'

import type { FilterGroupConfig, FilterOption } from '@/component/Filter'

type TagItem = { name: string; slug: string }

/**
 * Build FilterGroupConfig[] from shared TAG_CATEGORY_META and a filter-options payload.
 * Replaces hand-maintained useMemo blocks in IngredientsPage and ProductsPage.
 *
 * @param categories — TagCategory[] of the categories to include
 * @param tagsByCategory — Partial<Record<K, TagItem[]>> with tag items per category
 * @param labelOverrides — Record<slug, label> to override tag names (e.g. LABEL_OVERRIDES in ProductsPage)
 * @returns FilterGroupConfig<K>[] — one group per category, flat list
 */
export function useTagFilterGroups<K extends TagCategory>(
  categories: readonly K[],
  tagsByCategory: Partial<Record<K, TagItem[]>> | undefined,
  labelOverrides: Record<string, string> = {}
): FilterGroupConfig<K>[] {
  return useMemo(() => {
    if (!tagsByCategory) return []

    return categories.map((cat) => {
      const meta = TAG_CATEGORY_META[cat]
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
  }, [categories, tagsByCategory, labelOverrides])
}
