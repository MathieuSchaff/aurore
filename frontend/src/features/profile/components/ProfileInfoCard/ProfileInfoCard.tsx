import type { ProfilePublic } from '@habit-tracker/shared'

import { AtSign, Calendar, FileText } from 'lucide-react'
import './ProfileInfoCard.css'

type ProfileInfoCardProps = {
  profile: ProfilePublic
}

const formatDate = (date?: string | null): string => {
  if (!date) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export const ProfileInfoCard = ({ profile }: ProfileInfoCardProps) => {
  return (
    <div className="profile-info-card">
      <h3 className="profile-info-card__title">Informations</h3>

      <dl className="profile-info-card__list">
        <div className="profile-info-card__item">
          <dt className="profile-info-card__label">
            <AtSign size={15} />
            Nom d'utilisateur
          </dt>
          <dd className="profile-info-card__value">
            {profile.username ?? <span className="profile-info-card__empty">Non défini</span>}
          </dd>
        </div>

        <div className="profile-info-card__item">
          <dt className="profile-info-card__label">
            <FileText size={15} />
            Bio
          </dt>
          <dd className="profile-info-card__value profile-info-card__bio">
            {profile.bio ?? <span className="profile-info-card__empty">Aucune bio</span>}
          </dd>
        </div>

        <div className="profile-info-card__item">
          <dt className="profile-info-card__label">
            <Calendar size={15} />
            Membre depuis
          </dt>
          <dd className="profile-info-card__value">{formatDate(profile.createdAt)}</dd>
        </div>
      </dl>
    </div>
  )
}
