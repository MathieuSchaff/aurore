import type {
  AdminBanListItem,
  AdminUserAccount,
  BanScope,
  CreateBanInput,
  UpdateRoleInput,
} from '@aurore/shared'

import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { Fragment, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Time } from '@/component/DataDisplay/Time/Time'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { Input } from '@/component/Input/Input'
import { Select } from '@/component/Input/Select/Select'
import { Textarea } from '@/component/Input/Textarea/Textarea'
import { Toggle } from '@/component/Input/Toggle/Toggle'
import { useConfirm } from '@/features/admin/useConfirm'
import { useAnnounce } from '@/hooks/useAnnounce'
import { useSession } from '@/lib/auth/session'
import { parseDatetimeLocalAsUTC } from '@/lib/dates'
import { isApiErrorCode } from '@/lib/helpers/apiError'
import {
  adminQueries,
  useCreateBan,
  useDemoteToUser,
  useLiftBan,
  useModerateProfileVisibility,
} from '@/lib/queries/admin'
import { getBanScopeLabel, getBanScopeOptions } from '../banScopePresentation'
import { adminLabels, getAdminErrorMessage, roleLabels } from '../constants'
import { useSuccessFeedback } from '../useSuccessFeedback'

const routeApi = getRouteApi('/admin/users_/$userId')

function AdminUserHeader({
  isAdmin,
  isPending,
  isError,
  user,
}: {
  isAdmin: boolean
  isPending: boolean
  isError: boolean
  user: AdminUserAccount | undefined
}) {
  if (isAdmin && isPending) {
    return (
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Chargement du compte…</h1>
        </div>
        <Link to="/admin/users" className="admin-table__row-link">
          ← Liste
        </Link>
      </header>
    )
  }
  if (isAdmin && (isError || !user)) {
    return (
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Informations du compte indisponibles</h1>
          <FormMessage variant="error">
            Impossible de charger le compte. Les pauses restent disponibles.
          </FormMessage>
        </div>
        <Link to="/admin/users" className="admin-table__row-link">
          ← Liste
        </Link>
      </header>
    )
  }
  if (isAdmin && user) {
    return (
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">{user.email}</h1>
          <p className="admin-page__lede">
            {roleLabels[user.role]} — {user.emailVerifiedAt ? 'email vérifié' : 'email non vérifié'}
            {' — créé '}
            <Time iso={user.createdAt} relative />
          </p>
        </div>
        <Link to="/admin/users" className="admin-table__row-link">
          ← Liste
        </Link>
      </header>
    )
  }
  return (
    <header className="admin-page__header">
      <div>
        <h1 className="admin-page__title">Publications en pause</h1>
        <p className="admin-page__lede">
          Mettre en pause ou réactiver les publications de cet utilisateur.
        </p>
      </div>
      <Link to="/admin/reports" className="admin-table__row-link">
        ← Signalements
      </Link>
    </header>
  )
}

export function AdminUserDetailPage() {
  const { userId } = routeApi.useParams()
  const session = useSession()
  const isAdmin = session.status === 'authenticated' && session.user.role === 'admin'
  const accountQuery = useQuery({ ...adminQueries.user(userId), enabled: isAdmin })
  const bansQuery = useSuspenseQuery(adminQueries.userBans(userId))
  const user = accountQuery.data

  if (isAdmin && accountQuery.isError && isApiErrorCode(accountQuery.error, 'not_found')) {
    return (
      <section>
        <p className="admin-table__empty">{adminLabels.userNotFound}</p>
        <Link to="/admin/users">← Liste des utilisateurs</Link>
      </section>
    )
  }

  return (
    <section>
      <AdminUserHeader
        isAdmin={isAdmin}
        isPending={accountQuery.isPending}
        isError={accountQuery.isError}
        user={user}
      />

      <Fragment key={userId}>
        <CreateBanCard userId={userId} isAdmin={isAdmin} />
        <BansListCard userId={userId} bans={bansQuery.data} isAdmin={isAdmin} />
        {isAdmin && user && (
          <ProfileVisibilityCard userId={userId} forced={user.forcedPrivateByAdmin} />
        )}
        {isAdmin && user?.role === 'contributor' && <RoleCard userId={userId} />}
      </Fragment>
    </section>
  )
}

