import { useState } from 'react'

const ARSENAL_CATEGORIES = ['ALL', 'PROTOCOLS & NETWORKS', 'SYSTEM RUNTIMES', 'AI & MECHANISTIC', 'SECURITY & STORAGE']

const ARSENAL_ITEMS = [
  {
    name: 'MTProto 2.0 Binary Protocol',
    category: 'PROTOCOLS & NETWORKS',
    level: 'DEEP PROTOCOL INTERNALS',
    verification: '2048-bit Diffie-Hellman · TL-Schema serialization · Direct TCP',
    project: 'ValtSky Multiplatform',
  },
  {
    name: 'Dual-Stack IPv4/IPv6 Socket Bridge',
    category: 'PROTOCOLS & NETWORKS',
    level: 'NETWORK VIRTUALIZATION',
    verification: 'WebSocket-to-TCP daemon · Browser CSP bypass · Zero leaks',
    project: 'ValtSky Multiplatform',
  },
  {
    name: 'Python 3.10+ Stdlib Internals',
    category: 'SYSTEM RUNTIMES',
    level: 'ZERO THIRD-PARTY DEPS',
    verification: '301/301 Passing Tests · 158 Frozen Exports · 92.35% Cov',
    project: 'Orchestration Engine',
  },
  {
    name: 'Cyclic Agentic Graphs & Sagas',
    category: 'SYSTEM RUNTIMES',
    level: 'DISTRIBUTED STATE MACHINES',
    verification: 'Automated reverse compensation · Work-stealing · 627µs latency',
    project: 'Orchestration Engine',
  },
  {
    name: 'SQLite Write-Ahead Logging (WAL)',
    category: 'SECURITY & STORAGE',
    level: 'TRANSACTIONAL STORAGE ENGINE',
    verification: '44,730 writes/s · 500-item chunk guards · Crash resilience',
    project: 'Orchestration Engine & ValtSky',
  },
  {
    name: 'O(1) Bounded Memory POSIX Streaming',
    category: 'SYSTEM RUNTIMES',
    level: 'KERNEL I/O OPTIMIZATION',
    verification: '< 28 MB RAM under continuous 1.8 GB 4K video payloads',
    project: 'ValtSky Multiplatform',
  },
  {
    name: 'Sparse Autoencoders (SAE)',
    category: 'AI & MECHANISTIC',
    level: 'MECHANISTIC INTERPRETABILITY',
    verification: '0.897562 cosine sim · 0.10% dead features · 4,096 latents',
    project: 'SAE Reproduction',
  },
  {
    name: 'LangGraph State Orchestration',
    category: 'AI & MECHANISTIC',
    level: 'DETERMINISTIC AI WORKFLOWS',
    verification: 'Hierarchical autonomy · 6 risk categories · 4 tiers',
    project: 'Pentagon Workstation',
  },
  {
    name: 'Local-First ChromaDB Vector RAG',
    category: 'AI & MECHANISTIC',
    level: 'ON-DEVICE RETRIEVAL',
    verification: 'On-device embeddings · Automatic CPU fallback · Zero leaks',
    project: 'Pentagon Workstation',
  },
  {
    name: 'BYOK Fernet AES-128-CBC + HMAC',
    category: 'SECURITY & STORAGE',
    level: 'CLIENT-SIDE CRYPTOGRAPHY',
    verification: 'Zero server trust · 100/100 Security Score · Dual-Lane Concurrency',
    project: 'Pentagon & ValtSky',
  },
  {
    name: 'Flutter & Dart Native Engine',
    category: 'SYSTEM RUNTIMES',
    level: 'CROSS-PLATFORM INTEROP',
    verification: 'Conditional compilation · Native TCP sockets · Web fallback',
    project: 'ValtSky Multiplatform',
  },
  {
    name: 'Modern Web UI/UX Architecture',
    category: 'SYSTEM RUNTIMES',
    level: 'UI-UX-PRO-MAX CERTIFIED',
    verification: 'Tailwind v4 · GSAP 3 · Lenis · OLED 15:1+ Contrast',
    project: 'Reddirector Portfolio',
  },
]

export default function ModernArsenal() {
  const [filter, setFilter] = useState('ALL')

  const filteredItems = filter === 'ALL'
    ? ARSENAL_ITEMS
    : ARSENAL_ITEMS.filter((item) => item.category === filter)

  return (
    <section id="arsenal" className="relative isolate overflow-hidden bg-black py-24 sm:py-32 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-400">
              03 // TECHNICAL ARSENAL &amp; SYSTEMS CAPABILITIES
            </p>
          </div>
          <span className="font-mono text-[0.68rem] uppercase tracking-wider text-white/40">
            PROVEN IN PRODUCTION SYSTEMS
          </span>
        </div>

        <h2 className="font-display mt-6 text-[clamp(2.2rem,5vw,4.2rem)] font-black uppercase leading-[0.9] tracking-tight text-white">
          THE ENGINEERING ARSENAL.
        </h2>
        <p className="mt-4 max-w-2xl font-sans text-base text-slate-300">
          Core capabilities proven across 4 end-to-end production architectures, audited under rigorous engineering standards and verified by 340+ passing automated test suites.
        </p>

        {/* Filter Pills */}
        <div className="mt-10 flex flex-wrap gap-2">
          {ARSENAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-sm px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                filter === cat
                  ? 'border border-cyan-400 bg-cyan-950/40 text-cyan-300 font-bold shadow-[0_0_15px_rgba(0,216,255,0.25)]'
                  : 'border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Arsenal Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.name}
              className="group rounded-lg border border-white/10 bg-zinc-950/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:bg-zinc-900/60 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between text-[0.62rem] font-mono">
                <span className="rounded bg-white/5 px-2 py-0.5 text-white/40 group-hover:text-cyan-400 transition-colors">
                  {item.category}
                </span>
                <span className="text-emerald-400/80 font-bold">VERIFIED ✓</span>
              </div>

              <h3 className="font-display mt-3 text-lg font-bold uppercase tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                {item.name}
              </h3>
              <p className="font-mono text-[0.68rem] text-white/50 mt-0.5">
                {item.level}
              </p>

              <div className="mt-4 rounded border border-white/5 bg-black/50 p-2.5 font-mono text-[0.65rem] text-slate-300">
                {item.verification}
              </div>

              <div className="mt-3 flex items-center justify-between font-mono text-[0.6rem] text-white/40 pt-2 border-t border-white/5">
                <span>PRODUCTION AIRFRAME:</span>
                <strong className="text-white/80">{item.project}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
