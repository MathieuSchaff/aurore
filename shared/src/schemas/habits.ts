import { z } from 'zod'

// ─── Primitives réutilisables ────────────────────────────────────────────────

const uuid = z.uuid()

/**
 * Format `HH:MM` en 24h.
 * @example '08:30', '23:59'
 */
const timeFormat = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format HH:MM requis (ex: 08:30)')

/**
 * Format `YYYY-MM-DD` (ISO 8601 date-only).
 * @example '2025-01-15'
 */
const dateFormat = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD requis')

// const dayOfWeek = z.enum([
//   'monday',
//   'tuesday',
//   'wednesday',
//   'thursday',
//   'friday',
//   'saturday',
//   'sunday',
// ])

const dayOfWeek = z.number().int().min(0).max(6) // 0=lun, 6=dim
/** Jour du mois — 1 à 31. Pas de validation calendaire (ex: 31 février accepté). */
const dayOfMonth = z.number().int().min(1).max(31)

const month = z.number().int().min(1).max(12)

const habitCheckStatus = z.enum(['pending', 'done', 'skipped'])

// ─── Fréquence ───────────────────────────────────────────────────────────────

/**
 * Fréquence d'exécution d'une habitude — discriminatedUnion sur `type`.
 *
 * @remarks
 * Zod sélectionne le schéma à valider selon la valeur de `type`.
 * Une habitude sans fréquence configurée est traitée comme `daily` par défaut.
 *
 * @example
 * { type: 'daily' }
 * { type: 'weekly', daysOfWeek: ['monday', 'wednesday', 'friday'] }
 * { type: 'monthly', daysOfMonth: [1, 15] }
 * { type: 'interval', intervalDays: 3 }
 */

export const frequencySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('daily') }),
  z.object({
    type: z.literal('weekly'),
    daysOfWeek: z.array(dayOfWeek).min(1, 'Au moins un jour requis'),
  }),
  z.object({
    type: z.literal('monthly'),
    daysOfMonth: z.array(dayOfMonth).min(1, 'Au moins un jour requis'),
  }),
  z.object({
    type: z.literal('every_n_days'),
    intervalDays: z.number().int().min(1, 'Intervalle minimum: 1 jour'),
  }),
])
// ─── Timing ──────────────────────────────────────────────────────────────────

/**
 * Horaire associé à une habitude.
 *
 * @remarks
 * `day` est contextuel selon la fréquence :
 * - weekly → 0-6 (lun-dim)
 * - monthly → 1-31
 * - daily/every_n_days → omis (juste l'heure)
 *
 * @example
 * { time: '08:00', label: 'Matin' }
 * { time: '21:30', day: 2, label: 'Mercredi soir' }
 */
export const timingSchema = z.object({
  day: z.number().int().min(0).max(31).optional(),
  time: timeFormat,
  label: z.string().max(50).optional(),
})

// ─── Reminder ────────────────────────────────────────────────────────────────

/**
 * Rappel avant l'heure prévue d'une habitude.
 *
 * @remarks
 * `beforeMinutes` exprime le délai en minutes avant le timing associé.
 * Utiliser `REMINDER_PRESETS` pour les valeurs courantes.
 * Max 5 reminders par habitude (voir `createHabitSchema`).
 */
export const reminderSchema = z.object({
  beforeMinutes: z.number().int().min(1).max(10080, 'Maximum 1 semaine (10080 min)'),
})

/**
 * Valeurs prédéfinies pour `beforeMinutes`.
 * @example
 * { beforeMinutes: REMINDER_PRESETS['30min'] } // → 30
 */
export const REMINDER_PRESETS = {
  '5min': 5,
  '15min': 15,
  '30min': 30,
  '1h': 60,
  '2h': 120,
  '1day': 1440,
} as const

// ─── Period ──────────────────────────────────────────────────────────────────

/**
 * Période d'activité d'une habitude.
 *
 * @remarks
 * `startDate` et `endDate` sont requis.
 * Contrainte cross-field : `endDate` doit être >= `startDate`.
 * `activeMonths` permet de restreindre une habitude à certains mois de l'année
 * (ex: running uniquement d'avril à octobre → `[4, 5, 6, 7, 8, 9, 10]`).
 */
