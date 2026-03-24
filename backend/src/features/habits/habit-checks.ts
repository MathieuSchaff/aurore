import { and, asc, between, eq, isNull } from 'drizzle-orm'

import type { Database } from '../../db'
import { db } from '../../db'
import { type HabitCheck, habitChecks } from '../../db/schema/habits'
import { habitCheckProducts } from '../../db/schema/logs'
import { products } from '../../db/schema/products'
import { HabitError } from './habit-error'

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
  const result = await database
    .delete(habitChecks)
    .where(eq(habitChecks.id, checkId))
    .returning({ id: habitChecks.id })

  if (result.length === 0) {
    throw new HabitError('habit_not_found')
  }
}

export async function uncheckHabitByDate(
  habitId: string,
  date: string,
  database: Database = db
): Promise<void> {
  const result = await database
    .delete(habitChecks)
    .where(and(eq(habitChecks.habitId, habitId), eq(habitChecks.scheduledDate, date)))
    .returning({ id: habitChecks.id })

  if (result.length === 0) {
    throw new HabitError('habit_not_found')
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
      and(eq(habitChecks.habitId, habitId), between(habitChecks.scheduledDate, startDate, endDate))
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
    products?: Array<{
      habitProductId: string
      productId: string
      used: boolean
      actualDosage?: string
    }>
  },
  database: Database = db
): Promise<{
  checked: boolean
  check?: HabitCheck
  checkProducts?: Array<typeof habitCheckProducts.$inferSelect>
}> {
  return database.transaction(async (tx) => {
    const existing = await isHabitChecked(input.habitId, input.date, input.timingId, tx as any)

    if (existing) {
      // uncheck
      const loggedProducts = await tx
        .select()
        .from(habitCheckProducts)
        .where(eq(habitCheckProducts.checkId, existing.id))

      if (loggedProducts.length > 0) {
        await tx.delete(habitCheckProducts).where(eq(habitCheckProducts.checkId, existing.id))
      }

      await uncheckHabit(existing.id, tx as any)
      return { checked: false }
    } else {
      // check
      const check = await checkHabit(input, tx as any)
      let insertedCheckProducts: Array<typeof habitCheckProducts.$inferSelect> | undefined

      if (input.products && input.products.length > 0) {
        // granular product logging
        insertedCheckProducts = await tx
          .insert(habitCheckProducts)
          .values(
            input.products.map((p) => ({
              checkId: check.id,
              habitProductId: p.habitProductId,
              productId: p.productId,
              used: p.used,
              actualDosage: p.actualDosage ?? null,
            }))
          )
          .returning()

        return {
          checked: true,
          check,
          checkProducts: insertedCheckProducts,
        }
      } else {
        return {
          checked: true,
          check,
        }
      }
    }
  })
}

export async function getCheckProducts(
  habitId: string,
  userId: string,
  startDate: string,
  endDate: string,
  database: Database = db
) {
  return database
    .select({
      id: habitCheckProducts.id,
      checkId: habitCheckProducts.checkId,
      scheduledDate: habitChecks.scheduledDate,
      habitProductId: habitCheckProducts.habitProductId,
      productId: habitCheckProducts.productId,
      productName: products.name,
      productBrand: products.brand,
      used: habitCheckProducts.used,
      actualDosage: habitCheckProducts.actualDosage,
      createdAt: habitCheckProducts.createdAt,
    })
    .from(habitCheckProducts)
    .innerJoin(habitChecks, eq(habitCheckProducts.checkId, habitChecks.id))
    .innerJoin(products, eq(habitCheckProducts.productId, products.id))
    .where(
      and(
        eq(habitChecks.habitId, habitId),
        eq(habitChecks.userId, userId),
        between(habitChecks.scheduledDate, startDate, endDate)
      )
    )
    .orderBy(asc(habitChecks.scheduledDate))
}
