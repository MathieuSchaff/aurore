import { beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { HTTP_STATUS } from '@aurore/shared'

import { setupDbTests } from '../../../tests/db-setup'
import { expectRequiresAuth, expectRoleMatrix } from '../../../tests/helpers/authz-matrix'
import { createTestApp } from '../../../tests/helpers/createTestApp'
import type { TestApp } from '../../../tests/helpers/createTestClient'
import { expectError } from '../../../tests/helpers/expectStatus'
import { authPostMultipart, loginAndGetToken } from '../../../tests/helpers/route-test-helpers'
import { TEST_CREDENTIALS } from '../../../tests/helpers/test-credentials'
import {
  createTestContributorUser,
  createTestProduct,
  createTestUser,
} from '../../../tests/helpers/test-factories'
import {
  AVATAR_SIZE,
  expectUploadedUrl,
  notWebpBlob,
  PRODUCT_SIZE,
  stubBunnyFetch,
  webpBlob,
} from './uploads-test.setup'

setupDbTests()

// Upload routes use c.req.parseBody() with no zValidator on the body, so the
// typed client cannot reach them with multipart bodies. Fall back to raw
// app.request via the existing authPostMultipart helper.
describe('Upload Routes', () => {
  let app: TestApp
  let userId: string
  let userToken: string
  let contributorId: string
  let contributorToken: string
  const bunny = stubBunnyFetch()

  beforeAll(async () => {
    app = await createTestApp()
  })

  beforeEach(async () => {
    const { toto, contributor } = TEST_CREDENTIALS
    // Factories give the author ids the product fixture needs, so login is a
    // second step rather than setupAndLogin*, which returns only the token.
    userId = (await createTestUser(toto.rawEmail, toto.rawPassword)).id
    userToken = await loginAndGetToken(app, toto.rawEmail, toto.rawPassword)
    contributorId = (await createTestContributorUser(contributor.rawEmail, contributor.rawPassword))
      .id
    contributorToken = await loginAndGetToken(app, contributor.rawEmail, contributor.rawPassword)
  })

  describe('POST /api/uploads/avatar', () => {
    expectRequiresAuth(() => app, { method: 'POST', path: '/api/uploads/avatar' })

    it('stores the avatar under the user id and returns a cache-busted URL', async () => {
      const url = await expectUploadedUrl(
        authPostMultipart(app, '/api/uploads/avatar', userToken, { image: webpBlob(AVATAR_SIZE) })
      )
      expect(url).toMatch(new RegExp(`^https://.+/avatars/${userId}\\.webp\\?v=\\d+$`))
      // Key is the user id, so a new upload overwrites instead of piling files up.
      expect(bunny.putUrls()).toEqual([expect.stringContaining(`/avatars/${userId}.webp`)])
    })

    it('rejects wrong magic bytes', async () => {
      const res = await authPostMultipart(app, '/api/uploads/avatar', userToken, {
        image: notWebpBlob(),
      })
      await expectError(res, HTTP_STATUS.BAD_REQUEST, 'upload_invalid_format')
    })

    it('rejects wrong dimensions', async () => {
      const res = await authPostMultipart(app, '/api/uploads/avatar', userToken, {
        image: webpBlob(800),
      })
      await expectError(res, HTTP_STATUS.BAD_REQUEST, 'upload_invalid_dimensions')
    })

    it('rejects a request whose image field is not a file', async () => {
      const res = await authPostMultipart(app, '/api/uploads/avatar', userToken, {
        image: 'not-a-file',
      })
      await expectError(res, HTTP_STATUS.BAD_REQUEST, 'upload_invalid_format')
      expect(bunny.putUrls()).toEqual([])
    })

    it('maps a storage failure to 500 upload_storage_failed', async () => {
      bunny.respondWith(() => new Response('boom', { status: 500 }))
      const res = await authPostMultipart(app, '/api/uploads/avatar', userToken, {
        image: webpBlob(AVATAR_SIZE),
      })
      await expectError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'upload_storage_failed')
    })
  })

  describe('POST /api/uploads/product/:slug', () => {
    expectRequiresAuth(() => app, { method: 'POST', path: '/api/uploads/product/some-slug' })

    it('uploads to CDN for a slug that has no product yet', async () => {
      const url = await expectUploadedUrl(
        authPostMultipart(app, '/api/uploads/product/new-product-slug', contributorToken, {
          image: webpBlob(PRODUCT_SIZE),
        })
      )
      // No row to read updatedAt from, so the URL carries no cache-bust param.
      expect(url).toMatch(/^https:\/\/.+\/products\/new-product-slug\.webp$/)
      expect(bunny.putUrls()).toEqual([expect.stringContaining('/products/new-product-slug.webp')])
    })

    it('cache-busts the URL when the product already exists', async () => {
      const product = await createTestProduct(
        contributorId,
        { name: 'Upload Target', slug: 'upload-target' },
        'contributor'
      )
      const url = await expectUploadedUrl(
        authPostMultipart(app, `/api/uploads/product/${product.slug}`, contributorToken, {
          image: webpBlob(PRODUCT_SIZE),
        })
      )
      expect(url).toMatch(/^https:\/\/.+\/products\/upload-target\.webp\?v=\d+$/)
    })

    it('returns 400 for invalid image format regardless of slug existence', async () => {
      const res = await authPostMultipart(
        app,
        '/api/uploads/product/no-such-slug',
        contributorToken,
        {
          image: notWebpBlob(),
        }
      )
      await expectError(res, HTTP_STATUS.BAD_REQUEST, 'upload_invalid_format')
      expect(bunny.putUrls()).toEqual([])
    })

    it('rejects a slug outside the stored slug shape', async () => {
      // The slug becomes the storage key, so anything but slugify() output could
      // write outside products/.
      const res = await authPostMultipart(
        app,
        '/api/uploads/product/Not_A_Slug',
        contributorToken,
        {
          image: webpBlob(PRODUCT_SIZE),
        }
      )
      await expectError(res, HTTP_STATUS.BAD_REQUEST, 'invalid_input')
      expect(bunny.putUrls()).toEqual([])
    })
  })

  describe('POST /api/uploads/product/:slug (role enforcement)', () => {
    expectRoleMatrix(
      () => app,
      {
        method: 'POST',
        path: '/api/uploads/product/role-matrix-slug',
        form: { image: webpBlob(PRODUCT_SIZE) },
      },
      {
        user: HTTP_STATUS.FORBIDDEN,
        contributor: HTTP_STATUS.CREATED,
        admin: HTTP_STATUS.CREATED,
      }
    )
  })
})
