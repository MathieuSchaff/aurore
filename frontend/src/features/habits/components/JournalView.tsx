import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'

import { habitQueries } from '../../../lib/queries/habits'
import { logQueries, useLogHabitCheck, useLogWellbeing } from '../../../lib/queries/logs'

// ── Wellbeing config ──

const WELLBEING_METRICS = [
  { key: 'energy', label: 'Energie', icon: '⚡' },
  { key: 'sleep', label: 'Sommeil', icon: '😴' },
  { key: 'fog', label: 'Brouillard', icon: '🌫️' },
  { key: 'stress', label: 'Stress', icon: '😤' },
  { key: 'mood', label: 'Humeur', icon: '🎭' },
  { key: 'skin', label: 'Peau', icon: '✨' },
  { key: 'pain', label: 'Douleur', icon: '🩹' },
] as const

const SCORE_EMOJIS = ['😵', '😕', '🖐️', '😊', '😄'] as const

type WellbeingMetric = (typeof WELLBEING_METRICS)[number]['key']

// ── Main component ──

interface JournalViewProps {
  date: string // YYYY-MM-DD
}

export function JournalView({ date }: JournalViewProps) {
  const { data, isLoading, error } = useQuery(logQueries.today(date))

  if (isLoading) return <JournalSkeleton />
  if (error) return <JournalError message="Impossible de charger le journal." />

  return (
    <div className="journal-view">
      <HabitChecksSection date={date} checks={data?.habitChecks ?? []} />
      <WellbeingSection date={date} logs={data?.wellbeingLogs ?? []} />
    </div>
  )
}

// ── Habit Checks Section ──

interface HabitCheck {
  id: string
  habitId: string
  scheduledDate: string
  timingId: string | null
  status: string
  actualTime: string | null
  completedAt: string | null
  products: Array<{
    id: string
    checkId: string
    habitProductId: string
    productId: string
    used: boolean
    actualDosage: string | null
  }>
}

function HabitChecksSection({ date, checks }: { date: string; checks: HabitCheck[] }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <section className="journal-section">
      <div className="journal-section__header">
        <h2 className="journal-section__heading">Habitudes</h2>
        <button
          type="button"
          className="journal-section__add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={14} />
          Logger
        </button>
      </div>

      {showForm && <LogHabitCheckForm date={date} onDone={() => setShowForm(false)} />}

      {checks.length === 0 && !showForm && (
        <div className="journal-empty">
          <span className="journal-empty__icon">📋</span>
          <p className="journal-empty__text">Aucune habitude logguee pour cette date.</p>
        </div>
      )}

      {checks.length > 0 && (
        <div className="journal-section__list">
          {checks.map((check) => (
            <HabitCheckCard key={check.id} check={check} />
          ))}
        </div>
      )}
    </section>
  )
}

// ── Log Habit Check Form ──

function LogHabitCheckForm({ date, onDone }: { date: string; onDone: () => void }) {
  const { data: habits } = useQuery(habitQueries.list())
  const logCheck = useLogHabitCheck()

  const [selectedHabitId, setSelectedHabitId] = useState('')
  const [status, setStatus] = useState<'done' | 'skipped'>('done')
  const [actualTime, setActualTime] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedHabitId) return

    logCheck.mutate(
      {
        habitId: selectedHabitId,
        scheduledDate: date,
        status,
        ...(actualTime && { actualTime }),
      },
      { onSuccess: onDone }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="log-habit-form">
      <div className="log-habit-form__field">
        <select
          value={selectedHabitId}
          onChange={(e) => setSelectedHabitId(e.target.value)}
          className="log-habit-form__select"
          required
        >
          <option value="">Choisir une habitude…</option>
          {habits?.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>
      </div>

      <div className="log-habit-form__row">
        <div className="log-habit-form__status-btns">
          <button
            type="button"
            onClick={() => setStatus('done')}
            className={`log-habit-form__status-btn ${status === 'done' ? 'log-habit-form__status-btn--active' : ''}`}
          >
            ✓ Fait
          </button>
          <button
            type="button"
            onClick={() => setStatus('skipped')}
            className={`log-habit-form__status-btn log-habit-form__status-btn--skip ${status === 'skipped' ? 'log-habit-form__status-btn--active' : ''}`}
          >
            — Skippe
          </button>
        </div>

        <input
          type="time"
          value={actualTime}
          onChange={(e) => setActualTime(e.target.value)}
          className="log-habit-form__time"
          placeholder="Heure"
        />
      </div>

      <div className="log-habit-form__actions">
        <button type="button" onClick={onDone} className="log-habit-form__cancel">
          Annuler
        </button>
        <button
          type="submit"
          disabled={!selectedHabitId || logCheck.isPending}
          className="log-habit-form__submit"
        >
          {logCheck.isPending ? 'Envoi…' : 'Logger'}
        </button>
      </div>
    </form>
  )
}

// ── Habit Check Card ──

