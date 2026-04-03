import type { SkinConcern, SkinType, UserDermoProfileUpdateInput } from '@habit-tracker/shared'
import { SKIN_CONCERNS, SKIN_TYPES } from '@habit-tracker/shared'

import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Textarea } from '@/component/Textarea/Textarea'
import { profileQueries, useUpdateDermoProfile } from '../../../../lib/queries/profile'
import './DermoProfileForm.css'

const SKIN_TYPE_LABELS: Record<SkinType, string> = {
  dry: 'Sèche',
  oily: 'Grasse',
  combination: 'Mixte',
  normal: 'Normale',
  sensitive: 'Sensible',
}

const SKIN_CONCERN_LABELS: Record<SkinConcern, string> = {
  acne: 'Acné',
  blackheads: 'Points noirs',
  enlarged_pores: 'Pores dilatés',
  hyperpigmentation: 'Hyperpigmentation',
  dark_spots: 'Taches brunes',
  uneven_skin_tone: 'Teint irrégulier',
  dullness: 'Teint terne',
  dehydration: 'Déshydratation',
  fine_lines: 'Ridules',
  wrinkles: 'Rides',
  loss_of_firmness: 'Perte de fermeté',
  dark_circles: 'Cernes',
  puffiness: 'Gonflement',
  rosacea: 'Rosacée',
  atopic_dermatitis: 'Dermatite atopique',
  perioral_dermatitis: 'Dermatite périorale',
  seborrheic_dermatitis: 'Dermatite séborrhéique',
  eczema: 'Eczéma',
  psoriasis: 'Psoriasis',
  acne_vulgaris: 'Acné vulgaire',
  acne_cystic: 'Acné kystique',
  keratosis_pilaris: 'Kératose pilaire',
  vitiligo: 'Vitiligo',
  melasma: 'Mélasma',
  contact_dermatitis: 'Dermatite de contact',
  couperose: 'Couperose',
}

const FITZPATRICK_ITEMS = [
  { value: 1, label: 'I', description: 'Toujours brûle, jamais bronze' },
  { value: 2, label: 'II', description: 'Brûle facilement, bronze peu' },
  { value: 3, label: 'III', description: 'Brûle modérément, bronze' },
  { value: 4, label: 'IV', description: 'Brûle peu, bronze bien' },
  { value: 5, label: 'V', description: 'Brûle rarement' },
  { value: 6, label: 'VI', description: 'Ne brûle jamais' },
]

export function DermoProfileForm() {
  const { data: dermo, isLoading } = useQuery(profileQueries.dermo())
  const updateMutation = useUpdateDermoProfile()

  const [skinTypes, setSkinTypes] = useState<SkinType[]>([])
  const [fitzpatrickType, setFitzpatrickType] = useState<number | null>(null)
  const [skinConcerns, setSkinConcerns] = useState<SkinConcern[]>([])
  const [privateNotes, setPrivateNotes] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (dermo) {
      setSkinTypes((dermo.skinTypes ?? []) as SkinType[])
      setFitzpatrickType(dermo.fitzpatrickType ?? null)
      setSkinConcerns((dermo.skinConcerns ?? []) as SkinConcern[])
      setPrivateNotes(dermo.privateNotes ?? '')
    }
  }, [dermo])

  const toggleSkinType = (type: SkinType) => {
    setSkinTypes((prev) => {
      if (prev.includes(type)) return prev.filter((t) => t !== type)
      if (prev.length >= 3) return prev
      return [...prev, type]
    })
    setIsDirty(true)
  }

  const toggleConcern = (concern: SkinConcern) => {
    setSkinConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    )
    setIsDirty(true)
  }

  const handleSave = () => {
    const data: UserDermoProfileUpdateInput = {
      skinTypes,
      fitzpatrickType,
      skinConcerns,
      privateNotes: privateNotes || null,
    }
    updateMutation.mutate(data, { onSuccess: () => setIsDirty(false) })
  }

  if (isLoading) return <div className="dermo-form__loading">Chargement...</div>

  return (
    <div className="dermo-form">
      <section className="dermo-section">
        <span className="dermo-section__overline">Type de peau</span>
        <h3 className="dermo-section__title">Type de peau</h3>
        <p className="dermo-section__desc">Sélectionnez jusqu'à 3 types.</p>
        <div className="dermo-skin-types">
          {SKIN_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={clsx(
                'dermo-type-pill',
                skinTypes.includes(type) && 'dermo-type-pill--active'
              )}
              onClick={() => toggleSkinType(type)}
              aria-pressed={skinTypes.includes(type)}
              disabled={!skinTypes.includes(type) && skinTypes.length >= 3}
            >
              {SKIN_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </section>

      <section className="dermo-section">
        <span className="dermo-section__overline">Phototype</span>
        <h3 className="dermo-section__title">Phototype de Fitzpatrick</h3>
        <p className="dermo-section__desc">Réaction de votre peau au soleil.</p>
        <div className="dermo-fitzpatrick" role="radiogroup" aria-label="Phototype de Fitzpatrick">
          {FITZPATRICK_ITEMS.map(({ value, label, description }) => (
            <label
              key={value}
              className={clsx(
                'dermo-fitz-item',
                fitzpatrickType === value && 'dermo-fitz-item--active'
              )}
            >
              <input
                type="radio"
                name="fitzpatrick"
                className="sr-only"
                checked={fitzpatrickType === value}
                onChange={() => {
                  setFitzpatrickType(value)
                  setIsDirty(true)
                }}
              />
              <span className="dermo-fitz-label">{label}</span>
              <span className="dermo-fitz-desc">{description}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="dermo-section">
        <span className="dermo-section__overline">Conditions</span>
        <h3 className="dermo-section__title">Problématiques & conditions</h3>
        <div className="dermo-concerns">
          {SKIN_CONCERNS.map((concern) => (
            <button
              key={concern}
              type="button"
              className={clsx(
                'dermo-concern-chip',
                skinConcerns.includes(concern) && 'dermo-concern-chip--active'
              )}
              onClick={() => toggleConcern(concern)}
              aria-pressed={skinConcerns.includes(concern)}
            >
              {SKIN_CONCERN_LABELS[concern]}
            </button>
          ))}
        </div>
      </section>

      <section className="dermo-section">
        <span className="dermo-section__overline">Privé</span>
        <h3 className="dermo-section__title">Notes privées</h3>
        <p className="dermo-section__desc">
          Ces notes sont privées et utilisées uniquement pour les recommandations personnalisées.
        </p>
        <Textarea
          label=""
          value={privateNotes}
          onChange={(e) => {
            setPrivateNotes(e.target.value)
            setIsDirty(true)
          }}
          placeholder="Ex : réagis fort aux parfums, sous traitement isotrétinoïne…"
          maxLength={2000}
          hint={`${privateNotes.length}/2000`}
          rows={4}
        />
      </section>

      {updateMutation.isError && (
        <p className="dermo-form__error" role="alert">
          Une erreur est survenue lors de la sauvegarde.
        </p>
      )}

      <div className="dermo-form__actions">
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleSave}
          loading={updateMutation.isPending}
          disabled={!isDirty}
        >
          Enregistrer
        </Button>
      </div>
    </div>
  )
}
