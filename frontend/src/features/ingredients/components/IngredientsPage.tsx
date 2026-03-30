import { useQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { FlaskConical, Plus, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { NavArrow } from '@/component/DataDisplay/NavArrow/NavArrow'
import { ListPagination } from '@/component/DataDisplay/Pagination/ListPagination'
import { EmptyState } from '@/component/Feedback/EmptyState/EmptyState'
import { ActiveFiltersBar } from '@/component/Filter/ActiveFiltersBar'
import { type FilterValues, GroupedFilterDialog } from '@/component/Filter/Filter'
import { IconBox } from '@/component/Layout/IconBox/IconBox'
import { PageBanner } from '@/component/Layout/PageBanner/PageBanner'
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
      <header className="list-header">
        <PageBanner>
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

            <Link to="/ingredients/new" className="list-filter-btn">
              <Plus size={16} />
              <span>Créer</span>
            </Link>

            <button type="button" className="list-filter-btn" onClick={() => setDrawerOpen(true)}>
              <SlidersHorizontal size={16} />
              <span>Filtrer</span>
              {filterCount > 0 && <span className="list-filter-btn__count">{filterCount}</span>}
            </button>
          </div>
        </PageBanner>

        <ActiveFiltersBar
          activeTags={activeTags}
          groupLabels={GROUP_LABELS}
          getFilterLabel={getFilterLabel}
          onRemoveTag={toggleSingleFilter}
          onClearAll={resetFilters}
        />
      </header>

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
                  <IconBox className="list-card__icon">
                    <FlaskConical size={18} />
                  </IconBox>
                  <div className="list-card__body">
                    <div className="list-card__name">{ingredient.name}</div>
                    {ingredient.description && (
                      <div className="ingredient-card__description">{ingredient.description}</div>
                    )}
                    <div className="ingredient-card__meta">
                      <Badge variant="default">{ingredient.category}</Badge>
                    </div>
                  </div>
                  <NavArrow size={18} />
                </Link>
              ))}
            </div>

            <ListPagination currentPage={page} totalPages={totalPages} onPageChange={goToPage} />
          </>
        )}
      </main>
    </div>
  )
}
