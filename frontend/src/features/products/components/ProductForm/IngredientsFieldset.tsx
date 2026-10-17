import type { IngredientType, ProductConcentrationUnit } from '@aurore/shared'

import { Trash2 } from 'lucide-react'
import { useId } from 'react'

import { Button } from '@/component/Button/Button'
import { IngredientSearch } from '@/features/products/components/IngredientSearch/IngredientSearch'
import { DoseField } from '@/features/products/components/ProductForm/DoseField'
import { ingredientDraftError } from './ingredientDraft'

export type IngredientItem = {
  ingredientId: string
  ingredientName: string
  concentrationValue: string
  concentrationUnit: ProductConcentrationUnit | ''
  concentrationPer?: string | null
  notes?: string | null
}

type Props = {
  mode: 'create' | 'edit'
  items: IngredientItem[]
  onPersist: (
    ingredientId: string,
    next: { value: string; unit: ProductConcentrationUnit | '' }
  ) => void
  onRemove: (ingredientId: string) => void
  onAdd: (ingredientId: string, ingredientName: string) => void
  ingredientType: IngredientType
}

export function IngredientsFieldset({
  mode,
  items,
  ingredientType,
  onPersist,
  onRemove,
  onAdd,
}: Props) {
  return (
    <fieldset className="form-field">
      <legend className="form-field__label">Ingrédients</legend>
      <div className="product-edit-ingredients">
        {items.length === 0 && (
          <p className="product-edit-ingredients__empty">
            {mode === 'edit' ? 'Aucun ingrédient associé.' : 'Aucun ingrédient ajouté.'}
          </p>
        )}
        {items.map((ingredient) => (
          <IngredientRow
            key={ingredient.ingredientId}
            ingredient={ingredient}
            onChange={(next) => onPersist(ingredient.ingredientId, next)}
            onRemove={() => onRemove(ingredient.ingredientId)}
          />
        ))}
      </div>
      <IngredientSearch
        type={ingredientType}
        existingIds={items.map((item) => item.ingredientId)}
        onAdd={onAdd}
      />
    </fieldset>
  )
}

function IngredientRow({
  ingredient,
  onChange,
  onRemove,
}: {
  ingredient: IngredientItem
  onChange: (next: { value: string; unit: ProductConcentrationUnit | '' }) => void
  onRemove: () => void
}) {
  const errorId = useId()
  const error = ingredientDraftError(ingredient)
  return (
    <div>
      <div className="product-edit-ingredient">
        <span className="product-edit-ingredient__name">{ingredient.ingredientName}</span>
        <DoseField
          value={ingredient.concentrationValue}
          unit={ingredient.concentrationUnit}
          onValueChange={(value) => onChange({ value, unit: ingredient.concentrationUnit })}
          onUnitChange={(unit) => onChange({ value: ingredient.concentrationValue, unit })}
          valueAriaLabel={`Dose de ${ingredient.ingredientName}`}
          unitAriaLabel={`Unité pour ${ingredient.ingredientName}`}
          errorId={error ? errorId : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="product-edit-ingredient__remove"
          aria-label={`Retirer ${ingredient.ingredientName}`}
          onClick={onRemove}
        >
          <Trash2 size={14} aria-hidden="true" />
        </Button>
      </div>
      {error && (
        <p id={errorId} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
