import type { ProductAssessment } from 'algo-derm'

type BenefitDriver = ProductAssessment['explanation']['topBenefitDrivers'][number]

// "Points forts" names one ingredient per benefit axis, and the axis score is a curation
// value with no formal tie to the sheet's evidence level: an in vitro extract can outrank a
// molecule measured on the human enzyme. Keeping A/B only stops the page from crediting an
// ingredient for an effect its own upstream sheet does not carry. A driver whose INCI has no
// matched evidence cannot be graded, so it goes quiet too.
const HUMAN_EVIDENCE_LEVELS: ReadonlySet<string> = new Set(['A', 'B'])

// The upstream builder already sliced the top 5 before we see them, so a filtered driver is
// not backfilled. Measured 2026-08-10 on 1200 skincare INCIs: 97 of 5479 drivers are grade C/D.
export function benefitDriversWithHumanEvidence(assessment: ProductAssessment): BenefitDriver[] {
  const levelByInci = new Map<string, string>()
  for (const matched of assessment.matchedEvidence) {
    levelByInci.set(matched.inci, matched.evidence.evidenceLevel)
  }

  return assessment.explanation.topBenefitDrivers.filter((driver) => {
    const level = driver.inci ? levelByInci.get(driver.inci) : undefined
    return level !== undefined && HUMAN_EVIDENCE_LEVELS.has(level)
  })
}
