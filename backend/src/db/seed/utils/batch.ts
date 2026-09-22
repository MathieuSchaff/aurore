import { DrizzleQueryError } from 'drizzle-orm'

export interface ProductTagGroups {
  primary: string[]
  secondary: string[]
  avoid: string[]
}

export interface SeedError {
  item: string
  reason: string
}

export function toNumeric(val: unknown): string | null {
  if (val == null) return null
  const str = String(val).trim()
  if (str === '' || str === 'null' || str === 'undefined') return null
  const num = Number(str)
  if (Number.isNaN(num)) return null
  return str
}

export function toText(val: unknown): string | null {
  if (val == null) return null
  const str = String(val).trim()
  return str === '' || str === 'null' || str === 'undefined' ? null : str
}

function* errorCauses(error: unknown): Generator<object> {
  const seen = new Set<object>()
  while (typeof error === 'object' && error !== null && !seen.has(error)) {
    seen.add(error)
    yield error
    error = 'cause' in error ? error.cause : undefined
  }
}

function hasDatabaseErrorCode(error: object): boolean {
  const codes = [
    'code' in error ? error.code : undefined,
    'errno' in error ? error.errno : undefined,
  ]
  return codes.some(
    (code) =>
      typeof code === 'string' &&
      (/^(?:[0-9][A-Z0-9]|F0|HV|P0|XX)[A-Z0-9]{3}$/.test(code) || code.startsWith('ERR_POSTGRES'))
  )
}

function isDatabaseError(error: unknown): boolean {
  for (const cause of errorCauses(error)) {
    if (cause instanceof DrizzleQueryError || hasDatabaseErrorCode(cause)) return true
  }
  return false
}

export async function seedBatch<T, TResult>(
  label: string,
  items: T[],
  fn: (item: T) => Promise<TResult>,
  identify: (item: T) => string,
  critical: boolean = false
): Promise<{ success: number; failed: SeedError[]; total: number }> {
  const failed: SeedError[] = []
  let successCount = 0

  // Serial, not Promise.allSettled: the seed runs every item on one shared
  // transaction connection. Concurrent items open nested tx (savepoints) on
  // that single connection and Drizzle's counter races: a RELEASE kills
  // another item's savepoint ("savepoint sN does not exist"). One connection
  // serializes at the wire anyway, so concurrency only corrupts
  for (const item of items) {
    try {
      await fn(item)
      successCount++
    } catch (err) {
      // A SQL failure can abort the caller's transaction; subsequent items cannot recover it
      if (isDatabaseError(err)) throw err
      failed.push({
        item: identify(item),
        reason: err instanceof Error ? err.message : String(err),
      })
    }
  }

  if (failed.length > 0) {
    console.error(`\n❌ ${failed.length}/${items.length} ${label} échoué(s) :`)
    failed.slice(0, 10).forEach((f, i) => {
      console.error(`  ${i + 1}. [${f.item}] → ${f.reason}`)
    })
    if (failed.length > 10) console.error(`  ... et ${failed.length - 10} autres erreurs.`)
    if (critical) throw new Error(`Seed interrompu : ${label} contient des erreurs critiques`)
  } else {
    console.log(`✅ ${successCount} ${label} créé(s)`)
  }

  return { success: successCount, failed, total: items.length }
}
