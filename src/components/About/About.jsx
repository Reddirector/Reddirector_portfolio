import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  PROFILE_IMAGE, AVAILABILITY, NAME, ROLE, HEADLINE, LINKS,
  STORY, SKILLS, ACHIEVEMENTS, EDUCATION,
} from '../../data/about'
import Reveal from './Reveal'
import AboutTabs from './AboutTabs'
import './about.css'

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Count-up for numeric stat cells. Screen readers get the final value immediately
// via a visually hidden span; the animated digits are aria-hidden.
function CountUp({ value }) {
  const host = useRef(null)
  const [display, setDisplay] = useState(() => (reduce() ? value : 0))
  useEffect(() => {
    const node = host.current
    if (!node || reduce() || typeof IntersectionObserver === 'undefined') return undefined
    let frame
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 900)
        setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: .3 })
    observer.observe(node)
    return () => { observer.disconnect(); if (frame) cancelAnimationFrame(frame) }
  }, [value])
  return (
    <span ref={host} className="about-stat-value">
      <span aria-hidden="true">{display.toLocaleString('en-US')}</span>
      <span className="sr-only">{value.toLocaleString('en-US')}</span>
    </span>
  )
}

// Shared timeline: line draws top-to-bottom, nodes fade in staggered (CSS only).
// With more than TIMELINE_VISIBLE items the list is clipped to a 3-item viewport
// that glides to the next item every TIMELINE_STEP_MS — pausing on hover/focus,
// and disabled for reduced motion (full static list instead, nothing hidden).
const TIMELINE_VISIBLE = 3
const TIMELINE_STEP_MS = 3400

