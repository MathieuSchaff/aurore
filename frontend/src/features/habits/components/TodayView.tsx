import { useQuery } from '@tanstack/react-query'
import { Check, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

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
        <div className="today-progress__label">
          <span className="today-progress__title">Progression</span>
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
          <h2 className="today-section__heading">A faire</h2>
          <div className="today-section__list">
            {pending.map((habit) => (
              <>
                <HabitRow
                  key={habit.id}
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
              </>
            ))}
          </div>
        </section>
      )}

      {/* Habitudes complétées */}
      {completed.length > 0 && (
        <section className="today-section today-section--completed">
          <h2 className="today-section__heading">Termine</h2>
          <div className="today-section__list">
            {completed.map((habit) => (
              <>
                <HabitRow
                  key={habit.id}
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
              </>
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
  const accentColor = habit.color ?? '#f59e0b'

  return (
    <div className="habit-row">
      <div className="habit-row__main">
        {!hasTimings && (
          <button
            type="button"
            disabled={isToggling}
            onClick={() => onToggle(habit.id, undefined, habit.products)}
            className="habit-row__checkbox"
            style={{
              borderColor: habit.isCompletedToday ? accentColor : 'rgb(63 63 70)',
              backgroundColor: habit.isCompletedToday ? accentColor : 'transparent',
            }}
          >
            <Check className="habit-row__checkbox-icon" />
          </button>
        )}
        {habit.emoji && <span className="habit-row__emoji">{habit.emoji}</span>}
        <button type="button" onClick={() => onSelect(habit.id)} className="habit-row__name-btn">
          <span>{habit.name}</span>
          <span className="habit-row__category">{habit.category}</span>
        </button>

        <ChevronRight className="habit-row__detail-icon" />
      </div>

      {/* Sous-timings (matin, soir, etc.) */}
      {hasTimings && (
        <div className="habit-row__timings">
          <div className="habit-row__timings-list">
            {habit.timings?.map((timing) => (
              <button
                key={timing.id}
                type="button"
                disabled={isToggling}
                onClick={() => onToggle(habit.id, timing.id, habit.products)}
                className="habit-timing-btn"
                style={{
                  backgroundColor: timing.isChecked ? `${accentColor}20` : 'rgb(39 39 42 / 0.5)',
                  color: timing.isChecked ? accentColor : 'rgb(161 161 170)',
                }}
              >
                <span
                  className="habit-timing--btn__dot"
                  style={{
                    backgroundColor: timing.isChecked ? accentColor : 'rgb(82 82 91)',
                  }}
                />
                {timing.label ?? timing.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock badges */}
      {hasProducts && (
        <div className="habit-row__products">
          {habit.products
            ?.filter((p) => p.qty !== null)
            .map((p) => (
              <StockBadge key={p.id} qty={p.qty ?? 0} usagesPerDay={p.usagesPerDay} unit={p.unit} />
            ))}
        </div>
      )}

      {habit.isCompletedToday &&
        habit.products &&
        habit.products.length > 0 &&
        !isEditingProducts && (
          <button type="button" onClick={onEditProducts} className="habit-row__edit-products-btn">
            Modifier les produits
          </button>
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
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="habits-skeleton__item" style={{ animationDelay: `${i * 75}ms` }} />
      ))}
    </div>
  )
}

function EmptyTodayState() {
  return (
    <div className="today-empty">
      <span className="today-empty__icon">🌅</span>
      <p className="today-empty__primary">Aucune habitude prevue aujourd'hui.</p>
      <p className="today-empty__secondary">Cree ta premiere habitude pour commencer !</p>
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
