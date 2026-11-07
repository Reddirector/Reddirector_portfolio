import { useEffect, useState } from 'react'

export default function ModernHUDNav({ onOpenCommandPalette }) {
  const [time, setTime] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-40 transition-all duration-300">
      {/* Top Telemetry Ticker */}
      <div className="hidden border-b border-white/[0.08] bg-black/95 px-4 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/50 backdrop-blur-md sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            LIVE // SYSTEMS ACTIVE
          </span>
          <span className="text-white/20">|</span>
          <span>LATENCY: &lt; 1ms LOCAL</span>
          <span className="text-white/20">|</span>
          <span className="text-white/70">BUILD: v2.4.0-OLED</span>
        </div>
        <div className="flex items-center gap-4">
          <span>TIME: <span className="text-white/80">{time || '12:00:00 IST'}</span></span>
          <span className="text-white/20">|</span>
          <span className="text-emerald-400/90 font-semibold">TESTS: 336/336 PASSING</span>
        </div>
      </div>

      {/* Main Glass Navigation Bar */}
      <nav
        className={`mx-auto transition-all duration-300 ${
          scrolled
            ? 'bg-black/90 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl border-b border-white/10 py-3 px-5 sm:px-8'
            : 'bg-black/40 backdrop-blur-md border-b border-white/[0.06] py-4 px-5 sm:px-8'
        }`}
        aria-label="Main Navigation"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo / Monogram */}
          <a
            href="#top"
            className="group flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-white transition-colors"
            aria-label="Aditya Kumar Singh Home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-red-500/40 bg-red-950/30 font-bold text-red-500 shadow-[0_0_12px_rgba(229,72,77,0.3)] transition-all duration-200 group-hover:border-red-400 group-hover:bg-red-900/40 group-hover:shadow-[0_0_20px_rgba(229,72,77,0.6)]">
              RD
            </span>
            <div className="flex flex-col">
              <span className="font-display text-sm font-black tracking-tight text-white group-hover:text-red-400 transition-colors">
                REDDIRECTOR
              </span>
              <span className="font-mono text-[0.58rem] tracking-wider text-white/40">
                SYSTEMS &amp; ML ARCHITECT
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:gap-7">
            <a
              href="#work"
              className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white hover:underline hover:decoration-red-500 hover:decoration-2 hover:underline-offset-8"
            >
              01 // WORK
            </a>
            <a
              href="#method"
              className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white hover:underline hover:decoration-red-500 hover:decoration-2 hover:underline-offset-8"
            >
              02 // LAB &amp; BENCHMARKS
            </a>
            <a
              href="#arsenal"
              className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white hover:underline hover:decoration-red-500 hover:decoration-2 hover:underline-offset-8"
            >
              03 // ARSENAL
            </a>
            <a
              href="#contact"
              className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white hover:underline hover:decoration-red-500 hover:decoration-2 hover:underline-offset-8"
            >
              04 // TRANSMIT
            </a>
          </div>

          {/* Right Action Stack */}
          <div className="flex items-center gap-3">
            {/* Command Palette Trigger Button */}
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="group flex h-9 items-center gap-2 rounded-sm border border-white/10 bg-white/[0.04] px-3 font-mono text-[0.68rem] tracking-wider text-white/70 transition-all duration-200 hover:border-red-500/50 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Open Command Terminal (Command + K)"
            >
              <svg className="h-3.5 w-3.5 text-white/50 group-hover:text-red-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="hidden sm:inline">COMMANDS</span>
              <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.6rem] text-white/60 group-hover:text-white sm:inline">
                ⌘K
              </kbd>
            </button>

            {/* Direct Transmit CTA */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center justify-center rounded-sm border border-red-500 bg-red-600/90 px-3.5 py-2 font-mono text-[0.68rem] font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(229,72,77,0.35)] transition-all duration-200 hover:bg-red-500 hover:shadow-[0_0_25px_rgba(229,72,77,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              CONNECT ↗
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 bg-white/[0.04] text-white/80 transition-colors hover:text-white md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 flex flex-col space-y-3 border-t border-white/10 pt-4 md:hidden">
            <a
              href="#work"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 font-mono text-sm tracking-wider text-white/80 transition-colors hover:text-red-400"
            >
              01 // SELECTED WORK
            </a>
            <a
              href="#method"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 font-mono text-sm tracking-wider text-white/80 transition-colors hover:text-red-400"
            >
              02 // LAB &amp; BENCHMARKS
            </a>
            <a
              href="#arsenal"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 font-mono text-sm tracking-wider text-white/80 transition-colors hover:text-red-400"
            >
              03 // ARSENAL
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 font-mono text-sm tracking-wider text-white/80 transition-colors hover:text-red-400"
            >
              04 // TRANSMIT
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenCommandPalette?.()
              }}
              className="flex items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white"
            >
              <span>SEARCH &amp; COMMAND TERMINAL</span>
              <kbd className="rounded bg-white/10 px-1 py-0.5 text-[0.6rem]">⌘K</kbd>
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}
