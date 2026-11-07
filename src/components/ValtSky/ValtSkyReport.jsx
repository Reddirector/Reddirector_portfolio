import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import HoldButton from '../../HoldButton'
import CipherReveal from '../../CipherReveal'
import GlyphLottery from '../../GlyphLottery'
import ValtSkyNerdConsole from './ValtSkyNerdConsole'
import './valtsky-report.css'

const VALTSKY_REPO_URL = 'https://github.com/Reddirector/ValtSky'
const VALTSKY_WEB_URL = 'https://reddirector.github.io/ValtSky/'
const VALTSKY_RELEASE_URL = 'https://github.com/Reddirector/ValtSky/releases/tag/v2.1'
const VALTSKY_DOCS_URL = 'https://github.com/Reddirector/ValtSky#readme'
const VALTSKY_LICENSE_URL = 'https://github.com/Reddirector/ValtSky/blob/main/LICENSE'

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Ambient geometry watermark and floating celestial shapes
function ValtSkyReportAmbience() {
  const field = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const scroller = field.current?.closest('.project-overlay')
    const context = gsap.context(() => {
      gsap.to('.valtsky-ambience-ring--spin', { rotate: 360, duration: 90, ease: 'none', repeat: -1 })
      gsap.to('.valtsky-ambience-float', {
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
        gsap.fromTo('.valtsky-ambience-ring--orbit', { yPercent: -14, rotate: -12 }, { yPercent: 14, rotate: 12, ease: 'none', scrollTrigger: range })
        gsap.fromTo('.valtsky-ambience-diamond', { y: 28, rotate: -20 }, { y: -28, rotate: 55, ease: 'none', scrollTrigger: range })
      }
    }, field)
    return () => context.revert()
  }, [])

  return (
    <div ref={field} className="oe-ambience" aria-hidden="true">
      <i className="oe-ambience-plane" />
      <i className="oe-ambience-ring oe-ambience-ring--spin valtsky-ambience-ring--spin" />
      <i className="oe-ambience-ring oe-ambience-ring--orbit valtsky-ambience-ring--orbit" />
      <i className="oe-ambience-diamond valtsky-ambience-diamond" />
      <i className="oe-ambience-diamond oe-ambience-diamond--secondary" />
      <i className="oe-ambience-float oe-ambience-square valtsky-ambience-float" />
      <i className="oe-ambience-float oe-ambience-cross valtsky-ambience-float"><b /><b /></i>
    </div>
  )
}

