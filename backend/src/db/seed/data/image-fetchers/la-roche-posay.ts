import type { IllicoConfig } from '../../scripts/fetch-images-illicopharma'

// LRP first-party site (laroche-posay.fr) is Cloudflare-gated, so we route
// through illicopharma.com which carries the same pack-shot images.
export const config: IllicoConfig = {
  urlBySlug: {
    'la-roche-posay-anthelios-xl-brume-spf50':
      'https://www.illicopharma.com/la-roche-posay/29002-anthelios-brume-visage-spf50-75ml-la-roche-posay-3337875549530.html',
    'la-roche-posay-cicaplast-baume-b5-plus':
      'https://www.illicopharma.com/la-roche-posay/25404-cicaplast-baume-b5-100ml-la-roche-posay-3337875816847.html',
    'la-roche-posay-hyalu-b5-cream':
      'https://www.illicopharma.com/la-roche-posay/28801-hyalu-b5-soin-anti-rides-40ml-la-roche-posay-3337875583589.html',
    'la-roche-posay-lipikar-baume-ap-m':
      'https://www.illicopharma.com/la-roche-posay/25370-lipikar-apmax-baume-triple-reparation-72h-400ml-la-roche-posay-3337875930239.html',
    'la-roche-posay-serum-b3-retinol':
      'https://www.illicopharma.com/la-roche-posay/30542-retinol-b3-serum-30ml-la-roche-posay-3337875694469.html',
    'la-roche-posay-vitamin-c12-serum':
      'https://www.illicopharma.com/la-roche-posay/28804-pure-vitamin-c12-serum-30ml-la-roche-posay-3337875909235.html',
    'serum-mela-b3':
      'https://www.illicopharma.com/la-roche-posay/36304-mela-b3-serum-concentre-intensif-anti-taches-anti-recidive-30ml-la-roche-posay-3337875890021.html',
  },
}
