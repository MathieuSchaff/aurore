import { useNavigate } from '@tanstack/react-router'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'

import { reportError } from '../../../lib/errorReporter'
import { Button } from '../../Button/Button'
import { Card } from '../../Card/Card'
import { SectionHeader } from '../../Typography/SectionHeader/SectionHeader'
import './GlobalError.css'

interface GlobalErrorProps {
  error: Error
  reset?: () => void
}

export const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  const navigate = useNavigate()

  // biome-ignore lint/correctness/useExhaustiveDependencies: report once on mount only
  useEffect(() => {
    reportError(error, { component: 'GlobalError' })
  }, [])

  return (
    <div className="global-error-container">
      <Card className="global-error-card">
        <div className="global-error-icon">
          <AlertCircle size={48} color="var(--c-error)" />
        </div>

        <SectionHeader title="Oops! Something went wrong" variant="error" />

        <p className="global-error-description">
          We encountered an unexpected error. Don't worry, your data is safe.
        </p>

        <div className="error-details">
          <code>{error.message}</code>
        </div>

        <div className="global-error-actions">
          {reset && (
            <Button onClick={() => reset()}>
              <RefreshCw size={18} />
              Try again
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            <Home size={18} />
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  )
}
