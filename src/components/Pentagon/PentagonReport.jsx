import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import HoldButton from '../../HoldButton'
import CipherReveal from '../../CipherReveal'
import GlyphLottery from '../../GlyphLottery'
import './pentagon-report.css'

const PENTAGON_APP_URL = 'https://pentagon-bice.vercel.app'
const PENTAGON_DOCS_URL = 'https://pentagon-bice.vercel.app'

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Ambient geometry watermark and floating celestial shapes
function PentagonReportAmbience() {
  const field = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const scroller = field.current?.closest('.project-overlay')
    const context = gsap.context(() => {
      gsap.to('.pentagon-ambience-ring--spin', { rotate: 360, duration: 90, ease: 'none', repeat: -1 })
      gsap.to('.pentagon-ambience-float', {
        y: -14,
        rotate: 10,
        opacity: 0.24,
        duration: 7.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: { each: 1.5, from: 'random' },
      })
      if (scroller) {
        const range = { trigger: field.current, scroller, start: 'top bottom', end: 'bottom top', scrub: 1 }
        gsap.fromTo('.pentagon-ambience-ring--orbit', { yPercent: -14, rotate: -12 }, { yPercent: 14, rotate: 12, ease: 'none', scrollTrigger: range })
        gsap.fromTo('.pentagon-ambience-diamond', { y: 28, rotate: -20 }, { y: -28, rotate: 55, ease: 'none', scrollTrigger: range })
      }
    }, field)
    return () => context.revert()
  }, [])

  return (
    <div ref={field} className="oe-ambience" aria-hidden="true">
      <i className="oe-ambience-plane" />
      <i className="oe-ambience-ring oe-ambience-ring--spin pentagon-ambience-ring--spin" />
      <i className="oe-ambience-ring oe-ambience-ring--orbit pentagon-ambience-ring--orbit" />
      <i className="oe-ambience-diamond pentagon-ambience-diamond" />
      <i className="oe-ambience-diamond oe-ambience-diamond--secondary" />
      <i className="oe-ambience-float oe-ambience-square pentagon-ambience-float" />
      <i className="oe-ambience-float oe-ambience-cross pentagon-ambience-float"><b /><b /></i>
      {/* Pentagon SVG watermark */}
      <svg className="absolute -top-12 -right-12 w-[34rem] h-[34rem] opacity-[0.035] pointer-events-none" viewBox="0 0 200 200">
        <polygon points="100,10 190,75 155,180 45,180 10,75" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" />
        <polygon points="100,35 168,85 142,165 58,165 32,85" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
      </svg>
    </div>
  )
}

// Live telemetry event ticker
function PentagonEventTicker() {
  const events = [
    { label: 'SSE Stream', detail: '/api/chat · TTFT under 340ms' },
    { label: 'ChromaDB Pinned', detail: 'nemotron 3 embed 1b (1024 dim vectors)' },
    { label: 'Key Vault', detail: 'Fernet AES 128 CBC and HMAC authentication' },
    { label: 'Capability Gate', detail: 'Capability token verified' },
    { label: 'Governance Policy', detail: 'Balanced preset active · 6 risk categories' },
    { label: 'Fallback Bridge', detail: 'all MiniLM local CPU standby' },
    { label: 'Search Net Bot', detail: 'DuckDuckGo keyless crawler sanitized' },
    { label: 'Multimodal', detail: 'Whisper STT · Kokoro voice · Multi frame vision' },
  ]
  return (
    <div className="oe-event-ticker" role="region" aria-label="Pentagon Workstation telemetry status stream">
      <div className="oe-event-ticker-track">
        {[...events, ...events].map((evt, idx) => (
          <span key={idx} className="oe-event-pill">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            <b>{evt.label}:</b> {evt.detail}
          </span>
        ))}
      </div>
    </div>
  )
}

