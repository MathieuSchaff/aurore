// Seed content stores bare LaTeX tokens (Obsidian-style) without the leading backslashes KaTeX needs.
export function normalizeLatexMarkdown(rawContent: string): string {
  if (!rawContent) return ''

  return rawContent.replace(/\$\$(.*?)\$\$/gs, (_, formula) => {
    const fixedFormula = formula
      .replace(/mathrm/g, '\\mathrm')
      .replace(/pKa/g, '\\mathrm{pK}_a')
      .replace(/log/g, '\\log')
      .replace(/left/g, '\\left')
      .replace(/right/g, '\\right')
      .replace(/frac/g, '\\frac')
      .replace(/[\r\n]+/g, ' ')

    return `$$${fixedFormula}$$`
  })
}
