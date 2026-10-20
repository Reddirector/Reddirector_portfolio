import { useEffect, useLayoutEffect, useRef } from 'react'
import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from './wordmark'
import './intro.css'

// ── Editable text ────────────────────────────────────────────────────────────
const WORDMARK = 'REDDIRECTOR' // must match the letters in wordmark.js (11 paths)
const SUBLINE = 'ADITYA KUMAR SINGH' // set to null to disable

// ── Timeline: tuned for a slow, calm, cinematic entrance.
// Sequence runs at a graceful, unhurried pace (~4.6s total) with smooth
// stroke draw, gentle ink-bloom fill, center rule expansion, and curtain lift.
const T = {
  hold: 240,          // calm stillness before letters begin drawing
  draw: 950,          // per-letter stroke draw (deliberate, steady tracing)
  stagger: 110,       // per-letter offset, left to right (calm, rhythmic cadence)
  fill: 650,          // per-letter fill bloom (soft, organic dissolve into white)
  fillStartRatio: 0.55,// start fill when letter outline is 55% drawn
  rule: 520,          // hairline rule under the wordmark
  subline: 450,       // subline fade-up
  holdWordmark: 1200, // completed wordmark hold before exit
  exit: 700,          // overlay curtain lift (clip-path)
  exitDelay: 140,     // curtain starts after the wordmark begins lifting
  pageRise: 600,      // page content rise + fade
  pageStagger: 70,    // top-to-bottom block stagger (max 4 blocks)
  cleanup: 200,       // final overlay fade before unmount
  skipFade: 150,      // skip path fade
  cap: 8500,          // hard force-finish cap
  fontsWait: 600,     // max wait for document.fonts.ready
}

const EASE = {
  draw: 'cubic-bezier(0.4, 0, 0.2, 1)',  // calm, organic ease-in-out
  fill: 'cubic-bezier(0.25, 1, 0.5, 1)',  // soft, smooth bloom settle
  exit: 'cubic-bezier(0.7, 0, 0.2, 1)',
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',
}

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// How many letters exist in the generated paths (defensive: WORDMARK must match).
const letters = WORDMARK_PATHS

