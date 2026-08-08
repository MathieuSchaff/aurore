#!/usr/bin/env bun
// Freezes the list of `c.get('anonDb')` sites under backend/src against scripts/anon-db-allowlist.json.
// anonDb is the anonymous view of the same app_runtime role as requestDb: a new site never escalates
// privileges, it under-scopes: a read that silently loses personalisation, or a write that leaves the
// request transaction. Invisible at runtime and to the type checker.
// Grain is file + count, not file:line: line numbers churn on every edit and would make the list rot.
// Tests are scanned too: a harness reaching for the anonymous view is the same decision.

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

// Anchored on this file, not on cwd: a run from backend/ would otherwise scan nothing and
// report every allowlisted file as gone.
const REPO_ROOT = join(dirname(import.meta.path), '..')
const SCAN_ROOT = 'backend/src'
const ALLOWLIST_PATH = join(REPO_ROOT, 'scripts/anon-db-allowlist.json')
const PATTERN = /c\.get\(\s*['"]anonDb['"]\s*\)/g

const GROUPS: Record<string, string> = {
  A: 'structural — opens the request transaction',
  B: 'pre-identity auth — no identity exists yet to bind into the GUCs',
  C: 'system probe — no bearer, no personalisation possible',
  D: 'anonymous read behind an explicit `userId ? getRlsDb(c) : anonDb` branch',
  E: 'unconditional anonymous read — the router mounts no optionalJwtAuth',
}
const UNCLASSIFIED = '?'

type Entry = { file: string; count: number; groups: string[] }

async function scan(): Promise<Map<string, number>> {
  const found = new Map<string, number>()
  const glob = new Bun.Glob(`${SCAN_ROOT}/**/*.ts`)
  for await (const path of glob.scan({ cwd: REPO_ROOT, absolute: true })) {
    const matches = readFileSync(path, 'utf8').match(PATTERN)
    if (matches) found.set(relative(REPO_ROOT, path), matches.length)
  }
  return found
}

function readAllowlist(): Entry[] {
  try {
    return JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8')).sites
  } catch {
    return []
  }
}

// Hand-rolled so one site is one line: JSON.stringify would spread every entry over six
// lines and bury the actual change in a diff.
function writeAllowlist(entries: Entry[]): void {
  const sorted = [...entries].sort((a, b) => a.file.localeCompare(b.file))
  const total = sorted.reduce((sum, e) => sum + e.count, 0)
  const sites = sorted.map(
    (e) =>
      `    { "file": ${JSON.stringify(e.file)}, "count": ${e.count}, "groups": ${JSON.stringify(e.groups)} }`
  )
  const groups = Object.entries(GROUPS).map(
    ([key, why]) => `    ${JSON.stringify(key)}: ${JSON.stringify(why)}`
  )
  writeFileSync(
    ALLOWLIST_PATH,
    `{\n  "total": ${total},\n  "groups": {\n${groups.join(',\n')}\n  },\n  "sites": [\n${sites.join(',\n')}\n  ]\n}\n`
  )
}

// Usage: bun scripts/anon-db-gate.ts [--update]
const update = process.argv.includes('--update')
const found = await scan()
const allowed = new Map(readAllowlist().map((e) => [e.file, e]))
const files = [...new Set([...found.keys(), ...allowed.keys()])].sort()

const problems: string[] = []
const next: Entry[] = []

for (const file of files) {
  const actual = found.get(file) ?? 0
  const entry = allowed.get(file)
  if (actual > 0) next.push({ file, count: actual, groups: entry?.groups ?? [UNCLASSIFIED] })

  if (!entry) {
    problems.push(`NEW      ${file} — ${actual} site(s) not in the allowlist`)
  } else if (actual === 0) {
    problems.push(`GONE     ${file} — allowlisted but no site left; the list is stale`)
  } else if (actual > entry.count) {
    problems.push(`ADDED    ${file} — ${entry.count} allowed, ${actual} found`)
  } else if (actual < entry.count) {
    problems.push(`REMOVED  ${file} — ${entry.count} allowed, ${actual} found; the list is stale`)
  }
}

const total = [...found.values()].reduce((sum, n) => sum + n, 0)

if (update) {
  writeAllowlist(next)
  const unclassified = next.filter((e) => e.groups.includes(UNCLASSIFIED))
  console.log(`anon-db-gate: allowlist rewritten — ${next.length} file(s), ${total} site(s).`)
  if (unclassified.length) {
    console.error(
      `\nanon-db-gate: ${unclassified.length} file(s) left unclassified. Replace "${UNCLASSIFIED}" with a group before committing:`
    )
    for (const e of unclassified) console.error(`  ${e.file}`)
    for (const [key, why] of Object.entries(GROUPS)) console.error(`  ${key} = ${why}`)
    process.exit(1)
  }
  process.exit(0)
}

// An unknown group is a divergence in its own right: "?" is what --update parks a new file on,
// so accepting it would let a baseline refresh launder a new site into the allowlist unread
for (const entry of allowed.values()) {
  const unknown = entry.groups.filter((g) => !(g in GROUPS))
  if (unknown.length)
    problems.push(
      `UNGROUPED ${entry.file} — group ${unknown.join(', ')} is not one of ${Object.keys(GROUPS).join(', ')}`
    )
}

if (problems.length === 0) {
  console.log(
    `anon-db-gate: clean — ${total} site(s) across ${found.size} file(s), all allowlisted.`
  )
  process.exit(0)
}

console.error('anon-db-gate: the anonDb surface changed.\n')
for (const p of problems) console.error(`  ${p}`)
console.error(`
Decide before allowlisting: does this site need the anonymous view, or has it lost
the request transaction? The GROUPS table in scripts/anon-db-gate.ts describes each case.

Once the answer is "anonymous is right": just anon-db-gate --update, then set the group.`)
process.exit(1)
