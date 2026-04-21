// Seed content stores bare LaTeX tokens (e.g. `mathrm`, `frac`) without the
// leading backslashes KaTeX expects. This normalizes the `$$...$$` blocks so
// rehype-katex can render formulas written for Obsidian-style sources.
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
