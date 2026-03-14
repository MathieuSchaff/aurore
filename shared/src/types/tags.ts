export type { CreateTagInput } from '../schemas/tags'

export type Tag = {
  id: string
  name: string
  slug: string
  category: string | null
  createdAt: string | Date
}

export type ProductTag = {
  id: string
  productId: string
  tagId: string
  relevance: 'primary' | 'secondary' | 'avoid'
  createdAt: string | Date
}

export type IngredientTag = {
  id: string
  ingredientId: string
  tagId: string
  createdAt: string | Date
}

export type TagErrorCode =
  | 'tag_not_found'
  | 'tag_already_exists'
  | 'tag_creation_failed'
  | 'database_error'
