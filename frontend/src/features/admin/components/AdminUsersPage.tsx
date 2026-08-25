import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { Time } from '@/component/DataDisplay/Time/Time'
import { Input } from '@/component/Input/Input'
import { adminQueries } from '@/lib/queries/admin'
import { adminLabels, formatAdminCount, roleLabels, rolePillClass } from '../constants'

const accountCountLabels = { singular: 'compte', plural: 'comptes' } as const
const filteredAccountCountLabels = {
  singular: 'compte filtré',
  plural: 'comptes filtrés',
} as const

export function AdminUsersPage() {
  const { data } = useSuspenseQuery(adminQueries.users())
  const [search, setSearch] = useState('')
  const normalizedSearch = search.trim().toLowerCase()
  const isFiltering = normalizedSearch.length > 0

  const filteredUsers = useMemo(() => {
    if (!normalizedSearch) return data.items
    return data.items.filter((u) => u.email.toLowerCase().includes(normalizedSearch))
  }, [data.items, normalizedSearch])

  return (
    <section>
      <header className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Utilisateurs</h1>
          <p className="admin-page__lede" role="status" aria-live="polite" aria-atomic="true">
            {formatAdminCount(data.items.length, accountCountLabels)} · 100 plus récents
            {isFiltering
              ? ` · ${formatAdminCount(filteredUsers.length, filteredAccountCountLabels)}`
              : ''}
          </p>
        </div>
      </header>

      <div className="admin-search">
        <Input
          type="search"
          name="user-search"
          label="Rechercher par email"
          placeholder="alice@…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          inputMode="email"
          enterKeyHint="search"
          spellCheck={false}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="admin-table__empty">
          {isFiltering ? adminLabels.emptyUsersFiltered : adminLabels.emptyUsers}
        </p>
      ) : (
        <div className="admin-table-scroll">
          <table className="admin-table">
            <caption className="sr-only">Liste des utilisateurs</caption>
            <thead>
              <tr>
                <th>Email</th>
                <th>Rôle</th>
                <th>Vérifié</th>
                <th>Forçage privé</th>
                <th>Créé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Link
                      to="/admin/users/$userId"
                      params={{ userId: u.id }}
                      className="admin-table__row-link"
                    >
                      {u.email}
                    </Link>
                  </td>
                  <td>
                    <span className={rolePillClass(u.role)}>{roleLabels[u.role]}</span>
                  </td>
                  <td>{u.emailVerifiedAt ? 'Oui' : 'Non'}</td>
                  <td>
                    {u.forcedPrivateByAdmin ? (
                      <span className="admin-pill admin-pill--banned">
                        {adminLabels.pillForced}
                      </span>
                    ) : (
                      'Non'
                    )}
                  </td>
                  <td>
                    <Time iso={u.createdAt} style="short" />
                  </td>
                  <td>
                    <Link to="/admin/users/$userId" params={{ userId: u.id }}>
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
