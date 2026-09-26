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
        <p id="project-detail" className="sae-report-intro">I’m testing whether a sparse, overcomplete dictionary makes a model’s internal activations easier to study than its neurons alone.</p>
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
      <p className="sae-report-note">These figures come from my project notes, not Anthropic’s paper. I still need to add the exact training setup and explain how each metric was calculated.</p>

      <section className="sae-report-section">
        <div className="sae-report-section-label"><span>01</span><p>Research question</p></div>
        <div className="sae-report-section-body">
          <h3>Can a larger sparse basis reveal structure hidden by superposition?</h3>
          <p>A neuron can respond to several unrelated patterns, a property called polysemanticity. The paper tests whether a larger dictionary can represent the same activation as a sparse mix of more coherent features. The goal is not simply to compress the activation. It is to make the model easier to study.</p>
          <div className="sae-report-flow" aria-label="Sparse autoencoder representation flow"><span>Model activation <b>x</b></span><i aria-hidden="true">→</i><span>SAE encoder</span><i aria-hidden="true">→</i><span>Sparse features <b>f</b></span><i aria-hidden="true">→</i><span>Decoder <b>D</b></span><i aria-hidden="true">→</i><span>Reconstruction <b>x̂</b></span></div>
          <div className="sae-report-equation"><span>Dictionary view</span><strong>x ≈ Df</strong><p><b>x</b> is the model activation, <b>f</b> its sparse feature vector, and the columns of <b>D</b> are learned decoder directions.</p></div>
        </div>
      </section>

      <section className="sae-report-section">
        <div className="sae-report-section-label"><span>02</span><p>Method & objective</p></div>
        <div className="sae-report-section-body">
          <h3>Keep reconstruction useful; make the code sparse.</h3>
          <p>The encoder maps each activation into a larger feature space. The decoder then tries to reconstruct it. Training balances reconstruction error against a penalty that encourages sparse feature activity:</p>
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
          <h3>The paper and this run are not the same experiment.</h3>
          <div className="sae-report-compare">
            <article><p className="sae-report-card-label">Original paper · reference</p><ul><li>One-layer transformer with a 512-neuron MLP layer.</li><li>Featured A/1 dictionary: 4,096 learned features.</li><li>Paper reports training on 8 billion activation datapoints.</li></ul><small>Reference-study facts; not reproduction measurements.</small></article>
            <article><p className="sae-report-card-label">This project · current snapshot</p><ul><li>Architecture listed as GELU-1L.</li><li>SAE dimensions listed as 2,048 → 4,096.</li><li>Validation cosine similarity: 0.897562; dead features: 0.10%.</li></ul><small>Project figures; configuration details are not yet linked here.</small></article>
          </div>
          <p className="sae-report-caution">The project lists 2,048 input dimensions. The paper’s featured model has a 512-neuron MLP. Until I document the checkpoint, layer, data, and preprocessing, I should call this an adapted reproduction, not a parameter-matched replication.</p>
        </div>
      </section>

      <section className="sae-report-section">
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

      <section className="sae-report-section">
        <div className="sae-report-section-label"><span>05</span><p>Analysis still to document</p></div>
        <div className="sae-report-section-body">
          <h3>Training numbers don’t tell me what a feature means.</h3>
          <div className="sae-report-checks">
            <p><span>01</span><b>Feature interpretability</b><small>[Examples where a feature activates, counterexamples, and the rubric used.]</small></p>
            <p><span>02</span><b>Feature splitting</b><small>[Dictionary sizes compared, matched feature families, and comparison method.]</small></p>
            <p><span>03</span><b>Intervention / steering</b><small>[Intervention, controls, result, and limitations, or “not run.”]</small></p>
            <p><span>04</span><b>Universality</b><small>[Second model, feature matching method, evidence, or “not run.”]</small></p>
          </div>
          <p className="sae-report-note">I haven’t added feature interpretations or intervention results because my current notes don’t include that evidence.</p>
        </div>
      </section>

      <footer className="sae-report-footer"><span>Research file · 02 / SAE reproduction</span><span>Updated: [Date]</span><p>Primary source: Bricken et al., “Towards Monosemanticity: Decomposing Language Models With Dictionary Learning” (2023). The project link is above. I’ve left gaps where I still need to add run details or evidence.</p></footer>
    </main>
  </div>
}

