import { useState } from 'react'

const ARCHITECTURAL_PILLARS = [
  {
    id: 'storage',
    title: 'Unmetered Cloud Storage',
    subtitle: 'MTProto 2.0 Binary Virtualization vs Cloud Tax',
    standardWay: 'Monthly recurring Google One / AWS S3 bill, aggressive lossy JPEG compression, stripping camera sensor EXIF tags.',
    adityaWay: 'Custom MTProto 2.0 raw TCP socket virtualization with 2048-bit Diffie-Hellman negotiation directly against Telegram DCs. Zero subscription overhead, 10-second OTP onboarding, bit-for-bit sensor preservation.',
    metric: '100% Zero-Loss',
    accent: 'cyan',
  },
  {
    id: 'orchestration',
    title: 'Distributed Orchestration',
    subtitle: 'Python Stdlib + SQLite WAL vs Celery / Redis Bloat',
    standardWay: 'Spinning up 4 heavyweight containers (Redis, RabbitMQ, Celery workers, Flower), 45+ external pip dependencies, fragile network partition handling.',
    adityaWay: 'Zero-dependency distributed graph engine in Python stdlib. Cyclic reflection, distributed Sagas with automated rollback, and SQLite WAL throughput (44,730 w/s) with monotonic backoff.',
    metric: '0 External Deps',
    accent: 'red',
  },
  {
    id: 'streaming',
    title: 'Bounded Memory Footprint',
    subtitle: 'O(1) POSIX 64KB Spooling vs In-Memory Buffers',
    standardWay: 'Unbounded heap allocation during multi-gigabyte 4K media uploads causing sudden OOM kernel kills on memory-constrained mobile/embedded devices.',
    adityaWay: 'Strict O(1) bounded memory architecture with chunked POSIX 64KB ring buffers and disk-spooling. Verified under < 28 MB RAM while streaming 1.8 GB 4K video payloads.',
    metric: '< 28 MB Peak RAM',
    accent: 'emerald',
  },
  {
    id: 'ai-privacy',
    title: 'Local-First Multimodal AI',
    subtitle: 'BYOK Fernet AES-128-CBC vs Cloud Vector Leaks',
    standardWay: 'Transmitting user documents, embeddings, and sensitive keys to hosted third-party vector databases and closed API endpoints with zero cryptographic guarantees.',
    adityaWay: 'Bring Your Own Key (BYOK) AES-128-CBC + HMAC-SHA256 client-side encryption. Local ChromaDB retrieval with automatic CPU fallback and 4-tier autonomy governance.',
    metric: 'Zero Cloud Leaks',
    accent: 'purple',
  },
]

const BENCHMARK_DATA = [
  { metric: 'Orchestration Engine Unit Tests', standard: 'Typically 60-70%', aditya: '301/301 Passing (92.35% Cov)', winner: 'aditya' },
  { metric: 'Task Scheduling Overhead', standard: '12 - 25 ms (Celery/Redis)', aditya: '627 µs / task', winner: 'aditya' },
  { metric: 'SQLite WAL Event Throughput', standard: '8,000 - 12,000 writes/s', aditya: '44,730 writes/s', winner: 'aditya' },
  { metric: 'Cloud Storage RAM at 1.8GB Payload', standard: '380 - 620 MB RAM', aditya: '< 28 MB RAM (O(1) Bounded)', winner: 'aditya' },
  { metric: 'Telegram Vault Provisioning Speed', standard: '4-step manual BotFather (> 5 min)', aditya: '< 10 seconds (Direct MTProto)', winner: 'aditya' },
  { metric: 'External Dependencies Count', standard: '30 - 80 pip/npm packages', aditya: '0 (Python Stdlib / Dart)', winner: 'aditya' },
  { metric: 'SAE Dead Feature Rate', standard: '0.8 - 2.5% in literature', aditya: '0.10% (GELU-1L Reproduction)', winner: 'aditya' },
]

