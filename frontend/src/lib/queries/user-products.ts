import type {
  CreateUserProductInput,
  UpdateUserProductInput,
  UpdateUserProductReviewInput,
} from '@aurore/shared'

import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { type ApiData, api } from '../api'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'
import { collectionKeys } from './collection'
import { compatibilityKeys } from './compatibility'
import { applyOptimisticUpdates, optimisticCacheUpdate } from './optimistic'
import { invalidateProductReviewReads, productKeys } from './products'

export type UserProduct = ApiData<(typeof api)['user-products']['$get']>[number]

type IdMutation<T> = { id: string; input: T }

export type UpdateUserProductVariables = IdMutation<UpdateUserProductInput>

type UpsertUserProductReviewVariables = IdMutation<UpdateUserProductReviewInput>

type UserProductReview = NonNullable<UserProduct['review']>

function patchUserProductReview(
  userProduct: UserProduct,
  input: UpdateUserProductReviewInput
): UserProduct {
  return {
    ...userProduct,
    review: {
      ...userProduct.review,
      userProductId: userProduct.id,
      ...input,
    } as UserProductReview,
  }
}

// Separate root so history invalidates independently and doesn't collide with `user-products` routing.
const userProductHistoryRoot = ['user-product-history'] as const

export const userProductKeys = {
  all: ['user-products'] as const,
  lists: () => [...userProductKeys.all, 'list'] as const,
  list: () => [...userProductKeys.lists()] as const,
  historyRoot: () => userProductHistoryRoot,
  history: (id: string) => [...userProductHistoryRoot, id] as const,
}

function invalidateUserProductConsumers(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: userProductKeys.all })
  queryClient.invalidateQueries({ queryKey: productKeys.lists() })
  queryClient.invalidateQueries({ queryKey: productKeys.detailPages() })
  // Status, sentiment and review changes alter the empirical signal without
  // changing the product ID set carried by the compatibility query key
  queryClient.invalidateQueries({ queryKey: compatibilityKeys.all })
}

export const userProductQueries = {
  list: () =>
    queryOptions({
      queryKey: userProductKeys.list(),
      queryFn: async () => {
        const res = await api['user-products'].$get()
        return unwrapData(res)
      },
      // Personal catalogue rarely mutates; mutations already invalidate via userProductKeys.all.
      staleTime: 5 * 60 * 1000,
    }),
  history: (id: string) => ({
    queryKey: userProductKeys.history(id),
    queryFn: async () => {
      const res = await api['user-products'][':id'].history.$get({ param: { id } })
      return unwrapData(res)
    },
  }),
}

export const useCreateUserProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['user-products', 'create'],
    mutationFn: async (input: CreateUserProductInput) => {
      const res = await api['user-products'].$post({ json: input })
      return unwrapData(res)
    },
    onSuccess: () => {
      invalidateUserProductConsumers(queryClient)
      queryClient.invalidateQueries({ queryKey: userProductKeys.historyRoot() })
      queryClient.invalidateQueries({ queryKey: collectionKeys.formulaMotifs() })
    },
    // useQuickAdd / AddToCollectionModal drive their own toast.
  })
}

function useUserProductUpdateMutation(bulk: boolean) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: bulk
      ? (['user-products', 'update', 'bulk'] as const)
      : (['user-products', 'update'] as const),
    mutationFn: async ({ id, input }: UpdateUserProductVariables) => {
      const res = await api['user-products'][':id'].$patch({
        param: { id },
        json: input,
      })
      return unwrapData(res)
    },
    onMutate: (variables) => {
      return applyOptimisticUpdates(queryClient, variables, [
        optimisticCacheUpdate<UpdateUserProductVariables, UserProduct[]>({
          queryKey: userProductKeys.list(),
          updater: (oldProducts, { id, input }) => {
            if (!oldProducts) return oldProducts
            return oldProducts.map((product) =>
              product.id === id ? { ...product, ...input } : product
            )
          },
        }),
      ])
    },
    onError: (_error, _variables, context) => {
      context?.rollback()
    },
    onSettled: (_data, _error, { input }) => {
      invalidateUserProductConsumers(queryClient)
      queryClient.invalidateQueries({ queryKey: userProductKeys.historyRoot() })
      if (input.status !== undefined) {
        queryClient.invalidateQueries({ queryKey: collectionKeys.formulaMotifs() })
      }
    },
    ...(bulk ? {} : { meta: { errorMessage: 'Modification impossible — réessayez plus tard.' } }),
  })
}

export const useUpdateUserProduct = () => useUserProductUpdateMutation(false)

// Bulk failures use the app live region so this mutation deliberately has no toast message
export const useBulkUpdateUserProduct = () => useUserProductUpdateMutation(true)

export const useDeleteUserProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['user-products', 'delete'],
    mutationFn: async (id: string) => {
      const res = await api['user-products'][':id'].$delete({ param: { id } })
      await throwIfNotOk(res)
    },
    onSuccess: () => {
      invalidateUserProductConsumers(queryClient)
      queryClient.invalidateQueries({ queryKey: collectionKeys.formulaMotifs() })
    },
    meta: { errorMessage: 'Suppression impossible — réessayez plus tard.' },
  })
}

export const useUpsertUserProductReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['user-products', 'review', 'upsert'],
    mutationFn: async ({ id, input }: UpsertUserProductReviewVariables) => {
      const res = await api['user-products'][':id'].review.$put({
        param: { id },
        json: input,
      })
      return unwrapData(res)
    },
    onMutate: (variables) => {
      return applyOptimisticUpdates(queryClient, variables, [
        optimisticCacheUpdate<UpsertUserProductReviewVariables, UserProduct[]>({
          queryKey: userProductKeys.list(),
          updater: (oldProducts, { id, input }) => {
            if (!oldProducts) return oldProducts
            return oldProducts.map((product) =>
              product.id === id ? patchUserProductReview(product, input) : product
            )
          },
        }),
      ])
    },
    onError: (_error, _variables, context) => {
      context?.rollback()
    },
    onSettled: (review, _error, { input }) => {
      queryClient.invalidateQueries({ queryKey: userProductKeys.all })
      // A saved review (tolerance) shifts the signal but not the product-id set the
      // compatibility query is keyed on. Invalidate it explicitly.
      queryClient.invalidateQueries({ queryKey: compatibilityKeys.all })
      // The response carries effective visibility when a partial patch omits isPublic
      // Input visibility still covers retracting a public review
      if (
        review?.isPublic === true ||
        input.isPublic !== undefined ||
        input.ratingsPublic !== undefined
      ) {
        invalidateProductReviewReads(queryClient)
      }
    },
    meta: { errorMessage: 'Note non enregistrée — réessayez plus tard.' },
  })
}
