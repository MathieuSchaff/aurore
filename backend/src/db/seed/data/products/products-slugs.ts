import { allProductData as unifiedProductData } from '.'

export const allProductSlugs = Object.fromEntries(
  unifiedProductData.map((p) => [p.slug.replace(/[-\s]/g, '_').toUpperCase(), p.slug])
) as Record<string, string>
