import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Utility for merging Tailwind / standard class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const KEYFRAMES_ID = 'magic-transform-doc-keyframes'
const KEYFRAMES_CSS = `@keyframes magic-transform-doc-slide {
  from { transform: translate3d(var(--mt-from), 0, 0); }
  to   { transform: translate3d(var(--mt-to), 0, 0); }
}`

export const DEFAULT_MAGIC_DOCUMENTS = [
  { id: 'doc-0' },
  { id: 'doc-1' },
  { id: 'doc-2' },
  { id: 'doc-3' },
]

export const DEFAULT_MAGIC_RESULTS = [
  { id: 'email', label: 'email', color: '#5C6B2E', textColor: '#ffffff' },
  { id: 'total', label: 'total', color: '#9D2A6E', textColor: '#ffffff' },
  { id: 'address', label: 'address', color: '#2A5C8C', textColor: '#ffffff' },
  { id: 'order', label: 'order', color: '#A8642A', textColor: '#ffffff' },
  { id: 'items', label: 'item lines', color: '#2D1B3D', textColor: '#ffffff' },
]

// React Bits Pro Center Logo SVG
export const ReactBitsLogo = ({ size = 56 }) => (
  <svg
    width={size}
    height={(57 / 63) * size}
    viewBox="0 0 63 57"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.9883 0.633911C19.5173 -0.654995 22.3394 0.207113 24.6621 1.56555L26.7285 2.77356L24.3115 6.9054L22.2461 5.69739C20.3583 4.5933 19.4591 4.74681 19.1611 4.89856L19.1602 4.89954C18.9155 5.0241 18.4181 5.46239 18.125 6.93567C17.8387 8.37572 17.8405 10.4141 18.2266 12.9767C18.4261 14.3009 18.7244 15.7285 19.1152 17.2374C20.6688 17.0074 22.2869 16.8192 23.9561 16.6808C26.7507 12.1642 29.7392 8.32115 32.6191 5.4845C34.6752 3.45936 36.7752 1.84852 38.8018 0.913208C40.7972 -0.00756875 43.124 -0.442579 45.2354 0.630981L45.2402 0.632935C46.7598 1.4098 47.7221 2.75607 48.2891 4.23059C48.849 5.68704 49.0781 7.39449 49.0869 9.19836L49.0986 11.5909L44.3125 11.6144L44.3008 9.2218C44.2936 7.76171 44.1029 6.68073 43.8213 5.94836C43.5492 5.24095 43.2511 4.99368 43.0664 4.89758L42.9551 4.85168C42.6485 4.74911 42.0029 4.70738 40.8076 5.25891C39.4734 5.87462 37.8244 7.07555 35.9775 8.89465C34.0001 10.8424 31.9089 13.3887 29.8496 16.3986C30.2685 16.3927 30.6896 16.3888 31.1123 16.3888C39.2274 16.3888 46.6748 17.482 52.1758 19.3156C54.9137 20.2281 57.3026 21.3677 59.0557 22.7491C60.7816 24.1093 62.2244 25.9864 62.2246 28.3556C62.2245 30.3972 61.1425 32.0811 59.7607 33.3585C58.3791 34.6356 56.5011 35.7031 54.3623 36.5861L52.1504 37.4991L50.3242 33.0743L52.5361 32.1613C54.3856 31.3977 55.6997 30.5945 56.5117 29.8439C57.3226 29.0941 57.4374 28.592 57.4375 28.3556C57.4373 28.0811 57.2726 27.4387 56.0928 26.5089C54.9391 25.5998 53.1213 24.6763 50.6621 23.8566C45.7686 22.2255 38.8561 21.1759 31.1123 21.1759C29.6347 21.1759 28.1871 21.214 26.7783 21.2872C26.0737 22.5086 25.3826 23.781 24.7119 25.0968C24.1552 26.189 23.6329 27.2758 23.1426 28.3497C23.6341 29.4263 24.1567 30.5164 24.7148 31.6115H24.7158C28.2309 38.5139 32.3038 44.197 35.9785 47.8165C37.8251 49.6353 39.4728 50.8352 40.8066 51.4503C42.0008 52.0009 42.6461 51.9593 42.9531 51.8566L43.0645 51.8107C43.2832 51.6985 43.6968 51.3472 43.9971 50.213C44.2968 49.0806 44.3962 47.4527 44.1963 45.3517C43.7981 41.1682 42.2674 35.638 39.6523 29.6359L38.6973 27.4425L43.085 25.5304L44.041 27.7247C46.7865 34.0262 48.5015 40.0607 48.9619 44.8986C49.1911 47.3078 49.1222 49.5568 48.624 51.4386C48.1269 53.316 47.1125 55.1192 45.2383 56.0753L45.2363 56.0763C43.1252 57.151 40.7987 56.7173 38.8027 55.797C36.7756 54.8623 34.6754 53.252 32.6191 51.2267C28.5864 47.2545 24.3434 41.3077 20.7168 34.298C19.479 37.7579 18.6413 40.9697 18.2256 43.7316C17.8398 46.2947 17.8374 48.334 18.124 49.7745C18.3807 51.0645 18.7944 51.5607 19.0576 51.7482L19.1602 51.8116L19.1621 51.8126C19.5397 52.0053 20.7776 52.1209 23.2949 50.3361L25.2471 48.9513L28.0156 52.8566L26.0635 54.2404C23.3614 56.1562 19.9735 57.5986 16.9883 56.0763V56.0773C14.8766 55.0021 13.8587 52.8647 13.4297 50.7091C12.9941 48.5198 13.0627 45.8735 13.4922 43.0197C14.1377 38.7306 15.6472 33.659 17.9092 28.3497C17.092 26.4314 16.3752 24.5433 15.7598 22.713C14.2388 23.0498 12.8324 23.4333 11.5625 23.8566C9.1035 24.6762 7.2855 25.5999 6.13184 26.5089C4.95201 27.4387 4.78729 28.0812 4.78711 28.3556C4.78726 28.7825 5.25106 29.943 7.9834 31.3722L10.1035 32.4816L7.88477 36.7228L5.76465 35.6134C2.82393 34.0752 0.000114308 31.7068 0 28.3556C0.000183998 25.9864 1.44301 24.1093 3.16895 22.7491C4.92202 21.3678 7.31108 20.2281 10.0488 19.3156C11.3888 18.8689 12.845 18.467 14.3975 18.1134C14.0073 16.5685 13.7047 15.0872 13.4941 13.6896C13.0643 10.8363 12.9944 8.191 13.4297 6.00208C13.8584 3.84658 14.8766 1.70906 16.9883 0.633911ZM20.7354 19.4396C19.3193 19.4396 18.1711 20.587 18.1709 22.0031C18.1709 23.4192 19.3192 24.5675 20.7354 24.5675C22.1515 24.5675 23.2998 23.4192 23.2998 22.0031C23.2996 20.587 22.1514 19.4396 20.7354 19.4396Z"
      fill="currentColor"
    />
  </svg>
)