const ORCHESTRATION_REPO = 'https://github.com/Reddirector/Orchestration_Engine'

function OrchestrationDependencyGraph() {
  return <figure className="oe-dependency-graph">
    <svg viewBox="0 0 920 280" role="img" aria-labelledby="oe-graph-title">
      <title id="oe-graph-title">Two independent tasks run in the same scheduling pass; a third waits for both to succeed.</title>
      <rect className="oe-graph-card" x="24" y="42" width="276" height="74" rx="2" />
      <rect className="oe-graph-card" x="24" y="164" width="276" height="74" rx="2" />
      <rect className="oe-graph-card oe-graph-card--target" x="610" y="103" width="286" height="74" rx="2" />
      <path className="oe-graph-edge oe-graph-edge--a" d="M300 79 C430 79 470 123 610 140" />
      <path className="oe-graph-edge oe-graph-edge--b" d="M300 201 C430 201 470 157 610 140" />
      <circle className="oe-graph-node" cx="300" cy="79" r="6" />
      <circle className="oe-graph-node oe-graph-node--delayed" cx="300" cy="201" r="6" />
      <circle className="oe-graph-node oe-graph-node--target" cx="610" cy="140" r="7" />
      <text className="oe-graph-index" x="42" y="68">TASK 01</text>
      <text className="oe-graph-label" x="42" y="96">Independent A</text>
      <text className="oe-graph-index" x="42" y="190">TASK 02</text>
      <text className="oe-graph-label" x="42" y="218">Independent B</text>
      <text className="oe-graph-index" x="632" y="129">TASK 03 · DEPENDS ON BOTH</text>
      <text className="oe-graph-label" x="632" y="157">Runs after success</text>
    </svg>
    <figcaption>Two ready branches can run in one scheduling pass. The dependent task becomes eligible only after both report <code>SUCCEEDED</code>.</figcaption>
  </figure>
}