export default function Intro({ active, onDone, contentRef }) {
  const overlay = useRef(null)
  const svg = useRef(null)
  const rule = useRef(null)
  const subline = useRef(null)
  const finished = useRef(false)
  const disposed = useRef(false)
  const anims = useRef([])

  // Pre-paint: hide the page beneath the overlay before the first paint so
  // nothing can flash into view before the intro covers it.
  useLayoutEffect(() => {
    if (!active) return undefined
    disposed.current = false
    finished.current = false
    anims.current = []
    const root = document.querySelector('.portfolio-root')
    const content = contentRef?.current
    if (!letters.length) return undefined // no paths -> let the effect skip silently
    if (!reduceMotion()) {
      if (content) { content.style.opacity = '0'; content.style.willChange = 'transform, opacity' }
      if (root) { root.style.clipPath = 'inset(0 0 0 0)'; root.dataset.intro = 'pending' }
    }
    return undefined
  }, [active, contentRef])

  useEffect(() => {
    if (!active) return undefined
    if (!letters.length) { onDone(); return undefined } // fallback: no SVG data, skip silently
    const root = document.querySelector('.portfolio-root')
    const content = contentRef?.current
    const reduced = reduceMotion()
    const track = (animation) => { if (animation) anims.current.push(animation); return animation }
    const play = (element, keyframes, options = {}) => {
      if (!element?.animate) return Promise.resolve()
      const animation = track(element.animate(keyframes, { fill: 'forwards', easing: EASE.out, ...options }))
      return animation.finished.catch(() => {})
    }

    const finish = () => {
      if (finished.current) return
      finished.current = true
      clearTimeout(timer)
      listeners.forEach(([type, handler]) => window.removeEventListener(type, handler))
      anims.current.forEach((animation) => { try { animation.cancel() } catch { /* gone */ } })
      anims.current = []
      if (root) { root.style.clipPath = ''; root.style.opacity = ''; delete root.dataset.intro }
      if (content) { content.style.opacity = ''; content.style.transform = ''; content.style.willChange = '' }
      onDone()
    }

    // Skip: click, Escape, or any key — 150ms fade, then hand off.
    const finishSoon = () => {
      if (finished.current) return
      if (overlay.current?.animate && !reduced) {
        overlay.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T.skipFade, fill: 'forwards' })
          .finished.catch(() => {}).then(finish)
      } else finish()
    }
    const timer = setTimeout(finish, T.cap)
    const listeners = [['pointerdown', finishSoon], ['keydown', finishSoon]]
    listeners.forEach(([type, handler]) => window.addEventListener(type, handler))

    // Reduced motion: filled wordmark with a simple 200ms fade in and out.
    if (reduced || typeof overlay.current?.animate !== 'function') {
      if (root) { root.style.clipPath = ''; delete root.dataset.intro }
      if (content) track(content.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'forwards' }))
      const sequence = async () => {
        if (overlay.current && !reduced) await play(overlay.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 200 })
        await wait(reduced ? 900 : 1200)
        if (!finished.current && !disposed.current) finishSoon()
      }
      sequence()
      return () => { disposed.current = true; clearTimeout(timer); listeners.forEach(([type, handler]) => window.removeEventListener(type, handler)) }
    }

    const alive = () => !finished.current && !disposed.current
    const glyphPaths = svg.current?.querySelectorAll('path') || []
    const blocks = content?.querySelectorAll('.site-header, #top .hero-name, #top .hero-intro, #top .hero-scroll-cue') || []
    const run = async () => {
      try {
        // Wait for fonts (cap 600ms)
        await Promise.race([document.fonts?.ready, wait(T.fontsWait)])
        if (!alive()) return

        // Phase 1+2 — stroke in, left to right.
        await wait(T.hold)
        if (!alive()) return
        glyphPaths.forEach((path, index) => {
          path.animate(
            [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
            { duration: T.draw, delay: index * T.stagger, fill: 'forwards', easing: EASE.draw },
          )
        })

        // Phase 3 — fills bloom smoothly as each stroke takes shape; stroke thins cleanly.
        glyphPaths.forEach((path, index) => {
          const start = index * T.stagger + T.draw * T.fillStartRatio
          play(path, [{ fillOpacity: 0 }, { fillOpacity: 1 }], { duration: T.fill, delay: start, easing: EASE.fill })
          play(path, [{ strokeWidth: 2 }, { strokeWidth: 1 }], { duration: T.fill, delay: start, easing: EASE.fill })
        })

        const totalLetterTime = (glyphPaths.length - 1) * T.stagger + T.draw * T.fillStartRatio + T.fill
        await wait(totalLetterTime)
        if (!alive()) return

        // Phase 4 — hairline rule and subline smoothly emerge.
        play(rule.current, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: T.rule, easing: EASE.out })
        if (subline.current) {
          play(subline.current, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: T.subline, easing: EASE.out })
        }
        await wait(Math.max(T.rule, T.subline) + T.holdWordmark)
        if (!alive()) return

        // Phase 5 — exit: wordmark lifts, rule & subline fade, curtain lifts away, page rises beneath.
        play(svg.current, [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-20px)', opacity: 0 }], { duration: 520, easing: EASE.out })
        if (rule.current) play(rule.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 320 })
        if (subline.current) play(subline.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 350 })
        await wait(T.exitDelay)
        if (!alive()) return

        play(root, [{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: T.exit, easing: EASE.exit })
        blocks.forEach((block, index) => {
          if (index > 3) return
          play(block, [
            { opacity: 0, transform: 'translateY(12px)' },
            { opacity: 1, transform: 'none' },
          ], { duration: T.pageRise, delay: index * T.pageStagger, easing: EASE.out })
        })
        if (content) content.style.willChange = ''
        await wait(T.exit + 50)
        if (!alive()) return

        // Phase 6 — cleanup.
        finish()
      } catch {
        finish()
      }
    }
    run()

    return () => {
      disposed.current = true
      clearTimeout(timer)
      listeners.forEach(([type, handler]) => window.removeEventListener(type, handler))
    }
  }, [active, onDone, contentRef])

  if (!active) return null
  return (
    <div ref={overlay} className="intro-overlay" role="presentation" aria-hidden="true">
      <span className="sr-only" aria-live="polite" />
      <div className="intro-stage">
        <svg ref={svg} className="intro-wordmark" viewBox={WORDMARK_VIEWBOX} aria-hidden="true" focusable="false">
          {letters.map((letter, index) => (
            <path
              key={`${letter.char}-${index}`}
              d={letter.d}
              pathLength="1"
              className="intro-letter"
              style={{ '--letter-index': index }}
            />
          ))}
        </svg>
        <i ref={rule} className="intro-rule" aria-hidden="true" />
        {SUBLINE && <p ref={subline} className="intro-subline">{SUBLINE}</p>}
      </div>
      <span className="intro-skip-cue" aria-hidden="true">Press any key to skip</span>
    </div>
  )
}