// Procedural placeholder squiggly line SVG
const SquigglyLine = ({ width, amplitude = 1.6 }) => {
  const count = Math.max(8, Math.floor(width / 6))
  const step = width / count
  let path = `M 0 ${amplitude}`
  for (let i = 0; i < count; i++) {
    const cp1x = i * step + 0.25 * step
    const cp1y = i % 2 === 0 ? 0 : 2 * amplitude
    const cp2x = i * step + 0.75 * step
    const cp2y = i % 2 === 0 ? 2 * amplitude : 0
    const endX = (i + 1) * step
    path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endX} ${amplitude}`
  }
  return (
    <svg width={width} height={2 * amplitude + 1} viewBox={`0 0 ${width} ${2 * amplitude + 1}`} style={{ display: 'block' }} aria-hidden="true">
      <path d={path} fill="none" stroke="#262626" strokeWidth={0.9} />
    </svg>
  )
}

// Procedural dot matrix SVG for placeholder photo
const DotMatrix = ({ width, height }) => {
  const cols = Math.floor(width / 4)
  const rows = Math.floor(height / 4)
  return (
    <svg width={width} height={height} viewBox={`0 0 ${4 * cols} ${4 * rows}`} aria-hidden="true">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) =>
          ((43758.5453 * Math.sin(12.9898 * r + 78.233 * c)) % 1 + 1) % 1 > 0.5 ? (
            <rect key={`${r}-${c}`} x={4 * c} y={4 * r} width={3} height={3} fill="#d4d4d4" />
          ) : null
        )
      )}
    </svg>
  )
}

// Procedural document card contents (used in default React Bits Pro mode)
export const ProceduralDocument = memo(function ProceduralDocument({ seed, variant, width, height }) {
  const pseudoRandom = useMemo(() => (t) => {
    const s = 233280 * Math.sin(9301 * seed + 49297 * t)
    return s - Math.floor(s)
  }, [seed])

  const contentWidth = width - 32
  if (variant === 'image') {
    const imgHeight = Math.floor(0.42 * height)
    return (
      <div className="flex h-full w-full flex-col gap-1.5 overflow-hidden p-4">
        <div className="mb-2 h-1.5 w-1/4 rounded-[1px] bg-neutral-300/80 dark:bg-neutral-700/80" />
        <div className="overflow-hidden">
          <DotMatrix width={contentWidth} height={imgHeight} />
        </div>
        <div className="mt-2 flex flex-col gap-1.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <SquigglyLine key={i} width={contentWidth * (0.78 + 0.2 * pseudoRandom(i))} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col gap-1.5 overflow-hidden p-4">
      <div className="mb-2 h-1.5 w-1/4 rounded-[1px] bg-neutral-300/80 dark:bg-neutral-700/80" />
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <SquigglyLine key={`p1-${i}`} width={contentWidth * (0.7 + 0.28 * pseudoRandom(i))} />
        ))}
      </div>
      <div className="my-1.5 flex gap-2">
        <div className="h-3 w-[36%] rounded-[2px] border border-neutral-300/80 dark:border-neutral-700/80" />
        <div className="h-3 w-[18%] rounded-[2px] border border-neutral-300/80 dark:border-neutral-700/80" />
      </div>
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SquigglyLine key={`p2-${i}`} width={contentWidth * (0.7 + 0.28 * pseudoRandom(i + 30))} />
        ))}
      </div>
      <div className="my-1.5 flex gap-2">
        <div className="h-3 w-[28%] rounded-[2px] border border-neutral-300/80 dark:border-neutral-700/80" />
        <div className="h-2.5 w-[24%] rounded-[1px] bg-neutral-300/60 dark:bg-neutral-700/60" />
      </div>
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <SquigglyLine key={`p3-${i}`} width={contentWidth * (0.7 + 0.28 * pseudoRandom(i + 60))} />
        ))}
      </div>
    </div>
  )
})

// Procedural chip content
const ProceduralResultChip = () => (
  <div className="flex flex-col gap-[3px] rounded-md border border-neutral-200 bg-white p-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-900">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="grid grid-cols-3 gap-[3px]">
        <div className="h-1.5 rounded-[1px] bg-neutral-200 dark:bg-neutral-700" />
        <div className="col-span-2 h-1.5 rounded-[1px] bg-neutral-100 dark:bg-neutral-800" />
      </div>
    ))}
  </div>
)

// Single sliding document card
const ConveyorCard = memo(function ConveyorCard({
  index,
  total,
  beat,
  documentWidth,
  documentHeight,
  documentGap,
  centerX,
  paused,
  isSeamlessConveyor = false,
  className,
  style,
  children,
}) {
  const step = documentWidth + documentGap
  // For seamless continuous conveyor across both sides:
  // We divide total cards equally before and after centerX (e.g. k = Math.floor(total / 2))
  // so distance is exactly total * step, creating a 100% mathematically seamless infinite loop.
  const k = Math.floor(total / 2)
  const fromX = isSeamlessConveyor
    ? centerX - k * step
    : centerX - total * step
  const toX = isSeamlessConveyor
    ? centerX + (total - k) * step
    : centerX + step

  const cardStyle = {
    width: documentWidth,
    height: documentHeight,
    top: 0,
    left: 0,
    position: 'absolute',
    willChange: 'transform',
    '--mt-from': `${fromX}px`,
    '--mt-to': `${toX}px`,
    animationName: 'magic-transform-doc-slide',
    animationDuration: `${beat * total}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDelay: `${-index * beat}s`,
    animationPlayState: paused ? 'paused' : 'running',
    transform: paused ? `translate3d(${fromX}px, 0, 0)` : undefined,
    ...style,
  }

  return (
    <div className={className} style={cardStyle}>
      {children}
    </div>
  )
})

