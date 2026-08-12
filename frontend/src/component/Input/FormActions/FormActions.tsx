import clsx from 'clsx'
import { Check, X } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '../../Button/Button'
import './FormActions.css'

type FormActionsProps = {
  onCancel?: () => void
  cancelLabel?: string
  submitLabel?: string
  isPending?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  // Form-footer separator rule; turn off when the actions sit inline in a header row.
  separator?: boolean
}

type FormActionsBarProps = {
  children: ReactNode
  className?: string
  separator?: boolean
}

export function FormActionsBar({ children, className, separator = true }: FormActionsBarProps) {
  return (
    <div className={clsx('form-actions-bar', !separator && 'form-actions-bar--bare', className)}>
      {children}
    </div>
  )
}

export function FormActions({
  onCancel,
  cancelLabel = 'Annuler',
  submitLabel = 'Enregistrer',
  isPending,
  disabled,
  size = 'md',
  separator = true,
}: FormActionsProps) {
  return (
    <FormActionsBar separator={separator}>
      {onCancel && (
        <Button type="button" variant="outline" size={size} onClick={onCancel} disabled={isPending}>
          <X size={size === 'sm' ? 14 : 16} />
          {cancelLabel}
        </Button>
      )}
      <Button type="submit" variant="primary" size={size} loading={isPending} disabled={disabled}>
        <Check size={size === 'sm' ? 14 : 16} />
        {submitLabel}
      </Button>
    </FormActionsBar>
  )
}
