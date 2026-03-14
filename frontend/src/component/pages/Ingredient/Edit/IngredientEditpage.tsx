import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save, Trash2, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import {
  ingredientQueries,
  useUpdateIngredient,
  useUpdateIngredientTags,
} from '../../../../lib/queries/ingredients'
import { tagQueries } from '../../../../lib/queries/tags'
import './IngredientPageEditable.css'
import '../../../../styles/common/ingredients-shared.css'

const route = getRouteApi('/ingredients/$slug/edit')

export function IngredientEditPage() {
  const { slug } = route.useParams()
  const { data: ingredient } = useSuspenseQuery(ingredientQueries.bySlug(slug))
  const { data: currentTags } = useSuspenseQuery(ingredientQueries.tags(ingredient.id))
  const { data: allTags } = useQuery(tagQueries.list())
  const updateIngredient = useUpdateIngredient()
  const updateTags = useUpdateIngredientTags()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: ingredient.name ?? '',
    category: ingredient.category ?? '',
    description: ingredient.description ?? '',
    content: ingredient.content ?? '',
  })

  const [tags, setTags] = useState(
    currentTags.map((t) => ({
      tagId: t.tagId,
      tagName: t.tagName,
      relevance: t.relevance || 'secondary',
    }))
  )

  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback(
    (field: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
        setError(null)
      },
    []
  )

  const handleAddTag = (tagId: string) => {
    const tag = allTags?.find((t) => t.id === tagId)
    if (tag && !tags.find((t) => t.tagId === tagId)) {
      setTags((prev) => [...prev, { tagId, tagName: tag.name, relevance: 'secondary' }])
    }
  }

  const handleRemoveTag = (tagId: string) => {
    setTags((prev) => prev.filter((t) => t.tagId !== tagId))
  }
  const handleUpdateRelevance = (tagId: string, relevance: 'primary' | 'secondary' | 'avoid') => {
    setTags((prev) => prev.map((t) => (t.tagId === tagId ? { ...t, relevance } : t)))
  }
  const handleSubmit = useCallback(
    async (e: React.SubmitEvent) => {
      e.preventDefault()

      if (!form.name.trim()) {
        setError("Le nom de l'ingrédient est obligatoire.")
        return
      }

      try {
        const [updated] = await Promise.all([
          updateIngredient.mutateAsync({
            id: ingredient.id,
            data: {
              name: form.name.trim(),
              category: form.category.trim() || null,
              description: form.description.trim(),
              content: form.content.trim(),
            },
          }),
          updateTags.mutateAsync({
            ingredientId: ingredient.id,
            tags: tags.map((t) => ({ tagId: t.tagId, relevance: t.relevance })),
          }),
        ])
        navigate({ to: '/ingredients/$slug', params: { slug: updated.slug } })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Une erreur est survenue lors de la sauvegarde.'
        )
      }
    },
    [form, ingredient.id, updateIngredient, updateTags, tags, navigate]
  )

  const availableTags = useMemo(() => {
    return allTags?.filter((at) => !tags.find((t) => t.tagId === at.id)) ?? []
  }, [allTags, tags])

  const sortedTagsKey = (arr: { id: string; r: string }[]) =>
    JSON.stringify([...arr].sort((a, b) => a.id.localeCompare(b.id)))

  const isDirty =
    form.name !== (ingredient.name ?? '') ||
    form.category !== (ingredient.category ?? '') ||
    form.description !== (ingredient.description ?? '') ||
    form.content !== (ingredient.content ?? '') ||
    sortedTagsKey(tags.map((t) => ({ id: t.tagId, r: t.relevance }))) !==
      sortedTagsKey(currentTags.map((t) => ({ id: t.tagId, r: t.relevance })))
  return (
    <div className="ingredient-edit-page">
      <div className="ingredient-edit-page__banner" />

      <div className="ingredient-edit-page__content">
        <div className="ingredient-edit-page__topbar">
          <Link to="/ingredients/$slug" params={{ slug }} className="ingredient-edit-page__back">
            <ArrowLeft size={16} />
            Retour
          </Link>
          <h1 className="ingredient-edit-page__title">Modifier l'ingrédient</h1>
        </div>

        <form className="ingredient-edit-form" onSubmit={handleSubmit}>
          {error && <div className="ingredient-edit-form__error">{error}</div>}

          <div className="ingredient-edit-form__field">
            <label className="ingredient-edit-form__label" htmlFor="edit-name">
              Nom <span className="ingredient-edit-form__required">*</span>
            </label>
            <input
              id="edit-name"
              className="ingredient-edit-form__input"
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Nom de l'ingrédient"
              // biome-ignore lint: autofocus ok
              autoFocus
            />
          </div>

          <div className="ingredient-edit-form__field">
            <label className="ingredient-edit-form__label" htmlFor="edit-category">
              Catégorie
            </label>
            <input
              id="edit-category"
              className="ingredient-edit-form__input"
              type="text"
              value={form.category}
              onChange={handleChange('category')}
              placeholder="Ex : Actif, Émollient, Conservateur…"
            />
          </div>

          <div className="ingredient-edit-form__field">
            <label className="ingredient-edit-form__label" htmlFor="edit-tags">
              Tags
            </label>
            <div className="ingredient-edit-tags">
              {tags.map((tag) => (
                <div key={tag.tagId} className={`edit-tag edit-tag--${tag.relevance}`}>
                  <span className="edit-tag__name">{tag.tagName}</span>
                  <select
                    value={tag.relevance}
                    className="edit-tag__relevance"
                    onChange={(e) =>
                      handleUpdateRelevance(
                        tag.tagId,
                        e.target.value as 'primary' | 'secondary' | 'avoid'
                      )
                    }
                  >
                    <option value="primary">Principal</option>
                    <option value="secondary">Secondaire</option>
                    <option value="avoid">À éviter</option>
                  </select>
                  <button
                    type="button"
                    className="edit-tag__remove"
                    onClick={() => handleRemoveTag(tag.tagId)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="ingredient-edit-add-tag">
              <select
                className="ingredient-edit-form__input"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddTag(e.target.value)
                    e.target.value = ''
                  }
                }}
                value=""
              >
                <option value="" disabled>
                  Ajouter un tag...
                </option>
                {availableTags.map((tag: any) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name} ({tag.category ?? 'Sans catégorie'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ingredient-edit-form__field">
            <label className="ingredient-edit-form__label" htmlFor="edit-description">
              Description
            </label>
            <textarea
              id="edit-description"
              className="ingredient-edit-form__textarea"
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Description de l'ingrédient (Markdown supporté)"
              rows={5}
            />
            <span className="ingredient-edit-form__hint">Markdown supporté</span>
          </div>

          <div className="ingredient-edit-form__field">
            <label className="ingredient-edit-form__label" htmlFor="edit-content">
              Contenu
            </label>
            <textarea
              id="edit-content"
              className="ingredient-edit-form__textarea"
              value={form.content}
              onChange={handleChange('content')}
              placeholder="Contenu détaillé (Markdown supporté)"
              rows={8}
            />
            <span className="ingredient-edit-form__hint">Markdown supporté</span>
          </div>

          <div className="ingredient-edit-form__actions">
            <Link
              to="/ingredients/$slug"
              params={{ slug }}
              className="ingredient-edit-form__btn ingredient-edit-form__btn--cancel"
            >
              <X size={16} />
              Annuler
            </Link>
            <button
              type="submit"
              className="ingredient-edit-form__btn ingredient-edit-form__btn--save"
              disabled={updateIngredient.isPending || updateTags.isPending || !isDirty}
            >
              <Save size={16} />
              {updateIngredient.isPending || updateTags.isPending
                ? 'Enregistrement…'
                : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
