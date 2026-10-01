import { useCallback, useEffect, useState } from 'react'

// Intro state machine: 'playing' | 'done'.
// - Plays once per session (sessionStorage, try/catch — if it throws, play).
// - ?intro=replay forces playback, ?intro=off skips it.
// - prefers-reduced-motion still "plays" but Intro renders a 200ms fade only.
// - The portfolio mounts immediately underneath; `playing` only gates the
//   root's inert/aria-hidden state and the overlay's presence.
// Play on every load so the intro is always part of the site's arrival.
// Set this to true to restore once-per-session behavior (still overridable
// with ?intro=replay / ?intro=off either way).
const SHOW_ONCE_PER_SESSION = false

const readSkipParam = () => {
  try {
    const param = new URLSearchParams(window.location.search).get('intro')
    if (param === 'replay') {
      try { window.sessionStorage.removeItem('intro-played') } catch { /* ignore */ }
      return 'play'
    }
    if (param === 'off') return 'skip'
  } catch { /* ignore */ }
  return null
}

const playedThisSession = () => {
  if (!SHOW_ONCE_PER_SESSION) return false
  try { return window.sessionStorage.getItem('intro-played') === '1' } catch { return false }
}

const markPlayed = () => {
  try { window.sessionStorage.setItem('intro-played', '1') } catch { /* ignore */ }
}

export function useIntro() {
  const [phase, setPhase] = useState(() => {
    if (typeof window === 'undefined') return 'done'
    const param = readSkipParam()
    if (param === 'skip') return 'done'
    if (param === 'play') return 'playing'
    return playedThisSession() ? 'done' : 'playing'
  })

  const done = useCallback(() => {
    markPlayed()
    setPhase('done')
  }, [])

  return { playing: phase === 'playing', done }
}
