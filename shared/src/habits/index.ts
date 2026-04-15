import { z } from 'zod'

import { HTTP_STATUS, type HttpStatus } from '../core'

// ─── SCHEMAS ─────────────────────────────────────────────────────────────────

// ─── Primitives réutilisables ────────────────────────────────────────────────

const uuid = z.uuid()

// HH:MM in 24h
const timeFormat = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format HH:MM requis (ex: 08:30)')

// YYYY-MM-DD
const dateFormat = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD requis')

const dayOfWeek = z.number().int().min(0).max(6) // 0=lun, 6=dim
// no calendar validation (e.g. Feb 31 is accepted)
const dayOfMonth = z.number().int().min(1).max(31)

const month = z.number().int().min(1).max(12)

const habitCheckStatus = z.enum(['pending', 'done', 'skipped'])

// ─── Fréquence ───────────────────────────────────────────────────────────────

/* No frequency configured = daily by default. */
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

/* `day` meaning depends on frequency: weekly → 0-6, monthly → 1-31, daily → omitted. */
export const timingSchema = z.object({
  day: z.number().int().min(0).max(31).optional(),
  time: timeFormat,
  label: z.string().max(50).optional(),
})

// ─── Reminder ────────────────────────────────────────────────────────────────

export const reminderSchema = z.object({
  beforeMinutes: z.number().int().min(1).max(10080, 'Maximum 1 semaine (10080 min)'),
})

export const reminderWithTimingSchema = z.object({
  timingId: z.uuid(),
  beforeMinutes: z.number().int().min(1).max(10080, 'Maximum 1 semaine (10080 min)'),
})

export const REMINDER_PRESETS = {
  '5min': 5,
  '15min': 15,
  '30min': 30,
  '1h': 60,
  '2h': 120,
  '1day': 1440,
} as const

// ─── Period ──────────────────────────────────────────────────────────────────

/* activeMonths restricts to certain months (e.g. running Apr–Oct → [4,5,6,7,8,9,10]). */
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

export const habitProductSchema = z.object({
  productId: uuid,
  dosage: z.string().max(100).optional(),
  order: z.number().int().min(0).default(0),
})

// ─── Habit CRUD ──────────────────────────────────────────────────────────────

/* Sub-resources (frequency, timings…) are optional here — they have their own endpoints. */
export const createHabitSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(100, 'Nom trop long (max 100 caractères)'),
  category: z.string().min(1, 'Catégorie requise').max(50, 'Catégorie trop longue'),
  frequency: frequencySchema.optional(),
  timings: z.array(timingSchema).max(10, 'Maximum 10 horaires').optional(),
  reminders: z.array(reminderSchema).max(5, 'Maximum 5 rappels').optional(),
  period: periodSchema.optional(),
  products: z.array(habitProductSchema).max(20, 'Maximum 20 produits').optional(),
})

/* Only name/category/position here — frequency, timings etc. have dedicated endpoints. */
export const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(50).optional(),
  position: z.number().int().min(0).optional(),
})

// ─── Checks ──────────────────────────────────────────────────────────────────

/* timingId is required when the habit has timings. date defaults to today. */
export const checkHabitSchema = z.object({
  timingId: uuid.optional(),
  actualTime: timeFormat.optional(),
  date: dateFormat.optional(),
  status: habitCheckStatus.default('done'),
})

export const uncheckHabitSchema = z.object({
  checkId: uuid,
})

export const uncheckByDateSchema = z.object({
  date: dateFormat,
})

/* Prefer toggle over separate check/uncheck to avoid race conditions in the UI. */
export const toggleCheckSchema = z.object({
  timingId: uuid.optional(),
  actualTime: timeFormat.optional(),
  date: dateFormat.optional(),
  products: z
    .array(
      z.object({
        habitProductId: z.uuid(),
        productId: z.uuid(),
        used: z.boolean(),
        actualDosage: z.string().max(100).optional(),
      })
    )
    .max(50)
    .optional(),
})

// ─── Query params ────────────────────────────────────────────────────────────

export const dateRangeQuerySchema = z.object({
  startDate: dateFormat,
  endDate: dateFormat,
})

export const getUserChecksQuerySchema = z.object({
  date: dateFormat.optional(),
})

// ─── Mises à jour des sous-entités ───────────────────────────────────────────

export const updateFrequencySchema = frequencySchema

export const setTimingsSchema = z.array(timingSchema).max(10)

export const setRemindersSchema = z.array(reminderWithTimingSchema).max(20)

export const setPeriodSchema = periodSchema

export const setProductsSchema = z.array(habitProductSchema).max(20)

