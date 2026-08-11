#!/usr/bin/env bun
// Builds .audit-out/code/report.html from everything `just audit-code` leaves on disk.
//
// Replaces `sarif html` (sarif-tools), which grouped findings by rule and dropped the location:
// the page named a rule and a count and nothing else, so no finding could be opened from it. It
// also truncated every label mid-sentence and spent half the page on a one-slice pie chart.
// Doing it here also drops the last reason the *visual* audit needed a tool outside the repo.
//
// Reads sarif/ (current), sarif-full/ (fallow without its baseline, the standing debt behind a
// "0 regressions"), raw/ (probes with no machine-readable format) and status.json (exit codes).

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'

type Level = 'error' | 'warning' | 'note'

type Finding = {
  tool: string
  ruleId: string
  level: Level
  message: string
  file: string
  line: number
  column?: number
  help?: string
  helpUri?: string
}

// Only the SARIF fields this report reads. Everything else in the spec is left untyped rather
// than modelled: the probes emit valid documents, and a partial shape is enough to consume them.
type SarifRule = {
  id: string
  shortDescription?: { text?: string }
  fullDescription?: { text?: string }
  helpUri?: string
}

type SarifDoc = {
  runs?: {
    tool?: { driver?: { rules?: SarifRule[] } }
    results?: {
      ruleId?: string
      level?: string
      message?: { text?: string }
      locations?: {
        physicalLocation?: {
          artifactLocation?: { uri?: string }
          region?: { startLine?: number; startColumn?: number }
        }
      }[]
    }[]
  }[]
}

const LEVELS: Level[] = ['error', 'warning', 'note']

const outDir = process.argv[2] ?? '.audit-out/code'
const repoRoot = process.cwd()

type SarifResult = NonNullable<NonNullable<SarifDoc['runs']>[number]['results']>[number]

function toFinding(result: SarifResult, tool: string, rules: Map<string, SarifRule>): Finding {
  const loc = result.locations?.[0]?.physicalLocation
  const ruleId = result.ruleId ?? 'unknown'
  const rule = rules.get(ruleId)
  return {
    tool,
    ruleId,
    level: LEVELS.find((l) => l === result.level) ?? 'warning',
    message: result.message?.text ?? '',
    file: loc?.artifactLocation?.uri ?? '(no location)',
    line: loc?.region?.startLine ?? 0,
    column: loc?.region?.startColumn,
    help: rule?.fullDescription?.text ?? rule?.shortDescription?.text,
    helpUri: rule?.helpUri,
  }
}

function readSarifFile(path: string, tool: string): Finding[] {
  let doc: SarifDoc
  try {
    doc = JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    // A probe killed mid-write leaves truncated JSON. Skipping keeps the other tools' findings
    // in the report; the probe's own failure is already carried by status.json.
    return []
  }
  return (doc.runs ?? []).flatMap((run) => {
    const rules = new Map((run.tool?.driver?.rules ?? []).map((r) => [r.id, r]))
    return (run.results ?? []).map((result) => toFinding(result, tool, rules))
  })
}

function readSarifDir(dir: string): Finding[] {
  if (!existsSync(dir)) return []
  return (
    readdirSync(dir)
      .filter((f) => f.endsWith('.sarif'))
      // Keyed on the filename, not on the SARIF driver name: both fallow probes call themselves
      // "fallow", which would merge health and dupes into one chip that no baseline explains.
      .flatMap((name) => readSarifFile(join(dir, name), basename(name, '.sarif')))
  )
}

// Line is out of the fingerprint on purpose: an edit above a finding shifts every line below it,
// which would make the same finding read as a different one. The message is in, because fallow
// encodes the score there: a function that got worse is not the finding it was.
const fingerprint = (f: Finding) => `${f.ruleId}|${f.file}|${f.message}`

const current = readSarifDir(join(outDir, 'sarif'))

// Standing debt = what fallow reports without its baseline, minus what the baselined run already
// surfaced as a regression. Without this the report would say "fallow: 0" with no way to tell a
// clean codebase from an accepted backlog.
const currentPrints = new Set(current.map(fingerprint))
const standing = readSarifDir(join(outDir, 'sarif-full')).filter(
  (f) => !currentPrints.has(fingerprint(f))
)

