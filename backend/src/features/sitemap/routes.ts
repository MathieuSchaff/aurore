import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { getSitemapXml } from './service'

const sitemapApp = new Hono<AppEnv>().get('/', async (c) => {
  const { xml, maxAgeSeconds } = await getSitemapXml(c.get('db'))

  return c.body(xml, 200, {
    'Content-Type': 'application/xml; charset=utf-8',
    // Advertise only the remaining server TTL: each cache layer expires with this XML.
    'Cache-Control': `public, max-age=${maxAgeSeconds}, s-maxage=${maxAgeSeconds}`,
  })
})

export const sitemapRoutes = sitemapApp
