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
import './CipherReveal.css';

const NARROW_UPPER = ['I', 'J', 'L', 'T', 'F', 'E', '1', '|'];
const WIDE_UPPER = ['M', 'W', 'Q', 'O', 'D', 'G', 'N', 'B', 'H', 'U', 'R'];
const MEDIUM_UPPER = ['A', 'C', 'K', 'P', 'S', 'V', 'X', 'Y', 'Z'];

const NARROW_LOWER = ['i', 'l', 'j', 't', 'f', 'r', '1', '!'];
const WIDE_LOWER = ['m', 'w'];
const MEDIUM_LOWER = [
  'a', 'b', 'c', 'd', 'e', 'g', 'h', 'k', 'n', 'o', 'p', 'q', 's', 'u', 'v', 'x', 'y', 'z'
];

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const SYMBOLS = [
  '/', '\\', '-', '_', '+', '=', '*', '#', '%', '&', '<', '>', '~', '^', '$', ':', ';', '?'
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getScrambleChar(targetChar, charset = 'auto') {
  if (!targetChar || /^\s$/.test(targetChar)) return targetChar;
  if (charset && charset !== 'auto') {
    return charset[Math.floor(Math.random() * charset.length)];
  }
  if (/[0-9]/.test(targetChar)) return pickRandom(DIGITS);
  if (/[A-Z]/.test(targetChar)) {
    if (NARROW_UPPER.includes(targetChar)) return pickRandom(NARROW_UPPER);
    if (WIDE_UPPER.includes(targetChar)) return pickRandom(WIDE_UPPER);
    return pickRandom(MEDIUM_UPPER);
  }
  if (/[a-z]/.test(targetChar)) {
    if (NARROW_LOWER.includes(targetChar)) return pickRandom(NARROW_LOWER);
    if (WIDE_LOWER.includes(targetChar)) return pickRandom(WIDE_LOWER);
    return pickRandom(MEDIUM_LOWER);
  }
  return pickRandom(SYMBOLS);
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false);

const CipherReveal = forwardRef(function CipherReveal(
  {
    text,
    children,
    as = 'h2',
    className = '',
    style = {},
    charset = 'auto',
    trigger = 'view',
    order = 'left',
    duration = 1.3,
    scramble = 0.35,
    rate = 16,
    from = 'scrambled',
    hover = 'trail',
    loop = false,
    loopDelay = 2000,
    delay = 0,
    scrambleColor,
    onComplete,
    id,
    ...rest
  },
  ref
) {
  const containerRef = useRef(null);
  const activeTrailsRef = useRef(new Map());
  const timerRef = useRef({ raf: 0, loop: 0, delay: 0 });
  const animRef = useRef({
    startTime: 0,
    running: false,
    completed: false,
    lastTick: 0
  });

  // Track tick state to drive reactive render of glyphs
  const [tick, setTick] = useState(0);

  // Extract clean plain text for accessibility
  const plainText = useMemo(() => {
    if (text != null) return String(text);
    let result = '';
    const walk = node => {
      if (node == null || typeof node === 'boolean') return;
      if (typeof node === 'string' || typeof node === 'number') {
        result += String(node);
        return;
      }
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (React.isValidElement(node)) {
        if (node.type === 'br') {
          result += ' ';
          return;
        }
        if (result && !/\s$/.test(result)) {
          result += ' ';
        }
        if (node.props?.children) {
          walk(node.props.children);
        }
      }
    };
    walk(children);
    return result.replace(/\s+/g, ' ').trim();
  }, [text, children]);

  // Build character list and compute normalized order position
  const { chars, totalCount } = useMemo(() => {
    const list = [];
    const walk = node => {
      if (node == null || typeof node === 'boolean') return;
      if (typeof node === 'string' || typeof node === 'number') {
        const str = String(node);
        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          list.push({
            char,
            isSpace: /^\s$/.test(char)
          });
        }
        return;
      }
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (React.isValidElement(node)) {
        if (node.type === 'br') {
          list.push({ char: '\n', isSpace: true, isBr: true });
          return;
        }
        if (node.props?.children) {
          walk(node.props.children);
        }
      }
    };

    if (text != null) {
      const str = String(text);
      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        list.push({
          char,
          isSpace: /^\s$/.test(char),
          isBr: char === '\n'
        });
      }
    } else {
      walk(children);
    }

    const nonSpaces = list.filter(c => !c.isSpace);
    const nonSpaceCount = nonSpaces.length;

    let nonSpaceIndex = 0;
    const computedChars = list.map((item, globalIndex) => {
      if (item.isSpace) {
        return {
          ...item,
          index: globalIndex,
          orderPos: 0,
          startSec: 0,
          lockSec: 0
        };
      }

      const r = nonSpaceIndex++;
      let pos = 0;
      if (order === 'right') {
        pos = nonSpaceCount <= 1 ? 0 : (nonSpaceCount - 1 - r) / (nonSpaceCount - 1);
      } else if (order === 'center') {
        const center = (nonSpaceCount - 1) / 2;
        pos = nonSpaceCount <= 1 ? 0 : Math.abs(r - center) / Math.max(1, center);
      } else if (order === 'random') {
        pos = ((r * 9301 + 49297) % 233280) / 233280;
      } else {
        // default: left
        pos = nonSpaceCount <= 1 ? 0 : r / (nonSpaceCount - 1);
      }

      const D = Math.max(0.1, duration);
      const S = Math.min(Math.max(0.05, scramble), D);
      const revealSpread = Math.max(0, D - S);

      const startSec = from === 'scrambled' ? 0 : pos * revealSpread;
      const lockSec = pos * revealSpread + S;

      return {
        ...item,
        index: globalIndex,
        orderPos: pos,
        startSec,
        lockSec
      };
    });

    return { chars: computedChars, totalCount: list.length };
  }, [text, children, order, duration, scramble, from]);

  // Current random scrambled glyph cache for each character index
  const glyphsRef = useRef(new Map());

  const updateGlyphs = useCallback(
    now => {
      const elapsed = animRef.current.running
        ? (now - animRef.current.startTime) / 1000
        : duration + 1;
      const trails = activeTrailsRef.current;
      const glyphs = glyphsRef.current;

      chars.forEach(c => {
        if (c.isSpace) return;
        const inTrail = trails.has(c.index) && now < trails.get(c.index);
        const locked =
          !inTrail &&
          (animRef.current.completed ||
            (animRef.current.running && elapsed >= c.lockSec));

        if (!locked) {
          glyphs.set(c.index, getScrambleChar(c.char, charset));
        } else {
          glyphs.set(c.index, c.char);
        }
      });
    },
    [chars, charset, duration]
  );

  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(timerRef.current.raf);
    clearTimeout(timerRef.current.loop);
    clearTimeout(timerRef.current.delay);
    animRef.current.running = false;
  }, []);

  const startAnimation = useCallback(
    (immediate = false) => {
      stopAnimation();
      if (prefersReducedMotion()) {
        animRef.current.running = false;
        animRef.current.completed = true;
        setTick(t => t + 1);
        onComplete?.();
        return;
      }

      const launch = () => {
        animRef.current.startTime = performance.now();
        animRef.current.running = true;
        animRef.current.completed = false;
        animRef.current.lastTick = 0;

        const interval = 1000 / Math.max(1, rate);

        const loopStep = now => {
          const elapsed = (now - animRef.current.startTime) / 1000;
          const trails = activeTrailsRef.current;

          // Clean up expired trails
          trails.forEach((endTime, key) => {
            if (now >= endTime) trails.delete(key);
          });

          // Check if primary decode has finished
          if (elapsed >= duration && trails.size === 0) {
            animRef.current.running = false;
            animRef.current.completed = true;
            updateGlyphs(now);
            setTick(t => t + 1);
            onComplete?.();

            if (loop) {
              timerRef.current.loop = setTimeout(() => {
                startAnimation(true);
              }, Math.max(100, loopDelay));
            }
            return;
          }

          // Throttle glyph re-scrambling based on target rate
          if (now - animRef.current.lastTick >= interval) {
            animRef.current.lastTick = now;
            updateGlyphs(now);
            setTick(t => t + 1);
          }

          timerRef.current.raf = requestAnimationFrame(loopStep);
        };

        updateGlyphs(performance.now());
        setTick(t => t + 1);
        timerRef.current.raf = requestAnimationFrame(loopStep);
      };

      if (delay > 0 && !immediate) {
        timerRef.current.delay = setTimeout(launch, delay * 1000);
      } else {
        launch();
      }
    },
    [delay, duration, loop, loopDelay, onComplete, rate, stopAnimation, updateGlyphs]
  );

  // Imperative handle for parent components
  useImperativeHandle(ref, () => ({
    replay: () => startAnimation(true)
  }));

  // Trigger handling: view vs mount vs manual
  useEffect(() => {
    if (trigger === 'manual') return undefined;

    if (trigger === 'mount') {
      startAnimation();
      return () => stopAnimation();
    }

    // Default: 'view'
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      startAnimation();
      return () => stopAnimation();
    }

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      stopAnimation();
    };
  }, [trigger, startAnimation, stopAnimation]);

  // Pointer hover interactions
  const handleCharHover = useCallback(
    charIndex => {
      if (hover !== 'trail' || prefersReducedMotion()) return;
      const now = performance.now();
      const trailMs = Math.max(250, scramble * 1000);

      // Add character and adjacent neighbors for smooth trail
      activeTrailsRef.current.set(charIndex, now + trailMs);
      if (charIndex > 0) {
        activeTrailsRef.current.set(charIndex - 1, now + trailMs * 0.85);
      }
      if (charIndex < totalCount - 1) {
        activeTrailsRef.current.set(charIndex + 1, now + trailMs * 0.85);
      }

      animRef.current.completed = false;
      updateGlyphs(now);
      setTick(t => t + 1);

      // Resume animation loop if not currently active
      if (!animRef.current.running) {
        animRef.current.startTime = performance.now() - duration * 1000;
        animRef.current.running = true;
        animRef.current.lastTick = performance.now();
        const interval = 1000 / Math.max(1, rate);

        const trailStep = tNow => {
          const trails = activeTrailsRef.current;
          trails.forEach((endTime, key) => {
            if (tNow >= endTime) trails.delete(key);
          });

          if (trails.size === 0) {
            animRef.current.running = false;
            animRef.current.completed = true;
            updateGlyphs(tNow);
            setTick(t => t + 1);
            return;
          }

          if (tNow - animRef.current.lastTick >= interval) {
            animRef.current.lastTick = tNow;
            updateGlyphs(tNow);
            setTick(t => t + 1);
          }

          timerRef.current.raf = requestAnimationFrame(trailStep);
        };

        timerRef.current.raf = requestAnimationFrame(trailStep);
      }
    },
    [hover, scramble, totalCount, duration, rate, updateGlyphs]
  );

  const handleContainerMouseEnter = useCallback(() => {
    if (hover === 'replay' && !animRef.current.running) {
      startAnimation(true);
    }
  }, [hover, startAnimation]);

  // Recursive content renderer that preserves child tags, styling, and line breaks
  const renderedContent = useMemo(() => {
    const now = performance.now();
    const elapsed = animRef.current.running
      ? (now - animRef.current.startTime) / 1000
      : duration + 1;
    const trails = activeTrailsRef.current;
    const glyphs = glyphsRef.current;
    const reduced = prefersReducedMotion();

    let globalCounter = 0;
    let keySeq = 0;

    const renderCell = charItem => {
      if (charItem.isBr) {
        return <br key={`br-${keySeq++}`} />;
      }
      if (charItem.isSpace) {
        return charItem.char;
      }

      if (reduced) {
        return (
          <span className="cipher-reveal__cell" key={`cell-${keySeq++}`}>
            {charItem.char}
          </span>
        );
      }

      const inTrail = trails.has(charItem.index) && now < trails.get(charItem.index);
      const locked =
        !inTrail &&
        (animRef.current.completed ||
          (animRef.current.running && elapsed >= charItem.lockSec));
      const started = inTrail || animRef.current.running && elapsed >= charItem.startSec;

      if (locked) {
        return (
          <span
            className="cipher-reveal__cell"
            key={`cell-${keySeq++}`}
            onPointerEnter={() => handleCharHover(charItem.index)}
            onPointerOver={() => handleCharHover(charItem.index)}
          >
            {charItem.char}
          </span>
        );
      }

      if (!started && from === 'blank') {
        return (
          <span className="cipher-reveal__cell" key={`cell-${keySeq++}`}>
            <span className="cipher-reveal__ghost">{charItem.char}</span>
          </span>
        );
      }

      const glyph = glyphs.get(charItem.index) || getScrambleChar(charItem.char, charset);

      return (
        <span
          className="cipher-reveal__cell"
          key={`cell-${keySeq++}`}
          onPointerEnter={() => handleCharHover(charItem.index)}
          onPointerOver={() => handleCharHover(charItem.index)}
        >
          <span className="cipher-reveal__ghost">{charItem.char}</span>
          <span className="cipher-reveal__glyph cipher-reveal__glyph--scrambling">
            {glyph}
          </span>
        </span>
      );
    };

    const renderWords = str => {
      // Split into words and whitespace chunks
      const tokens = str.split(/(\s+)/);
      return tokens.map(token => {
        if (!token) return null;
        if (/^\s+$/.test(token)) {
          // Whitespace sequence
          const out = [];
          for (let i = 0; i < token.length; i++) {
            const c = chars[globalCounter++];
            if (c) out.push(renderCell(c));
          }
          return <React.Fragment key={`sp-${keySeq++}`}>{out}</React.Fragment>;
        }

        // Word sequence
        const wordCells = [];
        for (let i = 0; i < token.length; i++) {
          const c = chars[globalCounter++];
          if (c) wordCells.push(renderCell(c));
        }

        return (
          <span className="cipher-reveal__word" key={`word-${keySeq++}`}>
            {wordCells}
          </span>
        );
      });
    };

    const walkTree = node => {
      if (node == null || typeof node === 'boolean') return null;
      if (typeof node === 'string' || typeof node === 'number') {
        return renderWords(String(node));
      }
      if (Array.isArray(node)) {
        return node.map((child, idx) => (
          <React.Fragment key={`frag-${idx}-${keySeq++}`}>
            {walkTree(child)}
          </React.Fragment>
        ));
      }
      if (React.isValidElement(node)) {
        if (node.type === 'br') {
          const c = chars[globalCounter++];
          return c ? renderCell(c) : <br key={`br-${keySeq++}`} />;
        }
        const cloned = walkTree(node.props?.children);
        return React.cloneElement(node, {
          key: node.key ?? `elem-${keySeq++}`,
          children: cloned
        });
      }
      return node;
    };

    if (text != null) {
      return renderWords(String(text));
    }
    return walkTree(children);
  }, [
    chars,
    children,
    text,
    duration,
    from,
    charset,
    handleCharHover,
    tick
  ]);

  const Tag = as || 'h2';

  return (
    <Tag
      ref={containerRef}
      id={id}
      className={`cipher-reveal ${className}`}
      style={{
        ...style,
        ...(scrambleColor ? { '--cipher-scramble-color': scrambleColor } : {})
      }}
      onMouseEnter={hover === 'replay' ? handleContainerMouseEnter : undefined}
      {...rest}
    >
      <span className="cipher-reveal__sr">{plainText}</span>
      <span aria-hidden="true" className="cipher-reveal__content">
        {renderedContent}
      </span>
    </Tag>
  );
});

export default CipherReveal;
