import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { content } from './content'

gsap.registerPlugin(ScrollTrigger)
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isTouch = () => window.matchMedia('(pointer: coarse)').matches

function useLenis() {
  useEffect(() => {
    if (reduced() || isTouch()) return undefined
    const lenis = new Lenis({ lerp: .08, smoothWheel: true, wheelMultiplier: .85 })
    let frame
    const raf = (time) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(frame); lenis.destroy() }
  }, [])
}

function Gate({ done }) {
  const ref = useRef(null), number = useRef(null)
  const [leaving, setLeaving] = useState(false)
  const enter = () => {
    if (leaving) return
    setLeaving(true)
    const complete = () => { ref.current?.remove(); done() }
    if (reduced()) return complete()
    gsap.to(ref.current, { clipPath: 'circle(0% at 50% 50%)', duration: .9, ease: 'power4.inOut', onComplete: complete })
  }
  useLayoutEffect(() => {
    if (reduced()) return undefined
    const context = gsap.context(() => {
      gsap.timeline({ onComplete: () => gsap.delayedCall(.45, enter) })
        .set('.gate-art, .gate-riddle', { opacity: 0, y: 12 })
        .fromTo(number.current, { opacity: 0, scale: .8 }, { opacity: 1, scale: 1, duration: .35, ease: 'back.out(1.7)' })
        .to(number.current, { opacity: 0, duration: .2, delay: .4 }).call(() => { number.current.textContent = '2' })
        .to(number.current, { opacity: 1, duration: .35, ease: 'back.out(1.7)' }).to(number.current, { opacity: 0, duration: .2, delay: .4 }).call(() => { number.current.textContent = '3' })
        .to(number.current, { opacity: 1, duration: .35, ease: 'back.out(1.7)' })
        .from('.gate-copy span', { opacity: 0, y: 10, stagger: .03, duration: .25 }, '<.1')
        .to('.gate-art', { opacity: 1, y: 0, duration: .55, ease: 'elastic.out(1, .45)' }, '>.1')
        .to('.gate-riddle', { opacity: 1, y: 0, stagger: .17, duration: .5, ease: 'power2.out' }, '>.15')
    }, ref)
    return () => context.revert()
  }, [])
  return <div ref={ref} onClick={enter} className="fixed inset-0 z-[100] grid cursor-pointer place-items-center bg-black [clip-path:circle(150%_at_50%_50%)]" role="status" aria-label="Opening story">
    <div className="w-[94vw] max-w-xl text-center"><div ref={number} className="font-display min-h-36 text-[clamp(6rem,16vw,11rem)] font-black leading-[.8] tracking-[-.06em]">1</div><p className="gate-copy mt-6 font-mono text-[.67rem] tracking-[.19em]">{[...content.entryCopy].map((item, i) => <span className="inline-block" key={i}>{item === ' ' ? '\u00a0' : item}</span>)}</p><div className="gate-art my-7 text-5xl text-accent">✦</div>{content.riddles.map((item) => <p className="gate-riddle my-2 text-xs text-white/60" key={item}>{item}</p>)}<button className="mt-8 font-mono text-[.58rem] uppercase tracking-[.14em] text-white/55">Click anywhere to enter</button></div>
  </div>
}

