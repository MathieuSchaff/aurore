import type { Context } from 'hono'

// Trust only headers our nginx edge sets: X-Real-IP is the real TCP peer, and nginx
// appends that peer at the END of X-Forwarded-For. The leftmost entry is client-controlled:
// never key a rate limit or audit trail on it, or it can be rotated to bypass limits.
// cf-connecting-ip is spoofable until we sit behind Cloudflare, add it back here then.
export function clientIp(c: Context): string {
  return (
    c.req.header('x-real-ip')?.trim() ||
    c.req.header('x-forwarded-for')?.split(',').at(-1)?.trim() ||
    'unknown'
  )
}
