import { useSuspenseQuery } from '@tanstack/react-query'
import { Package, Target } from 'lucide-react'

import { profileQueries } from '../../../../lib/queries/profile'
import './ProfileStats.css'

export const ProfileStats = () => {
  const { data: stats } = useSuspenseQuery(profileQueries.stats())

  const statItems = [
    {
      label: 'Habitudes actives',
      value: stats.totalHabits,
      icon: <Target className="stat-icon--habits" size={20} />,
      description: 'Tes routines actuelles',
    },
    {
      label: 'Produits',
      value: stats.totalProducts,
      icon: <Package className="stat-icon--products" size={20} />,
      description: 'Dans ta collection',
    },
  ]

  return (
    <div className="profile-stats-grid">
      {statItems.map((item) => (
        <div key={item.label} className="stat-card">
          <div className="stat-card__header">
            <span className="stat-card__label">{item.label}</span>
            <div className="stat-card__icon-wrapper">{item.icon}</div>
          </div>
          <div className="stat-card__body">
            <span className="stat-card__value">{item.value}</span>
            <span className="stat-card__desc">{item.description}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
