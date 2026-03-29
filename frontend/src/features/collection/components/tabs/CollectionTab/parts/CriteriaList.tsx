import { HelpCircle } from 'lucide-react'

import { criteriaDefinitions, criteriaLabels } from '@/features/collection/constants'
import { useUpsertUserProductReview } from '@/lib/queries/user-products'

import './CriteriaList.css'

interface CriteriaListProps {
  userProductId: string
  review: Record<string, unknown> | undefined | null
  activeTooltip: string | null
  setActiveTooltip: (id: string | null) => void
}

export function CriteriaList({
  userProductId,
  review,
  activeTooltip,
  setActiveTooltip,
}: CriteriaListProps) {
  const upsertReview = useUpsertUserProductReview()

  const handleRate = (key: string, val: number) => {
    const current = review?.[key]
    const newVal = current === val ? null : val
    upsertReview.mutate({ id: userProductId, input: { [key]: newVal } })
  }

  return (
    <div className="pds-criteria-list">
      {Object.entries(criteriaLabels).map(([key, label]) => (
        <div key={key} className="pds-criterion">
          <div className="pds-criterion-info">
            <span className="pds-criterion-label">{label}</span>
            <div className="pds-tooltip-container">
              <button
                type="button"
                className="pds-help-btn"
                onMouseEnter={() => setActiveTooltip(key)}
                onMouseLeave={() => setActiveTooltip(null)}
                onClick={() => setActiveTooltip(activeTooltip === key ? null : key)}
                aria-label={`Aide pour ${label}`}
              >
                <HelpCircle size={12} />
              </button>
              {activeTooltip === key && (
                <div className="pds-tooltip" role="tooltip">
                  {criteriaDefinitions[key as keyof typeof criteriaDefinitions]}
                </div>
              )}
            </div>
          </div>
          <div className="pds-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`pds-star ${review?.[key] && (review[key] as number) >= star ? 'filled' : ''}`}
                onClick={() => handleRate(key, star)}
                aria-label={`Noter ${star} sur 5`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
