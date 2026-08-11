#!/usr/bin/env bun
// Converts a react-doctor --json report into SARIF so its findings reach the aggregated HTML.
// react-doctor has no SARIF reporter, and it is the only probe in `just audit-code` whose
// findings are fresh every run. Leaving it out left the report holding nothing but whatever
// biome and knip happened to catch.
// Paths in the report are relative to each project's own directory; they are rewritten
// repo-relative here so a finding lines up with the other tools' locations in the same report.

import { readFileSync, writeFileSync } from 'node:fs'
import { relative } from 'node:path'

type Diagnostic = {
  filePath: string
  plugin: string
  rule: string
  severity: string
  title: string
  message: string
  help?: string
  line?: number
  column?: number
  endLine?: number
}

type Report = {
  version?: string
  projects?: { directory: string; diagnostics?: Diagnostic[] }[]
}

const [input, output] = process.argv.slice(2)
if (!input || !output) {
  console.error('usage: react-doctor-sarif.ts <report.json> <out.sarif>')
  process.exit(2)
}

// SARIF only knows error/warning/note; anything unexpected lands on warning rather than
// being dropped, so a new severity name shows up in the report instead of vanishing.
const LEVELS: Record<string, string> = {
  error: 'error',
  warning: 'warning',
  warn: 'warning',
  info: 'note',
  note: 'note',
}

let report: Report
try {
  report = JSON.parse(readFileSync(input, 'utf8'))
} catch (err) {
  // A probe that crashed leaves an unreadable or absent file. Still emit a valid empty run:
  // audit-code checks the SARIF is non-empty, and a hard exit here would abort the audit.
  console.error(`react-doctor-sarif: cannot read ${input} (${(err as Error).message})`)
  report = {}
}

const rules = new Map<string, unknown>()
const results = []

for (const project of report.projects ?? []) {
  const prefix = relative(process.cwd(), project.directory)
  for (const d of project.diagnostics ?? []) {
    const ruleId = `${d.plugin}/${d.rule}`
    if (!rules.has(ruleId)) {
      rules.set(ruleId, {
        id: ruleId,
        shortDescription: { text: d.title },
        fullDescription: { text: d.help ?? d.title },
        defaultConfiguration: { level: LEVELS[d.severity] ?? 'warning' },
      })
    }
    results.push({
      ruleId,
      level: LEVELS[d.severity] ?? 'warning',
      message: { text: d.message },
      locations: [
        {
          physicalLocation: {
            artifactLocation: { uri: prefix ? `${prefix}/${d.filePath}` : d.filePath },
            region: {
              startLine: d.line ?? 1,
              ...(d.column ? { startColumn: d.column } : {}),
              ...(d.endLine ? { endLine: d.endLine } : {}),
            },
          },
        },
      ],
    })
  }
}

const sarif = {
  $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
  version: '2.1.0',
  runs: [
    {
      tool: {
        driver: {
          name: 'react-doctor',
          ...(report.version ? { version: report.version } : {}),
          informationUri: 'https://github.com/millionco/react-doctor',
          rules: [...rules.values()],
        },
      },
      results,
    },
  ],
}

writeFileSync(output, JSON.stringify(sarif, null, 2))
console.log(`react-doctor-sarif: ${results.length} finding(s) → ${output}`)
