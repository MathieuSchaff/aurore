import type {
  AllProductTagCategory,
  CreateProductInput,
  ProductConcentrationUnit,
  ProductDetailPage,
  ProductDomainTab,
  ProductErrorCode,
  ProductFormulaPreviewInput,
  ProductSort,
  UpdateProductInput,
} from '@aurore/shared'

export type { ProductSort }

import {
  infiniteQueryOptions,
  type QueryClient,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { FILTER_KEYS } from '@/features/products/filters'
import { type ApiData, api } from '../api'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'
import { collectionKeys } from './collection'
import { applyOptimisticUpdates, optimisticCacheUpdate } from './optimistic'

const PRODUCT_FORM_HANDLED_ERROR_CODES = [
  'product_already_exists',
  'tag_domain_mismatch',
  'unauthorized_access',
] as const satisfies readonly ProductErrorCode[]

export type ProductDermoAssessment = ApiData<(typeof api.products)[':slug']['dermo-score']['$get']>

export type ProductDetailPageData = Omit<ProductDetailPage, 'assessment'> & {
  assessment: ProductDermoAssessment | null
}

export function toProductDetailPageData(rawPage: unknown): ProductDetailPageData {
  // The backend validates this schema but keeps AppType opaque to avoid type expansion
  const page = rawPage as ProductDetailPage
  return {
    ...page,
    // shared ships assessment as opaque z.json() so algo-derm stays backend-only;
    // the cast puts back the rich type inferred from the dermo-score route
    assessment: page.assessment as ProductDermoAssessment | null,
  }
}

// Shape before serialization; local because Hono RPC expects Record<string,string>.
export type ListProductsFilters = {
  category?: ProductDomainTab
  kind?: string | string[]
  brand?: string | string[]
  ingredient?: string | string[]
  // 'auto': the server resolves the standing "Selon mon profil" setting; the
  // response says what happened in rulesApplied. false is never sent on the wire
  apply_preferences?: boolean | 'auto'
  include_excluded?: boolean
  q?: string
  sort?: ProductSort
  priceMin?: number
  priceMax?: number
  page?: number
  limit?: number
} & { [K in AllProductTagCategory]?: string | string[] }

export function buildListProductsQuery(
  filters: ListProductsFilters
): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {}

  const addParam = (key: string, value: string | string[] | undefined) => {
    if (!value) return
    const arr = Array.isArray(value) ? value : [value]
    if (arr.length > 0) {
      query[key] = arr.join(',')
    }
  }

  if (filters.category !== undefined) query.category = filters.category

  const f = filters as Record<string, string | string[] | undefined>
  for (const key of FILTER_KEYS) addParam(key, f[key])

  if (filters.apply_preferences) query.apply_preferences = String(filters.apply_preferences)
  if (filters.include_excluded) query.include_excluded = 'true'
  if (filters.q !== undefined) query.q = filters.q
  if (filters.sort !== undefined) query.sort = filters.sort
  if (filters.priceMin !== undefined) query.priceMin = String(filters.priceMin)
  if (filters.priceMax !== undefined) query.priceMax = String(filters.priceMax)
  if (filters.page !== undefined) query.page = String(filters.page)
  if (filters.limit !== undefined) query.limit = String(filters.limit)

  return query
}

function hasFilters(filters: ListProductsFilters): boolean {
  const f = filters as Record<string, string | string[] | undefined>
  return FILTER_KEYS.some((key) => {
    const value = f[key]
    return Array.isArray(value) ? value.length > 0 : !!value
  })
}

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ListProductsFilters, userId: string | null) =>
    [...productKeys.lists(), filters, userId] as const,
  detailPages: () => [...productKeys.all, 'detail-page'] as const,
  detailPagesBySlug: (slug: string) => [...productKeys.detailPages(), slug] as const,
  // The page carries userStatus and a profile-scored assessment, so sharing it
  // would expose another viewer's data
  detailPage: (slug: string, userId: string | null) =>
    [...productKeys.detailPagesBySlug(slug), userId] as const,
  bySlug: (slug: string) => [...productKeys.all, slug] as const,
  searches: () => [...productKeys.all, 'search'] as const,
  flatSearches: () => [...productKeys.all, 'search-flat'] as const,
  idLookups: () => [...productKeys.all, 'by-ids'] as const,
  duplicateChecks: () => [...productKeys.all, 'check-duplicate'] as const,
  brands: () => [...productKeys.all, 'brands'] as const,
  filterOptions: () => [...productKeys.all, 'filter-options'] as const,
  publicReviews: (slug: string) => [...productKeys.all, slug, 'reviews', 'public'] as const,
  posts: (slug: string) => [...productKeys.all, slug, 'posts'] as const,
}

