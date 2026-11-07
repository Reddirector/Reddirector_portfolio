import { useState, useRef, useEffect } from 'react'

const CLI_SNIPPETS = [
  {
    id: 'pip',
    label: 'pip (PyPI)',
    cmd: 'pip install orchestration-engine',
    desc: 'Python 3.10+ stdlib distributed workflow engine',
  },
  {
    id: 'apk',
    label: 'adb install',
    cmd: 'adb install -r releases/valtsky-v2.1.0-release.apk',
    desc: 'ValtSky zero-loss airframe on physical Android',
  },
  {
    id: 'git',
    label: 'git clone',
    cmd: 'git clone https://github.com/Reddirector/ValtSky.git',
    desc: 'MTProto 2.0 dual-stack socket virtualization repo',
  },
]

export default function ModernHero({ onExploreWork, onOpenDossier }) {
  const [activeSnippet, setActiveSnippet] = useState(0)
  const [copied, setCopied] = useState(false)
  const copyTimeout = useRef(null)

  const handleCopy = () => {
    const text = CLI_SNIPPETS[activeSnippet].cmd
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        clearTimeout(copyTimeout.current)
        copyTimeout.current = setTimeout(() => setCopied(false), 2200)
      }).catch(() => {})
    }
  }

  useEffect(() => () => clearTimeout(copyTimeout.current), [])

  return (
    <section id="top" className="relative isolate min-h-screen overflow-hidden bg-black pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Background Architectural Grid & Subtle Radial Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(229,72,77,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 -right-48 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 -left-48 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Kicker & Status Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-red-400 shadow-[0_0_15px_rgba(229,72,77,0.2)]">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            ADITYA KUMAR SINGH // REDDIRECTOR
          </div>
          <span className="font-mono text-[0.68rem] tracking-wider text-white/40">
            SYSTEMS · DISTRIBUTED PROTOCOLS · MECHANISTIC ML
          </span>
        </div>

        {/* Asymmetric Split Grid */}
        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Column: Bold Kinetic Manifesto (7 cols) */}
          <div className="lg:col-span-7">
            <h1 className="font-display text-[clamp(2.5rem,6.8vw,5.6rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-white">
              BUILDING <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">HARDWARE-LEVEL</span> RELIABILITY INTO DISTRIBUTED RUNTIMES.
            </h1>

            <p className="mt-6 max-w-2xl font-sans text-base sm:text-lg leading-relaxed text-slate-300 font-normal">
              I eliminate cloud subscription taxes, unbounded memory spikes, and fragile third-party dependencies through first-principles systems engineering. From custom <strong className="text-white font-semibold">MTProto 2.0 binary protocol airframes</strong> and <strong className="text-white font-semibold">O(1) bounded memory streaming</strong>, to fault-tolerant cyclic DAG orchestrators in Python standard library and on-device private AI.
            </p>

            {/* CTAs & Social Links */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#work"
                onClick={onExploreWork}
                className="group inline-flex items-center gap-2 rounded-sm border border-red-500 bg-red-600 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_25px_rgba(229,72,77,0.4)] transition-all duration-200 hover:bg-red-500 hover:shadow-[0_0_35px_rgba(229,72,77,0.7)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                EXPLORE 4 FLAGSHIP SYSTEMS
                <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 13l5 5 5-5M12 4v14" />
                </svg>
              </a>

              <a
                href="#method"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/[0.04] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                SYSTEMS LAB &amp; BENCHMARKS
                <svg className="h-3.5 w-3.5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Verified External Profiles Row */}
            <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-white/10 pt-6">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-white/40">
                PROFILES &amp; ARTIFACTS:
              </span>
              <a
                href="https://github.com/Reddirector"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-white/70 hover:text-red-400 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub ↗
              </a>
              <a
                href="https://linkedin.com/in/aditya-kumar-singh-6131b82a4"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-white/70 hover:text-red-400 transition-colors"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://x.com/KumarAditya6430"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-white/70 hover:text-red-400 transition-colors"
              >
                X (Twitter) ↗
              </a>
              <a
                href="https://pypi.org/project/orchestration-engine/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400/90 hover:text-emerald-300 transition-colors"
              >
                PyPI Package ↗
              </a>
            </div>
          </div>

          {/* Right Column: Live Telemetry Deck & Terminal (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Live Metrics Quad-Card */}
            <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-widest text-white/60">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  PROD TELEMETRY MATRIX
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.6rem] text-white/80">
                  100% REPRODUCIBLE
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-mono text-2xl font-bold tracking-tight text-white">
                    301<span className="text-emerald-400 text-lg">/301</span>
                  </div>
                  <div className="font-mono text-[0.62rem] uppercase tracking-wider text-white/50 mt-1">
                    Orchestration Tests (92.35% Cov)
                  </div>
                </div>

                <div className="rounded border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-mono text-2xl font-bold tracking-tight text-cyan-400">
                    &lt; 28 <span className="text-sm font-normal text-white/60">MB</span>
                  </div>
                  <div className="font-mono text-[0.62rem] uppercase tracking-wider text-white/50 mt-1">
                    RAM at 1.8GB 4K Video Stream
                  </div>
                </div>

                <div className="rounded border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-mono text-2xl font-bold tracking-tight text-amber-400">
                    627 <span className="text-sm font-normal text-white/60">µs</span>
                  </div>
                  <div className="font-mono text-[0.62rem] uppercase tracking-wider text-white/50 mt-1">
                    Task Coordinator Scheduling
                  </div>
                </div>

                <div className="rounded border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-mono text-2xl font-bold tracking-tight text-purple-400">
                    44,730<span className="text-sm font-normal text-white/60">/s</span>
                  </div>
                  <div className="font-mono text-[0.62rem] uppercase tracking-wider text-white/50 mt-1">
                    SQLite WAL Write Throughput
                  </div>
                </div>
              </div>
            </div>

            {/* Quick CLI Terminal Card */}
            <div className="rounded-lg border border-white/10 bg-black/90 p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-[0.65rem] uppercase tracking-widest text-white/40">
                    SYSTEM REPO CLI
                  </span>
                </div>

                {/* Tab switchers */}
                <div className="flex items-center gap-1">
                  {CLI_SNIPPETS.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSnippet(idx)}
                      className={`rounded px-2 py-0.5 font-mono text-[0.62rem] transition-colors ${
                        activeSnippet === idx
                          ? 'bg-red-500/20 text-red-400 font-semibold border border-red-500/40'
                          : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Command Shell Box */}
              <div className="mt-3.5 flex items-center justify-between rounded border border-white/[0.08] bg-zinc-950 px-3.5 py-2.5 font-mono text-xs">
                <div className="flex items-center gap-2 overflow-x-auto text-emerald-400">
                  <span className="text-white/40 select-none">$</span>
                  <code className="text-[0.78rem] whitespace-nowrap text-emerald-300">
                    {CLI_SNIPPETS[activeSnippet].cmd}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="ml-2 flex-shrink-0 rounded bg-white/10 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-white hover:bg-white/20 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                  aria-label="Copy terminal command"
                >
                  {copied ? (
                    <span className="text-emerald-400 font-bold">COPIED ✓</span>
                  ) : (
                    <span>COPY</span>
                  )}
                </button>
              </div>

              <div className="mt-2 text-right">
                <span className="font-mono text-[0.62rem] text-white/40">
                  {CLI_SNIPPETS[activeSnippet].desc}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
