import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { content } from './content'
import About from './components/About/About'
import Intro from './components/Intro/Intro'
import { useIntro } from './components/Intro/useIntro'
import PentagonVisual from './components/Pentagon/PentagonVisual'
import PentagonWorkstationReport from './components/Pentagon/PentagonReport'
import BarbaTransitionOverlay from './components/BarbaTransition/BarbaTransitionOverlay'
import CircularCarousel from './CircularCarousel'
import HoldButton from './HoldButton'
import CipherReveal from './CipherReveal'
import GlyphLottery from './GlyphLottery'
import {
  initBarba,
  triggerBarbaTransition,
  setBarbaLenis,
  setBarbaCaseStudyHandlers,
} from './transitions/barba'

gsap.registerPlugin(ScrollTrigger)
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const touchDevice = () => window.matchMedia('(pointer: coarse)').matches
const logoLetters = [
  ['R', 30, 24], ['E', 27, 22], ['D', 24, 20], ['I', 21, 18], ['R', 18, 16],
  ['E', 18, 16], ['C', 21, 18], ['T', 24, 20], ['O', 27, 22], ['R', 30, 24],
]
const featuredProjects = content.projects
  .filter((project) => ['Orchestration Engine', 'SAE Reproduction', 'Pentagon'].includes(project.name))
  .map((project, index) => ({ ...project, id: String(index + 1).padStart(2, '0') }))

const SLUG_TO_PROJECT_NAME = {
  'orchestration-engine': 'Orchestration Engine',
  'sae-reproduction': 'SAE Reproduction',
  'pentagon': 'Pentagon',
  '01': 'Orchestration Engine',
  '02': 'SAE Reproduction',
  '03': 'Pentagon',
}

const PROJECT_NAME_TO_SLUG = {
  'Orchestration Engine': 'orchestration-engine',
  'SAE Reproduction': 'sae-reproduction',
  'Pentagon': 'pentagon',
}

export function getAppBasePath() {
  if (typeof window === 'undefined') return '/'
  const envBase = import.meta.env.BASE_URL || '/'
  const cleanEnvBase = envBase.endsWith('/') ? envBase : `${envBase}/`

  // If running under GitHub Pages or a subdirectory that matches envBase
  if (cleanEnvBase !== '/' && window.location.pathname.startsWith(cleanEnvBase.replace(/\/$/, ''))) {
    return cleanEnvBase
  }

  // Dynamically detect base if inside /projects/
  const match = window.location.pathname.match(/^(.*\/)projects\//)
  if (match) {
    return match[1] || '/'
  }

  if (cleanEnvBase !== '/') {
    return cleanEnvBase
  }
  return '/'
}

function parseCurrentRoute() {
  if (typeof window === 'undefined') return { page: 'home', project: null }
  const path = window.location.pathname.toLowerCase()
  const hash = window.location.hash.toLowerCase()

  // 1. Check pathname: /projects/<slug> or /<slug>
  const pathMatch = path.match(/(?:^|\/)(?:projects\/)?(orchestration-engine|sae-reproduction|pentagon|01|02|03)(?:\/|$)/)
  if (pathMatch) {
    const slug = pathMatch[1]
    const projName = SLUG_TO_PROJECT_NAME[slug]
    const proj = featuredProjects.find((p) => p.name === projName)
    if (proj) return { page: 'project', slug, project: proj }
  }

  // 2. Check hash: #/projects/<slug> or #<slug>
  const hashMatch = hash.match(/#(?:(?:\/projects\/)?|\/)?(orchestration-engine|sae-reproduction|pentagon|01|02|03)(?:\/|$)/)
  if (hashMatch) {
    const slug = hashMatch[1]
    const projName = SLUG_TO_PROJECT_NAME[slug]
    const proj = featuredProjects.find((p) => p.name === projName)
    if (proj) return { page: 'project', slug, project: proj }
  }

  // 3. Check search query: ?project=<slug>
  const params = new URLSearchParams(window.location.search)
  const qProj = params.get('project')?.toLowerCase()
  if (qProj && SLUG_TO_PROJECT_NAME[qProj]) {
    const projName = SLUG_TO_PROJECT_NAME[qProj]
    const proj = featuredProjects.find((p) => p.name === projName)
    if (proj) return { page: 'project', slug: qProj, project: proj }
  }

  return { page: 'home', project: null }
}
const createOeWaypoints = () => {
  const stars = []
  let attempts = 0
  while (stars.length < 34 && attempts < 1800) {
    attempts += 1
    const candidate = {
      x: 20 + Math.random() * 960,
      y: 18 + Math.random() * 524,
      radius: Math.random() < .16 ? 2.15 : 1.45,
      opacity: .42 + Math.random() * .34,
    }
    if (stars.every((star) => Math.hypot(star.x - candidate.x, star.y - candidate.y) > 46)) stars.push(candidate)
  }
  return stars
}
const createOeConstellation = () => Array.from({ length: 88 }, () => ({
  x: 8 + Math.random() * 984,
  y: 8 + Math.random() * 544,
  radius: Math.random() > .94 ? 1.8 : Math.random() > .65 ? 1.15 : .72,
  opacity: .16 + Math.random() * .34,
}))
const oeWaypoints = createOeWaypoints()
const oeConstellationStars = createOeConstellation()

function useSmoothScroll() {
  useEffect(() => {
    if (reduceMotion() || touchDevice()) return undefined
    // The project case-file overlay runs its own scoped Lenis (same settings),
    // so the main page must not react to wheel events over it.
    const lenis = new Lenis({ lerp: .08, smoothWheel: true, wheelMultiplier: .86, prevent: (node) => !!node.closest?.('.project-overlay') })
    setBarbaLenis(lenis)
    let frame
    const animate = (time) => { lenis.raf(time); frame = requestAnimationFrame(animate) }
    frame = requestAnimationFrame(animate)
    // Route in-page anchor clicks through Barba transition for cinematic page flow.
    const onAnchorClick = (event) => {
      const anchor = event.target.closest?.('a[href^="#"]')
      const hash = anchor?.getAttribute('href')
      if (!hash || hash.length < 2) return
      const target = document.querySelector(hash)
      if (!target) return
      event.preventDefault()
      triggerBarbaTransition(hash, { type: 'section' })
    }
    document.addEventListener('click', onAnchorClick)
    return () => {
      setBarbaLenis(null)
      document.removeEventListener('click', onAnchorClick)
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])
}

function SectionGeometry({ tone = 'dark', variant = 'work' }) {
  const field = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const section = field.current?.parentElement
    const context = gsap.context(() => {
      const scrollRange = { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 }
      gsap.fromTo('.geometry-orbit:not(.geometry-orbit--left)', { yPercent: -14, rotate: -12 }, { yPercent: 14, rotate: 12, ease: 'none', scrollTrigger: scrollRange })
      gsap.fromTo('.geometry-orbit--left', { yPercent: -14, rotate: 12 }, { yPercent: 14, rotate: -12, ease: 'none', scrollTrigger: scrollRange })
      gsap.fromTo('.geometry-diamond:not(.geometry-diamond--left)', { y: 24, rotate: -18 }, { y: -24, rotate: 54, ease: 'none', scrollTrigger: scrollRange })
      gsap.fromTo('.geometry-diamond--left', { y: 24, rotate: 18 }, { y: -24, rotate: -54, ease: 'none', scrollTrigger: scrollRange })
    }, field)
    return () => context.revert()
  }, [])
  return <div ref={field} className={`section-geometry section-geometry--${variant}`} data-tone={tone} aria-hidden="true">
    <div className="geometry-plane">
      <span className="geometry-corner geometry-corner--tl" />
      <span className="geometry-corner geometry-corner--tr" />
      <span className="geometry-corner geometry-corner--bl" />
      <span className="geometry-corner geometry-corner--br" />
      <i className="geometry-axis-mark geometry-axis-mark--left" />
      <i className="geometry-axis-mark geometry-axis-mark--right" />
      <i className="geometry-ring geometry-orbit" />
      <i className="geometry-ring geometry-orbit geometry-orbit--left" />
      <i className="geometry-ring geometry-orbit geometry-orbit--secondary" />
      <i className="geometry-ring geometry-loop" />
      <i className="geometry-diamond" />
      <i className="geometry-diamond geometry-diamond--left" />
      <i className="geometry-diamond geometry-diamond--secondary" />
      <i className="geometry-cross"><b /><b /></i>
      <i className="geometry-cross geometry-cross--secondary"><b /><b /></i>
      <i className="geometry-rule" />
    </div>
  </div>
}

function Reveal({ children, className = '', id }) {
  const element = useRef(null)
  usePageReveals(element)
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const tween = gsap.fromTo(element.current, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: .78, ease: 'power3.out', scrollTrigger: { trigger: element.current, start: 'top 82%', once: true }, onComplete: () => gsap.set(element.current, { clearProps: 'transform,opacity' }) })
    return () => tween.kill()
  }, [])
  return <section ref={element} id={id} className={`relative isolate overflow-hidden ${className}`}>
    <SectionGeometry variant={id === 'now' ? 'now' : 'work'} />
    <div className="relative z-10">{children}</div>
  </section>
}

function caseFileGroupReveal(root, scroller, groupSelector, childSelector, { start = 'top 85%', stagger = .09 } = {}) {
  gsap.utils.toArray(groupSelector, root).forEach((group) => {
    const children = [...group.querySelectorAll(childSelector)]
    if (!children.length) return
    gsap.fromTo(children, { autoAlpha: 0, y: 18 }, {
      autoAlpha: 1, y: 0, duration: .5, stagger, ease: 'power2.out',
      scrollTrigger: { trigger: group, scroller, start, once: true },
    })
  })
}

function caseFileFlowReveal(root, scroller, selector) {
  gsap.utils.toArray(selector, root).forEach((flow) => {
    const steps = [...flow.querySelectorAll('span')]
    const arrows = [...flow.querySelectorAll('i')]
    if (!steps.length) return
    gsap.set([...steps, ...arrows], { autoAlpha: 0, y: 6 })
    gsap.timeline({ scrollTrigger: { trigger: flow, scroller, start: 'top 84%', once: true } })
      .to(steps, { autoAlpha: 1, y: 0, duration: .34, stagger: .2, ease: 'power2.out' })
      .to(arrows, { autoAlpha: 1, y: 0, duration: .22, stagger: .2, ease: 'power2.out' }, '-=.52')
  })
}

// Shared page-level reveals: display headings wipe in, [data-reveal-group] children stagger.
function usePageReveals(sectionRef) {
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const root = sectionRef.current
    if (!root) return undefined
    const context = gsap.context(() => {
      root.querySelectorAll('h2').forEach((heading) => {
        gsap.fromTo(heading, { autoAlpha: 0, y: 34, clipPath: 'inset(0 0 22% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: .85, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 82%', once: true }, onComplete: () => gsap.set(heading, { clearProps: 'all' }) })
      })
      gsap.utils.toArray('[data-reveal-group]', root).forEach((group) => {
        const children = [...group.children]
        if (!children.length) return
        gsap.fromTo(children, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .6, stagger: .1, ease: 'power2.out', scrollTrigger: { trigger: group, start: 'top 86%', once: true }, onComplete: () => gsap.set(children, { clearProps: 'all' }) })
      })
    }, root)
    return () => context.revert()
  }, [])
}

// Shared scroll choreography for the long-form case files. `scope` is the report panel;
// `prefix` is 'oe' or 'sae' so the same timeline drives both reports.
function setupCaseFileScrollFx(scope, prefix, entranceDelay = 0) {
  if (reduceMotion()) return undefined
  const scroller = scope.closest('.project-overlay')
  const q = gsap.utils.selector(scope)
  const context = gsap.context(() => {
    gsap.timeline({ defaults: { ease: 'power2.out' }, delay: entranceDelay })
      .fromTo(q(`.${prefix}-report-topbar p`), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: .35 })
      .fromTo(q(`.${prefix}-report-topbar .icon-button`), { scale: .9 }, { scale: 1, duration: .32 }, '<')
      .fromTo(q(`.${prefix}-report-kicker`), { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: .38 }, '-=.12')
      .fromTo(q(`.${prefix}-report-hero h2`), { autoAlpha: 0, y: 20, clipPath: 'inset(0 0 18% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: .68, ease: 'power3.out' }, '-=.08')
      .fromTo(q(`.${prefix}-report-intro`), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .46 }, '-=.28')
      .fromTo(q(`.${prefix}-report-links a, .${prefix}-report-links .hold-button`), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .07 }, '-=.18')
      .fromTo(q(`.${prefix}-hero-chips span`), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .34, stagger: .06 }, '-=.2')
      .fromTo(q(`.${prefix}-report-metrics article`), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .075 }, '-=.08')
      .fromTo(q(`.${prefix}-report-metrics ~ .${prefix}-report-note`), { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: .32 }, '-=.1')

    const ticker = scope.querySelector('.oe-event-ticker')
    if (ticker) gsap.fromTo(ticker, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .5, delay: entranceDelay + .9, ease: 'power2.out', scrollTrigger: { trigger: ticker, scroller, start: 'top 96%', once: true } })

    gsap.utils.toArray(`.${prefix}-report-section`, scope).forEach((section) => {
      const parts = [section.querySelector(`.${prefix}-report-section-label`), section.querySelector(`.${prefix}-report-section-body`)].filter(Boolean)
      if (!parts.length) return
      gsap.fromTo(parts, { autoAlpha: 0, y: 18 }, {
        autoAlpha: 1, y: 0, duration: .52, stagger: .11, ease: 'power2.out',
        scrollTrigger: { trigger: section, scroller, start: 'top 82%', once: true },
      })
    })

    caseFileGroupReveal(scope, scroller, `.${prefix}-report-steps`, ':scope > li', { start: 'top 80%', stagger: .08 })
    caseFileGroupReveal(scope, scroller, `.${prefix}-report-compare`, ':scope > article', { start: 'top 80%' })
    caseFileGroupReveal(scope, scroller, `.${prefix}-report-fields`, ':scope > div', { start: 'top 82%', stagger: .07 })
    caseFileGroupReveal(scope, scroller, `.${prefix}-report-checks`, ':scope > article, :scope > p', { start: 'top 82%' })
    caseFileGroupReveal(scope, scroller, '.oe-report-facts', ':scope > p', { start: 'top 82%' })
    caseFileGroupReveal(scope, scroller, '.oe-verification-strip', ':scope > p', { start: 'top 82%' })
    caseFileGroupReveal(scope, scroller, '.oe-limit-list', ':scope > p', { start: 'top 84%', stagger: .07 })
    caseFileGroupReveal(scope, scroller, '.oe-api-list', ':scope > code', { start: 'top 86%', stagger: .05 })
    caseFileGroupReveal(scope, scroller, '.oe-test-table', ':scope > .oe-test-row', { start: 'top 80%', stagger: .055 })

    caseFileFlowReveal(scope, scroller, '.sae-report-flow')
    caseFileFlowReveal(scope, scroller, '.oe-durability-flow')

    gsap.utils.toArray(`.${prefix}-report-section-body .${prefix}-report-note, .${prefix}-report-section-body .${prefix}-report-callout, .${prefix}-report-section-body .${prefix}-report-caution`, scope).forEach((node) => {
      gsap.fromTo(node, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: .45, ease: 'power2.out', scrollTrigger: { trigger: node, scroller, start: 'top 85%', once: true } })
    })

    const graph = scope.querySelector('.oe-dependency-graph')
    if (graph) {
      const edges = [...graph.querySelectorAll('.oe-graph-edge')]
      const nodes = [...graph.querySelectorAll('.oe-graph-node')]
      edges.forEach((edge) => {
        const length = edge.getTotalLength()
        gsap.set(edge, { strokeDasharray: length, strokeDashoffset: length })
      })
      gsap.set(nodes, { scale: 0, transformOrigin: 'center center' })
      const graphTimeline = gsap.timeline({ scrollTrigger: { trigger: graph, scroller, start: 'top 78%', once: true } })
      edges.forEach((edge, index) => graphTimeline.to(edge, { strokeDashoffset: 0, duration: .72, ease: 'power1.inOut' }, index * .12))
      graphTimeline.to(nodes, { scale: 1, duration: .3, stagger: .12, ease: 'power2.out' }, '-=.12')
    }

    const stateMachine = scope.querySelector('.oe-state-machine')
    if (stateMachine) {
      const states = [...stateMachine.querySelectorAll('.oe-state-path .oe-state-chip')]
      const stateTimeline = gsap.timeline({ scrollTrigger: { trigger: stateMachine, scroller, start: 'top 82%', once: true } })
      states.forEach((state, index) => {
        stateTimeline
          .to(state, { color: '#E5484D', borderColor: '#E5484D', backgroundColor: 'rgba(229,72,77,.16)', duration: .2 }, index * .34)
          .to(state, { color: 'rgba(255,255,255,.82)', borderColor: 'rgba(229,72,77,.4)', backgroundColor: 'rgba(229,72,77,.06)', duration: .3 }, index * .34 + .2)
      })
    }

    const footer = scope.querySelector(`.${prefix}-report-footer`)
    if (footer) gsap.fromTo(footer, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, scrollTrigger: { trigger: footer, scroller, start: 'top 90%', once: true } })
  }, scope)
  ScrollTrigger.refresh()
  let driftFrame = 0
  const hero = scope.querySelector(`.${prefix}-report-hero`)
  const onScroll = () => {
    if (driftFrame || !scroller || !hero) return
    driftFrame = requestAnimationFrame(() => {
      driftFrame = 0
      if (!hero || !hero.isConnected) return
      const drift = Math.min(scroller.scrollTop * .06, 30)
      hero.style.transform = `translateY(${(-drift).toFixed(2)}px)`
      hero.style.opacity = String(Math.max(.82, 1 - drift / 160))
    })
  }
  scroller?.addEventListener('scroll', onScroll, { passive: true })
  return () => {
    scroller?.removeEventListener('scroll', onScroll)
    if (driftFrame) cancelAnimationFrame(driftFrame)
    context.revert()
  }
}

function CaseFileProgress({ tone = 'lime' }) {
  const bar = useRef(null), fill = useRef(null)
  useEffect(() => {
    const scroller = bar.current?.closest('.project-overlay')
    if (!scroller || !fill.current || reduceMotion()) return undefined
    const update = () => {
      if (!fill.current) return
      const max = scroller.scrollHeight - scroller.clientHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, scroller.scrollTop / max)) : 0
      fill.current.style.transform = `scaleX(${progress})`
    }
    update()
    scroller.addEventListener('scroll', update, { passive: true })
    return () => scroller.removeEventListener('scroll', update)
  }, [])
  return <div ref={bar} className={`case-progress ${tone === 'ink' ? 'case-progress--ink' : ''}`} aria-hidden="true"><span ref={fill} /></div>
}

