import { useState } from 'react'
import { Star } from 'lucide-react'
import clsx from 'clsx'
import type { ReviewCriteria, CriteriaWeights } from '../../../lib/helpers/reviews'
import { calculateWeightedScore } from '../../../lib/helpers/reviews'

const criteriaLabels: Record<keyof ReviewCriteria, string> = {
  tolerance: 'Tolérance',
  efficacy: 'Efficacité',
  sensoriality: 'Sensorialité',
  stability: 'Stabilité',
  mixability: 'Mixabilité',
  valueForMoney: 'Rapport Q/P',
}

interface ReviewFormProps {
  initialValues?: ReviewCriteria
  weights?: CriteriaWeights
  onSubmit: (values: ReviewCriteria & { comment?: string | null }) => void
}

export function ReviewForm({ initialValues, weights, onSubmit }: ReviewFormProps) {
  const [criteria, setCriteria] = useState<ReviewCriteria>({
    tolerance: initialValues?.tolerance ?? null,
    efficacy: initialValues?.efficacy ?? null,
    sensoriality: initialValues?.sensoriality ?? null,
    stability: initialValues?.stability ?? null,
    mixability: initialValues?.mixability ?? null,
    valueForMoney: initialValues?.valueForMoney ?? null,
  })
  const [comment, setComment] = useState<string>('')

  const score = calculateWeightedScore(criteria, weights, 'out_of_20')

  const handleStarClick = (key: keyof ReviewCriteria, value: number) => {
    setCriteria(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...criteria, comment: comment || null })
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Formulaire d'évaluation">
      {score && (
        <div className="review-form__score" aria-live="polite" aria-label={`Note calculée : ${score}/20`}>
          {score}/20
        </div>
      )}

      <div className="review-form__criteria">
        {(Object.keys(criteriaLabels) as (keyof ReviewCriteria)[]).map((key) => (
          <div key={key} className="review-form__criterion">
            <span className="review-form__criterion-label">{criteriaLabels[key]}</span>
            <div className="review-form__stars" role="group" aria-label={criteriaLabels[key]}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${criteriaLabels[key]} : ${star} étoile${star > 1 ? 's' : ''}`}
                  aria-pressed={criteria[key] === star}
                  onClick={() => handleStarClick(key, star)}
                >
                  <Star
                    size={16}
                    className={clsx('review-form__star', criteria[key] != null && criteria[key]! >= star && 'filled')}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <textarea
        className="review-form__comment"
        placeholder="Commentaire détaillé (optionnel)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        aria-label="Commentaire détaillé"
      />

      <button type="submit" className="review-form__submit">
        Enregistrer
      </button>
    </form>
  )
}
