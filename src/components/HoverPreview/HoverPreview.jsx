'use client';

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import './HoverPreview.css';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false);

const isCoarsePointer = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(pointer: coarse)')?.matches ?? false);

export const HoverPreview = forwardRef(function HoverPreview(
  {
    children,
    image,
    imageUrl,
    src,
    alt = 'Hover preview',
    altText,
    title,
    subtitle,
    width,
    imageWidth = 320,
    height,
    imageHeight = 188,
    borderRadius,
    imageBorderRadius = 14,
    showImageShadow = true,
    offset = 18,
    position = 'cursor', // 'cursor' | 'top' | 'bottom'
    followCursor = true,
    tilt = true,
    maxRotation = 8,
    enterSpeed = 0.2,
    exitSpeed = 0.15,
    className = '',
    previewClassName = '',
    as: Component = 'span',
    ...restProps
  },
  ref
) {
  const finalImage = image || imageUrl || src;
  const finalAlt = altText || alt;
  const finalWidth = width || imageWidth;
  const finalHeight = height || imageHeight;
  const finalRadius = borderRadius !== undefined ? borderRadius : imageBorderRadius;

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0, rot: 0 });

  const triggerRef = useRef(null);
  const floatingRef = useRef(null);
  const rafId = useRef(0);
  const exitTimer = useRef(null);
  const targetPos = useRef({ x: 0, y: 0, rot: 0 });
  const prevMouseX = useRef(0);
  const velocityX = useRef(0);

  // Viewport-aware position clamping
  const calculatePosition = useCallback(
    (clientX, clientY) => {
      if (typeof window === 'undefined') return { x: 0, y: 0 };
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cardW = finalWidth;
      const cardH = finalHeight;
      const pad = 12;

      let safeX = clientX;
      let safeY = clientY;

      // Fallback if clientX/Y are not available on the event
      if (typeof safeX !== 'number' || isNaN(safeX)) {
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          safeX = rect.left + rect.width / 2;
          safeY = rect.top + rect.height / 2;
        } else {
          safeX = 100;
          safeY = 100;
        }
      }

      let targetX = safeX + offset;
      let targetY = safeY + offset;

      if (position === 'top' && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        targetX = rect.left + rect.width / 2 - cardW / 2;
        targetY = rect.top - cardH - offset;
      } else if (position === 'bottom' && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        targetX = rect.left + rect.width / 2 - cardW / 2;
        targetY = rect.bottom + offset;
      } else {
        // Cursor positioning with flip logic when near right or bottom edge
        if (targetX + cardW > vw - pad) {
          targetX = safeX - cardW - offset;
        }
        if (targetY + cardH > vh - pad) {
          targetY = safeY - cardH - offset;
        }
      }

      // Hard clamp inside viewport
      targetX = Math.max(pad, Math.min(vw - cardW - pad, targetX));
      targetY = Math.max(pad, Math.min(vh - cardH - pad, targetY));

      return { x: targetX, y: targetY };
    },
    [finalWidth, finalHeight, offset, position]
  );

  // Smooth lerp animation loop on requestAnimationFrame
  useEffect(() => {
    if (!mounted || prefersReducedMotion()) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      return;
    }

    const animate = () => {
      const lerp = 0.22;
      setCurrentPos(prev => {
        const nextX = prev.x + (targetPos.current.x - prev.x) * lerp;
        const nextY = prev.y + (targetPos.current.y - prev.y) * lerp;
        const nextRot = prev.rot + (targetPos.current.rot - prev.rot) * lerp;
        return {
          x: nextX,
          y: nextY,
          rot: nextRot
        };
      });
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [mounted]);

  const handlePointerEnter = useCallback(
    e => {
      if (isCoarsePointer()) return;
      clearTimeout(exitTimer.current);

      const calculated = calculatePosition(e?.clientX, e?.clientY);
      targetPos.current = { x: calculated.x, y: calculated.y, rot: 0 };
      setCurrentPos({ x: calculated.x, y: calculated.y, rot: 0 });
      prevMouseX.current = e?.clientX || calculated.x;
      velocityX.current = 0;

      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setActive(true);
        });
      });
    },
    [calculatePosition]
  );

  const handlePointerMove = useCallback(
    e => {
      if (isCoarsePointer()) return;
      if (!followCursor && position !== 'cursor') return;

      const calculated = calculatePosition(e?.clientX, e?.clientY);

      // Compute dynamic rotation angle based on mouse horizontal speed
      let rot = 0;
      if (tilt && !prefersReducedMotion() && typeof e?.clientX === 'number') {
        const dx = e.clientX - prevMouseX.current;
        prevMouseX.current = e.clientX;
        velocityX.current = velocityX.current * 0.72 + dx * 0.28;
        rot = Math.max(-maxRotation, Math.min(maxRotation, velocityX.current * 0.65));
      }

      targetPos.current = { x: calculated.x, y: calculated.y, rot };
    },
    [calculatePosition, followCursor, position, tilt, maxRotation]
  );

  const handlePointerLeave = useCallback(() => {
    setActive(false);
    targetPos.current.rot = 0;
    clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => {
      setMounted(false);
    }, (exitSpeed || 0.15) * 1000 + 40);
  }, [exitSpeed]);

  useEffect(() => {
    return () => clearTimeout(exitTimer.current);
  }, []);

  const floatingPreview = mounted && finalImage && typeof document !== 'undefined' ? (
    createPortal(
      <div
        ref={floatingRef}
        className={`hover-preview-floating ${previewClassName}`.trim()}
        style={{
          transform: `translate3d(${currentPos.x.toFixed(1)}px, ${currentPos.y.toFixed(1)}px, 0) rotate(${currentPos.rot.toFixed(1)}deg)`,
        }}
        aria-hidden="true"
      >
        <div
          className={`hover-preview-card ${active ? 'is-active' : 'is-exiting'}${showImageShadow ? ' has-shadow' : ''}`}
          style={{
            width: `${finalWidth}px`,
            height: `${finalHeight}px`,
            borderRadius: `${finalRadius}px`,
            transitionDuration: `${active ? enterSpeed : exitSpeed}s`,
          }}
        >
          <img
            src={finalImage}
            alt={finalAlt}
            className="hover-preview-image"
            loading="eager"
            decoding="async"
          />
          {(title || subtitle) && (
            <div className="hover-preview-overlay">
              {title && <p className="hover-preview-title">{title}</p>}
              {subtitle && <span className="hover-preview-subtitle">{subtitle}</span>}
            </div>
          )}
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <Component
      ref={node => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={`hover-preview-trigger ${className}`.trim()}
      onMouseEnter={handlePointerEnter}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...restProps}
    >
      {children}
      {floatingPreview}
    </Component>
  );
});

export default HoverPreview;
