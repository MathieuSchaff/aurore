import { type QueryKey, type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
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
  label: string
  minChars?: number
  debounce?: number
}

export function SearchCombobox<TItem, TQueryKey extends QueryKey>({
  queryFn,
  toResult,
  onSelect,
  placeholder = 'Rechercher...',
  label,
  minChars = 2,
  debounce = 300,
}: SearchComboboxProps<TItem, TQueryKey>) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [announcement, setAnnouncement] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  useEffect(() => {
    if (!announcement) return
    const timer = setTimeout(() => setAnnouncement(''), 1000)
    return () => clearTimeout(timer)
  }, [announcement])

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
    setAnnouncement(`${result.label} sélectionné`)
    setQuery('')
    setIsOpen(false)
    setHighlightedIndex(-1)
    onSelect(result.slug, result)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        e.preventDefault()
        handleSelect(results[highlightedIndex])
      } else if (results.length > 0) {
        e.preventDefault()
        handleSelect(results[0])
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false)
      setHighlightedIndex(-1)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  const showDropdown = isOpen && debouncedQuery.length >= minChars
  const activeDescendant =
    highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined

  return (
    <div className="search-combobox" ref={containerRef}>
      <div className="search-combobox__input-wrap">
        <Search size={15} className="search-combobox__icon" aria-hidden="true" />
        <input
          type="text"
          role="combobox"
          className="search-combobox__input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setHighlightedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= minChars && setIsOpen(true)}
          autoComplete="off"
          aria-label={label}
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={activeDescendant}
          aria-autocomplete="list"
        />
      </div>

      {showDropdown && (
        <div id={listboxId} className="search-combobox__dropdown" role="listbox">
          {isFetching ? (
            <div className="search-combobox__state">
              <output>Recherche…</output>
            </div>
          ) : results.length === 0 ? (
            <div className="search-combobox__state">
              <output>Aucun résultat</output>
            </div>
          ) : (
            results.map((item, index) => (
              <div
                key={item.id}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                tabIndex={-1}
                className={`search-combobox__option${index === highlightedIndex ? ' search-combobox__option--highlighted' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelect(item)
                  }
                }}
              >
                <span className="search-combobox__label">{item.label}</span>
                {item.sublabel && (
                  <span className="search-combobox__sublabel">{item.sublabel}</span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement ||
          (showDropdown && !isFetching
            ? results.length > 0
              ? `${results.length} résultat${results.length > 1 ? 's' : ''} disponible${results.length > 1 ? 's' : ''}`
              : 'Aucun résultat'
            : '')}
      </div>
    </div>
  )
}
