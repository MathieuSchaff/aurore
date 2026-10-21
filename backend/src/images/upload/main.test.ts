import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'bun:test'

const directories: string[] = []

afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

function runBatch(options: string[]) {
  const directory = mkdtempSync(join(tmpdir(), 'aurore-upload-cli-'))
  directories.push(directory)
  const file = join(directory, 'pixel.webp')
  writeFileSync(
    file,
    Buffer.from('UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA', 'base64')
  )
  const batch = join(directory, 'jobs.json')
  writeFileSync(
    batch,
    JSON.stringify([
      { slug: 'first', file },
      { slug: 'second', file },
    ])
  )
  return spawnSync(
    process.execPath,
    [
      '--no-env-file',
      join(import.meta.dir, 'main.ts'),
      '--batch',
      batch,
      '--dry',
      '--no-staged',
      ...options,
    ],
    {
      cwd: directory,
      encoding: 'utf8',
      env: { IMAGE_CDN_BASE: 'https://cdn.example.test' },
      timeout: 5000,
    }
  )
}

describe('image upload CLI concurrency', () => {
  it.each(['oops', 'NaN', 'Infinity', '0', '-1', '1.5', '33', '', undefined])(
    'rejects invalid concurrency %j before processing the batch',
    (value) => {
      const result = runBatch(['--concurrency', ...(value === undefined ? [] : [value])])

      // NaN creates zero workers and used to report success without uploading any image
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('--concurrency')
      expect(result.stdout).toBe('')
    }
  )

  it.each(['default', '1', '4', '32'])('processes every image with concurrency %s', (value) => {
    const result = runBatch(value === 'default' ? [] : ['--concurrency', value])

    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toContain('done: ok=2/2, failed=0')
  })
})
