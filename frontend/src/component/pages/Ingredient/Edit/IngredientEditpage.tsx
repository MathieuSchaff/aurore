import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Save, X } from 'lucide-react'
import { useCallback, useState } from 'react'

import { ingredientQueries, useUpdateIngredient } from '../../../../lib/queries/ingredients'
import './IngredientPageEditable.css'
import '../../../../styles/common/ingredients-shared.css'

const route = getRouteApi('/ingredients/$slug/edit')

export function IngredientEditPage() {
  const { slug } = route.useParams()
  const { data: ingredient } = useSuspenseQuery(ingredientQueries.bySlug(slug))
  const updateIngredient = useUpdateIngredient()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: ingredient.name ?? '',
    category: ingredient.category ?? '',
    description: ingredient.description ?? '',
    content: ingredient.content ?? '',
  })

  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback(
    (field: keyof typeof form) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
        setError(null)
      },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.SubmitEvent) => {
      e.preventDefault()

      if (!form.name.trim()) {
        setError("Le nom de l'ingrédient est obligatoire.")
        return
      }

      try {
        const updated = await updateIngredient.mutateAsync({
          id: ingredient.id,
          data: {
            name: form.name.trim(),
            category: form.category.trim() || null,
            description: form.description.trim(),
            content: form.content.trim(),
          },
        })
        navigate({ to: '/ingredients/$slug', params: { slug: updated.slug } })
      } catch {
        setError('Une erreur est survenue lors de la sauvegarde.')
      }
    },
    [form, ingredient.id, updateIngredient, navigate]
  )

  const isDirty =
    form.name !== (ingredient.name ?? '') ||
    form.category !== (ingredient.category ?? '') ||
    form.description !== (ingredient.description ?? '') ||
    form.content !== (ingredient.content ?? '')

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
              disabled={updateIngredient.isPending || !isDirty}
            >
              <Save size={16} />
              {updateIngredient.isPending ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
