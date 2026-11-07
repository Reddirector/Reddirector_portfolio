import { memo } from 'react'
import OrchestrationVisual from '../OrchestrationEngine/OrchestrationVisual'
import ValtSkyVisual from '../ValtSky/ValtSkyVisual'
import PentagonVisual from '../Pentagon/PentagonVisual'
import SaeVisual from '../SAEResearch/SaeVisual'

export default function ModernProjects({ onOpenDossier }) {
  return (
    <section id="work" className="relative isolate overflow-hidden bg-black py-24 sm:py-32">
      {/* Subtle section grid lines */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-red-400">
                01 // SELECTED WORK &amp; CORE ARCHITECTURES
              </p>
            </div>
            <span className="font-mono text-[0.68rem] uppercase tracking-wider text-white/40">
              4 PRODUCTION AIRFRAMES · ALL TESTS PASSING
            </span>
          </div>

          <h2 className="font-display mt-4 text-[clamp(2.2rem,5.5vw,4.5rem)] font-black uppercase leading-[0.9] tracking-tight text-white">
            FOUR FIRST-PRINCIPLES <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-300">MASTERPIECES.</span>
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-base text-slate-300">
            Systems engineered from bare metal up. No bloated abstractions, no unnecessary cloud costs, and verified against real-world edge failures.
          </p>
        </div>

        {/* 4 Flagship Projects Stack */}
        <div className="mt-16 space-y-16">
          {/* PROJECT 01: Orchestration Engine */}
          <article className="group rounded-xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_0_35px_rgba(229,72,77,0.15)]">
            <div className="grid gap-8 lg:grid-cols-12 items-stretch">
              {/* Left Column: Spec & Architecture (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-red-500/20 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-red-400 border border-red-500/30">
                      SYSTEM 01
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-wider text-emerald-400">
                      301/301 PASSING (92.35% COV)
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-wider text-white/40">
                      PyPI v1.0.0
                    </span>
                  </div>

                  <h3 className="font-display mt-3 text-3xl sm:text-4xl font-black uppercase tracking-tight text-white group-hover:text-red-400 transition-colors">
                    ORCHESTRATION ENGINE
                  </h3>
                  <p className="mt-1 font-mono text-xs text-white/50">
                    Python 3.10+ · Zero External Dependencies · Agentic Graphs · Sagas Rollback
                  </p>

                  <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-slate-300">
                    A fault-tolerant distributed workflow and agentic graph orchestration engine built entirely in the Python standard library. Features cyclic reflection graphs, distributed Sagas with automated rollback, O(1) constant-memory disk-spool streaming, multi-node CDC replication, work-stealing, and self-healing supervision without Redis, RabbitMQ, or Celery.
                  </p>

                  {/* Telemetry pill row */}
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[0.68rem]">
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      LATENCY: <strong className="text-white">627 µs/task</strong>
                    </div>
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      WAL THROUGHPUT: <strong className="text-emerald-400">44,730 w/s</strong>
                    </div>
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      SPEEDUP: <strong className="text-cyan-400">7.86x (8 wrk)</strong>
                    </div>
                  </div>
                </div>

                {/* Actions & Launch */}
                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() => onOpenDossier?.('orchestration-engine')}
                    className="inline-flex items-center gap-2 rounded-sm border border-red-500 bg-red-600 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(229,72,77,0.3)] transition-all hover:bg-red-500 hover:shadow-[0_0_25px_rgba(229,72,77,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    OPEN 10-CHAPTER TECHNICAL DOSSIER ↗
                  </button>
                  <a
                    href="https://pypi.org/project/orchestration-engine/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 bg-white/5 px-3 py-2 font-mono text-xs font-semibold text-white/80 hover:border-white/40 hover:text-white transition-all"
                  >
                    PyPI ↗
                  </a>
                  <a
                    href="https://github.com/Reddirector/Orchestration_Engine"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 bg-white/5 px-3 py-2 font-mono text-xs font-semibold text-white/80 hover:border-white/40 hover:text-white transition-all"
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Visual (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <OrchestrationVisual />
              </div>
            </div>
          </article>

          {/* PROJECT 02: ValtSky Multiplatform */}
          <article className="group rounded-xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(0,216,255,0.15)]">
            <div className="grid gap-8 lg:grid-cols-12 items-stretch">
              {/* Left Column: Spec & Architecture (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-cyan-400 border border-cyan-500/30">
                      SYSTEM 02
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-wider text-emerald-400">
                      49/49 AUTOMATED TESTS · 100/100 SEC
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-wider text-white/40">
                      DUAL-LANE SPLIT UPLOADER v2.1.0
                    </span>
                  </div>

                  <h3 className="font-display mt-3 text-3xl sm:text-4xl font-black uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    VALTSKY MULTIPLATFORM
                  </h3>
                  <p className="mt-1 font-mono text-xs text-white/50">
                    Dual-Lane Split Uploader · MTProto 2.0 · Flutter &amp; Dart Native · O(1) POSIX Streaming
                  </p>

                  <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-slate-300">
                    A high-performance zero-loss cloud vault with Dual-Lane Split Uploader architecture, streaming multi-gigabyte media with bounded memory (&lt; 28 MB RAM on 1.8 GB payloads). Features concurrent photo and video upload lanes, 10-second MTProto 2.0 phone auth via 2048-bit Diffie-Hellman key negotiation (zero @BotFather friction), a dual-stack WebSocket-to-TCP bridge for browsers, and monotonic chronological ordering.
                  </p>

                  {/* Telemetry pill row */}
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[0.68rem]">
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      RAM CONSUMPTION: <strong className="text-cyan-400">&lt; 28 MB (1.8 GB)</strong>
                    </div>
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      DIFFIE-HELLMAN: <strong className="text-white">2048-bit DH</strong>
                    </div>
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      AUTH SPEED: <strong className="text-emerald-400">&lt; 10s OTP</strong>
                    </div>
                  </div>
                </div>

                {/* Actions & Launch */}
                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() => onOpenDossier?.('valtsky-lossless-cloud-vault')}
                    className="inline-flex items-center gap-2 rounded-sm border border-cyan-500 bg-cyan-600 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(0,216,255,0.3)] transition-all hover:bg-cyan-500 hover:shadow-[0_0_25px_rgba(0,216,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    SYSTEM ARCHITECTURE DOSSIER ↗
                  </button>
                  <a
                    href="https://reddirector.github.io/ValtSky/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 bg-white/5 px-3 py-2 font-mono text-xs font-semibold text-white/80 hover:border-white/40 hover:text-white transition-all"
                  >
                    Web Client ↗
                  </a>
                  <a
                    href="https://github.com/Reddirector/ValtSky/releases/download/v2.1/valtsky-v2.1-release.apk"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 font-mono text-xs font-semibold text-cyan-300 hover:border-cyan-400 hover:text-white transition-all"
                  >
                    Release APK 📥
                  </a>
                  <a
                    href="https://github.com/Reddirector/ValtSky"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 bg-white/5 px-3 py-2 font-mono text-xs font-semibold text-white/80 hover:border-white/40 hover:text-white transition-all"
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>

              {/* Right Column: ValtSky Magic Transform Visual (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-center overflow-hidden rounded-lg border border-white/10 bg-zinc-950 p-2 sm:p-4">
                <ValtSkyVisual />
              </div>
            </div>
          </article>

          {/* PROJECT 03: Pentagon AI Workstation */}
          <article className="group rounded-xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(168,85,247,0.15)]">
            <div className="grid gap-8 lg:grid-cols-12 items-stretch">
              {/* Left Column: Spec & Architecture (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-purple-400 border border-purple-500/30">
                      SYSTEM 03
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-wider text-emerald-400">
                      ZERO CLOUD LEAKS · BYOK
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-wider text-white/40">
                      6 RISK CATEGORIES · 4 TIERS
                    </span>
                  </div>

                  <h3 className="font-display mt-3 text-3xl sm:text-4xl font-black uppercase tracking-tight text-white group-hover:text-purple-400 transition-colors">
                    PENTAGON WORKSTATION
                  </h3>
                  <p className="mt-1 font-mono text-xs text-white/50">
                    FastAPI · LangGraph State Machine · Local ChromaDB RAG · Fernet AES-128-CBC
                  </p>

                  <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-slate-300">
                    Enterprise-grade, local-first multimodal AI workstation built with strict Bring Your Own Key (BYOK) Fernet encryption at rest. Features on-device ChromaDB document retrieval with fail-safe automatic migration to local CPU embeddings, hierarchical autonomy governance, and multimodal vision/voice pipelines across Web, Android APK, Electron, and bootable ISO.
                  </p>

                  {/* Telemetry pill row */}
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[0.68rem]">
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      ENCRYPTION: <strong className="text-white">AES-128 + HMAC</strong>
                    </div>
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      VECTOR STORE: <strong className="text-purple-400">ChromaDB CPU Fallback</strong>
                    </div>
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      DEPLOYMENTS: <strong className="text-emerald-400">Web · APK · Electron · ISO</strong>
                    </div>
                  </div>
                </div>

                {/* Actions & Launch */}
                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() => onOpenDossier?.('pentagon')}
                    className="inline-flex items-center gap-2 rounded-sm border border-purple-500 bg-purple-600 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all hover:bg-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  >
                    ENTERPRISE ARCHITECTURE REPORT ↗
                  </button>
                  <a
                    href="https://pentagon-bice.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 bg-white/5 px-3 py-2 font-mono text-xs font-semibold text-white/80 hover:border-white/40 hover:text-white transition-all"
                  >
                    Live Demo ↗
                  </a>
                </div>
              </div>

              {/* Right Column: 3D Pentagon Visual (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-center min-h-[300px] overflow-hidden rounded-lg border border-white/10 bg-zinc-950 p-2 sm:p-4">
                <PentagonVisual />
              </div>
            </div>
          </article>

          {/* PROJECT 04: SAE Sparse Autoencoders */}
          <article className="group rounded-xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_0_35px_rgba(245,158,11,0.15)]">
            <div className="grid gap-8 lg:grid-cols-12 items-stretch">
              {/* Left Column: Spec & Architecture (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-amber-400 border border-amber-500/30">
                      SYSTEM 04
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-wider text-emerald-400">
                      0.897562 COSINE SIM
                    </span>
                    <span className="font-mono text-[0.65rem] tracking-wider text-purple-400">
                      0.10% DEAD FEATURES
                    </span>
                  </div>

                  <h3 className="font-display mt-3 text-3xl sm:text-4xl font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
                    SAE REPRODUCTION
                  </h3>
                  <p className="mt-1 font-mono text-xs text-white/50">
                    Mechanistic Interpretability · Anthropic Paper Reproduction · GELU-1L
                  </p>

                  <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-slate-300">
                    An independent sparse autoencoder mechanistic interpretability experiment reproducing Anthropic's methodology. Evaluates a GELU-1L model with 2,048 input dimensions and 4,096 latent dictionary features, achieving a 0.897562 validation cosine similarity and a mere 0.10% dead feature rate.
                  </p>

                  {/* Telemetry pill row */}
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[0.68rem]">
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      INPUT DIMS: <strong className="text-white">2,048</strong>
                    </div>
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      DICTIONARY: <strong className="text-amber-400">4,096 latents</strong>
                    </div>
                    <div className="rounded border border-white/5 bg-white/[0.02] p-2 text-white/70">
                      MONOSEMANTIC: <strong className="text-emerald-400">High Resolution</strong>
                    </div>
                  </div>
                </div>

                {/* Actions & Launch */}
                <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                  <button
                    type="button"
                    onClick={() => onOpenDossier?.('sae-reproduction')}
                    className="inline-flex items-center gap-2 rounded-sm border border-amber-500 bg-amber-600 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-500 hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    RESEARCH REPRODUCTION CASE STUDY ↗
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive SaeVisual (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <SaeVisual />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
