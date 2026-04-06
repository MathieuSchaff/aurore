import { useEffect, useRef } from 'react'

import type { Variant } from '../../store/theme'
import { useThemeStore } from '../../store/theme'
import './DevThemeSwitcher.css'

const VARIANTS: Array<{ value: Variant; label: string; color: string }> = [
  { value: 'bleu', label: 'Bleu', color: 'oklch(55% 0.2 260)' },
  { value: 'terracota', label: 'Terra', color: 'oklch(52% 0.13 32)' },
  { value: 'foret', label: 'Forêt', color: 'oklch(40% 0.16 140)' },
  { value: 'ardoise', label: 'Ardoise', color: 'oklch(35% 0.12 240)' },
  { value: 'vivid', label: 'Vivid', color: 'oklch(52% 0.22 145)' },
]

export function DevThemeSwitcher() {
  const { theme, variant, toggle, setVariant } = useThemeStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.showPopover()
  }, [])

  return (
    <div ref={ref} className="dev-theme-switcher" popover="manual">
      <button
        type="button"
        className="dev-theme-switcher__btn"
        aria-pressed={theme === 'light'}
        onClick={() => theme === 'dark' && toggle()}
      >
        ☀️ Light
      </button>
      <button
        type="button"
        className="dev-theme-switcher__btn"
        aria-pressed={theme === 'dark'}
        onClick={() => theme === 'light' && toggle()}
      >
        🌙 Dark
      </button>

      <div className="dev-theme-switcher__sep" />

      {VARIANTS.map((v) => (
        <button
          key={v.value}
          type="button"
          className="dev-theme-switcher__btn"
          aria-pressed={variant === v.value}
          onClick={() => setVariant(v.value)}
        >
          <span className="dev-theme-switcher__dot" style={{ backgroundColor: v.color }} />
          {v.label}
        </button>
      ))}
    </div>
  )
}
