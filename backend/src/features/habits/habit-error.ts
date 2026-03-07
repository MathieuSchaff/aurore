import type { HabitErrorCode } from '@habit-tracker/shared'

import type { Database as DbType } from '../../db'

export type Database = DbType

export class HabitError extends Error {
  constructor(
    public code: HabitErrorCode,
    public details?: unknown
  ) {
    super(code)
    this.name = 'HabitError'
  }
}
