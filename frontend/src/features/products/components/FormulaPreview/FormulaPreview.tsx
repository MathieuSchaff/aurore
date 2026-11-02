import type { ProductCategory, ProductFormulaPreviewInput, ProductTexture } from '@aurore/shared'
import { getProductTagLabel } from '@aurore/shared'

import { useMemo, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { type ProductFormulaPreview, usePreviewProductFormula } from '@/lib/queries/products'

import './FormulaPreview.css'

// Same list as TextureField.tsx: texture is only sent for these three categories
const TEXTURE_CATEGORIES = new Set<ProductCategory>(['skincare', 'solaire', 'bodycare'])

type Token = ProductFormulaPreview['tokens'][number]
type MatchedToken = Token & { ingredient: NonNullable<Token['ingredient']> }

function groupTokens(tokens: readonly Token[]) {
  return {
    matched: tokens.filter((t): t is MatchedToken => t.ingredient !== null),
    knownNoRecord: tokens.filter((t) => t.canonicalKey && !t.ingredient),
    unknown: tokens.filter((t) => !t.canonicalKey && !t.ingredient),
  }
}

interface FormulaPreviewProps {
  canManageLinks: boolean
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
  canManageLinks,
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
  // Compare the normalized payload so every input used by analysis can mark results stale
  const [analyzedKey, setAnalyzedKey] = useState<string | null>(null)
  const mutationInput = buildMutationInput({
    inci,
    category,
    kind,
    name,
    brand,
    texture,
    description,
  })
  const currentKey = JSON.stringify(mutationInput)

  const isDisabled = !inci.trim() || !kind || !category
  const showInciHint = !inci.trim()
  const showFieldsHint = !!inci.trim() && (!kind || !category)

  function handleAnalyze() {
    mutation.mutate(mutationInput, {
      onSuccess: (data) => {
        setResult(data)
        setAnalyzedKey(currentKey)
      },
    })
  }

  const { matched, knownNoRecord, unknown } = groupTokens(result?.tokens ?? [])

  const isIngredientLinked = (ingredientId: string) => linkedIngredientIds.includes(ingredientId)

  // Addable = matched but not yet linked or being linked; deduped by ingredient id
  const addableIngredients = matched
    .filter((t) => canManageLinks && !isIngredientLinked(t.ingredient.id))
    .filter((t, idx, arr) => arr.findIndex((x) => x.ingredient.id === t.ingredient.id) === idx)

  const inputsDrifted = analyzedKey !== null && currentKey !== analyzedKey

  return (
    <section className="formula-preview" aria-labelledby="formula-preview-title">
      <div className="formula-preview__header">
        <h2 className="ui-title-sm" id="formula-preview-title">
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
              <ul role="list" className="ui-wrap-list" aria-label="Ingrédients reliés au catalogue">
                {matched.map((t) => {
                  const ing = t.ingredient
                  return (
                    <li
                      key={`${t.raw}-${ing.id}`}
                      className="formula-preview__chip formula-preview__chip--matched"
                    >
                      <span className="formula-preview__chip-name">{ing.name}</span>
                      <FormulaPreviewAction
                        canManageLinks={canManageLinks}
                        added={isIngredientLinked(ing.id)}
                        label={`Ajouter ${ing.name} aux ingrédients`}
                        onAdd={() => onAddIngredient(ing.id, ing.name)}
                      />
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

          <UnlinkedTokensGroup
            title="Reconnus, pas encore de fiche"
            listLabel="Ingrédients reconnus sans fiche"
            chipModifier="known"
            tokens={knownNoRecord}
            microcopy="Ces ingrédients sont identifiés mais n'ont pas encore de fiche dans le catalogue."
          />

          <UnlinkedTokensGroup
            title="Non reconnus"
            listLabel="Ingrédients non reconnus"
            chipModifier="unknown"
            tokens={unknown}
            microcopy="Peut-être une variante d'orthographe ou un nom commercial. La liste reste enregistrée telle quelle."
          />

          {result.autoTagEligible ? (
            <div className="formula-preview__group">
              <h3 className="formula-preview__group-title">
                Tags suggérés d&apos;après la formule
              </h3>
              {result.suggestedTags.length === 0 ? (
                <p className="formula-preview__microcopy">Aucun tag suggéré pour cette liste.</p>
              ) : (
                <>
                  <ul role="list" className="ui-wrap-list" aria-label="Tags suggérés">
                    {result.suggestedTags.map((st) => {
                      const tag = tagsBySlug.get(st.tagSlug)
                      if (!tag) return null
                      return (
                        <li
                          key={st.tagSlug}
                          className="formula-preview__chip formula-preview__chip--tag"
                        >
                          <span className="formula-preview__chip-name">
                            {st.tagSlug === 'peau-sensible'
                              ? getProductTagLabel(st.tagSlug, st.source)
                              : tag.label}
                          </span>
                          {st.relevance === 'primary' && (
                            <span className="formula-preview__badge">principal</span>
                          )}
                          {st.relevance === 'avoid' && (
                            <span className="formula-preview__badge formula-preview__badge--signale">
                              signalé
                            </span>
                          )}
                          <FormulaPreviewAction
                            canManageLinks={canManageLinks}
                            added={selectedTagIdSet.has(tag.id)}
                            label={`Ajouter le tag ${st.tagSlug === 'peau-sensible' ? getProductTagLabel(st.tagSlug, st.source) : tag.label}`}
                            onAdd={() => onApplyTag(tag.id, st.relevance)}
                          />
                        </li>
                      )
                    })}
                  </ul>
                  <p className="formula-preview__microcopy">
                    Suggestions issues de la lecture de la liste.
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

function UnlinkedTokensGroup({
  title,
  listLabel,
  chipModifier,
  tokens,
  microcopy,
}: {
  title: string
  listLabel: string
  chipModifier: 'known' | 'unknown'
  tokens: readonly Token[]
  microcopy: string
}) {
  if (tokens.length === 0) return null
  return (
    <div className="formula-preview__group">
      <h3 className="formula-preview__group-title">
        {title} <span className="formula-preview__count">{tokens.length}</span>
      </h3>
      <ul role="list" className="ui-wrap-list" aria-label={listLabel}>
        {tokens.map((t) => (
          <li
            key={t.raw}
            className={`formula-preview__chip formula-preview__chip--${chipModifier}`}
          >
            {t.raw}
          </li>
        ))}
      </ul>
      <p className="formula-preview__microcopy">{microcopy}</p>
    </div>
  )
}

function FormulaPreviewAction({
  canManageLinks,
  added,
  label,
  onAdd,
}: {
  canManageLinks: boolean
  added: boolean
  label: string
  onAdd: () => void
}) {
  if (!canManageLinks) return null
  if (added) return <span className="formula-preview__chip-added">Ajouté</span>
  return (
    <Button type="button" variant="ghost" size="sm" aria-label={label} onClick={onAdd}>
      + Ajouter
    </Button>
  )
}