function OrchestrationEngineReport() {
  const report = useRef(null)
  const transitionStates = ['PENDING', 'READY', 'RUNNING', 'SUCCEEDED', 'FAILED', 'RETRY_WAIT', 'CANCELLED']
  const testSubjects = [
    ['State machine', 'Validate legal task transitions and persist each transition before changing in-memory state.'],
    ['Dependency scheduler', 'Run independent tasks in one pass; hold a dependent task until every dependency succeeds.'],
    ['Retries and timeouts', 'Apply task-level retry policies; route timeout failures through the same retry budget.'],
    ['Failure propagation', 'Cancel direct and transitive dependents, while unaffected branches finish.'],
    ['SQLite history', 'Append ordered task events, including retry attempts, under a required workflow_id.'],
    ['End-to-end use', 'Write a workflow JSON file and run it through the public entrypoint, not only internal helpers.'],
  ]
  useLayoutEffect(() => {
    const root = report.current
    const scope = root?.closest('.oe-report-panel')
    if (!root || !scope || reduceMotion()) return undefined
      const scroller = scope.closest('.project-overlay')
      const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power2.out' } })
        .fromTo('.oe-report-topbar p', { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: .35 })
        .fromTo('.oe-report-topbar .icon-button', { scale: .9 }, { scale: 1, duration: .32 }, '<')
        .fromTo('.oe-report-kicker', { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: .38 }, '-=.12')
        .fromTo('.oe-report-hero h2', { autoAlpha: 0, y: 20, clipPath: 'inset(0 0 18% 0)' }, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: .68, ease: 'power3.out' }, '-=.08')
        .fromTo('.oe-report-intro', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .46 }, '-=.28')
        .fromTo('.oe-report-links a', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .07 }, '-=.18')
        .fromTo('.oe-report-metrics article', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .075 }, '-=.08')
        .fromTo('.oe-report-note', { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: .32 }, '-=.1')

      gsap.utils.toArray('.oe-report-section', root).forEach((section) => {
        const parts = [section.querySelector('.oe-report-section-label'), section.querySelector('.oe-report-section-body')].filter(Boolean)
        gsap.fromTo(parts, { autoAlpha: 0, y: 18 }, {
          autoAlpha: 1, y: 0, duration: .52, stagger: .11, ease: 'power2.out',
          scrollTrigger: { trigger: section, scroller, start: 'top 82%', once: true },
        })
      })

      const graph = root.querySelector('.oe-dependency-graph')
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

      const stateMachine = root.querySelector('.oe-state-machine')
      if (stateMachine) {
        const states = [...stateMachine.querySelectorAll('.oe-state-path .oe-state-chip')]
        const stateTimeline = gsap.timeline({ scrollTrigger: { trigger: stateMachine, scroller, start: 'top 82%', once: true } })
        states.forEach((state, index) => {
          stateTimeline
            .to(state, { color: '#B7FF00', borderColor: '#B7FF00', backgroundColor: 'rgba(183,255,0,.16)', duration: .2 }, index * .34)
            .to(state, { color: 'rgba(255,255,255,.82)', borderColor: 'rgba(183,255,0,.34)', backgroundColor: 'rgba(183,255,0,.045)', duration: .3 }, index * .34 + .2)
        })
      }

      const durability = root.querySelector('.oe-durability-flow')
      if (durability) {
        const steps = [...durability.querySelectorAll('span')]
        const arrows = [...durability.querySelectorAll('i')]
        gsap.set([...steps, ...arrows], { autoAlpha: 0, y: 6 })
        gsap.timeline({ scrollTrigger: { trigger: durability, scroller, start: 'top 84%', once: true } })
          .to(steps, { autoAlpha: 1, y: 0, duration: .34, stagger: .22, ease: 'power2.out' })
          .to(arrows, { autoAlpha: 1, y: 0, duration: .24, stagger: .22, ease: 'power2.out' }, '-=.58')
      }

      const footer = root.querySelector('.oe-report-footer')
      if (footer) gsap.fromTo(footer, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .5, scrollTrigger: { trigger: footer, scroller, start: 'top 90%', once: true } })
    }, scope)
    ScrollTrigger.refresh()
    return () => context.revert()
  }, [])
  return <div className="oe-report" ref={report}>
    <main className="oe-report-main">
      <header className="oe-report-hero">
        <p className="oe-report-kicker">Independent systems project · Python workflow orchestration</p>
        <h2 id="project-title">A WORKFLOW ENGINE<br /><span>FROM FIRST PRINCIPLES.</span></h2>
        <p id="project-detail" className="oe-report-intro">I designed and built the state machine, scheduler, retries, failure handling, persistence layer, and public API by hand. The point was to understand why orchestration systems make these trade-offs, not just call one as a black box.</p>
        <div className="oe-report-links">
          <a href={ORCHESTRATION_REPO} target="_blank" rel="noreferrer">Open source repository <span aria-hidden="true">↗</span></a>
          <a href={`${ORCHESTRATION_REPO}/blob/main/README.md`} target="_blank" rel="noreferrer">Read setup and API notes <span aria-hidden="true">↗</span></a>
          <a href={`${ORCHESTRATION_REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">Apache 2.0 license <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <section className="oe-report-metrics" aria-label="Project snapshot">
        <article><span>Project version</span><strong>v0.1.0</strong><small>Stage 1 of a planned six-stage rollout</small></article>
        <article><span>Automated tests</span><strong>58 / 58</strong><small>All passing in the supplied project notes</small></article>
        <article><span>Runtime dependencies</span><strong>0</strong><small>Python standard library only</small></article>
        <article><span>Definition format</span><strong>JSON</strong><small>Intent separated from runtime state</small></article>
      </section>
      <p className="oe-report-note">The supplied project notes identify v0.1.0 as the current version; no GitHub Release is listed for it.</p>

      <section className="oe-report-section">
        <div className="oe-report-section-label"><span>01</span><p>Why build it this way</p></div>
        <div className="oe-report-section-body">
          <h3>Make the decisions visible, not hidden behind a framework.</h3>
          <p>Orchestration libraries are useful, but they can make scheduling, retry, and durability behavior easy to take for granted. This solo project implements those pieces directly, as a small dependency-free system for multi-step jobs where tasks have prerequisites, can fail transiently, and need a durable history.</p>
          <div className="oe-report-facts"><p><span>01 / Build approach</span><b>State machine, scheduler, retries, persistence, and public API implemented from first principles.</b></p><p><span>02 / Runtime</span><b>Python 3.12+ with sqlite3, concurrent.futures, dataclasses, and enum.</b></p><p><span>03 / Tooling</span><b>uv for environments and packaging; pytest, ruff, and strict mypy for checks.</b></p></div>
        </div>
      </section>

      <section className="oe-report-section">
        <div className="oe-report-section-label"><span>02</span><p>Scheduling model</p></div>
        <div className="oe-report-section-body">
          <h3>A dependency graph, not a fixed sequence.</h3>
          <p>A task is ready only when every dependency has succeeded. Independent ready tasks can be scheduled together; a task that depends on both waits for both.</p>
          <OrchestrationDependencyGraph />
          <div className="oe-state-machine"><div className="oe-state-machine-heading"><span>Task lifecycle</span><small>Transitions are validated before they are accepted</small></div><div className="oe-state-list"><div className="oe-state-path"><span className="oe-state-chip">PENDING</span><i aria-hidden="true">→</i><span className="oe-state-chip">READY</span><i aria-hidden="true">→</i><span className="oe-state-chip">RUNNING</span></div><div className="oe-state-outcomes"><small>Possible outcomes</small><div>{transitionStates.slice(3).map((state) => <span className="oe-state-chip oe-state-chip--branch" key={state}>{state}</span>)}</div></div></div></div>
        </div>
      </section>

      <section className="oe-report-section">
        <div className="oe-report-section-label"><span>03</span><p>Durability & failure</p></div>
        <div className="oe-report-section-body">
          <h3>Record the transition before advancing live state.</h3>
          <p>Every task transition is appended to the SQLite <code>task_events</code> log before the in-memory state is updated. If the write fails, the live state does not move ahead of its durable history. Events are ordered, include retry attempts, and are scoped to a required <code>workflow_id</code>.</p>
          <div className="oe-durability-flow" aria-label="State transition persistence order"><span>Validate transition</span><i aria-hidden="true">→</i><span>Append SQLite event</span><i aria-hidden="true">→</i><span>Update live state</span></div>
          <div className="oe-report-checks"><article><span>RETRY</span><p>A timeout uses the task's retry budget, as an ordinary execution failure does.</p></article><article><span>PROPAGATE</span><p>When retries are exhausted, dependent tasks are cancelled, including transitive dependents.</p></article><article><span>FINISH</span><p>The workflow becomes failed only when every task is terminal; unaffected branches can still complete.</p></article></div>
        </div>
      </section>

      <section className="oe-report-section">
        <div className="oe-report-section-label"><span>04</span><p>Verification record</p></div>
        <div className="oe-report-section-body">
          <h3>What was checked, and how close it gets to real use.</h3>
          <p>The supplied build notes report 58 automated tests passing. They also describe checks beyond isolated unit tests:</p>
          <div className="oe-test-table" role="table" aria-label="Verification subjects and evidence"><div className="oe-test-table-head" role="row"><span role="columnheader">Subject</span><span role="columnheader">Evidence in the project notes</span></div>{testSubjects.map(([subject, evidence], index) => <div className="oe-test-row" role="row" key={subject}><span role="cell"><i>{String(index + 1).padStart(2, '0')}</i>{subject}</span><p role="cell">{evidence}</p></div>)}</div>
          <div className="oe-verification-strip"><p><b>01 / Built wheel</b><span>Installed into a clean virtual environment; public API imports checked from the installed package.</span></p><p><b>02 / Outside consumer</b><span>A separate project and environment ran a three-task non-linear workflow end to end.</span></p><p><b>03 / Package metadata</b><span>License and packaging metadata checked from the built wheel itself.</span></p></div>
        </div>
      </section>

      <section className="oe-report-section">
        <div className="oe-report-section-label"><span>05</span><p>API & scope</p></div>
        <div className="oe-report-section-body">
          <h3>A small public surface; safety-sensitive mechanics stay internal.</h3>
          <p>The public API covers task and workflow models, retry and status types, workflow execution and JSON loading, status/history reads, and SQLite connection access. Raw transition and scheduling helpers remain internal because calling them directly would bypass state validation.</p>
          <div className="oe-api-list"><code>Task · Workflow · RetryPolicy</code><code>TaskState · WorkflowStatus</code><code>run_workflow · run_workflow_from_file</code><code>load_workflow_from_json</code><code>get_workflow_status · get_workflow_history</code><code>get_connection</code></div>
          <p>Workflow definitions are JSON data. They describe identity and task intent, but exclude runtime state; the engine tracks that separately after a run starts.</p>
        </div>
      </section>

      <section className="oe-report-section">
        <div className="oe-report-section-label"><span>06</span><p>Bug that changed the design</p></div>
        <div className="oe-report-section-body">
          <h3>A passing test suite had missed a real dependency deadlock.</h3>
          <p>For six days, task completion helpers updated each <code>Task</code> object but not the separate <code>task_states</code> map the scheduler reads. Existing tests populated that map by hand, so they skipped the faulty execution path. Manual end-to-end reasoning exposed the deadlock; the completion, failure, and retry paths were fixed to update the scheduler's state as part of the transition.</p>
          <p className="oe-report-callout">The lesson I took from it: test the public execution path too. A green unit suite is not proof that the scheduler sees the state the task object claims to have.</p>
        </div>
      </section>

      <section className="oe-report-section">
        <div className="oe-report-section-label"><span>07</span><p>Current boundaries</p></div>
        <div className="oe-report-section-body">
          <h3>Stage 1 is intentionally small, not finished.</h3>
          <p>The plan has six stages. The current v0.1.0 scope is the minimal packaged and publicly showable engine. Performance and cleanup work, a thin CLI, and maintenance are later steps.</p>
          <div className="oe-limit-list"><p><span>01</span><b>Timeout default</b><small>Current per-task default is short for realistic LLM or API calls; it needs reconsidering.</small></p><p><span>02</span><b>Database location</b><small>The database path is fixed and relative rather than configurable per consumer.</small></p><p><span>03</span><b>CLI</b><small>Planned as a wrapper over the stable library API; not included in this stage.</small></p></div>
        </div>
      </section>

      <footer className="oe-report-footer"><span>01 / Orchestration Engine</span><span>v0.1.0 · Stage 1 / 6</span><p>Source for this case file: the supplied project context and the linked repository. The project notes are the source for the 58-test and isolated-install claims above.</p><a href={ORCHESTRATION_REPO} target="_blank" rel="noreferrer">github.com/Reddirector/Orchestration_Engine ↗</a></footer>
    </main>
  </div>
}

function ProjectModal({ project, close, openOrigin }) {
  const panel = useRef(null)
  const overlay = useRef(null)
  const closeButton = useRef(null)
  const venom = useRef(null)
  const venomLabel = useRef(null)
  const [reportReady, setReportReady] = useState(false)
  const [transitionDone, setTransitionDone] = useState(false)
  const isResearch = project?.name === 'SAE Reproduction'
  const isOrchestration = project?.name === 'Orchestration Engine'
  const usesVenom = isResearch || isOrchestration
  useLayoutEffect(() => {
    if (!project || !panel.current) return undefined
    if (usesVenom) {
      setReportReady(false)
      setTransitionDone(false)
      if (reduceMotion() || !venom.current) {
        setReportReady(true)
        setTransitionDone(true)
        return undefined
      }
      if (isOrchestration) {
        gsap.set(venom.current, { scale: 0, rotation: -8, autoAlpha: 1, transformOrigin: '50% 50%' })
        gsap.set(venomLabel.current, { autoAlpha: 0, y: 10 })
        const timeline = gsap.timeline({ onComplete: () => setTransitionDone(true) })
        timeline
          .to(venom.current, { scale: 1, rotation: 0, duration: .82, ease: 'power3.out' }, 0)
          .call(() => setReportReady(true), null, .82)
          .to(venomLabel.current, { autoAlpha: 1, y: 0, duration: .24, ease: 'power2.out' }, .9)
          .to({}, { duration: .62 }, 1.14)
          .to(venomLabel.current, { autoAlpha: 0, y: -5, duration: .16 }, 1.76)
          .to(venom.current, { scale: 0, rotation: 8, duration: .98, ease: 'power3.in' }, 1.76)
          .set(venom.current, { autoAlpha: 0 }, 2.74)
        return () => timeline.kill()
      }
      gsap.set(venom.current, { scale: 0, autoAlpha: 1, transformOrigin: '50% 50%' })
      gsap.set(venomLabel.current, { autoAlpha: 0 })
      const timeline = gsap.timeline({ onComplete: () => setTransitionDone(true) })
      timeline
        .to(venom.current, { scale: 1, duration: 1.15, ease: 'power3.inOut' }, 0)
        .call(() => setReportReady(true), null, 1.15)
        .to(venomLabel.current, { autoAlpha: 1, duration: .2 }, 1.15)
        .to({}, { duration: .45 }, 1.35)
      .to(venomLabel.current, { autoAlpha: 0, duration: .15 }, 1.8)
      .to(venom.current, { scale: 0, duration: 1.2, ease: 'power3.inOut' }, 1.8)
      .set(venom.current, { autoAlpha: 0 }, 3)
      return () => timeline.kill()
    }
    setReportReady(true)
    setTransitionDone(true)
    if (reduceMotion()) return undefined
    const reveal = gsap.fromTo(panel.current, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(150% at 50% 50%)', duration: .55, ease: 'power3.inOut' })
    return () => reveal.kill()
  }, [project, usesVenom, openOrigin])
  useEffect(() => {
    if (usesVenom && reportReady) closeButton.current?.focus({ preventScroll: true })
  }, [usesVenom, reportReady])
  useEffect(() => {
    if (!project) return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (usesVenom && !reportReady) overlay.current?.focus({ preventScroll: true })
    else closeButton.current?.focus({ preventScroll: true })
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
  const closeControl = <button ref={closeButton} onClick={close} type="button" className="icon-button" aria-label="Close project details">×</button>
  return <div ref={overlay} tabIndex="-1" data-lenis-prevent className={`project-overlay fixed inset-0 z-50 overflow-y-auto ${usesVenom ? 'bg-transparent' : 'bg-black/80 backdrop-blur-xl'}`} role="dialog" aria-modal="true" aria-labelledby="project-title" aria-describedby="project-detail" onClick={(event) => { if (event.target === overlay.current) close() }}>
    {usesVenom && !transitionDone && <div className="sr-only">
      <div role="status" aria-live="polite">{reportReady ? `${project.name} report ready.` : `Opening ${project.name} case study.`}</div>
      {!reportReady && <><h2 id="project-title">{project.name}</h2><p id="project-detail">Opening the {project.name} case study.</p></>}
    </div>}
    <article ref={panel} aria-hidden={usesVenom && !reportReady} style={isOrchestration ? { overflow: 'visible' } : undefined} className={`relative min-h-full overflow-hidden ${isResearch ? `sae-report-panel ${reportReady ? 'is-ready' : 'is-covered'}` : isOrchestration ? `oe-report-panel ${reportReady ? 'is-ready' : 'is-covered'}` : 'bg-accent text-black'}`}>
      {!usesVenom && <i aria-hidden="true" className="absolute -right-[10%] -top-[12%] h-[62vw] w-[62vw] rounded-full border border-black/20" />}
      {isResearch && reportReady ? <>
        <header className="sae-report-topbar"><p>02 / Research case file <span>·</span> SAE reproduction</p>{closeControl}</header>
        <SAEResearchReport />
      </> : isOrchestration && reportReady ? <>
        <header className="oe-report-topbar"><p>01 / Engine case file <span>·</span> Orchestration Engine</p>{closeControl}</header>
        <OrchestrationEngineReport />
      </> : usesVenom ? null : <>
        {closeControl}
        <div className="relative z-10 flex min-h-svh max-w-4xl flex-col justify-end p-7 sm:p-20">
          <p className="font-mono text-[.68rem] uppercase tracking-[.1em] text-black/70">{project.id} / {project.tag}</p>
          <h2 id="project-title" className="font-display mt-4 text-[clamp(4.5rem,12vw,11rem)] font-black leading-[.82] tracking-[-.035em]">{project.name}</h2>
          <p id="project-detail" className="mt-7 max-w-2xl text-base leading-7 text-black/80">{project.detail}</p>
          {project.link && <a className="modal-link mt-10 w-fit border-b border-black pb-2 font-mono text-[.7rem] uppercase tracking-[.08em]" href={project.link} target="_blank" rel="noreferrer">View repository ↗</a>}
        </div>
      </>}
    </article>
    {usesVenom && !transitionDone && <div className={`sae-venom-transition ${isOrchestration ? 'oe-venom-transition' : ''}`} aria-hidden="true">
      <div ref={venom} className={`sae-venom-blob ${isOrchestration ? 'oe-venom-blob' : ''}`} style={{ left: `${openOrigin?.x ?? window.innerWidth / 2}px`, top: `${openOrigin?.y ?? window.innerHeight / 2}px` }}>
        {!isOrchestration && [-42, -18, 26, 52, 138].map((angle) => <i className="sae-venom-tendril" style={{ '--tendril-angle': `${angle}deg` }} key={angle} />)}
      </div>
      <div ref={venomLabel} className={`sae-venom-label ${isOrchestration ? 'oe-venom-label' : ''}`}>
        {isOrchestration ? <>
          <svg className="oe-loader-graph" viewBox="0 0 180 64"><path d="M28 18 C65 18 68 32 90 32 M28 46 C65 46 68 32 90 32 H150" /><circle cx="28" cy="18" r="4" /><circle cx="28" cy="46" r="4" /><circle cx="90" cy="32" r="5" /><circle cx="150" cy="32" r="4" /></svg>
          <span>01 / Workflow file</span><strong>Orchestration Engine</strong>
        </> : <><span>02 / Research file</span><strong>SAE reproduction</strong></>}
      </div>
    </div>}
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
  const visual = useRef(null), scene = useRef(null), starField = useRef(null), progressTrack = useRef(null), progressCount = useRef(null), transferSpark = useRef(null), touchStart = useRef(null), swiped = useRef(false)
  const proof = {
    'Orchestration Engine': '58 / 58 tests passing',
    'SAE Reproduction': '0.897562 validation similarity',
    Pentagon: 'Private case study',
  }[project.name]
  useLayoutEffect(() => {
    if (reduceMotion() || project.name === 'Orchestration Engine') return undefined
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
        if (progressCount.current) progressCount.current.textContent = String(completed).padStart(2, '0')
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
        flight.to(points[targetIndex], { fill: '#B7FF00', opacity: 1, duration: .16, ease: 'power1.out' }, duration - .04)
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
  const handleClick = () => { if (swiped.current) { swiped.current = false; return } advance(1) }
  return <button ref={visual} type="button" onClick={handleClick} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="project-visual group/visual" aria-label={`Project visual. Click to show ${nextProject.name}, or swipe to browse projects.`}>
    <div className="flex items-center justify-between gap-3 font-mono text-[.6rem] uppercase tracking-[.1em] text-white/55">
      <span>Project representation</span><span>{project.id} / {String(featuredProjects.length).padStart(2, '0')}</span>
    </div>
    <div ref={scene} className="project-visual-scene">
      <div className={`project-visual-art project-visual-art--${index + 1} ${project.name === 'Orchestration Engine' ? 'oe-project-art' : ''}`} key={project.id} aria-hidden="true">
      {project.name === 'Orchestration Engine' && <>
        <div className="flex items-center justify-between font-mono text-[.6rem] uppercase tracking-[.12em] text-white/55">
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
            <line className="oe-flight-trail" />
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
      {project.name === 'Pentagon' && <>
        <p className="font-mono text-[.6rem] uppercase tracking-[.12em] text-white/55">Private project</p>
        <div className="private-mark private-mark--pentagon"><i /><i /><i /><span>P</span></div>
        <p className="border-t border-white/15 pt-4 font-mono text-[.62rem] uppercase leading-relaxed tracking-[.08em] text-white/75">Private project · details not public</p>
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
  const [openOrigin, setOpenOrigin] = useState(null)
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
          <h2 className="font-display text-[clamp(4rem,9vw,9rem)] font-black leading-[.76] tracking-[-.055em]">WHAT I’VE<br />BUILT.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[.96rem] leading-[1.75] text-white/65">These projects show the work I want to do more of: building dependable systems, studying model internals, and keeping private work within its limits.</p>
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
            <button type="button" onClick={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); setOpenOrigin({ x: event.detail ? event.clientX : bounds.left + bounds.width / 2, y: event.detail ? event.clientY : bounds.top + bounds.height / 2 }); setActive(selectedProject) }} aria-haspopup="dialog" className="mt-auto inline-flex w-fit items-center gap-3 border-b border-black/40 pt-8 pb-2 font-mono text-[.65rem] uppercase tracking-[.1em] transition-colors hover:border-black">Open case study <span aria-hidden="true">↗</span></button>
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
    <ProjectModal key={active?.id ?? 'closed'} project={active} openOrigin={openOrigin} close={() => setActive(null)} />
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
    paragraph: 'I hand-wrote an execution/orchestration engine from scratch, choosing systems depth and interview legibility over another AI-wrapper project. I read the failure paths first — retries, timeouts, crash isolation, dependency deadlocks — then built and tested each one before calling it done.',
    stats: [
      { value: '58/58', label: 'Orchestration tests passing' },
      { value: 'v0.1.0', label: 'Apache 2.0 · Published' },
    ],
  },
  {
    project: 'Pentagon',
    topic: 'In progress / Private project',
    title: 'Which constraints shape the solution?',
    paragraph: 'I started Pentagon with an open-ended problem and a goal of understanding its constraints before settling on a solution. Working through it has reinforced the value of testing assumptions early. It is still in progress, and I am keeping the details private until I can share them clearly.',
    stats: [
      { value: 'IN PROGRESS', label: 'Current project status' },
      { value: 'PRIVATE', label: 'Project details' },
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

  return <section ref={section} id="method" className="relative isolate overflow-hidden bg-accent px-5 py-20 text-black sm:px-[8vw] sm:py-24 lg:py-28">
    <SectionGeometry tone="light" variant="method" />
    <div className="relative z-10 mx-auto max-w-7xl">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/25 pb-4">
        <p className="font-mono text-[.68rem] uppercase tracking-[.1em]">02 / Method</p>
        <p className="font-mono text-[.6rem] uppercase tracking-[.08em] text-black/65">Research · Systems · Exploration</p>
      </header>

      <div className="grid gap-10 pt-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-14 lg:pt-14">
        <div className="flex flex-col items-start">
          <h2 className="font-display text-[clamp(2.7rem,6vw,6.4rem)] font-black leading-[.82] tracking-[-.035em]">
            RESEARCH.<br />SYSTEMS.<br /><span className="text-black/55">EXPLORATION.</span>
          </h2>
          <p className="mt-7 max-w-md text-sm leading-7 text-black/75">{content.philosophy}</p>
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
                <p className="mt-5 max-w-2xl text-[.9rem] leading-[1.75] text-white/75">{phase.paragraph}</p>
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

          <div className="method-topic-picker mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Choose a case">
            {methodPhases.map((item, index) => <button type="button" onClick={() => choosePhase(index)} aria-pressed={phaseIndex === index} className="min-h-16 border border-black/30 px-2 py-3 text-left transition-colors" key={item.project}>
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
      <div><p className="section-label">03 / In progress</p><h2 className="font-display mt-4 text-[clamp(4.8rem,11vw,10rem)] font-black leading-[.72] tracking-[-.055em]">THE<br />WORKBENCH.</h2></div>
      <div className="divide-y divide-white/20">{content.now.map((item, index) => <article className="grid gap-4 py-8 sm:grid-cols-[4rem_1fr]" key={item.name}>
        <span className="font-mono text-[.68rem] text-white/50">0{index + 1}</span>
        <div><h3 className="font-display text-4xl font-black tracking-tight">{item.name}</h3><p className="mt-3 max-w-xl text-[.95rem] leading-[1.7] text-white/65">{item.text}</p></div>
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
      <h2 className="font-display mt-10 text-[clamp(4.8rem,12vw,11rem)] font-black leading-[.7] tracking-[-.06em]">LET'S TALK<br />ABOUT YOUR<br />PROJECT.</h2>
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
