import { Bookmark, Eye, Package } from 'lucide-react'

import { EmptyState } from '@/component/Feedback/ui/EmptyState/EmptyState'
import {
  type PatternBucket,
  useCollectionAnalysis,
} from '@/features/collection/hooks/useCollectionAnalysis'
import type { UserProduct } from '@/lib/queries/user-products'

import './AnalysisTab.css'

interface AnalysisTabProps {
  userProducts: UserProduct[]
}

// Minimum products in a bucket before we surface a pattern. Below this
// the signal is anecdotal, not a motif — and Aurore must not invent
// certainty (anti-patterns.md §4 Fake precision).
const MIN_BUCKET_SIZE = 3

export function AnalysisTab({ userProducts }: AnalysisTabProps) {
  const { keeping, setAside } = useCollectionAnalysis(userProducts)

  if (userProducts.length === 0) {
    return (
      <EmptyState
        icon={<Package size={48} />}
        subtitle="Ajoutez quelques produits à votre étagère pour qu'Aurore puisse en dégager des motifs."
      />
    )
  }

  return (
    <div className="insights-container">
      <p className="insights-intro">
        Aurore regarde quels ingrédients reviennent dans vos produits. Ce sont des motifs dans vos
        notes, pas un classement et pas une recommandation.
      </p>

      <div className="insights-grid">
        <PatternCard
          title="Ce que vous gardez"
          icon={<Bookmark size={24} />}
          description="Ingrédients qui reviennent dans les produits que vous gardez (Saint Graal)."
          bucket={keeping}
          underThresholdText="Pas encore assez de produits gardés pour dégager un motif."
        />

        <PatternCard
          title="Ce que vous mettez de côté"
          icon={<Eye size={24} />}
          description="Ingrédients qui reviennent dans les produits que vous avez mis de côté, marqués à éviter, ou notés peu tolérants."
          bucket={setAside}
          underThresholdText="Pas encore assez de produits mis de côté pour dégager un motif."
        />
      </div>

      <p className="insights-footnote">
        À noter, pas une alerte. Aurore ne classe pas ces ingrédients comme bons ou mauvais.
      </p>
    </div>
  )
}

function PatternCard({
  title,
  icon,
  description,
  bucket,
  underThresholdText,
}: {
  title: string
  icon: React.ReactNode
  description: string
  bucket: PatternBucket
  underThresholdText: string
}) {
  const showPattern = bucket.productCount >= MIN_BUCKET_SIZE && bucket.ingredients.length > 0

  return (
    <section className="insight-card">
      <div className="insight-header">
        <div className="insight-icon-wrap">{icon}</div>
        <div>
          <h3 className="insight-title">{title}</h3>
          <p className="insight-desc">{description}</p>
        </div>
      </div>

      <div className="insight-list">
        {showPattern ? (
          bucket.ingredients.map((ing) => (
            <div key={ing.name} className="insight-item">
              <span className="insight-ing-name">{ing.name}</span>
              <span className="insight-ing-count">
                {ing.count} {ing.count > 1 ? 'prods' : 'prod'}
              </span>
            </div>
          ))
        ) : (
          <p className="insight-empty">{underThresholdText}</p>
        )}
      </div>
    </section>
  )
}