export function invalidateProductReads(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: productKeys.all })
}

export function invalidateProductReviewReads(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    predicate: ({ queryKey }) =>
      queryKey[0] === productKeys.all[0] && queryKey[2] === 'reviews' && queryKey[3] === 'public',
  })
}

export function invalidateProductAuthorReads(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    predicate: ({ queryKey }) =>
      queryKey[0] === productKeys.all[0] &&
      (queryKey[2] === 'posts' || (queryKey[2] === 'reviews' && queryKey[3] === 'public')),
  })
}

export const productQueries = {
  filterOptions: (category?: ProductDomainTab) =>
    queryOptions({
      queryKey: [...productKeys.filterOptions(), category ?? 'all'] as const,
      queryFn: async () => {
        const query: Record<string, string> = {}
        if (category) query.category = category
        const res = await api.products['filter-options'].$get({ query })
        return unwrapData(res)
      },
      staleTime: 5 * 60 * 1000,
    }),

  // The list carries userStatus, so sharing it would expose another viewer's shelf
  list: (filters: ListProductsFilters, userId: string | null) =>
    queryOptions({
      queryKey: productKeys.list(filters, userId),
      meta: { sessionScope: { viewerId: userId } },
      queryFn: async () => {
        // Cast: Hono RPC's Zod union vs. our stringified record; accepted at runtime.
        const query = buildListProductsQuery(filters) as Parameters<
          typeof api.products.$get
        >[0]['query']
        const res = await api.products.$get({ query })
        return unwrapData(res)
      },
      // Random/filtered: long staleTime stops back-nav reshuffle. Discovery: 30s (not 0) so
      // the loader prefetch is honored on cold load instead of an immediate duplicate fetch
      staleTime: filters.sort === 'random' || hasFilters(filters) ? 1000 * 60 * 5 : 1000 * 30,
      gcTime: 1000 * 60 * 30,
    }),

  bySlug: (slug: string) =>
    queryOptions({
      queryKey: productKeys.bySlug(slug),
      queryFn: async () => {
        const res = await api.products[':slug'].$get({ param: { slug } })
        return unwrapData(res)
      },
      enabled: !!slug,
      staleTime: 5 * 60 * 1000,
    }),

  detailPage: (slug: string, userId: string | null) =>
    queryOptions({
      queryKey: productKeys.detailPage(slug, userId),
      meta: { sessionScope: { viewerId: userId } },
      queryFn: async () => {
        const res = await api.products[':slug'].page.$get({ param: { slug } })
        return toProductDetailPageData(await unwrapData(res))
      },
      enabled: !!slug,
      staleTime: 5 * 60 * 1000,
    }),

  publicReviews: (slug: string) =>
    queryOptions({
      queryKey: productKeys.publicReviews(slug),
      queryFn: async () => {
        const res = await api.products[':slug'].reviews.public.$get({ param: { slug } })
        return unwrapData(res)
      },
      enabled: !!slug,
      staleTime: 60 * 1000,
    }),

  posts: (slug: string) =>
    queryOptions({
      queryKey: productKeys.posts(slug),
      queryFn: async () => {
        const res = await api.products[':slug'].posts.$get({ param: { slug } })
        return unwrapData(res)
      },
      enabled: !!slug,
      staleTime: 60 * 1000,
    }),

  search: (q: string, category?: ProductDomainTab) =>
    infiniteQueryOptions({
      queryKey: [...productKeys.searches(), category ?? 'all', q] as const,
      queryFn: async ({ pageParam, signal }: { pageParam: number; signal: AbortSignal }) => {
        const res = await api.products.search.$get(
          {
            query: {
              q,
              limit: '20',
              offset: String(pageParam),
              ...(category ? { category } : {}),
            },
          },
          { init: { signal } }
        )
        return unwrapData(res)
      },
      initialPageParam: 0 as number,
      getNextPageParam: (lastPage): number | undefined =>
        lastPage.hasMore ? lastPage.nextOffset : undefined,
      // No enabled floor here: SearchCombobox owns gating via minChars.
      staleTime: 30 * 1000,
    }),

  // Flat (not paginated) variant for AsyncSearchSelect typeahead.
  searchFlat: (q: string) =>
    queryOptions({
      queryKey: [...productKeys.flatSearches(), q] as const,
      queryFn: async ({ signal }) => {
        const res = await api.products.search.$get(
          { query: { q, limit: '20', offset: '0' } },
          { init: { signal } }
        )
        return (await unwrapData(res)).items
      },
      // No enabled floor here: AsyncSearchSelect owns gating via minChars.
      staleTime: 30 * 1000,
    }),

  byIds: (ids: string[]) =>
    queryOptions({
      queryKey: [...productKeys.idLookups(), ids.toSorted().join(',')] as const,
      queryFn: async () => {
        const res = await api.products['by-ids'].$get({ query: { ids: ids.join(',') } })
        return unwrapData(res)
      },
      enabled: ids.length > 0,
      staleTime: 5 * 60 * 1000,
    }),

  checkDuplicate: (name: string, brand: string) => {
    // Normalize so case/whitespace variants share one cache entry.
    const n = name.trim().toLowerCase()
    const b = brand.trim().toLowerCase()
    return queryOptions({
      queryKey: [...productKeys.duplicateChecks(), n, b] as const,
      queryFn: async () => {
        const res = await api.products['check-duplicate'].$get({
          query: { name: n, brand: b },
        })
        return unwrapData(res)
      },
      enabled: n.length >= 2 && b.length >= 1,
      staleTime: 30 * 1000,
    })
  },

  previewSlug: (name: string, brand: string) => {
    const n = name.trim().toLowerCase()
    const b = brand.trim().toLowerCase()
    return queryOptions({
      queryKey: [...productKeys.all, 'slug-preview', n, b] as const,
      queryFn: async () => {
        const res = await api.products['slug-preview'].$get({ query: { name: n, brand: b } })
        return (await unwrapData(res)).slug
      },
      staleTime: 30 * 1000,
    })
  },

  brands: (category?: ProductDomainTab) =>
    queryOptions({
      queryKey: [...productKeys.brands(), category ?? 'all'] as const,
      queryFn: async () => {
        const res = await api.products.brands.$get({
          query: category ? { category } : {},
        })
        return unwrapData(res)
      },
      staleTime: 5 * 60 * 1000,
    }),
}

