import type {
  AdminUserAccount,
  CatalogQueueResponse,
  DiscussionThread,
  DiscussionThreadWithReplies,
  Ingredient,
  ListReportsResponse,
  ListSuggestedEditsResponse,
  ModerateContentResult,
  MySubmissionsResponse,
  ProductsPage,
  PublicProductReviewsResponse,
  PublicProfileReviewsResponse,
  ReportView,
  RoleRequestView,
  SuggestedEditView,
} from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import type { ApiData, api } from '@/lib/api'
import { ApiError } from '@/lib/helpers/apiError'
import { PRODUCT_DETAILS, PRODUCTS } from '@/test/msw/fixtures/products'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '@/test/utils'
import {
  adminQueries,
  useEscalateReport,
  useModerateContent,
  useResolveReport,
  useReviewRoleRequest,
  useReviewSuggestedEdit,
  useVerifyCatalogItem,
} from '../admin'
import { catalogSubmissionQueries } from '../catalog-submissions'
import { discussionQueries } from '../discussions'
import { ingredientQueries } from '../ingredients'
import { productQueries } from '../products'
import { profileQueries } from '../profile'

const PRODUCT = PRODUCT_DETAILS[0]
const PRODUCT_LIST = {
  items: [PRODUCTS[0]],
  total: 1,
  page: 1,
  limit: 20,
  hiddenCount: 0,
  excludedLabels: [],
  requiredLabels: [],
  rulesApplied: false,
} satisfies ProductsPage

type IngredientListResponse = ApiData<(typeof api.ingredients)['$get']>

const INGREDIENT_LIST = {
  items: [],
  total: 0,
} satisfies IngredientListResponse

const INGREDIENT = {
  id: '77777777-7777-4777-8777-777777777777',
  createdBy: '55555555-5555-4555-8555-555555555555',
  name: 'Niacinamide',
  slug: 'niacinamide',
  description: 'Old description',
  content: '',
  type: 'skincare',
  category: 'actif',
  createdAt: '2026-08-20T10:00:00.000Z',
  updatedAt: '2026-08-20T10:00:00.000Z',
} satisfies Ingredient

const REPORT = {
  id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  reporterId: '55555555-5555-4555-8555-555555555555',
  targetType: 'review',
  targetId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  reason: 'Spam',
  status: 'open',
  reviewedBy: null,
  reviewedAt: null,
  escalatedAt: null,
  escalatedBy: null,
  createdAt: '2026-08-20T10:00:00.000Z',
} satisfies ReportView

function hiddenContentResult(id: string): ModerateContentResult {
  return {
    success: true,
    data: { id, moderationStatus: 'hidden', moderationReason: null },
  }
}

function productListHandler(recordRead: () => void) {
  return http.get('*/api/products', () => {
    recordRead()
    return HttpResponse.json({ success: true, data: PRODUCT_LIST })
  })
}

function ingredientListHandler(recordRead: () => void) {
  return http.get('*/api/ingredients', () => {
    recordRead()
    return HttpResponse.json({ success: true, data: INGREDIENT_LIST })
  })
}

