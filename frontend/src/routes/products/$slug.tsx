import { createFileRoute, notFound } from '@tanstack/react-router'

import { GlobalError } from '@/component/Feedback/app/GlobalError/GlobalError'
import { ProductLayoutSkeleton } from '@/features/products/components/skeletons/ProductLayoutSkeleton/ProductLayoutSkeleton'
import { ProductLayout } from '@/features/products/pages/ProductLayout/ProductLayout'
import { ApiError } from '@/lib/helpers/apiError'
import { isServer } from '@/lib/helpers/isServer'
import { type AuthSessionCache, authQueries } from '@/lib/queries/auth'
import { productQueries } from '@/lib/queries/products'
import { profileQueries } from '@/lib/queries/profile'

export const Route = createFileRoute('/products/$slug')({
  ssr: true,
  loader: async ({ context, params, parentMatchPromise }) => {
    if (isServer) await parentMatchPromise
    const session = context.queryClient.getQueryData<AuthSessionCache>(
      authQueries.session().queryKey
    )
    const hasAuthenticatedSession = context.auth.isAuthenticated || session?.authenticated === true

    return Promise.all([
      context.queryClient.ensureQueryData(productQueries.bySlug(params.slug)).catch((err) => {
        // Missing product = 404, route to notFoundComponent; keep 5xx/429 on the real error UI
        if (err instanceof ApiError && err.status === 404) throw notFound()
        throw err
      }),
      // Not critical: dermo only feeds the warnings strip in InfoTab.
      // Swallow so a profile fetch failure never blocks the product page.
      hasAuthenticatedSession
        ? context.queryClient.ensureQueryData(profileQueries.dermo()).catch(() => null)
        : null,
    ])
  },
  notFoundComponent: () => <GlobalError error={new Error('not_found')} is404 />,
  pendingComponent: ProductLayoutSkeleton,
  component: ProductLayout,
})
