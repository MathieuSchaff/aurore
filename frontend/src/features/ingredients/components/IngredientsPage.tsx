import { useQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { FlaskConical, Plus, SlidersHorizontal } from 'lucide-react'
import type React from 'react'
import { useMemo, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Card } from '@/component/Card/Card'
import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { ListPagination } from '@/component/DataDisplay/Pagination/ListPagination'
import { EmptyState } from '@/component/Feedback/EmptyState/EmptyState'
import {
  ActiveFiltersBar,
  emptyFilters,
  FilterDrawer,
  type FilterGroupConfig,
  type FilterOption,
  type FilterValues,
  getFilterLabel,
} from '@/component/Filter'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { SearchCombobox } from '@/component/search/SearchCombobox'
import { useListFilters } from '@/hooks/useListFilters'
import { ingredientQueries, type ListIngredientsFilters } from '../../../lib/queries/ingredients'
import { ATTRIBUTE_SUBGROUPS, FILTER_KEYS, type FilterKey, GROUP_LABELS } from '../filters'

import '@/component/Layout/PageLayout/ListPage.css'
import './IngredientsPage.css'

const routeApi = getRouteApi('/ingredients/')

const EMPTY_FILTERS = emptyFilters(FILTER_KEYS)
const PAGE_SIZE = 20

export function IngredientsPage() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  const { category, concern, skin_type, attribute, page } = routeApi.useSearch()
  const navigate = useNavigate({ from: '/ingredients/' })

  const filters: FilterValues<FilterKey> = { category, concern, skin_type, attribute }

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
        skin_type: skin_type.length > 0 ? skin_type : undefined,
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

  const { data: filterOptions } = useQuery(ingredientQueries.filterOptions())

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const filterGroups = useMemo<FilterGroupConfig<FilterKey>[]>(() => {
    const toOpts = (arr: { name: string; slug: string }[]): FilterOption[] =>
      arr.map((t) => ({ value: t.slug, label: t.name }))

    return [
      {
        id: 'skin',
        label: 'Ma peau',
        defaultOpen: true,
        tier: 'essential',
        subFilters: [
          {
            key: 'skin_type',
            label: 'Type de peau',
            placeholder: 'Tous types',
            options: toOpts(filterOptions?.tags.skin_type ?? []),
          },
        ],
      },
      {
        id: 'concern',
        label: 'Problématique',
        defaultOpen: true,
        tier: 'essential',
        subFilters: [
          {
            key: 'concern',
            label: 'Problématique',
            placeholder: 'Toutes',
            options: toOpts(filterOptions?.tags.concern ?? []),
          },
        ],
      },
      {
        id: 'properties',
        label: 'Propriétés & actions',
        defaultOpen: false,
        tier: 'advanced',
        subFilters: [
          {
            key: 'attribute',
            label: 'Propriétés',
            placeholder: 'Toutes',
            options: toOpts(filterOptions?.tags.attribute ?? []),
            subGroups: ATTRIBUTE_SUBGROUPS,
          },
        ],
      },
      {
        id: 'category',
        label: 'Catégorie technique',
        defaultOpen: false,
        tier: 'advanced',
        subFilters: [
          {
            key: 'category',
            label: 'Catégorie',
            placeholder: 'Toutes',
            options: (filterOptions?.categories ?? []).map((c) => ({ value: c, label: c })),
          },
        ],
      },
    ]
  }, [filterOptions])

  return (
    <div className="list-page ingredients-page">
      <PageHeader
        title="Ingrédients"
        isLoading={isPlaceholderData}
        meta={hasFilters ? `${total} ingrédient${total > 1 ? 's' : ''}` : 'Découverte'}
        actions={
          <>
            <SearchCombobox
              label="Rechercher un ingrédient"
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
        getFilterLabel={(key, value) => getFilterLabel(filterGroups, key, value)}
        onRemoveTag={toggleSingleFilter}
        onClearAll={resetFilters}
      />

      <FilterDrawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        groups={filterGroups}
        currentFilters={filters}
        initialFilters={EMPTY_FILTERS}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <main className={`list-main${isPlaceholderData ? ' list-main--syncing' : ''}`}>
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
                <Card
                  key={ingredient.id}
                  as={Link as React.ElementType}
                  to="/ingredients/$slug"
                  params={{ slug: ingredient.slug }}
                  className="list-card"
                  accent="var(--color-info)"
                >
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
                    <div
                      className="list-card__name"
                      style={{ viewTransitionName: `ingredient-name-${ingredient.slug}` }}
                    >
                      {ingredient.name}
                    </div>
                    {ingredient.description && (
                      <div className="ingredient-card__description">{ingredient.description}</div>
                    )}
                  </div>
                </Card>
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
