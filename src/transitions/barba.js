import barba from '@barba/core'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Label mapping for cleaner HUD readouts
const SECTION_TITLES = {
  top: 'HERO // RED DIRECTOR',
  about: '03 // ABOUT & BACKGROUND',
  work: '01 // SELECTED WORK',
  method: '02 // METHOD & SYSTEMS',
  now: '04 // IN PROGRESS & BENCH',
  contact: '05 // CONTACT & INTEL',
}

let isTransitioning = false
let lenisInstance = null
let caseStudyHandlers = {
  open: null,
  close: null,
}

export function setBarbaLenis(lenis) {
  lenisInstance = lenis
}

export function setBarbaCaseStudyHandlers({ open, close }) {
  caseStudyHandlers.open = open
  caseStudyHandlers.close = close
}

export function getIsTransitioning() {
  return isTransitioning
}

function safeHook(name, data) {
  try {
    if (barba?.hooks?.do) {
      barba.hooks.do(name, data)
    }
  } catch (err) {
    // Non-blocking hook safety
  }
}

/**
 * Animate the transition overlay shutters IN (Leave phase)
 */
function animateShuttersIn(label = 'TRANSITION // BUFFERING', kicker = 'SYSTEM ROUTE // 0x2A') {
  if (reduceMotion()) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const overlay = document.getElementById('barba-transition-overlay')
    const shutterTop = overlay?.querySelector('.barba-shutter--top')
    const shutterBottom = overlay?.querySelector('.barba-shutter--bottom')
    const laser = overlay?.querySelector('.barba-laser')
    const hud = overlay?.querySelector('.barba-hud')
    const hudTitle = document.getElementById('barba-hud-title')
    const hudKicker = document.getElementById('barba-hud-kicker')
    const progressFill = document.getElementById('barba-progress-fill')
    const hudStatus = document.getElementById('barba-hud-status')
    const mainContent = document.querySelector('[data-barba="container"]') || document.getElementById('main')

    if (hudTitle) hudTitle.textContent = label
    if (hudKicker) hudKicker.textContent = kicker
    if (hudStatus) hudStatus.textContent = 'ROUTING: 60%'
    if (overlay) overlay.classList.add('is-active')

    // Reset initial states
    if (shutterTop) gsap.set(shutterTop, { yPercent: -100 })
    if (shutterBottom) gsap.set(shutterBottom, { yPercent: 100 })
    if (progressFill) gsap.set(progressFill, { scaleX: 0 })
    if (laser) gsap.set(laser, { scaleX: 0, opacity: 0 })
    if (hud) gsap.set(hud, { opacity: 0, scale: 0.94, y: 10 })

    const tl = gsap.timeline({
      defaults: { ease: 'power4.inOut' },
      onComplete: () => {
        resolve()
      },
    })

    tl.to(laser, { scaleX: 1, opacity: 1, duration: 0.18, ease: 'power2.out' }, 0)
      .to(shutterTop, { yPercent: 0, duration: 0.36 }, 0.02)
      .to(shutterBottom, { yPercent: 0, duration: 0.36 }, 0.02)
      .to(hud, { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: 'power3.out' }, 0.12)
      .to(progressFill, { scaleX: 0.65, duration: 0.3, ease: 'power1.inOut' }, 0.08)

    if (mainContent) {
      tl.to(mainContent, { scale: 0.985, opacity: 0.35, duration: 0.3, ease: 'power2.in' }, 0)
    }
  })
}

/**
 * Animate the transition overlay shutters OUT (Enter phase)
 */
