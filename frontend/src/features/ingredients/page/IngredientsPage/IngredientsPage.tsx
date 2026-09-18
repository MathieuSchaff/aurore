import type { IngredientType } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { FlaskConical, Plus, SlidersHorizontal } from 'lucide-react'
import type React from 'react'
import { startTransition, useCallback, useMemo, useState } from 'react'

import { Button, ButtonLink } from '@/component/Button/Button'
import { Card } from '@/component/Card/Card'
import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { NavArrow } from '@/component/DataDisplay/NavArrow/NavArrow'
import { ListPagination } from '@/component/DataDisplay/Pagination/ListPagination'
import { EmptyState } from '@/component/Feedback/ui/EmptyState/EmptyState'
import { RateLimitEmptyState } from '@/component/Feedback/ui/EmptyState/RateLimitEmptyState'
import { ActiveFiltersBar } from '@/component/Filter/ActiveFiltersBar/ActiveFiltersBar'
import { FilterDrawer } from '@/component/Filter/FilterDrawer/FilterDrawer'
import { emptyFilters, getFilterLabel } from '@/component/Filter/helpers'
import type { FilterGroupConfig, FilterValues } from '@/component/Filter/types'
import { Toggle } from '@/component/Input/Toggle/Toggle'
import { ListBrowseHeader } from '@/component/Layout/PageLayout/ListBrowseHeader'
import { ListPageLayout } from '@/component/Layout/PageLayout/ListPageLayout'
import { SearchCombobox } from '@/component/Search/SearchCombobox'
import { Tabs } from '@/component/Tabs/Tabs'
import { SKIN_CONCERN_LABELS, SKIN_TYPE_LABELS } from '@/constants/skin'
import {
  CATEGORY_ACCENTS,
  DEFAULT_CATEGORY_ACCENT,
  ingredientLabels,
} from '@/features/ingredients/constants'
import {
  buildDomainSwitchSearch,
  DOMAIN_TAB_OPTIONS,
  FILTER_KEYS,
  type FilterKey,
  GROUP_LABELS,
  INGREDIENTS_PAGE_SIZE,
  ingredientsListApiFilters,
} from '@/features/ingredients/filters'
import { portraitSlugs } from '@/features/profile/portrait-slugs'
import { useIngredientTagFilterGroups } from '@/hooks/useIngredientTagFilterGroups'
import { useListFilters } from '@/hooks/useListFilters'
import { useProfileFilterToggle } from '@/hooks/useProfileFilterToggle'
import type { ApiData, api } from '@/lib/api'
import { useSession } from '@/lib/auth/session'
import { isRateLimitError } from '@/lib/helpers/apiError'
import { ingredientQueries } from '@/lib/queries/ingredients'
import { profileQueries } from '@/lib/queries/profile'

import '@/component/Layout/PageLayout/ListPage.css'
import './IngredientsPage.css'

const routeApi = getRouteApi('/ingredients/')

const EMPTY_FILTERS = emptyFilters(FILTER_KEYS)

