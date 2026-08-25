import type {
  ProfileUpdateInput,
  UpdatePrivacySettingsInput,
  UpsertIngredientPreferenceInput,
  UpsertTagPreferenceInput,
  UserDermoProfileUpdateInput,
} from '@aurore/shared'

import { type QueryClient, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { productKeys } from '@/lib/queries/products'
import { api } from '../api'
import { endSession } from '../auth/session'
import { throwIfNotOk, unwrapData } from '../helpers/apiError'
import { downloadBlobAsFile, parseAttachmentFilename } from '../helpers/download'
import { collectionKeys } from './collection'
import { invalidateSocialReads } from './social-keys'

export const profileKeys = {
  all: ['profile'] as const,
  me: () => [...profileKeys.all, 'me'] as const,
  stats: () => [...profileKeys.all, 'stats'] as const,
  dermo: () => [...profileKeys.all, 'dermo'] as const,
  publicProfiles: () => [...profileKeys.all, 'public'] as const,
  publicByUsername: (username: string) => [...profileKeys.publicProfiles(), username] as const,
  reviews: () => [...profileKeys.all, 'reviews'] as const,
  reviewsByUsername: (username: string) => [...profileKeys.reviews(), username] as const,
  posts: () => [...profileKeys.all, 'posts'] as const,
  postsByUsername: (username: string) => [...profileKeys.posts(), username] as const,
  preferenceTargets: () => [...profileKeys.all, 'preference-targets'] as const,
  privacy: () => [...profileKeys.all, 'privacy'] as const,
}

export function invalidateProfileReviewReads(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: profileKeys.reviews() })
}

export function invalidatePublicProfileReads(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: profileKeys.publicProfiles() }),
    queryClient.invalidateQueries({ queryKey: profileKeys.reviews() }),
    queryClient.invalidateQueries({ queryKey: profileKeys.posts() }),
  ])
}

function invalidateProfileDependentReads(queryClient: QueryClient) {
  invalidatePublicProfileReads(queryClient)
  invalidateSocialReads(queryClient)
}

export const profileQueries = {
  me: () =>
    queryOptions({
      queryKey: profileKeys.me(),
      queryFn: async () => {
        const res = await api.profile.$get()
        return unwrapData(res)
      },
      staleTime: 1000 * 60 * 5,
    }),
  stats: () =>
    queryOptions({
      queryKey: profileKeys.stats(),
      queryFn: async () => {
        const res = await api.profile.stats.$get()
        return unwrapData(res)
      },
      staleTime: 1000 * 60 * 5,
    }),
  dermo: () =>
    queryOptions({
      queryKey: profileKeys.dermo(),
      queryFn: async () => {
        const res = await api.profile.dermo.$get()
        return unwrapData(res)
      },
      staleTime: 1000 * 60 * 5,
    }),
  publicByUsername: (username: string) =>
    queryOptions({
      queryKey: profileKeys.publicByUsername(username),
      queryFn: async () => {
        const res = await api.profiles[':username'].public.$get({ param: { username } })
        return unwrapData(res)
      },
      staleTime: 1000 * 60,
      enabled: !!username,
    }),
  reviewsByUsername: (username: string) =>
    queryOptions({
      queryKey: profileKeys.reviewsByUsername(username),
      queryFn: async () => {
        const res = await api.profiles[':username'].reviews.$get({ param: { username } })
        return unwrapData(res)
      },
      staleTime: 1000 * 60,
      enabled: !!username,
    }),
  postsByUsername: (username: string) =>
    queryOptions({
      queryKey: profileKeys.postsByUsername(username),
      queryFn: async () => {
        const res = await api.profiles[':username'].posts.$get({ param: { username } })
        return unwrapData(res)
      },
      staleTime: 1000 * 60,
      enabled: !!username,
    }),
}

export const preferenceTargetQueries = {
  // Callers gate with `enabled: !!user`: anonymous visitors must not fire it
  list: () =>
    queryOptions({
      queryKey: profileKeys.preferenceTargets(),
      queryFn: async () => {
        const res = await api.profile['preference-targets'].$get()
        return unwrapData(res)
      },
      staleTime: 1000 * 60 * 5,
    }),
}

// Preference mutations invalidate product reads because declared rules reshape server results
function invalidatePreferenceReads(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: profileKeys.preferenceTargets() })
  queryClient.invalidateQueries({ queryKey: productKeys.lists() })
  queryClient.invalidateQueries({ queryKey: productKeys.detailPages() })
}

export const useUpsertIngredientPreference = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['profile', 'ingredient-preferences', 'upsert'],
    mutationFn: async (data: UpsertIngredientPreferenceInput) => {
      const res = await api.profile['ingredient-preferences'].$put({ json: data })
      return unwrapData(res)
    },
    onSuccess: () => invalidatePreferenceReads(queryClient),
    meta: { errorMessage: 'Enregistrement du repère impossible.' },
  })
}

