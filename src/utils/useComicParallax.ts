import { useState, useEffect, useRef } from 'react';

export interface ParallaxOffsets {
  // Layer 1: Distant background (Skyline, distant clouds, halftone)
  bgX: number;
  bgY: number;
  // Layer 2: Midground city (Building silhouettes, illuminated windows, weblines)
  cityX: number;
  cityY: number;
  // Layer 3: Main interactive comic panels (Stable to keep buttons 100% click-responsive)
  panelTiltX: number;
  panelTiltY: number;
  panelTranslateX: number;
  panelTranslateY: number;
  // Layer 4: Foreground character (Spider-Man silhouette on perch)
  charX: number;
  charY: number;
  // Is mobile / touch active
  isMobile: boolean;
}

const ZERO_OFFSETS: ParallaxOffsets = {
  bgX: 0,
  bgY: 0,
  cityX: 0,
  cityY: 0,
  panelTiltX: 0,
  panelTiltY: 0,
  panelTranslateX: 0,
  panelTranslateY: 0,
  charX: 0,
  charY: 0,
  isMobile: false,
};

/**
 * useComicParallax
 * High-performance 2.5D ambient background parallax.
 * NOTE: Parallax is strictly scoped to desktop mouse tracking to ensure
 * 60fps buttery-smooth touch scrolling and swiping on mobile devices without
 * triggering React root re-renders or layout jitter.
 */
export function useComicParallax(): ParallaxOffsets {
  const [offsets, setOffsets] = useState<ParallaxOffsets>(ZERO_OFFSETS);

  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const animFrameRef = useRef<number | null>(null);
  const lastOffsetsRef = useRef(ZERO_OFFSETS);

  useEffect(() => {
    // Disable on reduced motion or touch/mobile devices to keep swipe & touch 100% stable
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 1024;

    if (prefersReducedMotion || isTouchDevice) {
      setOffsets((prev) => ({ ...ZERO_OFFSETS, isMobile: isTouchDevice }));
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const nx = (e.clientX - centerX) / centerX;
      const ny = (e.clientY - centerY) / centerY;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let lastTime = performance.now();
    const update = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const dx = mouseRef.current.targetX - mouseRef.current.currentX;
      const dy = mouseRef.current.targetY - mouseRef.current.currentY;

      // Only update if there is noticeable cursor movement (prevents idle re-renders)
      if (Math.abs(dx) > 0.008 || Math.abs(dy) > 0.008) {
        const lerpFactor = Math.min(1, 4 * delta);
        mouseRef.current.currentX += dx * lerpFactor;
        mouseRef.current.currentY += dy * lerpFactor;

        const mx = mouseRef.current.currentX;
        const my = mouseRef.current.currentY;

        // Subtle ambient parallax for decorative layers only
        const bgX = parseFloat((-mx * 6).toFixed(1));
        const bgY = parseFloat((-my * 4).toFixed(1));
        const cityX = parseFloat((-mx * 12).toFixed(1));
        const cityY = parseFloat((-my * 8).toFixed(1));
        const charX = parseFloat((mx * 16).toFixed(1));
        const charY = parseFloat((my * 10).toFixed(1));

        if (
          Math.abs(bgX - lastOffsetsRef.current.bgX) >= 0.3 ||
          Math.abs(bgY - lastOffsetsRef.current.bgY) >= 0.3 ||
          Math.abs(cityX - lastOffsetsRef.current.cityX) >= 0.3
        ) {
          const next = {
            bgX,
            bgY,
            cityX,
            cityY,
            panelTiltX: 0,
            panelTiltY: 0,
            panelTranslateX: 0,
            panelTranslateY: 0,
            charX,
            charY,
            isMobile: false,
          };
          lastOffsetsRef.current = next;
          setOffsets(next);
        }
      }

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return offsets;
}
