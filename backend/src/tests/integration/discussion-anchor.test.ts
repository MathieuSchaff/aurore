import { describe, expect, it } from 'bun:test'

import { discussionReplies, discussionThreads } from '../../db/schema'
import { generateAccessToken } from '../../features/auth/jwt.utils'
import { testDb } from '../db.test.config'
import { setupDbTests } from '../db-setup'
import { createAppRuntimeDb } from '../helpers/app-runtime-db'
import { createTestApp } from '../helpers/createTestApp'
import { JWT_SECRET } from '../helpers/secrets'
import { createTestIngredient, createTestProduct, createTestUser } from '../helpers/test-factories'

const runtime = await createAppRuntimeDb()
setupDbTests()

describe('discussion anchor enforcement', () => {
  it('rejects the wrong product, entity type and reply thread without mutating content', async () => {
    const user = await createTestUser()
    const first = await createTestProduct(user.id, { name: 'First discussion anchor' })
    const second = await createTestProduct(user.id, { name: 'Second discussion anchor' })
    const ingredient = await createTestIngredient(user.id, {
      name: 'Ingredient anchor',
      slug: first.slug,
    })
    const [thread, otherThread, ingredientThread] = await testDb
      .insert(discussionThreads)
      .values([
        { productId: first.id, authorId: user.id, title: 'First thread', content: 'First content' },
        { productId: first.id, authorId: user.id, title: 'Other thread', content: 'Other content' },
        {
          ingredientId: ingredient.id,
          authorId: user.id,
          title: 'Ingredient thread',
          content: 'Ingredient content',
        },
      ])
      .returning()
    if (!thread || !otherThread || !ingredientThread) throw new Error('missing threads')
    const [reply] = await testDb
      .insert(discussionReplies)
      .values({ threadId: thread.id, authorId: user.id, content: 'Saved reply' })
      .returning()
    if (!reply) throw new Error('missing reply')
    const app = await createTestApp({ anonDb: runtime })
    const headers = {
      authorization: `Bearer ${await generateAccessToken(user.id, 'user', JWT_SECRET)}`,
      'content-type': 'application/json',
    }
    const correct = `/api/products/${first.slug}/discussions/${thread.id}`
    for (const wrong of [
      `/api/products/${second.slug}/discussions/${thread.id}`,
      `/api/ingredients/${ingredient.slug}/discussions/${thread.id}`,
      `/api/products/${first.slug}/discussions/${ingredientThread.id}`,
    ]) {
      expect((await app.request(wrong)).status).toBe(404)
      expect(
        (
          await app.request(`${wrong}/replies`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ content: 'Wrong anchor reply' }),
          })
        ).status
      ).toBe(404)
      expect((await app.request(wrong, { method: 'DELETE', headers })).status).toBe(404)
      expect(
        (await app.request(`${wrong}/replies/${reply.id}`, { method: 'DELETE', headers })).status
      ).toBe(404)
    }
    expect(
      (
        await app.request(
          `/api/products/${first.slug}/discussions/${otherThread.id}/replies/${reply.id}`,
          { method: 'DELETE', headers }
        )
      ).status
    ).toBe(404)
    expect(await testDb.select().from(discussionThreads)).toHaveLength(3)
    expect(await testDb.select().from(discussionReplies)).toHaveLength(1)
    expect((await app.request(correct)).status).toBe(200)
    expect(
      (
        await app.request(`${correct}/replies`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ content: 'Correct anchor reply' }),
        })
      ).status
    ).toBe(201)
    expect(
      (await app.request(`${correct}/replies/${reply.id}`, { method: 'DELETE', headers })).status
    ).toBe(204)
    expect((await app.request(correct, { method: 'DELETE', headers })).status).toBe(204)
  })
})
