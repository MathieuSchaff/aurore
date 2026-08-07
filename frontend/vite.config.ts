import path from 'node:path'

import babel from '@rolldown/plugin-babel'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { DevTools } from '@vitejs/devtools'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv, type Plugin, type UserConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

function enabled(value: string | undefined) {
  return value === '1' || value === 'true'
}

export default defineConfig(async ({ command, mode, isPreview }): Promise<UserConfig> => {
  // Config files need `loadEnv`; `import.meta.env` is not ready here.
  const fileEnv = loadEnv(mode, process.cwd(), '')
  const apiUrl = process.env.VITE_API_URL ?? fileEnv.VITE_API_URL ?? 'http://api:3000'
  const analyze = enabled(process.env.ANALYZE ?? fileEnv.ANALYZE)
  // Preview also uses `serve`, but Inspect should stay dev-only.
  const devServer = command === 'serve' && isPreview !== true

  let visualizerPlugin: Plugin | false = false

  if (analyze) {
    // Rolldown's builtin bundleAnalyzerPlugin never emits under `vite build` (the native
    // plugin isn't wired into Vite's build pipeline), so bundle analysis comes from the
    // Vite DevTools Rolldown panel instead. visualizer stays for the gzip/brotli treemap.
    const visualizerModule = 'rollup-plugin-visualizer'
    const { visualizer } = await import(visualizerModule)

    visualizerPlugin = visualizer({
      filename: './stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
    }) as Plugin
  }

  return {
    plugins: [
      devServer && Inspect(),
      // The `devtools` option below only configures the build-time Rolldown
      // devtools; the dev panel at /__devtools/ is mounted by this plugin.
      devServer && (await DevTools()),

      // TanStack Start must run before React so route splitting sees source files.
      tanstackStart({
        // Paths resolve relative to srcDirectory ('src'), unlike the old tanstackRouter
        // plugin which resolved from root: hence no './src/' prefix here.
        router: {
          routesDirectory: 'routes',
          generatedRouteTree: 'routeTree.gen.ts',
          quoteStyle: 'single',
          routeFileIgnorePattern: '\\.(test|spec)\\.[tj]sx?$',
        },
        // Runtime SSR (nitro server), no static prerender: public pages SSR live
        // per request so their inline scripts carry the per-request CSP nonce. A
        // baked prerender would freeze a build-time nonce and get blocked by the
        // per-request CSP.
      }),
      // Wraps the build into a deployable server so the app runs as a process
      // (not static files), required for a per-request CSP nonce. Bun preset:
      // we deploy on Bun (React 19).
      nitro({
        preset: 'bun',
        // Nitro owns the dev request path, so Vite's `server.proxy` never sees /api.
        // Proxy here instead. Serve-only: prod routes /api through nginx.
        ...(command === 'serve' && {
          routeRules: { '/api/**': { proxy: `${apiUrl}/api/**` } },
        }),
      }),
      react(),

      // React Compiler still runs through Babel; keep it scoped to app code.
      babel({
        include: /src[\\/].*\.[jt]sx?$/,
        presets: [reactCompilerPreset()],
      }),

      visualizerPlugin,
    ],

    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },

    css: {
      // Devtools should point at source CSS, not PostCSS output.
      devSourcemap: true,
    },

    // DevTools keeps a server alive, so a plain `vite build` never exits (breaks
    // profile-prod and CI). Enable it only where it's wanted: the dev server and
    // ANALYZE builds (the latter records a Rolldown session, then holds for browsing).
    devtools: { enabled: devServer || analyze },

    server: {
      host: true,
      port: 5173,
      strictPort: true,
      // No /api proxy here: Nitro owns the dev request path and bypasses
      // `server.proxy`. It lives in the nitro plugin above.
    },

    preview: {
      host: true,
      port: 4173,
      strictPort: true,
    },

    build: {
      // Gzip size reporting is useful for analysis, not for every build.
      reportCompressedSize: analyze,
      rolldownOptions: {
        output: {
          // Keep only stable shared groups explicit. Route-only deps should stay lazy.
          codeSplitting: {
            groups: [
              {
                // The route tree and every route-definition module must live in ONE
                // chunk. Left to rolldown's auto-splitting they land in mutually-
                // importing shared chunks whose init order is non-deterministic, so
                // under the wrong order the tree reads a route export before its chunk
                // assigns it (Route$N.update of undefined) and every SSR request 500s.
                // Match only definition modules: the negative lookahead excludes the
                // `tsr-split`/`tsr-shared` virtuals Start emits for components and
                // loaders, so heavy route code stays lazily split on the client.
                name: 'routes',
                test: /^(?!.*tsr-(?:split|shared)).*[\\/]src[\\/](?:routes[\\/]|routeTree\.gen)/,
                priority: 50,
              },
              {
                name: 'react',
                test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
                priority: 40,
              },
              {
                name: 'tanstack',
                // Router and Query are app-wide. Recheck this before adding route-only TanStack deps.
                test: /node_modules[\\/]@tanstack[\\/]/,
                priority: 30,
              },
              {
                name: 'forms',
                test: /node_modules[\\/]zod[\\/]/,
                priority: 20,
              },
              {
                name: 'vendor',
                test: /node_modules[\\/]/,
                priority: 10,
                minShareCount: 2,
                minSize: 20 * 1024,
                entriesAware: true,
                entriesAwareMergeThreshold: 10 * 1024,
              },
            ],
          },
        },
      },
    },
  }
})
