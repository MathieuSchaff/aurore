import type { Database, DatabaseTransaction } from './db/index'

export type AppEnv = {
  Variables: {
    // Set only while withRlsContext is active for an authenticated request.
    requestDb?: DatabaseTransaction

    // Same app_runtime role as requestDb, but outside any transaction, so app.user_id
    // and app.role are unset: RLS resolves it to the anonymous view. Not a privileged
    // handle: the risk it carries is seeing too little, never bypass.
    anonDb: Database
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
