import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { habitQueries } from '../../../lib/queries/habits'
import { HabitFormDialog } from './HabitFormDialog'
import { StockBadge } from './StockBadge'

interface HabitDetailProps {
  habitId: string
  onClose: () => void
}

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function describeFrequency(freq: {
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
        : 'Hebdomadaire'
    case 'monthly':
      return freq.daysOfMonth?.length
        ? `Le ${freq.daysOfMonth.join(', ')} du mois`
        : 'Mensuel'
    case 'every_n_days':
      return `Tous les ${freq.intervalDays ?? '?'} jours`
    default:
      return freq.type
  }
}

function formatBeforeMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}min avant`
  if (minutes < 1440) return `${Math.round(minutes / 60)}h avant`
  return `${Math.round(minutes / 1440)}j avant`
}

export function HabitDetail({ habitId, onClose }: HabitDetailProps) {
  const [showEdit, setShowEdit] = useState(false)

  const { startDate, endDate } = useMemo(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 29)
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    }
  }, [])

  const { data: habit, isLoading } = useQuery(habitQueries.detail(habitId))
  const { data: checks } = useQuery(habitQueries.checks(habitId, startDate, endDate))
  const { data: stats } = useQuery(habitQueries.stats(habitId, startDate, endDate))

  // Get today data for stock info
  const { data: todayData } = useQuery(habitQueries.today())
  const todayHabit = todayData?.find((item) => item.habit.id === habitId)

  const checkedDates = useMemo(() => {
    if (!checks) return new Set<string>()
    return new Set(checks.map((c) => c.scheduledDate))
  }, [checks])

  const days = useMemo(() => {
    const result: Array<{ date: string; dayNum: number; isToday: boolean }> = []
    const today = new Date().toISOString().split('T')[0]
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        dayNum: d.getDate(),
        isToday: dateStr === today,
      })
    }
    return result
  }, [])

  return (
    <>
      <div
        className="habit-detail-overlay"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      />

      <div className="habit-detail-panel">
        <div className="habit-detail-panel__header">
          <button
            type="button"
            onClick={onClose}
            className="habit-detail-panel__close-btn"
            aria-label="Fermer"
          >
            <X />
          </button>
          <button
            type="button"
            onClick={() => setShowEdit(true)}
            className="habit-detail-panel__edit-btn"
          >
            Modifier
          </button>
        </div>

        <div className="habit-detail-panel__content">
          {isLoading ? (
            <DetailSkeleton />
          ) : habit ? (
            <div className="habit-detail-panel__body">
              {/* Titre */}
              <div className="habit-detail-title">
                <div className="habit-detail-title__row">
                  <h2 className="habit-detail-title__name">{habit.name}</h2>
                  <span className="habit-row__category">{habit.category}</span>
                </div>
              </div>

              {/* Statistiques */}
              {stats && (
                <div className="habit-detail-stats">
                  <StatCard label="Streak" value={stats.currentStreak ?? 0} unit="j" />
                  <StatCard label="Total" value={stats.totalChecks ?? 0} unit="" />
                  <StatCard
                    label="Taux"
                    value={Math.round((stats.completionRate ?? 0) * 100)}
                    unit="%"
                  />
                </div>
              )}

              {/* Mini calendrier */}
              <div className="habit-mini-calendar">
                <h3 className="habit-mini-calendar__heading">30 derniers jours</h3>
                <div className="habit-mini-calendar__grid">
                  {days.map((day) => {
                    const isChecked = checkedDates.has(day.date)
                    let modifier = 'calendar-day--empty'
                    if (isChecked) modifier = 'calendar-day--checked'
                    else if (day.isToday) modifier = 'calendar-day--today'

                    return (
                      <div
                        key={day.date}
                        title={`${day.date}${isChecked ? ' ✓' : ''}`}
                        className={`calendar-day ${modifier}`}
                      >
                        {day.dayNum}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Produits lies */}
              {todayHabit && todayHabit.products.length > 0 && (
                <div className="habit-detail-config">
                  <h3 className="habit-detail-config__heading">Produits</h3>
                  <div className="habit-detail-products">
                    {todayHabit.products.map((p) => {
                      const usagesPerDay = Math.max(todayHabit.timings.length, 1)
                      return (
                        <div key={p.id} className="habit-detail-product">
                          <div className="habit-detail-product__info">
                            <span className="habit-detail-product__name">
                              {p.product.brand ? `${p.product.brand} - ` : ''}
                              {p.product.name}
                            </span>
                            {p.dosage && (
                              <span className="habit-detail-product__dosage">{p.dosage}</span>
                            )}
                          </div>
                          {p.stock && (
                            <StockBadge
                              qty={p.stock.qty}
                              usagesPerDay={usagesPerDay}
                              unit={p.product.unit}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Configuration */}
              <div className="habit-detail-config">
                <h3 className="habit-detail-config__heading">Configuration</h3>
                <div className="habit-detail-config__list">
                  {habit.frequency && (
                    <ConfigRow label="Frequence" value={describeFrequency(habit.frequency)} />
                  )}
                  {habit.timings && habit.timings.length > 0 && (
                    <div className="config-row">
                      <span className="config-row__label">Horaires</span>
                      <div className="config-row__timings">
                        {habit.timings.map((t) => (
                          <span key={t.id} className="config-timing-badge">
                            {t.time}
                            {t.label && <span className="config-timing-badge__label"> ({t.label})</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {habit.period?.startDate && (
                    <ConfigRow
                      label="Periode"
                      value={`${habit.period.startDate}${habit.period.endDate ? ` -> ${habit.period.endDate}` : ''}`}
                    />
                  )}
                  {habit.reminders && habit.reminders.length > 0 && (
                    <ConfigRow
                      label="Rappels"
                      value={habit.reminders.map((r) => formatBeforeMinutes(r.beforeMinutes)).join(', ')}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="habit-detail-panel__not-found">
              <p className="habit-detail-panel__not-found-text">Habitude introuvable.</p>
            </div>
          )}
        </div>
      </div>

      {showEdit && habit && (
        <HabitFormDialog
          habit={{
            id: habit.id,
            name: habit.name,
            category: habit.category,
            frequency: habit.frequency
              ? {
                  type: habit.frequency.type,
                  daysOfWeek: habit.frequency.daysOfWeek ?? undefined,
                  intervalDays: habit.frequency.intervalDays ?? undefined,
                }
              : undefined,
          }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  )
}

// ── Sub-components ──

function StatCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="stat-card">
      <div className="stat-card__value">
        {value}
        {unit && <span className="stat-card__unit">{unit}</span>}
      </div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="config-row">
      <span className="config-row__label">{label}</span>
      <span className="config-row__value">{value}</span>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="detail-skeleton">
      <div className="detail-skeleton__title" />
      <div className="detail-skeleton__stats">
        {[1, 2, 3].map((i) => (
          <div key={i} className="detail-skeleton__stat" />
        ))}
      </div>
      <div className="detail-skeleton__calendar" />
    </div>
  )
}
