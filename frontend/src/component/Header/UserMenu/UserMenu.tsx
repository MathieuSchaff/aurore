import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { FileText, LogIn, LogOut, Shield, User, UserPlus } from 'lucide-react'

import { DropdownMenu } from '@/component/DropdownMenu/DropdownMenu'
import { Skeleton } from '@/component/Feedback/ui/Skeleton/Skeleton'
import { ProfileAvatar } from '@/features/profile/components/ProfileAvatar/ProfileAvatar'
import { useSession } from '@/lib/auth/session'
import { useLogout } from '@/lib/queries/auth'
import { profileQueries } from '@/lib/queries/profile'
import './UserMenu.css'

interface UserMenuProps {
  onItemClick?: () => void
  // 'drawer' expands the trigger to a full-width row with the username label.
  variant?: 'bar' | 'drawer'
  // Defaults suit the drawer footer (menu opens upward from the bottom). The top bar passes
  // side="bottom" align="end" so the dropdown drops below the avatar.
  side?: 'top' | 'bottom'
  align?: 'start' | 'end'
}

function useUserMenuAuthState() {
  const session = useSession()
  const isAuthenticated = session.status === 'authenticated'
  const role = isAuthenticated ? session.user.role : null

  return {
    isSessionPending: session.status === 'pending',
    isAuthenticated,
    isContentModerator: role === 'admin' || role === 'contributor',
  }
}

export const UserMenu = ({
  onItemClick,
  variant = 'bar',
  side = 'top',
  align = 'start',
}: UserMenuProps) => {
  const navigate = useNavigate()
  const { isSessionPending, isAuthenticated, isContentModerator } = useUserMenuAuthState()
  // UserMenu mounts on every page (Header in AppLayout); skip the /profile probe until a session exists.
  const { data: profile } = useQuery({ ...profileQueries.me(), enabled: isAuthenticated })
  // A disabled query still exposes cached data, so hide identity outside a live session.
  const visibleProfile = isAuthenticated && !isSessionPending ? profile : undefined
  // « Modération » reaches admin AND contributor (« modérateur »); both land on the
  // report queue (/admin/users is admin-only).
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        onItemClick?.()
        navigate({ to: '/auth/login', search: { redirect: undefined } })
      },
    })
  }

  return (
    <DropdownMenu className={`user-menu${variant === 'drawer' ? ' user-menu--drawer' : ''}`}>
      <DropdownMenu.Trigger>
        <button type="button" className="user-menu__trigger" aria-label="Menu utilisateur">
          <ProfileAvatar
            avatarUrl={visibleProfile?.avatarUrl}
            username={visibleProfile?.username}
            size="sm"
          />
          {variant === 'drawer' && (
            <span className="user-menu__username">
              {isSessionPending ? (
                <Skeleton width="5rem" height="0.85rem" />
              ) : isAuthenticated ? (
                profile?.username || 'Utilisateur'
              ) : (
                'Se connecter'
              )}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        side={side}
        align={align}
        ariaLabel="Menu utilisateur"
        className="user-menu__dropdown"
      >
        {isSessionPending ? null : isAuthenticated ? (
          <>
            <DropdownMenu.Item onSelect={onItemClick}>
              <Link to="/profile">
                <User size={16} aria-hidden="true" />
                <span>Profil</span>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={onItemClick}>
              <Link to="/submissions">
                <FileText size={16} aria-hidden="true" />
                <span>Mes soumissions</span>
              </Link>
            </DropdownMenu.Item>
            {isContentModerator && (
              <DropdownMenu.Item onSelect={onItemClick}>
                <Link to="/admin/reports">
                  <Shield size={16} aria-hidden="true" />
                  <span>Modération</span>
                </Link>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item onSelect={handleLogout}>
              <button type="button" disabled={logout.isPending}>
                <LogOut size={16} aria-hidden="true" />
                <span>{logout.isPending ? 'Déconnexion...' : 'Déconnexion'}</span>
              </button>
            </DropdownMenu.Item>
          </>
        ) : (
          <>
            <DropdownMenu.Item onSelect={onItemClick}>
              <Link to="/auth/login" search={{ redirect: undefined }}>
                <LogIn size={16} aria-hidden="true" />
                <span>Connexion</span>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={onItemClick}>
              <Link to="/auth/signup">
                <UserPlus size={16} aria-hidden="true" />
                <span>S'inscrire</span>
              </Link>
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
