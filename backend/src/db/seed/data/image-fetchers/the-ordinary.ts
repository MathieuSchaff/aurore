import type { DeciemConfig } from '../../scripts/fetch-images-deciem'

// 33/34 mapped against live theordinary.com en-us catalog (2026-05-05).
// Unmatched: the-ordinary-retinol-0-2-emulsion (only retinAL 0.2% emulsion live, retinol variant likely discontinued).
export const config: DeciemConfig = {
  origin: 'https://theordinary.com',
  categoryPaths: ['/en-us/category/skincare', '/en-us/category/body-hair'],
  brandFolder: 'The%20Ordinary',
  slugByPageSlug: {
    '4-sulphate-cleanser-for-body-and-hair-shampoo':
      'the-ordinary-4-percent-sulfate-cleanser-body-hair',
    'aha-30-bha-2-peeling-solution-exfoliator': 'the-ordinary-aha-30-bha-2-peeling-solution',
    'ascorbyl-glucoside-solution-12-vitamin-c': 'the-ordinary-ascorbyl-glucoside-solution-12',
    'ascorbyl-tetraisopalmitate-solution-20-in-vitamin-f-vitamin-c':
      'the-ordinary-ascorbyl-tetraisopalmitate-20-vitamin-f',
    'azelaic-acid-suspension-10-exfoliator': 'the-ordinary-azelaic-acid-suspension-10',
    'soothing-barrier-support-serum': 'the-ordinary-barrier-support-soothing-serum',
    'caffeine-solution-5-egcg-eye-serum': 'the-ordinary-caffeine-solution-5-egcg',
    'glycolic-acid-7-exfoliating-toner': 'the-ordinary-glycolic-acid-7-toning-solution',
    'granactive-retinoid-2-emulsion-serum': 'the-ordinary-granactive-retinoid-2-emulsion',
    'granactive-retinoid-5-in-squalane-serum': 'the-ordinary-granactive-retinoid-5-squalane',
    'hyaluronic-acid-2-b5-serum-original-formulation': 'the-ordinary-hyaluronic-acid-2-b5',
    'lactic-acid-10-ha-exfoliator': 'the-ordinary-lactic-acid-10-ha',
    'lactic-acid-5-ha-exfoliator': 'the-ordinary-lactic-acid-5-ha',
    'mandelic-acid-10-ha-exfoliator': 'the-ordinary-mandelic-acid-10-ha',
    'matrixyl-10-ha-serum': 'the-ordinary-matrixyl-10-percent-plus-ha',
    'multi-peptide-copper-peptides-1-serum':
      'the-ordinary-multi-peptide-plus-copper-peptides-1-percent',
    'multi-peptide-ha-serum': 'the-ordinary-multi-peptides-plus-ha-serum-ex-buffet',
    'multi-peptide-eye-serum': 'the-ordinary-multi-peptides-serum-yeux',
    'natural-moisturizing-factors-ha-moisturizer': 'the-ordinary-natural-moisturizing-factors-ha',
    'niacinamide-10-zinc-1-serum': 'the-ordinary-niacinamide-10-zinc-1',
    'niacinamide-5-face-body-serum': 'the-ordinary-niacinamide-5-face-body-emulsion',
    'natural-moisturizing-factors-inulin-body-lotion': 'the-ordinary-nmf-inulin-body-lotion',
    'pha-5-exfoliating-lip-serum': 'the-ordinary-pha-5-lip-exfoliating-serum',
    'retinol-02-in-squalane-serum': 'the-ordinary-retinol-0-2-squalane',
    'retinol-05-in-squalane-serum': 'the-ordinary-retinol-0-5-squalane',
    'retinol-1-in-squalane-serum': 'the-ordinary-retinol-1-squalane',
    'salicylic-acid-05-body-serum': 'the-ordinary-salicylic-acid-0-5-body-serum',
    'salicylic-acid-2-anhydrous-solution-exfoliator':
      'the-ordinary-salicylic-acid-2-anhydrous-solution',
    'salicylic-acid-2-face-masque': 'the-ordinary-salicylic-acid-2-masque',
    'multi-antioxidant-radiance-serum': 'the-ordinary-serum-eclat-multi-antioxydant',
    'gf-15-solution-growth-factors-serum':
      'the-ordinary-solution-gf-15-pourcent-facteurs-croissance',
    'sulfur-10-powder-to-cream-concentrate': 'the-ordinary-sulfur-10-powder-to-cream',
    'vitamin-c-suspension-23-ha-spheres-2-vitamin-c':
      'the-ordinary-vitamin-c-suspension-23-ha-spheres-2',
  },
}
