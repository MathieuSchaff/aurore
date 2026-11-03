import { normalize, splitINCI, stripPreamble } from 'algo-derm'
import { buildAliasIndex, lookupIngredient, MERGED_EVIDENCE_DB } from 'algo-derm/engine'

import { foldKnownInciLines } from '../../lib/inci-line-breaks'
import { partitionInciPresence } from '../../lib/inci-presence'

let aliasIndex: ReturnType<typeof buildAliasIndex> | null = null

export function resolveFormulaPreviewTokens(inci: string) {
  aliasIndex ??= buildAliasIndex(MERGED_EVIDENCE_DB)
  const idx = aliasIndex
  return partitionInciPresence(stripPreamble(inci)).flatMap(({ raw: cleaned, optional }) => {
    if (optional) {
      return [
        {
          raw: cleaned,
          normalized: normalize(cleaned),
          canonicalKey: null,
          allowNameFallback: false,
        },
      ]
    }
    // v32 splits broken groups into valid looking pigments; keep their uncertainty together
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
    return rawTokens.flatMap((raw) => {
      const folded = foldKnownInciLines(raw)
      if (folded === null) {
        return [{ raw, normalized: normalize(raw), canonicalKey: null, allowNameFallback: false }]
      }
      const lineTokens = folded === raw ? [raw] : splitINCI(folded)
      return lineTokens.flatMap((raw) => {
        const group =
          /^iron\s+oxides?\s*\(\s*(CI\s*\d{5}(?:\s*[,/]\s*(?:CI\s*)?\d{5})+)\s*\)(?:\s*\*+)?$/i.exec(
            raw
          )
        const codes = group
          ? [...new Set(group[1].match(/\d{5}/g))].map((code) => `CI ${code}`)
          : []
        if (
          codes.length > 0 &&
          codes.every(
            (code) =>
              ['CI 77491', 'CI 77492', 'CI 77499'].includes(code) &&
              lookupIngredient(code, idx)?.inci === code
          )
        ) {
          return codes.map((canonicalKey) => ({
            raw,
            normalized: normalize(canonicalKey),
            canonicalKey,
            allowNameFallback: false,
          }))
        }
        const hasCi = /\bCI\s*\d/i.test(raw)
        const incomplete =
          hasCi &&
          (raw.split('(').length !== raw.split(')').length ||
            raw.split('[').length !== raw.split(']').length)
        const refused = incomplete || (hasCi && (raw.match(/\d{5,6}/g)?.length ?? 0) > 1)
        return [
          {
            raw,
            normalized: normalize(raw),
            canonicalKey: refused ? null : (lookupIngredient(raw, idx)?.inci ?? null),
            allowNameFallback: !refused,
          },
        ]
      })
    })
  })
}
