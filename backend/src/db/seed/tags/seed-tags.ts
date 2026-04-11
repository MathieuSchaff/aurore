// Seed stub — tag seeding will be split into ingredient/product tasks.
// @see docs/superpowers/plans/2026-04-11-tag-split.md

import { INGREDIENT_TAG_SLUGS, PRODUCT_TAG_SLUGS } from '@habit-tracker/shared'

// Re-export for backward compat with other seed files.
export const TAG_SLUGS = { ...INGREDIENT_TAG_SLUGS, ...PRODUCT_TAG_SLUGS } as const
export type TagSlug = (typeof TAG_SLUGS)[keyof typeof TAG_SLUGS]

// tagData will be rebuilt when seed is split.
export const tagData: { slug: string; label: string; tagType: string }[] = []