export default function MagicTransform({
  documents = DEFAULT_MAGIC_DOCUMENTS,
  results = DEFAULT_MAGIC_RESULTS,
  height = 560,
  width = '100%',
  documentDuration = 4,
  documentWidth = 220,
  documentHeight = 320,
  documentGap = 60,
  axisColor = '#7C3AED',
  backgroundColor,
  centerContent,
  centerSize = 56,
  particleCount = 18,
  classNames,
  paused = false,
  className,
  style,
  renderDocument,
  renderOutputCard,
  renderResult,
  showDefaultChips = true,
  children,
}) {
  // Inject keyframes CSS once
  useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(KEYFRAMES_ID)) return
    const styleEl = document.createElement('style')
    styleEl.id = KEYFRAMES_ID
    styleEl.textContent = KEYFRAMES_CSS
    document.head.appendChild(styleEl)
  }, [])

  const containerRef = useRef(null)
  const [stageWidth, setStageWidth] = useState(0)

  // Measure stage width responsively
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setStageWidth(el.clientWidth)
    let timeoutId = null
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? el.clientWidth
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setStageWidth((prev) => (Math.abs(prev - w) < 1 ? prev : w))
      }, 80)
    })
    ro.observe(el)
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      ro.disconnect()
    }
  }, [])

  const totalDocs = Math.max(1, documents.length)
  const centerX = stageWidth / 2
  const [pulseCount, setPulseCount] = useState(0)
  const startTimeRef = useRef(0)
  const memoKey = useMemo(
    () => `${documentDuration}|${documentWidth}|${documentGap}|${totalDocs}|${centerX}`,
    [documentDuration, documentWidth, documentGap, totalDocs, centerX]
  )

  // Sync beat interval precisely with the sliding documents
  useEffect(() => {
    if (paused || stageWidth <= 0) return
    startTimeRef.current = performance.now()
    const totalCycle = documentDuration * totalDocs
    const totalSpan = (totalDocs + 1) * (documentWidth + documentGap)
    const initialOffset = ((totalDocs * (documentWidth + documentGap) - documentWidth) / totalSpan) * totalCycle

    const elapsed = (performance.now() - startTimeRef.current) / 1000 - initialOffset
    const rem = ((elapsed % documentDuration) + documentDuration) % documentDuration
    const initialDelay = rem < 0.001 ? documentDuration : documentDuration - rem

    let intervalId = null
    const timerId = setTimeout(() => {
      setPulseCount((c) => c + 1)
      intervalId = setInterval(() => {
        setPulseCount((c) => c + 1)
      }, documentDuration * 1000)
    }, initialDelay * 1000)

    return () => {
      clearTimeout(timerId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [paused, stageWidth, documentDuration, totalDocs, documentWidth, documentGap, memoKey])

  // Pseudo-random particles
  const particles = useMemo(() => {
    const list = []
    for (let i = 0; i < particleCount; i++) {
      const res = results[i % results.length]
      const seed = 9301 * i
      const rand = (k) => {
        const v = 233280 * Math.sin(seed + 49297 * k)
        return v - Math.floor(v)
      }
      const angle = (rand(1) - 0.5) * 1.4
      const dist = 90 + 230 * rand(2)
      list.push({
        id: i,
        color: res?.color || axisColor,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist * 0.65,
        rot: (rand(3) - 0.5) * 360,
        size: 7 + Math.floor(8 * rand(4)),
        microDelay: 0.12 * rand(5),
      })
    }
    return list
  }, [particleCount, results, axisColor])

  const stageStyle = {
    width,
    height,
    background: backgroundColor,
    ...style,
  }

  const isEmitting = pulseCount > 0 && !paused

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden rounded-2xl select-none', classNames?.root, className)}
      style={stageStyle}
    >
      {/* LEFT CONTAINER (Input Media): clipped at centerX */}
      {stageWidth > 0 && (
        <div
          className="pointer-events-none absolute z-10 overflow-hidden"
          style={{
            left: 0,
            width: centerX,
            top: `calc(50% - ${documentHeight / 2}px)`,
            height: documentHeight,
          }}
          aria-hidden="true"
        >
          {documents.map((doc, idx) => (
            <ConveyorCard
              key={doc.id || idx}
              index={idx}
              total={totalDocs}
              beat={documentDuration}
              documentWidth={documentWidth}
              documentHeight={documentHeight}
              documentGap={documentGap}
              centerX={centerX}
              paused={paused}
              isSeamlessConveyor={!!renderOutputCard}
              className={cn(
                'rounded-[14px] border border-white/10 bg-neutral-950 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden',
                classNames?.document
              )}
            >
              {renderDocument ? (
                renderDocument(doc, idx)
              ) : (
                <ProceduralDocument
                  seed={idx + 1}
                  variant={idx % 2 === 0 ? 'letter' : 'image'}
                  width={documentWidth}
                  height={documentHeight}
                />
              )}
            </ConveyorCard>
          ))}
        </div>
      )}

      {/* RIGHT CONTAINER (Transformed Output Media): starts at centerX */}
      {stageWidth > 0 && renderOutputCard && (
        <div
          className="pointer-events-none absolute z-10 overflow-hidden"
          style={{
            left: centerX,
            width: stageWidth - centerX,
            top: `calc(50% - ${documentHeight / 2}px)`,
            height: documentHeight,
          }}
          aria-hidden="true"
        >
          {documents.map((doc, idx) => (
            <ConveyorCard
              key={`out-${doc.id || idx}`}
              index={idx}
              total={totalDocs}
              beat={documentDuration}
              documentWidth={documentWidth}
              documentHeight={documentHeight}
              documentGap={documentGap}
              centerX={centerX}
              paused={paused}
              isSeamlessConveyor={!!renderOutputCard}
              style={{ left: -centerX }}
              className={cn(
                'rounded-[14px] border border-white/10 bg-neutral-950 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden',
                classNames?.outputDocument || classNames?.document
              )}
            >
              {renderOutputCard(doc, idx)}
            </ConveyorCard>
          ))}
        </div>
      )}

      {/* Transform Axis Gradient Glow */}
      <div
        className={cn('pointer-events-none absolute z-20', classNames?.axis)}
        style={{
          width: 56,
          height: documentHeight,
          left: '50%',
          top: '50%',
          transform: 'translate(-100%, -50%)',
          background: `linear-gradient(90deg, transparent 0%, ${axisColor}15 60%, ${axisColor}33 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Central Laser Beam Line */}
      <div
        className="pointer-events-none absolute z-20"
        style={{
          width: 2,
          height: documentHeight,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: axisColor,
          boxShadow: `0 0 16px ${axisColor}, 0 0 32px ${axisColor}66`,
        }}
        aria-hidden="true"
      />

      {/* Central Transformation Hub / Icon Tile */}
      <motion.div
        key={`center-${pulseCount}`}
        className={cn(
          'pointer-events-none absolute left-1/2 top-1/2 z-30 flex items-center justify-center rounded-[12px] bg-neutral-950 border border-white/20 p-2 text-white shadow-[0_10px_40px_rgba(229,72,77,0.35)]',
          classNames?.center
        )}
        style={{
          width: centerSize,
          height: centerSize,
          translate: '-50% -50%',
        }}
        initial={{ scale: 1, boxShadow: `0 10px 40px ${axisColor}33` }}
        animate={
          pulseCount === 0
            ? undefined
            : {
                scale: [1, 1.15, 1],
                boxShadow: [
                  `0 10px 40px ${axisColor}33`,
                  `0 10px 60px ${axisColor}CC`,
                  `0 10px 40px ${axisColor}33`,
                ],
              }
        }
        transition={{
          duration: Math.min(0.6, 0.5 * documentDuration),
          ease: [0.16, 1, 0.3, 1],
          times: [0, 0.25, 1],
        }}
      >
        {centerContent ?? <ReactBitsLogo size={centerSize - 24} />}
      </motion.div>

      {/* Bursting Confetti / Quantum Particles */}
      {stageWidth > 0 && isEmitting && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20" aria-hidden="true" key={`particles-${pulseCount}`}>
          {particles.map((p) => {
            const dur = Math.min(1.2 * documentDuration, 2.4)
            return (
              <motion.div
                key={p.id}
                className={cn('absolute', classNames?.particle)}
                style={{
                  left: 0,
                  top: 0,
                  width: p.size,
                  height: p.size,
                  translate: '-50% -50%',
                  willChange: 'transform, opacity',
                }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.2 }}
                animate={{ x: p.dx, y: p.dy, rotate: p.rot, scale: 1, opacity: [0, 1, 1, 0] }}
                transition={{
                  default: { duration: dur, ease: [0.16, 1, 0.3, 1], delay: p.microDelay },
                  opacity: { duration: dur, times: [0, 0.12, 0.5, 1], ease: 'easeOut', delay: p.microDelay },
                }}
              >
                <div
                  className="h-full w-full rounded-[3px]"
                  style={{
                    background: p.color,
                    boxShadow: `0 1px 4px ${p.color}88`,
                  }}
                />
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Default Result Chips (when showDefaultChips is true and renderOutputCard is not used) */}
      {stageWidth > 0 && isEmitting && showDefaultChips && !renderOutputCard && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20" aria-hidden="true" key={`results-${pulseCount}`}>
          {results.map((res, idx) => {
            const totalRes = results.length
            const factor = ((totalRes === 1 ? 0.5 : idx / (totalRes - 1)) - 0.5) * 1.1 + ((53 * idx) % 11 - 5) / 60
            const dist = 240 + ((23 * idx) % 60)
            const cx = Math.cos(factor) * dist + 0.4 * (centerSize / 2 + 40)
            const cy = Math.sin(factor) * dist
            const rot = ((53 * idx) % 30) - 15
            const microDelay = ((0.025 * idx) % 0.12)
            const dur = Math.min(1.1 * documentDuration, 2.4)

            return (
              <motion.div
                key={res.id}
                className={cn('absolute flex w-[170px] flex-col gap-1.5', classNames?.result)}
                style={{ left: 0, top: 0, transformOrigin: '0% 50%', willChange: 'transform, opacity' }}
                initial={{ x: 0, y: 0, rotate: rot, opacity: 0, scale: 0.3 }}
                animate={{ x: cx, y: cy, rotate: 0.25 * rot, scale: 1, opacity: [0, 1, 1, 0] }}
                transition={{
                  default: { duration: dur, ease: [0.16, 1, 0.3, 1], delay: microDelay },
                  opacity: { duration: dur, times: [0, 0.1, 0.55, 1], ease: 'easeOut', delay: microDelay },
                }}
              >
                {renderResult ? (
                  renderResult(res, idx, pulseCount)
                ) : (
                  <>
                    <div className="h-5 w-[88px] rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.06)]" style={{ background: res.color }} />
                    <div className={cn(classNames?.resultBody)}>
                      <ProceduralResultChip />
                    </div>
                  </>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {children}
    </div>
  )
}
