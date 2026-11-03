import { describe, expect, it } from 'bun:test'

import { sql } from 'drizzle-orm'
import { date, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

import { db } from '../../db'
import { toApiPurchase } from '../../features/user-products/purchase.service'
import { normalizeInstant } from '../../utils/dates'

const fixture = pgTable('timestamp_transport_probe', {
  id: uuid('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
  purchasedAt: date('purchased_at', { mode: 'string' }).notNull(),
})

if (process.env.TIMESTAMP_TRANSPORT_CHILD === '1') {
  describe('Bun/Drizzle timestamp transport', () => {
    it.each(['UTC', 'Europe/Paris'])(
      'preserves instants with PostgreSQL in %s',
      async (serverZone) => {
        await db.transaction(async (tx) => {
          const context = await tx.execute(sql`SELECT current_database() AS name`)
          expect(context[0].name).toBe('appdb_test')
          await tx.execute(sql`SELECT set_config('TimeZone', ${serverZone}, true)`)
          await tx.execute(sql`
          CREATE TEMP TABLE timestamp_transport_probe (
            id uuid PRIMARY KEY,
            created_at timestamptz NOT NULL,
            purchased_at date NOT NULL
          ) ON COMMIT DROP
        `)
          for (const [exact, expected] of [
            ['2026-11-03T00:08:07.032563Z', '2026-11-03T00:08:07.032Z'],
            ['2026-07-03T00:08:07.032563Z', '2026-07-03T00:08:07.032Z'],
          ]) {
            const [inserted] = await tx
              .insert(fixture)
              .values({
                id: '00000000-0000-4000-8000-000000000001',
                createdAt: exact,
                purchasedAt: '2026-11-03',
              })
              .returning()
            const [selected] = await tx.select().from(fixture)
            const [native] = await tx
              .select({
                instant: sql<string>`to_char(${fixture.createdAt} AT TIME ZONE 'UTC',
              'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`.mapWith(fixture.createdAt),
              })
              .from(fixture)
            expect(native.instant).toBe(exact)
            const [updated] = await tx.update(fixture).set({ createdAt: exact }).returning()
            const [deleted] = await tx.delete(fixture).returning()
            for (const row of [inserted, selected, updated, deleted]) {
              // ISO validation alone accepted the old value shifted by the host timezone
              expect(normalizeInstant(row.createdAt)).toBe(expected)
              expect(row.purchasedAt).toBe('2026-11-03')
              const api = toApiPurchase({
                ...row,
                userProductId: '00000000-0000-4000-8000-000000000002',
                pricePaidCents: null,
                openedAt: null,
                finishedAt: null,
                expiresAt: null,
              })
              expect(api.createdAt).toBe(expected)
            }
            expect(fixture.createdAt.mapFromDriverValue(exact)).toBe(exact)
          }
        })
      }
    )
  })
} else {
  describe('timestamp transport across process timezones', () => {
    it.each(['UTC', 'Europe/Paris', 'Asia/Kolkata'])(
      'preserves instants under TZ=%s',
      async (timezone) => {
        const target = new URL(process.env.APP_DATABASE_URL ?? '')
        expect(target.pathname).toBe('/appdb_test')
        expect(target.port).toBe('5433')
        expect(['localhost', '127.0.0.1', '[::1]']).toContain(target.hostname)
        const child = Bun.spawn([process.execPath, 'test', import.meta.path], {
          cwd: new URL('../../../', import.meta.url).pathname,
          env: { ...process.env, TZ: timezone, TIMESTAMP_TRANSPORT_CHILD: '1' },
          stdout: 'pipe',
          stderr: 'pipe',
        })
        const [exitCode, stdout, stderr] = await Promise.all([
          child.exited,
          new Response(child.stdout).text(),
          new Response(child.stderr).text(),
        ])
        expect({ exitCode, stdout, stderr }).toEqual({
          exitCode: 0,
          stdout: expect.any(String),
          stderr: expect.any(String),
        })
      }
    )
  })
}
