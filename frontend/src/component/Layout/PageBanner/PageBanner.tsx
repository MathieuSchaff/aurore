import type { ReactNode } from 'react'
import './PageBanner.css'

interface PageBannerProps {
  children?: ReactNode
  className?: string
}

export function PageBanner({ children, className = '' }: PageBannerProps) {
  return <div className={`page-banner-component ${className}`}>{children}</div>
}