function BanTableRow({
  ban,
  isAdmin,
  isPending,
  onLift,
}: {
  ban: AdminBanListItem
  isAdmin: boolean
  isPending: boolean
  onLift: (banId: string, scope: BanScope) => void
}) {
  const statusClass = `admin-pill ${ban.status === 'active' ? 'admin-pill--banned' : ''}`.trim()
  const canLift = ban.status === 'active' && (isAdmin || ban.scope !== 'global')
  return (
    <tr>
      <td>
        <span className={statusClass}>{getBanScopeLabel(ban.scope)}</span>
      </td>
      <td>
        <span className={statusClass}>{ban.status === 'active' ? 'Active' : 'Expirée'}</span>
      </td>
      <td>{ban.reason ?? <em>—</em>}</td>
      <td>{ban.expiresAt ? <Time iso={ban.expiresAt} relative /> : 'Permanent'}</td>
      <td>
        <Time iso={ban.createdAt} relative />
      </td>
      <td>
        {canLift ? (
          <Button
            variant="ghost"
            size="sm"
            loading={isPending}
            onClick={() => onLift(ban.id, ban.scope)}
          >
            Lever
          </Button>
        ) : (
          <em>—</em>
        )}
      </td>
    </tr>
  )
}

// Shown only for a contributor target; role can be granted again later.
function RoleCard({ userId }: { userId: string }) {
  const demote = useDemoteToUser(userId)
  const announce = useAnnounce()
  const { confirm, dialog } = useConfirm()
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleDemote() {
    setError(null)
    const ok = await confirm({
      title: 'Rétrograder ce modérateur ?',
      message:
        'Ses droits de modération et de curation seront retirés immédiatement. Le compte redeviendra utilisateur. Un rôle pourra lui être accordé à nouveau.',
      confirmLabel: 'Rétrograder',
      variant: 'danger',
    })
    if (!ok) return
    const body: UpdateRoleInput = { role: 'user' }
    if (reason.trim().length > 0) body.reason = reason.trim()
    // The card unmounts on success (contributor gone) = silent for a screen reader;
    // announce before it goes. No toast: the announcement carries the confirmation.
    demote.mutate(body, {
      onSuccess: () => announce('Modérateur rétrogradé'),
      onError: (err) => setError(getAdminErrorMessage(err)),
    })
  }

  return (
    <section className="admin-card" aria-labelledby="admin-user-role-title">
      <h2 id="admin-user-role-title" className="admin-card__title">
        Rôle
      </h2>
      <p className="admin-page__lede">
        Retirer immédiatement les droits de modération et de curation de ce compte. Un rôle pourra
        lui être accordé à nouveau.
      </p>
      <div className="admin-card__field">
        <Input
          label="Raison (optionnel)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
        />
      </div>
      <div aria-live="polite" aria-atomic="true">
        {error && <FormMessage variant="error">{error}</FormMessage>}
      </div>
      <div className="admin-form__actions">
        <Button loading={demote.isPending} onClick={handleDemote}>
          Rétrograder en utilisateur
        </Button>
      </div>
      {dialog}
    </section>
  )
}

function CreateBanCard({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const createBan = useCreateBan(userId)
  const { confirm, dialog } = useConfirm()
  const scopeOptions = getBanScopeOptions(isAdmin)
  const [scope, setScope] = useState<BanScope>(isAdmin ? 'global' : 'review_publish')
  const [reason, setReason] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { success, setSuccess } = useSuccessFeedback()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const body: CreateBanInput = { scope }
    if (reason.trim().length > 0) body.reason = reason.trim()
    if (expiresAt) {
      body.expiresAt = parseDatetimeLocalAsUTC(expiresAt)
    }
    const ok = await confirm({
      title: 'Mettre en pause ?',
      message: `Portée : ${getBanScopeLabel(scope)}. L’accès est suspendu immédiatement (action réversible).`,
      confirmLabel: 'Mettre en pause',
      variant: 'danger',
    })
    if (!ok) return
    createBan.mutate(body, {
      onSuccess: () => {
        setReason('')
        setExpiresAt('')
        setSuccess('Mise en pause appliquée.')
      },
      onError: (err) => setError(getAdminErrorMessage(err)),
    })
  }

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Mettre en pause</h2>
      <form onSubmit={handleSubmit}>
        <div className="admin-form__grid">
          <Select<BanScope>
            label="Portée"
            options={scopeOptions}
            value={scope}
            onValueChange={(v) => v && setScope(v)}
          />
          <Input
            label="Expire le (optionnel)"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
          <div className="admin-form__field-wide">
            <Textarea
              label="Raison (optionnel)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              maxLength={500}
            />
          </div>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {error && <FormMessage variant="error">{error}</FormMessage>}
          {success && <FormMessage variant="success">{success}</FormMessage>}
        </div>
        <div className="admin-form__actions">
          <Button type="submit" loading={createBan.isPending}>
            Mettre en pause
          </Button>
        </div>
      </form>
      {dialog}
    </div>
  )
}

