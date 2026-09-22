import { useState, useEffect, useRef } from 'react';

export interface ParallaxOffsets {
  // Layer 1: Distant background (Skyline, distant clouds, halftone)
  bgX: number;
  bgY: number;
  // Layer 2: Midground city (Building silhouettes, illuminated windows, weblines)
  cityX: number;
  cityY: number;
  // Layer 3: Main interactive comic panels (Perspective tilt and slight translation)
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

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
    isTouchRef.current = isTouch;

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchRef.current) return;
      // Normalize to -1 ... 1 from viewport center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const nx = (e.clientX - centerX) / centerX;
      const ny = (e.clientY - centerY) / centerY;
      // Clamp to prevent extreme movement
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

    // Smooth animation loop using interpolation
    let lastTime = performance.now();
    const update = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!isTouchRef.current) {
        // Desktop mouse tracking with cinematic damping
        // Smooth lerp: factor 4.5 * delta
        const lerpFactor = Math.min(1, 4.5 * delta);
        mouseRef.current.currentX += (mouseRef.current.targetX - mouseRef.current.currentX) * lerpFactor;
        mouseRef.current.currentY += (mouseRef.current.targetY - mouseRef.current.currentY) * lerpFactor;

        const mx = mouseRef.current.currentX;
        const my = mouseRef.current.currentY;

        // Cinematic subtle parallax:
        // Background (Layer 1): deep space moves slightly in opposite direction
        const bgX = -mx * 6;
        const bgY = -my * 4;

        // City (Layer 2): midground silhouettes
        const cityX = -mx * 14;
        const cityY = -my * 8;

        // Comic Panels (Layer 3): subtle 3D perspective tilt
        // User should feel looking into a scene, not the whole page wobbling
        const panelTiltY = mx * 1.5; // rotateY (degrees)
        const panelTiltX = -my * 1.5; // rotateX (degrees)
        const panelTranslateX = mx * 3;
        const panelTranslateY = my * 2;

        // Character (Layer 4): foreground Spider-Man silhouette
        // Foreground moves in stronger parallax to produce stereoscopic 2.5D depth separation!
        const charX = -mx * 26;
        const charY = -my * 16;

        setOffsets({
          bgX: parseFloat(bgX.toFixed(2)),
          bgY: parseFloat(bgY.toFixed(2)),
          cityX: parseFloat(cityX.toFixed(2)),
          cityY: parseFloat(cityY.toFixed(2)),
          panelTiltX: parseFloat(panelTiltX.toFixed(2)),
          panelTiltY: parseFloat(panelTiltY.toFixed(2)),
          panelTranslateX: parseFloat(panelTranslateX.toFixed(2)),
          panelTranslateY: parseFloat(panelTranslateY.toFixed(2)),
          charX: parseFloat(charX.toFixed(2)),
          charY: parseFloat(charY.toFixed(2)),
          isMobile: false
        });
      } else {
        // Mobile scroll-based depth movement
        const { scrollY, maxScroll } = scrollRef.current;
        const progress = Math.min(1, scrollY / maxScroll); // 0 to 1

        // Differentiated vertical parallax as user reads down the comic
        const bgY = progress * -30;
        const cityY = progress * -70;
        const charY = progress * -120;

        setOffsets({
          bgX: 0,
          bgY: parseFloat(bgY.toFixed(2)),
          cityX: 0,
          cityY: parseFloat(cityY.toFixed(2)),
          panelTiltX: 0,
          panelTiltY: 0,
          panelTranslateX: 0,
          panelTranslateY: 0,
          charX: 0,
          charY: parseFloat(charY.toFixed(2)),
          isMobile: true
        });
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
