#!/usr/bin/env bun
/**
 * rebuild-imported-products.ts — Full rerunnable rebuild of imported product seeds.
 *
 * This orchestrates the technical import pipeline:
 *   1. remove previously generated *.atida.seed.ts / *.pharmashop.seed.ts files
 *   2. regenerate output/candidates from Atida + Pharmashop sources
 *   3. auto-tag candidates and infer key ingredients
 *   4. import candidates back into data/products/
 *   5. refresh the generated audit report
 *
 * Usage:
 *   bun run backend/src/db/seed/scripts/rebuild-imported-products.ts
 *   bun run backend/src/db/seed/scripts/rebuild-imported-products.ts --apply
 */

import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const APPLY = process.argv.includes('--apply')

const PROJECT_ROOT = join(import.meta.dir, '../../../../..')

interface PipelineStep {
  name: string
  script: string
  dryRunArgs: string[]
  applyArgs: string[]
}

const STEPS: PipelineStep[] = [
  {
    name: 'Reset generated imported product seeds',
    script: 'reset-imported-products.ts',
    dryRunArgs: [],
    applyArgs: ['--apply'],
  },
  {
    name: 'Regenerate Atida candidates',
    script: 'migrate-output.ts',
    dryRunArgs: [],
    applyArgs: ['--apply', '--force'],
  },
  {
    name: 'Regenerate Pharmashop candidates',
    script: 'migrate-pharmashop.ts',
    dryRunArgs: [],
    applyArgs: ['--apply', '--force'],
  },
  {
    name: 'Auto-tag candidates',
    script: 'auto-tag.ts',
    dryRunArgs: ['--candidates'],
    applyArgs: ['--candidates', '--write'],
  },
  {
    name: 'Infer key ingredients',
    script: 'infer-key-ingredients.ts',
    dryRunArgs: [],
    applyArgs: ['--apply'],
  },
  {
    name: 'Import candidates into product seeds',
    script: 'import-candidates.ts',
    dryRunArgs: [],
    applyArgs: ['--apply'],
  },
  {
    name: 'Audit imported product seeds',
    script: 'audit-imported-products.ts',
    dryRunArgs: [],
    applyArgs: ['--write'],
  },
]

function runStep(step: PipelineStep, index: number): void {
  const args = APPLY ? step.applyArgs : step.dryRunArgs
  const scriptPath = join(import.meta.dir, step.script)
  const command = [process.execPath, 'run', scriptPath, ...args]

  console.log('')
  console.log(`── ${index + 1}/${STEPS.length} ${step.name}`)
  console.log(`$ bun run ${scriptPath} ${args.join(' ')}`.trimEnd())

  const result = spawnSync(command[0], command.slice(1), {
    cwd: PROJECT_ROOT,
    env: process.env,
    stdio: 'inherit',
  })

  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function main(): void {
  console.log(`rebuild-imported-products — ${APPLY ? 'APPLY' : 'DRY-RUN'}`)
  if (!APPLY) {
    console.log(
      'Dry-run mode executes each underlying script in dry-run mode; pass --apply to rebuild files.'
    )
  }

  STEPS.forEach(runStep)

  console.log('')
  console.log(`✓ rebuild-imported-products finished (${APPLY ? 'APPLY' : 'DRY-RUN'})`)
}

main()
