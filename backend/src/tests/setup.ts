import { mock } from 'bun:test'

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
