import { spawnSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'bun:test'

const repoRoot = resolve(import.meta.dir, '../../..')
const just = Bun.which('just')
const fixtures: string[] = []

afterEach(() => {
  for (const path of fixtures.splice(0)) rmSync(path, { recursive: true, force: true })
})

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), 'aurore-ops-recipes-'))
  fixtures.push(root)
  const bin = join(root, 'bin')
  mkdirSync(bin)
  mkdirSync(join(root, 'scripts/just'), { recursive: true })
  for (const file of ['ops.just', 'dev.just', 'db.just', '_vars.just', '_lib.sh']) {
    cpSync(join(repoRoot, 'scripts/just', file), join(root, 'scripts/just', file))
  }
  writeFileSync(
    join(root, 'justfile'),
    "set script-interpreter := ['bash', '-euo', 'pipefail']\nimport 'scripts/just/ops.just'\nimport 'scripts/just/db.just'\ncatalog-fix-tag-domain WRITE:\n    @exit 97\naudit-db:\n    @exit 97\n"
  )
  writeFileSync(join(root, '.env.prod'), '')
  const calls = join(root, 'calls.log')
  writeFileSync(calls, '')
  for (const name of ['docker', 'git', 'just', 'curl', 'sleep']) {
    writeFileSync(
      join(bin, name),
      `#!/bin/bash
printf '%s %s\\n' '${name}' "$*" >> "$CALL_LOG"
case '${name}: '$* in
  'docker: ps '*) printf '%s\\n' "\${FIXTURE_DB_ID:-}" ;;
  'docker: inspect '*) printf '%s\\n' "\${FIXTURE_COMPOSE_FILES:-}" ;;
  'git: rev-parse '*) printf 'fixture-sha\\n' ;;
  'docker: compose '*)
    case "$*" in
      *pg_dump*) cat "$FIXTURE_DUMP"; exit "\${FIXTURE_DUMP_STATUS:-0}" ;;
      *psql*) printf 'fixture-owner\\n' ;;
    esac ;;
esac
`,
      { mode: 0o755 }
    )
  }
  return {
    root,
    run(env: Record<string, string | undefined> = {}, input = 'DEPLOY\n', recipe = 'deploy') {
      if (!just) throw new Error('Recipe tests require just on PATH')
      const result = spawnSync(
        just,
        ['--no-dotenv', '--justfile', join(root, 'justfile'), recipe],
        {
          cwd: root,
          input,
          encoding: 'utf8',
          timeout: 10_000,
          env: {
            ...process.env,
            PATH: `${bin}:${process.env.PATH}`,
            TARGET: 'dev',
            CALL_LOG: calls,
            FIXTURE_DB_ID: 'fixture-db',
            FIXTURE_COMPOSE_FILES: 'infra/docker/compose/docker-compose.prod.yml',
            ...env,
          },
        }
      )
      return { ...result, calls: readFileSync(calls, 'utf8') }
    },
  }
}

function createSnapshotFixture(content: string) {
  const fixture = createFixture()
  const target = join(fixture.root, 'backend/src/db/snapshot/catalogue.sql')
  mkdirSync(join(fixture.root, 'backend/src/db/snapshot'), { recursive: true })
  writeFileSync(target, 'previous snapshot\n')
  const dump = join(fixture.root, 'fixture.sql')
  writeFileSync(dump, content)
  return {
    target,
    run: (env: Record<string, string | undefined> = {}) =>
      fixture.run({ FIXTURE_DUMP: dump, ...env }, '', 'db-catalogue-snapshot'),
  }
}

