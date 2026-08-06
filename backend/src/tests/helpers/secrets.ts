// Separate from env-setup.ts: this is the createTestApp lineage, not the env-var
// (seeders/createCtx) lineage. Different values are intentional, not drift.
export const JWT_SECRET = 'test-jwt-secret-at-least-32-chars!!'
export const REFRESH_SECRET = 'test-refresh-secret-at-least-32-chars!!'
