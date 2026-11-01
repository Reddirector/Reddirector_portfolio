import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MagicTransform from '../MagicTransform/MagicTransform'

const basePath = typeof window !== 'undefined' ? (import.meta.env?.BASE_URL || '/') : '/'

// The 6 System Archetype Media Assets
export const VALTSKY_STREAM_ITEMS = [
  {
    id: 'valtsky-item-0',
    fileName: 'DSC_4892_RAW.DNG',
    fileType: 'RAW DNG',
    camera: 'SONY ILCE-7RM5',
    lens: 'FE 50mm F1.2 GM',
    exifInfo: 'f/1.2 · 1/4000s · ISO 100',
    fileSize: '1.84 GB',
    magicBytes: '49 49 2A 00', // TIFF / DNG
    src: `${basePath}images/valtsky/raw-exif-lens.jpg`,
    title: 'Lossless RAW & EXIF Lens Archive',
    telegramMsgId: '#msg_10482',
    channelName: 'ValtSky Vault',
    channelId: '-1001928471',
    accent: '#00F5D4', // Cyan
    accentLabel: 'CYAN // OPTICAL FIDELITY',
    detail: 'Preserves full DSLR Bayer arrays with lens focal length, aperture and GPS tags bit-for-bit intact.',
    bayerArray: 'RGGB 14-bit Uncompressed',
    compression: '0% Transcoding (sendDocument)',
    ramUsage: '18.4 MB',
    time: '14:02:18',
  },
  {
    id: 'valtsky-item-1',
    fileName: 'PRORES_4K_60FPS.MOV',
    fileType: 'PRORES 422',
    camera: 'BMPCC 6K PRO',
    lens: 'Sigma 18-35mm T2.0',
    exifInfo: '3840x2160 · 10-bit 4:2:2',
    fileSize: '1.76 GB',
    magicBytes: '00 00 00 14 66 74 79 70', // QuickTime MOV
    src: `${basePath}images/valtsky/socket-stream.jpg`,
    title: '64 KB Stream Socket Pipeline',
    telegramMsgId: '#msg_10483',
    channelName: 'ValtSky Vault',
    channelId: '-1001928471',
    accent: '#FF007F', // Magenta
    accentLabel: 'MAGENTA // STREAM PIPELINE',
    detail: 'Reads POSIX file descriptors directly in 64 KB slices into network sockets, avoiding RAM buffering.',
    bayerArray: 'POSIX fd Chunk Stream',
    compression: 'Zero OOM Kill (< 28 MB Heap)',
    ramUsage: '22.1 MB',
    time: '14:03:05',
  },
  {
    id: 'valtsky-item-2',
    fileName: 'TIMELINE_WAL_SYNC.NEF',
    fileType: 'NIKON RAW',
    camera: 'NIKON Z9',
    lens: 'NIKKOR Z 85mm f/1.2 S',
    exifInfo: 'f/1.4 · 1/1600s · ISO 64',
    fileSize: '920 MB',
    magicBytes: '4D 4D 00 2A', // Big-endian TIFF / NEF
    src: `${basePath}images/valtsky/monotonic-timeline.jpg`,
    title: 'Monotonic Chronological Feed',
    telegramMsgId: '#msg_10484',
    channelName: 'ValtSky Vault',
    channelId: '-1001928471',
    accent: '#FFB703', // Amber
    accentLabel: 'AMBER // CHRONOLOGY',
    detail: 'SQLite WAL b-tree indexing sorts by dateTaken ASC so historical captures chronologically precede new ones.',
    bayerArray: 'SQLite WAL b-tree (dateTaken ASC)',
    compression: 'Monotonic Timeline Order',
    ramUsage: '16.8 MB',
    time: '14:03:42',
  },
  {
    id: 'valtsky-item-3',
    fileName: 'SECURITY_AUDIT_VERIFIED.PNG',
    fileType: '16-BIT PNG',
    camera: 'HASSELBLAD X2D',
    lens: 'XCD 2,5/90V',
    exifInfo: '100MP · 16-bit Color Space',
    fileSize: '640 MB',
    magicBytes: '89 50 4E 47 0D 0A 1A 0A', // PNG
    src: `${basePath}images/valtsky/magic-byte-shield.jpg`,
    title: 'Client-Side Hex Magic-Byte Audit',
    telegramMsgId: '#msg_10485',
    channelName: 'ValtSky Vault',
    channelId: '-1001928471',
    accent: '#00FF66', // Lime
    accentLabel: 'LIME // MALWARE DEFENSE',
    detail: 'Inspects raw byte headers before network transmission to prevent malicious payload dispatch.',
    bayerArray: 'Header Magic-Byte Sniffer',
    compression: 'Pre-flight Threat Neutralized',
    ramUsage: '14.2 MB',
    time: '14:04:19',
  },
  {
    id: 'valtsky-item-4',
    fileName: 'DAEMON_STREAM_BOUNDED.CR3',
    fileType: 'CANON RAW',
    camera: 'CANON EOS R5 C',
    lens: 'RF 28-70mm F2 L USM',
    exifInfo: 'f/2.0 · 1/1250s · ISO 100',
    fileSize: '1.45 GB',
    magicBytes: '00 00 00 18 66 74 79 70', // CR3 ISO Base
    src: `${basePath}images/valtsky/memory-daemon.jpg`,
    title: 'Strict Bounded Memory Footprint',
    telegramMsgId: '#msg_10486',
    channelName: 'ValtSky Vault',
    channelId: '-1001928471',
    accent: '#FF1E56', // Crimson
    accentLabel: 'CRIMSON // MEMORY SHIELD',
    detail: 'Operates under strict memory budgets (< 28 MB heap) even during multi-gigabyte ProRes sync streams.',
    bayerArray: 'Resident Heap Bounded Budget',
    compression: 'Flat Heap < 28 MB at 1.8 GB Stream',
    ramUsage: '26.4 MB',
    time: '14:05:01',
  },
  {
    id: 'valtsky-item-5',
    fileName: 'TELEGRAM_COLD_TIER.DNG',
    fileType: 'LEICA MONOCHROM',
    camera: 'LEICA M11-M',
    lens: 'Summilux-M 35mm f/1.4 ASPH',
    exifInfo: 'f/1.4 · 1/8000s · ISO 125',
    fileSize: '1.12 GB',
    magicBytes: '49 49 2A 00', // DNG
    src: `${basePath}images/valtsky/cold-vault.jpg`,
    title: 'Unmetered Private Channel Vault',
    telegramMsgId: '#msg_10487',
    channelName: 'ValtSky Vault',
    channelId: '-1001928471',
    accent: '#3A86FF', // Electric Blue
    accentLabel: 'BLUE // ZERO CLOUD TAX',
    detail: 'Transforms Telegram channels into an unmetered, zero-cost personal cloud vault without subscriptions.',
    bayerArray: 'Telegram HTTP/2 sendDocument',
    compression: '$0.00 / mo · Infinite Encrypted Cold Tier',
    ramUsage: '19.0 MB',
    time: '14:05:44',
  },
]

