import { PRODUCT_KINDS, PRODUCT_UNITS, type ProductUnit } from '@habit-tracker/shared'

// ── Category + Kind normalization ─────────────────────────────────────────────
//
// schema: PRODUCT_CATEGORIES (broad) and PRODUCT_KINDS (specific type).
// usage_type is the top-level bucket (Body/Hand/Face/Lip Care/Eyes...) and
// category is the fine-grained type (Serums, Toners, Facial Cleansers...).

// Maps CSV category column → skincare product kind.
export const SKINCARE_KIND_MAP: Record<string, string> = {
  // cleansers
  'Facial Cleansers': PRODUCT_KINDS.skincare.CLEANSER,
  'Facial Washes': PRODUCT_KINDS.skincare.CLEANSER,
  'Facial Foaming Cleansers': PRODUCT_KINDS.skincare.CLEANSER,
  'Foaming Cleansers': PRODUCT_KINDS.skincare.CLEANSER,
  'Facial Cleansing Milks': PRODUCT_KINDS.skincare.CLEANSER,
  'Facial Cleansing Oil': PRODUCT_KINDS.skincare.CLEANSER,
  'Facial Bar Soap': PRODUCT_KINDS.skincare.CLEANSER,
  'Bar Soaps': PRODUCT_KINDS.skincare.CLEANSER,
  'Liquid Cleansers & Soaps': PRODUCT_KINDS.skincare.CLEANSER,
  'Facial Wipes': PRODUCT_KINDS.skincare.CLEANSER,
  'Cloths, Towelettes, & Wipes': PRODUCT_KINDS.skincare.CLEANSER,
  Flushable: PRODUCT_KINDS.skincare.CLEANSER,
  'Micellar Water': PRODUCT_KINDS.skincare.CLEANSER,
  'Pore Cleansing': PRODUCT_KINDS.skincare.CLEANSER,
  Cleansers: PRODUCT_KINDS.skincare.CLEANSER,

  // toners / essence / mist
  Toners: PRODUCT_KINDS.skincare.TONER,
  'Toners & Astringents': PRODUCT_KINDS.skincare.TONER,
  Astringents: PRODUCT_KINDS.skincare.TONER,
  Essence: PRODUCT_KINDS.skincare.ESSENCE,
  Mists: PRODUCT_KINDS.skincare.MIST,
  'Spray Moisturizer': PRODUCT_KINDS.skincare.MIST,
  'Spray Moisturizers': PRODUCT_KINDS.skincare.MIST,

  // serums
  Serum: PRODUCT_KINDS.skincare.SERUM,
  Serums: PRODUCT_KINDS.skincare.SERUM,
  'Moisturizing Serums': PRODUCT_KINDS.skincare.SERUM,
  'Lash & Brow Growth': PRODUCT_KINDS.skincare.SERUM,
  Complexes: PRODUCT_KINDS.skincare.SERUM,
  Drops: PRODUCT_KINDS.skincare.SERUM,

  // treatments
  'Skin Treatments': PRODUCT_KINDS.skincare.SPOT_TREATMENT,
  'Spot Treatments': PRODUCT_KINDS.skincare.SPOT_TREATMENT,
  'Pore Treatments': PRODUCT_KINDS.skincare.SPOT_TREATMENT,
  'Acne Care (OTC)': PRODUCT_KINDS.skincare.SPOT_TREATMENT,
  'Pore Refining': PRODUCT_KINDS.skincare.SPOT_TREATMENT,

  // moisturizers / creams
  Creams: PRODUCT_KINDS.skincare.MOISTURIZER,
  Moisturizers: PRODUCT_KINDS.skincare.MOISTURIZER,
  'Moisturizers with SPF': PRODUCT_KINDS.skincare.MOISTURIZER,
  'Nighttime Moisturizers': PRODUCT_KINDS.skincare.MOISTURIZER,
  'Daytime Moisturizers': PRODUCT_KINDS.skincare.MOISTURIZER,
  'Tinted Moisturizers': PRODUCT_KINDS.skincare.MOISTURIZER,
  Emulsions: PRODUCT_KINDS.skincare.MOISTURIZER,
  Gels: PRODUCT_KINDS.skincare.MOISTURIZER,
  'Facial Gels': PRODUCT_KINDS.skincare.MOISTURIZER,
  Lotions: PRODUCT_KINDS.skincare.MOISTURIZER,

  // oils / balms / occlusives
  Oils: PRODUCT_KINDS.skincare.OIL,
  Balms: PRODUCT_KINDS.skincare.BALM,
  'Balms, Ointments & Salves': PRODUCT_KINDS.skincare.BALM,
  OIntments: PRODUCT_KINDS.skincare.BALM,
  Butters: PRODUCT_KINDS.skincare.BALM,

  // eye care
  'Eye Cream, Gel, Oils, & Serum': PRODUCT_KINDS.skincare.EYE_CREAM,
  'Puffiness Treatments': PRODUCT_KINDS.skincare.EYE_CREAM,
  'Dark Circle Treatments': PRODUCT_KINDS.skincare.EYE_CREAM,

  // lip care
  'Lip Balms, Gels, Moisturizers & Oils': PRODUCT_KINDS.skincare.LIP_CARE,

  // exfoliation
  Exfoliators: PRODUCT_KINDS.skincare.EXFOLIANT,
  'Exfoliators & Scrubs': PRODUCT_KINDS.skincare.EXFOLIANT,
  'Exfoliators, Polishes, & Scrubs': PRODUCT_KINDS.skincare.EXFOLIANT,
  Scrubs: PRODUCT_KINDS.skincare.EXFOLIANT,
  'Facial Scrubs': PRODUCT_KINDS.skincare.EXFOLIANT,
  Polishes: PRODUCT_KINDS.skincare.EXFOLIANT,
  Peels: PRODUCT_KINDS.skincare.EXFOLIANT,
  'Acids & Peels': PRODUCT_KINDS.skincare.EXFOLIANT,
  'Alpha Beta': PRODUCT_KINDS.skincare.EXFOLIANT,
  'Glycolic Acid': PRODUCT_KINDS.skincare.EXFOLIANT,
  'Salicylic Acid': PRODUCT_KINDS.skincare.EXFOLIANT,
  Microdermabrasion: PRODUCT_KINDS.skincare.EXFOLIANT,
  'Lip Exfoliators + Scrubs': PRODUCT_KINDS.skincare.EXFOLIANT,

  // masks / patches
  'Facial Masks': PRODUCT_KINDS.skincare.MASK,
  'Lip Mask': PRODUCT_KINDS.skincare.MASK,
  'Eye Masks & Pads': PRODUCT_KINDS.skincare.PATCH,
  'Pore Strips': PRODUCT_KINDS.skincare.PATCH,

  // sun care
  Sunscreen: PRODUCT_KINDS.solaire.SUNSCREEN,
}

