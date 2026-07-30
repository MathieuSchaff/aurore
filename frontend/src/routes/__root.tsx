// Global styles first: declares the @layer order before any component CSS can
// register a layer (else routeTree's component CSS inverts the cascade).
import './../styles/index.css'

import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router'
import { lazy, type ReactNode, Suspense } from 'react'

import { AppErrorBoundary } from '../component/Feedback/app/AppErrorBoundary/AppErrorBoundary'
import { GlobalError } from '../component/Feedback/app/GlobalError/GlobalError'
import { NavigationProgress } from '../component/Feedback/app/NavigationProgress/NavigationProgress'
import { AppLayout } from '../component/Layout/AppLayout/AppLayout'
import { readServerSessionHint } from '../lib/auth/readServerSessionHint'
import { ServerHintProvider } from '../lib/auth/serverHint'
import { useBannedRedirect } from '../lib/auth/useBannedRedirect'
import { useSessionExpiredRedirect } from '../lib/auth/useSessionExpiredRedirect'
import { getCspNonce } from '../lib/csp/nonce'
import { useBootRefresh } from '../lib/hooks/useBootRefresh'
import { useTokenRefresh } from '../lib/hooks/useTokenRefresh'
import { NOINDEX_ROBOTS } from '../lib/seo'
import type { RouterContext } from '../routerContext'
import { useThemeStore } from '../store/theme'

// Excluded from prod bundle - Vite resolves import.meta.env.DEV at build time
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    )
  : () => null

function RootShell({ children }: Readonly<{ children: ReactNode }>) {
  // Subscribed here rather than in RootComponent: a theme toggle then re-renders only
  // this component, and the stable `children` element makes React skip the subtree.
  const theme = useThemeStore((s) => s.theme)
  const variant = useThemeStore((s) => s.variant)

  return (
    // React owns these attributes, so hardcoding them let every root replay write
    // light/terracota back over what the pre-paint script had applied.
    // suppressHydrationWarning: the store reads storage synchronously, so the first
    // client render legitimately differs from the SSR defaults (light/terracota).
    <html lang="fr" data-theme={theme} data-variant={variant} suppressHydrationWarning>
      <head>
        {/* @layer order must be declared before any CSS loads. Rolldown strips the
            bare @layer statement from bundled CSS, so without this the cascade
            falls back to encounter order and component styles lose to reset/base. */}
        <style>{'@layer reset, variables, base, components, utilities;'}</style>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const { serverHint } = Route.useLoaderData()
  useBootRefresh()
  useTokenRefresh()
  useSessionExpiredRedirect()
  useBannedRedirect()
  return (
    <ServerHintProvider value={serverHint}>
      <AppErrorBoundary>
        <NavigationProgress />
        <AppLayout />
        <Suspense>
          <ReactQueryDevtools />
        </Suspense>
      </AppErrorBoundary>
    </ServerHintProvider>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  // The root must allow SSR because a child cannot override a disabled ancestor.
  // Public routes opt into runtime SSR individually.
  ssr: true,
  // Dehydrated loader data keeps the server and first client render on the same shell.
  // Keep this request-scoped; never write the hint into the shared auth store.
  loader: () => ({ serverHint: readServerSessionHint() }),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, viewport-fit=cover, interactive-widget=resizes-visual',
      },
      { title: 'Aurore - Simplifiez vos routines' },
      {
        name: 'description',
        content:
          'Aurore réunit vos produits skincare, vos notes et les raisons de chaque choix — pour décider sans refaire la recherche. Sans score, sans publicité.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'fr_FR' },
      { property: 'og:site_name', content: 'Aurore' },
      { name: 'robots', content: NOINDEX_ROBOTS },
      { property: 'og:title', content: 'Aurore — votre skincare, au même endroit' },
      {
        property: 'og:description',
        content:
          'Réunissez vos produits skincare, lisez leurs formules et gardez la raison de chaque décision. Sans score, sans verdict, sans publicité.',
      },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      // Product images load from the Bunny CDN; warm DNS+TLS+TCP before the LCP image request.
      { rel: 'preconnect', href: 'https://aurore-cdn.b-cdn.net' },
      { rel: 'dns-prefetch', href: 'https://aurore-cdn.b-cdn.net' },
    ],
    scripts: [
      {
        // SSR ships data-theme="light"; re-theme from storage before first paint so
        // dark users don't get a light flash. Nonce keeps the inline block under the CSP.
        nonce: getCspNonce(),
        children:
          "try{let t=localStorage.getItem('theme-preference');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch{}",
      },
    ],
  }),
  // Vite's preload-error recovery requires a fresh HTML shell after each deploy.
  // Assets remain content-hashed and keep their independent long-lived cache policy.
  headers: () => ({ 'Cache-Control': 'no-cache' }),
  component: RootComponent,
  // The router mounts the shell outside the root catch boundary, so the document
  // survives a root throw. Rendering it from `component` instead would strip
  // html/head/body from the error and not-found pages.
  shellComponent: RootShell,
  notFoundComponent: () => (
    <GlobalError
      error={new Error("The page you're looking for doesn't exist.")}
      reset={() => window.location.assign('/')}
      is404
    />
  ),
})
