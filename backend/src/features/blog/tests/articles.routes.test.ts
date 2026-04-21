import { beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@habit-tracker/shared'

import type { Hono } from 'hono'

import type { AppEnv } from '../../../app-env'
import { createTestApp } from '../../../tests/helpers/createTestApp'

describe('Article Routes — GET', () => {
  let app: Hono<AppEnv>

  beforeEach(async () => {
    app = await createTestApp()
  })

  describe('GET /articles', () => {
    it('returns 200 with empty list when no articles exist', async () => {
      const res = await app.request('/articles')
      expect(res.status).toBe(HTTP_STATUS.OK)
      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.data.items).toBeArray()
      expect(json.data.total).toBe(0)
    })

    it('filters by category', async () => {
      const res = await app.request('/articles?category=skincare')
      expect(res.status).toBe(HTTP_STATUS.OK)
      const json = await res.json()
      expect(json.success).toBe(true)
    })

    it('returns only published articles by default', async () => {
      const res = await app.request('/articles')
      expect(res.status).toBe(HTTP_STATUS.OK)
      const json = await res.json()
      for (const item of json.data.items) {
        expect(item.publishedAt).not.toBeNull()
      }
    })
  })

  describe('GET /articles/:slug', () => {
    it('returns 404 for unknown slug', async () => {
      const res = await app.request('/articles/unknown-slug')
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND)
    })
  })
})
