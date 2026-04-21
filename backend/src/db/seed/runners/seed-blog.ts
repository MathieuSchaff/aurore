import { createArticle } from '../../../features/blog/service'
import { db } from '../..'
import { articleData } from '../blog'
import { seedBatch } from '../utils/batch'
import { getOrCreateSeedUser } from './create-user'

export async function seedBlog() {
  console.log('\n📝 Seed des articles de blog...')

  const user = await getOrCreateSeedUser()

  const result = await seedBatch(
    'articles',
    articleData,
    (article) => createArticle(db, user.id, article),
    (article) => article.slug ?? article.title,
    false
  )

  console.log(`✅ ${result.success}/${result.total} articles insérés`)
  if (result.failed.length > 0) {
    console.warn(`⚠️  ${result.failed.length} article(s) en échec :`)
    result.failed.forEach((f) => console.warn(`   - ${f.item}: ${f.reason}`))
  }
}

if (import.meta.main || process.argv[1]?.endsWith('seed-blog.ts')) {
  seedBlog().catch((err) => {
    console.error('💥 Erreur seed blog :', err instanceof Error ? err.message : err)
    process.exit(1)
  })
}
