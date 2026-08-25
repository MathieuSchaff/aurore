import { Button } from '@/component/Button/Button'

type FilterTab<T extends string> = { value: T; label: string }

// These controls filter one list while tabs would imply panel keyboard behavior
export function AdminFilterTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: ReadonlyArray<FilterTab<T>>
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <fieldset className="admin-filter-bar">
      <legend className="sr-only">{label}</legend>
      {tabs.map((t) => (
        <Button
          key={t.value}
          variant="ghost"
          size="sm"
          aria-pressed={value === t.value}
          className={`admin-filter-bar__btn ${value === t.value ? 'is-active' : ''}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </Button>
      ))}
    </fieldset>
  )
}
