import { useSuspenseQuery } from '@tanstack/react-query'
import { Package } from 'lucide-react'

import { profileQueries } from '../../../../lib/queries/profile'
import './ProfileStats.css'

export const ProfileStats = () => {
  const { data: stats } = useSuspenseQuery(profileQueries.stats())

  const statItems = [
    {
      label: 'Produits',
      value: stats.totalProducts,
      icon: <Package className="stat-icon--products" size={20} />,
      description: 'Dans votre collection',
    },
  ]

  return (
    <ul className="profile-stats-grid" aria-label="Statistiques du profil">
      {statItems.map((item) => (
        <li key={item.label} className="stat-card" aria-label={`${item.label} : ${item.value}`}>
          <div className="stat-card__header">
            <span className="stat-card__label">{item.label}</span>
            <div className="stat-card__icon-wrapper" aria-hidden="true">
              {item.icon}
            </div>
          </div>
          <div className="stat-card__body">
            <span className="stat-card__value">{item.value}</span>
            <span className="stat-card__desc">{item.description}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
