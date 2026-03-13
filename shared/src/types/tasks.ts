export type TaskEnergy = 'low' | 'medium' | 'high'
export type TaskStatus = 'inbox' | 'active' | 'done' | 'snoozed'

// ─── Entity Types ─────────────────────────────────────────────────────────────
// Types standalone mirroring the Drizzle schema.
// Defined here (not imported from backend) to keep shared independent of ORM.

export interface Task {
  id: string
  userId: string
  title: string
  energy: TaskEnergy | null
  status: TaskStatus
  snoozedUntil: string | null   // date string YYYY-MM-DD
  doneAt: string | null          // ISO timestamp string
  focusDurationMinutes: number | null
  createdAt: string              // ISO timestamp string
  updatedAt: string              // ISO timestamp string
}

export interface Subtask {
  id: string
  taskId: string
  title: string
  completed: boolean
  order: number
  createdAt: string
}

// ─── Error Codes ──────────────────────────────────────────────────────────────

export type TaskErrorCode =
  | 'task_not_found'
  | 'task_creation_failed'
  | 'task_update_failed'
  | 'task_delete_failed'
  | 'subtask_not_found'
  | 'subtask_creation_failed'
  | 'subtask_update_failed'
  | 'subtask_delete_failed'
  | 'unauthorized_access'
