import type { FetchConfig } from '../../scripts/fetch-images-shopify'

export const config: FetchConfig = {
  origin: 'https://colibriskincare.de',
  slugByHandle: {
    'antioxidant-serum': 'colibri-antioxidant-serum',
    'barrier-booster': 'colibri-barrier-booster',
    // shopify renamed "Brightening Booster Azelaic 10%" -> "Brightening Booster" (same product).
    'brightening-booster': 'colibri-brightening-booster-azelaic-10',
    // legacy German handle for "Calming Moisturizer".
    tagespflege: 'colibri-calming-moisturizer',
    'pore-control-booster': 'colibri-pore-control-booster',
    'vitamin-c-15-booster': 'colibri-vitamin-c15-booster',
    'vitamin-c-20-booster': 'colibri-vitamin-c-20-booster',
  },
}
