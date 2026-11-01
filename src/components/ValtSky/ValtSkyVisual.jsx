import { useEffect, useRef, useState } from 'react'

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function ValtSkyVisual() {
  const containerRef = useRef(null)
  const [activeTab, setActiveTab] = useState('stream') // stream | boundary | hex
  const [activeChunk, setActiveChunk] = useState(0)
  const [heapRam, setHeapRam] = useState(21.4)
  const [chunkCount, setChunkCount] = useState(134)
  const [channelMessageId, setChannelMessageId] = useState(10482)
  const [gateSize, setGateSize] = useState(1.8) // GB

  useEffect(() => {
    if (reduceMotion()) return undefined
    const interval = setInterval(() => {
      setActiveChunk((prev) => (prev + 1) % 5)
      setChunkCount((prev) => prev + 1)
      setHeapRam((prev) => +(20.8 + Math.random() * 2.2).toFixed(1))
      if (Math.random() > 0.65) {
        setChannelMessageId((prev) => prev + 1)
      }
    }, 1600)
    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={containerRef} className="valtsky-visual-container flex flex-col justify-between h-full p-4 select-none relative font-mono text-white">
      {/* Top Telemetry Header & Mini Mode Switch */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[.62rem] uppercase tracking-[.12em] text-white/70">ValtSky Daemon v2.0</span>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-0.5 rounded text-[.54rem]" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setActiveTab('stream')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${activeTab === 'stream' ? 'bg-red-600/30 text-white border border-red-500/50' : 'text-white/50 hover:text-white'}`}
          >
            I/O STREAM
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('boundary')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${activeTab === 'boundary' ? 'bg-red-600/30 text-white border border-red-500/50' : 'text-white/50 hover:text-white'}`}
          >
            2GB GATE
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hex')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${activeTab === 'hex' ? 'bg-red-600/30 text-white border border-red-500/50' : 'text-white/50 hover:text-white'}`}
          >
            HEX SNIFFER
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="my-auto py-2 relative flex flex-col items-center justify-center min-h-[170px]">
        {activeTab === 'stream' && (
          <div className="w-full flex flex-col items-center">
            <svg viewBox="0 0 540 180" className="w-full max-w-[500px] h-auto overflow-visible" fill="none">
              <defs>
                <pattern id="valtsky-grid-v2" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
                <linearGradient id="valtsky-stream-grad-v2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e5484d" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ff7a7e" stopOpacity="1" />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity="0.9" />
                </linearGradient>
                <filter id="valtsky-glow-v2" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <rect width="540" height="180" fill="url(#valtsky-grid-v2)" rx="6" />

              {/* Connecting dashed trace */}
              <path
                d="M 65 90 L 175 90 L 285 90 L 395 90 L 475 90"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Animated active packet laser */}
              <path
                d="M 65 90 L 475 90"
                stroke="url(#valtsky-stream-grad-v2)"
                strokeWidth="2.5"
                strokeDasharray="40 160"
                strokeDashoffset={-activeChunk * 60}
                filter="url(#valtsky-glow-v2)"
                className="transition-all duration-700 ease-linear"
              />

              {/* Node 1: Ingest */}
              <g transform="translate(65, 90)">
                <circle r="20" fill="#141417" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                <circle r="4" fill="#e5484d" />
                <text y="-26" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7.5" letterSpacing="0.08em">DCIM</text>
                <text y="28" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">RAW DNG</text>
                <text y="38" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6.5">84MB asset</text>
              </g>

              {/* Node 2: Magic-Byte Guard */}
              <g transform="translate(175, 90)">
                <rect x="-22" y="-18" width="44" height="36" rx="3" fill="#141417" stroke="#4ade80" strokeWidth="1.5" />
                <text y="-2" textAnchor="middle" fill="#4ade80" fontSize="7.5" fontWeight="bold">49 49 2A</text>
                <text y="9" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="6">TIFF HDR</text>
                <text y="-26" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7.5" letterSpacing="0.08em">SECURITY</text>
                <text y="28" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">Header Guard</text>
                <text y="38" textAnchor="middle" fill="rgba(74, 222, 128, 0.8)" fontSize="6.5">VERIFIED OK</text>
              </g>

              {/* Node 3: SQLite WAL Queue */}
              <g transform="translate(285, 90)">
                <circle r="21" fill="#141417" stroke="#e5484d" strokeWidth="1.5" />
                <path d="M -7 -6 L 7 -6 M -7 0 L 7 0 M -7 6 L 7 6" stroke="#e5484d" strokeWidth="1.5" strokeLinecap="round" />
                <text y="-26" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7.5" letterSpacing="0.08em">ORDERING</text>
                <text y="28" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">SQLite WAL</text>
                <text y="38" textAnchor="middle" fill="#f87171" fontSize="6.5">dateTaken ASC</text>
              </g>

              {/* Node 4: 64KB Chunk Slices */}
              <g transform="translate(395, 90)">
                <rect x="-20" y="-16" width="40" height="32" rx="3" fill="#141417" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                <text y="0" textAnchor="middle" fill="#ff7a7e" fontSize="7.5" fontWeight="bold">64 KB</text>
                <text y="10" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="6">SLICE #{chunkCount}</text>
                <text y="-26" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7.5" letterSpacing="0.08em">SOCKET</text>
                <text y="28" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">sendDocument</text>
                <text y="38" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6.5">HTTP/2 stream</text>
              </g>

              {/* Node 5: Remote Telegram Cold Storage */}
              <g transform="translate(475, 90)">
                <circle r="20" fill="#141417" stroke="#4ade80" strokeWidth="1.5" />
                <path d="M -5 0 L -1 4 L 7 -3" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <text y="-26" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7.5" letterSpacing="0.08em">STORAGE</text>
                <text y="28" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold">Telegram</text>
                <text y="38" textAnchor="middle" fill="rgba(74, 222, 128, 0.9)" fontSize="6.5">#{channelMessageId} OK</text>
              </g>
            </svg>
          </div>
        )}

        {activeTab === 'boundary' && (
          <div className="w-full flex flex-col gap-3 p-3 bg-black/50 border border-white/10 rounded" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-[.64rem]">
              <span className="text-white/60">Simulate Asset Size:</span>
              <span className="font-bold text-accent">{gateSize} GB / 2.00 GB LIMIT</span>
            </div>
            {/* Sizing Range Slider */}
            <input
              type="range"
              min="0.2"
              max="3.6"
              step="0.1"
              value={gateSize}
              onChange={(e) => setGateSize(parseFloat(e.target.value))}
              className="accent-red-500 cursor-pointer w-full"
            />
            {/* Visual Gate Indicator */}
            <div className={`p-2 rounded border text-[.62rem] flex items-center justify-between transition-all ${gateSize < 2.0 ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' : 'bg-red-950/30 border-red-500/50 text-red-300'}`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${gateSize < 2.0 ? 'bg-emerald-400' : 'bg-red-400 animate-ping'}`} />
                <span>
                  {gateSize < 2.0 ? 'AUTOMATED BACKGROUND QUEUE: PASS' : '2GB CEILING EXCEEDED: QUARANTINED TO VAULT'}
                </span>
              </div>
              <span className="font-bold">
                {gateSize < 2.0 ? 'sendDocument' : '4-Click Assistant'}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'hex' && (
          <div className="w-full flex flex-col gap-2 p-2.5 bg-black/60 border border-white/10 rounded text-[.6rem]">
            <div className="flex items-center justify-between text-white/50 border-b border-white/10 pb-1.5">
              <span>HEADER MAGIC BYTES AUDIT</span>
              <span className="text-emerald-400 font-bold">SHA-256 BIT-FOR-BIT FIDELITY</span>
            </div>
            <div className="grid grid-cols-8 gap-1 text-center font-mono py-1">
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">49</span>
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">49</span>
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">2A</span>
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">00</span>
              <span className="p-1 rounded bg-white/5 text-white/60">08</span>
              <span className="p-1 rounded bg-white/5 text-white/60">00</span>
              <span className="p-1 rounded bg-white/5 text-white/60">00</span>
              <span className="p-1 rounded bg-white/5 text-white/60">00</span>
            </div>
            <div className="flex items-center justify-between text-[.54rem] text-white/40 pt-1">
              <span>Identified: TIFF/DNG Sensor RAW Container</span>
              <span className="text-emerald-400">Zero Lossy Re-compression</span>
            </div>
          </div>
        )}

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
