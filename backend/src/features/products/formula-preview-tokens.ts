import { normalize, splitINCI, stripPreamble } from 'algo-derm'
import { buildAliasIndex, lookupIngredient, MERGED_EVIDENCE_DB } from 'algo-derm/engine'

import { foldKnownInciLines } from '../../lib/inci-line-breaks'
import { partitionInciPresence } from '../../lib/inci-presence'

let aliasIndex: ReturnType<typeof buildAliasIndex> | null = null

type AliasIndex = ReturnType<typeof buildAliasIndex>
type ResolvedToken = {
  raw: string
  normalized: string
  canonicalKey: string | null
  allowNameFallback: boolean
}

function unresolvedToken(raw: string): ResolvedToken {
  return { raw, normalized: normalize(raw), canonicalKey: null, allowNameFallback: false }
}

function splitCertainDeclaration(cleaned: string): string[] {
  // Splitting broken pigment groups would discard their uncertainty
  const rawTokens: string[] = []
  const ciSequence = /\bIron Oxides?\s*[([]\s*CI\s*\d{5,6}(?:\s*[,/]\s*(?:CI\s*)?\d{5,6})*/gi
  let offset = 0
  for (const match of cleaned.matchAll(ciSequence)) {
    const end = match.index + match[0].length
    if (/^\s*[)\]]/.test(cleaned.slice(end))) continue
    rawTokens.push(...splitINCI(cleaned.slice(offset, match.index)), match[0])
    offset = end
  }
  rawTokens.push(...splitINCI(cleaned.slice(offset)))
  return rawTokens
}

function exactIronOxideKeys(raw: string, idx: AliasIndex): string[] {
  const group =
    /^iron\s+oxides?\s*\(\s*(CI\s*\d{5}(?:\s*[,/]\s*(?:CI\s*)?\d{5})+)\s*\)(?:\s*\*+)?$/i.exec(raw)
  const codes = group ? [...new Set(group[1].match(/\d{5}/g))].map((code) => `CI ${code}`) : []
  const allExact = codes.every(
    (code) =>
      ['CI 77491', 'CI 77492', 'CI 77499'].includes(code) &&
      lookupIngredient(code, idx)?.inci === code
  )
  return allExact ? codes : []
}

function refusesCiResolution(raw: string): boolean {
  const hasCi = /\bCI\s*\d/i.test(raw)
  const incomplete =
    hasCi &&
    (raw.split('(').length !== raw.split(')').length ||
      raw.split('[').length !== raw.split(']').length)
  return incomplete || (hasCi && (raw.match(/\d{5,6}/g)?.length ?? 0) > 1)
}

function resolveDeclaredToken(raw: string, idx: AliasIndex): ResolvedToken[] {
  const codes = exactIronOxideKeys(raw, idx)
  if (codes.length > 0) {
    return codes.map((canonicalKey) => ({
      raw,
      normalized: normalize(canonicalKey),
      canonicalKey,
      allowNameFallback: false,
    }))
  }
  const refused = refusesCiResolution(raw)
  return [
    {
      raw,
      normalized: normalize(raw),
      canonicalKey: refused ? null : (lookupIngredient(raw, idx)?.inci ?? null),
      allowNameFallback: !refused,
    },
  ]
}

function resolveCertainDeclaration(cleaned: string, idx: AliasIndex): ResolvedToken[] {
  return splitCertainDeclaration(cleaned).flatMap((raw) => {
    const folded = foldKnownInciLines(raw)
    if (folded === null) return [unresolvedToken(raw)]
    const lineTokens = folded === raw ? [raw] : splitINCI(folded)
    return lineTokens.flatMap((token) => resolveDeclaredToken(token, idx))
  })
}

export function resolveFormulaPreviewTokens(inci: string): ResolvedToken[] {
  aliasIndex ??= buildAliasIndex(MERGED_EVIDENCE_DB)
  const idx = aliasIndex
  return partitionInciPresence(stripPreamble(inci)).flatMap(({ raw, optional }) =>
    optional ? [unresolvedToken(raw)] : resolveCertainDeclaration(raw, idx)
  )
}