export const useDeleteIngredientPreference = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['profile', 'ingredient-preferences', 'delete'],
    mutationFn: async (canonicalKey: string) => {
      const res = await api.profile['ingredient-preferences'].$delete({
        query: { key: canonicalKey },
      })
      await throwIfNotOk(res)
    },
    onSuccess: () => invalidatePreferenceReads(queryClient),
    meta: { errorMessage: 'Retrait du repère impossible.' },
  })
}

export const useUpsertTagPreference = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['profile', 'tag-preferences', 'upsert'],
    mutationFn: async (data: UpsertTagPreferenceInput) => {
      const res = await api.profile['tag-preferences'].$put({ json: data })
      return unwrapData(res)
    },
    onSuccess: () => invalidatePreferenceReads(queryClient),
    meta: { errorMessage: 'Enregistrement du repère impossible.' },
  })
}

export const useDeleteTagPreference = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['profile', 'tag-preferences', 'delete'],
    mutationFn: async (tagId: string) => {
      const res = await api.profile['tag-preferences'][':tagId'].$delete({ param: { tagId } })
      await throwIfNotOk(res)
    },
    onSuccess: () => invalidatePreferenceReads(queryClient),
    meta: { errorMessage: 'Retrait du repère impossible.' },
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['profile', 'update'],
    mutationFn: async (data: ProfileUpdateInput) => {
      const res = await api.profile.$patch({ json: data })
      return unwrapData(res)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.me(), data)
      invalidateProfileDependentReads(queryClient)
    },
    meta: { errorMessage: 'Mise à jour du profil impossible.' },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['profile', 'account', 'delete'],
    mutationFn: async () => {
      const res = await api.profile.deleteUser.$delete()
      await throwIfNotOk(res)
    },
    onSuccess: () => {
      endSession(queryClient, 'account-deleted')
    },
    meta: { errorMessage: 'Suppression du compte impossible.' },
  })
}

export const useUpdateDermoProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['profile', 'dermo', 'update'],
    mutationFn: async (data: UserDermoProfileUpdateInput) => {
      const res = await api.profile.dermo.$patch({ json: data })
      return unwrapData(res)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.dermo(), data)
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detailPages() })
      queryClient.invalidateQueries({ queryKey: collectionKeys.formulaMotifs() })
      invalidateProfileDependentReads(queryClient)
    },
    meta: { errorMessage: 'Mise à jour du profil dermo impossible.' },
  })
}

export const privacySettingsQueries = {
  get: () =>
    queryOptions({
      queryKey: profileKeys.privacy(),
      queryFn: async () => {
        const res = await api.profile['privacy-settings'].$get()
        return unwrapData(res)
      },
      staleTime: 1000 * 60 * 5,
    }),
}

const PRIVACY_UPDATE_KEY = ['profile', 'privacy', 'update']

export const useUpdatePrivacySettings = () => {
  const queryClient = useQueryClient()
  const key = privacySettingsQueries.get().queryKey

  return useMutation({
    mutationKey: PRIVACY_UPDATE_KEY,
    mutationFn: async (data: UpdatePrivacySettingsInput) => {
      const res = await api.profile['privacy-settings'].$patch({ json: data })
      return unwrapData(res)
    },
    // Optimistic: a privacy toggle must feel instant. Snapshot for rollback, merge the changed flag.
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData(key)
      queryClient.setQueryData(key, (old) => (old ? ({ ...old, ...data } as typeof old) : old))
      return { previous }
    },
    onError: (_err, _data, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },
    // Reconcile only once the last in-flight toggle settles: concurrent toggles each return a full
    // row, so trusting any single response could clobber a sibling's optimistic change.
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: PRIVACY_UPDATE_KEY }) === 1) {
        queryClient.invalidateQueries({ queryKey: key })
        invalidateProfileDependentReads(queryClient)
      }
    },
    meta: { errorMessage: 'Mise à jour de la confidentialité impossible.' },
  })
}

// RGPD Article 20 portability: the dump must be the data as it stands now
// A cached export would hand the user an older snapshot
export const useDownloadDataExport = () => {
  return useMutation({
    mutationKey: ['profile', 'data-export', 'download'],
    mutationFn: async () => {
      const res = await api.profile.export.$get()
      await throwIfNotOk(res)

      const blob = await res.blob()
      const filename =
        parseAttachmentFilename(res.headers.get('Content-Disposition')) ?? 'aurore-export.json'
      downloadBlobAsFile(blob, filename)
    },
    meta: { errorMessage: "Téléchargement de l'export impossible." },
  })
}
