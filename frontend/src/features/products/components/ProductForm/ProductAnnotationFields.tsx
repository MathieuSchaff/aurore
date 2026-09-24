import type { ComponentProps } from 'react'

import { TagManager } from '@/component/Input/TagManager/TagManager'
import { Textarea } from '@/component/Input/Textarea/Textarea'
import { FormulaPreview } from '@/features/products/components/FormulaPreview/FormulaPreview'
import { IngredientsFieldset } from './IngredientsFieldset'
import type { ProductEditFormInput } from './ProductForm.schema'

type AnnotationField = 'inci' | 'description' | 'notes'

type ProductAnnotationFieldsProps = {
  canManageLinks: boolean
  form: Pick<
    ProductEditFormInput,
    AnnotationField | 'category' | 'kind' | 'name' | 'brand' | 'texture'
  >
  onChange: (field: AnnotationField) => ComponentProps<typeof Textarea>['onChange']
  allTags: ComponentProps<typeof FormulaPreview>['allTags']
  onApplyTag: ComponentProps<typeof FormulaPreview>['onApplyTag']
  tagManager: ComponentProps<typeof TagManager>
  ingredients: ComponentProps<typeof IngredientsFieldset>
}

export function ProductAnnotationFields({
  canManageLinks,
  form,
  onChange,
  allTags,
  onApplyTag,
  tagManager,
  ingredients,
}: ProductAnnotationFieldsProps) {
  return (
    <>
      <Textarea
        label="INCI"
        id="edit-inci"
        hint="Collez la liste complète, puis lancez l'analyse pour la relier au catalogue."
        value={form.inci}
        onChange={onChange('inci')}
        placeholder="Liste INCI des ingrédients…"
        rows={4}
      />

      {canManageLinks && (
        <FormulaPreview
          inci={form.inci}
          category={form.category}
          kind={form.kind}
          name={form.name}
          brand={form.brand}
          texture={form.texture}
          description={form.description}
          allTags={allTags}
          selectedTagIds={tagManager.tags.map((t) => t.tagId)}
          linkedIngredientIds={ingredients.items.map((i) => i.ingredientId)}
          onApplyTag={onApplyTag}
          onAddIngredient={ingredients.onAdd}
        />
      )}

      <Textarea
        label="Description"
        id="edit-description"
        hint="Markdown supporté"
        value={form.description}
        onChange={onChange('description')}
        placeholder="Description du produit (Markdown supporté)"
        rows={5}
      />

      <Textarea
        label="Notes"
        id="edit-notes"
        value={form.notes}
        onChange={onChange('notes')}
        placeholder="Notes personnelles sur ce produit…"
        rows={4}
      />

      {canManageLinks && (
        <fieldset className="form-field">
          <legend className="form-field__label">Tags</legend>
          <TagManager {...tagManager} />
        </fieldset>
      )}

      {canManageLinks && <IngredientsFieldset {...ingredients} />}
    </>
  )
}
