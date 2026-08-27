import type { BlogCategory } from '@aurore/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, useNavigate, useRouter } from '@tanstack/react-router'

import { BackButton } from '@/component/Button/BackButton'
import { GlobalError } from '@/component/Feedback/app/GlobalError/GlobalError'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import { PageTopActions } from '@/component/Layout/PageLayout/PageTopActions'
import { ArticleEditorForm } from '@/features/blog/page/ArticleEditorForm/ArticleEditorForm'
import { requireRole } from '@/lib/auth/requireSession'
import { ApiError } from '@/lib/helpers/apiError'
import { articleQueries } from '@/lib/queries/articles'

export const Route = createFileRoute('/blog/admin/edit/$slug')({
  beforeLoad: async ({ context, location }) => {
    // react-doctor-disable-next-line react-doctor/async-defer-await -- guard reads role resolved by this await
    await requireRole({
      queryClient: context.queryClient,
      href: location.href,
      allowedRoles: ['admin'],
      fallbackFor: { user: '/blog', contributor: '/blog' },
    })
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(articleQueries.bySlug(params.slug)).catch((err) => {
      // Missing article = 404, route to notFoundComponent; keep 5xx/429 on the real error UI
      if (err instanceof ApiError && err.status === 404) throw notFound()
      throw err
    }),
  component: EditArticleRoute,
  notFoundComponent: () => <GlobalError error={new Error('not_found')} is404 />,
})

function EditArticleRoute() {
  const { slug } = Route.useParams()
  const { data: article } = useSuspenseQuery(articleQueries.bySlug(slug))
  const navigate = useNavigate()
  const router = useRouter()

  function handleSuccess(category: BlogCategory, newSlug: string) {
    navigate({ to: '/blog/$category/$slug', params: { category, slug: newSlug } })
  }

  function handleCancel() {
    router.history.back()
  }

  return (
    <DetailPageLayout>
      <PageTopActions>
        <BackButton
          to="/blog/$category/$slug"
          params={{ category: article.category, slug: article.slug }}
        >
          Retour
        </BackButton>
      </PageTopActions>
      <PageHeader title={`Modifier : ${article.title}`} />
      <ArticleEditorForm
        mode="edit"
        article={article}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </DetailPageLayout>
  )
}
