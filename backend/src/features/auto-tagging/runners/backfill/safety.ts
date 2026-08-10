export function assertSafeBackfillExecution(input: {
  nodeEnv: string | undefined
  isolatedRunner: boolean
}): void {
  if (input.nodeEnv === 'production' && !input.isolatedRunner) {
    throw new Error('production backfill requires the isolated runner')
  }
}
