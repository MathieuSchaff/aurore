import type { CreateHabitInput, HabitProductInput, Reminder, Timing } from '@habit-tracker/shared'
import { REMINDER_PRESETS } from '@habit-tracker/shared'

// import { _useQuery } from '@tanstack/react-query'
import { Bell, Clock, Package, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useCreateHabit, useUpdateHabit } from '../../lib/queries/habits'
import { useProducts } from '../../lib/queries/products'

interface HabitFormDialogProps {
  habit?: {
    id: string
    name: string
    category?: string | null
    frequency?: { type: string; daysOfWeek?: number[]; intervalDays?: number } | null
  }
  onClose: () => void
  onCreated?: () => void
}

const CATEGORIES = [
  'Skincare',
  'Sport',
  'Meditation',
  'Complements',
  'Sommeil',
  'Nutrition',
  'Lecture',
  'Hydratation',
]

const DAYS = [
  { value: 0, label: 'L' },
  { value: 1, label: 'M' },
  { value: 2, label: 'M' },
  { value: 3, label: 'J' },
  { value: 4, label: 'V' },
  { value: 5, label: 'S' },
  { value: 6, label: 'D' },
]

type FreqType = 'daily' | 'weekly' | 'every_n_days'

// ── Timing entry ──
interface TimingEntry {
  key: number
  time: string
  label: string
}

// ── Product entry ──
interface ProductEntry {
  key: number
  productId: string
  dosage: string
  order: number
}

// ── Reminder entry ──
interface ReminderEntry {
  key: number
  beforeMinutes: number
}

let nextKey = 0
function genKey() {
  return nextKey++
}

