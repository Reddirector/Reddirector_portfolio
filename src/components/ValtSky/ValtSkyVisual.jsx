import { useEffect, useRef, useState } from 'react'

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function ValtSkyVisual() {
  const containerRef = useRef(null)
  const [activeChunk, setActiveChunk] = useState(0)
  const [heapRam, setHeapRam] = useState(21.4)
  const [streamProgress, setStreamProgress] = useState(64)
  const [channelMessageId, setChannelMessageId] = useState(10482)

  useEffect(() => {
    if (reduceMotion()) return undefined
    const interval = setInterval(() => {
      setActiveChunk((prev) => (prev + 1) % 6)
      setStreamProgress((prev) => (prev >= 100 ? 12 : prev + 18))
      setHeapRam((prev) => +(20.5 + Math.random() * 2.8).toFixed(1))
      if (Math.random() > 0.6) {
        setChannelMessageId((prev) => prev + 1)
      }
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={containerRef} className="valtsky-visual-container flex flex-col justify-between h-full p-4 select-none relative font-mono text-white">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[.62rem] uppercase tracking-[.12em] text-white/70">ValtSky Daemon v2.0</span>
        </div>
        <div className="flex items-center gap-2 text-[.56rem] text-accent font-semibold tracking-wider uppercase">
          <span className="bg-red-950/40 border border-red-800/40 px-2 py-0.5 rounded">100% Bit-for-Bit</span>
          <span className="text-white/40">·</span>
          <span className="text-emerald-400">&lt; 28 MB RAM</span>
        </div>
      </div>

      {/* Main Interactive SVG Stream Pipeline */}
      <div className="my-auto py-3 relative flex flex-col items-center justify-center">
        <svg viewBox="0 0 540 210" className="w-full max-w-[500px] h-auto overflow-visible" fill="none">
          {/* Subtle Grid Matrix in background */}
          <defs>
            <pattern id="valtsky-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
            <linearGradient id="valtsky-stream-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e5484d" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ff7a7e" stopOpacity="1" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.9" />
            </linearGradient>
            <filter id="valtsky-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="540" height="210" fill="url(#valtsky-grid)" rx="6" />

          {/* Connection Stream Line */}
          <path
            d="M 65 105 L 175 105 L 285 105 L 395 105 L 475 105"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Animated active data beam */}
          <path
            d="M 65 105 L 475 105"
            stroke="url(#valtsky-stream-grad)"
            strokeWidth="2.5"
            strokeDasharray="40 180"
            strokeDashoffset={-activeChunk * 60}
            filter="url(#valtsky-glow)"
            className="transition-all duration-700 ease-linear"
          />

          {/* Node 1: Camera Storage */}
          <g transform="translate(65, 105)">
            <circle r="22" fill="#141417" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            <circle r="5" fill="#e5484d" />
            <text y="-28" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" letterSpacing="0.08em">INGEST</text>
            <text y="34" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">DCIM RAW</text>
            <text y="45" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">84MB .dng</text>
          </g>

          {/* Node 2: Magic-Byte Header Guard */}
          <g transform="translate(175, 105)">
            <rect x="-24" y="-20" width="48" height="40" rx="3" fill="#141417" stroke={activeChunk >= 1 ? '#4ade80' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
            <text y="-4" textAnchor="middle" fill="#4ade80" fontSize="8" fontWeight="bold">TIFF/DNG</text>
            <text y="8" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="6.5">49 49 2A 00</text>
            <text y="-28" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" letterSpacing="0.08em">SECURITY</text>
            <text y="34" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">Header Guard</text>
            <text y="45" textAnchor="middle" fill="rgba(74, 222, 128, 0.8)" fontSize="7">VERIFIED OK</text>
          </g>

          {/* Node 3: Monotonic SQLite Queue */}
          <g transform="translate(285, 105)">
            <circle r="23" fill="#141417" stroke="#e5484d" strokeWidth="1.5" />
            <path d="M -8 -8 L 8 -8 M -8 0 L 8 0 M -8 8 L 8 8" stroke="#e5484d" strokeWidth="1.5" strokeLinecap="round" />
            <text y="-28" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" letterSpacing="0.08em">ORDERING</text>
            <text y="34" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">SQLite WAL</text>
            <text y="45" textAnchor="middle" fill="#f87171" fontSize="7">dateTaken ASC</text>
          </g>

          {/* Node 4: 64KB Chunk Streamer */}
          <g transform="translate(395, 105)">
            <rect x="-22" y="-18" width="44" height="36" rx="3" fill="#141417" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            <text y="-1" textAnchor="middle" fill="#ff7a7e" fontSize="7.5" fontWeight="bold">64 KB</text>
            <text y="10" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="6.5">CHUNK I/O</text>
            <text y="-28" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" letterSpacing="0.08em">STREAM</text>
            <text y="34" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">sendDocument</text>
            <text y="45" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">HTTP/2 Socket</text>
          </g>

          {/* Node 5: Remote Telegram Cold Storage */}
          <g transform="translate(475, 105)">
            <circle r="22" fill="#141417" stroke="#4ade80" strokeWidth="1.5" />
            <path d="M -6 0 L -1 5 L 8 -4" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text y="-28" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" letterSpacing="0.08em">STORAGE</text>
            <text y="34" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Telegram</text>
            <text y="45" textAnchor="middle" fill="rgba(74, 222, 128, 0.9)" fontSize="7">#{channelMessageId} 200 OK</text>
          </g>
        </svg>

        {/* Telemetry Indicator Badges */}
        <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/10 text-[.58rem]">
          <div className="flex flex-col">
            <span className="text-white/40 uppercase">Heap Memory</span>
            <span className="text-emerald-400 font-semibold">{heapRam} MB <span className="text-white/30 text-[.5rem]">(&lt;28MB)</span></span>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-white/40 uppercase">Boundary Isolation</span>
            <span className="text-white/80 font-semibold">&lt; 2 GB Auto Gate</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-white/40 uppercase">Timeline Sorting</span>
            <span className="text-accent font-semibold">Strict Monotonic</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[.54rem] text-white/50">
        <span>Zero-loss cold storage tier via Telegram Bot API</span>
        <span className="text-accent uppercase tracking-wider">Double-click to open case file ↗</span>
      </div>
    </div>
  )
}
