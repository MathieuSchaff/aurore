import { useQuery } from '@tanstack/react-query'
import { Archive, ArchiveRestore, Trash2 } from 'lucide-react'
import { useState } from 'react'

import {
  habitQueries,
  useArchiveHabit,
  useDeleteHabit,
  useRestoreHabit,
} from '../../../lib/queries/habits'

interface HabitListViewProps {
  onSelectHabit: (id: string) => void
}

type Filter = 'active' | 'archived'

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function formatFrequency(freq: {
  type: string
  daysOfWeek?: number[] | null
  daysOfMonth?: number[] | null
  intervalDays?: number | null
}) {
  switch (freq.type) {
    case 'daily':
      return 'Tous les jours'
    case 'weekly':
      return freq.daysOfWeek?.length
        ? freq.daysOfWeek.map((d) => DAY_NAMES[d] ?? d).join(', ')
        : 'Hebdo'
    case 'monthly':
      return freq.daysOfMonth?.length
        ? `Le ${freq.daysOfMonth.join(', ')} du mois`
        : 'Mensuel'
    case 'every_n_days':
      return `Tous les ${freq.intervalDays ?? '?'}j`
    default:
      return freq.type
  }
}

export function HabitListView({ onSelectHabit }: HabitListViewProps) {
  const [filter, setFilter] = useState<Filter>('active')
  const { data: habits, isLoading } = useQuery(habitQueries.list())
  const archiveHabit = useArchiveHabit()
  const restoreHabit = useRestoreHabit()
  const deleteHabit = useDeleteHabit()

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  if (isLoading) return <ListSkeleton />

  const filtered =
    habits?.filter((h) => (filter === 'active' ? !h.archivedAt : !!h.archivedAt)) ?? []

  function handleDelete(id: string) {
    deleteHabit.mutate(id, {
      onSuccess: () => setConfirmDeleteId(null),
    })
  }

  return (
    <div className="habit-list-view">
      {/* Filter chips */}
      <div className="habit-list-filters">
        <FilterChip active={filter === 'active'} onClick={() => setFilter('active')}>
          Actives
        </FilterChip>
        <FilterChip active={filter === 'archived'} onClick={() => setFilter('archived')}>
          Archivees
        </FilterChip>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="habit-list-empty">
          <p className="habit-list-empty__text">
            {filter === 'active' ? 'Aucune habitude active.' : 'Aucune habitude archivee.'}
          </p>
        </div>
      ) : (
        <div className="habit-list">
          {filtered.map((habit) => (
            <div key={habit.id} className="habit-list-row">
              {/* Infos */}
              <button
                type="button"
                onClick={() => onSelectHabit(habit.id)}
                className="habit-list-row__info-btn"
              >
                <span className="habit-list-row__name">{habit.name}</span>
                <span className="habit-row__category">{habit.category}</span>
              </button>

              {/* Frequence badge */}
              {habit.frequency && (
                <span className="habit-list-row__frequency">
                  {formatFrequency(habit.frequency)}
                </span>
              )}

              {/* Actions */}
              <div className="habit-list-row__actions">
                {filter === 'active' ? (
                  <ActionButton
                    title="Archiver"
                    onClick={() => archiveHabit.mutate(habit.id)}
                    disabled={archiveHabit.isPending}
                  >
                    <Archive />
                  </ActionButton>
                ) : (
                  <>
                    <ActionButton
                      title="Restaurer"
                      onClick={() => restoreHabit.mutate(habit.id)}
                      disabled={restoreHabit.isPending}
                    >
                      <ArchiveRestore />
                    </ActionButton>
                    <ActionButton
                      title="Supprimer"
                      onClick={() => setConfirmDeleteId(habit.id)}
                      variant="danger"
                    >
                      <Trash2 />
                    </ActionButton>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm delete dialog */}
      {confirmDeleteId && (
        <ConfirmDialog
          title="Supprimer l'habitude ?"
          description="Cette action est irreversible. Tout l'historique sera perdu."
          confirmLabel="Supprimer"
          isLoading={deleteHabit.isPending}
          onConfirm={() => handleDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  )
}

// ── Sous-composants ──

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`filter-chip ${active ? 'filter-chip--active' : 'filter-chip--inactive'}`}
    >
      {children}
    </button>
  )
}

function ActionButton({
  onClick,
  disabled,
  title,
  variant = 'default',
  children,
}: {
  onClick: () => void
  disabled?: boolean
  title: string
  variant?: 'default' | 'danger'
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      disabled={disabled}
      className={`action-btn ${variant === 'danger' ? 'action-btn--danger' : 'action-btn--default'}`}
    >
      {children}
    </button>
  )
}

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  isLoading,
  onConfirm,
  onCancel,
}: {
  title: string
  description: string
  confirmLabel: string
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <h3 className="confirm-dialog__title">{title}</h3>
        <p className="confirm-dialog__description">{description}</p>
        <div className="confirm-dialog__actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="confirm-dialog__cancel-btn"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="confirm-dialog__confirm-btn"
          >
            {isLoading ? 'Suppression...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="list-skeleton">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="list-skeleton__item" style={{ animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
  )
}
