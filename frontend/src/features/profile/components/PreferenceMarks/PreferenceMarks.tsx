import type { PreferenceStance } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { X } from 'lucide-react'

import { Button } from '@/component/Button/Button'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { STANCE_GROUP_LABEL } from '@/constants/preferences'
import {
  preferenceTargetQueries,
  useDeleteIngredientPreference,
  useDeleteTagPreference,
} from '@/lib/queries/profile'
import { PreferenceRuleComposer } from './PreferenceRuleComposer'
import './PreferenceMarks.css'

const STANCE_EMPTY: Record<PreferenceStance, string> = {
  exclude: 'Rien à retirer pour le moment.',
  require: 'Rien d’exigé pour le moment.',
}

// The authoritative recap and the direct entry point. Two permanent
// lists titled by their effect: the two labels that state what a rule does
// only appeared once a rule existed, so never when the choice was made.
// Personal, private, never a judgment on any product.
export function PreferenceMarks() {
  const { data: targets } = useQuery(preferenceTargetQueries.list())
  const removeIngredient = useDeleteIngredientPreference()
  const removeTag = useDeleteTagPreference()

  const groups: { stance: PreferenceStance; items: MarkItem[] }[] = (
    ['exclude', 'require'] as const
  ).map((stance) => ({
    stance,
    items: [
      ...(targets?.ingredients ?? [])
        .filter((i) => i.stance === stance)
        .map((i) => ({
          key: `ing-${i.canonicalKey}`,
          label: i.name ?? i.canonicalKey,
          remove: () => removeIngredient.mutate(i.canonicalKey),
        })),
      ...(targets?.tags ?? [])
        .filter((t) => t.stance === stance)
        .map((t) => ({
          key: `tag-${t.tagId}`,
          label: t.label,
          remove: () => removeTag.mutate(t.tagId),
        })),
    ],
  }))

  const isEmpty = groups.every((g) => g.items.length === 0)
  const pending = removeIngredient.isPending || removeTag.isPending

  return (
    <section id="reperes" className="preference-marks">
      <SectionHeader title="Mes repères" as="h2" />
      <p className="preference-marks__hint">
        Personnels et privés, jamais un avis sur un produit. Ils s'appliquent au catalogue quand «
        Selon mon profil » est actif.
      </p>

      {groups.map((group) => (
        <div key={group.stance} className="preference-marks__group">
          <h3 className="preference-marks__subhead">{STANCE_GROUP_LABEL[group.stance]}</h3>
          {group.items.length > 0 ? (
            <ul role="list" className="preference-marks__list">
              {group.items.map((item) => (
                <li key={item.key} className="preference-marks__item">
                  <span className="preference-marks__label">{item.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={item.remove}
                    disabled={pending}
                    aria-label={`Retirer ${item.label}`}
                    className="preference-marks__remove"
                  >
                    <X size={14} aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="preference-marks__group-empty">{STANCE_EMPTY[group.stance]}</p>
          )}
          <PreferenceRuleComposer stance={group.stance} />
        </div>
      ))}

      {isEmpty && (
        <p className="preference-marks__empty">
          « Sans parfum », « Avec niacinamide » : ajoutez-les ci-dessus, ou depuis une{' '}
          <Link to="/ingredients" className="preference-marks__empty-link">
            fiche ingrédient
          </Link>
          .
        </p>
      )}
    </section>
  )
}

interface MarkItem {
  key: string
  label: string
  remove: () => void
}