describe('admin catalog convergence', () => {
  it('refetches active product detail and list after accepting its suggested edit', async () => {
    let productDetailReads = 0
    let productListReads = 0
    const reviewedEdit = {
      id: '44444444-4444-4444-8444-444444444444',
      proposerId: '55555555-5555-4555-8555-555555555555',
      targetType: 'product',
      targetId: PRODUCT.id,
      field: 'name',
      proposedValue: 'New product name',
      status: 'accepted',
      reviewedBy: '66666666-6666-4666-8666-666666666666',
      reviewedAt: '2026-08-20T12:00:00.000Z',
      createdAt: '2026-08-20T11:00:00.000Z',
    } satisfies SuggestedEditView

    server.use(
      productListHandler(() => {
        productListReads += 1
      }),
      http.get('*/api/products/:slug', () => {
        productDetailReads += 1
        return HttpResponse.json({ success: true, data: PRODUCT })
      }),
      http.patch('*/api/admin/suggested-edits/:id', () =>
        HttpResponse.json({ success: true, data: reviewedEdit })
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        product: useQuery(productQueries.bySlug(PRODUCT.slug)),
        productList: useQuery(productQueries.list({}, null)),
        review: useReviewSuggestedEdit(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.product.isSuccess).toBe(true)
      expect(result.current.productList.isSuccess).toBe(true)
    })
    expect(productDetailReads).toBe(1)
    expect(productListReads).toBe(1)

    // The review endpoint writes the sheet directly so its cache needs invalidation
    await act(() =>
      result.current.review.mutateAsync({
        id: reviewedEdit.id,
        body: { status: 'accepted' },
      })
    )

    await waitFor(() => {
      expect(productDetailReads).toBe(2)
      expect(productListReads).toBe(2)
    })
  })

  it('refetches active ingredient detail and list after accepting its suggested edit', async () => {
    let ingredientDetailReads = 0
    let ingredientListReads = 0
    const reviewedEdit = {
      id: '88888888-8888-4888-8888-888888888888',
      proposerId: '55555555-5555-4555-8555-555555555555',
      targetType: 'ingredient',
      targetId: INGREDIENT.id,
      field: 'description',
      proposedValue: 'New description',
      status: 'accepted',
      reviewedBy: '66666666-6666-4666-8666-666666666666',
      reviewedAt: '2026-08-20T12:00:00.000Z',
      createdAt: '2026-08-20T11:00:00.000Z',
    } satisfies SuggestedEditView

    server.use(
      ingredientListHandler(() => {
        ingredientListReads += 1
      }),
      http.get('*/api/ingredients/:slug', () => {
        ingredientDetailReads += 1
        return HttpResponse.json({ success: true, data: INGREDIENT })
      }),
      http.patch('*/api/admin/suggested-edits/:id', () =>
        HttpResponse.json({ success: true, data: reviewedEdit })
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        ingredient: useQuery(ingredientQueries.bySlug(INGREDIENT.slug)),
        ingredientList: useQuery(ingredientQueries.list()),
        review: useReviewSuggestedEdit(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.ingredient.isSuccess).toBe(true)
      expect(result.current.ingredientList.isSuccess).toBe(true)
    })
    expect(ingredientDetailReads).toBe(1)
    expect(ingredientListReads).toBe(1)

    await act(() =>
      result.current.review.mutateAsync({
        id: reviewedEdit.id,
        body: { status: 'accepted' },
      })
    )

    await waitFor(() => {
      expect(ingredientDetailReads).toBe(2)
      expect(ingredientListReads).toBe(2)
    })
  })

  it('refetches active admin and owner queues after accepting a suggested edit', async () => {
    let catalogQueueReads = 0
    let submissionReads = 0
    const reviewedEdit = {
      id: '99999999-9999-4999-8999-999999999999',
      proposerId: '55555555-5555-4555-8555-555555555555',
      targetType: 'product',
      targetId: PRODUCT.id,
      field: 'brand',
      proposedValue: 'New brand',
      status: 'accepted',
      reviewedBy: '66666666-6666-4666-8666-666666666666',
      reviewedAt: '2026-08-20T12:00:00.000Z',
      createdAt: '2026-08-20T11:00:00.000Z',
    } satisfies SuggestedEditView
    const catalogQueue = { items: [] } satisfies CatalogQueueResponse
    const submissions = { items: [] } satisfies MySubmissionsResponse

    server.use(
      http.get('*/api/admin/moderation/catalog', () => {
        catalogQueueReads += 1
        return HttpResponse.json({ success: true, data: catalogQueue })
      }),
      http.get('*/api/me/submissions', () => {
        submissionReads += 1
        return HttpResponse.json({ success: true, data: submissions })
      }),
      http.patch('*/api/admin/suggested-edits/:id', () =>
        HttpResponse.json({ success: true, data: reviewedEdit })
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        queue: useQuery(adminQueries.catalogQueue('product')),
        submissions: useQuery(catalogSubmissionQueries.mine()),
        review: useReviewSuggestedEdit(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.queue.isSuccess).toBe(true)
      expect(result.current.submissions.isSuccess).toBe(true)
    })
    expect(catalogQueueReads).toBe(1)
    expect(submissionReads).toBe(1)

    await act(() =>
      result.current.review.mutateAsync({
        id: reviewedEdit.id,
        body: { status: 'accepted' },
      })
    )

    await waitFor(() => {
      expect(catalogQueueReads).toBe(2)
      expect(submissionReads).toBe(2)
    })
  })

  it('leaves product, catalog and submission reads fresh after rejecting a suggested edit', async () => {
    const reads = { product: 0, productList: 0, catalogQueue: 0, submissions: 0 }
    const reviewedEdit = {
      id: '12121212-1212-4212-8212-121212121212',
      proposerId: '55555555-5555-4555-8555-555555555555',
      targetType: 'product',
      targetId: PRODUCT.id,
      field: 'name',
      proposedValue: 'Rejected product name',
      status: 'rejected',
      reviewedBy: '66666666-6666-4666-8666-666666666666',
      reviewedAt: '2026-08-20T12:00:00.000Z',
      createdAt: '2026-08-20T11:00:00.000Z',
    } satisfies SuggestedEditView
    const catalogQueue = { items: [] } satisfies CatalogQueueResponse
    const submissions = { items: [] } satisfies MySubmissionsResponse

    server.use(
      productListHandler(() => {
        reads.productList += 1
      }),
      http.get('*/api/products/:slug', () => {
        reads.product += 1
        return HttpResponse.json({ success: true, data: PRODUCT })
      }),
      http.get('*/api/admin/moderation/catalog', () => {
        reads.catalogQueue += 1
        return HttpResponse.json({ success: true, data: catalogQueue })
      }),
      http.get('*/api/me/submissions', () => {
        reads.submissions += 1
        return HttpResponse.json({ success: true, data: submissions })
      }),
      http.patch('*/api/admin/suggested-edits/:id', () =>
        HttpResponse.json({ success: true, data: reviewedEdit })
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        product: useQuery(productQueries.bySlug(PRODUCT.slug)),
        productList: useQuery(productQueries.list({}, null)),
        queue: useQuery(adminQueries.catalogQueue('product')),
        submissions: useQuery(catalogSubmissionQueries.mine()),
        review: useReviewSuggestedEdit(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.product.isSuccess).toBe(true)
      expect(result.current.productList.isSuccess).toBe(true)
      expect(result.current.queue.isSuccess).toBe(true)
      expect(result.current.submissions.isSuccess).toBe(true)
    })
    expect(reads).toEqual({ product: 1, productList: 1, catalogQueue: 1, submissions: 1 })

    await act(() =>
      result.current.review.mutateAsync({
        id: reviewedEdit.id,
        body: { status: 'rejected' },
      })
    )

    await waitFor(() => expect(queryClient.isFetching()).toBe(0))
    expect(reads).toEqual({ product: 1, productList: 1, catalogQueue: 1, submissions: 1 })
  })

  it('refetches every active suggested edit status after a decision', async () => {
    const reads = { pending: 0, accepted: 0 }
    const reviewedEdit = {
      id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
      proposerId: '55555555-5555-4555-8555-555555555555',
      targetType: 'product',
      targetId: PRODUCT.id,
      field: 'name',
      proposedValue: 'New product name',
      status: 'accepted',
      reviewedBy: '66666666-6666-4666-8666-666666666666',
      reviewedAt: '2026-08-20T12:00:00.000Z',
      createdAt: '2026-08-20T11:00:00.000Z',
    } satisfies SuggestedEditView
    const empty = { items: [] } satisfies ListSuggestedEditsResponse

    server.use(
      http.get('*/api/admin/suggested-edits', ({ request }) => {
        const status = new URL(request.url).searchParams.get('status')
        if (status === 'pending' || status === 'accepted') reads[status] += 1
        return HttpResponse.json({ success: true, data: empty })
      }),
      http.patch('*/api/admin/suggested-edits/:id', () =>
        HttpResponse.json({ success: true, data: reviewedEdit })
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        pending: useQuery(adminQueries.suggestedEdits('pending')),
        accepted: useQuery(adminQueries.suggestedEdits('accepted')),
        review: useReviewSuggestedEdit(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.pending.isSuccess).toBe(true)
      expect(result.current.accepted.isSuccess).toBe(true)
    })
    expect(reads).toEqual({ pending: 1, accepted: 1 })

    await act(() =>
      result.current.review.mutateAsync({
        id: reviewedEdit.id,
        body: { status: 'accepted' },
      })
    )

    await waitFor(() => expect(reads).toEqual({ pending: 2, accepted: 2 }))
  })

  it('refetches active product detail and list after moderating the product', async () => {
    let productDetailReads = 0
    let productListReads = 0
    server.use(
      productListHandler(() => {
        productListReads += 1
      }),
      http.get('*/api/products/:slug', () => {
        productDetailReads += 1
        return HttpResponse.json({ success: true, data: PRODUCT })
      }),
      http.patch('*/api/admin/moderation/products/:id', () =>
        HttpResponse.json(hiddenContentResult(PRODUCT.id))
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        product: useQuery(productQueries.bySlug(PRODUCT.slug)),
        productList: useQuery(productQueries.list({}, null)),
        moderation: useModerateContent(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.product.isSuccess).toBe(true)
      expect(result.current.productList.isSuccess).toBe(true)
    })
    expect(productDetailReads).toBe(1)
    expect(productListReads).toBe(1)

    await act(() =>
      result.current.moderation.mutateAsync({
        target: 'products',
        id: PRODUCT.id,
        body: { status: 'hidden' },
      })
    )

    await waitFor(() => {
      expect(productDetailReads).toBe(2)
      expect(productListReads).toBe(2)
    })
  })

  it('refetches active ingredient detail and list after moderating the ingredient', async () => {
    let ingredientDetailReads = 0
    let ingredientListReads = 0
    server.use(
      ingredientListHandler(() => {
        ingredientListReads += 1
      }),
      http.get('*/api/ingredients/:slug', () => {
        ingredientDetailReads += 1
        return HttpResponse.json({ success: true, data: INGREDIENT })
      }),
      http.patch('*/api/admin/moderation/ingredients/:id', () =>
        HttpResponse.json(hiddenContentResult(INGREDIENT.id))
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        ingredient: useQuery(ingredientQueries.bySlug(INGREDIENT.slug)),
        ingredientList: useQuery(ingredientQueries.list()),
        moderation: useModerateContent(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.ingredient.isSuccess).toBe(true)
      expect(result.current.ingredientList.isSuccess).toBe(true)
    })
    expect(ingredientDetailReads).toBe(1)
    expect(ingredientListReads).toBe(1)

    await act(() =>
      result.current.moderation.mutateAsync({
        target: 'ingredients',
        id: INGREDIENT.id,
        body: { status: 'hidden' },
      })
    )

    await waitFor(() => {
      expect(ingredientDetailReads).toBe(2)
      expect(ingredientListReads).toBe(2)
    })
  })

  it('refetches active product detail and list after verifying the product', async () => {
    let productDetailReads = 0
    let productListReads = 0
    server.use(
      productListHandler(() => {
        productListReads += 1
      }),
      http.get('*/api/products/:slug', () => {
        productDetailReads += 1
        return HttpResponse.json({ success: true, data: PRODUCT })
      }),
      http.patch('*/api/products/:id/quality', () =>
        HttpResponse.json({ success: true, data: PRODUCT })
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        product: useQuery(productQueries.bySlug(PRODUCT.slug)),
        productList: useQuery(productQueries.list({}, null)),
        verification: useVerifyCatalogItem(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.product.isSuccess).toBe(true)
      expect(result.current.productList.isSuccess).toBe(true)
    })
    expect(productDetailReads).toBe(1)
    expect(productListReads).toBe(1)

    await act(() => result.current.verification.mutateAsync({ kind: 'product', id: PRODUCT.id }))

    await waitFor(() => {
      expect(productDetailReads).toBe(2)
      expect(productListReads).toBe(2)
    })
  })

  it('refetches active ingredient detail and list after verifying the ingredient', async () => {
    let ingredientDetailReads = 0
    let ingredientListReads = 0
    server.use(
      ingredientListHandler(() => {
        ingredientListReads += 1
      }),
      http.get('*/api/ingredients/:slug', () => {
        ingredientDetailReads += 1
        return HttpResponse.json({ success: true, data: INGREDIENT })
      }),
      http.patch('*/api/ingredients/:id/quality', () =>
        HttpResponse.json({ success: true, data: INGREDIENT })
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        ingredient: useQuery(ingredientQueries.bySlug(INGREDIENT.slug)),
        ingredientList: useQuery(ingredientQueries.list()),
        verification: useVerifyCatalogItem(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.ingredient.isSuccess).toBe(true)
      expect(result.current.ingredientList.isSuccess).toBe(true)
    })
    expect(ingredientDetailReads).toBe(1)
    expect(ingredientListReads).toBe(1)

    await act(() =>
      result.current.verification.mutateAsync({ kind: 'ingredient', id: INGREDIENT.id })
    )

    await waitFor(() => {
      expect(ingredientDetailReads).toBe(2)
      expect(ingredientListReads).toBe(2)
    })
  })

  it('preserves the API error contract when catalog moderation fails', async () => {
    server.use(
      http.patch('*/api/admin/moderation/products/:id', () =>
        HttpResponse.json({ success: false, error: 'invalid_input' }, { status: 400 })
      )
    )
    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(() => useModerateContent(), { queryClient })

    await act(async () => {
      await expect(
        result.current.mutateAsync({
          target: 'products',
          id: PRODUCT.id,
          body: { status: 'hidden' },
        })
      ).rejects.toMatchObject({ code: 'invalid_input', status: 400 })
    })

    await waitFor(() => expect(result.current.error).toBeInstanceOf(ApiError))
  })

  it('preserves the API error contract when catalog verification fails', async () => {
    server.use(
      http.patch('*/api/products/:id/quality', () =>
        HttpResponse.json({ success: false, error: 'not_found' }, { status: 404 })
      )
    )
    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(() => useVerifyCatalogItem(), { queryClient })

    await act(async () => {
      await expect(
        result.current.mutateAsync({ kind: 'product', id: PRODUCT.id })
      ).rejects.toMatchObject({ code: 'not_found', status: 404 })
    })

    await waitFor(() => expect(result.current.error).toBeInstanceOf(ApiError))
  })

  it.each([
    ['resolve', useResolveReport, '*/api/admin/reports/:id'],
    ['escalate', useEscalateReport, '*/api/admin/reports/:id/escalate'],
  ] as const)(
    'refetches every active report view after %s',
    async (action, useAction, endpoint) => {
      const reads = { open: 0, escalated: 0 }
      const reports = { items: [REPORT] } satisfies ListReportsResponse
      server.use(
        http.get('*/api/admin/reports', ({ request }) => {
          const search = new URL(request.url).searchParams
          if (search.get('escalated') === 'true') reads.escalated += 1
          else if (search.get('status') === 'open') reads.open += 1
          return HttpResponse.json({ success: true, data: reports })
        }),
        http.patch(endpoint, () => HttpResponse.json({ success: true, data: REPORT }))
      )
      const queryClient = createTestQueryClient()
      const { result } = renderHookWithProviders(
        () => ({
          open: useQuery(adminQueries.reports('open')),
          escalated: useQuery(adminQueries.reports(undefined, true)),
          action: useAction(),
        }),
        { queryClient }
      )

      await waitFor(() => expect(reads).toEqual({ open: 1, escalated: 1 }))
      await act(async () => {
        if (action === 'resolve') {
          await (result.current.action as ReturnType<typeof useResolveReport>).mutateAsync({
            id: REPORT.id,
            body: { status: 'resolved' },
          })
        } else {
          await (result.current.action as ReturnType<typeof useEscalateReport>).mutateAsync(
            REPORT.id
          )
        }
      })

      await waitFor(() => expect(reads).toEqual({ open: 2, escalated: 2 }))
    }
  )

  it('preserves the API error contract for report decisions', async () => {
    server.use(
      http.patch('*/api/admin/reports/:id', () =>
        HttpResponse.json({ success: false, error: 'forbidden' }, { status: 403 })
      ),
      http.patch('*/api/admin/reports/:id/escalate', () =>
        HttpResponse.json({ success: false, error: 'not_found' }, { status: 404 })
      )
    )
    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({ resolve: useResolveReport(), escalate: useEscalateReport() }),
      { queryClient }
    )

    await act(async () => {
      await expect(
        result.current.resolve.mutateAsync({ id: REPORT.id, body: { status: 'resolved' } })
      ).rejects.toMatchObject({ code: 'forbidden', status: 403 })
      await expect(result.current.escalate.mutateAsync(REPORT.id)).rejects.toMatchObject({
        code: 'not_found',
        status: 404,
      })
    })

    await waitFor(() => {
      expect(result.current.resolve.error).toBeInstanceOf(ApiError)
      expect(result.current.escalate.error).toBeInstanceOf(ApiError)
    })
  })

  it('refetches active product reviews after moderating a review', async () => {
    let reviewReads = 0
    const reviews = { reviews: [] } satisfies PublicProductReviewsResponse
    server.use(
      http.get('*/api/products/:slug/reviews/public', () => {
        reviewReads += 1
        return HttpResponse.json({ success: true, data: reviews })
      }),
      http.patch('*/api/admin/moderation/reviews/:id', () =>
        HttpResponse.json(hiddenContentResult('review-1'))
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        reviews: useQuery(productQueries.publicReviews(PRODUCT.slug)),
        moderation: useModerateContent(),
      }),
      { queryClient }
    )

    await waitFor(() => expect(result.current.reviews.isSuccess).toBe(true))
    expect(reviewReads).toBe(1)

    await act(() =>
      result.current.moderation.mutateAsync({
        target: 'reviews',
        id: 'review-1',
        body: { status: 'hidden' },
      })
    )

    await waitFor(() => expect(reviewReads).toBe(2))
  })

  it('refetches active profile reviews after moderating a review', async () => {
    let reviewReads = 0
    const reviews = { reviews: [] } satisfies PublicProfileReviewsResponse
    server.use(
      http.get('*/api/profiles/:username/reviews', () => {
        reviewReads += 1
        return HttpResponse.json({ success: true, data: reviews })
      }),
      http.patch('*/api/admin/moderation/reviews/:id', () =>
        HttpResponse.json(hiddenContentResult('review-1'))
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        reviews: useQuery(profileQueries.reviewsByUsername('alice')),
        moderation: useModerateContent(),
      }),
      { queryClient }
    )

    await waitFor(() => expect(result.current.reviews.isSuccess).toBe(true))
    expect(reviewReads).toBe(1)

    await act(() =>
      result.current.moderation.mutateAsync({
        target: 'reviews',
        id: 'review-1',
        body: { status: 'hidden' },
      })
    )

    await waitFor(() => expect(reviewReads).toBe(2))
  })

  it('refetches active discussion lists after moderating a thread', async () => {
    let discussionReads = 0
    const threads = [] satisfies DiscussionThread[]
    server.use(
      http.get('*/api/products/:slug/discussions', () => {
        discussionReads += 1
        return HttpResponse.json({ success: true, data: threads })
      }),
      http.patch('*/api/admin/moderation/threads/:id', () =>
        HttpResponse.json(hiddenContentResult('thread-1'))
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        threads: useQuery(discussionQueries.threads('product', PRODUCT.slug)),
        moderation: useModerateContent(),
      }),
      { queryClient }
    )

    await waitFor(() => expect(result.current.threads.isSuccess).toBe(true))
    expect(discussionReads).toBe(1)

    await act(() =>
      result.current.moderation.mutateAsync({
        target: 'threads',
        id: 'thread-1',
        body: { status: 'hidden' },
      })
    )

    await waitFor(() => expect(discussionReads).toBe(2))
  })

  it('refetches an active discussion detail after moderating a reply', async () => {
    let discussionReads = 0
    const thread = {
      id: 'thread-1',
      productId: PRODUCT.id,
      ingredientId: null,
      authorId: 'author-1',
      authorName: 'Alice',
      title: 'Question',
      content: 'Initial content',
      replyCount: 1,
      createdAt: '2026-08-20T10:00:00.000Z',
      replies: [],
    } satisfies DiscussionThreadWithReplies
    server.use(
      http.get('*/api/products/:slug/discussions/:threadId', () => {
        discussionReads += 1
        return HttpResponse.json({ success: true, data: thread })
      }),
      http.patch('*/api/admin/moderation/replies/:id', () =>
        HttpResponse.json(hiddenContentResult('reply-1'))
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        thread: useQuery(discussionQueries.thread('product', PRODUCT.slug, thread.id)),
        moderation: useModerateContent(),
      }),
      { queryClient }
    )

    await waitFor(() => expect(result.current.thread.isSuccess).toBe(true))
    expect(discussionReads).toBe(1)

    await act(() =>
      result.current.moderation.mutateAsync({
        target: 'replies',
        id: 'reply-1',
        body: { status: 'hidden' },
      })
    )

    await waitFor(() => expect(discussionReads).toBe(2))
  })

  it('refetches active user list and detail after approving a role request', async () => {
    let userListReads = 0
    let userDetailReads = 0
    const user = {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      email: 'candidate@example.com',
      role: 'user',
      emailVerifiedAt: '2026-08-20T09:00:00.000Z',
      createdAt: '2026-08-19T09:00:00.000Z',
      forcedPrivateByAdmin: false,
    } satisfies AdminUserAccount
    const request = {
      id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      userId: user.id,
      motivation: 'I can help review the catalogue.',
      motivationLink: null,
      status: 'approved',
      rejectionReason: null,
      reviewedBy: '66666666-6666-4666-8666-666666666666',
      reviewedAt: '2026-08-20T12:00:00.000Z',
      createdAt: '2026-08-20T10:00:00.000Z',
      updatedAt: '2026-08-20T12:00:00.000Z',
    } satisfies RoleRequestView

    server.use(
      http.get('*/api/admin/users', () => {
        userListReads += 1
        return HttpResponse.json({ success: true, data: { items: [user] } })
      }),
      http.get('*/api/admin/users/:id', () => {
        userDetailReads += 1
        return HttpResponse.json({ success: true, data: user })
      }),
      http.patch('*/api/admin/role-requests/:id', () =>
        HttpResponse.json({ success: true, data: request })
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        users: useQuery(adminQueries.users()),
        user: useQuery(adminQueries.user(user.id)),
        review: useReviewRoleRequest(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.users.isSuccess).toBe(true)
      expect(result.current.user.isSuccess).toBe(true)
    })
    expect(userListReads).toBe(1)
    expect(userDetailReads).toBe(1)

    await act(() =>
      result.current.review.mutateAsync({
        id: request.id,
        body: { decision: 'approve' },
      })
    )

    await waitFor(() => {
      expect(userListReads).toBe(2)
      expect(userDetailReads).toBe(2)
    })
  })

  it('leaves active user list and detail fresh after rejecting a role request', async () => {
    let userListReads = 0
    let userDetailReads = 0
    const user = {
      id: '13131313-1313-4313-8313-131313131313',
      email: 'rejected-candidate@example.com',
      role: 'user',
      emailVerifiedAt: '2026-08-20T09:00:00.000Z',
      createdAt: '2026-08-19T09:00:00.000Z',
      forcedPrivateByAdmin: false,
    } satisfies AdminUserAccount
    const request = {
      id: '14141414-1414-4414-8414-141414141414',
      userId: user.id,
      motivation: 'I can help review the catalogue.',
      motivationLink: null,
      status: 'rejected',
      rejectionReason: 'Insufficient',
      reviewedBy: '66666666-6666-4666-8666-666666666666',
      reviewedAt: '2026-08-20T12:00:00.000Z',
      createdAt: '2026-08-20T10:00:00.000Z',
      updatedAt: '2026-08-20T12:00:00.000Z',
    } satisfies RoleRequestView

    server.use(
      http.get('*/api/admin/users', () => {
        userListReads += 1
        return HttpResponse.json({ success: true, data: { items: [user] } })
      }),
      http.get('*/api/admin/users/:id', () => {
        userDetailReads += 1
        return HttpResponse.json({ success: true, data: user })
      }),
      http.patch('*/api/admin/role-requests/:id', () =>
        HttpResponse.json({ success: true, data: request })
      )
    )

    const queryClient = createTestQueryClient()
    const { result } = renderHookWithProviders(
      () => ({
        users: useQuery(adminQueries.users()),
        user: useQuery(adminQueries.user(user.id)),
        review: useReviewRoleRequest(),
      }),
      { queryClient }
    )

    await waitFor(() => {
      expect(result.current.users.isSuccess).toBe(true)
      expect(result.current.user.isSuccess).toBe(true)
    })
    expect(userListReads).toBe(1)
    expect(userDetailReads).toBe(1)

    await act(() =>
      result.current.review.mutateAsync({
        id: request.id,
        body: { decision: 'reject', reason: request.rejectionReason },
      })
    )

    await waitFor(() => expect(queryClient.isFetching()).toBe(0))
    expect(userListReads).toBe(1)
    expect(userDetailReads).toBe(1)
  })
})
