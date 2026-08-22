import type { CatalogQuality, ModerationStatus } from '../admin'

// Contributor "Mes soumissions" dashboard. The owner sees ALL their own
// catalog rows (including hidden ones) with the moderation reason, so they can
// understand a takedown and resubmit. Public reads never expose this.
export type MySubmissionItem = {
  kind: 'product' | 'ingredient'
  id: string
  name: string
  brand: string | null
  slug: string
  catalogQuality: CatalogQuality
  moderationStatus: ModerationStatus
  moderationReason: string | null
  createdAt: string
  updatedAt: string
}

export type MySubmissionsResponse = { items: MySubmissionItem[] }
