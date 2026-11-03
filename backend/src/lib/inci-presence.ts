const OPTIONAL_INCI_MARKER =
  /(?:\(\s*(?:\+\s*\/\s*-|±)\s*\)(?!\s*-)|(?:\+\s*\/\s*-|±)(?!\s*\)\s*-)|\(\s*(?:may\s+contain|peut\s+contenir)\s*\)|\b(?:may\s+contain|peut\s+contenir)\b)\s*:?\s*/i

export function partitionInciPresence(source: string): Array<{ raw: string; optional: boolean }> {
  const marker = OPTIONAL_INCI_MARKER.exec(source)
  if (!marker) return source.trim() ? [{ raw: source, optional: false }] : []
  const opening = source.slice(0, marker.index).match(/[[(]\s*$/)
  const start = opening ? marker.index - opening[0].length : marker.index
  let bodyStart = marker.index + marker[0].length
  bodyStart += source.slice(bodyStart).match(/^[,;:\s]*/)?.[0].length ?? 0
  const paired = OPTIONAL_INCI_MARKER.exec(source.slice(bodyStart))
  if (paired?.index === 0) bodyStart += paired[0].length

  let end = source.length
  if (opening) {
    const close = opening[0].trim() === '[' ? ']' : ')'
    let depth = 0
    for (let index = bodyStart; index < source.length; index++) {
      const char = source[index]
      if (char === '(' || char === '[') depth++
      else if (char === ')' || char === ']') {
        if (depth === 0 && char === close) {
          end = index + 1
          break
        }
        depth--
      }
    }
  }
  // Splitting first discards the brackets and turns possible ingredients into certain links
  return [
    ...(source.slice(0, start).trim() ? [{ raw: source.slice(0, start), optional: false }] : []),
    { raw: source.slice(start, end), optional: true },
    ...partitionInciPresence(source.slice(end)),
  ]
}
