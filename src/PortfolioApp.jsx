import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { content } from './content'

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

function useSmoothScroll() {
  useEffect(() => {
    if (reduceMotion() || touchDevice()) return undefined
    const lenis = new Lenis({ lerp: .08, smoothWheel: true, wheelMultiplier: .86 })
    let frame
    const animate = (time) => { lenis.raf(time); frame = requestAnimationFrame(animate) }
    frame = requestAnimationFrame(animate)
    return () => { cancelAnimationFrame(frame); lenis.destroy() }
  }, [])
}

function SectionGeometry({ tone = 'dark', variant = 'work' }) {
  const field = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const section = field.current?.parentElement
    const context = gsap.context(() => {
      const scrollRange = { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 }
      gsap.fromTo('.geometry-orbit', { yPercent: -14, rotate: -12 }, { yPercent: 14, rotate: 12, ease: 'none', scrollTrigger: scrollRange })
      gsap.fromTo('.geometry-diamond', { y: 24, rotate: -18 }, { y: -24, rotate: 54, ease: 'none', scrollTrigger: scrollRange })
    }, field)
    return () => context.revert()
  }, [])
  return <div ref={field} className={`section-geometry section-geometry--${variant}`} data-tone={tone} aria-hidden="true">
    <div className="geometry-plane">
      <i className="geometry-ring geometry-orbit" />
      <i className="geometry-ring geometry-orbit geometry-orbit--secondary" />
      <i className="geometry-ring geometry-loop" />
      <i className="geometry-diamond" />
      <i className="geometry-diamond geometry-diamond--secondary" />
      <i className="geometry-cross"><b /><b /></i>
      <i className="geometry-cross geometry-cross--secondary"><b /><b /></i>
      <i className="geometry-rule" />
    </div>
  </div>
}

function Reveal({ children, className = '', id }) {
  const element = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const tween = gsap.fromTo(element.current, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: element.current, start: 'top 82%', once: true } })
    return () => tween.kill()
  }, [])
  return <section ref={element} id={id} className={`relative isolate overflow-hidden ${className}`}>
    <SectionGeometry variant={id === 'now' ? 'now' : 'work'} />
    <div className="relative z-10">{children}</div>
  </section>
}

function EntryGate({ enter }) {
  const gate = useRef(null), number = useRef(null), enterButton = useRef(null)
  const leaving = useRef(false)
  const leave = () => {
    if (leaving.current) return
    leaving.current = true
    const done = enter
    if (reduceMotion()) return done()
    gsap.to(gate.current, { clipPath: 'circle(0% at 50% 50%)', duration: .85, ease: 'power4.inOut', onComplete: done })
  }
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    const button = enterButton.current
    document.body.style.overflow = 'hidden'
    button?.focus({ preventScroll: true })
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); leave(); return }
      if (event.key === 'Tab') { event.preventDefault(); button?.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus && previousFocus !== document.body && document.contains(previousFocus)) previousFocus.focus()
    }
  }, [])
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const context = gsap.context(() => {
      gsap.timeline({ onComplete: () => gsap.delayedCall(.4, leave) })
        .set('.entry-symbol,.entry-riddle', { opacity: 0, y: 12 })
        .fromTo(number.current, { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .35, ease: 'back.out(1.7)' })
        .to(number.current, { opacity: 0, duration: .18, delay: .35 }).call(() => { number.current.textContent = '02' })
        .to(number.current, { opacity: 1, duration: .3, ease: 'back.out(1.7)' }).to(number.current, { opacity: 0, duration: .18, delay: .35 }).call(() => { number.current.textContent = '03' })
        .to(number.current, { opacity: 1, duration: .3, ease: 'back.out(1.7)' })
        .from('.entry-copy span', { opacity: 0, y: 10, stagger: .028, duration: .22 }, '<.1')
        .to('.entry-symbol', { opacity: 1, y: 0, duration: .5, ease: 'elastic.out(1,.45)' }, '>.1')
        .to('.entry-riddle', { opacity: 1, y: 0, stagger: .14, duration: .45, ease: 'power2.out' }, '>.1')
    }, gate)
    return () => context.revert()
  }, [])
  return <div ref={gate} className="entry-gate fixed inset-0 z-[100] grid place-items-center bg-black [clip-path:circle(150%_at_50%_50%)]" role="dialog" aria-modal="true" aria-labelledby="entry-title"><div className="w-[94vw] max-w-xl text-center"><h2 id="entry-title" className="sr-only">Welcome to the portfolio</h2><div ref={number} aria-hidden="true" className="font-display text-[clamp(5.5rem,15vw,10rem)] font-black leading-none tracking-[-.06em]">01</div><p id="entry-copy" className="entry-copy mt-5 font-mono text-[.65rem] tracking-[.19em]">{[...content.entryCopy].map((letter, index) => <span className="inline-block" key={index}>{letter === ' ' ? '\u00a0' : letter}</span>)}</p><div className="entry-symbol mt-7 text-4xl text-white" aria-hidden="true">✦</div>{content.riddles.map((line) => <p className="entry-riddle mt-3 text-xs text-white/60" key={line}>{line}</p>)}<button ref={enterButton} type="button" onClick={leave} className="entry-action mt-8 font-mono text-[.62rem] uppercase tracking-[.1em]">Enter portfolio <span aria-hidden="true">↗</span></button></div></div>
}

