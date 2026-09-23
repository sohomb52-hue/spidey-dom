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
  // Is mobile / touch active (scroll-based instead of mouse)
  isMobile: boolean;
}

export function useComicParallax(): ParallaxOffsets {
  const [offsets, setOffsets] = useState<ParallaxOffsets>({
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
    isMobile: false
  });

  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const scrollRef = useRef({ scrollY: 0, maxScroll: 1 });
  const isTouchRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const lastOffsetsRef = useRef(offsets);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
    isTouchRef.current = isTouch;

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchRef.current) return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const nx = (e.clientX - centerX) / centerX;
      const ny = (e.clientY - centerY) / centerY;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    const handleScroll = () => {
      if (!isTouchRef.current) return;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRef.current = { scrollY, maxScroll };
    };

    const handleResize = () => {
      isTouchRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let lastTime = performance.now();
    const update = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!isTouchRef.current) {
        const dx = mouseRef.current.targetX - mouseRef.current.currentX;
        const dy = mouseRef.current.targetY - mouseRef.current.currentY;

        // Only update if there is significant movement (prevents idle 60fps React state churn)
        if (Math.abs(dx) > 0.005 || Math.abs(dy) > 0.005) {
          const lerpFactor = Math.min(1, 4 * delta);
          mouseRef.current.currentX += dx * lerpFactor;
          mouseRef.current.currentY += dy * lerpFactor;

          const mx = mouseRef.current.currentX;
          const my = mouseRef.current.currentY;

          // Parallax for decorative environment layers
          const bgX = parseFloat((-mx * 6).toFixed(1));
          const bgY = parseFloat((-my * 4).toFixed(1));
          const cityX = parseFloat((-mx * 12).toFixed(1));
          const cityY = parseFloat((-my * 8).toFixed(1));
          const charX = parseFloat((mx * 16).toFixed(1));
          const charY = parseFloat((my * 10).toFixed(1));

          // Check if changed from previous
          if (
            Math.abs(bgX - lastOffsetsRef.current.bgX) >= 0.2 ||
            Math.abs(bgY - lastOffsetsRef.current.bgY) >= 0.2 ||
            Math.abs(cityX - lastOffsetsRef.current.cityX) >= 0.2
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
              isMobile: false
            };
            lastOffsetsRef.current = next;
            setOffsets(next);
          }
        }
      } else {
        const { scrollY, maxScroll } = scrollRef.current;
        const progress = Math.min(1, scrollY / maxScroll);

        const bgY = parseFloat((progress * -20).toFixed(1));
        const cityY = parseFloat((progress * -45).toFixed(1));
        const charY = parseFloat((progress * -70).toFixed(1));

        if (Math.abs(cityY - lastOffsetsRef.current.cityY) >= 0.5) {
          const next = {
            bgX: 0,
            bgY,
            cityX: 0,
            cityY,
            panelTiltX: 0,
            panelTiltY: 0,
            panelTranslateX: 0,
            panelTranslateY: 0,
            charX: 0,
            charY,
            isMobile: true
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
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return offsets;
}
