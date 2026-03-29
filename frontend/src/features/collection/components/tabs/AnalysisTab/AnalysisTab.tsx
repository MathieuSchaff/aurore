import { AlertTriangle, Ban, Heart, Package, TrendingDown } from 'lucide-react'

import { useCollectionAnalysis } from '@/features/collection/hooks/useCollectionAnalysis'
import type { UserProduct } from '@/lib/queries/user-products'

import './AnalysisTab.css'

interface AnalysisTabProps {
  userProducts: UserProduct[]
}

export function AnalysisTab({ userProducts }: AnalysisTabProps) {
  const analysis = useCollectionAnalysis(userProducts)

  if (userProducts.length === 0) {
    return (
      <div className="insight-empty" style={{ padding: '4rem 2rem' }}>
        <Package size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
        <p>Ajoutez des produits à votre collection pour voir l'analyse des ingrédients.</p>
      </div>
    )
  }

  return (
    <div className="insights-container">
      <div className="insights-grid">
        <AnalysisCard
          title="Signature des Saints Graals"
          icon={<Heart size={24} />}
          description="Ingrédients récurrents dans vos favoris absolus."
          data={analysis.holyGrailCommon}
          emptyText="Pas encore assez de Saints Graals pour dégager une tendance."
          variant="positive"
        />

        <AnalysisCard
          title="Alertes Tolérance"
          icon={<AlertTriangle size={24} />}
          description="Ingrédients présents dans vos produits irritants."
          data={analysis.lowToleranceCommon}
          emptyText="Aucun ingrédient suspecté de causer des irritations."
          variant="negative"
        />

        <AnalysisCard
          title="Facteurs de déception"
          icon={<TrendingDown size={24} />}
          description="Ingrédients souvent présents dans les produits mal notés."
          data={analysis.badSentimentCommon}
          emptyText="Pas de tendance de déception identifiée."
          variant="negative"
        />

        <AnalysisCard
          title="Blacklist"
          icon={<Ban size={24} />}
          description="Ingrédients présents dans les produits que vous évitez."
          data={analysis.avoidedCommon}
          emptyText="Aucun ingrédient dans votre liste d'évitement."
          variant="neutral"
        />
      </div>
    </div>
  )
}

function AnalysisCard({
  title,
  icon,
  description,
  data,
  emptyText,
  variant,
}: {
  title: string
  icon: React.ReactNode
  description: string
  data: { name: string; count: number }[]
  emptyText: string
  variant: 'positive' | 'negative' | 'neutral'
}) {
  return (
    <section className={`insight-card insight-card--${variant}`}>
      <div className="insight-header">
        <div className="insight-icon-wrap">{icon}</div>
        <div>
          <h3 className="insight-title">{title}</h3>
          <p className="insight-desc">{description}</p>
        </div>
      </div>

      <div className="insight-list">
        {data.length > 0 ? (
          data.slice(0, 6).map((ing) => (
            <div key={ing.name} className="insight-item">
              <span className="insight-ing-name">{ing.name}</span>
              <span className="insight-ing-count">
                {ing.count} {ing.count > 1 ? 'prods' : 'prod'}
              </span>
            </div>
          ))
        ) : (
          <p className="insight-empty">{emptyText}</p>
        )}
      </div>
    </section>
  )
}
