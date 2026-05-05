import type { IllicoConfig } from '../../scripts/fetch-images-illicopharma'

// k-beauty long-tail via Shopify resellers (korean-skincare.fr & sevenyoung.com).
// og:image returns the Shopify CDN packshot directly — no products.json pagination needed.

export const config: IllicoConfig = {
  urlBySlug: {
    // korean-skincare.fr
    'anua-azelaic-acid-3-cica-skin-clarifying-toner':
      'https://korean-skincare.fr/products/anua-azelaic-acid-3-cica-skin-clarifying-toner',
    'beauty-of-joseon-relief-sun-aqua-fresh':
      'https://korean-skincare.fr/products/beauty-of-joseon-relief-sun-aqua-fresh-rice-b5',
    'haruharu-wonder-black-rice-hyaluronic-toner-fragrance-free':
      'https://korean-skincare.fr/products/haruharu-wonder-black-rice-hyaluronic-toner-free-of-alcohol-fragrance',
    'purito-azelaic-kojic-tea-tree-serum':
      'https://korean-skincare.fr/products/purito-seoulazelaic-acid-10-kojic-tea-tree-serum',
    'skin1004-spot-cover-patch': 'https://korean-skincare.fr/products/skin1004-spot-cover-patch',
    // mini ampoule has no SKU on KS — fall back to full-size packshot
    'skin1004-tea-trica-relief-ampoule-mini':
      'https://korean-skincare.fr/products/skin1004-madagascar-centella-tea-trica-relief-ampoule',
    'eqqualberry-vitamin-illuminating-serum':
      'https://korean-skincare.fr/products/eqqualberry-vitamin-illuminating-serum',
    'eqqualberry-swimming-pool-daily-facial-toner':
      'https://korean-skincare.fr/products/eqqualberry-swimming-pool-toner',
    // sevenyoung.com
    'cosrx-advanced-snail-92-all-in-one-cream':
      'https://sevenyoung.com/products/advanced-snail-92-all-in-one-cream',
    'cosrx-advanced-snail-96-mucin-power-essence':
      'https://sevenyoung.com/products/advanced-snail-96-mucin-power-essence-100ml',
    'im-from-rice-toner': 'https://sevenyoung.com/products/rice-toner-150ml',
  },
}
