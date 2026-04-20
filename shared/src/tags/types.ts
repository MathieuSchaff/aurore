import type { z } from 'zod'

import type {
  createTagSchema,
  replaceIngredientTagsSchema,
  replaceProductTagsSchema,
  updateTagSchema,
} from './schemas'

export type CreateTagInput = z.infer<typeof createTagSchema>
export type UpdateTagInput = z.infer<typeof updateTagSchema>
export type ReplaceIngredientTagsInput = z.infer<typeof replaceIngredientTagsSchema>
export type ReplaceProductTagsInput = z.infer<typeof replaceProductTagsSchema>

export type TagErrorCode =
  | 'tag_not_found'
  | 'tag_already_exists'
  | 'tag_creation_failed'
  | 'database_error'
