import type { ProfileLink } from '@aurore/shared'

import { ExternalLink, Pencil } from 'lucide-react'

import { Button } from '@/component/Button/Button'
import { Time } from '@/component/DataDisplay/Time/Time'
import { PageTitle } from '@/component/Typography/PageTitle/PageTitle'
import { sanitizeUrl } from '@/lib/url'
import { ProfileAvatar } from '../ProfileAvatar/ProfileAvatar'
import './ProfileHero.css'

type ProfileHeroProps = {
  displayName: string
  avatarUrl: string | null | undefined
  username: string | null | undefined
  createdAt: string | null | undefined
  fitzpatrickType: number | null | undefined
  bio: string | null | undefined
  links: readonly ProfileLink[] | null | undefined
  onEdit?: () => void
}

// The one identity object: avatar, name, "member since", bio and links.
// A second card describing the same person only added bio and links, and its
// empty half stretched to the height of its neighbour.
export function ProfileHero({
  displayName,
  avatarUrl,
  username,
  createdAt,
  fitzpatrickType,
  bio,
  links,
  onEdit,
}: ProfileHeroProps) {
  const hasBio = Boolean(bio && bio.trim().length > 0)
  const hasLinks = (links?.length ?? 0) > 0

  return (
    <div className="profile-hero" data-fitz={fitzpatrickType ?? 0}>
      <div className="profile-hero__banner" aria-hidden="true">
        <div className="profile-hero__banner-glow" />
      </div>
      <div className="profile-hero__content">
        <div className="profile-hero__avatar-wrapper">
          <ProfileAvatar avatarUrl={avatarUrl} username={username} size="xl" />
        </div>

        <div className="profile-hero__main">
          <div className="profile-hero__header">
            <PageTitle title={displayName} className="profile-hero__info" />
            {onEdit && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onEdit}
                aria-label="Modifier mes informations"
                className="profile-hero__edit"
              >
                <Pencil size={16} aria-hidden="true" />
              </Button>
            )}
          </div>

          {createdAt && (
            <p className="profile-hero__since">
              <span aria-hidden="true">·</span>
              <span>
                Membre depuis <Time iso={createdAt} style="monthYear" />
              </span>
            </p>
          )}

          {hasBio && <p className="profile-hero__bio">{bio}</p>}

          {hasLinks && (
            <ul role="list" className="profile-hero__links" aria-label="Mes liens">
              {links?.map((link) => (
                <li key={link.url}>
                  <a
                    href={sanitizeUrl(link.url) ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-hero__link"
                  >
                    <ExternalLink size={13} aria-hidden="true" />
                    <span>{link.label || link.url}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {!hasBio && !hasLinks && (
            <p className="profile-hero__identity-empty">
              Quelques mots ou vos pages publiques, si vous voulez. Rien d'obligatoire.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
