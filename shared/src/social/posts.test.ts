import { describe, expect, it } from 'bun:test'

import { createPostReplySchema, createPostSchema } from './posts'

describe.each([
  {
    name: 'post',
    schema: createPostSchema,
    anchors: { tone: 'principal', concernSlug: 'anti-acne' },
  },
  { name: 'reply', schema: createPostReplySchema, anchors: {} },
])('$name content', ({ schema, anchors }) => {
  it('accepts plain text without altering punctuation or line breaks', () => {
    const content = "J'ai préféré la crème à 2% < 5%.\nElle reste agréable."

    expect(schema.parse({ ...anchors, content }).content).toBe(content)
  })

  it('rejects HTML at the content field', () => {
    const result = schema.safeParse({ ...anchors, content: '<b>Mon retour</b>' })

    expect(result.success).toBe(false)
    if (result.success) throw new Error('HTML content was accepted')
    expect(result.error.issues).toEqual([
      { code: 'custom', path: ['content'], message: 'must not contain HTML' },
    ])
  })

  it.each(['', 'a'.repeat(2001)])(
    'rejects content outside the existing length bounds',
    (content) => {
      expect(schema.safeParse({ ...anchors, content }).success).toBe(false)
    }
  )
})