type ProductListData = ApiData<typeof api.products.$get>

function invalidateProductDiscoveryReads(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: productKeys.lists() })
  qc.invalidateQueries({ queryKey: productKeys.searches() })
  qc.invalidateQueries({ queryKey: productKeys.flatSearches() })
  qc.invalidateQueries({ queryKey: productKeys.duplicateChecks() })
  qc.invalidateQueries({ queryKey: productKeys.brands() })
  qc.invalidateQueries({ queryKey: productKeys.filterOptions() })
}

// Product mutations converge detail and every discovery cache that can render stale data
function invalidateProductSurfaces(qc: QueryClient, slug: string) {
  qc.invalidateQueries({ queryKey: productKeys.bySlug(slug) })
  qc.invalidateQueries({ queryKey: productKeys.detailPagesBySlug(slug) })
  invalidateProductDiscoveryReads(qc)
}

function invalidateFormulaSurfaces(qc: QueryClient, slug: string) {
  qc.invalidateQueries({ queryKey: productKeys.bySlug(slug) })
  qc.invalidateQueries({ queryKey: productKeys.detailPagesBySlug(slug) })
  qc.invalidateQueries({ queryKey: collectionKeys.formulaMotifs() })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['products', 'create'],
    meta: { handledErrorCodes: PRODUCT_FORM_HANDLED_ERROR_CODES },
    mutationFn: async (data: CreateProductInput) => {
      const res = await api.products.$post({ json: data })
      return unwrapData(res)
    },
    onSuccess: () => {
      // Don't seed bySlug: POST returns row only; cache holds full ProductDetail with tags/ingredients.
      invalidateProductDiscoveryReads(qc)
    },
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['products', 'update'],
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductInput }) => {
      const res = await api.products[':id'].$patch({ param: { id }, json: data })
      return unwrapData(res)
    },
    onSuccess: (product) => {
      // PATCH returns a row only; both reads also hold linked ingredients and tags
      invalidateProductSurfaces(qc, product.slug)
      qc.invalidateQueries({ queryKey: collectionKeys.formulaMotifs() })
    },
    meta: {
      errorMessage: 'Modification du produit impossible.',
      handledErrorCodes: PRODUCT_FORM_HANDLED_ERROR_CODES,
    },
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['products', 'delete'],
    mutationFn: async ({ id }: { id: string; slug: string }) => {
      const res = await api.products[':id'].$delete({ param: { id } })
      await throwIfNotOk(res)
    },
    onSuccess: (_, { slug }) => {
      qc.removeQueries({ queryKey: productKeys.bySlug(slug) })
      qc.removeQueries({ queryKey: productKeys.detailPagesBySlug(slug) })
      invalidateProductDiscoveryReads(qc)
      qc.invalidateQueries({ queryKey: productKeys.idLookups() })
      qc.invalidateQueries({ queryKey: collectionKeys.formulaMotifs() })
    },
    meta: { errorMessage: 'Suppression du produit impossible.' },
  })
}

