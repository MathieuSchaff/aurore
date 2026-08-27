import { Link } from '@tanstack/react-router'

import { useSession } from '../../../../lib/auth/session'
import './DemoBanner.css'

export function DemoBanner() {
  const session = useSession()
  const isDemo = session.status === 'authenticated' && session.user.isDemo
  if (!isDemo) return null
  return (
    <div className="demo-banner" role="status">
      <span>Mode démo — les données seront perdues à la déconnexion.</span>{' '}
      <Link to="/auth/signup" className="demo-banner__cta">
        Créer un compte pour les garder
      </Link>
    </div>
  )
}
