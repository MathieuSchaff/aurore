import { CryptoHasher } from 'bun'

import type { AccessTokenPayload, RefreshTokenPayload } from '@aurore/shared'
import {
  accessTokenPayloadSchema,
  refreshTokenPayloadSchema,
  SESSION_HINT_COOKIE,
} from '@aurore/shared'

import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'

import type { AppEnv } from '../../app-env'

const JWT_CONFIG = {
  accessTokenExpiry: 15 * 60,
  refreshTokenExpiry: 7 * 24 * 60 * 60,
} as const
const REFRESH_TOKEN_COOKIE = 'refresh_token'
const REFRESH_TOKEN_COOKIE_PATH = '/'
const LEGACY_REFRESH_TOKEN_COOKIE_PATH = '/api/auth'

export async function generateAccessToken(
  userId: string,
  role: 'user' | 'admin' | 'contributor',
  secret: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  return sign(
    {
      sub: userId,
      role,
      type: 'access',
      jti: Bun.randomUUIDv7(),
      iat: now,
      exp: now + JWT_CONFIG.accessTokenExpiry,
    } satisfies AccessTokenPayload,
    secret
  )
}

export async function generateRefreshToken(
  userId: string,
  secret: string
): Promise<{ token: string; jti: string; expiresAt: string }> {
  const now = Math.floor(Date.now() / 1000)
  const jti = Bun.randomUUIDv7()

  const token = await sign(
    {
      sub: userId,
      type: 'refresh',
      jti,
      iat: now,
      exp: now + JWT_CONFIG.refreshTokenExpiry,
    } satisfies RefreshTokenPayload,
    secret
  )

  return {
    token,
    jti,
    expiresAt: new Date((now + JWT_CONFIG.refreshTokenExpiry) * 1000).toISOString(),
  }
}

export async function verifyAccessToken(
  token: string,
  secret: string
): Promise<AccessTokenPayload | null> {
  try {
    const raw = await verify(token, secret, 'HS256')
    const parsed = accessTokenPayloadSchema.safeParse(raw)
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export async function verifyRefreshToken(
  token: string,
  secret: string
): Promise<RefreshTokenPayload | null> {
  try {
    const raw = await verify(token, secret, 'HS256')
    const parsed = refreshTokenPayloadSchema.safeParse(raw)
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export async function extractRefreshToken(c: Context<AppEnv>): Promise<string | null> {
  const fromCookie = getRefreshTokenCookie(c)
  if (fromCookie) return fromCookie

  // Mobile clients cannot read HttpOnly cookies, so accept token from JSON body.
  const contentType = c.req.header('Content-Type')
  if (contentType?.includes('application/json')) {
    try {
      const body = await c.req.json<{ refreshToken?: string }>()
      return body.refreshToken ?? null
    } catch {
      return null
    }
  }

  return null
}

export function getRefreshTokenCookie(c: Context<AppEnv>): string | null {
  return getCookie(c, REFRESH_TOKEN_COOKIE) ?? null
}

export function setRefreshTokenCookie(
  c: Context<AppEnv>,
  token: string,
  env: 'development' | 'production'
) {
  const isProd = env === 'production'
  setCookie(c, REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax',
    path: REFRESH_TOKEN_COOKIE_PATH,
    maxAge: JWT_CONFIG.refreshTokenExpiry,
  })
  // Keep clearing the old path while migrated sessions can still carry a revoked cookie there.
  deleteCookie(c, REFRESH_TOKEN_COOKIE, { path: LEGACY_REFRESH_TOKEN_COOKIE_PATH })
  // Non-httpOnly boot hint (never the token): lets the SPA skip the refresh probe when absent.
  // Same maxAge as the refresh token so the browser expires both together.
  setCookie(c, SESSION_HINT_COOKIE, '1', {
    httpOnly: false,
    secure: isProd,
    sameSite: 'Lax',
    path: '/',
    maxAge: JWT_CONFIG.refreshTokenExpiry,
  })
}

export function clearRefreshTokenCookie(c: Context<AppEnv>) {
  deleteCookie(c, REFRESH_TOKEN_COOKIE, { path: REFRESH_TOKEN_COOKIE_PATH })
  deleteCookie(c, REFRESH_TOKEN_COOKIE, { path: LEGACY_REFRESH_TOKEN_COOKIE_PATH })
  deleteCookie(c, SESSION_HINT_COOKIE, { path: '/' })
}

export function hashJti(jti: string): string {
  const hasher = new CryptoHasher('sha256')
  hasher.update(jti)
  return hasher.digest('base64url')
}
