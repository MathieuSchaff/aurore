import { differenceInDays, startOfDay } from 'date-fns'

/**
 * Calcule le streak actuel a partir d'une liste de dates de completion.
 * @param dates - Liste de dates (YYYY-MM-DD) triees de la plus recente a la plus ancienne.
 * @param today - La date de reference (par defaut aujourd'hui).
 * @returns Le nombre de jours consecutifs.
 */
export function calculateStreak(dates: string[], today: Date = new Date()): number {
  if (dates.length === 0) {
    return 0
  }

  let streak = 0
  let expectedDate = startOfDay(today)

  for (const dateStr of dates) {
    const checkDate = startOfDay(new Date(dateStr))
    const diff = differenceInDays(expectedDate, checkDate)

    // Si c'est aujourd'hui ou si c'est le jour exactement precedent
    if (diff === 0 || diff === 1) {
      streak++
      expectedDate = checkDate
    } else {
      // Trou dans le streak
      break
    }
  }

  return streak
}