export function IngredientsPage() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  const search = routeApi.useSearch()
  const { page, type, profile_filter } = search
  const navigate = useNavigate({ from: '/ingredients/' })

  const session = useSession()
  const hasViewer = session.status === 'authenticated'

  const { data: dermoProfile } = useQuery({
    ...profileQueries.dermo(),
    enabled: hasViewer && profile_filter,
  })

  const avoidFor = useMemo(
    () => (profile_filter ? portraitSlugs(dermoProfile) : []),
    [profile_filter, dermoProfile]
  )

  const filters: FilterValues<FilterKey> = Object.fromEntries(
    FILTER_KEYS.map((k) => [k, search[k] ?? []])
  ) as FilterValues<FilterKey>

  const { filterCount, activeTags, applyFilters, resetFilters, goToPage, toggleSingleFilter } =
    useListFilters({
      from: '/ingredients/',
      filters,
      emptyFilters: EMPTY_FILTERS,
      filterKeys: FILTER_KEYS,
    })

  const { data, isLoading, isPlaceholderData, error } = useQuery({
    ...ingredientQueries.list(ingredientsListApiFilters(search, avoidFor)),
    placeholderData: (prev) => prev,
  })

  const { data: filterOptions } = useQuery(ingredientQueries.filterOptions(type))

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / INGREDIENTS_PAGE_SIZE)

  const filterGroups = useIngredientTagFilterGroups(type, filterOptions?.tags)

  const handleDomainChange = useCallback(
    (next: IngredientType) => {
      startTransition(() => {
        navigate({
          search: (prev) => buildDomainSwitchSearch(prev, next, EMPTY_FILTERS),
          replace: true,
        })
      })
    },
    [navigate]
  )

  const handleProfileFilterChange = useProfileFilterToggle('/ingredients/')

  const showProfileToggle = hasViewer && type === 'skincare'

  return (
    <ListPageLayout className="ingredients-page">
      <IngredientsHeader
        total={total}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
        filterCount={filterCount}
        type={type}
        onDomainChange={handleDomainChange}
        onOpenFilters={() => setDrawerOpen(true)}
        onIngredientSelect={(slug) => navigate({ to: '/ingredients/$slug', params: { slug } })}
      />

      <ActiveFiltersBar
        activeTags={activeTags}
        groupLabels={GROUP_LABELS}
        getFilterLabel={(key, value) => getFilterLabel(filterGroups, key, value)}
        onRemoveTag={toggleSingleFilter}
        onClearAll={resetFilters}
      />

      <IngredientsFilterDrawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        groups={filterGroups}
        currentFilters={filters}
        onApply={applyFilters}
        onReset={resetFilters}
        showProfileToggle={showProfileToggle}
        profileFilter={profile_filter}
        onProfileFilterChange={handleProfileFilterChange}
      />

      <ListPageLayout.Body maxWidth="var(--list-browse-rail)" isSyncing={isPlaceholderData}>
        <IngredientResults
          items={items}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          error={error}
          page={page}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </ListPageLayout.Body>
    </ListPageLayout>
  )
}

type IngredientListItem = ApiData<(typeof api.ingredients)['$get']>['items'][number]

function IngredientsHeader({
  total,
  isLoading,
  isPlaceholderData,
  filterCount,
  type,
  onDomainChange,
  onOpenFilters,
  onIngredientSelect,
}: {
  total: number
  isLoading: boolean
  isPlaceholderData: boolean
  filterCount: number
  type: IngredientType
  onDomainChange: (type: IngredientType) => void
  onOpenFilters: () => void
  onIngredientSelect: (slug: string) => void
}) {
  const filterLabel =
    filterCount > 0 ? `Filtrer (${filterCount} actif${filterCount > 1 ? 's' : ''})` : 'Filtrer'

  return (
    <ListPageLayout.Header fullBleed>
      <ListBrowseHeader
        title="Ingrédients"
        meta={
          (!isLoading || total > 0) && (
            <>
              {total} ingrédient{total > 1 ? 's' : ''}
            </>
          )
        }
        metaBusy={isPlaceholderData}
        tools={
          <>
            <ButtonLink
              to="/ingredients/new"
              variant="ghost"
              size="md"
              className="list-browse-header__icon-btn"
              aria-label="Créer un ingrédient"
              title="Créer un ingrédient"
            >
              <Plus size={16} aria-hidden="true" />
            </ButtonLink>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onOpenFilters}
              className="list-filter-btn"
              aria-label={filterLabel}
            >
              <SlidersHorizontal size={14} aria-hidden="true" />
              <span>Filtrer</span>
              {filterCount > 0 && (
                <span className="list-filter-btn__count" aria-hidden="true">
                  {filterCount}
                </span>
              )}
            </Button>
          </>
        }
        tabs={
          <Tabs
            options={DOMAIN_TAB_OPTIONS}
            activeTab={type}
            onTabChange={onDomainChange}
            variant="underline"
            scrollable
            ariaLabel="Domaine d'ingrédient"
            hasPanels={false}
          />
        }
        search={
          <SearchCombobox
            label="Rechercher un ingrédient"
            queryFn={ingredientQueries.searchInfinite}
            toResult={(item) => ({
              id: item.id,
              slug: item.slug,
              label: item.name,
              sublabel: item.category ?? undefined,
            })}
            onSelect={onIngredientSelect}
          />
        }
      />
    </ListPageLayout.Header>
  )
}

