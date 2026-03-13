import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ArrowLeft, ChevronRight, Leaf, Package, Pencil } from 'lucide-react'
import Markdown from 'react-markdown'

import { ingredientQueries } from '../../../lib/queries/ingredients'
import './IngredientPage.css'
import '../../../styles/common/ingredients-shared.css'
import '../../../styles/common/markdown.css'

const route = getRouteApi('/ingredients/$slug')

export function IngredientPage() {
  const { slug } = route.useParams()
  const { data: ingredient } = useSuspenseQuery(ingredientQueries.bySlug(slug))
  const { data: products } = useQuery(ingredientQueries.products(slug))

  return (
    <div className="ingredient-page">
      <div className="ingredient-page__banner" />

      <div className="ingredient-page__content">
        <div className="ingredient-page__topbar">
          <Link to="/ingredients" className="btn-pill ingredient-page__back">
            <ArrowLeft size={16} />
            Ingrédients
          </Link>

          <Link
            to="/ingredients/$slug/edit"
            params={{ slug }}
            className="btn-pill ingredient-page__edit-btn"
          >
            <Pencil size={14} />
            Modifier
          </Link>
        </div>

        <div className="ingredient-hero">
          <div className="icon-box ingredient-hero__icon">
            <Leaf size={28} />
          </div>
          <div className="ingredient-hero__info">
            <h1 className="ingredient-hero__name">{ingredient.name}</h1>
            <div className="ingredient-hero__tags">
              {ingredient.category && <span className="category-tag">{ingredient.category}</span>}
            </div>
          </div>
        </div>

        {ingredient.description && (
          <div className="ingredient-section">
            <h2 className="section-label">Description</h2>
            <div className="rich-text">
              <Markdown>{ingredient.description}</Markdown>
            </div>
          </div>
        )}

        {ingredient.content && (
          <div className="ingredient-section">
            <h2 className="section-label">Contenu</h2>
            <div className="rich-text">
              <Markdown>{ingredient.content}</Markdown>
            </div>
          </div>
        )}

        <div className="ingredient-section">
          <h2 className="section-label">Produits</h2>
          {products && products.length > 0 ? (
            <div className="ingredient-products">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to="/products/$slug"
                  params={{ slug: product.slug }}
                  className="ingredient-product-link"
                >
                  <div className="icon-box ingredient-product-link__icon">
                    <Package size={16} />
                  </div>
                  <span className="ingredient-product-link__name">{product.name}</span>
                  <ChevronRight size={16} className="nav-arrow" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="ingredient-products-empty">Aucun produit associé à cet ingrédient.</p>
          )}
        </div>
      </div>
    </div>
  )
}
