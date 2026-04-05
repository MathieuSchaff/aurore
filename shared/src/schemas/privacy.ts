import { z } from 'zod'

export const privacySettingsSchema = z.object({
  profilePublic: z.boolean(),
  aiConsent: z.boolean(),
})

export const updatePrivacySettingsSchema = z
  .object({
    profilePublic: z.boolean().optional(),
    aiConsent: z.boolean().optional(),
  })
  .strict()

export type PrivacySettings = z.infer<typeof privacySettingsSchema>
export type UpdatePrivacySettingsInput = z.infer<typeof updatePrivacySettingsSchema>