export function useUpdateProductTags() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['products', 'tags', 'update'],
    mutationFn: async ({
      productId,
      tags,
    }: {
      productId: string
      slug: string
      tags: { tagId: string; relevance: 'primary' | 'secondary' | 'avoid' }[]
    }) => {
      const res = await api.products[':productId'].tags.$put({
        param: { productId },
        json: { tags },
      })
      return unwrapData(res)
    },
    onSuccess: (_, { slug }) => {
      invalidateProductSurfaces(qc, slug)
    },
    meta: { handledErrorCodes: PRODUCT_FORM_HANDLED_ERROR_CODES },
  })
}

export function useAddProductIngredient() {
  const qc = useQueryClient()
  return useMutation({
    // Keyed so FormulaPreview can observe in-flight adds via useMutationState.
    mutationKey: ['add-product-ingredient'],
    mutationFn: async ({
      productId,
      ingredientId,
      concentrationValue,
      concentrationUnit,
    }: {
      productId: string
      slug: string
      ingredientId: string
      concentrationValue?: number
      concentrationUnit?: ProductConcentrationUnit
    }) => {
      const res = await api.products[':productId'].ingredients.$post({
        param: { productId },
        json: {
          ingredientId,
          concentrationValue,
          concentrationUnit,
        },
      })
      return unwrapData(res)
    },
    onSuccess: (_, { slug }) => {
      invalidateFormulaSurfaces(qc, slug)
    },
    meta: { errorMessage: "Ajout de l'ingrédient impossible." },
  })
}

export function useUpdateProductIngredient() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['products', 'ingredients', 'update'],
    mutationFn: async ({
      productId,
      ingredientId,
      concentrationValue,
      concentrationUnit,
    }: {
      productId: string
      slug: string
      ingredientId: string
      concentrationValue?: number | null
      concentrationUnit?: ProductConcentrationUnit | null
    }) => {
      const res = await api.products[':productId'].ingredients[':ingredientId'].$patch({
        param: { productId, ingredientId },
        json: {
          concentrationValue,
          concentrationUnit,
        },
      })
      return unwrapData(res)
    },
    onSuccess: (_, { slug }) => {
      invalidateFormulaSurfaces(qc, slug)
    },
    meta: { errorMessage: "Mise à jour de l'ingrédient impossible." },
  })
}

type RemoveProductIngredientVariables = {
  productId: string
  slug: string
  ingredientId: string
}

export function useRemoveProductIngredient() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['products', 'ingredients', 'remove'],
    mutationFn: async ({ productId, ingredientId }: RemoveProductIngredientVariables) => {
      const res = await api.products[':productId'].ingredients[':ingredientId'].$delete({
        param: { productId, ingredientId },
      })
      await throwIfNotOk(res)
    },
    // Optimistic remove so unrelated rows stay interactive during the request.
    onMutate: (variables) => {
      return applyOptimisticUpdates(qc, variables, [
        optimisticCacheUpdate<RemoveProductIngredientVariables, ProductDetail>({
          queryKey: ({ slug }) => productKeys.bySlug(slug),
          updater: (previous, { ingredientId }) => {
            if (!previous) return previous
            return {
              ...previous,
              ingredients: previous.ingredients.filter((i) => i.ingredientId !== ingredientId),
            }
          },
        }),
      ])
    },
    onError: (_err, _variables, context) => {
      context?.rollback()
    },
    onSettled: (_, __, { slug }) => {
      invalidateFormulaSurfaces(qc, slug)
    },
    meta: { errorMessage: "Retrait de l'ingrédient impossible." },
  })
}

export type ProductListItem = ProductListData['items'][number]

// Inferred from the route so backend field additions surface automatically
export type ProductDetail = ApiData<(typeof api.products)[':slug']['$get']>

export type ProductFormulaPreview = ApiData<(typeof api.products)['formula-preview']['$post']>

export function usePreviewProductFormula() {
  return useMutation({
    mutationKey: ['products', 'formula', 'preview'],
    mutationFn: async (input: ProductFormulaPreviewInput) => {
      const res = await api.products['formula-preview'].$post({ json: input })
      return unwrapData(res)
    },
  })
}
