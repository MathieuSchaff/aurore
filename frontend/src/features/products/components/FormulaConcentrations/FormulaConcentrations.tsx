import { ChevronDown } from 'lucide-react'

import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { CONC_METHOD_NOTE, concUnestimableSummary } from '@/constants/derm'
import type { ProductDermoAssessment } from '@/lib/queries/products'
import {
  type ConcentrationRead,
  compareConcentrationReads,
  formatConcentrationRead,
  readConcentration,
} from './estimate'
import './FormulaConcentrations.css'

interface FormulaConcentrationsProps {
  assessment: ProductDermoAssessment | null
}

export function FormulaConcentrations({ assessment }: FormulaConcentrationsProps) {
  if (!assessment) return null

  // Bundle formulas can repeat an INCI. Keep the strongest estimate.
  const byInci = new Map<string, { name: string; read: ConcentrationRead }>()
  for (const m of assessment.matchedEvidence) {
    const read = readConcentration(m.concentrationEstimate)
    const prev = byInci.get(m.inci)
    if (!prev || compareConcentrationReads(read, prev.read) < 0) {
      byInci.set(m.inci, { name: m.ingredient, read })
    }
  }

  const rows = [...byInci.entries()]
    .map(([inci, v]) => ({ inci, ...v }))
    .sort((a, b) => compareConcentrationReads(a.read, b.read))

  const estimable = rows.filter((r) => r.read.kind !== 'unestimable')
  const unestimable = rows.filter((r) => r.read.kind === 'unestimable')

  // FormulaReading already covers the qualitative-only case.
  if (estimable.length === 0) return null

  return (
    <section className="formula-concentrations product-section">
      <SectionHeader title="Concentrations estimées" as="h2">
        <span className="formula-concentrations__beta">expérimental</span>
      </SectionHeader>

      <p className="formula-concentrations__method">{CONC_METHOD_NOTE}</p>

      <ul role="list" className="formula-concentrations__list">
        {estimable.map((r) => (
          <li key={r.inci} className="formula-concentrations__item">
            <span className="formula-concentrations__name">{r.name}</span>
            <span
              className="formula-concentrations__value"
              data-declared={r.read.kind === 'declared' || undefined}
            >
              {formatConcentrationRead(r.read)}
            </span>
          </li>
        ))}
      </ul>

      {unestimable.length > 0 && (
        <details className="formula-concentrations__fold">
          <summary className="formula-concentrations__fold-summary">
            <span>{concUnestimableSummary(unestimable.length)}</span>
            <ChevronDown
              size={14}
              className="formula-concentrations__fold-chevron"
              aria-hidden="true"
            />
          </summary>
          <ul role="list" className="formula-concentrations__fold-list">
            {unestimable.map((r) => (
              <li key={r.inci}>{r.name}</li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}