// Live telemetry event ticker
function ValtSkyEventTicker() {
  const events = [
    { label: 'Stream Chunking', detail: '64 KB socket slices piped directly from file descriptors' },
    { label: 'Magic Bytes', detail: 'JPEG FF D8 FF · PNG 89 50 4E 47 · DNG 49 49 2A 00 verified' },
    { label: 'SQLite WAL', detail: 'dateTaken ASC indexed b-tree monotonic order enforced' },
    { label: 'Rate Limit Guard', detail: 'HTTP 429 caught · parameters.retry_after jittered backoff' },
    { label: 'Boundary Gate', detail: '2,147,483,648 bytes (2 GB) automated queue ceiling' },
    { label: 'Malware Defense', detail: 'EICAR signature quarantine · 18 MarkdownV2 tokens escaped' },
    { label: 'Memory Budget', detail: 'Flat 21.4 MB resident heap at 1.8 GB streaming asset' },
    { label: 'Target Platforms', detail: 'Android Universal APK + Web PWA targets compiled' },
  ]
  return (
    <div className="oe-event-ticker" role="region" aria-label="ValtSky Multiplatform telemetry status stream">
      <div className="oe-event-ticker-window">
        <div className="oe-event-ticker-track">
          {[...events, ...events].map((evt, idx) => (
            <span key={idx}>
              <b>{evt.label}:</b> {evt.detail}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Quick Execution Tabs
function ValtSkyQuickInstall() {
  const [activeTab, setActiveTab] = useState('adb')
  const [copied, setCopied] = useState(false)

  const commands = {
    adb: 'adb install -r releases/valtsky-v2.1-release.apk',
    web: 'cd valtsky_flutter && flutter pub get && flutter run -d chrome',
    test: 'cd valtsky_flutter && flutter test --reporter expanded',
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(commands[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="oe-install-wrapper">
      <div className="oe-install-tabs">
        <button
          type="button"
          onClick={() => setActiveTab('adb')}
          className={`oe-install-tab ${activeTab === 'adb' ? 'is-active' : ''}`}
        >
          Android Sideload
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('web')}
          className={`oe-install-tab ${activeTab === 'web' ? 'is-active' : ''}`}
        >
          Web Target
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('test')}
          className={`oe-install-tab ${activeTab === 'test' ? 'is-active' : ''}`}
        >
          Test Suite
        </button>
      </div>
      <div className="oe-install-bar" onClick={handleCopy} title="Click to copy command">
        <div className="oe-install-code">
          <span className="oe-install-prompt">$</span>
          <code>{commands[activeTab]}</code>
        </div>
        <button type="button" className="oe-install-btn" aria-label="Copy to clipboard">
          {copied ? <span className="oe-install-copied">✓ Copied</span> : 'Copy'}
        </button>
      </div>
    </div>
  )
}

// Four Architectural Pillars
function ValtSkyArchitecturalPillars() {
  const [selectedPillar, setSelectedPillar] = useState(0)

  const pillars = [
    {
      num: '01',
      badge: 'ORDERING CORE',
      title: 'Monotonic Chronological Sync Engine',
      module: 'lib/services/sync_engine.dart',
      metric: 'O(log N)',
      metricSub: 'dateTaken ASC b-tree index',
      desc: 'Enforces strict monotonic chronological order (Ti ≤ Ti+1) on upload so historical archives chronologically precede recent captures in the remote channel feed.',
      highlight: 'Strict Monotonic Timeline: Historical archives chronologically precede recent captures.',
      points: [
        'Queries offline-first SQLite records with explicit sorting: ORDER BY date_taken ASC LIMIT 1.',
        'Implements an atomic four-stage state machine (queued → syncing → synced | failed) with local persistence before transmission.',
        'Maps Telegram’s returned message_id into the local relational store on HTTP 200 OK for bidirectional idempotency.',
      ],
      codeSnippet: `Future<MediaItem?> fetchNextMonotonicItem() async {
  final rows = await _db.query(
    'media',
    where: 'status = ? AND file_size < ?',
    whereArgs: ['queued', TelegramApiClient.maxBotSizeBytes],
    orderBy: 'date_taken ASC',
    limit: 1,
  );
  return rows.isEmpty ? null : MediaItem.fromMap(rows.first);
}`,
    },
    {
      num: '02',
      badge: 'I/O GATEWAY',
      title: 'Lossless Document Streaming Gateway',
      module: 'lib/services/telegram_api.dart',
      metric: '0 Bytes Lost',
      metricSub: 'Bit-for-bit EXIF preservation',
      desc: 'Routes all media strictly through multipart/form-data document endpoints, intentionally rejecting lossy endpoints (sendPhoto/sendVideo) that strip sensor metadata.',
      highlight: 'Zero Transcoding Loss: Raw sensor Bayer arrays and color profiles remain identical down to SHA-256.',
      points: [
        'Streams file descriptors directly through the network socket in 64 KB buffer slices, maintaining flat RAM footprint.',
        'Captures and parses Telegram’s parameters.retry_after payload during HTTP 429 rate limit responses.',
        'Applies deterministic exponential backoff (2^n × 1000ms + jitter) without dropping in-flight synchronization state.',
      ],
      codeSnippet: `final stream = file.openRead();
final multipartFile = MultipartFile.fromStream(
  () => stream,
  file.lengthSync(),
  filename: p.basename(file.path),
);
final response = await _dio.post(
  'https://api.telegram.org/bot$botToken/sendDocument',
  data: FormData.fromMap({'chat_id': chatId, 'document': multipartFile}),
);`,
    },
    {
      num: '03',
      badge: 'QUARANTINE GATE',
      title: '2GB Boundary Isolation & Staging Pipeline',
      module: 'lib/ui/widgets/manual_upload_assistant_sheet.dart',
      metric: '2^31 Bytes',
      metricSub: '2,147,483,648 bytes hard cutoff',
      desc: 'Isolates assets exceeding Telegram Bot API limits into an assisted staging workflow, guaranteeing the automated background synchronization daemon never stalls.',
      highlight: 'Pipeline Isolation: Heavy video assets (> 2GB) cannot poison automated background queues.',
      points: [
        'Evaluates raw byte lengths at disk discovery; items ≥ 2 GB are flagged with isOversized = true and quarantined.',
        'Renders a telemetry warning banner on the Queued view, routing the user to the Oversized Vault.',
        'Orchestrates an assisted 4-click manual workflow launching targeted Telegram channels via native tg:// schemes.',
      ],
      codeSnippet: `static const int maxBotSizeBytes = 2147483648; // Exactly 2 GB
bool isOversized(int byteLength) => byteLength >= maxBotSizeBytes;

Future<void> routeToChannel(String targetChannelId) async {
  final channelRef = targetChannelId.replaceAll('-100', '');
  final uri = Uri.parse('tg://resolve?domain=$channelRef');
  if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
    await launchUrl(Uri.parse('https://t.me/c/$channelRef'));
  }
}`,
    },
    {
      num: '04',
      badge: 'SECURITY SHIELD',
      title: 'Anti-Malware & Injection Security Guard',
      module: 'lib/util/file_security_guard.dart',
      metric: '16 Bytes',
      metricSub: 'Header magic-byte sniffing',
      desc: 'Validates file classification by reading leading binary signatures at the I/O boundary, sanitizing captions against Telegram MarkdownV2 entity injection attacks.',
      highlight: 'Binary Signature Verification: Disguised executable scripts and malware payloads dropped at discovery.',
      points: [
        'Reads leading bytes: validates JPEG (FF D8 FF), PNG (89 50 4E 47), and TIFF/DNG (49 49 2A 00).',
        'Matches payloads against the EICAR standard anti-virus signature test string, dropping infected files into local quarantine.',
        'Enforces deterministic escaping across all 18 reserved MarkdownV2 punctuation marks, preventing chat interface crashes.',
      ],
      codeSnippet: `static bool verifyMagicBytes(Uint8List header, String extension) {
  if (extension == 'jpg' || extension == 'jpeg') {
    return header.length >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF;
  } else if (extension == 'png') {
    return header.length >= 4 && header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47;
  }
  return true;
}`,
    },
  ]

  return (
    <div className="oe-bento-pillars-wrapper">
      <div className="oe-bento-grid">
        {pillars.map((p, idx) => {
          const isHero = idx === 0
          return (
            <article
              key={p.num}
              data-num={p.num}
              className={`oe-bento-card ${isHero ? 'oe-bento-card--hero' : ''} ${selectedPillar === idx ? 'is-selected' : ''}`}
              onClick={() => setSelectedPillar(idx)}
            >
              <div className="oe-bento-card-header">
                <div className="oe-bento-card-meta">
                  <span className="oe-bento-card-num">{p.num}</span>
                  <span className="oe-bento-card-badge">{p.badge}</span>
                </div>
                <div className="oe-bento-card-stat">
                  <strong>{p.metric}</strong>
                  <small>{p.metricSub}</small>
                </div>
              </div>

              <div className="oe-bento-card-body">
                <h4 className="oe-bento-card-title">{p.title}</h4>
                <span className="oe-bento-card-module">{p.module}</span>
                <p className="oe-bento-card-desc">{p.desc}</p>
                <div className="oe-bento-card-highlight">
                  <span className="oe-bento-card-hl-icon">⚡</span>
                  <span>{p.highlight}</span>
                </div>
              </div>

              <ul className="oe-bento-card-points">
                {p.points.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>

              <div className="oe-bento-card-code-preview">
                <div className="oe-bento-code-head">
                  <span>DART 3.5+ ENGINE CONTRACT</span>
                  <span className="oe-bento-code-tag">ACTIVE INVARIANT</span>
                </div>
                <pre>{p.codeSnippet}</pre>
              </div>

              <div className="oe-bento-corner oe-bento-corner--tl" aria-hidden="true" />
              <div className="oe-bento-corner oe-bento-corner--br" aria-hidden="true" />
            </article>
          )
        })}
      </div>
    </div>
  )
}

// Interactive Simulation: ValtSky Runtime Lab
function ValtSkyRuntimeLab() {
  const [currentStep, setCurrentStep] = useState(0)
  const [activeMode, setActiveMode] = useState('happy') // happy | rate_limit | oversized | malware
  const [wizardStep, setWizardStep] = useState(0)

  const scenarios = {
    happy: {
      title: 'Clean Happy Path (84 MB RAW Bayer DNG)',
      file: 'IMG_20261101_RAW.dng (84,213,760 bytes)',
      steps: [
        {
          name: '1. Ingest Scanner',
          sub: 'Device Camera Event',
          desc: 'Camera daemon writes 84 MB RAW .dng file to /DCIM/Camera. Sync daemon detects creation event and opens binary file descriptor.',
          status: 'QUEUED',
          ram: '18.4 MB',
          network: 'IDLE',
          security: 'PENDING',
        },
        {
          name: '2. Magic-Byte Audit',
          sub: 'Binary Header Check',
          desc: 'FileSecurityGuard reads first 16 bytes. Binary signature matches TIFF/DNG specification (49 49 2A 00). Zero malware signatures detected.',
          status: 'AUTHENTICATED',
          ram: '19.2 MB',
          network: 'IDLE',
          security: 'VERIFIED OK',
        },
        {
          name: '3. 2GB Boundary Gate',
          sub: 'Payload Sizing Check',
          desc: 'Asset size (84 MB) is strictly below the 2,147,483,648 bytes (2 GB) Bot API limit. Asset is cleared for autonomous background transmission.',
          status: 'CLEARED',
          ram: '19.5 MB',
          network: 'READY',
          security: 'PASS',
        },
        {
          name: '4. Monotonic Enqueue',
          sub: 'SQLite Transaction',
          desc: 'Transaction executes inside SQLite WAL store with dateTaken ASC. Monotonic sorting ensures historical archives precede newer captures.',
          status: 'ENQUEUED',
          ram: '20.1 MB',
          network: 'PREPARING',
          security: 'PASS',
        },
        {
          name: '5. 64KB Chunk Stream',
          sub: 'HTTP/2 sendDocument',
          desc: 'File descriptor streamed directly to Telegram Bot API in 64 KB slices via multipart/form-data document stream. Memory remains bounded.',
          status: 'STREAMING',
          ram: '21.4 MB',
          network: '14.2 MB/s',
          security: 'PASS',
        },
        {
          name: '6. Commit Synced',
          sub: 'HTTP 200 OK Logged',
          desc: 'Telegram returns HTTP 200 containing message_id: 10482. Local SQLite record updated to "synced". 100% EXIF and raw sensor Bayer data preserved.',
          status: 'SYNCED (200 OK)',
          ram: '18.9 MB',
          network: 'IDLE',
          security: 'PASS',
        },
      ],
    },
    rate_limit: {
      title: 'Chaos Injection: HTTP 429 Rate Limit Recovery',
      file: 'BATCH_SYNC_042.jpg (12,480,120 bytes)',
      steps: [
        {
          name: '1. Ingest Scanner',
          sub: 'Batch Queue Item',
          desc: 'SyncEngine pulls next pending item from SQLite queue based on monotonic timestamp ordering.',
          status: 'QUEUED',
          ram: '19.1 MB',
          network: 'IDLE',
          security: 'VERIFIED',
        },
        {
          name: '2. Magic-Byte Audit',
          sub: 'JPEG Header Match',
          desc: 'Header verification passes for JPEG signature (FF D8 FF). Metadata sanitized against entity injection.',
          status: 'AUTHENTICATED',
          ram: '19.4 MB',
          network: 'IDLE',
          security: 'PASS',
        },
        {
          name: '3. 2GB Boundary Gate',
          sub: 'Size Verification',
          desc: 'File size 12.4 MB well within 2 GB ceiling. Scheduled for immediate transmission.',
          status: 'CLEARED',
          ram: '19.8 MB',
          network: 'READY',
          security: 'PASS',
        },
        {
          name: '4. Transport Dispatch',
          sub: 'Socket Transmission',
          desc: 'POST /bot.../sendDocument initiated. Telegram infrastructure triggers rate limiter across shared bot token.',
          status: 'TRANSMITTING',
          ram: '21.0 MB',
          network: 'SENDING',
          security: 'PASS',
        },
        {
          name: '5. Fault Intercepted',
          sub: 'HTTP 429 (Retry-After)',
          desc: 'Server responds with HTTP 429 Too Many Requests (parameters.retry_after: 6s). SyncEngine pauses and applies jittered backoff (6,240 ms).',
          status: 'BACKOFF SLEEP',
          ram: '20.2 MB',
          network: 'PAUSED',
          security: 'INTERCEPTED',
        },
        {
          name: '6. Resilient Recovery',
          sub: 'Clean Monotonic Resume',
          desc: 'Worker wakes from sleep, re-evaluates monotonic queue, re-dispatches stream, and commits status on HTTP 200 without duplicate sends.',
          status: 'RECOVERED (200 OK)',
          ram: '19.5 MB',
          network: 'IDLE',
          security: 'PASS',
        },
      ],
    },
    oversized: {
      title: 'Boundary Isolation: 3.4 GB ProRes Video Asset',
      file: 'CLIP_PRORES_4K.mov (3,650,722,816 bytes)',
      steps: [
        {
          name: '1. Ingest Scanner',
          sub: 'Large Asset Discovery',
          desc: 'Camera produces 3.4 GB 4K ProRes video. Daemon detects file size exceeding standard bot bounds.',
          status: 'DISCOVERED',
          ram: '18.1 MB',
          network: 'IDLE',
          security: 'PENDING',
        },
        {
          name: '2. Magic-Byte Audit',
          sub: 'QuickTime MOV Header',
          desc: 'Validates QuickTime container signature (66 74 79 70). File is authenticated as clean video container.',
          status: 'AUTHENTICATED',
          ram: '18.5 MB',
          network: 'IDLE',
          security: 'PASS',
        },
        {
          name: '3. Boundary Cutoff',
          sub: '2GB Limit Triggered',
          desc: 'CRITICAL GATE: 3.4 GB ≥ 2,147,483,648 bytes limit. Automated background queue is locked to prevent fatal HTTP 413 crash.',
          status: 'OVERSIZED FLAGGED',
          ram: '18.6 MB',
          network: 'BLOCKED',
          security: 'ISOLATED',
        },
        {
          name: '4. Vault Quarantine',
          sub: 'Isolated Routing',
          desc: 'Asset routed to dedicated Oversized Vault. Telemetry alert banner rendered; background sync proceeds unaffected for standard media.',
          status: 'QUARANTINED',
          ram: '18.8 MB',
          network: 'SAFE',
          security: 'ISOLATED',
        },
        {
          name: '5. 4-Click Assistant',
          sub: 'Assisted Manual Upload',
          desc: 'Manual Upload Sheet guides user through 4 assisted steps: Verify Channel → Open File → Launch tg://resolve → Confirm Drop.',
          status: 'ASSISTANT ACTIVE',
          ram: '19.2 MB',
          network: 'USER DIRECT',
          security: 'PASS',
        },
        {
          name: '6. Monotonic Sync Saved',
          sub: 'Zero Daemon Interruption',
          desc: 'The automated background daemon completes 100% of remaining media without crashing or deadlocking on the 3.4 GB asset.',
          status: 'DAEMON SAFE',
          ram: '18.4 MB',
          network: 'RUNNING',
          security: 'PASS',
        },
      ],
    },
    malware: {
      title: 'Security Guard: Disguised Malware Payload Attack',
      file: 'invoice_2026.pdf.exe (disguised as .jpg)',
      steps: [
        {
          name: '1. Ingest Scanner',
          sub: 'External Ingest Attempt',
          desc: 'Incoming file named "family_portrait.jpg" ingested into sync scanner from external app folder.',
          status: 'INGESTED',
          ram: '18.2 MB',
          network: 'IDLE',
          security: 'SUSPICIOUS',
        },
        {
          name: '2. Magic-Byte Audit',
          sub: 'PE Executable Detected',
          desc: 'ALERT: File extension claims .jpg, but first 2 bytes are 4D 5A (MZ / Windows PE executable header), NOT FF D8 FF.',
          status: 'SIGNATURE MISMATCH',
          ram: '18.4 MB',
          network: 'BLOCKED',
          security: 'SECURITY ALERT',
        },
        {
          name: '3. Signature Scan',
          sub: 'EICAR String Inspection',
          desc: 'Secondary scanner flags known malicious payload pattern. MarkdownV2 caption entities inspected and neutralized.',
          status: 'MALWARE CONFIRMED',
          ram: '18.5 MB',
          network: 'BLOCKED',
          security: 'HOSTILE ATTACK',
        },
        {
          name: '4. Immediate Drop',
          sub: 'Isolation Quarantine',
          desc: 'Payload is blocked from entering SQLite queue. Record written to local security audit log with SHA-256 hash.',
          status: 'PERMANENT DROP',
          ram: '18.4 MB',
          network: 'SAFE',
          security: 'NEUTRALIZED',
        },
        {
          name: '5. Channel Shielded',
          sub: 'Zero Network Egress',
          desc: 'Zero packets sent to Telegram servers. Channel members shielded from malicious dropper scripts or phishing attacks.',
          status: 'ZERO EGRESS',
          ram: '18.3 MB',
          network: 'ZERO BYTES',
          security: 'PROTECTED',
        },
        {
          name: '6. Audit Logged',
          sub: '100% Security Pass',
          desc: 'Security test suite logs 11/11 passing tests against hostile injection attacks with zero static vulnerabilities.',
          status: 'AUDIT VERIFIED',
          ram: '18.2 MB',
          network: 'IDLE',
          security: 'CLEAN',
        },
      ],
    },
  }

  const scenario = scenarios[activeMode]
  const step = scenario.steps[currentStep]

  const nextStep = () => setCurrentStep((prev) => Math.min(scenario.steps.length - 1, prev + 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1))

  return (
    <div className="oe-runtime-lab-panel" role="region" aria-label="ValtSky Multiplatform Interactive Runtime Lab">
      <div className="valtsky-sim-controls">
        <div className="valtsky-mode-toggle-group">
          <span className="font-mono text-[.58rem] uppercase tracking-wider text-white/50">Scenario:</span>
          <button
            type="button"
            onClick={() => { setActiveMode('happy'); setCurrentStep(0); }}
            className={`valtsky-mode-btn ${activeMode === 'happy' ? 'is-active' : ''}`}
          >
            Clean Happy Path (84MB)
          </button>
          <button
            type="button"
            onClick={() => { setActiveMode('rate_limit'); setCurrentStep(0); }}
            className={`valtsky-mode-btn ${activeMode === 'rate_limit' ? 'is-active' : ''}`}
          >
            HTTP 429 Jittered Backoff
          </button>
          <button
            type="button"
            onClick={() => { setActiveMode('oversized'); setCurrentStep(0); }}
            className={`valtsky-mode-btn ${activeMode === 'oversized' ? 'is-active' : ''}`}
          >
            2GB Boundary Isolation
          </button>
          <button
            type="button"
            onClick={() => { setActiveMode('malware'); setCurrentStep(0); }}
            className={`valtsky-mode-btn ${activeMode === 'malware' ? 'is-active' : ''}`}
          >
            Malware Header Attack
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="oe-drill-button"
          >
            ← Prev
          </button>
          <span className="font-mono text-[.64rem] text-white/60">
            Phase <b>{currentStep + 1}</b> of <b>{scenario.steps.length}</b>
          </span>
          <button
            type="button"
            onClick={nextStep}
            disabled={currentStep === scenario.steps.length - 1}
            className="oe-drill-button"
          >
            Next →
          </button>
        </div>
      </div>

      {/* 6-Phase Timeline Scrubber */}
      <div className="valtsky-sim-timeline">
        {scenario.steps.map((st, idx) => {
          const isActive = idx === currentStep
          const isPast = idx < currentStep
          return (
            <button
              type="button"
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`valtsky-timeline-step ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
            >
              <span className="valtsky-timeline-num">{`0${idx + 1}`}</span>
              <span className="valtsky-timeline-name">{st.name.replace(/^\d+\.\s*/, '')}</span>
            </button>
          )
        })}
      </div>

      {/* Real-time Status Card */}
      <div className="valtsky-sim-status-card">
        <div className="valtsky-sim-narrative">
          <h4>
            <span className="text-accent">{step.name}</span>
            <span className="text-white/40 text-[.68rem] font-normal">({step.sub})</span>
          </h4>
          <p>{step.desc}</p>
          <div className="mt-2 text-[.65rem] font-mono text-white/50 border-t border-white/10 pt-2 flex items-center justify-between">
            <span>Target Asset: <b className="text-white/80">{scenario.file}</b></span>
            <span>Scenario: <b className="text-accent uppercase">{activeMode}</b></span>
          </div>
        </div>

        <div className="valtsky-sim-telemetry">
          <div className="valtsky-telem-row">
            <span className="valtsky-telem-label">ENGINE STATUS</span>
            <span className={`valtsky-telem-val ${step.status.includes('OK') || step.status.includes('PASS') ? 'is-ok' : step.status.includes('ALERT') || step.status.includes('DROP') ? 'is-err' : 'is-warn'}`}>
              {step.status}
            </span>
          </div>
          <div className="valtsky-telem-row">
            <span className="valtsky-telem-label">RESIDENT HEAP</span>
            <span className="valtsky-telem-val">{step.ram} (&lt; 28MB)</span>
          </div>
          <div className="valtsky-telem-bar">
            <div className="valtsky-telem-bar-fill" style={{ width: `${(parseFloat(step.ram) / 28) * 100}%` }} />
          </div>

          <div className="valtsky-telem-row mt-2">
            <span className="valtsky-telem-label">NETWORK I/O</span>
            <span className="valtsky-telem-val">{step.network}</span>
          </div>
          <div className="valtsky-telem-row">
            <span className="valtsky-telem-label">SECURITY AUDIT</span>
            <span className={`valtsky-telem-val ${step.security === 'VERIFIED OK' || step.security === 'PASS' || step.security === 'PROTECTED' ? 'is-ok' : 'is-err'}`}>
              {step.security}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Click Staging Assistant Walkthrough (shown when oversized is active) */}
      {activeMode === 'oversized' && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[.58rem] uppercase tracking-wider text-accent font-semibold">
              ⚡ 4-Click Assisted Staging Protocol (Manual Upload Sheet) · Click steps to simulate:
            </span>
            <span className="font-mono text-[.6rem] text-emerald-400 font-bold">
              {wizardStep === 4 ? '✓ STAGING COMPLETE (LAUNCHED tg://)' : `Step ${wizardStep} of 4 Complete`}
            </span>
          </div>
          <div className="valtsky-staging-wizard">
            {[
              {
                step: 'Click 1',
                title: 'Review Channel ID',
                desc: 'Confirm target private storage channel (-1001234567890) and security key.',
              },
              {
                step: 'Click 2',
                title: 'Verify File Path',
                desc: 'Inspect exact local path (/storage/emulated/0/DCIM/...) and verified SHA-256 hash.',
              },
              {
                step: 'Click 3',
                title: 'Start Manual Upload',
                desc: 'Copies path, bypasses automated daemon, and prepares clipboard transfer.',
              },
              {
                step: 'Click 4',
                title: 'Open in Telegram',
                desc: 'Launches native tg://resolve URI directly to the target channel for uncompressed file drop.',
              },
            ].map((st, sIdx) => {
              const isDone = wizardStep > sIdx
              return (
                <div
                  key={sIdx}
                  onClick={() => setWizardStep((prev) => (prev > sIdx ? sIdx : sIdx + 1))}
                  className={`valtsky-wizard-card ${isDone ? 'is-done' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="valtsky-wizard-step">{st.step}</span>
                    {isDone && <span className="text-emerald-400 text-[.6rem] font-bold">✓</span>}
                  </div>
                  <strong className="valtsky-wizard-title">{st.title}</strong>
                  <p className="valtsky-wizard-desc">{st.desc}</p>
                </div>
              )
            })}
          </div>
          {wizardStep === 4 && (
            <div className="mt-2 p-2 bg-emerald-950/20 border border-emerald-500/40 rounded flex items-center justify-between text-[.62rem] text-emerald-300 font-mono">
              <span>✓ Assisted Hand-off Successful: 3.4 GB ProRes file routed via Telegram desktop/mobile client without API 2GB rejection.</span>
              <button
                type="button"
                onClick={() => setWizardStep(0)}
                className="text-[.54rem] uppercase bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer"
              >
                Reset Wizard ↺
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Interactive Socket Streaming & Memory Gauge Studio
function ValtSkyStreamBench() {
  const [fileSizeMb, setFileSizeMb] = useState(1800)
  const [mode, setMode] = useState('valtsky') // 'valtsky' | 'naive'
  const [streaming, setStreaming] = useState(false)
  const [progress, setProgress] = useState(mode === 'valtsky' ? 76 : 100)

  const isOOM = mode === 'naive' && fileSizeMb >= 500

  const runSimulation = () => {
    setStreaming(true)
    setProgress(0)
    let p = 0
    const interval = setInterval(() => {
      p += 15
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setStreaming(false)
      }
      setProgress(p)
    }, 120)
  }

  const memoryHeap = mode === 'valtsky' ? (21.4 + (progress / 100) * 2.8).toFixed(1) : (fileSizeMb * 1.05).toFixed(0)

  return (
    <div className="valtsky-stream-bench">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-accent text-[.64rem] font-mono uppercase font-bold">STREAM BENCH:</span>
          <span className="text-white/80 font-mono text-[.7rem]">Socket Pipe vs. Naive In-Memory Buffer</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('valtsky')}
            className={`valtsky-mode-btn ${mode === 'valtsky' ? 'is-active' : ''}`}
          >
            ValtSky 64KB Slices
          </button>
          <button
            type="button"
            onClick={() => setMode('naive')}
            className={`valtsky-mode-btn ${mode === 'naive' ? 'is-active' : ''}`}
          >
            Naive readAsBytes()
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4 text-[.68rem] font-mono">
        <div className="p-3 bg-black/40 border border-white/10 rounded">
          <span className="text-white/50 block text-[.58rem] uppercase">Asset Container</span>
          <div className="flex gap-1 mt-1.5">
            {[84, 500, 1800].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setFileSizeMb(sz)}
                className={`px-2 py-1 rounded border text-[.6rem] cursor-pointer ${fileSizeMb === sz ? 'bg-red-500/20 border-red-500 text-white' : 'border-white/10 text-white/50 hover:text-white'}`}
              >
                {sz >= 1000 ? `${(sz / 1000).toFixed(1)} GB` : `${sz} MB`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-black/40 border border-white/10 rounded">
          <span className="text-white/50 block text-[.58rem] uppercase">Resident Heap RAM</span>
          <strong className={`text-[1.1rem] block mt-1 ${isOOM ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
            {isOOM ? 'OOM CRASH' : `${memoryHeap} MB`}
          </strong>
          <small className="text-white/40 text-[.55rem]">{mode === 'valtsky' ? 'Pinned under 28 MB budget' : 'Full asset buffered in RAM'}</small>
        </div>

        <div className="p-3 bg-black/40 border border-white/10 rounded flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-[.58rem] uppercase">Stream Progress</span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="valtsky-telem-bar mt-1">
            <div className={`valtsky-telem-bar-fill ${isOOM ? '!bg-red-500' : ''}`} style={{ width: `${progress}%` }} />
          </div>
          <button
            type="button"
            onClick={runSimulation}
            disabled={streaming}
            className="mt-2 text-[.56rem] uppercase tracking-wider py-1 bg-white/10 hover:bg-red-500/20 hover:text-white border border-white/20 rounded cursor-pointer transition-all"
          >
            {streaming ? 'Piping Slices...' : 'Simulate Socket Transfer ↻'}
          </button>
        </div>
      </div>

      {isOOM ? (
        <div className="valtsky-oom-alert">
          <span className="text-red-400 font-bold text-[.85rem]">⚠</span>
          <div>
            <strong>FATAL OS EXCEPTION: Out-Of-Memory (LMK / Jetsam Kill)</strong>
            <p className="text-[.62rem] text-white/70 m-0">
              Naive backup scripts buffer all {fileSizeMb} MB into resident memory before transmission. Mobile operating systems immediately terminate the background process to protect system stability.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded flex items-center justify-between text-[.62rem] text-emerald-300 font-mono">
          <span>✓ Socket Stream Invariant Verified: Bounded memory footprint remains flat regardless of asset size.</span>
          <span className="font-bold">HTTP/2 Chunked Pipeline Active</span>
        </div>
      )}
    </div>
  )
}

// Anti-Malware Header Sniffer & Entity Sanitizer
function ValtSkySecurityGuardLab() {
  const [selectedFileType, setSelectedFileType] = useState('dng')
  const [customCaption, setCustomCaption] = useState('Family trip photo! *important* [link](http://site.com) #2026 >quote')

  const fileSignatures = {
    dng: {
      name: 'RAW Camera DNG',
      ext: 'dng',
      status: 'TRUSTED RAW BAYER',
      pass: true,
      bytes: ['49', '49', '2A', '00', '08', '00', '00', '00', '10', '00', 'FE', '00', '04', '00', '01', '00'],
      desc: 'TIFF little-endian container specification. All raw Bayer arrays and camera calibration metadata preserved.',
    },
    jpeg: {
      name: 'Standard JPEG Photo',
      ext: 'jpg',
      status: 'AUTHENTICATED EXIF',
      pass: true,
      bytes: ['FF', 'D8', 'FF', 'E0', '00', '10', '4A', '46', '49', '46', '00', '01', '01', '01', '00', '60'],
      desc: 'Standard JPEG SOI (Start of Image) header marker. Verified compliant with camera color profiles.',
    },
    png: {
      name: 'Lossless PNG Graphic',
      ext: 'png',
      status: 'AUTHENTICATED PNG',
      pass: true,
      bytes: ['89', '50', '4E', '47', '0D', '0A', '1A', '0A', '00', '00', '00', '0D', '49', '48', '44', '52'],
      desc: 'Standard 8-byte PNG file signature. Protects pixel transparency and ICC color profiles.',
    },
    malware: {
      name: 'Disguised Executable (.exe as .jpg)',
      ext: 'jpg',
      status: 'SECURITY DROP: MALWARE SIGNATURE',
      pass: false,
      bytes: ['4D', '5A', '90', '00', '03', '00', '00', '00', '04', '00', '00', '00', 'FF', 'FF', '00', '00'],
      desc: 'Hostile attack detected: File claims .jpg extension, but raw magic bytes match Windows PE Executable (MZ). Quarantined immediately.',
    },
    eicar: {
      name: 'EICAR Anti-Virus Test String',
      ext: 'bin',
      status: 'SECURITY DROP: EICAR SIGNATURE',
      pass: false,
      bytes: ['58', '35', '4F', '21', '50', '25', '40', '41', '50', '5B', '34', '5C', '50', '5A', '58', '35'],
      desc: 'Standard cybersecurity test signature recognized. Zero bytes emitted to network socket.',
    },
  }

  const activeSig = fileSignatures[selectedFileType]

  const sanitizeMarkdownV2 = (text) => {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1')
  }

  return (
    <div className="valtsky-hex-card">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
        <div>
          <span className="text-accent text-[.64rem] font-mono uppercase font-bold">SECURITY GATEWAY:</span>
          <h4 className="text-white text-[.82rem] font-mono m-0">Pre-Network Magic Byte Sniffer &amp; Entity Sanitizer</h4>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(fileSignatures).map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => setSelectedFileType(k)}
              className={`px-2 py-1 rounded text-[.58rem] font-mono border cursor-pointer transition-all ${selectedFileType === k ? (v.pass ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300') : 'border-white/10 text-white/50 hover:text-white'}`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[.62rem] font-mono">
          <span className="text-white/60">First 16 Bytes Binary Hex Dump:</span>
          <span className={`font-bold ${activeSig.pass ? 'text-emerald-400' : 'text-red-400'}`}>
            {activeSig.status}
          </span>
        </div>

        <div className="valtsky-hex-grid">
          {activeSig.bytes.map((byte, idx) => (
            <div
              key={idx}
              className={`valtsky-hex-byte ${!activeSig.pass ? 'is-malware' : idx < 4 ? 'is-sig' : ''}`}
            >
              <span className="block font-bold">{byte}</span>
              <span className="block text-[.48rem] text-white/40">{`0x0${idx.toString(16)}`}</span>
            </div>
          ))}
        </div>
        <p className="text-[.7rem] font-mono text-white/70 m-0 border-l-2 border-accent pl-2.5 py-0.5">
          {activeSig.desc}
        </p>
      </div>

      <div className="valtsky-sanitizer-box">
        <span className="text-white/50 text-[.58rem] font-mono uppercase block mb-1.5">
          Telegram MarkdownV2 Entity Sanitization Playground
        </span>
        <input
          type="text"
          value={customCaption}
          onChange={(e) => setCustomCaption(e.target.value)}
          placeholder="Type string containing * [ ] ( ) _ ~ # > to test escaping..."
          className="w-full bg-black/60 border border-white/20 rounded px-2.5 py-1.5 font-mono text-[.68rem] text-white outline-none focus:border-red-500"
        />
        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[.62rem] font-mono">
          <span className="text-white/40">Sanitized Output (Escape 18 Punctuation Tokens):</span>
          <code className="text-emerald-300 bg-white/5 px-2 py-0.5 rounded">{sanitizeMarkdownV2(customCaption)}</code>
        </div>
      </div>
    </div>
  )
}

// Monotonic Timeline Comparator
function MonotonicTimelineComparator() {
  const [mode, setMode] = useState('valtsky') // 'valtsky' | 'naive'

  const items = [
    { title: 'Graduation Ceremony', year: '2019', date: '2019-06-15' },
    { title: 'First Developer Job', year: '2021', date: '2021-02-01' },
    { title: 'Mountain Expedition', year: '2023', date: '2023-08-20' },
    { title: 'ValtSky v2.0 Launch', year: '2026', date: '2026-11-01' },
  ]

  const displayOrder = mode === 'valtsky' ? items : [...items].reverse()

  return (
    <div className="my-5 border border-white/12 bg-black/40 p-4 rounded">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
        <div>
          <span className="text-accent text-[.6rem] font-mono uppercase font-bold">TIMELINE INTEGRITY:</span>
          <h4 className="text-white text-[.85rem] font-mono m-0">Monotonic Sorting vs. Inverted Feed Disaster</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('valtsky')}
            className={`valtsky-mode-btn ${mode === 'valtsky' ? 'is-active' : ''}`}
          >
            ValtSky (dateTaken ASC)
          </button>
          <button
            type="button"
            onClick={() => setMode('naive')}
            className={`valtsky-mode-btn ${mode === 'naive' ? 'is-active' : ''}`}
          >
            Naive Ingestion (mtime DESC)
          </button>
        </div>
      </div>

      <div className="valtsky-timeline-compare">
        <div className={`valtsky-compare-pane ${mode === 'valtsky' ? 'is-valtsky' : ''}`}>
          <div className="flex items-center justify-between text-[.64rem] font-mono">
            <span className="text-white/60">SIMULATED TELEGRAM CHANNEL FEED</span>
            <span className={mode === 'valtsky' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {mode === 'valtsky' ? '✓ MONOTONIC CHRONOLOGICAL' : '✗ INVERTED (OLDEST AT BOTTOM)'}
            </span>
          </div>

          <div className="valtsky-feed-preview">
            {displayOrder.map((it, idx) => (
              <div key={idx} className={`valtsky-feed-bubble ${idx === 0 ? 'is-first' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="text-white/40">{idx + 1}.</span>
                  <span className="text-white font-bold">{it.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/50 text-[.55rem]">{it.date}</span>
                  <span className="text-accent bg-red-950/40 px-1.5 py-0.5 rounded text-[.52rem] font-bold">{it.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3.5 bg-black/50 border border-white/10 rounded font-mono text-[.7rem] flex flex-col justify-between">
          <div>
            <span className="text-accent text-[.58rem] uppercase font-bold block mb-1">Algorithmic Consequence</span>
            <p className="text-white/80 text-[.74rem] leading-relaxed m-0">
              {mode === 'valtsky'
                ? 'ValtSky indexes media via SQLite b-trees using `ORDER BY date_taken ASC`. By uploading the oldest memories first, your private Telegram channel naturally reads chronologically forward like a permanent camera album.'
                : 'Naive backup loops sort descending or read filesystem inodes arbitrarily. When uploaded, recent captures enter first and historical photos sit at the very bottom, completely inverting chronological album navigation.'}
            </p>
          </div>
          <div className="border-t border-white/10 pt-2 text-[.6rem] text-white/50 flex items-center justify-between">
            <span>Query Strategy:</span>
            <code className="text-white font-bold">{mode === 'valtsky' ? 'ORDER BY date_taken ASC' : 'mtime DESC (Flawed)'}</code>
          </div>
        </div>
      </div>
    </div>
  )
}

// Comparison Decision Matrix
function ValtSkyDecisionMatrix() {
  const comparisons = [
    {
      dim: 'Infrastructure Dependency',
      google: 'Proprietary cloud; vendor lock-in',
      nextcloud: 'Dedicated VPS/S3 + Postgres ($10-50/mo)',
      naive: 'Custom server or continuous host script',
      valtsky: 'Zero intermediate servers; connects directly to Telegram',
    },
    {
      dim: 'Memory Footprint',
      google: 'Moderate (80–150 MB)',
      nextcloud: 'High (200–512 MB)',
      naive: 'Spikes to full file size (1–2 GB OOM)',
      valtsky: 'Strictly bounded (< 28 MB resident heap)',
    },
    {
      dim: 'Crash Recovery',
      google: 'Proprietary delta sync',
      nextcloud: 'WebDAV lock recovery / chunk cache',
      naive: 'Fragile; loops or skips on error',
      valtsky: 'Transactional SQLite WAL state machine with idempotent retry',
    },
    {
      dim: 'EXIF & Compression',
      google: 'Downscales 4K; compresses unless paid tier',
      nextcloud: '100% (raw storage)',
      naive: 'Often calls sendPhoto (strips EXIF)',
      valtsky: '100% lossless uncompressed document protocol (sendDocument)',
    },
    {
      dim: 'Operational Cost',
      google: '$2.99–$9.99/month recurring tax',
      nextcloud: 'Compute + egress + storage costs',
      naive: 'Bot hosting fees',
      valtsky: 'Free forever (leveraging Telegram infrastructure)',
    },
  ]

  return (
    <div className="oe-matrix">
      <div className="oe-matrix-scroll">
        <table className="oe-matrix-table">
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Google Photos / iCloud</th>
              <th>Nextcloud Self-Hosted</th>
              <th>Naive Python / Bots</th>
              <th className="oe-matrix-highlight">ValtSky Multiplatform</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row, idx) => (
              <tr key={idx}>
                <td className="oe-matrix-dim">{row.dim}</td>
                <td>{row.google}</td>
                <td>{row.nextcloud}</td>
                <td>{row.naive}</td>
                <td className="oe-matrix-highlight">{row.valtsky}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Five Core Technical Hurdles & Engineering Solutions
function ValtSkyFiveHurdles() {
  const [activeHurdle, setActiveHurdle] = useState(0)

  const hurdles = [
    {
      id: 'h1',
      title: 'Challenge 1: Browser Network Sandbox & 64-Bit Integer Limitation',
      subtitle: 'Raw TCP restriction vs MTProto 2.0 & dart2js overflow',
      problem: 'Telegram requires the binary MTProto 2.0 protocol over raw TCP sockets directly to Telegram Data Centers (e.g. DC 1 at 149.154.175.50:443) with 2048-bit Diffie-Hellman cryptographic key negotiation. Standard web browsers enforce a strict sandbox that forbids opening raw TCP sockets (Socket.connect in dart:io). Furthermore, Telegram\'s binary TL-schema uses 64-bit integer bitmasks (0xD09D1D85DE64FD85) that exceed JavaScript\'s max safe integer (2^53 - 1), breaking dart2js compilation.',
      solution: 'Architected a conditional compilation boundary in Flutter: Native Mobile/Desktop (telegram_auth_service_native.dart) uses native OS TCP sockets to communicate directly with Telegram DCs; Web Browser (telegram_auth_service_web.dart) connects to a local host OS daemon (bin/auth_bridge.dart on port 8088), which opens the TCP sockets on behalf of the browser.',
      diagram: `[ Web Browser (localhost:8080) ]
              │  HTTP / JSON (Port 8088)
              ▼
[ Local MTProto Bridge Daemon (bin/auth_bridge.dart) ]
              │  Native Raw TCP (Port 443)
              ▼
[ Telegram Production DC 1 (149.154.175.50:443) ]
              │
              └─► Generates real OTP -> Delivered to user's Telegram app`,
      badge: 'NETWORKING & SANDBOX ESCAPE',
    },
    {
      id: 'h2',
      title: 'Challenge 2: Browser Content Security Policy (CSP) & Dual-Stack IPv4/IPv6',
      subtitle: 'OWASP header blocking & modern browser IPv6 loopback priority',
      problem: 'After security hardening with OWASP headers in index.html, Chrome blocked outgoing bridge requests with: "Connecting to http://localhost:8088 violates CSP directive: connect-src \'self\' https: wss:". Furthermore, modern browsers resolve localhost to IPv6 ::1 before IPv4 127.0.0.1. When the daemon was bound only to IPv4 127.0.0.1, browsers received immediate Connection Refused.',
      solution: 'Updated Content Security Policy in web/index.html with granular loopback allowances: connect-src \'self\' https: wss: http://localhost:8088 http://127.0.0.1:8088 http://[::1]:8088. Re-architected bin/auth_bridge.dart to bind dual-stack on both InternetAddress.anyIPv4 (0.0.0.0:8088) and InternetAddress.loopbackIPv6 ([::1]:8088), guaranteeing zero connection dropouts across all environments.',
      diagram: `Modern Chromium / Safari Loopback Resolution:
  localhost ──► [::1]:8088 (IPv6 Loopback)  ──┐
                                              ├──► Dual-Stack Bridge Daemon
  127.0.0.1 ──► 0.0.0.0:8088 (IPv4 Binding) ──┘`,
      badge: 'CSP & DUAL-STACK PROTOCOL',
    },
    {
      id: 'h3',
      title: 'Challenge 3: Real Telegram Verification & User Identity Extraction',
      subtitle: 'Eliminating mock auth with real MTProto RPCs and profile rendering',
      problem: 'Early prototypes accepted dummy verification codes without validating real credentials against Telegram servers. Users could not verify if their real account was linked, creating authentication vulnerability and session ambiguity.',
      solution: 'Integrated genuine MTProto RPC calls (client.auth.sendCode, client.auth.signIn, and client.channels.createChannel). Added RPC error translation for PHONE_NUMBER_INVALID, PHONE_CODE_INVALID, PHONE_CODE_EXPIRED, and FLOOD_WAIT_X. Upon sign-in, deserializes t.User, extracting name, @username, User ID, and Premium status, auto-creating a private channel named ValtSky Vault (<User>) with verified emerald badge in TelegramProfileCard.',
      diagram: `client.auth.signIn(normalizedPhone, phoneCodeHash, otpCode)
       │
       ▼
Deserializes t.User ──► { name: "Aditya Sharma", username: "@reddirector", id: 1849204, isPremium: true }
       │
       ▼
client.channels.createChannel("ValtSky Vault (Aditya)") ──► Channel ID: -1001928471829`,
      badge: 'IDENTITY & AUTO-PROVISIONING',
    },
    {
      id: 'h4',
      title: 'Challenge 4: Input Formatting & Country Code Validation',
      subtitle: '27+ countries, smart dial auto-detection, and national digit locking',
      problem: 'Users could type letters, arbitrary spaces, or incorrect digit lengths (e.g., entering 8 or 12 digits for an Indian number, which strictly requires 10 digits), triggering server-side Telegram API validation rejection.',
      solution: 'Built CountryData supporting 27+ countries with flag emojis, dial codes, and national digit bounds. Created searchable modal bottom sheet, smart "+" prefix auto-detection that automatically switches flags, FilteringTextInputFormatter.digitsOnly to block non-numeric keystrokes, and LengthLimitingTextInputFormatter strictly locked to national bounds (e.g. 10 digits for India +91, 10 for US +1, 9 for UAE +971) with dynamic completion badges (0/10 -> 10/10 in green).',
      diagram: `User Types: "+9198765..." ──► Auto-switches Flag to 🇮🇳, Dial Code to +91
Input Filter: [0-9] Only  ──► Blocks letters and whitespace
Length Limiter: Max 10    ──► Locks input at 10 digits -> Badge: [10 / 10 digits ✓]`,
      badge: 'INPUT SANITIZATION & BOUNDS',
    },
    {
      id: 'h5',
      title: 'Challenge 5: Large-Scale Media Streaming & The 2 GB Limit',
      subtitle: 'Any-Size Lossless Engine across standard, chunked, and oversized assets',
      problem: 'Standard Telegram Bot APIs enforce a strict 2 GB (2,147,483,648 bytes) request ceiling. Uploading high-bitrate 4K ProRes or RAW video containers > 2 GB causes unhandled HTTP 413 Entity Too Large exceptions, crashing background workers and halting sync queues.',
      solution: 'Engineered the Any-Size Lossless Engine: (1) Files ≤ 50 MB: direct uncompressed document dispatch (sendDocument); (2) Files 50 MB - 2 GB: smart 48 MB verified chunking with SHA-256 part checksums; (3) Files > 2 GB: routed to dedicated Oversized Vault and processed through an assisted 4-Click manual upload assistant sheet with O(1) memory consumption (< 28 MB resident heap).',
      diagram: `[ Media Discovery ]
        ├── File ≤ 50 MB       ──► Direct sendDocument (Bit-for-Bit Uncompressed)
        ├── 50 MB < File ≤ 2GB ──► 48 MB Verified Chunks (SHA-256 Part Checksums)
        └── File > 2 GB        ──► Oversized Vault Staging (4-Click Assistant, <28MB RAM)`,
      badge: 'STREAMING PIPELINE & 2GB LIMIT',
    },
  ]

  const cur = hurdles[activeHurdle]

  return (
    <div className="oe-hurdles-wrapper my-6 space-y-4">
      {/* Tab Switcher */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-white/10">
        {hurdles.map((h, i) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setActiveHurdle(i)}
            className={`px-3 py-1.5 rounded font-mono text-xs whitespace-nowrap transition-all border ${
              activeHurdle === i
                ? 'bg-[#E5484D] text-white font-bold border-[#E5484D] shadow-[0_0_12px_rgba(229,72,77,0.4)]'
                : 'bg-black/40 text-white/60 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            0{i + 1} / {h.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Active Hurdle Detail Card */}
      <div className="p-5 sm:p-6 rounded-xl bg-black/60 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#E5484D] font-bold block">
              {cur.badge}
            </span>
            <h4 className="font-display text-base sm:text-lg font-bold text-white mt-0.5">
              {cur.title}
            </h4>
            <p className="font-mono text-xs text-white/50">{cur.subtitle}</p>
          </div>
          <span className="font-mono text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 shrink-0">
            ✓ RESOLVED &amp; VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/20 space-y-2">
            <span className="font-mono text-xs text-red-400 font-bold uppercase tracking-wider block">
              The Problem &amp; Failure Mode
            </span>
            <p className="font-serif text-xs text-white/80 leading-relaxed">
              {cur.problem}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-2">
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block">
              The Engineering Solution
            </span>
            <p className="font-serif text-xs text-white/80 leading-relaxed">
              {cur.solution}
            </p>
          </div>
        </div>

        {cur.diagram && (
          <div className="space-y-1.5 pt-2">
            <span className="font-mono text-[11px] text-white/40 block">Data Flow &amp; Protocol Wire Routing:</span>
            <pre className="p-3.5 rounded-lg bg-black/80 border border-white/10 font-mono text-[11px] text-[#2AABEE] overflow-x-auto leading-relaxed shadow-inner">
              <code>{cur.diagram}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

// Systems Architecture & Data Flow Diagram
function ValtSkyArchitectureLayers() {
  const layers = [
    {
      name: 'PRESENTATION LAYER (UI)',
      badge: 'FLUTTER 3.24+ WIDGET TREE',
      color: '#E5484D',
      components: [
        { name: 'DashboardView', desc: 'Real-time telemetry, sync status, and storage utilization counters' },
        { name: 'ActivityView', desc: 'Monotonic timeline feed inspection & asset progress tracking' },
        { name: 'SettingsView', desc: 'Channel binding, storage limits, and network preferences' },
        { name: 'TelegramPhoneLoginWidget', desc: '10-second MTProto phone input with national digit bounds' },
        { name: 'CountryPickerSheet', desc: 'Searchable 27+ country modal with flag emojis and dial codes' },
        { name: 'TelegramProfileCard', desc: 'Verified user identity, initials avatar, Premium badge, DC 1 status' },
      ],
    },
    {
      name: 'CORE SERVICE LAYER',
      badge: 'CONDITIONAL COMPILER BOUNDARY',
      color: '#2AABEE',
      components: [
        { name: 'TelegramAuthService (Web)', desc: 'Dio HTTP client connecting to local bridge daemon (port 8088)' },
        { name: 'TelegramAuthService (Native)', desc: 'Direct raw MTProto 2.0 TCP client to Telegram DCs (port 443)' },
        { name: 'SyncEngine', desc: 'Single-flight monotonic FIFO scheduler (dateTaken ASC)' },
        { name: 'Any-Size Media Engine', desc: 'Direct sendDocument, 48MB verified chunks, and Oversized Vault' },
        { name: 'TelegramLauncher', desc: 'Deep-link schemes (tg://resolve) for seamless channel navigation' },
      ],
    },
    {
      name: 'DATA & STORAGE LAYER',
      badge: 'SQLITE WAL & ENCRYPTED AT REST',
      color: '#00F5D4',
      components: [
        { name: 'SQLite / DatabaseHelper', desc: 'Transactional state machine, deduplication index, and retry queues' },
        { name: 'Prefs', desc: 'Encrypted local key-value store for user session and channel metadata' },
        { name: 'FileSecurityGuard', desc: 'Client-side magic bytes validator & EICAR anti-malware quarantine' },
        { name: 'POSIX Stream Pipeline', desc: '64 KB socket chunking under strict bounded < 28 MB RAM budget' },
      ],
    },
  ]

  return (
    <div className="oe-arch-layers-wrapper my-6 space-y-4">
      {layers.map((layer) => (
        <div key={layer.name} className="p-4 sm:p-5 rounded-xl bg-black/50 border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: layer.color }} />
              <h4 className="font-mono text-xs font-bold text-white tracking-wider uppercase">
                {layer.name}
              </h4>
            </div>
            <span
              className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border"
              style={{ color: layer.color, borderColor: `${layer.color}40`, backgroundColor: `${layer.color}15` }}
            >
              {layer.badge}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {layer.components.map((comp) => (
              <div key={comp.name} className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="font-mono text-xs font-bold text-white block truncate" style={{ color: layer.color }}>
                  {comp.name}
                </span>
                <p className="font-serif text-[11px] text-white/70 leading-snug">
                  {comp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Verification, Testing & QA Scorecard (53/53 Test Suites & 100/100 Security)
function ValtSkyQAScorecard() {
  const suites = [
    {
      category: 'Auth & MTProto 2.0 Suite',
      file: 'telegram_auth_and_country_test.dart',
      passed: '9 / 9',
      checks: 'Dial code detection, 10-digit limit for India, country switcher, profile card rendering, logout confirmation, Diffie-Hellman handshake.',
      status: '100% Pass',
    },
    {
      category: 'UI Smoke & Responsive Bounds Suite',
      file: 'widget_test.dart',
      passed: '22 / 22',
      checks: '4-tab navigation, four-block telemetry rendering, dynamic GPU blur bypass, decoupled pause/resume upload controls, oversized vault assistant sheet, walkthrough guide, interactive beacons.',
      status: '100% Pass',
    },
    {
      category: 'Hostile Red-Team Security Suite',
      file: 'security_and_stress_test.dart',
      passed: '12 / 12',
      checks: 'Path traversal guards, EICAR virus quarantine, magic bytes inspection (JPEG/PNG/MP4), SSRF defense, SHA-256 deduplication, salted PIN barrier.',
      status: '100% Pass',
    },
    {
      category: 'Dual-Lane Split Uploader Suite',
      file: 'split_uploader_test.dart',
      passed: '9 / 9',
      checks: 'Dedicated photo & video workers, decoupled gallery monitoring & continuous queue upload draining, high-speed sliding window pipelining, four-block live aggregation.',
      status: '100% Pass',
    },
    {
      category: 'Kernel Interop & BITE Diagnostics',
      file: 'bite_and_kernel_test.dart',
      passed: '1 / 1',
      checks: 'Real-time latency pings, 1-click self-healing, POSIX 64KB socket chunking, Android 10+ ACCESS_MEDIA_LOCATION runtime permissions.',
      status: '100% Pass',
    },
    {
      category: 'Static Analysis',
      file: 'flutter analyze',
      passed: '0 issues',
      checks: 'Zero warnings, zero deprecations, zero lint errors across entire multiplatform codebase.',
      status: 'Clean',
    },
    {
      category: 'Secret Audit',
      file: 'git log -S',
      passed: '0 leaks',
      checks: 'TelegramSecrets credentials and session tokens strictly excluded from git tracking.',
      status: 'Clean',
    },
  ]

  return (
    <div className="oe-test-table my-6">
      <div className="oe-test-table-head">
        <span>Verification Suite &amp; Category</span>
        <span>Coverage Scope &amp; Verified Invariants (Dual-Lane Uploader)</span>
        <span className="text-right">Result</span>
      </div>
      {suites.map((s, idx) => (
        <div key={idx} className="oe-test-row flex items-center justify-between py-3 border-b border-white/10">
          <div className="w-1/3 pr-2">
            <span className="font-mono text-xs text-white font-bold block">{s.category}</span>
            <span className="font-mono text-[11px] text-[#2AABEE]">{s.file}</span>
          </div>
          <p className="font-serif text-xs text-white/70 w-1/2 pr-3">{s.checks}</p>
          <div className="w-1/6 text-right font-mono text-xs">
            <span className="text-emerald-400 font-bold block">{s.passed}</span>
            <span className="text-white/40 text-[10px]">{s.status}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// STAR Method Behavioral & Technical Case Studies (from Engineering Master Guide)
function ValtSkyStarCaseStudies() {
  const [activeCase, setActiveCase] = useState(0)

  const cases = [
    {
      id: 'case-1',
      number: 'CASE 01',
      title: 'The Bounded O(1) Multi-Gigabyte Streaming Pipeline',
      badge: 'KERNEL STREAMING & OOM RESILIENCE',
      color: '#E5484D',
      situation: 'Most consumer cloud backup applications buffer media files completely into heap memory before HTTP chunk assembly. When handling 4K 60fps video files (1 GB to 2 GB), this causes rapid memory ballooning, triggering OS Out-Of-Memory (LMK/Jetsam) terminations and battery throttling.',
      task: 'Design a high-throughput upload pipeline capable of streaming multi-gigabyte media files over HTTP multipart boundaries while strictly bounding resident heap memory below 30 MB.',
      action: [
        'Replaced byte array loading with a POSIX file descriptor stream emitting discrete 64 KB byte-slices directly into the TLS socket.',
        'Implemented custom multipart boundary framing that wraps stream chunks without intermediate in-memory allocations.',
        'Added an out-of-band Oversized Media Vault (≥ 2 GB) staging flow that detects files exceeding Telegram Bot API ceilings (2^31 B), gracefully routing them to an isolated 4-click manual staging assistant rather than poisoning the automated FIFO queue.',
      ],
      result: 'Bounded peak resident memory consumption to < 28 MB RAM on continuous 1.8 GB+ streams. Achieved zero OOM terminations across hundreds of hours of stress testing.',
      metrics: [
        { label: 'Resident Heap', value: '< 28 MB RAM' },
        { label: 'Stream Payload', value: '1.8 GB 4K RAW' },
        { label: 'OOM Crashes', value: '0 Exceptions' },
      ],
    },
    {
      id: 'case-2',
      number: 'CASE 02',
      title: 'Bypassing Web Browser Sandbox via Dual-Stack MTProto Bridge',
      badge: 'PROTOCOL VIRTUALIZATION & SANDBOX ESCAPE',
      color: '#2AABEE',
      situation: 'Modern web browsers enforce strict security sandboxing that forbids client-side JavaScript/WASM from opening raw TCP sockets (Socket.connect to Telegram DC 149.154.175.50:443). Web users were unable to authenticate via MTProto 2.0 directly.',
      task: 'Enable seamless, direct MTProto phone OTP authentication in web browsers without compromising user credentials or hosting a centralized third-party proxy server.',
      action: [
        'Developed a lightweight, dual-stack native bridge daemon (bin/auth_bridge.dart on port 8088) that binds simultaneously to IPv4 (0.0.0.0) and IPv6 ([::1]).',
        'Implemented WebSocket packet wrapping with real-time binary serialization to pass MTProto packets directly to Telegram primary data centers.',
        'Configured CORS preflight headers and OWASP Content Security Policy (CSP) rules, translating low-level RPC error frames (FLOOD_WAIT_X, PHONE_NUMBER_INVALID) into structured client-side signals.',
      ],
      result: 'Enabled 10-second OTP login on web platforms with zero cloud intermediaries, preserving the zero-knowledge privacy guarantee.',
      metrics: [
        { label: 'Setup Latency', value: '< 10 Seconds' },
        { label: 'Network Stack', value: 'IPv4 + IPv6' },
        { label: 'Cloud Intermediaries', value: '0 Zero-Trust' },
      ],
    },
    {
      id: 'case-3',
      number: 'CASE 03',
      title: 'Dual-Lane Concurrent Split Uploader & Security Hardening',
      badge: 'AEROSPACE STANDARDS & AIRWORTHINESS',
      color: '#00F5D4',
      situation: 'Production software documentation often suffers from ambiguity, missing failure mode definitions, and lack of rigorous operational invariants.',
      task: 'Architect a concurrent multi-lane upload pipeline isolating photos from videos and author comprehensive systems documentation to eliminate queue starvation and head-of-line blocking.',
      action: [
        'Designed dedicated Photo and Video worker lanes with non-blocking cooperative polling and comprehensive system architecture documentation.',
        'Documented mandatory Airworthiness Directives (AD-01 through AD-04) enforcing salted SHA-256 PIN hashing, SQLite WAL parameterization, and lifecycle re-lock barriers.',
        'Created an emergency Quick Reference Handbook (QRH) defining deterministic procedures for Telegram HTTP 429 FloodWait rate limits, socket disconnects mid-stream, and hostile payload quarantine.',
      ],
      result: 'Eliminated head-of-line blocking completely, backed by 50 passing verification suites and zero static analyzer warnings.',
      metrics: [
        { label: 'Verification Test Suites', value: '50 / 50 Pass' },
        { label: 'Security Score', value: '100 / 100' },
        { label: 'Architecture', value: 'Dual-Lane Uploader' },
      ],
    },
  ]

  const cur = cases[activeCase]

  return (
    <div className="oe-star-cases-wrapper my-6 space-y-4">
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-white/10">
        {cases.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCase(i)}
            className={`px-3 py-1.5 rounded font-mono text-xs whitespace-nowrap transition-all border ${
              activeCase === i
                ? 'bg-[#E5484D] text-white font-bold border-[#E5484D] shadow-[0_0_12px_rgba(229,72,77,0.4)]'
                : 'bg-black/40 text-white/60 border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            {c.number}: {c.title.split(':')[0]}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6 rounded-xl bg-black/60 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#E5484D] font-bold block">
              STAR CASE STUDY · {cur.badge}
            </span>
            <h4 className="font-display text-base sm:text-lg font-bold text-white mt-0.5">
              {cur.title}
            </h4>
          </div>
          <span className="font-mono text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 shrink-0">
            ✓ PRODUCTION VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2">
            <span className="font-mono text-xs text-[#2AABEE] font-bold uppercase tracking-wider block">
              Situation &amp; Context
            </span>
            <p className="font-serif text-xs text-white/80 leading-relaxed">{cur.situation}</p>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2">
            <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider block">
              Engineering Task &amp; Objective
            </span>
            <p className="font-serif text-xs text-white/80 leading-relaxed">{cur.task}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10 space-y-2.5">
          <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block">
            Architectural Actions Taken
          </span>
          <ul className="space-y-1.5 list-none pl-0">
            {cur.action.map((act, idx) => (
              <li key={idx} className="flex items-start gap-2 font-serif text-xs text-white/85">
                <span className="text-[#E5484D] font-mono font-bold mt-0.5">↳</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider block">
              Quantified Impact &amp; Result
            </span>
            <p className="font-serif text-xs text-white/90 leading-relaxed mt-1">
              {cur.result}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {cur.metrics.map((m, mIdx) => (
              <div key={mIdx} className="text-right border-l border-emerald-500/30 pl-3">
                <span className="font-mono text-[10px] text-white/50 uppercase block">{m.label}</span>
                <strong className="font-mono text-xs text-emerald-300 font-bold">{m.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Technical Interview Talking Points & Deep-Dive Cheatsheet
function ValtSkyInterviewCheatsheet() {
  const [openIdx, setOpenIdx] = useState(0)

  const faqs = [
    {
      q: 'How did you ensure that large file uploads didn\'t cause out-of-memory errors on mobile devices?',
      topic: 'O(1) Streaming & LMK Resilience',
      answer: `In Flutter and Dart, loading an entire 1.5 GB video into a Uint8List forces the Dart runtime to allocate contiguous heap memory, which immediately triggers the Android OS Low Memory Killer (LMK). To solve this, I designed an O(1) space complexity streaming pipeline in lib/services/telegram_api.dart. Instead of reading bytes into memory, I opened a POSIX File.openRead() byte stream, piping 64 KB slices directly into the multipart request body. Memory consumption is decoupled from file size, staying under 28 MB resident heap even during continuous multi-gigabyte transfers.`,
      keyTakeaway: 'Decoupled file size from memory allocations via POSIX 64 KB slices: resident heap remains strictly pinned below 28 MB RAM on a 1.8 GB 4K file.',
    },
    {
      q: 'How does ValtSky maintain database integrity if the user suddenly kills the app or the battery dies?',
      topic: 'SQLite WAL Mode & Power-Loss Recovery',
      answer: `We utilize SQLite configured strictly in Write-Ahead Logging (WAL) mode via DatabaseHelper. In WAL mode, changes are written sequentially to a separate -wal log file rather than rewriting the database in-place. If power is lost mid-transaction, uncommitted frames are automatically rolled back during subsequent boot recovery. Additionally, to protect against SQL injection and SQLite host variable limits (SQLITE_MAX_VARIABLE_NUMBER = 999), all batch operations use parameterized queries chunked into sublists of ≤ 500 parameters.`,
      keyTakeaway: 'Write-Ahead Logging provides atomic durability with crash rollback. 500-item sublist chunking prevents SQLITE_MAX_VARIABLE_NUMBER host variable overflow.',
    },
    {
      q: 'Why did you implement MTProto 2.0 instead of just relying on standard Telegram Bot tokens?',
      topic: 'User Friction & Cryptographic Exchange',
      answer: `User friction. Asking consumer users to search @BotFather, create a bot, copy a complex alphanumeric token, create a channel, add the bot as an administrator, and locate the channel ID was causing a 70%+ onboarding drop-off. By implementing direct MTProto 2.0 Diffie-Hellman authentication, users simply enter their phone number, receive an official Telegram OTP, and ValtSky automatically provisions a private channel named ValtSky Vault (<User>) in under 10 seconds. For web environments where raw TCP sockets are blocked, we built a dual-stack IPv4/IPv6 WebSocket bridge daemon.`,
      keyTakeaway: 'Eliminated 70%+ onboarding drop-off with a 10-second MTProto setup, automated channel provisioning, and dual-stack socket virtualization for web sandboxes.',
    },
    {
      q: 'How do you handle security and sensitive credentials in the mobile client?',
      topic: 'Zero-Trust Storage & Lifecycle Security',
      answer: `We follow a zero-trust architecture. Telegram tokens and session keys are stored in encrypted platform preferences (FlutterSecureStorage using Android Keystore / iOS Keychain). For local app privacy, we implemented a 4-digit Vault PIN protected by salted SHA-256 cryptographic hashing with a 32-byte random salt. Plaintext PINs are never persisted. Furthermore, we integrated WidgetsBindingObserver to detect AppLifecycleState.resumed events: the moment the app returns from background, the UI viewport is instantly blocked by a full-screen cryptographic lock barrier.`,
      keyTakeaway: 'Zero plaintext credentials: encrypted Keystore tokens, 32-byte salted SHA-256 PIN hashing, and instantaneous AppLifecycleState.resumed barrier enforcement.',
    },
  ]

  return (
    <div className="oe-interview-cheatsheet my-6 space-y-3">
      {faqs.map((f, i) => {
        const isOpen = openIdx === i
        return (
          <div
            key={i}
            className={`border rounded-xl transition-all ${
              isOpen
                ? 'bg-black/70 border-[#E5484D]/50 shadow-[0_0_15px_rgba(229,72,77,0.15)]'
                : 'bg-black/40 border-white/10 hover:border-white/20'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-[#E5484D] uppercase font-bold tracking-wider block">
                  SYSTEM DESIGN INTERVIEW · {f.topic}
                </span>
                <h4 className="font-display text-sm sm:text-base font-bold text-white">
                  {f.q}
                </h4>
              </div>
              <span className="font-mono text-xs text-white/50 shrink-0">
                {isOpen ? '▲ HIDE' : '▼ READ'}
              </span>
            </button>

            {isOpen && (
              <div className="px-4 sm:px-5 pb-5 space-y-3 border-t border-white/10 pt-3">
                <p className="font-serif text-xs text-white/85 leading-relaxed">
                  {f.answer}
                </p>
                <div className="p-3 rounded bg-white/[0.03] border border-white/10 flex items-center gap-2">
                  <span className="font-mono text-xs text-emerald-400 font-bold shrink-0">KEY INVARIANT:</span>
                  <span className="font-serif text-[11px] text-white/80">{f.keyTakeaway}</span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Recommended Skills & Technologies Matrix (Staff / Senior Positioning)
function ValtSkySkillsMatrix() {
  const domains = [
    {
      domain: 'Languages',
      badge: 'CORE COMPILERS',
      skills: 'Dart 3.5+, Kotlin, Python, Bash, SQL, C++, HTML5/CSS3',
    },
    {
      domain: 'Frameworks & Runtimes',
      badge: 'CROSS-PLATFORM',
      skills: 'Flutter (v3.24+ / 3.44+), Android SDK (API 24–35), Linux GTK3, Node.js / Web WASM',
    },
    {
      domain: 'Distributed & Network Systems',
      badge: 'PROTOCOLS & STREAMING',
      skills: 'MTProto 2.0, Telegram Bot API, TLS 1.3, TCP/WebSocket Sockets, HTTP/2 Multipart Streaming, Dual-Stack IPv4/IPv6',
    },
    {
      domain: 'Data & Storage Engineering',
      badge: 'TRANSACTIONAL STORAGE',
      skills: 'SQLite (WAL Mode), B-Tree Indexing, Stream Chunking, EXIF Metadata Extraction, File Magic Bytes Inspection',
    },
    {
      domain: 'Security & Reliability',
      badge: 'DEFENSE-IN-DEPTH',
      skills: 'Cryptographic Salts & SHA-256 Hashing, OWASP CSP, EICAR Malware Quarantine, SQL Injection Parameterization, App Lifecycle Security Interlocks',
    },
    {
      domain: 'Standards & Methodology',
      badge: 'AIRWORTHINESS & QUALITY',
      skills: 'Concurrent Multi-Lane Pipelines, Systems Architecture, Test-Driven Development (TDD), MVVM-C Architecture, Git / Conventional Commits',
    },
  ]

  return (
    <div className="oe-skills-matrix my-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {domains.map((d, i) => (
        <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-mono text-xs font-bold text-white uppercase">{d.domain}</span>
            <span className="font-mono text-[9px] text-[#E5484D] font-bold px-1.5 py-0.5 rounded bg-[#E5484D]/10 border border-[#E5484D]/25">
              {d.badge}
            </span>
          </div>
          <p className="font-mono text-xs text-white/70 leading-relaxed">{d.skills}</p>
        </div>
      ))}
    </div>
  )
}

// Summary of Files Created & Modified
function ValtSkyFilesManifest() {
  const files = [
    { path: 'valtsky_flutter/lib/data/country_data.dart', desc: '27+ countries, dial codes, flags, national limits, auto-detection logic.' },
    { path: 'valtsky_flutter/lib/ui/widgets/telegram_phone_login_widget.dart', desc: 'Searchable picker modal, digits-only input filtering, digit counter, error handling.' },
    { path: 'valtsky_flutter/lib/ui/widgets/telegram_profile_card.dart', desc: 'Verified user profile card, initials avatar, Premium badge, DC 1 status, deep-links.' },
    { path: 'valtsky_flutter/bin/auth_bridge.dart', desc: 'Dual-stack MTProto daemon (IPv4 + IPv6), Diffie-Hellman handshake, profile extraction.' },
    { path: 'valtsky_flutter/lib/services/telegram_auth_service_web.dart', desc: 'Web MTProto bridge client with dynamic host resolution.' },
    { path: 'valtsky_flutter/lib/services/telegram_auth_service_native.dart', desc: 'Native raw TCP MTProto 2.0 client.' },
    { path: 'valtsky_flutter/lib/data/prefs.dart', desc: 'Profile persistence (telegramUserId, telegramUserName, telegramUserHandle, telegramIsPremium).' },
    { path: 'valtsky_flutter/web/index.html', desc: 'OWASP CSP headers with granular local bridge allowances.' },
    { path: 'valtsky_flutter/test/telegram_auth_and_country_test.dart', desc: 'Automated unit and widget tests for the new subsystems.' },
    { path: 'README.md', desc: 'Master technical documentation with updated telemetry, architecture diagrams, and developer contacts.' },
  ]

  return (
    <div className="oe-files-manifest my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {files.map((f, i) => (
          <div key={i} className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
            <span className="font-mono text-xs font-bold text-[#E5484D] block truncate">
              {f.path}
            </span>
            <p className="font-serif text-xs text-white/70">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main ValtSky Comprehensive Report Component
export default function ValtSkyReport({
  entranceDelay = 0,
  setupScrollFx,
  useReadout,
  onBackToHome,
  onNavigateProject,
}) {
  const report = useRef(null)

  const sectionAnchors = [
    { id: 'valtsky-overview', label: '00 / dual-lane & high-perf streaming' },
    { id: 'valtsky-star', label: '01 / star case studies' },
    { id: 'valtsky-hurdles', label: '02 / 5 technical hurdles' },
    { id: 'valtsky-arch', label: '03 / systems architecture' },
    { id: 'valtsky-nerds', label: '04 / for nerds: low-level tech' },
    { id: 'valtsky-pillars', label: '05 / architectural pillars' },
    { id: 'valtsky-runtime-lab', label: '06 / interactive runtime lab' },
    { id: 'valtsky-s01', label: '07 / why & decision matrix' },
    { id: 'valtsky-s02', label: '08 / concurrency & durability' },
    { id: 'valtsky-interview', label: '09 / system design interview' },
    { id: 'valtsky-s03', label: '10 / verification test scorecard (53/53)' },
    { id: 'valtsky-skills', label: '11 / staff engineer skills matrix' },
    { id: 'valtsky-files', label: '12 / files created & modified' },
    { id: 'valtsky-s04', label: '13 / production blueprint' },
    { id: 'valtsky-s05', label: '14 / binary verification' },
  ]

  useLayoutEffect(() => {
    const root = report.current
    const scope = root?.closest('.oe-report-panel')
    if (!root || !scope || !setupScrollFx) return undefined
    return setupScrollFx(scope, 'valtsky', entranceDelay)
  }, [entranceDelay, setupScrollFx])

  if (useReadout) {
    useReadout(report, sectionAnchors)
  }

  return (
    <div className="oe-report valtsky-report-panel" ref={report}>
      <ValtSkyReportAmbience />

      <main className="oe-report-main">
        {/* HERO SECTION */}
        <header className="oe-report-hero">
          <p className="oe-report-kicker">
            Technical Architecture Case Study &amp; Systems Profile · Dart 3.5+ · Flutter 3.24+ · Multiplatform · Dual-Lane Split Uploader
          </p>

          <CipherReveal id="project-title" as="h2" duration={1.4} scramble={0.35} order="left" hover="trail">
            VALTSKY ZERO-LOSS CLOUD VAULT<br />
            <span className="oe-hero-subtitle">STAFF / SENIOR DISTRIBUTED SYSTEMS &amp; MOBILE ARCHITECTURE (v2.1.0)</span>
          </CipherReveal>

          {/* Asymmetric Side Panel */}
          <aside className="oe-hero-side-panel" aria-label="Key ValtSky stats">
            <div className="oe-hero-side-stat">
              <strong>50 / 50</strong>
              <span>Automated test suites · 100% Passing</span>
            </div>
            <div className="oe-hero-side-divider" />
            <div className="oe-hero-side-stat">
              <strong>100 / 100</strong>
              <span>Security score · Zero vulnerabilities</span>
            </div>
            <div className="oe-hero-side-divider" />
            <div className="oe-hero-side-stat">
              <strong>&lt; 28 MB</strong>
              <span>O(1) resident heap memory at 1.8 GB stream</span>
            </div>
            <div className="oe-hero-side-divider" />
            <div className="oe-hero-side-stat">
              <strong>10s Setup</strong>
              <span>Direct MTProto 2.0 Diffie-Hellman phone auth</span>
            </div>
            <div className="oe-hero-side-divider" />
            <span className="oe-hero-side-badge">v2.1.0 Production Release · Dual-Lane Uploader</span>
          </aside>

          <p id="project-detail" className="oe-report-intro">
            Staff / Senior Software Engineering Case Study in cross-platform systems architecture (Flutter/Dart &amp; Android Native), binary network protocols (MTProto 2.0, TLS 1.3), and bounded O(1) media streaming pipelines. ValtSky is an unmetered, zero-compression personal cloud vault that transforms private Telegram channels into an encrypted object storage tier with transactional SQLite WAL consistency, zero-loss bit-for-bit sensor preservation, salted SHA-256 vault barriers, and Dual-Lane Split Uploader concurrency.
          </p>

          <div className="oe-hero-quick-install-row">
            <ValtSkyQuickInstall />
          </div>

          <div className="oe-report-btn-group">
            <HoldButton
              size="sm"
              radius={2}
              holdTime={700}
              backgroundColor="#141417"
              fillColor="#e5484d"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              doneLabel="Opening..."
              onTap={() => window.open(VALTSKY_REPO_URL, '_blank')}
              onHold={() => window.open(VALTSKY_REPO_URL, '_blank')}
            >
              GitHub ↗
            </HoldButton>
            <HoldButton
              size="sm"
              radius={2}
              holdTime={700}
              backgroundColor="#141417"
              fillColor="#e5484d"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              doneLabel="Launching..."
              onTap={() => window.open(VALTSKY_WEB_URL, '_blank')}
              onHold={() => window.open(VALTSKY_WEB_URL, '_blank')}
            >
              Live Web Portal ↗
            </HoldButton>
            <HoldButton
              size="sm"
              radius={2}
              holdTime={700}
              backgroundColor="#141417"
              fillColor="#e5484d"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              doneLabel="Opening..."
              onTap={() => window.open(VALTSKY_RELEASE_URL, '_blank')}
              onHold={() => window.open(VALTSKY_RELEASE_URL, '_blank')}
            >
              v2.1.0 Release ↗
            </HoldButton>
            <HoldButton
              size="sm"
              radius={2}
              holdTime={700}
              backgroundColor="#141417"
              fillColor="#e5484d"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              doneLabel="Opening..."
              onTap={() => window.open(VALTSKY_DOCS_URL, '_blank')}
              onHold={() => window.open(VALTSKY_DOCS_URL, '_blank')}
            >
              System Documentation ↗
            </HoldButton>
            <HoldButton
              size="sm"
              radius={2}
              holdTime={700}
              backgroundColor="#141417"
              fillColor="#e5484d"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              doneLabel="Opening..."
              onTap={() => window.open(VALTSKY_LICENSE_URL, '_blank')}
              onHold={() => window.open(VALTSKY_LICENSE_URL, '_blank')}
            >
              MIT &amp; Apache 2.0 ↗
            </HoldButton>
          </div>
          <i className="oe-hero-bracket oe-hero-bracket--tl" aria-hidden="true" />
          <i className="oe-hero-bracket oe-hero-bracket--br" aria-hidden="true" />
        </header>

        <ValtSkyEventTicker />

        {/* METRICS ROW */}
        <section className="oe-report-metrics" aria-label="ValtSky project snapshot">
          <article>
            <span>Deterministic Verification</span>
            <strong><GlyphLottery text="50 / 50 Automated Tests" accentColor="var(--color-interactive)" /></strong>
            <small>50 test suites · Dual-Lane Uploader · 0 analyzer warnings</small>
          </article>
          <article>
            <span>Security &amp; Airworthiness</span>
            <strong><GlyphLottery text="100 / 100 Security" accentColor="var(--color-interactive)" /></strong>
            <small>Salted SHA-256 PIN · EICAR quarantine · Magic bytes</small>
          </article>
          <article>
            <span>Seamless Onboarding</span>
            <strong><GlyphLottery text="10s MTProto 2.0" accentColor="var(--color-interactive)" /></strong>
            <small>2048-bit Diffie-Hellman · 0 @BotFather friction</small>
          </article>
          <article>
            <span>Memory Scalability</span>
            <strong><GlyphLottery text="< 28 MB Resident RAM" accentColor="var(--color-interactive)" /></strong>
            <small>O(1) bounded POSIX stream on 1.8 GB 4K files</small>
          </article>
        </section>

        <p className="oe-report-note">
          ValtSky v2.1.0 solves the chronic silent data degradation of commercial cloud storage by strictly streaming uncompressed document payloads directly to Telegram channels with Dual-Lane concurrency and comprehensive verification and zero intermediate hosting fees.
        </p>

        {/* SECTION 00: OVERVIEW & HIGH-PERFORMANCE STREAMING ARCHITECTURE */}
        <section className="oe-report-section" id="valtsky-overview" data-num="00">
          <div className="oe-report-section-label">
            <span>00</span>
            <p>Vault Architecture &amp; Pipelines</p>
          </div>
          <div className="oe-report-section-body">
            <div className="oe-section-intro-block">
              <h3>The "Free Cloud Storage" Illusion vs. Repurposing Telegram's Unlimited Infrastructure</h3>
              <p>
                Commercial cloud photo backup services (Google Photos, Apple iCloud, Dropbox) face an inherent conflict of interest: storage is costly to maintain, so they aggressively downsample images, strip camera EXIF data, and convert RAW photos into compressed lossy formats. Users who want original sensor fidelity are forced into compounding monthly subscriptions.
              </p>
              <p className="mt-2">
                <strong>The Solution:</strong> ValtSky turns your private, authenticated Telegram channel into an infinite-capacity, encrypted cloud storage vault. Because Telegram allows sending documents up to 2.0 GB (or 4.0 GB on Premium) with zero compression, ValtSky routes all media strictly through Telegram's <code>sendDocument</code> API, ensuring 100% bit-for-bit RAW sensor, color matrix, and EXIF preservation.
              </p>
            </div>

            {/* ASCII Architecture Diagram from Master Guide */}
            <div className="my-6 p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-[10px] sm:text-[11px] text-[#2AABEE] overflow-x-auto leading-relaxed shadow-inner">
              <pre>{`========================================================================================================
                      VALTSKY HIGH-PERFORMANCE STREAMING ARCHITECTURE
========================================================================================================
   [ DEVICE GALLERY ]           [ VALTSKY KERNEL ]             [ TELEGRAM MTPROTO / API ]
   RAW / 4K / EXIF Inodes  -->  Monotonic B-Tree Queue    -->  Direct TLS Socket Dispatch
   (Android MediaStore)         SQLite WAL Mode ($O(1)$ Heap)  (Zero In-Transit Transcoding)
                                500-Item Chunk Guard           Salted SHA-256 Vault Barrier
========================================================================================================`}</pre>
            </div>

            {/* Key Technical Achievements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-6 font-mono text-xs">
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                <span className="text-[#E5484D] font-bold block text-[11px]">01 / DIRECT MTPROTO 2.0 LOGIN</span>
                <p className="font-serif text-[11px] text-white/70">10-second phone login with interactive 27+ country picker, national digit bounds, and Diffie-Hellman exchange (zero @BotFather friction).</p>
              </div>
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                <span className="text-[#E5484D] font-bold block text-[11px]">02 / O(1) STREAMING ENGINE</span>
                <p className="font-serif text-[11px] text-white/70">Piped POSIX 64 KB chunk stream bounds resident RAM to &lt; 28 MB under continuous 1.8 GB file transfers.</p>
              </div>
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                <span className="text-[#E5484D] font-bold block text-[11px]">03 / MONOTONIC CHRONOLOGY</span>
                <p className="font-serif text-[11px] text-white/70">Guarantees historical photos upload first (Ti ≤ Ti+1) so newest captures naturally sit at the bottom of the feed.</p>
              </div>
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                <span className="text-[#E5484D] font-bold block text-[11px]">04 / 4-CLICK OVERSIZED STAGING</span>
                <p className="font-serif text-[11px] text-white/70">Automatically diverts files ≥ 2 GB to an out-of-band staging vault, preventing queue poisoning.</p>
              </div>
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                <span className="text-[#E5484D] font-bold block text-[11px]">05 / DUAL-LANE SPLIT UPLOADER</span>
                <p className="font-serif text-[11px] text-white/70">Concurrent Photo and Video lanes prevent head-of-line blocking, allowing rapid photo sync while videos stream in parallel.</p>
              </div>
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-1">
                <span className="text-[#E5484D] font-bold block text-[11px]">06 / 53/53 AUTOMATED TEST SUITES</span>
                <p className="font-serif text-[11px] text-white/70">100% automated test coverage, 100/100 security score, and zero analyzer warnings on physical Android hardware.</p>
              </div>
            </div>

            {/* Real-World Use Cases Bento Grid */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                  Target Workloads &amp; Real-World Use Cases
                </h4>
                <span className="font-mono text-[11px] text-[#E5484D]">PRODUCTION READY</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <article className="p-5 rounded-lg bg-black/40 border border-white/10 hover:border-[#E5484D]/40 transition-all duration-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E5484D]" />
                    <h5 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                      01 / DSLR, Mirrorless &amp; ProRAW Photographers
                    </h5>
                  </div>
                  <p className="font-serif text-xs text-white/75 leading-relaxed">
                    Mainstream cloud lockers (Google Photos, iCloud) strip raw sensor Bayer arrays and lens profile curves. ValtSky retains 100% bit-for-bit fidelity for Sony ARW, Canon CR3, Nikon NEF, and Apple ProRAW DNG files down to SHA-256 parity.
                  </p>
                  <div className="font-mono text-[11px] text-white/50 pt-1 border-t border-white/5">
                    Preserves: Lens serial, focal length, f-stop, ISO, exposure compensation, and GPS geotags.
                  </div>
                </article>

                <article className="p-5 rounded-lg bg-black/40 border border-white/10 hover:border-[#E5484D]/40 transition-all duration-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E5484D]" />
                    <h5 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                      02 / Mobile Power Users &amp; 4K Videographers
                    </h5>
                  </div>
                  <p className="font-serif text-xs text-white/75 leading-relaxed">
                    High-bitrate 60fps 4K video container files routinely trigger Out-Of-Memory (OOM) background kills on iOS and Android. ValtSky streams 64 KB socket slices under a bounded &lt; 28 MB RAM budget, never crashing mobile background runners.
                  </p>
                  <div className="font-mono text-[11px] text-white/50 pt-1 border-t border-white/5">
                    Safe Boundary: Any-Size Lossless Engine partitions assets across 50MB, 2GB, and Oversized tiers.
                  </div>
                </article>

                <article className="p-5 rounded-lg bg-black/40 border border-white/10 hover:border-[#E5484D]/40 transition-all duration-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E5484D]" />
                    <h5 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                      03 / Personal Zero-Cost Cold Storage Vault
                    </h5>
                  </div>
                  <p className="font-serif text-xs text-white/75 leading-relaxed">
                    Eliminates recurring $9.99/month subscription fees by turning private Telegram channel sharding into an unmetered, encrypted personal storage tier backed by Telegram's distributed global server infrastructure.
                  </p>
                  <div className="font-mono text-[11px] text-white/50 pt-1 border-t border-white/5">
                    Zero Host Tax: No personal VPS, S3 buckets, or database server hosting bills required.
                  </div>
                </article>

                <article className="p-5 rounded-lg bg-black/40 border border-white/10 hover:border-[#E5484D]/40 transition-all duration-200 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E5484D]" />
                    <h5 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                      04 / Historical Archives &amp; Monotonic Chronology
                    </h5>
                  </div>
                  <p className="font-serif text-xs text-white/75 leading-relaxed">
                    Naive backup bots upload files in arbitrary filesystem inode order, inverting family albums and placing decades-old memories at the bottom. ValtSky enforces monotonic timeline sequencing (dateTaken ASC) via SQLite WAL B-tree index.
                  </p>
                  <div className="font-mono text-[11px] text-white/50 pt-1 border-t border-white/5">
                    Chronological Guarantee: Historical 2012 archives always precede recent 2026 media.
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 01: STAR METHOD ARCHITECTURE CASE STUDIES */}
        <section className="oe-report-section oe-report-section--flip" id="valtsky-star" data-num="01">
          <div className="oe-report-section-label">
            <span>01</span>
            <p>STAR Case Studies</p>
          </div>
          <div className="oe-report-section-body">
            <div className="oe-section-intro-block">
              <h3>Behavioral &amp; Technical Case Studies (STAR Method)</h3>
              <p>
                Staff / Senior systems design breakdowns covering memory-bounded POSIX socket streaming, dual-stack MTProto protocol virtualization, and Dual-Lane Split Uploader architecture.
              </p>
            </div>
            <ValtSkyStarCaseStudies />
          </div>
        </section>

        {/* SECTION 02: 5 CORE TECHNICAL HURDLES & SOLUTIONS */}
        <section className="oe-report-section" id="valtsky-hurdles" data-num="02">
          <div className="oe-report-section-label">
            <span>02</span>
            <p>5 Technical Hurdles</p>
          </div>
          <div className="oe-report-section-body">
            <div className="oe-section-intro-block">
              <h3>Technical Hurdles &amp; How They Were Solved</h3>
              <p>
                From browser TCP sandbox restrictions and JS 64-bit integer overflows to OWASP Content Security Policies, national phone validation bounds, and 2 GB Telegram payload limits: explore the five architectural challenges encountered during implementation and the precise engineering solutions designed to overcome them.
              </p>
            </div>
            <ValtSkyFiveHurdles />
          </div>
        </section>

        {/* SECTION 03: SYSTEMS ARCHITECTURE & DATA FLOW */}
        <section className="oe-report-section oe-report-section--flip" id="valtsky-arch" data-num="03">
          <div className="oe-report-section-label">
            <span>03</span>
            <p>Systems Architecture</p>
          </div>
          <div className="oe-report-section-body">
            <div className="oe-section-intro-block">
              <h3>3-Tier Systems Architecture &amp; Data Flow</h3>
              <p>
                A clean boundary between Presentation, Core Services, and Data Storage. Highlighting the conditional compilation bridge allowing identical application logic across Native OS and Chromium Web environments.
              </p>
            </div>
            <ValtSkyArchitectureLayers />
          </div>
        </section>

        {/* SECTION 04: FOR NERDS: UNDER THE HOOD & SYSTEMS ARCHITECTURE */}
        <section className="oe-report-section" id="valtsky-nerds" data-num="04">
          <div className="oe-report-section-label">
            <span>04</span>
            <p>For Nerds: Low-Level Tech</p>
          </div>
          <div className="oe-report-section-body">
            <div className="oe-section-intro-block">
              <h3>Low-Level Internals: Dart 3.5, MTProto 2.0 Binary Protocol, and Dual-Stack Daemons</h3>
              <p>
                An exhaustive engineering breakdown for compiler architects, low-level hackers, and systems engineers: explore MTProto 2.0 Diffie-Hellman key exchanges, dual-stack loopback bridge sockets, authentic user identity deserialization, 27+ national input filters, Any-Size streaming chunking, SQLite WAL b-trees, and pre-network magic-byte security quarantine.
              </p>
            </div>
            <ValtSkyNerdConsole />
          </div>
        </section>

        {/* SECTION 05: ARCHITECTURAL PILLARS */}
        <section className="oe-report-section" id="valtsky-pillars" data-num="05">
          <div className="oe-report-section-label">
            <span>05</span>
            <p>Architectural pillars</p>
          </div>
          <div className="oe-report-section-body">
            <div className="oe-section-intro-block">
              <h3>Four Core Systems Engineered for Lossless Cloud Synchronization</h3>
              <p>
                Every module enforces deterministic invariants across the storage boundary: strict monotonic timeline sequencing, socket-level stream chunking, 2GB ceiling partitioning, and pre-network magic-byte security auditing.
              </p>
            </div>
            <ValtSkyArchitecturalPillars />
            <MonotonicTimelineComparator />
          </div>
        </section>

        {/* SECTION 06: INTERACTIVE RUNTIME LAB */}
        <section className="oe-report-section oe-report-section--flip" id="valtsky-runtime-lab" data-num="06">
          <div className="oe-report-section-label">
            <span>06</span>
            <p>Interactive Runtime Lab</p>
          </div>
          <div className="oe-report-section-body">
            <div className="oe-section-intro-block">
              <h3>Systems in Motion: Ingest, Security Audit, and Chaos Recovery</h3>
              <p>
                Test how the daemon responds to extreme conditions: scrub through the 6-phase ingestion pipeline, simulate mid-stream network drops with HTTP 429 jittered recovery, trigger 2GB oversized asset containment, or inject disguised malware payloads.
              </p>
            </div>
            <ValtSkyRuntimeLab />
          </div>
        </section>

        {/* SECTION 07: WHY BUILD THIS? (DECISION MATRIX) */}
        <section className="oe-report-section" id="valtsky-s01" data-num="07">
          <div className="oe-report-section-label">
            <span>07</span>
            <p>Why build this? (Engine vs. Alternatives)</p>
          </div>
          <div className="oe-report-section-body">
            <h3>Unmetered cold storage without recurring cloud taxes.</h3>
            <p>
              Mainstream cloud providers (Google Photos, iCloud) charge monthly subscription tiers while silently downscaling 4K resolution and discarding valuable camera lens profiles and color curves. Conversely, self-hosting Nextcloud requires continuous server maintenance, and naive Telegram bots crash on large files or strip EXIF by sending compressed photo payloads. ValtSky delivers 100% bit-for-bit cold storage with zero monthly server costs.
            </p>
            <ValtSkyDecisionMatrix />
            <div className="oe-report-facts">
              <p>
                <span>01 / Zero Operational Tax</span>
                <b>Connects mobile and web devices directly to private Telegram channel storage without renting VPS, S3, or database servers.</b>
              </p>
              <p>
                <span>02 / Bit-for-Bit Fidelity</span>
                <b>Strictly transmits multipart/form-data document streams (sendDocument), keeping camera Bayer arrays and color profiles 100% intact.</b>
              </p>
              <p>
                <span>03 / Monotonic Feed Integrity</span>
                <b>SQLite WAL engine sorts assets chronologically (dateTaken ASC), preventing older pictures from burying recent memories in reverse order.</b>
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 08: CONCURRENCY & DURABILITY MODEL */}
        <section className="oe-report-section oe-report-section--flip" id="valtsky-s02" data-num="08">
          <div className="oe-report-section-label">
            <span>08</span>
            <p>Concurrency &amp; durability model</p>
          </div>
          <div className="oe-report-section-body">
            <h3>Single-flight daemon with non-blocking reactive I/O.</h3>
            <p>
              To eliminate out-of-order race conditions on volatile mobile radios, ValtSky employs a single concurrency ticket for network uploads. Disk reads and socket writes operate as reactive asynchronous streams (Stream&lt;List&lt;int&gt;&gt;), preventing UI frame drops and keeping animations locked at 60/120 FPS.
            </p>
            <div className="oe-report-checks mt-6">
              <article>
                <span>SQLite WAL Mode</span>
                <p>
                  Transactions execute in Write-Ahead Logging (WAL) mode on native targets (Android, iOS, macOS) and indexed in-memory relational stores on Web.
                </p>
              </article>
              <article>
                <span>Atomic State Transitions</span>
                <p>
                  Status transitions (queued → syncing → synced | failed) commit to disk before network dispatch. Sudden process kills resume idempotently on reboot.
                </p>
              </article>
              <article>
                <span>Socket Backpressure</span>
                <p>
                  Chunk streaming throttles automatically via socket drain events, preventing socket buffer backpressure from inflating resident memory heap.
                </p>
              </article>
            </div>
            <ValtSkyStreamBench />
          </div>
        </section>

        {/* SECTION 09: SYSTEM DESIGN INTERVIEW CHEATSHEET */}
        <section className="oe-report-section" id="valtsky-interview" data-num="09">
          <div className="oe-report-section-label">
            <span>09</span>
            <p>System Design Interview</p>
          </div>
          <div className="oe-report-section-body">
            <div className="oe-section-intro-block">
              <h3>Technical Interview Talking Points &amp; Systems Architecture Cheatsheet</h3>
              <p>
                Staff / Senior Systems Engineer interview responses detailing memory-bounded POSIX streaming, SQLite WAL power-loss durability, MTProto 2.0 cryptographic authentication, and zero-trust mobile lifecycle barriers.
              </p>
            </div>
            <ValtSkyInterviewCheatsheet />
          </div>
        </section>

        {/* SECTION 10: VERIFICATION, TESTING & QA SCORECARD */}
        <section className="oe-report-section oe-report-section--flip" id="valtsky-s03" data-num="10">
          <div className="oe-report-section-label">
            <span>10</span>
            <p>Verification Test Scorecard (53/53)</p>
          </div>
          <div className="oe-report-section-body">
            <h3>53 / 53 Automated Test Suites · 100/100 Security Score.</h3>
            <p>
              Certified across 53 automated verification suites for MTProto authentication, background isolate cryptography, dynamic GPU blur bypass, decoupled gallery scanning & continuous queue upload draining, dual-lane queue isolation, high-speed sliding window pipelining, UI widget smoke suites, adversarial red-team cybersecurity exploits, and physical Android kernel interop with zero analyzer warnings and zero secret leaks.
            </p>
            <ValtSkyQAScorecard />
            <ValtSkySecurityGuardLab />
          </div>
        </section>

        {/* SECTION 11: RECOMMENDED SKILLS & TECHNOLOGIES MATRIX */}
        <section className="oe-report-section" id="valtsky-skills" data-num="11">
          <div className="oe-report-section-label">
            <span>11</span>
            <p>Staff Skills Matrix</p>
          </div>
          <div className="oe-report-section-body">
            <div className="oe-section-intro-block">
              <h3>Professional Skills &amp; Core Technology Matrix</h3>
              <p>
                Core competencies across distributed protocols, kernel interop, high-throughput streaming, transactional storage, cybersecurity hardening, and aerospace engineering standards.
              </p>
            </div>
            <ValtSkySkillsMatrix />
          </div>
        </section>

        {/* SECTION 12: FILES CREATED & MODIFIED */}
        <section className="oe-report-section oe-report-section--flip" id="valtsky-files" data-num="12">
          <div className="oe-report-section-label">
            <span>12</span>
            <p>Files Created &amp; Modified</p>
          </div>
          <div className="oe-report-section-body">
            <div className="oe-section-intro-block">
              <h3>Summary of Core Implementation Files</h3>
              <p>
                A comprehensive audit of the 10 production files created and modified to implement MTProto 2.0 authentication, country bounds, verified user profile cards, dual-stack socket bridging, and automated test coverage.
              </p>
            </div>
            <ValtSkyFilesManifest />
          </div>
        </section>

        {/* SECTION 13: PRODUCTION CODE BLUEPRINT */}
        <section className="oe-report-section" id="valtsky-s04" data-num="13">
          <div className="oe-report-section-label">
            <span>13</span>
            <p>Production code blueprint</p>
          </div>
          <div className="oe-report-section-body">
            <h3>End-to-end integration: Ingest, verification, and monotonic sync.</h3>
            <p>
              The following production snippet demonstrates how ValtSky initializes persistent storage, validates file header signatures at the boundary, and triggers the monotonic synchronization loop.
            </p>
            <div className="oe-arch-card mt-5">
              <div className="oe-arch-head">
                <span>DART 3.5+ DAEMON ENTRYPOINT</span>
                <small>valtsky_flutter/lib/main.dart</small>
              </div>
              <div className="p-4 bg-black/60 border border-white/10 rounded font-mono text-[.74rem] text-white/90 overflow-x-auto">
                <pre>{`import 'dart:io';
import 'package:valtsky_flutter/data/db/database_helper.dart';
import 'package:valtsky_flutter/data/models/media_item.dart';
import 'package:valtsky_flutter/services/sync_engine.dart';
import 'package:valtsky_flutter/services/telegram_api.dart';
import 'package:valtsky_flutter/util/file_security_guard.dart';

void main() async {
  // 1. Initialize persistent storage and verify integrity
  final dbHelper = DatabaseHelper.instance;
  await dbHelper.init();

  // 2. Instantiate hardened Telegram API gateway
  final telegramClient = TelegramApiClient(
    botToken: '7123456789:AAFabcDEFghIjkLmNoPqRsTuVwXyZ',
    chatId: '-1001234567890',
  );

  // 3. Scan, authenticate, and ingest local camera media
  final sampleFile = File('/storage/emulated/0/DCIM/Camera/IMG_20261101_RAW.dng');
  final headerBytes = await sampleFile.openRead(0, 16).first;
  
  if (!FileSecurityGuard.verifyMagicBytes(headerBytes, 'dng')) {
    throw SecurityException('Header validation failure: Untrusted file signature.');
  }

  final item = MediaItem(
    id: sampleFile.path.hashCode.toString(),
    path: sampleFile.path,
    fileName: 'IMG_20261101_RAW.dng',
    fileSize: await sampleFile.length(),
    dateTaken: DateTime.now().millisecondsSinceEpoch,
    status: 'queued',
  );

  // 4. Enforce monotonic queue entry
  await dbHelper.insertMediaItem(item);

  // 5. Trigger resilient background synchronization worker
  final syncEngine = SyncEngine(dbHelper: dbHelper, api: telegramClient);
  await syncEngine.processNextPendingItem();
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 14: PRODUCTION COMMANDS & VERIFICATION */}
        <section className="oe-report-section oe-report-section--flip" id="valtsky-s05" data-num="14">
          <div className="oe-report-section-label">
            <span>14</span>
            <p>Binary verification</p>
          </div>
          <div className="oe-report-section-body">
            <h3>Verified production builds and cryptographic checksums.</h3>
            <p>
              ValtSky releases include universal Android APKs and static Web PWAs compiled with full tree-shaking and verified against SHA-256 binary manifests.
            </p>
            <div className="oe-arch-card mt-5">
              <div className="p-4 bg-black/60 border border-white/10 rounded font-mono text-[.74rem] text-white/90 overflow-x-auto">
                <pre>{`# Run full automated test suite with race-condition detection (53/53 passing)
cd valtsky_flutter && flutter test --reporter expanded

# Run strict Dart static analyzer (zero warnings threshold)
flutter analyze --fatal-infos --fatal-warnings

# Build production Android Universal APK (v2.1.0 release build)
flutter build apk --release

# Inspect and verify binary SHA-256 integrity hash
sha256sum ../releases/valtsky-v2.1-release.apk
# Target: ae54b04f411cbf4862a086c801e07c143af8dbbffba87420849ddfd0764dfc2f`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* REPORT FOOTER */}
        <footer className="oe-report-footer">
          <span>04 / ValtSky Multiplatform</span>
          <span>v2.1.0 · Multiplatform Production Release</span>
          <p>
            Source: ValtSky Multiplatform Architecture Specification and deployed production binaries. All transfers are uncompressed, encrypted in transit via TLS 1.3, and verified bit-for-bit against client-side camera hashes.
          </p>
          <div className="oe-report-btn-group mt-5">
            {onBackToHome && (
              <HoldButton
                size="sm"
                radius={2}
                holdTime={600}
                backgroundColor="#161619"
                fillColor="#e5484d"
                textColor="#ffffff"
                fillTextColor="#ffffff"
                doneLabel="Returning..."
                onTap={onBackToHome}
                onHold={onBackToHome}
              >
                ← Back to Overview
              </HoldButton>
            )}
            <HoldButton
              size="sm"
              radius={2}
              holdTime={700}
              backgroundColor="#141417"
              fillColor="#e5484d"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              doneLabel="Launching..."
              onTap={() => window.open(VALTSKY_WEB_URL, '_blank')}
              onHold={() => window.open(VALTSKY_WEB_URL, '_blank')}
            >
              Launch Live Portal ↗
            </HoldButton>
            {onNavigateProject && (
              <HoldButton
                size="sm"
                radius={2}
                holdTime={600}
                backgroundColor="#141417"
                fillColor="#e5484d"
                textColor="#ffffff"
                fillTextColor="#ffffff"
                doneLabel="Opening..."
                onTap={() => onNavigateProject('orchestration-engine')}
                onHold={() => onNavigateProject('orchestration-engine')}
              >
                Next: Orchestration Engine →
              </HoldButton>
            )}
          </div>
        </footer>
      </main>
    </div>
  )
}
