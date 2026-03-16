import type { CriteriaWeights } from '../../../lib/helpers/reviews'
import { DEFAULT_WEIGHTS } from '../../../lib/helpers/reviews'
import type { DisplayScale } from '@habit-tracker/shared'

const criteriaLabels: Record<keyof CriteriaWeights, string> = {
  tolerance: 'Tolérance',
  efficacy: 'Efficacité',
  sensoriality: 'Sensorialité',
  stability: 'Stabilité',
  mixability: 'Mixabilité',
  valueForMoney: 'Rapport Q/P',
}

const scaleOptions: { value: DisplayScale; label: string }[] = [
  { value: 'out_of_5', label: '/5' },
  { value: 'out_of_10', label: '/10' },
  { value: 'out_of_20', label: '/20' },
  { value: 'percentage', label: '%' },
]

interface WeightPreferencesProps {
  weights: CriteriaWeights
  displayScale: DisplayScale
  onWeightsChange: (weights: CriteriaWeights) => void
  onScaleChange: (scale: DisplayScale) => void
}

export function WeightPreferences({
  weights,
  displayScale,
  onWeightsChange,
  onScaleChange,
}: WeightPreferencesProps) {
  const updateWeight = (key: keyof CriteriaWeights, value: number) => {
    onWeightsChange({ ...weights, [key]: value })
  }

  const resetWeights = () => onWeightsChange({ ...DEFAULT_WEIGHTS })

  return (
    <div className="weight-prefs" aria-label="Préférences de pondération">
      <div className="weight-prefs__scale">
        <span>Affichage de la note</span>
        <div role="group" aria-label="Échelle d'affichage">
          {scaleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={displayScale === opt.value}
              onClick={() => onScaleChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="weight-prefs__list">
        {(Object.keys(criteriaLabels) as (keyof CriteriaWeights)[]).map((key) => (
          <div key={key} className="weight-prefs__item">
            <label htmlFor={`weight-${key}`}>{criteriaLabels[key]}</label>
            <input
              id={`weight-${key}`}
              type="range"
              min={0}
              max={10}
              step={1}
              value={weights[key]}
              onChange={(e) => updateWeight(key, parseInt(e.target.value))}
              aria-label={`Poids de ${criteriaLabels[key]}`}
            />
            <span>{weights[key]}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={resetWeights}
        aria-label="Réinitialiser les poids"
      >
        Réinitialiser
      </button>
    </div>
  )
}
