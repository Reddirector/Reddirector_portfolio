'use client';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import './GlyphLottery.css';

const DIGIT_POOL = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const UPPER_POOL = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
const LOWER_POOL = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];
const SYMBOL_POOL = ['/', '.', '-', '_', '#', '%', ':', '+', '=', '*', '?'];

function getCharPool(char, charset) {
  if (charset && charset !== 'auto') {
    return Array.from(charset);
  }
  if (/[0-9]/.test(char)) return DIGIT_POOL;
  if (/[A-Z]/.test(char)) return UPPER_POOL;
  if (/[a-z]/.test(char)) return LOWER_POOL;
  return SYMBOL_POOL;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false);

const GlyphLottery = forwardRef(function GlyphLottery(
  {
    text,
    children,
    as = 'span',
    className = '',
    style = {},
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight = 1.1,
    align = 'center',
    color,
    accentColor = '#ef4444',
    charset = 'auto',
    trigger = 'view',
    direction = 'left',
    spinSpeed = 26,
    duration = 0.55,
    stagger = 0.08,
    bounce = 0.35,
    blur = 0.3,
    fade = 0.25,
    flash = 0.85,
    loop = false,
    interval = 3,
    flickable = true,
    clickToSpin = true,
    spinOnHover = true,
    delay = 0,
    onComplete,
    ...rest
  },
  ref
) {
  const containerRef = useRef(null);
  const reelsRef = useRef([]);
  const animTimers = useRef({ loop: 0, delay: 0, flashTimeouts: [] });
  const [spinning, setSpinning] = useState(false);
  const [flashingReels, setFlashingReels] = useState({});

  // Extract plain text string
  const contentString = useMemo(() => {
    if (text != null) return String(text);
    if (typeof children === 'string' || typeof children === 'number') {
      return String(children);
    }
    return '';
  }, [text, children]);

  const chars = useMemo(() => Array.from(contentString), [contentString]);

  // Generate randomized symbol strips for each character reel
  const reelData = useMemo(() => {
    const stripLength = Math.max(14, Math.round(spinSpeed * duration) + 8);
    const nonSpaces = chars.filter(c => !/^\s$/.test(c));
    const nonSpaceCount = nonSpaces.length;

    let nonSpaceIndex = 0;
    return chars.map((char, index) => {
      const isSpace = /^\s$/.test(char);
      if (isSpace) {
        return { char, isSpace: true, symbols: [char], delaySec: 0, durationSec: 0 };
      }

      const r = nonSpaceIndex++;
      let delaySec = 0;
      if (direction === 'right') {
        delaySec = (nonSpaceCount - 1 - r) * stagger;
      } else if (direction === 'center') {
        const center = (nonSpaceCount - 1) / 2;
        delaySec = Math.abs(r - center) * stagger;
      } else if (direction === 'edges') {
        const center = (nonSpaceCount - 1) / 2;
        delaySec = (center - Math.abs(r - center)) * stagger;
      } else if (direction === 'random') {
        const pseudoRand = ((r * 9301 + 49297) % 233280) / 233280;
        delaySec = pseudoRand * nonSpaceCount * stagger;
      } else {
        // default: left
        delaySec = r * stagger;
      }

      const pool = getCharPool(char, charset);
      const symbols = [];
      for (let s = 0; s < stripLength - 1; s++) {
        symbols.push(pickRandom(pool));
      }
      symbols.push(char); // Target character is final lock

      return {
        char,
        isSpace: false,
        symbols,
        delaySec,
        durationSec: duration + delaySec,
        targetIndex: symbols.length - 1
      };
    });
  }, [chars, spinSpeed, duration, stagger, direction, charset]);

  const reelDataRef = useRef(reelData);
  reelDataRef.current = reelData;

  // Clear pending timers
  const clearTimers = useCallback(() => {
    clearTimeout(animTimers.current.loop);
    clearTimeout(animTimers.current.delay);
    animTimers.current.flashTimeouts.forEach(t => clearTimeout(t));
    animTimers.current.flashTimeouts = [];
  }, []);

  // Spin sequence execution
  const executeSpin = useCallback(() => {
    clearTimers();
    if (prefersReducedMotion()) {
      setSpinning(false);
      onComplete?.();
      return;
    }

    setSpinning(true);
    setFlashingReels({});

    let maxDuration = 0;
    reelDataRef.current.forEach((reel, index) => {
      if (reel.isSpace) return;
      const el = reelsRef.current[index];
      if (!el) return;

      const strip = el.querySelector('.glyph-lottery__strip');
      if (!strip) return;

      const totalItems = reel.symbols.length;
      const targetOffset = -((totalItems - 1) * 1.15).toFixed(3);
      const reelDur = duration;
      const reelDel = reel.delaySec;
      const totalTime = reelDel + reelDur;

      if (totalTime > maxDuration) {
        maxDuration = totalTime;
      }

      // Reset to top without transition
      strip.style.transition = 'none';
      strip.style.transform = 'translateY(0em)';
      void strip.offsetHeight; // Force reflow

      // Animate to target with slot machine bounce overshoot
      const bounceEasing =
        bounce > 0
          ? `cubic-bezier(0.12, 0.8, 0.28, ${(1 + bounce * 0.45).toFixed(3)})`
          : 'cubic-bezier(0.16, 1, 0.3, 1)';

      strip.style.transition = `transform ${reelDur}s ${bounceEasing} ${reelDel}s`;
      strip.style.transform = `translateY(${targetOffset}em)`;

      // Trigger landing flash
      const flashTimer = setTimeout(() => {
        setFlashingReels(prev => ({ ...prev, [index]: true }));
        const flashOffTimer = setTimeout(() => {
          setFlashingReels(prev => ({ ...prev, [index]: false }));
        }, 280);
        animTimers.current.flashTimeouts.push(flashOffTimer);
      }, (reelDel + duration) * 1000);

      animTimers.current.flashTimeouts.push(flashTimer);
    });

    // Sequence completion
    const completeTimer = setTimeout(() => {
      setSpinning(false);
      onComplete?.();

      if (loop) {
        animTimers.current.loop = setTimeout(() => {
          executeSpin();
        }, Math.max(200, interval * 1000));
      }
    }, (maxDuration + 0.1) * 1000);

    animTimers.current.flashTimeouts.push(completeTimer);
  }, [clearTimers, onComplete, bounce, duration, loop, interval]);

  // Imperative handle
  useImperativeHandle(ref, () => ({
    spin: () => executeSpin()
  }));

  // Trigger setup (view / mount / manual)
  useEffect(() => {
    if (trigger === 'manual') return undefined;

    const start = () => {
      if (delay > 0) {
        animTimers.current.delay = setTimeout(executeSpin, delay * 1000);
      } else {
        executeSpin();
      }
    };

    if (trigger === 'mount') {
      start();
      return () => clearTimers();
    }

    // Default: 'view'
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      start();
      return () => clearTimers();
    }

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [trigger, delay, executeSpin, clearTimers]);

  // Event handlers for user interactions
  const handleClick = useCallback(() => {
    if (clickToSpin && !spinning) {
      executeSpin();
    }
  }, [clickToSpin, spinning, executeSpin]);

  const handleMouseEnter = useCallback(() => {
    if (spinOnHover && !spinning) {
      executeSpin();
    }
  }, [spinOnHover, spinning, executeSpin]);

  // Flick interaction on individual reel
  const handleReelPointerDown = useCallback(
    (e, index) => {
      if (!flickable || spinning || prefersReducedMotion()) return;
      const el = reelsRef.current[index];
      if (!el) return;
      const strip = el.querySelector('.glyph-lottery__strip');
      if (!strip) return;

      const reel = reelData[index];
      if (!reel || reel.isSpace) return;

      const startY = e.clientY;
      const baseOffset = -((reel.symbols.length - 1) * 1.15);
      let currentOffset = baseOffset;

      const onPointerMove = moveEvent => {
        const deltaY = moveEvent.clientY - startY;
        const deltaEm = (deltaY / el.offsetHeight) * 1.15;
        currentOffset = baseOffset + deltaEm;
        strip.style.transition = 'none';
        strip.style.transform = `translateY(${currentOffset.toFixed(3)}em)`;
      };

      const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);

        // Snap back with spring
        strip.style.transition = 'transform 0.45s cubic-bezier(0.12, 0.8, 0.28, 1.35)';
        strip.style.transform = `translateY(${baseOffset.toFixed(3)}em)`;

        setFlashingReels(prev => ({ ...prev, [index]: true }));
        setTimeout(() => {
          setFlashingReels(prev => ({ ...prev, [index]: false }));
        }, 280);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    },
    [flickable, spinning, reelData]
  );

  const Tag = as || 'span';

  const mergedStyle = {
    ...(fontSize != null ? { fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize } : {}),
    ...(fontWeight != null ? { fontWeight } : {}),
    ...(letterSpacing != null ? { letterSpacing } : {}),
    ...(lineHeight != null ? { lineHeight } : {}),
    ...(align != null ? { textAlign: align } : {}),
    ...(color != null ? { color } : {}),
    '--gl-accent': accentColor,
    '--gl-fade': fade,
    '--gl-blur': blur,
    '--gl-flash': flash,
    ...style
  };

  return (
    <Tag
      ref={containerRef}
      className={`glyph-lottery ${className}`}
      style={mergedStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...rest}
    >
      <span className="glyph-lottery__sr">{contentString}</span>
      <span aria-hidden="true" className="glyph-lottery__reels">
        {reelData.map((reel, index) => {
          if (reel.isSpace) {
            return (
              <span className="glyph-lottery__space" key={`space-${index}`}>
                {' '}
              </span>
            );
          }

          const isFlashing = Boolean(flashingReels[index]);
          const targetOffset = -((reel.symbols.length - 1) * 1.15).toFixed(3);

          return (
            <span
              ref={node => {
                reelsRef.current[index] = node;
              }}
              key={`reel-${index}`}
              className={`glyph-lottery__reel${isFlashing ? ' glyph-lottery__reel--flashing' : ''}`}
              data-fade={fade > 0 ? 'true' : undefined}
              onPointerDown={e => handleReelPointerDown(e, index)}
            >
              <span className="glyph-lottery__ghost">{reel.char}</span>
              <span
                className={`glyph-lottery__strip${spinning ? ' glyph-lottery__strip--spinning' : ''}`}
                style={{
                  transform: `translateY(${targetOffset}em)`
                }}
              >
                {reel.symbols.map((symbol, sIndex) => {
                  const isTarget = sIndex === reel.symbols.length - 1;
                  return (
                    <span
                      key={`sym-${sIndex}`}
                      className={`glyph-lottery__symbol${isTarget ? ' glyph-lottery__symbol--target' : ''}`}
                    >
                      {symbol}
                    </span>
                  );
                })}
              </span>
            </span>
          );
        })}
      </span>
    </Tag>
  );
});

export default GlyphLottery;
