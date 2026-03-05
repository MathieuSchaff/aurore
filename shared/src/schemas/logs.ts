import { z } from 'zod'

const uuid = z.uuid()
const dateFormat = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD requis')

// ─── Wellbeing ──────────────────────────────────────────

export const wellbeingMetrics = [
  'energy',
  'sleep',
  'fog',
  'stress',
  'mood',
  'skin',
  'pain',
] as const

export const wellbeingMetricSchema = z.enum(wellbeingMetrics)

export const logWellbeingSchema = z.object({
  metric: wellbeingMetricSchema,
  value: z.number().min(0).max(100),
  unit: z.string().max(20).optional(),
  note: z.string().max(1000).optional(),
  loggedAt: z.string().datetime().optional(),
})

export const wellbeingLogResponseSchema = z.object({
  id: uuid,
  userId: uuid,
  metric: wellbeingMetricSchema,
  value: z.string(), // numeric(5,2) comes back as string from PG
  unit: z.string().nullable(),
  note: z.string().nullable(),
  loggedAt: z.date(),
  createdAt: z.date(),
})

// ─── Habit Check Products ───────────────────────────────

export const habitCheckProductInputSchema = z.object({
  habitProductId: uuid,
  productId: uuid,
  used: z.boolean(),
  actualDosage: z.string().max(200).optional(),
})

export const logHabitCheckSchema = z.object({
  habitId: uuid,
  scheduledDate: dateFormat,
  status: z.enum(['done', 'skipped']),
  timingId: uuid.optional(),
  actualTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format HH:MM requis')
    .optional(),
  products: z.array(habitCheckProductInputSchema).max(50).optional(),
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

export const habitCheckWithProductsResponseSchema = z.object({
  id: uuid,
  userId: uuid,
  habitId: uuid,
  scheduledDate: z.string(),
  timingId: uuid.nullable(),
  status: z.enum(['pending', 'done', 'skipped']),
  actualTime: z.string().nullable(),
  completedAt: z.date().nullable(),
  createdAt: z.date(),
  products: z.array(habitCheckProductResponseSchema),
})

// ─── Today Logs ─────────────────────────────────────────

export const todayLogsQuerySchema = z.object({
  date: dateFormat,
})

export const todayLogsResponseSchema = z.object({
  date: z.string(),
  habitChecks: z.array(habitCheckWithProductsResponseSchema),
  wellbeingLogs: z.array(wellbeingLogResponseSchema),
})

// ─── Types ──────────────────────────────────────────────

export type LogWellbeingInput = z.infer<typeof logWellbeingSchema>
export type LogHabitCheckInput = z.infer<typeof logHabitCheckSchema>
export type WellbeingLogResponse = z.infer<typeof wellbeingLogResponseSchema>
export type HabitCheckProductResponse = z.infer<typeof habitCheckProductResponseSchema>
export type HabitCheckWithProductsResponse = z.infer<typeof habitCheckWithProductsResponseSchema>
export type TodayLogsResponse = z.infer<typeof todayLogsResponseSchema>
