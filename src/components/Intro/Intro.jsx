import { useEffect, useLayoutEffect, useRef } from 'react'
import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from './wordmark'
import './intro.css'

// ── Editable text ────────────────────────────────────────────────────────────
const WORDMARK = 'REDDIRECTOR' // must match the letters in wordmark.js (11 paths)
const SUBLINE = 'ADITYA KUMAR SINGH' // set to null to disable

// ── Timeline: every duration/easing lives here so the choreography is tunable.
// Draw-on ≈ 4.8s, then a full 3s hold on the completed wordmark before the
// site opens (owner spec). Total ≈ 9.5s.
const T = {
  hold: 450,          // stillness before letters begin
  draw: 1100,         // per-letter stroke draw
  stagger: 160,       // per-letter offset, left to right
  fill: 900,          // per-letter fill fade (starts as each stroke finishes)
  rule: 700,          // hairline rule under the wordmark
  subline: 500,       // subline fade-up
  holdWordmark: 3000, // completed wordmark waits 3s before the site opens
  exit: 1000,         // overlay curtain lift (clip-path)
  exitDelay: 150,     // curtain starts after the wordmark begins leaving
  pageRise: 700,      // page content rise + fade
  pageStagger: 80,    // top-to-bottom block stagger (max 4 blocks)
  cleanup: 250,       // final overlay fade before unmount
  skipFade: 150,      // skip path fade
  cap: 11000,         // hard force-finish cap (must exceed the full sequence)
  fontsWait: 800,     // max wait for document.fonts.ready
}

const EASE = {
  draw: 'cubic-bezier(0.65, 0, 0.35, 1)',
  exit: 'cubic-bezier(0.7, 0, 0.2, 1)',
  out: 'cubic-bezier(0.2, 0.75, 0.25, 1)',
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
        // Wait for the display font (cap 800ms) — the SVG outlines are static,
        // but the subline uses live text and should not swap mid-animation.
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
        const lastStroke = T.hold + (glyphPaths.length - 1) * T.stagger + T.draw

        // Phase 3 — fills fade in as each stroke finishes; stroke thins; rule; subline.
        glyphPaths.forEach((path, index) => {
          const start = T.hold + index * T.stagger + T.draw * 0.72
          play(path, [{ fillOpacity: 0 }, { fillOpacity: 1 }], { duration: T.fill, delay: start, easing: EASE.out })
          play(path, [{ strokeWidth: 2 }, { strokeWidth: 1 }], { duration: T.fill, delay: start })
        })
        const fillEnd = lastStroke + T.fill
        await wait(fillEnd - (T.hold + (glyphPaths.length - 1) * T.stagger + T.draw * 0.72))
        if (!alive()) return
        play(rule.current, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: T.rule, easing: EASE.out })
        if (subline.current) {
          play(subline.current, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: T.subline, easing: EASE.out })
        }
        await wait(Math.max(T.rule, T.subline) + T.holdWordmark)
        if (!alive()) return

        // Phase 5 — exit: wordmark lifts, curtain lifts away, page rises beneath.
        play(svg.current, [{ transform: 'none' }, { transform: 'translateY(-24px)', opacity: 0 }], { duration: 640, easing: EASE.out })
        play(subline.current, [{ opacity: 1 }, { opacity: 0 }], { duration: 450 })
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
        await wait(T.exit + 60)
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
