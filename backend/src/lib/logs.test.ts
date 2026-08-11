import { describe, expect, test } from 'bun:test'

import { productChangesSchema } from '@aurore/shared'

import { buildChanges } from './logs'

const TRACKED = ['amountUnit', 'texture', 'notes'] as const

describe('buildChanges', () => {
  test('records a plain edit', () => {
    const changes = buildChanges({ notes: 'old' }, { notes: 'new' }, TRACKED)
    expect(changes).toEqual({ notes: { old: 'old', new: 'new' } })
  })

  test("folds a legacy '' on the old side to null", () => {
    const changes = buildChanges({ amountUnit: '' }, { amountUnit: 'ml' }, TRACKED)
    expect(changes.amountUnit).toEqual({ old: null, new: 'ml' })
  })

  test("'' → null is not a change", () => {
    const changes = buildChanges({ amountUnit: '' }, { amountUnit: null }, TRACKED)
    expect(changes).toEqual({})
  })

  test("'' → '' is not a change", () => {
    const changes = buildChanges({ amountUnit: '' }, { amountUnit: '' }, TRACKED)
    expect(changes).toEqual({})
  })

  test('the produced diff survives productChangesSchema, which is what returned 500', () => {
    const changes = buildChanges({ amountUnit: '' }, { amountUnit: 'ml' }, TRACKED)
    expect(() => productChangesSchema.parse(changes)).not.toThrow()
  })

  test('folds an empty object to null', () => {
    const changes = buildChanges({ notes: {} }, { notes: 'filled' }, TRACKED)
    expect(changes.notes).toEqual({ old: null, new: 'filled' })
  })

  test('an untracked field is ignored', () => {
    const changes = buildChanges({ slug: 'a' }, { slug: 'b' }, TRACKED)
    expect(changes).toEqual({})
  })
})