function Header({ shown }) {
  return <header className={`site-header fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-6 mix-blend-difference transition-all duration-700 sm:px-10 lg:px-16 ${shown ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}><a href="#top" aria-label="REDIRECTOR" className="brand-lockup font-display font-black uppercase">{logoLetters.map(([letter, desktopSize, mobileSize], index) => <span className="brand-letter" style={{ '--brand-size': `${desktopSize}px`, '--brand-size-mobile': `${mobileSize}px` }} key={index}>{letter}</span>)}</a><nav className="site-nav flex gap-4 font-mono text-[.68rem] uppercase tracking-[.08em] sm:gap-8" aria-label="Portfolio navigation"><a className="link-line" href="#work">Work</a><a className="link-line" href="#method">Method</a><a className="link-line" href="#now">Now</a><a className="link-line" href="#contact">Contact</a></nav></header>
}

function Hero({ shown }) {
  const hero = useRef(null)
  useLayoutEffect(() => {
    if (!shown || reduceMotion()) return undefined
    const context = gsap.context(() => {
      gsap.from('.hero-name > span', { opacity: 0, y: 42, stagger: .1, duration: .8, ease: 'power4.out', delay: .38 })
      gsap.from('.hero-intro', { opacity: 0, y: 22, duration: .7, ease: 'power3.out', delay: .85 })
      gsap.to('.hero-ring', { rotate: 360, duration: 38, ease: 'none', repeat: -1 })
      gsap.to('.hero-ring-outer', { rotate: -360, duration: 92, ease: 'none', repeat: -1 })
      gsap.to('.geo-float', { y: -12, rotate: 8, opacity: .2, duration: 8, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: { each: 1.2, from: 'random' } })
      gsap.to('.geo-orbit-path', { rotate: 360, duration: 48, ease: 'none', repeat: -1 })
      gsap.to('.hero-orb', { y: 90, scale: .84, ease: 'none', scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: 1 } })
    }, hero)
    return () => context.revert()
  }, [shown])
  return <section ref={hero} id="top" className="relative grid min-h-svh place-items-center overflow-hidden bg-black px-5">
    <div className="hero-ring absolute h-[78vw] w-[78vw] max-h-[58rem] max-w-[58rem] rounded-full border border-white/15" />
    <div className="hero-ring-outer absolute h-[104vw] w-[104vw] max-h-[76rem] max-w-[76rem] rounded-full border border-white/[.06]" />
    <div className="hero-orb absolute left-1/2 top-[37%] h-[31vw] w-[31vw] max-h-[28rem] max-w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-85" />
    <div className="hero-geometry pointer-events-none absolute inset-0" aria-hidden="true">
      <i className="geo-float geo-diamond absolute left-[15%] top-[25%]" />
      <i className="geo-float geo-square absolute right-[16%] top-[31%]" />
      <i className="geo-float geo-triangle absolute bottom-[24%] left-[18%]" />
      <i className="geo-float geo-cross absolute bottom-[27%] right-[20%]"><b /><b /></i>
      <i className="geo-orbit-path absolute right-[13%] top-[55%]"><b className="geo-orbit-dot" /></i>
      <i className="geo-line absolute left-[8%] top-[47%]" />
    </div>
    <div className="hero-content relative z-10 mt-18 max-w-6xl text-center"><h1 className="hero-name font-display text-white text-[clamp(4.5rem,15vw,13rem)] font-black leading-[.82] tracking-[-.035em]"><span className="block">RED</span><span className="block">DIRECTOR</span></h1><p className="hero-intro mx-auto mt-8 max-w-xl text-[1rem] leading-7 text-white/85">{content.intro}</p></div>
    <a href="#work" className="absolute bottom-7 z-10 grid justify-items-center gap-2 font-mono text-[.66rem] uppercase tracking-[.1em]"><span className="text-white">Selected work</span><span className="text-xl text-white">↓</span></a>
  </section>
}

function SAEResearchReport() {
  return <div className="sae-report">
    <main className="sae-report-main">
      <header className="sae-report-hero">
        <p className="sae-report-kicker">Independent reproduction · Mechanistic interpretability</p>
        <h2 id="project-title">TOWARDS<br /><span>MONOSEMANTICITY.</span></h2>
        <p id="project-detail" className="sae-report-intro">A research record for testing whether sparse, overcomplete dictionaries make a model’s internal activations easier to inspect than the neuron basis alone.</p>
        <div className="sae-report-links">
          <a href="https://www.transformer-circuits.pub/2023/monosemantic-features/index.html" target="_blank" rel="noreferrer">Read the original paper <span aria-hidden="true">↗</span></a>
          <a href="https://reddirector.github.io/Towards_Monosemanticity_Reproduction/" target="_blank" rel="noreferrer">Open the reproduction project <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="sae-report-metrics" aria-label="Reproduction snapshot">
        <article><span>Architecture</span><strong>GELU-1L</strong><small>as listed in the project</small></article>
        <article><span>SAE width</span><strong>2,048 <i>→</i> 4,096</strong><small>project-reported dimensions</small></article>
        <article><span>Validation</span><strong>0.897562</strong><small>cosine similarity</small></article>
        <article><span>Inactive features</span><strong>0.10%</strong><small>dead-feature rate reported</small></article>
      </section>
      <p className="sae-report-note">These are the figures currently published with this portfolio project—not results copied from Anthropic’s paper. The exact run configuration and metric protocol still need to be attached below.</p>

      <section className="sae-report-section">
        <div className="sae-report-section-label"><span>01</span><p>Research question</p></div>
        <div className="sae-report-section-body">
          <h3>Can a larger sparse basis reveal structure hidden by superposition?</h3>
          <p>Neurons can respond to several unrelated patterns at once (polysemanticity). The paper studies whether an overcomplete dictionary can represent the same dense model activation as a sparse combination of more coherent learned features. The aim is not ordinary compression: it is a more useful unit of analysis for inspecting model computation.</p>
          <div className="sae-report-flow" aria-label="Sparse autoencoder representation flow"><span>Model activation <b>x</b></span><i aria-hidden="true">→</i><span>SAE encoder</span><i aria-hidden="true">→</i><span>Sparse features <b>f</b></span><i aria-hidden="true">→</i><span>Decoder <b>D</b></span><i aria-hidden="true">→</i><span>Reconstruction <b>x̂</b></span></div>
          <div className="sae-report-equation"><span>Dictionary view</span><strong>x ≈ Df</strong><p><b>x</b> is the model activation, <b>f</b> its sparse feature vector, and the columns of <b>D</b> are learned decoder directions.</p></div>
        </div>
      </section>

      <section className="sae-report-section">
        <div className="sae-report-section-label"><span>02</span><p>Method & objective</p></div>
        <div className="sae-report-section-body">
          <h3>Keep reconstruction useful; make the code sparse.</h3>
          <p>The encoder maps activations into an overcomplete feature space; the decoder reconstructs them. Training balances reconstruction error against a penalty on feature activity:</p>
          <div className="sae-report-equation sae-report-equation--wide"><span>Simplified objective</span><strong>L = L<sub>reconstruction</sub>(x, x̂) + λ · ‖f‖₁</strong><p>For a mean-squared reconstruction term, stronger sparsity pressure (λ) can make codes more selective, but may worsen reconstruction. The chosen trade-off and exact implementation belong in the run record.</p></div>
          <ol className="sae-report-steps">
            <li><b>Collect</b><span>Capture activations at a named model layer and hook point.</span></li>
            <li><b>Fit</b><span>Train an overcomplete SAE with the documented reconstruction and sparsity losses.</span></li>
            <li><b>Measure</b><span>Report held-out reconstruction, sparsity, and inactive-feature counts with definitions.</span></li>
            <li><b>Inspect</b><span>Review activating examples, test feature coherence, then run controlled interventions.</span></li>
          </ol>
        </div>
      </section>

      <section className="sae-report-section">
        <div className="sae-report-section-label"><span>03</span><p>Reference vs reproduction</p></div>
        <div className="sae-report-section-body">
          <h3>Keep the paper baseline distinct from this run.</h3>
          <div className="sae-report-compare">
            <article><p className="sae-report-card-label">Original paper · reference</p><ul><li>One-layer transformer with a 512-neuron MLP layer.</li><li>Featured A/1 dictionary: 4,096 learned features.</li><li>Paper reports training on 8 billion activation datapoints.</li></ul><small>Reference-study facts; not reproduction measurements.</small></article>
            <article><p className="sae-report-card-label">This project · current snapshot</p><ul><li>Architecture listed as GELU-1L.</li><li>SAE dimensions listed as 2,048 → 4,096.</li><li>Validation cosine similarity: 0.897562; dead features: 0.10%.</li></ul><small>Project figures; configuration details are not yet linked here.</small></article>
          </div>
          <p className="sae-report-caution">Comparability check: the listed 2,048-dimensional input and the paper’s 512-neuron MLP are not the same stated activation width. Until the model checkpoint, layer/hook, data, and preprocessing are documented, describe this as an independent/adapted reproduction—not a parameter-for-parameter replication.</p>
        </div>
      </section>

      <section className="sae-report-section">
        <div className="sae-report-section-label"><span>04</span><p>Run record</p></div>
        <div className="sae-report-section-body">
          <h3>Make the result independently checkable.</h3>
          <p>Fill these from the actual training code, saved config, and evaluation logs. Keep unknown values explicit rather than estimating them.</p>
          <dl className="sae-report-fields">
            <div><dt>Base model / checkpoint</dt><dd>[ADD exact model identifier, revision, and source]</dd></div>
            <div><dt>Activation source</dt><dd>[ADD dataset, split, token count, and collection procedure]</dd></div>
            <div><dt>Layer / hook point</dt><dd>[ADD module name, tensor shape, and activation preprocessing]</dd></div>
            <div><dt>SAE implementation</dt><dd>[ADD encoder nonlinearity, biases, decoder constraints, and code version]</dd></div>
            <div><dt>Training configuration</dt><dd>[ADD optimizer, learning rate/schedule, batch size, steps, seed, and λ]</dd></div>
            <div><dt>Evaluation protocol</dt><dd>[ADD validation split, cosine-similarity aggregation, and dead-feature threshold]</dd></div>
            <div><dt>Artifacts / revision</dt><dd>[ADD config, checkpoint/log links, commit hash, and report date]</dd></div>
          </dl>
        </div>
      </section>

      <section className="sae-report-section">
        <div className="sae-report-section-label"><span>05</span><p>Analysis still to document</p></div>
        <div className="sae-report-section-body">
          <h3>Training metrics are only the first layer of evidence.</h3>
          <div className="sae-report-checks">
            <p><span>01</span><b>Feature interpretability</b><small>[ADD representative activating examples, counterexamples, and an evaluation rubric.]</small></p>
            <p><span>02</span><b>Feature splitting</b><small>[ADD dictionary sizes, matched feature families, and comparison method.]</small></p>
            <p><span>03</span><b>Intervention / steering</b><small>[ADD intervention, controls, observed effect, and limitations—or mark not run.]</small></p>
            <p><span>04</span><b>Universality</b><small>[ADD comparison model, feature-alignment method, and evidence—or mark not run.]</small></p>
          </div>
          <p className="sae-report-note">No feature-level or intervention conclusions are asserted here: the supplied context describes these research goals, but does not include run evidence for them.</p>
        </div>
      </section>

      <footer className="sae-report-footer"><span>Research file · 02 / SAE reproduction</span><span>Revision: [ADD DATE]</span><p>Primary source: Bricken et al., “Towards Monosemanticity: Decomposing Language Models With Dictionary Learning” (2023). The reproduction link above identifies the project; the run record is intentionally left open where evidence was not supplied.</p></footer>
    </main>
  </div>
}

function ProjectModal({ project, close }) {
  const panel = useRef(null)
  const overlay = useRef(null)
  const closeButton = useRef(null)
  const [reportReady, setReportReady] = useState(false)
  const isResearch = project?.name === 'SAE Reproduction'
  useLayoutEffect(() => {
    if (!project || !panel.current) return undefined
    setReportReady(!isResearch)
    const completeCover = () => { if (isResearch) setReportReady(true) }
    if (reduceMotion()) { completeCover(); return undefined }
    const reveal = gsap.fromTo(panel.current, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(150% at 50% 50%)', duration: .55, ease: 'power3.inOut', onComplete: completeCover })
    return () => reveal.kill()
  }, [project, isResearch])
  useEffect(() => {
    if (isResearch && reportReady) closeButton.current?.focus({ preventScroll: true })
  }, [isResearch, reportReady])
  useEffect(() => {
    if (!project) return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus({ preventScroll: true })
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
  }, [project, close])
  if (!project) return null
  const closeControl = <button ref={closeButton} onClick={close} type="button" className="icon-button" aria-label="Close project details">×</button>
  return <div ref={overlay} data-lenis-prevent className="project-overlay fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="project-title" aria-describedby="project-detail" onClick={(event) => { if (event.target === overlay.current) close() }}>
    <article ref={panel} className={`relative min-h-full overflow-hidden ${isResearch ? `sae-report-panel ${reportReady ? 'is-ready' : ''}` : 'bg-accent text-black'}`}>
      {!isResearch && <i aria-hidden="true" className="absolute -right-[10%] -top-[12%] h-[62vw] w-[62vw] rounded-full border border-black/20" />}
      {isResearch && reportReady ? <>
        <header className="sae-report-topbar"><p>02 / Research case file <span>·</span> SAE reproduction</p>{closeControl}</header>
        <SAEResearchReport />
      </> : isResearch ? <>
        <i aria-hidden="true" className="absolute -right-[10%] -top-[12%] h-[62vw] w-[62vw] rounded-full border border-black/20" />
        {closeControl}
        <div className="sae-cover" role="status" aria-live="polite">
          <p>Research archive / 02</p>
          <h2 id="project-title" className="font-display">SAE<br />REPRODUCTION</h2>
          <span id="project-detail">Opening case file · verifying report sections</span>
          <i aria-hidden="true"><b /></i>
        </div>
      </> : <>
        {closeControl}
        <div className="relative z-10 flex min-h-svh max-w-4xl flex-col justify-end p-7 sm:p-20">
          <p className="font-mono text-[.68rem] uppercase tracking-[.1em] text-black/70">{project.id} / {project.tag}</p>
          <h2 id="project-title" className="font-display mt-4 text-[clamp(4.5rem,12vw,11rem)] font-black leading-[.82] tracking-[-.035em]">{project.name}</h2>
          <p id="project-detail" className="mt-7 max-w-2xl text-base leading-7 text-black/80">{project.detail}</p>
          {project.link && <a className="modal-link mt-10 w-fit border-b border-black pb-2 font-mono text-[.7rem] uppercase tracking-[.08em]" href={project.link} target="_blank" rel="noreferrer">View repository ↗</a>}
        </div>
      </>}
    </article>
  </div>
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

function ProjectVisual({ project, index, nextProject, advance }) {
  const visual = useRef(null), scene = useRef(null), touchStart = useRef(null), swiped = useRef(false)
  const proof = {
    'Orchestration Engine': '56 / 56 tests passing',
    'SAE Reproduction': '0.897562 validation similarity',
    Pentagon: 'Private case study',
  }[project.name]
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const section = visual.current?.closest('#work')
    const context = gsap.context(() => {
      gsap.fromTo(scene.current, { y: 18, rotate: -.7, scale: .985 }, { y: -18, rotate: .7, scale: 1.015, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 } })
    }, visual)
    return () => context.revert()
  }, [])
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
  const handleClick = () => { if (swiped.current) { swiped.current = false; return } advance(1) }
  return <button ref={visual} type="button" onClick={handleClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="project-visual group/visual" aria-label={`Project visual. Click to show ${nextProject.name}, or swipe to browse projects.`}>
    <div className="flex items-center justify-between gap-3 font-mono text-[.6rem] uppercase tracking-[.1em] text-white/55">
      <span>Project representation</span><span>{project.id} / {String(featuredProjects.length).padStart(2, '0')}</span>
    </div>
    <div ref={scene} className="project-visual-scene">
      <div className={`project-visual-art project-visual-art--${index + 1}`} key={project.id} aria-hidden="true">
      {project.name === 'Orchestration Engine' && <>
        <p className="font-mono text-[.6rem] uppercase tracking-[.12em] text-white/55">Execution flow</p>
        <div className="feature-track my-10 flex items-start justify-between">{['Queue', 'Execute', 'Commit'].map((step, stepIndex) => <span className="feature-node" key={step}><i>{`0${stepIndex + 1}`}</i>{step}</span>)}</div>
        <p className="border-t border-white/15 pt-4 font-mono text-[.62rem] uppercase leading-relaxed tracking-[.08em] text-white/75">Durable state · SQLite event log</p>
      </>}
      {project.name === 'SAE Reproduction' && <>
        <p className="font-mono text-[.6rem] uppercase tracking-[.12em] text-white/55">Sparse autoencoder · research</p>
        <div className="sae-bars" aria-hidden="true">{[34, 58, 44, 78, 52, 92, 63, 40, 72, 50, 86, 60].map((height, bar) => <i key={bar} style={{ '--bar-height': `${height}%`, '--bar-delay': `${bar * .13}s` }} />)}</div>
        <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/15 pt-4 font-mono uppercase"><span><small>Features</small><strong>2,048 → 4,096</strong></span><span><small>Validation</small><strong>0.897562</strong></span></div>
      </>}
      {project.name === 'Pentagon' && <>
        <p className="font-mono text-[.6rem] uppercase tracking-[.12em] text-white/55">Private project</p>
        <div className="private-mark private-mark--pentagon"><i /><i /><i /><span>P</span></div>
        <p className="border-t border-white/15 pt-4 font-mono text-[.62rem] uppercase leading-relaxed tracking-[.08em] text-white/75">High-level case study · scope kept honest</p>
      </>}
      </div>
    </div>
    <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/15 pt-4 text-left">
      <span><small className="block font-mono text-[.55rem] uppercase tracking-[.12em] text-white/45">Evidence</small><strong className="mt-1 block font-mono text-[.68rem] font-normal uppercase tracking-[.06em] text-white/85">{proof}</strong></span>
      <span className="text-right font-mono text-[.57rem] uppercase leading-relaxed tracking-[.08em] text-accent">Next<br />{nextProject.id} ↗</span>
    </div>
  </button>
}

function Work() {
  const [active, setActive] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedProject = featuredProjects[selectedIndex]
  const previousProject = featuredProjects[(selectedIndex - 1 + featuredProjects.length) % featuredProjects.length]
  const nextProject = featuredProjects[(selectedIndex + 1) % featuredProjects.length]
  const changeProject = (step) => setSelectedIndex((index) => (index + step + featuredProjects.length) % featuredProjects.length)
  return <>
    <Reveal id="work" className="px-5 py-20 sm:px-[8vw] sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
          <p className="section-label">01 / Selected work</p>
          <p className="font-mono text-[.62rem] uppercase tracking-[.1em] text-white/55">03 selected works <span aria-hidden="true">↘</span></p>
        </div>
        <WorkScrollProgress />

        <div className="mx-auto max-w-5xl py-12 text-center sm:py-16">
          <h2 className="font-display text-[clamp(4rem,9vw,9rem)] font-black leading-[.76] tracking-[-.055em]">BUILD THE<br />EVIDENCE.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[.96rem] leading-[1.75] text-white/65">Three selected works across systems engineering, interpretability research, and private project work—each presented with its scope made clear.</p>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[.6rem] uppercase tracking-[.1em] text-white/55" aria-live="polite">Showing project {selectedProject.id} / {String(featuredProjects.length).padStart(2, '0')}</p>
          <div className="flex items-center gap-2" role="group" aria-label="Choose a project">
            <button type="button" onClick={() => changeProject(-1)} className="project-step" aria-label="Previous project">←</button>
            {featuredProjects.map((project, index) => <button type="button" key={project.name} onClick={() => setSelectedIndex(index)} className={`project-step project-step-index ${index === selectedIndex ? 'is-active' : ''}`} aria-label={`Show ${project.name}`} aria-pressed={index === selectedIndex}>{project.id}</button>)}
            <button type="button" onClick={() => changeProject(1)} className="project-step" aria-label="Next project">→</button>
          </div>
        </div>

        <div className="project-feature grid overflow-hidden md:grid-cols-[1.05fr_.95fr]" style={{ background: selectedProject.color, color: '#000' }} role="region" aria-label="Project carousel. Use the left and right arrow keys to switch projects." aria-live="polite" aria-atomic="true" tabIndex={0} onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); changeProject(-1) } else if (event.key === 'ArrowRight') { event.preventDefault(); changeProject(1) } }}>
          <div className="project-stage-copy flex min-h-[25rem] flex-col p-6 sm:p-9 lg:p-11" key={selectedProject.id}>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[.65rem] uppercase tracking-[.1em]">{selectedProject.id} / {selectedProject.name === featuredProjects[0].name ? 'Featured project' : 'Selected project'}</p>
                <p className="project-tag mt-3 font-mono text-[.62rem] uppercase leading-relaxed text-black/70">{selectedProject.tag}</p>
              </div>
                <span className="shrink-0 whitespace-nowrap font-mono text-[.65rem] tracking-[.08em]">{selectedProject.id} / {String(featuredProjects.length).padStart(2, '0')}</span>
            </div>
            <h3 className="font-display mt-12 max-w-2xl text-[clamp(3.5rem,7vw,6.5rem)] font-black leading-[.8] tracking-[-.045em]">{selectedProject.name}</h3>
            <p className="mt-6 max-w-xl text-[.94rem] leading-[1.7] text-black/80">{selectedProject.short}</p>
            <button type="button" onClick={() => setActive(selectedProject)} aria-haspopup="dialog" className="mt-auto inline-flex w-fit items-center gap-3 border-b border-black/40 pt-8 pb-2 font-mono text-[.65rem] uppercase tracking-[.1em] transition-colors hover:border-black">Open case study <span aria-hidden="true">↗</span></button>
          </div>
          <ProjectVisual project={selectedProject} index={selectedIndex} nextProject={nextProject} advance={changeProject} />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => setSelectedIndex((selectedIndex - 1 + featuredProjects.length) % featuredProjects.length)} className="project-preview project-preview--previous group" aria-label={`Preview previous project: ${previousProject.name}`}>
            <span className="project-preview-label">← Previous project <span>{previousProject.id}</span></span>
            <strong>{previousProject.name}</strong>
            <span className="project-preview-tag">{previousProject.tag}</span>
          </button>
          <button type="button" onClick={() => setSelectedIndex((selectedIndex + 1) % featuredProjects.length)} className="project-preview project-preview--next group" aria-label={`Preview next project: ${nextProject.name}`}>
            <span className="project-preview-label">Next project → <span>{nextProject.id}</span></span>
            <strong>{nextProject.name}</strong>
            <span className="project-preview-tag">{nextProject.tag}</span>
          </button>
        </div>
      </div>
    </Reveal>
    <ProjectModal project={active} close={() => setActive(null)} />
  </>
}

function Method() {
  const section = useRef(null)
  useLayoutEffect(() => {
    if (reduceMotion()) return undefined
    const context = gsap.context(() => {
      gsap.from('.metric', { opacity: 0, y: 44, stagger: .12, scrollTrigger: { trigger: section.current, start: 'top 72%', once: true } })
      gsap.utils.toArray('.metric-number').forEach((node) => ScrollTrigger.create({ trigger: section.current, start: 'top 62%', once: true, onEnter: () => { const state = { value: 0 }; const precision = Number(node.dataset.decimals || 0); gsap.to(state, { value: Number(node.dataset.value), duration: 1.4, ease: 'power2.out', onUpdate: () => { node.textContent = `${state.value.toFixed(precision)}${node.dataset.suffix}` } }) } }))
    }, section)
    return () => context.revert()
  }, [])
  return <section ref={section} id="method" className="relative isolate overflow-hidden bg-accent px-5 py-24 text-black sm:px-[8vw] sm:py-[11vw]"><SectionGeometry tone="light" variant="method" /><div className="relative z-10"><div className="grid gap-8 lg:grid-cols-[.75fr_1.5fr] lg:items-end"><div><p className="font-mono text-[.7rem] uppercase tracking-[.1em]">02 / Method</p><p className="mt-5 max-w-xs text-sm leading-7 text-black/70">{content.philosophy}</p></div><h2 className="font-display text-[clamp(4.8rem,11vw,10rem)] font-black leading-[.82] tracking-[-.035em]">DEPTH<br />OVER <span className="text-black/55">WRAPPERS.</span></h2></div><div className="mt-16 grid grid-cols-2 gap-px bg-black/25 lg:grid-cols-4">{content.metrics.map((metric) => <article className="metric min-h-60 bg-accent p-6" key={metric.label}><strong className="metric-number font-display mt-16 block text-[clamp(2.4rem,5vw,5rem)] font-black leading-[.82] tracking-[-.035em]" data-value={metric.value} data-suffix={metric.suffix} data-decimals={metric.decimals || 0}>{Number(metric.value).toFixed(metric.decimals || 0)}{metric.suffix}</strong><span className="mt-4 block max-w-36 font-mono text-[.66rem] uppercase leading-relaxed tracking-[.08em] text-black/70">{metric.label}</span></article>)}</div></div></section>
}

function Now() {
  return <Reveal id="now" className="px-5 py-24 sm:px-[8vw] sm:py-[12vw]">
    <div className="grid gap-8 lg:grid-cols-[.75fr_1.5fr]">
      <div><p className="section-label">03 / In progress</p><h2 className="font-display mt-4 text-[clamp(4.8rem,11vw,10rem)] font-black leading-[.72] tracking-[-.055em]">THE<br />WORKBENCH.</h2></div>
      <div className="divide-y divide-white/20">{content.now.map((item, index) => <article className="grid gap-4 py-8 sm:grid-cols-[4rem_1fr]" key={item.name}>
        <span className="font-mono text-[.68rem] text-white/50">0{index + 1}</span>
        <div><h3 className={`font-display text-4xl font-black tracking-tight ${item.name === 'Pentagon' ? 'flex items-center gap-3' : ''}`}>{item.name === 'Pentagon' && <svg className="pentagon-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m16 2 13 9-5 16H8L3 11l13-9Z" fill="var(--color-interactive)" fillOpacity=".13" stroke="currentColor" strokeWidth="1.5" /><path d="m16 2 0 14m13-5-13 5m8 11-8-11M8 27l8-11M3 11l13 5" stroke="currentColor" strokeWidth="1" /></svg>}{item.name}</h3><p className="mt-3 max-w-xl text-[.95rem] leading-[1.7] text-white/65">{item.text}</p></div>
      </article>)}</div>
    </div>
  </Reveal>
}

function Contact() {
  return <footer id="contact" className="relative isolate overflow-hidden bg-white px-5 py-20 text-black sm:px-[8vw] sm:py-[10vw]">
    <SectionGeometry tone="light" variant="contact" />
    <div className="relative z-10 mx-auto max-w-7xl">
      <div className="flex items-center justify-between gap-4 border-b border-black/15 pb-4">
        <p className="font-mono text-[.63rem] uppercase tracking-[.16em]">04 / Contact & links</p>
        <div className="flex items-center gap-3">
          <svg className="contact-trace" viewBox="0 0 64 14" fill="none" aria-hidden="true"><path d="M1 7h13l5-5 7 10 7-8 5 3h25" stroke="currentColor" strokeWidth="1" /><circle cx="38" cy="7" r="2" fill="var(--color-interactive)" /><circle cx="63" cy="7" r="1" fill="currentColor" /></svg>
          <p className="font-mono text-[.58rem] uppercase tracking-[.1em] text-black/50">Red Director · India</p>
        </div>
      </div>
      <h2 className="font-display mt-10 text-[clamp(4.8rem,12vw,11rem)] font-black leading-[.7] tracking-[-.06em]">LET'S BUILD<br />SOMETHING<br />THAT HOLDS.</h2>
      <div className="mt-14 border-t border-black/15 pt-8">
        <div>
          <p className="font-mono text-[.62rem] uppercase tracking-[.12em] text-black/55">Find me online</p>
          <div className="mt-6 flex flex-wrap gap-x-7 gap-y-4 font-mono text-[.68rem] uppercase tracking-[.12em]">
            <a className="footer-link border-b border-black pb-2" href={content.links.github} target="_blank" rel="noreferrer">GitHub / {content.handle} ↗</a>
            <a className="footer-link border-b border-black pb-2" href={content.links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a className="footer-link border-b border-black pb-2" href={content.links.x} target="_blank" rel="noreferrer">X ↗</a>
          </div>
          <a href="#work" className="contact-work-link mt-10 inline-flex items-center gap-3 font-mono text-[.62rem] uppercase tracking-[.1em]">Back to selected work <span aria-hidden="true">↑</span></a>
          <p className="mt-16 font-mono text-[.58rem] uppercase tracking-[.12em] text-black/50">© 2026 {content.name} · {content.handle}</p>
        </div>
      </div>
    </div>
  </footer>
}

export default function PortfolioApp() { const [entered, setEntered] = useState(false); useSmoothScroll(); return <div style={{ '--color-accent': content.accent }}>{!entered && <EntryGate enter={() => setEntered(true)} />}<Header shown={entered} /><main><Hero shown={entered} /><Work /><Method /><Now /></main><Contact /></div> }
