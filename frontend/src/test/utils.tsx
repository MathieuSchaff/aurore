import type {
  PreferencesTag,
  ProductCategory,
  ProductKind,
  ProductUnit,
  RessentiTag,
  RoutineTag,
  UserProductStatus,
} from '@aurore/shared'

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import {
  type RenderHookOptions,
  type RenderOptions,
  render,
  renderHook,
} from '@testing-library/react'
import type { ReactElement } from 'react'
import { Suspense } from 'react'
import { vi } from 'vitest'

import type { UserProduct } from '@/lib/queries/user-products'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient }
) {
  const queryClient = options?.queryClient ?? createTestQueryClient()
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={null}>{children}</Suspense>
      </QueryClientProvider>
    ),
    ...options,
  })
}

export function renderHookWithProviders<TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'> & { queryClient?: QueryClient }
) {
  const queryClient = options?.queryClient ?? createTestQueryClient()
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    ...options,
  })
}

// Routes `useQuery` results by `queryKey[0]`. Tests must `vi.mock('@tanstack/react-query', ...)`
// to expose `useQuery` as a vi.fn before calling this.
export function mockUseQueryByKey(map: Record<string, unknown>): void {
  vi.mocked(useQuery).mockImplementation((options: Parameters<typeof useQuery>[0]) => {
    const key = options.queryKey?.[0] as string
    return { data: map[key], isLoading: false } as unknown as ReturnType<typeof useQuery>
  })
}

export function makeUserProduct(overrides: Partial<UserProduct> = {}) {
  return {
    id: 'test-id-1',
    userId: 'test-user-1',
    productId: 'test-product-1',
    status: 'in_stock' as UserProductStatus,
    qty: 1,
    sentiment: null,
    wouldRepurchase: null,
    comment: null,
    ressenti: [] as RessentiTag[],
    routine: [] as RoutineTag[],
    preferences: [] as PreferencesTag[],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    product: {
      id: 'test-product-1',
      brand: 'CeraVe',
      name: 'CeraVe Hydrating Cleanser',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'test-user-1',
      kind: 'cleanser' as ProductKind,
      texture: null,
      unit: 'pump' as ProductUnit,
      inci: null,
      description: null,
      totalAmount: null,
      priceCents: 1299,
      productIngredients: [],
      productTagLinks: [],
      amountUnit: 'ml',
      slug: 'cerave-hydrating-cleanser',
      url: null,
      patents: [],
      category: 'skincare' as ProductCategory,
      imageUrl: null,
      notes: null,
      catalogQuality: 'verified' as 'unverified' | 'verified',
      verifiedBy: null,
      verifiedAt: null,
      moderationStatus: 'visible' as 'visible' | 'hidden',
      moderatedBy: null,
      moderatedAt: null,
      moderationReason: null,
    },
    review: {
      id: 'test-review-1',
      userProductId: 'test-id-1',
      tolerance: null,
      efficacy: null,
      sensoriality: null,
      stability: null,
      mixability: null,
      valueForMoney: null,
      comment: null,
      isPublic: false,
      ratingsPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    purchases: [],
    ...overrides,
  }
}
