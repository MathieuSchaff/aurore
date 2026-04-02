import { useNavigate } from '@tanstack/react-router'

import { BackButton } from '@/component/Button/BackButton'
import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import { PageTopActions } from '@/component/Layout/PageLayout/PageTopActions'
import { IngredientForm } from '../IngredientForm/IngredientForm'
import '../Edit/IngredientPageEditable.css'

function IngredientCreatePage() {
  const navigate = useNavigate()

  return (
    <DetailPageLayout banner>
      <PageTopActions>
        <BackButton to="/ingredients">Ingrédients</BackButton>
      </PageTopActions>

      <div className="create-page-header">
        <h1 className="create-page-header__title">Nouvel ingrédient</h1>
      </div>

      <IngredientForm
        mode="create"
        onSuccess={(slug) => navigate({ to: '/ingredients/$slug', params: { slug } })}
      />
    </DetailPageLayout>
  )
}

export { IngredientCreatePage }
