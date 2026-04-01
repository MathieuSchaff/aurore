import { useAuthStore } from '../../../store/auth'
import './DemoBanner.css'

export function DemoBanner() {
  const isDemo = useAuthStore((s) => s.isDemo)
  if (!isDemo) return null
  return (
    <div className="demo-banner">⚡ Mode démo — les données seront perdues à la déconnexion</div>
  )
}
