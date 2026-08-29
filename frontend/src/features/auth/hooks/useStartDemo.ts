import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { useDemo } from '@/lib/queries/auth'

export function useStartDemo() {
  const demo = useDemo()
  const navigate = useNavigate()
  const [redirecting, setRedirecting] = useState(false)

  const startDemo = () => {
    setRedirecting(true)
    // Not a mutate() callback: those are dropped when the caller unmounts, and the
    // home swaps HomeMarketing for the hub as soon as the session installs, before
    // the redirect had a chance to run. Stay in the SPA: the first protected-route
    // check needs the access token returned by the demo request.
    demo.mutateAsync(undefined).then(
      () => navigate({ to: '/collection' }),
      () => setRedirecting(false)
    )
  }

  return { startDemo, isPending: demo.isPending || redirecting }
}
