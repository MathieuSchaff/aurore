#!/usr/bin/env bun

// Creates the production catalogue owner from ADMIN_EMAIL / ADMIN_PASSWORD. The
// whole catalogue is owned by a single admin (products / ingredients / articles
// .created_by), so prod needs exactly one real admin before db-catalogue-load
// can resolve __OWNER_ID__.

// Usage: bun run src/db/seed/seeders/seed-prod-admin.ts

import type { Email, RawPassword } from '@aurore/shared'

import { env } from '../../../config/env'
import { getOrCreateSeedUser } from './create-user'

const email = env.ADMIN_EMAIL
const password = env.ADMIN_PASSWORD

if (!email || !password) {
  console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.')
  process.exit(1)
}

// Idempotent: reuses the row if the email already exists.
const user = await getOrCreateSeedUser(email as Email, password as RawPassword)

console.log(`✓ prod admin ready: ${email}`)
// Last line: callers (db-catalogue-load) capture this as the owner id.
console.log(user.id)
process.exit(0)
