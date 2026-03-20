import type { AuthContext } from '../../../features/auth/service'
import { testDb } from '../../db.test.config'
import { JWT_SECRET, REFRESH_SECRET } from '../../helpers/secrets'
export function createCtx(overrides?: Partial<AuthContext>): AuthContext {
  return {
    db: testDb,
    jwtSecret: JWT_SECRET,
    refreshSecret: REFRESH_SECRET,
    frontendUrl: 'http://localhost:5173',
    ...overrides,
  }
}

export { testDb }
