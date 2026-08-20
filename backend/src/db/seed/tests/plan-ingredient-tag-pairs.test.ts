import { describe, expect, it } from 'bun:test'

import {
  planIngredientTagPairs,
  type SeedIngredientTagPair,
} from '../seeders/plan-ingredient-tag-pairs'

const pair = (
  slug: string,
  tagSlug: string,
  relevance: SeedIngredientTagPair['relevance'] = 'primary'
): SeedIngredientTagPair => ({ slug, tagSlug, relevance })

describe('planIngredientTagPairs', () => {
  it('écarte les paires dont le tagSlug est vide et compte la clé une seule fois', () => {
    const plan = planIngredientTagPairs({
      pairs: [pair('glycerin', ''), pair('urea', ''), pair('niacinamide', 'humectant')],
      ingredients: [],
    })
    expect(plan.pairs).toEqual([pair('niacinamide', 'humectant')])
    expect(plan.droppedPairCount).toBe(2)
    expect(plan.droppedTagKeys).toEqual([''])
  })

  it("ajoute une paire primary quand la catégorie native n'est pas déjà dans la map", () => {
    const plan = planIngredientTagPairs({
      pairs: [],
      ingredients: [{ slug: 'glycerin', category: 'humectant' }],
    })
    expect(plan.backfilled).toBe(1)
    expect(plan.pairs).toEqual([pair('glycerin', 'humectant', 'primary')])
  })

  it('ne backfille pas une catégorie déjà déclarée manuellement pour cet ingrédient', () => {
    const plan = planIngredientTagPairs({
      pairs: [pair('glycerin', 'humectant', 'secondary')],
      ingredients: [{ slug: 'glycerin', category: 'humectant' }],
    })
    expect(plan.backfilled).toBe(0)
    expect(plan.pairs).toEqual([pair('glycerin', 'humectant', 'secondary')])
  })

  it("ne backfille jamais une catégorie absente de la taxonomie skincare (classe fonctionnelle d'un complément)", () => {
    const plan = planIngredientTagPairs({
      pairs: [],
      ingredients: [
        { slug: 'lutein', category: 'carotenoide' },
        { slug: 'ashwagandha', category: null },
      ],
    })
    expect(plan.backfilled).toBe(0)
    expect(plan.pairs).toEqual([])
  })

  it('fusionne les doublons en gardant la première relevance vue', () => {
    const plan = planIngredientTagPairs({
      pairs: [pair('glycerin', 'humectant', 'primary'), pair('glycerin', 'humectant', 'secondary')],
      ingredients: [],
    })
    expect(plan.pairs).toEqual([pair('glycerin', 'humectant', 'primary')])
    expect(plan.dupes).toBe(1)
  })

  it("laisse le tableau d'entrée intact", () => {
    const input = [pair('glycerin', 'humectant')]
    planIngredientTagPairs({
      pairs: input,
      ingredients: [{ slug: 'urea', category: 'humectant' }],
    })
    expect(input).toEqual([pair('glycerin', 'humectant')])
  })
})
