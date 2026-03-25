import { db } from '..'
import {
  ingredients,
  ingredientTags,
  productIngredients,
  products,
  productTags,
  tags,
} from '../schema'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ProductTagGroups {
  primary: string[]
  secondary: string[]
  avoid: string[]
}

export interface SeedError {
  item: string
  reason: string
}

// ── Utilitaires de Formatage ──────────────────────────────────────────────────

export function toNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value === '') return null
  return value
}

export function toNumeric(val: unknown): string | null {
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

// ── Utilitaires de Seed ───────────────────────────────────────────────────────

export async function seedBatch<T>(
  label: string,
  items: T[],
  fn: (item: T) => Promise<unknown>,
  identify: (item: T) => string,
  critical: boolean = false
): Promise<{ success: number; failed: SeedError[]; total: number }> {
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
    // Limiter l'affichage pour ne pas noyer la console
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

// ── Utilitaires CSV & Parsing ────────────────────────────────────────────────

export function parseCSV(text: string): string[][] {
  const result: string[][] = []
  let row: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim())
      current = ''
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
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

  // Suppression de la marque au début
  if (cleanName.toLowerCase().startsWith(brand.toLowerCase())) {
    cleanName = cleanName
      .substring(brand.length)
      .replace(/^[,-\s]+/, '')
      .trim()
  }

  // Regex améliorée pour capturer les nombres décimaux et les unités
  const capacityRegex = /[,(-]?\s*(\d+(?:\.\d+)?)\s*(mL|g|Count|pcs|sheets|fl\s*oz|oz)\b/gi

  let totalAmount: number | null = null
  let unit = 'Pas spécifié'

  const matches = [...cleanName.matchAll(capacityRegex)]

  if (matches.length > 0) {
    // On cherche s'il y a du mL ou g en priorité dans les matches
    const metricMatch = matches.find((m) => /mL|g/i.test(m[2]))
    const selectedMatch = metricMatch || matches[matches.length - 1]

    let value = parseFloat(selectedMatch[1])
    unit = selectedMatch[2]

    // Conversion fl oz -> mL si nécessaire pour l'uniformité
    if (/fl\s*oz|oz/i.test(unit)) {
      value = value * 29.57
      unit = 'mL'
    }

    // On arrondit car le schéma attend un INTEGER
    totalAmount = Math.round(value)

    // Nettoyage final du nom : on enlève tout ce qui ressemble à une capacité
    cleanName = cleanName
      .replace(capacityRegex, '')
      .replace(/[,-\s/]+$/, '')
      .trim()
  }

  return { name: cleanName, totalAmount, unit }
}

export async function cleanDatabase() {
  console.log('🧹 Nettoyage de la base de données...')
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
