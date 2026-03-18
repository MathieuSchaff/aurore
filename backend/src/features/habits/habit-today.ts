import { and, eq, inArray } from 'drizzle-orm'

import { db } from '../../db'
import type { HabitCheck } from '../../db/schema/habits'
import { productStock, products } from '../../db/schema/products'
import { getToday } from '../../utils/dates'
import { getUserChecksForDate } from './habit-checks'
import { getUserHabitsWithRelations } from './habit-crud'
import type { Database } from '../../db'

export async function getTodayHabits(userId: string, dateParam?: string, database: Database = db) {
  const today = dateParam ?? getToday()
  const dateObj = dateParam ? new Date(dateParam) : new Date()
  const currentMonth = dateObj.getMonth() + 1

  const userHabits = await getUserHabitsWithRelations(userId, database)

  // Filtrer par période active
  const activeHabits = userHabits.filter((h) => {
    if (!h.period) return true

    if (h.period.activeMonths?.length) {
      if (!h.period.activeMonths.includes(currentMonth)) return false
    }

    if (h.period.startDate && today < h.period.startDate) return false
    if (h.period.endDate && today > h.period.endDate) return false

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

  const stockMap = new Map<string, number>()
  const productInfoMap = new Map<string, { name: string; brand: string; unit: string }>()

  if (allProductIds.length > 0) {
    const [stockRows, productRows] = await Promise.all([
      database
        .select({ productId: productStock.productId, qty: productStock.qty })
        .from(productStock)
        .where(
          and(eq(productStock.userId, userId), inArray(productStock.productId, allProductIds))
        ),
      database
        .select({ id: products.id, name: products.name, brand: products.brand, unit: products.unit })
        .from(products)
        .where(inArray(products.id, allProductIds)),
    ])

    for (const row of stockRows) stockMap.set(row.productId, row.qty)
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
      products: h.products.map((p) => ({
        id: p.id,
        productId: p.productId,
        dosage: p.dosage,
        order: p.order,
        product: productInfoMap.get(p.productId) ?? { name: '', brand: '', unit: '' },
        stock: stockMap.has(p.productId) ? { qty: stockMap.get(p.productId)! } : null,
      })),
      isCompleted,
    }
  })
}
