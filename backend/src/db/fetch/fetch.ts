import { resolve } from 'node:path'

interface OpenBeautyProduct {
  _id: string
  product_name?: string
  product_name_fr?: string
  product_name_en?: string
  brands?: string
  brands_tags?: string[]
  categories?: string
  categories_tags?: string[]
  quantity?: string
  product_quantity?: number
  product_quantity_unit?: string
  ingredients_text?: string
  ingredients_text_fr?: string
  ingredients_text_en?: string
  link?: string
  url?: string
  code?: string
  image_url?: string
  packaging?: string
  labels?: string
  labels_tags?: string[]
  countries?: string
  manufacturing_places?: string
  additives_tags?: string[]
  nova_group?: number
  ecoscore_grade?: string
  nutriscore_grade?: string
  completeness?: number
}

interface OpenBeautyResponse {
  count: number
  page: number
  page_count: number
  page_size: number
  products: OpenBeautyProduct[]
}

interface Product {
  name: string
  brand: string
  kind: 'skincare'
  unit: string
  slug: string
  totalAmount: number
  amountUnit: string
  priceCents: number | null
  description: string
  notes: string
  inci: string
  url: string
}

export const BRAND_NAMES = [
  'Avène',
  'La Roche-Posay',
  'CeraVe',
  'Bioderma',
  'Eucerin',
  'Uriage',
  'Vichy',
  'SVR',
  'Ducray',
  'A-Derma',
  'Embryolisse',
  'Filorga',
  'Noreva',
  'Isispharma',
  'ACM Laboratoire Dermatologique',
  'Topicrem',
  'Dexeryl',
  'Rogé Cavaillès',
  'ISDIN',
  'Altruist',
  'Heliocare',
  'The Ordinary',
  'NIOD',
  'The Inkey List',
  "Paula's Choice",
  'Geek & Gorgeous',
  'Typology',
  'Minimalist',
  'Medik8',
  'Allies of Skin',
  'SkinBetter Science',
  'SkinCeuticals',
  'Dr Dennis Gross',
  'Perricone MD',
  'Sunday Riley',
  'Drunk Elephant',
  'Tatcha',
  'Fresh',
  'Glow Recipe',
  'Summer Fridays',
  'Youth to the People',
  'Ole Henriksen',
  'Herbivore Botanicals',
  'Farmacy',
  "Kiehl's",
  'Charlotte Tilbury',
  'Augustinus Bader',
  'La Mer',
  'Sisley',
  'Estée Lauder',
  'Clinique',
  'Shiseido',
  'Lancôme',
  'Dior',
  'Chanel',
  'mixa',
  'la provançale',
  'laboratoires de Biarritz',
  "l'occitane",
  'aroma zone',
  'aroma-zone',
  'avril',
  'Yves ROCHER',
  'Yves Rocher',
  'YVES ROCHER',
  'Sephora',
  'SEPHORA',
  'RETINOL',
  'Même',
  'Pierre Fabre',
  'Mustela',
  'Mixa',
  'Mixa Bébé',
  'Mixa bébé',
  'Mixa intensif peaux sèches',
  'MIXA',
  'L’Occitane',
  'Lidl',
  'Le Petit Marseillais',
  'Le Petit Marsellais',
  'Le Petit Olivier',
  'Le Petit olivier',
  'Le comptoir du bain',
  'Le petit Marseillais',
  'Le petit Olivier',
  'Le petit marseillais',
  'Le petit olivier',
  'La rosée',
  'Laboratoire ASEPTA',
  'Laboratoire Dermophil',
  'Laboratoire Mercurochrome',
  'Laboratoire SVR',
  'Laboratoire Vendôme',
  'Laboratoire dermosun',
  'Laboratoire giphar',
  'Laboratoire marque verte',
  'Laboratoires Gilbert',
  'Laboratoires Vendome',
  'La Provencale',
  'LES SECRETS DE LOLY',
  "L'occitane",
  "L'Occitane",
  "L'Occitane en Provence",
  'Klorane',
  'JONZAC',
  'Eau Thermale Avène',
  'Eau Thermale Jonzac',
  'Eau précieuse',
  'Eau thermale Avène',
  'EAU THERMALE JONZAC',
  'Diadermine',
  'Comme Avant',
  'Comme avant',
  'Cien',
  'Cien MEN',
  'Cien Men',
  'Cien Sun',
  'Cien sun',
  'CIEN',
  'CIEN (Lidl)',
  'CIEN MEN',
  'CADUM',
  'Biafine',
  'Avril',
  'COSRX',
  'Laneige',
  'Beauty of Joseon',
  'Innisfree',
  'Etude House',
  'Sulwhasoo',
  'Dr Jart+',
  'Some By Mi',
  'Missha',
  'Round Lab',
  'Pyunkang Yul',
  'Benton',
  "I'm From",
  'Isntree',
  'Banila Co',
  'Skinfood',
  'Mediheal',
  'AHC',
  'Amorepacific',
  'Holika Holika',
  'Hada Labo',
  'DHC',
  'SK-II',
  'Kose',
  'Sekkisei',
  'Curel',
  'Minon',
  'Bioré',
  'Senka',
  'Kanebo',
  'Rohto',
  'Caudalie',
  'Nuxe',
  'Weleda',
  'Dr Hauschka',
  'Pai Skincare',
  'Tata Harper',
  'REN Clean Skincare',
  'Mad Hippie',
  'Biossance',
  'Osea',
  'True Botanicals',
  'Indie Lee',
  'Neutrogena',
  'Nivea',
  'Garnier',
  'Olay',
  "L'Oréal Paris",
  'Simple',
  'Cetaphil',
  'Dove',
  'Aveeno',
  "Pond's",
  'St Ives',
  'Clean & Clear',
  'Obagi',
  'ZO Skin Health',
  'Revision Skincare',
  'EltaMD',
  'PCA Skin',
  'Dermalogica',
  'Murad',
  'iS Clinical',
  'SkinMedica',
  'Jan Marini',
  'Byoma',
  'Krave Beauty',
  'Naturium',
  'Versed',
  'Bubble Skincare',
  'Dieux Skin',
  'Rhode',
  'Fenty Skin',
  'Selfless by Hyram',
  'Peace Out Skincare',
]

