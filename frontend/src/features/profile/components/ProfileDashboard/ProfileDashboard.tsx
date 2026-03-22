import type { ProfileUpdateInput } from '@habit-tracker/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Calendar, LayoutDashboard, Settings, UserCircle } from 'lucide-react'
import { Suspense, useState } from 'react'

import { Spinner } from '@/component/Feedback/Spinner/Spinner'
import { profileQueries, useUpdateProfile } from '../../../../lib/queries/profile'
import { AccountSettings } from '../AccountSettings/AccountSettings'
import { PreferenceSettings } from '../PreferenceSettings'
import { ProfileAvatar } from '../ProfileAvatar/ProfileAvatar'
import { ProfileForm } from '../ProfileForm/ProfileForm'
import { ProfileStats } from '../ProfileStats/ProfileStats'
import './ProfileDashboard.css'

const formatJoinDate = (date?: string | null): string => {
  if (!date) return ''
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(date))
}

type TabType = 'overview' | 'preferences' | 'account'

export const ProfileDashboard = () => {
  const { data: profile } = useSuspenseQuery(profileQueries.me())
  const updateProfile = useUpdateProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('overview')

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
        <div className="profile-hero__banner" />
        <div className="profile-hero__content">
          <div className="profile-hero__avatar-wrapper">
            <ProfileAvatar avatarUrl={profile.avatarUrl} username={profile.username} size="xl" />
          </div>

          <div className="profile-hero__main">
            <div className="profile-hero__header">
              <div className="profile-hero__info">
                <h1 className="profile-hero__name">{displayName}</h1>
                {profile.username && <p className="profile-hero__handle">@{profile.username}</p>}
              </div>
            </div>

            {profile.bio && <p className="profile-hero__bio">{profile.bio}</p>}

            {profile.createdAt && (
              <p className="profile-hero__since">
                <Calendar size={13} aria-hidden="true" />
                <span>Membre depuis {formatJoinDate(profile.createdAt)}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {!isEditing && (
        <nav className="profile-tabs">
          <button
            className={clsx('profile-tab', activeTab === 'overview' && 'active')}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} />
            Résumé
          </button>
          <button
            className={clsx('profile-tab', activeTab === 'preferences' && 'active')}
            onClick={() => setActiveTab('preferences')}
          >
            <Settings size={18} />
            Réglages
          </button>
          <button
            className={clsx('profile-tab', activeTab === 'account' && 'active')}
            onClick={() => setActiveTab('account')}
          >
            <UserCircle size={18} />
            Compte
          </button>
        </nav>
      )}

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
          <>
            {activeTab === 'overview' && (
              <div className="profile-tab-content">
                <Suspense fallback={<Spinner />}>
                  <ProfileStats />
                </Suspense>
              </div>
            )}
            {activeTab === 'preferences' && (
              <div className="profile-tab-content">
                <PreferenceSettings />
              </div>
            )}
            {activeTab === 'account' && (
              <div className="profile-tab-content">
                <AccountSettings onEditProfile={() => setIsEditing(true)} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
