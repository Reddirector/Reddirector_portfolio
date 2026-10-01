import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  PROFILE_IMAGE, AVAILABILITY, NAME, ROLE, HEADLINE,
  STORY, SKILLS, SKILL_FILTERS, SKILLS_CAPTION, ACHIEVEMENTS, EDUCATION,
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

// One tooltip at a time, rendered through a portal into document.body (skill
// cards clip overflow). Fixed coordinates from the anchor chip's rect: above
// the chip by default, flipped below near the top edge, clamped inside the
// viewport and never covering the filter toolbar. Repositions on scroll/resize.
const TIP_GAP = 8
const TIP_MARGIN = 12

function SkillTip({ tip, toolbarEl, tipId, instant }) {
  const node = useRef(null)
  const [pos, setPos] = useState(null)
  const update = useCallback(() => {
    const el = node.current
    const chip = tip.anchor
    if (!el || !chip || !chip.isConnected) return
    const r = chip.getBoundingClientRect()
    const t = el.getBoundingClientRect()
    const minTop = Math.max(TIP_MARGIN, (toolbarEl ? toolbarEl.getBoundingClientRect().bottom : 0) + 4)
    let x = r.left + r.width / 2 - t.width / 2
    x = Math.min(Math.max(TIP_MARGIN, x), window.innerWidth - TIP_MARGIN - t.width)
    const aboveY = r.top - t.height - TIP_GAP
    const below = aboveY < minTop
    let y = below ? r.bottom + TIP_GAP : aboveY
    if (y + t.height > window.innerHeight - TIP_MARGIN) y = window.innerHeight - TIP_MARGIN - t.height
    y = Math.max(minTop, y)
    const arrowX = Math.min(Math.max(r.left + r.width / 2 - x, 12), t.width - 12)
    setPos((current) => (current && Math.abs(current.x - x) < .5 && Math.abs(current.y - y) < .5 && current.below === below && Math.abs(current.arrowX - arrowX) < .5 ? current : { x, y, below, arrowX }))
  }, [tip, toolbarEl])
  useLayoutEffect(() => {
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true) }
  }, [update])
  return createPortal(
    <div
      ref={node}
      id={tipId}
      role="tooltip"
      className={`about-skill-tip${pos?.below ? ' is-below' : ''}${instant ? ' is-instant' : ''}`}
      style={{ left: pos ? `${pos.x}px` : '-9999px', top: pos ? `${pos.y}px` : '-9999px', '--tip-arrow-x': pos ? `${pos.arrowX}px` : '50%' }}
    >
      {[['Learned', tip.fields.learned], ['Why', tip.fields.why], ['Can do', tip.fields.can]]
        .filter(([, value]) => value)
        .map(([label, value]) => (
          <p className="about-skill-tip-line" key={label}>
            <span className="about-skill-tip-label">{label}</span>
            {value}
          </p>
        ))}
    </div>,
    document.body,
  )
}

