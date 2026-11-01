import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import MagicTransform from '../MagicTransform/MagicTransform'

const basePath = typeof window !== 'undefined' ? (import.meta.env?.BASE_URL || '/') : '/'

// Regular, real everyday photos that people back up to cloud storage
export const VALTSKY_PHOTOS = [
  {
    id: 'photo-1',
    name: 'IMG_4821.RAW',
    size: '48 MB',
    src: `${basePath}images/valtsky/photo-mountain.jpg`,
    title: 'Alpine Lake & Peaks',
    time: '12:41',
  },
  {
    id: 'photo-2',
    name: 'DSC_9012.JPG',
    size: '32 MB',
    src: `${basePath}images/valtsky/photo-beach.jpg`,
    title: 'Coastal Sunset',
    time: '13:05',
  },
  {
    id: 'photo-3',
    name: 'NIGHT_0411.RAW',
    size: '56 MB',
    src: `${basePath}images/valtsky/photo-city.jpg`,
    title: 'City Skyline',
    time: '13:22',
  },
  {
    id: 'photo-4',
    name: 'FOREST_2289.JPG',
    size: '28 MB',
    src: `${basePath}images/valtsky/photo-forest.jpg`,
    title: 'Sunlight Through Forest',
    time: '13:58',
  },
  {
    id: 'photo-5',
    name: 'STREET_8810.RAW',
    size: '42 MB',
    src: `${basePath}images/valtsky/photo-street.jpg`,
    title: 'Old Town Cobblestone',
    time: '14:15',
  },
  {
    id: 'photo-6',
    name: 'DESERT_3301.JPG',
    size: '36 MB',
    src: `${basePath}images/valtsky/photo-desert.jpg`,
    title: 'Golden Sand Dunes',
    time: '14:30',
  },
]

// Minimal Telegram Paper Plane Icon
const TelegramIcon = ({ size = 16, className = '' }) => (
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

// Clean Camera Photo Card (Input: Local Device)
const NormalPhotoCard = memo(function NormalPhotoCard({ item }) {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-xl bg-[#0e0e12] border border-white/10 select-none relative shadow-lg">
      {/* Full-bleed Photo */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <img
          src={item.src}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {/* Clean minimal info tag */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10">
          <span className="truncate font-semibold">{item.name}</span>
          <span className="text-white/50 text-[7.5px] ml-1 shrink-0">{item.size}</span>
        </div>
      </div>
    </div>
  )
})

// Clean Telegram Cloud Saved Post Card (Output: Cloud Storage)
const TelegramCloudCard = memo(function TelegramCloudCard({ item }) {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-xl bg-[#17212b] border border-[#2AABEE]/30 select-none relative shadow-lg p-1.5">
      {/* Sleek Telegram Header */}
      <div className="flex items-center justify-between px-1 py-0.5 text-[8px] sm:text-[9px] font-mono border-b border-[#2AABEE]/15 pb-1">
        <div className="flex items-center gap-1.5 text-[#2AABEE]">
          <TelegramIcon size={12} />
          <span className="font-semibold text-white/90">Telegram Cloud</span>
        </div>
        <span className="text-emerald-400 font-semibold text-[7.5px] flex items-center gap-0.5">
          <span>✓</span> Saved
        </span>
      </div>

      {/* The Clean Photo */}
      <div className="relative flex-1 w-full my-1 rounded-lg overflow-hidden border border-[#2AABEE]/20 bg-[#0e1621]">
        <img
          src={item.src}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Minimal Telegram Post Footer */}
      <div className="flex items-center justify-between px-1 text-[7.5px] sm:text-[8px] font-mono text-white/60 pt-0.5 border-t border-[#2AABEE]/15">
        <span className="truncate">{item.name}</span>
        <div className="flex items-center gap-1 text-[#2AABEE]">
          <span>{item.time}</span>
          <span className="font-bold text-[8.5px]">✓✓</span>
        </div>
      </div>
    </div>
  )
})

export default function ValtSkyVisual() {
  const containerRef = useRef(null)
  const [stageDimensions, setStageDimensions] = useState({ width: 340, height: 210 })

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

  // Proportional card dimensions
  const { cardWidth, cardHeight, cardGap, duration } = useMemo(() => {
    const w = stageDimensions.width
    const h = stageDimensions.height
    const cWidth = Math.min(150, Math.max(120, Math.floor(w * 0.40)))
    const cHeight = Math.min(210, Math.max(155, Math.floor(h * 0.90)))
    const cGap = Math.min(32, Math.max(18, Math.floor(w * 0.07)))
    return {
      cardWidth: cWidth,
      cardHeight: cHeight,
      cardGap: cGap,
      duration: 3.6,
    }
  }, [stageDimensions])

  return (
    <div
      ref={containerRef}
      className="valtsky-visual-container flex flex-col justify-between h-full w-full select-none relative font-mono text-white p-2 sm:p-2.5 overflow-hidden rounded-lg bg-[#050406] border border-white/10 shadow-[0_0_30px_rgba(42,171,238,0.1)]"
    >
      {/* Pure, Clean Animation Stage */}
      <div className="relative flex-1 w-full min-h-[180px] sm:min-h-[210px] overflow-hidden rounded-lg bg-black/60 border border-white/10">
        <MagicTransform
          documents={VALTSKY_PHOTOS}
          height="100%"
          width="100%"
          documentDuration={duration}
          documentWidth={cardWidth}
          documentHeight={cardHeight}
          documentGap={cardGap}
          axisColor="#2AABEE"
          backgroundColor="transparent"
          centerSize={36}
          particleCount={0}
          classNames={{
            center: '!rounded-full !bg-black/95 !border-[#2AABEE]/60 !shadow-[0_0_20px_rgba(42,171,238,0.4)]',
          }}
          centerContent={
            <div className="flex items-center justify-center text-[#2AABEE]">
              <TelegramIcon size={18} className="drop-shadow-[0_0_8px_#2AABEE]" />
            </div>
          }
          renderDocument={(doc) => <NormalPhotoCard item={doc} />}
          renderOutputCard={(doc) => <TelegramCloudCard item={doc} />}
        />
      </div>

      {/* Clean, Subtle Bottom Indicator */}
      <div className="flex items-center justify-between pt-1 text-[.55rem] text-white/45 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2AABEE] inline-block animate-pulse" />
          <span>Device Photos ➔ Telegram Cloud Storage</span>
        </span>
        <span className="text-[#2AABEE]/80">Lossless · Encrypted</span>
      </div>
    </div>
  )
}
