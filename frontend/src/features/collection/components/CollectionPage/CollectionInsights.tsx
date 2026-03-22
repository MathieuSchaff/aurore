import { AlertTriangle, Ghost, Heart, Zap } from 'lucide-react'
import { useMemo } from 'react'

import type { UserProduct } from '../../../../lib/queries/user-products'
import './CollectionInsights.css'

interface CollectionInsightsProps {
  userProducts: UserProduct[]
}

const COMMON_FILLERS = [
  'Aqua',
  'Water',
  'Glycerin',
  'Glycerine',
  'Phenoxyethanol',
  'Ethylhexylglycerin',
  'Xanthan Gum',
  'Disodium EDTA',
  'Sodium Benzoate',
  'Potassium Sorbate',
  'Citric Acid',
  'Sodium Citrate',
  'Caprylyl Glycol',
]

export function CollectionInsights({ userProducts }: CollectionInsightsProps) {
  const analysis = useMemo(() => {
    const holyGrails = userProducts.filter((p) => p.status === 'holy_grail')
    const lowTolerance = userProducts.filter((p) => (p.review?.tolerance ?? 0) > 0 && (p.review?.tolerance ?? 0) <= 2)
    const badSentiment = userProducts.filter((p) => (p.sentiment ?? 0) > 0 && (p.sentiment ?? 0) <= 2)
    const avoided = userProducts.filter((p) => p.status === 'avoided')

    const countIngredients = (products: UserProduct[]) => {
      const counts: Record<string, { name: string; count: number }> = {}
      products.forEach((p) => {
        p.product?.productIngredients?.forEach((pi) => {
          const ing = pi.ingredient
          if (COMMON_FILLERS.includes(ing.name)) return
          if (!counts[ing.id]) counts[ing.id] = { name: ing.name, count: 0 }
          counts[ing.id].count++
        })
      })
      return Object.values(counts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    }

    return {
      holyGrailCommon: countIngredients(holyGrails),
      lowToleranceCommon: countIngredients(lowTolerance),
      badSentimentCommon: countIngredients(badSentiment),
      avoidedCommon: countIngredients(avoided),
    }
  }, [userProducts])

  return (
    <div className="insights-container">
      <div className="insights-grid">
        <section className="insight-card insight-card--positive">
          <div className="insight-header">
            <div className="insight-icon-wrap">
              <Heart size={24} />
            </div>
            <div>
              <h3 className="insight-title">Signature de vos Saint Graals</h3>
              <p className="insight-desc">Ingrédients récurrents dans vos coups de cœur.</p>
            </div>
          </div>
          <div className="insight-list">
            {analysis.holyGrailCommon.length > 0 ? (
              analysis.holyGrailCommon.map((ing) => (
                <div key={ing.name} className="insight-item">
                  <span className="insight-ing-name">{ing.name}</span>
                  <span className="insight-ing-count">{ing.count} produits</span>
                </div>
              ))
            ) : (
              <p className="insight-empty">Pas assez de données.</p>
            )}
          </div>
        </section>

        <section className="insight-card insight-card--negative">
          <div className="insight-header">
            <div className="insight-icon-wrap">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="insight-title">Alertes Tolérance</h3>
              <p className="insight-desc">Ingrédients présents dans vos produits irritants.</p>
            </div>
          </div>
          <div className="insight-list">
            {analysis.lowToleranceCommon.length > 0 ? (
              analysis.lowToleranceCommon.map((ing) => (
                <div key={ing.name} className="insight-item">
                  <span className="insight-ing-name">{ing.name}</span>
                  <span className="insight-ing-count">{ing.count} produits</span>
                </div>
              ))
            ) : (
              <p className="insight-empty">Tout va bien pour l'instant !</p>
            )}
          </div>
        </section>

        <section className="insight-card insight-card--neutral">
          <div className="insight-header">
            <div className="insight-icon-wrap">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="insight-title">Facteurs de déception</h3>
              <p className="insight-desc">Ingrédients communs à vos produits notés 🤢 ou 👎.</p>
            </div>
          </div>
          <div className="insight-list">
            {analysis.badSentimentCommon.length > 0 ? (
              analysis.badSentimentCommon.map((ing) => (
                <div key={ing.name} className="insight-item">
                  <span className="insight-ing-name">{ing.name}</span>
                  <span className="insight-ing-count">{ing.count} produits</span>
                </div>
              ))
            ) : (
              <p className="insight-empty">Pas de pattern détecté.</p>
            )}
          </div>
        </section>

        <section className="insight-card insight-card--neutral">
          <div className="insight-header">
            <div className="insight-icon-wrap">
              <Ghost size={24} />
            </div>
            <div>
              <h3 className="insight-title">Le "Blacklist" Personnel</h3>
              <p className="insight-desc">Ingrédients fréquents dans vos produits évités.</p>
            </div>
          </div>
          <div className="insight-list">
            {analysis.avoidedCommon.length > 0 ? (
              analysis.avoidedCommon.map((ing) => (
                <div key={ing.name} className="insight-item">
                  <span className="insight-ing-name">{ing.name}</span>
                  <span className="insight-ing-count">{ing.count} produits</span>
                </div>
              ))
            ) : (
              <p className="insight-empty">Aucun ingrédient suspect récurrent.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
