// ─── Tag filter UI metadata ────────────────────────────────────────
//
// Augments TAG_CATEGORY with the display/filter config the UI needs.
// Single source of truth for:
//   - backend `getFilterOptions` bucket keys
//   - frontend filter group labels, placeholders, tiers, order
//   - which categories are filterable on which entity (derived from
//     `scope` in TAG_TAXONOMY — no manual list to maintain)
//
// FR labels live here because the app is FR-only. If i18n lands later
// we move labels to a locale file and keep tier/order here.

import { TAG_TAXONOMY, type TagCategory, TAG_CATEGORIES } from './tag-taxonomy'

export type FilterTier = 'essential' | 'advanced'

export interface TagCategoryMeta {
  label: string
  placeholder: string
  tier: FilterTier
  order: number
}

export const TAG_CATEGORY_META: Record<TagCategory, TagCategoryMeta> = {
  skin_type: { label: 'Peau', placeholder: 'Tous types', tier: 'essential', order: 1 },
  concern: { label: 'Problème', placeholder: 'Toutes', tier: 'essential', order: 2 },
  skin_zone: { label: 'Zone', placeholder: 'Toutes', tier: 'essential', order: 3 },
  product_type: { label: 'Type', placeholder: 'Tous', tier: 'essential', order: 4 },
  routine_step: { label: 'Étape', placeholder: 'Toutes', tier: 'advanced', order: 5 },
  ingredient_attribute: { label: 'Rôle', placeholder: 'Tous', tier: 'advanced', order: 6 },
  skin_effect: { label: 'Rendu', placeholder: 'Tous', tier: 'advanced', order: 7 },
  product_label: { label: 'Label', placeholder: 'Tous', tier: 'advanced', order: 8 },
  shared_label: { label: 'Comédogénicité', placeholder: 'Indifférent', tier: 'advanced', order: 9 },
}

// A category is filterable on `entity` if at least one of its slugs has
// scope = entity or 'both'. Derived from TAG_TAXONOMY at module load.
const filterableByEntity: Record<'ingredient' | 'product', Set<TagCategory>> = {
  ingredient: new Set(),
  product: new Set(),
}

for (const meta of Object.values(TAG_TAXONOMY)) {
  if (meta.scope === 'ingredient' || meta.scope === 'both') {
    filterableByEntity.ingredient.add(meta.category)
  }
  if (meta.scope === 'product' || meta.scope === 'both') {
    filterableByEntity.product.add(meta.category)
  }
}

export function filterCategoriesFor(entity: 'ingredient' | 'product'): TagCategory[] {
  return TAG_CATEGORIES.filter((c) => filterableByEntity[entity].has(c)).sort(
    (a, b) => TAG_CATEGORY_META[a].order - TAG_CATEGORY_META[b].order
  )
}

export { TAG_CATEGORIES } from './tag-taxonomy'
export type { TagCategory } from './tag-taxonomy'
