import { HeroBase } from './HeroBase'
import { HeroChaos } from './HeroChaos'
import { HeroWiki } from './HeroWiki'

export type HeroVariant = 'base' | 'chaos' | 'wiki'

export type HeroProps = {
  /** Default 'base'. Switch to compare hero positioning. */
  variant?: HeroVariant
}

/**
 * Picker — Hero A by default (Base personnelle, recommended).
 * Switch via prop to explore the editorial (chaos) or wiki framings.
 */
export function Hero({ variant = 'base' }: HeroProps) {
  if (variant === 'chaos') return <HeroChaos />
  if (variant === 'wiki') return <HeroWiki />
  return <HeroBase />
}

export { HeroBase } from './HeroBase'
export { HeroChaos } from './HeroChaos'
export type { HeroAction, HeroShellProps } from './HeroShell'
export { HeroShell } from './HeroShell'
export { HeroWiki } from './HeroWiki'
