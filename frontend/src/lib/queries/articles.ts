import type {
  ArticleErrorCode,
  BlogCategory,
  CreateArticleInput,
  UpdateArticleInput,
} from '@aurore/shared'

import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'

type ListArticlesFilters = {
  category?: BlogCategory
  q?: string
  page?: number
  limit?: number
  publishedOnly?: boolean
}

const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters: ListArticlesFilters = {}) => [...articleKeys.all, 'list', filters] as const,
  bySlug: (slug: string) => [...articleKeys.all, slug] as const,
  categoryCounts: () => [...articleKeys.all, 'categoryCounts'] as const,
}

const ARTICLE_FORM_HANDLED_ERROR_CODES = [
  'slug_already_exists',
] as const satisfies readonly ArticleErrorCode[]

export const articleQueries = {
  list: (filters: ListArticlesFilters = {}) =>
    queryOptions({
      queryKey: articleKeys.list(filters),
      queryFn: async () => {
        const query: Record<string, string> = {
          page: String(filters.page ?? 1),
          limit: String(filters.limit ?? 20),
          publishedOnly: String(filters.publishedOnly ?? true),
        }
        if (filters.category) query.category = filters.category
        if (filters.q) query.q = filters.q

        const res = await api.articles.$get({ query })
        return unwrapData(res)
      },
    }),

  bySlug: (slug: string) =>
    queryOptions({
      queryKey: articleKeys.bySlug(slug),
      queryFn: async () => {
        const res = await api.articles[':slug'].$get({ param: { slug } })
        return unwrapData(res)
      },
      enabled: !!slug,
    }),

  categoryCounts: () =>
    queryOptions({
      queryKey: articleKeys.categoryCounts(),
      queryFn: async () => {
        const res = await api.articles.categories.$get()
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
    mutationFn: async (data: CreateArticleInput) => {
      const res = await api.articles.$post({ json: data })
      return unwrapData(res)
    },
    onSuccess: (article) => {
      qc.setQueryData(articleKeys.bySlug(article.slug), article)
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
    mutationFn: async ({ slug, data }: { slug: string; data: UpdateArticleInput }) => {
      const res = await api.articles[':slug'].$patch({ param: { slug }, json: data })
      return unwrapData(res)
    },
    onSuccess: (article, { slug }) => {
      qc.setQueryData(articleKeys.bySlug(article.slug), article)
      if (article.slug !== slug) qc.removeQueries({ queryKey: articleKeys.bySlug(slug) })
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
      qc.removeQueries({ queryKey: articleKeys.bySlug(slug) })
      qc.invalidateQueries({ queryKey: articleKeys.lists() })
      qc.invalidateQueries({ queryKey: articleKeys.categoryCounts() })
    },
    meta: { errorMessage: "Suppression de l'article impossible." },
  })
}
