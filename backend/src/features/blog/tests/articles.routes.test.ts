import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import type { CreateArticleInput } from '@aurore/shared'
import { HTTP_STATUS } from '@aurore/shared'

import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth, expectRoleMatrix } from '../../../tests/helpers/authz-matrix'
import {
  createTestEnv,
  type TestApp,
  type TestClient,
  withAuth,
} from '../../../tests/helpers/createTestClient'
import { expectError, expectOk } from '../../../tests/helpers/expectStatus'
import {
  authDelete,
  authPatch,
  loginAndGetToken,
  setupAndLogin,
} from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import {
  createTestAdminUser,
  createTestArticle,
  type TestUser,
} from '../../../tests/helpers/test-factories'

const VALID_ARTICLE = {
  title: 'Guide complet : acné',
  category: 'skincare',
  content: '## Introduction\n\nContenu de test.',
  excerpt: "Un guide sur l'acné.",
  publishedAt: new Date('2026-01-01').toISOString(),
} satisfies CreateArticleInput

setupDbTests()

describe('Article Routes', () => {
  let app: TestApp
  let client: TestClient
  let admin: TestUser
  let adminToken: string

  beforeAll(async () => {
    ;({ app, client } = await createTestEnv())
  })

  // Not setupAndLoginAdmin: the article factory needs the author row, not just a token.
  beforeEach(async () => {
    admin = await createTestAdminUser(
      TEST_CREDENTIALS.admin.rawEmail,
      TEST_CREDENTIALS.admin.rawPassword
    )
    adminToken = await loginAndGetToken(
      app,
      TEST_CREDENTIALS.admin.rawEmail,
      TEST_CREDENTIALS.admin.rawPassword
    )
  })

  // Support rows only. The tests whose subject is POST /articles call the route
  // directly, so the create guards stay covered.
  function seedArticle(overrides: Partial<CreateArticleInput> = {}) {
    return createTestArticle(admin.id, { ...VALID_ARTICLE, ...overrides })
  }

  function seedDraft(overrides: Partial<CreateArticleInput> = {}) {
    return seedArticle({ ...overrides, publishedAt: null })
  }

  describe('GET /articles', () => {
    it('returns an empty list when no article exists', async () => {
      const data = await expectOk(client.articles.$get({ query: {} }))
      expect(data.items).toEqual([])
      expect(data.total).toBe(0)
    })

    it('filters by category', async () => {
      await seedArticle({ title: 'Peau et soleil', slug: 'peau-et-soleil' })
      await seedArticle({ title: 'Sommeil réparateur', slug: 'sommeil', category: 'lifestyle' })

      const data = await expectOk(client.articles.$get({ query: { category: 'lifestyle' } }))
      expect(data.total).toBe(1)
      expect(data.items.map((i) => i.slug)).toEqual(['sommeil'])
    })

    it('excludes drafts for anonymous readers', async () => {
      await seedArticle({ title: 'Article publié', slug: 'article-publie' })
      await seedDraft({ title: 'Brouillon', slug: 'brouillon' })

      const data = await expectOk(client.articles.$get({ query: {} }))
      expect(data.total).toBe(1)
      expect(data.items.map((i) => i.slug)).toEqual(['article-publie'])
    })

    it('lists drafts for an admin who opts out of publishedOnly', async () => {
      await seedArticle({ title: 'Article publié', slug: 'article-publie' })
      await seedDraft({ title: 'Brouillon', slug: 'brouillon' })

      const data = await expectOk(
        client.articles.$get({ query: { publishedOnly: 'false' } }, withAuth(adminToken))
      )
      expect(data.total).toBe(2)
    })

    it('keeps drafts hidden from a plain user asking for publishedOnly=false', async () => {
      await seedDraft({ title: 'Brouillon', slug: 'brouillon' })
      const userToken = await setupAndLogin(app, TEST_CREDENTIALS.toto)

      const data = await expectOk(
        client.articles.$get({ query: { publishedOnly: 'false' } }, withAuth(userToken))
      )
      expect(data.total).toBe(0)
    })
  })

  describe('GET /articles/:slug', () => {
    it('returns article_not_found for an unknown slug', async () => {
      await expectError(
        app.request('/api/articles/slug-inconnu'),
        HTTP_STATUS.NOT_FOUND,
        'article_not_found'
      )
    })

    it('hides a draft from anonymous readers but serves it to an admin', async () => {
      await seedDraft({ title: 'Brouillon privé', slug: 'brouillon-prive' })

      await expectError(
        app.request('/api/articles/brouillon-prive'),
        HTTP_STATUS.NOT_FOUND,
        'article_not_found'
      )

      const data = await expectOk(
        client.articles[':slug'].$get({ param: { slug: 'brouillon-prive' } }, withAuth(adminToken))
      )
      expect(data.publishedAt).toBeNull()
    })
  })

  describe('GET /articles/categories', () => {
    it('returns zero for every category when no article exists', async () => {
      const data = await expectOk(client.articles.categories.$get())
      expect(data.skincare).toBe(0)
      expect(data.lifestyle).toBe(0)
      expect(data.routines).toBe(0)
    })

    it('counts published articles only', async () => {
      await seedArticle({ title: 'Acné 1', slug: 'acne-1' })
      await seedArticle({ title: 'Acné 2', slug: 'acne-2' })
      await seedArticle({ title: 'Sommeil', slug: 'sommeil', category: 'lifestyle' })
      await seedDraft({ title: 'Acné brouillon', slug: 'acne-brouillon' })

      const data = await expectOk(client.articles.categories.$get())
      expect(data.skincare).toBe(2)
      expect(data.lifestyle).toBe(1)
    })
  })

  describe('POST /articles', () => {
    expectRequiresAuth(() => app, {
      method: 'POST',
      path: '/api/articles',
      body: VALID_ARTICLE,
    })

    expectRoleMatrix(
      () => app,
      { method: 'POST', path: '/api/articles', body: VALID_ARTICLE },
      {
        user: HTTP_STATUS.FORBIDDEN,
        contributor: HTTP_STATUS.FORBIDDEN,
        admin: HTTP_STATUS.CREATED,
      }
    )

    it('derives the slug from the title', async () => {
      const article = await expectOk(
        client.articles.$post({ json: VALID_ARTICLE }, withAuth(adminToken)),
        HTTP_STATUS.CREATED
      )
      expect(article.slug).toBe('guide-complet-acne')
      expect(article.category).toBe('skincare')
    })

    it('rejects an unknown category', async () => {
      const res = await app.request('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ ...VALID_ARTICLE, category: 'astrologie' }),
      })
      const body = await expectError<{ fieldErrors: Record<string, string[]> }>(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'invalid_input'
      )
      expect(body.details?.fieldErrors.category).toBeDefined()
    })

    it('rejects a slug already taken', async () => {
      await seedArticle({ slug: 'guide-acne' })
      await expectError(
        client.articles.$post(
          { json: { ...VALID_ARTICLE, title: 'Autre titre', slug: 'guide-acne' } },
          withAuth(adminToken)
        ),
        HTTP_STATUS.CONFLICT,
        'slug_already_exists'
      )
    })
  })

  describe('PATCH /articles/:slug', () => {
    expectRequiresAuth(() => app, {
      method: 'PATCH',
      path: '/api/articles/slug-inconnu',
      body: { title: 'Nouveau titre' },
    })

    expectRoleMatrix(
      () => app,
      async () => {
        const article = await seedArticle()
        return {
          method: 'PATCH' as const,
          path: `/api/articles/${article.slug}`,
          body: { title: 'Titre revu' },
        }
      },
      {
        user: HTTP_STATUS.FORBIDDEN,
        contributor: HTTP_STATUS.FORBIDDEN,
        admin: HTTP_STATUS.OK,
      }
    )

    it('returns article_not_found for an unknown slug', async () => {
      await expectError(
        authPatch(app, '/api/articles/slug-inconnu', adminToken, { title: 'X' }),
        HTTP_STATUS.NOT_FOUND,
        'article_not_found'
      )
    })

    it('applies the update to the stored article', async () => {
      const draft = await seedDraft({ title: 'Brouillon admin', slug: 'brouillon-admin' })

      const patched = await authPatch(app, `/api/articles/${draft.slug}`, adminToken, {
        title: 'Brouillon mis à jour',
      })
      expect(patched.status).toBe(HTTP_STATUS.OK)

      const stored = await expectOk(
        client.articles[':slug'].$get({ param: { slug: draft.slug } }, withAuth(adminToken))
      )
      expect(stored.title).toBe('Brouillon mis à jour')
    })
  })

  describe('DELETE /articles/:slug', () => {
    expectRequiresAuth(() => app, {
      method: 'DELETE',
      path: '/api/articles/slug-inconnu',
    })

    expectRoleMatrix(
      () => app,
      async () => {
        const article = await seedArticle()
        return { method: 'DELETE' as const, path: `/api/articles/${article.slug}` }
      },
      {
        user: HTTP_STATUS.FORBIDDEN,
        contributor: HTTP_STATUS.FORBIDDEN,
        admin: HTTP_STATUS.NO_CONTENT,
      }
    )

    it('returns article_not_found for an unknown slug', async () => {
      await expectError(
        authDelete(app, '/api/articles/slug-inconnu', adminToken),
        HTTP_STATUS.NOT_FOUND,
        'article_not_found'
      )
    })

    it('removes the article from admin reads too', async () => {
      const draft = await seedDraft({ title: 'À supprimer', slug: 'a-supprimer' })

      const deleted = await authDelete(app, `/api/articles/${draft.slug}`, adminToken)
      expect(deleted.status).toBe(HTTP_STATUS.NO_CONTENT)

      await expectError(
        app.request(`/api/articles/${draft.slug}`, withAuth(adminToken)),
        HTTP_STATUS.NOT_FOUND,
        'article_not_found'
      )
    })
  })
})
