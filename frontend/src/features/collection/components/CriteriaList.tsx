import clsx from 'clsx'
import { Info, Star } from 'lucide-react'
import { useRef } from 'react'

import { useClickOutside } from '../../../hooks/useClickOutside'
import type { ReviewCriteria } from '../../../lib/helpers/reviews'
import type { UserProduct } from '../../../lib/queries/user-products'
import { criteriaDefinitions, criteriaLabels } from '../constants'

interface CriteriaListProps {
  p: UserProduct
  activeTooltip: string | null
  setActiveTooltip: (v: string | null) => void
  handleReview: (id: string, input: Partial<ReviewCriteria>) => void
}

export function CriteriaList({ p, activeTooltip, setActiveTooltip, handleReview }: CriteriaListProps) {
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setActiveTooltip(null))

  const criteriaKeys = Object.keys(criteriaLabels) as (keyof ReviewCriteria)[]

  return (
    <div className="coll-criteria-list" ref={ref}>
      {criteriaKeys.map((key) => {
        const label = criteriaLabels[key]
        const criterionValue = p.review ? (p.review[key] as number | null | undefined) : null

        return (
          <div key={key} className="coll-criterion">
            <div className="coll-criterion-label-group">
              <span className="coll-criterion-label">{label}</span>
              {criteriaDefinitions[key] && (
                <div className="coll-info-wrapper">
                  <button
                    type="button"
                    className="coll-info-trigger"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveTooltip(activeTooltip === key ? null : key)
                    }}
                    aria-label={`Informations sur ${label}`}
                  >
                    <Info size={14} />
                  </button>
                  {activeTooltip === key && (
                    <div className="coll-info-tooltip">
                      <p>
                        <b>{label} :</b> {criteriaDefinitions[key]}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="coll-criterion-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="coll-star-btn"
                  onClick={() => handleReview(p.id, { [key]: star })}
                >
                  <Star
                    size={16}
                    className={clsx(
                      'coll-star-icon',
                      criterionValue != null && criterionValue >= star && 'filled'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
