import { PRODUCT_UNITS, type ProductUnit } from '@habit-tracker/shared'

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

  if (cleanName.toLowerCase().startsWith(brand.toLowerCase())) {
    cleanName = cleanName
      .substring(brand.length)
      .replace(/^[,-\s]+/, '')
      .trim()
  }

  const capacityRegex = /[,(-]?\s*(\d+(?:\.\d+)?)\s*(mL|g|Count|pcs|sheets|fl\s*oz|oz)\b/gi

  let totalAmount: number | null = null
  let unit = 'Pas spécifié'
  let amountUnit: string | null = null

  const matches = [...cleanName.matchAll(capacityRegex)]

  if (matches.length > 0) {
    const metricMatch = matches.find((m) => /mL|g/i.test(m[2]))
    const selectedMatch = metricMatch || matches[matches.length - 1]

    let value = parseFloat(selectedMatch[1])
    const rawUnit = selectedMatch[2]

    unit = rawUnit

    if (/fl\s*oz|oz/i.test(rawUnit)) {
      value = value * 29.57
      unit = 'mL'
      amountUnit = 'mL'
    } else if (rawUnit.toLowerCase() === 'ml') {
      unit = 'mL'
      amountUnit = 'mL'
    } else if (rawUnit.toLowerCase() === 'g') {
      amountUnit = 'g'
    }

    totalAmount = Math.round(value)

    cleanName = cleanName
      .replace(capacityRegex, '')
      .replace(/[,-\s/]+$/, '')
      .trim()
  }

  return { name: cleanName, totalAmount, unit, amountUnit }
}

// Maps CSV category to the most likely container format.
// Fallback is TUBE — the most generic container used across skincare/bodycare.
const CATEGORY_UNIT_MAP: Record<string, ProductUnit> = {
  // Jar — rich textures
  Creams: PRODUCT_UNITS.skincare.JAR,
  'Nighttime Moisturizers': PRODUCT_UNITS.skincare.JAR,
  'Daytime Moisturizers': PRODUCT_UNITS.skincare.JAR,
  Balms: PRODUCT_UNITS.skincare.JAR,
  'Balms, Ointments & Salves': PRODUCT_UNITS.skincare.JAR,
  Butters: PRODUCT_UNITS.skincare.JAR,
  'Eye Cream, Gel, Oils, & Serum': PRODUCT_UNITS.skincare.JAR,

  // Dropper — serums/oils with pipette
  Serums: PRODUCT_UNITS.skincare.DROPPER,
  Serum: PRODUCT_UNITS.skincare.DROPPER,
  'Moisturizing Serums': PRODUCT_UNITS.skincare.DROPPER,
  Oils: PRODUCT_UNITS.skincare.DROPPER,
  Drops: PRODUCT_UNITS.skincare.DROPPER,

  // Pump — fluid/lotion-y
  Essence: PRODUCT_UNITS.skincare.PUMP,
  Lotions: PRODUCT_UNITS.skincare.PUMP,
  Emulsions: PRODUCT_UNITS.skincare.PUMP,
  Moisturizers: PRODUCT_UNITS.skincare.PUMP,
  'Moisturizers with SPF': PRODUCT_UNITS.skincare.PUMP,
  'Tinted Moisturizers': PRODUCT_UNITS.skincare.PUMP,
  'Facial Cleansing Oil': PRODUCT_UNITS.skincare.PUMP,
  'Facial Cleansing Milks': PRODUCT_UNITS.skincare.PUMP,
  'Liquid Cleansers & Soaps': PRODUCT_UNITS.skincare.PUMP,
  'Liquid or Cream Hand Soaps': PRODUCT_UNITS.skincare.PUMP,
  'Foaming Cleansers': PRODUCT_UNITS.skincare.PUMP,
  'Facial Foaming Cleansers': PRODUCT_UNITS.skincare.PUMP,
  'Facial Washes': PRODUCT_UNITS.skincare.PUMP,

  // Bottle — runnier liquids
  'Micellar Water': PRODUCT_UNITS.skincare.BOTTLE,
  Toners: PRODUCT_UNITS.skincare.BOTTLE,
  'Toners & Astringents': PRODUCT_UNITS.skincare.BOTTLE,
  Astringents: PRODUCT_UNITS.skincare.BOTTLE,

  // Spray — mists
  Mists: PRODUCT_UNITS.skincare.SPRAY,
  'Spray Moisturizer': PRODUCT_UNITS.skincare.SPRAY,
  'Spray Moisturizers': PRODUCT_UNITS.skincare.SPRAY,

  // Tube — gels, exfoliants, scrubs, cleansers (standard)
  Gels: PRODUCT_UNITS.skincare.TUBE,
  'Facial Gels': PRODUCT_UNITS.skincare.TUBE,
  Exfoliators: PRODUCT_UNITS.skincare.TUBE,
  'Exfoliators & Scrubs': PRODUCT_UNITS.skincare.TUBE,
  'Exfoliators, Polishes, & Scrubs': PRODUCT_UNITS.skincare.TUBE,
  Scrubs: PRODUCT_UNITS.skincare.TUBE,
  'Facial Scrubs': PRODUCT_UNITS.skincare.TUBE,
  Peels: PRODUCT_UNITS.skincare.TUBE,
  'Acids & Peels': PRODUCT_UNITS.skincare.TUBE,
  'Facial Cleansers': PRODUCT_UNITS.skincare.TUBE,

  // Pack — single-use items
  'Facial Masks': PRODUCT_UNITS.skincare.PACK,
  'Eye Masks & Pads': PRODUCT_UNITS.skincare.PACK,
  'Lip Mask': PRODUCT_UNITS.skincare.PACK,
  'Foot Mask': PRODUCT_UNITS.skincare.PACK,
  'Hand Masks': PRODUCT_UNITS.skincare.PACK,
  'Facial Wipes': PRODUCT_UNITS.skincare.PACK,
  'Cloths, Towelettes, & Wipes': PRODUCT_UNITS.skincare.PACK,
  'Body Wipes': PRODUCT_UNITS.skincare.PACK,
  'Pore Strips': PRODUCT_UNITS.skincare.PACK,
  'Acne Care (OTC)': PRODUCT_UNITS.skincare.PACK,
}

export function unitFromCategory(category: string): ProductUnit {
  return CATEGORY_UNIT_MAP[category] ?? PRODUCT_UNITS.skincare.TUBE
}
