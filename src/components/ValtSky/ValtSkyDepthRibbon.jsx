import { useCallback, useRef, useState } from 'react'
import DepthRibbon, { DEPTH_RIBBON_PRESETS } from '../DepthRibbon/DepthRibbon'

const basePath = typeof window !== 'undefined' ? (import.meta.env?.BASE_URL || '/') : '/'

export const VALTSKY_SHOWCASE_ITEMS = [
  {
    src: `${basePath}images/valtsky/raw-exif-lens.jpg`,
    alt: 'Macro RAW camera lens aperture and Bayer sensor grid',
    title: 'Lossless RAW & EXIF Lens Archive',
    subtitle: 'Bit-for-bit optical fidelity · Zero lossy re-compression or metadata stripping',
    badge: 'OPTICAL FIDELITY',
    detail: 'Preserves full DSLR Bayer arrays (CR3, ARW, NEF, DNG) with focal length, lens serial, and GPS geotags untouched.',
  },
  {
    src: `${basePath}images/valtsky/socket-stream.jpg`,
    alt: 'High-speed binary socket conduit with HTTP/2 tunnel',
    title: '64 KB Stream Socket Pipeline',
    subtitle: 'Direct POSIX file descriptor piping into Telegram sendDocument HTTP/2 streams',
    badge: 'STREAM PIPELINE',
    detail: 'Eliminates RAM buffering: files are read as reactive 64 KB binary chunks directly into network socket streams.',
  },
  {
    src: `${basePath}images/valtsky/monotonic-timeline.jpg`,
    alt: 'Chronological 3D timeline ribbon with neon laser tick marks',
    title: 'Monotonic Chronological Feed',
    subtitle: 'SQLite WAL b-tree indexing (dateTaken ASC) eliminates reverse timeline inversions',
    badge: 'CHRONOLOGY',
    detail: 'Strict monotonic ordering ensures that 2014 archives chronologically precede recent captures in chat channels.',
  },
  {
    src: `${basePath}images/valtsky/magic-byte-shield.jpg`,
    alt: 'Cybernetic hexagonal shield verifying binary magic bytes',
    title: 'Client-Side Hex Magic-Byte Audit',
    subtitle: 'First-block sniffer inspects file signatures before dispatch · Blocks malicious polyglots',
    badge: 'MALWARE DEFENSE',
    detail: 'Inspects raw byte headers (JPEG FF D8 FF, PNG 89 50 4E 47, TIFF 49 49 2A 00) before any bytes leave the local device.',
  },
  {
    src: `${basePath}images/valtsky/memory-daemon.jpg`,
    alt: 'High-performance telemetry core displaying bounded memory footprint',
    title: 'Strict Bounded Memory Footprint',
    subtitle: '< 28 MB RAM flat resident heap during 1.8 GB 4K video uploads · Zero kernel OOM kills',
    badge: 'MEMORY SHIELD',
    detail: 'Memory budget stays flat across gigabyte-scale ProRes containers, eliminating mobile background daemon termination.',
  },
  {
    src: `${basePath}images/valtsky/cold-vault.jpg`,
    alt: 'Titanium cloud storage vault floating in deep space with encrypted private channels',
    title: 'Unmetered Private Channel Vault',
    subtitle: 'Transforms Telegram channels into a personal, encrypted cold storage tier for life',
    badge: 'ZERO CLOUD TAX',
    detail: 'Infinite cloud tier backed by Telegram distributed datacenters without monthly $9.99 subscription tiers.',
  },
]

