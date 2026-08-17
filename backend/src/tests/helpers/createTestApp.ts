import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { requireTrustedMutationOrigin } from '../../middleware/mutation-origin'
import { globalErrorHandler } from '../../utils/errors/error-handler'
import { testDb } from '../db.test.config'
import { JWT_SECRET, REFRESH_SECRET } from '../helpers/secrets'

type CreateTestAppOptions = {
  anonDb?: AppEnv['Variables']['anonDb']
}

// Prefer beforeAll unless a test in your suite needs a fresh app instance.
export async function createTestApp({ anonDb = testDb }: CreateTestAppOptions = {}) {
  const app = new Hono<AppEnv>()

  app.onError(globalErrorHandler)

  // Dynamically import routes to avoid circular dependencies during test initialization
  const { jwtAuthRoutes } = await import('../../features/auth/routes')
  const { ssrBootRoutes } = await import('../../features/auth/ssr-boot.routes')
  const { HEALTH_PATH, healthRoute, READY_PATH, readyRoute } = await import(
    '../../features/health/routes'
  )
  const { ingredientTagRoutes } = await import('../../features/ingredients/ingredient-tags/routes')
  const { ingredientRoutes } = await import('../../features/ingredients/routes')
  const { productsFeature } = await import('../../features/products')
  const { productComparisonRoutes } = await import('../../features/product-comparisons/routes')
  const { productTagDefRoutes } = await import('../../features/product-tags/routes')
  const { ingredientTagDefRoutes } = await import('../../features/ingredient-tags/routes')
  const { profileRoute } = await import('../../features/profile/routes')
  const { publicProfileRoutes } = await import('../../features/profile/public-routes')
  const { socialRoutes } = await import('../../features/social/routes')
  const { socialPostsRoutes } = await import('../../features/social/posts.routes')
  const { socialReactionsRoutes } = await import('../../features/social/reactions.routes')
  const { userProductRoutes } = await import('../../features/user-products/routes')
  const { collectionRoutes } = await import('../../features/collection/routes')
  const { meRoutes } = await import('../../features/catalog-submissions/routes')
  const { ingredientDiscussionRoutes } = await import(
    '../../features/discussions/ingredient-discussion-routes'
  )
  const { articleRoutes } = await import('../../features/blog/routes')
  const { sitemapRoutes } = await import('../../features/sitemap/routes')
  const { uploadsRoutes } = await import('../../features/uploads/routes')
  const { adminBansRoutes } = await import('../../features/admin/bans.routes')
  const { adminModerationRoutes } = await import('../../features/admin/moderation.routes')
  const { adminReportsRoutes } = await import('../../features/admin/reports.routes')
  const { adminRoleRequestsRoutes } = await import('../../features/admin/role-requests.routes')
  const { adminSecurityEventsRoutes } = await import('../../features/admin/security-events.routes')
  const { adminSuggestedEditsRoutes } = await import('../../features/admin/suggested-edits.routes')
  const { reportsRoutes } = await import('../../features/reports/routes')
  const { roleRequestsRoutes } = await import('../../features/role-requests/routes')
  const { suggestedEditsRoutes } = await import('../../features/suggested-edits/routes')

  app.use('*', async (c, next) => {
    c.set('anonDb', anonDb)
    c.set('env', 'development')
    c.set('jwtSecret', JWT_SECRET)
    c.set('refreshSecret', REFRESH_SECRET)
    c.set('frontendUrl', 'http://localhost:5173')
    await next()
  })
  app.use('/api/*', requireTrustedMutationOrigin)

  // Mirror production mounting (index.ts): every router under /api, and products
  // via the productsFeature composite, so a prefix/composition regression cannot
  // pass here. Chain reassigned to preserve route types for testClient RPC inference.
  // fallow-ignore-next-line code-duplication
  const routedApp = app
    .route('/api/auth', jwtAuthRoutes)
    .route('/api', ssrBootRoutes)
    .route(HEALTH_PATH, healthRoute)
    .route(READY_PATH, readyRoute)
    .route('/api/profile', profileRoute)
    .route('/api/profiles', publicProfileRoutes)
    .route('/api/social', socialRoutes)
    .route('/api/social/posts', socialPostsRoutes)
    .route('/api/social/reactions', socialReactionsRoutes)
    .route('/api', productsFeature)
    .route('/api/product-comparisons', productComparisonRoutes)
    .route('/api/ingredients', ingredientRoutes)
    .route('/api/ingredients', ingredientTagRoutes)
    .route('/api/ingredients', ingredientDiscussionRoutes)
    .route('/api/product-tags', productTagDefRoutes)
    .route('/api/ingredient-tags', ingredientTagDefRoutes)
    .route('/api/user-products', userProductRoutes)
    .route('/api/collection', collectionRoutes)
    .route('/api/me', meRoutes)
    .route('/api/uploads', uploadsRoutes)
    .route('/api/articles', articleRoutes)
    .route('/api/sitemap.xml', sitemapRoutes)
    .route('/api/admin', adminBansRoutes)
    .route('/api/admin/moderation', adminModerationRoutes)
    .route('/api/admin/reports', adminReportsRoutes)
    .route('/api/admin/security-events', adminSecurityEventsRoutes)
    .route('/api/reports', reportsRoutes)
    .route('/api/admin/role-requests', adminRoleRequestsRoutes)
    .route('/api/role-requests', roleRequestsRoutes)
    .route('/api/admin/suggested-edits', adminSuggestedEditsRoutes)
    .route('/api/suggested-edits', suggestedEditsRoutes)

  return routedApp
}
