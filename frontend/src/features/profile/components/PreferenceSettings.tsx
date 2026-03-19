import type { DisplayScale } from '@habit-tracker/shared'

import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'

import { userPreferenceQueries, useUpdateUserPreferences } from '../../lib/queries/user-preferences'

import './PreferenceSettings.css'

const criteriaLabels: Record<string, string> = {
  tolerance: 'Tolérance',
  efficacy: 'Efficacité',
  sensoriality: 'Sensorialité',
  stability: 'Stabilité',
  mixability: 'Mixabilité',
  valueForMoney: 'Rapport Q/P',
}

const scaleLabels: Record<DisplayScale, string> = {
  out_of_5: 'Sur 5',
  out_of_10: 'Sur 10',
  out_of_20: 'Sur 20',
  percentage: 'Pourcentage (%)',
}

export function PreferenceSettings() {
  const { data: prefs, isLoading } = useQuery(userPreferenceQueries.get())
  const updateMutation = useUpdateUserPreferences()

  if (isLoading || !prefs) return <div>Chargement des préférences...</div>

  // We're not debouncing this for now to give immediate visual feedback, 
  // but it might trigger many small API calls. 
  // TODO: Add a local state + debounce if the server starts struggling.
  const handleWeightChange = (key: string, value: number) => {
    updateMutation.mutate({
      criteriaWeights: { [key]: value },
    })
  }

  const handleScaleChange = (scale: DisplayScale) => {
    updateMutation.mutate({
      displayScale: scale,
    })
  }

  return (
    <div className="pref-settings">
      <section className="pref-section">
        <h3 className="pref-section-title">Échelle d'affichage</h3>
        <p className="pref-section-desc">
          Choisissez comment les notes de vos produits sont affichées.
        </p>
        <div className="pref-scale-grid">
          {(Object.keys(scaleLabels) as DisplayScale[]).map((s) => (
            <button
              key={s}
              type="button"
              className={clsx('pref-scale-btn', prefs.displayScale === s && 'active')}
              onClick={() => handleScaleChange(s)}
            >
              {scaleLabels[s]}
            </button>
          ))}
        </div>
      </section>

      <section className="pref-section">
        <h3 className="pref-section-title">Pondération des critères</h3>
        <p className="pref-section-desc">
          Ajustez l'importance de chaque critère dans le calcul de la note finale. Un poids de 0
          ignore le critère.
        </p>
        <div className="pref-weights-list">
          {Object.entries(criteriaLabels).map(([key, label]) => (
            <div key={key} className="pref-weight-item">
              <div className="pref-weight-info">
                <span className="pref-weight-label">{label}</span>
                <span className="pref-weight-value">×{prefs.criteriaWeights[key as keyof typeof prefs.criteriaWeights]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={prefs.criteriaWeights[key as keyof typeof prefs.criteriaWeights]}
                onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                className="pref-weight-slider"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
