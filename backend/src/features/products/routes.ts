import {
  createProductSchema,
  distinctBrandsQuery,
  HTTP_STATUS,
  listProductsQuery,
  ok,
  PRODUCT_DOMAIN_TABS,
  productFormulaPreviewSchema,
  productsByIdsQuery,
  searchProductsQuery,
  updateProductSchema,
  verifyQualityBodySchema,
} from '@aurore/shared'

import { type Context, Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { stripAdminFields } from '../../lib/catalog'
import { getAuthedUserId, getAuthedUserRole, getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import {
  optionalJwtAuth,
  requireAdmin,
  requireCatalogWrite,
  requireJwtAuth,
  requireNotBanned,
  requireNotBannedScope,
} from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'
import { securityScan } from '../security/security.middleware'
import { listPostsForProduct } from '../social/posts.service'
import { listPublicReviewsForProduct } from '../user-products/service'
import { previewProductFormula } from './formula-preview.service'
import {
  createProduct,
  deleteProduct,
  findSimilarProducts,
  getDistinctBrands,
  getFilterOptions,
  getProductFullBySlug,
  getProductsByIds,
  listProducts,
  previewSlug,
  searchProducts,
  updateProduct,
  verifyProduct,
} from './service'

const slugParam = z.object({ slug: z.string().min(1).max(100) })
const idParam = z.object({ id: z.uuid() })

const checkDuplicateQuery = z.object({
  name: z.string().trim().min(2).max(200),
  brand: z.string().trim().min(1).max(200),
})

const slugPreviewQuery = z.object({
  name: z.string().trim().min(2).max(200),
  brand: z.string().trim().max(200).default(''),
})

const productsApp = new Hono<AppEnv>()

// Public reads use anonDb only when no authenticated identity exists. Authenticated
// reads and every write stay inside the request RLS transaction.
function getProductReadDb(c: Context<AppEnv>) {
  return c.get('userId') ? getRlsDb(c) : c.get('anonDb')
}

// This router shares /products with discussions, tags and ingredient links. Keep
// its guards on owned endpoints so no sibling inherits or nests this RLS transaction.

export const productRoutes = productsApp

  .get(
    '/filter-options',
    optionalJwtAuth,
    withRlsContext,
    zValidator('query', z.object({ category: z.enum(PRODUCT_DOMAIN_TABS).optional() })),
    async (c) => {
      const db = getProductReadDb(c)
      const { category } = c.req.valid('query')
      const options = await getFilterOptions(db, category)
      return c.json(ok(options), HTTP_STATUS.OK)
    }
  )
  // Must precede /:slug or the slug route captures this path.
  .get(
    '/brands',
    optionalJwtAuth,
    withRlsContext,
    zValidator('query', distinctBrandsQuery),
    async (c) => {
      const db = getProductReadDb(c)
      const { category } = c.req.valid('query')
      const brands = await getDistinctBrands(db, category)
      return c.json(ok(brands), HTTP_STATUS.OK)
    }
  )
  .get(
    '/check-duplicate',
    optionalJwtAuth,
    withRlsContext,
    zValidator('query', checkDuplicateQuery),
    async (c) => {
      const db = getProductReadDb(c)
      const { name, brand } = c.req.valid('query')
      const similar = await findSimilarProducts(name, brand, db)
      return c.json(ok(similar), HTTP_STATUS.OK)
    }
  )
  .get(
    '/slug-preview',
    requireJwtAuth,
    withRlsContext,
    zValidator('query', slugPreviewQuery),
    async (c) => {
      const db = getRlsDb(c)
      const { name, brand } = c.req.valid('query')
      const slug = await previewSlug(name, brand, db)
      return c.json(ok({ slug }), HTTP_STATUS.OK)
    }
  )
  .get(
    '/search',
    optionalJwtAuth,
    withRlsContext,
    zValidator('query', searchProductsQuery),
    async (c) => {
      const db = getProductReadDb(c)
      const { q, limit, offset, category } = c.req.valid('query')
      const result = await searchProducts({ q, limit, offset, category }, db)
      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )
  .get(
    '/by-ids',
    optionalJwtAuth,
    withRlsContext,
    zValidator('query', productsByIdsQuery),
    async (c) => {
      const db = getProductReadDb(c)
      const { ids } = c.req.valid('query')
      const items = await getProductsByIds(ids, db)
      return c.json(ok(items), HTTP_STATUS.OK)
    }
  )
  .get('/', optionalJwtAuth, withRlsContext, zValidator('query', listProductsQuery), async (c) => {
    const db = getProductReadDb(c)
    const filters = c.req.valid('query')
    const userId = c.get('userId') ?? null

    const result = await listProducts(filters, db, userId)
    return c.json(ok(result), HTTP_STATUS.OK)
  })

  .post(
    '/',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireNotBannedScope('product_create'),
    securityScan(),
    zValidator('json', createProductSchema),
    async (c) => {
      const db = getRlsDb(c)
      const userId = getAuthedUserId(c)
      const role = getAuthedUserRole(c)
      const input = c.req.valid('json')
      const product = await createProduct(userId, role, input, db)
      return c.json(ok(stripAdminFields(product)), HTTP_STATUS.CREATED)
    }
  )

  .post(
    '/formula-preview',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    securityScan(),
    zValidator('json', productFormulaPreviewSchema),
    async (c) => {
      const db = getRlsDb(c)
      const input = c.req.valid('json')
      const result = await previewProductFormula(input, db)
      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )

  .get('/:slug', optionalJwtAuth, withRlsContext, zValidator('param', slugParam), async (c) => {
    const db = getProductReadDb(c)
    const { slug } = c.req.valid('param')
    const product = await getProductFullBySlug(slug, db)
    return c.json(ok(product), HTTP_STATUS.OK)
  })

  .get(
    '/:slug/reviews/public',
    optionalJwtAuth,
    withRlsContext,
    zValidator('param', slugParam),
    async (c) => {
      const db = getProductReadDb(c)
      const { slug } = c.req.valid('param')
      const result = await listPublicReviewsForProduct(db, slug)
      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )

  // Product posts stay anchored here; the feed does not amplify them from this route.
  // The /u link is gated client-side by author.profilePublic.
  .get(
    '/:slug/posts',
    optionalJwtAuth,
    withRlsContext,
    zValidator('param', slugParam),
    async (c) => {
      const db = getProductReadDb(c)
      const { slug } = c.req.valid('param')
      const result = await listPostsForProduct(db, slug)
      return c.json(ok(result), HTTP_STATUS.OK)
    }
  )

  .patch(
    '/:id',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireNotBannedScope('product_edit'),
    zValidator('param', idParam),
    securityScan(),
    zValidator('json', updateProductSchema),
    async (c) => {
      const db = getRlsDb(c)
      const { id } = c.req.valid('param')
      const userId = getAuthedUserId(c)
      const input = c.req.valid('json')
      const product = await updateProduct(userId, id, input, db)
      return c.json(ok(stripAdminFields(product)), HTTP_STATUS.OK)
    }
  )

  .patch(
    '/:id/quality',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireCatalogWrite,
    zValidator('param', idParam),
    zValidator('json', verifyQualityBodySchema),
    async (c) => {
      const db = getRlsDb(c)
      const { id } = c.req.valid('param')
      const actorId = getAuthedUserId(c)
      const product = await verifyProduct(actorId, id, db)
      return c.json(ok(stripAdminFields(product)), HTTP_STATUS.OK)
    }
  )

  .delete(
    '/:id',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireNotBannedScope('product_edit'),
    requireAdmin,
    zValidator('param', idParam),
    async (c) => {
      const db = getRlsDb(c)
      const role = getAuthedUserRole(c)
      const { id } = c.req.valid('param')
      await deleteProduct(db, role, id)
      return c.body(null, 204)
    }
  )
