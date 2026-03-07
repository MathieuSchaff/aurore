import { and, asc, between, eq, isNull, sql } from 'drizzle-orm'

import { db } from '../../db'
import { type HabitCheck, habitChecks, habitProducts } from '../../db/schema/habits'
import { productStock, products } from '../../db/schema/products'
import { type Database, HabitError } from './habit-error'

export async function checkHabit(
  input: {
    userId: string
    habitId: string
    date: string
    timingId?: string
    actualTime?: string
  },
  database: Database = db
): Promise<HabitCheck> {
  const [check] = await database
    .insert(habitChecks)
    .values({
      userId: input.userId,
      habitId: input.habitId,
      scheduledDate: input.date,
      timingId: input.timingId,
      actualTime: input.actualTime,
      status: 'done',
      completedAt: new Date(),
    })
    .returning()

  if (!check) {
    throw new HabitError('check_creation_failed')
  }

  return check
}

export async function uncheckHabit(checkId: string, database: Database = db): Promise<void> {
  const result = await database.delete(habitChecks).where(eq(habitChecks.id, checkId))

  const deleted = (result.rowCount ?? 0) > 0

  if (!deleted) {
    throw new HabitError('check_not_found')
  }
}

export async function getUserChecksForDate(
  userId: string,
  date: string,
  database: Database = db
): Promise<HabitCheck[]> {
  return database
    .select()
    .from(habitChecks)
    .where(and(eq(habitChecks.userId, userId), eq(habitChecks.scheduledDate, date)))
}

export async function getHabitChecks(
  habitId: string,
  startDate: string,
  endDate: string,
  database: Database = db
): Promise<HabitCheck[]> {
  return database
    .select()
    .from(habitChecks)
    .where(
      and(
        eq(habitChecks.habitId, habitId),
        between(habitChecks.scheduledDate, startDate, endDate)
      )
    )
    .orderBy(asc(habitChecks.scheduledDate))
}

export async function isHabitChecked(
  habitId: string,
  date: string,
  timingId?: string,
  database: Database = db
): Promise<HabitCheck | undefined> {
  return database.query.habitChecks.findFirst({
    where: and(
      eq(habitChecks.habitId, habitId),
      eq(habitChecks.scheduledDate, date),
      timingId ? eq(habitChecks.timingId, timingId) : isNull(habitChecks.timingId)
    ),
  })
}

export async function toggleHabitCheck(
  input: {
    userId: string
    habitId: string
    date: string
    timingId?: string
    actualTime?: string
  },
  database: Database = db
): Promise<{ checked: boolean; check?: HabitCheck; depletedProducts?: string[] }> {
  return database.transaction(async (tx) => {
    const existing = await isHabitChecked(input.habitId, input.date, input.timingId, tx as any)

    // Get habit products for stock management
    const linkedProducts = await tx
      .select({
        productId: habitProducts.productId,
        productName: products.name,
      })
      .from(habitProducts)
      .innerJoin(products, eq(habitProducts.productId, products.id))
      .where(eq(habitProducts.habitId, input.habitId))

    if (existing) {
      // Uncheck → re-increment stock
      await uncheckHabit(existing.id, tx as any)

      for (const p of linkedProducts) {
        await tx
          .update(productStock)
          .set({ qty: sql`${productStock.qty} + 1` })
          .where(
            and(eq(productStock.userId, input.userId), eq(productStock.productId, p.productId))
          )
      }

      return { checked: false }
    } else {
      // Check → decrement stock
      const check = await checkHabit(input, tx as any)

      const depletedProducts: string[] = []

      for (const p of linkedProducts) {
        const updated = await tx
          .update(productStock)
          .set({ qty: sql`GREATEST(${productStock.qty} - 1, 0)` })
          .where(
            and(eq(productStock.userId, input.userId), eq(productStock.productId, p.productId))
          )
          .returning({ qty: productStock.qty })

        if (updated[0]?.qty === 0) {
          depletedProducts.push(p.productName)
        }
      }

      return { checked: true, check, depletedProducts }
    }
  })
}
