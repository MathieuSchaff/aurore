import { z } from 'zod'

export const displayScale = ['out_of_5', 'out_of_10', 'out_of_20', 'percentage'] as const
export const displayScaleSchema = z.enum(displayScale)

export const criteriaWeightsSchema = z.object({
  tolerance: z.number().min(0).max(10).default(1),
  efficacy: z.number().min(0).max(10).default(1),
  sensoriality: z.number().min(0).max(10).default(1),
  stability: z.number().min(0).max(10).default(1),
  mixability: z.number().min(0).max(10).default(1),
  valueForMoney: z.number().min(0).max(10).default(1),
})

export const userPreferencesSchema = z.object({
  userId: z.string().uuid(),
  displayScale: displayScaleSchema.default('out_of_20'),
  criteriaWeights: criteriaWeightsSchema.default({
    tolerance: 1,
    efficacy: 1,
    sensoriality: 1,
    stability: 1,
    mixability: 1,
    valueForMoney: 1,
  }),
  updatedAt: z.date(),
})

export const updateUserPreferencesSchema = z.object({
  displayScale: displayScaleSchema.optional(),
  criteriaWeights: criteriaWeightsSchema.partial().optional(),
})

export type DisplayScale = z.infer<typeof displayScaleSchema>
export type CriteriaWeights = z.infer<typeof criteriaWeightsSchema>
export type UserPreferences = z.infer<typeof userPreferencesSchema>
export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>