function HabitCheckCard({ check }: { check: HabitCheck }) {
  const [expanded, setExpanded] = useState(false)
  const hasProducts = check.products.length > 0

  return (
    <div className="habit-check-card">
      <button
        type="button"
        className="habit-check-card__main"
        onClick={() => hasProducts && setExpanded(!expanded)}
        disabled={!hasProducts}
      >
        <span className={`habit-check-card__status habit-check-card__status--${check.status}`}>
          {check.status === 'done' ? '✓' : check.status === 'skipped' ? '—' : '·'}
        </span>
        <span className="habit-check-card__id">{check.habitId.slice(0, 8)}…</span>
        {check.actualTime && <span className="habit-check-card__time">{check.actualTime}</span>}
        {hasProducts && (
          <span className="habit-check-card__expand-icon">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
      </button>

      {expanded && hasProducts && <ProductCheckList products={check.products} />}
    </div>
  )
}

// ── Product Check List ──

interface ProductCheck {
  id: string
  habitProductId: string
  productId: string
  used: boolean
  actualDosage: string | null
}

function ProductCheckList({ products }: { products: ProductCheck[] }) {
  return (
    <div className="product-check-list">
      {products.map((p) => (
        <div key={p.id} className="product-check-item">
          <span
            className={`product-check-item__badge ${p.used ? 'product-check-item__badge--used' : 'product-check-item__badge--skipped'}`}
          >
            {p.used ? '✓' : '✕'}
          </span>
          <span className="product-check-item__id">{p.productId.slice(0, 8)}…</span>
          {p.actualDosage && <span className="product-check-item__dosage">{p.actualDosage}</span>}
        </div>
      ))}
    </div>
  )
}

// ── Wellbeing Section ──

interface WellbeingLog {
  id: string
  metric: string
  value: string
  unit: string | null
  note: string | null
}
// @ts-expect-error
function WellbeingSection({ _date, logs }: { date: string; logs: WellbeingLog[] }) {
  const logWellbeing = useLogWellbeing()
  const [activeNote, setActiveNote] = useState<WellbeingMetric | null>(null)
  const [noteText, setNoteText] = useState('')
  // Track pending scores so we can send score + note together
  const [pendingScores, setPendingScores] = useState<Map<WellbeingMetric, number>>(new Map())

  // Build a map of existing logs by metric (last one wins)
  const logsByMetric = new Map(logs.map((l) => [l.metric, l]))

  function handleScoreClick(metric: WellbeingMetric, score: number) {
    // Store the score locally — only send when note is not being edited
    if (activeNote === metric) {
      setPendingScores((prev) => new Map(prev).set(metric, score))
      return
    }

    logWellbeing.mutate({
      metric,
      value: score,
      unit: '/5',
      loggedAt: new Date().toISOString(),
    })
  }

  function handleNoteSubmit(metric: WellbeingMetric) {
    const pendingScore = pendingScores.get(metric)
    const existingLog = logsByMetric.get(metric)
    const value = pendingScore ?? (existingLog ? Number(existingLog.value) : 3)

    // Send score + note in a single call
    logWellbeing.mutate({
      metric,
      value,
      unit: '/5',
      ...(noteText.trim() && { note: noteText.trim() }),
      loggedAt: new Date().toISOString(),
    })

    setNoteText('')
    setActiveNote(null)
    setPendingScores((prev) => {
      const next = new Map(prev)
      next.delete(metric)
      return next
    })
  }

  return (
    <section className="journal-section">
      <h2 className="journal-section__heading">Bien-etre</h2>
      <div className="wellbeing-grid">
        {WELLBEING_METRICS.map(({ key, label, icon }) => {
          const log = logsByMetric.get(key)
          const pendingScore = pendingScores.get(key)
          const currentValue = pendingScore ?? (log ? Math.round(Number(log.value)) : null)

          return (
            <div key={key} className="wellbeing-card">
              <div className="wellbeing-card__header">
                <span className="wellbeing-card__icon">{icon}</span>
                <span className="wellbeing-card__label">{label}</span>
              </div>

              <div className="wellbeing-card__scores">
                {SCORE_EMOJIS.map((emoji, i) => {
                  const score = i + 1
                  const isActive = currentValue === score
                  return (
                    <button
                      key={score}
                      type="button"
                      className={`wellbeing-score-btn ${isActive ? 'wellbeing-score-btn--active' : ''}`}
                      onClick={() => handleScoreClick(key, score)}
                      disabled={logWellbeing.isPending}
                    >
                      {emoji}
                    </button>
                  )
                })}
              </div>

              {log?.note && <p className="wellbeing-card__note">{log.note}</p>}

              {activeNote === key ? (
                <div className="wellbeing-card__note-input">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNoteSubmit(key)}
                    placeholder="Ajouter une note…"
                    className="wellbeing-note-field"
                    // biome-ignore lint: toto
                    autoFocus
                  />
                  <button
                    type="button"
                    className="wellbeing-note-cancel"
                    onClick={() => {
                      setActiveNote(null)
                      setNoteText('')
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="wellbeing-card__add-note"
                  onClick={() => setActiveNote(key)}
                >
                  + Note
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Loading / Error states ──

function JournalSkeleton() {
  return (
    <div className="journal-skeleton">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="journal-skeleton__item" style={{ animationDelay: `${i * 75}ms` }} />
      ))}
    </div>
  )
}

function JournalError({ message }: { message: string }) {
  return (
    <div className="journal-error">
      <p className="journal-error__message">{message}</p>
    </div>
  )
}
