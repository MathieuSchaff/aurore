import type { Email, RawPassword } from '@habit-tracker/shared'

import { env } from '../../config/env'
import type { AuthContext } from '../../features/auth/service'
import { signup } from '../../features/auth/service'
import { getUser } from '../../features/auth/user.utils'
import { db } from '../index'

export function createCtx(overrides?: Partial<AuthContext>): AuthContext {
  return {
    db: db,
    jwtSecret: env.JWT_SECRET,
    refreshSecret: env.REFRESH_SECRET,
    frontendUrl: env.FRONTEND_URL,
    ...overrides,
  }
}
const UserSeeder = {
  email: 'seed@seed.com',
  password: 'Azerty123!seed',
}
export async function getOrCreateSeedUser(
  email: string = UserSeeder.email,
  password: string = UserSeeder.password
) {
  const ctx = createCtx()

  const user = await getUser(ctx.db, email as Email)

  if (user) {
    console.log(`Utilisateur seed existant réutilisé : ${email}`)
    return user
  }

  console.log(`Création de l'utilisateur seed : ${email}`)
  const result = await signup(ctx, email as Email, password as RawPassword)

  if (result.success === false) {
    // TypeScript now knows 'error' exists because success is specifically false
    throw new Error(`Échec création utilisateur seed : ${result.error}`)
  }

  return result.data.user
}
