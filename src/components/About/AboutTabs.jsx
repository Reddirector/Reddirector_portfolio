import { useCallback, useEffect, useRef, useState } from 'react'
import { TABS } from '../../data/about'

// Segmented tab bar with one sliding indicator. The indicator is a single absolutely
// positioned element moved with transform + width — no per-tab re-measure loops.
// Roving tabindex; ArrowLeft/Right/Home/End move focus and selection together.
export default function AboutTabs({ active, onChange }) {
  const tabRefs = useRef([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const measure = useCallback(() => {
    const node = tabRefs.current[active]
    if (!node) return
    setIndicator({ left: node.offsetLeft, width: node.offsetWidth })
  }, [active])

  useEffect(() => {
    measure()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    if (tabRefs.current[0]?.parentElement) observer.observe(tabRefs.current[0].parentElement)
    return () => observer.disconnect()
  }, [measure])

  const onKeyDown = (event) => {
    const last = TABS.length - 1
    let next = null
    if (event.key === 'ArrowRight') next = active === last ? 0 : active + 1
    else if (event.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next === null) return
    event.preventDefault()
    onChange(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="about-tabbar" role="tablist" aria-label="About details">
      {TABS.map((tab, index) => (
        <button
          key={tab.id}
          ref={(node) => { tabRefs.current[index] = node }}
          type="button"
          role="tab"
          id={`about-tab-${tab.id}`}
          aria-selected={active === index}
          aria-controls={`about-panel-${tab.id}`}
          tabIndex={active === index ? 0 : -1}
          className={`about-tab${active === index ? ' is-active' : ''}`}
          onClick={() => onChange(index)}
        >
          {tab.label}
        </button>
      ))}
      <span className="about-tab-indicator" aria-hidden="true" style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }} />
    </div>
  )
}
