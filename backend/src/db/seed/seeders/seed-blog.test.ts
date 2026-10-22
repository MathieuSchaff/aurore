import { expect, it } from 'bun:test'

import { testDb } from '../../../tests/db.test.config'
import { setupDbTests } from '../../../tests/db-setup'
import { captureError } from '../../../tests/helpers/capture-error'
import { articles } from '../../schema'
import { articleData } from '../data/blog'
import { seedBlog } from './seed-blog'

setupDbTests()

it('keeps one copy of each article when the blog seed runs again', async () => {
  await seedBlog()
  await seedBlog()

  expect(await testDb.select({ id: articles.id }).from(articles)).toHaveLength(articleData.length)
})

it('rejects the blog seed when an article cannot be prepared', async () => {
  const original = [...articleData]
  try {
    // Invalid runtime input must fail the seed instead of reporting partial success
    articleData.splice(0, articleData.length, {
      ...original[0],
      // @ts-expect-error Exercises a seed input rejected before the SQL insert
      slug: 42,
    })

    const error = await captureError(() => seedBlog())

    expect(error).toEqual(new Error('Seed interrompu : articles contient des erreurs critiques'))
    expect(await testDb.select({ id: articles.id }).from(articles)).toEqual([])
  } finally {
    articleData.splice(0, articleData.length, ...original)
  }
})
