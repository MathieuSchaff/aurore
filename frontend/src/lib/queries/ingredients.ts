import type {
  AllIngredientTagCategory,
  CreateIngredientInput,
  IngredientErrorCode,
  IngredientSort,
  IngredientType,
  ReplaceIngredientTagsInput,
  UpdateIngredientRouteInput,
} from '@aurore/shared'
import { ALL_INGREDIENT_FILTER_CATEGORIES } from '@aurore/shared'

import {
  infiniteQueryOptions,
  type QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { api } from '../api'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'

// Per-axis slug arrays; queryFn flattens to comma-joined query strings.
export type ListIngredientsFilters = Partial<Record<AllIngredientTagCategory, string[]>> & {
  type?: IngredientType
  sort?: IngredientSort
  page?: number
  limit?: number
  // Profile-derived avoid tags; backend flags rows as `profileMatches`.
  avoid_for?: string[]
}

const ingredientKeys = {
  all: ['ingredients'] as const,
  lists: () => [...ingredientKeys.all, 'list'] as const,
  list: (filters: ListIngredientsFilters = {}) => [...ingredientKeys.all, 'list', filters] as const,
  bySlug: (slug: string) => [...ingredientKeys.all, slug] as const,
  products: (slug: string) => [...ingredientKeys.all, slug, 'products'] as const,
  tags: (id: string) => [...ingredientKeys.all, id, 'tags'] as const,
  options: () => [...ingredientKeys.all, 'options'] as const,
  filterOptionsRoot: () => [...ingredientKeys.all, 'filter-options'] as const,
  filterOptions: (type?: IngredientType) =>
    [...ingredientKeys.filterOptionsRoot(), type ?? 'all'] as const,
}

export function invalidateIngredientReads(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: ingredientKeys.all })
}

const CREATE_INGREDIENT_HANDLED_ERROR_CODES = [
  'ingredient_already_exists',
  'slug_already_exists',
] as const satisfies readonly IngredientErrorCode[]
const UPDATE_INGREDIENT_HANDLED_ERROR_CODES = [
  ...CREATE_INGREDIENT_HANDLED_ERROR_CODES,
  'ingredient_update_conflict',
] as const satisfies readonly IngredientErrorCode[]

// Extracted (was inlined in `list.queryFn`) so the filter-to-query mapping
// can be unit-tested without spinning up react-query / msw.
export function buildListIngredientsQuery(filters: ListIngredientsFilters): Record<string, string> {
  const query: Record<string, string> = {}
  for (const axis of ALL_INGREDIENT_FILTER_CATEGORIES) {
    const values = filters[axis]
    if (values?.length) query[axis] = values.join(',')
  }
  if (filters.type) query.ingredient_type = filters.type
  if (filters.avoid_for?.length) query.avoid_for = filters.avoid_for.join(',')
  if (filters.sort !== undefined) query.sort = filters.sort
  if (filters.page) query.page = String(filters.page)
  if (filters.limit) query.limit = String(filters.limit)
  return query
}

