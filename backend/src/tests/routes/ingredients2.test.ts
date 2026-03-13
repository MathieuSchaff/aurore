import { beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@habit-tracker/shared'

import type { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { TEST_CREDENTIALS } from '../helpers/test-credentials'
import { createTestUser } from '../helpers/test-factories'
import { createTestApp } from './createTestApp'

// ── Helpers ──────────────────────────────────────────────────────────

async function loginAndGetToken(app: Hono<AppEnv>, email: string, password: string) {
  const res = await app.request('/auth/mobile/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!data.success) throw new Error('Login failed in helper')
  return data.data.accessToken as string
}

async function setupAndLogin(app: Hono<AppEnv>, creds: { rawEmail: string; rawPassword: string }) {
  await createTestUser(creds.rawEmail, creds.rawPassword)
  return loginAndGetToken(app, creds.rawEmail, creds.rawPassword)
}

function authPost(app: Hono<AppEnv>, path: string, token: string, body: object) {
  return app.request(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
}

function authPatch(app: Hono<AppEnv>, path: string, token: string, body: object) {
  return app.request(path, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
}

function authDelete(app: Hono<AppEnv>, path: string, token: string) {
  return app.request(path, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

const VALID_INGREDIENT = { name: 'Rétinol' }

// ── Tests ────────────────────────────────────────────────────────────

describe('Ingredient Routes', () => {
  let app: Hono<AppEnv>

  beforeEach(() => {
    app = createTestApp()
  })

  // ━━━ POST /ingredients ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('POST /ingredients', () => {
    it('should create an ingredient with only a name', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/ingredients', token, VALID_INGREDIENT)

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.id).toBeDefined()
      expect(data.data.name).toBe('Rétinol')
      expect(data.data.slug).toBe('retinol')
    })

    it('should create an ingredient with all optional fields', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/ingredients', token, {
        name: 'Acide Ascorbique',
        description: 'Forme pure de la vitamine C',
        content: '## Description\n\nActif antioxydant.',
        category: 'vitamine',
      })

      expect(res.status).toBe(HTTP_STATUS.CREATED)
      const data = await res.json()
      expect(data.data.description).toBe('Forme pure de la vitamine C')
      expect(data.data.content).toBe('## Description\n\nActif antioxydant.')
      expect(data.data.category).toBe('vitamine')
    })

    it('should auto-generate slug from name', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/ingredients', token, { name: 'Acide Hyaluronique' })
      const data = await res.json()

      expect(data.data.slug).toBe('acide-hyaluronique')
    })

    it('should use custom slug when provided', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/ingredients', token, {
        name: 'Niacinamide',
        slug: 'niacin',
      })
      const data = await res.json()

      expect(data.data.slug).toBe('niacin')
    })

    it('should return 409 for duplicate slug', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      await authPost(app, '/ingredients', token, { name: 'Magnésium', slug: 'magnesium' })
      const res = await authPost(app, '/ingredients', token, {
        name: 'Magnésium Bis',
        slug: 'magnesium',
      })

      expect(res.status).toBe(HTTP_STATUS.CONFLICT)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error).toBe('ingredient_already_exists')
    })

    it('should reject missing name', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const res = await authPost(app, '/ingredients', token, { description: 'orphan' })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const res = await app.request('/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(VALID_INGREDIENT),
      })

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })

    it('should reject request with invalid token', async () => {
      const res = await authPost(app, '/ingredients', 'invalid.token.here', VALID_INGREDIENT)

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ GET /ingredients/:slug ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('GET /ingredients/:slug', () => {
    it('should return the ingredient by slug without auth', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/ingredients', token, VALID_INGREDIENT)
      const { data: created } = await createRes.json()

      const res = await app.request(`/ingredients/${created.slug}`)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(created.id)
      expect(data.data.slug).toBe(created.slug)
      expect(data.data.name).toBe('Rétinol')
    })

    it('should also work when authenticated', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/ingredients', token, VALID_INGREDIENT)
      const { data: created } = await createRes.json()

      const res = await app.request(`/ingredients/${created.slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.data.id).toBe(created.id)
    })

    it('should return 404 for unknown slug', async () => {
      const res = await app.request('/ingredients/slug-inexistant')

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error).toBe('ingredient_not_found')
    })
  })

  // ━━━ PATCH /ingredients/:id ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('PATCH /ingredients/:id', () => {
    it('should update ingredient fields', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/ingredients', token, VALID_INGREDIENT)
      const { data: created } = await createRes.json()

      const res = await authPatch(app, `/ingredients/${created.id}`, token, {
        description: 'Alternative naturelle au rétinol',
        category: 'actif',
      })

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.description).toBe('Alternative naturelle au rétinol')
      expect(data.data.category).toBe('actif')
      expect(data.data.name).toBe('Rétinol')
    })

    it('should not affect untouched fields', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/ingredients', token, {
        ...VALID_INGREDIENT,
        content: 'Contenu initial',
      })
      const { data: created } = await createRes.json()

      await authPatch(app, `/ingredients/${created.id}`, token, { category: 'actif' })

      const res = await app.request(`/ingredients/${created.slug}`)
      const data = await res.json()
      expect(data.data.content).toBe('Contenu initial')
    })

    it('should persist updates across requests', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/ingredients', token, VALID_INGREDIENT)
      const { data: created } = await createRes.json()

      await authPatch(app, `/ingredients/${created.id}`, token, {
        description: 'Description persistée',
      })

      const res = await app.request(`/ingredients/${created.slug}`)
      const data = await res.json()
      expect(data.data.description).toBe('Description persistée')
    })

    it('should auto-update slug when name changes', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/ingredients', token, { name: 'Vitamine E' })
      const { data: created } = await createRes.json()

      const res = await authPatch(app, `/ingredients/${created.id}`, token, {
        name: 'Vitamine E Tocopherol',
      })
      const data = await res.json()
      expect(data.data.slug).toBe('vitamine-e-tocopherol')
    })

    it('should return 404 for unknown id', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const fakeId = crypto.randomUUID()

      const res = await authPatch(app, `/ingredients/${fakeId}`, token, { description: 'X' })

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
      const data = await res.json()
      expect(data.error).toBe('ingredient_not_found')
    })

    it('should reject unknown fields (strict schema)', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/ingredients', token, VALID_INGREDIENT)
      const { data: created } = await createRes.json()

      const res = await authPatch(app, `/ingredients/${created.id}`, token, {
        hackerField: 'oops',
      })

      expect(res.status).toBe(HTTP_STATUS.BAD_REQUEST)
    })

    it('should reject unauthenticated request', async () => {
      const fakeId = crypto.randomUUID()
      const res = await app.request(`/ingredients/${fakeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'X' }),
      })

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ DELETE /ingredients/:id ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('DELETE /ingredients/:id', () => {
    it('should delete the ingredient and return null data', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/ingredients', token, VALID_INGREDIENT)
      const { data: created } = await createRes.json()

      const res = await authDelete(app, `/ingredients/${created.id}`, token)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data).toBeNull()
    })

    it('should make the ingredient unreachable by slug after deletion', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/ingredients', token, VALID_INGREDIENT)
      const { data: created } = await createRes.json()

      await authDelete(app, `/ingredients/${created.id}`, token)

      const res = await app.request(`/ingredients/${created.slug}`)
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
    })

    it('should not affect other ingredients when deleting one', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const r1 = await authPost(app, '/ingredients', token, VALID_INGREDIENT)
      const r2 = await authPost(app, '/ingredients', token, { name: 'Niacinamide' })

      const { data: i1 } = await r1.json()
      const { data: i2 } = await r2.json()

      await authDelete(app, `/ingredients/${i1.id}`, token)

      const res = await app.request(`/ingredients/${i2.slug}`)
      expect(res.status).toBe(HTTP_STATUS.OK)
    })

    it('should return 500 for unknown id (ingredient_delete_failed)', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)
      const fakeId = crypto.randomUUID()

      const res = await authDelete(app, `/ingredients/${fakeId}`, token)

      expect(res.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      const data = await res.json()
      expect(data.error).toBe('ingredient_delete_failed')
    })

    it('should reject unauthenticated request', async () => {
      const fakeId = crypto.randomUUID()
      const res = await app.request(`/ingredients/${fakeId}`, { method: 'DELETE' })

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
    })
  })

  // ━━━ GET /ingredients/:slug/edits ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('GET /ingredients/:slug/edits', () => {
    it('should return an empty list for a new ingredient', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/ingredients', token, VALID_INGREDIENT)
      const { data: created } = await createRes.json()

      const res = await app.request(`/ingredients/${created.slug}/edits`)

      expect(res.status).toBe(HTTP_STATUS.OK)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
    })

    it('should return edits after an update without auth', async () => {
      const token = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const createRes = await authPost(app, '/ingredients', token, VALID_INGREDIENT)
      const { data: created } = await createRes.json()

      await authPatch(app, `/ingredients/${created.id}`, token, { description: 'New description' })

      const res = await app.request(`/ingredients/${created.slug}/edits`)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.length).toBe(1)
    })

    it('should return 404 for unknown slug', async () => {
      const res = await app.request('/ingredients/slug-qui-nexiste-pas/edits')

      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error).toBe('ingredient_not_found')
    })

    it('should reject unauthenticated request', async () => {
      const slug = 'fake-slug'
      const res = await app.request(`/ingredients/${slug}/edits`)

      expect(res.status).toBe(HTTP_STATUS.UNAUTHORIZED)
      const data = await res.json()
      expect(data.success).toBe(false)
    })
  })
})
