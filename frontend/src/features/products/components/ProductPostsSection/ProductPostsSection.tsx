import type { SocialPostSurfaceView } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { Time } from '@/component/DataDisplay/Time/Time'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { POST_TONE_LABELS } from '@/constants/skin'
import { ReactionRow } from '@/features/social/components/ReactionRow/ReactionRow'
import { productQueries } from '@/lib/queries/products'

import './ProductPostsSection.css'

// Private profiles must not expose a profile link
function AuthorName({ author }: { author: SocialPostSurfaceView['author'] }) {
  if (author.profilePublic) {
    return (
      <Link
        className="product-posts__author-link ui-author-link"
        to="/u/$username"
        params={{ username: author.username }}
      >
        {author.username}
      </Link>
    )
  }
  return <span className="product-posts__author-name">{author.username}</span>
}

export function ProductPostsSection({ slug, composer }: { slug: string; composer?: ReactNode }) {
  const { data, isPending, isError } = useQuery(productQueries.posts(slug))
  const posts = data?.posts ?? []

  if (isPending || isError) {
    return (
      <section className="product-section product-posts">
        <SectionHeader title="Publications" />
        {composer}
        <p className="product-section__intro">
          {isPending
            ? 'Chargement des publications…'
            : 'Publications indisponibles pour le moment.'}
        </p>
      </section>
    )
  }

  if (posts.length === 0 && !composer) return null

  return (
    <section className="product-section product-posts">
      <SectionHeader
        title="Publications"
        count={posts.length > 0 ? posts.length : undefined}
        variant="primary"
      />
      {composer}
      {posts.length > 0 && (
        <ul role="list" className="product-posts__list">
          {posts.map((post) => (
            <li key={post.id} className="ui-content-card">
              <header className="product-posts__header">
                <AuthorName author={post.author} />
                <Time iso={post.createdAt} style="monthYear" className="product-posts__date" />
                <Badge variant="chip">{POST_TONE_LABELS[post.tone]}</Badge>
              </header>
              <p className="product-posts__body">{post.content}</p>
              <ReactionRow reactableType="post" reactableId={post.id} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