function Timeline({ items }) {
  const paginated = items.length > TIMELINE_VISIBLE && !reduce()
  const itemRefs = useRef([])
  const [geometry, setGeometry] = useState(null)
  const [index, setIndex] = useState(0) // 0..items.length; items.length shows the clones
  const [instant, setInstant] = useState(false)
  const [paused, setPaused] = useState(false)

  // Measure every node (real items + the clones) and the height of the first three
  // items, so the viewport always shows exactly three full entries.
  const measure = useCallback(() => {
    if (!paginated) return
    const nodes = itemRefs.current
    const count = items.length + TIMELINE_VISIBLE
    if (!nodes[count - 1]) return
    const offsets = nodes.slice(0, count).map((node) => node.offsetTop)
    const height = nodes.slice(0, TIMELINE_VISIBLE).reduce((total, node) => total + node.offsetHeight, 0)
    setGeometry((current) => (current && current.height === height && current.offsets.join() === offsets.join() ? current : { offsets, height }))
  }, [items.length, paginated])

  useLayoutEffect(() => {
    measure()
    if (!paginated || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    if (itemRefs.current[0]) observer.observe(itemRefs.current[0])
    return () => observer.disconnect()
  }, [measure, paginated])

  // Gate the loop: run only while the timeline is actually on screen.
  const rootRef = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = rootRef.current
    if (!node || typeof IntersectionObserver === 'undefined') { setVisible(true); return undefined }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Seamless loop: when the viewport has glided fully over the clones (a visual copy
  // of the first items), snap back to the real top without a transition — the motion
  // only ever travels downward.
  useEffect(() => {
    if (!paginated || paused || index !== items.length) return undefined
    const timer = setTimeout(() => {
      setInstant(true)
      setIndex(0)
    }, 1000) // just after the 0.9s glide into the clones finishes
    return () => clearTimeout(timer)
  }, [index, items.length, paginated, paused])

  useEffect(() => {
    if (!instant) return undefined
    // Re-enable transitions one frame after the invisible snap has painted.
    let raf2
    const raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setInstant(false)) })
    return () => { cancelAnimationFrame(raf1); if (raf2) cancelAnimationFrame(raf2) }
  }, [instant])

  // Slow auto-advance, one item per step, always moving down. A timeout keyed on
  // the index (not an interval) so a manual click from the cue button restarts
  // the full cadence instead of stacking a second step right after it.
  useEffect(() => {
    if (!paginated || paused || !visible || index >= items.length) return undefined
    const timer = setTimeout(() => setIndex((current) => current + 1), TIMELINE_STEP_MS)
    return () => clearTimeout(timer)
  }, [index, items.length, paginated, paused, visible])

  // Manual step from the cue button. If the track is on the clones (pre-snap),
  // jump to the real top instantly, mirroring the auto loop.
  const advance = () => {
    if (index >= items.length) {
      setInstant(true)
      setIndex(0)
      return
    }
    setIndex(index + 1)
  }

  const list = (
    <ol
      className={`about-timeline${paginated ? ' about-timeline--glide' : ''}`}
      style={paginated && geometry ? {
        transform: `translateY(-${geometry.offsets[index] || 0}px)`,
        transition: instant ? 'none' : 'transform 0.9s var(--about-ease)',
      } : undefined}
    >
      <span className="about-timeline-line" aria-hidden="true" />
      {items.map((item, itemIndex) => (
        <li className="about-timeline-item" style={{ '--i': itemIndex }} key={item.title} ref={(node) => { itemRefs.current[itemIndex] = node }}>
          <i className="about-timeline-dot" aria-hidden="true" />
          <div>
            <p className="about-timeline-title">{item.title}</p>
            <p className="about-timeline-detail">{item.detail}</p>
            {item.date && <p className="about-timeline-date">{item.date}</p>}
          </div>
        </li>
      ))}
      {paginated && items.slice(0, TIMELINE_VISIBLE).map((item, cloneIndex) => (
        <li className="about-timeline-item about-timeline-item--clone" aria-hidden="true" key={`${item.title}-clone`} ref={(node) => { itemRefs.current[items.length + cloneIndex] = node }}>
          <i className="about-timeline-dot" aria-hidden="true" />
          <div>
            <p className="about-timeline-title">{item.title}</p>
            <p className="about-timeline-detail">{item.detail}</p>
            {item.date && <p className="about-timeline-date">{item.date}</p>}
          </div>
        </li>
      ))}
    </ol>
  )

  if (!paginated) return list

  return (
    <div
      ref={rootRef}
      className="about-timeline-viewport"
      style={{ height: geometry ? `${geometry.height}px` : undefined }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {list}
      {paginated && <button type="button" className="about-timeline-cue" onClick={advance} aria-label="Show next entries" title="Show next entries"><span aria-hidden="true">↓</span></button>}
    </div>
  )
}

