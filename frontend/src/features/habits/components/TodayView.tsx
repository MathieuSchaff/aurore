import { useQuery } from '@tanstack/react-query'
import { Check, Info } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { habitQueries, useToggleCheck } from '../../../lib/queries/habits'
import { StockBadge } from './StockBadge'

interface TodayViewProps {
  onSelectHabit: (id: string) => void
}

export function TodayView({ onSelectHabit }: TodayViewProps) {
  const todayStr = new Date().toISOString().split('T')[0]
  const { data: todayData, isLoading, error } = useQuery(habitQueries.today(todayStr))
  const toggleCheck = useToggleCheck()
  const [editingProductsFor, setEditingProductsFor] = useState<string | null>(null)

  if (isLoading) return <HabitsSkeleton />
  if (error) return <ErrorState message="Impossible de charger les habitudes du jour." />
  if (!todayData?.length) return <EmptyTodayState />

  // Map backend shape to UI shape
  const habits = todayData.map((item) => {
    const checkedTimingIds = new Set(item.checks.map((c) => c.timingId))
    const usagesPerDay = Math.max(item.timings.length, 1)
    return {
      id: item.habit.id,
      name: item.habit.name,
      category: item.habit.category,
      emoji: null as string | null, // backend doesn't have emoji yet
      color: null as string | null, // backend doesn't have color yet
      isCompletedToday: item.isCompleted,
      timings: item.timings.map((t) => ({
        id: t.id,
        time: t.time,
        label: t.label,
        isChecked: checkedTimingIds.has(t.id),
      })),
      products: (item.products ?? []).map((p) => ({
        id: p.id,
        habitProductId: p.id,
        productId: p.productId,
        name: p.product.name,
        unit: p.product.unit,
        dosage: p.dosage,
        qty: p.stock?.qty ?? null,
        usagesPerDay,
      })),
    }
  })

  const pending = habits.filter((h) => !h.isCompletedToday)
  const completed = habits.filter((h) => h.isCompletedToday)
  const progress = habits.length > 0 ? (completed.length / habits.length) * 100 : 0

  function handleToggle(
    habitId: string,
    timingId?: string,
    products?: Array<{ habitProductId: string; productId: string }>
  ) {
    toggleCheck.mutate({
      habitId,
      date: todayStr,
      timingId,
      products: products?.map((p) => ({
        habitProductId: p.habitProductId,
        productId: p.productId,
        used: true,
        actualDosage: undefined,
      })),
    })
  }

  return (
    <div className="today-view">
      <div className="today-progress">
        <div className="today-progress__header">
          <div className="today-progress__info">
            <span className="today-progress__title">Progression quotidienne</span>
            <span className="today-progress__subtitle">C'est une excellente journée !</span>
          </div>
          <span className="today-progress__count">
            {completed.length}/{habits.length}
          </span>
        </div>
        <div className="today-progress__track">
          <div className="today-progress__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Habitudes en attente */}
      {pending.length > 0 && (
        <section className="today-section">
          <SectionHeader title="À faire" variant="primary" />
          <div className="today-section__list">
            {pending.map((habit) => (
              <div key={habit.id} className="habit-row-container">
                <HabitRow
                  habit={habit}
                  onToggle={handleToggle}
                  onSelect={onSelectHabit}
                  isToggling={toggleCheck.isPending}
                  isEditingProducts={editingProductsFor === habit.id}
                  onEditProducts={() => setEditingProductsFor(habit.id)}
                />
                {editingProductsFor === habit.id && (
                  <ProductCheckEditor
                    habit={habit}
                    date={todayStr}
                    onClose={() => setEditingProductsFor(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Habitudes complétées */}
      {completed.length > 0 && (
        <section className="today-section today-section--completed">
          <SectionHeader title="Terminé" variant="default" />
          <div className="today-section__list">
            {completed.map((habit) => (
              <div key={habit.id} className="habit-row-container">
                <HabitRow
                  habit={habit}
                  onToggle={handleToggle}
                  onSelect={onSelectHabit}
                  isToggling={toggleCheck.isPending}
                  isEditingProducts={editingProductsFor === habit.id}
                  onEditProducts={() => setEditingProductsFor(habit.id)}
                />
                {editingProductsFor === habit.id && (
                  <ProductCheckEditor
                    habit={habit}
                    date={todayStr}
                    onClose={() => setEditingProductsFor(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ── Habit Row ──

interface HabitRowProps {
  habit: {
    id: string
    name: string
    category: string
    emoji?: string | null
    color?: string | null
    isCompletedToday?: boolean
    timings?: Array<{ id: string; time: string; label?: string | null; isChecked?: boolean }>
    products?: Array<{
      id: string
      habitProductId: string
      productId: string
      name: string
      unit: string
      dosage: string | null
      qty: number | null
      usagesPerDay: number
    }>
  }
  onToggle: (
    habitId: string,
    timingId?: string,
    products?: Array<{ habitProductId: string; productId: string }>
  ) => void
  onSelect: (id: string) => void
  isToggling: boolean
  isEditingProducts: boolean
  onEditProducts: () => void
}

function HabitRow({
  habit,
  onToggle,
  onSelect,
  isToggling,
  isEditingProducts,
  onEditProducts,
}: HabitRowProps) {
  const hasTimings = (habit.timings?.length ?? 0) > 0
  const hasProducts = habit.products?.some((p) => p.qty !== null) ?? false
  const accentColor = habit.color ?? 'var(--color-primary)'

  return (
    <div className={`habit-row${habit.isCompletedToday ? ' is-completed' : ''}`}>
      <div className="habit-row__main">
        {!hasTimings && (
          <button
            type="button"
            disabled={isToggling}
            onClick={() => onToggle(habit.id, undefined, habit.products)}
            className="habit-row__checkbox"
            style={{
              borderColor: habit.isCompletedToday ? accentColor : 'var(--border-strong)',
              backgroundColor: habit.isCompletedToday ? accentColor : 'transparent',
            }}
          >
            <Check className="habit-row__checkbox-icon" />
          </button>
        )}
        {habit.emoji && <span className="habit-row__emoji">{habit.emoji}</span>}

        <div className="habit-row__content">
          <div className="habit-row__title-row">
            <span className="habit-row__name">{habit.name}</span>
            <span className="habit-row__category">{habit.category}</span>
          </div>

          {/* Timings summary or small pills */}
          {hasTimings && (
            <div className="habit-row__timings-pills">
              {habit.timings?.map((timing) => (
                <button
                  key={timing.id}
                  type="button"
                  disabled={isToggling}
                  onClick={() => onToggle(habit.id, timing.id, habit.products)}
                  className={`habit-timing-pill${timing.isChecked ? ' is-checked' : ''}`}
                >
                  {timing.label ?? timing.time}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelect(habit.id)}
          className="habit-row__info-btn"
          title="Voir les détails"
        >
          <Info size={18} />
        </button>
      </div>

      {/* Stock badges and edit button if needed */}
      {(hasProducts || (habit.isCompletedToday && habit.products && habit.products.length > 0)) && (
        <div className="habit-row__footer">
          {hasProducts && (
            <div className="habit-row__products">
              {habit.products
                ?.filter((p) => p.qty !== null)
                .map((p) => (
                  <StockBadge
                    key={p.id}
                    qty={p.qty ?? 0}
                    usagesPerDay={p.usagesPerDay}
                    unit={p.unit}
                  />
                ))}
            </div>
          )}
          {habit.isCompletedToday &&
            habit.products &&
            habit.products.length > 0 &&
            !isEditingProducts && (
              <button
                type="button"
                onClick={onEditProducts}
                className="habit-row__edit-products-link"
              >
                Modifier les produits
              </button>
            )}
        </div>
      )}
    </div>
  )
}

// ── Product Check Editor ──

function ProductCheckEditor({
  habit,
  date,
  onClose,
}: {
  habit: {
    id: string
    products: Array<{
      habitProductId: string
      productId: string
      name: string
      dosage: string | null
    }>
  }
  date: string
  onClose: () => void
}) {
  const toggleCheck = useToggleCheck()
  const [entries, setEntries] = useState(
    habit.products.map((p) => ({
      habitProductId: p.habitProductId,
      productId: p.productId,
      name: p.name,
      used: true,
      actualDosage: p.dosage ?? '',
    }))
  )

  function handleSave() {
    // Two-call approach: uncheck first, then re-check with updated products.
    // NOTE: This causes a brief visual flicker (habit appears unchecked then rechecked)
    // because the optimistic update toggles state twice. This is a known trade-off —
    // the backend has no upsert path, so two calls are required.
    toggleCheck.mutate(
      { habitId: habit.id, date: date },
      {
        onSuccess: () => {
          toggleCheck.mutate(
            {
              habitId: habit.id,
              date: date,
              products: entries.map((e) => ({
                habitProductId: e.habitProductId,
                productId: e.productId,
                used: e.used,
                actualDosage: e.actualDosage.trim() || undefined,
              })),
            },
            {
              onSuccess: () => {
                toast.success('Produits mis a jour')
                onClose()
              },
            }
          )
        },
      }
    )
  }

  return (
    <div className="product-check-editor">
      {entries.map((entry, i) => (
        <div key={entry.habitProductId} className="product-check-editor__row">
          <label className="product-check-editor__label">
            <input
              type="checkbox"
              checked={entry.used}
              onChange={(e) => {
                const next = [...entries]
                next[i] = { ...next[i], used: e.target.checked }
                setEntries(next)
              }}
              className="product-check-editor__checkbox"
            />
            {entry.name}
          </label>
          <input
            type="text"
            value={entry.actualDosage}
            onChange={(e) => {
              const next = [...entries]
              next[i] = { ...next[i], actualDosage: e.target.value }
              setEntries(next)
            }}
            placeholder="Dosage"
            className="habit-form__input habit-form__input--sm"
          />
        </div>
      ))}
      <div className="product-check-editor__actions">
        <button type="button" onClick={onClose} className="habit-form__cancel-btn">
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={toggleCheck.isPending}
          className="habit-form__submit-btn"
        >
          {toggleCheck.isPending ? 'Mise a jour...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}

function HabitsSkeleton() {
  return (
    <div className="habits-skeleton">
      {['ts1', 'sk2', 'sk3', 'sk4', 'sk5'].map((key, i) => (
        <div
          key={key}
          className="habits-skeleton__item"
          style={{ animationDelay: `${i * 75}ms` }}
        />
      ))}
    </div>
  )
}

function EmptyTodayState() {
  return (
    <div className="today-empty">
      <span className="today-empty__icon">🌅</span>
      <p className="today-empty__primary">Aucune habitude prevue aujourd'hui.</p>
      <p className="today-empty__secondary">Créez votre première habitude pour commencer !</p>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="today-error">
      <p className="today-error__message">{message}</p>
    </div>
  )
}