function Header({ ready }) {
  return <header className={`fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-6 mix-blend-difference transition-all duration-700 sm:px-10 lg:px-16 ${ready ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}><a className="font-display text-base font-extrabold tracking-[.06em]" href="#home">UNTITLED <span className="text-accent">STORY</span></a><nav className="flex gap-4 font-mono text-[.64rem] uppercase tracking-[.1em] sm:gap-8" aria-label="Main navigation">{['Plot', 'Characters', 'Info', 'Gallery'].map((item, i) => <a className={`link-line py-1 ${i === 1 || i === 2 ? 'hidden sm:block' : ''}`} href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}</nav></header>
}

function Hero({ ready }) {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (!ready || reduced()) return undefined
    const context = gsap.context(() => {
      gsap.fromTo('.hero-title', { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .8, ease: 'back.out(1.4)', delay: .45 })
      gsap.from('.hero-tagline span', { opacity: 0, y: 20, stagger: .08, duration: .45, delay: 1.1, ease: 'power3.out' })
      gsap.to('.hero-far', { scale: 1.08, duration: 20, ease: 'none' })
      gsap.to('.scroll-arrow', { y: 8, duration: .8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }, root)
    return () => context.revert()
  }, [ready])
  return <section ref={root} id="home" className="relative grid min-h-svh place-items-center overflow-hidden bg-[#242424]"><div className="hero-far absolute -inset-[5%] bg-[#242424] before:absolute before:inset-[11%_17%] before:-rotate-[8deg] before:border before:border-white/20" /><div className="absolute -inset-[5%] top-[35%] bg-accent [clip-path:polygon(0_67%,15%_31%,28%_67%,43%_20%,58%_72%,74%_39%,100%_75%,100%_100%,0_100%)]"><i className="absolute bottom-0 left-[20%] block h-[27vw] w-[18vw] rounded-t-full bg-black" /><i className="absolute bottom-0 left-[64%] block h-[14vw] w-[10vw] rounded-t-full bg-black" /><i className="absolute bottom-0 left-[83%] block h-[22vw] w-[4vw] bg-black" /></div><div className="absolute -inset-[5%] bg-black/45" /><div className="relative z-10 px-5 pt-32 text-center"><p className="eyebrow">A cinematic story template</p><h1 className="hero-title font-display my-3 text-[clamp(5.4rem,17vw,15rem)] font-black leading-[.72] tracking-[-.055em]">UNTITLED<br /><span className="text-accent">STORY</span></h1><p className="hero-tagline mx-auto mt-8 max-w-lg text-sm leading-relaxed sm:text-base">{content.tagline.split(' ').map((item, i) => <span className="mr-[.3em] inline-block" key={i}>{item}</span>)}</p></div><a href="#plot" className="absolute bottom-7 z-10 grid justify-items-center gap-2 font-mono text-[.56rem] uppercase tracking-[.18em]"><span>Scroll to explore</span><i className="scroll-arrow not-italic text-2xl text-accent">↓</i></a></section>
}

function Reveal({ children, className = '', id }) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (reduced()) return undefined
    const tween = gsap.fromTo(ref.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } })
    return () => tween.kill()
  }, [])
  return <section ref={ref} id={id} className={className}>{children}</section>
}

function Plot() { return <Reveal id="plot" className="min-h-screen px-5 py-24 sm:px-[8vw] sm:py-[13vw]"><div className="grid items-end gap-10 sm:mt-24 lg:grid-cols-[1.1fr_.65fr]"><div><p className="eyebrow">Placeholder story</p><h2 className="font-display mt-3 text-[clamp(4.6rem,11vw,10rem)] font-black leading-[.72] tracking-[-.055em]">THE CALL<br />BEYOND <span className="text-accent">HOME.</span></h2></div><div className="max-w-md"><p className="text-sm leading-loose text-white/65">{content.plot}</p><a href="#characters" className="mt-8 inline-flex gap-3 border-b border-accent pb-2 font-mono text-[.67rem] uppercase tracking-[.1em]">Meet the expedition <span className="text-accent">↗</span></a></div></div><div className="relative mt-16 h-[56vw] max-h-128 overflow-hidden bg-[#202020] sm:h-[42vw]"><i className="absolute right-[18%] top-[17%] h-[20vw] max-h-65 w-[20vw] max-w-65 rounded-full bg-accent" /><i className="absolute bottom-0 left-[3%] h-[90%] w-[58%] bg-black [clip-path:polygon(50%_0,100%_100%,0_100%)]" /><i className="absolute -right-[4%] bottom-0 h-[65%] w-[62%] bg-black [clip-path:polygon(50%_0,100%_100%,0_100%)]" /><b className="font-display absolute bottom-[5%] right-[4%] z-10 text-right text-[clamp(1.5rem,4vw,3rem)] font-black leading-[.8] text-black">SWAPPABLE<br />ARTWORK</b></div></Reveal> }

function Detail({ character, close }) { const ref = useRef(null); useLayoutEffect(() => { if (!reduced() && ref.current) gsap.fromTo(ref.current, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(150% at 50% 50%)', duration: .6, ease: 'power3.inOut' }) }, [character]); if (!character) return null; return <div className="fixed inset-0 z-40 overflow-y-auto bg-black/75 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label={`${character.name} dossier`}><div ref={ref} className="relative min-h-full overflow-hidden" style={{ background: character.color }}><i className="absolute -bottom-[9%] left-[9%] block h-[38vw] w-[38vw] rounded-full bg-black" /><i className="absolute -top-[10%] right-[8%] block h-[42vw] w-[42vw] bg-black [clip-path:polygon(50%_0,100%_100%,0_100%)]" /><button onClick={close} className="icon-button absolute right-6 top-6 z-10" aria-label="Close character details">×</button><div className="relative z-10 flex min-h-svh max-w-3xl flex-col justify-end p-8 text-black sm:p-20"><p className="eyebrow text-black">Character dossier</p><h2 className="font-display my-3 text-[clamp(5rem,14vw,12rem)] font-black leading-[.7] tracking-[-.05em]">{character.name}</h2><p className="max-w-xl text-base leading-loose">{character.bio}</p><small className="mt-12 font-mono text-[.61rem] uppercase tracking-[.14em]">↕ Scroll for the whole record</small></div></div></div> }

function Characters() { const [character, setCharacter] = useState(null); return <><Reveal id="characters" className="bg-white px-5 py-24 text-black sm:px-[8vw] sm:py-[13vw]"><div className="grid items-end gap-6 lg:grid-cols-[.75fr_1.4fr_.75fr]"><div className="section-label text-black">02 / The ensemble</div><h2 className="font-display text-[clamp(4.6rem,11vw,10rem)] font-black leading-[.72] tracking-[-.055em]">WHO<br />FOLLOWS?</h2><p className="mb-3 max-w-xs text-sm leading-relaxed text-black/65">Choose a face to uncover a character dossier.</p></div><div className="mt-12 grid grid-cols-2 gap-px bg-black sm:mt-20 lg:grid-cols-4">{content.characters.map((item, index) => <button onClick={() => setCharacter(item)} key={item.name} className="group relative min-h-70 overflow-hidden p-5 text-left text-black sm:min-h-96" style={{ background: item.color }}><span className="absolute right-5 top-5 font-mono text-[.61rem]">0{index + 1}</span><b className="font-display block pt-[20%] text-[clamp(5rem,12vw,10rem)] leading-[.7] tracking-[-.07em] opacity-75">{item.initial}</b><h3 className="font-display absolute bottom-12 left-5 text-4xl font-black leading-[.8] tracking-tight">{item.name}</h3><span className="absolute bottom-5 right-5 grid h-8 w-8 place-items-center rounded-full border border-black transition-transform duration-300 group-hover:rotate-45">↗</span></button>)}</div></Reveal><Detail character={character} close={() => setCharacter(null)} /></> }

function Stats() { const ref = useRef(null); useLayoutEffect(() => { if (reduced()) return undefined; const context = gsap.context(() => { if (!isTouch()) gsap.from('.stat', { opacity: 0, y: 50, stagger: .13, scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=1200', pin: true, scrub: 1 } }); gsap.utils.toArray('.stat-number').forEach((node) => ScrollTrigger.create({ trigger: ref.current, start: 'top 55%', once: true, onEnter: () => { const counter = { value: 0 }; gsap.to(counter, { value: Number(node.dataset.target), duration: 1.5, ease: 'power2.out', onUpdate: () => { node.textContent = `${Math.round(counter.value).toLocaleString()}${node.dataset.suffix}` } }) } })) }, ref); return () => context.revert() }, []); return <section ref={ref} id="info" className="bg-[#121212] px-5 py-24 sm:px-[8vw] sm:py-[10vw]"><div className="grid items-end gap-6 lg:grid-cols-[.7fr_1.2fr_.6fr]"><div className="section-label">03 / By the numbers</div><h2 className="font-display text-[clamp(4.6rem,11vw,10rem)] font-black leading-[.72] tracking-[-.055em]">THE<br />MAKING <span className="text-accent">OF IT.</span></h2><p className="mb-3 text-sm leading-relaxed text-white/60">Keep scrolling. Each marker arrives with the story.</p></div><div className="mt-16 grid grid-cols-2 gap-px bg-white/25 sm:mt-28 lg:grid-cols-5">{content.stats.map((item) => <article className="stat min-h-60 bg-[#121212] p-6" key={item.label}><span className="font-display text-3xl text-accent">{item.icon}</span><strong className="stat-number font-display mt-16 block text-[clamp(2.7rem,5vw,5.2rem)] font-extrabold leading-[.8] tracking-[-.04em]" data-target={item.target} data-suffix={item.suffix}>0{item.suffix}</strong><span className="mt-4 block font-mono text-[.6rem] uppercase tracking-[.12em] text-white/60">{item.label}</span></article>)}</div></section> }

function Gallery() { const [active, setActive] = useState(null); const color = active % 2 ? '#f2f2f2' : content.accent; const shift = (amount) => setActive((active + amount + content.gallery.length) % content.gallery.length); return <><Reveal id="gallery" className="px-5 py-24 sm:px-[8vw] sm:py-[13vw]"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><div className="section-label">04 / Found footage</div><h2 className="font-display mt-3 text-[clamp(4.6rem,11vw,10rem)] font-black leading-[.72] tracking-[-.055em]">FRAMES<br />FROM <span className="text-accent">ELSEWHERE.</span></h2></div><p className="mb-3 max-w-xs text-sm leading-relaxed text-white/60">Abstract, generated placeholders. Replace with your own licensed stills.</p></div><div className="mt-12 grid auto-rows-[14vw] grid-cols-12 gap-px sm:mt-20 sm:auto-rows-[8vw]">{content.gallery.map((item, index) => <button onClick={() => setActive(index)} key={item} className={`group relative overflow-hidden p-4 text-left text-black ${index === 2 || index === 5 ? 'col-span-8' : 'col-span-4'} ${index === 1 || index === 4 ? 'row-span-5 sm:row-span-6' : 'row-span-4'}`} style={{ background: index % 2 ? '#f2f2f2' : content.accent }}><i className="absolute left-[14%] top-[13%] h-[43%] w-[43%] rounded-full border-2 border-black" /><i className="absolute bottom-[13%] right-[9%] h-[42%] w-[58%] bg-black [clip-path:polygon(0_100%,65%_0,100%_100%)] transition-transform duration-500 group-hover:scale-110" /><span className="relative z-10 font-mono text-[.58rem] tracking-[.13em]">0{index + 1} / {item}</span></button>)}</div></Reveal>{active !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-xl" role="dialog" aria-modal="true" aria-label="Gallery image viewer"><button onClick={() => setActive(null)} className="icon-button absolute right-6 top-6" aria-label="Close gallery">×</button><button onClick={() => shift(-1)} className="absolute left-5 text-3xl" aria-label="Previous image">←</button><figure className="relative h-[64vh] w-[86vw] overflow-hidden sm:h-[72vh] sm:w-[76vw]" style={{ background: color }}><i className="absolute left-[13%] top-[12%] h-[39%] w-[39%] rounded-full border-4 border-black" /><i className="absolute bottom-[9%] right-[9%] h-[54%] w-[64%] bg-black [clip-path:polygon(0_100%,54%_0,100%_100%)]" /><b className="font-display absolute bottom-[7%] left-[7%] z-10 text-[clamp(2rem,5vw,4rem)] font-black leading-[.8] text-black">PLACEHOLDER<br />FRAME</b><figcaption className="absolute bottom-[8%] right-[12%] font-mono text-[.6rem] tracking-[.12em] text-white">0{active + 1} / {content.gallery[active]}</figcaption></figure><button onClick={() => shift(1)} className="absolute right-5 text-3xl" aria-label="Next image">→</button></div>}</> }

function Map() { return <Reveal className="grid gap-8 bg-accent px-5 py-24 text-black sm:px-[8vw] sm:py-[10vw] lg:grid-cols-[.7fr_1.3fr]"><div><div className="section-label text-black">Optional / The route</div><h2 className="font-display mt-3 text-[clamp(4.6rem,11vw,10rem)] font-black leading-[.72] tracking-[-.055em]">MARK THE<br />UNKNOWN.</h2></div><div className="relative min-h-[75vw] overflow-hidden border border-black sm:min-h-[38vw] before:absolute before:bottom-[12%] before:left-1/2 before:top-[12%] before:w-px before:rotate-24 before:bg-black after:absolute after:left-[8%] after:right-[8%] after:top-1/2 after:h-px after:-rotate-12 after:bg-black">{content.markers.map((item) => <button className="group absolute z-10 h-4 w-4 rounded-full border-2 border-black bg-accent" key={item.label} style={{ left: `${item.x}%`, top: `${item.y}%` }} aria-label={item.label}><span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 translate-y-2 whitespace-nowrap bg-black px-3 py-2 font-mono text-[.56rem] tracking-[.1em] text-accent opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">{item.label}</span></button>)}</div></Reveal> }

function App() { const [ready, setReady] = useState(false); useLenis(); return <div style={{ '--color-accent': content.accent }}><Gate done={() => setReady(true)} /><Header ready={ready} /><main><Hero ready={ready} /><Plot /><Characters /><Stats /><Gallery /><Map /></main><button className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-black text-accent" aria-label="Background audio is muted">⌁</button></div> }
export default App
