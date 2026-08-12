import { useRetryCountdown } from '../../../hooks/useRetryCountdown'

type Props = {
  showDropdown: boolean
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  onRetry?: () => void
  /** Raw seconds from a 429; absent for any other error, which stays retryable at once. */
  retryAfter?: number
  retryAfterAt?: number
  filteredCount: number
  query: string
  debouncedQuery: string
  isOpen: boolean
  minChars: number
  announcement: string
}

function liveMessage(
  showDropdown: boolean,
  filteredCount: number,
  isLoading: boolean,
  isError: boolean
): string {
  if (!showDropdown) return ''
  // role="alert" on the visible error <p> already announces; stay silent here to avoid a double read.
  if (isError) return ''
  if (filteredCount > 0) {
    const plural = filteredCount > 1 ? 's' : ''
    return `${filteredCount} résultat${plural} disponible${plural}`
  }
  if (isLoading) return 'Recherche en cours'
  return 'Aucun résultat'
}

export function DropdownStatus({
  showDropdown,
  isLoading,
  isError,
  errorMessage = 'Erreur de recherche',
  onRetry,
  retryAfter,
  retryAfterAt,
  filteredCount,
  query,
  debouncedQuery,
  isOpen,
  minChars,
  announcement,
}: Props) {
  const remaining = useRetryCountdown(retryAfter ?? null, retryAfterAt)
  const showError = showDropdown && isError
  const showNoResult = showDropdown && !isLoading && !isError && filteredCount === 0
  const showMinChars = isOpen && debouncedQuery.length < minChars && query.length > 0
  const showLoading = isLoading && filteredCount === 0 && !isError

  return (
    <>
      {showError && (
        <p
          className="search-select__empty search-select__empty--error ui-combobox-empty"
          role="alert"
        >
          <span>{errorMessage}</span>
          {onRetry && (
            <button
              type="button"
              className="search-select__retry ui-combobox-retry"
              onClick={onRetry}
              disabled={remaining > 0}
            >
              Réessayer
              {/* Hidden from the reader: this <p> is role="alert", so a ticking number inside it
                  would fire the whole announcement again every second. */}
              {remaining > 0 && <span aria-hidden="true"> ({remaining} s)</span>}
            </button>
          )}
        </p>
      )}
      {showNoResult && <p className="search-select__empty ui-combobox-empty">Aucun résultat</p>}
      {showMinChars && (
        <p className="search-select__empty ui-combobox-empty">
          Tapez au moins {minChars} caractères
        </p>
      )}
      {showLoading && <p className="search-select__empty ui-combobox-empty">Recherche…</p>}

      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcement}
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage(showDropdown, filteredCount, isLoading, isError)}
      </div>
    </>
  )
}
