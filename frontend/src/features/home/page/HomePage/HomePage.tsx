import { useSession } from '@/lib/auth/session'
import { Footer } from '../../components/Footer/Footer'
import { HomeHub } from './HomeHub'
import { HomeMarketing } from './HomeMarketing'
import { HomeSkeleton } from './HomeSkeleton'

import './HomePage.css'

// Dual-audience route (ADR 0011): same "/" for everyone, no redirect/guard.
// Auth changes what the page shows, never whether it is reachable.
export function HomePage() {
  const session = useSession()
  const showSkeleton =
    session.status === 'pending' ||
    (session.status === 'authenticated' && session.credential === 'restoring')

  return (
    <div className="aur-page">
      <div>
        {showSkeleton ? (
          <HomeSkeleton />
        ) : session.status === 'authenticated' ? (
          <HomeHub />
        ) : (
          <HomeMarketing />
        )}
      </div>
      <Footer />
    </div>
  )
}
