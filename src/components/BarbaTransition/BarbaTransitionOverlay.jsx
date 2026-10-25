import './barba-transition.css'

export default function BarbaTransitionOverlay() {
  return (
    <div id="barba-transition-overlay" aria-hidden="true">
      <div className="barba-shutter barba-shutter--top" />
      <div className="barba-shutter barba-shutter--bottom" />
      <div className="barba-laser" />

      <span className="barba-reticle-corner barba-reticle-corner--tl" />
      <span className="barba-reticle-corner barba-reticle-corner--tr" />
      <span className="barba-reticle-corner barba-reticle-corner--bl" />
      <span className="barba-reticle-corner barba-reticle-corner--br" />

      <div className="barba-hud">
        <div className="barba-reticle">
          <div className="barba-reticle__ring" />
          <div className="barba-reticle__inner-ring" />
          <div className="barba-reticle__cross-h" />
          <div className="barba-reticle__cross-v" />
          <div className="barba-reticle__dot" />
        </div>

        <p className="barba-hud__kicker" id="barba-hud-kicker">SYSTEM ROUTE // 0x2A</p>
        <h2 className="barba-hud__title" id="barba-hud-title">INITIALIZING</h2>

        <div className="barba-progress-wrap">
          <div className="barba-progress-bar">
            <div className="barba-progress-fill" id="barba-progress-fill" />
          </div>
          <div className="barba-hud__meta">
            <span id="barba-hud-status">BUFFER: ACTIVE</span>
            <span>LAT 28.6139° N / LON 77.2090° E</span>
          </div>
        </div>
      </div>
    </div>
  )
}
