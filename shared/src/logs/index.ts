import { z } from 'zod'

import { HTTP_STATUS, type HttpStatus } from '../core'

// ─── SCHEMAS ─────────────────────────────────────────────────────────────────

const dateFormat = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD requis')

export const logWellbeingSchema = z.object({
  metric: z.enum(['energy', 'sleep', 'fog', 'stress', 'mood', 'skin', 'pain']),
  value: z.number().min(0).max(100),
  unit: z.string().max(20).optional(),
  note: z.string().max(1000).optional(),
  loggedAt: z.string().datetime().optional(),
})

export const logHabitCheckSchema = z.object({
  habitId: z.uuid(),
  scheduledDate: dateFormat,
  status: z.enum(['done', 'skipped']),
  timingId: z.uuid().optional(),
  actualTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format HH:MM requis')
    .optional(),
  products: z
    .array(
      z.object({
        habitProductId: z.uuid(),
        productId: z.uuid(),
        used: z.boolean(),
        actualDosage: z.string().max(200).optional(),
      })
    )
    .max(50)
    .optional(),
})

export const todayLogsQuerySchema = z.object({
  date: dateFormat,
})

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type LogWellbeingInput = z.infer<typeof logWellbeingSchema>
export type LogHabitCheckInput = z.infer<typeof logHabitCheckSchema>

export type LogsErrorCode =
  | 'habit_not_found'
  | 'check_not_found'
  | 'invalid_input'
  | 'database_error'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export const logsErrorMapping = {
  habit_not_found: HTTP_STATUS.NOT_FOUND,
  check_not_found: HTTP_STATUS.NOT_FOUND,
  invalid_input: HTTP_STATUS.BAD_REQUEST,
  database_error: HTTP_STATUS.INTERNAL_SERVER_ERROR,
} as const satisfies Record<LogsErrorCode, HttpStatus>
