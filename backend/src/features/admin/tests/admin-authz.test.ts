import { beforeAll, describe } from 'bun:test'

import { expectRequiresAuth } from '../../../tests/helpers/authz-matrix'
import { createTestEnv, type TestApp } from '../../../tests/helpers/createTestClient'

// The auth guard runs before any lookup or body validation, so the ids below
// never need to exist and the mutating cases need no payload.
const GHOST = '019d0000-0000-7000-8000-00000000dead'

let app: TestApp

beforeAll(async () => {
  ;({ app } = await createTestEnv())
})

// One case per guard chain, not per route: moderation, reports, role-requests and
// suggested-edits install the prelude with a blanket use('*') over a prefix they
// own, so any one of their routes proves the whole router. security-events has the
// same shape and is already covered in security/tests/security-events-admin.routes.test.ts.
describe('admin routers — blanket prelude', () => {
  for (const path of [
    '/api/admin/moderation/catalog',
    '/api/admin/reports',
    '/api/admin/role-requests',
    '/api/admin/suggested-edits',
  ]) {
    describe(path, () => {
      expectRequiresAuth(() => app, { method: 'GET', path })
    })
  }
})

// bans.routes.ts is the exception: it shares the '/api/admin' prefix with its
// siblings, so it registers the prelude path by path over an explicit list rather
// than with use('*'). A route added without its path being appended to that list
// would be reachable unauthenticated — hence one case per protected path.
describe('admin bans router — per-path prelude', () => {
  const cases = [
    { method: 'GET', path: '/api/admin/users' },
    { method: 'GET', path: `/api/admin/users/${GHOST}/bans` },
    { method: 'PATCH', path: `/api/admin/users/${GHOST}/role` },
    { method: 'DELETE', path: `/api/admin/bans/${GHOST}` },
    { method: 'GET', path: '/api/admin/dashboard' },
  ] as const

  for (const req of cases) {
    describe(`${req.method} ${req.path}`, () => {
      expectRequiresAuth(() => app, req)
    })
  }
})
