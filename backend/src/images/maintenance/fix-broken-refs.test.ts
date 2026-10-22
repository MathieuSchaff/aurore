import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'bun:test'

import { imageMappingTarget } from './repair-plan'

const directories: string[] = []
const databaseUrl = 'invalid://localhost/image-repair-test'
const target = imageMappingTarget(
  databaseUrl,
  {
    hostname: 'storage.example.test',
    zone: 'test',
    prefix: 'products/',
    cdnBase: 'https://cdn.example.test',
  },
  'test'
)

afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

function runMapping(plan: unknown, options: string[] = []) {
  const directory = mkdtempSync(join(tmpdir(), 'aurore-image-repair-cli-'))
  directories.push(directory)
  writeFileSync(join(directory, 'image-mapping.json'), JSON.stringify(plan))
  return spawnSync(
    process.execPath,
    ['--no-env-file', join(import.meta.dir, 'fix-broken-refs.ts'), ...options],
    {
      cwd: directory,
      encoding: 'utf8',
      env: {
        DATABASE_URL: databaseUrl,
        IMAGE_OUTPUT_DIR: directory,
        IMAGE_MAINTENANCE_TARGET: 'test',
        BUNNY_STORAGE_HOSTNAME: 'storage.example.test',
        BUNNY_STORAGE_ZONE: 'test',
        BUNNY_STORAGE_PREFIX: 'products/',
        BUNNY_STORAGE_PASSWORD: 'test-password',
        IMAGE_CDN_BASE: 'https://cdn.example.test',
      },
      timeout: 5000,
    }
  )
}

describe('image repair CLI', () => {
  it('rejects copy-capable version 2 plans before opening the DB even with --apply', () => {
    const result = runMapping(
      {
        version: 2,
        target,
        renames: [
          {
            slug: 'a',
            oldUrl: 'https://cdn.example.test/products/old.webp',
            oldFile: 'old.webp',
            newFile: 'a-recovered-123.webp',
          },
        ],
        nullifies: [],
      },
      ['--apply']
    )

    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Unsupported image mapping; run image-build-mapping again.')
    expect(result.stdout).toBe('')
  })

  it('previews version 3 nullifications without opening the DB or contacting storage', () => {
    const result = runMapping({
      version: 3,
      target,
      nullifies: [
        {
          slug: 'a',
          oldUrl: 'https://cdn.example.test/products/missing.webp',
          oldFile: 'missing.webp',
        },
      ],
    })

    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toContain('NULLIFY a if the source is still missing')
    expect(result.stdout).toContain('DRY RUN')
    expect(result.stdout).not.toContain('COPY')
  })
})