function IngredientsFilterDrawer({
  open,
  onClose,
  groups,
  currentFilters,
  onApply,
  onReset,
  showProfileToggle,
  profileFilter,
  onProfileFilterChange,
}: {
  open: boolean
  onClose: () => void
  groups: FilterGroupConfig<FilterKey>[]
  currentFilters: FilterValues<FilterKey>
  onApply: (filters: FilterValues<FilterKey>) => void
  onReset: () => void
  showProfileToggle: boolean
  profileFilter: boolean
  onProfileFilterChange: (checked: boolean) => void
}) {
  return (
    <FilterDrawer
      open={open}
      onClose={onClose}
      groups={groups}
      currentFilters={currentFilters}
      initialFilters={EMPTY_FILTERS}
      onApply={onApply}
      onReset={onReset}
    >
      {showProfileToggle && (
        <Toggle
          label="Selon mon portrait"
          hint="Signale les ingrédients liés à ce que vous suivez. Note personnelle, pas un avertissement."
          checked={profileFilter}
          onChange={onProfileFilterChange}
          size="sm"
        />
      )}
    </FilterDrawer>
  )
}

function IngredientResults({
  items,
  isLoading,
  isPlaceholderData,
  error,
  page,
  totalPages,
  onPageChange,
}: {
  items: IngredientListItem[]
  isLoading: boolean
  isPlaceholderData: boolean
  error: unknown
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (isLoading && !isPlaceholderData) {
    return <EmptyState icon={<FlaskConical size={24} />} subtitle="Chargement..." />
  }
  if (items.length === 0) {
    return isRateLimitError(error) ? (
      <RateLimitEmptyState error={error} />
    ) : (
      <EmptyState
        icon={<FlaskConical size={24} />}
        title={ingredientLabels.noResultsTitle}
        subtitle="Essayez de modifier vos filtres."
      />
    )
  }

  return (
    <>
      <div className="list-grid">
        {items.map((ingredient) => (
          <IngredientCard key={ingredient.id} ingredient={ingredient} />
        ))}
      </div>
      <ListPagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  )
}

function IngredientCard({ ingredient }: { ingredient: IngredientListItem }) {
  const matchLabels = ingredient.profileMatches.map(
    (slug) =>
      SKIN_TYPE_LABELS[slug as keyof typeof SKIN_TYPE_LABELS] ??
      SKIN_CONCERN_LABELS[slug as keyof typeof SKIN_CONCERN_LABELS] ??
      slug
  )
  const accent =
    (ingredient.category &&
      CATEGORY_ACCENTS[ingredient.category as keyof typeof CATEGORY_ACCENTS]) ||
    DEFAULT_CATEGORY_ACCENT

  return (
    <Card
      as={Link as React.ElementType}
      to="/ingredients/$slug"
      params={{ slug: ingredient.slug }}
      accent={accent}
    >
      <Card.Body>
        <Card.Title as="h2" style={{ viewTransitionName: `ingredient-name-${ingredient.slug}` }}>
          {ingredient.name}
        </Card.Title>
        {ingredient.description && <Card.Description>{ingredient.description}</Card.Description>}
      </Card.Body>
      <Card.Footer>
        {/* Profile matches are hints rather than verdicts */}
        {ingredient.profileMatches.length > 0 && (
          <span
            title={`Lié à : ${matchLabels.join(', ')}. Note personnelle, pas un avertissement.`}
          >
            <Badge variant="default">Pour vous</Badge>
          </span>
        )}
        <Badge variant="chip">{ingredient.category}</Badge>
        <NavArrow size={16} className="ingredients-page__card-arrow" />
      </Card.Footer>
    </Card>
  )
}