const normalize = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '') // Supprime espaces, tirets, apostrophes, etc.
    .trim()
}

// 🚀 MAP DE MARQUES POUR LOOKUP O(1) - Performance massivement améliorée
const BRAND_MAP = new Map<string, string>()

// Précalcule toutes les variantes possibles des marques connues
for (const brand of BRAND_NAMES) {
  const normalized = normalize(brand)
  BRAND_MAP.set(normalized, brand)

  // Ajoute des variantes courantes (avec espaces/tirets différents)
  BRAND_MAP.set(normalized.replace(/\s+/g, ''), brand) // sans espaces
  BRAND_MAP.set(brand.toLowerCase().replace(/[^a-z0-9]/g, ''), brand) // alternative
}

// Constantes de configuration
const MAX_PAGES = 1000 // Sécurité pour éviter boucle infinie
const BATCH_SIZE = 100 // Taille des pages API
const REQUEST_DELAY_MS = 800 // Délai entre requêtes
const MAX_RETRIES = 3 // Nombre max de retries en cas d'erreur 429

// Vérifier si le produit a des ingrédients (INCI)
const hasValidInci = (product: OpenBeautyProduct): boolean => {
  const inci =
    product.ingredients_text_fr || product.ingredients_text_en || product.ingredients_text
  return !!inci && inci.trim().length > 10
}

// Slugs générés automatiquement
const generateSlug = (name: string, code: string, brand: string): string => {
  const cleanBrand = brand
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '')
    .substring(0, 10)

  const cleanName = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 20)

  return `${cleanBrand}_${cleanName.toUpperCase()}_${code.slice(-4)}`
}

// Détecter le type d'unité
const detectUnit = (name: string, quantity?: string): string => {
  const lowerName = name.toLowerCase()
  const lowerQty = quantity?.toLowerCase() || ''

  if (lowerName.includes('serum') || lowerName.includes('sérum')) return 'dropper'
  if (lowerName.includes('cream') || lowerName.includes('crème') || lowerName.includes('lotion'))
    return 'tube'
  if (lowerName.includes('cleanser') || lowerName.includes('nettoyant')) return 'pump'
  if (lowerName.includes('bottle') || lowerQty.includes('ml')) return 'bottle'
  if (lowerName.includes('jar') || lowerName.includes('pot')) return 'jar'
  if (lowerName.includes('spray') || lowerName.includes('brume')) return 'spray'
  if (lowerName.includes('stick') || lowerName.includes('baume')) return 'stick'
  if (lowerName.includes('gel')) return 'tube'
  if (lowerName.includes('huile') || lowerName.includes('oil')) return 'bottle'

  return 'tube'
}