// Separate map for Bodycare
export const BODYCARE_KIND_MAP: Record<string, string> = {
  Hand: PRODUCT_KINDS.bodycare.HAND_CREAM,
  'Hand Masks': PRODUCT_KINDS.bodycare.HAND_CREAM,
  'Moisturizing Gloves': PRODUCT_KINDS.bodycare.HAND_CREAM,
  'Foot Mask': PRODUCT_KINDS.bodycare.FOOT_CREAM,
  Feet: PRODUCT_KINDS.bodycare.FOOT_CREAM,
  Body: PRODUCT_KINDS.bodycare.BODY_LOTION,
  'Neck & Décolleté': PRODUCT_KINDS.skincare.MOISTURIZER,
}

// ── Category + Unit normalization ─────────────────────────────────────────────

export const CATEGORY_UNIT_MAP: Record<string, ProductUnit> = {
  // Liquids
  Toners: PRODUCT_UNITS.BOTTLE,
  'Toners & Astringents': PRODUCT_UNITS.BOTTLE,
  Astringents: PRODUCT_UNITS.BOTTLE,
  'Micellar Water': PRODUCT_UNITS.BOTTLE,

  // Pumps / Sprays
  'Facial Cleansers': PRODUCT_UNITS.PUMP,
  'Facial Washes': PRODUCT_UNITS.PUMP,
  'Facial Foaming Cleansers': PRODUCT_UNITS.PUMP,
  'Foaming Cleansers': PRODUCT_UNITS.PUMP,
  'Facial Cleansing Oil': PRODUCT_UNITS.PUMP,
  'Facial Cleansing Milks': PRODUCT_UNITS.PUMP,
  'Liquid Cleansers & Soaps': PRODUCT_UNITS.PUMP,
  'Liquid or Cream Hand Soaps': PRODUCT_UNITS.PUMP,
  Mists: PRODUCT_UNITS.SPRAY,
  'Spray Moisturizer': PRODUCT_UNITS.SPRAY,
  'Spray Moisturizers': PRODUCT_UNITS.SPRAY,
  Sunscreen: PRODUCT_UNITS.TUBE, // Defaults to tube, though some are sprays or pumps

  // Droppers
  Serums: PRODUCT_UNITS.DROPPER,
  Serum: PRODUCT_UNITS.DROPPER,
  'Moisturizing Serums': PRODUCT_UNITS.DROPPER,
  Complexes: PRODUCT_UNITS.DROPPER,
  Drops: PRODUCT_UNITS.DROPPER,
  Essence: PRODUCT_UNITS.DROPPER,
  Oils: PRODUCT_UNITS.DROPPER,
  'Lash & Brow Growth': PRODUCT_UNITS.TUBE, // Often a brush/tube, default to tube for now

  // Jars
  Creams: PRODUCT_UNITS.JAR,
  Balms: PRODUCT_UNITS.JAR,
  'Balms, Ointments & Salves': PRODUCT_UNITS.JAR,
  OIntments: PRODUCT_UNITS.JAR,
  Butters: PRODUCT_UNITS.JAR,
  'Facial Masks': PRODUCT_UNITS.JAR, // Often jars, sometimes packs
  Scrubs: PRODUCT_UNITS.JAR,
  'Facial Scrubs': PRODUCT_UNITS.JAR,
  Polishes: PRODUCT_UNITS.JAR,
  Exfoliators: PRODUCT_UNITS.JAR, // Default
  'Exfoliators & Scrubs': PRODUCT_UNITS.JAR,
  'Exfoliators, Polishes, & Scrubs': PRODUCT_UNITS.JAR,

  // Solid
  'Bar Soaps': PRODUCT_UNITS.BAR,
  'Facial Bar Soap': PRODUCT_UNITS.BAR,

  // Packs / Patches (Single use or sheets)
  'Eye Masks & Pads': PRODUCT_UNITS.PACK,
  'Lip Mask': PRODUCT_UNITS.PACK,
  'Foot Mask': PRODUCT_UNITS.PACK,
  'Hand Masks': PRODUCT_UNITS.PACK,
  'Moisturizing Gloves': PRODUCT_UNITS.PACK,
  'Facial Wipes': PRODUCT_UNITS.PACK,
  'Cloths, Towelettes, & Wipes': PRODUCT_UNITS.PACK,
  'Body Wipes': PRODUCT_UNITS.PACK,
  Flushable: PRODUCT_UNITS.PACK,
  'Pore Strips': PRODUCT_UNITS.PACK,
}

export function getProductKind(usageType: string, category: string): string {
  // First check if it's explicitly a body/hand product
  if (['Body', 'Hand', 'Feet'].includes(usageType) || BODYCARE_KIND_MAP[category]) {
    return BODYCARE_KIND_MAP[category] ?? PRODUCT_KINDS.bodycare.BODY_LOTION
  }

  // Then check skincare maps
  if (SKINCARE_KIND_MAP[category]) {
    return SKINCARE_KIND_MAP[category]
  }

  // Fallbacks based on usage_type
  if (usageType === 'Eyes') return PRODUCT_KINDS.skincare.EYE_CREAM
  if (usageType === 'Lip Care') return PRODUCT_KINDS.skincare.LIP_CARE

  // Default fallback
  return PRODUCT_KINDS.skincare.MOISTURIZER
}

export function unitFromCategory(category: string): ProductUnit {
  return CATEGORY_UNIT_MAP[category] ?? PRODUCT_UNITS.TUBE
}