export default function ModernMethod() {
  const [selectedPillar, setSelectedPillar] = useState(0)
  const active = ARCHITECTURAL_PILLARS[selectedPillar]

  return (
    <section id="method" className="relative isolate overflow-hidden bg-black py-24 sm:py-32 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-400">
              02 // SYSTEMS LAB &amp; ARCHITECTURAL METHOD
            </p>
          </div>
          <span className="font-mono text-[0.68rem] uppercase tracking-wider text-white/40">
            FIRST-PRINCIPLES VS THE CLOUD TAX
          </span>
        </div>

        <h2 className="font-display mt-6 text-[clamp(2.2rem,5vw,4.2rem)] font-black uppercase leading-[0.9] tracking-tight text-white">
          SOLVING ROOT INEFFICIENCIES <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            NOT PILING ON ABSTRACTIONS.
          </span>
        </h2>
        <p className="mt-4 max-w-2xl font-sans text-base text-slate-300">
          Most modern software stacks stack library on top of library to solve symptoms. I design from the kernel, network socket, and storage engine up to permanently eliminate the root cause.
        </p>

        {/* Interactive Dilemma Explorer */}
        <div className="mt-14 grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Tab list (4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-2">
            {ARCHITECTURAL_PILLARS.map((pillar, idx) => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setSelectedPillar(idx)}
                className={`text-left rounded-lg border p-4 transition-all duration-200 cursor-pointer ${
                  selectedPillar === idx
                    ? 'border-emerald-500/60 bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-white'
                    : 'border-white/10 bg-zinc-950/40 text-white/60 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-emerald-400">
                    PILLAR 0{idx + 1}
                  </span>
                  <span className="font-mono text-[0.62rem] rounded bg-white/10 px-1.5 py-0.5 text-white/80">
                    {pillar.metric}
                  </span>
                </div>
                <div className="font-display mt-1 text-lg font-bold uppercase tracking-tight text-white">
                  {pillar.title}
                </div>
                <div className="font-mono text-xs text-white/50 truncate mt-0.5">
                  {pillar.subtitle}
                </div>
              </button>
            ))}
          </div>

          {/* Right Column: Comparative Inspection Card (8 cols) */}
          <div className="lg:col-span-8 rounded-xl border border-white/10 bg-zinc-950/90 p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-emerald-400">
                  DEEP ARCHITECTURAL COMPARISON
                </span>
                <h3 className="font-display text-2xl font-black uppercase text-white mt-1">
                  {active.title}
                </h3>
              </div>
              <span className="rounded bg-emerald-500/20 px-3 py-1 font-mono text-xs font-bold text-emerald-400 border border-emerald-500/30">
                {active.metric}
              </span>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {/* The Industry Way */}
              <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-5">
                <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  THE STANDARD INDUSTRY TAX
                </div>
                <p className="mt-3 font-sans text-sm leading-relaxed text-slate-300">
                  {active.standardWay}
                </p>
              </div>

              {/* The First-Principles Way */}
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ADITYA'S FIRST-PRINCIPLES APPROACH
                </div>
                <p className="mt-3 font-sans text-sm leading-relaxed text-slate-200 font-normal">
                  {active.adityaWay}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Empirical Benchmark Matrix */}
        <div className="mt-20">
          <div className="border-b border-white/10 pb-4">
            <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              EMPIRICAL BENCHMARK TRUTH TABLE
            </h3>
            <p className="font-mono text-xs text-white/50 mt-1">
              Direct telemetry extracted from real test suites, physical device profiling, and production runs.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-lg border border-white/10 bg-zinc-950/60">
            <table className="w-full text-left font-mono text-xs">
              <thead className="border-b border-white/10 bg-white/[0.03] text-white/60 uppercase text-[0.68rem] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">SYSTEM METRIC</th>
                  <th className="py-3.5 px-4 sm:px-6">TYPICAL INDUSTRY RUNTIME</th>
                  <th className="py-3.5 px-4 sm:px-6 text-emerald-400">REDDIRECTOR ARCHITECTURE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {BENCHMARK_DATA.map((row) => (
                  <tr key={row.metric} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-white/90">
                      {row.metric}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-white/50">
                      {row.standard}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-emerald-400">
                      {row.aditya}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
