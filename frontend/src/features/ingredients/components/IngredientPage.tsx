import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ArrowLeft, ChevronRight, Leaf, Package, Pencil } from 'lucide-react'
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { ingredientQueries } from '../../../lib/queries/ingredients'
import './IngredientPage.css'
import '../../../styles/common/ingredients-shared.css'
import '../../../styles/common/markdown.css'

import { useMemo } from 'react'

const route = getRouteApi('/ingredients/$slug')

export function IngredientPage() {
  const { slug } = route.useParams()
  const { data: ingredient } = useSuspenseQuery(ingredientQueries.bySlug(slug))
  const { data: products } = useQuery(ingredientQueries.products(slug))
  const { data: tags } = useQuery(ingredientQueries.tags(ingredient.id))

  const beneficialTags = useMemo(
    () => tags?.filter((t) => t.relevance === 'primary' || t.relevance === 'secondary') ?? [],
    [tags]
  )
  const primaryTags = useMemo(() => tags?.filter((t) => t.relevance === 'primary') ?? [], [tags])
  const avoidTags = useMemo(() => tags?.filter((t) => t.relevance === 'avoid') ?? [], [tags])
  const renderMarkdown = (rawContent: string) => {
    if (!rawContent) return ''

    // HACK: Targeting LaTeX content between $$ because rehype-katex 
    // struggles with some raw formatting (like unescaped pKa or mathrm).
    let cleaned = rawContent

    cleaned = cleaned.replace(/\$\$(.*?)\$\$/gs, (_, formula) => {
      const fixedFormula = formula
        .replace(/mathrm/g, '\\mathrm')
        .replace(/pKa/g, '\\mathrm{pK}_a')
        .replace(/log/g, '\\log')
        .replace(/left/g, '\\left')
        .replace(/right/g, '\\right')
        .replace(/frac/g, '\\frac')
        .replace(/[\r\n]+/g, ' ')

      return `$$${fixedFormula}$$`
    })

    return cleaned
  }
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
              {primaryTags.map((t) => (
                <span key={t.id} className="category-tag category-tag--primary">
                  {t.tagName}
                </span>
              ))}
            </div>
          </div>
        </div>

        {beneficialTags.length > 0 && (
          <div className="ingredient-section">
            <h2 className="section-label">Bénéfices</h2>
            <div className="ingredient-tags-list">
              {beneficialTags.map((t) => (
                <span
                  key={t.id}
                  className={`tag-pill ${t.relevance === 'primary' ? 'tag-pill--primary' : ''}`}
                >
                  {t.tagName}
                </span>
              ))}
            </div>
          </div>
        )}

        {avoidTags.length > 0 && (
          <div className="ingredient-section">
            <h2 className="section-label section-label--avoid">À éviter pour</h2>
            <div className="ingredient-tags-list">
              {avoidTags.map((t) => (
                <span key={t.id} className="tag-pill tag-pill--avoid">
                  {t.tagName}
                </span>
              ))}
            </div>
          </div>
        )}

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
              <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                {/*{ingredient.content}*/}
                {/*{
                  ingredient.content
                    .replace(/mathrm/g, '\\mathrm')
                    .replace(/log/g, '\\log')
                    .replace(/left/g, '\\left')
                    .replace(/right/g, '\\right')
                    .replace(/frac/g, '\\frac')
                  // .replace(/\n/g, ' ')
                              }*/}
                {renderMarkdown(ingredient.content)}
              </Markdown>
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
