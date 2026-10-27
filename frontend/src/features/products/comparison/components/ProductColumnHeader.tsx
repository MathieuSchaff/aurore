import type { EnrichedComparisonProduct } from '@aurore/shared'

import { Link } from '@tanstack/react-router'

import { ProductImage } from '@/features/products/components/ProductImage/ProductImage'
import './ComparisonTable.css'

import { productTone } from './productTones'

type Props = { product: EnrichedComparisonProduct; index: number; withImage?: boolean }

export function ProductColumnHeader({ product, index, withImage = false }: Props) {
  return (
    <th scope="col" className="cmp-table__product" style={productTone(index)}>
      {withImage && (
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="cmp-table__photo-link"
          aria-hidden="true"
          tabIndex={-1}
        >
          <ProductImage
            kind={product.kind}
            unit={product.amountUnit}
            imageUrl={product.imageUrl}
            size={48}
            className="cmp-table__photo"
          />
        </Link>
      )}
      <span className="cmp-table__brand">{product.brand}</span>{' '}
      <Link to="/products/$slug" params={{ slug: product.slug }} className="cmp-table__name">
        {product.name}
      </Link>
    </th>
  )
}
