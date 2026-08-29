import {
  PRODUCT_CONCENTRATION_UNIT_LABELS,
  PRODUCT_CONCENTRATION_UNIT_VALUES,
  type ProductConcentrationUnit,
} from '@aurore/shared'

import { useId } from 'react'

import './DoseField.css'

type DoseFieldProps = {
  value: string
  unit: ProductConcentrationUnit | ''
  onValueChange: (value: string) => void
  onUnitChange: (unit: ProductConcentrationUnit | '') => void
  onValueBlur?: () => void
  valueAriaLabel: string
  unitAriaLabel: string
}

const UNIT_OPTIONS = PRODUCT_CONCENTRATION_UNIT_VALUES.map((v) => ({
  value: v,
  label: PRODUCT_CONCENTRATION_UNIT_LABELS[v],
}))

// Bare input + select share one border/focus ring; <Input>/<Select> wrappers would split the pill.
export function DoseField({
  value,
  unit,
  onValueChange,
  onUnitChange,
  onValueBlur,
  valueAriaLabel,
  unitAriaLabel,
}: DoseFieldProps) {
  const id = useId()
  return (
    <div className="dose-field">
      <input
        id={`${id}-value`}
        className="dose-field__input"
        type="number"
        min={0}
        step={0.01}
        placeholder="—"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onBlur={onValueBlur}
        aria-label={valueAriaLabel}
      />
      <select
        id={`${id}-unit`}
        className="dose-field__unit"
        value={unit}
        onChange={(e) => onUnitChange(e.target.value as ProductConcentrationUnit | '')}
        aria-label={unitAriaLabel}
      >
        <option value="">—</option>
        {UNIT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