function SkillsPanel() {
  // Tier filter: 'All' | 'Built with' | 'Learning'. Two-phase swap — matching
  // chips fade in after the outgoing ones fade out, then empty cards collapse
  // via the grid-template-rows 1fr -> 0fr transition on their cell wrapper.
  const [filter, setFilter] = useState('All')
  const [pending, setPending] = useState(null)
  const [hiddenCells, setHiddenCells] = useState(() => new Set())
  const swapTimer = useRef(null)
  const hideTimer = useRef(null)
  const filterRefs = useRef([])
  useEffect(() => () => { clearTimeout(swapTimer.current); clearTimeout(hideTimer.current) }, [])

  // Chip tooltips: one open at a time, owned here so tab switches unmount it.
  // openTimer gives the 120ms open delay; 'instant' skips the delay for taps.
  const [tip, setTip] = useState(null)
  const [tipInstant, setTipInstant] = useState(false)
  const openTimer = useRef(null)
  const toolbarRef = useRef(null)
  const coarsePointer = () => window.matchMedia('(pointer: coarse)').matches
  const closeTip = useCallback(() => { clearTimeout(openTimer.current); setTip(null); setTipInstant(false) }, [])
  const openTip = (item, anchor, instant = false) => {
    clearTimeout(openTimer.current)
    setTipInstant(instant)
    if (instant || reduce()) setTip({ anchor, fields: item })
    else openTimer.current = setTimeout(() => setTip({ anchor, fields: item }), 120)
  }
  useEffect(() => () => clearTimeout(openTimer.current), [])
  // A filter change hides chips — drop any open tooltip at the same moment.
  useEffect(() => { closeTip() }, [filter, closeTip])
  // Tap elsewhere (or Escape) dismisses; taps toggle via isTipOpen below.
  useEffect(() => {
    if (!tip) return undefined
    const onKey = (event) => { if (event.key === 'Escape') closeTip() }
    const onDown = (event) => { if (!tip.anchor.contains(event.target) && !event.target.closest?.('.about-skill-tip')) closeTip() }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown, true)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown, true) }
  }, [tip, closeTip])

  const tierOf = (name) => (name === 'Built with' ? 'built' : 'learning')
  const matches = (item, f) => f === 'All' || item.tier === tierOf(f)
  const collapsedTitles = (f) => SKILLS.filter((group) => group.items.every((item) => !matches(item, f))).map((group) => group.title)
  const selectFilter = (next) => {
    if (next === filter || pending !== null) return
    if (reduce()) {
      setFilter(next)
      setHiddenCells(new Set(collapsedTitles(next)))
      return
    }
    setPending(next)
    clearTimeout(swapTimer.current)
    clearTimeout(hideTimer.current)
    swapTimer.current = setTimeout(() => {
      const collapsed = new Set(collapsedTitles(next))
      setFilter(next)
      setPending(null)
      // Keep still-collapsed cells hidden (no flash), release expanding ones now.
      setHiddenCells((current) => new Set([...current].filter((title) => collapsed.has(title))))
      // After the 0fr collapse transition finishes, remove the cell from the grid
      // flow so the row reflows without leaving an empty track (grey block).
      hideTimer.current = setTimeout(() => setHiddenCells(collapsed), 520)
    }, 180)
  }
  const onFilterKey = (event, index) => {
    const last = SKILL_FILTERS.length - 1
    let next = null
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next === null) return
    event.preventDefault()
    selectFilter(SKILL_FILTERS[next])
    filterRefs.current[next]?.focus()
  }

  // Spotlight: track the pointer inside each card (pointer-fine devices only);
  // the tint itself is a CSS radial gradient at --mx/--my.
  const spotlight = (event) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${(event.clientX - rect.left).toFixed(0)}px`)
    event.currentTarget.style.setProperty('--my', `${(event.clientY - rect.top).toFixed(0)}px`)
  }

  return (
    <div>
      <div className="about-skill-toolbar" ref={toolbarRef}>
        <p className="about-skill-caption">{SKILLS_CAPTION}</p>
        <div className="about-skill-filter" role="radiogroup" aria-label="Filter skills by tier">
          {SKILL_FILTERS.map((name, index) => (
            <button
              key={name}
              ref={(node) => { filterRefs.current[index] = node }}
              type="button"
              role="radio"
              aria-checked={filter === name}
              tabIndex={filter === name ? 0 : -1}
              className={`about-skill-filter-btn${filter === name ? ' is-active' : ''}`}
              onClick={() => selectFilter(name)}
              onKeyDown={(event) => onFilterKey(event, index)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div className="about-skills">
        {SKILLS.map((group, groupIndex) => {
          const collapsed = pending === null && group.items.every((item) => !matches(item, filter))
          const hidden = hiddenCells.has(group.title)
          return (
            <div
              className={`about-skill-cell${collapsed ? ' is-collapsed' : ''}${hidden ? ' is-hidden' : ''}`}
              style={{ '--c': groupIndex }}
              key={group.title}
            >
              <article className="about-skill-card" onPointerMove={spotlight} inert={collapsed || undefined}>
                <p className="about-skill-title">{group.title}</p>
                <ul className="about-chips">
                  {group.items.map((item, itemIndex) => {
                    if (!matches(item, filter)) return null
                    const leaving = pending !== null && !matches(item, pending)
                    const chipClass = `about-chip${item.tier === 'learning' ? ' about-chip--learning' : ''}`
                    const tipKey = `${group.title}-${item.name}`
                    const isTipOpen = tip !== null && tip.fields === item
                    const open = (event, instant = false) => openTip(item, event.currentTarget, instant)
                    return (
                      <li className={`about-chip-item${leaving ? ' is-leaving' : ''}`} style={{ '--i': itemIndex }} key={tipKey}>
                        <span
                          className={chipClass}
                          tabIndex={0}
                          aria-describedby={isTipOpen ? 'about-skill-tip' : undefined}
                          onMouseEnter={(event) => { if (!coarsePointer()) open(event) }}
                          onMouseLeave={() => { if (!coarsePointer()) closeTip() }}
                          onFocus={(event) => open(event)}
                          onBlur={closeTip}
                          onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); closeTip() } }}
                          onClick={(event) => { if (coarsePointer()) { isTipOpen ? closeTip() : open(event, true) } }}
                        >
                          {item.name}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </article>
            </div>
          )
        })}
      </div>
      {tip && (
        <SkillTip tip={tip} toolbarEl={toolbarRef.current} tipId="about-skill-tip" instant={tipInstant} />
      )}
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

        {/* Row 1 — hero: identity card and headline+tabs stretch to equal height. */}
        <div className="about-grid">
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
            </div>
          </aside>

          <div className="about-content">
            <h2 className="about-headline">
              Systems first,<br /><span className="about-headline-soft">then the models.</span>
            </h2>
            <div className="about-tabs-anchor">
              <AboutTabs active={selected} onChange={select} />
            </div>
          </div>
        </div>

        {/* Row 2 — the active panel, full container width. */}
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
      </Reveal>
    </section>
  )
}
