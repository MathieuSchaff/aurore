// Filter keys for the ingredients list page. Mirrors the 5 buckets
// exposed by the backend `getIngredientFilterOptions`. The old `category`
// filter (native ingredients.category column) was dropped in favour of
// the attribute tag bucket — same info, single source, auto-backfilled
// at seed time from the native column. See shared/schemas/tag-taxonomy.ts
// and idee/tags/tags.md §6 for the taxonomy this derives from.

export type FilterKey = 'skin_type' | 'concern' | 'attribute' | 'skin_effect' | 'comedogenicity'

export const FILTER_KEYS = [
  'skin_type',
  'concern',
  'attribute',
  'skin_effect',
  'comedogenicity',
] as const satisfies readonly FilterKey[]

export const GROUP_LABELS: Record<FilterKey, string> = {
  skin_type: 'Peau',
  concern: 'Problème',
  attribute: 'Rôle',
  skin_effect: 'Effet peau',
  comedogenicity: 'Comédogénicité',
}
