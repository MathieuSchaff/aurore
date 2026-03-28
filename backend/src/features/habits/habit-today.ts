import { and, count, eq, inArray, isNull } from 'drizzle-orm'

import type { Database } from '../../db'
import { db } from '../../db'
import type { HabitCheck } from '../../db/schema/habits'
import { products } from '../../db/schema/products'
import { purchases } from '../../db/schema/purchases'
import { userProducts } from '../../db/schema/user-products'
import { getToday } from '../../utils/dates'
import { getUserChecksForDate } from './habit-checks'
import { getUserHabitsWithRelations } from './habit-crud'
import { type HabitFrequency, isHabitDue } from './habit-frequency-logic'

export async function getTodayHabits(userId: string, dateParam?: string, database: Database = db) {
  const today = dateParam ?? getToday()
  const dateObj = dateParam ? new Date(dateParam) : new Date()
  const currentMonth = dateObj.getMonth() + 1

  const userHabits = await getUserHabitsWithRelations(userId, database)

  // Filtrer par période active ET par fréquence
  const activeHabits = userHabits.filter((h) => {
    // 1. Filtrer par periode (startDate, endDate, activeMonths)
    if (h.period) {
      if (h.period.activeMonths?.length) {
        if (!h.period.activeMonths.includes(currentMonth)) return false
      }
      if (h.period.startDate && today < h.period.startDate) return false
      if (h.period.endDate && today > h.period.endDate) return false
    }

    // 2. Filtrer par frequence (Daily, Weekly, Monthly, Every N Days)
    if (h.frequency) {
      const freq = h.frequency as HabitFrequency
      if (!isHabitDue(freq, today, h.createdAt)) return false
    }

    return true
  })

  const todayChecks = await getUserChecksForDate(userId, today, database)

  const checksByHabit = new Map<string, HabitCheck[]>()
  for (const c of todayChecks) {
    const existing = checksByHabit.get(c.habitId) ?? []
    existing.push(c)
    checksByHabit.set(c.habitId, existing)
  }

  // Load product stock for all habit products in one query
  const allProductIds = [
    ...new Set(activeHabits.flatMap((h) => h.products.map((p) => p.productId))),
  ]

  const userProductMap = new Map<string, number>()
  const productInfoMap = new Map<string, { name: string; brand: string; unit: string }>()

  if (allProductIds.length > 0) {
    const [userProductRows, productRows] = await Promise.all([
      database
        .select({
          productId: userProducts.productId,
          stockCount: count(purchases.id),
        })
        .from(userProducts)
        .leftJoin(
          purchases,
          and(eq(purchases.userProductId, userProducts.id), isNull(purchases.finishedAt))
        )
        .where(and(eq(userProducts.userId, userId), inArray(userProducts.productId, allProductIds)))
        .groupBy(userProducts.productId),
      database
        .select({
          id: products.id,
          name: products.name,
          brand: products.brand,
          unit: products.unit,
        })
        .from(products)
        .where(inArray(products.id, allProductIds)),
    ])

    for (const row of userProductRows) userProductMap.set(row.productId, Number(row.stockCount))
    for (const row of productRows) productInfoMap.set(row.id, row)
  }

  return activeHabits.map((h) => {
    const checks = checksByHabit.get(h.id) ?? []
    const requiredCount = h.timings.length || 1
    const isCompleted = checks.length >= requiredCount

    return {
      habit: {
        id: h.id,
        userId: h.userId,
        name: h.name,
        category: h.category,
        position: h.position,
        archivedAt: h.archivedAt,
        createdAt: h.createdAt,
        updatedAt: h.updatedAt,
      },
      timings: h.timings,
      checks,
      products: h.products.map((p) => {
        const stock = userProductMap.get(p.productId)
        return {
          id: p.id,
          productId: p.productId,
          dosage: p.dosage,
          order: p.order,
          product: productInfoMap.get(p.productId) ?? { name: '', brand: '', unit: '' },
          stock: stock ? { qty: stock } : null,
        }
      }),
      isCompleted,
    }
  })
}
