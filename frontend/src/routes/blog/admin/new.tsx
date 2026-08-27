import type { BlogCategory } from '@aurore/shared'

import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'

import { BackButton } from '@/component/Button/BackButton'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import { PageTopActions } from '@/component/Layout/PageLayout/PageTopActions'
import { ArticleEditorForm } from '@/features/blog/page/ArticleEditorForm/ArticleEditorForm'
import { requireRole } from '@/lib/auth/requireSession'

export const Route = createFileRoute('/blog/admin/new')({
  beforeLoad: async ({ context, location }) => {
    // react-doctor-disable-next-line react-doctor/async-defer-await -- guard reads role resolved by this await
    await requireRole({
      queryClient: context.queryClient,
      href: location.href,
      allowedRoles: ['admin'],
      fallbackFor: { user: '/blog', contributor: '/blog' },
    })
  },
  component: NewArticleRoute,
})

function NewArticleRoute() {
  const navigate = useNavigate()
  const router = useRouter()

  function handleSuccess(category: BlogCategory, slug: string) {
    navigate({ to: '/blog/$category/$slug', params: { category, slug } })
  }

  return (
    <DetailPageLayout>
      <PageTopActions>
        <BackButton to="/blog">Retour</BackButton>
      </PageTopActions>
      <PageHeader title="Nouvel article" />
      <ArticleEditorForm
        mode="create"
        onSuccess={handleSuccess}
        onCancel={() => router.history.back()}
      />
    </DetailPageLayout>
  )
}
