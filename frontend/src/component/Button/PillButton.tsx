import { Link, type LinkProps } from '@tanstack/react-router'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import './PillButton.css'

type PillButtonProps = {
  children: ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'accent'
} & (
  | { to: string; params?: LinkProps['params']; search?: LinkProps['search'] }
  | { onClick?: () => void; type?: 'button' | 'submit' }
)

export function PillButton(props: PillButtonProps) {
  const { children, className, variant = 'default' } = props

  const classes = clsx('pill-button', `pill-button--${variant}`, className)

  if ('to' in props) {
    return (
      <Link to={props.to as never} params={props.params} search={props.search} className={classes}>
        {children}
      </Link>
    )
  }

  const { onClick, type = 'button' } = props
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
