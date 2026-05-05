import type { FetchConfig } from '../../scripts/fetch-images-shopify'

export const config: FetchConfig = {
  origin: 'https://www.nooance-paris.com',
  slugByHandle: {
    'baume-aerien-jeunesse-du-regard-multi-actifs': 'nooance-baume-aerien-jeunesse-du-regard',
    'creme-de-jour-radiance-intense': 'nooance-creme-de-jour-radiance-intense',
    'creme-eclat': 'nooance-creme-eclat-intense',
    'elixir-nourrissant-aux-prebiotiques-10-huiles-precieuses': 'nooance-elixir-aux-prebiotiques',
    'serum-bulles-d-hydratation-apaisant-regenerant': 'nooance-serum-bulles-d-hydratation',
    'serum-en-brume-eclat-lumiere': 'nooance-serum-en-brume-eclat-lumiere-plus',
    'serum-lumiere-vitamine-c-pure': 'nooance-serum-lumiere-vitamine-c-pure',
    'serum-hydratant-repulpant-multi-actifs-5-acides-hyaluroniques':
      'nooance-serum-multi-actifs-5-acides-hyaluroniques',
    'serum-jeunesse-2-peptides-de-cuivre': 'nooance-serum-peptides-cuivre-2-pourcent',
    'soin-concentre-anti-age-nuit-0-6-retinol-rechargeable':
      'nooance-soin-anti-age-nuit-06-pourcent-retinol',
    'soin-concentre-anti-age-nuit-1-retinol-rechargeable':
      'nooance-soin-anti-age-nuit-1-pourcent-retinol',
    'soin-clarifiant': 'nooance-soin-clarifiant-anti-rougeurs',
    'soin-anti-age-nuit-0-3-retinol': 'nooance-soin-concentre-retinol-nuit',
    'soin-intense-contour-des-yeux-decongestionne-lisse-et-illumine-le-contour-de-l-oeil-rechargeable':
      'nooance-soin-intense-contour-des-yeux',
    'soin-intensif-anti-taches': 'nooance-soin-intensif-anti-taches',
    // unmatched: nooance-serum-acide-azelaique-15-pourcent (discontinued, not in live catalog)
  },
}
