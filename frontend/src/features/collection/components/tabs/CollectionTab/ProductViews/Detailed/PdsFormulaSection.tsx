import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Check, Copy, Droplets, Sparkles } from 'lucide-react'
import { useId } from 'react'

import { ShowMoreButton } from '@/component/DataDisplay/ShowMoreButton/ShowMoreButton'
import { pdsLabels } from '@/features/collection/constants'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useExpandableList } from '@/hooks/useExpandableList'
import { useSession } from '@/lib/auth/session'
import { productQueries } from '@/lib/queries/products'
import { profileQueries } from '@/lib/queries/profile'
import type { UserProduct } from '@/lib/queries/user-products'

import './PdsFormulaSection.css'

interface PdsFormulaSectionProps {
  p: UserProduct
}

export function PdsFormulaSection({ p }: PdsFormulaSectionProps) {
  const {
    data: fullProduct,
    isError: fullProductError,
    isPending: fullProductPending,
  } = useQuery(productQueries.bySlug(p.product.slug))

  const { copied: inciCopied, copy: copyInci } = useCopyToClipboard()
  const handleCopyInci = () => {
    if (fullProduct?.inci) void copyInci(fullProduct.inci)
  }

  const session = useSession()
  const hasViewer = session.status === 'authenticated'
  const { data: dermoProfile } = useQuery({
    ...profileQueries.dermo(),
    enabled: hasViewer,
  })

  const fragranceNote =
    dermoProfile?.skinTypes?.includes('peau-sensible') && fullProduct?.hasFragrance

  const tagsListId = useId()
  const {
    visible: visibleTags,
    hiddenCount: hiddenTagsCount,
    isExpanded: tagsExpanded,
    toggle: toggleTagsExpanded,
  } = useExpandableList(fullProduct?.ingredients ?? [], undefined, p.product.slug)

  return (
    <>
      {/* Raw INCI before the tag list: ingredients-first, backlog section 18 P2.C (2026-05-15). */}
      {fullProductError ? (
        <p className="pds-empty-msg" role="alert">
          Détails indisponibles — vérifiez votre connexion.
        </p>
      ) : fullProduct?.inci ? (
        <article className="pds-inci">
          <header className="pds-inci-head">
            <div className="pds-inci-eyebrow">
              <span className="pds-inci-rule" aria-hidden="true" />
              <span>Liste INCI</span>
              <span className="pds-inci-count">{fullProduct.inciCount} ingrédients</span>
            </div>
            <button
              type="button"
              className="pds-inci-copy"
              onClick={handleCopyInci}
              aria-label="Copier la liste INCI brute"
            >
              {inciCopied ? <Check size={13} /> : <Copy size={13} />}
              <span>{inciCopied ? 'Copié' : 'Copier'}</span>
            </button>
          </header>
          <p className="pds-inci-text">{fullProduct.inci}</p>
        </article>
      ) : null}

      {fullProduct?.ingredients && fullProduct.ingredients.length > 0 ? (
        <div className="pds-ingtags-wrap">
          <h3 className="pds-microhead">
            <Droplets size={12} aria-hidden="true" />
            <span>Composants principaux</span>
          </h3>
          <ul role="list" id={tagsListId} className="pds-ingtags">
            {visibleTags.map((pi) => (
              <li key={pi.ingredientId}>
                <Link
                  to="/ingredients/$slug"
                  params={{ slug: pi.ingredientSlug }}
                  className="pds-ingtag"
                >
                  {pi.ingredientName}
                </Link>
              </li>
            ))}
          </ul>
          <ShowMoreButton
            className="pds-ingtags-more"
            hiddenCount={hiddenTagsCount}
            isExpanded={tagsExpanded}
            onToggle={toggleTagsExpanded}
            controlsId={tagsListId}
          />
        </div>
      ) : fullProductPending ? (
        <p className="pds-empty-msg">{pdsLabels.loadingFormula}</p>
      ) : !fullProductError && !fullProduct?.inci ? (
        <p className="pds-empty-msg">
          Liste d'ingrédients non ajoutée. Vous pouvez garder ce produit comme note personnelle.
        </p>
      ) : null}

      {fragranceNote && (
        <div className="pds-note" role="note">
          <Sparkles size={14} className="pds-note-icon" aria-hidden="true" />
          <div>
            <strong>Composants parfumants</strong> — vous suivez souvent les parfums sur peau
            sensible.
          </div>
        </div>
      )}
    </>
  )
}
