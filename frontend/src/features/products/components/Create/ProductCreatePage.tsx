import { useNavigate } from '@tanstack/react-router'

import { BackButton } from '@/component/Button/BackButton'
import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import { PageTopActions } from '@/component/Layout/PageLayout/PageTopActions'
import { ProductForm } from '../ProductForm/ProductForm'
import '../Edit/ProductEditPage.css'

export function ProductCreatePage() {
  const navigate = useNavigate()

  return (
    <DetailPageLayout banner>
      <PageTopActions>
        <BackButton to="/products">Produits</BackButton>
      </PageTopActions>

      <div className="create-page-header">
        <h1 className="create-page-header__title">Nouveau produit</h1>
      </div>

      <ProductForm
        mode="create"
        onSuccess={(slug) => navigate({ to: '/products/$slug', params: { slug } })}
      />
    </DetailPageLayout>
  )
}
