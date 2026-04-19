import { describe, expect, it } from 'bun:test'

import {
  INGREDIENT_CATEGORY_VALUES,
  INGREDIENT_TYPE_VALUES,
  PRODUCT_KINDS,
  SUPPLEMENT_CATEGORY_VALUES,
} from '@habit-tracker/shared'

import { ingredientTagMap } from '../data/ingredient-tags'
import { ingredientData } from '../data/ingredients'
import { INGREDIENT_SLUGS } from '../data/ingredients/ingredient-slugs'
import { skincareIngredients } from '../data/ingredients/skincare'
import { allProductData, allIngredientProductTags, allProductTagsMap } from '../data/products'
import { TAG_SLUGS, ingredientTagData, productTagData } from '../data/tags'

const definedIngredientSlugs = new Set(Object.values(INGREDIENT_SLUGS) as string[])
const definedIngredientTagSlugs = new Set(ingredientTagData.map((t) => t.slug))
const definedProductTagSlugs = new Set(productTagData.map((t) => t.slug))
const definedProductSlugs = new Set(allProductData.map((p) => p.slug))

describe('Seed data integrity', () => {
  describe('ingredientTagMap', () => {
    it('has no undefined ingredient slug as key', () => {
      const keys = Object.keys(ingredientTagMap)
      expect(keys).not.toContain('undefined')
    })

    it('references only known ingredient slugs', () => {
      const unknownSlugs = Object.keys(ingredientTagMap).filter(
        (slug) => !definedIngredientSlugs.has(slug)
      )
      expect(unknownSlugs).toEqual([])
    })

    it('references only known ingredient tag slugs', () => {
      const unknownTags: string[] = []
      for (const [ingSlug, groups] of Object.entries(ingredientTagMap)) {
        const allTags = [...groups.primary, ...groups.secondary, ...groups.avoid]
        for (const tag of allTags) {
          if (tag === undefined || !definedIngredientTagSlugs.has(tag as string)) {
            unknownTags.push(`${ingSlug} → ${tag}`)
          }
        }
      }
      expect(unknownTags).toEqual([])
    })

    it('has no duplicate (ingredientSlug, tagSlug) pairs', () => {
      const seen = new Set<string>()
      const duplicates: string[] = []
      for (const [ingSlug, groups] of Object.entries(ingredientTagMap)) {
        const allTags = [...groups.primary, ...groups.secondary, ...groups.avoid]
        for (const tag of allTags) {
          const key = `${ingSlug}::${tag}`
          if (seen.has(key)) duplicates.push(key)
          else seen.add(key)
        }
      }
      expect(duplicates).toEqual([])
    })
  })

  describe('allProductTagsMap', () => {
    it('references only known product slugs', () => {
      const unknownSlugs = Object.keys(allProductTagsMap).filter(
        (slug) => !definedProductSlugs.has(slug)
      )
      expect(unknownSlugs).toEqual([])
    })

    it('references only known product tag slugs', () => {
      const unknownTags: string[] = []
      for (const [prodSlug, groups] of Object.entries(allProductTagsMap) as [string, any][]) {
        const allTags = [...groups.primary, ...groups.secondary, ...groups.avoid]
        for (const tag of allTags) {
          if (tag === undefined || !definedProductTagSlugs.has(tag as string)) {
            unknownTags.push(`${prodSlug} → ${tag}`)
          }
        }
      }
      expect(unknownTags).toEqual([])
    })

    it('has no duplicate (productSlug, tagSlug) pairs', () => {
      const seen = new Set<string>()
      const duplicates: string[] = []
      for (const [prodSlug, groups] of Object.entries(allProductTagsMap) as [string, any][]) {
        const allTags = [...groups.primary, ...groups.secondary, ...groups.avoid]
        for (const tag of allTags) {
          const key = `${prodSlug}::${tag}`
          if (seen.has(key)) duplicates.push(key)
          else seen.add(key)
        }
      }
      expect(duplicates).toEqual([])
    })
  })

  describe('allIngredientProductTags', () => {
    it('references only known product slugs', () => {
      const unknownProducts = [
        ...new Set(
          allIngredientProductTags
            .map((r) => r.productSlug)
            .filter((slug) => !definedProductSlugs.has(slug))
        ),
      ]
      expect(unknownProducts).toEqual([])
    })

    it('references only known ingredient slugs', () => {
      const unknownIngredients = [
        ...new Set(
          allIngredientProductTags
            .map((r) => r.ingredientSlug)
            .filter((slug): slug is string => !!slug && !definedIngredientSlugs.has(slug))
        ),
      ]
      expect(unknownIngredients).toEqual([])
    })
  })

  describe('INGREDIENT_SLUGS vs ingredientData', () => {
    it('every slug in INGREDIENT_SLUGS has a data entry', () => {
      const dataSlugSet = new Set(ingredientData.map((i) => i.slug as string))
      const missing = (Object.values(INGREDIENT_SLUGS) as string[]).filter(
        (slug) => !dataSlugSet.has(slug)
      )
      expect(missing).toEqual([])
    })

    it('has no duplicate slugs in ingredientData', () => {
      const slugs = ingredientData.map((i) => i.slug as string)
      const duplicates = slugs.filter((slug, idx) => slugs.indexOf(slug) !== idx)
      expect([...new Set(duplicates)]).toEqual([])
    })
  })

  describe('TAG_SLUGS vs seed tag data', () => {
    it('every slug in TAG_SLUGS has a data entry', () => {
      const allSeedSlugs = new Set([
        ...ingredientTagData.map((t) => t.slug),
        ...productTagData.map((t) => t.slug),
      ])
      const missing = (Object.values(TAG_SLUGS) as string[]).filter(
        (slug) => !allSeedSlugs.has(slug)
      )
      expect(missing).toEqual([])
    })
  })

  describe('allProductData slugs', () => {
    it('has no duplicate slugs', () => {
      const slugs = allProductData.map((p) => p.slug)
      const duplicates = slugs.filter((slug, idx) => slugs.indexOf(slug) !== idx)
      expect([...new Set(duplicates)]).toEqual([])
    })
  })

  describe('allProductData field completeness', () => {
    it('every product has a non-empty name and brand', () => {
      const bad = allProductData
        .filter((p) => !p.name || !p.brand)
        .map((p) => p.slug)
      expect(bad).toEqual([])
    })

    it('every product kind is a valid ProductKind', () => {
      const validKinds = new Set(
        Object.values(PRODUCT_KINDS).flatMap((group) => Object.values(group))
      )
      const bad = allProductData
        .filter((p) => !validKinds.has(p.kind))
        .map((p) => `${p.slug} → ${p.kind}`)
      expect(bad).toEqual([])
    })

    it('every product has at least one primary tag', () => {
      const bad = Object.entries(allProductTagsMap)
        .filter(([, groups]) => groups.primary.length === 0)
        .map(([slug]) => slug)
      expect(bad).toEqual([])
    })

    it('every product kind is consistent with its category', () => {
      const bad = allProductData
        .filter((p) => (p as any).category)
        .filter((p) => {
          const validKinds = new Set(
            Object.values(PRODUCT_KINDS[(p as any).category as keyof typeof PRODUCT_KINDS] ?? {})
          )
          return !validKinds.has(p.kind)
        })
        .map((p) => `${p.slug} → category:${(p as any).category} kind:${p.kind}`)
      expect(bad).toEqual([])
    })
  })

  describe('ingredientData field completeness', () => {
    it('every ingredient has a non-empty name and slug', () => {
      const bad = ingredientData
        .filter((i) => !i.name || !i.slug || i.name.trim() === '' || i.slug.trim() === '')
        .map((i) => i.slug ?? '(no slug)')
      expect(bad).toEqual([])
    })

    it('every skincare ingredient has at least one primary tag in ingredientTagMap', () => {
      const bad = skincareIngredients
        .filter((i) => {
          const tags = ingredientTagMap[i.slug]
          return !tags || tags.primary.length === 0
        })
        .map((i) => i.slug)
      expect(bad).toEqual([])
    })

    it('every ingredient has a valid IngredientType', () => {
      const validTypes = new Set<string>(INGREDIENT_TYPE_VALUES)
      const bad = ingredientData
        .filter((i) => !(i as any).type || !validTypes.has((i as any).type))
        .map((i) => `${i.slug} → ${(i as any).type ?? '(missing)'}`)
      expect(bad).toEqual([])
    })

    it('ingredient type and category are consistent', () => {
      const skincareTypes = new Set(['skincare', 'haircare', 'dental'])
      const bad = ingredientData
        .filter((i) => {
          const type = (i as any).type as string | undefined
          if (!type) return false
          if (type === 'supplement') return !SUPPLEMENT_CATEGORY_VALUES.includes(i.category as any)
          if (skincareTypes.has(type)) return !INGREDIENT_CATEGORY_VALUES.includes(i.category as any)
          return false
        })
        .map((i) => `${i.slug} → type:${(i as any).type} category:${i.category}`)
      expect(bad).toEqual([])
    })

    it('every ingredient category is a valid skincare or supplement category', () => {
      const validCategories = new Set<string>([
        ...INGREDIENT_CATEGORY_VALUES,
        ...SUPPLEMENT_CATEGORY_VALUES,
      ])
      const bad = ingredientData
        .filter((i) => !validCategories.has(i.category))
        .map((i) => `${i.slug} → ${i.category}`)
      expect(bad).toEqual([])
    })
  })

  describe('TAG_LABELS coverage', () => {
    // labelFor() silently falls back to the raw slug when no label is defined.
    // A missing label means the UI shows the slug string instead of a readable name.
    it('every ingredient tag slug has a human-readable label defined', () => {
      const missingLabels = ingredientTagData
        .filter((t) => t.label === t.slug)
        .map((t) => t.slug)
      expect(missingLabels).toEqual([])
    })

    it('every product tag slug has a human-readable label defined', () => {
      const missingLabels = productTagData
        .filter((t) => t.label === t.slug)
        .map((t) => t.slug)
      expect(missingLabels).toEqual([])
    })
  })
})