export const ingredientQueries = {
  list: (filters: ListIngredientsFilters = {}) =>
    queryOptions({
      queryKey: ingredientKeys.list(filters),
      queryFn: async () => {
        const res = await api.ingredients.$get({ query: buildListIngredientsQuery(filters) })
        return unwrapData(res)
      },
    }),

  bySlug: (slug: string) =>
    queryOptions({
      queryKey: ingredientKeys.bySlug(slug),
      queryFn: async () => {
        const res = await api.ingredients[':slug'].$get({ param: { slug } })
        return unwrapData(res)
      },
      enabled: !!slug,
      staleTime: 5 * 60 * 1000,
    }),

  products: (slug: string) =>
    queryOptions({
      queryKey: ingredientKeys.products(slug),
      queryFn: async () => {
        const res = await api.ingredients[':slug'].products.$get({ param: { slug } })
        return unwrapData(res)
      },
      enabled: !!slug,
    }),

  tags: (id: string) =>
    queryOptions({
      queryKey: ingredientKeys.tags(id),
      queryFn: async () => {
        const res = await api.ingredients[':ingredientId'].tags.$get({
          param: { ingredientId: id },
        })
        return unwrapData(res)
      },
      enabled: !!id,
    }),

  search: (query: string, type?: IngredientType) =>
    queryOptions({
      queryKey: [...ingredientKeys.all, 'search', query, type ?? 'all'] as const,
      queryFn: async ({ signal }) => {
        const res = await api.ingredients.search.$get(
          { query: { q: query, ...(type && { type }) } },
          { init: { signal } }
        )
        return unwrapData(res)
      },
      enabled: query.length >= 2,
    }),

  // Wraps single-page response for the SearchCombobox infinite interface; backend has no pagination yet.
  searchInfinite: (query: string) =>
    infiniteQueryOptions({
      queryKey: [...ingredientKeys.all, 'search-infinite', query] as const,
      queryFn: async ({ signal }) => {
        const res = await api.ingredients.search.$get({ query: { q: query } }, { init: { signal } })
        return { items: await unwrapData(res), hasMore: false, nextOffset: 0 }
      },
      initialPageParam: 0 as number,
      getNextPageParam: (): number | undefined => undefined,
      // No enabled floor here: SearchCombobox owns gating via minChars.
    }),

  // Preferences attach to a substance, not to one of its catalogue aliases.
  searchDeclarableInfinite: (query: string) =>
    infiniteQueryOptions({
      queryKey: [...ingredientKeys.all, 'search-declarable', query] as const,
      queryFn: async ({ signal }) => {
        const res = await api.ingredients['search-identities'].$get(
          { query: { q: query } },
          { init: { signal } }
        )
        return {
          items: await unwrapData(res),
          hasMore: false,
          nextOffset: 0,
        }
      },
      initialPageParam: 0 as number,
      getNextPageParam: (): number | undefined => undefined,
    }),

  // Resolve names for slugs deep-linked from URL; cached so mounting the filter again doesn't refetch.
  bySlugs: (slugs: string[]) =>
    queryOptions({
      queryKey: [...ingredientKeys.all, 'by-slugs', slugs.toSorted()] as const,
      queryFn: async () => {
        const res = await api.ingredients['by-slugs'].$get({
          query: { slugs: slugs.join(',') },
        })
        return unwrapData(res)
      },
      enabled: slugs.length > 0,
      staleTime: 10 * 60 * 1000,
    }),
  options: (type?: IngredientType) =>
    queryOptions({
      queryKey: [...ingredientKeys.all, 'options', type ?? 'all'] as const,
      queryFn: async () => {
        const res = await api.ingredients.options.$get({ query: type ? { type } : {} })
        return unwrapData(res)
      },
      staleTime: 10 * 60 * 1000,
    }),

  filterOptions: (type?: IngredientType) =>
    queryOptions({
      queryKey: ingredientKeys.filterOptions(type),
      queryFn: async () => {
        const res = await api.ingredients['filter-options'].$get({
          query: type ? { type } : {},
        })
        return unwrapData(res)
      },
      staleTime: 10 * 60 * 1000,
    }),
}

export function useCreateIngredient() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['ingredients', 'create'],
    mutationFn: async (data: CreateIngredientInput) => {
      const res = await api.ingredients.$post({ json: data })
      return unwrapData(res)
    },
    onSuccess: (ingredient) => {
      qc.setQueryData(ingredientKeys.bySlug(ingredient.slug), ingredient)
      qc.invalidateQueries({ queryKey: ingredientKeys.lists() })
    },
    meta: {
      errorMessage: "Impossible de créer l'ingrédient.",
      handledErrorCodes: CREATE_INGREDIENT_HANDLED_ERROR_CODES,
    },
  })
}

export function useUpdateIngredient() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['ingredients', 'update'],
    meta: { handledErrorCodes: UPDATE_INGREDIENT_HANDLED_ERROR_CODES },
    mutationFn: async ({ id, data }: { id: string; data: UpdateIngredientRouteInput }) => {
      const res = await api.ingredients[':id'].$patch({ param: { id }, json: data })
      // 409 conflict is surfaced inline by IngredientForm via the thrown ApiError.
      return unwrapData(res)
    },
    onSuccess: (ingredient) => {
      qc.setQueryData(ingredientKeys.bySlug(ingredient.slug), ingredient)
      qc.invalidateQueries({ queryKey: ingredientKeys.lists() })
    },
    // 409 conflict handled inline in IngredientForm; no global toast.
  })
}

export function useDeleteIngredient() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['ingredients', 'delete'],
    mutationFn: async (id: string) => {
      const res = await api.ingredients[':id'].$delete({ param: { id } })
      await throwIfNotOk(res)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ingredientKeys.lists() })
    },
    meta: { errorMessage: "Impossible de supprimer l'ingrédient." },
  })
}

export function useUpdateIngredientTags() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['ingredients', 'tags', 'update'],
    mutationFn: async ({
      ingredientId,
      tags,
    }: {
      ingredientId: string
      tags: ReplaceIngredientTagsInput['tags']
    }) => {
      const res = await api.ingredients[':ingredientId'].tags.$put({
        param: { ingredientId },
        json: { tags },
      })
      return unwrapData(res)
    },
    onSuccess: (_, { ingredientId }) => {
      qc.invalidateQueries({ queryKey: ingredientKeys.tags(ingredientId) })
      qc.invalidateQueries({ queryKey: ingredientKeys.lists() })
      qc.invalidateQueries({ queryKey: ingredientKeys.filterOptionsRoot() })
    },
    meta: { errorMessage: 'Impossible de mettre à jour les tags.' },
  })
}