// Interactive Autonomy Permission Matrix
function AutonomyPermissionMatrix() {
  const presets = [
    {
      id: 'balanced',
      name: 'Balanced (Default)',
      desc: 'Auto approves harmless read only lookups; prompts user on shell commands and file writes.',
      rules: {
        read_only_info: { level: 'auto_approve', badge: 'ok', label: 'Auto Approve' },
        local_filesystem_write: { level: 'always_ask', badge: 'warn', label: 'Always Ask' },
        local_shell: { level: 'always_ask', badge: 'warn', label: 'Always Ask' },
        external_write: { level: 'always_ask', badge: 'warn', label: 'Always Ask' },
        external_destructive: { level: 'always_ask', badge: 'danger', label: 'Always Ask' },
        financial_or_irreversible: { level: 'always_ask', badge: 'danger', label: 'Always Ask' },
      },
    },
    {
      id: 'cautious',
      name: 'Cautious',
      desc: 'Strict zero trust mode. Prompts confirmation for every action except basic read only info.',
      rules: {
        read_only_info: { level: 'auto_approve', badge: 'ok', label: 'Auto Approve' },
        local_filesystem_write: { level: 'always_ask', badge: 'warn', label: 'Always Ask' },
        local_shell: { level: 'always_ask', badge: 'danger', label: 'Always Ask' },
        external_write: { level: 'always_ask', badge: 'danger', label: 'Always Ask' },
        external_destructive: { level: 'never_allow', badge: 'danger', label: 'Never Allow' },
        financial_or_irreversible: { level: 'never_allow', badge: 'danger', label: 'Never Allow' },
      },
    },
    {
      id: 'autonomous',
      name: 'Autonomous Workstation',
      desc: 'Full developer velocity. Automatically runs local shell and file builds; blocks destructive or financial actions.',
      rules: {
        read_only_info: { level: 'auto_approve', badge: 'ok', label: 'Auto Approve' },
        local_filesystem_write: { level: 'auto_approve', badge: 'ok', label: 'Auto Approve' },
        local_shell: { level: 'auto_approve', badge: 'ok', label: 'Auto Approve' },
        external_write: { level: 'auto_approve', badge: 'warn', label: 'Auto Approve' },
        external_destructive: { level: 'always_ask', badge: 'danger', label: 'Always Ask (Hard invariant)' },
        financial_or_irreversible: { level: 'always_ask', badge: 'danger', label: 'Always Ask (Hard invariant)' },
      },
    },
  ]

  const categories = [
    { key: 'read_only_info', name: '1. Read Only Info', detail: 'Web search, document retrieval, file reads, and RAG vector lookups' },
    { key: 'local_filesystem_write', name: '2. Local Filesystem Write', detail: 'Creating documents, writing code, updating configs, and saving deliverables' },
    { key: 'local_shell', name: '3. Local Shell Execution', detail: 'Terminal execution, compiler builds, unit tests, and CLI subprocesses' },
    { key: 'external_write', name: '4. External Write API', detail: 'Dispatching outbound webhooks, creating GitHub PRs, and sending email notifications' },
    { key: 'external_destructive', name: '5. External Destructive', detail: 'Deleting remote repositories, dropping cloud instances, or purging production data' },
    { key: 'financial_or_irreversible', name: '6. Irreversible / Financial', detail: 'Payment executions, crypto transactions, disk partition wipes, or key revocation' },
  ]

  const [activePreset, setActivePreset] = useState(0)
  const current = presets[activePreset]

  return (
    <div className="pentagon-interactive-box" aria-label="Interactive Autonomy Governance Matrix">
      <div className="pentagon-interactive-head">
        <span>Autonomy Governance · 6 Risk Categories × 4 Permission Tiers</span>
        <div className="pentagon-preset-group" role="group" aria-label="Select autonomy preset">
          {presets.map((preset, idx) => (
            <button
              key={preset.id}
              type="button"
              className={`pentagon-preset-btn ${idx === activePreset ? 'is-active' : ''}`}
              onClick={() => setActivePreset(idx)}
              aria-pressed={idx === activePreset}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pentagon-matrix-grid">
        {categories.map((cat) => {
          const rule = current.rules[cat.key]
          return (
            <div key={cat.key} className="pentagon-matrix-row">
              <span className="pentagon-matrix-cat">{cat.name}</span>
              <span className="pentagon-matrix-desc">{cat.detail}</span>
              <span className={`pentagon-report-badge pentagon-report-badge--${rule.badge}`}>
                {rule.label}
              </span>
            </div>
          )
        })}
      </div>

      <p className="pentagon-step-desc mt-3">
        <b>Active Preset Policy:</b> {current.desc}
      </p>
      <small className="block mt-2 font-mono text-[.54rem] uppercase tracking-[.06em] text-white/45">
        Invariant: High risk actions (Categories 5 and 6) can never be auto approved by global presets.
      </small>
    </div>
  )
}

// Interactive LangGraph Agent Loop Visualizer
function LangGraphAgentLoopVisualizer() {
  const steps = [
    {
      num: '01',
      title: 'Intake & Route',
      actor: 'Intent Router Node',
      desc: 'Incoming turn is received over SSE. A background lightweight 8B model asynchronously generates a clean title without blocking initial streaming, while the router analyzes query intent.',
      meta: 'Latency under 45ms · Fast summarizer',
    },
    {
      num: '02',
      title: 'Context Retrieval',
      actor: 'ChromaDB & Search Net Bot',
      desc: 'If query mentions uploaded documents, computes query embedding and retrieves top chunks with cosine similarity. If current factual data is needed, dispatches sanitized DuckDuckGo search.',
      meta: 'Semantic chunks · XML source boundaries',
    },
    {
      num: '03',
      title: 'Governance Gate',
      actor: 'Autonomy & Permission Engine',
      desc: 'Evaluates required tools against the 6 risk categories. If action requires human approval, execution pauses and emits an approval required event to the frontend dialog.',
      meta: 'Zero unauthorized execution · Async resume',
    },
    {
      num: '04',
      title: 'Inference & Tools',
      actor: 'NVIDIA NIM & Sandboxed Runner',
      desc: 'Streams prompt tokens with sub-second time to first token. If LLM emits tool call, executes sandboxed code or MCP server action, returning output back into the state graph.',
      meta: '80+ Models · Nemotron / Llama 3.3',
    },
    {
      num: '05',
      title: 'Atomic Persist',
      actor: 'SQLite & Context Compaction',
      desc: 'Persists thread turns, encrypted keys, and citation metadata atomically into SQLite. If a model switches mid thread, runs contextual compaction to preserve dialogue history.',
      meta: 'Fernet AES at rest · Structured memory',
    },
  ]

  const [activeStep, setActiveStep] = useState(0)
  const current = steps[activeStep]

  return (
    <div className="pentagon-interactive-box" aria-label="Interactive LangGraph Agent Loop Visualizer">
      <div className="pentagon-interactive-head">
        <span>Deterministic LangGraph State Graph Execution Flow</span>
        <span className="font-mono text-[.55rem] text-white/50">Step {activeStep + 1} of {steps.length}</span>
      </div>

      <div className="pentagon-agent-steps">
        {steps.map((st, idx) => (
          <button
            key={st.num}
            type="button"
            className={`pentagon-step-card ${idx === activeStep ? 'is-active' : ''}`}
            onClick={() => setActiveStep(idx)}
            aria-pressed={idx === activeStep}
          >
            <span className="pentagon-step-num">{st.num}</span>
            <span className="pentagon-step-name">{st.title}</span>
            <small className="font-mono text-[.5rem] uppercase tracking-[.06em] text-white/45 mt-2 block">{st.actor}</small>
          </button>
        ))}
      </div>

      <div className="pentagon-step-desc">
        <div className="flex items-center justify-between mb-2">
          <strong className="text-white font-mono text-[.66rem] uppercase tracking-[.08em]">{current.title} · {current.actor}</strong>
          <span className="font-mono text-[.58rem] text-red-400">{current.meta}</span>
        </div>
        <p className="m-0 text-white/80">{current.desc}</p>
      </div>
    </div>
  )
}

// Interactive RAG & CPU Fallback Simulator
function RagFallbackSimulator() {
  const [offlineMode, setOfflineMode] = useState(false)

  return (
    <div className="pentagon-interactive-box" aria-label="Interactive RAG and CPU Fallback Migration Simulator">
      <div className="pentagon-interactive-head">
        <span>Fault Tolerant ChromaDB RAG and CPU Fallback Bridge</span>
        <button
          type="button"
          className="pentagon-preset-btn is-active"
          onClick={() => setOfflineMode(!offlineMode)}
        >
          {offlineMode ? 'Simulate: Key Valid / Online' : 'Simulate: Key Revoked / Offline'}
        </button>
      </div>

      <div className="pentagon-rag-display">
        <div className="pentagon-rag-card">
          <span>Active Ingestion Model</span>
          <strong className={offlineMode ? 'text-amber-400' : 'text-emerald-400'}>
            {offlineMode ? 'all MiniLM CPU' : 'nemotron 3 embed 1b'}
          </strong>
          <small className="font-mono text-[.55rem] text-white/50 block">
            {offlineMode ? 'Local CPU Model (384 dim vectors)' : 'NVIDIA NIM Cloud (1024 dim vectors)'}
          </small>
        </div>

        <div className="pentagon-rag-card">
          <span>Retrieval Resilience State</span>
          <strong className={offlineMode ? 'text-amber-400' : 'text-emerald-400'}>
            {offlineMode ? 'CPU Fallback Active' : 'Optimal Cloud Ingestion'}
          </strong>
          <small className="font-mono text-[.55rem] text-white/50 block">
            {offlineMode ? 'Automatic background re-encode completed' : 'Low latency hardware accelerated'}
          </small>
        </div>

        <div className="pentagon-rag-card">
          <span>Citation &amp; Security Boundary</span>
          <strong>Strict XML Citations</strong>
          <small className="font-mono text-[.55rem] text-white/50 block">
            &lt;source_chunk id="..."&gt; · Anti injection verified
          </small>
        </div>
      </div>

      <p className="pentagon-step-desc mt-3">
        {offlineMode ? (
          <>
            <b className="text-amber-400">Degradation Handled:</b> The API key probe detected quota expiration or revoked credentials. Instead of failing with HTTP 500 or corrupting existing vector spaces, Pentagon triggered an automated background migration: raw stored text chunks were re-encoded using <code>sentence transformers all MiniLM</code> on the local CPU. The collection metadata was updated with zero thread disruption.
          </>
        ) : (
          <>
            <b className="text-emerald-400">Normal Cloud Operation:</b> The cloud embedding probe verified active credentials. Chunks are ingested via <code>nemotron 3 embed 1b</code> into 1024 dimensional vectors in ChromaDB. If keys ever change or lapse, the automated bridge guarantees immediate CPU failover.
          </>
        )}
      </p>
    </div>
  )
}

// Main Pentagon Case File Report Component
export default function PentagonWorkstationReport({ entranceDelay = 0, setupScrollFx, useReadout }) {
  const report = useRef(null)

  const sectionAnchors = [
    { id: 'pentagon-s01', label: 'security & byok' },
    { id: 'pentagon-s02', label: 'agent loop' },
    { id: 'pentagon-s03', label: 'rag pipeline' },
    { id: 'pentagon-s04', label: 'governance' },
    { id: 'pentagon-s05', label: 'multimodal & mcp' },
    { id: 'pentagon-s06', label: 'multiplatform' },
    { id: 'pentagon-s07', label: 'recovery & edge' },
  ]

  useLayoutEffect(() => {
    const root = report.current
    const scope = root?.closest('.oe-report-panel')
    if (!root || !scope || !setupScrollFx) return undefined
    return setupScrollFx(scope, 'oe', entranceDelay)
  }, [entranceDelay, setupScrollFx])

  if (useReadout) {
    useReadout(report, sectionAnchors)
  }

  return (
    <div className="oe-report" ref={report}>
      <PentagonReportAmbience />

      <main className="oe-report-main">
        {/* HERO SECTION */}
        <header className="oe-report-hero">
          <p className="oe-report-kicker">Independent systems project · Enterprise local first AI workstation</p>
          <CipherReveal id="project-title" as="h2" className="pentagon-report-title" duration={1.4} scramble={0.35} order="left" hover="trail">
            A local first workstation{' '}
            <span>built for private, zero leak intelligence.</span>
          </CipherReveal>
          <p id="project-detail" className="oe-report-intro">
            I built Pentagon as a personal AI workstation that never hoards API credentials in the cloud or leaks data to third parties. Everything runs local first: keys stay encrypted on your own machine with Fernet, workflows execute deterministically through LangGraph state machines, and document search falls back cleanly to a local CPU model if cloud keys lapse. Six tiers of autonomy governance keep file and terminal tools strictly within bounds across web, mobile, desktop, and bootable offline media.
          </p>

          <div className="oe-report-links">
            <a href={PENTAGON_APP_URL} target="_blank" rel="noreferrer">
              Launch live workstation <span aria-hidden="true">↗</span>
            </a>
            <a href={PENTAGON_DOCS_URL} target="_blank" rel="noreferrer">
              Inspect architecture specification <span aria-hidden="true">↗</span>
            </a>
            <HoldButton
              doneLabel="Opening..."
              backgroundColor="#27272a"
              fillColor="#ef4444"
              textColor="#f5f5f5"
              fillTextColor="#ffffff"
              size="md"
              radius={14}
              fillDirection="right"
              holdTime={2000}
              releaseTime={200}
              pressScale={0.97}
              wave
              waveAmplitude={6}
              glow
              resetAfter={1200}
              onHold={() => window.open('https://github.com/Reddirector', '_blank')}
            >
              GitHub repository ↗
            </HoldButton>
          </div>

          <div className="oe-hero-chips" aria-hidden="true">
            <span>FastAPI 0.115+</span>
            <span>LangGraph State Graph</span>
            <span>ChromaDB Vector Store</span>
            <span>Fernet Key Vault</span>
            <span>80+ NVIDIA NIM Models</span>
            <span>Android APK · Electron · Offline ISO</span>
          </div>
          <i className="oe-hero-bracket oe-hero-bracket--tl" aria-hidden="true" />
          <i className="oe-hero-bracket oe-hero-bracket--br" aria-hidden="true" />
        </header>

        <PentagonEventTicker />

        {/* METRICS STRIP */}
        <section className="oe-report-metrics" aria-label="Project snapshot">
          <article>
            <span>Security Model</span>
            <strong><GlyphLottery text="Fernet BYOK" accentColor="var(--color-interactive)" /></strong>
            <small>AES 128 bit encryption at rest</small>
          </article>
          <article>
            <span>Model Catalog</span>
            <strong><GlyphLottery text="80+ Models" accentColor="var(--color-interactive)" /></strong>
            <small>NVIDIA NIM and streaming protocol</small>
          </article>
          <article>
            <span>RAG Fallback</span>
            <strong><GlyphLottery text="100% CPU" accentColor="var(--color-interactive)" /></strong>
            <small>Automated local model degradation</small>
          </article>
          <article>
            <span>Distribution</span>
            <strong><GlyphLottery text="5 Targets" accentColor="var(--color-interactive)" /></strong>
            <small>Web, Android APK, iOS, Electron, ISO</small>
          </article>
        </section>
        <p className="oe-report-note">
          Engineered as a local first system: keys are never stored in plain text, telemetry is zeroed out, and retrieval degrades gracefully to CPU embeddings if API credentials expire.
        </p>

        {/* SECTION 01: BYOK SECURITY */}
        <section className="oe-report-section" id="pentagon-s01">
          <div className="oe-report-section-label">
            <span>01</span>
            <p>Cryptographic Security &amp; Zero Leak Architecture</p>
          </div>
          <div className="oe-report-section-body">
            <h3>Eliminating cloud key hoarding with client controlled cryptography.</h3>
            <p>
              Traditional hosted AI platforms present an inherent security vulnerability: storing user API credentials in centralized databases creates an irresistible attack surface. Pentagon eliminates this risk through a strict <b>Bring Your Own Key (BYOK)</b> architecture.
            </p>
            <p>
              Credentials supplied by users are encrypted locally at rest using <b>Fernet</b> (symmetric 128 bit AES in CBC mode with PKCS7 padding and HMAC SHA256 authentication). Keys exist in memory only during the active HTTP request turn and are purged immediately after token streaming completes.
            </p>

            <div className="oe-report-facts">
              <p>
                <span>01 / Symmetric Key Vault</span>
                <b>Encrypted locally with Fernet AES and HMAC authentication. Zero plain text keys in storage or logs.</b>
              </p>
              <p>
                <span>02 / Ephemeral Lifecycle</span>
                <b>Keys exist in server memory strictly during active inference, cleared immediately after completion.</b>
              </p>
              <p>
                <span>03 / Capability Gate</span>
                <b>Mandatory capability verification on all streaming, REST, and administrative endpoints.</b>
              </p>
            </div>

            <div className="pentagon-code-container">
              <div className="pentagon-code-header">
                <span>Cryptographic Key Vault &amp; Governance Schema (SQLite)</span>
                <span>schema.sql</span>
              </div>
              <pre className="pentagon-code-body">
{`-- User Key Vault (Encrypted at rest with Fernet AES 128 CBC)
CREATE TABLE IF NOT EXISTS user_keys (
    user_id TEXT PRIMARY KEY,
    encrypted_key TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Granular Autonomy & Permission Tiers
CREATE TABLE IF NOT EXISTS autonomy_settings (
    user_id TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL CHECK(level IN ('always_ask', 'ask_first_time', 'auto_approve', 'never_allow')),
    PRIMARY KEY(user_id, category)
);`}
              </pre>
            </div>
          </div>
        </section>

        {/* SECTION 02: LANGGRAPH AGENT LOOP */}
        <section className="oe-report-section" id="pentagon-s02">
          <div className="oe-report-section-label">
            <span>02</span>
            <p>Deterministic LangGraph State Machine</p>
          </div>
          <div className="oe-report-section-body">
            <h3>Preventing infinite cycles and runaway execution with formal state graphs.</h3>
            <p>
              Asynchronous agent loops built with loose while loops often degrade into unconstrained retries, recursive tool deadlocks, and unpredictable execution branches. Pentagon structures its agent loop as a deterministic <b>state graph</b> powered by LangGraph.
            </p>
            <p>
              Every turn transitions through discrete validation states: intent routing, vector corpus search, web lookup sanitization, permission evaluation, streaming token delivery, and human in the loop approvals.
            </p>

            <LangGraphAgentLoopVisualizer />

            <div className="oe-report-checks mt-4">
              <article>
                <span>First Turn Semantic Title Generation</span>
                <p className="mt-2 text-white/75 text-[.82rem] leading-relaxed">
                  As the user types their first prompt, a concurrent background 8B model summarizes intent into a clean title without blocking initial streaming tokens.
                </p>
              </article>
              <article>
                <span>Dynamic Context Compaction</span>
                <p className="mt-2 text-white/75 text-[.82rem] leading-relaxed">
                  When switching models mid thread, prior turns are condensed into structured memory to respect token budgets and prevent tokenizer degradation.
                </p>
              </article>
              <article>
                <span>Human in the Loop Approval</span>
                <p className="mt-2 text-white/75 text-[.82rem] leading-relaxed">
                  Sensitive tool actions emit an approval required event, pausing the LangGraph state until explicit user confirmation is received via the interface.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 03: RAG & CPU FALLBACK */}
        <section className="oe-report-section" id="pentagon-s03">
          <div className="oe-report-section-label">
            <span>03</span>
            <p>Fault Tolerant RAG &amp; CPU Fallback</p>
          </div>
          <div className="oe-report-section-body">
            <h3>Resolving embedding space fragmentation with automated CPU migration.</h3>
            <p>
              A fundamental hazard in Retrieval Augmented Generation is <b>Embedding Space Fragmentation</b>: if an API key expires or a provider changes model dimensions, existing database vectors become mathematically incompatible with incoming query embeddings.
            </p>
            <p>
              Pentagon bridges this gap through an automated graceful degradation pipeline. If the cloud embedding endpoint fails or lapses, Pentagon automatically initiates a one time CPU re-encoding of stored chunks into local sentence transformer embeddings on the CPU.
            </p>

            <RagFallbackSimulator />

            <table className="pentagon-spec-table">
              <thead>
                <tr>
                  <th>Pipeline Stage</th>
                  <th>Implementation Specification</th>
                  <th>Security &amp; Performance Invariant</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Document Ingestion</td>
                  <td>Tika, PyPDF, Docx Parser &amp; Tabular Extractors</td>
                  <td>Isolates parser processes to prevent memory leaks from heavy 500+ page documents.</td>
                </tr>
                <tr>
                  <td>Semantic Chunking</td>
                  <td>512 tokens with 10% sliding window overlap</td>
                  <td>Preserves contextual continuity across paragraph and table boundaries.</td>
                </tr>
                <tr>
                  <td>Vector Storage</td>
                  <td>ChromaDB on device persistent vector collections</td>
                  <td>Stores metadata with pinned embedding model identifier for validation.</td>
                </tr>
                <tr>
                  <td>Prompt Injection Guard</td>
                  <td>Strict XML tagging: &lt;source_chunk id="..."&gt;</td>
                  <td>Prevents untrusted uploaded document content from overriding system instructions.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 04: AUTONOMY GOVERNANCE */}
        <section className="oe-report-section" id="pentagon-s04">
          <div className="oe-report-section-label">
            <span>04</span>
            <p>Hierarchical Autonomy Governance</p>
          </div>
          <div className="oe-report-section-body">
            <h3>Granular risk categorization preventing unauthorized destructive operations.</h3>
            <p>
              Agents equipped with terminal and API access require defense in depth safeguards. Pentagon partitions all tool executions into <b>six distinct risk categories</b> evaluated against <b>four autonomy tiers</b>.
            </p>

            <AutonomyPermissionMatrix />

            <div className="oe-report-facts">
              <p>
                <span>The Hard Invariant</span>
                <b>High risk actions (Categories 5 &amp; 6) can never be auto approved by global presets. They mandate manual confirmation.</b>
              </p>
              <p>
                <span>Zero Bypass Architecture</span>
                <b>All tool suggestions pass through the governance gate before reaching the shell dispatcher or network sockets.</b>
              </p>
              <p>
                <span>Granular Tool Overrides</span>
                <b>Users can override individual tools, such as permitting test runs while prompting on repository pushes or file deletions.</b>
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 05: MULTIMODAL & TOOLS */}
        <section className="oe-report-section" id="pentagon-s05">
          <div className="oe-report-section-label">
            <span>05</span>
            <p>Multimodal Intelligence, Search &amp; Deliverables</p>
          </div>
          <div className="oe-report-section-body">
            <h3>Full multimodal sensing, keyless search bots, and rich document generation.</h3>
            <p>
              Pentagon coordinates multimodal perception, live web exploration, and document synthesis:
            </p>

            <div className="oe-report-checks">
              <article>
                <span>Multi Frame Vision &amp; Video</span>
                <p className="mt-2 text-white/75 text-[.82rem] leading-relaxed">
                  Processes high resolution images and performs adaptive temporal frame sampling for video inspection and visual reviews.
                </p>
              </article>
              <article>
                <span>Neural Speech &amp; Voice Synthesis</span>
                <p className="mt-2 text-white/75 text-[.82rem] leading-relaxed">
                  Integrates Whisper neural speech to text with microphone streaming, paired with Kokoro neural voice for audio feedback.
                </p>
              </article>
              <article>
                <span>Keyless Search Net Bot</span>
                <p className="mt-2 text-white/75 text-[.82rem] leading-relaxed">
                  Queries DuckDuckGo with HTML sanitization, extracting live web facts and citations without requiring third party search API keys.
                </p>
              </article>
              <article>
                <span>Executable Deliverables Engine</span>
                <p className="mt-2 text-white/75 text-[.82rem] leading-relaxed">
                  Generates interactive single page apps, publication quality vector PDFs, Word documents, slide decks, and spreadsheets with formulas.
                </p>
              </article>
              <article>
                <span>MCP Protocol &amp; Plugins</span>
                <p className="mt-2 text-white/75 text-[.82rem] leading-relaxed">
                  Direct compatibility with Model Context Protocol servers and modular skill plugins, connecting to external devtools and services.
                </p>
              </article>
              <article>
                <span>Multi Turn Memory Compaction</span>
                <p className="mt-2 text-white/75 text-[.82rem] leading-relaxed">
                  Compresses multi turn thread history into compact memory vectors, preserving high reasoning context across extended conversations.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 06: MULTI-PLATFORM DISTRIBUTION */}
        <section className="oe-report-section" id="pentagon-s06">
          <div className="oe-report-section-label">
            <span>06</span>
            <p>Cross Platform Compilation &amp; Mobile UX</p>
          </div>
          <div className="oe-report-section-body">
            <h3>Simultaneous compilation across Web, Android, iOS, Desktop, and Offline ISO.</h3>
            <p>
              Pentagon compiles from a single TypeScript, React 19, and Tailwind CSS codebase into native builds across five distribution channels:
            </p>

            <table className="pentagon-spec-table">
              <thead>
                <tr>
                  <th>Platform Target</th>
                  <th>Packaging Mechanism</th>
                  <th>Compilation Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Web Edge</td>
                  <td>Vercel Edge SPA with caching and clean routing</td>
                  <td><code>pentagon-bice.vercel.app</code></td>
                </tr>
                <tr>
                  <td>Android Mobile</td>
                  <td>Capacitor sync to native Gradle project (Android 8.0+)</td>
                  <td><code>Pentagon-0.1.0-android.apk</code></td>
                </tr>
                <tr>
                  <td>iOS Mobile</td>
                  <td>Capacitor sync to native Xcode workspace (iOS 14.0+)</td>
                  <td><code>Pentagon-0.1.0-ios-project.zip</code></td>
                </tr>
                <tr>
                  <td>Desktop (Win / Linux)</td>
                  <td>Electron Builder packager with sandboxed IPC</td>
                  <td><code>Pentagon-0.1.0-win-x64.zip / .AppImage / .deb</code></td>
                </tr>
                <tr>
                  <td>Offline Media</td>
                  <td>Air gapped ISO compilation with <code>xorriso</code></td>
                  <td><code>Pentagon-0.1.0.iso</code></td>
                </tr>
              </tbody>
            </table>

            <div className="oe-report-facts mt-4">
              <p>
                <span>Safe Area Mobile Layouts</span>
                <b>Maps safe area insets to avoid notches, curved displays, and home indicator collision.</b>
              </p>
              <p>
                <span>Centered Floating Popovers</span>
                <b>On smaller viewports, converts dropdowns into centered floating modal cards to prevent edge clipping.</b>
              </p>
              <p>
                <span>Zero Auto Zoom Lock</span>
                <b>Enforces a 16px input base typography to stop mobile browsers from triggering unwanted viewport shifts on focus.</b>
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 07: FAILURE MODES & RECOVERY */}
        <section className="oe-report-section" id="pentagon-s07">
          <div className="oe-report-section-label">
            <span>07</span>
            <p>Failure Modes, Edge Cases &amp; Recovery</p>
          </div>
          <div className="oe-report-section-body">
            <h3>Defensive engineering protocols ensuring zero crash propagation.</h3>
            <p>
              Real world systems encounter network dropouts, quota exhaustion, and malformed inputs. Pentagon implements automated recovery protocols for every runtime failure mode:
            </p>

            <table className="pentagon-spec-table">
              <thead>
                <tr>
                  <th>Failure Mode</th>
                  <th>Root Cause</th>
                  <th>Automated Recovery Protocol</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>HTTP 429 Rate Limit</td>
                  <td>Quota or concurrency ceiling reached</td>
                  <td>Exponential backoff with randomized jitter up to 3 retries with UI status pill.</td>
                </tr>
                <tr>
                  <td>Revoked or Expired Key</td>
                  <td>Key revoked or deleted upstream</td>
                  <td>Non destructive key gate: flags state as unauthorized without losing thread conversation history.</td>
                </tr>
                <tr>
                  <td>Mid Stream Network Drop</td>
                  <td>Mobile Wi-Fi handoff or socket loss</td>
                  <td>Stream buffer held on server; client reconnects smoothly to resume.</td>
                </tr>
                <tr>
                  <td>Large Document Parser Guard</td>
                  <td>Heavy document parsing (500+ pages)</td>
                  <td>Worker process isolation prevents memory leaks from crashing the main server.</td>
                </tr>
                <tr>
                  <td>Prompt Injection Defense</td>
                  <td>Unsafe payload embedded in upload</td>
                  <td>Retrieval chunks wrapped in strict XML tags with system prompts forbidding tool escalation.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* REPORT FOOTER */}
        <footer className="oe-report-footer">
          <span>03 / Pentagon AI Workstation</span>
          <span>v0.1.0 · Cross Platform Production</span>
          <p>
            Source: Pentagon Comprehensive Systems Deep Dive and deployed production application. All cryptographic keys are encrypted locally at rest with zero external key hoarding.
          </p>
          <a href={PENTAGON_APP_URL} target="_blank" rel="noreferrer">
            pentagon-bice.vercel.app ↗
          </a>
        </footer>
      </main>
    </div>
  )
}
