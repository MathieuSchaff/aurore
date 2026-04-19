import type { TagCategoryMeta } from '../../core'
import { INGREDIENT_TAG_CATEGORIES, type IngredientTagCategory } from './tag-taxonomy'

export const INGREDIENT_TAG_CATEGORY_META: Record<IngredientTagCategory, TagCategoryMeta> = {
  skin_type: { label: 'Peau', placeholder: 'Tous types', tier: 'essential', order: 1 },
  concern: { label: 'Problème', placeholder: 'Toutes', tier: 'essential', order: 2 },
  ingredient_attribute: { label: 'Rôle', placeholder: 'Tous', tier: 'advanced', order: 3 },
  skin_effect: { label: 'Rendu', placeholder: 'Tous', tier: 'advanced', order: 4 },
  shared_label: { label: 'Comédogénicité', placeholder: 'Indifférent', tier: 'advanced', order: 5 },
}

export function ingredientFilterCategories(): IngredientTagCategory[] {
  return [...INGREDIENT_TAG_CATEGORIES].sort(
    (a, b) => INGREDIENT_TAG_CATEGORY_META[a].order - INGREDIENT_TAG_CATEGORY_META[b].order
  )
}
