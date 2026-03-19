import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { productQueries } from '../../../../lib/queries/products'
import { ProductForm } from '../ProductForm/ProductForm'
import './ProductEditPage.css'

const route = getRouteApi('/products/$slug/edit')

export function ProductEditPage() {
  const { slug } = route.useParams()
  const { data: product } = useSuspenseQuery(productQueries.bySlug(slug))
  const { data: currentTags } = useSuspenseQuery(productQueries.tags(product.id))
  const navigate = useNavigate()

  return (
    <div className="product-edit-page">
      <div className="product-edit-page__banner" />

      <div className="product-edit-page__content">
        <div className="product-edit-page__topbar">
          <Link to="/products/$slug" params={{ slug }} className="product-edit-page__back">
            <ArrowLeft size={16} />
            Retour
          </Link>
          <h1 className="product-edit-page__title">Modifier le produit</h1>
        </div>

        <ProductForm
          mode="edit"
          product={product}
          initialTags={currentTags.map((t) => ({
            tagId: t.tagId,
            tagName: t.tagName,
            relevance: (t.relevance || 'secondary') as 'primary' | 'secondary' | 'avoid',
          }))}
          onSuccess={(newSlug) => navigate({ to: '/products/$slug', params: { slug: newSlug } })}
        />
      </div>
    </div>
  )
}
