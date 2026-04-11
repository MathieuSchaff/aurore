export interface Ingredient {
  slug: string
  notes?: string
  // canonical names
  concentrationValue?: number
  concentrationUnit?: string
  // legacy aliases kept for backward compatibility
  value?: number
  unit?: string
}
