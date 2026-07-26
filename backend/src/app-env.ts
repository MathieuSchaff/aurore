import type { Database } from './db/index'

export type AppEnv = {
  Variables: {
    db: Database
    // Set by the outermost request middleware before any downstream boundary can throw.
    requestId: string
    env: 'development' | 'production'
    userId?: string
    userRole?: 'user' | 'admin' | 'contributor'
    jwtSecret: string
    refreshSecret: string
    frontendUrl: string
  }
}
