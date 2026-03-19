import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { ingredientQueries } from '../../../../lib/queries/ingredients'
import { IngredientForm } from '../IngredientForm/IngredientForm'
import './IngredientPageEditable.css'

const route = getRouteApi('/ingredients/$slug/edit')

export function IngredientEditPage() {
  const { slug } = route.useParams()
  const { data: ingredient } = useSuspenseQuery(ingredientQueries.bySlug(slug))
  const { data: currentTags } = useSuspenseQuery(ingredientQueries.tags(ingredient.id))
  const navigate = useNavigate()

  return (
    <div className="ingredient-edit-page">
      <div className="ingredient-edit-page__banner" />

      <div className="ingredient-edit-page__content">
        <div className="ingredient-edit-page__topbar">
          <Link to="/ingredients/$slug" params={{ slug }} className="ingredient-edit-page__back">
            <ArrowLeft size={16} />
            Retour
          </Link>
          <h1 className="ingredient-edit-page__title">Modifier l'ingrédient</h1>
        </div>

        <IngredientForm
          mode="edit"
          ingredient={ingredient}
          initialTags={currentTags.map((t) => ({
            tagId: t.tagId,
            tagName: t.tagName,
            relevance: (t.relevance || 'secondary') as 'primary' | 'secondary' | 'avoid',
          }))}
          onSuccess={(slug) => navigate({ to: '/ingredients/$slug', params: { slug } })}
        />
      </div>
    </div>
  )
}
