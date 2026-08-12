import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'

import './FieldError.css'

type FieldErrorProps = {
  id?: string
  children: ReactNode
}

export function FieldError({ id, children }: FieldErrorProps) {
  return (
    <span id={id} className="field-error" role="alert">
      <AlertCircle size={16} />
      {children}
    </span>
  )
}
