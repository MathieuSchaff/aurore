import { useCallback, useEffect, useState } from 'react'

const SUCCESS_FEEDBACK_MS = 3500

export function useSuccessFeedback() {
  const [event, setEvent] = useState<{ message: string; sequence: number } | null>(null)

  const setSuccess = useCallback((message: string | null) => {
    setEvent((current) =>
      message === null ? null : { message, sequence: (current?.sequence ?? 0) + 1 }
    )
  }, [])

  useEffect(() => {
    if (!event) return
    const t = setTimeout(() => setEvent(null), SUCCESS_FEEDBACK_MS)
    return () => clearTimeout(t)
  }, [event])

  return { success: event?.message ?? null, setSuccess }
}
