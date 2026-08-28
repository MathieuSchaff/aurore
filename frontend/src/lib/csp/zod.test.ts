import { describe, expect, it } from 'vitest'

import { ZOD_CSP_CONFIG_SCRIPT } from './zod'

describe('ZOD_CSP_CONFIG_SCRIPT', () => {
  it('preconfigures Zod without replacing an existing global config', () => {
    const config = { localeError: 'keep' }
    const target = { __zod_globalConfig: config }

    Function('globalThis', ZOD_CSP_CONFIG_SCRIPT)(target)

    expect(target.__zod_globalConfig).toBe(config)
    expect(target.__zod_globalConfig).toEqual({ localeError: 'keep', jitless: true })
  })
})
