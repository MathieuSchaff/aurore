import { DOSE_EXCIPIENT_MAX_DOSE_FACTOR, DOSE_EXCIPIENT_MIN_CONFIDENCE } from '@/constants/derm'

type RiskDriverLike = {
  inci?: string
}

type MatchedEvidenceLike = {
  inci: string
  roleAtDose?: {
    doseFactor: number
    confidence: number
  }
}

export function filterRiskDriversAtDose<T extends RiskDriverLike>(
  drivers: readonly T[],
  matchedEvidence: readonly MatchedEvidenceLike[]
): T[] {
  const clearExcipientByInci = new Map<string, boolean>()

  for (const matched of matchedEvidence) {
    const clearExcipient =
      !!matched.roleAtDose &&
      matched.roleAtDose.doseFactor <= DOSE_EXCIPIENT_MAX_DOSE_FACTOR &&
      matched.roleAtDose.confidence >= DOSE_EXCIPIENT_MIN_CONFIDENCE

    // Repeated INCI rows can have different dose estimates. Keep the driver
    // unless every occurrence is clearly on the excipient side.
    clearExcipientByInci.set(
      matched.inci,
      (clearExcipientByInci.get(matched.inci) ?? true) && clearExcipient
    )
  }

  return drivers.filter((driver) => !driver.inci || !clearExcipientByInci.get(driver.inci))
}
