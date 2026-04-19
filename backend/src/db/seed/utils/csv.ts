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
    cleanName = cleanName.substring(brand.length).replace(/^[,-\s]+/, '').trim()
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

    cleanName = cleanName.replace(capacityRegex, '').replace(/[,-\s/]+$/, '').trim()
  }

  return { name: cleanName, totalAmount, unit, amountUnit }
}

// Maps CSV category to the most likely container format.
// Fallback is TUBE — the most generic container used across skincare/bodycare.
const CATEGORY_UNIT_MAP: Record<string, ProductUnit> = {
  // Jar — rich textures
  Creams: PRODUCT_UNITS.JAR,
  'Nighttime Moisturizers': PRODUCT_UNITS.JAR,
  'Daytime Moisturizers': PRODUCT_UNITS.JAR,
  Balms: PRODUCT_UNITS.JAR,
  'Balms, Ointments & Salves': PRODUCT_UNITS.JAR,
  Butters: PRODUCT_UNITS.JAR,
  'Eye Cream, Gel, Oils, & Serum': PRODUCT_UNITS.JAR,

  // Dropper — serums/oils with pipette
  Serums: PRODUCT_UNITS.DROPPER,
  Serum: PRODUCT_UNITS.DROPPER,
  'Moisturizing Serums': PRODUCT_UNITS.DROPPER,
  Oils: PRODUCT_UNITS.DROPPER,
  Drops: PRODUCT_UNITS.DROPPER,

  // Pump — fluid/lotion-y
  Essence: PRODUCT_UNITS.PUMP,
  Lotions: PRODUCT_UNITS.PUMP,
  Emulsions: PRODUCT_UNITS.PUMP,
  Moisturizers: PRODUCT_UNITS.PUMP,
  'Moisturizers with SPF': PRODUCT_UNITS.PUMP,
  'Tinted Moisturizers': PRODUCT_UNITS.PUMP,
  'Facial Cleansing Oil': PRODUCT_UNITS.PUMP,
  'Facial Cleansing Milks': PRODUCT_UNITS.PUMP,
  'Liquid Cleansers & Soaps': PRODUCT_UNITS.PUMP,
  'Liquid or Cream Hand Soaps': PRODUCT_UNITS.PUMP,
  'Foaming Cleansers': PRODUCT_UNITS.PUMP,
  'Facial Foaming Cleansers': PRODUCT_UNITS.PUMP,
  'Facial Washes': PRODUCT_UNITS.PUMP,

  // Bottle — runnier liquids
  'Micellar Water': PRODUCT_UNITS.BOTTLE,
  Toners: PRODUCT_UNITS.BOTTLE,
  'Toners & Astringents': PRODUCT_UNITS.BOTTLE,
  Astringents: PRODUCT_UNITS.BOTTLE,

  // Spray — mists
  Mists: PRODUCT_UNITS.SPRAY,
  'Spray Moisturizer': PRODUCT_UNITS.SPRAY,
  'Spray Moisturizers': PRODUCT_UNITS.SPRAY,

  // Tube — gels, exfoliants, scrubs, cleansers (standard)
  Gels: PRODUCT_UNITS.TUBE,
  'Facial Gels': PRODUCT_UNITS.TUBE,
  Exfoliators: PRODUCT_UNITS.TUBE,
  'Exfoliators & Scrubs': PRODUCT_UNITS.TUBE,
  'Exfoliators, Polishes, & Scrubs': PRODUCT_UNITS.TUBE,
  Scrubs: PRODUCT_UNITS.TUBE,
  'Facial Scrubs': PRODUCT_UNITS.TUBE,
  Peels: PRODUCT_UNITS.TUBE,
  'Acids & Peels': PRODUCT_UNITS.TUBE,
  'Facial Cleansers': PRODUCT_UNITS.TUBE,

  // Pack — single-use items
  'Facial Masks': PRODUCT_UNITS.PACK,
  'Eye Masks & Pads': PRODUCT_UNITS.PACK,
  'Lip Mask': PRODUCT_UNITS.PACK,
  'Foot Mask': PRODUCT_UNITS.PACK,
  'Hand Masks': PRODUCT_UNITS.PACK,
  'Facial Wipes': PRODUCT_UNITS.PACK,
  'Cloths, Towelettes, & Wipes': PRODUCT_UNITS.PACK,
  'Body Wipes': PRODUCT_UNITS.PACK,
  'Pore Strips': PRODUCT_UNITS.PACK,
  'Acne Care (OTC)': PRODUCT_UNITS.PACK,
}

export function unitFromCategory(category: string): ProductUnit {
  return CATEGORY_UNIT_MAP[category] ?? PRODUCT_UNITS.TUBE
}
