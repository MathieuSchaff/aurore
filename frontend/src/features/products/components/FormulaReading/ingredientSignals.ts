import { INGREDIENT_SIGNAL_PHRASE } from '@/constants/derm'

type IngredientSignalLike = {
  ingredient: string
  kind: string
  confidence: string
}

export type IngredientSignalLine = {
  key: string
  label: string
  text: string
}

const frenchList = new Intl.ListFormat('fr', {
  style: 'long',
  type: 'conjunction',
})

export function formatIngredientSignals(
  signals: readonly IngredientSignalLike[]
): IngredientSignalLine[] {
  const groups = new Map<string, { ingredients: Set<string>; text: string }>()

  for (const signal of signals) {
    const key = `${signal.kind}/${signal.confidence}`
    const text = INGREDIENT_SIGNAL_PHRASE[key]
    if (!text) continue

    const group = groups.get(key) ?? { ingredients: new Set<string>(), text }
    group.ingredients.add(signal.ingredient)
    groups.set(key, group)
  }

  return [...groups].map(([key, { ingredients, text }]) => ({
    key,
    label: frenchList.format([...ingredients]),
    text,
  }))
}
