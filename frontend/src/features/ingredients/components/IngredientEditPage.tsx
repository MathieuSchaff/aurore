import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, useNavigate } from '@tanstack/react-router'

import { BackButton } from '@/component/Button/BackButton'
import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import { PageTopActions } from '@/component/Layout/PageLayout/PageTopActions'
import { ingredientQueries } from '../../../lib/queries/ingredients'
import { IngredientForm } from './IngredientForm/IngredientForm'
import './IngredientPageEditable.css'

const route = getRouteApi('/ingredients/$slug/edit')

export function IngredientEditPage() {
  const { slug } = route.useParams()
  const { data: ingredient } = useSuspenseQuery(ingredientQueries.bySlug(slug))
  const { data: currentTags } = useSuspenseQuery(ingredientQueries.tags(ingredient.id))
  const navigate = useNavigate()

  return (
    <DetailPageLayout banner>
      <PageTopActions>
        <BackButton to="/ingredients/$slug" params={{ slug }}>
          Retour
        </BackButton>
      </PageTopActions>

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
    </DetailPageLayout>
  )
}
