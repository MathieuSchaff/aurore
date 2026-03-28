import { mock } from 'bun:test'

// Set environment variables for tests
process.env.NODE_ENV = 'development'
process.env.JWT_SECRET = 'test-secret-at-least-32-chars-long-for-zod'
process.env.REFRESH_SECRET = 'test-refresh-at-least-32-chars-long-for-zod'
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://app:testpassword@localhost:5433/appdb_test'
process.env.RESEND_API_KEY = 're_test'
process.env.FRONTEND_URL = 'http://localhost:5173'
process.env.GOOGLE_CLIENT_ID = 'test-client-id'
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3000/auth/google/callback'

mock.module('../features/auth/email.service', () => ({
  sendVerificationEmail: mock(async () => {}),
}))

import { afterAll, beforeAll, beforeEach } from 'bun:test'

import { sql } from 'drizzle-orm'

import { closeTestDb, testDb } from './db.test.config'
import { cleanDatabase } from './helpers/db-cleaner'

beforeAll(async () => {
  console.log('🔧 Initialisation de la DB de test (Bun SQL)...')
  try {
    // Avec Bun, pas besoin de .rows, on vérifie juste que ça ne throw pas
    await testDb.execute(sql`SELECT 1`)
    console.log('✅ Connexion à la DB de test OK')
  } catch (error) {
    console.error('❌ Impossible de se connecter à la DB de test')
    console.error('Vérifie : docker compose -f docker-compose.test.yml up -d')
    // On affiche l'erreur réelle pour débugger plus vite (ex: mot de passe faux)
    console.error(error)
    throw error
  }
})

beforeEach(async () => {
  await cleanDatabase()
})

afterAll(async () => {
  console.log('🧹 Nettoyage final et fermeture...')
  try {
    await cleanDatabase()
    await closeTestDb()
    console.log('🔌 Connexion DB de test fermée')
  } catch (err) {
    console.error('⚠️ Erreur lors de la fermeture de la DB:', err)
  }
})
