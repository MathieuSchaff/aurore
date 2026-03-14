import { useQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, FlaskConical, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

import { ingredientQueries, type ListIngredientsFilters } from '../../../lib/queries/ingredients'
import { FilterDialog, type FilterValues } from '../../Filter/Filter'
import { SearchCombobox } from '../../search/SearchCombobox'
import { type FilterKey, INGREDIENT_FILTER_FIELDS } from './filterFieldsIngredients'

import '../Products/ListPage.css'
import './IngredientsPage.css'
import '../../../styles/common/ingredients-shared.css'
const routeApi = getRouteApi('/ingredients/')

const EMPTY_FILTERS: FilterValues<FilterKey> = {
  category: [],
  concern: [],
  skinType: [],
  attribute: [],
}

const FILTER_KEYS: FilterKey[] = ['category', 'concern', 'skinType', 'attribute']
const PAGE_SIZE = 20

export function IngredientsPage() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  const { category, concern, skinType, attribute, page } = routeApi.useSearch()
  const navigate = useNavigate({ from: '/ingredients/' })

  const filters: FilterValues<FilterKey> = { category, concern, skinType, attribute }

  const filterCount = category.length + concern.length + skinType.length + attribute.length

  const apiFilters: ListIngredientsFilters = {
    category: category.length > 0 ? category : undefined,
    concern: concern.length > 0 ? concern : undefined,
    skinType: skinType.length > 0 ? skinType : undefined,
    attribute: attribute.length > 0 ? attribute : undefined,
    page,
    limit: PAGE_SIZE,
  }

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...ingredientQueries.list(apiFilters),
    placeholderData: (prev) => prev,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  function applyFilters(newFilters: FilterValues<FilterKey>) {
    navigate({ search: (prev) => ({ ...prev, ...newFilters, page: 1 }) })
  }

  function resetFilters() {
    navigate({ search: { ...EMPTY_FILTERS, page: 1 }, replace: true })
  }

  function goToPage(newPage: number) {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) })
  }

  function toggleSingleFilter(key: FilterKey, value: string) {
    const current = filters[key]
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    applyFilters({ ...filters, [key]: next })
  }

  const activeTags = FILTER_KEYS.flatMap((key) => filters[key].map((value) => ({ key, value })))

  function getFilterLabel(key: FilterKey, value: string): string {
    const field = INGREDIENT_FILTER_FIELDS.find((f) => f.key === key)
    return field?.options.find((o) => o.value === value)?.label ?? value
  }

  return (
    <div className="list-page ingredients-page">
      <header className="list-header">
        <div className="page-banner" />

        <div className="list-header__top">
          <h1 className="list-header__title">
            Ingrédients
            {isPlaceholderData && <span className="loader-mini">...</span>}
          </h1>

          <div className="list-header__search">
            <SearchCombobox
              queryFn={ingredientQueries.search}
              toResult={(item) => ({
                id: item.id,
                slug: item.slug,
                label: item.name,
                sublabel: item.category ?? undefined,
              })}
              onSelect={(slug) => navigate({ to: '/ingredients/$slug', params: { slug } })}
            />
          </div>

          <button type="button" className="list-filter-btn" onClick={() => setDrawerOpen(true)}>
            <SlidersHorizontal size={16} />
            <span>Filtrer</span>
            {filterCount > 0 && <span className="list-filter-btn__count">{filterCount}</span>}
          </button>
        </div>

        {activeTags.length > 0 && (
          <div className="list-active-filters">
            {activeTags.map(({ key, value }) => (
              <button
                key={`${key}-${value}`}
                type="button"
                className="list-active-filter-tag"
                onClick={() => toggleSingleFilter(key, value)}
              >
                {getFilterLabel(key, value)}
                <span className="list-active-filter-tag__x">&times;</span>
              </button>
            ))}
            <button type="button" className="list-clear-all" onClick={resetFilters}>
              Tout effacer
            </button>
          </div>
        )}
      </header>

      <FilterDialog
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        fields={INGREDIENT_FILTER_FIELDS}
        currentFilters={filters}
        initial_filters={EMPTY_FILTERS}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <main
        className="list-main"
        style={{
          opacity: isPlaceholderData ? 0.6 : 1,
          transition: 'opacity 0.2s ease-in-out',
          pointerEvents: isPlaceholderData ? 'none' : 'auto',
        }}
      >
        {isLoading && !isPlaceholderData ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <FlaskConical size={24} />
            </div>
            <p className="empty-state__subtitle">Chargement...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <FlaskConical size={24} />
            </div>
            <h2 className="empty-state__title">Aucun ingrédient trouvé</h2>
            <p className="empty-state__subtitle">Essayez de modifier vos filtres.</p>
          </div>
        ) : (
          <>
            <div className="list-results-info">
              <span className="list-results-count">
                {total} ingrédient{total > 1 ? 's' : ''}
              </span>
            </div>

            <div className="list-grid">
              {items.map((ingredient) => (
                <Link
                  key={ingredient.id}
                  to="/ingredients/$slug"
                  params={{ slug: ingredient.slug }}
                  className="list-card"
                >
                  <div className="list-card__icon icon-box">
                    <FlaskConical size={18} />
                  </div>
                  <div className="list-card__body">
                    <div className="list-card__name">{ingredient.name}</div>
                    {ingredient.description && (
                      <div className="ingredient-card__description">{ingredient.description}</div>
                    )}
                    <div className="ingredient-card__meta">
                      <span className="category-tag">{ingredient.category}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="nav-arrow" />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="list-pagination">
                <button
                  type="button"
                  className="list-pagination__btn"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="list-pagination__info">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  className="list-pagination__btn"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
