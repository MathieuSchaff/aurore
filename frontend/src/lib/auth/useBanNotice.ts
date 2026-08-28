import { useBanEvent } from './session'

export function useBanNotice() {
  const details = useBanEvent()

  if (!details || (details.scope && details.scope !== 'global')) return null
  return { expiresAt: details.expiresAt, reason: details.reason }
}