function Header({ shown }) {
  const handleNav = (target, e) => {
    e.preventDefault()
    triggerBarbaTransition(target, { type: 'section' })
  }
  return <header className={`site-header fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-6 mix-blend-difference transition-all duration-700 sm:px-10 lg:px-16 ${shown ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}><a href="#top" onClick={(e) => handleNav('#top', e)} aria-label="REDIRECTOR" className="brand-lockup font-display font-black uppercase">{logoLetters.map(([letter, desktopSize, mobileSize], index) => <span className="brand-letter" style={{ '--brand-size': `${desktopSize}px`, '--brand-size-mobile': `${mobileSize}px` }} key={index}>{letter}</span>)}</a><nav className="site-nav flex gap-4 font-mono text-[.68rem] uppercase tracking-[.08em] sm:gap-8" aria-label="Portfolio navigation"><a className="link-line" href="#about" onClick={(e) => handleNav('#about', e)}>About</a><a className="link-line" href="#work" onClick={(e) => handleNav('#work', e)}>Work</a><a className="link-line" href="#method" onClick={(e) => handleNav('#method', e)}>Method</a><a className="link-line" href="#now" onClick={(e) => handleNav('#now', e)}>Now</a><a className="link-line" href="#contact" onClick={(e) => handleNav('#contact', e)}>Contact</a></nav></header>
}

function Hero({ shown }) {
  const hero = useRef(null)
  useLayoutEffect(() => {
    if (!shown || reduceMotion()) return undefined
    const context = gsap.context(() => {
      gsap.from('.hero-name > span', { opacity: 0, y: 42, stagger: .1, duration: .8, ease: 'power4.out', delay: .38 })
      gsap.from('.hero-intro', { opacity: 0, y: 22, duration: .7, ease: 'power3.out', delay: .85 })
      gsap.to('.hero-ring', { rotate: 360, duration: 42, ease: 'none', repeat: -1 })
      gsap.to('.hero-ring-mid', { rotate: -360, duration: 68, ease: 'none', repeat: -1 })
      gsap.to('.hero-ring-outer', { rotate: 360, duration: 110, ease: 'none', repeat: -1 })
      gsap.to('.geo-float', { y: -12, rotate: 8, opacity: .2, duration: 8, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: { each: 1.2, from: 'random' } })
      gsap.to('.geo-orbit-path:not(.geo-orbit-path--mirrored)', { rotate: 360, duration: 48, ease: 'none', repeat: -1 })
      gsap.to('.geo-orbit-path--mirrored', { rotate: -360, duration: 48, ease: 'none', repeat: -1 })
      gsap.to('.hero-centerpiece', { y: 70, scale: .92, ease: 'none', scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: 1 } })
    }, hero)
    return () => context.revert()
  }, [shown])
  return <section ref={hero} id="top" className="relative grid min-h-svh place-items-center overflow-hidden bg-black px-5">
    <div className="hero-geometry pointer-events-none absolute inset-0" aria-hidden="true">
      <span className="hero-corner-reticle hero-corner-reticle--tl" />
      <span className="hero-corner-reticle hero-corner-reticle--tr" />
      <span className="hero-corner-reticle hero-corner-reticle--bl" />
      <span className="hero-corner-reticle hero-corner-reticle--br" />
      <div className="hero-axis-crosshair hero-axis-crosshair--left" />
      <div className="hero-axis-crosshair hero-axis-crosshair--right" />
      <i className="geo-orbit-path absolute right-[12%] top-[48%]"><b className="geo-orbit-dot" /></i>
      <i className="geo-orbit-path geo-orbit-path--mirrored absolute left-[12%] top-[48%]"><b className="geo-orbit-dot" /></i>
      <i className="geo-float geo-diamond absolute left-[15%] top-[24%]" />
      <i className="geo-float geo-diamond absolute right-[15%] top-[24%]" />
      <i className="geo-float geo-square absolute right-[18%] top-[34%]" />
      <i className="geo-float geo-square absolute left-[18%] top-[34%]" />
      <i className="geo-float geo-triangle absolute bottom-[22%] left-[18%]" />
      <i className="geo-float geo-triangle absolute bottom-[22%] right-[18%]" />
      <i className="geo-float geo-cross absolute bottom-[25%] left-[16%]"><b /><b /></i>
      <i className="geo-float geo-cross absolute bottom-[25%] right-[16%]"><b /><b /></i>
      <i className="geo-line absolute left-[8%] top-[50%]" />
      <i className="geo-line absolute right-[8%] top-[50%]" />
    </div>
    <div className="hero-content relative z-10 max-w-6xl text-center">
      <div className="relative">
        <div className="hero-centerpiece pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" aria-hidden="true">
          <div className="hero-ring absolute h-[76vw] w-[76vw] max-h-[56rem] max-w-[56rem] rounded-full border border-white/15" />
          <div className="hero-ring-mid absolute h-[90vw] w-[90vw] max-h-[66rem] max-w-[66rem] rounded-full border border-white/[.08] border-dashed" />
          <div className="hero-ring-outer absolute h-[106vw] w-[106vw] max-h-[78rem] max-w-[78rem] rounded-full border border-white/[.05]" />
          <div className="hero-orb absolute h-[clamp(22rem,42vw,36rem)] w-[clamp(22rem,42vw,36rem)] rounded-full bg-accent opacity-90 shadow-[0_0_100px_rgba(164,0,0,0.38)]" />
        </div>
        <h1 className="hero-name relative z-10 font-display text-white text-[clamp(4.5rem,15vw,13rem)] font-black leading-[.82] tracking-[-.035em]">
          <span className="block">RED</span>
          <span className="block">DIRECTOR</span>
        </h1>
      </div>
      <p className="hero-intro font-serif mx-auto mt-8 max-w-xl text-[1.0625rem] leading-7 text-white/85">{content.intro}</p>
    </div>
    <a href="#work" className="hero-scroll-cue absolute bottom-7 z-10 grid justify-items-center gap-2 font-mono text-[.66rem] uppercase tracking-[.1em]"><span className="text-white">Selected work</span><span className="text-xl text-white">↓</span></a>
  </section>
}

// Passive: mirror the report section currently in view into the case-file topbar readout.
function useCaseFileReadout(reportRef, anchors) {
  useEffect(() => {
    const scroller = reportRef.current?.closest('.project-overlay')
    if (!scroller || reduceMotion() || typeof IntersectionObserver !== 'function') return undefined
    // Scope to this report's own overlay so the two case files never fight over the readout.
    const readout = scroller.querySelector('.oe-readout-value')
    if (!readout) return undefined
    let activeSection = null
    let frame = 0
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) activeSection = entry.target })
    }, { root: scroller, threshold: .18 })
    anchors.forEach(({ id }) => { const node = document.getElementById(id); if (node) observer.observe(node) })
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const match = anchors.find(({ id }) => id === activeSection?.id)
        if (match && readout.textContent !== match.label) readout.textContent = match.label
      })
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => { observer.disconnect(); scroller.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame) }
  }, [])
}

// Interactive: qualitative illustration of the reconstruction/sparsity trade-off.
function SparsityTradeoffExplorer() {
  const levels = [
    { lambda: 'λ · 0.25', sparse: 22, recon: 92, note: 'Light pressure: reconstruction stays strong, but many features stay active — the code stays dense and hard to read.' },
    { lambda: 'λ · 1', sparse: 58, recon: 71, note: 'Balanced regime: fewer active features per activation while reconstruction remains useful — the trade-off the paper studies.' },
    { lambda: 'λ · 4', sparse: 90, recon: 38, note: 'Heavy pressure: very sparse codes, but reconstruction degrades — the dictionary starts losing real structure.' },
  ]
  const [index, setIndex] = useState(1)
  const level = levels[index]
  return <div className="sae-tradeoff" aria-label="Interactive sparsity trade-off illustration">
    <div className="sae-tradeoff-head"><span>Sparsity trade-off · interactive illustration</span><div role="group" aria-label="Choose sparsity pressure">{levels.map((item, itemIndex) => <button key={item.lambda} type="button" className={`sae-tradeoff-step${itemIndex === index ? ' is-active' : ''}`} aria-pressed={itemIndex === index} onClick={() => setIndex(itemIndex)}>{item.lambda}</button>)}</div></div>
    <div className="sae-tradeoff-meters">
      <div className="sae-tradeoff-meter"><span>Sparsity</span><b><i style={{ width: `${level.sparse}%` }} /></b><small>{level.sparse}%</small></div>
      <div className="sae-tradeoff-meter"><span>Reconstruction</span><b><i style={{ width: `${level.recon}%` }} /></b><small>{level.recon}%</small></div>
    </div>
    <p className="sae-tradeoff-note" role="status">{level.note}</p>
    <small className="sae-tradeoff-disclaimer">Qualitative illustration, not measured run data — the real λ and loss values still need to be documented from the training configuration.</small>
  </div>
}

// Ambient background for the research case file — same passive language as the engine report.
function SaeReportAmbience() {
  const field = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const scroller = field.current?.closest('.project-overlay')
    const context = gsap.context(() => {
      gsap.to('.sae-ambience-ring--spin', { rotate: 360, duration: 96, ease: 'none', repeat: -1 })
      gsap.to('.sae-ambience-float', { y: -12, rotate: 8, opacity: .22, duration: 7.5, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 1.5, from: 'random' } })
      if (scroller) {
        const range = { trigger: field.current, scroller, start: 'top bottom', end: 'bottom top', scrub: 1 }
        gsap.fromTo('.sae-ambience-ring--orbit', { yPercent: -12, rotate: -10 }, { yPercent: 12, rotate: 10, ease: 'none', scrollTrigger: range })
        gsap.fromTo('.sae-ambience-diamond', { y: 26, rotate: -16 }, { y: -26, rotate: 50, ease: 'none', scrollTrigger: range })
      }
    }, field)
    return () => context.revert()
  }, [])
  return <div ref={field} className="sae-ambience" aria-hidden="true">
    <i className="sae-ambience-plane" />
    <i className="sae-ambience-ring sae-ambience-ring--spin" />
    <i className="sae-ambience-ring sae-ambience-ring--orbit" />
    <i className="sae-ambience-diamond" />
    <i className="sae-ambience-diamond sae-ambience-diamond--secondary" />
    <i className="sae-ambience-float sae-ambience-square" />
    <i className="sae-ambience-float sae-ambience-cross"><b /><b /></i>
  </div>
}

function SAEResearchReport({ entranceDelay = 0, onBackToHome, onNavigateProject }) {
  const report = useRef(null)
  const saeSectionAnchors = [
    { id: 'sae-s01', label: 'question' },
    { id: 'sae-s02', label: 'method' },
    { id: 'sae-s03', label: 'reference' },
    { id: 'sae-s04', label: 'run record' },
    { id: 'sae-s05', label: 'analysis' },
  ]
  useCaseFileReadout(report, saeSectionAnchors)
  useLayoutEffect(() => {
    const root = report.current
    const scope = root?.closest('.sae-report-panel')
    if (!root || !scope) return undefined
    return setupCaseFileScrollFx(scope, 'sae', entranceDelay)
  }, [entranceDelay])
  return <div className="sae-report" ref={report}>
    <SaeReportAmbience />
    <main className="sae-report-main">
      <header className="sae-report-hero">
        <p className="sae-report-kicker">Independent reproduction · Mechanistic interpretability</p>
        <CipherReveal id="project-title" as="h2" duration={1.4} scramble={0.35} order="left" hover="trail">
          TOWARDS<br /><span>MONOSEMANTICITY:</span><br />a small-scale reproduction on GELU-1L
        </CipherReveal>
        <p id="project-detail" className="sae-report-intro">I’m testing whether a sparse, overcomplete dictionary makes a model’s internal activations easier to study than its neurons alone. These results come from my own run, not the paper’s.</p>
        <div className="oe-report-btn-group">
          <HoldButton
            size="sm"
            radius={2}
            holdTime={700}
            backgroundColor="#141417"
            fillColor="#e5484d"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            doneLabel="Opening..."
            onTap={() => window.open('https://www.transformer-circuits.pub/2023/monosemantic-features/index.html', '_blank')}
            onHold={() => window.open('https://www.transformer-circuits.pub/2023/monosemantic-features/index.html', '_blank')}
          >
            Original Paper ↗
          </HoldButton>
          <HoldButton
            size="sm"
            radius={2}
            holdTime={700}
            backgroundColor="#141417"
            fillColor="#e5484d"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            doneLabel="Opening..."
            onTap={() => window.open('https://reddirector.github.io/Towards_Monosemanticity_Reproduction/', '_blank')}
            onHold={() => window.open('https://reddirector.github.io/Towards_Monosemanticity_Reproduction/', '_blank')}
          >
            Reproduction Site ↗
          </HoldButton>
        </div>
        <div className="oe-hero-chips" aria-hidden="true"><span>gelu-1l</span><span>2,048 → 4,096 features</span><span>0.897562 cosine</span><span>0.10% dead</span></div>
        <i className="oe-hero-bracket oe-hero-bracket--tl" aria-hidden="true" /><i className="oe-hero-bracket oe-hero-bracket--br" aria-hidden="true" />
      </header>

      <section className="sae-report-metrics" aria-label="Reproduction snapshot">
        <article><span>Architecture</span><strong><GlyphLottery text="GELU-1L" accentColor="var(--color-interactive)" /></strong><small>as listed in the project</small></article>
        <article><span>SAE width</span><strong><GlyphLottery text="2,048 → 4,096" accentColor="var(--color-interactive)" /></strong><small>project-reported dimensions</small></article>
        <article><span>Validation</span><strong><GlyphLottery text="0.897562" accentColor="var(--color-interactive)" /></strong><small>cosine similarity</small></article>
        <article><span>Inactive features</span><strong><GlyphLottery text="0.10%" accentColor="var(--color-interactive)" /></strong><small>dead-feature rate reported</small></article>
      </section>
      <p className="sae-report-note">These figures come from my project notes, not Anthropic’s paper. I still need to add the exact training setup and explain how each metric was calculated.</p>

      <section className="sae-report-section" id="sae-s01">
        <div className="sae-report-section-label"><span>01</span><p>Research question</p></div>
        <div className="sae-report-section-body">
          <h3>Can a larger sparse basis reveal structure hidden by superposition?</h3>
          <p>A neuron can respond to several unrelated patterns, a property called polysemanticity. The paper tests whether a larger dictionary can represent the same activation as a sparse mix of more coherent features. The goal is not simply to compress the activation. It is to make the model easier to study.</p>
          <div className="sae-report-flow" aria-label="Sparse autoencoder representation flow"><span>Model activation <b>x</b></span><i aria-hidden="true">→</i><span>SAE encoder</span><i aria-hidden="true">→</i><span>Sparse features <b>f</b></span><i aria-hidden="true">→</i><span>Decoder <b>D</b></span><i aria-hidden="true">→</i><span>Reconstruction <b>x̂</b></span></div>
          <div className="sae-report-equation"><span>Dictionary view</span><strong>x ≈ Df</strong><p><b>x</b> is the model activation, <b>f</b> its sparse feature vector, and the columns of <b>D</b> are learned decoder directions.</p></div>
        </div>
      </section>

      <section className="sae-report-section" id="sae-s02">
        <div className="sae-report-section-label"><span>02</span><p>Method & objective</p></div>
        <div className="sae-report-section-body">
          <h3>Keep reconstruction useful; make the code sparse.</h3>
          <p>The encoder maps each activation into a larger feature space. The decoder then tries to reconstruct it. Training balances reconstruction error against a penalty that encourages sparse feature activity:</p>
          <div className="sae-report-equation sae-report-equation--wide"><span>Simplified objective</span><strong>L = L<sub>reconstruction</sub>(x, x̂) + λ · ‖f‖₁</strong><p>For a mean-squared reconstruction term, stronger sparsity pressure (λ) can make codes more selective, but may worsen reconstruction. The chosen trade-off and exact implementation belong in the run record.</p></div>
          <SparsityTradeoffExplorer />
          <ol className="sae-report-steps">
            <li><b>Collect</b><span>Capture activations at a named model layer and hook point.</span></li>
            <li><b>Fit</b><span>Train an overcomplete SAE with the documented reconstruction and sparsity losses.</span></li>
            <li><b>Measure</b><span>Report held-out reconstruction, sparsity, and inactive-feature counts with definitions.</span></li>
            <li><b>Inspect</b><span>Review activating examples, test feature coherence, then run controlled interventions.</span></li>
          </ol>
        </div>
      </section>

      <section className="sae-report-section" id="sae-s03">
        <div className="sae-report-section-label"><span>03</span><p>Reference vs reproduction</p></div>
        <div className="sae-report-section-body">
          <h3>The paper and this run are not the same experiment.</h3>
          <div className="sae-report-compare">
            <article><p className="sae-report-card-label">Original paper · reference</p><ul><li>One-layer transformer with a 512-neuron MLP layer.</li><li>Featured A/1 dictionary: 4,096 learned features.</li><li>Paper reports training on 8 billion activation datapoints.</li></ul><small>Reference-study facts; not reproduction measurements.</small></article>
            <article><p className="sae-report-card-label">This project · current snapshot</p><ul><li>Architecture listed as GELU-1L.</li><li>SAE dimensions listed as 2,048 → 4,096.</li><li>Validation cosine similarity: 0.897562; dead features: 0.10%.</li></ul><small>Project figures; configuration details are not yet linked here.</small></article>
          </div>
          <p className="sae-report-caution">The project lists 2,048 input dimensions. The paper’s featured model has a 512-neuron MLP. Until I document the checkpoint, layer, data, and preprocessing, I should call this an adapted reproduction, not a parameter-matched replication.</p>
        </div>
      </section>

      <section className="sae-report-section" id="sae-s04">
        <div className="sae-report-section-label"><span>04</span><p>Run record</p></div>
        <div className="sae-report-section-body">
          <h3>What someone would need to rerun it.</h3>
          <p>I’ll fill these in from the training code, saved config, and evaluation logs. If a value was never recorded, I’ll leave it marked as missing.</p>
          <dl className="sae-report-fields">
            <div><dt>Base model / checkpoint</dt><dd>[Model name, revision, and source]</dd></div>
            <div><dt>Activation source</dt><dd>[Dataset, split, token count, and collection method]</dd></div>
            <div><dt>Layer / hook point</dt><dd>[Module name, tensor shape, and preprocessing]</dd></div>
            <div><dt>SAE implementation</dt><dd>[Encoder activation, biases, decoder constraints, and code version]</dd></div>
            <div><dt>Training configuration</dt><dd>[Optimizer, learning rate, batch size, steps, seed, and λ]</dd></div>
            <div><dt>Evaluation protocol</dt><dd>[Validation split, cosine similarity calculation, and dead-feature threshold]</dd></div>
            <div><dt>Artifacts / revision</dt><dd>[Config, checkpoint or log links, commit hash, and report date]</dd></div>
          </dl>
        </div>
      </section>

      <section className="sae-report-section" id="sae-s05">
        <div className="sae-report-section-label"><span>05</span><p>Analysis still to document</p></div>
        <div className="sae-report-section-body">
          <h3>Training numbers don’t tell me what a feature means.</h3>
          <div className="sae-report-checks">
            <p><span>01</span><b>Feature interpretability</b><small>[Examples where a feature activates, counterexamples, and the rubric used.]</small></p>
            <p><span>02</span><b>Feature splitting</b><small>[Dictionary sizes compared, matched feature families, and comparison method.]</small></p>
            <p><span>03</span><b>Intervention / steering</b><small>[Intervention, controls, result, and limitations, or “not run.”]</small></p>
            <p><span>04</span><b>Universality</b><small>[Second model, feature matching method, evidence, or “not run.”]</small></p>
          </div>
        </div>
      </section>

      <footer className="sae-report-footer">
        <span>Research file · 02 / SAE reproduction</span>
        <span>Updated: 2026 · Mechanistic Interpretability</span>
        <p>Primary source: Bricken et al., “Towards Monosemanticity: Decomposing Language Models With Dictionary Learning” (2023). Independent reproduction on GELU-1L.</p>
        <div className="oe-report-btn-group mt-5">
          {onBackToHome && (
            <HoldButton
              size="sm"
              radius={2}
              holdTime={600}
              backgroundColor="#161619"
              fillColor="#e5484d"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              doneLabel="Returning..."
              onTap={onBackToHome}
              onHold={onBackToHome}
            >
              ← Back to Overview
            </HoldButton>
          )}
          <HoldButton
            size="sm"
            radius={2}
            holdTime={700}
            backgroundColor="#141417"
            fillColor="#e5484d"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            doneLabel="Opening..."
            onTap={() => window.open('https://reddirector.github.io/Towards_Monosemanticity_Reproduction/', '_blank')}
            onHold={() => window.open('https://reddirector.github.io/Towards_Monosemanticity_Reproduction/', '_blank')}
          >
            Reproduction Site ↗
          </HoldButton>
          {onNavigateProject && (
            <HoldButton
              size="sm"
              radius={2}
              holdTime={600}
              backgroundColor="#141417"
              fillColor="#e5484d"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              doneLabel="Opening..."
              onTap={() => onNavigateProject('pentagon')}
              onHold={() => onNavigateProject('pentagon')}
            >
              Next: Pentagon →
            </HoldButton>
          )}
        </div>
      </footer>
    </main>
  </div>
}

const ORCHESTRATION_REPO = 'https://github.com/Reddirector/Orchestration_Engine'
const ORCHESTRATION_PYPI = 'https://pypi.org/project/orchestration-engine/'
const ORCHESTRATION_DOCS = 'https://reddirector.github.io/Orchestration_Engine/'
const ORCHESTRATION_RELEASE = 'https://github.com/Reddirector/Orchestration_Engine/releases/tag/v0.9.0'
const ORCHESTRATION_INSTALL_CMD = 'pip install orchestration-engine'
const ORCHESTRATION_INSTALL_COMMANDS = [
  { id: 'pip', label: 'pip install', cmd: 'pip install orchestration-engine' },
  { id: 'cli', label: 'install', cmd: 'install orchestration-engine' },
  { id: 'uv', label: 'uv add', cmd: 'uv add orchestration-engine' },
]

function QuickInstallBar() {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const currentCmd = ORCHESTRATION_INSTALL_COMMANDS[activeTab].cmd

  const handleCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(currentCmd).then(() => {
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), 2000)
      }).catch(() => {})
    }
  }

  return (
    <div className="oe-install-wrapper">
      <div className="oe-install-tabs" role="tablist" aria-label="Installation commands">
        {ORCHESTRATION_INSTALL_COMMANDS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeTab === idx}
            className={`oe-install-tab ${activeTab === idx ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              setActiveTab(idx)
              setCopied(false)
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="oe-install-bar" onClick={handleCopy} title="Click to copy command">
        <div className="oe-install-code">
          <span className="oe-install-prompt" aria-hidden="true">$</span>
          <code>{currentCmd}</code>
        </div>
        <button type="button" className="oe-install-btn" aria-label={`Copy ${currentCmd}`}>
          {copied ? (
            <span className="oe-install-copied"><span aria-hidden="true">✓</span> copied</span>
          ) : (
            <span>copy</span>
          )}
        </button>
      </div>
    </div>
  )
}

function InteractiveWorkflowSimulator() {
  const [isRunning, setIsRunning] = useState(false)
  const [status, setStatus] = useState('READY')
  const [nodes, setNodes] = useState({
    retrieve: 'pending',
    summarize: 'pending',
    extract: 'pending',
    report: 'pending',
  })
  const [edges, setEdges] = useState({
    '1a': false,
    '1b': false,
    '2a': false,
    '2b': false,
  })
  const [logs, setLogs] = useState([
    {
      id: 0,
      time: '0.0000',
      task: 'system',
      oldSt: 'INIT',
      newSt: 'READY',
      attempt: 0,
      note: '// Engine initialized with SQLite WAL. Click "Run Workflow" to observe DAG concurrency and 429 backoff.',
    },
  ])
  const timerRef = useRef([])
  const logStreamRef = useRef(null)

  const clearAllTimers = () => {
    timerRef.current.forEach((t) => clearTimeout(t))
    timerRef.current = []
  }

  useEffect(() => {
    return () => clearAllTimers()
  }, [])

  useEffect(() => {
    if (logStreamRef.current) {
      logStreamRef.current.scrollTop = logStreamRef.current.scrollHeight
    }
  }, [logs])

  const addLog = (task, oldSt, newSt, attempt, note = '') => {
    const time = (performance.now() / 1000).toFixed(4)
    setLogs((prev) => [
      ...prev,
      { id: prev.length, time, task, oldSt, newSt, attempt, note },
    ])
  }

  const resetSimulation = () => {
    clearAllTimers()
    setIsRunning(false)
    setStatus('READY')
    setNodes({
      retrieve: 'pending',
      summarize: 'pending',
      extract: 'pending',
      report: 'pending',
    })
    setEdges({
      '1a': false,
      '1b': false,
      '2a': false,
      '2b': false,
    })
    setLogs([
      {
        id: 0,
        time: '0.0000',
        task: 'system',
        oldSt: 'INIT',
        newSt: 'READY',
        attempt: 0,
        note: '// Simulation reset. Click "Run Workflow" to execute.',
      },
    ])
  }

  const startSimulation = () => {
    if (isRunning) return
    resetSimulation()
    setIsRunning(true)
    setStatus('RUNNING')

    const schedule = (fn, delay) => {
      const t = setTimeout(fn, delay)
      timerRef.current.push(t)
    }

    // Step 1: Retrieve starts
    setNodes((n) => ({ ...n, retrieve: 'ready' }))
    addLog('retrieve', 'PENDING', 'READY', 0)

    schedule(() => {
      setNodes((n) => ({ ...n, retrieve: 'running' }))
      addLog('retrieve', 'READY', 'RUNNING', 1)

      schedule(() => {
        setNodes((n) => ({ ...n, retrieve: 'succeeded' }))
        setEdges((e) => ({ ...e, '1a': true, '1b': true }))
        addLog('retrieve', 'RUNNING', 'SUCCEEDED', 1, '✓ Output passed to downstream inputs')

        // Step 2: Fan-out parallel (Summarize + Extract)
        schedule(() => {
          setNodes((n) => ({ ...n, summarize: 'running', extract: 'running' }))
          addLog('summarize', 'READY', 'RUNNING', 1, 'Concurrency: Worker 1 (ThreadPool)')
          addLog('extract', 'READY', 'RUNNING', 1, 'Concurrency: Worker 2 (ProcessExecutor)')

          schedule(() => {
            // Extract succeeds
            setNodes((n) => ({ ...n, extract: 'succeeded' }))
            setEdges((e) => ({ ...e, '2b': true }))
            addLog('extract', 'RUNNING', 'SUCCEEDED', 1, '✓ Entities extracted (JSON Schema)')

            // Summarize catches 429 rate limit
            setNodes((n) => ({ ...n, summarize: 'retry' }))
            addLog('summarize', 'RUNNING', 'RETRY_WAIT', 1, '⚠ HTTP 429 Rate Limit - Finish-time backoff 1.0s')

            // Summarize cool-down finishes -> Retry attempt 2
            schedule(() => {
              setNodes((n) => ({ ...n, summarize: 'running' }))
              addLog('summarize', 'RETRY_WAIT', 'RUNNING', 2, 'Retry attempt 2 dispatched')

              schedule(() => {
                setNodes((n) => ({ ...n, summarize: 'succeeded' }))
                setEdges((e) => ({ ...e, '2a': true }))
                addLog('summarize', 'RUNNING', 'SUCCEEDED', 2, '✓ Summary generated')

                // Step 3: Fan-in report synthesis gate
                schedule(() => {
                  setNodes((n) => ({ ...n, report: 'running' }))
                  addLog('report', 'READY', 'RUNNING', 1, 'Injecting upstream inputs [summary, entities]')

                  schedule(() => {
                    setNodes((n) => ({ ...n, report: 'succeeded' }))
                    addLog('report', 'RUNNING', 'SUCCEEDED', 1, '✓ Executive Report synthesized')
                    setStatus('SUCCEEDED')
                    setIsRunning(false)
                  }, 750)
                }, 400)
              }, 800)
            }, 1200)
          }, 700)
        }, 400)
      }, 700)
    }, 300)
  }

  const getNodeColor = (state) => {
    switch (state) {
      case 'ready':
        return { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.08)', text: 'State: READY', textColor: '#60a5fa' }
      case 'running':
        return { stroke: 'var(--color-interactive)', fill: 'rgba(229, 72, 77, 0.16)', text: 'State: RUNNING...', textColor: '#ff6b6b' }
      case 'retry':
        return { stroke: '#eab308', fill: 'rgba(234, 179, 8, 0.2)', text: '429: RETRY WAIT (1.0s)', textColor: '#fbbf24' }
      case 'succeeded':
        return { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.15)', text: 'State: SUCCEEDED ✓', textColor: '#34d399' }
      default:
        return { stroke: 'rgba(255, 255, 255, 0.16)', fill: 'rgba(15, 15, 18, 0.9)', text: 'State: PENDING', textColor: 'rgba(255, 255, 255, 0.45)' }
    }
  }

  const retrieveStyle = getNodeColor(nodes.retrieve)
  const summarizeStyle = getNodeColor(nodes.summarize)
  const extractStyle = getNodeColor(nodes.extract)
  const reportStyle = getNodeColor(nodes.report)

  return (
    <div className="oe-sim-panel">
      <div className="oe-sim-head">
        <div className="oe-sim-title-group">
          <div className="oe-sim-title">
            <span>⚡ Interactive Workflow Execution Simulator</span>
            <span className={`oe-sim-status-badge oe-sim-status-badge--${status.toLowerCase()}`}>
              {status}
            </span>
          </div>
          <p className="oe-sim-desc">
            Observe DAG dependencies, concurrent fan-out, finish-time 429 backoff retry, and write-ahead SQLite audit logs in real time.
          </p>
        </div>
        <div className="oe-sim-controls">
          <button
            type="button"
            className="oe-sim-btn oe-sim-btn--run"
            onClick={startSimulation}
            disabled={isRunning}
          >
            {isRunning ? 'Executing Run...' : '▶ Run Workflow'}
          </button>
          <button
            type="button"
            className="oe-sim-btn oe-sim-btn--reset"
            onClick={resetSimulation}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="oe-sim-canvas-box">
        <svg viewBox="0 0 680 180" className="oe-sim-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="oe-sim-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="rgba(255, 255, 255, 0.4)" />
            </marker>
            <marker id="oe-sim-arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
          </defs>

          <path
            d="M 140 90 C 190 90, 190 45, 240 45"
            stroke={edges['1a'] ? '#10b981' : 'rgba(255, 255, 255, 0.2)'}
            strokeWidth={edges['1a'] ? 2.2 : 1.5}
            fill="none"
            markerEnd={edges['1a'] ? 'url(#oe-sim-arrow-active)' : 'url(#oe-sim-arrow)'}
            className={`oe-sim-edge ${edges['1a'] ? 'oe-sim-edge--flow' : ''}`}
          />
          <path
            d="M 140 90 C 190 90, 190 135, 240 135"
            stroke={edges['1b'] ? '#10b981' : 'rgba(255, 255, 255, 0.2)'}
            strokeWidth={edges['1b'] ? 2.2 : 1.5}
            fill="none"
            markerEnd={edges['1b'] ? 'url(#oe-sim-arrow-active)' : 'url(#oe-sim-arrow)'}
            className={`oe-sim-edge ${edges['1b'] ? 'oe-sim-edge--flow' : ''}`}
          />
          <path
            d="M 400 45 C 450 45, 450 90, 500 90"
            stroke={edges['2a'] ? '#10b981' : 'rgba(255, 255, 255, 0.2)'}
            strokeWidth={edges['2a'] ? 2.2 : 1.5}
            fill="none"
            markerEnd={edges['2a'] ? 'url(#oe-sim-arrow-active)' : 'url(#oe-sim-arrow)'}
            className={`oe-sim-edge ${edges['2a'] ? 'oe-sim-edge--flow' : ''}`}
          />
          <path
            d="M 400 135 C 450 135, 450 90, 500 90"
            stroke={edges['2b'] ? '#10b981' : 'rgba(255, 255, 255, 0.2)'}
            strokeWidth={edges['2b'] ? 2.2 : 1.5}
            fill="none"
            markerEnd={edges['2b'] ? 'url(#oe-sim-arrow-active)' : 'url(#oe-sim-arrow)'}
            className={`oe-sim-edge ${edges['2b'] ? 'oe-sim-edge--flow' : ''}`}
          />

          <g transform="translate(40, 65)">
            <rect width="100" height="50" rx="3" fill={retrieveStyle.fill} stroke={retrieveStyle.stroke} strokeWidth="1.8" />
            <text x="50" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#f5f5f5" fontFamily="var(--font-mono)">1. Retrieve</text>
            <text x="50" y="37" textAnchor="middle" fontSize="8.5" fill={retrieveStyle.textColor} fontFamily="var(--font-mono)">{retrieveStyle.text}</text>
          </g>

          <g transform="translate(240, 20)">
            <rect width="160" height="50" rx="3" fill={summarizeStyle.fill} stroke={summarizeStyle.stroke} strokeWidth="1.8" />
            <text x="80" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#f5f5f5" fontFamily="var(--font-mono)">2A. Summarize LLM</text>
            <text x="80" y="37" textAnchor="middle" fontSize="8.5" fill={summarizeStyle.textColor} fontFamily="var(--font-mono)">{summarizeStyle.text}</text>
          </g>

          <g transform="translate(240, 110)">
            <rect width="160" height="50" rx="3" fill={extractStyle.fill} stroke={extractStyle.stroke} strokeWidth="1.8" />
            <text x="80" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#f5f5f5" fontFamily="var(--font-mono)">2B. Extract Entities</text>
            <text x="80" y="37" textAnchor="middle" fontSize="8.5" fill={extractStyle.textColor} fontFamily="var(--font-mono)">{extractStyle.text}</text>
          </g>

          <g transform="translate(500, 65)">
            <rect width="140" height="50" rx="3" fill={reportStyle.fill} stroke={reportStyle.stroke} strokeWidth="1.8" />
            <text x="70" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="#f5f5f5" fontFamily="var(--font-mono)">3. Report Gate</text>
            <text x="70" y="37" textAnchor="middle" fontSize="8.5" fill={reportStyle.textColor} fontFamily="var(--font-mono)">{reportStyle.text}</text>
          </g>
        </svg>
      </div>

      <div className="oe-sim-log-panel">
        <div className="oe-sim-log-head">
          <span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SQLite WAL Audit Trail (task_events table)
          </span>
          <span>{logs.length - 1} transitions recorded</span>
        </div>
        <div className="oe-sim-log-stream" ref={logStreamRef}>
          {logs.map((log) => (
            <div key={log.id} className="oe-sim-log-row">
              <span className="text-zinc-500">[{log.time}s]</span>
              <span className="text-amber-400 font-bold">{log.task.padEnd(9)}</span>
              <span className="text-zinc-400">{log.oldSt}</span>
              <span className="text-zinc-500">→</span>
              <span
                className={`font-bold ${
                  log.newSt === 'SUCCEEDED'
                    ? 'text-emerald-400'
                    : log.newSt === 'RETRY_WAIT'
                    ? 'text-yellow-400'
                    : log.newSt === 'RUNNING'
                    ? 'text-cyan-400'
                    : 'text-zinc-300'
                }`}
              >
                {log.newSt}
              </span>
              <span className="text-zinc-500">(attempt {log.attempt})</span>
              {log.note && <span className="text-amber-300/90">{log.note}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SingleWriterArchitectureDiagram() {
  return (
    <div className="oe-arch-card">
      <div className="oe-arch-head">
        <span>Architectural Topology · Single-Writer SQLite Protocol</span>
        <small>Zero Worker DB Access · Exclusive Coordinator Ownership · Write-Ahead WAL Audit Logging</small>
      </div>
      <div className="oe-arch-visual">
        <svg viewBox="0 0 880 340" className="oe-arch-svg" role="img" aria-label="Single-Writer SQLite Architecture Diagram">
          <defs>
            <marker id="oe-arrow-main" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--color-interactive)" />
            </marker>
            <marker id="oe-arrow-dim" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(255,255,255,0.45)" />
            </marker>
          </defs>

          {/* Client API / CLI Tool */}
          <rect x="290" y="16" width="300" height="52" rx="3" className="oe-arch-box" />
          <text x="440" y="38" className="oe-arch-title" textAnchor="middle">Client API / CLI Tool</text>
          <text x="440" y="54" className="oe-arch-subtitle" textAnchor="middle">WorkflowBuilder · CLI (validate / run / resume)</text>

          {/* Line Client -> Coordinator */}
          <line x1="440" y1="68" x2="440" y2="104" stroke="var(--color-interactive)" strokeWidth="2" markerEnd="url(#oe-arrow-main)" />
          <line x1="440" y1="68" x2="440" y2="104" className="oe-arch-flow-edge" strokeWidth="2" />

          {/* Coordinator */}
          <rect x="240" y="106" width="400" height="74" rx="4" className="oe-arch-box oe-arch-box--coord" />
          <text x="440" y="130" className="oe-arch-title oe-arch-title--highlight" textAnchor="middle">Coordinator (Exclusive Single-Writer)</text>
          <text x="440" y="148" className="oe-arch-subtitle" textAnchor="middle">Event Loop & Scheduler · 627 µs Overhead · 1,594 tasks/sec</text>
          <text x="440" y="165" className="oe-arch-subdetail" textAnchor="middle">PRAGMA busy_timeout=5000 · synchronous=NORMAL · WAL mode</text>

          {/* Down-Left Arrow: Coordinator -> Workers */}
          <path d="M 320 180 L 320 216 L 190 216 L 190 236" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" markerEnd="url(#oe-arrow-dim)" />
          <path d="M 320 180 L 320 216 L 190 216 L 190 236" fill="none" className="oe-arch-flow-edge" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8" />
          <text x="215" y="208" className="oe-arch-edge-label" textAnchor="middle">1. Non-blocking Task Dispatch</text>

          {/* Down-Right Arrow: Coordinator -> SQLite */}
          <path d="M 560 180 L 560 216 L 690 216 L 690 236" fill="none" stroke="var(--color-interactive)" strokeWidth="2" markerEnd="url(#oe-arrow-main)" />
          <path d="M 560 180 L 560 216 L 690 216 L 690 236" fill="none" className="oe-arch-flow-edge" strokeWidth="2" />
          <text x="670" y="208" className="oe-arch-edge-label oe-arch-edge-label--highlight" textAnchor="middle">Write-Ahead Log (Exclusive DB Access · 22.36 µs)</text>

          {/* Worker Pool */}
          <rect x="40" y="238" width="300" height="82" rx="3" className="oe-arch-box oe-arch-box--workers" />
          <text x="190" y="262" className="oe-arch-title" textAnchor="middle">Worker Pool Backend</text>
          <text x="190" y="280" className="oe-arch-subtitle" textAnchor="middle">ThreadPoolExecutor & Spawned ProcessExecutor</text>
          <text x="190" y="300" className="oe-arch-badge-text" textAnchor="middle">ZERO WORKER DATABASE ACCESS</text>

          {/* TaskResult Future Pipe */}
          <path d="M 230 238 L 230 200 L 360 200 L 360 182" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#oe-arrow-dim)" />
          <path d="M 230 238 L 230 200 L 360 200 L 360 182" fill="none" className="oe-arch-flow-edge" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
          <text x="295" y="194" className="oe-arch-edge-label" textAnchor="middle">Return TaskResult via Future / Pipe</text>

          {/* SQLite DB */}
          <rect x="540" y="238" width="300" height="82" rx="3" className="oe-arch-box oe-arch-box--db" />
          <text x="690" y="262" className="oe-arch-title" textAnchor="middle">SQLite WAL Database</text>
          <text x="690" y="280" className="oe-arch-subtitle" textAnchor="middle">task_events (44.7k writes/s) · runs · task_outputs</text>
          <text x="690" y="300" className="oe-arch-badge-text oe-arch-badge-text--secure" textAnchor="middle">100% Parameterized SQL · Zero Injections</text>
        </svg>
      </div>
      <div className="oe-arch-points">
        <div className="oe-arch-point">
          <strong>1. Zero Worker DB Access</strong>
          <p>Worker threads and child processes never receive SQLite connection handles, eliminating database lock contention at the architectural root.</p>
        </div>
        <div className="oe-arch-point">
          <strong>2. Exclusive Coordinator Ownership</strong>
          <p>A single dedicated coordinator thread owns the SQLite handle, writing state transitions to task_events before updating in-memory status.</p>
        </div>
        <div className="oe-arch-point">
          <strong>3. Hardened WAL Pragma Rules</strong>
          <p>Engineered with PRAGMA journal_mode = WAL, PRAGMA synchronous = NORMAL, and PRAGMA busy_timeout = 5000 for 44,730 writes/sec durability.</p>
        </div>
      </div>
    </div>
  )
}

function OeSequenceDiagram() {
  const [activeStep, setActiveStep] = useState(0)
  const steps = [
    {
      num: '01',
      title: 'Workflow Registration & State Initialization',
      from: 'Client Interface / CLI',
      to: 'Coordinator Thread',
      storage: 'SQLite WAL (runs table)',
      desc: 'Client initiates run_workflow(workflow, task_runner, max_concurrency=4). Coordinator writes an atomic INSERT INTO runs (status="running", started_at=now) before dispatching any tasks.',
      invariant: 'Deterministic Run ID · Atomically persisted before dispatch loop commences.',
    },
    {
      num: '02',
      title: 'Topological Fixpoint Evaluation & State Commit',
      from: 'Coordinator Loop',
      to: 'SQLite WAL (task_events)',
      storage: 'task_events table (22.36 µs write latency)',
      desc: 'schedule_once() traverses DAG dependencies. Eligible tasks without unresolved upstream dependencies advance PENDING → READY → RUNNING. All transitions commit to task_events before in-memory state mutation.',
      invariant: 'Single-Writer Persistence · Memory state never leads disk state.',
    },
    {
      num: '03',
      title: 'Non-Blocking Async Worker Dispatch',
      from: 'Coordinator Thread',
      to: 'Worker Pool (Thread / Process)',
      storage: 'Zero Worker DB Access',
      desc: 'Coordinator dispatches tasks asynchronously to ThreadPoolExecutor (I/O, LLM API calls) or spawned ProcessExecutor (CPU, untrusted code with true SIGKILL timeouts). Workers never receive database handles.',
      invariant: 'Zero DB Contention · Eliminates "database is locked" errors at architectural root.',
    },
    {
      num: '04',
      title: 'Task Result Serialization & Data Propagation',
      from: 'Worker Pool',
      to: 'Coordinator Thread',
      storage: 'task_outputs table',
      desc: 'Worker returns frozen TaskResult(ok=True, output={...}) via Future pipe. Coordinator serializes output into task_outputs table, marks task SUCCEEDED, and injects payload into downstream task.inputs.',
      invariant: 'Typed Payload Propagation · Immutable TaskResult passed directly to child inputs.',
    },
    {
      num: '05',
      title: 'Transient 429 Recovery & Finish-Time Backoff',
      from: 'Worker Error (HTTP 429)',
      to: 'Coordinator Scheduler',
      storage: 'task_events (RETRY_WAIT)',
      desc: 'On transient failure or timeout (attempts < max), Coordinator logs RETRY_WAIT and computes next_retry_at = finished_at + (delay × 2^(attempt-1)). Coordinator sleeps until earliest next_retry_at without blocking finished branches.',
      invariant: 'Anti-Drift Backoff · Prevents thundering herd stampedes by anchoring to finish timestamp.',
    },
    {
      num: '06',
      title: 'Cascade Cancellation or Terminal Run Sync',
      from: 'Coordinator Thread',
      to: 'Client / CLI Exit',
      storage: 'runs table (UPDATE status="succeeded")',
      desc: 'If a task fails permanently, single-pass fixpoint cancellation cascades CANCELLED to all downstream nodes while parallel branches finish. Upon full completion, Coordinator updates runs table with finished_at and returns run_id.',
      invariant: 'Crash Resilient · resume_run() bypasses completed tasks without duplicate executions.',
    },
  ]

  return (
    <div className="oe-seq-panel">
      <div className="oe-seq-head">
        <div>
          <span>End-to-End Processing Workflow Sequence</span>
          <small>Section 6 · Complete Execution Lifecycle Across Coordinator, SQLite WAL, and Workers</small>
        </div>
      </div>

      <div className="oe-seq-steps-nav">
        {steps.map((s, idx) => (
          <button
            key={s.num}
            type="button"
            className={`oe-seq-step-btn ${activeStep === idx ? 'is-active' : ''}`}
            onClick={() => setActiveStep(idx)}
          >
            {s.num} {s.title.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="oe-seq-visual-card">
        <div className="oe-seq-item-box">
          <div className="oe-seq-num-badge">{steps[activeStep].num}</div>
          <div className="oe-seq-item-content">
            <h4>{steps[activeStep].title}</h4>
            <p>{steps[activeStep].desc}</p>
            <div className="oe-seq-channels">
              <span className="oe-seq-pill">Source: <strong>{steps[activeStep].from}</strong></span>
              <span className="oe-seq-pill">Target: <strong>{steps[activeStep].to}</strong></span>
              <span className="oe-seq-pill oe-seq-pill--highlight">Storage: <strong>{steps[activeStep].storage}</strong></span>
              <span className="oe-seq-pill oe-seq-pill--highlight">Guarantee: <strong>{steps[activeStep].invariant}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FinishTimeBackoffFormula() {
  return (
    <div className="oe-formula-card">
      <div className="oe-formula-head">
        <span>Finish-Time Exponential Backoff Invariant</span>
        <small>Section 5.3 · Anti-Drift Coordinator Guarantee</small>
      </div>
      <div className="oe-formula-math">
        <code>next_retry_at = finished_at + (delay_seconds × 2^(attempt - 1))</code>
      </div>
      <p className="oe-formula-explanation">
        Traditional schedulers compute retry delays from the scheduled start timestamp. When a task runs for 30–60 seconds before throwing an HTTP 429 rate limit or network timeout, a 5-second backoff expires immediately in the past, triggering stampeding thundering herds. Orchestration Engine anchors exponential backoff strictly to <code>finished_at</code>, guaranteeing a predictable cooling-off duration regardless of how long the failing task was executing.
      </p>
    </div>
  )
}



const LIFECYCLE_NOTES = {
  PENDING: 'Created, but its dependencies have not succeeded yet — the scheduler will not pick it up.',
  READY: 'Every dependency has succeeded. It can enter the next scheduling pass.',
  RUNNING: 'Executing now. A timeout fails like any execution failure and spends the same retry budget.',
  SUCCEEDED: 'Finished cleanly. Dependents waiting on it become eligible.',
  FAILED: 'Retries were exhausted. Direct and transitive dependents are cancelled.',
  RETRY_WAIT: 'Cooling down before the next attempt, still inside its retry budget.',
  CANCELLED: 'Not run: an upstream dependency failed, so the engine cancelled it.',
}

function LifecycleExplorer() {
  const [active, setActive] = useState(null)
  const path = useRef(null)
  const activate = (state, node) => {
    setActive(state)
    path.current?.querySelectorAll('.oe-state-chip').forEach((chip) => { chip.style.color = ''; chip.style.borderColor = ''; chip.style.backgroundColor = '' })
    if (node) { node.style.color = '#E5484D'; node.style.borderColor = 'rgb(229 72 77 / .85)'; node.style.backgroundColor = 'rgb(229 72 77 / .16)' }
  }
  const chip = (state, extra = '', key) => <button type="button" key={key} className={`oe-state-chip${extra ? ` ${extra}` : ''}`} onClick={(event) => activate(state, event.currentTarget)} aria-pressed={active === state}>{state}</button>
  const mainStates = ['PENDING', 'READY', 'RUNNING']
  const branchStates = ['SUCCEEDED', 'FAILED', 'RETRY_WAIT', 'CANCELLED']
  return <div className="oe-state-machine">
    <div className="oe-state-machine-heading"><span>Task lifecycle</span><small>Transitions are validated before they are accepted — select a state</small></div>
    <div className="oe-state-list">
      <div ref={path} className="oe-state-path">
        {mainStates.map((state, index) => [chip(state, '', state), index < mainStates.length - 1 ? <i aria-hidden="true" key={`${state}-arrow`}>→</i> : null])}
      </div>
      <div className="oe-state-outcomes"><small>Possible outcomes</small><div>{branchStates.map((state) => chip(state, 'oe-state-chip--branch', state))}</div></div>
    </div>
    <p className="oe-lifecycle-readout" role="status">{active ? LIFECYCLE_NOTES[active] : 'Select a state to see what the engine guarantees at that point.'}</p>
    <div className="oe-verification-strip mt-3">
      <p><b>01 / Fixpoint Transitive Cancel</b><span>When an upstream task fails permanently, all downstream dependents (direct and indirect) are cancelled in a single scheduling pass. Independent branches proceed to completion.</span></p>
      <p><b>02 / Finish-Time Exponential Backoff</b><span>next_retry_at = finished_at + (delay_seconds × 2^(attempt - 1)). Anchored strictly to finished_at to prevent stampeding herd retries after long execution timeouts.</span></p>
      <p><b>03 / Crash Recovery & Resume</b><span>Interrupted runs recover to READY via resume_run(); previously succeeded tasks are bypassed with zero duplicate side effects.</span></p>
    </div>
  </div>
}

function DurabilityStepper() {
  const steps = [
    { label: 'Validate transition', detail: 'Formal state machine verification before any write. The transition is checked against valid DAG edge invariants; illegal transitions never touch SQLite.' },
    { label: 'Append SQLite WAL event', detail: 'The event is committed to task_events with workflow_id, seq, attempt, inputs/outputs at 44,730 writes/sec (22.36 µs latency). This write is the atomic commit point.' },
    { label: 'Update live state', detail: 'Only after the write succeeds does the in-memory TaskState advance. A failed write leaves live state behind durable history, never ahead of it.' },
    { label: 'Crash resume ready', detail: 'Upon process kill or SIGKILL, resume_run(run_id) inspects SQLite WAL history and re-queues ready nodes without re-executing succeeded steps.' },
  ]
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto || reduceMotion()) return undefined
    const id = setInterval(() => setActive((current) => (current + 1) % steps.length), 3400)
    return () => clearInterval(id)
  }, [auto])
  return <div className="oe-durability-flow" aria-label="State transition persistence order">
    {steps.map((step, index) => [
      <button key={step.label} type="button" className={`oe-flow-step${index === active ? ' is-active' : ''}`} aria-pressed={index === active} onClick={() => { setAuto(false); setActive(index) }}><span>{`0${index + 1} ${step.label}`}</span></button>,
      index < steps.length - 1 ? <i aria-hidden="true" key={`${step.label}-arrow`}>→</i> : null,
    ])}
    <p className="oe-flow-detail"><span key={active} className="oe-flow-detail-text">{steps[active].detail}</span><small>{`step 0${active + 1} / 04${auto ? ' · auto-advancing' : ''}`}</small></p>
  </div>
}

function OeDecisionMatrix() {
  const dimensions = [
    { name: 'External Dependencies', engine: '0 (Pure Python Stdlib)', airflow: '100+ pip packages', temporal: 'Client SDK + Cluster', celery: 'Redis/RabbitMQ + billiard', scripts: '0 to N' },
    { name: 'Setup Overhead', engine: 'Zero (pip install)', airflow: 'Docker, Postgres, Redis', temporal: 'Temporal Cluster (Go/DB)', celery: 'Broker & Worker Daemon', scripts: 'None' },
    { name: 'Startup / Cold-Start', engine: '< 10 milliseconds', airflow: '30 – 120 seconds', temporal: 'Seconds (cluster RPC)', celery: '5 – 15 seconds', scripts: '~0 ms' },
    { name: 'Memory Footprint', engine: '~25 MB', airflow: '500 MB – 2 GB+', temporal: '250 MB – 1 GB+', celery: '100 MB – 300 MB', scripts: '~20 MB' },
    { name: 'Crash Durability', engine: 'SQLite WAL write-ahead', airflow: 'Postgres state tables', temporal: 'Event History Server', celery: 'Broker persistent queue', scripts: 'None (State lost on kill)' },
    { name: 'In-Process Resume', engine: 'Yes (resume_run)', airflow: 'Scheduler re-run', temporal: 'Event replay', celery: 'Manual idempotency', scripts: 'None' },
    { name: 'Timeout Enforcement', engine: 'True SIGKILL (Process)', airflow: 'Worker soft/hard kills', temporal: 'Activity Heartbeats', celery: 'OS signal limits', scripts: 'Complex threading bugs' },
    { name: 'Data Propagation', engine: 'TaskResult → task.inputs', airflow: 'XComs (size-limited)', temporal: 'Activity return types', celery: 'AsyncResult backend', scripts: 'In-memory variables' },
  ]

  return (
    <div className="oe-matrix">
      <div className="oe-matrix-scroll">
        <table className="oe-matrix-table" role="table" aria-label="Comparative Decision Matrix">
          <thead>
            <tr>
              <th>Capability</th>
              <th className="oe-matrix-highlight">Orchestration Engine (v0.9.0)</th>
              <th>Apache Airflow</th>
              <th>Temporal.io</th>
              <th>Celery</th>
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim) => (
              <tr key={dim.name}>
                <td className="oe-matrix-dim">{dim.name}</td>
                <td className="oe-matrix-highlight">{dim.engine}</td>
                <td>{dim.airflow}</td>
                <td>{dim.temporal}</td>
                <td>{dim.celery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OeConcurrencyBenchmarks() {
  const scaling = [
    { workers: '1 Worker (max_concurrency=1)', time: '0.8105s', speedup: '1.00x', efficiency: '100% baseline', pct: 12.5 },
    { workers: '2 Workers (max_concurrency=2)', time: '0.4077s', speedup: '1.99x speedup', efficiency: '99.4% efficiency', pct: 25 },
    { workers: '4 Workers (max_concurrency=4)', time: '0.2044s', speedup: '3.97x speedup', efficiency: '99.1% efficiency', pct: 50 },
    { workers: '8 Workers (max_concurrency=8)', time: '0.1031s', speedup: '7.86x speedup', efficiency: '98.2% efficiency', pct: 100 },
  ]

  return (
    <div className="oe-benchmarks-panel">
      <div className="oe-bench-head">
        <span>Measured Scaling Efficiency · Linux x86_64, 24-core SSD</span>
        <small>16 parallel tasks executing 50ms I/O latency under concurrent coordinator dispatch</small>
      </div>
      <div className="oe-bench-list">
        {scaling.map((item) => (
          <div key={item.workers} className="oe-bench-row">
            <div className="oe-bench-info">
              <strong>{item.workers}</strong>
              <span>{item.time}</span>
              <span className="oe-bench-badge">{item.speedup}</span>
              <small>{item.efficiency}</small>
            </div>
            <div className="oe-bench-track">
              <div className="oe-bench-fill" style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OeBlueprintsPanel() {
  const [activeTab, setActiveTab] = useState('agent')

  return (
    <div className="oe-blueprints">
      <div className="oe-blueprints-nav">
        <button
          type="button"
          className={`oe-blueprint-tab${activeTab === 'agent' ? ' is-active' : ''}`}
          onClick={() => setActiveTab('agent')}
        >
          <span>Blueprint A</span>
          <strong>AI Agent Pipeline</strong>
        </button>
        <button
          type="button"
          className={`oe-blueprint-tab${activeTab === 'sre' ? ' is-active' : ''}`}
          onClick={() => setActiveTab('sre')}
        >
          <span>Blueprint B</span>
          <strong>SRE Incident Triage</strong>
        </button>
        <button
          type="button"
          className={`oe-blueprint-tab${activeTab === 'api' ? ' is-active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          <span>Blueprint C</span>
          <strong>Public API & Runner</strong>
        </button>
      </div>

      <div className="oe-blueprint-content">
        {activeTab === 'agent' && (
          <div>
            <div className="oe-blueprint-header">
              <h4>Multi-Step AI Agent Pipeline with HTTP 429 Exponential Backoff & Synthesis</h4>
              <p>Deterministic execution of knowledge retrieval, parallel LLM summarization and entity extraction, and executive briefing synthesis gate with structured input injection.</p>
            </div>
            <div className="oe-blueprint-dag">
              <div className="oe-blueprint-node">
                1. Knowledge Retrieval
                <small>Vector DB / Search (timeout: 10s · TaskResult output)</small>
              </div>
              <div className="oe-blueprint-branch">
                <div className="oe-blueprint-node">
                  2A. Summarize Findings
                  <small>LLM inference · Auto-retry on HTTP 429 (backoff 1.0s, max 3 attempts)</small>
                </div>
                <div className="oe-blueprint-node">
                  2B. Extract Entities
                  <small>LLM inference · JSON Schema structured validation</small>
                </div>
              </div>
              <div className="oe-blueprint-node oe-blueprint-node--target">
                3. Executive Briefing Synthesis
                <small>Depends on [summarize, extract] · task.inputs aggregation gate</small>
              </div>
            </div>
            <div className="oe-verification-strip mb-4">
              <p><b>01 / Transient 429 Recovery</b><span>Configurable exponential backoff (delay_seconds=1.0, max_attempts=3) anchored to finish timestamp.</span></p>
              <p><b>02 / Concurrent Fan-Out</b><span>Executes entity extraction and summarization concurrently across thread worker pool (max_concurrency=2).</span></p>
              <p><b>03 / Data Flow Propagation</b><span>Upstream outputs pass directly to child task prompts via typed task.inputs["summarize"].</span></p>
            </div>
            <pre className="oe-blueprint-code">
{`# Blueprint A: examples/agent_pipeline.py
from orchestration_engine import (
    WorkflowBuilder,
    RetryPolicy,
    TaskResult,
    get_connection,
    run_workflow,
)

# 1. Construct DAG with fluent builder
workflow = (
    WorkflowBuilder("agent-pipeline", default_timeout_seconds=30.0)
    .task("retrieve", name="Retrieve Docs", timeout_seconds=10.0)
    .task("summarize", name="Summarize", dependencies=["retrieve"], 
          retry_policy=RetryPolicy(max_attempts=3, delay_seconds=1.0))
    .task("extract", name="Extract Entities", dependencies=["retrieve"])
    .task("report", name="Executive Report", dependencies=["summarize", "extract"])
    .build()
)

# 2. Define business logic with typed outputs
def agent_runner(task):
    if task.task_id == "retrieve":
        return TaskResult(ok=True, output={"docs": ["Doc A", "Doc B"]})
    elif task.task_id == "report":
        # Access outputs from upstream tasks cleanly:
        summary = task.inputs["summarize"]["summary"]
        entities = task.inputs["extract"]["entities"]
        return TaskResult(ok=True, output={"report": f"{summary} | {entities}"})
    return TaskResult(ok=True)`}
            </pre>
          </div>
        )}

        {activeTab === 'sre' && (
          <div>
            <div className="oe-blueprint-header">
              <h4>Autonomous SRE Incident Triage, Mitigation & Crash Resumption</h4>
              <p>Multi-source diagnostic fan-out with root cause synthesis and fail-safe transitive cancellation, designed to survive coordinator SIGKILL and resume with zero duplicates.</p>
            </div>
            <div className="oe-blueprint-dag">
              <div className="oe-blueprint-node">
                1. Ingest Alert
                <small>Critical probe: Error Rate &gt; 2%</small>
              </div>
              <div className="oe-blueprint-branch--three">
                <div className="oe-blueprint-node">
                  2A. Check Logs
                  <small>Scan exception patterns</small>
                </div>
                <div className="oe-blueprint-node">
                  2B. Inspect DB Pool
                  <small>Check saturation metrics</small>
                </div>
                <div className="oe-blueprint-node">
                  2C. Ping Dependencies
                  <small>Check upstream services</small>
                </div>
              </div>
              <div className="oe-blueprint-node">
                3. Synthesize RCA
                <small>Root cause correlation from all 3 diagnostic streams</small>
              </div>
              <div className="oe-blueprint-node">
                4. Apply Mitigation
                <small>Scale pool / Reset connections</small>
              </div>
              <div className="oe-blueprint-node oe-blueprint-node--target">
                5. Verify Resolution
                <small>Confirm error rate &lt; 1% · Cancelled if mitigation fails</small>
              </div>
            </div>
            <div className="oe-verification-strip mb-4">
              <p><b>01 / Diagnostic Fan-Out</b><span>Queries logs, database metrics, and service health simultaneously (max_concurrency=3).</span></p>
              <p><b>02 / Root Cause Synthesis</b><span>Fan-in task correlates diagnostic streams to isolate connection pool exhaustion.</span></p>
              <p><b>03 / Fixpoint Cancellation</b><span>If automated mitigation fails, verification steps are cancelled, preventing premature incident closure.</span></p>
            </div>
            <pre className="oe-blueprint-code">
{`# Blueprint B: examples/incident_triage.py
from orchestration_engine import WorkflowBuilder, RetryPolicy, TaskResult, resume_run, run_workflow

workflow = (
    WorkflowBuilder("incident-triage")
    .task("alert", name="Ingest Alert")
    .task("logs", name="Check Logs", dependencies=["alert"])
    .task("metrics", name="Inspect DB Pool", dependencies=["alert"])
    .task("deps", name="Ping Dependencies", dependencies=["alert"])
    .task("rca", name="Synthesize RCA", dependencies=["logs", "metrics", "deps"])
    .task("remediate", name="Apply Mitigation", dependencies=["rca"])
    .task("verify", name="Verify Resolution", dependencies=["remediate"])
    .build()
)

# Coordinator crash recovery:
# If host process dies during isolate_node, state is safe in SQLite WAL.
recovered_run = resume_run(conn=conn, run_id=run_id)
# Successfully completed steps (alert, logs, metrics, deps, rca) are loaded
# from SQLite task_outputs and bypassed; only interrupted steps resume.`}
            </pre>
          </div>
        )}

        {activeTab === 'api' && (
          <div>
            <div className="oe-blueprint-header">
              <h4>Public API & Code Construction (Zero Runtime Dependencies)</h4>
              <p>Strictly typed surface with 25 frozen public symbols, SQLite WAL persistence, thread/process execution, and full compliance with strict mypy across 36 source files.</p>
            </div>
            <div className="oe-verification-strip mb-4">
              <p><b>01 / Standard Library Only</b><span>Zero third-party runtime dependencies; pure Python 3.12+ (sqlite3, concurrent.futures, dataclasses).</span></p>
              <p><b>02 / Single-Writer Coordinator</b><span>44,730 writes/sec in SQLite WAL mode; zero database locking issues under high multi-worker concurrency.</span></p>
              <p><b>03 / In-Process Resume</b><span>resume_run(conn, run_id) restores workflow directly from disk without duplicate executions.</span></p>
            </div>
            <pre className="oe-blueprint-code">
{`# Blueprint C: Pure Python 3.12+ Stdlib Execution
from orchestration_engine import (
    WorkflowBuilder,
    RetryPolicy,
    TaskResult,
    Hooks,
    get_connection,
    run_workflow,
    resume_run,
)
import time

conn = get_connection("prod.db")
run_id = run_workflow(
    workflow=workflow,
    task_states={},
    time_source=time.time,
    task_runner=agent_runner,
    conn=conn,
    max_concurrency=4,
    executor="thread",  # or "process" with true SIGKILL isolation
)
print(f"Workflow finished: run_id={run_id}")`}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

function OeTransformationGrid() {
  const gaps = [
    {
      id: 'G1 · Architecture',
      title: 'Decoupled Persistence & Concurrency',
      before: 'Single threaded dispatch tightly coupled with DB lock contention during task execution.',
      after: 'Single-Writer Coordinator architecture with Thread & Process worker pools; SQLite WAL handles 44,730 writes/s with zero contention.',
    },
    {
      id: 'G2 & G4 · Execution Safety',
      title: 'Non-Blocking Timeouts & True SIGKILL',
      before: 'Thread joins stalled scheduler loop; subprocess timeouts could leave orphan zombie workers.',
      after: 'Non-blocking concurrent polling; process executor isolates untrusted jobs and issues true POSIX SIGKILL upon deadline expiry.',
    },
    {
      id: 'G3 · Dependency Engine',
      title: 'Single-Pass Fixpoint Transitive Cancellation',
      before: 'Cancelling a failed node left deep downstream branches dangling in PENDING or executing illegally.',
      after: 'Deterministic topological fixpoint algorithm cascades cancellation across arbitrary DAG depths while preserving unaffected parallel branches.',
    },
    {
      id: 'G5 · Reliability',
      title: 'In-Process Crash Resumption (resume_run)',
      before: 'Host SIGKILL or process crash destroyed execution state; restarting re-ran side effects from scratch.',
      after: 'resume_run() reads SQLite WAL task_events and task_outputs; succeeded tasks are reconstructed as TaskResult and never re-executed.',
    },
    {
      id: 'G6 · Data Plane',
      title: 'Typed Data Passing (TaskResult → task.inputs)',
      before: 'Tasks returned untyped boolean success flags; no mechanism to pass payloads between DAG steps.',
      after: 'Frozen TaskResult dataclass serialized to relational task_outputs table and injected into downstream task.inputs arguments.',
    },
    {
      id: 'G7–G13 · Production Readiness',
      title: 'CLI, Dynamic Validation & Safety Limits',
      before: 'Hardcoded relative DB path, no CLI, 58 tests, unvalidated cyclical DAG inputs.',
      after: 'Configurable/in-memory SQLite, 162 tests (100% pass, 0 flakes, 91.5% cov), 10MB/5k task guard limits, zero-dep CLI with strict exit codes (0, 1, 2, 3).',
    },
  ]

  return (
    <div className="oe-transform-grid">
      <div className="oe-transform-head">
        <div>
          <span className="oe-transform-badge oe-transform-badge--before">v0.1.0 Prototype</span>
          <span className="oe-transform-arrow"> → </span>
          <span className="oe-transform-badge oe-transform-badge--after">v0.9.0 Production Beta</span>
        </div>
        <small style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
          All 13 Architectural Gaps (G1–G13) Closed via ADRs
        </small>
      </div>
      <div className="oe-transform-list">
        {gaps.map((gap) => (
          <div key={gap.id} className="oe-transform-card">
            <h4>{gap.id}: {gap.title}</h4>
            <div className="oe-transform-row">
              <div className="oe-transform-cell oe-transform-cell--before">
                <span className="oe-transform-tag">v0.1.0 Prototype</span>
                <p>{gap.before}</p>
              </div>
              <div className="oe-transform-cell oe-transform-cell--after">
                <span className="oe-transform-tag">v0.9.0 Beta</span>
                <p>{gap.after}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TaskFaultDrillExplorer() {
  const [drillMode, setDrillMode] = useState('transient') // 'transient' | 'cascade' | 'sigkill'
  const [phase, setPhase] = useState('idle') // 'idle' | 'running' | 'done'
  const [activeCodeTab, setActiveCodeTab] = useState('python')
  const [copiedCode, setCopiedCode] = useState(false)
  const [nodes, setNodes] = useState({
    task1: { state: 'idle', label: 'idle', attempt: 1 },
    task2: { state: 'idle', label: 'idle', attempt: 1, error: null },
    task3: { state: 'waiting', label: 'waiting', attempt: 0 },
    task4: { state: 'idle', label: 'idle', attempt: 1 },
  })
  const [logs, setLogs] = useState([
    { ts: '0.000s', text: 'Drill initialized. Select a failure mode and click "Run Drill".', type: 'info' }
  ])
  const [narrativeText, setNarrativeText] = useState(
    'Task 03 depends on Task 01 and Task 02. Task 04 runs in an independent parallel branch. Select a failure drill to observe engine fault invariants in real time.'
  )
  const timeoutsRef = useRef([])
  const logStreamRef = useRef(null)

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  useEffect(() => () => clearAllTimeouts(), [])

  useEffect(() => {
    if (logStreamRef.current) {
      logStreamRef.current.scrollTop = logStreamRef.current.scrollHeight
    }
  }, [logs])

  const addLog = (ts, text, type = 'normal') => {
    setLogs((prev) => [...prev, { ts, text, type }])
  }

  const scheduleStep = (fn, delayMs) => {
    const id = setTimeout(fn, delayMs)
    timeoutsRef.current.push(id)
    return id
  }

  const resetDrill = (newMode = drillMode) => {
    clearAllTimeouts()
    setPhase('idle')
    setNodes({
      task1: { state: 'idle', label: 'idle', attempt: 1 },
      task2: { state: 'idle', label: 'idle', attempt: 1, error: null },
      task3: { state: 'waiting', label: 'waiting', attempt: 0 },
      task4: { state: 'idle', label: 'idle', attempt: 1 },
    })
    setLogs([
      { ts: '0.000s', text: `Switched to drill: ${newMode.toUpperCase()}. Ready to execute.`, type: 'info' }
    ])
    if (newMode === 'transient') {
      setNarrativeText('Transient Failure: Task 02 throws HTTP 429. The coordinator anchors exponential backoff strictly to finished_at (1.0s delay), recovering safely within budget.')
    } else if (newMode === 'cascade') {
      setNarrativeText('Permanent Failure: Task 02 exhausts its 3/3 retry budget. Single-Pass Fixpoint immediately marks downstream Task 03 CANCELLED while parallel Task 04 completes SUCCEEDED.')
    } else if (newMode === 'sigkill') {
      setNarrativeText('Process Isolation: Task 02 exceeds hard 15.0s timeout. ProcessExecutor issues POSIX SIGKILL to child PID, terminating the worker without zombie leaks.')
    }
  }

  const handleSelectMode = (mode) => {
    if (phase === 'running') return
    setDrillMode(mode)
    resetDrill(mode)
  }

  const runDrill = () => {
    if (phase === 'running') return
    if (phase === 'done') {
      resetDrill()
      return
    }

    clearAllTimeouts()
    setPhase('running')
    setLogs([])

    if (reduceMotion()) {
      if (drillMode === 'transient') {
        setNodes({
          task1: { state: 'succeeded', label: 'succeeded', attempt: 1 },
          task2: { state: 'succeeded', label: 'succeeded · attempt 2/3', attempt: 2, error: null },
          task3: { state: 'succeeded', label: 'succeeded', attempt: 1 },
          task4: { state: 'succeeded', label: 'succeeded', attempt: 1 },
        })
        setNarrativeText('Drill complete: Task 02 recovered via exponential backoff; all dependent tasks completed.')
      } else if (drillMode === 'cascade') {
        setNodes({
          task1: { state: 'succeeded', label: 'succeeded', attempt: 1 },
          task2: { state: 'failed', label: 'failed · 3/3 exhausted', attempt: 3, error: 'DatabaseError' },
          task3: { state: 'cancelled', label: 'cancelled · cascade', attempt: 0 },
          task4: { state: 'succeeded', label: 'succeeded', attempt: 1 },
        })
        setNarrativeText('Drill complete: Task 02 failed permanently. Downstream Task 03 was cancelled; parallel Task 04 succeeded.')
      } else {
        setNodes({
          task1: { state: 'succeeded', label: 'succeeded', attempt: 1 },
          task2: { state: 'failed', label: 'timed out · SIGKILL', attempt: 1, error: 'TimeoutError' },
          task3: { state: 'cancelled', label: 'cancelled · cascade', attempt: 0 },
          task4: { state: 'succeeded', label: 'succeeded', attempt: 1 },
        })
        setNarrativeText('Drill complete: Child worker killed via SIGKILL. Downstream cancelled; zero zombie processes.')
      }
      setPhase('done')
      return
    }

    if (drillMode === 'transient') {
      // SCENARIO 1: Transient 429 & Exponential Backoff Recovery
      scheduleStep(() => {
        addLog('0.000s', 'Pass 01: Three independent ready tasks enter dispatch loop.', 'accent')
        setNodes({
          task1: { state: 'running', label: 'running', attempt: 1 },
          task2: { state: 'running', label: 'running (attempt 1/3)', attempt: 1, error: null },
          task3: { state: 'waiting', label: 'waiting (deps: 0/2)', attempt: 0 },
          task4: { state: 'running', label: 'running', attempt: 1 },
        })
        setNarrativeText('Pass 01: Task 01, Task 02, and Task 04 are dispatched to the worker pool concurrently.')
      }, 0)

      scheduleStep(() => {
        addLog('0.340s', 'task_01: RUNNING → SUCCEEDED ({chunks: 14})', 'success')
        addLog('0.380s', 'task_04: RUNNING → SUCCEEDED (telemetry recorded)', 'success')
        setNodes((n) => ({
          ...n,
          task1: { state: 'succeeded', label: 'succeeded', attempt: 1 },
          task4: { state: 'succeeded', label: 'succeeded', attempt: 1 },
          task3: { state: 'waiting', label: 'waiting (deps: 1/2)', attempt: 0 },
        }))
        setNarrativeText('Task 01 and parallel Task 04 complete successfully. Task 03 waits for Task 02.')
      }, 750)

      scheduleStep(() => {
        addLog('0.520s', 'task_02: RUNNING → RETRY_WAIT (err: RateLimitError 429)', 'warn')
        addLog('0.521s', 'coordinator: finish-time backoff: next_retry_at = 1.521s (1.0s cooling)', 'info')
        setNodes((n) => ({
          ...n,
          task2: { state: 'retry_wait', label: 'retry_wait · cooling 1.0s', attempt: 1, error: 'HTTP 429' },
        }))
        setNarrativeText('Task 02 throws HTTP 429. Coordinator logs RETRY_WAIT to SQLite WAL and anchors cooling-off to finished_at.')
      }, 1500)

      scheduleStep(() => {
        addLog('1.520s', 'task_02: RETRY_WAIT → RUNNING (Attempt 2/3 dispatched)', 'accent')
        setNodes((n) => ({
          ...n,
          task2: { state: 'running', label: 'running (attempt 2/3)', attempt: 2, error: null },
        }))
        setNarrativeText('Cooling-off window expired. Coordinator re-enqueues Task 02 for Attempt 2 of 3.')
      }, 2500)

      scheduleStep(() => {
        addLog('1.950s', 'task_02: RUNNING → SUCCEEDED (status=200 OK)', 'success')
        setNodes((n) => ({
          ...n,
          task2: { state: 'succeeded', label: 'succeeded (attempt 2/3)', attempt: 2, error: null },
          task3: { state: 'running', label: 'running (deps ready: 2/2)', attempt: 1 },
        }))
        setNarrativeText('Task 02 recovers and succeeds! Both dependencies are terminal: Task 03 transitions to RUNNING.')
      }, 3300)

      scheduleStep(() => {
        addLog('2.380s', 'task_03: RUNNING → SUCCEEDED (report synthesized)', 'success')
        addLog('2.381s', 'run_workflow: Workflow complete (4/4 SUCCEEDED, 0 CANCELLED)', 'success')
        setNodes((n) => ({
          ...n,
          task3: { state: 'succeeded', label: 'succeeded', attempt: 1 },
        }))
        setNarrativeText('Drill complete: transient HTTP 429 recovered within retry budget. Zero orphaned dependents.')
        setPhase('done')
      }, 4100)

    } else if (drillMode === 'cascade') {
      // SCENARIO 2: Permanent Failure & Fixpoint Cascade Cancellation
      scheduleStep(() => {
        addLog('0.000s', 'Pass 01: Three ready tasks enter dispatch loop.', 'accent')
        setNodes({
          task1: { state: 'running', label: 'running', attempt: 1 },
          task2: { state: 'running', label: 'running (attempt 1/3)', attempt: 1, error: null },
          task3: { state: 'waiting', label: 'waiting (deps: 0/2)', attempt: 0 },
          task4: { state: 'running', label: 'running', attempt: 1 },
        })
        setNarrativeText('Pass 01: Tasks dispatch concurrently. Task 02 simulates a critical upstream service dependency.')
      }, 0)

      scheduleStep(() => {
        addLog('0.340s', 'task_01: RUNNING → SUCCEEDED', 'success')
        addLog('0.390s', 'task_04: RUNNING → SUCCEEDED', 'success')
        setNodes((n) => ({
          ...n,
          task1: { state: 'succeeded', label: 'succeeded', attempt: 1 },
          task4: { state: 'succeeded', label: 'succeeded', attempt: 1 },
          task3: { state: 'waiting', label: 'waiting (deps: 1/2)', attempt: 0 },
        }))
      }, 750)

      scheduleStep(() => {
        addLog('0.620s', 'task_02: RUNNING → RETRY_WAIT (attempt 1/3 failed: FatalDBError)', 'warn')
        setNodes((n) => ({
          ...n,
          task2: { state: 'retry_wait', label: 'retrying (1/3)', attempt: 1, error: 'DB Connection Refused' },
        }))
        setNarrativeText('Task 02 fails Attempt 1. Enters backoff retry...')
      }, 1500)

      scheduleStep(() => {
        addLog('1.100s', 'task_02: RUNNING → RETRY_WAIT (attempt 2/3 failed: FatalDBError)', 'warn')
        setNodes((n) => ({
          ...n,
          task2: { state: 'retry_wait', label: 'retrying (2/3)', attempt: 2, error: 'DB Connection Refused' },
        }))
        setNarrativeText('Task 02 fails Attempt 2. Retry budget depleting...')
      }, 2300)

      scheduleStep(() => {
        addLog('1.650s', 'task_02: RUNNING → FAILED (max_attempts=3 exhausted)', 'error')
        setNodes((n) => ({
          ...n,
          task2: { state: 'failed', label: 'FAILED · 3/3 EXHAUSTED', attempt: 3, error: 'FatalDBError' },
        }))
        setNarrativeText('Task 02 exhausts its maximum 3 attempts. State commits as terminal FAILED in SQLite WAL.')
      }, 3100)

      scheduleStep(() => {
        addLog('1.800s', 'coordinator: Single-pass fixpoint cancellation evaluating DAG...', 'warn')
        addLog('1.801s', 'task_03: WAITING → CANCELLED (upstream task_02 failed)', 'error')
        addLog('1.802s', 'run_workflow: Workflow terminal: FAILED (0 orphan stalls, parallel branch intact)', 'error')
        setNodes((n) => ({
          ...n,
          task3: { state: 'cancelled', label: 'CANCELLED · UPSTREAM FAILED', attempt: 0 },
        }))
        setNarrativeText('Single-Pass Fixpoint: Coordinator recursively flags Task 03 as CANCELLED. Parallel Task 04 completed safely with zero leak.')
        setPhase('done')
      }, 3900)

    } else {
      // SCENARIO 3: Hard Timeout & POSIX SIGKILL Isolation
      scheduleStep(() => {
        addLog('0.000s', 'ProcessExecutor: Spawning untrusted task in isolated child process (PID 4192)...', 'accent')
        setNodes({
          task1: { state: 'running', label: 'running', attempt: 1 },
          task2: { state: 'running', label: 'running (pid=4192)', attempt: 1, error: null },
          task3: { state: 'waiting', label: 'waiting (deps: 0/2)', attempt: 0 },
          task4: { state: 'running', label: 'running', attempt: 1 },
        })
        setNarrativeText('ProcessExecutor isolates Task 02 in a dedicated subprocess with hard timeout_seconds=15.0s.')
      }, 0)

      scheduleStep(() => {
        addLog('0.350s', 'task_01: RUNNING → SUCCEEDED', 'success')
        addLog('0.400s', 'task_04: RUNNING → SUCCEEDED', 'success')
        setNodes((n) => ({
          ...n,
          task1: { state: 'succeeded', label: 'succeeded', attempt: 1 },
          task4: { state: 'succeeded', label: 'succeeded', attempt: 1 },
        }))
      }, 750)

      scheduleStep(() => {
        addLog('0.850s', 'task_02: Subprocess enters unkillable blocking loop (ignoring GIL)...', 'warn')
        setNarrativeText('Task 02 enters an infinite C-extension loop that ignores standard Python thread interrupts.')
      }, 1600)

      scheduleStep(() => {
        addLog('1.550s', 'coordinator: Hard timeout exceeded (15.0s limit reached)', 'error')
        addLog('1.551s', 'process_executor: Issuing POSIX SIGKILL to PID 4192...', 'error')
        addLog('1.553s', 'os.kill(4192, signal.SIGKILL) returned 0 (process terminated)', 'success')
        setNodes((n) => ({
          ...n,
          task2: { state: 'failed', label: 'KILLED VIA SIGKILL (PID 4192)', attempt: 1, error: 'HardTimeout' },
          task3: { state: 'cancelled', label: 'CANCELLED · TIMEOUT CASCADE', attempt: 0 },
        }))
        setNarrativeText('POSIX SIGKILL terminates child process PID 4192 immediately. Memory reclaimed, zero zombie leaks, coordinator remains responsive.')
        setPhase('done')
      }, 2600)
    }
  }

  const copyCode = () => {
    const code = `from orchestration_engine import WorkflowBuilder, RetryPolicy, TaskResult, run_workflow

builder = WorkflowBuilder(workflow_id="fault_tolerant_pipeline")

# Step 1: Upstream Ingestion
@builder.task(name="ingest_data")
def ingest_data(context):
    return {"doc_id": "doc_9481", "chunks": 14}

# Step 2: Task with Finish-Time Retry Policy & Timeout
@builder.task(
    name="query_llm",
    retry_policy=RetryPolicy(
        max_attempts=3,
        delay_seconds=1.0,      # 1.0s -> 2.0s -> 4.0s exponential backoff
        backoff_factor=2.0,
        retry_on=(ConnectionError, TimeoutError)
    ),
    timeout_seconds=15.0        # Enforced via POSIX SIGKILL in ProcessExecutor
)
def query_llm(context):
    doc = context.inputs["ingest_data"]
    # If transient error: coordinator sleeps finished_at + backoff, then retries
    # If 3 attempts exhausted: coordinator marks FAILED and triggers fixpoint cancel
    return call_api_service(doc)

# Step 3: Dependent Task (Cascade-cancelled if Step 2 fails)
@builder.task(name="synthesize_report", dependencies=["ingest_data", "query_llm"])
def synthesize_report(context):
    return compile_summary(context.inputs)

# Step 4: Independent Parallel Task (Unaffected by Step 2 failure)
@builder.task(name="telemetry_log")
def telemetry_log(context):
    return {"status": "healthy"}

result = run_workflow(builder.build(), db_path="orchestration.db")
print("Status:", result.status)   # 'SUCCEEDED' or 'FAILED'`

    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    })
  }

  return (
    <div className="oe-fault-studio" id="oe-fault-drill">
      <div className="oe-fault-head">
        <div className="oe-fault-title-group">
          <div className="oe-fault-title">
            <span className="oe-fault-icon">⚡</span>
            <span>Task Failure, Fault Recovery & Cascade Cancellation Studio</span>
            <span className="oe-fault-badge">Interactive Invariants</span>
          </div>
          <p className="oe-fault-desc">
            Explore deterministic fault handling: transient 429 exponential backoff, single-pass fixpoint cascade cancellation, and POSIX SIGKILL process isolation.
          </p>
        </div>
        <div className="oe-fault-controls">
          <button
            type="button"
            className="oe-fault-btn oe-fault-btn--run"
            onClick={runDrill}
            disabled={phase === 'running'}
          >
            {phase === 'running' ? 'Simulating Fault...' : phase === 'done' ? '↺ Reset & Re-run' : '▶ Run Failure Drill'}
          </button>
          <button
            type="button"
            className="oe-fault-btn oe-fault-btn--reset"
            onClick={() => resetDrill()}
            disabled={phase === 'running'}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Scenario Mode Tabs */}
      <div className="oe-fault-modes" role="tablist" aria-label="Failure Scenarios">
        <button
          type="button"
          role="tab"
          aria-selected={drillMode === 'transient'}
          className={`oe-fault-mode-btn ${drillMode === 'transient' ? 'is-active' : ''}`}
          onClick={() => handleSelectMode('transient')}
        >
          <span className="oe-fault-mode-num">01</span>
          <div className="oe-fault-mode-info">
            <strong>Transient 429 & Backoff Recovery</strong>
            <small>HTTP 429 · finished_at backoff (1.0s) · attempt 2 succeeds</small>
          </div>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={drillMode === 'cascade'}
          className={`oe-fault-mode-btn ${drillMode === 'cascade' ? 'is-active' : ''}`}
          onClick={() => handleSelectMode('cascade')}
        >
          <span className="oe-fault-mode-num">02</span>
          <div className="oe-fault-mode-info">
            <strong>Permanent Failure & Fixpoint Cancel</strong>
            <small>3/3 exhausted · FAILED · downstream CANCELLED</small>
          </div>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={drillMode === 'sigkill'}
          className={`oe-fault-mode-btn ${drillMode === 'sigkill' ? 'is-active' : ''}`}
          onClick={() => handleSelectMode('sigkill')}
        >
          <span className="oe-fault-mode-num">03</span>
          <div className="oe-fault-mode-info">
            <strong>Hard Timeout & SIGKILL Isolation</strong>
            <small>Child PID terminated · 0 thread leaks · coordinator healthy</small>
          </div>
        </button>
      </div>

      {/* Visual Animated SVG DAG */}
      <div className="oe-fault-canvas-box">
        <div className="oe-fault-canvas-scroll-cue">⇄ Scroll to pan workflow DAG</div>
        <svg viewBox="0 0 940 340" className="oe-fault-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="edgeGradSuccess" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="edgeGradFail" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="edgeGradWait" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* Connectors */}
          {/* Edge A: Node 1 -> Node 3 */}
          <path
            d="M300 72 C440 72 470 125 590 135"
            className={`oe-fault-edge ${nodes.task1.state === 'succeeded' ? 'oe-fault-edge--flow' : ''}`}
            stroke={nodes.task1.state === 'succeeded' ? '#10b981' : 'rgba(255,255,255,0.18)'}
            strokeWidth={nodes.task1.state === 'succeeded' ? '2.5' : '1.5'}
            fill="none"
          />

          {/* Edge B: Node 2 -> Node 3 */}
          <path
            d="M300 178 C440 178 470 145 590 135"
            className={`oe-fault-edge ${nodes.task2.state === 'succeeded' ? 'oe-fault-edge--flow' : nodes.task2.state === 'failed' ? 'oe-fault-edge--fail' : nodes.task2.state === 'retry_wait' ? 'oe-fault-edge--retry' : ''}`}
            stroke={
              nodes.task2.state === 'succeeded'
                ? '#10b981'
                : nodes.task2.state === 'failed'
                ? '#ef4444'
                : nodes.task2.state === 'retry_wait'
                ? '#f59e0b'
                : 'rgba(255,255,255,0.18)'
            }
            strokeWidth={nodes.task2.state !== 'idle' ? '2.5' : '1.5'}
            strokeDasharray={nodes.task2.state === 'failed' ? '6 4' : nodes.task2.state === 'retry_wait' ? '4 4' : 'none'}
            fill="none"
          />

          {/* Junction Circles */}
          <circle cx="300" cy="72" r="5" fill={nodes.task1.state === 'succeeded' ? '#10b981' : '#666'} />
          <circle cx="300" cy="178" r="5" fill={nodes.task2.state === 'succeeded' ? '#10b981' : nodes.task2.state === 'failed' ? '#ef4444' : '#666'} />
          <circle cx="590" cy="135" r="5" fill={nodes.task3.state === 'succeeded' ? '#10b981' : nodes.task3.state === 'cancelled' ? '#6b7280' : '#888'} />

          {/* NODE 01: Ingest Data (Independent A) */}
          <g className={`oe-fault-node-group ${nodes.task1.state}`}>
            <rect
              x="20" y="30" width="280" height="84" rx="3"
              className={`oe-fault-node-box ${nodes.task1.state}`}
            />
            <text x="36" y="52" className="oe-fault-node-tag">TASK 01 · INDEPENDENT A</text>
            <text x="36" y="74" className="oe-fault-node-name">1. Ingest Documents</text>
            <rect
              x="36" y="84" width="105" height="20" rx="2"
              className={`oe-fault-status-pill oe-fault-status-pill--${nodes.task1.state}`}
            />
            <text x="88" y="98" textAnchor="middle" className="oe-fault-status-pill-text">
              {nodes.task1.label}
            </text>
          </g>

          {/* NODE 02: Target Worker (Query LLM / Failing Step) */}
          <g className={`oe-fault-node-group ${nodes.task2.state}`}>
            <rect
              x="20" y="132" width="280" height="92" rx="3"
              className={`oe-fault-node-box ${nodes.task2.state}`}
            />
            <text x="36" y="152" className="oe-fault-node-tag">TASK 02 · DRILL TARGET</text>
            <text x="36" y="174" className="oe-fault-node-name">2. Query LLM Service</text>
            <rect
              x="36" y="186" width={drillMode === 'sigkill' && nodes.task2.state === 'failed' ? 220 : drillMode === 'cascade' && nodes.task2.state === 'failed' ? 185 : 145} height="22" rx="2"
              className={`oe-fault-status-pill oe-fault-status-pill--${nodes.task2.state}`}
            />
            <text
              x={36 + (drillMode === 'sigkill' && nodes.task2.state === 'failed' ? 110 : drillMode === 'cascade' && nodes.task2.state === 'failed' ? 92 : 72)}
              y="201"
              textAnchor="middle"
              className="oe-fault-status-pill-text"
            >
              {nodes.task2.state === 'retry_wait' ? 'RETRY_WAIT (1.0s)' : nodes.task2.label}
            </text>
          </g>

          {/* NODE 04: Independent Parallel Branch */}
          <g className={`oe-fault-node-group ${nodes.task4.state}`}>
            <rect
              x="20" y="242" width="280" height="82" rx="3"
              className={`oe-fault-node-box ${nodes.task4.state}`}
            />
            <text x="36" y="262" className="oe-fault-node-tag">TASK 04 · PARALLEL BRANCH</text>
            <text x="36" y="284" className="oe-fault-node-name">4. Record Audit Telemetry</text>
            <rect
              x="36" y="294" width="105" height="20" rx="2"
              className={`oe-fault-status-pill oe-fault-status-pill--${nodes.task4.state}`}
            />
            <text x="88" y="308" textAnchor="middle" className="oe-fault-status-pill-text">
              {nodes.task4.label}
            </text>
          </g>

          {/* NODE 03: Downstream Dependent Gate */}
          <g className={`oe-fault-node-group ${nodes.task3.state}`}>
            <rect
              x="590" y="75" width="310" height="120" rx="3"
              className={`oe-fault-node-box ${nodes.task3.state}`}
            />
            {nodes.task3.state === 'cancelled' && (
              <rect
                x="590" y="75" width="310" height="120" rx="3"
                fill="url(#diagonalHatch)" pointerEvents="none"
              />
            )}
            <text x="608" y="100" className="oe-fault-node-tag">TASK 03 · DEPENDENT GATE</text>
            <text x="608" y="125" className="oe-fault-node-name">3. Synthesize Summary Report</text>
            <text x="608" y="145" className="oe-fault-node-sub">Depends on: [Task 01, Task 02]</text>
            <rect
              x="608" y="157" width={nodes.task3.state === 'cancelled' ? 220 : 130} height="24" rx="2"
              className={`oe-fault-status-pill oe-fault-status-pill--${nodes.task3.state}`}
            />
            <text
              x={608 + (nodes.task3.state === 'cancelled' ? 110 : 65)}
              y="173"
              textAnchor="middle"
              className="oe-fault-status-pill-text"
            >
              {nodes.task3.label}
            </text>
          </g>

          {/* Branch Isolation Annotation */}
          <path d="M300 283 L550 283" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" fill="none" />
          <text x="560" y="287" className="oe-fault-annotation">
            Parallel branch: unaffected by upstream failures
          </text>
        </svg>
      </div>

      {/* Live Narrative Status Bar */}
      <div className="oe-fault-narrative" role="status">
        <span className="oe-fault-narrative-tag">COORDINATOR INVARIANT:</span>
        <p>{narrativeText}</p>
      </div>

      {/* Telemetry Log and Python Code Example Grid */}
      <div className="oe-fault-details-grid">
        {/* Real-time SQLite WAL Audit Log */}
        <div className="oe-fault-log-panel">
          <div className="oe-fault-log-head">
            <span>● SQLITE WAL AUDIT TRAIL (TASK_EVENTS TABLE)</span>
            <small>{logs.length} events logged</small>
          </div>
          <div className="oe-fault-log-stream" ref={logStreamRef}>
            {logs.map((log, i) => (
              <div key={i} className={`oe-fault-log-row oe-fault-log-row--${log.type}`}>
                <span className="oe-fault-log-ts">[{log.ts}]</span>
                <span className="oe-fault-log-msg">{log.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Executable Code Pattern */}
        <div className="oe-fault-code-panel">
          <div className="oe-fault-code-head">
            <span>PYTHON 3.12+ STDLIB CODE PATTERN</span>
            <button type="button" className="oe-fault-code-copy" onClick={copyCode}>
              {copiedCode ? 'copied ✓' : 'copy code'}
            </button>
          </div>
          <pre className="oe-fault-code-block">
            <code>{drillMode === 'transient' ? `# 1. Transient Retry Policy Configuration
from orchestration_engine import WorkflowBuilder, RetryPolicy

builder = WorkflowBuilder(workflow_id="document_indexing")

# Step with Finish-Time Exponential Backoff
builder.add_step(
    name="query_llm",
    fn=call_llm_embeddings,
    retry_policy=RetryPolicy(
        max_attempts=3,
        delay_seconds=1.0,     # 1.0s -> 2.0s -> 4.0s
        backoff_factor=2.0,
        retry_on=(RateLimitError, TimeoutError)
    )
)
# Coordinator commits RETRY_WAIT to SQLite WAL
# next_retry_at = finished_at + (1.0s * 2^(attempt-1))` : drillMode === 'cascade' ? `# 2. Single-Pass Fixpoint Cascade Cancellation
builder.add_step(
    name="query_llm",
    fn=failing_database_query,
    retry_policy=RetryPolicy(max_attempts=3)
)

# Dependent Step: Automatically CANCELLED if query_llm fails
builder.add_step(
    name="synthesize_report",
    fn=generate_executive_summary,
    dependencies=["query_llm"]  # Fixpoint cancellation prevents orphan stalls
)

# Parallel Step: Runs and completes SUCCEEDED independently
builder.add_step(name="record_telemetry", fn=audit_logger)` : `# 3. ProcessExecutor POSIX SIGKILL Isolation
builder.add_step(
    name="untrusted_compute",
    fn=run_sandboxed_c_extension,
    timeout_seconds=15.0,        # Hard POSIX timeout limit
    executor="process"          # Child process isolation
)
# On 15.0s timeout: ProcessExecutor triggers:
# os.kill(child_pid, signal.SIGKILL)
# Memory and descriptors reclaimed; zero zombie thread leaks`}</code>
          </pre>
        </div>
      </div>

      {/* Engine Invariant Cards */}
      <div className="oe-fault-invariants">
        <article className="oe-fault-invariant-card">
          <span className="oe-fault-invariant-title">01 / Finish-Time Exponential Backoff</span>
          <p>
            <code>next_retry_at = finished_at + (delay × 2^(attempt-1))</code>. Anchoring strictly to finished_at prevents stampeding herd retries after long task execution.
          </p>
        </article>
        <article className="oe-fault-invariant-card">
          <span className="oe-fault-invariant-title">02 / Single-Pass Fixpoint Cancellation</span>
          <p>
            When an upstream task exhausts its retries, all transitive downstream dependents are marked <code>CANCELLED</code> in a single scheduling pass, while unaffected parallel branches complete.
          </p>
        </article>
        <article className="oe-fault-invariant-card">
          <span className="oe-fault-invariant-title">03 / POSIX SIGKILL Child Process Isolation</span>
          <p>
            Child workers spawned via <code>ProcessExecutor</code> are terminated with true POSIX <code>SIGKILL</code> upon timeout, preventing thread-stall leaks and GIL hangs.
          </p>
        </article>
      </div>
    </div>
  )
}

const API_ITEMS = [
  'Task · Workflow · RetryPolicy · TaskResult',
  'TaskState · WorkflowStatus · EngineConfig',
  'WorkflowBuilder · Step · DependencyMap',
  'run_workflow · run_workflow_from_file · resume_run',
  'get_workflow_status · get_workflow_history · get_task_output',
  'Hooks (on_task_start, on_task_complete, on_workflow_finish)',
  'CLI Entrypoint (orchestrate run / resume / inspect)',
  'SQLite WAL Connection Pool & Parameterized Queries',
]

function ApiSurfaceExplorer() {
  const [copied, setCopied] = useState(null)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = (item, index) => {
    const flash = () => { setCopied(index); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(null), 1300) }
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(item).then(flash).catch(flash)
    else flash()
  }
  return <div className="oe-api-list">
    {API_ITEMS.map((item, index) => <button key={item} type="button" className={`oe-api-item${copied === index ? ' is-copied' : ''}`} onClick={() => copy(item, index)} title="Copy to clipboard"><code>{copied === index ? 'copied ✓' : item}</code></button>)}
  </div>
}

function OeCliReference() {
  const [activeCmd, setActiveCmd] = useState(0)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const commands = [
    {
      name: 'install',
      syntax: 'pip install orchestration-engine  # or: install orchestration-engine',
      desc: 'Installs the production-ready Orchestration Engine package from PyPI with zero external runtime dependencies.',
      exitCode: 'Exit code 0 on successful installation into active Python 3.12+ environment.',
    },
    {
      name: 'validate',
      syntax: 'orchestration-engine validate workflow.json',
      desc: 'Performs pre-flight cyclic dependency detection, task schema verification, and input parameter validation without execution.',
      exitCode: 'Exit code 0 on success; exit code 2 on DAG cycle or schema errors.',
    },
    {
      name: 'run',
      syntax: 'orchestration-engine run workflow.json --db production.db --workers 8',
      desc: 'Executes the workflow with single-writer SQLite WAL persistence, thread/process pools, and specified maximum concurrency.',
      exitCode: 'Exit code 0 when all tasks succeed; exit code 1 if task retries exhaust.',
    },
    {
      name: 'status',
      syntax: 'orchestration-engine status <run_id> --db production.db',
      desc: 'Inspects real-time state machine counters (PENDING, RUNNING, SUCCEEDED, FAILED) of any active or archived run.',
      exitCode: 'Exit code 0 on query success; exit code 3 if DB unreadable.',
    },
    {
      name: 'history',
      syntax: 'orchestration-engine history <run_id> --db production.db',
      desc: 'Streams the linear, immutable audit log of all task_events, timestamps, retry counts, and payloads in chronological sequence.',
      exitCode: 'Exit code 0 on query success.',
    },
    {
      name: 'resume',
      syntax: 'orchestration-engine resume <run_id> --db production.db',
      desc: 'Recovers an interrupted or crashed workflow directly from SQLite WAL; skips completed steps and re-queues ready nodes.',
      exitCode: 'Exit code 0 upon resume initiation.',
    },
  ]

  const copy = (text, idx) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedIndex(idx)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopiedIndex(null), 1400)
      }).catch(() => {})
    }
  }

  const exitCodes = [
    { code: '0', meaning: 'Success', detail: 'All workflow steps reached terminal SUCCEEDED state.' },
    { code: '1', meaning: 'Task Failure', detail: 'Task failed and exhausted its RetryPolicy budget; engine healthy.' },
    { code: '2', meaning: 'Validation Error', detail: 'DAG cycle detected, missing inputs, or invalid schema.' },
    { code: '3', meaning: 'Fatal Engine Error', detail: 'Unrecoverable I/O exception, SQLite lock timeout, or OS error.' },
  ]

  return (
    <div className="oe-cli-panel">
      <div className="oe-cli-tabs">
        {commands.map((cmd, idx) => (
          <button
            key={cmd.name}
            type="button"
            className={`oe-cli-tab${activeCmd === idx ? ' is-active' : ''}`}
            onClick={() => setActiveCmd(idx)}
          >
            <code>{cmd.name}</code>
          </button>
        ))}
      </div>
      <div className="oe-cli-body">
        <div className="oe-cli-command-box" onClick={() => copy(commands[activeCmd].syntax, activeCmd)} title="Click to copy command">
          <div className="flex items-center gap-2">
            <span className="oe-cli-prompt" aria-hidden="true">$</span>
            <code>{commands[activeCmd].syntax}</code>
          </div>
          <button type="button" className="oe-cli-copy-btn">
            {copiedIndex === activeCmd ? 'copied ✓' : 'copy'}
          </button>
        </div>
        <p className="oe-cli-desc">{commands[activeCmd].desc}</p>
        <span className="oe-cli-exit-note">{commands[activeCmd].exitCode}</span>
      </div>

      <div className="oe-exit-codes-block">
        <span className="oe-exit-codes-title">Strict Deterministic Exit Codes</span>
        <div className="oe-exit-codes-grid">
          {exitCodes.map((item) => (
            <div key={item.code} className="oe-exit-item">
              <span className="oe-exit-badge">{item.code}</span>
              <div>
                <strong>{item.meaning}</strong>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const OE_TICKER_EVENTS = [
  'WAL WRITE (22.36 µs) INSERT INTO task_events (workflow_id="wf_v1_prod", task="embed_docs", state="RUNNING", attempt=1)',
  'COORDINATOR DISPATCH overhead=627 µs · max_concurrency=8 (7.86x speedup)',
  'TASK_RESULT task="embed_docs" output_bytes=4128 status="SUCCEEDED" stored in task_outputs',
  'HTTP 429 BACKOFF task="generate_summary" attempt 1/3 backoff=2.0s jitter=140ms',
  'SIGKILL PROCESS ISOLATION task="untrusted_eval" hard_timeout=15.0s → child SIGKILL sent',
  'SINGLE-PASS FIXPOINT CANCEL task="export_report" upstream="untrusted_eval" state="CANCELLED"',
  'CRASH RESUME resume_run("wf_v1_prod") loaded 14/16 tasks SUCCEEDED · 2 READY re-queued',
  'CHECKPOINT workflow="wf_v1_prod" · 16/16 tasks terminal · WAL synced (44,730 writes/s)',
]

function OeEventTicker() {
  return <div className="oe-event-ticker" aria-hidden="true">
    <span className="oe-event-ticker-label">append-only · task_events (sample rows)</span>
    <div className="oe-event-ticker-window"><div className="oe-event-ticker-track">{[...OE_TICKER_EVENTS, ...OE_TICKER_EVENTS].map((event, index) => <span key={index}>{event}</span>)}</div></div>
  </div>
}

// Ambient background for the engine case file, echoing the site's passive layers:
// the masked dot-grid plane and scroll-scrubbed rings/diamonds from SectionGeometry,
// plus the slow-rotating ring and floating geo shapes from the hero.
function OeReportAmbience() {
  const field = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const scroller = field.current?.closest('.project-overlay')
    const context = gsap.context(() => {
      gsap.to('.oe-ambience-ring--spin', { rotate: 360, duration: 90, ease: 'none', repeat: -1 })
      gsap.to('.oe-ambience-float', { y: -12, rotate: 8, opacity: .22, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 1.4, from: 'random' } })
      if (scroller) {
        const range = { trigger: field.current, scroller, start: 'top bottom', end: 'bottom top', scrub: 1 }
        gsap.fromTo('.oe-ambience-ring--orbit', { yPercent: -12, rotate: -10 }, { yPercent: 12, rotate: 10, ease: 'none', scrollTrigger: range })
        gsap.fromTo('.oe-ambience-diamond', { y: 26, rotate: -16 }, { y: -26, rotate: 50, ease: 'none', scrollTrigger: range })
      }
    }, field)
    return () => context.revert()
  }, [])
  return <div ref={field} className="oe-ambience" aria-hidden="true">
    <i className="oe-ambience-plane" />
    <i className="oe-ambience-ring oe-ambience-ring--spin" />
    <i className="oe-ambience-ring oe-ambience-ring--orbit" />
    <i className="oe-ambience-diamond" />
    <i className="oe-ambience-diamond oe-ambience-diamond--secondary" />
    <i className="oe-ambience-float oe-ambience-square" />
    <i className="oe-ambience-float oe-ambience-cross"><b /><b /></i>
  </div>
}

function OrchestrationEngineReport({ entranceDelay = 0, onBackToHome, onNavigateProject }) {
  const report = useRef(null)
  const testSubjects = [
    ['State Machine Invariants', 'Formal validation of legal task transitions across PENDING, READY, RUNNING, SUCCEEDED, FAILED, RETRY_WAIT, and CANCELLED; persistence commits before memory mutation.'],
    ['Coordinator Scheduling Latency', '627.23 µs average scheduling overhead per task (1,594.3 tasks/sec) across linear chains of 500 no-op tasks.'],
    ['SQLite WAL Event Write Throughput', '44,730.5 writes/sec (22.36 µs write latency) with PRAGMA journal_mode = WAL and synchronous = NORMAL.'],
    ['Multi-Worker Concurrency Scaling', '7.86x speedup on 8 worker threads/processes (98.2% scaling efficiency) under 16 parallel tasks with 50ms I/O latency.'],
    ['Single-Pass Fixpoint Cancellation', 'Recursive transitive cancellation across deep downstream branches with zero orphaned tasks, while parallel unaffected branches complete.'],
    ['SIGKILL Child Process Isolation', 'ProcessExecutor enforces hard execution timeouts via POSIX SIGKILL termination, preventing zombie worker stalls.'],
    ['Durable Crash Recovery (resume_run)', 'In-process crash resumption restores terminal task_outputs and resumes interrupted workflows without re-executing succeeded tasks.'],
    ['Production Packaging & Strict Typing', '162 automated tests (100% pass, 0 flakes across 20 runs, 91.45% coverage), 100% strict mypy compliance across 36 source files, zero runtime dependencies.'],
  ]
  const sectionAnchors = [
    { id: 'oe-s01', label: 'why & alternatives' },
    { id: 'oe-s02', label: 'concurrency & scaling' },
    { id: 'oe-s03', label: 'durability & recovery' },
    { id: 'oe-s04', label: 'verification & benchmarks' },
    { id: 'oe-s05', label: 'api & cli surface' },
    { id: 'oe-s06', label: 'production blueprints' },
    { id: 'oe-s07', label: 'transformation (g1-g13)' },
  ]
  useLayoutEffect(() => {
    const root = report.current
    const scope = root?.closest('.oe-report-panel')
    if (!root || !scope) return undefined
    return setupCaseFileScrollFx(scope, 'oe', entranceDelay)
  }, [entranceDelay])
  // Passive: track which numbered section is in view and mirror it in the topbar readout.
  useCaseFileReadout(report, sectionAnchors)
  return <div className="oe-report" ref={report}>
    <OeReportAmbience />
    <main className="oe-report-main">
      <header className="oe-report-hero">
        <p className="oe-report-kicker">Technical Master Specification & Production Case Study · Python 3.12+ Workflow Orchestration</p>
        <CipherReveal id="project-title" as="h2" duration={1.4} scramble={0.35} order="left" hover="trail">
          FAULT-TOLERANT ORCHESTRATION ENGINE<br /><span>PRODUCTION-READY BETA (v0.9.0)</span>
        </CipherReveal>
        <p id="project-detail" className="oe-report-intro">A fault-tolerant, dependency-aware workflow orchestration engine for Python with zero external runtime dependencies. Built specifically for mission-critical automation pipelines—autonomous AI agent loops, RAG document indexing, data ingestion, and cloud incident triage—featuring single-writer SQLite WAL write-ahead durability, 627 µs scheduling latency, SIGKILL child process isolation, and in-process crash resumption.</p>

        <QuickInstallBar />

        <div className="oe-report-btn-group">
          <HoldButton
            size="sm"
            radius={2}
            holdTime={700}
            backgroundColor="#141417"
            fillColor="#e5484d"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            doneLabel="Opening..."
            onTap={() => window.open(ORCHESTRATION_PYPI, '_blank')}
            onHold={() => window.open(ORCHESTRATION_PYPI, '_blank')}
          >
            PyPI ↗
          </HoldButton>
          <HoldButton
            size="sm"
            radius={2}
            holdTime={700}
            backgroundColor="#141417"
            fillColor="#e5484d"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            doneLabel="Opening..."
            onTap={() => window.open(ORCHESTRATION_DOCS, '_blank')}
            onHold={() => window.open(ORCHESTRATION_DOCS, '_blank')}
          >
            Docs ↗
          </HoldButton>
          <HoldButton
            size="sm"
            radius={2}
            holdTime={700}
            backgroundColor="#141417"
            fillColor="#e5484d"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            doneLabel="Opening..."
            onTap={() => window.open(ORCHESTRATION_REPO, '_blank')}
            onHold={() => window.open(ORCHESTRATION_REPO, '_blank')}
          >
            GitHub ↗
          </HoldButton>
          <HoldButton
            size="sm"
            radius={2}
            holdTime={700}
            backgroundColor="#141417"
            fillColor="#e5484d"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            doneLabel="Opening..."
            onTap={() => window.open(ORCHESTRATION_RELEASE, '_blank')}
            onHold={() => window.open(ORCHESTRATION_RELEASE, '_blank')}
          >
            v0.9.0 Notes ↗
          </HoldButton>
          <HoldButton
            size="sm"
            radius={2}
            holdTime={700}
            backgroundColor="#141417"
            fillColor="#e5484d"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            doneLabel="Opening..."
            onTap={() => window.open(`${ORCHESTRATION_REPO}/blob/main/LICENSE`, '_blank')}
            onHold={() => window.open(`${ORCHESTRATION_REPO}/blob/main/LICENSE`, '_blank')}
          >
            License ↗
          </HoldButton>
        </div>
        <i className="oe-hero-bracket oe-hero-bracket--tl" aria-hidden="true" /><i className="oe-hero-bracket oe-hero-bracket--br" aria-hidden="true" />
      </header>

      <OeEventTicker />

      <section className="oe-report-metrics" aria-label="Project snapshot">
        <article><span>Latest release</span><strong><GlyphLottery text="v0.9.0" accentColor="var(--color-interactive)" /></strong><small>Production Beta · PyPI package</small></article>
        <article><span>Automated tests</span><strong><GlyphLottery text="162 / 162" accentColor="var(--color-interactive)" /></strong><small>100% pass · 0 flakes · 91.45% line cov</small></article>
        <article><span>Runtime dependencies</span><strong><GlyphLottery text="0" accentColor="var(--color-interactive)" /></strong><small>Pure Python standard library</small></article>
        <article><span>Scheduling latency</span><strong><GlyphLottery text="627 µs" accentColor="var(--color-interactive)" /></strong><small>1,594 tasks / second throughput</small></article>
      </section>
      <p className="oe-report-note">Release v0.9.0 on PyPI eliminates all 13 prototype architectural gaps with dual MIT / Apache-2.0 licensing, pure Python 3.12+ stdlib, robust CLI, and in-process crash recovery.</p>

      <InteractiveWorkflowSimulator />

      <section className="oe-report-section" id="oe-s01">
        <div className="oe-report-section-label"><span>01</span><p>Why build this? (Engine vs. Alternatives)</p></div>
        <div className="oe-report-section-body">
          <h3>Zero-overhead orchestration without infrastructure sprawl.</h3>
          <p>Traditional workflow orchestrators (Apache Airflow, Temporal, Celery) require heavy brokers, persistent server clusters, and extensive memory footprints. For embedded edge runtimes, autonomous AI agents, and CLI tools, this introduces massive operational friction. Conversely, naive Python scripts lack transactional persistence, crash resilience, and timeout guarantees. The Orchestration Engine strikes the optimal balance: complete transactional safety with zero infrastructure.</p>
          <OeDecisionMatrix />
          <div className="oe-report-facts">
            <p><span>01 / Zero Operational Tax</span><b>Embedded SQLite WAL requires zero Docker daemons, external message brokers, or dedicated database clusters.</b></p>
            <p><span>02 / Deterministic Safety</span><b>Single-writer coordinator loop prevents race conditions while Thread & Process pools scale concurrent I/O & CPU work.</b></p>
            <p><span>03 / Standard Library Only</span><b>Built on Python 3.12+ sqlite3, concurrent.futures, dataclasses, and enum. Packaging and tests managed with uv, ruff, and strict mypy.</b></p>
          </div>
        </div>
      </section>

      <section className="oe-report-section" id="oe-s02">
        <div className="oe-report-section-label"><span>02</span><p>Concurrency & scheduling model</p></div>
        <div className="oe-report-section-body">
          <h3>Decoupled single-writer coordination with linear multi-worker scaling.</h3>
          <p>The coordinator runs an event-driven dispatch loop with an average scheduling latency of 627.23 µs per task (~1,594 tasks/sec). Concurrency scales linearly: executing 16 parallel tasks achieves a 7.86x speedup across 8 workers (98.2% scaling efficiency) with near-zero coordinator lock contention.</p>
          <SingleWriterArchitectureDiagram />
          <OeConcurrencyBenchmarks />
          <OeSequenceDiagram />
          <TaskFaultDrillExplorer />
          <LifecycleExplorer />
        </div>
      </section>

      <section className="oe-report-section" id="oe-s03">
        <div className="oe-report-section-label"><span>03</span><p>Durability & crash recovery</p></div>
        <div className="oe-report-section-body">
          <h3>Write-ahead SQLite WAL event persistence before live state mutation.</h3>
          <p>State transitions are durably committed to the SQLite <code>task_events</code> table at 44,730.5 writes/sec (22.36 µs per event) with WAL mode enabled. In-memory state only advances after disk commitment. If a process crash or SIGKILL occurs, <code>resume_run()</code> restores the workflow's state directly from SQLite without re-running completed tasks.</p>
          <DurabilityStepper />
          <FinishTimeBackoffFormula />
          <div className="oe-report-checks">
            <article><span>RETRY BUDGET</span><p>Timeouts and transient errors spend the task's configurable RetryPolicy with finish-time exponential backoff and jitter.</p></article>
            <article><span>FIXPOINT CANCEL</span><p>Single-pass fixpoint cancellation recursively flags downstream dependents as CANCELLED while unaffected parallel branches complete.</p></article>
            <article><span>SIGKILL ISOLATION</span><p>ProcessExecutor terminates untrusted tasks with true POSIX SIGKILL upon timeout, preventing thread-stall leaks.</p></article>
            <article><span>CRASH RESUMPTION</span><p>resume_run() reads durable SQLite task_events and task_outputs, skipping completed tasks and seamlessly re-queueing unfinished nodes.</p></article>
          </div>
        </div>
      </section>

      <section className="oe-report-section" id="oe-s04">
        <div className="oe-report-section-label"><span>04</span><p>Verification & benchmark record</p></div>
        <div className="oe-report-section-body">
          <h3>162 automated tests, 0 flakes, and quantitative performance profiling.</h3>
          <p>The v0.9.0 test suite was expanded by 179% from 58 to 162 tests across 20 test modules, achieving 91.45% line coverage across all 15 core engine modules with 0 flakes across 20 consecutive stress runs and 100% strict mypy compliance across 36 source files.</p>
          <div className="oe-test-table" role="table" aria-label="Verification subjects and evidence"><div className="oe-test-table-head" role="row"><span role="columnheader">Subject</span><span role="columnheader">Empirical Evidence & Invariants</span></div>{testSubjects.map(([subject, evidence], index) => <div className="oe-test-row" role="row" key={subject}><span role="cell"><i>{String(index + 1).padStart(2, '0')}</i>{subject}</span><p role="cell">{evidence}</p></div>)}</div>
          <div className="oe-verification-strip">
            <p><b>01 / Clean Virtualenv Wheel</b><span>Installed into isolated environments; public API imports, symbols, and packaging verified without side effects.</span></p>
            <p><b>02 / Multi-Worker Consumer</b><span>Tested non-linear DAG execution under ThreadExecutor and ProcessExecutor with real network latency and payload passing.</span></p>
            <p><b>03 / Parameterized SQL Audit</b><span>100% of SQL statements parameterized (24 distinct queries audited); max 10MB workflow size & 5,000 tasks guard enforced.</span></p>
          </div>
        </div>
      </section>

      <section className="oe-report-section" id="oe-s05">
        <div className="oe-report-section-label"><span>05</span><p>API surface & zero-dependency CLI</p></div>
        <div className="oe-report-section-body">
          <h3>25 frozen public symbols, typed TaskResult passing, and robust CLI exit codes.</h3>
          <p>The public API exposes a clean, functional surface including WorkflowBuilder, TaskResult, and lifecycle hooks (on_task_start, on_task_complete, on_workflow_finish). The built-in CLI provides complete workflow orchestration from the terminal with deterministic exit codes: 0 (Success), 1 (Task Failure), 2 (Validation Error), 3 (Fatal Runtime Error).</p>
          <ApiSurfaceExplorer />
          <OeCliReference />
          <p>Workflow definitions are JSON or Python fluent builder objects. They decouple identity and task intent from runtime state, allowing identical workflows to run ephemerally in-memory or persisted across SQLite restarts.</p>
        </div>
      </section>

      <section className="oe-report-section" id="oe-s06">
        <div className="oe-report-section-label"><span>06</span><p>Production blueprints</p></div>
        <div className="oe-report-section-body">
          <h3>Real-world battle-tested patterns: AI agent graphs, document indexers & automated SRE triage.</h3>
          <p>The engine is engineered for mission-critical workloads where execution steps require strict dependency management, transient failure recovery, and audited persistence.</p>
          <OeBlueprintsPanel />
        </div>
      </section>

      <section className="oe-report-section" id="oe-s07">
        <div className="oe-report-section-label"><span>07</span><p>Engineering transformation (G1–G13)</p></div>
        <div className="oe-report-section-body">
          <h3>Systematic elimination of all 13 architectural gaps from prototype to release.</h3>
          <p>During the transition from v0.1.0 prototype to v0.9.0 production beta, every architectural gap—from thread timeout leaks and unhandled transitive cancellations to untyped data passing and process resumption—was systematically resolved and locked with formal Architectural Decision Records (ADRs).</p>
          <OeTransformationGrid />
        </div>
      </section>

      <footer className="oe-report-footer">
        <span>01 / Fault-Tolerant Orchestration Engine</span>
        <span>v0.9.0 · Production-Ready Beta · Dual MIT / Apache-2.0</span>
        <p>Source for this case file: Portfolio Master Specification v0.9.0, PyPI Package, Documentation Site, and Empirical Benchmarks.</p>
        <div className="oe-report-btn-group mt-5">
          {onBackToHome && (
            <HoldButton
              size="sm"
              radius={2}
              holdTime={600}
              backgroundColor="#161619"
              fillColor="#e5484d"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              doneLabel="Returning..."
              onTap={onBackToHome}
              onHold={onBackToHome}
            >
              ← Back to Overview
            </HoldButton>
          )}
          <HoldButton
            size="sm"
            radius={2}
            holdTime={700}
            backgroundColor="#141417"
            fillColor="#e5484d"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            doneLabel="Opening..."
            onTap={() => window.open(ORCHESTRATION_PYPI, '_blank')}
            onHold={() => window.open(ORCHESTRATION_PYPI, '_blank')}
          >
            PyPI ↗
          </HoldButton>
          <HoldButton
            size="sm"
            radius={2}
            holdTime={700}
            backgroundColor="#141417"
            fillColor="#e5484d"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            doneLabel="Opening..."
            onTap={() => window.open(ORCHESTRATION_DOCS, '_blank')}
            onHold={() => window.open(ORCHESTRATION_DOCS, '_blank')}
          >
            Docs ↗
          </HoldButton>
          <HoldButton
            size="sm"
            radius={2}
            holdTime={700}
            backgroundColor="#141417"
            fillColor="#e5484d"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            doneLabel="Opening..."
            onTap={() => window.open(ORCHESTRATION_REPO, '_blank')}
            onHold={() => window.open(ORCHESTRATION_REPO, '_blank')}
          >
            GitHub ↗
          </HoldButton>
          {onNavigateProject && (
            <HoldButton
              size="sm"
              radius={2}
              holdTime={600}
              backgroundColor="#141417"
              fillColor="#e5484d"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              doneLabel="Opening..."
              onTap={() => onNavigateProject('sae-reproduction')}
              onHold={() => onNavigateProject('sae-reproduction')}
            >
              Next: SAE Reproduction →
            </HoldButton>
          )}
        </div>
      </footer>
    </main>
  </div>
}

function ProjectModal({ project, close, openOrigin, onNavigateProject }) {
  const panel = useRef(null)
  const overlay = useRef(null)
  const venom = useRef(null)
  const venomLabel = useRef(null)
  const [reportReady, setReportReady] = useState(true)
  const [transitionDone, setTransitionDone] = useState(true)
  const isResearch = project?.name === 'SAE Reproduction'
  const isOrchestration = project?.name === 'Orchestration Engine'
  const isPentagon = project?.name === 'Pentagon'
  const usesVenom = isResearch || isOrchestration || isPentagon
  const entranceDelay = 0.15
  useLayoutEffect(() => {
    if (!project || !panel.current) return undefined
    if (overlay.current) overlay.current.scrollTop = 0
    setReportReady(true)
    setTransitionDone(true)
    if (reduceMotion()) return undefined

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(panel.current, { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, duration: 0.5 }, 0)

    const topbar = overlay.current?.querySelector('header[class*="-topbar"]')
    if (topbar) {
      tl.fromTo(topbar, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.4 }, 0.08)
    }

    const kicker = panel.current.querySelector('.oe-report-kicker, .sae-report-kicker')
    if (kicker) {
      tl.fromTo(kicker, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.4 }, 0.14)
    }

    const intro = panel.current.querySelector('.oe-report-intro, .sae-report-intro')
    if (intro) {
      tl.fromTo(intro, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, 0.2)
    }

    const installBar = panel.current.querySelector('.oe-install-bar')
    if (installBar) {
      tl.fromTo(installBar, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, 0.24)
    }

    const btnGroup = panel.current.querySelector('.oe-report-btn-group')
    if (btnGroup) {
      tl.fromTo(btnGroup, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, 0.28)
    }

    const metricArticles = panel.current.querySelectorAll('.oe-report-metrics article')
    if (metricArticles.length > 0) {
      tl.fromTo(metricArticles, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.07 }, 0.32)
    }

    return () => tl.kill()
  }, [project])
  useEffect(() => {
    if (usesVenom && reportReady) {
      const backBtn = overlay.current?.querySelector('.oe-topbar-back-btn')
      backBtn?.focus?.({ preventScroll: true })
    }
  }, [usesVenom, reportReady])
  // Same smoothed wheel feel as the main page: a dedicated Lenis scoped to the
  // overlay, using the site-wide sensitivity (lerp .08, wheelMultiplier .86).
  // Touch and reduced-motion stay native, exactly like the main page.
  useEffect(() => {
    if (!project || reduceMotion() || touchDevice()) return undefined
    const wrapper = overlay.current
    const content = panel.current
    if (!wrapper || !content) return undefined
    const lenis = new Lenis({ wrapper, content, lerp: .08, smoothWheel: true, wheelMultiplier: .86 })
    let frame
    const animate = (time) => { lenis.raf(time); frame = requestAnimationFrame(animate) }
    frame = requestAnimationFrame(animate)
    return () => { cancelAnimationFrame(frame); lenis.destroy() }
  }, [project])
  useEffect(() => {
    if (!project) return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (usesVenom && !reportReady) overlay.current?.focus({ preventScroll: true })
    else {
      const backBtn = overlay.current?.querySelector('.oe-topbar-back-btn')
      backBtn?.focus?.({ preventScroll: true })
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); return }
      if (event.key !== 'Tab') return
      const controls = [...(overlay.current?.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') || [])]
      if (controls.length === 0) { event.preventDefault(); return }
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus && document.contains(previousFocus)) previousFocus.focus()
    }
  }, [project, close, usesVenom, reportReady])
  if (!project) return null
  const modalMarkup = (
    <div ref={overlay} tabIndex="-1" className={`project-overlay fixed inset-0 z-50 overflow-y-auto overflow-x-hidden ${usesVenom ? 'bg-transparent' : 'bg-black/80 backdrop-blur-xl'}`} role="dialog" aria-modal="true" aria-labelledby="project-title" aria-describedby="project-detail" onClick={(event) => { if (event.target === overlay.current) close() }}>
      {usesVenom && !transitionDone && <div className="sr-only">
        <div role="status" aria-live="polite">{reportReady ? `${project.name} report ready.` : `Opening ${project.name} case study.`}</div>
        {!reportReady && <><h2 id="project-title">{project.name}</h2><p id="project-detail">Opening the {project.name} case study.</p></>}
      </div>}
      <article ref={panel} aria-hidden={usesVenom && !reportReady} className={`relative min-h-full overflow-hidden ${isResearch ? `sae-report-panel ${reportReady ? 'is-ready' : 'is-covered'}` : isOrchestration || isPentagon ? `oe-report-panel ${reportReady ? 'is-ready' : 'is-covered'}` : 'text-white'}`} style={!usesVenom ? { backgroundColor: project.color || 'var(--color-accent)' } : undefined}>
        {!usesVenom && <i aria-hidden="true" className="absolute -right-[10%] -top-[12%] h-[62vw] w-[62vw] rounded-full border border-white/25" />}
        {reportReady && (!usesVenom || transitionDone) && <CaseFileProgress tone={usesVenom ? 'lime' : 'ink'} />}
        {isResearch && reportReady ? <>
          <header className="sae-report-topbar">
            <p>02 / Research case file <span>·</span> SAE reproduction <i className="oe-readout-sep" aria-hidden="true">//</i> <span className="oe-readout-value">question</span></p>
            <div className="oe-topbar-meta">
              <span className="oe-live-dot" aria-hidden="true" />
              <span className="oe-live-label" aria-hidden="true">research live</span>
              <HoldButton
                size="sm"
                radius={2}
                holdTime={500}
                backgroundColor="#141417"
                fillColor="#e5484d"
                textColor="#ffffff"
                fillTextColor="#ffffff"
                className="oe-topbar-back-btn"
                doneLabel="Returning..."
                onTap={close}
                onHold={close}
              >
                ← Back to Overview
              </HoldButton>
            </div>
          </header>
          <SAEResearchReport
            entranceDelay={entranceDelay}
            onBackToHome={close}
            onNavigateProject={onNavigateProject}
          />
        </> : isOrchestration && reportReady ? <>
          <header className="oe-report-topbar">
            <p>01 / Engine case file <span>·</span> Orchestration Engine <i className="oe-readout-sep" aria-hidden="true">//</i> <span className="oe-readout-value">overview</span></p>
            <div className="oe-topbar-meta">
              <span className="oe-live-dot" aria-hidden="true" />
              <span className="oe-live-label" aria-hidden="true">engine live</span>
              <HoldButton
                size="sm"
                radius={2}
                holdTime={500}
                backgroundColor="#141417"
                fillColor="#e5484d"
                textColor="#ffffff"
                fillTextColor="#ffffff"
                className="oe-topbar-back-btn"
                doneLabel="Returning..."
                onTap={close}
                onHold={close}
              >
                ← Back to Overview
              </HoldButton>
            </div>
          </header>
          <OrchestrationEngineReport
            entranceDelay={entranceDelay}
            onBackToHome={close}
            onNavigateProject={onNavigateProject}
          />
        </> : isPentagon && reportReady ? <>
          <header className="oe-report-topbar">
            <p>03 / Workstation case file <span>·</span> Pentagon <i className="oe-readout-sep" aria-hidden="true">//</i> <span className="oe-readout-value">architecture</span></p>
            <div className="oe-topbar-meta">
              <span className="oe-live-dot" aria-hidden="true" />
              <span className="oe-live-label" aria-hidden="true">workstation live</span>
              <HoldButton
                size="sm"
                radius={2}
                holdTime={500}
                backgroundColor="#141417"
                fillColor="#e5484d"
                textColor="#ffffff"
                fillTextColor="#ffffff"
                className="oe-topbar-back-btn"
                doneLabel="Returning..."
                onTap={close}
                onHold={close}
              >
                ← Back to Overview
              </HoldButton>
            </div>
          </header>
          <PentagonWorkstationReport
            entranceDelay={entranceDelay}
            setupScrollFx={setupCaseFileScrollFx}
            useReadout={useCaseFileReadout}
            onBackToHome={close}
            onNavigateProject={onNavigateProject}
          />
        </> : usesVenom ? null : <>
          <div className="fixed top-6 right-6 z-20">
            <HoldButton
              size="sm"
              radius={2}
              holdTime={500}
              backgroundColor="#141417"
              fillColor="#e5484d"
              textColor="#ffffff"
              fillTextColor="#ffffff"
              className="oe-topbar-back-btn"
              doneLabel="Returning..."
              onTap={close}
              onHold={close}
            >
              ← Back to Overview
            </HoldButton>
          </div>
          <div className="modal-copy relative z-10 flex min-h-svh max-w-4xl flex-col justify-end p-7 sm:p-20">
            <p className="font-mono text-[.68rem] uppercase tracking-[.1em] text-white/70">{project.id} / {project.tag}</p>
            <CipherReveal id="project-title" as="h2" className="font-display mt-4 text-[clamp(4.5rem,12vw,11rem)] font-black leading-[.82] tracking-[-.035em]" duration={1.4} scramble={0.35} order="left" hover="trail">
              {project.name}
            </CipherReveal>
            <p id="project-detail" className="font-serif mt-7 max-w-2xl text-base leading-7 text-white/80">{project.detail}</p>
            {project.link && (project.link.includes('github') ? (
              <div className="mt-10 w-fit">
                <HoldButton
                  doneLabel="Opening..."
                  backgroundColor="#141417"
                  fillColor="#e5484d"
                  textColor="#ffffff"
                  fillTextColor="#ffffff"
                  size="sm"
                  radius={2}
                  fillDirection="right"
                  holdTime={700}
                  releaseTime={180}
                  pressScale={0.98}
                  wave
                  waveAmplitude={6}
                  glow
                  resetAfter={1200}
                  onTap={() => window.open(project.link, '_blank')}
                  onHold={() => window.open(project.link, '_blank')}
                >
                  View repository ↗
                </HoldButton>
              </div>
            ) : (
              <div className="mt-10 w-fit">
                <HoldButton
                  doneLabel="Opening..."
                  backgroundColor="#141417"
                  fillColor="#e5484d"
                  textColor="#ffffff"
                  fillTextColor="#ffffff"
                  size="sm"
                  radius={2}
                  holdTime={700}
                  onTap={() => window.open(project.link, '_blank')}
                  onHold={() => window.open(project.link, '_blank')}
                >
                  Launch project ↗
                </HoldButton>
              </div>
            ))}
          </div>
        </>}
      </article>
      {usesVenom && !transitionDone && <div className={`sae-venom-transition ${isOrchestration || isPentagon ? 'oe-venom-transition' : ''}`} aria-hidden="true">
        <div ref={venom} className={`sae-venom-blob ${isOrchestration || isPentagon ? 'oe-venom-blob' : ''}`} style={{ left: `${openOrigin?.x ?? window.innerWidth / 2}px`, top: `${openOrigin?.y ?? window.innerHeight / 2}px` }}>
          {!isOrchestration && !isPentagon && [-42, -18, 26, 52, 138].map((angle) => <i className="sae-venom-tendril" style={{ '--tendril-angle': `${angle}deg` }} key={angle} />)}
        </div>
        <div ref={venomLabel} className={`sae-venom-label ${isOrchestration || isPentagon ? 'oe-venom-label' : ''}`}>
          {isOrchestration ? <>
            <svg className="oe-loader-graph" viewBox="0 0 180 64"><path d="M28 18 C65 18 68 32 90 32 M28 46 C65 46 68 32 90 32 H150" /><circle cx="28" cy="18" r="4" /><circle cx="28" cy="46" r="4" /><circle cx="90" cy="32" r="5" /><circle cx="150" cy="32" r="4" /></svg>
            <span>01 / Workflow file</span><strong>Orchestration Engine</strong>
          </> : isPentagon ? <>
            <svg className="oe-loader-graph" viewBox="0 0 180 64" fill="none">
              <polygon points="90,12 122,34 110,64 70,64 58,34" fill="rgba(229,72,77,0.12)" stroke="var(--color-interactive)" strokeWidth="1.5" />
              <circle cx="90" cy="40" r="4" fill="var(--color-interactive)" />
            </svg>
            <span>03 / Workstation file</span><strong>Pentagon Workstation</strong>
          </> : <><span>02 / Research file</span><strong>SAE reproduction</strong></>}
        </div>
      </div>}
    </div>
  )
  return typeof document !== 'undefined' ? createPortal(modalMarkup, document.body) : null
}

function WorkScrollProgress() {
  const progress = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const section = document.getElementById('work')
    const context = gsap.context(() => {
      gsap.fromTo(progress.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: .8 } })
    }, progress)
    return () => context.revert()
  }, [])
  return <div className="work-scroll-track" aria-hidden="true"><span ref={progress} /></div>
}

// Passive halo behind the engine visual: masked dot grid plus two slow, counter-rotating
// rings — the site's idle-geometry language, matched to the dark carousel panel.
function OeVisualHalo() {
  return <div className="oe-visual-halo" aria-hidden="true">
    <i className="oe-visual-halo-plane" />
    <i className="oe-visual-halo-ring oe-visual-halo-ring--a" />
    <i className="oe-visual-halo-ring oe-visual-halo-ring--b" />
  </div>
}

function ProjectVisual({ project, index, nextProject, advance, onOpenDetails }) {
  const visual = useRef(null), scene = useRef(null), starField = useRef(null), progressTrack = useRef(null), progressCount = useRef(null), transferSpark = useRef(null), touchStart = useRef(null), swiped = useRef(false)
  const proof = {
    'Orchestration Engine': '162 / 162 tests · 91.5% cov',
    'SAE Reproduction': '0.897562 validation similarity',
    'Pentagon': 'Zero-Leak BYOK · 80+ Models',
  }[project.name]
  useLayoutEffect(() => {
    if (reduceMotion() || project.name === 'Orchestration Engine' || project.name === 'Pentagon') return undefined
    const section = visual.current?.closest('#work')
    const context = gsap.context(() => {
      gsap.fromTo(scene.current, { y: 18, rotate: -.7, scale: .985 }, { y: -18, rotate: .7, scale: 1.015, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 } })
    }, visual)
    return () => context.revert()
  }, [project.id, project.name])
  useLayoutEffect(() => {
    const field = starField.current
    if (project.name !== 'Orchestration Engine' || !field || reduceMotion()) return undefined
    let currentIndex = Math.floor(Math.random() * oeWaypoints.length)
    let recentDestinations = [currentIndex]
    let flight
    let pause
    let railMotion
    let transferMotion
    let fieldMorph
    let completedHops = 0
    let disposed = false
    const context = gsap.context(() => {
      const points = [...field.querySelectorAll('.oe-waypoint')]
      const halos = [...field.querySelectorAll('.oe-waypoint-halo')]
      const traveler = field.querySelector('.oe-traveler')
      const trail = field.querySelector('.oe-flight-trail')
      const rail = progressTrack.current
      const railFill = rail?.querySelector('.feature-track-progress')
      const railMarker = rail?.querySelector('.feature-track-marker')
      const stages = rail ? [...rail.querySelectorAll('.feature-node')] : []
      const svg = field.querySelector('svg')
      const art = field.closest('.oe-project-art')
      const backgroundPoints = [...field.querySelectorAll('.oe-background-stars circle')]
      let coordinates = oeWaypoints
      const sendWaypointToRail = (targetIndex, onArrive) => {
        if (!transferSpark.current || !railMarker || !art || !svg) { onArrive(); return }
        const artRect = art.getBoundingClientRect()
        const svgRect = svg.getBoundingClientRect()
        const markerRect = railMarker.getBoundingClientRect()
        const star = coordinates[targetIndex]
        const startX = svgRect.left + (star.x / 1000) * svgRect.width - artRect.left
        const startY = svgRect.top + (star.y / 560) * svgRect.height - artRect.top
        const endX = markerRect.left + markerRect.width / 2 - artRect.left
        const endY = markerRect.top + markerRect.height / 2 - artRect.top
        gsap.set(transferSpark.current, { left: startX, top: startY, scale: .72, autoAlpha: 1 })
        transferMotion?.kill()
        transferMotion = gsap.to(transferSpark.current, {
          left: endX,
          top: endY,
          scale: .42,
          autoAlpha: .55,
          duration: .68,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(transferSpark.current, { autoAlpha: 0 })
            onArrive()
          },
        })
      }
      const updateRail = (completed) => {
        if (!railFill || !railMarker || !stages.length) return
        const activeStage = completed <= 2 ? 0 : completed <= 5 ? 1 : 2
        stages.forEach((stage, stageIndex) => {
          stage.classList.toggle('is-active', stageIndex === activeStage)
          stage.classList.toggle('is-complete', completed === 7 || stageIndex < activeStage)
        })
        if (progressCount.current) {
          progressCount.current.textContent = String(completed).padStart(2, '0')
          if (completed) gsap.fromTo(progressCount.current, { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: .32, ease: 'power2.out', overwrite: 'auto' })
        }
        railMotion?.kill()
        railMotion = gsap.timeline()
          .to(railFill, { scaleX: completed / 7, duration: completed ? .52 : .4, ease: 'power2.out' }, 0)
          .to(railMarker, { left: '50%', autoAlpha: completed ? 1 : 0, scale: 1, duration: completed ? .2 : .3, ease: 'power2.out' }, 0)
        if (completed > 0) railMotion.to(railMarker, { scale: 1.55, duration: .18, yoyo: true, repeat: 1, ease: 'power1.inOut' }, .14)
      }
      const randomizeField = () => {
        coordinates = createOeWaypoints()
        recentDestinations = [currentIndex]
        const sky = createOeConstellation()
        fieldMorph?.kill()
        fieldMorph = gsap.timeline()
        coordinates.forEach((star, index) => {
          fieldMorph.to(points[index], { attr: { cx: star.x, cy: star.y, r: star.radius }, opacity: star.opacity, duration: .86, ease: 'power2.inOut' }, 0)
          fieldMorph.to(halos[index], { attr: { cx: star.x, cy: star.y, r: 3 }, duration: .86, ease: 'power2.inOut' }, 0)
        })
        sky.forEach((star, index) => {
          fieldMorph.to(backgroundPoints[index], { attr: { cx: star.x, cy: star.y, r: star.radius }, opacity: star.opacity, duration: .86, ease: 'power2.inOut' }, 0)
        })
      }
      if (railFill && railMarker) {
        gsap.set(railFill, { scaleX: 0 })
        gsap.set(railMarker, { left: '50%', autoAlpha: 0, scale: 1 })
      }
      updateRail(0)
      const pointOnCurve = (from, control, to, progress) => {
        const inverse = 1 - progress
        return {
          x: inverse * inverse * from.x + 2 * inverse * progress * control.x + progress * progress * to.x,
          y: inverse * inverse * from.y + 2 * inverse * progress * control.y + progress * progress * to.y,
        }
      }
      const shoot = () => {
        if (disposed) return
        const from = coordinates[currentIndex]
        const candidates = coordinates
          .map((target, targetIndex) => ({ target, targetIndex, distance: Math.hypot(target.x - from.x, target.y - from.y) }))
          .filter(({ targetIndex, distance }) => distance > 115 && !recentDestinations.slice(-3).includes(targetIndex))
        const destinations = candidates.length ? candidates : coordinates
          .map((target, targetIndex) => ({ target, targetIndex, distance: Math.hypot(target.x - from.x, target.y - from.y) }))
          .filter(({ targetIndex }) => targetIndex !== currentIndex)
        const { target: to, targetIndex } = destinations[Math.floor(Math.random() * destinations.length)]
        const dx = to.x - from.x, dy = to.y - from.y
        const distance = Math.hypot(dx, dy) || 1
        const bend = (Math.random() - .5) * Math.min(280, distance * .8)
        const control = {
          x: Math.max(18, Math.min(982, (from.x + to.x) / 2 - (dy / distance) * bend)),
          y: Math.max(18, Math.min(542, (from.y + to.y) / 2 + (dx / distance) * bend)),
        }
        const progress = { value: 0 }
        const duration = Math.max(1.35, Math.min(2.7, distance / 320))

        gsap.set(traveler, { autoAlpha: 0, attr: { transform: `translate(${from.x} ${from.y})` } })
        gsap.set(trail, { attr: { x1: from.x, y1: from.y, x2: from.x, y2: from.y }, opacity: 0 })
        flight = gsap.timeline({
          onComplete: () => {
            currentIndex = targetIndex
            recentDestinations = [...recentDestinations, targetIndex].slice(-4)
            if (disposed) return
            sendWaypointToRail(targetIndex, () => {
              if (disposed) return
              completedHops = (completedHops % 7) + 1
              updateRail(completedHops)
              if (completedHops === 7) {
                pause = gsap.delayedCall(1.05, () => {
                  completedHops = 0
                  randomizeField()
                  updateRail(0)
                  pause = gsap.delayedCall(.28 + Math.random() * .48, shoot)
                })
              } else {
                pause = gsap.delayedCall(.22 + Math.random() * .58, shoot)
              }
            })
          },
        })
        flight.to(traveler, { autoAlpha: 1, duration: .1, ease: 'power1.out' }, 0)
        flight.to(progress, {
          value: 1,
          duration,
          ease: 'power2.inOut',
          onUpdate: () => {
            const t = progress.value
            const position = pointOnCurve(from, control, to, t)
            const tail = pointOnCurve(from, control, to, Math.max(0, t - .075))
            traveler.setAttribute('transform', `translate(${position.x} ${position.y})`)
            trail.setAttribute('x1', position.x)
            trail.setAttribute('y1', position.y)
            trail.setAttribute('x2', tail.x)
            trail.setAttribute('y2', tail.y)
            trail.style.opacity = String(Math.sin(t * Math.PI) * .76)
          },
        }, 0)
        flight.to(traveler, { autoAlpha: 0, duration: .16, ease: 'power1.out' }, duration - .06)
        flight.to(halos[targetIndex], { opacity: .82, attr: { r: 7 }, duration: .16, ease: 'power2.out' }, duration - .04)
        flight.to(points[targetIndex], { fill: '#E5484D', opacity: 1, duration: .16, ease: 'power1.out' }, duration - .04)
        flight.to(halos[targetIndex], { opacity: 0, attr: { r: 24 }, duration: .88, ease: 'power2.out' }, duration + .12)
        flight.to(points[targetIndex], { fill: '#F1F1EF', opacity: .66, duration: .62, ease: 'power1.inOut' }, duration + .2)
      }
      pause = gsap.delayedCall(.32, shoot)
    }, field)
    return () => { disposed = true; flight?.kill(); pause?.kill(); railMotion?.kill(); transferMotion?.kill(); fieldMorph?.kill(); context.revert() }
  }, [project.id, project.name])
  const handleTouchStart = (event) => { touchStart.current = event.changedTouches[0].clientX }
  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return
    const distance = event.changedTouches[0].clientX - touchStart.current
    touchStart.current = null
    if (Math.abs(distance) < 48) return
    swiped.current = true
    advance(distance < 0 ? 1 : -1)
    window.setTimeout(() => { swiped.current = false }, 500)
  }
  const handleClick = (event) => {
    if (project.name === 'Pentagon' && event?.target?.closest('.pentagon-cosmos-container, .sketchfab-brain-wrapper, iframe, canvas, [data-interactive]')) {
      return
    }
    if (swiped.current) { swiped.current = false; return }
    advance(1)
  }
  return <div
    ref={visual}
    onTouchStart={handleTouchStart}
    onTouchEnd={handleTouchEnd}
    onDoubleClick={(event) => {
      event.stopPropagation()
      onOpenDetails?.(project, event)
    }}
    className="project-visual group/visual cursor-pointer"
    role="region"
    aria-label={`Project visual for ${project.name}. Double-click to view project details.`}
  >
    <div className="flex items-center justify-between gap-3 font-mono text-[.6rem] uppercase tracking-[.1em] text-white/55">
      <span>Project representation</span><span>{project.id} / {String(featuredProjects.length).padStart(2, '0')}</span>
    </div>
    <div ref={scene} className="project-visual-scene">
      <div className={`project-visual-art project-visual-art--${index + 1} ${project.name === 'Orchestration Engine' ? 'oe-project-art' : ''} ${project.name === 'Pentagon' ? '!min-h-0 !p-0 !justify-stretch h-full flex flex-col' : ''}`} key={project.id} aria-hidden="true">
      {project.name === 'Orchestration Engine' && <>
        <OeVisualHalo />
        <div className="flex items-center justify-between relative z-10 font-mono text-[.6rem] uppercase tracking-[.12em] text-white/55">
          <p>Execution flow</p>
          <span className="feature-progress-readout"><b ref={progressCount}>00</b><i> / 07</i></span>
        </div>
        <div ref={progressTrack} className="feature-track my-7 flex items-start justify-between" aria-label="Queue, execute, and commit stages with a seven-arrival progress cycle">
          <span className="feature-track-base" aria-hidden="true"><span className="feature-track-progress" /><i className="feature-track-marker" /></span>
          {['Queue', 'Execute', 'Commit'].map((step, stepIndex) => <span className={`feature-node${stepIndex === 0 ? ' is-active' : ''}`} key={step}><i>{`0${stepIndex + 1}`}</i>{step}</span>)}
        </div>
        <div ref={starField} className="oe-starfield" aria-hidden="true">
          <svg viewBox="0 0 1000 560" preserveAspectRatio="none" focusable="false">
            <g className="oe-background-stars">{oeConstellationStars.map((star, starIndex) => <circle key={starIndex} cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />)}</g>
            <g className="oe-waypoints">{oeWaypoints.map((star, starIndex) => <g key={starIndex}>
              <circle className="oe-waypoint-halo" cx={star.x} cy={star.y} r="3" />
              <circle className="oe-waypoint" cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />
            </g>)}</g>
            <line className="oe-flight-trail" x1="0" y1="0" x2="0" y2="0" />
            <g className="oe-traveler">
              <circle className="oe-traveler-aura" r="10" />
              <path className="oe-traveler-star" d="M0 -8 L1.8 -2.1 L8 0 L1.8 2.1 L0 8 L-1.8 2.1 L-8 0 L-1.8 -2.1 Z" />
            </g>
          </svg>
        </div>
        <span ref={transferSpark} className="oe-transfer-spark" aria-hidden="true" />
        <p className="border-t border-white/15 pt-4 font-mono text-[.62rem] uppercase leading-relaxed tracking-[.08em] text-white/75">Durable state · task_events · workflow_id scoped</p>
      </>}
      {project.name === 'SAE Reproduction' && <>
        <p className="font-mono text-[.6rem] uppercase tracking-[.12em] text-white/55">Sparse autoencoder · research</p>
        <div className="sae-bars" aria-hidden="true">{[34, 58, 44, 78, 52, 92, 63, 40, 72, 50, 86, 60].map((height, bar) => <i key={bar} style={{ '--bar-height': `${height}%`, '--bar-delay': `${bar * .13}s` }} />)}</div>
        <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/15 pt-4 font-mono uppercase"><span><small>Features</small><strong>2,048 → 4,096</strong></span><span><small>Validation</small><strong>0.897562</strong></span></div>
      </>}
      {project.name === 'Pentagon' && <PentagonVisual />}
      </div>
    </div>
    <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/15 pt-4 text-left">
      <span><small className="block font-mono text-[.55rem] uppercase tracking-[.12em] text-white/45">Evidence</small><strong className="mt-1 block font-mono text-[.68rem] font-normal uppercase tracking-[.06em] text-white/85">{proof}</strong></span>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          advance(1)
        }}
        className="text-right font-mono text-[.57rem] uppercase leading-relaxed tracking-[.08em] text-accent hover:underline cursor-pointer bg-transparent border-0 p-0"
        aria-label={`Advance to ${nextProject.name}`}
      >
        Next<br />{nextProject.id} ↗
      </button>
    </div>
  </div>
}

function Work() {
  const [active, setActive] = useState(null)
  const [openOrigin, setOpenOrigin] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const carouselRef = useRef(null)

  const getResponsiveCardConfig = useCallback(() => {
    if (typeof window === 'undefined') {
      return { width: 800, height: 520, tilt: 0, spread: 0.92, perspective: 1400 }
    }
    const w = window.innerWidth
    const h = window.innerHeight

    if (w < 480) {
      // Small mobile phones (320px - 479px)
      const width = Math.max(280, Math.min(w - 24, 350))
      const height = Math.max(420, Math.min(Math.round(h * 0.58), 470))
      return { width, height, tilt: 0, spread: 0.85, perspective: 1100 }
    }
    if (w < 640) {
      // Standard mobile (480px - 639px)
      const width = Math.min(w - 32, 430)
      const height = Math.max(430, Math.min(Math.round(h * 0.58), 480))
      return { width, height, tilt: 0, spread: 0.86, perspective: 1150 }
    }
    if (w < 768) {
      // Small tablet portrait / large phones (640px - 767px)
      const width = Math.min(w - 60, 560)
      const height = Math.min(Math.round(h * 0.54), 490)
      return { width, height, tilt: 0, spread: 0.88, perspective: 1200 }
    }
    if (w < 1024) {
      // Tablet portrait (768px - 1023px)
      const width = Math.min(w - 80, 680)
      const height = Math.min(Math.round(h * 0.54), 520)
      return { width, height, tilt: 0, spread: 0.90, perspective: 1300 }
    }
    if (w < 1280) {
      // Laptop / Small desktop (1024px - 1279px)
      const width = Math.min(w - 160, 740)
      const height = 510
      return { width, height, tilt: 0, spread: 0.92, perspective: 1400 }
    }
    // Desktop (1280px+)
    return { width: Math.min(w - 240, 840), height: 540, tilt: 0, spread: 0.92, perspective: 1450 }
  }, [])

  const [cardDims, setCardDims] = useState(getResponsiveCardConfig)

  useEffect(() => {
    const handleResize = () => setCardDims(getResponsiveCardConfig())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getResponsiveCardConfig])

  const selectedProject = featuredProjects[selectedIndex]
  const changeProject = (step) => {
    setSelectedIndex((index) => (index + step + featuredProjects.length) % featuredProjects.length)
  }

  const updateUrlForProject = useCallback((project) => {
    const basePath = getAppBasePath()
    if (!project) {
      const targetHomeUrl = `${basePath}#work`
      if (window.location.pathname.includes('/projects/') || window.location.hash.includes('project')) {
        window.history.pushState(null, '', targetHomeUrl)
      }
      document.title = 'Reddirector · Engineering Portfolio'
      return
    }
    const slug = PROJECT_NAME_TO_SLUG[project.name] || project.id
    const targetUrl = `${basePath}projects/${slug}`
    if (window.location.pathname !== targetUrl && !window.location.hash.includes(slug)) {
      window.history.pushState({ project: slug }, '', targetUrl)
    }
    document.title = `${project.name} | Reddirector`
  }, [])

  // Auto-open project if URL points to it on mount
  useEffect(() => {
    const route = parseCurrentRoute()
    if (route.page === 'project' && route.project) {
      setActive(route.project)
      const foundIdx = featuredProjects.findIndex((p) => p.name === route.project.name)
      if (foundIdx !== -1) setSelectedIndex(foundIdx)
      document.title = `${route.project.name} | Reddirector`
    }
  }, [])

  // Handle browser back / forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentRoute()
      if (route.page === 'project' && route.project) {
        setActive(route.project)
        const foundIdx = featuredProjects.findIndex((p) => p.name === route.project.name)
        if (foundIdx !== -1) setSelectedIndex(foundIdx)
        document.title = `${route.project.name} | Reddirector`
      } else {
        setActive(null)
        document.title = 'Reddirector · Engineering Portfolio'
        const workEl = document.getElementById('work')
        if (workEl) {
          workEl.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigateProject = useCallback((targetSlug) => {
    const projName = SLUG_TO_PROJECT_NAME[targetSlug]
    const proj = featuredProjects.find((p) => p.name === projName)
    if (proj) {
      const targetIdx = featuredProjects.findIndex((p) => p.name === projName)
      triggerBarbaTransition(null, {
        type: 'case-study-switch',
        meta: proj,
        onSwitch: () => {
          if (targetIdx !== -1) setSelectedIndex(targetIdx)
          updateUrlForProject(proj)
          setActive(proj)
        }
      })
    }
  }, [updateUrlForProject])

  const handleCloseProject = useCallback(() => {
    updateUrlForProject(null)
    triggerBarbaTransition(null, { type: 'case-study-close' })
  }, [updateUrlForProject])

  const openProjectDetails = useCallback((project, event) => {
    if (!project) return
    if (event) {
      const bounds = event.currentTarget?.getBoundingClientRect?.() || { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 }
      setOpenOrigin({
        x: event.clientX || (bounds.left + bounds.width / 2),
        y: event.clientY || (bounds.top + bounds.height / 2)
      })
    } else {
      setOpenOrigin({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      })
    }
    updateUrlForProject(project)
    triggerBarbaTransition(null, { type: 'case-study-open', meta: project })
  }, [updateUrlForProject])

  useEffect(() => {
    setBarbaCaseStudyHandlers({
      open: (project) => {
        if (project) {
          setActive(project)
          updateUrlForProject(project)
        }
      },
      close: () => {
        setActive(null)
        updateUrlForProject(null)
      },
    })
  }, [updateUrlForProject])

  const renderProjectCard = (project, index) => {
    const inkIsDark = project.ink === 'dark'
    const nextIdx = (index + 1) % featuredProjects.length
    const nextProj = featuredProjects[nextIdx]

    return (
      <div
        className="project-feature grid overflow-hidden md:grid-cols-[1.05fr_.95fr] w-full h-full select-none cursor-pointer"
        onDoubleClick={(event) => {
          event.stopPropagation()
          openProjectDetails(project, event)
        }}
        title="Double-click to open case study"
        style={{
          background: project.color,
          color: inkIsDark ? '#0B0708' : '#fff',
        }}
      >
        <div className="project-stage-copy flex min-h-0 flex-col justify-between p-4 sm:p-7 lg:p-10" key={project.id}>
          <div>
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div>
                <p className="font-mono text-[.58rem] sm:text-[.65rem] uppercase tracking-[.1em]">
                  {project.id} / {index === 0 ? 'Featured project' : 'Selected project'}
                </p>
                <p className={`project-tag mt-1 sm:mt-2 font-mono text-[.56rem] sm:text-[.62rem] uppercase leading-relaxed ${inkIsDark ? 'text-black/70' : 'text-white/70'}`}>
                  {project.tag}
                </p>
              </div>
              <span className="shrink-0 whitespace-nowrap font-mono text-[.58rem] sm:text-[.65rem] tracking-[.08em]">
                {project.id} / {String(featuredProjects.length).padStart(2, '0')}
              </span>
            </div>

            <h3 className="font-display mt-3 sm:mt-7 max-w-xl text-[clamp(1.75rem,2.8vw,3.4rem)] font-black leading-[.88] sm:leading-[.84] tracking-[-.045em] break-normal">
              {project.name}
            </h3>

            <p className={`font-serif mt-2.5 sm:mt-5 max-w-lg text-[.82rem] sm:text-[.94rem] leading-[1.6] sm:leading-[1.7] line-clamp-2 sm:line-clamp-3 lg:line-clamp-4 ${inkIsDark ? 'text-black/80' : 'text-white/80'}`}>
              {project.short}
            </p>
          </div>

          <div className="pt-3 sm:pt-6" onPointerDown={(event) => event.stopPropagation()}>
            <HoldButton
              size="sm"
              radius={2}
              holdTime={600}
              backgroundColor={inkIsDark ? '#0b0708' : '#141417'}
              fillColor="#e5484d"
              textColor={inkIsDark ? '#ffffff' : '#f5f5f5'}
              fillTextColor="#ffffff"
              doneLabel="Opening..."
              onTap={(event) => {
                openProjectDetails(project, event)
              }}
              onHold={(event) => {
                openProjectDetails(project, event)
              }}
            >
              Open case study ↗
            </HoldButton>
          </div>
        </div>

        <ProjectVisual
          project={project}
          index={index}
          nextProject={nextProj}
          advance={changeProject}
          onOpenDetails={openProjectDetails}
        />
      </div>
    )
  }

  return <>
    <Reveal id="work" className="py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-[8vw]">
        <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
          <p className="section-label">01 / Selected work</p>
          <p className="font-mono text-[.62rem] uppercase tracking-[.1em] text-white/55">{String(featuredProjects.length).padStart(2, '0')} selected works <span aria-hidden="true">↘</span></p>
        </div>
        <WorkScrollProgress />

        <div className="mx-auto max-w-5xl py-12 text-center sm:py-16">
          <h2 className="font-display text-[clamp(4rem,9vw,9rem)] font-black leading-[.76] tracking-[-.055em]">WHAT I’VE<br />BUILT.</h2>
          <p className="font-serif mx-auto mt-6 max-w-2xl text-[.96rem] leading-[1.75] text-white/65">These projects show the work I want to do more of: building dependable systems, studying model internals, and keeping private work within its limits.</p>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[.6rem] uppercase tracking-[.1em] text-white/55" aria-live="polite">
            Showing project {selectedProject.id} / {String(featuredProjects.length).padStart(2, '0')}
            <span className="hidden sm:inline text-white/35 ml-3">· Double-click card to open details</span>
          </p>
          <div className="flex items-center gap-2" role="group" aria-label="Choose a project">
            <button type="button" onClick={() => changeProject(-1)} className="project-step" aria-label="Previous project">←</button>
            {featuredProjects.map((project, index) => <button type="button" key={project.name} onClick={() => setSelectedIndex(index)} className={`project-step project-step-index ${index === selectedIndex ? 'is-active' : ''}`} aria-label={`Show ${project.name}`} aria-pressed={index === selectedIndex}>{project.id}</button>)}
            <button type="button" onClick={() => changeProject(1)} className="project-step" aria-label="Next project">→</button>
          </div>
        </div>
      </div>

      <div
        className="relative w-full my-6 overflow-visible"
        style={{
          width: '100%',
          height: `${cardDims.height + (cardDims.width < 640 ? 30 : 60)}px`,
          position: 'relative'
        }}
      >
        <CircularCarousel
          ref={carouselRef}
          items={featuredProjects}
          selectedIndex={selectedIndex}
          preset="orbit"
          intro="rise"
          cardWidth={cardDims.width}
          aspectRatio={cardDims.width / cardDims.height}
          spread={cardDims.spread}
          fitScale={null}
          speed={5}
          captions={false}
          gap={0}
          tilt={cardDims.tilt}
          curve={0}
          perspective={cardDims.perspective}
          autoplay="drift"
          interval={3}
          direction="left"
          momentum={0.4}
          snap
          pauseOnHover
          focusOnClick
          draggable
          parallax={0.3}
          stretch={0.5}
          fadeColor="#000000"
          depthFade={0.5}
          innerShade={0.6}
          cornerRadius={12}
          onChange={(index) => setSelectedIndex(index % featuredProjects.length)}
          onItemClick={(item, index) => setSelectedIndex(index % featuredProjects.length)}
          onItemDoubleClick={(item, index, event) => openProjectDetails(item, event)}
          renderItem={renderProjectCard}
        />
      </div>
    </Reveal>
    <ProjectModal key={active?.id ?? 'closed'} project={active} openOrigin={openOrigin} close={handleCloseProject} onNavigateProject={handleNavigateProject} />
  </>
}

const methodPhases = [
  {
    project: 'SAE Reproduction',
    topic: 'Independent study / Mechanistic interpretability',
    title: 'Are sparse features easier to interpret?',
    paragraph: "I reproduced Anthropic's monosemanticity research independently, with no affiliation to Anthropic. Trained a GELU-1L sparse autoencoder (2048→4096 features) to test whether I actually understood the interpretability technique, not just the paper. Built and validated over 8 days (Aug 7–16, 2026).",
    stats: [
      { value: '0.897562', label: 'SAE validation cosine similarity' },
      { value: '0.10%', label: 'SAE dead features' },
    ],
  },
  {
    project: 'Orchestration Engine',
    topic: 'Systems / Task reliability',
    title: 'What survives a failed task?',
    paragraph: 'I hand-wrote a zero-dependency DAG execution engine from first principles for Python 3.12+. I engineered SQLite WAL write-ahead durability (44.7k writes/sec), 627 µs scheduling latency, SIGKILL isolation, and in-process crash resumption, closing all 13 architectural gaps with 162 automated tests.',
    stats: [
      { value: '162/162', label: '100% tests passing · 91.5% cov' },
      { value: 'v0.9.0', label: 'Production beta · PyPI release' },
    ],
  },
  {
    project: 'Pentagon',
    topic: 'Local-First Systems / AI Governance',
    title: 'Can multimodal AI run private by default?',
    paragraph: 'I engineered an enterprise-grade local-first AI workstation with zero-leak BYOK Fernet encryption, LangGraph state orchestration, ChromaDB RAG with automated CPU fallback, and six-tier autonomy governance across Web, Android, Electron, and bootable ISO.',
    stats: [
      { value: 'Zero-Leak', label: 'BYOK Fernet at rest' },
      { value: '80+ Models', label: 'NVIDIA NIM catalog' },
    ],
  },
]

function Method() {
  const section = useRef(null)
  const phaseContent = useRef(null)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [transition, setTransition] = useState('hold')
  const [sectionActive, setSectionActive] = useState(false)
  const [autoSlide, setAutoSlide] = useState(true)
  const phase = methodPhases[phaseIndex]

  usePageReveals(section)

  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const context = gsap.context(() => {
      gsap.from('.metric', { opacity: 0, y: 44, stagger: .12, scrollTrigger: { trigger: section.current, start: 'top 72%', once: true } })
    }, section)
    return () => context.revert()
  }, [])

  useEffect(() => {
    const node = section.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setSectionActive(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => setSectionActive(entry.isIntersecting), { threshold: .25 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (transition !== 'hold' || !sectionActive || !autoSlide) return undefined
    const timer = window.setTimeout(() => setTransition('exit'), 15000)
    return () => window.clearTimeout(timer)
  }, [autoSlide, phaseIndex, sectionActive, transition])

  useLayoutEffect(() => {
    if (transition === 'hold') return undefined
    if (reduceMotion()) {
      if (transition === 'exit') {
        setPhaseIndex((current) => (current + 1) % methodPhases.length)
      }
      setTransition('hold')
      return undefined
    }
    const movingContent = phaseContent.current
    if (transition === 'exit') {
      const outgoing = gsap.to(movingContent, {
        xPercent: -4,
        y: -8,
        autoAlpha: 0,
        duration: .58,
        ease: 'power2.in',
        onComplete: () => {
          setPhaseIndex((current) => (current + 1) % methodPhases.length)
          setTransition('enter')
        },
      })
      return () => outgoing.kill()
    }
    const incoming = gsap.fromTo(movingContent,
      { xPercent: 4, y: 8, autoAlpha: 0 },
      { xPercent: 0, y: 0, autoAlpha: 1, duration: .82, ease: 'power3.out', onComplete: () => setTransition('hold') },
    )
    return () => incoming.kill()
  }, [phaseIndex, transition])

  const choosePhase = (index) => {
    if (index === phaseIndex) return
    setPhaseIndex(index)
    setTransition('enter')
  }

  return <section ref={section} id="method" className="relative isolate overflow-hidden bg-accent px-5 py-20 text-white sm:px-[8vw] sm:py-24 lg:py-28">
    <SectionGeometry tone="light" variant="method" />
    <div className="relative z-10 mx-auto max-w-7xl">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/30 pb-4">
        <p className="font-mono text-[.68rem] uppercase tracking-[.1em]">02 / Method</p>
        <p className="font-mono text-[.6rem] uppercase tracking-[.08em] text-white/70">Research · Systems · Exploration</p>
      </header>

      <div className="grid gap-10 pt-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-14 lg:pt-14">
        <div className="flex flex-col items-start">
          <h2 className="font-display text-[clamp(2.7rem,6vw,6.4rem)] font-black leading-[.82] tracking-[-.035em]">
            RESEARCH.<br />SYSTEMS.<br /><span className="text-white/55">EXPLORATION.</span>
          </h2>
          <p className="font-serif mt-7 max-w-md text-[1.0625rem] leading-7 text-white/75">{content.philosophy}</p>
        </div>

        <div>
          <article className="method-panel relative overflow-hidden bg-black p-5 text-white sm:p-8" aria-label={`${phase.project} case note`}>
            <div ref={phaseContent} className="method-phase-content" aria-live="polite" aria-atomic="true">
              <div className="flex min-h-12 items-start justify-between gap-4 border-b border-white/20 pb-4">
                <div>
                  <p className="font-mono text-[.58rem] uppercase tracking-[.1em] text-accent">Case {String(phaseIndex + 1).padStart(2, '0')} / {String(methodPhases.length).padStart(2, '0')}</p>
                  <p className="mt-1 font-display text-2xl font-bold leading-none">{phase.project}</p>
                </div>
                <button type="button" className="method-autoplay-toggle shrink-0 font-mono text-[.55rem] uppercase tracking-[.08em]" aria-label={autoSlide ? 'Pause automatic case rotation' : 'Resume automatic case rotation'} aria-pressed={!autoSlide} disabled={transition !== 'hold'} onClick={() => setAutoSlide((active) => !active)}>
                  <span aria-hidden="true">{autoSlide ? 'Ⅱ' : '▶'}</span> {autoSlide ? 'Pause auto' : 'Resume auto'}
                </button>
              </div>

              <div className="pt-7">
                <p className="font-mono text-[.56rem] uppercase tracking-[.08em] text-white/55">{phase.topic}</p>
                <h3 className="mt-3 max-w-xl font-display text-[clamp(2.5rem,4.7vw,4.5rem)] font-black leading-[.88] tracking-[-.025em]">{phase.title}</h3>
                <p className="font-serif mt-5 max-w-2xl text-[.9rem] leading-[1.75] text-white/75">{phase.paragraph}</p>
                <div className="mt-7 grid grid-cols-2 gap-px border border-white/15 bg-white/15">
                  {phase.stats.map((stat) => <article className="metric min-h-32 bg-black p-4 sm:min-h-36 sm:p-5" key={`${phaseIndex}-${stat.label}`}>
                    <strong className="metric-number font-display block break-words text-[clamp(1.55rem,3.3vw,3rem)] font-black leading-[.85] tracking-[-.03em]">{stat.value}</strong>
                    <span className="mt-3 block max-w-40 font-mono text-[.55rem] uppercase leading-relaxed tracking-[.07em] text-white/60">{stat.label}</span>
                  </article>)}
                </div>
              </div>
            </div>

            <div className="mt-7 border-t border-white/20 pt-4">
              <div className="mb-2 flex justify-between gap-3 font-mono text-[.54rem] uppercase tracking-[.07em] text-white/55">
                <span>{autoSlide ? 'Next case in 15 seconds' : 'Auto slide paused'}</span><span>{String(phaseIndex + 1).padStart(2, '0')} / {String(methodPhases.length).padStart(2, '0')}</span>
              </div>
              <div className="method-progress" aria-hidden="true">
                <span key={`${phaseIndex}-${sectionActive}-${transition}-${autoSlide}`} className={`method-progress-fill ${sectionActive && transition === 'hold' && autoSlide ? 'is-running' : ''}`} />
              </div>
            </div>
          </article>

          <div className="method-topic-picker mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Choose a case" data-reveal-group>
            {methodPhases.map((item, index) => <button type="button" onClick={() => choosePhase(index)} aria-pressed={phaseIndex === index} className="min-h-16 border border-white/30 px-2 py-3 text-left transition-colors" key={item.project}>
              <span className="block font-mono text-[.53rem] uppercase tracking-[.06em] opacity-65">0{index + 1}</span>
              <span className="mt-1 block font-display text-base font-bold leading-[.95] sm:text-lg">{item.project}</span>
            </button>)}
          </div>
        </div>
      </div>
    </div>
  </section>
}

function Now() {
  return <Reveal id="now" className="px-5 py-24 sm:px-[8vw] sm:py-[12vw]">
    <div className="grid gap-8 lg:grid-cols-[.75fr_1.5fr]">
      <div><p className="section-label">04 / In progress</p><h2 className="font-display mt-4 text-[clamp(2.4rem,11vw,10rem)] font-black leading-[.78] sm:leading-[.72] tracking-[-.055em] break-words">THE<br />WORKBENCH.</h2></div>
      <div className="divide-y divide-white/20" data-reveal-group>{content.now.map((item, index) => <article className="grid gap-4 py-8 sm:grid-cols-[4rem_1fr]" key={item.name}>
        <span className="font-mono text-[.68rem] text-white/50">0{index + 1}</span>
        <div><h3 className="font-display text-4xl font-black tracking-tight">{item.name}</h3><p className="font-serif mt-3 max-w-xl text-[.95rem] leading-[1.7] text-white/65">{item.text}</p></div>
      </article>)}</div>
    </div>
  </Reveal>
}

function Contact() {
  const contactRef = useRef(null)
  usePageReveals(contactRef)
  return <footer ref={contactRef} id="contact" className="relative isolate overflow-hidden bg-white px-5 py-20 text-black sm:px-[8vw] sm:py-[10vw]">
    <SectionGeometry tone="light" variant="contact" />
    <div className="relative z-10 mx-auto max-w-7xl">
      <div className="flex items-center justify-between gap-4 border-b border-black/15 pb-4">
        <p className="font-mono text-[.63rem] uppercase tracking-[.16em]">05 / Contact & links</p>
        <div className="flex items-center gap-3">
          <svg className="contact-trace" viewBox="0 0 64 14" fill="none" aria-hidden="true"><path d="M1 7h13l5-5 7 10 7-8 5 3h25" stroke="currentColor" strokeWidth="1" /><circle cx="38" cy="7" r="2" fill="var(--color-interactive)" /><circle cx="63" cy="7" r="1" fill="currentColor" /></svg>
          <p className="font-mono text-[.58rem] uppercase tracking-[.1em] text-black/50">Red Director · India</p>
        </div>
      </div>
      <h2 className="font-display mt-10 text-[clamp(2.4rem,12vw,11rem)] font-black leading-[.78] sm:leading-[.7] tracking-[-.06em] break-words">LET'S TALK<br />ABOUT YOUR<br />PROJECT.</h2>
      <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
        <HoldButton
          doneLabel="Opening GitHub..."
          backgroundColor="#141417"
          fillColor="#e5484d"
          textColor="#ffffff"
          fillTextColor="#ffffff"
          size="md"
          radius={2}
          fillDirection="right"
          holdTime={800}
          releaseTime={180}
          pressScale={0.98}
          wave
          waveAmplitude={6}
          glow
          resetAfter={1200}
          onTap={() => window.open(content.links.github, '_blank')}
          onHold={() => window.open(content.links.github, '_blank')}
        >
          GitHub ↗
        </HoldButton>
        <HoldButton
          doneLabel="Opening LinkedIn..."
          backgroundColor="#141417"
          fillColor="#e5484d"
          textColor="#ffffff"
          fillTextColor="#ffffff"
          size="md"
          radius={2}
          fillDirection="right"
          holdTime={800}
          releaseTime={180}
          pressScale={0.98}
          wave
          waveAmplitude={6}
          glow
          resetAfter={1200}
          onTap={() => window.open(content.links.linkedin, '_blank')}
          onHold={() => window.open(content.links.linkedin, '_blank')}
        >
          LinkedIn ↗
        </HoldButton>
        <HoldButton
          doneLabel="Opening X..."
          backgroundColor="#141417"
          fillColor="#e5484d"
          textColor="#ffffff"
          fillTextColor="#ffffff"
          size="md"
          radius={2}
          fillDirection="right"
          holdTime={800}
          releaseTime={180}
          pressScale={0.98}
          wave
          waveAmplitude={6}
          glow
          resetAfter={1200}
          onTap={() => window.open(content.links.x, '_blank')}
          onHold={() => window.open(content.links.x, '_blank')}
        >
          X ↗
        </HoldButton>
      </div>
      <div className="mt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-black/15 pt-8">
        <a href="#work" className="contact-work-link inline-flex items-center gap-3 font-mono text-[.62rem] uppercase tracking-[.1em]">Back to selected work <span aria-hidden="true">↑</span></a>
        <p className="font-mono text-[.58rem] uppercase tracking-[.12em] text-black/50">© 2026 {content.name} · {content.handle}</p>
      </div>
    </div>
  </footer>
}

export default function PortfolioApp() {
  useSmoothScroll()
  const { playing, done } = useIntro()
  const contentRef = useRef(null)

  useEffect(() => {
    const cleanup = initBarba()
    return () => cleanup?.()
  }, [])

  return <div style={{ '--color-accent': content.accent }} className="portfolio-root" inert={playing || undefined} aria-hidden={playing || undefined}>
    <BarbaTransitionOverlay />
    <Intro active={playing} onDone={done} contentRef={contentRef} />
    <div className="portfolio-content" ref={contentRef}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header shown={!playing} />
      <main id="main" data-barba="container" data-barba-namespace="portfolio-home"><Hero shown={!playing} /><Work /><Method /><About /><Now /></main>
      <Contact />
    </div>
  </div>
}
