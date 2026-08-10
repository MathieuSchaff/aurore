import { execFileSync } from 'node:child_process'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { REGULATORY_SCOPE_PHRASE } from '@/constants/derm'

// A scoped cap is dropped when its `scopeId` has no French phrase. That is the
// right default, since a bare 7,34 % would read as this product's own limit,
// but it is silent: a vendor bump that adds a scope makes a number vanish with
// nobody told. This guard reads ids from the committed tarball, not a stale copy.

const TARBALL = path.resolve(__dirname, '../../../../..', 'vendor/algo-derm.tgz')
const COMPILED = 'package/dist/engine/regulatory.js'

const upstreamScopeIds = (): string[] => {
  const js = execFileSync('tar', ['-xzOf', TARBALL, COMPILED], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  })
  const ids = js.match(/scopeId:\s*"([a-z0-9-]+)"/g) ?? []
  return [...new Set(ids.map((entry) => entry.replace(/^scopeId:\s*"|"$/g, '')))].sort()
}

const ids = upstreamScopeIds()

describe('regulatory scope phrases against the vendored pin', () => {
  it('finds the scope ids at all', () => {
    // A dist layout change or a renamed field would make the assertion below vacuous.
    expect(ids.length).toBeGreaterThan(5)
  })

  it('has a French phrase for every scope the lib can emit', () => {
    const unmapped = ids.filter((id) => !REGULATORY_SCOPE_PHRASE[id])
    expect(unmapped, `caps carrying these scopes are silently dropped`).toEqual([])
  })

  it('keeps no phrase for a scope the lib no longer emits', () => {
    // A stale phrase is dead weight and hides that its cap stopped being scoped.
    const upstream = new Set(ids)
    expect(Object.keys(REGULATORY_SCOPE_PHRASE).filter((id) => !upstream.has(id))).toEqual([])
  })

  it('never opens a bracket of its own', () => {
    // The renderer prints the whole detail inside a pair; a second one would nest.
    const nested = Object.entries(REGULATORY_SCOPE_PHRASE).filter(([, phrase]) =>
      /[()]/.test(phrase)
    )
    expect(nested).toEqual([])
  })
})
