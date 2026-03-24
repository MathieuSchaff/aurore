import { describe, expect, it } from 'bun:test'

import { calculateStreak } from './habit-stats-logic'

describe('calculateStreak (Pure Logic)', () => {
  const TODAY = new Date('2026-03-22T10:00:00') // Dimanche

  it('should return 0 for empty dates', () => {
    expect(calculateStreak([], TODAY)).toBe(0)
  })

  it('should return 1 if completed today', () => {
    const dates = ['2026-03-22']
    expect(calculateStreak(dates, TODAY)).toBe(1)
  })

  it('should return 1 if completed yesterday but not today', () => {
    const dates = ['2026-03-21']
    expect(calculateStreak(dates, TODAY)).toBe(1)
  })

  it('should return 2 for Today + Yesterday', () => {
    const dates = ['2026-03-22', '2026-03-21']
    expect(calculateStreak(dates, TODAY)).toBe(2)
  })

  it('should return 3 for Today + Yesterday + 2 days ago', () => {
    const dates = ['2026-03-22', '2026-03-21', '2026-03-20']
    expect(calculateStreak(dates, TODAY)).toBe(3)
  })

  it('should break streak if Yesterday is missing', () => {
    const dates = ['2026-03-22', '2026-03-20'] // Trou le 21
    expect(calculateStreak(dates, TODAY)).toBe(1)
  })

  it('should return 0 if last completion was more than 1 day ago', () => {
    const dates = ['2026-03-20'] // On est le 22, donc hier (21) manque
    expect(calculateStreak(dates, TODAY)).toBe(0)
  })

  it('should handle leap years or long streaks (conceptual)', () => {
    const dates = ['2024-03-01', '2024-02-29', '2024-02-28'] // 2024 etait bissextile
    const reference = new Date('2024-03-01T12:00:00')
    expect(calculateStreak(dates, reference)).toBe(3)
  })
})
