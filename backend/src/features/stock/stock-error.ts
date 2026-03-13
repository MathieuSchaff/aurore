import type { StockErrorCode } from '@habit-tracker/shared'

export class StockError extends Error {
  constructor(
    public code: StockErrorCode,
    public details?: unknown
  ) {
    super(code)
    this.name = 'StockError'
  }
}
