import { useQuery } from '@tanstack/react-query'
import { Star, Package, Heart, ShoppingBag, Eye, Archive, Ban, Trash2 } from 'lucide-react'
import {
  useUpdateUserProduct,
  useUpsertUserProductReview,
  useDeleteUserProduct,
} from '../../../lib/queries/user-products'
import { userPreferenceQueries } from '../../../lib/queries/user-preferences'
import { calculateWeightedScore } from '../../../lib/helpers/reviews'
import type { UserProductStatus } from '@habit-tracker/shared'
import clsx from 'clsx'

import './PersonalReview.css'

interface PersonalReviewProps {
  userProduct: any
}

const statusLabels: Record<UserProductStatus, { label: string; icon: any; color: string }> = {
  in_stock: { label: 'En stock', icon: Package, color: '#10b981' },
  wishlist: { label: 'Wishlist', icon: ShoppingBag, color: '#3b82f6' },
  watched: { label: 'Surveille', icon: Eye, color: '#f59e0b' },
  holy_grail: { label: 'Saint Graal', icon: Heart, color: '#ef4444' },
  archived: { label: 'Archivé', icon: Archive, color: '#6b7280' },
  avoided: { label: 'À éviter', icon: Ban, color: '#000000' },
}

const sentimentEmojis: Record<number, string> = {
  1: '🤢',
  2: '👎',
  3: '😐',
  4: '👍',
  5: '😍',
}

const criteriaLabels: Record<string, string> = {
  tolerance: 'Tolérance',
  efficacy: 'Efficacité',
  sensoriality: 'Sensorialité',
  stability: 'Stabilité',
  mixability: 'Mixabilité',
  valueForMoney: 'Rapport Q/P',
}

export function PersonalReview({ userProduct: p }: PersonalReviewProps) {
  const { data: prefs } = useQuery(userPreferenceQueries.get())
  const updateMutation = useUpdateUserProduct()
  const reviewMutation = useUpsertUserProductReview()
  const deleteMutation = useDeleteUserProduct()

  const score = calculateWeightedScore(p.review, prefs?.criteriaWeights, prefs?.displayScale)

  return (
    <div className="personal-review">
      <div className="review-header">
        <h2 className="section-label">Votre Expérience</h2>
        {score && (
          <div className="review-score">
            <span className="review-score-val">{score}</span>
            {prefs?.displayScale !== 'percentage' && <span className="review-score-max">
                {prefs?.displayScale === 'out_of_5' ? '/5' : prefs?.displayScale === 'out_of_10' ? '/10' : '/20'}
            </span>}
          </div>
        )}
      </div>

      <div className="review-content">
        <section className="review-section">
          <h3 className="review-section-title">Statut & Ressenti</h3>
          <div className="review-status-picker">
            {(Object.keys(statusLabels) as UserProductStatus[]).map((s) => {
              const cfg = statusLabels[s]
              const Icon = cfg.icon
              return (
                <button
                  key={s}
                  type="button"
                  className={clsx('review-status-option', p.status === s && 'active')}
                  onClick={() => updateMutation.mutate({ id: p.id, input: { status: s } })}
                >
                  <Icon size={18} style={{ color: p.status === s ? 'white' : cfg.color }} />
                  <span>{cfg.label}</span>
                </button>
              )
            })}
          </div>

          <div className="review-sentiment-selector">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                className={clsx('review-sentiment-option', p.sentiment === s && 'active')}
                onClick={() => updateMutation.mutate({ id: p.id, input: { sentiment: s } })}
              >
                <span className="review-sentiment-emoji">{sentimentEmojis[s]}</span>
              </button>
            ))}
          </div>

          <textarea
            className="review-quick-comment"
            placeholder="Un petit mot sur ce produit..."
            defaultValue={p.comment || ''}
            onBlur={(e) =>
              updateMutation.mutate({
                id: p.id,
                input: { comment: e.target.value },
              })
            }
          />
        </section>

        <section className="review-section">
          <h3 className="review-section-title">Évaluation détaillée</h3>
          <div className="review-criteria-list">
            {Object.entries(criteriaLabels).map(([key, label]) => (
              <div key={key} className="review-criterion">
                <span className="review-criterion-label">{label}</span>
                <div className="review-criterion-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="review-star-btn"
                      onClick={() =>
                        reviewMutation.mutate({
                          id: p.id,
                          input: { [key]: star },
                        })
                      }
                    >
                      <Star
                        size={18}
                        className={clsx(
                          'review-star-icon',
                          (p.review as any)?.[key] >= star && 'filled'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="review-footer">
        <button
          type="button"
          className="review-delete-btn"
          onClick={() => {
            if (confirm('Retirer ce produit de votre collection ?')) {
              deleteMutation.mutate(p.id)
            }
          }}
        >
          <Trash2 size={14} />
          Retirer de ma collection
        </button>
      </div>
    </div>
  )
}
