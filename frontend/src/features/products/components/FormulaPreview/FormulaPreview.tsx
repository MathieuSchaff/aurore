import type { ProductCategory, ProductFormulaPreviewInput, ProductTexture } from '@aurore/shared'

import { useMutationState } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { type ProductFormulaPreview, usePreviewProductFormula } from '@/lib/queries/products'

import './FormulaPreview.css'

// Mirrors TextureField.tsx: texture only transmitted for these three categories.
const TEXTURE_CATEGORIES = new Set<ProductCategory>(['skincare', 'solaire', 'bodycare'])

interface FormulaPreviewProps {
  inci: string
  category: ProductCategory
  kind: string
  name: string
  brand: string
  texture: string
  description: string
  allTags: Array<{ id: string; label: string; slug: string }> | undefined
  selectedTagIds: string[]
  linkedIngredientIds: string[]
  onApplyTag: (tagId: string, relevance: 'primary' | 'secondary' | 'avoid') => void
  onAddIngredient: (ingredientId: string, ingredientName: string) => void
}

function buildMutationInput(
  props: Pick<
    FormulaPreviewProps,
    'inci' | 'category' | 'kind' | 'name' | 'brand' | 'texture' | 'description'
  >
): ProductFormulaPreviewInput {
  const includeTexture = !!props.texture && TEXTURE_CATEGORIES.has(props.category)
  return {
    inci: props.inci,
    category: props.category,
    kind: props.kind,
    name: props.name.trim() || undefined,
    brand: props.brand.trim() || undefined,
    texture: includeTexture ? (props.texture as ProductTexture) : undefined,
    description: props.description.trim() || undefined,
  }
}

