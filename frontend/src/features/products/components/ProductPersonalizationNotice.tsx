import type { ProductDetailPage } from '@aurore/shared'

import { Button } from '@/component/Button/Button'

interface Props {
  unavailable: ProductDetailPage['unavailable']
  onRetry: () => void
  pending: boolean
}

export function ProductPersonalizationNotice({ unavailable, onRetry, pending }: Props) {
  if (unavailable.length === 0) return null

  return (
    <div role="status">
      {unavailable.includes('profile') && (
        <p>
          Votre profil est temporairement indisponible. La lecture de cette formule ne tient pas
          compte de votre profil.
        </p>
      )}
      {unavailable.includes('preferences') && (
        <p>
          Vos préférences sont temporairement indisponibles. Vos choix « Sans » et « Avec » ne sont
          pas affichés.
        </p>
      )}
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onRetry}>
        Réessayer la lecture personnalisée
      </Button>
    </div>
  )
}
