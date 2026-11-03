import { splitINCI } from 'algo-derm'
import { MERGED_EVIDENCE_DB } from 'algo-derm/engine'

const labelKey = (label: string) => label.trim().toLowerCase().replace(/\s+/g, ' ')
// Identity lookup fallbacks discard qualifiers; line segmentation needs exact labels
const knownLabels = new Set(
  Object.values(MERGED_EVIDENCE_DB).flatMap((entry) =>
    [entry.inci, ...(entry.aliases ?? []), ...(entry.aliasOverrides ?? [])].map(labelKey)
  )
)
const maxLabelLength = Math.max(...Array.from(knownLabels, (label) => label.length))

function segmentKnownLines(token: string): string[] | null {
  const lines = token
    .split(/\r\n?|\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length <= 1) return lines

  const counts = new Uint8Array(lines.length + 1)
  const next = new Uint32Array(lines.length)
  counts[lines.length] = 1
  for (let start = lines.length - 1; start >= 0; start--) {
    for (let end = start + 1; end <= lines.length; end++) {
      const label = labelKey(lines.slice(start, end).join(' '))
      if (label.length > maxLabelLength) break
      const suffixCount = counts[end] ?? 0
      if (!knownLabels.has(label) || suffixCount === 0) continue
      counts[start] = Math.min(2, (counts[start] ?? 0) + suffixCount)
      next[start] = end
      // A known compound and two known ingredients are equally plausible here
      if (counts[start] === 2) break
    }
  }
  if (counts[0] !== 1) return null

  const labels: string[] = []
  for (let start = 0; start < lines.length; ) {
    const end = next[start]
    if (end === undefined || end <= start) return null
    labels.push(lines.slice(start, end).join(' '))
    start = end
  }
  return labels
}

export function foldKnownInciLines(inci: string): string | null {
  if (!/[\r\n]/.test(inci)) return inci

  const labels: string[] = []
  for (const token of splitINCI(inci)) {
    const segments = segmentKnownLines(token)
    if (segments === null) return null
    labels.push(...segments)
  }
  return labels.join(', ')
}
