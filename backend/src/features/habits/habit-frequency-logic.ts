import { differenceInDays, getDate, getDay, parseISO, startOfDay } from 'date-fns'

export interface HabitFrequency {
  type: 'daily' | 'weekly' | 'monthly' | 'every_n_days'
  daysOfWeek?: number[] | null
  daysOfMonth?: number[] | null
  intervalDays?: number | null
}

/**
 * Verifie si une habitude doit s'afficher a une date donnee.
 * @param freq - La configuration de la frequence
 * @param targetDate - La date a verifier (format 'YYYY-MM-DD' ou Date)
 * @param createdAt - Date de creation de l'habitude (pour "every_n_days")
 */
export function isHabitDue(
  freq: HabitFrequency,
  targetDateStr: string,
  createdAt: Date = new Date()
): boolean {
  const date = startOfDay(parseISO(targetDateStr))

  switch (freq.type) {
    case 'daily':
      return true

    case 'weekly': {
      // date-fns getDay: 0=Sunday, 1=Monday... 6=Saturday
      // Notre frontend utilise: 0=Lundi, 1=Mardi... 6=Dimanche
      // On doit convertir
      const dayOfWeekNative = getDay(date) // 0-6 (Sun-Sat)
      const dayOfWeekMapped = dayOfWeekNative === 0 ? 6 : dayOfWeekNative - 1 // 0=Lundi, 6=Dimanche

      return !!freq.daysOfWeek?.includes(dayOfWeekMapped)
    }

    case 'monthly': {
      const dayOfMonth = date.getDate()
      return !!freq.daysOfMonth?.includes(dayOfMonth)
    }

    case 'every_n_days': {
      if (!freq.intervalDays) return true
      const start = startOfDay(createdAt)
      const diff = differenceInDays(date, start)
      return diff >= 0 && diff % freq.intervalDays === 0
    }

    default:
      return true
  }
}