function animateShuttersOut() {
  if (reduceMotion()) {
    const overlay = document.getElementById('barba-transition-overlay')
    if (overlay) overlay.classList.remove('is-active')
    isTransitioning = false
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const overlay = document.getElementById('barba-transition-overlay')
    const shutterTop = overlay?.querySelector('.barba-shutter--top')
    const shutterBottom = overlay?.querySelector('.barba-shutter--bottom')
    const laser = overlay?.querySelector('.barba-laser')
    const hud = overlay?.querySelector('.barba-hud')
    const progressFill = document.getElementById('barba-progress-fill')
    const hudStatus = document.getElementById('barba-hud-status')
    const mainContent = document.querySelector('[data-barba="container"]') || document.getElementById('main')

    if (hudStatus) hudStatus.textContent = 'CONFIRMED // 100%'

    const tl = gsap.timeline({
      defaults: { ease: 'power4.inOut' },
      onComplete: () => {
        if (overlay) overlay.classList.remove('is-active')
        isTransitioning = false
        ScrollTrigger.refresh()
        resolve()
      },
    })

    tl.to(progressFill, { scaleX: 1, duration: 0.14, ease: 'power2.out' }, 0)
      .to(hud, { opacity: 0, scale: 1.04, y: -8, duration: 0.16, ease: 'power2.in' }, 0.06)
      .to(shutterTop, { yPercent: -100, duration: 0.4 }, 0.14)
      .to(shutterBottom, { yPercent: 100, duration: 0.4 }, 0.14)
      .to(laser, { opacity: 0, scaleX: 0, duration: 0.22, ease: 'power2.in' }, 0.2)

    if (mainContent) {
      tl.fromTo(mainContent, { scale: 0.985, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out', clearProps: 'all' }, 0.18)
    }
  })
}

/**
 * Orchestrate transition to target section or view
 */
export async function triggerBarbaTransition(target, { type = 'section', meta = null } = {}) {
  if (isTransitioning) return
  isTransitioning = true

  const reduced = reduceMotion()

  // Format label for HUD
  let label = 'SYSTEM ROUTE'
  let kicker = 'PROTOCOL // RED DIRECTOR'

  if (type === 'section') {
    const cleanId = (target || '').replace(/^#/, '')
    label = SECTION_TITLES[cleanId] || `SECTION // ${cleanId.toUpperCase()}`
    kicker = `NAVIGATION // ${cleanId.toUpperCase()}`
  } else if (type === 'case-study-open') {
    label = `CASE FILE // ${meta?.name?.toUpperCase() || 'PROJECT'}`
    kicker = 'AUTHORIZATION // BYOK ACCESS'
  } else if (type === 'case-study-close') {
    label = 'SELECTED WORK // OVERVIEW'
    kicker = 'EXIT CASE FILE // WORKBENCH'
  }

  if (lenisInstance) {
    lenisInstance.stop()
  }

  const hookPayload = barba?.data || {
    current: { container: document.querySelector('[data-barba="container"]') },
    next: {},
  }

  safeHook('before', hookPayload)

  if (!reduced) {
    await animateShuttersIn(label, kicker)
  }

  // Between leave and enter: perform scroll or state update
  if (type === 'section' && target) {
    const el = document.querySelector(target)
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: topOffset, behavior: 'instant' })
      if (lenisInstance) {
        lenisInstance.scrollTo(el, { immediate: true })
      }
    }
    window.history.pushState(null, '', target)
  } else if (type === 'case-study-open') {
    if (caseStudyHandlers.open) {
      caseStudyHandlers.open(meta)
    }
  } else if (type === 'case-study-close') {
    if (caseStudyHandlers.close) {
      caseStudyHandlers.close()
    }
    const workEl = document.getElementById('work')
    if (workEl) {
      if (lenisInstance) {
        lenisInstance.scrollTo(workEl, { immediate: true })
      } else {
        workEl.scrollIntoView()
      }
    }
  }

  // Update Barba container namespace
  const container = document.querySelector('[data-barba="container"]')
  if (container) {
    container.setAttribute('data-barba-namespace', type === 'section' ? (target || '').replace(/^#/, '') : type)
  }

  safeHook('beforeEnter', hookPayload)

  if (!reduced) {
    await animateShuttersOut()
  } else {
    isTransitioning = false
  }

  if (lenisInstance) {
    lenisInstance.start()
  }

  safeHook('after', hookPayload)

  // Stagger reveal destination heading
  if (!reduced && type === 'section' && target) {
    const targetElement = document.querySelector(target)
    const heading = targetElement?.querySelector('h2')
    if (heading) {
      gsap.fromTo(heading, 
        { autoAlpha: 0.3, y: 16, clipPath: 'inset(0 0 15% 0)' }, 
        { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.55, ease: 'power3.out' }
      )
    }
  }
}

/**
 * Initialize Barba.js core with custom transition configurations
 */
export function initBarba() {
  if (typeof window === 'undefined') return

  try {
    // Ensure body has data-barba="wrapper"
    if (!document.body.hasAttribute('data-barba')) {
      document.body.setAttribute('data-barba', 'wrapper')
    }

    barba.init({
      timeout: 5000,
      prevent: ({ el, href }) => {
        // Prevent Barba from intercepting external links, target="_blank", or download links
        if (el?.target === '_blank' || (href && !href.startsWith(window.location.origin) && !href.startsWith('/') && !href.startsWith('#'))) {
          return true
        }
        return false
      },
      transitions: [
        {
          name: 'red-director-transition',
          async leave(data) {
            const nextHref = data.next?.url?.href || ''
            const targetSection = nextHref.includes('#') ? '#' + nextHref.split('#')[1] : '#top'
            await animateShuttersIn(SECTION_TITLES[targetSection.replace(/^#/, '')] || 'SYSTEM ROUTE')
          },
          async enter(data) {
            await animateShuttersOut()
          },
        },
      ],
    })

    // Listen to hash changes for browser back/forward buttons
    const onHashChange = () => {
      const hash = window.location.hash || '#top'
      if (!isTransitioning && document.querySelector(hash)) {
        triggerBarbaTransition(hash, { type: 'section' })
      }
    }
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('hashchange', onHashChange)
      try {
        barba.destroy()
      } catch (err) {
        console.warn('Barba destroy error:', err)
      }
    }
  } catch (error) {
    console.warn('Barba initialization note:', error)
  }
}
