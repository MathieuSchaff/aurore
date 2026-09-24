import { evaluateSeoEligibility } from '@aurore/shared'

import { createFileRoute } from '@tanstack/react-router'

import { IngredientInfoTab } from '@/features/ingredients/components/IngredientInfoTab/IngredientInfoTab'
import { IngredientInfoSkeleton } from '@/features/ingredients/components/skeletons/IngredientLayoutSkeleton'
import { ingredientQueries } from '@/lib/queries/ingredients'
import { notFoundOn404, RouteNotFound } from '@/lib/routeErrors'
import { canonicalUrl, clampDesc, INDEX_ROBOTS, NOINDEX_ROBOTS, seoHead } from '@/lib/seo'

export const Route = createFileRoute('/ingredients/$slug/')({
  ssr: true,
  loader: async ({ context, params }) => {
    const { queryClient } = context
    // Hoisted out of mount and into the loader to kill the serial RTT after the detail.
    // products keys on the slug alone, so start it in parallel with bySlug; tags needs the id.
    // Not critical (products list + tag pills): swallow so a secondary failure can't error the page.
    const products = queryClient
      .ensureQueryData(ingredientQueries.products(params.slug))
      .catch(() => null)
    const ingredient = await queryClient
      .ensureQueryData(ingredientQueries.bySlug(params.slug))
      .catch(notFoundOn404)
    await Promise.all([
      products,
      queryClient.ensureQueryData(ingredientQueries.tags(ingredient.id)).catch(() => null),
    ])
    // Head-only field: the full ingredient reaches the component through the
    // dehydrated Query cache, so returning it here would ship it twice.
    return { name: ingredient.name, moderationStatus: ingredient.moderationStatus }
  },

  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    const path = `/ingredients/${params.slug}`
    const title = `${loaderData.name} | Aurore`
    // Composed on purpose: neutral, always present, on-brand.
    const description = clampDesc(
      `${loaderData.name} : son rôle en cosmétique et les produits qui en contiennent, à lire au calme sur Aurore — sans score ni verdict.`
    )
    const eligibility = evaluateSeoEligibility({
      kind: 'ingredient',
      moderationStatus: loaderData.moderationStatus,
    })
    return seoHead({
      path,
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      ogType: 'website',
      robots: eligibility.indexable ? INDEX_ROBOTS : NOINDEX_ROBOTS,
      // DefinedTerm fits a glossary entry (informational), not Product: no commerce framing.
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: loaderData.name,
        url: canonicalUrl(path),
        description,
      },
    })
  },
  pendingComponent: IngredientInfoSkeleton,
  notFoundComponent: RouteNotFound,
  component: IngredientInfoTab,
})
