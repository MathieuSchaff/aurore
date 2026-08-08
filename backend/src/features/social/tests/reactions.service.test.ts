import { beforeEach, describe, expect, it } from 'bun:test'

import { eq, sql } from 'drizzle-orm'

import { profiles, socialPosts } from '../../../db/schema'
import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { createTestUser } from '../../../tests/helpers/test-factories'
import { react } from '../reactions.service'

setupDbTests()

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

let userId: string
let postId: string

beforeEach(async () => {
  const user = await createTestUser('reaction-lock@test.local', 'Azerty123!')
  userId = user.id
  await testDb
    .update(profiles)
    .set({ username: 'reaction-lock' })
    .where(eq(profiles.userId, userId))
  const [post] = await testDb
    .insert(socialPosts)
    .values({
      authorId: userId,
      tone: 'principal',
      content: 'Visible post',
      concernSlug: 'rosacee',
    })
    .returning({ id: socialPosts.id })
  if (!post) throw new Error('post seed failed')
  postId = post.id
})

describe('reactions service', () => {
  it('holds the reactable while creating its polymorphic reference', async () => {
    const created = deferred()
    const release = deferred()
    const writer = testDb.transaction(async (tx) => {
      await react(userId, { reactableType: 'post', reactableId: postId, kind: 'merci' }, tx)
      created.resolve()
      await release.promise
    })
    await created.promise

    try {
      await expect(
        testDb.transaction(async (tx) => {
          await tx.execute(sql`SET LOCAL lock_timeout = '100ms'`)
          await tx.delete(socialPosts).where(eq(socialPosts.id, postId))
        })
      ).rejects.toThrow()
    } finally {
      release.resolve()
      await writer
    }
  })
})
