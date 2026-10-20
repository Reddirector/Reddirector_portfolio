import { useEffect, useRef } from 'react'

const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function PentagonVisual() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return undefined

    const reduced = reduceMotion()
    let animationFrameId
    let running = true

    // Resize handling
    let width = 0
    let height = 0
    let dpr = 1
    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    }
    updateDimensions()
    const resizeObserver = new ResizeObserver(() => updateDimensions())
    resizeObserver.observe(canvas)

    // Cosmic Starfield (background stars with calm twinkling)
    const starCount = 65
    const bgStars = Array.from({ length: starCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.3 + 0.4,
      baseAlpha: Math.random() * 0.45 + 0.15,
      twinkleSpeed: Math.random() * 0.002 + 0.0008,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? 'rgba(255, 235, 180,' : Math.random() > 0.5 ? 'rgba(180, 220, 255,' : 'rgba(255, 255, 255,',
    }))

    // Inflowing celestial stars that get absorbed by the brain
    let inflowingStars = []
    let absorptionRipples = []
    let brainPulse = 0
    let lastSpawnTime = 0
    let lastTime = performance.now()

    const spawnStar = (now) => {
      if (width <= 0 || height <= 0) return
      const cx = width / 2
      const cy = height / 2

      // Spawn at the outer edge of the cosmos
      const angle = Math.random() * Math.PI * 2
      const spawnRadius = Math.max(width, height) * 0.52 + Math.random() * 40
      const startX = cx + Math.cos(angle) * spawnRadius
      const startY = cy + Math.sin(angle) * spawnRadius

      // Target inside the brain zone (the brain is centered, roughly 50% width by 30% height)
      const targetSpreadX = Math.min(width * 0.28, 110)
      const targetSpreadY = Math.min(height * 0.22, 65)
      const targetX = cx + (Math.random() - 0.5) * targetSpreadX
      const targetY = cy + (Math.random() - 0.5) * targetSpreadY

      // Control point for a graceful, curved gravitational pull
      const normalAngle = angle + (Math.random() > 0.5 ? 1 : -1) * (Math.PI * 0.35 + Math.random() * 0.2)
      const cpDistance = spawnRadius * 0.55
      const cpX = cx + Math.cos(normalAngle) * cpDistance
      const cpY = cy + Math.sin(normalAngle) * cpDistance

      inflowingStars.push({
        id: Math.random(),
        startX,
        startY,
        cpX,
        cpY,
        targetX,
        targetY,
        startTime: now,
        duration: 1600 + Math.random() * 800, // calm, unhurried flight (1.6s - 2.4s)
        radius: 2.2 + Math.random() * 1.4,
        trail: [],
        hue: Math.random() > 0.3 ? 'gold' : 'amber',
      })
    }

    // Main animation render loop
    const render = (now) => {
      if (!running) return
      const dt = Math.min(now - lastTime, 50)
      lastTime = now

      // Spawn periodic stars every 850-1300ms
      if (!reduced && now - lastSpawnTime > (900 + Math.random() * 400)) {
        spawnStar(now)
        lastSpawnTime = now
      }

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      // ── 1. Deep Space Nebula & Ambient Cosmos Backdrop ──
      const spaceGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.65)
      spaceGrad.addColorStop(0, 'rgba(164, 0, 0, 0.22)')
      spaceGrad.addColorStop(0.45, 'rgba(36, 8, 12, 0.25)')
      spaceGrad.addColorStop(1, 'rgba(6, 4, 8, 0)')
      ctx.fillStyle = spaceGrad
      ctx.fillRect(0, 0, width, height)

      // Symmetrical Celestial Concentric Guide Rings with Counter-Orbiting Telemetry Satellites
      if (!reduced) {
        const baseR = Math.min(width, height) * 0.44

        // 1. Clockwise Inner Telemetry Ring
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(now * 0.00018)
        ctx.beginPath()
        ctx.setLineDash([4, 8])
        ctx.arc(0, 0, baseR, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(229, 72, 77, 0.2)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Symmetrical dual satellite nodes
        for (let i = 0; i < 2; i++) {
          const satAngle = i * Math.PI
          const satX = Math.cos(satAngle) * baseR
          const satY = Math.sin(satAngle) * baseR
          ctx.beginPath()
          ctx.arc(satX, satY, 3, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(229, 72, 77, 0.75)'
          ctx.fill()
          ctx.beginPath()
          ctx.arc(satX, satY, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff'
          ctx.fill()
        }
        ctx.restore()

        // 2. Counter-Clockwise Outer Symmetrical Guide Ring
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(-now * 0.00012)
        ctx.beginPath()
        ctx.setLineDash([2, 12])
        ctx.arc(0, 0, baseR * 1.18, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Outer telemetry satellite node
        const outerSatX = Math.cos(0) * (baseR * 1.18)
        const outerSatY = Math.sin(0) * (baseR * 1.18)
        ctx.beginPath()
        ctx.arc(outerSatX, outerSatY, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fill()
        ctx.restore()

        // 3. Subtle Symmetrical Cardinal Reticles
        const markLen = 5
        ctx.save()
        ctx.strokeStyle = 'rgba(229, 72, 77, 0.25)'
        ctx.lineWidth = 1
        ;[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((ang) => {
          const x1 = cx + Math.cos(ang) * (baseR - markLen)
          const y1 = cy + Math.sin(ang) * (baseR - markLen)
          const x2 = cx + Math.cos(ang) * (baseR + markLen)
          const y2 = cy + Math.sin(ang) * (baseR + markLen)
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        })
        ctx.restore()
      }

      // ── 2. Twinkling Background Stars ──
      bgStars.forEach((star) => {
        const sx = star.x * width
        const sy = star.y * height
        const alpha = star.baseAlpha + Math.sin(now * star.twinkleSpeed + star.phase) * (star.baseAlpha * 0.55)
        const safeAlpha = Math.max(0.05, Math.min(0.9, alpha))

        ctx.beginPath()
        ctx.arc(sx, sy, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `${star.color}${safeAlpha})`
        ctx.fill()
      })

      // ── 3. Central Brain Breathing, Ambient Glow & Super Slow Cosmic Rotation ──
      // Subtle organic float
      const floatOffset = reduced ? 0 : Math.sin(now * 0.0016) * 4.5
      const brainY = cy + floatOffset

      // Scaled brain size (proportional, bounded by both width and height to fit during full rotation)
      const maxBrainW = Math.min(width * 0.68, height * 0.82, 300)
      const brainW = maxBrainW
      const brainH = brainW * (576 / 1024)

      // Soft amber/cyan neural aura behind the brain
      const auraBreath = 0.85 + Math.sin(now * 0.002) * 0.15 + brainPulse * 0.6
      const auraRadius = Math.max(brainW, brainH) * 0.62 * (1 + brainPulse * 0.15)
      const auraGrad = ctx.createRadialGradient(cx, brainY, 15, cx, brainY, auraRadius)
      auraGrad.addColorStop(0, `rgba(245, 158, 11, ${0.16 * auraBreath})`)
      auraGrad.addColorStop(0.4, `rgba(217, 119, 6, ${0.08 * auraBreath})`)
      auraGrad.addColorStop(0.75, `rgba(56, 189, 248, ${0.04 * auraBreath})`)
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.beginPath()
      ctx.arc(cx, brainY, auraRadius, 0, Math.PI * 2)
      ctx.fillStyle = auraGrad
      ctx.fill()



      // Decay brain pulse
      brainPulse *= 0.94

      // ── 4. Inflowing Stars & Absorption Physics ──
      const remainingStars = []
      inflowingStars.forEach((star) => {
        const progress = Math.min(1, (now - star.startTime) / star.duration)
        // Easing: gradual start, accelerates gently into the gravitational core
        const t = progress * progress * (3 - 2 * progress)

        // Quadratic bezier position
        const invT = 1 - t
        const curX = invT * invT * star.startX + 2 * invT * t * star.cpX + t * t * star.targetX
        const curY = invT * invT * star.startY + 2 * invT * t * star.cpY + t * t * star.targetY

        // Track trail
        star.trail.push({ x: curX, y: curY, time: now })
        if (star.trail.length > 10) star.trail.shift()

        // Draw stardust comet trail
        if (star.trail.length > 1) {
          ctx.beginPath()
          ctx.moveTo(star.trail[0].x, star.trail[0].y)
          for (let i = 1; i < star.trail.length; i++) {
            ctx.lineTo(star.trail[i].x, star.trail[i].y)
          }
          ctx.strokeStyle = star.hue === 'gold' ? 'rgba(251, 191, 36, 0.45)' : 'rgba(245, 158, 11, 0.35)'
          ctx.lineWidth = star.radius * 0.8
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()
        }

        // Draw Star Glow & Core
        const starGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, star.radius * 3.5)
        starGrad.addColorStop(0, '#ffffff')
        starGrad.addColorStop(0.35, star.hue === 'gold' ? '#fde047' : '#f59e0b')
        starGrad.addColorStop(1, 'rgba(245, 158, 11, 0)')

        ctx.beginPath()
        ctx.arc(curX, curY, star.radius * 3.5, 0, Math.PI * 2)
        ctx.fillStyle = starGrad
        ctx.fill()

        // Bright white pin-core
        ctx.beginPath()
        ctx.arc(curX, curY, star.radius * 0.7, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()

        // Check for Absorption: reached destination
        if (progress >= 1) {
          // Trigger absorption event at target
          brainPulse = Math.min(1.0, brainPulse + 0.38)
          // Add expanding absorption ripple
          absorptionRipples.push({
            x: star.targetX,
            y: star.targetY,
            startTime: now,
            duration: 650,
            maxRadius: 26 + Math.random() * 12,
            color: star.hue === 'gold' ? '251, 191, 36' : '245, 158, 11',
          })
        } else {
          remainingStars.push(star)
        }
      })
      inflowingStars = remainingStars

      // ── 5. Absorption Ripples & Synaptic Spark Bursts ──
      const remainingRipples = []
      absorptionRipples.forEach((ripple) => {
        const rProgress = (now - ripple.startTime) / ripple.duration
        if (rProgress < 1) {
          const currentRadius = ripple.maxRadius * Math.sin(rProgress * Math.PI * 0.5)
          const rippleAlpha = (1 - rProgress) * 0.75

          // Expanding wave ring
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, currentRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${ripple.color}, ${rippleAlpha})`
          ctx.lineWidth = 1.4 * (1 - rProgress * 0.6)
          ctx.stroke()

          // Central energy burst point
          if (rProgress < 0.45) {
            const flareAlpha = (1 - rProgress / 0.45) * 0.8
            ctx.beginPath()
            ctx.arc(ripple.x, ripple.y, 4 * (1 - rProgress), 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${flareAlpha})`
            ctx.fill()
          }

          remainingRipples.push(ripple)
        }
      })
      absorptionRipples = remainingRipples

      ctx.restore()
      if (!reduced) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      running = false
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="pentagon-cosmos-container relative w-full h-full min-h-[16rem] flex flex-col justify-between overflow-hidden rounded-md bg-[#070405]" aria-label="Pentagon Neural Universe: Stars in cosmic orbit drawn and absorbed by the central neural intelligence engine">
      {/* Top HUD Telemetry */}
      <div className="relative z-10 flex items-center justify-between px-3 pt-2 font-mono text-[.58rem] sm:text-[.62rem] uppercase tracking-[.12em] text-white/55">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          Neural cosmos · byok
        </span>
        <span className="text-red-400/85">LangGraph state</span>
      </div>

      {/* Main Interactive Cosmic Canvas & Customized 3D Sketchfab Brain */}
      <div className="relative flex-1 w-full min-h-[14rem] sm:min-h-[18rem] flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />
        <div className="sketchfab-brain-wrapper absolute inset-0 flex items-center justify-center z-10">
          <iframe
            title="Plastinated Human Brain 3D Model"
            className="sketchfab-brain-iframe w-full h-full border-0"
            src="https://sketchfab.com/models/2df234ff65b0483fb5b5e15e40efa65d/embed?autostart=1&autospin=0.2&transparent=1&ui_theme=dark&ui_infos=0&ui_controls=1&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_annotations=0&ui_hint=0&scrollwheel=0&dnt=1&annotations_visible=0&annotation_tooltip_visible=0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            loading="lazy"
          />
          {/* Soft cosmic vignette to seamlessly blend edges into dark background */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(7,4,5,0.45)_62%,rgba(7,4,5,0.85)_82%,#070405_100%)]" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom HUD Telemetry */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 px-3 py-2 font-mono text-[.58rem] sm:text-[.62rem] uppercase tracking-[.08em] text-white/60">
        <span>ChromaDB · CPU Fallback</span>
        <span className="text-white/80">80+ NIM models</span>
      </div>
    </div>
  )
}
