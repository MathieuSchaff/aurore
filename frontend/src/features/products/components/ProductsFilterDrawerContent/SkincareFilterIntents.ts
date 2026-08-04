import type { SkincareProductTagSlug } from '@aurore/shared'

import type { FilterGroupConfig, FilterOption, FilterValues } from '@/component/Filter/types'
import type { FilterKey } from '@/features/products/filters'

export type SearchIntent = {
  id: string
  label: string
  filters: Partial<Record<FilterKey, SkincareProductTagSlug[]>>
}

export const SEARCH_INTENTS: SearchIntent[] = [
  {
    id: 'moisturizer',
    label: 'Soin hydratant',
    filters: {
      product_type_v2: ['type-hydratant'],
    },
  },
  {
    id: 'cleanser',
    label: 'Nettoyant',
    filters: {
      product_type_v2: ['type-nettoyant'],
    },
  },
  {
    id: 'serum',
    label: 'Sérum',
    filters: {
      product_type_v2: ['type-serum'],
    },
  },
  {
    id: 'sunscreen',
    label: 'Protection solaire',
    filters: {
      product_type_v2: ['type-solaire'],
    },
  },
  {
    id: 'targeted-treatment',
    label: 'Soin ciblé',
    filters: {
      product_type_v2: ['type-traitement'],
    },
  },
  {
    id: 'mask',
    label: 'Masque',
    filters: {
      product_type_v2: ['type-masque'],
    },
  },
]

const PRODUCT_COUNT_FORMATTER = new Intl.NumberFormat('fr-FR')

function getSearchIntentOption(
  intent: SearchIntent,
  groups: FilterGroupConfig<FilterKey>[]
): FilterOption | undefined {
  const entries = Object.entries(intent.filters)
  if (entries.length !== 1) return undefined

  const [key, values] = entries[0]
  if (values?.length !== 1) return undefined

  return groups
    .flatMap((group) => group.subFilters)
    .find((field) => field.key === key)
    ?.options.find((option) => option.value === values[0])
}

export function intentCountLabel(
  intent: SearchIntent,
  groups: FilterGroupConfig<FilterKey>[]
): string {
  const option = getSearchIntentOption(intent, groups)
  if (!option || option.disabled) return 'Indisponible'
  if (option.count === undefined) return 'Disponible'

  const noun = option.count > 1 ? 'produits' : 'produit'
  return `${PRODUCT_COUNT_FORMATTER.format(option.count)} ${noun}`
}

function arraysMatch(actual: string[] | undefined, expected: string[]) {
  if (actual?.length !== expected.length) return false
  const present = new Set(actual)
  return expected.every((value) => present.has(value))
}

export function inferActiveIntent(filters: FilterValues<FilterKey>) {
  const filledAxes = Object.values(filters).filter((values) => values.length > 0).length
  return SEARCH_INTENTS.find((intent) => {
    const presetAxes = Object.keys(intent.filters)
    // Exact match: every preset axis matches AND no axis is filled beyond
    // the preset, so overlapping presets can't both claim the same filters.
    return (
      filledAxes === presetAxes.length &&
      presetAxes.every((key) =>
        arraysMatch(filters[key as FilterKey], intent.filters[key as FilterKey] ?? [])
      )
    )
  })
}

export function applySearchIntent(filters: FilterValues<FilterKey>, intent: SearchIntent) {
  const activeIntent = inferActiveIntent(filters)
  const next = { ...filters }

  if (activeIntent) {
    for (const key of Object.keys(activeIntent.filters) as FilterKey[]) {
      next[key] = []
    }
  }

  if (activeIntent?.id !== intent.id) {
    for (const [key, values] of Object.entries(intent.filters)) {
      next[key as FilterKey] = [...(values ?? [])]
    }
  }

  return next
}

export function isSearchIntentAvailable(
  intent: SearchIntent,
  groups: FilterGroupConfig<FilterKey>[]
) {
  const option = getSearchIntentOption(intent, groups)
  return Boolean(option && !option.disabled)
}
