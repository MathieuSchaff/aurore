import { describe, expect, test } from 'bun:test'

import { parseGoldSetSampleTags } from '../gold-set/sample-tags'

describe('parseGoldSetSampleTags', () => {
  test('uses every focus tag when no filter is provided', () => {
    expect(parseGoldSetSampleTags(undefined)).toContain('retinoids')
    expect(parseGoldSetSampleTags(undefined)).toContain('non-comedogene')
  })

  test('accepts a deduplicated comma-separated subset', () => {
    expect(parseGoldSetSampleTags('hypoallergenique, non-comedogene,hypoallergenique')).toEqual([
      'hypoallergenique',
      'non-comedogene',
    ])
  })

  test('rejects an unknown or empty subset', () => {
    expect(() => parseGoldSetSampleTags('unknown-tag')).toThrow('Unknown gold-set sample tag')
    expect(() => parseGoldSetSampleTags(' , ')).toThrow('No gold-set sample tags')
  })
})
