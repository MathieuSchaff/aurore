import type { PublicReviewView, ReviewAxisKey } from '@aurore/shared'
import { reviewAxisKeys } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { Time } from '@/component/DataDisplay/Time/Time'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { FITZPATRICK_ITEMS, SKIN_TYPE_LABELS } from '@/constants/skin'
import { ReportContentButton } from '@/features/discussions/components/ReportContentButton'
import { useSession } from '@/lib/auth/session'
import { productQueries } from '@/lib/queries/products'

import './PublicReviewsSection.css'

interface PublicReviewsSectionProps {
  slug: string
  messageVariant?: 'panel' | 'plain'
}

const AXIS_LABELS: Record<ReviewAxisKey, string> = {
  tolerance: 'Tolérance',
  efficacy: 'Effet ressenti',
  sensoriality: 'Sensorialité',
  stability: 'Stabilité',
  mixability: 'Compatibilité routine',
  valueForMoney: 'Rapport qualité-prix',
}

function SkinContextChips({ reviewer }: { reviewer: PublicReviewView['reviewer'] }) {
  const { skinTypes, fitzpatrickType } = reviewer
  if (!skinTypes?.length && fitzpatrickType == null) return null
  const fitzLabel =
    fitzpatrickType != null
      ? (FITZPATRICK_ITEMS.find((f) => f.value === fitzpatrickType)?.label ?? null)
      : null
  return (
    <div className="public-reviews__skin-context">
      {skinTypes?.map((t) => (
        <span key={t} className="public-reviews__skin-chip">
          {SKIN_TYPE_LABELS[t]}
        </span>
      ))}
      {fitzLabel != null && (
        <span className="public-reviews__skin-chip">Phototype {fitzLabel}</span>
      )}
    </div>
  )
}

function ReviewerName({ reviewer }: { reviewer: PublicReviewView['reviewer'] }) {
  if (reviewer.profilePublic) {
    return (
      <Link
        className="public-reviews__author-link ui-author-link"
        to="/u/$username"
        params={{ username: reviewer.username }}
      >
        {reviewer.username}
      </Link>
    )
  }
  return <span className="public-reviews__author-name">{reviewer.username}</span>
}

export function PublicReviewsSection({
  slug,
  messageVariant = 'panel',
}: PublicReviewsSectionProps) {
  const messageClassName = messageVariant === 'plain' ? 'public-reviews__message' : 'ui-empty-panel'
  const { data, isLoading, isError } = useQuery(productQueries.publicReviews(slug))
  const session = useSession()
  const isAuthenticated = session.status === 'authenticated' && session.credential === 'present'

  if (isLoading) {
    return (
      <section className="product-section public-reviews">
        <SectionHeader title="Retours utilisateurs" variant="primary" />
        <p className={messageClassName}>Chargement des retours partagés…</p>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section className="product-section public-reviews">
        <SectionHeader title="Retours utilisateurs" variant="primary" />
        <p className={messageClassName}>
          Retours indisponibles pour le moment. Vous pouvez réessayer plus tard.
        </p>
      </section>
    )
  }

  const { reviews } = data

  return (
    <section className="product-section public-reviews">
      <SectionHeader
        title="Retours utilisateurs"
        count={reviews.length > 0 ? reviews.length : undefined}
        variant="primary"
      />

      {reviews.length === 0 ? (
        <p className={messageClassName}>
          Aucun retour public pour ce produit pour le moment. Les expériences partagées apparaîtront
          ici.
        </p>
      ) : (
        <>
          <p className="public-reviews__intro">
            Des expériences personnelles partagées par leurs auteurs, pas un verdict.
          </p>
          <ul role="list" className="public-reviews__verbatims">
            {reviews.map((review) => {
              // Only ratings shared by the author belong beside a public comment
              const ratedAxes = reviewAxisKeys.filter((k) => review[k] != null)
              return (
                <li key={review.id} className="ui-content-card">
                  <header className="ui-split-row">
                    <span className="public-reviews__byline">
                      <ReviewerName reviewer={review.reviewer} />
                      <Time
                        iso={review.createdAt}
                        style="monthYear"
                        className="public-reviews__verbatim-date"
                      />
                    </span>
                    {isAuthenticated && (
                      <ReportContentButton targetType="review" targetId={review.id} />
                    )}
                  </header>
                  <SkinContextChips reviewer={review.reviewer} />
                  <p className="public-reviews__verbatim-body">{review.comment}</p>
                  {ratedAxes.length > 0 && (
                    <dl className="public-reviews__axis-list">
                      {ratedAxes.map((key) => (
                        <div key={key} className="public-reviews__axis">
                          <dt className="public-reviews__axis-label">{AXIS_LABELS[key]}</dt>
                          <dd className="public-reviews__axis-value">{review[key]}/5</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}
