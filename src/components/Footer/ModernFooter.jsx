import { useState, useRef } from 'react'

export default function ModernFooter() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const timer = useRef(null)

  const copyEmail = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText('adityasingh6430@gmail.com').then(() => {
        setCopiedEmail(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopiedEmail(false), 2500)
      }).catch(() => {})
    }
  }

  return (
    <footer id="contact" className="relative isolate overflow-hidden bg-black text-white py-24 sm:py-32 border-t border-white/10">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,rgba(229,72,77,0.12),transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Top Kicker */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-red-400">
              04 // TRANSMISSION TERMINAL &amp; CONTACT
            </p>
          </div>
          <p className="font-mono text-[0.68rem] uppercase tracking-widest text-white/50">
            LOCATION: INDIA (UTC+5:30) · REMOTE READY
          </p>
        </div>

        {/* Big Brutalist Heading */}
        <div className="mt-12">
          <h2 className="font-display text-[clamp(2.4rem,7.5vw,7.2rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-white">
            LET'S BUILD <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">
              SOMETHING BULLETPROOF.
            </span>
          </h2>
          <p className="mt-6 max-w-xl font-sans text-base sm:text-lg text-slate-300">
            Targeting Senior / Staff Distributed Systems, Core Infrastructure, and Mechanistic ML engineering roles. If you value deterministic reliability, bounded memory footprints, and first-principles architectures, let's talk.
          </p>
        </div>

        {/* Transmission Buttons Row */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/Reddirector"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-sm border border-red-500 bg-red-600 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(229,72,77,0.3)] transition-all hover:bg-red-500 hover:shadow-[0_0_30px_rgba(229,72,77,0.6)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            GITHUB PROFILE ↗
          </a>

          <a
            href="https://linkedin.com/in/aditya-kumar-singh-6131b82a4"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-white hover:border-white/50 hover:bg-white/10 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            LINKEDIN ↗
          </a>

          <a
            href="https://x.com/KumarAditya6430"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-white hover:border-white/50 hover:bg-white/10 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            X (TWITTER) ↗
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-sm border border-emerald-500/40 bg-emerald-950/30 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400 hover:bg-emerald-900/40 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            {copiedEmail ? 'EMAIL COPIED ✓' : 'COPY EMAIL ✉'}
          </button>
        </div>

        {/* Bottom Hardware Telemetry Bar */}
        <div className="mt-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-white/10 pt-8 font-mono text-[0.68rem] text-white/50">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 ADITYA KUMAR SINGH (REDDIRECTOR)</span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-400/90 font-bold">ADE STD 100 AIRFRAME COMPLIANT</span>
          </div>

          <a
            href="#top"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            BACK TO FLIGHT DECK ↑
          </a>
        </div>
      </div>
    </footer>
  )
}
