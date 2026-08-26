import type { ReactableType, Reactor } from '@aurore/shared'
import { REACTION_KINDS } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { Button } from '@/component/Button/Button'
import { REACTION_KIND_LABELS } from '@/constants/social'
import { useAnnounce } from '@/hooks/useAnnounce'
import { useSession, viewerId } from '@/lib/auth/session'
import { reactionQueries, useToggleReaction } from '@/lib/queries/social'

import './ReactionRow.css'

// One reactor, signed: links to the profile only when public (ReviewerName
// pattern). Never rendered as a number; the names themselves are the signal.
function ReactorName({ reactor }: { reactor: Reactor }) {
  if (reactor.profilePublic) {
    return (
      <Link
        className="reaction-row__reactor-link"
        to="/u/$username"
        params={{ username: reactor.username }}
      >
        {reactor.username}
      </Link>
    )
  }
  return <span className="reaction-row__reactor">{reactor.username}</span>
}

// Entraide reactions on a Reactable (post / thread / reply). Shows WHO reacted per
// kind, never a count. Toggling is signed and needs auth; anonymous
// readers see existing reactors but no buttons, and an empty anonymous row renders
// nothing (calme: no controls a logged-out reader can't use).
export function ReactionRow({
  reactableType,
  reactableId,
}: {
  reactableType: ReactableType
  reactableId: string
}) {
  // A profile query would send two anonymous 401s on every public view
  const session = useSession()
  const currentViewerId = viewerId(session)
  const { data } = useQuery(reactionQueries.list(reactableType, reactableId, currentViewerId))
  const toggle = useToggleReaction(reactableType, reactableId, currentViewerId)
  const announce = useAnnounce()

  const canReact = session.status === 'authenticated' && session.credential === 'present'
  const viewerKinds = data?.viewerKinds ?? []
  // Boolean, never a sum. The row only needs to know whether anyone reacted at all.
  const hasAnyReaction = data ? Object.values(data.reactions).some((r) => r.length > 0) : false

  if (!canReact && !hasAnyReaction) return null

  return (
    <div className="reaction-row">
      {REACTION_KINDS.map((kind) => {
        const reactors = data?.reactions[kind] ?? []
        const pressed = viewerKinds.includes(kind)
        const label = REACTION_KIND_LABELS[kind]
        return (
          <div key={kind} className="reaction-row__kind">
            <Button
              variant="bare"
              className="reaction-row__toggle"
              aria-pressed={pressed}
              disabled={!canReact || toggle.isPending}
              onClick={() =>
                toggle.mutate(
                  { kind, on: !pressed },
                  {
                    onSuccess: () =>
                      announce(
                        pressed ? `Réaction « ${label} » retirée` : `Réaction « ${label} » ajoutée`
                      ),
                  }
                )
              }
            >
              {label}
            </Button>
            {reactors.length > 0 && (
              <ul
                role="list"
                className="reaction-row__reactors"
                aria-label={`Réactions « ${label} »`}
              >
                {reactors.map((reactor) => (
                  <li key={`${kind}:${reactor.username}`}>
                    <ReactorName reactor={reactor} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
