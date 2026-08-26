import type { PreferenceStance } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { Button } from '@/component/Button/Button'
import { MARK_ADDED_CONFIRMATION, STANCE_LABEL } from '@/constants/preferences'
import { useSession } from '@/lib/auth/session'
import {
  preferenceTargetQueries,
  useDeleteIngredientPreference,
  useUpsertIngredientPreference,
} from '@/lib/queries/profile'
import './IngredientMarkButtons.css'

interface IngredientMarkButtonsProps {
  canonicalKey: string
  // Spells out "Sans <name>": a bare verb reads as a word glued to its
  // neighbour, which is what made the gesture illegible.
  name?: string
  stances: readonly PreferenceStance[]
  // Product detail already owns the complete viewer page. `undefined` keeps
  // the standalone ingredient-page query; null means a known empty state
  currentStance?: PreferenceStance | null
}

// Declare "Sans X / Avec X" on the substance under the reader's eyes:
// the in-context shortcut, the recap in /profile stays the authority.
// Anonymous visitors see nothing; unkeyed ingredients never mount this (the
// caller gates on canonicalKey, the only identity a preference can attach to).
export function IngredientMarkButtons({
  canonicalKey,
  name,
  stances,
  currentStance,
}: IngredientMarkButtonsProps) {
  const session = useSession()
  const hasViewer = session.status === 'authenticated'
  const hasCallerStance = currentStance !== undefined
  const {
    data: targets,
    isPending,
    isError,
  } = useQuery({
    ...preferenceTargetQueries.list(),
    enabled: hasViewer && !hasCallerStance,
  })
  // The page is SSR'd but this list is a client query, so `targets` is undefined
  // while it loads and when it fails alike: a definite `aria-pressed="false"`
  // would deny a rule the user already set.
  const stateUnknown = !hasCallerStance && (isPending || isError)
  const upsert = useUpsertIngredientPreference()
  const remove = useDeleteIngredientPreference()

  if (!hasViewer) return null

  const targetFromQuery = targets?.ingredients.find((i) => i.canonicalKey === canonicalKey)
  const current = hasCallerStance
    ? currentStance
      ? { stance: currentStance }
      : undefined
    : targetFromQuery
  const pending = upsert.isPending || remove.isPending
  const justAdded = upsert.isSuccess && current !== undefined

  const toggle = (stance: PreferenceStance) => {
    if (current?.stance === stance) {
      remove.mutate(canonicalKey)
    } else {
      upsert.mutate({ canonicalKey, stance })
    }
  }

  return (
    <div className="ingredient-mark">
      {stances.map((stance) => (
        <Button
          key={stance}
          variant={current?.stance === stance ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => toggle(stance)}
          disabled={pending || stateUnknown}
          aria-pressed={stateUnknown ? undefined : current?.stance === stance}
          aria-busy={stateUnknown || undefined}
          className="ingredient-mark__button"
        >
          {name ? `${STANCE_LABEL[stance]} ${name}` : STANCE_LABEL[stance]}
        </Button>
      ))}
      <span className="ingredient-mark__confirmation" aria-live="polite">
        {justAdded && (
          <>
            {MARK_ADDED_CONFIRMATION} ·{' '}
            <Link to="/profile" hash="reperes" className="ingredient-mark__link">
              voir
            </Link>
          </>
        )}
      </span>
    </div>
  )
}