export const reorderHabitsSchema = z.object({
  habits: z
    .array(
      z.object({
        id: z.uuid(),
        position: z.number().int().min(0),
      })
    )
    .min(1)
    .max(100),
})

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
  daysOfWeek: z.array(z.number().int()).nullable(),
  daysOfMonth: z.array(z.number().int()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const habitReminderResponseSchema = z.object({
  id: uuid,
  timingId: uuid,
  beforeMinutes: z.number().int(),
  createdAt: z.date(),
})

export const habitTimingResponseSchema = z.object({
  id: uuid,
  habitId: uuid,
  day: z.number().int().nullable(),
  time: z.string(),
  label: z.string().nullable(),
  reminders: z.array(habitReminderResponseSchema),
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

export const todayUserProductSchema = z.object({
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
  products: z.array(todayUserProductSchema),
  isCompleted: z.boolean(),
})

export const habitStatsResponseSchema = z.object({
  totalChecks: z.number().int(),
  currentStreak: z.number().int(),
  completionRate: z.number(),
})

export const habitCheckProductResponseSchema = z.object({
  id: uuid,
  checkId: uuid,
  habitProductId: uuid,
  productId: uuid,
  used: z.boolean(),
  actualDosage: z.string().nullable(),
  createdAt: z.date(),
})

export const checkProductHistoryResponseSchema = z.object({
  id: uuid,
  checkId: uuid,
  scheduledDate: z.string(),
  habitProductId: uuid,
  productId: uuid,
  productName: z.string(),
  productBrand: z.string().nullable(),
  used: z.boolean(),
  actualDosage: z.string().nullable(),
  createdAt: z.date(),
})

export const toggleCheckResultResponseSchema = z.object({
  checked: z.boolean(),
  check: habitCheckResponseSchema.optional(),
  depletedProducts: z.array(z.string()).optional(),
  checkProducts: z.array(habitCheckProductResponseSchema).optional(),
})

// ─── TYPES ───────────────────────────────────────────────────────────────────

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
export type ReorderHabitsInput = z.infer<typeof reorderHabitsSchema>
export type SetRemindersWithTimingInput = z.infer<typeof setRemindersSchema>

// ─── Enums ────────────────────────────────────────────────────────────────────

export type HabitCheckStatus = 'pending' | 'done' | 'skipped'

// ─── Entity Types ─────────────────────────────────────────────────────────────
// Defined here (not imported from backend) to keep shared independent of the ORM.

export type Habit = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  userId: string
  category: string
  position: number
  archivedAt: Date | null
}

export type HabitProduct = {
  id: string
  habitId: string
  productId: string
  // e.g. "2 gouttes", "1 noisette"
  dosage: string | null
  order: number
  createdAt: Date
}

export type HabitFrequency = {
  habitId: string
  type: string
  intervalDays: number | null
  daysOfWeek: number[] | null
  daysOfMonth: number[] | null
  createdAt: Date
  updatedAt: Date
}

export type HabitTiming = {
  id: string
  habitId: string
  // weekly → 0-6, monthly → 1-31, daily → null
  day: number | null
  time: string
  label: string | null
  createdAt: Date
}

export type HabitReminder = {
  id: string
  timingId: string
  beforeMinutes: number
  createdAt: Date
}

export type HabitTimingWithReminders = HabitTiming & {
  reminders: HabitReminder[]
}

export type HabitPeriod = {
  habitId: string
  startDate: string
  endDate: string
  activeMonths: number[] | null
  createdAt: Date
  updatedAt: Date
}

export type HabitCheck = {
  id: string
  userId: string
  habitId: string
  scheduledDate: string
  timingId: string | null
  actualTime: string | null
  completedAt: Date | null
  status: HabitCheckStatus
  createdAt: Date
}

export type HabitCheckProduct = {
  id: string
  checkId: string
  habitProductId: string
  productId: string
  used: boolean
  actualDosage: string | null
  createdAt: Date
}

// ─── Composed Types ───────────────────────────────────────────────────────────

/* null frequency = daily by default. null period = always active. */
export type HabitWithRelations = Habit & {
  frequency: HabitFrequency | null
  timings: HabitTimingWithReminders[]
  reminders: HabitReminder[] // flat list of all reminders (kept for backward compat)
  period: HabitPeriod | null
  products: HabitProduct[]
}

/* isCompleted is true only when ALL timings are checked (computed server-side). */
export type TodayUserProduct = {
  id: string
  productId: string
  dosage: string | null
  order: number
  product: { name: string; brand: string; unit: string }
  stock: { qty: number } | null
}

export type TodayHabit = {
  habit: Habit
  timings: HabitTiming[]
  checks: HabitCheck[]
  products: TodayUserProduct[]
  isCompleted: boolean
}

export type ToggleCheckResult = {
  checked: boolean
  check?: HabitCheck
  depletedProducts?: string[]
  checkProducts?: HabitCheckProduct[]
}

/* completionRate is 0–1 (e.g. 0.85 = 85%). currentStreak counts consecutive days until today. */
export type HabitStats = {
  totalChecks: number
  currentStreak: number
  completionRate: number
}

/* Don't add CommonErrorCode here — common errors are handled at the handler level. */
export type HabitErrorCode =
  | 'habit_not_found'
  | 'habit_creation_failed'
  | 'habit_update_failed'
  | 'habit_delete_failed'
  | 'frequency_update_failed'
  | 'timing_not_found'
  | 'timing_creation_failed'
  | 'timing_delete_failed'
  | 'reminder_not_found'
  | 'reminder_creation_failed'
  | 'reminder_delete_failed'
  | 'period_update_failed'
  | 'period_delete_failed'
  | 'check_creation_failed'
  | 'check_not_found'
  | 'check_delete_failed'
  | 'product_association_failed'
  | 'product_not_found'
  | 'unauthorized_access'
  | 'invalid_date_range'
  | 'product_set_failed'
  | 'reorder_failed'
  | 'check_products_query_failed'
  | 'database_error'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export const habitErrorMapping = {
  habit_not_found: HTTP_STATUS.NOT_FOUND,
  habit_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  habit_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  habit_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  frequency_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  timing_not_found: HTTP_STATUS.NOT_FOUND,
  timing_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  timing_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  reminder_not_found: HTTP_STATUS.NOT_FOUND,
  reminder_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  reminder_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  period_update_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  period_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  check_creation_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  check_not_found: HTTP_STATUS.NOT_FOUND,
  check_delete_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  product_association_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  product_not_found: HTTP_STATUS.NOT_FOUND,
  unauthorized_access: HTTP_STATUS.FORBIDDEN,
  invalid_date_range: HTTP_STATUS.BAD_REQUEST,
  product_set_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  reorder_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  check_products_query_failed: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<HabitErrorCode, HttpStatus>
