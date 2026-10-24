import type { ProductConcentrationUnit, ProductDraftIngredientInput } from '@aurore/shared'

import type { ProductDetail } from '@/lib/queries/products'
import type { IngredientItem } from './IngredientsFieldset'

export function ingredientItemsFromProduct(product: ProductDetail): IngredientItem[] {
  return product.ingredients.map((item) => ({
    ingredientId: item.ingredientId,
    ingredientName: item.ingredientName,
    concentrationValue: item.concentrationValue ?? '',
    concentrationUnit: (item.concentrationUnit ?? '') as ProductConcentrationUnit | '',
    concentrationPer: item.concentrationPer,
    notes: item.notes,
  }))
}

export function ingredientDraftError(ingredient: IngredientItem): string | null {
  const value = ingredient.concentrationValue.trim()
  if (!value)
    return ingredient.concentrationUnit ? 'Renseignez la dose ou effacez son unité.' : null
  const dose = Number(value)
  if (!Number.isFinite(dose) || dose < 0) return 'La dose doit être un nombre positif ou nul.'
  if (!ingredient.concentrationUnit) return 'Choisissez une unité pour cette dose.'
  if (ingredient.concentrationUnit === '%' && dose > 100)
    return 'Le pourcentage doit être compris entre 0 et 100.'
  return null
}

export function ingredientDraftPayload(items: IngredientItem[]): ProductDraftIngredientInput[] {
  return items.map((item) => ({
    ingredientId: item.ingredientId,
    concentrationValue:
      item.concentrationValue.trim() === '' ? null : Number(item.concentrationValue),
    concentrationUnit: item.concentrationUnit || null,
    concentrationPer: item.concentrationPer ?? null,
    notes: item.notes ?? null,
  }))
}
