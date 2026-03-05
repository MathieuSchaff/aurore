export type {
  CheckHabitInput,
  CreateHabitInput,
  DateRangeQuery,
  Frequency,
  GetUserChecksQuery,
  HabitProductInput,
  Period,
  Reminder,
  SetPeriodInput,
  SetProductsInput,
  SetRemindersInput,
  SetTimingsInput,
  Timing,
  ToggleCheckInput,
  UpdateFrequencyInput,
  UpdateHabitInput,
} from '../schemas/habits'

// ─── Enums ────────────────────────────────────────────────────────────────────

export type HabitCheckStatus = 'pending' | 'done' | 'skipped'

// ─── Entity Types ─────────────────────────────────────────────────────────────
// Types standalone mirrorant le schéma Drizzle.
// Définis ici (pas importés du backend) pour garder shared indépendant de l'ORM.

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
  /** Ex: "2 gouttes", "1 comprimé", "1 noisette" */
  dosage: string | null
  order: number
  createdAt: Date
}

export type HabitFrequency = {
  habitId: string
  /** "daily" | "weekly" | "monthly" | "interval" */
  type: string
  intervalDays: number | null
  daysOfWeek: number[] | null
  daysOfMonth: number[] | null
  createdAt: Date
  updatedAt: Date
}

export type HabitTiming = {
  id: string
  /** Résolu par l'API à partir du schedule — le front ne voit pas scheduleId */
  habitId: string
  /**
   * Jour concerné, sémantique selon la fréquence :
   * - weekly → 0-6 (lun-dim)
   * - monthly → 1-31
   * - daily/every_n_days → null
   */
  day: number | null
  /** Format HH:MM */
  time: string
  label: string | null
  createdAt: Date
}

export type HabitReminder = {
  id: string
  habitId: string
  beforeMinutes: number
  createdAt: Date
}

export type HabitPeriod = {
  habitId: string
  /** Format YYYY-MM-DD */
  startDate: string
  /** Format YYYY-MM-DD */
  endDate: string
  activeMonths: number[] | null
  createdAt: Date
  updatedAt: Date
}

export type HabitCheck = {
  id: string
  userId: string
  habitId: string
  /** Format YYYY-MM-DD — date pour laquelle le check compte */
  scheduledDate: string
  timingId: string | null
  /** Format HH:MM — heure réelle d'exécution */
  actualTime: string | null
  /** null si status !== 'done' */
  completedAt: Date | null
  status: HabitCheckStatus
  createdAt: Date
}

// ─── Composed Types ───────────────────────────────────────────────────────────

/**
 * Habitude avec toutes ses relations chargées.
 *
 * @remarks
 * Utilisé pour les réponses détaillées (GET /habits/:id).
 * `frequency` et `period` sont `null` si non configurés —
 * une habitude sans fréquence est considérée comme quotidienne par défaut.
 */
export type HabitWithRelations = Habit & {
  frequency: HabitFrequency | null
  timings: HabitTiming[]
  reminders: HabitReminder[]
  period: HabitPeriod | null
  products: HabitProduct[]
}

/**
 * Représentation d'une habitude pour la vue du jour (GET /habits/today).
 *
 * @remarks
 * `isCompleted` est calculé côté serveur selon la fréquence et les checks du jour.
 * Pour une habitude avec timings, `isCompleted` est `true` uniquement si
 * tous les timings ont été cochés.
 */
export type TodayProductStock = {
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
  products: TodayProductStock[]
  isCompleted: boolean
}

/**
 * Résultat du toggle check (POST /habits/:id/check).
 */
export type ToggleCheckResult = {
  checked: boolean
  check?: HabitCheck
  depletedProducts?: string[]
}

/**
 * Statistiques agrégées d'une habitude sur une période donnée.
 *
 * @remarks
 * Retourné par GET /habits/:id/stats?startDate=...&endDate=...
 * - `currentStreak` — nombre de jours consécutifs jusqu'à aujourd'hui
 * - `completionRate` — ratio entre 0 et 1 (ex: 0.85 = 85%)
 */
export type HabitStats = {
  totalChecks: number
  currentStreak: number
  completionRate: number
}

// ─── Error Codes ──────────────────────────────────────────────────────────────

/**
 * Codes d'erreur spécifiques au domaine habits.
 *
 * @remarks
 * Ne pas étendre `CommonErrorCode` ici — les codes communs
 * (`unauthorized`, `server_error`, etc.) sont gérés au niveau du handler.
 * @see {@link habitErrorMapping}
 */
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
  | 'database_error'
