// True in the SSR bundle, false in the browser bundle. Safe as a module const:
// each bundle only ever runs in its own environment. Default guard for render
// fallbacks, client-only module init and loaders. Two others exist on purpose:
// import.meta.env.SSR when the opposite branch must be dropped from the bundle,
// createIsomorphicFn when a server-only Start API would otherwise leak into it
export const isServer = typeof document === 'undefined'
