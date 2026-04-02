import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { Leaf, Package, Pencil } from 'lucide-react'
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { BackButton } from '@/component/Button/BackButton'
import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { NavArrow } from '@/component/DataDisplay/NavArrow/NavArrow'
import { IconBox } from '@/component/Layout/IconBox/IconBox'
import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import { PageTopActions, PageTopActionsRight } from '@/component/Layout/PageLayout/PageTopActions'
import { RichText } from '@/component/Typography/RichText/RichText'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { ingredientQueries } from '../../../lib/queries/ingredients'
import './IngredientPage.css'
import '@/component/Typography/RichText/RichText.css'

import { useMemo } from 'react'

import { Button } from '@/component/Button/Button'

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
  const avoidTags = useMemo(() => tags?.filter((t) => t.relevance === 'avoid') ?? [], [tags])
  const renderMarkdown = (rawContent: string) => {
    if (!rawContent) return ''

    // The LaTeX parser (rehype-katex) needs properly escaped backslashes.
    // Without this, formulas with pKa, mathrm, etc. break during rendering.
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
    <DetailPageLayout banner>
      <PageTopActions>
        <BackButton to="/ingredients">Ingrédients</BackButton>

        <PageTopActionsRight>
          <Button to="/ingredients/$slug/edit" params={{ slug }} variant="primary">
            <Pencil size={14} />
            Modifier
          </Button>
        </PageTopActionsRight>
      </PageTopActions>

      <div className="ingredient-hero">
        <IconBox className="ingredient-hero__icon">
          <Leaf size={28} />
        </IconBox>
        <div className="ingredient-hero__info">
          <h1 className="ingredient-hero__name">{ingredient.name}</h1>
          <div className="ingredient-hero__tags">
            {ingredient.category && <Badge variant="default">{ingredient.category}</Badge>}
          </div>
        </div>
      </div>

      {beneficialTags.length > 0 && (
        <div className="ingredient-section">
          <SectionHeader title="Bénéfices" variant="primary" />
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
          <SectionHeader title="À éviter pour" variant="error" />
          <div className="ingredient-tags-list">
            {avoidTags.map((t) => (
              <Badge key={t.id} variant="error">
                {t.tagName}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {ingredient.description && (
        <div className="ingredient-section">
          <SectionHeader title="Description" variant="primary" />
          <RichText>
            <Markdown>{ingredient.description}</Markdown>
          </RichText>
        </div>
      )}

      {ingredient.content && (
        <div className="ingredient-section">
          <SectionHeader title="Contenu" variant="primary" />
          <RichText>
            <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
              {renderMarkdown(ingredient.content)}
            </Markdown>
          </RichText>
        </div>
      )}

      <div className="ingredient-section">
        <SectionHeader title="Produits" variant="primary" />
        {products && products.length > 0 ? (
          <div className="ingredient-products">
            {products.map((product) => (
              <Link
                key={product.id}
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="ingredient-product-link"
              >
                <IconBox className="ingredient-product-link__icon">
                  <Package size={16} />
                </IconBox>
                <span className="ingredient-product-link__name">{product.name}</span>
                <NavArrow size={16} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="ingredient-products-empty">Aucun produit associé à cet ingrédient.</p>
        )}
      </div>
    </DetailPageLayout>
  )
}
