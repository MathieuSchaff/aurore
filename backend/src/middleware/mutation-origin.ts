import { err, HTTP_STATUS } from '@aurore/shared'

import type { Context, Next } from 'hono'

import type { AppEnv } from '../app-env'

const isPrivateHost = (host: string): boolean =>
  host === 'localhost' ||
  host === '::1' ||
  host.endsWith('.local') ||
  /^127\./.test(host) ||
  /^10\./.test(host) ||
  /^192\.168\./.test(host) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(host)

function isTrustedMutationOrigin(
  origin: string,
  frontendUrl: string,
  runtimeEnv: AppEnv['Variables']['env']
): boolean {
  if (origin === frontendUrl) return true
  if (runtimeEnv === 'production') return false

  try {
    const candidate = new URL(origin)
    const frontend = new URL(frontendUrl)
    // Keep LAN origins for real-device QA; production stays exact-match above.
    return (
      candidate.protocol === 'http:' &&
      candidate.port === frontend.port &&
      isPrivateHost(candidate.hostname)
    )
  } catch {
    return false
  }
}

export const requireTrustedMutationOrigin = async (c: Context<AppEnv>, next: Next) => {
  if (c.req.method === 'GET') return next()

  const origin = c.req.header('Origin')
  if (!origin) return next()
  if (isTrustedMutationOrigin(origin, c.get('frontendUrl'), c.get('env'))) return next()

  return c.json(err('forbidden'), HTTP_STATUS.FORBIDDEN)
}
