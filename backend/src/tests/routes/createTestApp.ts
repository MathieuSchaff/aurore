import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { jwtAuthRoutes } from '../../features/auth/routes'
import { habits } from '../../features/habits/routes'
import { healthRoute } from '../../features/health/routes'
import { logsRoutes } from '../../features/logs/routes'
import { ingredientTagRoutes } from '../../features/products/ingredient-tags/routes'
import { ingredientRoutes } from '../../features/products/ingredients/routes'
import { productIngredientRoutes } from '../../features/products/product-ingredients/routes'
import { productRoutes } from '../../features/products/routes'
import { tagRoutes } from '../../features/products/tags/routes'
import { profileRoute } from '../../features/profile/routes'
import { stockRoutes } from '../../features/stock/routes'
import { testDb } from '../db.test.config'
import { JWT_SECRET, REFRESH_SECRET } from '../helpers/secrets'

export function createTestApp() {
  const app = new Hono<AppEnv>()

  app.use('*', async (c, next) => {
    c.set('db', testDb)
    c.set('env', 'development')
    c.set('jwtSecret', JWT_SECRET)
    c.set('refreshSecret', REFRESH_SECRET)
    await next()
  })

  app
    .route('/auth', jwtAuthRoutes)
    .route('/health', healthRoute)
    .route('/habits', habits)
    .route('/profile', profileRoute)
    .route('/products', productRoutes)
    .route('/products', productIngredientRoutes)
    .route('/ingredients', ingredientRoutes)
    .route('/ingredients', ingredientTagRoutes)
    .route('/tags', tagRoutes)
    .route('/stock', stockRoutes)
    .route('/logs', logsRoutes)
  return app
}
