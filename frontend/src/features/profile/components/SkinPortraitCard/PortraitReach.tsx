import type { UserDermoProfile } from '@aurore/shared'

import { Link } from '@tanstack/react-router'
import { Fragment } from 'react'

import {
  derivePortraitReach,
  PORTRAIT_SURFACE_LABEL,
  type PortraitSurfaceKey,
} from '../../portrait-reach'

// Explicit per key rather than a data-driven `to`: each route types its own
// search params, and a generic string would defeat the router's typing.
function SurfaceLink({ surface }: { surface: PortraitSurfaceKey }) {
  const label = PORTRAIT_SURFACE_LABEL[surface]
  const className = 'portrait-reach__link'

  switch (surface) {
    case 'formulas':
    case 'catalogue':
      return (
        <Link to="/products" className={className}>
          {label}
        </Link>
      )
    case 'motifs':
      return (
        <Link to="/collection/motifs" className={className}>
          {label}
        </Link>
      )
    case 'ingredients':
      return (
        <Link to="/ingredients" search={{ profile_filter: true }} className={className}>
          {label}
        </Link>
      )
    case 'feed':
      return (
        <Link to="/feed" className={className}>
          {label}
        </Link>
      )
    case 'people':
      return (
        <Link to="/profile" search={{ tab: 'people' }} className={className}>
          {label}
        </Link>
      )
  }
}

// Names and links the screens this portrait actually feeds. The card was a
// dead end: it described its content, never its effect, and the only sentences
// about what the app does with it lived on the home page.
export function PortraitReach({ dermo }: { dermo: UserDermoProfile | null | undefined }) {
  const surfaces = derivePortraitReach(dermo)
  if (surfaces.length === 0) return null

  return (
    <p className="portrait-reach">
      <span className="portrait-reach__intro">Ce portrait sert ici :</span>{' '}
      {surfaces.map((surface, i) => (
        <Fragment key={surface}>
          {i > 0 && <span className="portrait-reach__sep"> · </span>}
          <SurfaceLink surface={surface} />
        </Fragment>
      ))}
    </p>
  )
}
