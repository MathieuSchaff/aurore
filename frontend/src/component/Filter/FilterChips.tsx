import { useState } from 'react'

import type { FilterOption, GroupedFilterField } from './types'

// Shows a limited number of chips, with a "Voir tout" button to expand.
// Useful when a sub-group has 50+ options and we don't want to flood the UI.
export function ChipsWithLimit({
  options,
  selected,
  onToggle,
  maxVisible,
  isAccordionOpen,
  escapeHandler,
}: {
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
  maxVisible?: number
  isAccordionOpen: boolean
  escapeHandler: (e: React.KeyboardEvent) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const limit = maxVisible ?? options.length
  const visibleOptions = expanded ? options : options.slice(0, limit)
  const hiddenCount = options.length - limit

  return (
    <>
      {visibleOptions.map((opt) => {
        const isSelected = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            className={`filter-chip ${isSelected ? 'filter-chip--active' : ''}`}
            onClick={() => onToggle(opt.value)}
            aria-pressed={isSelected}
            onKeyDown={escapeHandler}
            tabIndex={isAccordionOpen ? 0 : -1}
          >
            {opt.label}
          </button>
        )
      })}
      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          className="filter-chip filter-chip--more"
          onClick={() => setExpanded(true)}
          tabIndex={isAccordionOpen ? 0 : -1}
        >
          Voir tout ({options.length})
        </button>
      )}
    </>
  )
}

// When a filter field has sub-groups (e.g. "Vitamins" > "A, B, C"),
// we render each sub-group with its own label and chip limit.
export function SubGroupedChips<T extends string>({
  field,
  selected,
  onToggle,
  isAccordionOpen,
  escapeHandler,
}: {
  field: GroupedFilterField<T>
  selected: string[]
  onToggle: (value: string) => void
  isAccordionOpen: boolean
  escapeHandler: (e: React.KeyboardEvent) => void
}) {
  if (!field.subGroups) {
    return (
      <fieldset className="filter-drawer__chips">
        <legend className="sr-only">Options pour {field.label}</legend>
        <ChipsWithLimit
          options={field.options}
          selected={selected}
          onToggle={onToggle}
          isAccordionOpen={isAccordionOpen}
          escapeHandler={escapeHandler}
        />
      </fieldset>
    )
  }

  const optionsBySlug = new Map(field.options.map((o) => [o.value, o]))

  return (
    <div className="filter-subgroups">
      {field.subGroups.map((sg) => {
        const sgOptions = sg.slugs
          .map((slug) => optionsBySlug.get(slug))
          .filter((o): o is FilterOption => o != null)
        if (sgOptions.length === 0) return null
        return (
          <fieldset key={sg.label} className="filter-subgroup">
            <legend className="filter-subgroup__label">{sg.label}</legend>
            <div className="filter-drawer__chips">
              <ChipsWithLimit
                options={sgOptions}
                selected={selected}
                onToggle={onToggle}
                maxVisible={sg.maxVisible}
                isAccordionOpen={isAccordionOpen}
                escapeHandler={escapeHandler}
              />
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}
