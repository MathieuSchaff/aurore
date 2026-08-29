// Tag axes are the union of all ingredient domains; drawer renders only the categories of
// the selected `type`. Active domain lives in URL search param `type` (default 'skincare').

import {
  ALL_INGREDIENT_FILTER_CATEGORIES,
  type AllIngredientTagCategory,
  DENTAL_INGREDIENT_TAG_CATEGORY_META,
  HAIRCARE_INGREDIENT_TAG_CATEGORY_META,
  INGREDIENT_TYPE_LABELS,
  INGREDIENT_TYPE_VALUES,
  type IngredientType,
  SKINCARE_INGREDIENT_TAG_CATEGORY_META,
  SUPPLEMENT_INGREDIENT_TAG_CATEGORY_META,
  type TagCategoryMeta,
} from '@aurore/shared'

import { z } from 'zod'

// Deep import: barrel would drag FilterDrawer/ChipGroup CSS into the eager
// route-config graph (render-blocking). helpers.ts is zod-only.
import { filterSearchSchema } from '@/component/Filter/helpers'
import type { TabOption } from '@/component/Tabs/Tabs'
import type { ListIngredientsFilters } from '@/lib/queries/ingredients'

export type FilterKey = AllIngredientTagCategory

export const FILTER_KEYS = [...ALL_INGREDIENT_FILTER_CATEGORIES] as FilterKey[]

export const DOMAIN_TAG_META: Record<IngredientType, Record<string, TagCategoryMeta>> = {
  skincare: SKINCARE_INGREDIENT_TAG_CATEGORY_META,
  haircare: HAIRCARE_INGREDIENT_TAG_CATEGORY_META,
  dental: DENTAL_INGREDIENT_TAG_CATEGORY_META,
  supplement: SUPPLEMENT_INGREDIENT_TAG_CATEGORY_META,
}

// Skincare wins for duplicate keys; all four domains use the same label today so order is cosmetic.
const _mergedMeta: Record<string, TagCategoryMeta> = {
  ...SUPPLEMENT_INGREDIENT_TAG_CATEGORY_META,
  ...DENTAL_INGREDIENT_TAG_CATEGORY_META,
  ...HAIRCARE_INGREDIENT_TAG_CATEGORY_META,
  ...SKINCARE_INGREDIENT_TAG_CATEGORY_META,
}

export const GROUP_LABELS: Record<FilterKey, string> = Object.fromEntries(
  FILTER_KEYS.map((k) => [k, _mergedMeta[k].label])
) as Record<FilterKey, string>

export const DOMAIN_TAB_OPTIONS: TabOption<IngredientType>[] = INGREDIENT_TYPE_VALUES.map((id) => ({
  id,
  label: INGREDIENT_TYPE_LABELS[id],
}))

const { schema: baseSchema, defaultValues } = filterSearchSchema(FILTER_KEYS)

export const ingredientsSearchSchema = baseSchema.extend({
  type: z.enum(INGREDIENT_TYPE_VALUES).default('skincare'),
  profile_filter: z.boolean().default(false),
})

export const ingredientsSearchDefaults = {
  ...defaultValues,
  type: 'skincare' as IngredientType,
  profile_filter: false,
}

export type IngredientsSearch = z.infer<typeof ingredientsSearchSchema>

const INGREDIENTS_PAGE_SIZE = 24
export const INGREDIENTS_LIST_STALE_MS = 5 * 60 * 1000

// Mirrors the filters IngredientsPage builds inline, PAGE_SIZE included, so the route
// loader prefetches the exact query key the page reads
// A key that differs by one field refetches the server-rendered grid at hydration
// IngredientsPage.test pins the parity
export function ingredientsListApiFilters(
  search: IngredientsSearch,
  avoidFor: string[] = []
): ListIngredientsFilters {
  const hasFilters = FILTER_KEYS.some((k) => (search[k]?.length ?? 0) > 0)
  return {
    ...(hasFilters
      ? (Object.fromEntries(
          FILTER_KEYS.map((k) => [k, search[k]?.length ? search[k] : undefined])
        ) as Partial<ListIngredientsFilters>)
      : {}),
    type: search.type,
    page: search.page,
    limit: INGREDIENTS_PAGE_SIZE,
    avoid_for: avoidFor.length > 0 ? avoidFor : undefined,
  }
}

// Categories from the previous domain are invalid against the new one (e.g. skin_type vs dental).
export function buildDomainSwitchSearch(
  prev: Record<string, unknown>,
  next: IngredientType,
  emptyTagFilters: Record<FilterKey, string[]>
): Record<string, unknown> {
  return { ...prev, ...emptyTagFilters, type: next, page: 1 }
}
