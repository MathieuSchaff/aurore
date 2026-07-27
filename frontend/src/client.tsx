import { StartClient } from '@tanstack/react-start/client'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { installChunkReloadGuard } from './lib/chunkReload'
import { initFaro } from './lib/observability/faro'

initFaro()

installChunkReloadGuard({
  target: window,
  storage: () => sessionStorage,
  reload: () => {
    window.location.reload()
  },
  now: Date.now,
})

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>
  )
})
