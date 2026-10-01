import { useEffect, useRef, useState } from 'react'

// Single IntersectionObserver reveal: fades + rises 12px once when 15% visible.
// Reduced motion: instant show (the CSS layer keeps only a <=100ms fade).
export default function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setShown(true)
      observer.disconnect()
    }, { threshold: 0.15 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`about-reveal${shown ? ' is-shown' : ''} ${className}`}>{children}</div>
}
