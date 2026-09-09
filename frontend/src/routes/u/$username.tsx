import { createFileRoute, notFound } from '@tanstack/react-router'

import { GlobalError } from '@/component/Feedback/app/GlobalError/GlobalError'
import { Spinner } from '@/component/Feedback/ui/Spinner/Spinner'
import { PublicProfilePage } from '@/features/profile/page/PublicProfile/PublicProfilePage'
import { isApiErrorCode } from '@/lib/helpers/apiError'
import { profileQueries } from '@/lib/queries/profile'
import { NOINDEX_ROBOTS, seoHead } from '@/lib/seo'

export const Route = createFileRoute('/u/$username')({
  // Rendered on the server so an unknown username answers a real 404 instead of a
  // 200 shell that only turns into a not-found screen after the client fetch
  ssr: true,
  loader: ({ context, params }) =>
    context.queryClient
      .ensureQueryData(profileQueries.publicByUsername(params.username))
      .catch((err) => {
        if (isApiErrorCode(err, 'not_found')) throw notFound()
        throw err
      }),
  // A profile is opt-in for other members, not for search engines: noindex, canonical kept
  head: ({ params }) =>
    seoHead({
      path: `/u/${params.username}`,
      title: `@${params.username} — Aurore`,
      robots: NOINDEX_ROBOTS,
    }),
  notFoundComponent: () => <GlobalError error={new Error('not_found')} is404 />,
  pendingComponent: () => <Spinner />,
  component: PublicProfileRouteComponent,
})

function PublicProfileRouteComponent() {
  const { username } = Route.useParams()
  return <PublicProfilePage username={username} />
}