// Extraire la quantité
const extractAmount = (product: OpenBeautyProduct): { totalAmount: number; amountUnit: string } => {
  if (product.product_quantity && product.product_quantity > 0) {
    return {
      totalAmount: product.product_quantity,
      amountUnit: product.product_quantity_unit || 'ml',
    }
  }

  if (product.quantity) {
    const match = product.quantity.match(/(\d+(?:\.\d+)?)\s*(ml|g|oz|l|kg|cl)?/i)
    if (match) {
      return {
        totalAmount: parseFloat(match[1]),
        amountUnit: (match[2] || 'ml').toLowerCase(),
      }
    }
    const numMatch = product.quantity.match(/\d+/)
    if (numMatch) {
      return { totalAmount: parseInt(numMatch[0]), amountUnit: 'ml' }
    }
  }

  return { totalAmount: 0, amountUnit: 'ml' }
}
// 🚀 EXTRACTION DE MARQUE OPTIMISÉE AVEC MAP O(1)
const extractBrand = (product: OpenBeautyProduct): string | null => {
  // Liste des candidats possibles pour la marque
  const candidates: string[] = []

  if (product.brands) {
    candidates.push(product.brands.split(',')[0].trim())
  }

  if (product.brands_tags && product.brands_tags.length > 0) {
    candidates.push(product.brands_tags[0].replace(/^en:/, '').replace(/-/g, ' ').trim())
  }

  // Essaie aussi la première partie du nom de produit (souvent la marque)
  if (product.product_name) {
    const firstWord = product.product_name.split(' ')[0].trim()
    if (firstWord.length > 1) candidates.push(firstWord)
  }

  // Cherche le premier match dans notre Map
  for (const candidate of candidates) {
    const normalized = normalize(candidate)
    const match = BRAND_MAP.get(normalized)
    if (match) return match

    // Essaie avec des variantes (sans espaces, sans tirets)
    const compact = normalized.replace(/[^a-z0-9]/g, '')
    const compactMatch = BRAND_MAP.get(compact)
    if (compactMatch) return compactMatch
  }

  return null
}
// Générer une description
const generateDescription = (product: OpenBeautyProduct): string => {
  const parts: string[] = []

  if (product.categories) {
    parts.push(`Catégorie: ${product.categories}`)
  }

  if (product.labels) {
    parts.push(`Labels: ${product.labels}`)
  }

  if (product.additives_tags?.length) {
    parts.push(`${product.additives_tags.length} additifs`)
  }

  return parts.join(' | ') || 'Produit cosmétique disponible en France'
}

// Générer les notes
const generateNotes = (product: OpenBeautyProduct): string => {
  const notes: string[] = []

  if (product.ecoscore_grade && product.ecoscore_grade !== 'unknown') {
    notes.push(`Eco-score: ${product.ecoscore_grade.toUpperCase()}`)
  }

  if (product.manufacturing_places) {
    notes.push(`Fabriqué en: ${product.manufacturing_places}`)
  }

  if (product.packaging) {
    notes.push(`Packaging: ${product.packaging}`)
  }

  if (product.completeness) {
    notes.push(`Data: ${Math.round(product.completeness * 100)}%`)
  }

  return notes.join(' | ') || 'Source: OpenBeautyFacts France'
}

// Nettoyer l'INCI
const cleanInci = (ingredients: string): string => {
  return ingredients
    .replace(/\r\n/g, ', ')
    .replace(/\n/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 500)
}

const buildFranceSearchUrl = (page: number): string => {
  const params = new URLSearchParams({
    countries_tags: 'en:france',
    page_size: BATCH_SIZE.toString(),
    page: page.toString(),
    json: '1',
    fields:
      'code,product_name,product_name_fr,product_name_en,brands,brands_tags,categories,quantity,product_quantity,product_quantity_unit,ingredients_text,ingredients_text_fr,ingredients_text_en,image_url,url,link,packaging,labels,labels_tags,countries,manufacturing_places,additives_tags,ecoscore_grade,completeness',
  })

  return `https://world.openbeautyfacts.org/api/v2/search?${params.toString()}`
}

