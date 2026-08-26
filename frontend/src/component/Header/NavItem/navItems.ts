import type { LinkProps } from '@tanstack/react-router'
import type { LucideProps } from 'lucide-react'
import { BookOpen, CircleUserRound, Columns2, FlaskConical } from 'lucide-react'

import { ChestIcon, HomeIcon, ProductNavIcon } from '@/assets/icons'

export interface NavItem {
  to: LinkProps['to']
  icon: React.ComponentType<LucideProps>
  label: string
  // Signed in links point to guarded routes
  // Hiding them after logout avoids advertising a login wall
  visibility?: 'authed' | 'anon'
}

export const navItems: NavItem[] = [
  { to: '/', icon: HomeIcon, label: 'Accueil', visibility: 'anon' },
  { to: '/products', icon: ProductNavIcon, label: 'Produits' },
  { to: '/ingredients', icon: FlaskConical, label: 'Ingrédients' },
  { to: '/collection', icon: ChestIcon, label: 'Collection', visibility: 'authed' },
  { to: '/products/compare', icon: Columns2, label: 'Comparaisons', visibility: 'authed' },
  // /profile is the authoritative screen for declared preferences, so it gets a
  // permanent nav entry instead of living only in the avatar menu. Accepted cost: a denser bar.
  { to: '/profile', icon: CircleUserRound, label: 'Profil', visibility: 'authed' },
  { to: '/blog', icon: BookOpen, label: 'Blog' },
]
