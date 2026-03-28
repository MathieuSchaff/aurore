import slugify from '@sindresorhus/slugify'
import { sql } from 'drizzle-orm'

import { createProduct } from '../../../features/products/service'
import { addManyTagsToProduct } from '../../../features/products/tags/tags.service'
import { db } from '../..'
import { getOrCreateSeedUser } from '../create-user'
import { TAG_SLUGS } from '../tags/seed-tags'
import { INGREDIENT_TAG_MAP, NAME_KEYWORD_TAG_MAP } from './tag-associations'

/**
 * Mapping des catégories CSV vers les Slugs de Tags
 */
const TAG_MAPPER: Record<string, string[]> = {
  // Usage types
  'Skin Treatments': [TAG_SLUGS.TRAITEMENT, TAG_SLUGS.ZONE_VISAGE],
  Body: [TAG_SLUGS.ZONE_CORPS],
  'Facial Cleansers': [TAG_SLUGS.NETTOYANT, TAG_SLUGS.ZONE_VISAGE, TAG_SLUGS.DOUBLE_NETTOYAGE_2],
  Face: [TAG_SLUGS.ZONE_VISAGE],
  'Toners & Astringents': [TAG_SLUGS.TONIQUE, TAG_SLUGS.PREPARATION, TAG_SLUGS.ZONE_VISAGE],
  Eyes: [TAG_SLUGS.ZONE_YEUX, TAG_SLUGS.SOIN_YEUX, TAG_SLUGS.CONTOUR_YEUX],
  'Lip Care': [TAG_SLUGS.ZONE_LEVRES, TAG_SLUGS.SOIN_LEVRES],
  'Skin Care': [TAG_SLUGS.ZONE_VISAGE],
  'Eye Cream, Gel, Oils, & Serum': [
    TAG_SLUGS.CONTOUR_YEUX,
    TAG_SLUGS.ZONE_YEUX,
    TAG_SLUGS.SOIN_YEUX,
  ],
  Cleansers: [TAG_SLUGS.NETTOYANT],
  Moisturizers: [TAG_SLUGS.EMOLLIENCE, TAG_SLUGS.HYDRATATION],
  Sunscreen: [TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.CREME_SOLAIRE],

  // Categories
  'Facial Masks': [TAG_SLUGS.MASQUE_TISSU, TAG_SLUGS.MASQUE_HEBDO],
  Gels: [TAG_SLUGS.GEL_CREME],
  'Micellar Water': [TAG_SLUGS.EAU_MICELLAIRE, TAG_SLUGS.DOUBLE_NETTOYAGE_1],
  'Acne Care (OTC)': [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.SPOT_TREATMENT, TAG_SLUGS.SOIN_LOCALISE],
  'Moisturizing Serums': [TAG_SLUGS.SERUM, TAG_SLUGS.HYDRATATION],
  Lotions: [TAG_SLUGS.LOTION, TAG_SLUGS.EMOLLIENCE],
  Toners: [TAG_SLUGS.TONIQUE, TAG_SLUGS.PREPARATION],
  Serums: [TAG_SLUGS.SERUM, TAG_SLUGS.TRAITEMENT],
  'Spot Treatments': [TAG_SLUGS.SPOT_TREATMENT, TAG_SLUGS.SOIN_LOCALISE],
  Creams: [TAG_SLUGS.CREME_HYDRATANTE, TAG_SLUGS.EMOLLIENCE],
  Oils: [TAG_SLUGS.HUILE_VISAGE, TAG_SLUGS.EMOLLIENCE],
  'Lip Mask': [TAG_SLUGS.SOIN_LEVRES, TAG_SLUGS.SLEEPING_MASK, TAG_SLUGS.ZONE_LEVRES],
  'Anti-Aging/Anti-Wrinkle': [TAG_SLUGS.ANTI_AGE],
  'Sets & Kits': [], // Souvent mélangé
}

/**
 * Récupère les IDs des tags à partir de leurs slugs
 */
async function getTagIdsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return []
  const results = await db.query.tags.findMany({
    where: (fields, { inArray }) => inArray(fields.slug, slugs),
  })
  return results.map((t) => t.id)
}

/**
 * Analyse un produit pour trouver les tags applicables (via mapper, nom et INCI)
 */
function getTargetTagSlugs(
  usageType: string,
  category: string,
  rawName: string,
  inci: string
): string[] {
  const slugs = new Set<string>()

  // 1. Mapping par catégories CSV
  if (usageType && TAG_MAPPER[usageType]) {
    TAG_MAPPER[usageType].forEach((s) => slugs.add(s))
  }
  if (category && TAG_MAPPER[category]) {
    TAG_MAPPER[category].forEach((s) => slugs.add(s))
  }

  // 2. Détection par mots-clés dans le NOM
  const lowerName = rawName.toLowerCase()
  Object.entries(NAME_KEYWORD_TAG_MAP).forEach(([kw, tagSlugs]) => {
    if (lowerName.includes(kw)) {
      tagSlugs.forEach((s) => slugs.add(s))
    }
  })

  // 3. Détection par INCI
  if (inci) {
    const lowerInci = inci.toLowerCase()
    Object.entries(INGREDIENT_TAG_MAP).forEach(([ing, tagSlugs]) => {
      // On cherche l'ingrédient comme un mot entier pour éviter les faux positifs
      const regex = new RegExp(`\\b${ing}\\b`, 'i')
      if (regex.test(lowerInci)) {
        tagSlugs.forEach((s) => slugs.add(s))
      }
    })
  }

  return Array.from(slugs)
}

/**
 * Robust CSV Parser that handles quoted fields with commas
 */
