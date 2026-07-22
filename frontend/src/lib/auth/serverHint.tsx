import { createContext, type ReactNode, useContext } from 'react'

// Keep this request-scoped. The Zustand auth store is shared across SSR requests.
const ServerHintContext = createContext(false)

export function ServerHintProvider({ value, children }: { value: boolean; children: ReactNode }) {
  return <ServerHintContext.Provider value={value}>{children}</ServerHintContext.Provider>
}

export function useServerHint(): boolean {
  return useContext(ServerHintContext)
}
