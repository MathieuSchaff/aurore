import { createFileRoute } from '@tanstack/react-router'

import { IngredientPage } from '../../features/ingredients/components/IngredientPage'

export const Route = createFileRoute('/ingredients/$slug/')({
  component: IngredientPage,
})
