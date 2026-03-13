export type TaskEnergy = 'low' | 'medium' | 'high'
export type TaskStatus = 'inbox' | 'active' | 'done' | 'snoozed'

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
