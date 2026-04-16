// ─── Blog Article Categories ──────────────────────────────
// Functional taxonomy for blog content (guides, monographies,
// benchmarks, routines, etc.). Inspired by VRAC content audit.
// DB schema TBD — keeping pure TS values for now.

export const BLOG_CATEGORIES = {
  // Soins peau (rosacée, acné, kératose, ingrédients topiques)
  SKINCARE: 'skincare',
  // Cheveux : shampoings, leave-in, soins capillaires
  HAIRCARE: 'haircare',
  // Hygiène bucco-dentaire
  DENTAL: 'dental',
  // Alimentation : super-aliments, fruits/légumes, profils nutritionnels
  NUTRITION: 'nutrition',
  // Compléments alimentaires : monographies, vitamines, minéraux, formes problématiques
  SUPPLEMENTS: 'supplements',
  // Plantes médicinales : phytothérapie, adaptogènes, champignons
  PHYTOTHERAPIE: 'phytotherapie',
  // Routines & protocoles (skincare cycling, layering, séquences)
  ROUTINES: 'routines',
  // Articles techniques approfondis (mécanismes moléculaires, pharmacologie, deep dives)
  SCIENCE: 'science',
  // Bien-être global : sommeil, stress, longévité, axe intestin-cerveau, mental
  LIFESTYLE: 'lifestyle',
} as const

export type BlogCategory = (typeof BLOG_CATEGORIES)[keyof typeof BLOG_CATEGORIES]

// For Zod enum validation (when DB lands)
export const BLOG_CATEGORY_VALUES = Object.values(BLOG_CATEGORIES) as [
  BlogCategory,
  ...BlogCategory[],
]

// Display labels (FR) for UI
export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  skincare: 'Soins peau',
  haircare: 'Cheveux',
  dental: 'Dents',
  nutrition: 'Nutrition',
  supplements: 'Compléments alimentaires',
  phytotherapie: 'Phytothérapie',
  routines: 'Routines & protocoles',
  science: 'Science approfondie',
  lifestyle: 'Bien-être global',
}
