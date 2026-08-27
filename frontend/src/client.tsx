import { RouterProvider } from '@tanstack/react-router'
import { hydrateStart } from '@tanstack/react-start/client'
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

async function startClient() {
  const router = await hydrateStart()

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    )
  })
}

void startClient()