export const periodSchema = z
  .object({
    startDate: dateFormat,
    endDate: dateFormat,
    activeMonths: z.array(month).optional(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'La date de fin doit être après la date de début',
  })

// ─── Habit Product ───────────────────────────────────────────────────────────

/**
 * Association habitude ↔ produit (many-to-many).
 *
 * @example
 * { productId: '...', dosage: '2 gouttes', order: 0 }
 */
export const habitProductSchema = z.object({
  productId: uuid,
  dosage: z.string().max(100).optional(),
  order: z.number().int().min(0).default(0),
})

// ─── Habit CRUD ──────────────────────────────────────────────────────────────

/**
 * Payload pour POST /habits — création d'une habitude.
 *
 * @remarks
 * `frequency`, `timings`, `reminders`, `period` et `products` sont tous optionnels à la création.
 * Ils peuvent être configurés séparément via leurs endpoints dédiés.
 */
export const createHabitSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100, 'Nom trop long (max 100 caractères)'),
  category: z.string().min(1, 'Catégorie requise').max(50, 'Catégorie trop longue'),
  frequency: frequencySchema.optional(),
  timings: z.array(timingSchema).max(10, 'Maximum 10 horaires').optional(),
  reminders: z.array(reminderSchema).max(5, 'Maximum 5 rappels').optional(),
  period: periodSchema.optional(),
  products: z.array(habitProductSchema).max(20, 'Maximum 20 produits').optional(),
})

/**
 * Payload pour PATCH /habits/:id — mise à jour partielle.
 *
 * @remarks
 * Seuls `name`, `category` et `position` sont modifiables ici.
 * Pour modifier la fréquence, les timings, les reminders, la période ou les produits,
 * utiliser leurs endpoints dédiés.
 */
export const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(50).optional(),
  position: z.number().int().min(0).optional(),
})

// ─── Checks ──────────────────────────────────────────────────────────────────

/**
 * Payload pour POST /habits/:id/check — cocher une habitude.
 *
 * @remarks
 * `timingId` est requis si l'habitude a des timings configurés.
 * `actualTime` permet d'enregistrer l'heure réelle d'exécution.
 * `date` est optionnel — défaut = aujourd'hui côté backend.
 * `status` défaut = 'done'.
 */
export const checkHabitSchema = z.object({
  timingId: uuid.optional(),
  actualTime: timeFormat.optional(),
  date: dateFormat.optional(),
  status: habitCheckStatus.default('done'),
})

/** Payload pour DELETE /habits/check/:id — décocher via l'id du check. */
export const uncheckHabitSchema = z.object({
  checkId: uuid,
})

/** Payload pour DELETE /habits/:id/check — décocher tous les checks d'une date donnée. */
export const uncheckByDateSchema = z.object({
  date: dateFormat,
})

/**
 * Payload pour POST /habits/:id/toggle — coche si absent, décoche si présent.
 *
 * @remarks
 * Préférer ce endpoint au couple check/uncheck pour les interactions UI
 * afin d'éviter les race conditions.
 */
export const toggleCheckSchema = z.object({
  timingId: uuid.optional(),
  actualTime: timeFormat.optional(),
  date: dateFormat.optional(),
})

// ─── Query params ────────────────────────────────────────────────────────────

/** Query params `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` communs aux routes checks et stats. */
export const dateRangeQuerySchema = z.object({
  startDate: dateFormat,
  endDate: dateFormat,
})

/** Query params pour GET /habits/today?date=... */
export const getUserChecksQuerySchema = z.object({
  date: dateFormat.optional(),
})

// ─── Mises à jour des sous-entités ───────────────────────────────────────────

/** Payload pour PUT /habits/:id/frequency — remplace la fréquence existante. */
export const updateFrequencySchema = frequencySchema

/** Payload pour PUT /habits/:id/timings — remplace tous les timings existants. */
export const setTimingsSchema = z.array(timingSchema).max(10)

/** Payload pour PUT /habits/:id/reminders — remplace tous les reminders existants. */
export const setRemindersSchema = z.array(reminderSchema).max(5)

/** Payload pour PUT /habits/:id/period — remplace la période existante. */
export const setPeriodSchema = periodSchema

