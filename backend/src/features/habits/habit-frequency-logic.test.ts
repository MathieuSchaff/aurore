import { describe, expect, it } from 'bun:test'

import { isHabitDue } from './habit-frequency-logic'

describe('isHabitDue (Frequency Logic)', () => {
  const MONDAY = '2026-03-23'
  const TUESDAY = '2026-03-24'
  const WEDNESDAY = '2026-03-25'

  it('should return true for daily habits', () => {
    expect(isHabitDue({ type: 'daily' }, MONDAY)).toBe(true)
    expect(isHabitDue({ type: 'daily' }, TUESDAY)).toBe(true)
  })

  it('should filter weekly habits correctly', () => {
    const freq = { type: 'weekly' as const, daysOfWeek: [0, 2] } // Lundi(0) et Mercredi(2)

    expect(isHabitDue(freq, MONDAY)).toBe(true)
    expect(isHabitDue(freq, TUESDAY)).toBe(false)
    expect(isHabitDue(freq, WEDNESDAY)).toBe(true)
  })

  it('should filter monthly habits correctly', () => {
    const freq = { type: 'monthly' as const, daysOfMonth: [1, 15, 31] }

    expect(isHabitDue(freq, '2026-03-01')).toBe(true)
    expect(isHabitDue(freq, '2026-03-15')).toBe(true)
    expect(isHabitDue(freq, '2026-03-16')).toBe(false)
    expect(isHabitDue(freq, '2026-03-31')).toBe(true)
  })

  it('should handle "every n days" correctly from a start date', () => {
    const createdAt = new Date('2026-03-20T10:00:00') // Vendredi
    const freq = { type: 'every_n_days' as const, intervalDays: 3 }

    // 20 (V) + 0 jours = OK
    expect(isHabitDue(freq, '2026-03-20', createdAt)).toBe(true)
    // 21 (S) = NO
    expect(isHabitDue(freq, '2026-03-21', createdAt)).toBe(false)
    // 22 (D) = NO
    expect(isHabitDue(freq, '2026-03-22', createdAt)).toBe(false)
    // 23 (L) = OK (3 jours apres)
    expect(isHabitDue(freq, '2026-03-23', createdAt)).toBe(true)
  })

  it('should handle weekly habits on Sunday correctly', () => {
    const SUNDAY = '2026-03-22'
    const freq = { type: 'weekly' as const, daysOfWeek: [6] } // Dimanche(6) dans notre code

    expect(isHabitDue(freq, SUNDAY)).toBe(true)
    expect(isHabitDue(freq, MONDAY)).toBe(false)
  })
})
