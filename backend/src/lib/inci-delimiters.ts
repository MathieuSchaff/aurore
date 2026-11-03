// Decode ampersands last so nested entities cannot become markup in the same pass
const HTML_ENTITY_DECODES: Array<[RegExp, string]> = [
  [/&lt;/gi, '<'],
  [/&gt;/gi, '>'],
  [/&nbsp;/gi, ' '],
  [/&trade;/gi, '™'],
  [/&reg;/gi, '®'],
  [/&Eacute;/g, 'É'],
  [/&eacute;/g, 'é'],
  [/&Egrave;/g, 'È'],
  [/&egrave;/g, 'è'],
  [/&Agrave;/g, 'À'],
  [/&agrave;/g, 'à'],
  [/&rsquo;/gi, '’'],
  [/&amp;/gi, '&'],
]

const HTML_ENTITY_OR_SEMICOLON = /&(?:#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]+);|\s*;\s*/gi

export interface FoldScraperDelimiterOptions {
  foldListSeparators?: boolean
}

export function foldScraperDelimiters(
  inci: string,
  { foldListSeparators = true }: FoldScraperDelimiterOptions = {}
): string {
  const decoded = HTML_ENTITY_DECODES.reduce((acc, [rx, sub]) => acc.replace(rx, sub), inci)
  if (!foldListSeparators) return decoded

  return (
    decoded
      .replace(HTML_ENTITY_OR_SEMICOLON, (match) => (match.startsWith('&') ? match : ', '))
      .replace(/\s+[•·]\s+(?=\S)/g, ', ')
      // Digits and single-letter chemical prefixes must keep their hyphens
      .replace(/([A-Za-zÀ-ÿ]{2}[™®*]{0,2})\s+-\s*(?=[A-Za-zÀ-ÿ]{2})/g, '$1, ')
  )
}