export function HabitFormDialog({ habit, onClose, onCreated }: HabitFormDialogProps) {
  const isEditing = !!habit
  const createHabit = useCreateHabit()
  const updateHabit = useUpdateHabit()

  // Basic fields
  const [name, setName] = useState(habit?.name ?? '')
  const [category, setCategory] = useState(habit?.category ?? '')
  const [customCategory, setCustomCategory] = useState('')
  const [showCustomCategory, setShowCustomCategory] = useState(false)

  // Frequency
  const [freqType, setFreqType] = useState<FreqType>(
    (habit?.frequency?.type as FreqType) ?? 'daily'
  )
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    habit?.frequency?.daysOfWeek ?? [1, 2, 3, 4, 5]
  )
  const [intervalDays, setIntervalDays] = useState(habit?.frequency?.intervalDays ?? 2)

  // Timings
  const [timings, setTimings] = useState<TimingEntry[]>([])

  // Products
  const [productEntries, setProductEntries] = useState<ProductEntry[]>([])
  const { data: productsList } = useProducts({ limit: 200 })

  // Reminders
  const [reminderEntries, setReminderEntries] = useState<ReminderEntry[]>([])

  // Expanded sections
  const [showTimings, setShowTimings] = useState(false)
  const [showProducts, setShowProducts] = useState(false)
  const [showReminders, setShowReminders] = useState(false)

  const isPending = createHabit.isPending || updateHabit.isPending
  const effectiveCategory = showCustomCategory ? customCategory : category

  function toggleDay(day: number) {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    )
  }

  function buildFrequency() {
    switch (freqType) {
      case 'daily':
        return { type: 'daily' as const }
      case 'weekly':
        return { type: 'weekly' as const, daysOfWeek }
      case 'every_n_days':
        return { type: 'every_n_days' as const, intervalDays }
    }
  }

  // ── Timing helpers ──
  function addTiming() {
    setTimings((prev) => [...prev, { key: genKey(), time: '08:00', label: '' }])
    setShowTimings(true)
  }

  function removeTiming(key: number) {
    setTimings((prev) => prev.filter((t) => t.key !== key))
  }

  function updateTiming(key: number, field: 'time' | 'label', value: string) {
    setTimings((prev) => prev.map((t) => (t.key === key ? { ...t, [field]: value } : t)))
  }

  // ── Product helpers ──
  function addProduct() {
    setProductEntries((prev) => [
      ...prev,
      { key: genKey(), productId: '', dosage: '', order: prev.length },
    ])
    setShowProducts(true)
  }

  function removeProduct(key: number) {
    setProductEntries((prev) => prev.filter((p) => p.key !== key))
  }

  function updateProduct(key: number, field: 'productId' | 'dosage', value: string) {
    setProductEntries((prev) => prev.map((p) => (p.key === key ? { ...p, [field]: value } : p)))
  }

  // ── Reminder helpers ──
  function addReminder() {
    setReminderEntries((prev) => [...prev, { key: genKey(), beforeMinutes: 15 }])
    setShowReminders(true)
  }

  function removeReminder(key: number) {
    setReminderEntries((prev) => prev.filter((r) => r.key !== key))
  }

  function updateReminder(key: number, value: number) {
    setReminderEntries((prev) =>
      prev.map((r) => (r.key === key ? { ...r, beforeMinutes: value } : r))
    )
  }

  // ── Category helpers ──
  function handleSelectCategory(cat: string) {
    setCategory(cat)
    setShowCustomCategory(false)
    setCustomCategory('')
  }

  function handleShowCustom() {
    setShowCustomCategory(true)
    setCategory('')
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim() || !effectiveCategory.trim()) return

    const frequency = buildFrequency()

    if (isEditing) {
      updateHabit.mutate(
        {
          id: habit.id,
          name: name.trim(),
          category: effectiveCategory.trim(),
        },
        {
          onSuccess: () => {
            toast.success('Habitude modifiee')
            onClose()
          },
        }
      )
    } else {
      // Build timings
      const validTimings: Timing[] = timings
        .filter((t) => t.time.match(/^([01]\d|2[0-3]):[0-5]\d$/))
        .map((t) => ({
          time: t.time,
          ...(t.label.trim() && { label: t.label.trim() }),
        }))

      // Build products
      const validProducts: HabitProductInput[] = productEntries
        .filter((p) => p.productId)
        .map((p, i) => ({
          productId: p.productId,
          ...(p.dosage.trim() && { dosage: p.dosage.trim() }),
          order: i,
        }))

      // Build reminders
      const validReminders: Reminder[] = reminderEntries.map((r) => ({
        beforeMinutes: r.beforeMinutes,
      }))

      const payload: CreateHabitInput = {
        name: name.trim(),
        category: effectiveCategory.trim(),
        frequency,
        timings: validTimings.length > 0 ? validTimings : undefined,
        products: validProducts.length > 0 ? validProducts : undefined,
        reminders: validReminders.length > 0 ? validReminders : undefined,
      }

      createHabit.mutate(payload, {
        onSuccess: () => {
          toast.success('Habitude creee !')
          onCreated?.()
          onClose()
        },
      })
    }
  }

  return (
    <div className="habit-form-wrapper">
      <div className="habit-form-overlay" onClick={onClose} />

      <div className="habit-form-dialog">
        <div className="habit-form-dialog__header">
          <h2 className="habit-form-dialog__title">
            {isEditing ? "Modifier l'habitude" : 'Nouvelle habitude'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="habit-form-dialog__close-btn"
            aria-label="Fermer"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="habit-form">
          {/* Nom */}
          <div className="habit-form__field">
            <label htmlFor="habit-name" className="habit-form__label">
              Nom *
            </label>
            <input
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Meditation, Lecture, Sport..."
              required
              className="habit-form__input"
            />
          </div>

          {/* Categorie */}
          <div className="habit-form__field">
            <span className="habit-form__label">Categorie *</span>
            <div className="habit-form__category-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`category-btn ${category === cat && !showCustomCategory ? 'category-btn--selected' : ''}`}
                >
                  {cat}
                </button>
              ))}
              <button
                type="button"
                onClick={handleShowCustom}
                className={`category-btn category-btn--custom ${showCustomCategory ? 'category-btn--selected' : ''}`}
              >
                + Autre
              </button>
            </div>
            {showCustomCategory && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Ma categorie..."
                className="habit-form__input"
                autoFocus
              />
            )}
          </div>

          {/* Frequence (creation uniquement) */}
          {!isEditing && (
            <div className="habit-form__field">
              <span className="habit-form__label">Frequence</span>
              <div className="habit-form__freq">
                <div className="freq-tabs">
                  {(
                    [
                      { value: 'daily', label: 'Quotidien' },
                      { value: 'weekly', label: 'Jours precis' },
                      { value: 'every_n_days', label: 'Tous les X jours' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFreqType(opt.value)}
                      className={`freq-tab-btn ${freqType === opt.value ? 'freq-tab-btn--active' : ''}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {freqType === 'weekly' && (
                  <div className="freq-days">
                    {DAYS.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`freq-day-btn ${daysOfWeek.includes(day.value) ? 'freq-day-btn--active' : ''}`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                )}

                {freqType === 'every_n_days' && (
                  <div className="freq-slider-row">
                    <input
                      type="range"
                      min={1}
                      max={14}
                      value={intervalDays}
                      onChange={(e) => setIntervalDays(Number(e.target.value))}
                      className="freq-slider"
                    />
                    <span className="freq-slider-value">tous les {intervalDays}j</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TIMINGS SECTION ── */}
          {!isEditing && (
            <div className="habit-form__field">
              <button
                type="button"
                onClick={() => {
                  if (!showTimings && timings.length === 0) addTiming()
                  else setShowTimings(!showTimings)
                }}
                className="habit-form__section-toggle"
              >
                <Clock size={16} />
                <span>Horaires</span>
                {timings.length > 0 && (
                  <span className="habit-form__section-count">{timings.length}</span>
                )}
              </button>

              {showTimings && (
                <div className="habit-form__section-content">
                  {timings.map((timing) => (
                    <div key={timing.key} className="habit-form__timing-row">
                      <input
                        type="time"
                        value={timing.time}
                        onChange={(e) => updateTiming(timing.key, 'time', e.target.value)}
                        className="habit-form__time-input"
                        required
                      />
                      <input
                        type="text"
                        value={timing.label}
                        onChange={(e) => updateTiming(timing.key, 'label', e.target.value)}
                        placeholder="Label (ex: Matin)"
                        className="habit-form__input habit-form__input--sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeTiming(timing.key)}
                        className="habit-form__remove-btn"
                        aria-label="Supprimer horaire"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addTiming} className="habit-form__add-btn">
                    <Plus size={14} />
                    Ajouter un horaire
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── PRODUCTS SECTION ── */}
          {!isEditing && (
            <div className="habit-form__field">
              <button
                type="button"
                onClick={() => {
                  if (!showProducts && productEntries.length === 0) addProduct()
                  else setShowProducts(!showProducts)
                }}
                className="habit-form__section-toggle"
              >
                <Package size={16} />
                <span>Produits</span>
                {productEntries.length > 0 && (
                  <span className="habit-form__section-count">{productEntries.length}</span>
                )}
              </button>

              {showProducts && (
                <div className="habit-form__section-content">
                  {productEntries.map((entry) => (
                    <div key={entry.key} className="habit-form__product-row">
                      <select
                        value={entry.productId}
                        onChange={(e) => updateProduct(entry.key, 'productId', e.target.value)}
                        className="habit-form__select"
                        required
                      >
                        <option value="">Choisir un produit...</option>
                        {productsList?.items?.map(
                          (p: { id: string; name: string; brand: string | null }) => (
                            <option key={p.id} value={p.id}>
                              {p.brand ? `${p.brand} - ${p.name}` : p.name}
                            </option>
                          )
                        )}
                      </select>
                      <input
                        type="text"
                        value={entry.dosage}
                        onChange={(e) => updateProduct(entry.key, 'dosage', e.target.value)}
                        placeholder="Dosage (ex: 2 gouttes)"
                        className="habit-form__input habit-form__input--sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeProduct(entry.key)}
                        className="habit-form__remove-btn"
                        aria-label="Supprimer produit"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addProduct} className="habit-form__add-btn">
                    <Plus size={14} />
                    Ajouter un produit
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── REMINDERS SECTION ── */}
          {!isEditing && (
            <div className="habit-form__field">
              <button
                type="button"
                onClick={() => {
                  if (!showReminders && reminderEntries.length === 0) addReminder()
                  else setShowReminders(!showReminders)
                }}
                className="habit-form__section-toggle"
              >
                <Bell size={16} />
                <span>Rappels</span>
                {reminderEntries.length > 0 && (
                  <span className="habit-form__section-count">{reminderEntries.length}</span>
                )}
              </button>

              {showReminders && (
                <div className="habit-form__section-content">
                  {reminderEntries.map((entry) => (
                    <div key={entry.key} className="habit-form__reminder-row">
                      <select
                        value={entry.beforeMinutes}
                        onChange={(e) => updateReminder(entry.key, Number(e.target.value))}
                        className="habit-form__select"
                      >
                        {Object.entries(REMINDER_PRESETS).map(([label, mins]) => (
                          <option key={label} value={mins}>
                            {label
                              .replace('min', ' min')
                              .replace('h', ' heure(s)')
                              .replace('day', ' jour')}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeReminder(entry.key)}
                        className="habit-form__remove-btn"
                        aria-label="Supprimer rappel"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {reminderEntries.length < 5 && (
                    <button type="button" onClick={addReminder} className="habit-form__add-btn">
                      <Plus size={14} />
                      Ajouter un rappel
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="habit-form__actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="habit-form__cancel-btn"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim() || !effectiveCategory.trim()}
              className="habit-form__submit-btn"
            >
              {isPending ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Creer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