function BansListCard({
  userId,
  bans,
  isAdmin,
}: {
  userId: string
  bans: AdminBanListItem[]
  isAdmin: boolean
}) {
  const liftBan = useLiftBan(userId)
  const { confirm, dialog } = useConfirm()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { success, setSuccess } = useSuccessFeedback()

  async function handleLift(banId: string, scope: BanScope) {
    setError(null)
    const ok = await confirm({
      title: 'Lever la pause ?',
      message: `Portée : ${getBanScopeLabel(scope)}. L’accès est restauré immédiatement.`,
      confirmLabel: 'Lever',
    })
    if (!ok) return
    setPendingId(banId)
    liftBan.mutate(banId, {
      onSuccess: () => {
        setError(null)
        setSuccess('Pause levée.')
      },
      onError: (err) =>
        setError(
          isApiErrorCode(err, 'not_found')
            ? 'Cette pause n’existe plus.'
            : getAdminErrorMessage(err)
        ),
      onSettled: () => setPendingId(null),
    })
  }

  return (
    <div className="admin-card">
      <h2 className="admin-card__title">Pauses en cours et historique</h2>
      <div aria-live="polite" aria-atomic="true">
        {error && <FormMessage variant="error">{error}</FormMessage>}
        {success && <FormMessage variant="success">{success}</FormMessage>}
      </div>
      {bans.length === 0 ? (
        <p className="admin-table__empty">{adminLabels.emptyBans}</p>
      ) : (
        <div className="admin-table-scroll">
          <table className="admin-table">
            <caption className="sr-only">Pauses (actives et historique)</caption>
            <thead>
              <tr>
                <th>Portée</th>
                <th>Statut</th>
                <th>Raison</th>
                <th>Expire</th>
                <th>Créé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bans.map((b) => (
                <BanTableRow
                  key={b.id}
                  ban={b}
                  isAdmin={isAdmin}
                  isPending={pendingId === b.id && liftBan.isPending}
                  onLift={handleLift}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      {dialog}
    </div>
  )
}

function ProfileVisibilityCard({ userId, forced }: { userId: string; forced: boolean }) {
  const moderate = useModerateProfileVisibility(userId)
  const { confirm, dialog } = useConfirm()
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { success, setSuccess } = useSuccessFeedback()

  async function apply(next: boolean) {
    setError(null)
    setSuccess(null)
    const ok = await confirm({
      title: next ? 'Forcer ce profil en privé ?' : 'Lever le forçage privé ?',
      message: next
        ? 'Le profil sera invisible. Ses avis et publications publiques seront masqués, ainsi que son pseudonyme sur les autres échanges.'
        : 'Le profil retrouvera la visibilité choisie par son auteur. Ses avis, publications et pseudonyme retrouveront leur affichage habituel.',
      confirmLabel: next ? 'Forcer en privé' : 'Lever',
      variant: next ? 'danger' : 'default',
    })
    if (!ok) return
    moderate.mutate(
      {
        forcedPrivate: next,
        reason: next && reason.trim().length > 0 ? reason.trim() : undefined,
      },
      {
        onSuccess: () => {
          setError(null)
          setSuccess(next ? 'Profil forcé en privé.' : 'Forçage levé.')
        },
        onError: (err) => setError(getAdminErrorMessage(err)),
      }
    )
  }

  return (
    <section className="admin-card" aria-labelledby="admin-user-profile-visibility-title">
      <h2 id="admin-user-profile-visibility-title" className="admin-card__title">
        Visibilité du profil
      </h2>
      <p className="admin-page__lede">
        Action exceptionnelle. À utiliser uniquement quand la modération de chaque avis ou
        discussion ne suffit plus.
      </p>
      <div className="admin-card__field">
        <Toggle
          label="Forcer le profil en privé"
          hint="Le choix de visibilité de l’auteur reste ignoré tant que le forçage est actif."
          checked={forced}
          disabled={moderate.isPending}
          onChange={(next) => apply(next)}
        />
      </div>
      <div className="admin-card__field">
        <Input
          label="Raison (optionnel)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={500}
        />
      </div>
      <div aria-live="polite" aria-atomic="true">
        {error && <FormMessage variant="error">{error}</FormMessage>}
        {success && <FormMessage variant="success">{success}</FormMessage>}
      </div>
      {dialog}
    </section>
  )
}
