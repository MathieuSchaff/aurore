import { useQuery } from '@tanstack/react-query'
import { Archive, ArchiveRestore, ChevronDown, ChevronUp, Info, Layers, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/component/Button/Button'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import {
  habitQueries,
  useArchiveHabit,
  useDeleteHabit,
  useReorderHabits,
  useRestoreHabit,
} from '../../../lib/queries/habits'
import './styles/HabitsListView.css'

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
      return freq.daysOfMonth?.length ? `Le ${freq.daysOfMonth.join(', ')} du mois` : 'Mensuel'
    case 'every_n_days':
      return `Tous les ${freq.intervalDays ?? '?'}j`
    default:
      return freq.type
  }
}

export function HabitListView({ onSelectHabit }: HabitListViewProps) {
  const [filter, setFilter] = useState<Filter>('active')
  const { data: activeHabits, isLoading: loadingActive } = useQuery({
    ...habitQueries.list(),
    enabled: filter === 'active',
  })
  const { data: archivedHabits, isLoading: loadingArchived } = useQuery({
    ...habitQueries.archived(),
    enabled: filter === 'archived',
  })

  const habits = filter === 'active' ? activeHabits : archivedHabits
  const isLoading = filter === 'active' ? loadingActive : loadingArchived

  const archiveHabit = useArchiveHabit()
  const restoreHabit = useRestoreHabit()
  const deleteHabit = useDeleteHabit()

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const reorderHabits = useReorderHabits()

  const filtered = habits ?? []

  function handleReorder(index: number, direction: 'up' | 'down') {
    if (!habits) return
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= filtered.length) return

    const newOrder = filtered.map((h, i) => {
      if (i === index) return { id: h.id, position: swapIndex }
      if (i === swapIndex) return { id: h.id, position: index }
      return { id: h.id, position: i }
    })
    reorderHabits.mutate(newOrder)
  }

  if (isLoading) return <ListSkeleton />

  function handleDelete(id: string) {
    deleteHabit.mutate(id, {
      onSuccess: () => setConfirmDeleteId(null),
    })
  }

  return (
    <div className="habit-list-view">
      {/* Header with Filter chips */}
      <div className="habit-list-header">
        <SectionHeader title={filter === 'active' ? 'Mes Habitudes' : 'Habitudes Archivées'}>
          <div className="habit-list-filters">
            <FilterChip active={filter === 'active'} onClick={() => setFilter('active')}>
              Actives
            </FilterChip>
            <FilterChip active={filter === 'archived'} onClick={() => setFilter('archived')}>
              Archivées
            </FilterChip>
          </div>
        </SectionHeader>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="habit-list-empty-state">
          <Layers size={40} className="habit-list-empty-state__icon" />
          <p className="habit-list-empty-state__text">
            {filter === 'active' ? 'Aucune habitude active.' : 'Aucune habitude archivée.'}
          </p>
        </div>
      ) : (
        <div className="habit-list">
          {filtered.map((habit, index) => (
            <div key={habit.id} className="habit-list-card">
              <div className="habit-list-card__main">
                <div className="habit-list-card__content">
                  <div className="habit-list-card__title-row">
                    <span className="habit-list-card__name">{habit.name}</span>
                    <span className="habit-row__category">{habit.category}</span>
                  </div>
                  {habit.frequency && (
                    <span className="habit-list-card__frequency">
                      {formatFrequency(habit.frequency)}
                    </span>
                  )}
                </div>

                <div className="habit-list-card__actions">
                  <button
                    type="button"
                    onClick={() => onSelectHabit(habit.id)}
                    className="action-btn action-btn--info"
                    title="Détails"
                  >
                    <Info size={16} />
                  </button>

                  {filter === 'active' ? (
                    <>
                      <div className="reorder-group">
                        <ActionButton
                          title="Monter"
                          onClick={() => handleReorder(index, 'up')}
                          disabled={index === 0 || reorderHabits.isPending}
                        >
                          <ChevronUp size={16} />
                        </ActionButton>
                        <ActionButton
                          title="Descendre"
                          onClick={() => handleReorder(index, 'down')}
                          disabled={index === filtered.length - 1 || reorderHabits.isPending}
                        >
                          <ChevronDown size={16} />
                        </ActionButton>
                      </div>
                      <ActionButton
                        title="Archiver"
                        onClick={() => archiveHabit.mutate(habit.id)}
                        disabled={archiveHabit.isPending}
                        variant="secondary"
                      >
                        <Archive size={16} />
                      </ActionButton>
                    </>
                  ) : (
                    <>
                      <ActionButton
                        title="Restaurer"
                        onClick={() => restoreHabit.mutate(habit.id)}
                        disabled={restoreHabit.isPending}
                        variant="primary"
                      >
                        <ArchiveRestore size={16} />
                      </ActionButton>
                      <ActionButton
                        title="Supprimer"
                        onClick={() => setConfirmDeleteId(habit.id)}
                        variant="danger"
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm delete dialog */}
      {confirmDeleteId && (
        <ConfirmDialog
          title="Supprimer l'habitude ?"
          description="Cette action est irréversible. Tout l'historique sera perdu."
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
    <button type="button" onClick={onClick} className={`filter-chip ${active ? 'is-active' : ''}`}>
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
  variant?: 'default' | 'danger' | 'primary' | 'secondary'
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
      className={`action-btn action-btn--${variant}`}
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
          <Button type="button" onClick={onCancel} disabled={isLoading} variant="outline" fullWidth>
            Annuler
          </Button>
          <Button type="button" onClick={onConfirm} loading={isLoading} variant="primary" fullWidth>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="list-skeleton">
      {['sk1', 'sk2', 'sk3', 'sk4', 'sk5', 'sk6'].map((key, i) => (
        <div key={key} className="list-skeleton__item" style={{ animationDelay: `${i * 60}ms` }} />
      ))}
    </div>
  )
}
