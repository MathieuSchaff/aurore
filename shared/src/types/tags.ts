export type { CreateTagInput } from '../schemas/tags'

export type IngredientTagDef = {
  id: string
  slug: string
  label: string
  tagType: string
  createdAt: string | Date
}

export type ProductTagDef = {
  id: string
  slug: string
  label: string
  tagType: string
  createdAt: string | Date
}

export type TagIngredient = {
  ingredientTagId: string
  ingredientId: string
  relevance: 'primary' | 'secondary' | 'avoid'
}

export type TagProduct = {
  productTagId: string
  productId: string
  relevance: 'primary' | 'secondary' | 'avoid'
}

// Keep legacy aliases to avoid breaking imports elsewhere until
// downstream callers are updated.
export type Tag = IngredientTagDef | ProductTagDef
export type ProductTag = TagProduct
export type IngredientTag = TagIngredient

export type TagErrorCode =
  | 'tag_not_found'
  | 'tag_already_exists'
  | 'tag_creation_failed'
  | 'database_error'
