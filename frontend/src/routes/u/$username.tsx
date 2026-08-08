import { createFileRoute, notFound } from '@tanstack/react-router'

import { GlobalError } from '@/component/Feedback/app/GlobalError/GlobalError'
import { Spinner } from '@/component/Feedback/ui/Spinner/Spinner'
import { PublicProfilePage } from '@/features/profile/page/PublicProfile/PublicProfilePage'
import { profileQueries } from '@/lib/queries/profile'

export const Route = createFileRoute('/u/$username')({
  loader: ({ context, params }) =>
    context.queryClient
      .ensureQueryData(profileQueries.publicByUsername(params.username))
      .catch((err) => {
        // A missing profile throws Error('not_found') (not ApiError), routed to notFoundComponent.
        if (err instanceof Error && err.message === 'not_found') throw notFound()
        throw err
      }),
  notFoundComponent: () => <GlobalError error={new Error('not_found')} is404 />,
  pendingComponent: () => <Spinner />,
  component: PublicProfileRouteComponent,
})

function PublicProfileRouteComponent() {
  const { username } = Route.useParams()
  return <PublicProfilePage username={username} />
}
