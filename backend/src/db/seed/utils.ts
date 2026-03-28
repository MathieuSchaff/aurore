import { db } from '..'
import {
  ingredients,
  ingredientTags,
  productIngredients,
  products,
  productTags,
  tags,
} from '../schema'

// /* Types for the seed */

export interface ProductTagGroups {
  primary: string[]
  secondary: string[]
  avoid: string[]
}

export interface SeedError {
  item: string
  reason: string
}

// /* Small helpers for format strings */

export function toNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value === '') return null
  return value
}

export function toNumeric(val: unknown): string | null {
  // if the value is shit like 'null' string we return real null
  if (val == null) return null
  const str = String(val).trim()
  if (str === '' || str === 'null' || str === 'undefined') return null
  const num = Number(str)
  if (isNaN(num)) return null
  return str
}

export function toText(val: unknown): string | null {
  if (val == null) return null
  const str = String(val).trim()
  return str === '' || str === 'null' || str === 'undefined' ? null : str
}

export function flattenTagGroups(
  map: Record<string, ProductTagGroups>
): Array<{ slug: string; tagSlug: string }> {
  return Object.entries(map).flatMap(([slug, groups]) => {
    const allTagSlugs = [...groups.primary, ...groups.secondary, ...groups.avoid]
    return allTagSlugs.map((tagSlug) => ({ slug, tagSlug }))
  })
}

// /* Here the big function for the seed */

export async function seedBatch<T>(
  label: string,
  items: T[],
  fn: (item: T) => Promise<unknown>,
  identify: (item: T) => string,
  critical: boolean = false
): Promise<{ success: number; failed: SeedError[]; total: number }> {
  // I use Promise.allSettled because if one item crash, we want to continue the others
  const results = await Promise.allSettled(
    items.map(async (item) => {
      try {
        await fn(item)
        return { success: true, item }
      } catch (err) {
        throw { item: identify(item), reason: err instanceof Error ? err.message : String(err) }
      }
    })
  )

  const failed: SeedError[] = []
  let successCount = 0

  for (const result of results) {
    if (result.status === 'fulfilled') successCount++
    else failed.push(result.reason as SeedError)
  }

  if (failed.length > 0) {
    console.error(`\n❌ ${failed.length}/${items.length} ${label} échoué(s) :`)
    // we show only 10 errors for not explode the terminal
    failed.slice(0, 10).forEach((f, i) => console.error(`  ${i + 1}. [${f.item}] → ${f.reason}`))
    if (failed.length > 10) console.error(`  ... et ${failed.length - 10} autres erreurs.`)

    if (critical) {
      throw new Error(`Seed interrompu : ${label} contient des erreurs critiques`)
    }
  } else {
    console.log(`✅ ${successCount} ${label} créé(s)`)
  }

  return { success: successCount, failed, total: items.length }
}

// /* Utilities for read the CSV files */

export function parseCSV(text: string): string[][] {
  const result: string[][] = []
  let row: string[] = []
  let current = ''
  let inQuotes = false

  // manual parse of CSV because sometimes it's more simple
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"') {
      // if we have "" inside the quotes it mean it's a real quote
      if (inQuotes && next === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // separator of column only if we are not inside quotes
      row.push(current.trim())
      current = ''
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      // end of the line
      if (current || row.length > 0) {
        row.push(current.trim())
        result.push(row)
        current = ''
        row = []
      }
      if (char === '\r' && next === '\n') i++
    } else {
      current += char
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim())
    result.push(row)
  }
  return result
}

export function extractCapacity(productName: string, brand: string) {
  let cleanName = productName.trim()

  // we remove the brand name if it's at the start
  if (cleanName.toLowerCase().startsWith(brand.toLowerCase())) {
    cleanName = cleanName
      .substring(brand.length)
      .replace(/^[,-\s]+/, '')
      .trim()
  }

  // this regex is big because it must catch mL, g, count but also oz
  const capacityRegex = /[,(-]?\s*(\d+(?:\.\d+)?)\s*(mL|g|Count|pcs|sheets|fl\s*oz|oz)\b/gi

  let totalAmount: number | null = null
  let unit = 'Pas spécifié'

  const matches = [...cleanName.matchAll(capacityRegex)]

  if (matches.length > 0) {
    // we take the match with mL or g if we can find it
    const metricMatch = matches.find((m) => /mL|g/i.test(m[2]))
    const selectedMatch = metricMatch || matches[matches.length - 1]

    let value = parseFloat(selectedMatch[1])
    unit = selectedMatch[2]

    // if it's oz we convert to mL for be uniform
    if (/fl\s*oz|oz/i.test(unit)) {
      value = value * 29.57
      unit = 'mL'
    }

    // the database want integers so we round
    totalAmount = Math.round(value)

    // we remove all capacity text from the product name
    cleanName = cleanName
      .replace(capacityRegex, '')
      .replace(/[,-\s/]+$/, '')
      .trim()
  }

  return { name: cleanName, totalAmount, unit }
}

export async function cleanDatabase() {
  console.log('🧹 Nettoyage de la base de données...')
  // the order is very important because of the foreign keys!
  await db.delete(productTags)
  await db.delete(productIngredients)
  await db.delete(ingredientTags)
  await db.delete(products)
  await db.delete(ingredients)
  await db.delete(tags)
  console.log('✅ Base nettoyée\n')
}

export async function fetchIdMaps() {
  console.log('\n📊 Récupération des IDs...')
  const [allProducts, allTags, allIngredients] = await Promise.all([
    db.select({ id: products.id, slug: products.slug }).from(products),
    db.select({ id: tags.id, slug: tags.slug }).from(tags),
    db.select({ id: ingredients.id, slug: ingredients.slug }).from(ingredients),
  ])

  console.log(
    `   Produits : ${allProducts.length} | Tags : ${allTags.length} | Ingrédients : ${allIngredients.length}`
  )

  return {
    productSlugToId: new Map(allProducts.map((p) => [p.slug, p.id])),
    tagSlugToId: new Map(allTags.map((t) => [t.slug, t.id])),
    ingredientSlugToId: new Map(allIngredients.map((i) => [i.slug, i.id])),
  }
}