export default function ValtSkyDepthRibbon() {
  const ribbonRef = useRef(null)
  const [activePreset, setActivePreset] = useState('ribbon')
  const [activeTour, setActiveTour] = useState('cycle')
  const [activeSpeed, setActiveSpeed] = useState(0.7)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [focusedItem, setFocusedItem] = useState(null)

  const handlePresetChange = (presetKey) => {
    setActivePreset(presetKey)
    const preset = DEPTH_RIBBON_PRESETS[presetKey] || DEPTH_RIBBON_PRESETS.ribbon
    setActiveTour(preset.tour)
    setActiveSpeed(preset.speed)
  }

  const handleTourChange = (tourMode) => {
    setActiveTour(tourMode)
  }

  const handleSpeedChange = (speedVal) => {
    setActiveSpeed(speedVal)
  }

  const handleFocusChange = useCallback((item, index) => {
    setFocusedIndex(index)
    setFocusedItem(item)
  }, [])

  const currentPresetConfig = DEPTH_RIBBON_PRESETS[activePreset] || DEPTH_RIBBON_PRESETS.ribbon

  return (
    <div className="valtsky-depth-ribbon-showcase relative w-full my-8 rounded-xl overflow-hidden border border-white/10 bg-[#070507]">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#E5484D] animate-pulse" />
          <p className="font-mono text-xs uppercase tracking-wider text-white font-bold">
            VALTSKY 3D DEPTH RIBBON · MEDIA INGEST PIPELINE
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-white/55">
          <span className="hidden sm:inline">6 AI-GENERATED SYSTEMS ARCHETYPES</span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/10">
            WEBGL 2.0 INSTANCED
          </span>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 border-b border-white/5 bg-white/[0.02]">
        {/* Preset Selector */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase text-white/45 tracking-wider mr-1">
            Path Geometry:
          </span>
          <button
            type="button"
            onClick={() => handlePresetChange('ribbon')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all duration-150 ${
              activePreset === 'ribbon'
                ? 'bg-[#E5484D] text-white font-semibold shadow-sm shadow-[#E5484D]/40'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Figure-8 Loop
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange('knot')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all duration-150 ${
              activePreset === 'knot'
                ? 'bg-[#E5484D] text-white font-semibold shadow-sm shadow-[#E5484D]/40'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Trefoil Knot
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange('crown')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all duration-150 ${
              activePreset === 'crown'
                ? 'bg-[#E5484D] text-white font-semibold shadow-sm shadow-[#E5484D]/40'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Undulating Wave
          </button>
        </div>

        {/* Camera Tour & Speed */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase text-white/45 tracking-wider mr-1">
              Camera Tour:
            </span>
            <button
              type="button"
              onClick={() => handleTourChange('cycle')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                activeTour === 'cycle' ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              Cycle
            </button>
            <button
              type="button"
              onClick={() => handleTourChange('ride')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                activeTour === 'ride' ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              Ride
            </button>
            <button
              type="button"
              onClick={() => handleTourChange('overview')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                activeTour === 'overview' ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:text-white'
              }`}
            >
              Overview
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1 border-l border-white/10 pl-3">
            <span className="font-mono text-[10px] uppercase text-white/45 tracking-wider mr-1">
              Speed:
            </span>
            {[0.4, 0.7, 1.2].map((sp) => (
              <button
                key={sp}
                type="button"
                onClick={() => handleSpeedChange(sp)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  activeSpeed === sp ? 'bg-[#E5484D]/30 text-[#E5484D] font-bold' : 'text-white/50 hover:text-white'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Depth Ribbon Canvas Container */}
      <div className="relative w-full h-[460px] sm:h-[520px] bg-gradient-to-b from-[#090608] via-[#050406] to-[#080507]">
        <DepthRibbon
          ref={ribbonRef}
          items={VALTSKY_SHOWCASE_ITEMS}
          count={currentPresetConfig.count || 72}
          path={currentPresetConfig.path || 'loop'}
          tour={activeTour}
          speed={activeSpeed}
          cardSize={0.76}
          aspect={1.0}
          radius={0.14}
          fov={currentPresetConfig.fov || 60}
          fog={currentPresetConfig.fog || 1.0}
          thread={currentPresetConfig.thread || 0.35}
          shadow={0.55}
          accentColor="#E5484D"
          backgroundColor="transparent"
          interactive={true}
          draggable={true}
          wheel={true}
          focusOnClick={true}
          holdToReveal={true}
          captions={true}
          pauseOnHover={true}
          onFocusChange={handleFocusChange}
          className="w-full h-full"
        />

        {/* Ambient Top & Bottom Vignettes */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#070507] to-transparent opacity-80" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#070507] via-[#070507]/60 to-transparent" />

        {/* Live Focused Item HUD Pill */}
        {focusedItem && (
          <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md pointer-events-none transition-all duration-300">
            <div className="p-3.5 rounded-lg bg-black/85 backdrop-blur-md border border-[#E5484D]/40 shadow-xl shadow-black/80 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-[#E5484D] tracking-wider uppercase bg-[#E5484D]/15 px-2 py-0.5 rounded border border-[#E5484D]/30">
                  {focusedItem.badge}
                </span>
                <span className="font-mono text-[10px] text-white/50">INSPECTING ACTIVE NODE</span>
              </div>
              <h4 className="font-display text-sm font-bold text-white tracking-tight">{focusedItem.title}</h4>
              <p className="font-serif text-xs text-white/75 leading-relaxed">{focusedItem.detail}</p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Helper Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 border-t border-white/10 bg-black/60 font-mono text-[11px] text-white/50">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/70">
              Drag
            </kbd>{' '}
            Travel Path
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/70">
              Click
            </kbd>{' '}
            Inspect Close-up
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/70">
              Hold
            </kbd>{' '}
            Overview Mode
          </span>
          <span className="hidden lg:inline-flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white/70">
              Scroll
            </kbd>{' '}
            Scrub Stream
          </span>
        </div>
        <div className="text-right">
          <span className="text-[#E5484D] font-semibold">100% BIT-FOR-BIT LOSSLESS</span> · ZERO CLOUD TAX
        </div>
      </div>
    </div>
  )
}