type Status = { probe: string; exit: number }
let statuses: Status[] = []
const statusPath = join(outDir, 'status.json')
if (existsSync(statusPath)) {
  try {
    statuses = JSON.parse(readFileSync(statusPath, 'utf8'))
  } catch {
    statuses = []
  }
}

// Every probe the audit runs, whether or not it produced findings. A probe that reports nothing
// must still appear: an absent chip reads as "did not run", which is how a green fallow gate came
// to look like a broken report.
const PROBES: { key: string; label: string; kind: 'sarif' | 'text'; note?: string }[] = [
  { key: 'biome', label: 'biome', kind: 'sarif' },
  { key: 'knip', label: 'knip', kind: 'sarif' },
  { key: 'react-doctor', label: 'react-doctor', kind: 'sarif' },
  { key: 'fallow-health', label: 'fallow-health', kind: 'sarif', note: 'baselined' },
  { key: 'fallow-dupes', label: 'fallow-dupes', kind: 'sarif', note: 'baselined' },
  { key: 'tsc', label: 'tsc -b (types)', kind: 'text' },
  { key: 'cycles', label: 'madge (import cycles)', kind: 'text' },
  { key: 'anon-db-gate', label: 'anon-db-gate (anonDb surface)', kind: 'text' },
]

// fallow's SARIF export stops at the complexity findings and the refactoring targets. The score,
// the vital signs and the churn-weighted hotspots only exist in its JSON, and the hotspots are the
// part that ranks: complexity alone says a file is hard, churn says it is also being edited.
type Health = {
  health_score?: { score: number; grade: string; penalties: Record<string, number> }
  // Nested objects live in here too (counts, unit_size_profile); only the scalars are rendered.
  vital_signs?: Record<string, unknown>
  hotspots?: {
    path: string
    score: number
    commits: number
    fan_in: number
    trend: string
    complexity_density: number
  }[]
  hotspot_summary?: { since: string; min_commits: number }
  // --css puts its 3 localised rules in the SARIF like any other finding. These two blocks are
  // what it computes on the side and exports nowhere else.
  styling_health?: {
    score: number
    grade: string
    penalties: Record<string, number>
    confidence: string
    confidence_reason?: string
  }
  css_analytics?: {
    unreferenced_css_classes?: { class: string; path: string; line: number }[]
  }
  // Kept out of sarif-full/ on purpose: 162 styling findings buried the 154 code ones. Here they
  // still carry the severity, confidence and disposition the SARIF export drops.
  styling_findings?: {
    code: string
    sub_kind?: string
    path: string
    line: number
    value?: string
    confidence?: string
    agent_disposition?: string
  }[]
}

let health: Health = {}
const healthPath = join(outDir, 'json', 'fallow-health.json')
if (existsSync(healthPath)) {
  try {
    health = JSON.parse(readFileSync(healthPath, 'utf8'))
  } catch {
    health = {}
  }
}

const rawText = (key: string) =>
  existsSync(join(outDir, 'raw', `${key}.txt`))
    ? readFileSync(join(outDir, 'raw', `${key}.txt`), 'utf8').trim()
    : ''

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  )

const payload = current.map((f) => ({
  ...f,
  abs: f.file === '(no location)' ? '' : resolve(repoRoot, f.file),
}))

const exitOf = new Map(statuses.map((s) => [s.probe, s.exit]))
const countByTool = new Map<string, number>()
for (const f of payload) countByTool.set(f.tool, (countByTool.get(f.tool) ?? 0) + 1)

const probes = PROBES.map((p) => {
  const exit = exitOf.get(p.key)
  return {
    ...p,
    exit,
    count: countByTool.get(p.key) ?? 0,
    // "ran and found nothing" and "never ran" look identical from the findings alone, and only
    // the first is good news. status.json is the only thing that tells them apart.
    state: exit === undefined ? 'unknown' : exit === 0 ? 'clean' : 'failed',
    text: p.kind === 'text' ? rawText(p.key) : '',
  }
})

