import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

const TEST_DATABASE_URL = 'postgres://app:testpassword@localhost:5433/appdb_test'

async function migrateTest() {
  console.log('🔧 Migration de la DB de test...')

  const pool = new Pool({
    connectionString: TEST_DATABASE_URL,
  })

  const db = drizzle(pool)

  try {
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('✅ Migrations appliquées avec succès')
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error)
    throw error
  } finally {
    await pool.end()
  }
}

migrateTest()
