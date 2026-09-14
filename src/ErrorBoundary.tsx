import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo)
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="error-page">
          <h1>Er ging iets mis</h1>
          <p>Vernieuw de pagina om de opstelling opnieuw te openen.</p>
          <button type="button" onClick={() => this.setState({ hasError: false })}>
            Opnieuw proberen
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