function parseCSV(text: string): string[][] {
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

/**
 * Extracts capacity and unit from product name
 * Example: "Product Name, 300 mL" -> { name: "Product Name", totalAmount: 300, unit: "mL" }
 */
function extractCapacity(productName: string, brand: string) {
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
  let unit: string = 'Pas spécifié'

  const matches = [...cleanName.matchAll(capacityRegex)]

  if (matches.length > 0) {
    // On cherche s'il y a du mL ou g en priorité dans les matches
    const metricMatch = matches.find((m) => /mL|g/i.test(m[2]))
    const selectedMatch = metricMatch || matches[matches.length - 1]

    let value = parseFloat(selectedMatch[1])
    unit = selectedMatch[2]

    // Conversion fl oz -> mL si nécessaire pour l'uniformité (optionnel mais conseillé)
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

async function seedSkincare() {
  console.log('🧪 Starting Skincare CSV Seeding...')

  // 1. Get User
  const user = await getOrCreateSeedUser()

  // 2. Initialiser le cache des marques pour normalisation
  console.log('🔍 Normalizing brands...')
  const { products: productsTable } = await import('../../schema/products')
  const existingProducts = await db.select({ brand: productsTable.brand }).from(productsTable)
  const brandCache = new Map<string, string>() // lowercase -> Original Name
  for (const p of existingProducts) {
    brandCache.set(p.brand.toLowerCase(), p.brand)
  }
  console.log(`   Found ${brandCache.size} unique brands already in DB.`)

  // 3. Load Data from CSV file
  const filePath = process.argv[2] || 'skincare.csv'
  console.log(`📂 Loading data from: ${filePath}...`)

  const file = Bun.file(filePath)
  if (!(await file.exists())) {
    console.error(`❌ File not found: ${filePath}`)
    process.exit(1)
  }

  const csvContent = await file.text()
  const rows = parseCSV(csvContent)
  const dataRows = rows.slice(1)

  console.log(`📊 Found ${dataRows.length} products in CSV.`)

  for (const row of dataRows) {
    let [_file, rawName, csvBrand, usageType, category, ingredientsList, imageUrl, productUrl] = row
    if (!rawName || !csvBrand) continue

    // NORMALISATION DE LA MARQUE
    const lowerBrand = csvBrand.toLowerCase()
    if (brandCache.has(lowerBrand)) {
      const cachedBrand = brandCache.get(lowerBrand)
      if (cachedBrand) {
        csvBrand = cachedBrand // Utilise le nom canonique déjà connu
      }
    } else {
      brandCache.set(lowerBrand, csvBrand) // Nouvelle marque rencontrée
    }

    const { name, totalAmount, unit } = extractCapacity(rawName, csvBrand)

    // On génère les deux variantes de slug possibles pour être sûr de trouver le doublon
    const slugVariant1 = slugify(`${csvBrand}-${name}`)
    const slugVariant2 = slugify(`${name}-${csvBrand}`)

    // VERIFICATION D'EXISTENCE ULTRA-SECURE
    const existingProduct = await db.query.products.findFirst({
      where: (fields, { or, eq }) =>
        or(eq(fields.slug, slugVariant1), eq(fields.slug, slugVariant2)),
    })

    const targetSlug = slugVariant1 // On garde celui-ci par défaut pour les nouveaux imports

    // SI LE PRODUIT EXISTE DÉJÀ : On met à jour ses tags s'il lui en manque
    if (existingProduct) {
      const { productTags } = await import('../../schema/tags')

      const targetSlugs = getTargetTagSlugs(usageType, category, rawName, ingredientsList)
      if (targetSlugs.length === 0) continue

      const currentTags = await db
        .select()
        .from(productTags)
        .where(sql`product_id = ${existingProduct.id}`)
      const currentTagDetails =
        currentTags.length > 0
          ? await db.query.tags.findMany({
              where: (fields, { inArray }) =>
                inArray(
                  fields.id,
                  currentTags.map((ct) => ct.tagId)
                ),
            })
          : []
      const currentSlugs = new Set(currentTagDetails.map((t) => t.slug))

      const missingSlugs = targetSlugs.filter((s) => !currentSlugs.has(s))

      if (missingSlugs.length > 0) {
        const tagIds = await getTagIdsBySlugs(missingSlugs)
        if (tagIds.length > 0) {
          console.log(
            `   ♻️  Updating tags for ${csvBrand} - ${name}: +${missingSlugs.length} tags (${missingSlugs.join(', ')})`
          )
          await addManyTagsToProduct(db, existingProduct.id, tagIds)
        }
      }
      continue
    }

    console.log(`🔹 Importing: ${csvBrand} - ${name} (${totalAmount ?? ''} ${unit})`)

    try {
      // 4. Create Product
      const product = await createProduct(
        user.id,
        {
          name,
          brand: csvBrand,
          kind: usageType || 'Pas spécifié',
          unit,
          totalAmount,
          imageUrl,
          inci: ingredientsList,
          url: productUrl,
          slug: targetSlug,
          notes: category ? `Category: ${category}` : null,
        },
        db
      )

      // 4. Associate Tags automatically
      const targetSlugs = getTargetTagSlugs(usageType, category, rawName, ingredientsList)
      const tagIds = await getTagIdsBySlugs(targetSlugs)
      if (tagIds.length > 0) {
        await addManyTagsToProduct(db, product.id, tagIds)
        console.log(`   🏷️ Linked ${tagIds.length} tags.`)
      }
    } catch (e) {
      console.error(`❌ Failed to seed product ${rawName}:`, e)
    }
  }

  console.log('✨ Skincare seeding completed!')
}

seedSkincare().catch(console.error)
