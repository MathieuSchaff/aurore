import { describe, it, expect } from 'vitest'
import { calculateWeightedScore, DEFAULT_WEIGHTS, type ReviewCriteria, type CriteriaWeights } from './reviews'

const fullReview: ReviewCriteria = {
  tolerance: 4,
  efficacy: 4,
  sensoriality: 4,
  stability: 4,
  mixability: 4,
  valueForMoney: 4,
}

describe('calculateWeightedScore', () => {
  describe('cas de base — tous les critères renseignés, poids égaux', () => {
    it('tous à 4 → 16.0/20', () => {
      expect(calculateWeightedScore(fullReview)).toBe('16.0')
    })

    it('tous à 5 → 20.0/20', () => {
      const review: ReviewCriteria = {
        tolerance: 5,
        efficacy: 5,
        sensoriality: 5,
        stability: 5,
        mixability: 5,
        valueForMoney: 5,
      }
      expect(calculateWeightedScore(review)).toBe('20.0')
    })

    it('tous à 1 → 4.0/20', () => {
      const review: ReviewCriteria = {
        tolerance: 1,
        efficacy: 1,
        sensoriality: 1,
        stability: 1,
        mixability: 1,
        valueForMoney: 1,
      }
      expect(calculateWeightedScore(review)).toBe('4.0')
    })
  })

  describe('poids différents', () => {
    it('tolérance ×3, efficacité ×2, reste ×1 — calcul exact', () => {
      const review: ReviewCriteria = {
        tolerance: 5,
        efficacy: 3,
        sensoriality: 2,
        stability: 2,
        mixability: 2,
        valueForMoney: 2,
      }
      const weights: CriteriaWeights = {
        tolerance: 3,
        efficacy: 2,
        sensoriality: 1,
        stability: 1,
        mixability: 1,
        valueForMoney: 1,
      }
      // (5×3 + 3×2 + 2×1 + 2×1 + 2×1 + 2×1) / (3+2+1+1+1+1) = 29/9 ≈ 3.2222
      // ×4 = 12.888... → "12.9"
      expect(calculateWeightedScore(review, weights, 'out_of_20')).toBe('12.9')
    })
  })

  describe('critères null exclus', () => {
    it('deux critères null → calcul sur les 4 renseignés seulement', () => {
      const review: ReviewCriteria = {
        tolerance: 4,
        efficacy: 4,
        sensoriality: null,
        stability: null,
        mixability: 4,
        valueForMoney: 4,
      }
      // (4+4+4+4)/4 = 4 → ×4 = 16.0
      expect(calculateWeightedScore(review)).toBe('16.0')
    })

    it('tous les critères null → retourne null', () => {
      const review: ReviewCriteria = {
        tolerance: null,
        efficacy: null,
        sensoriality: null,
        stability: null,
        mixability: null,
        valueForMoney: null,
      }
      expect(calculateWeightedScore(review)).toBeNull()
    })

    it('un seul critère renseigné → note = ce critère converti', () => {
      const review: ReviewCriteria = {
        tolerance: 3,
        efficacy: null,
        sensoriality: null,
        stability: null,
        mixability: null,
        valueForMoney: null,
      }
      // 3/1 × 4 = 12.0
      expect(calculateWeightedScore(review)).toBe('12.0')
    })
  })

  describe('review null ou undefined', () => {
    it('review null → retourne null', () => {
      expect(calculateWeightedScore(null)).toBeNull()
    })

    it('review undefined → retourne null', () => {
      expect(calculateWeightedScore(undefined)).toBeNull()
    })
  })

  describe('échelles de notation', () => {
    it('out_of_5 — tous à 4 → "4.0"', () => {
      expect(calculateWeightedScore(fullReview, DEFAULT_WEIGHTS, 'out_of_5')).toBe('4.0')
    })

    it('out_of_10 — tous à 4 → "8.0"', () => {
      expect(calculateWeightedScore(fullReview, DEFAULT_WEIGHTS, 'out_of_10')).toBe('8.0')
    })

    it('percentage — tous à 4 → "80%"', () => {
      expect(calculateWeightedScore(fullReview, DEFAULT_WEIGHTS, 'percentage')).toBe('80%')
    })
  })

  describe("précision de l'arrondi", () => {
    it('retourne une décimale, pas de flottant brut', () => {
      const review: ReviewCriteria = {
        tolerance: 3,
        efficacy: 4,
        sensoriality: 5,
        stability: null,
        mixability: null,
        valueForMoney: null,
      }
      // (3+4+5)/3 = 4 → ×4 = 16.0
      const result = calculateWeightedScore(review)
      expect(result).toMatch(/^\d+\.\d$/)
    })
  })
})
