import { useCallback, useRef, useState } from 'react'
import DepthRibbon from '../DepthRibbon/DepthRibbon'

const basePath = typeof window !== 'undefined' ? (import.meta.env?.BASE_URL || '/') : '/'

export const VALTSKY_SHOWCASE_ITEMS = [
  {
    src: `${basePath}images/valtsky/raw-exif-lens.jpg`,
    alt: 'Macro RAW camera lens aperture and Bayer sensor grid',
    title: 'Lossless RAW & EXIF Lens Archive',
    subtitle: 'Bit-for-bit optical fidelity · Zero lossy re-compression',
    badge: 'CYAN // OPTICAL FIDELITY',
    accent: '#00F5D4',
    detail: 'Preserves full DSLR Bayer arrays (CR3, ARW, NEF, DNG) with focal length and GPS tags intact.',
  },
  {
    src: `${basePath}images/valtsky/socket-stream.jpg`,
    alt: 'High-speed binary socket conduit with HTTP/2 tunnel',
    title: '64 KB Stream Socket Pipeline',
    subtitle: 'Direct POSIX file descriptor piping into Telegram sendDocument',
    badge: 'MAGENTA // STREAM PIPELINE',
    accent: '#FF007F',
    detail: 'Eliminates RAM buffering: files are read as 64 KB slices directly into network socket streams.',
  },
  {
    src: `${basePath}images/valtsky/monotonic-timeline.jpg`,
    alt: 'Chronological 3D timeline ribbon with neon laser tick marks',
    title: 'Monotonic Chronological Feed',
    subtitle: 'SQLite WAL b-tree indexing (dateTaken ASC)',
    badge: 'AMBER // CHRONOLOGY',
    accent: '#FFB703',
    detail: 'Strict monotonic ordering ensures that 2014 archives chronologically precede recent captures.',
  },
  {
    src: `${basePath}images/valtsky/magic-byte-shield.jpg`,
    alt: 'Cybernetic hexagonal shield verifying binary magic bytes',
    title: 'Client-Side Hex Magic-Byte Audit',
    subtitle: 'First-block sniffer inspects file signatures before dispatch',
    badge: 'LIME // MALWARE DEFENSE',
    accent: '#00FF66',
    detail: 'Inspects raw byte headers (JPEG FF D8 FF, PNG 89 50 4E 47, TIFF 49 49 2A 00) pre-network.',
  },
  {
    src: `${basePath}images/valtsky/memory-daemon.jpg`,
    alt: 'High-performance telemetry core displaying bounded memory footprint',
    title: 'Strict Bounded Memory Footprint',
    subtitle: '< 28 MB RAM flat resident heap during 1.8 GB 4K video uploads',
    badge: 'CRIMSON // MEMORY SHIELD',
    accent: '#FF1E56',
    detail: 'Memory budget stays flat across gigabyte-scale ProRes containers, eliminating OOM daemon kills.',
  },
  {
    src: `${basePath}images/valtsky/cold-vault.jpg`,
    alt: 'Titanium cloud storage vault floating in deep space with encrypted private channels',
    title: 'Unmetered Private Channel Vault',
    subtitle: 'Transforms Telegram channels into a personal encrypted cold tier',
    badge: 'BLUE // ZERO CLOUD TAX',
    accent: '#3A86FF',
    detail: 'Infinite cloud tier backed by Telegram distributed datacenters without monthly subscriptions.',
  },
]

