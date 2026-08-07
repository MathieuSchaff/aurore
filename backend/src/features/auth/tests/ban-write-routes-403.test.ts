import { afterEach, beforeAll, beforeEach, describe, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { userBans } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import {
  createTestClient,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError } from '../../../tests/helpers/expectStatus'
import { JWT_SECRET, REFRESH_SECRET } from '../../../tests/helpers/secrets'
import { globalErrorHandler } from '../../../utils/errors/error-handler'
import { ingredientTagRoutes } from '../../ingredients/ingredient-tags/routes'
import { productIngredientRoutes } from '../../products/product-ingredients/routes'
import { productTagRoutes } from '../../products/product-tags/routes'
import { clearBanCache } from '../ban.service'
import { seedBanActors } from './ban-test.setup'

const ANY_UUID = '019d0000-0000-7000-8000-00000000abcd'

async function expectBanned(res: { status: number; json: () => Promise<unknown> }) {
  // The guard regression returned 500 ("Context is not finalized") instead of
  // letting requireNotBanned's 403 propagate through the Hono compose.
  await expectError(res, HTTP_STATUS.FORBIDDEN, 'banned')
}

// Mount a single router on a bare app with the same context the prod app sets.
// The link routers share a prefix with productRoutes/ingredientRoutes in the real
// app, whose guards run first and would mask a broken guard here, so we isolate
// each link router to prove its own route-owned guard returns 403, not a sibling's.
function isolate(mount: (app: Hono<AppEnv>) => void) {
  const app = new Hono<AppEnv>()
  app.onError(globalErrorHandler)
  app.use('*', async (c, next) => {
    c.set('anonDb', testDb)
    c.set('env', 'development')
    c.set('jwtSecret', JWT_SECRET)
    c.set('refreshSecret', REFRESH_SECRET)
    c.set('frontendUrl', 'http://localhost:5173')
    await next()
  })
  mount(app)
  return app
}

function bannedRequest(app: Hono<AppEnv>, path: string, method: string, token: string) {
  return app.request(path, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: '{}',
  })
}

setupDbTests()

describe('Globally-banned user gets 403 (not 500) on non-GET catalog routes', () => {
  let client: TestClient
  let token: string

  beforeAll(async () => {
    client = await createTestClient()
  })

  beforeEach(async () => {
    clearBanCache()
    const actors = await seedBanActors(client)
    token = actors.token
    await testDb
      .insert(userBans)
      .values({ userId: actors.userId, scope: 'global', bannedBy: actors.adminId, reason: 'spam' })
  })

  afterEach(() => {
    clearBanCache()
  })

  // Routers mounted alone at their prefix: the full app exercises their own guard.
  it('POST /articles (blog)', async () => {
    const res = await client.articles.$post({ json: {} as never }, withAuth(token))
    await expectBanned(res)
  })

  it('POST /product-tags (tag defs)', async () => {
    const res = await client['product-tags'].$post({ json: {} as never }, withAuth(token))
    await expectBanned(res)
  })

  it('POST /ingredient-tags (tag defs)', async () => {
    const res = await client['ingredient-tags'].$post({ json: {} as never }, withAuth(token))
    await expectBanned(res)
  })

  // Link routers share a prefix with productRoutes/ingredientRoutes in the real
  // app; mounting them in isolation proves their own guard fires, not the sibling's.
  it('PUT /:productId/tags isolated (product-tag links)', async () => {
    const app = isolate((a) => a.route('/', productTagRoutes))
    await expectBanned(await bannedRequest(app, `/${ANY_UUID}/tags`, 'PUT', token))
  })

  it('POST /:productId/ingredients isolated (product-ingredient links)', async () => {
    const app = isolate((a) => a.route('/', productIngredientRoutes))
    await expectBanned(await bannedRequest(app, `/${ANY_UUID}/ingredients`, 'POST', token))
  })

  it('POST /:ingredientId/tags isolated (ingredient-tag links)', async () => {
    const app = isolate((a) => a.route('/', ingredientTagRoutes))
    await expectBanned(await bannedRequest(app, `/${ANY_UUID}/tags`, 'POST', token))
  })
})
