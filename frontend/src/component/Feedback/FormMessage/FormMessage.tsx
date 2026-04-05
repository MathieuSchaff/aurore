import clsx from 'clsx'
import type { ReactNode } from 'react'

import './FormMessage.css'

type FormMessageProps = {
  variant: 'error' | 'success'
  children: ReactNode
}

export function FormMessage({ variant, children }: FormMessageProps) {
  return (
    <p
      className={clsx('form-message', `form-message--${variant}`)}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  )
}
