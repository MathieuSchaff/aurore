import type { FetchConfig } from '../../scripts/fetch-images-shopify'

// Cos De BAHA: only the 10% serum (30ml) currently has a live image.
// AZ20 cream + 10% jumbo absent from current catalog (likely renamed/discontinued).
export const config: FetchConfig = {
  origin: 'https://cosdebaha.com',
  slugByHandle: {
    'cos-de-baha-azelaic-acid-10-serum-30ml-with-niacinamide-acne-scar-removal-redness-relief-face':
      'cos-de-baha-azelaic-acid-10-serum',
    // unmatched: cos-de-baha-az20-cream (no AZ 20% cream in current catalog)
    // unmatched: cos-de-baha-azelaic-acid-10-serum-jumbo (only 30ml variant live)
  },
}
