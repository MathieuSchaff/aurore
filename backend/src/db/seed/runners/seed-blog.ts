import { createArticle } from '../../../features/blog/service'
import { isUniqueViolation } from '../../../lib/helpers'
import { db } from '../..'
import { articleData } from '../data/blog'
import { seedBatch } from '../utils/batch'
import { getOrCreateSeedUser } from './create-user'

// Idempotent mode: re-runs against an existing DB skip articles whose slug
// is already taken instead of logging one warning per existing article.
export async function seedBlog(idempotent = false) {
  console.log('\n📝 Seed des articles de blog...')

  const user = await getOrCreateSeedUser()

  const isLikelyUnique = (e: unknown): boolean => {
    if (isUniqueViolation(e)) return true
    let cur: unknown = e
    for (let i = 0; i < 5 && cur; i++) {
      if (!(cur instanceof Error)) break
      const code =
        (cur as { code?: unknown }).code ?? (cur as { errno?: unknown }).errno
      if (code === '23505') return true
      if (/duplicate key|violates unique constraint/i.test(cur.message)) return true
      cur = (cur as { cause?: unknown }).cause
    }
    return false
  }

  const insert = (article: (typeof articleData)[number]) => {
    const p = createArticle(db, user.id, article)
    if (!idempotent) return p
    return p.catch((e: unknown) => {
      if (isLikelyUnique(e)) return null
      if (e instanceof Error && /already_exists/.test(e.message)) return null
      throw e
    })
  }

  const result = await seedBatch(
    'articles',
    articleData,
    insert,
    (article) => article.slug ?? article.title,
    false
  )

  console.log(`✅ ${result.success}/${result.total} articles insérés`)
  if (result.failed.length > 0) {
    console.warn(`⚠️  ${result.failed.length} article(s) en échec :`)
    for (const f of result.failed) console.warn(`   - ${f.item}: ${f.reason}`)
  }
}

if (import.meta.main || process.argv[1]?.endsWith('seed-blog.ts')) {
  seedBlog().catch((err) => {
    console.error('💥 Erreur seed blog :', err instanceof Error ? err.message : err)
    process.exit(1)
  })
}
