import clsx from 'clsx'

import { Button } from '../../Button/Button'

import './ShowMoreButton.css'

type ShowMoreButtonProps = {
  hiddenCount: number
  isExpanded: boolean
  onToggle: () => void
  controlsId?: string
  className?: string
}

export function ShowMoreButton({
  hiddenCount,
  isExpanded,
  onToggle,
  controlsId,
  className,
}: ShowMoreButtonProps) {
  if (hiddenCount <= 0) return null

  return (
    <Button
      variant="bare"
      className={clsx('show-more-button', className)}
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-controls={controlsId}
    >
      {isExpanded ? 'Voir moins' : `+ ${hiddenCount} autre${hiddenCount > 1 ? 's' : ''}`}
    </Button>
  )
}
