import { Skeleton } from '@/component/Feedback/ui/Skeleton/Skeleton'
import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import './ProductLayoutSkeleton.css'

export function ProductLayoutSkeleton() {
  return (
    <DetailPageLayout banner={true} contentClassName="product-detail">
      <div className="product-detail__grid">
        <div className="product-hero product-layout-skeleton__hero">
          <Skeleton width="8rem" height="0.75rem" />
          <Skeleton width="70%" height="2.5rem" />
          <Skeleton width="4.5rem" height="1.5rem" radius="var(--radius-full)" />
        </div>

        <aside className="product-rail" aria-hidden="true">
          <div className="product-rail__card">
            <div className="product-rail__media product-layout-skeleton__media">
              <Skeleton width="100%" height="100%" radius="var(--radius-lg)" />
            </div>
            <Skeleton width="100%" height="2.25rem" radius="var(--radius-full)" />
          </div>
        </aside>

        <div className="product-detail__body">
          <div className="product-layout-skeleton__tabs">
            <Skeleton width="5rem" height="2.25rem" radius="var(--radius-full)" />
            <Skeleton width="7rem" height="2.25rem" radius="var(--radius-full)" />
          </div>

          <ProductInfoSkeleton />
        </div>
      </div>
    </DetailPageLayout>
  )
}

export function ProductInfoSkeleton() {
  return (
    <>
      <div className="product-info-skeleton__section">
        <Skeleton width="7rem" height="1rem" />
        <Skeleton width="100%" height="5rem" radius="var(--radius-lg)" />
      </div>

      <div className="product-info-skeleton__section">
        <Skeleton width="8rem" height="1rem" />
        <div className="product-info-skeleton__ingredients">
          {[1, 2, 3].map((i) => (
            <div key={i} className="product-info-skeleton__ingredient">
              <Skeleton width="2.5rem" height="2.5rem" radius="var(--radius-md)" />
              <div className="product-info-skeleton__ingredient-body">
                <Skeleton width="40%" height="1rem" />
                <Skeleton width="25%" height="0.75rem" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export function ProductDiscussionSkeleton() {
  return (
    <div className="product-discussion-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="product-discussion-skeleton__thread">
          <Skeleton width="60%" height="1.25rem" />
          <Skeleton width="30%" height="0.75rem" />
          <Skeleton width="100%" height="2rem" />
        </div>
      ))}
    </div>
  )
}

export function ProductThreadSkeleton() {
  return (
    <div className="product-discussion-skeleton">
      <Skeleton width="10rem" height="2rem" radius="var(--radius-full)" />
      <Skeleton width="80%" height="1.5rem" />
      <Skeleton width="40%" height="0.75rem" />
      <Skeleton width="100%" height="6rem" radius="var(--radius-lg)" />
      {[1, 2].map((i) => (
        <div key={i} className="product-discussion-skeleton__thread">
          <Skeleton width="30%" height="0.75rem" />
          <Skeleton width="100%" height="2rem" />
        </div>
      ))}
    </div>
  )
}
