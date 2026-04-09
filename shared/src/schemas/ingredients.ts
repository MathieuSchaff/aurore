import { z } from 'zod'

import { fieldChangeSchema } from './common'

const uuid = z.uuid()

const slugSchema = z
  .string()
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })

export const createIngredientSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  slug: slugSchema.optional(),
  content: z.string().max(50000).optional(),
  category: z.string().min(1).max(100).optional(),
})

export const updateIngredientSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    slug: slugSchema.optional(),
    description: z.string().max(2000).optional(),
    content: z.string().max(50000).optional(),
    category: z.string().min(1).max(100).nullable().optional(),
  })
  .strict()

export const ingredientResponseSchema = z.object({
  id: uuid,
  createdBy: uuid,
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  content: z.string(),
  category: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const ingredientSearchResultSchema = z.object({
  id: uuid,
  name: z.string(),
  slug: z.string(),
  category: z.string().nullable(),
})

export const ingredientEditResponseSchema = z.object({
  id: uuid,
  ingredientId: uuid,
  editedBy: uuid,
  changes: z.record(
    z.string(),
    z.object({
      old: z.string().nullable(),
      new: z.string().nullable(),
    })
  ),
  summary: z.string().nullable(),
  createdAt: z.date(),
})

// partial because an edit can touch only some fields, but at least one is required
export const ingredientChangesSchema = z
  .object({
    name: fieldChangeSchema(z.string()),
    description: fieldChangeSchema(z.string()),
    content: fieldChangeSchema(z.string()),
    category: fieldChangeSchema(z.string()),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field change is required',
  })

const ingredientTagItemSchema = z.object({ name: z.string(), slug: z.string() })

export const ingredientFilterOptionsSchema = z.object({
  tags: z.object({
    skin_type: z.array(ingredientTagItemSchema),
    concern: z.array(ingredientTagItemSchema),
    // Rôle fonctionnel (ingredient_attribute). Flat list — le split
    // Actions/Technique/Formulation était un découpage UI arbitraire, viré.
    attribute: z.array(ingredientTagItemSchema),
    // Rendu sur peau — slugs scope='both' de skin_effect uniquement
    // (occlusif, matifiant, repulpant, protection-cutanee).
    skin_effect: z.array(ingredientTagItemSchema),
    // Comédogénicité — bucket dédié (shared_label), pair orthogonal
    // (comedogene / non-comedogene).
    comedogenicity: z.array(ingredientTagItemSchema),
  }),
})
export type IngredientFilterOptions = z.infer<typeof ingredientFilterOptionsSchema>

// coerce because query params always arrive as strings
export const ingredientsSearchSchema = z.object({
  concern: z.string().optional(),
  skin_type: z.string().optional(),
  attribute: z.string().optional(),
  skin_effect: z.string().optional(),
  comedogenicity: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['name', 'random']).optional(),
})
export const updateIngredientRouteSchema = updateIngredientSchema.extend({
  expectedUpdatedAt: z.coerce.date().optional(),
  summary: z.string().max(500).optional(),
})
export type UpdateIngredientRouteInput = z.infer<typeof updateIngredientRouteSchema>
export type CreateIngredientInput = z.infer<typeof createIngredientSchema>
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>
export type IngredientResponse = z.infer<typeof ingredientResponseSchema>
export type IngredientSearchResult = z.infer<typeof ingredientSearchResultSchema>
export type IngredientEditResponse = z.infer<typeof ingredientEditResponseSchema>
export type IngredientChanges = z.infer<typeof ingredientChangesSchema>
export type IngredientSearchFilters = z.infer<typeof ingredientsSearchSchema>
