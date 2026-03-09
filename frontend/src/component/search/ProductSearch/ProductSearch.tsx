import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { productQueries } from '../../../lib/queries/products'
import './ProductSearch.css'

export function ProductSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { data: results = [] } = useQuery({
    ...productQueries.search(query),
    enabled: query.length >= 2,
  })

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (slug: string) => {
    setQuery('')
    setIsOpen(false)
    navigate({ to: '/products/$slug', params: { slug } })
  }

  const showDropdown = isOpen && query.length >= 2

  return (
    <div className="product-search" ref={containerRef}>
      <div className="product-search__input-wrap">
        <Search size={15} className="product-search__icon" />
        <input
          type="text"
          className="product-search__input"
          placeholder="Rechercher un produit..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {showDropdown && (
        <ul className="product-search__dropdown">
          {results.length === 0 ? (
            <li className="product-search__empty">Aucun résultat</li>
          ) : (
            results.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  className="product-search__option"
                  onClick={() => handleSelect(product.slug)}
                >
                  <span className="product-search__option-name">{product.name}</span>
                  <span className="product-search__option-meta">
                    {product.brand} · {product.kind}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
