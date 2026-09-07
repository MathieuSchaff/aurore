import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { useDemo } from '@/lib/queries/auth'

export function useStartDemo() {
  const demo = useDemo()
  const navigate = useNavigate()
  const [redirecting, setRedirecting] = useState(false)

  const startDemo = () =>
    demo.mutate(undefined, {
      onSuccess: () => {
        setRedirecting(true)
        // Stay in the SPA: the first protected-route check needs the access
        // token returned by the demo request
        navigate({ to: '/collection' })
      },
    })

  return { startDemo, isPending: demo.isPending || redirecting }
}
