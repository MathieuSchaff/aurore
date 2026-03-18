import type { HabitErrorCode } from '@habit-tracker/shared'

export class HabitError extends Error {
  constructor(
    public code: HabitErrorCode,
    public details?: unknown
  ) {
    super(code)
    this.name = 'HabitError'
  }
}
