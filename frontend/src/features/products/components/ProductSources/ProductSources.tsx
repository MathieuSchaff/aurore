import type { ProductDetail } from '@aurore/shared'

import { ChevronDown, ExternalLink } from 'lucide-react'
import { lazy, Suspense } from 'react'

import { CatalogQualityBadge } from '@/component/DataDisplay/CatalogQualityBadge/CatalogQualityBadge'
import { RichText } from '@/component/Typography/RichText/RichText'
import { FormulaConcentrations } from '@/features/products/components/FormulaConcentrations/FormulaConcentrations'
import { FormulaProfile } from '@/features/products/components/FormulaProfile/FormulaProfile'
import type { ProductDermoAssessment } from '@/lib/queries/products'
import { sanitizeUrl } from '@/lib/url'
import '@/features/products/styles/disclosure.css'
import './ProductSources.css'

const Markdown = lazy(() => import('react-markdown'))

export function ProductSources({
  product,
  assessment,
}: {
  product: ProductDetail
  assessment: ProductDermoAssessment | null
}) {
  const safeUrl = sanitizeUrl(product.url)
  return (
    <section className="product-section product-sources" aria-labelledby="product-sources-title">
      <div className="product-sources__heading">
        <h2 id="product-sources-title">Sources et méthode</h2>
        {safeUrl && (
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="product-sources__link"
          >
            <span>Source de la fiche</span>
            <ExternalLink size={14} aria-hidden="true" />
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
        )}
      </div>
      {product.catalogQuality === 'verified' && (
        <p className="product-sources__quality">
          <CatalogQualityBadge quality={product.catalogQuality} />
          <span>Statut de vérification de la fiche catalogue, sans test du produit fini.</span>
        </p>
      )}
      {product.description && (
        <details className="product-disclosure">
          <summary className="product-inci__summary">
            <span>Ce que dit la marque</span>
            <ChevronDown size={14} className="product-inci__chevron" aria-hidden="true" />
          </summary>
          <div className="product-sources__body">
            <p className="product-section__intro">
              Description publiée pour ce produit. Les bénéfices annoncés sont ceux de la marque.
            </p>
            <RichText className="product-description">
              <Suspense fallback={<p>{product.description}</p>}>
                <Markdown>{product.description}</Markdown>
              </Suspense>
            </RichText>
          </div>
        </details>
      )}
      <details className="product-disclosure">
        <summary className="product-inci__summary">
          <span>Comment Aurore lit cette formule</span>
          <ChevronDown size={14} className="product-inci__chevron" aria-hidden="true" />
        </summary>
        <div className="product-sources__body">
          <p>
            Aurore rapproche les ingrédients déclarés de ses fiches explicatives. Cette lecture ne
            constitue pas un test du produit fini.
          </p>
          <p>
            La liste déclarée, les ingrédients reconnus par cette lecture et les fiches associées
            décrivent des périmètres différents.
          </p>
          <div className="product-sources__context">
            <FormulaProfile tags={product.tags} />
            {product.inci && <FormulaConcentrations assessment={assessment} />}
          </div>
        </div>
      </details>
    </section>
  )
}
