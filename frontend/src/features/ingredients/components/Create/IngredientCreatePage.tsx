import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { PageBanner } from '@/component/Layout/PageBanner/PageBanner'
import { IngredientForm } from '../IngredientForm/IngredientForm'
import '../Edit/IngredientPageEditable.css'

function IngredientCreatePage() {
  const navigate = useNavigate()

  return (
    <div className="ingredient-edit-page">
      <PageBanner className="ingredient-edit-page__banner">
        <div className="ingredient-edit-page__topbar">
          <Link to="/ingredients" className="ingredient-edit-page__back">
            <ArrowLeft size={16} />
            Retour
          </Link>
          <h1 className="ingredient-edit-page__title">Nouvel ingredient</h1>
        </div>
      </PageBanner>

      <div className="ingredient-edit-page__content">
        <IngredientForm
          mode="create"
          onSuccess={(slug) => navigate({ to: '/ingredients/$slug', params: { slug } })}
        />
      </div>
    </div>
  )
}

export { IngredientCreatePage }
