import { type QueryKey, type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import './SearchCombobox.css'

export interface SearchComboboxResult {
  id: number | string
  slug: string
  label: string
  sublabel?: string
}

interface SearchComboboxProps<TItem, TQueryKey extends QueryKey> {
  queryFn: (query: string) => UseQueryOptions<TItem[], Error, TItem[], TQueryKey>
  // NoInfer prevents TypeScript from trying to infer TItem from toResult,
  // forcing it to rely solely on queryFn for the source of truth.
  toResult: (item: NoInfer<TItem>) => SearchComboboxResult
  onSelect: (slug: string, result: SearchComboboxResult) => void
  placeholder?: string
  minChars?: number
  debounce?: number
}

export function SearchCombobox<TItem, TQueryKey extends QueryKey>({
  queryFn,
  toResult,
  onSelect,
  placeholder = 'Rechercher...',
  minChars = 2,
  debounce = 300,
}: SearchComboboxProps<TItem, TQueryKey>) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Simple inline debounce to avoid another dependency or custom hook overhead for now
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounce)
    return () => clearTimeout(timer)
  }, [query, debounce])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: rawResults = [], isFetching } = useQuery({
    ...queryFn(debouncedQuery),
    enabled: debouncedQuery.length >= minChars,
  })

  const results = rawResults.map(toResult)

  function handleSelect(result: SearchComboboxResult) {
    setQuery('')
    setIsOpen(false)
    onSelect(result.slug, result)
  }

  const showDropdown = isOpen && debouncedQuery.length >= minChars

  return (
    <div className="search-combobox" ref={containerRef}>
      <div className="search-combobox__input-wrap">
        <Search size={15} className="search-combobox__icon" />
        <input
          type="text"
          className="search-combobox__input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => query.length >= minChars && setIsOpen(true)}
        />
      </div>

      {showDropdown && (
        <ul className="search-combobox__dropdown">
          {isFetching ? (
            <li className="search-combobox__state">Recherche…</li>
          ) : results.length === 0 ? (
            <li className="search-combobox__state">Aucun résultat</li>
          ) : (
            results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="search-combobox__option"
                  onClick={() => handleSelect(item)}
                >
                  <span className="search-combobox__label">{item.label}</span>
                  {item.sublabel && (
                    <span className="search-combobox__sublabel">{item.sublabel}</span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
