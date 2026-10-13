import { type PrivacyAccessOperation, privacyAccessOperationSchema } from '@aurore/shared'

import {
  decodeIdToken,
  generateCodeVerifier,
  generateState,
  OAuth2RequestError,
  type OAuth2Tokens,
} from 'arctic'
import { sign, verify } from 'hono/jwt'
import { z } from 'zod'

import type { Database } from '../../db'
import { getGoogleInstance } from '../../lib/artic'
import { getUserByGoogleSub } from './user.utils'

const flowSchema = z.object({
  type: z.literal('privacy-oauth'),
  state: z.string(),
  codeVerifier: z.string(),
  operation: privacyAccessOperationSchema,
  exp: z.number(),
})
const grantSchema = z.object({
  type: z.literal('privacy-access'),
  userId: z.uuid(),
  email: z.email(),
  operation: privacyAccessOperationSchema,
  exp: z.number(),
})

async function verifyPrivacyToken(token: string, secret: string) {
  try {
    return await verify(token, secret, 'HS256')
  } catch {
    return null
  }
}

export async function startGooglePrivacyAccess(secret: string, operation: PrivacyAccessOperation) {
  const state = `privacy.${generateState()}`
  const codeVerifier = generateCodeVerifier()
  const url = getGoogleInstance().createAuthorizationURL(state, codeVerifier, ['openid', 'email'])
  url.searchParams.set('state', state)
  url.searchParams.set('prompt', 'select_account')
  const iat = Math.floor(Date.now() / 1000)
  const token = await sign(
    {
      type: 'privacy-oauth',
      state,
      codeVerifier,
      operation,
      iat,
      exp: iat + 600,
    },
    secret
  )
  return { url: url.toString(), token }
}

export async function completeGooglePrivacyAccess(
  db: Database,
  secret: string,
  flowToken: string,
  code: string,
  state: string
) {
  const flow = flowSchema.safeParse(await verifyPrivacyToken(flowToken, secret))
  if (!flow.success || flow.data.state !== state || !code) return null
  let tokens: OAuth2Tokens
  try {
    tokens = await getGoogleInstance().validateAuthorizationCode(code, flow.data.codeVerifier)
  } catch (error) {
    if (error instanceof OAuth2RequestError && error.code === 'invalid_grant') return null
    throw error
  }
  const claims = z.object({ sub: z.string().min(1) }).parse(decodeIdToken(tokens.idToken()))
  // Email matching would let this recovery path attach a new provider identity
  const user = await getUserByGoogleSub(db, claims.sub)
  if (!user || user.isDemo) return null
  const iat = Math.floor(Date.now() / 1000)
  return sign(
    {
      type: 'privacy-access',
      userId: user.id,
      email: user.email,
      operation: flow.data.operation,
      iat,
      exp: iat + 300,
    },
    secret
  )
}

export async function readGooglePrivacyGrant(token: string, secret: string) {
  const grant = grantSchema.safeParse(await verifyPrivacyToken(token, secret))
  return grant.success ? grant.data : null
}
