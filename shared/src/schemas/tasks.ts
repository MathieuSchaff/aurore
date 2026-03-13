import { z } from 'zod'

const dateFormat = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format YYYY-MM-DD requis')

export const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  energy: z.enum(['low', 'medium', 'high']).optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  energy: z.enum(['low', 'medium', 'high']).nullable().optional(),
  status: z.enum(['inbox', 'active', 'done', 'snoozed']).optional(),
  snoozedUntil: dateFormat.nullable().optional(),
  focusDurationMinutes: z.number().int().min(0).optional(),
})

export const createSubtaskSchema = z.object({
  title: z.string().min(1).max(500),
})

export const updateSubtaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  completed: z.boolean().optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>
export type UpdateSubtaskInput = z.infer<typeof updateSubtaskSchema>
