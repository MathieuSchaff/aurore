import { HttpResponse, http } from 'msw'

import {
  PRODUCT_DETAILS,
  PRODUCT_FILTER_OPTIONS,
  PRODUCT_INGREDIENTS,
  PRODUCT_TAGS,
  PRODUCTS,
} from '../fixtures/products'

const ok = <T>(data: T) => HttpResponse.json({ success: true, data })

// Filter keys read from the query string. Tag categories cover the slugs
// stored in PRODUCT_TAGS; `ingredient` cross-references PRODUCT_INGREDIENTS.
const TAG_PARAMS = ['concern', 'skin_type', 'skin_zone', 'product_type', 'routine_step']

export const productsHandlers = [
  http.get('*/api/products/filter-options', () => ok(PRODUCT_FILTER_OPTIONS)),

  http.get('*/api/products', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')

    const tagFilters: string[] = []
    for (const k of TAG_PARAMS) {
      const v = url.searchParams.get(k)
      if (v) tagFilters.push(...v.split(',').filter(Boolean))
    }
    const ingredientFilters = (url.searchParams.get('ingredient') ?? '').split(',').filter(Boolean)

    const filtered = PRODUCTS.filter((p) => {
      const tags = PRODUCT_TAGS[p.id] ?? []
      const ings = PRODUCT_INGREDIENTS[p.id] ?? []
      if (tagFilters.length > 0 && !tagFilters.every((t) => tags.includes(t))) return false
      if (ingredientFilters.length > 0 && !ingredientFilters.every((i) => ings.includes(i)))
        return false
      return true
    })

    // Mirror the server contract: auto resolves against the mocked viewer, who
    // has declared nothing, so only an explicit true reports applied rules
    const rulesApplied = url.searchParams.get('apply_preferences') === 'true'
    return ok({
      items: filtered,
      total: filtered.length,
      page,
      limit,
      hiddenCount: 0,
      excludedLabels: [],
      requiredLabels: [],
      rulesApplied,
    })
  }),

  http.get('*/api/products/:slug/page', ({ params }) => {
    const product = PRODUCT_DETAILS.find((item) => item.slug === params.slug)
    if (!product) return new HttpResponse(null, { status: 404 })

    return ok({
      product,
      userStatus: null,
      dermoProfile: null,
      assessment: null,
      preferenceTargets: { ingredients: [], tags: [] },
    })
  }),

  // Detail-by-slug: consumers read it through optional chaining, so an empty
  // payload is enough to keep the request handled (no fixture needed here).
  http.get('*/api/products/:slug', () => ok(null)),
]
