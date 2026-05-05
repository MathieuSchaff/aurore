import type { PsdConfig } from '../../scripts/fetch-images-pharmashopdiscount'

// Bioderma stragglers not findable on bioderma.fr (discontinued or rebranded
// on the official catalog). Pulled from pharmashopdiscount packshots.

export const config: PsdConfig = {
  origin: 'https://www.pharmashopdiscount.com',
  pathBySlug: {
    'bioderma-atoderm-creme-ultra-nourrissante':
      '/fr/beaute/bioderma/bioderma-atoderm-creme-ultra-nourrissante-lot-de-2x500ml.html',
    // "Cicabio Soin Isolant" rebranded as "Cicabio Mains Baume Barrière"
    'bioderma-cicabio-soin-isolant':
      '/fr/beaute/bioderma/bioderma-cicabio-mains-baume-barriere-reparateur-50ml.html',
    // "Crealine Defensive Légère" not stocked — fall back to the standard Defensive
    'bioderma-crealine-defensive-legere':
      '/fr/beaute/bioderma/bioderma-crealine-defensive-creme-active-apaisante-40ml.html',
  },
}