/** Payload pour PUT /habits/:id/products — remplace tous les produits associés. */
export const setProductsSchema = z.array(habitProductSchema).max(20)

// ─── Types inférés ───────────────────────────────────────────────────────────

export type Frequency = z.infer<typeof frequencySchema>
export type Timing = z.infer<typeof timingSchema>
export type Reminder = z.infer<typeof reminderSchema>
export type Period = z.infer<typeof periodSchema>
export type HabitProductInput = z.infer<typeof habitProductSchema>

export type CreateHabitInput = z.infer<typeof createHabitSchema>
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>
export type CheckHabitInput = z.infer<typeof checkHabitSchema>
export type ToggleCheckInput = z.infer<typeof toggleCheckSchema>

export type GetUserChecksQuery = z.infer<typeof getUserChecksQuerySchema>
export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>

export type UpdateFrequencyInput = z.infer<typeof updateFrequencySchema>
export type SetTimingsInput = z.infer<typeof setTimingsSchema>
export type SetRemindersInput = z.infer<typeof setRemindersSchema>
export type SetPeriodInput = z.infer<typeof setPeriodSchema>
export type SetProductsInput = z.infer<typeof setProductsSchema>

// ─── Entity Response Schemas ─────────────────────────────────────────────────

export const habitResponseSchema = z.object({
  id: uuid,
  userId: uuid,
  name: z.string(),
  category: z.string(),
  position: z.number().int(),
  archivedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const habitProductResponseSchema = z.object({
  id: uuid,
  habitId: uuid,
  productId: uuid,
  dosage: z.string().nullable(),
  order: z.number().int(),
  createdAt: z.date(),
})

export const habitFrequencyResponseSchema = z.object({
  habitId: uuid,
  type: z.string(),
  intervalDays: z.number().int().nullable(),
  // daysOfWeek: z.array(z.string()).nullable(),
  daysOfWeek: z.array(z.number().int()).nullable(),
  daysOfMonth: z.array(z.number().int()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const habitTimingResponseSchema = z.object({
  id: uuid,
  habitId: uuid,
  day: z.number().int().nullable(),
  time: z.string(),
  label: z.string().nullable(),
  createdAt: z.date(),
})

export const habitReminderResponseSchema = z.object({
  id: uuid,
  habitId: uuid,
  beforeMinutes: z.number().int(),
  createdAt: z.date(),
})

export const habitPeriodResponseSchema = z.object({
  habitId: uuid,
  startDate: z.string(),
  endDate: z.string(),
  activeMonths: z.array(z.number().int()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const habitCheckResponseSchema = z.object({
  id: uuid,
  userId: uuid,
  habitId: uuid,
  scheduledDate: z.string(),
  timingId: uuid.nullable(),
  actualTime: z.string().nullable(),
  completedAt: z.date().nullable(),
  status: habitCheckStatus,
  createdAt: z.date(),
})

export const habitWithRelationsResponseSchema = habitResponseSchema.extend({
  frequency: habitFrequencyResponseSchema.nullable(),
  timings: z.array(habitTimingResponseSchema),
  reminders: z.array(habitReminderResponseSchema),
  period: habitPeriodResponseSchema.nullable(),
  products: z.array(habitProductResponseSchema),
})

export const todayProductStockSchema = z.object({
  id: uuid,
  productId: uuid,
  dosage: z.string().nullable(),
  order: z.number().int(),
  product: z.object({
    name: z.string(),
    brand: z.string(),
    unit: z.string(),
  }),
  stock: z
    .object({
      qty: z.number().int(),
    })
    .nullable(),
})

export const todayHabitResponseSchema = z.object({
  habit: habitResponseSchema,
  timings: z.array(habitTimingResponseSchema),
  checks: z.array(habitCheckResponseSchema),
  products: z.array(todayProductStockSchema),
  isCompleted: z.boolean(),
})

export const habitStatsResponseSchema = z.object({
  totalChecks: z.number().int(),
  currentStreak: z.number().int(),
  completionRate: z.number(),
})

export const toggleCheckResultResponseSchema = z.object({
  checked: z.boolean(),
  check: habitCheckResponseSchema.optional(),
  depletedProducts: z.array(z.string()).optional(),
})
