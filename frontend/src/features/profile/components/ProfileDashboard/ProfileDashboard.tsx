import type { ProfileUpdateInput } from '@habit-tracker/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Calendar, Pencil } from 'lucide-react'
import { useState } from 'react'

import { profileQueries, useUpdateProfile } from '../../../../lib/queries/profile'
import { Button } from '@/component/Button/Button'
import { PreferenceSettings } from '../PreferenceSettings'
import { ProfileAvatar } from '../ProfileAvatar/ProfileAvatar'
import { ProfileForm } from '../ProfileForm/ProfileForm'
import './ProfileDashboard.css'

const formatJoinDate = (date?: string | null): string => {
  if (!date) return ''
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(
    new Date(date),
  )
}

export const ProfileDashboard = () => {
  const { data: profile } = useSuspenseQuery(profileQueries.me())
  const updateProfile = useUpdateProfile()
  const [isEditing, setIsEditing] = useState(false)

  const displayName = profile.username ?? 'Utilisateur'

  const handleUpdate = (data: ProfileUpdateInput) => {
    updateProfile.mutate(data, {
      onSuccess: () => setIsEditing(false),
    })
  }

  const errorMessage = updateProfile.isError
    ? 'Une erreur est survenue lors de la mise à jour.'
    : null

  return (
    <main className="profile-dashboard">
      <div className="profile-hero">
        <div className="profile-hero__content">
          <ProfileAvatar avatarUrl={profile.avatarUrl} username={profile.username} size="xl" />

          <div className="profile-hero__info">
            <h1 className="profile-hero__name">{displayName}</h1>
            {profile.username && (
              <p className="profile-hero__handle">@{profile.username}</p>
            )}
            {profile.bio && <p className="profile-hero__bio">{profile.bio}</p>}
            {profile.createdAt && (
              <p className="profile-hero__since">
                <Calendar size={11} aria-hidden="true" />
                Membre depuis {formatJoinDate(profile.createdAt)}
              </p>
            )}
          </div>

          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="profile-hero__edit"
            >
              <Pencil size={14} />
              Modifier
            </Button>
          )}
        </div>
      </div>

      <div className="profile-dashboard__body">
        {isEditing ? (
          <ProfileForm
            profile={profile}
            onSubmit={handleUpdate}
            onCancel={() => {
              setIsEditing(false)
              updateProfile.reset()
            }}
            isPending={updateProfile.isPending}
            error={errorMessage}
          />
        ) : (
          <PreferenceSettings />
        )}
      </div>
    </main>
  )
}