function StoryPanel() {
  return (
    <div>
      <p className="about-lead">{STORY.lead}</p>
      <p className="about-body">{STORY.body}</p>
      <div className="about-stats">
        {STORY.stats.map((stat) => (
          <div className="about-stat" key={stat.label}>
            <p className="about-stat-number">
              {typeof stat.value === 'number' ? <CountUp value={stat.value} /> : stat.value}
            </p>
            <p className="about-stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
      <p className="about-footnote">{STORY.note}</p>
    </div>
  )
}

function SkillsPanel() {
  return (
    <div className="about-skills">
      {SKILLS.map((group) => (
        <article className="about-skill-card" key={group.area}>
          <p className="about-skill-label">{group.area}</p>
          <ul className="about-chips">
            {group.items.map((item, index) => (
              <li className="about-chip" style={{ '--i': index }} key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

export default function About() {
  const [selected, setSelected] = useState(0)   // selected tab (updates instantly)
  const [shown, setShown] = useState(0)         // panel content currently mounted
  const [phase, setPhase] = useState('in')      // 'in' | 'out'
  const direction = useRef(1)
  const swapTimer = useRef(null)
  const panelBody = useRef(null)
  const [panelHeight, setPanelHeight] = useState(null)

  useEffect(() => () => clearTimeout(swapTimer.current), [])

  // Keep the wrapper's height in sync with the mounted panel so switching tabs
  // never jolts the page. Only the height property animates, per spec.
  useLayoutEffect(() => {
    const node = panelBody.current
    if (!node) return undefined
    const update = () => setPanelHeight(node.offsetHeight)
    update()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [shown])

  const select = (next) => {
    if (next === selected || phase === 'out') return
    direction.current = next > selected ? 1 : -1
    setSelected(next)
    if (reduce()) { setShown(next); setPhase('in'); return }
    setPhase('out')
    clearTimeout(swapTimer.current)
    swapTimer.current = setTimeout(() => {
      setShown(next)
      setPhase('in')
    }, 120)
  }

  // Portrait tilt: pointer-fine devices only, max 6deg, eased, off for reduced motion.
  const tiltRef = useRef(null)
  useEffect(() => {
    const node = tiltRef.current
    if (!node || reduce() || !window.matchMedia('(pointer: fine)').matches) return undefined
    const onMove = (event) => {
      const rect = node.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - .5
      const y = (event.clientY - rect.top) / rect.height - .5
      node.style.setProperty('--about-tilt-x', `${(-y * 12).toFixed(2)}deg`)
      node.style.setProperty('--about-tilt-y', `${(x * 12).toFixed(2)}deg`)
    }
    const onLeave = () => {
      node.style.setProperty('--about-tilt-x', '0deg')
      node.style.setProperty('--about-tilt-y', '0deg')
    }
    window.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', onLeave)
    return () => { window.removeEventListener('pointermove', onMove); node.removeEventListener('pointerleave', onLeave) }
  }, [])

  const currentTabId = ['story', 'skills', 'achievements', 'education'][shown]

  return (
    <section id="about" className="about-section">
      <Reveal className="about-shell">
        <header className="about-header">
          <p className="section-label">03 / About</p>
          <p className="about-header-note">Builder & researcher <span aria-hidden="true">↘</span></p>
        </header>

        <div className="about-grid">
          {/* LEFT — identity card, sticky on desktop */}
          <aside className="about-identity">
            <div className="about-identity-card">
              <div ref={tiltRef} className="about-portrait-tilt">
                <div className="about-portrait-wrap">
                  <i className="about-portrait-ring" aria-hidden="true" />
                  <i className="about-portrait-orbit" aria-hidden="true"><i className="about-portrait-orbit-dot" /></i>
                  {PROFILE_IMAGE
                    ? <img className="about-portrait" src={PROFILE_IMAGE} alt="Aditya Kumar Singh" width="300" height="300" loading="eager" />
                    : <div className="about-portrait about-portrait--placeholder" role="img" aria-label="Portrait placeholder: AKS"><span>AKS</span></div>}
                </div>
              </div>
              <p className="about-name">{NAME}</p>
              <p className="about-role">{ROLE}</p>
              {AVAILABILITY && (
                <p className="about-status">
                  <i className="about-status-dot" aria-hidden="true" />
                  {AVAILABILITY}
                </p>
              )}
              <div className="about-links">
                {LINKS.map((link) => (
                  <a className="about-link link-line" href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                    <span className="about-link-glyph" aria-hidden="true">{link.glyph}</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT — headline, tabs, panels */}
          <div className="about-content">
            <p className="section-label">About</p>
            <h2 className="about-headline">
              Systems first,<br /><span className="about-headline-soft">then the models.</span>
            </h2>

            <AboutTabs active={selected} onChange={select} />

            <div
              className={`about-panel is-${phase}`}
              style={{ height: panelHeight === null ? 'auto' : `${panelHeight}px`, '--about-dir': direction.current }}
              onTransitionEnd={(event) => { if (event.propertyName === 'height') setPanelHeight(null) }}
            >
              <div className="about-panel-clip">
                {/* key=shown remounts on swap so the enter animation and stagger replay */}
                <div ref={panelBody} className="about-panel-inner" key={shown} id={`about-panel-${currentTabId}`} role="tabpanel" aria-labelledby={`about-tab-${currentTabId}`} tabIndex={0}>
                  {shown === 0 && <StoryPanel />}
                  {shown === 1 && <SkillsPanel />}
                  {shown === 2 && <Timeline items={ACHIEVEMENTS} />}
                  {shown === 3 && <Timeline items={EDUCATION} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
