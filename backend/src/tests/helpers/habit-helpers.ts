import type { CreateHabitInput } from '@habit-tracker/shared'

import {
  // checkHabit,
  createHabit,
} from '../../features/habits/service'
// import { getTestDate } from '../../utils/dates'
import { testDb } from '../db.test.config'

//  override de n'importe quel champ mais de base, des données par défaut

export async function createTestHabit(userId: string, overrides?: Partial<CreateHabitInput>) {
  return await createHabit(
    {
      name: 'Habitude test',
      category: 'health',
      frequency: { type: 'daily' },
      ...overrides,
    },
    userId,
    testDb
  )
}

// export async function checkConsecutiveDays(habitId: string, userId: string, numberOfDays: number) {
//   const checks = []

//   for (let i = 0; i < numberOfDays; i++) {
//     const check = await checkHabit(
//       {
//         userId,
//         habitId,
//         date: getTestDate(i), // 0 = aujourd'hui, 1 = hier, etc.
//       },
//       testDb
//     )
//     checks.push(check)
//   }

//   return checks
// }
