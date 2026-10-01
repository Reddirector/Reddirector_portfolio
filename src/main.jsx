import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './PortfolioApp.jsx'

// Last-resort crash screen: a failed render must never leave a blank page.
class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { console.error('Portfolio render failed:', error) }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#000', color: '#fff', fontFamily: 'Inter, Arial, sans-serif', padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontFamily: '"DM Mono", monospace', fontSize: '.8rem', letterSpacing: '.08em', textTransform: 'uppercase', color: '#E5484D' }}>Something broke while rendering</p>
          <button type="button" onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '12px 22px', background: '#E5484D', color: '#000', border: 0, cursor: 'pointer', fontFamily: '"DM Mono", monospace', fontSize: '.75rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>Reload</button>
        </div>
      </div>
    )
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
