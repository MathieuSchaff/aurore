import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Package } from 'lucide-react'
import { useMemo } from 'react'
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { NavArrow } from '@/component/DataDisplay/NavArrow/NavArrow'
import { IconBox } from '@/component/Layout/IconBox/IconBox'
import { RichText } from '@/component/Typography/RichText/RichText'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { ingredientQueries } from '../../lib/queries/ingredients'
import '@/features/ingredients/components/IngredientPage.css'
import '@/component/Typography/RichText/RichText.css'

function renderMarkdown(rawContent: string): string {
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

function IngredientInfoTab() {
  const { slug } = Route.useParams()
  const { data: ingredient } = useSuspenseQuery(ingredientQueries.bySlug(slug))
  const { data: products } = useQuery(ingredientQueries.products(slug))
  const { data: tags } = useQuery(ingredientQueries.tags(ingredient.id))

  const beneficialTags = useMemo(
    () => tags?.filter((t) => t.relevance === 'primary' || t.relevance === 'secondary') ?? [],
    [tags]
  )
  const avoidTags = useMemo(() => tags?.filter((t) => t.relevance === 'avoid') ?? [], [tags])

  return (
    <>
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
    </>
  )
}

export const Route = createFileRoute('/ingredients/$slug/')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(ingredientQueries.bySlug(params.slug)),
  component: IngredientInfoTab,
})