const HOTSPOT_LIMIT = 15
const hotspots = (health.hotspots ?? []).slice(0, HOTSPOT_LIMIT)
const hotspotRows = hotspots
  .map(
    (h) => `<tr>
      <td>${esc(h.path)}</td>
      <td class="num">${h.score.toFixed(1)}</td>
      <td class="num">${h.commits}</td>
      <td class="num">${h.fan_in}</td>
      <td class="num">${h.complexity_density?.toFixed(2) ?? ''}</td>
      <td>${esc(h.trend)}</td>
    </tr>`
  )
  .join('')

const score = health.health_score
const penalties = Object.entries(score?.penalties ?? {})
  .filter(([, v]) => v > 0)
  .sort((a, b) => b[1] - a[1])

const vitals = health.vital_signs
const VITALS: [string, string][] = [
  ['maintainability_avg', 'maintainability'],
  ['avg_cyclomatic', 'avg cyclomatic'],
  ['p90_cyclomatic', 'p90 cyclomatic'],
  ['duplication_pct', 'duplication %'],
  ['dead_file_pct', 'dead files %'],
  ['dead_export_pct', 'dead exports %'],
  ['circular_dep_count', 'circular deps'],
  ['unused_dep_count', 'unused deps'],
]

const styling = health.styling_health
const stylingPenalties = Object.entries(styling?.penalties ?? {})
  .filter(([, v]) => v > 0)
  .sort((a, b) => b[1] - a[1])

// Only the dead classes are surfaced out of css_analytics. Its two other cleanup lists are noise
// against this design system: unreferenced_keyframes misses any `animation:` shorthand carrying a
// var() or cubic-bezier() (which is all of them here, since durations and easings are tokenised),
// and unused_at_rules reads the `@layer a, b, c;` ordering statement as four dead layers.
// Grouped by rule and disposition rather than listed flat: `fix-confidently` and `verify-first`
// are two different pieces of work, and 162 rows of the same three rules read as one wall.
const stylingByCode = new Map<string, { n: number; disposition: string; confidence: string }>()
for (const f of health.styling_findings ?? []) {
  const key = f.sub_kind ?? f.code
  const seen = stylingByCode.get(key)
  if (seen) seen.n += 1
  else
    stylingByCode.set(key, {
      n: 1,
      disposition: f.agent_disposition ?? '',
      confidence: f.confidence ?? '',
    })
}
const stylingRows = [...stylingByCode.entries()]
  .sort((a, b) => b[1].n - a[1].n)
  .map(
    ([code, v]) =>
      `<tr><td><code>${esc(code)}</code></td><td class="num">${v.n}</td><td>${esc(v.disposition)}</td><td class="dim">${esc(v.confidence)}</td></tr>`
  )
  .join('')

const deadClasses = health.css_analytics?.unreferenced_css_classes ?? []
const deadClassRows = deadClasses
  .map(
    (c) =>
      `<tr><td><code>.${esc(c.class)}</code></td><td>${esc(c.path)}<span class="dim">:${c.line}</span></td></tr>`
  )
  .join('')

const hasMap = existsSync(join(outDir, 'map.html'))

const standingByFile = new Map<string, number>()
for (const f of standing) standingByFile.set(f.file, (standingByFile.get(f.file) ?? 0) + 1)
const standingRows = [...standingByFile.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([file, n]) => `<tr><td>${esc(file)}</td><td class="num">${n}</td></tr>`)
  .join('')

const failedProbes = statuses.filter((s) => s.exit !== 0).map((s) => s.probe)

