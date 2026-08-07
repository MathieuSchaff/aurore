import type { ReactNode } from 'react'
import { vi } from 'vitest'

// Resolves TanStack `to`/`params` into a real <a href> so role/href assertions work.
export function LinkStub({
  to,
  params,
  className,
  children,
}: {
  to: string
  params?: Record<string, string>
  children: ReactNode
  className?: string
}) {
  const href = params
    ? Object.entries(params).reduce((acc, [k, v]) => acc.replace(`$${k}`, v), to)
    : to
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

// Button.tsx calls createLink at module load; stub so ButtonLink renders children.
export const createLinkStub = vi.fn(() =>
  vi.fn(({ children }: { children: ReactNode }) => children)
)