async function fetchAllFranceProductsWithInci(): Promise<{
  products: Product[]
  unknownBrands: Set<string>
}> {
  const products: Product[] = []
  const unknownBrands = new Set<string>()
  let page = 1
  let totalCount = 0
  let skippedNoInci = 0
  let skippedUnknownBrand = 0
  let retryDelay = 5000 // Délai initial pour rate limiting

  console.log('🇫🇷 Fetching beauty products available in France...')
  console.log('🧪 Filters: INCI required + Known brands only')
  console.log(`🏷️  Whitelist: ${BRAND_NAMES.length} brands`)
  console.log('⏳ This will take several minutes...\n')

  while (page <= MAX_PAGES) {
    const url = buildFranceSearchUrl(page)
    console.log(
      `📄 Page ${page} | Collected: ${products.length} | Skipped (no INCI): ${skippedNoInci} | Skipped (unknown brand): ${skippedUnknownBrand} | Unknown brands: ${unknownBrands.size}`
    )

    try {
      const response = await fetch(url)

      if (!response.ok) {
        console.error(`⚠️ HTTP ${response.status} on page ${page}`)

        if (response.status === 429 && page <= MAX_RETRIES) {
          console.log(`⏸️ Rate limited, waiting ${retryDelay / 1000}s...`)
          await new Promise((r) => setTimeout(r, retryDelay))
          retryDelay *= 2 // Exponential backoff
          continue
        }
        break
      }

      // Reset retry delay après succès
      retryDelay = 5000

      const data = (await response.json()) as OpenBeautyResponse

      if (page === 1) {
        totalCount = data.count
        console.log(`📊 Total products in France (API): ${totalCount}`)
        console.log(`📈 Estimated pages: ${Math.ceil(totalCount / BATCH_SIZE)}\n`)
      }

      if (data.products.length === 0) {
        console.log('✅ No more products on this page, stopping.')
        break
      }

      for (const rawProduct of data.products) {
        // 1. Check INCI
        if (!hasValidInci(rawProduct)) {
          skippedNoInci++
          continue
        }

        // 2. Extract brand avec Map O(1)
        const matchedBrand = extractBrand(rawProduct)

        if (!matchedBrand) {
          skippedUnknownBrand++
          // Stocke la marque brute pour référence
          const rawBrand = rawProduct.brands?.split(',')[0].trim() || 'Unknown'
          unknownBrands.add(rawBrand)
          continue
        }

        const transformed = transformProduct(rawProduct, matchedBrand)
        products.push(transformed)
      }

      if (data.products.length < BATCH_SIZE || page >= data.page_count) {
        console.log('✅ Last page reached')
        break
      }

      page++
      // Délai entre requêtes pour respecter l'API
      await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS))
    } catch (error) {
      console.error(`❌ Error on page ${page}:`, error)
      break
    }
  }

  return { products, unknownBrands }
}

// Transformer un produit
const transformProduct = (product: OpenBeautyProduct, brand: string): Product => {
  // ✅ Gestion des noms vides avec trim()
  const name =
    product.product_name_fr?.trim() ||
    product.product_name_en?.trim() ||
    product.product_name?.trim() ||
    'Produit sans nom'

  const { totalAmount, amountUnit } = extractAmount(product)
  const unit = detectUnit(name, product.quantity)
  const rawInci =
    product.ingredients_text_fr || product.ingredients_text_en || product.ingredients_text

  return {
    name: name,
    brand: brand,
    kind: 'skincare',
    unit: unit,
    slug: generateSlug(name, product.code || product._id, brand),
    totalAmount: totalAmount,
    amountUnit: amountUnit,
    priceCents: null,
    description: generateDescription(product),
    notes: generateNotes(product),
    // biome-ignore lint: osef
    inci: cleanInci(rawInci!),
    url: product.url || product.link || `https://world.openbeautyfacts.org/product/${product.code}`,
  }
}

