import { createFileRoute } from '@tanstack/react-router'

import { IngredientPage } from '../../component/pages/Ingredient/IngredientPage'

export const Route = createFileRoute('/ingredients/$slug/')({
  component: IngredientPage,
})
