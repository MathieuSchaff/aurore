import { describe, expect, test } from 'bun:test'

import { pad, padTrunc, rpad } from './fmt'

describe('runner fmt helpers', () => {
  test('pad right-pads short strings to width', () => {
    expect(pad('ab', 5)).toBe('ab   ')
  })

  test('pad leaves strings longer than the width intact (row overflows)', () => {
    expect(pad('abcdef', 4)).toBe('abcdef')
  })

  test('padTrunc clips strings longer than the width (column stays aligned)', () => {
    expect(padTrunc('abcdef', 4)).toBe('abcd')
  })

  test('padTrunc right-pads short strings like pad', () => {
    expect(padTrunc('ab', 5)).toBe('ab   ')
  })

  test('rpad left-pads short strings to width', () => {
    expect(rpad('ab', 5)).toBe('   ab')
  })

  test('rpad leaves strings longer than the width intact', () => {
    expect(rpad('abcdef', 4)).toBe('abcdef')
  })
})
