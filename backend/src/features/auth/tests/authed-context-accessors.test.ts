import { describe, expect, it } from 'bun:test'

import type { Context } from 'hono'

import type { AppEnv } from '../../../app-env'
import { getAuthedUserId, getAuthedUserRole, getRlsDb } from '../../../utils/accessors'

// Pure test: stub only the .get the accessors read; no DB, no app.
function ctx(vars: Partial<AppEnv['Variables']>): Context<AppEnv> {
  return { get: (key: keyof AppEnv['Variables']) => vars[key] } as unknown as Context<AppEnv>
}

describe('authed context accessors', () => {
  it('getAuthedUserId returns the id when requireJwtAuth set it', () => {
    expect(getAuthedUserId(ctx({ userId: 'u1' }))).toBe('u1')
  })

  it('getAuthedUserId throws when userId is absent (guard did not run)', () => {
    expect(() => getAuthedUserId(ctx({}))).toThrow('requireJwtAuth')
  })

  it('getAuthedUserRole returns the role when requireJwtAuth set it', () => {
    expect(getAuthedUserRole(ctx({ userRole: 'admin' }))).toBe('admin')
  })

  it('getAuthedUserRole throws when userRole is absent (guard did not run)', () => {
    expect(() => getAuthedUserRole(ctx({}))).toThrow('requireJwtAuth')
  })

  it('getRlsDb throws when withRlsContext did not expose a transaction', () => {
    expect(() => getRlsDb(ctx({}))).toThrow('withRlsContext')
  })

  it('getRlsDb returns the transaction exposed by withRlsContext', () => {
    const transaction = {} as NonNullable<AppEnv['Variables']['requestDb']>
    expect(getRlsDb(ctx({ requestDb: transaction }))).toBe(transaction)
  })
})
