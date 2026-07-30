import { Button } from '@/component/Button/Button'
import './AvoidedBanner.css'

interface AvoidedBannerProps {
  hiddenCount: number
  excludedLabels: string[]
  requiredLabels: string[]
  showHidden: boolean
  onToggleShowHidden: (next: boolean) => void
}

// Masking is always visible and reversible in one tap, never a
// silent disappearance. It states the applied rule, cumulation included
// (several "Sans" add up, several "Avec" mean at least one), so the user never
// has to guess why the list shrank.
export function AvoidedBanner({
  hiddenCount,
  excludedLabels,
  requiredLabels,
  showHidden,
  onToggleShowHidden,
}: AvoidedBannerProps) {
  if (hiddenCount === 0) return null
  const plural = hiddenCount > 1 ? 's' : ''

  const ruleParts: string[] = []
  if (excludedLabels.length > 0) ruleParts.push(`sans : ${excludedLabels.join(', ')}`)
  if (requiredLabels.length > 0) {
    ruleParts.push(
      requiredLabels.length > 1
        ? `avec au moins un de : ${requiredLabels.join(', ')}`
        : `avec : ${requiredLabels[0]}`
    )
  }

  return (
    <p className="avoided-banner" data-testid="avoided-banner" role="status">
      <span className="avoided-banner__text">
        {showHidden
          ? `${hiddenCount} produit${plural} hors de vos règles affiché${plural}`
          : `${hiddenCount} produit${plural} masqué${plural}`}
        {ruleParts.length > 0 && <> — vos règles : {ruleParts.join(' · ')}</>}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleShowHidden(!showHidden)}
        className="avoided-banner__action"
      >
        {showHidden ? 'Masquer à nouveau' : 'Afficher quand même'}
      </Button>
    </p>
  )
}
