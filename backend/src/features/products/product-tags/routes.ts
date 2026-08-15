import { HTTP_STATUS, isDisplayedProductTag, ok, replaceProductTagsSchema } from '@aurore/shared'

import { Hono } from 'hono'
import { z } from 'zod'

import type { AppEnv } from '../../../app-env'
import { getRlsDb } from '../../../utils/accessors'
import { zValidator } from '../../../utils/validator'
import {
  requireCatalogWrite,
  requireJwtAuth,
  requireNotBanned,
  requireNotBannedScope,
} from '../../auth/middleware'
import { withRlsContext } from '../../auth/rls-context.middleware'
import { listTagsByProduct, replaceProductTags } from '../../product-tags/service'
import { assertTagsMatchProductDomain } from './domain-validation'

const productParams = z.object({ productId: z.uuid() })

const productTagsApp = new Hono<AppEnv>()

// Guards stay on the endpoints owned by this router so sibling routes are not intercepted

export const productTagRoutes = productTagsApp

  // Anonymous read, so it filters: internal-only slugs never leave for a client
  // (docs/adr/0017). The PUT below and the edit form's own payload keep the full
  // list, which is what lets an admin save without erasing them.
  .get('/:productId/tags', zValidator('param', productParams), async (c) => {
    const db = c.get('anonDb')
    const { productId } = c.req.valid('param')
    const items = await listTagsByProduct(db, productId)
    return c.json(ok(items.filter((item) => isDisplayedProductTag(item.tagSlug))), HTTP_STATUS.OK)
  })

  .put(
    '/:productId/tags',
    requireJwtAuth,
    withRlsContext,
    requireNotBanned,
    requireNotBannedScope('product_edit'),
    requireCatalogWrite,
    zValidator('param', productParams),
    zValidator('json', replaceProductTagsSchema),
    async (c) => {
      const db = getRlsDb(c)
      const { productId } = c.req.valid('param')
      const { tags } = c.req.valid('json')
      const tagIds = tags.map((t) => (typeof t === 'string' ? t : t.tagId))
      await assertTagsMatchProductDomain(db, productId, tagIds)
      const links = await replaceProductTags(db, productId, tags)
      return c.json(ok(links), HTTP_STATUS.OK)
    }
  )
