import type { BlogCategory } from '@aurore/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'

import { BackButton } from '@/component/Button/BackButton'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import { PageTopActions } from '@/component/Layout/PageLayout/PageTopActions'
import { ArticleEditorForm } from '@/features/blog/page/ArticleEditorForm/ArticleEditorForm'
import { requireRole } from '@/lib/auth/requireSession'
import { articleQueries } from '@/lib/queries/articles'
import { notFoundOn404, RouteNotFound } from '@/lib/routeErrors'

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
    context.queryClient.ensureQueryData(articleQueries.bySlug(params.slug)).catch(notFoundOn404),
  component: EditArticleRoute,
  notFoundComponent: RouteNotFound,
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
