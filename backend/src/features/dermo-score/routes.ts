import { err, HTTP_STATUS, ok } from '@aurore/shared'

import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../app-env'
import { getRlsDb } from '../../utils/accessors'
import { zValidator } from '../../utils/validator'
import { optionalJwtAuth } from '../auth/middleware'
import { withRlsContext } from '../auth/rls-context.middleware'
import { computeProductDermoScore } from './service'

const slugParam = z.object({ slug: z.string().min(1).max(200) })

const app = new Hono<AppEnv>()

// The JSDoc below is not a comment, it is the OpenAPI entry for this route: `just docs` extracts it
// with ts-morph and serves it at /api/docs. It only binds from inside the chain, so moving it above
// this line disables it silently. Deleted twice as dead scaffolding, restored twice
export const dermoScoreRoutes = app
  // Guards per route because sibling routers share /products and a use('*')
  // leaks onto any router mounted after this one
  // This router is mounted last
  // in products/index.ts today, but that order is not a contract
  /**
   * @summary Product dermo score
   * @description Compute the dermo score for a product by slug. Personalized when a valid bearer is supplied.
   * @tag dermo-score
   */
  .get(
    '/:slug/dermo-score',
    optionalJwtAuth,
    withRlsContext,
    zValidator('param', slugParam),
    async (c) => {
      const userId = c.get('userId') ?? null
      const database = userId ? getRlsDb(c) : c.get('anonDb')
      const { slug } = c.req.valid('param')

      const outcome = await computeProductDermoScore(slug, userId, database)
      if (!outcome.ok) {
        // inci_missing identifies a missing score resource rather than malformed input
        return c.json(err(outcome.reason), HTTP_STATUS.NOT_FOUND)
      }
      return c.json(ok(outcome.assessment), HTTP_STATUS.OK)
    }
  )
