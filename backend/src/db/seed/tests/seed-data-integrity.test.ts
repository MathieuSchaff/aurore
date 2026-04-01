import { describe, expect, it } from 'bun:test'

import { ingredientTagMap } from '../IngredientsTags/seed-ingredients-tags'
import { ingredientData } from '../ingredients/index'
import { INGREDIENT_SLUGS } from '../ingredients/ingredient-slugs'
import { allProductData } from '../products/index'
import { allIngredientProductTags } from '../products/ingredients-products-tags'
import { allProductTagsMap } from '../products/product-tags'
import { allProductSlugs } from '../products/products-slugs'
import { TAG_SLUGS, tagData } from '../tags/seed-tags'

const definedIngredientSlugs = new Set(Object.values(INGREDIENT_SLUGS) as string[])
const definedTagSlugs = new Set(Object.values(TAG_SLUGS) as string[])
const definedProductSlugs = new Set(Object.values(allProductSlugs) as string[])

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

    it('references only known tag slugs', () => {
      const unknownTags: string[] = []
      for (const [ingSlug, groups] of Object.entries(ingredientTagMap)) {
        const allTags = [...groups.primary, ...groups.secondary, ...groups.avoid]
        for (const tag of allTags) {
          if (tag === undefined || !definedTagSlugs.has(tag as string)) {
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

    it('references only known tag slugs', () => {
      const unknownTags: string[] = []
      for (const [prodSlug, groups] of Object.entries(allProductTagsMap) as [string, any][]) {
        const allTags = [...groups.primary, ...groups.secondary, ...groups.avoid]
        for (const tag of allTags) {
          if (tag === undefined || !definedTagSlugs.has(tag as string)) {
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

  describe('TAG_SLUGS vs tagData', () => {
    it('every slug in TAG_SLUGS has a data entry', () => {
      const seedTagSlugSet = new Set(tagData.map((t) => t.slug))
      const missing = (Object.values(TAG_SLUGS) as string[]).filter(
        (slug) => !seedTagSlugSet.has(slug)
      )
      expect(missing).toEqual([])
    })
  })

  describe('allProductSlugs vs allProductData', () => {
    it('every declared product slug has a data entry', () => {
      const dataSlugs = new Set(
        allProductData.map((p) => p.slug).filter((s): s is string => typeof s === 'string')
      )
      const missing = (Object.values(allProductSlugs) as string[]).filter(
        (slug) => !dataSlugs.has(slug)
      )
      expect(missing).toEqual([])
    })
  })
})
