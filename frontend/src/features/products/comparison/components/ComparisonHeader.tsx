import { type FormEvent, useEffect, useId, useRef } from 'react'

import { FormActions } from '@/component/Input/FormActions/FormActions'
import { Input } from '@/component/Input/Input'
import './ComparisonHeader.css'

type Props = {
  name: string
  onNameChange: (s: string) => void
  count: number
  onSave?: () => void
  onCancel?: () => void
  canSave: boolean
  isPending?: boolean
  isNameDisabled?: boolean
  submitLabel?: string
  nameStatus?: string
}

export function ComparisonHeader({
  name,
  onNameChange,
  count,
  onSave,
  onCancel,
  canSave,
  isPending,
  isNameDisabled = isPending,
  submitLabel = 'Enregistrer',
  nameStatus,
}: Props) {
  const statusId = useId()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const wasPendingRef = useRef(!!isPending)

  useEffect(() => {
    const finished = wasPendingRef.current && !isPending
    wasPendingRef.current = !!isPending
    // Disabled submit buttons can leave focus on BODY or retain it while unusable
    const active = document.activeElement
    const disabledSubmit =
      active instanceof HTMLButtonElement &&
      active.disabled &&
      active.form === nameInputRef.current?.form
    if (finished && document.hasFocus() && (active === document.body || disabledSubmit)) {
      nameInputRef.current?.focus({ preventScroll: true })
    }
  }, [isPending])
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave?.()
  }

  return (
    <header className="comparison-header">
      <form
        aria-label="Nom de la comparaison"
        className="comparison-header__form"
        onSubmit={handleSubmit}
      >
        <div className="comparison-header__name-wrap">
          <Input
            ref={nameInputRef}
            label="Nom de la comparaison (facultatif)"
            disabled={isNameDisabled}
            aria-describedby={nameStatus ? statusId : undefined}
            maxLength={120}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Nom de la comparaison (facultatif)"
          />
          {nameStatus && (
            <p
              id={statusId}
              role="status"
              aria-label="État du nom"
              className="comparison-header__status"
            >
              {nameStatus}
            </p>
          )}
        </div>
        <span className="comparison-header__count">
          {count} produit{count > 1 ? 's' : ''}
        </span>
        {onSave && (
          <div className="comparison-header__actions">
            <FormActions
              submitLabel={submitLabel}
              disabled={!canSave || isPending}
              isPending={isPending}
              onCancel={onCancel}
              separator={false}
            />
          </div>
        )}
      </form>
    </header>
  )
}