// Générer le fichier TypeScript principal
const generateTypeScriptFile = (products: Product[]): string => {
  const productsString = products
    .map(
      (p) => `  {
    name: "${escapeString(p.name)}",
    brand: '${escapeString(p.brand)}',
    kind: 'skincare',
    unit: '${p.unit}',
    slug: PRODUCT_SLUGS.${p.slug},
    totalAmount: ${p.totalAmount},
    amountUnit: '${p.amountUnit}',
    priceCents: ${p.priceCents},
    description: "${escapeString(p.description)}",
    notes: "${escapeString(p.notes)}",
    inci: '${escapeString(p.inci)}',
    url: '${p.url}',
  }`
    )
    .join(',\n')

  return `// Filtered beauty products available in France
// Filters: INCI required + Known brands only (${BRAND_NAMES.length} brands)
// Source: OpenBeautyFacts (world.openbeautyfacts.org)
// Generated on: ${new Date().toISOString()}
// Total products: ${products.length}

export const FRANCE_PRODUCTS_FILTERED = [
${productsString}
] as const;

export type FranceProductFiltered = typeof FRANCE_PRODUCTS_FILTERED[number];

export const getProductsByBrand = (brand: string) =>
  FRANCE_PRODUCTS_FILTERED.filter(p =>
    p.brand.toLowerCase().includes(brand.toLowerCase())
  );

export const searchProductsByName = (query: string) =>
  FRANCE_PRODUCTS_FILTERED.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

export const searchByIngredient = (ingredient: string) =>
  FRANCE_PRODUCTS_FILTERED.filter(p =>
    p.inci.toLowerCase().includes(ingredient.toLowerCase())
  );

export const UNIQUE_BRANDS = [
  ...new Set(FRANCE_PRODUCTS_FILTERED.map(p => p.brand))
].sort();

export const PRODUCTS_BY_UNIT = {
  dropper: FRANCE_PRODUCTS_FILTERED.filter(p => p.unit === 'dropper'),
  tube: FRANCE_PRODUCTS_FILTERED.filter(p => p.unit === 'tube'),
  pump: FRANCE_PRODUCTS_FILTERED.filter(p => p.unit === 'pump'),
  bottle: FRANCE_PRODUCTS_FILTERED.filter(p => p.unit === 'bottle'),
  jar: FRANCE_PRODUCTS_FILTERED.filter(p => p.unit === 'jar'),
  spray: FRANCE_PRODUCTS_FILTERED.filter(p => p.unit === 'spray'),
  stick: FRANCE_PRODUCTS_FILTERED.filter(p => p.unit === 'stick'),
} as const;
`
}

// Générer le fichier des marques inconnues
const generateUnknownBrandsFile = (unknownBrands: Set<string>): string => {
  const sortedBrands = Array.from(unknownBrands).sort()

  return `// Unknown brands encountered during fetch
// These brands were found in OpenBeautyFacts France but NOT in BRAND_NAMES whitelist
// Generated on: ${new Date().toISOString()}
// Total unknown brands: ${sortedBrands.length}

export const UNKNOWN_BRANDS = [
${sortedBrands.map((b) => `  '${escapeString(b)}'`).join(',\n')}
] as const;

// Copy-paste interesting brands from here to BRAND_NAMES if needed
`
}

// Échapper les chaînes pour TypeScript
const escapeString = (str: string): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .trim()
}

async function main(): Promise<void> {
  const startTime = Date.now()
  const cwd = process.cwd()

  try {
    const { products, unknownBrands } = await fetchAllFranceProductsWithInci()

    if (products.length === 0) {
      console.log('\n⚠️ No products found with your filters!')
    } else {
      const mainFilename = 'france_products_filtered.ts'
      const mainPath = resolve(cwd, mainFilename)
      const mainContent = generateTypeScriptFile(products)

      await Bun.write(mainPath, mainContent)

      console.log(`\n✅ MAIN FILE: ${mainPath}`)
      console.log(`   ${products.length} products written`)
    }

    const unknownFilename = 'unknown-brands.ts'
    const unknownPath = resolve(cwd, unknownFilename)
    const unknownContent = generateUnknownBrandsFile(unknownBrands)

    await Bun.write(unknownPath, unknownContent)

    console.log(`\n✅ UNKNOWN BRANDS FILE: ${unknownPath}`)
    console.log(`   ${unknownBrands.size} unique brands found`)

    if (unknownBrands.size > 0) {
      console.log('\n📋 Sample of unknown brands:')

      const sample = Array.from(unknownBrands).slice(0, 10)
      for (const brand of sample) {
        console.log(`   - ${brand}`)
      }

      if (unknownBrands.size > 10) {
        console.log(`   ... and ${unknownBrands.size - 10} more`)
      }
    }

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
    console.log(`\n⏱️ Total duration: ${duration} minutes`)
  } catch (error) {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  }
}

main()
