import type { ReactNode } from 'react'
import './PrivacySummaryCard.css'

export function PrivacySummaryCard({
  icon,
  title,
  children,
}: {
  icon: string
  title: ReactNode
  children: ReactNode
}) {
  return (
    <div className="privacy-summary__card">
      <div className="privacy-summary__card-head">
        <span className="privacy-summary__icon" aria-hidden="true">
          {icon}
        </span>
        <h3 className="privacy-summary__card-title ui-title-sm">{title}</h3>
      </div>
      <p>{children}</p>
    </div>
  )
}