export function FormulaPreview({
  inci,
  category,
  kind,
  name,
  brand,
  texture,
  description,
  allTags,
  selectedTagIds,
  linkedIngredientIds,
  onApplyTag,
  onAddIngredient,
}: FormulaPreviewProps) {
  const mutation = usePreviewProductFormula()
  const [result, setResult] = useState<ProductFormulaPreview | null>(null)
  const tagsBySlug = useMemo(
    () => new Map((allTags ?? []).map((tag) => [tag.slug, tag] as const)),
    [allTags]
  )
  const selectedTagIdSet = useMemo(() => new Set(selectedTagIds), [selectedTagIds])
  // Snapshot the analyzed inputs; drift detection avoids phantom runs while
  // flagging results that no longer reflect the form (tags depend on category/kind).
  const [analyzedKey, setAnalyzedKey] = useState<string | null>(null)
  const currentKey = `${category}\u0000${kind}\u0000${inci}`

  const isDisabled = !inci.trim() || !kind || !category
  const showInciHint = !inci.trim()
  const showFieldsHint = !!inci.trim() && (!kind || !category)

  function handleAnalyze() {
    mutation.mutate(
      buildMutationInput({ inci, category, kind, name, brand, texture, description }),
      {
        onSuccess: (data) => {
          setResult(data)
          setAnalyzedKey(currentKey)
        },
      }
    )
  }

  type Token = ProductFormulaPreview['tokens'][number]
  type MatchedToken = Token & { ingredient: NonNullable<Token['ingredient']> }

  const matched = result?.tokens.filter((t): t is MatchedToken => t.ingredient !== null) ?? []
  const knownNoRecord = result?.tokens.filter((t) => t.canonicalKey && !t.ingredient) ?? []
  const unknown = result?.tokens.filter((t) => !t.canonicalKey && !t.ingredient) ?? []

  // Edit mode persists adds server-side; chips would only flip to "Ajouté" after the
  // refetch. Observe in-flight/settled add mutations so feedback is immediate and a
  // failed add falls back to the button on its own.
  const addMutationStates = useMutationState({
    filters: { mutationKey: ['add-product-ingredient'] },
    select: (m) => ({
      id: (m.state.variables as { ingredientId?: string } | undefined)?.ingredientId,
      counted: m.state.status === 'pending' || m.state.status === 'success',
    }),
  })
  const optimisticAddedIds = new Set(
    addMutationStates.filter((s) => s.counted && s.id).map((s) => s.id as string)
  )
  const isAdded = (ingredientId: string) =>
    linkedIngredientIds.includes(ingredientId) || optimisticAddedIds.has(ingredientId)

  // Addable = matched but not yet linked or being linked; deduped by ingredient id.
  const addableIngredients = matched
    .filter((t) => !isAdded(t.ingredient.id))
    .filter((t, idx, arr) => arr.findIndex((x) => x.ingredient.id === t.ingredient.id) === idx)

  const inputsDrifted = analyzedKey !== null && currentKey !== analyzedKey

  return (
    <section className="formula-preview" aria-labelledby="formula-preview-title">
      <div className="formula-preview__header">
        <h2 className="formula-preview__title ui-title-sm" id="formula-preview-title">
          Lecture de la formule
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isDisabled}
          loading={mutation.isPending}
          onClick={handleAnalyze}
        >
          Analyser la formule
        </Button>
      </div>

      {showInciHint && <p className="formula-preview__hint">Collez d&apos;abord la liste INCI.</p>}
      {showFieldsHint && (
        <p className="formula-preview__hint">
          Choisissez d&apos;abord le domaine et le type de produit.
        </p>
      )}

      {mutation.isError && (
        <FormMessage variant="error">
          L&apos;analyse n&apos;a pas abouti. Vous pouvez réessayer.
        </FormMessage>
      )}

      {inputsDrifted && (
        <p className="formula-preview__drift">Les champs ont changé depuis la dernière analyse.</p>
      )}

      {result && (
        <>
          {matched.length > 0 && (
            <div className="formula-preview__group">
              <h3 className="formula-preview__group-title">
                Reliés au catalogue <span className="formula-preview__count">{matched.length}</span>
              </h3>
              <ul
                role="list"
                className="formula-preview__chips ui-wrap-list"
                aria-label="Ingrédients reliés au catalogue"
              >
                {matched.map((t) => {
                  const ing = t.ingredient
                  const isLinked = isAdded(ing.id)
                  return (
                    <li
                      key={`${t.raw}-${ing.id}`}
                      className="formula-preview__chip formula-preview__chip--matched"
                    >
                      <span className="formula-preview__chip-name">{ing.name}</span>
                      {isLinked ? (
                        <span className="formula-preview__chip-added">Ajouté</span>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          aria-label={`Ajouter ${ing.name} aux ingrédients`}
                          onClick={() => onAddIngredient(ing.id, ing.name)}
                        >
                          + Ajouter
                        </Button>
                      )}
                    </li>
                  )
                })}
              </ul>
              {addableIngredients.length >= 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="formula-preview__add-all"
                  onClick={() => {
                    for (const t of addableIngredients) {
                      onAddIngredient(t.ingredient.id, t.ingredient.name)
                    }
                  }}
                >
                  Tout ajouter
                </Button>
              )}
            </div>
          )}

          {knownNoRecord.length > 0 && (
            <div className="formula-preview__group">
              <h3 className="formula-preview__group-title">
                Reconnus, pas encore de fiche{' '}
                <span className="formula-preview__count">{knownNoRecord.length}</span>
              </h3>
              <ul
                role="list"
                className="formula-preview__chips ui-wrap-list"
                aria-label="Ingrédients reconnus sans fiche"
              >
                {knownNoRecord.map((t) => (
                  <li key={t.raw} className="formula-preview__chip formula-preview__chip--known">
                    {t.raw}
                  </li>
                ))}
              </ul>
              <p className="formula-preview__microcopy">
                Ces ingrédients sont identifiés mais n&apos;ont pas encore de fiche dans le
                catalogue.
              </p>
            </div>
          )}

          {unknown.length > 0 && (
            <div className="formula-preview__group">
              <h3 className="formula-preview__group-title">
                Non reconnus <span className="formula-preview__count">{unknown.length}</span>
              </h3>
              <ul
                role="list"
                className="formula-preview__chips ui-wrap-list"
                aria-label="Ingrédients non reconnus"
              >
                {unknown.map((t) => (
                  <li key={t.raw} className="formula-preview__chip formula-preview__chip--unknown">
                    {t.raw}
                  </li>
                ))}
              </ul>
              <p className="formula-preview__microcopy">
                Peut-être une variante d&apos;orthographe ou un nom commercial. La liste reste
                enregistrée telle quelle.
              </p>
            </div>
          )}

          {result.autoTagEligible ? (
            <div className="formula-preview__group">
              <h3 className="formula-preview__group-title">
                Tags suggérés d&apos;après la formule
              </h3>
              {result.suggestedTags.length === 0 ? (
                <p className="formula-preview__microcopy">Aucun tag suggéré pour cette liste.</p>
              ) : (
                <>
                  <ul
                    role="list"
                    className="formula-preview__chips ui-wrap-list"
                    aria-label="Tags suggérés"
                  >
                    {result.suggestedTags.map((st) => {
                      const tag = tagsBySlug.get(st.tagSlug)
                      if (!tag) return null
                      const isAdded = selectedTagIdSet.has(tag.id)
                      return (
                        <li
                          key={st.tagSlug}
                          className="formula-preview__chip formula-preview__chip--tag"
                        >
                          <span className="formula-preview__chip-name">{tag.label}</span>
                          {st.relevance === 'primary' && (
                            <span className="formula-preview__badge">principal</span>
                          )}
                          {st.relevance === 'avoid' && (
                            <span className="formula-preview__badge formula-preview__badge--signale">
                              signalé
                            </span>
                          )}
                          {isAdded ? (
                            <span className="formula-preview__chip-added">Ajouté</span>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              aria-label={`Ajouter le tag ${tag.label}`}
                              onClick={() => onApplyTag(tag.id, st.relevance)}
                            >
                              + Ajouter
                            </Button>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                  <p className="formula-preview__microcopy">
                    Suggestions issues de la lecture de la liste — modifiables avant publication.
                  </p>
                </>
              )}
            </div>
          ) : (
            <p className="formula-preview__microcopy">
              Les suggestions de tags ne sont pas disponibles pour cette catégorie.
            </p>
          )}
        </>
      )}
    </section>
  )
}
