import type { PreferenceStance } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import type { ComboboxSection } from '@/component/Search/ComboboxPrimitive'
import { SearchCombobox } from '@/component/Search/SearchCombobox'
import { foldText } from '@/component/Search/text-fold'
import { ingredientQueries } from '@/lib/queries/ingredients'
import { productTagQueries } from '@/lib/queries/product-tags'
import { useUpsertIngredientPreference, useUpsertTagPreference } from '@/lib/queries/profile'

const COMPOSER_LABEL: Record<PreferenceStance, string> = {
  exclude: 'Sans quel ingrédient ou tag ?',
  require: 'Avec quel ingrédient ou tag ?',
}

// Rule entry on the recap screen, one per list: the verb is the section you
// add into, not a toggle to set first. Ingredients come from the server
// autocomplete; tags are the only declarable family with no other entry point,
// filtered client-side from the full taxonomy (~230 defs, one deferred read).
export function PreferenceRuleComposer({ stance }: { stance: PreferenceStance }) {
  const [tagsWanted, setTagsWanted] = useState(false)
  const upsertIngredient = useUpsertIngredientPreference()
  const upsertTag = useUpsertTagPreference()

  const { data: tags } = useQuery({
    ...productTagQueries.list(undefined, 500),
    enabled: tagsWanted,
    staleTime: 1000 * 60 * 10,
  })

  const tagSections = (query: string): ComboboxSection[] => {
    if (!tags || query.length < 2) return []
    const folded = foldText(query)
    const matches = tags
      .filter((t) => foldText(t.label).includes(folded) || foldText(t.slug).includes(folded))
      .slice(0, 6)
    return [
      {
        id: 'tags',
        label: 'Tags produit',
        items: matches.map((t) => ({
          id: t.id,
          render: <span className="preference-composer__tag-option">{t.label}</span>,
          onSelect: () => upsertTag.mutate({ tagId: t.id, stance }),
        })),
      },
    ]
  }

  return (
    <div className="preference-composer">
      <SearchCombobox
        queryFn={(q) => ingredientQueries.searchDeclarableInfinite(q)}
        toResult={(i) => ({
          id: i.id,
          slug: i.canonicalKey ?? '',
          label: i.name,
          sublabel: i.canonicalKey && i.canonicalKey !== i.name ? i.canonicalKey : undefined,
        })}
        onSelect={(canonicalKey) => {
          if (canonicalKey) upsertIngredient.mutate({ canonicalKey, stance })
        }}
        sections={tagSections}
        onFocus={() => setTagsWanted(true)}
        label={COMPOSER_LABEL[stance]}
        placeholder="Rechercher un ingrédient ou un tag…"
      />
    </div>
  )
}