describe('catalogue snapshot recipe', () => {
  it.each(['seed.local', 'seed.com', 'demo.local'])(
    'accepts the allowed %s domain and preserves dump normalization',
    (domain) => {
      const content = `\\restrict fixture-token\nINSERT INTO articles VALUES ('fixture-owner', 'fixture@${domain}');\n\\unrestrict fixture-token\n`
      const fixture = createSnapshotFixture(content)

      const result = fixture.run()

      expect(result.error).toBeUndefined()
      expect(result.status, result.stderr).toBe(0)
      expect(readFileSync(fixture.target, 'utf8')).toBe(
        `\\restrict AuroreSnapshotToken\nINSERT INTO articles VALUES ('__OWNER_ID__', 'fixture@${domain}');\n\\unrestrict AuroreSnapshotToken\n`
      )
      expect(existsSync(`${fixture.target}.tmp`)).toBe(false)
    }
  )

  it('removes a partial dump and preserves the previous snapshot when pg_dump fails', () => {
    const fixture = createSnapshotFixture('partial fixture dump\n')

    const result = fixture.run({ FIXTURE_DUMP_STATUS: '1' })

    expect(result.error).toBeUndefined()
    expect(result.status).not.toBe(0)
    expect(readFileSync(fixture.target, 'utf8')).toBe('previous snapshot\n')
    expect(existsSync(`${fixture.target}.tmp`)).toBe(false)
  })

  it('rejects a lookalike seed domain', () => {
    const fixture = createSnapshotFixture(
      "INSERT INTO articles VALUES ('private@seed.local.example');\n"
    )

    const result = fixture.run()

    expect(result.status).not.toBe(0)
    expect(readFileSync(fixture.target, 'utf8')).toBe('previous snapshot\n')
    expect(existsSync(`${fixture.target}.tmp`)).toBe(false)
  })

  it('rejects a non-seed address without replacing the previous snapshot', () => {
    const fixture = createFixture()
    const target = join(fixture.root, 'backend/src/db/snapshot/catalogue.sql')
    mkdirSync(join(fixture.root, 'backend/src/db/snapshot'), { recursive: true })
    writeFileSync(target, 'previous snapshot\n')
    const dump = join(fixture.root, 'fixture.sql')
    writeFileSync(dump, "INSERT INTO articles VALUES ('private@example.test');\n")

    const result = fixture.run({ FIXTURE_DUMP: dump }, '', 'db-catalogue-snapshot')

    expect(result.error).toBeUndefined()
    expect(result.status).not.toBe(0)
    expect(readFileSync(target, 'utf8')).toBe('previous snapshot\n')
    expect(existsSync(`${target}.tmp`)).toBe(false)
    expect(result.calls, result.stderr).toContain('pg_dump')
  })
})

describe('deploy recipe guard', () => {
  it.each([
    { label: 'no running database', env: { FIXTURE_DB_ID: '' } },
    {
      label: 'a development database',
      env: { FIXTURE_COMPOSE_FILES: 'infra/docker/compose/docker-compose.dev.yml' },
    },
  ])('refuses $label before syncing Git or touching Compose', ({ env }) => {
    const result = createFixture().run(env)

    expect(result.error).toBeUndefined()
    expect(result.status).not.toBe(0)
    expect(result.calls).not.toContain('git ')
    expect(result.calls).not.toContain('docker compose ')
  })

  it('keeps the confirmed production workflow in a production context', () => {
    const result = createFixture().run()

    expect(result.error).toBeUndefined()
    expect(result.status, result.stderr).toBe(0)
    expect(result.calls).toContain('git fetch origin')
    expect(result.calls).toContain('git reset --hard origin/main')
    expect(result.calls).toContain('docker compose ')
    expect(result.calls).toContain('just prod-migrate')
    expect(result.calls).toContain('just prod-health')
  })

  it('aborts before Git and Compose when DEPLOY is not confirmed', () => {
    const result = createFixture().run({}, 'no\n')

    expect(result.error).toBeUndefined()
    expect(result.status).not.toBe(0)
    expect(result.calls).not.toContain('git ')
    expect(result.calls).not.toContain('docker compose ')
  })

  it('refuses a development checkout before syncing Git or touching Compose', () => {
    const fixture = createFixture()
    writeFileSync(join(fixture.root, '.env.dev'), '')

    const result = fixture.run()

    expect(result.error).toBeUndefined()
    expect(result.status).not.toBe(0)
    expect(result.calls).not.toContain('git ')
    expect(result.calls).not.toContain('docker compose ')
  })
})