export default function ValtSkyVisual() {
  const ribbonRef = useRef(null)
  const [activePath, setActivePath] = useState('loop') // 'loop' | 'knot' | 'wave'
  const [activeTour, setActiveTour] = useState('cycle') // 'cycle' | 'ride'
  const [activeSpeed, setActiveSpeed] = useState(0.7)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [focusedItem, setFocusedItem] = useState(null)

  const handleFocusChange = useCallback((item, index) => {
    setFocusedIndex(index)
    setFocusedItem(item)
  }, [])

  return (
    <div className="valtsky-visual-container flex flex-col justify-between h-full w-full select-none relative font-mono text-white p-2.5 sm:p-3 overflow-hidden rounded-lg bg-[#050406] border border-white/10 shadow-[0_0_30px_rgba(229,72,77,0.12)]">
      {/* Top HUD Telemetry Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 z-20 text-[.58rem] sm:text-[.62rem]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-white/90 font-bold uppercase tracking-wider">ValtSky 3D Depth Ribbon</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Path Geometry Selector */}
          <div className="flex items-center bg-black/60 border border-white/10 rounded p-0.5 text-[.52rem]">
            {['loop', 'knot', 'wave'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setActivePath(p)}
                className={`px-1.5 py-0.5 rounded uppercase font-mono transition-colors cursor-pointer ${activePath === p ? 'bg-[#E5484D] text-white font-bold shadow-[0_0_10px_#e5484d]' : 'text-white/50 hover:text-white'}`}
                title={`Switch ribbon curve to ${p}`}
              >
                {p}
              </button>
            ))}
          </div>
          {/* Flight Tour Mode Toggle */}
          <button
            type="button"
            onClick={() => setActiveTour((prev) => (prev === 'cycle' ? 'ride' : 'cycle'))}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/90 font-mono text-[.52rem] uppercase border border-white/15 transition-colors cursor-pointer"
            title="Toggle between orbit cycle tour and first-person ride"
          >
            {activeTour === 'cycle' ? 'Orbit Tour' : 'Ride Cam'}
          </button>
        </div>
      </div>

      {/* Main 3D Depth Ribbon Viewport */}
      <div className="relative flex-1 w-full min-h-[175px] sm:min-h-[215px] overflow-hidden my-1.5 rounded-lg bg-black border border-white/10 shadow-inner">
        <DepthRibbon
          ref={ribbonRef}
          items={VALTSKY_SHOWCASE_ITEMS}
          path={activePath}
          tour={activeTour}
          speed={activeSpeed}
          cardSize={0.76}
          aspect={1}
          radius={0.12}
          offset={1}
          fov={56}
          fog={1.8}
          thread={0.75}
          shadow={0.5}
          accentColor="#FF2A6D"
          backgroundColor="transparent"
          focusOnClick={true}
          holdToReveal={true}
          captions={false}
          interactive={true}
          draggable={true}
          wheel={false}
          pauseOnHover={true}
          onFocusChange={handleFocusChange}
        />

        {/* Ambient Corner Crosshairs & Color Legend Indicators */}
        <div className="absolute top-2 left-2.5 pointer-events-none flex items-center gap-1.5 font-mono text-[9px] text-white/60 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] inline-block shadow-[0_0_6px_#00F5D4]" title="Cyan: RAW Lens" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F] inline-block shadow-[0_0_6px_#FF007F]" title="Magenta: Socket Stream" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703] inline-block shadow-[0_0_6px_#FFB703]" title="Amber: Timeline" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] inline-block shadow-[0_0_6px_#00FF66]" title="Lime: Magic Bytes" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E56] inline-block shadow-[0_0_6px_#FF1E56]" title="Crimson: Daemon" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#3A86FF] inline-block shadow-[0_0_6px_#3A86FF]" title="Blue: Cold Vault" />
          <span className="text-[9px] text-white/40 ml-1">VIBRANT 3D</span>
        </div>
        <div className="absolute top-2 right-2.5 pointer-events-none font-mono text-[9px] text-[#00F5D4] tracking-wider">
          WEBGL 2.0
        </div>

        {/* Dynamic Focus Telemetry Overlay */}
        {focusedItem ? (
          <div className="absolute left-2 right-2 bottom-2 z-20 pointer-events-none flex flex-col items-center">
            <div
              className="bg-black/92 backdrop-blur-md rounded-md px-3 py-1.5 text-center max-w-[94%] shadow-2xl transition-all duration-200"
              style={{
                border: `1px solid ${focusedItem.accent || '#E5484D'}`,
                boxShadow: `0 0 20px -5px ${focusedItem.accent || '#E5484D'}66`,
              }}
            >
              <span
                className="text-[9px] font-mono font-bold tracking-widest uppercase block"
                style={{ color: focusedItem.accent || '#E5484D' }}
              >
                {focusedItem.badge}
              </span>
              <span className="text-[11px] font-display font-bold text-white block truncate">
                {focusedItem.title}
              </span>
              <span className="text-[9px] font-mono text-white/70 block truncate">
                {focusedItem.subtitle}
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute left-0 right-0 bottom-2 z-20 pointer-events-none text-center">
            <span className="inline-block bg-black/75 backdrop-blur-sm px-3 py-0.5 rounded-full border border-white/15 text-[9px] font-mono text-white/70 tracking-wider uppercase shadow-md">
              Drag to spin ribbon · Click image to inspect
            </span>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Ticker & Speed Regulator */}
      <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[.54rem] text-white/60 z-20" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-[#00F5D4] font-bold">100% BIT-FOR-BIT</span>
          <span>·</span>
          <span className="text-[#00FF66] font-bold">&lt; 28MB RAM</span>
          <span>·</span>
          <span className="hidden sm:inline text-[#FFB703]">O(log N) WAL</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/40">SPEED:</span>
          {[0.4, 0.7, 1.2].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveSpeed(s)}
              className={`px-1.5 py-0.2 rounded transition-colors cursor-pointer ${activeSpeed === s ? 'text-[#FF2A6D] font-bold bg-[#FF2A6D]/15' : 'text-white/40 hover:text-white'}`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
