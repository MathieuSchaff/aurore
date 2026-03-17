import clsx from 'clsx'

interface StockBadgeProps {
  qty: number
  usagesPerDay: number
  unit: string
}

export function StockBadge({ qty, usagesPerDay, unit }: StockBadgeProps) {
  if (qty <= 0) {
    return <span className={clsx('stock-badge', 'stock-badge--danger')}>Épuisé</span>
  }

  const daysLeft = Math.floor(qty / Math.max(usagesPerDay, 1))

  const level =
    daysLeft < 2 ? 'danger' : daysLeft < 7 ? 'warning' : 'ok'

  return (
    <span className={clsx('stock-badge', `stock-badge--${level}`)}>
      {daysLeft}j · {qty} {unit}
    </span>
  )
}
