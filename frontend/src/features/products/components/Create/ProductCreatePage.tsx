import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { ProductForm } from '../ProductForm/ProductForm'
import '../Edit/ProductEditPage.css'

export function ProductCreatePage() {
  const navigate = useNavigate()

  return (
    <div className="product-edit-page">
      <div className="product-edit-page__banner" />

      <div className="product-edit-page__content">
        <div className="product-edit-page__topbar">
          <Link to="/products/" className="product-edit-page__back">
            <ArrowLeft size={16} />
            Retour
          </Link>
          <h1 className="product-edit-page__title">Nouveau produit</h1>
        </div>

        <ProductForm
          mode="create"
          onSuccess={(slug) => navigate({ to: '/products/$slug', params: { slug } })}
        />
      </div>
    </div>
  )
}
