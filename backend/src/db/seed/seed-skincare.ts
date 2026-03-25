import slugify from '@sindresorhus/slugify'
import { db } from '..'
import { createProduct } from '../../features/products/service'
import { addManyTagsToProduct } from '../../features/products/tags/tags.service'
import { products } from '../schema'
import { getOrCreateSeedUser } from './create-user'
import { INGREDIENT_TAG_MAP, NAME_KEYWORD_TAG_MAP } from './otherdata/tag-associations'
import { seedCore } from './seed-core'
import { TAG_SLUGS } from './tags/seed-tags'
import { extractCapacity, parseCSV, seedBatch } from './utils'

// ── Configuration & Mappings ──────────────────────────────────────────────────

const CSV_TAG_MAPPER: Record<string, string[]> = {
  'Skin Treatments': [TAG_SLUGS.TRAITEMENT, TAG_SLUGS.ZONE_VISAGE],
  Body: [TAG_SLUGS.ZONE_CORPS],
  'Facial Cleansers': [TAG_SLUGS.NETTOYANT, TAG_SLUGS.ZONE_VISAGE, TAG_SLUGS.DOUBLE_NETTOYAGE_2],
  Face: [TAG_SLUGS.ZONE_VISAGE],
  'Toners & Astringents': [TAG_SLUGS.TONIQUE, TAG_SLUGS.PREPARATION, TAG_SLUGS.ZONE_VISAGE],
  Eyes: [TAG_SLUGS.ZONE_YEUX, TAG_SLUGS.SOIN_YEUX, TAG_SLUGS.CONTOUR_YEUX],
  'Lip Care': [TAG_SLUGS.ZONE_LEVRES, TAG_SLUGS.SOIN_LEVRES],
  'Skin Care': [TAG_SLUGS.ZONE_VISAGE],
  'Eye Cream, Gel, Oils, & Serum': [TAG_SLUGS.CONTOUR_YEUX, TAG_SLUGS.ZONE_YEUX, TAG_SLUGS.SOIN_YEUX],
  Cleansers: [TAG_SLUGS.NETTOYANT],
  Moisturizers: [TAG_SLUGS.EMOLLIENCE, TAG_SLUGS.HYDRATATION],
  Sunscreen: [TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.CREME_SOLAIRE],
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
}

// ── Utilitaires CSV Spécifiques ───────────────────────────────────────────────

async function getTagIdsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return []
  const results = await db.query.tags.findMany({
    where: (fields, { inArray }) => inArray(fields.slug, slugs),
  })
  return results.map((t) => t.id)
}

function getTargetTagSlugs(
  usageType: string,
  category: string,
  rawName: string,
  inci: string
): string[] {
  const slugs = new Set<string>()
  if (usageType && CSV_TAG_MAPPER[usageType]) CSV_TAG_MAPPER[usageType].forEach((s) => slugs.add(s))
  if (category && CSV_TAG_MAPPER[category]) CSV_TAG_MAPPER[category].forEach((s) => slugs.add(s))
  const lowerName = rawName.toLowerCase()
  Object.entries(NAME_KEYWORD_TAG_MAP).forEach(([kw, tagSlugs]) => {
    if (lowerName.includes(kw)) tagSlugs.forEach((s) => slugs.add(s))
  })
  if (inci) {
    const lowerInci = inci.toLowerCase()
    Object.entries(INGREDIENT_TAG_MAP).forEach(([ing, tagSlugs]) => {
      const regex = new RegExp(`\\b${ing}\\b`, 'i')
      if (regex.test(lowerInci)) tagSlugs.forEach((s) => slugs.add(s))
    })
  }
  return Array.from(slugs)
}

// ── Fonction Principale ───────────────────────────────────────────────────────

export async function seedSkincare(csvPath = 'src/db/seed/products/otherData.csv') {
  console.log('🚀 DÉMARRAGE DU SEED SKINCARE (Import CSV)\n')

  const user = await getOrCreateSeedUser()
  const existingProducts = await db.select({ slug: products.slug }).from(products)
  const pMapSlugs = new Set(existingProducts.map((p) => p.slug))

  const file = Bun.file(csvPath)
  if (!(await file.exists())) {
    console.warn(`⚠️ Fichier CSV introuvable : ${csvPath}`)
    return
  }

  console.log(`📂 Importation CSV : ${csvPath}`)
  const content = await file.text()
  const rows = parseCSV(content).slice(1) // Skip header
  console.log(`📊 ${rows.length} produits trouvés dans le CSV.`)

  const productsToCreate = []
  for (const row of rows) {
    let [_file, rawName, csvBrand, usageType, category, inci, imageUrl, productUrl] = row
    if (!rawName || !csvBrand) continue

    const { name, totalAmount, unit } = extractCapacity(rawName, csvBrand)
    const targetSlug = slugify(`${csvBrand}-${name}`)

    if (pMapSlugs.has(targetSlug)) continue

    productsToCreate.push({
      user,
      name,
      brand: csvBrand,
      usageType,
      category,
      inci,
      imageUrl,
      productUrl,
      targetSlug,
      totalAmount,
      unit,
      rawName,
    })
  }

  console.log(`🆕 ${productsToCreate.length} nouveaux produits à créer.`)

  await seedBatch(
    'produits CSV',
    productsToCreate,
    async (item) => {
      const product = await createProduct(
        item.user.id,
        {
          name: item.name,
          brand: item.brand,
          kind: item.usageType || 'Pas spécifié',
          unit: item.unit,
          totalAmount: item.totalAmount,
          imageUrl: item.imageUrl,
          inci: item.inci,
          url: item.productUrl,
          slug: item.targetSlug,
          notes: item.category ? `Category: ${item.category}` : null,
        },
        db
      )

      const targetSlugs = getTargetTagSlugs(item.usageType, item.category, item.rawName, item.inci)
      const tagIds = await getTagIdsBySlugs(targetSlugs)
      if (tagIds.length > 0) await addManyTagsToProduct(db, product.id, tagIds)
    },
    (item) => item.targetSlug
  )

  console.log('\n✨ Seed SKINCARE terminé avec succès !')
}

// Auto-exécution si lancé directement
if (import.meta.main || process.argv[1]?.endsWith('seed-skincare.ts')) {
  // On peut décider de lancer le core avant si on veut un seed complet
  const fullSeed = process.argv.includes('--full')

  if (fullSeed) {
    seedCore()
      .then(() => seedSkincare())
      .catch(console.error)
  } else {
    seedSkincare().catch(console.error)
  }
}
