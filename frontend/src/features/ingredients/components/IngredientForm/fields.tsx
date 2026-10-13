import { INGREDIENT_CATEGORIES_BY_TYPE, type IngredientType } from '@aurore/shared'

import { ClipboardCopy } from 'lucide-react'
import { useCallback } from 'react'

import { FormField } from '@/component/Input/FormField/FormField'
import { Input } from '@/component/Input/Input'
import { Select } from '@/component/Input/Select/Select'
import { Textarea } from '@/component/Input/Textarea/Textarea'
import { INGREDIENT_GROUP_LABELS } from '@/constants/ingredientGroups'
import type {
  IngredientFormData,
  IngredientFormFieldKey,
} from '@/features/ingredients/hooks/useIngredientFormSubmit'

type DraftProps = {
  fieldKey: IngredientFormFieldKey
  conflict: { draft: IngredientFormData } | null
  onRestoreField: (key: IngredientFormFieldKey) => void
}

function pickDraft(
  value: string,
  conflict: { draft: IngredientFormData } | null,
  fieldKey: IngredientFormFieldKey
): string | undefined {
  const draft = conflict?.draft[fieldKey]
  if (draft === undefined || draft === value) return undefined
  return draft
}

type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void

export function IngredientCategoryField({
  value,
  ingredientType,
  onValueChange,
  conflict,
  onRestoreField,
}: {
  value: string
  ingredientType: IngredientType
  onValueChange: (value: string) => void
} & Omit<DraftProps, 'fieldKey'>) {
  const options = INGREDIENT_CATEGORIES_BY_TYPE[ingredientType].map((category) => ({
    value: category,
    label: INGREDIENT_GROUP_LABELS[category],
  }))
  const invalid = !!value && !options.some((option) => option.value === value)
  return (
    <div>
      <Select
        label="Catégorie"
        id="ingredient-category"
        value={value}
        onValueChange={onValueChange}
        placeholder="Sans catégorie"
        options={invalid ? [{ value, label: value, disabled: true }, ...options] : options}
        error={invalid ? 'Choisis une catégorie compatible avec le type sélectionné.' : undefined}
      />
      <DraftHint
        fieldKey="category"
        label="Catégorie"
        value={pickDraft(value, conflict, 'category')}
        onRestoreField={onRestoreField}
      />
    </div>
  )
}

export function IngredientInputField({
  label,
  id,
  value,
  onChange,
  placeholder,
  hint,
  required,
  autoFocus,
  fieldError,
  fieldKey,
  conflict,
  onRestoreField,
}: {
  label: string
  id: string
  value: string
  onChange: ChangeHandler
  placeholder?: string
  hint?: string
  required?: boolean
  autoFocus?: boolean
  fieldError?: string
} & DraftProps) {
  return (
    <FormField label={label} htmlFor={id} required={required} hint={hint}>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        error={fieldError}
      />
      <DraftHint
        fieldKey={fieldKey}
        label={label}
        value={pickDraft(value, conflict, fieldKey)}
        onRestoreField={onRestoreField}
      />
    </FormField>
  )
}

export function IngredientTextareaField({
  label,
  id,
  value,
  onChange,
  placeholder,
  rows,
  hint,
  fieldKey,
  conflict,
  onRestoreField,
}: {
  label: string
  id: string
  value: string
  onChange: ChangeHandler
  placeholder?: string
  rows?: number
  hint?: string
} & DraftProps) {
  return (
    <>
      <Textarea
        label={label}
        id={id}
        hint={hint}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      />
      <DraftHint
        fieldKey={fieldKey}
        label={label}
        value={pickDraft(value, conflict, fieldKey)}
        onRestoreField={onRestoreField}
      />
    </>
  )
}

function DraftHint({
  fieldKey,
  label,
  value,
  onRestoreField,
}: {
  fieldKey: IngredientFormFieldKey
  label: string
  value: string | undefined
  onRestoreField: (key: IngredientFormFieldKey) => void
}) {
  const restoreField = useCallback(() => onRestoreField(fieldKey), [fieldKey, onRestoreField])
  if (value === undefined) return null
  return (
    <div className="draft-hint">
      <div className="draft-hint__header">
        <span className="draft-hint__label">Ton brouillon ({label})</span>
        <button type="button" className="draft-hint__restore" onClick={restoreField}>
          <ClipboardCopy size={12} />
          Restaurer
        </button>
      </div>
      <pre className="draft-hint__value">{value || '(vide)'}</pre>
    </div>
  )
}
