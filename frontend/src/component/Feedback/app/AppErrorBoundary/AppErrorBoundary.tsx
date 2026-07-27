import { Component, type ErrorInfo, type ReactNode } from 'react'

import { captureFrontendError } from '../../../../lib/observability/faro'
import { GlobalError } from '../GlobalError/GlobalError'

// Last resort for what no route boundary covers: the chrome around the Outlet
// (Header, Toaster) and anything the root component itself throws. React picks the
// nearest boundary by tree position, so this sits above the Outlet and takes the
// whole layout down when it fires: route-level errorComponents catch first.
interface Props {
  children: ReactNode
  fallback?: (props: { error: Error; reset: () => void }) => ReactNode
}

interface State {
  error: Error | null
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    captureFrontendError(error, { source: 'AppErrorBoundary', componentStack: info.componentStack })
  }

  reset = (): void => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children
    if (this.props.fallback) return this.props.fallback({ error, reset: this.reset })
    return <GlobalError error={error} reset={this.reset} />
  }
}
