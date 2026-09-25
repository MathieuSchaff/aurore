import type {
  ArticleErrorCode,
  ArticleSearchFilters,
  CreateArticleInput,
  UpdateArticleInput,
} from '@aurore/shared'

import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { type ApiData, api } from '../api'
import { captureClientSession, viewerId } from '../auth/session'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'

type ListArticlesFilters = Partial<ArticleSearchFilters>

const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters: ListArticlesFilters, userId: string | null) =>
    filters.publishedOnly === false
      ? ([...articleKeys.all, 'list', filters, userId] as const)
      : ([...articleKeys.all, 'list', filters] as const),
  bySlug: (slug: string, userId: string | null) =>
    [...articleKeys.all, 'detail', slug, userId] as const,
  categoryCounts: () => [...articleKeys.all, 'categoryCounts'] as const,
}

const ARTICLE_FORM_HANDLED_ERROR_CODES = [
  'slug_already_exists',
] as const satisfies readonly ArticleErrorCode[]

export const articleQueries = {
  list: (filters: ListArticlesFilters, userId: string | null) =>
    queryOptions({
      queryKey: articleKeys.list(filters, userId),
      queryFn: async ({ signal }) => {
        const query: Record<string, string> = {
          page: String(filters.page ?? 1),
          limit: String(filters.limit ?? 20),
          publishedOnly: String(filters.publishedOnly ?? true),
        }
        if (filters.category) query.category = filters.category
        if (filters.q) query.q = filters.q

        const res = await api.articles.$get({ query }, { init: { signal } })
        return unwrapData(res)
      },
    }),

  bySlug: (slug: string, userId: string | null) =>
    queryOptions({
      queryKey: articleKeys.bySlug(slug, userId),
      queryFn: async ({ signal }) => {
        const res = await api.articles[':slug'].$get({ param: { slug } }, { init: { signal } })
        return unwrapData(res)
      },
      enabled: !!slug,
    }),

  categoryCounts: () =>
    queryOptions({
      queryKey: articleKeys.categoryCounts(),
      queryFn: async ({ signal }) => {
        const res = await api.articles.categories.$get({}, { init: { signal } })
        return unwrapData(res)
      },
      // Counts shift slowly; avoid fetching again on every nav.
      staleTime: 60_000,
    }),
}

export function useCreateArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['articles', 'create'],
    onMutate: captureClientSession,
    mutationFn: async (data: CreateArticleInput) => {
      const res = await api.articles.$post({ json: data })
      return unwrapData(res)
    },
    onSuccess: (article, _input, owner) => {
      if (owner.isCurrent()) {
        qc.setQueryData(articleKeys.bySlug(article.slug, viewerId(owner.session)), article)
      }
      qc.invalidateQueries({ queryKey: articleKeys.lists() })
      qc.invalidateQueries({ queryKey: articleKeys.categoryCounts() })
    },
    meta: {
      errorMessage: "Création de l'article impossible.",
      handledErrorCodes: ARTICLE_FORM_HANDLED_ERROR_CODES,
    },
  })
}

export function useUpdateArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['articles', 'update'],
    onMutate: captureClientSession,
    mutationFn: async ({ slug, data }: { slug: string; data: UpdateArticleInput }) => {
      const res = await api.articles[':slug'].$patch({ param: { slug }, json: data })
      return unwrapData(res)
    },
    onSuccess: (article, { slug }, owner) => {
      if (owner.isCurrent()) {
        const userId = viewerId(owner.session)
        qc.setQueryData(articleKeys.bySlug(article.slug, userId), article)
        if (article.slug !== slug) qc.removeQueries({ queryKey: articleKeys.bySlug(slug, userId) })
      }
      qc.invalidateQueries({ queryKey: articleKeys.lists() })
      qc.invalidateQueries({ queryKey: articleKeys.categoryCounts() })
    },
    meta: {
      errorMessage: "Mise à jour de l'article impossible.",
      handledErrorCodes: ARTICLE_FORM_HANDLED_ERROR_CODES,
    },
  })
}

export function useDeleteArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['articles', 'delete'],
    mutationFn: async (slug: string) => {
      const res = await api.articles[':slug'].$delete({ param: { slug } })
      await throwIfNotOk(res)
    },
    onSuccess: (_, slug) => {
      qc.setQueriesData<ApiData<typeof api.articles.$get>>(
        { queryKey: articleKeys.lists() },
        (previous) => {
          if (!previous) return previous
          const items = previous.items.filter((article) => article.slug !== slug)
          return {
            ...previous,
            items,
            total: previous.total - (previous.items.length - items.length),
          }
        }
      )
      qc.invalidateQueries({ queryKey: articleKeys.lists() })
      qc.invalidateQueries({ queryKey: articleKeys.categoryCounts() })
    },
    meta: { errorMessage: "Suppression de l'article impossible." },
  })
}
