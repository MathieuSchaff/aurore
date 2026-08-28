import type {
  AddPurchaseInput,
  FinishPurchaseInput,
  OpenPurchaseInput,
  UpdatePurchaseInput,
} from '@aurore/shared'

import { type QueryClient, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'
import { userProductKeys } from './user-products'

const purchaseKeys = {
  all: ['purchases'] as const,
  byUserProduct: (userProductId: string) => [...purchaseKeys.all, userProductId] as const,
}

// Invalidate both the purchase list and the user-product list (qty/lifecycle changes).
function invalidateAfterPurchaseMutation(qc: QueryClient, userProductId: string) {
  qc.invalidateQueries({ queryKey: purchaseKeys.byUserProduct(userProductId) })
  qc.invalidateQueries({ queryKey: userProductKeys.all })
}

export const purchaseQueries = {
  byUserProduct: (userProductId: string) =>
    queryOptions({
      queryKey: purchaseKeys.byUserProduct(userProductId),
      queryFn: async () => {
        const res = await api['user-products'][':id'].purchases.$get({
          param: { id: userProductId },
        })
        return unwrapData(res)
      },
    }),
}

export const useAddPurchase = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['purchases', 'add'],
    mutationFn: async ({
      userProductId,
      input,
    }: {
      userProductId: string
      input: AddPurchaseInput
    }) => {
      const res = await api['user-products'][':id'].purchases.$post({
        param: { id: userProductId },
        json: input,
      })
      return unwrapData(res)
    },
    onSuccess: (_, { userProductId }) =>
      invalidateAfterPurchaseMutation(queryClient, userProductId),
  })
}

export const useOpenPurchase = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['purchases', 'open'],
    mutationFn: async ({
      userProductId,
      purchaseId,
      input,
    }: {
      userProductId: string
      purchaseId: string
      input: OpenPurchaseInput
    }) => {
      const res = await api['user-products'][':id'].purchases[':purchaseId'].open.$post({
        param: { id: userProductId, purchaseId },
        json: input,
      })
      return unwrapData(res)
    },
    onSuccess: (_, { userProductId }) =>
      invalidateAfterPurchaseMutation(queryClient, userProductId),
    meta: { errorMessage: "Impossible d'entamer le flacon." },
  })
}

export const useFinishPurchase = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['purchases', 'finish'],
    mutationFn: async ({
      userProductId,
      input,
    }: {
      userProductId: string
      input: FinishPurchaseInput
    }) => {
      const res = await api['user-products'][':id'].purchases.finish.$post({
        param: { id: userProductId },
        json: input,
      })
      return unwrapData(res)
    },
    onSuccess: (_, { userProductId }) =>
      invalidateAfterPurchaseMutation(queryClient, userProductId),
    meta: { errorMessage: 'Impossible de terminer le flacon.' },
  })
}

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['purchases', 'update'],
    mutationFn: async ({
      userProductId,
      purchaseId,
      input,
    }: {
      userProductId: string
      purchaseId: string
      input: UpdatePurchaseInput
    }) => {
      const res = await api['user-products'][':id'].purchases[':purchaseId'].$patch({
        param: { id: userProductId, purchaseId },
        json: input,
      })
      return unwrapData(res)
    },
    onSuccess: (_, { userProductId }) =>
      invalidateAfterPurchaseMutation(queryClient, userProductId),
    // AddPurchaseDialog owns its toast.
  })
}

export const useDeletePurchase = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['purchases', 'delete'],
    mutationFn: async ({
      userProductId,
      purchaseId,
    }: {
      userProductId: string
      purchaseId: string
    }) => {
      const res = await api['user-products'][':id'].purchases[':purchaseId'].$delete({
        param: { id: userProductId, purchaseId },
      })
      await throwIfNotOk(res)
    },
    onSuccess: (_, { userProductId }) =>
      invalidateAfterPurchaseMutation(queryClient, userProductId),
    meta: { errorMessage: 'Suppression de cet achat impossible.' },
  })
}
