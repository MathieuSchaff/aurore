import { MOCK_PRODUCT_IMAGES } from './mockImages'

// Deterministic 32-bit hash so the same slug always picks the same mock image.
function hashSlug(slug: string): number {
  let h = 5381
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) + h + slug.charCodeAt(i)) | 0
  }
  return h >>> 0
}

export function getMockProductImage(slug: string): string {
  const idx = hashSlug(slug) % MOCK_PRODUCT_IMAGES.length
  return `/mock-products/${MOCK_PRODUCT_IMAGES[idx]}`
}