// One stamp for both outputs, so report.html and summary.json cannot disagree about which run
// they came from.
const generatedAt = new Date().toISOString()
const stampShown = generatedAt.slice(0, 16).replace('T', ' ')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Code audit — ${stampShown}</title>
<style>
:root {
  color-scheme: light dark;
  --bg: light-dark(#fbfbfd, #16161a);
  --panel: light-dark(#fff, #1e1e24);
  --line: light-dark(#e3e3ea, #32323c);
  --text: light-dark(#1a1a1f, #e6e6ec);
  --dim: light-dark(#6a6a78, #9a9aab);
  --error: light-dark(#c0273b, #ff7a8a);
  --warning: light-dark(#a2680a, #f3b34a);
  --note: light-dark(#3a6ea5, #82b7ee);
  --new: light-dark(#0f7b52, #56d3a0);
}
* { box-sizing: border-box; }
body {
  margin: 0; padding: 2rem 1.5rem 5rem; background: var(--bg); color: var(--text);
  font: 14px/1.55 ui-sans-serif, system-ui, sans-serif;
}
main { max-width: 1180px; margin: 0 auto; }
h1 { font-size: 1.4rem; margin: 0 0 .25rem; }
h2 { font-size: 1rem; margin: 2.5rem 0 .75rem; }
.sub { color: var(--dim); margin: 0 0 1.5rem; }
.chips { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1rem; }
.chip {
  border: 1px solid var(--line); background: var(--panel); color: inherit;
  border-radius: 999px; padding: .3rem .8rem; font: inherit; cursor: pointer;
}
a.chip { text-decoration: none; }
.chip[aria-pressed="false"] { opacity: .35; }
.chip.failed { border-color: var(--error); }
.chip.unknown { border-style: dashed; }
.chip .n { color: var(--dim); margin-left: .4rem; }
.chip .n.failed { color: var(--error); }
.chip .n.clean { color: var(--new); }
.chip .note { color: var(--dim); font-size: .72rem; margin-left: .35rem; }
.toolbar { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; margin-bottom: 1.25rem; }
input[type=search], select {
  border: 1px solid var(--line); background: var(--panel); color: inherit;
  border-radius: 8px; padding: .45rem .7rem; font: inherit;
}
input[type=search] { flex: 1 1 16rem; }
label.toggle { display: inline-flex; gap: .35rem; align-items: center; color: var(--dim); }
.banner {
  border: 1px solid var(--line); border-left: 3px solid var(--warning);
  background: var(--panel); border-radius: 8px; padding: .7rem 1rem; margin-bottom: 1.25rem;
}
.group { border: 1px solid var(--line); border-radius: 10px; background: var(--panel); margin-bottom: .6rem; overflow: hidden; }
.group > summary { cursor: pointer; padding: .6rem .9rem; font-weight: 600; display: flex; gap: .6rem; align-items: baseline; }
.group > summary .n { color: var(--dim); font-weight: 400; }
.finding { display: grid; grid-template-columns: 4px 1fr; border-top: 1px solid var(--line); }
.finding .bar { background: var(--warning); }
.finding.error .bar { background: var(--error); }
.finding.note .bar { background: var(--note); }
.finding .body { padding: .55rem .9rem .7rem; }
.finding .top { display: flex; flex-wrap: wrap; gap: .5rem; align-items: baseline; }
.loc { font-family: ui-monospace, monospace; font-size: .82rem; color: inherit; text-decoration: none; border-bottom: 1px dotted var(--dim); }
.loc:hover { border-bottom-style: solid; }
.rule { font-family: ui-monospace, monospace; font-size: .78rem; color: var(--dim); }
.msg { margin: .25rem 0 0; }
.help { margin: .3rem 0 0; color: var(--dim); font-size: .88rem; }
.copy { border: 0; background: none; color: var(--dim); cursor: pointer; font: inherit; font-size: .78rem; padding: 0; }
.copy:hover { color: var(--text); }
table { border-collapse: collapse; width: 100%; font-size: .88rem; }
td, th { border-top: 1px solid var(--line); padding: .3rem .6rem; text-align: left; }
th { color: var(--dim); font-weight: 500; }
td.num, th.num { text-align: right; color: var(--dim); width: 4rem; }
td.dim, .dim { color: var(--dim); }
table.hotspots { border: 1px solid var(--line); border-radius: 10px; background: var(--panel); }
.score { display: flex; gap: 1.25rem; align-items: center; border: 1px solid var(--line); border-radius: 10px; background: var(--panel); padding: 1rem 1.25rem; }
.grade { display: grid; place-items: center; min-width: 5rem; }
.grade b { font-size: 2.4rem; line-height: 1; }
.grade span { color: var(--dim); font-size: .85rem; }
.grade-a b { color: var(--new); }
.grade-b b, .grade-c b { color: var(--warning); }
.grade-d b, .grade-e b, .grade-f b { color: var(--error); }
.penalties, .vitals { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: .4rem .9rem; }
.penalties li { border: 1px solid var(--line); border-radius: 999px; padding: .15rem .7rem; font-size: .85rem; }
.penalties .num { color: var(--error); margin-left: .4rem; }
.vitals { margin-top: .8rem; gap: .5rem; }
.vitals li { border: 1px solid var(--line); border-radius: 8px; background: var(--panel); padding: .35rem .7rem; font-size: .85rem; }
.vitals span { color: var(--dim); margin-right: .45rem; }
pre { margin: 0; padding: .8rem .9rem; overflow-x: auto; font-size: .8rem; }
details.raw { border: 1px solid var(--line); border-radius: 10px; background: var(--panel); margin-bottom: .6rem; }
details.raw > summary { cursor: pointer; padding: .6rem .9rem; font-weight: 600; }
.empty { color: var(--dim); padding: 1.5rem 0; }
</style>
</head>
<body>
<main>
<h1>Code audit</h1>
<p class="sub">${stampShown} UTC · ${payload.length} finding${payload.length === 1 ? '' : 's'} · ${probes.length} probes${hasMap ? ' · <a href="map.html">codebase map</a>' : ''}</p>

${
  failedProbes.length
    ? `<div class="banner"><strong>${failedProbes.length} probe(s) exited non-zero:</strong> ${esc(failedProbes.join(', '))}. knip and react-doctor exit 1 on findings, so for those two this is expected and the findings are below. For any other probe it means the run died and reported nothing — an empty section from it is not a clean result. <code>raw/&lt;probe&gt;.txt</code> settles which.</div>`
    : ''
}

<div class="chips">
${probes
  .map((p) => {
    const badge =
      p.kind === 'text'
        ? p.state === 'failed'
          ? 'failed'
          : p.state === 'clean'
            ? 'clean'
            : 'not run'
        : String(p.count)
    const title =
      p.state === 'unknown'
        ? 'no status recorded — run `just audit-code`, not `just audit-report` alone'
        : p.state === 'failed'
          ? 'exited non-zero'
          : 'exited clean'
    // Text probes have nothing to filter, so their chip jumps to the raw output instead of
    // toggling, and stays a link, since aria-pressed on a non-button is meaningless.
    const target =
      p.kind === 'text' ? `href="#raw-${p.key}"` : `data-tool="${p.key}" aria-pressed="true"`
    const tag = p.kind === 'text' ? 'a' : 'button'
    return `<${tag} class="chip ${p.state}" ${target} title="${esc(title)}">${esc(p.label)}${p.note ? `<span class="note">${p.note}</span>` : ''}<span class="n ${p.kind === 'text' ? p.state : ''}">${badge}</span></${tag}>`
  })
  .join('\n')}
</div>

<div class="toolbar">
  <input type="search" id="q" placeholder="Filter by file, rule or message…" autocomplete="off">
  <select id="group">
    <option value="file">Group by file</option>
    <option value="rule">Group by rule</option>
    <option value="tool">Group by tool</option>
  </select>
  ${LEVELS.map(
    (l) =>
      `<label class="toggle"><input type="checkbox" class="lvl" value="${l}" checked> ${l}</label>`
  ).join('')}
</div>

<div id="list"></div>

${
  score
    ? `<h2>fallow — health score</h2>
<div class="score">
  <div class="grade grade-${score.grade[0].toLowerCase()}"><b>${score.grade}</b><span>${score.score.toFixed(1)}</span></div>
  <div>
    <p class="sub">Penalties against 100, worst first. A category at zero is not listed.</p>
    <ul class="penalties">${penalties.map(([k, v]) => `<li>${esc(k.replace(/_/g, ' '))}<span class="num">−${v}</span></li>`).join('')}</ul>
  </div>
</div>
${
  vitals
    ? `<ul class="vitals">${VITALS.filter(([k]) => vitals[k] !== undefined)
        .map(([k, label]) => `<li><span>${esc(label)}</span><b>${vitals[k]}</b></li>`)
        .join('')}</ul>`
    : ''
}`
    : ''
}

${
  hotspots.length
    ? `<h2>fallow — hotspots</h2>
<p class="sub">Complexity crossed with git churn over ${esc(health.hotspot_summary?.since ?? 'the recent history')}
(${health.hotspot_summary?.min_commits ?? '?'} commits minimum). Complexity alone says a file is hard to change;
this says it is also being changed. Top ${hotspots.length} of ${health.hotspots?.length ?? 0}. fallow's
suggested action is the same two words on every row — refactor and add tests — so it is not shown.</p>
<table class="hotspots">
  <thead><tr><th>File</th><th class="num">Score</th><th class="num">Commits</th><th class="num">Fan-in</th><th class="num">Density</th><th>Trend</th></tr></thead>
  <tbody>${hotspotRows}</tbody>
</table>`
    : ''
}

${
  styling
    ? `<h2>fallow — styling health</h2>
<div class="score">
  <div class="grade grade-${styling.grade[0].toLowerCase()}"><b>${styling.grade}</b><span>${styling.score.toFixed(1)}</span></div>
  <div>
    <p class="sub">Scored apart from the code health score, and it gates nothing — read it as a
    design-system credibility signal. Confidence ${esc(styling.confidence)}${styling.confidence_reason ? ` (${esc(styling.confidence_reason)})` : ''}.
    <code>token_erosion</code> counts hardcoded values that a <code>var(--*)</code> would carry.</p>
    <ul class="penalties">${stylingPenalties.map(([k, v]) => `<li>${esc(k.replace(/_/g, ' '))}<span class="num">−${v}</span></li>`).join('')}</ul>
  </div>
</div>
${
  stylingRows
    ? `<table>
  <thead><tr><th>Rule</th><th class="num">Count</th><th>Disposition</th><th>Confidence</th></tr></thead>
  <tbody>${stylingRows}</tbody>
</table>`
    : ''
}`
    : ''
}

${
  deadClasses.length
    ? `<h2>fallow — CSS classes with no markup</h2>
<p class="sub">${deadClasses.length} class(es) defined in CSS and matched by no <code>className</code> in the
project. Candidates, not proof: a class built at runtime (<code>\`card--\${variant}\`</code>) is invisible to a
static scan. These are the one cleanup list in <code>css_analytics</code> worth reading — the keyframe and
<code>@layer</code> lists it also carries are false positives here.</p>
<details class="raw"><summary>${deadClasses.length} candidate(s)</summary><table>${deadClassRows}</table></details>`
    : ''
}

<h2>fallow — standing debt</h2>
<p class="sub">The fallow probes run against <code>.fallow/*.json</code>, so the findings above are
regressions only. These ${standing.length} are the backlog those baselines accept: not new, not
gone. <code>just fallow-baseline</code> re-cuts them after a cleanup. Styling findings are not in
here: no baseline has a slot for them, so they would never leave — they have their own section
above.</p>
${
  standing.length
    ? `<details class="raw"><summary>${standing.length} accepted finding(s), by file</summary><table>${standingRows}</table></details>`
    : `<p class="empty">Nothing — either the baselines are empty or sarif-full/ was not written.</p>`
}

<h2>Probes with no machine-readable format</h2>
${
  probes.some((p) => p.kind === 'text')
    ? probes
        .filter((p) => p.kind === 'text')
        .map(
          (r) =>
            `<details class="raw" id="raw-${r.key}"><summary>${esc(r.label)} <span class="n ${r.state}">${r.state}</span></summary><pre>${esc(r.text || 'No output — the probe printed nothing.')}</pre></details>`
        )
        .join('')
    : `<p class="empty">No raw report on disk.</p>`
}
</main>

<script>
const DATA = ${JSON.stringify(payload)};
const list = document.getElementById('list');
const q = document.getElementById('q');
const groupSel = document.getElementById('group');
const off = new Set();

for (const chip of document.querySelectorAll('.chip[data-tool]')) {
  chip.addEventListener('click', () => {
    const tool = chip.dataset.tool;
    off.has(tool) ? off.delete(tool) : off.add(tool);
    chip.setAttribute('aria-pressed', String(!off.has(tool)));
    render();
  });
}

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function render() {
  const needle = q.value.trim().toLowerCase();
  const levels = new Set([...document.querySelectorAll('.lvl:checked')].map((i) => i.value));
  const rows = DATA.filter((f) =>
    !off.has(f.tool) &&
    levels.has(f.level) &&
    (!needle || (f.file + ' ' + f.ruleId + ' ' + f.message).toLowerCase().includes(needle)));

  if (!rows.length) { list.innerHTML = '<p class="empty">No finding matches.</p>'; return; }

  const key = groupSel.value;
  const groups = new Map();
  for (const f of rows) {
    const k = key === 'file' ? f.file : key === 'rule' ? f.ruleId : f.tool;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(f);
  }
  // Worst-first, then busiest: a lone error must not sink below a file with twenty notes.
  const rank = { error: 0, warning: 1, note: 2 };
  const ordered = [...groups.entries()].sort((a, b) => {
    const wa = Math.min(...a[1].map((f) => rank[f.level]));
    const wb = Math.min(...b[1].map((f) => rank[f.level]));
    return wa - wb || b[1].length - a[1].length || a[0].localeCompare(b[0]);
  });

  // A rule's help text is identical on every one of its hits, so it is printed once per rule for
  // the whole page. Repeating it per hit turned one sentence into fifteen copies.
  const seenHelp = new Set();
  list.innerHTML = ordered.map(([k, fs]) => {
    const body = fs
      .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
      .map((f) => {
        const withHelp = f.help && f.help !== f.message && !seenHelp.has(f.ruleId);
        if (withHelp) seenHelp.add(f.ruleId);
        return findingHtml(f, key, withHelp);
      })
      .join('');
    return \`<details class="group" open>
      <summary>\${esc(k)}<span class="n">\${fs.length}</span></summary>\${body}</details>\`;
  }).join('');
}

function findingHtml(f, groupKey, withHelp) {
  const pos = (f.line ? ':' + f.line : '') + (f.line && f.column ? ':' + f.column : '');
  // Inside a file group the path is already the heading; repeating it per row pushed the rule
  // and the message off the fold. Copy still carries the full path, which is what gets pasted.
  const shown = groupKey === 'file' ? esc(f.file.split('/').pop()) + pos : esc(f.file) + pos;
  // zed:// because it is the editor installed here; the copy button is the fallback that works
  // from any terminal, and is why the location stays selectable text.
  const href = f.abs ? 'zed://file/' + encodeURI(f.abs) + (f.line ? ':' + f.line : '') : '';
  return \`<div class="finding \${f.level}">
    <div class="bar"></div>
    <div class="body">
      <div class="top">
        \${href ? \`<a class="loc" href="\${href}">\${shown}</a>\` : \`<span class="loc">\${shown}</span>\`}
        <button class="copy" data-copy="\${esc(f.file) + pos}">copy path</button>
        <span class="rule">\${esc(f.ruleId)}</span>
      </div>
      <p class="msg">\${esc(f.message)}</p>
      \${withHelp ? \`<p class="help">\${esc(f.help)}</p>\` : ''}
    </div>
  </div>\`;
}

list.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy');
  if (!btn) return;
  navigator.clipboard.writeText(btn.dataset.copy);
  btn.textContent = 'copied';
  setTimeout(() => { btn.textContent = 'copy'; }, 1200);
});

for (const el of [q, groupSel, ...document.querySelectorAll('.lvl')]) {
  el.addEventListener('input', render);
}
render();
</script>
</body>
</html>
`

const target = join(outDir, 'report.html')
writeFileSync(target, html)

// Machine-readable twin of the page. Nothing else in .audit-out/ answers "what did this run find"
// in one read: report.html is 56 KB of markup, raw/health.txt ~3000 lines, json/fallow-health.json
// ~1.7 MB, and the counts are spread over five SARIF files. status.json carries exit codes only,
// which is the trap this closes: a baselined fallow exits 0 on top of a backlog, so "all clean"
// is not a conclusion its exit code supports. Counts and worst offenders here, detail stays put.
const SUMMARY_TOP = 20
const truncate = (s: string) =>
  s.length > 1500 ? `${s.slice(0, 1500)}\n[truncated — see raw/]` : s

const byLevel = { error: 0, warning: 0, note: 0 }
for (const f of payload) byLevel[f.level] += 1

const RANK: Record<Level, number> = { error: 0, warning: 1, note: 2 }
const worstOf = (fs: Finding[]) => LEVELS[Math.min(...fs.map((f) => RANK[f.level]))]

const groupCount = <T>(items: T[], key: (t: T) => string) => {
  const m = new Map<string, T[]>()
  for (const it of items) {
    const k = key(it)
    const seen = m.get(k)
    if (seen) seen.push(it)
    else m.set(k, [it])
  }
  return [...m.entries()].sort((a, b) => b[1].length - a[1].length)
}

const summary = {
  generated_at: generatedAt,
  totals: {
    findings: payload.length,
    by_level: byLevel,
    // The number that keeps a green run honest: regressions are 0 by construction once a baseline
    // is cut, and this is the debt sitting behind that 0.
    standing_debt: standing.length,
    failed_probes: failedProbes,
  },
  probes: probes.map((p) => ({
    probe: p.key,
    exit: p.exit ?? null,
    state: p.state,
    findings: p.kind === 'sarif' ? p.count : null,
    baselined: p.note === 'baselined',
    // The three text probes are under 1 KB each, so the whole audit fits here rather than sending
    // the reader back to raw/ for a two-line report.
    output: p.kind === 'text' ? truncate(p.text) : undefined,
  })),
  health: score
    ? {
        score: score.score,
        grade: score.grade,
        penalties: Object.fromEntries(penalties),
        vitals: Object.fromEntries(
          VITALS.filter(([k]) => vitals?.[k] !== undefined).map(([k, label]) => [
            label,
            vitals?.[k],
          ])
        ),
      }
    : null,
  styling: styling
    ? {
        score: styling.score,
        grade: styling.grade,
        confidence: styling.confidence,
        penalties: Object.fromEntries(stylingPenalties),
        findings_by_rule: [...stylingByCode.entries()].map(([code, v]) => ({
          rule: code,
          count: v.n,
          disposition: v.disposition,
        })),
        dead_css_classes: deadClasses.length,
      }
    : null,
  hotspots: hotspots.map((h) => ({
    path: h.path,
    score: h.score,
    commits: h.commits,
    fan_in: h.fan_in,
    trend: h.trend,
  })),
  top_rules: groupCount(payload, (f) => f.ruleId)
    .slice(0, SUMMARY_TOP)
    .map(([rule, fs]) => ({ rule, tool: fs[0].tool, level: worstOf(fs), count: fs.length })),
  worst_files: groupCount(payload, (f) => f.file)
    .slice(0, SUMMARY_TOP)
    .map(([file, fs]) => ({ file, count: fs.length, worst: worstOf(fs) })),
  standing_by_file: [...standingByFile.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, SUMMARY_TOP)
    .map(([file, count]) => ({ file, count })),
}

const summaryPath = join(outDir, 'summary.json')
writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`)

console.log(
  `audit-report: ${payload.length} finding(s), ${standing.length} standing, ${health.hotspots?.length ?? 0} hotspots${score ? `, score ${score.score.toFixed(1)} (${score.grade})` : ''}${styling ? `, css ${styling.score.toFixed(1)} (${styling.grade})` : ''}${deadClasses.length ? `, ${deadClasses.length} dead class(es)` : ''} → ${target}, ${summaryPath}`
)
