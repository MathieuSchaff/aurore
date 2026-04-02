import { useQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { FlaskConical, Plus, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { ListPagination } from '@/component/DataDisplay/Pagination/ListPagination'
import { EmptyState } from '@/component/Feedback/EmptyState/EmptyState'
import { ActiveFiltersBar } from '@/component/Filter/ActiveFiltersBar'
import { type FilterValues, GroupedFilterDialog } from '@/component/Filter/Filter'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { SearchCombobox } from '@/component/search/SearchCombobox'
import { useListFilters } from '@/hooks/useListFilters'
import { ingredientQueries, type ListIngredientsFilters } from '../../../lib/queries/ingredients'
import { type FilterKey, GROUP_LABELS, INGREDIENT_FILTER_GROUPS } from './filterFieldsIngredients'

import '../../products/components/ListPage.css'
import './IngredientsPage.css'

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

  const { filterCount, activeTags, applyFilters, resetFilters, goToPage, toggleSingleFilter } =
    useListFilters({
      from: '/ingredients/',
      filters,
      emptyFilters: EMPTY_FILTERS,
      filterKeys: FILTER_KEYS,
    })

  const hasFilters = filterCount > 0

  const apiFilters: ListIngredientsFilters = hasFilters
    ? {
        category: category.length > 0 ? category : undefined,
        concern: concern.length > 0 ? concern : undefined,
        skinType: skinType.length > 0 ? skinType : undefined,
        attribute: attribute.length > 0 ? attribute : undefined,
        page,
        limit: PAGE_SIZE,
      }
    : { sort: 'random', limit: 12 }

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...ingredientQueries.list(apiFilters),
    placeholderData: hasFilters ? (prev) => prev : undefined,
    staleTime: hasFilters ? 5 * 60 * 1000 : 0,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  function getFilterLabel(key: FilterKey, value: string): string {
    for (const group of INGREDIENT_FILTER_GROUPS) {
      for (const sf of group.subFilters) {
        if (sf.key === key) {
          return sf.options.find((o) => o.value === value)?.label ?? value
        }
      }
    }
    return value
  }

  return (
    <div className="list-page ingredients-page">
      <PageHeader
        title="Ingrédients"
        isLoading={isPlaceholderData}
        meta={hasFilters ? `${total} ingrédient${total > 1 ? 's' : ''}` : 'Découverte'}
        actions={
          <>
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
            <div className="list-header__actions-group">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setDrawerOpen(true)}
                className="list-filter-btn"
              >
                <SlidersHorizontal size={14} />
                <span>Filtrer</span>
                {filterCount > 0 && <span className="list-filter-btn__count">{filterCount}</span>}
              </Button>
              <Button to="/ingredients/new" variant="primary" size="md" className="list-filter-btn">
                <Plus size={14} />
                <span>Créer</span>
              </Button>
            </div>
          </>
        }
      />

      <ActiveFiltersBar
        activeTags={activeTags}
        groupLabels={GROUP_LABELS}
        getFilterLabel={getFilterLabel}
        onRemoveTag={toggleSingleFilter}
        onClearAll={resetFilters}
      />

      <GroupedFilterDialog
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        groups={INGREDIENT_FILTER_GROUPS}
        currentFilters={filters}
        initialFilters={EMPTY_FILTERS}
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
          <EmptyState icon={<FlaskConical size={24} />} subtitle="Chargement..." />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<FlaskConical size={24} />}
            title="Aucun ingrédient trouvé"
            subtitle="Essayez de modifier vos filtres."
          />
        ) : (
          <>
            <div className="list-grid">
              {items.map((ingredient) => (
                <Link
                  key={ingredient.id}
                  to="/ingredients/$slug"
                  params={{ slug: ingredient.slug }}
                  className="list-card"
                >
                  <div className="list-card__bar" />
                  <div className="list-card__body">
                    <div className="list-card__header">
                      <Badge variant="default">{ingredient.category}</Badge>
                      <svg
                        className="list-card__arrow"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        role="img"
                        aria-label="Voir l'ingrédient"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="list-card__name">{ingredient.name}</div>
                    {ingredient.description && (
                      <div className="ingredient-card__description">{ingredient.description}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {hasFilters && (
              <ListPagination currentPage={page} totalPages={totalPages} onPageChange={goToPage} />
            )}
          </>
        )}
      </main>
    </div>
  )
}