// Telegram Paper Plane Icon SVG
const TelegramPaperPlane = ({ size = 20, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.63 3.73-.53.36-1.02.54-1.45.53-.48-.01-1.4-.27-2.09-.49-.84-.27-1.51-.42-1.45-.89.03-.25.38-.51 1.05-.78 4.12-1.79 6.87-2.97 8.24-3.55 3.92-1.63 4.74-1.91 5.27-1.92.12 0 .37.03.54.17.14.12.18.28.2.45-.01.07.01.21 0 .26z" />
  </svg>
)

// Raw Inbound Media Document Card (LEFT SIDE: Before Gateway)
const RawInboundCard = memo(function RawInboundCard({ item, width, height }) {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden p-2 sm:p-2.5 bg-[#0C0B0E] text-white font-mono select-none border border-white/10 relative">
      {/* Top RAW Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[8px] sm:text-[9px]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
          <span className="text-amber-400 font-bold uppercase tracking-wider">{item.fileType}</span>
        </div>
        <span className="text-white/60 font-semibold">{item.fileSize}</span>
      </div>

      {/* Image Thumbnail with RAW Sensor Overlay */}
      <div className="relative my-1 flex-1 min-h-[55px] sm:min-h-[65px] rounded overflow-hidden border border-white/10 bg-black">
        <img
          src={item.src}
          alt={item.title}
          className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
        
        {/* Sensor crosshairs */}
        <div className="absolute top-1 left-1 font-mono text-[7px] text-white/50 tracking-tighter">
          [+] RAW SENSOR
        </div>
        <div className="absolute top-1 right-1 font-mono text-[7px] px-1 py-0.2 rounded bg-red-950/80 text-red-400 border border-red-500/30">
          LOCAL /DCIM
        </div>
        <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[7px] text-white/80">
          <span className="truncate max-w-[70%] font-bold">{item.fileName}</span>
          <span className="text-amber-300 text-[6.5px]">UNSYNCED</span>
        </div>
      </div>

      {/* Bottom Ingest Specs */}
      <div className="flex flex-col gap-0.5 text-[7.5px] sm:text-[8px] text-white/65 pt-0.5 border-t border-white/10">
        <div className="flex items-center justify-between text-white/90">
          <span className="truncate">{item.camera}</span>
          <span className="text-[#00F5D4] font-bold text-[7px]">{item.magicBytes.slice(0, 8)}</span>
        </div>
        <div className="flex items-center justify-between text-[7px] text-white/50">
          <span>{item.exifInfo.split('·')[0]}</span>
          <span className="text-amber-400/90 font-mono">MAGIC BYTES</span>
        </div>
      </div>
    </div>
  )
})

// Telegram Cloud Storage Message Bubble (RIGHT SIDE: After Gateway)
const TelegramCloudPostCard = memo(function TelegramCloudPostCard({ item, width, height }) {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden p-2 sm:p-2.5 bg-[#17212b] text-white font-mono select-none border border-[#2AABEE]/30 relative shadow-[0_4px_20px_rgba(42,171,238,0.15)]">
      {/* Top Telegram Channel Header */}
      <div className="flex items-center justify-between border-b border-[#2AABEE]/20 pb-1 text-[8px] sm:text-[9px]">
        <div className="flex items-center gap-1.5">
          <TelegramPaperPlane size={11} className="text-[#2AABEE]" />
          <span className="text-[#2AABEE] font-bold uppercase tracking-wider">{item.channelName}</span>
        </div>
        <span className="text-emerald-400 font-bold text-[7px] flex items-center gap-0.5">
          <span>✓</span> CLOUD STORED
        </span>
      </div>

      {/* Transformed Media Thumbnail with Lossless Cloud Stamp */}
      <div className="relative my-1 flex-1 min-h-[55px] sm:min-h-[65px] rounded overflow-hidden border border-[#2AABEE]/30 bg-[#0e1621]">
        <img
          src={item.src}
          alt={item.title}
          className="h-full w-full object-cover opacity-95"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1621]/90 via-transparent to-black/20 pointer-events-none" />

        {/* Telegram Lossless Stamping */}
        <div className="absolute top-1 left-1 flex items-center gap-1">
          <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[6.5px] font-bold tracking-tight">
            100% BIT-FOR-BIT
          </span>
        </div>
        <div className="absolute top-1 right-1 font-mono text-[7px] text-[#2AABEE] font-bold">
          {item.telegramMsgId}
        </div>
        <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[7px]">
          <span className="truncate max-w-[65%] font-bold text-white">{item.fileName}</span>
          <span className="text-emerald-400 font-bold text-[7px]">{item.fileSize}</span>
        </div>
      </div>

      {/* Telegram Document Payload Footer */}
      <div className="flex flex-col gap-0.5 text-[7.5px] sm:text-[8px] text-white/70 pt-0.5 border-t border-[#2AABEE]/20">
        <div className="flex items-center justify-between text-white/90">
          <span className="text-[#2AABEE] text-[7px] font-bold">sendDocument</span>
          <span className="text-emerald-300 font-bold text-[7px]">EXIF INTACT</span>
        </div>
        <div className="flex items-center justify-between text-[7px] text-white/50">
          <span className="text-white/60">$0.00/mo · UNMETERED</span>
          <div className="flex items-center gap-1">
            <span>{item.time.slice(0, 5)}</span>
            <span className="text-[#2AABEE] font-bold tracking-tighter">✓✓</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default function ValtSkyVisual() {
  const containerRef = useRef(null)
  const [activeSpeed, setActiveSpeed] = useState(1.0)
  const [isPaused, setIsPaused] = useState(false)
  const [stageDimensions, setStageDimensions] = useState({ width: 340, height: 210 })
  const [selectedItem, setSelectedItem] = useState(null)

  // Measure container dimensions responsively
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const updateSize = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        setStageDimensions({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        })
      }
    }
    updateSize()
    const ro = new ResizeObserver(updateSize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Calculate dynamic card dimensions based on stage size
  const { cardWidth, cardHeight, cardGap, duration } = useMemo(() => {
    const w = stageDimensions.width
    const h = stageDimensions.height
    // Scale card dimensions cleanly to fit within the half-stage
    const cWidth = Math.min(160, Math.max(120, Math.floor(w * 0.40)))
    const cHeight = Math.min(220, Math.max(150, Math.floor(h * 0.88)))
    const cGap = Math.min(40, Math.max(20, Math.floor(w * 0.08)))
    // Baseline duration scaled by user speed setting
    const baseBeat = 4.0 / activeSpeed
    return {
      cardWidth: cWidth,
      cardHeight: cHeight,
      cardGap: cGap,
      duration: baseBeat,
    }
  }, [stageDimensions, activeSpeed])

  const handleCardClick = useCallback((item) => {
    setSelectedItem((prev) => (prev?.id === item.id ? null : item))
  }, [])

  return (
    <div
      ref={containerRef}
      className="valtsky-visual-container flex flex-col justify-between h-full w-full select-none relative font-mono text-white p-2.5 sm:p-3 overflow-hidden rounded-lg bg-[#050406] border border-white/10 shadow-[0_0_30px_rgba(229,72,77,0.12)]"
    >
      {/* Top HUD Telemetry Bar */}
      <div
        className="flex items-center justify-between border-b border-white/10 pb-1.5 z-20 text-[.58rem] sm:text-[.62rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-white/90 font-bold uppercase tracking-wider">
            ValtSky Magic Transform Stream
          </span>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-[.52rem] text-white/50">
            <span className="text-amber-400 font-semibold">[RAW IN]</span>
            <span>➔</span>
            <span className="text-[#E5484D] font-bold">[VALTSKY]</span>
            <span>➔</span>
            <span className="text-[#2AABEE] font-semibold">[TELEGRAM CLOUD]</span>
          </div>

          {/* Pause / Play Toggle */}
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className={`px-1.5 py-0.5 rounded font-mono text-[.52rem] uppercase border cursor-pointer transition-colors ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/15'
            }`}
            title={isPaused ? 'Resume stream' : 'Pause stream'}
          >
            {isPaused ? 'Paused' : 'Streaming'}
          </button>
        </div>
      </div>

      {/* Main Magic Transform Viewport */}
      <div className="relative flex-1 w-full min-h-[175px] sm:min-h-[205px] overflow-hidden my-1.5 rounded-lg bg-black border border-white/10 shadow-inner">
        {/* Ambient Stage Labels */}
        <div className="absolute top-1.5 left-2 z-20 pointer-events-none flex items-center gap-1 text-[7.5px] font-mono text-amber-400/80 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
          <span>LOCAL RAW ASSETS</span>
        </div>
        <div className="absolute top-1.5 right-2 z-20 pointer-events-none flex items-center gap-1 text-[7.5px] font-mono text-[#2AABEE]/90 tracking-wider">
          <TelegramPaperPlane size={10} className="text-[#2AABEE]" />
          <span>TELEGRAM CLOUD POSTS</span>
        </div>

        {/* Central Axis Gateway Badges */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded bg-black/90 border border-[#E5484D]/60 text-[6.5px] sm:text-[7px] font-bold text-[#E5484D] tracking-widest uppercase shadow-[0_0_10px_#e5484d44]">
            LOSSLESS GATEWAY
          </span>
        </div>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded bg-black/90 border border-[#2AABEE]/50 text-[6.5px] sm:text-[7px] font-bold text-[#2AABEE] tracking-tight uppercase shadow-[0_0_10px_#2aabee44]">
            sendDocument HTTP/2
          </span>
        </div>

        {/* React Bits Pro MagicTransform Restructured for ValtSky */}
        <MagicTransform
          documents={VALTSKY_STREAM_ITEMS}
          height="100%"
          width="100%"
          documentDuration={duration}
          documentWidth={cardWidth}
          documentHeight={cardHeight}
          documentGap={cardGap}
          axisColor="#E5484D"
          backgroundColor="transparent"
          centerSize={44}
          particleCount={16}
          paused={isPaused}
          centerContent={
            <div className="flex flex-col items-center justify-center text-[#2AABEE] relative">
              <TelegramPaperPlane size={20} className="drop-shadow-[0_0_8px_#2AABEE]" />
              <span className="text-[6px] font-bold text-white tracking-tighter mt-0.5">
                VALTSKY
              </span>
            </div>
          }
          renderDocument={(doc, idx) => (
            <div
              className="h-full w-full cursor-pointer hover:border-amber-400 transition-colors"
              onClick={() => handleCardClick(doc)}
            >
              <RawInboundCard item={doc} width={cardWidth} height={cardHeight} />
            </div>
          )}
          renderOutputCard={(doc, idx) => (
            <div
              className="h-full w-full cursor-pointer hover:border-[#2AABEE] transition-colors"
              onClick={() => handleCardClick(doc)}
            >
              <TelegramCloudPostCard item={doc} width={cardWidth} height={cardHeight} />
            </div>
          )}
        />

        {/* Card Details Modal Overlay when tapped */}
        {selectedItem && (
          <div
            className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm p-3 flex flex-col justify-between"
            onClick={() => setSelectedItem(null)}
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: selectedItem.accent }}
                />
                <span className="font-bold text-[10px] text-white uppercase">
                  {selectedItem.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-white/60 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-3 my-2 items-center">
              <img
                src={selectedItem.src}
                alt={selectedItem.title}
                className="w-16 h-16 rounded object-cover border border-white/20 shrink-0"
              />
              <div className="flex flex-col gap-1 text-[8px] text-white/80">
                <p className="text-white font-bold">{selectedItem.detail}</p>
                <div className="grid grid-cols-2 gap-1 text-[7.5px] text-white/60 mt-1">
                  <div>
                    <span className="text-white/40 block">BAYER/STREAM:</span>
                    <span className="text-[#00F5D4] font-bold">{selectedItem.bayerArray}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">COMPRESSION:</span>
                    <span className="text-emerald-400 font-bold">{selectedItem.compression}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/15 pt-1 text-[7.5px] text-white/60">
              <span>{selectedItem.fileName} ({selectedItem.fileSize})</span>
              <span className="text-[#2AABEE] font-bold">
                POSTED: {selectedItem.telegramMsgId} ✓✓
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Ticker & Speed Regulator */}
      <div
        className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[.54rem] text-white/60 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-[#00F5D4] font-bold">100% BIT-FOR-BIT</span>
          <span>·</span>
          <span className="text-emerald-400 font-bold">&lt; 28MB RAM</span>
          <span>·</span>
          <span className="hidden sm:inline text-[#2AABEE]">sendDocument</span>
          <span>·</span>
          <span className="text-white/40">$0.00/MO</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-white/40">SPEED:</span>
          {[0.5, 1.0, 1.5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveSpeed(s)}
              className={`px-1.5 py-0.2 rounded transition-colors cursor-pointer ${
                activeSpeed === s
                  ? 'text-[#E5484D] font-bold bg-[#E5484D]/20 border border-[#E5484D]/40'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
