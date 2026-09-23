import React, { useState } from 'react';
import { useComicParallax } from '../utils/useComicParallax';
import { Eye, EyeOff } from 'lucide-react';

interface ComicEnvironment25DProps {
  header?: React.ReactNode;
  hud?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const ComicEnvironment25D: React.FC<ComicEnvironment25DProps> = ({
  header,
  hud,
  children,
  footer
}) => {
  const offsets = useComicParallax();
  const [showForegroundSpidey, setShowForegroundSpidey] = useState(true);
  const [spideyBubble, setSpideyBubble] = useState<string | null>(null);

  const spideyQuips = [
    "My Spider-Sense is tingling!",
    "Careful, webhead! Check that canon issue!",
    "Great power, great trivia accuracy!",
    "Thwip! Ready when you are!",
    "Even J. Jonah Jameson couldn't fake these facts!"
  ];

  const handleSpideyClick = () => {
    const randomQuip = spideyQuips[Math.floor(Math.random() * spideyQuips.length)];
    setSpideyBubble(randomQuip);
    setTimeout(() => setSpideyBubble(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#0d0f18] text-[#1b1b20] relative overflow-x-hidden selection:bg-[#f9bd22] selection:text-[#261a00]">
      {/* =========================================================================
          LAYER 1 — BACKGROUND (Deepest Space: Skyline, Moving Clouds, Halftone, Particles)
          ========================================================================= */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          transform: `translate3d(${offsets.bgX}px, ${offsets.bgY}px, -150px) scale(1.08)`,
          transition: 'transform 0.08s ease-out'
        }}
        aria-hidden="true"
      >
        {/* Dark Comic-Book Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090a10] via-[#111320] to-[#181122]" />
        
        {/* Distant Comic Moon / City Ambient Twilight Glow */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-radial from-[#dc2626]/12 via-[#f9bd22]/8 to-transparent blur-3xl opacity-60" />

        {/* Vintage Halftone / Ben-Day Dots Pattern */}
        <div className="comic-halftone absolute inset-0 opacity-20" />

        {/* Subtle Moving Comic Clouds (Vector stylized with speed-dashes) */}
        <div className="absolute top-6 left-0 right-0 h-48 opacity-25 animate-cloud-drift-1">
          <svg className="w-full h-full text-[#382b47]" fill="currentColor" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M0,80 Q150,20 300,70 T600,60 T900,80 T1200,50 L1200,200 L0,200 Z" opacity="0.4" />
            <path d="M0,110 Q200,50 450,100 T850,90 T1200,100 L1200,200 L0,200 Z" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute top-20 left-0 right-0 h-40 opacity-20 animate-cloud-drift-2">
          <svg className="w-full h-full text-[#221c32]" fill="currentColor" viewBox="0 0 1200 180" preserveAspectRatio="none">
            <path d="M0,90 Q250,30 500,80 T1000,70 T1200,90 L1200,180 L0,180 Z" />
          </svg>
        </div>

        {/* Distant New York Skyline Silhouette (Layer 1 Far Silhouette) */}
        <div className="absolute bottom-0 left-0 right-0 h-72 opacity-35">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            {/* Far skyscrapers & spires */}
            <path
              d="M0,320 L0,220 L40,220 L40,160 L60,160 L60,130 L70,90 L72,60 L74,90 L84,130 L84,160 L110,160 L110,240 L160,240 L160,180 L200,180 L200,140 L230,140 L230,220 L270,220 L270,120 L285,70 L287,40 L289,70 L305,120 L305,250 L350,250 L350,190 L400,190 L400,110 L440,110 L440,260 L490,260 L490,170 L530,170 L530,130 L550,80 L552,50 L554,80 L574,130 L574,270 L630,270 L630,190 L680,190 L680,140 L720,140 L720,240 L780,240 L780,150 L810,110 L812,65 L814,110 L840,150 L840,260 L900,260 L900,170 L950,170 L950,130 L990,130 L990,250 L1040,250 L1040,160 L1080,160 L1080,110 L1100,75 L1102,45 L1104,75 L1124,110 L1124,240 L1180,240 L1180,180 L1230,180 L1230,130 L1270,130 L1270,260 L1330,260 L1330,190 L1380,190 L1380,140 L1410,140 L1410,230 L1440,230 L1440,320 Z"
              fill="#0e101a"
            />
          </svg>
        </div>

        {/* Distant Floating Particles / Embers / Dust */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[30%] left-[15%] w-1.5 h-1.5 rounded-full bg-[#f9bd22] opacity-40 animate-particle-drift-slow" />
          <div className="absolute top-[60%] left-[32%] w-2 h-2 rounded-full bg-[#dc2626] opacity-35 animate-particle-drift-fast" />
          <div className="absolute top-[45%] left-[68%] w-1.5 h-1.5 rounded-full bg-[#f9bd22] opacity-50 animate-particle-drift-slow" style={{ animationDelay: '3s' }} />
          <div className="absolute top-[75%] left-[82%] w-2.5 h-2.5 rounded-full bg-[#ffdf9f] opacity-30 animate-particle-drift-fast" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[25%] left-[88%] w-1 h-1 rounded-full bg-[#dc2626] opacity-40 animate-particle-drift-slow" style={{ animationDelay: '5s' }} />
        </div>
      </div>

      {/* =========================================================================
          LAYER 2 — CITY (Midground Silhouettes, Animated Windows, Web Structures, Atmospheric Depth)
          ========================================================================= */}
      <div
        className="fixed inset-x-0 bottom-0 pointer-events-none z-[1] overflow-hidden h-[340px] sm:h-[440px]"
        style={{
          transform: `translate3d(${offsets.cityX}px, ${offsets.cityY}px, -70px) scale(1.04)`,
          transition: 'transform 0.08s ease-out'
        }}
        aria-hidden="true"
      >
        {/* Atmospheric Depth Fog between Layer 1 and 2 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f18] via-[#0d0f18]/80 to-transparent" />

        {/* Prominent Midground City Blocks & Water Towers */}
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 400" preserveAspectRatio="none">
          {/* Main Architectural Mass */}
          <path
            d="M0,400 L0,180 L80,180 L80,240 L170,240 L170,140 L260,140 L260,200 L320,200 L320,110 L410,110 L410,230 L520,230 L520,130 L630,130 L630,220 L710,220 L710,90 L820,90 L820,210 L940,210 L940,150 L1030,150 L1030,250 L1150,250 L1150,120 L1260,120 L1260,220 L1350,220 L1350,170 L1440,170 L1440,400 Z"
            fill="#121522"
            stroke="#1b1f30"
            strokeWidth="2"
          />

          {/* Rooftop Water Tower on Left */}
          <rect x="185" y="105" width="45" height="35" rx="3" fill="#1b1f30" stroke="#252b42" strokeWidth="2" />
          <polygon points="180,105 207,85 235,105" fill="#1b1f30" stroke="#252b42" strokeWidth="2" />
          <line x1="190" y1="140" x2="190" y2="155" stroke="#252b42" strokeWidth="3" />
          <line x1="225" y1="140" x2="225" y2="155" stroke="#252b42" strokeWidth="3" />

          {/* Rooftop Antenna on Center Spire */}
          <line x1="765" y1="40" x2="765" y2="90" stroke="#dc2626" strokeWidth="3" />
          <circle cx="765" cy="40" r="3" fill="#f9bd22" className="animate-window-twinkle" />

          {/* Web Structures Strung Across Buildings */}
          <path
            d="M80,190 Q125,230 170,160 Q215,220 260,150"
            fill="none"
            stroke="#f0ecf4"
            strokeWidth="1.2"
            strokeDasharray="4 2"
            opacity="0.35"
          />
          <path
            d="M320,130 Q365,180 410,125"
            fill="none"
            stroke="#f0ecf4"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            opacity="0.3"
          />
          <path
            d="M710,110 Q765,170 820,105"
            fill="none"
            stroke="#f0ecf4"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.4"
          />
          <path
            d="M1030,170 Q1090,230 1150,135"
            fill="none"
            stroke="#f0ecf4"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            opacity="0.35"
          />
        </svg>

        {/* Windows with Subtle Animation (Twinkling amber/cyan comic lights) */}
        <div className="absolute bottom-12 inset-x-0 h-44 pointer-events-none opacity-60">
          <div className="flex justify-around items-end h-full px-6">
            {/* Building 1 windows */}
            <div className="grid grid-cols-2 gap-2 mb-8 animate-window-twinkle">
              <div className="w-2.5 h-3.5 bg-[#f9bd22]/70 rounded-xs shadow-[0_0_6px_#f9bd22]" />
              <div className="w-2.5 h-3.5 bg-[#f0ecf4]/20 rounded-xs" />
              <div className="w-2.5 h-3.5 bg-[#f0ecf4]/20 rounded-xs" />
              <div className="w-2.5 h-3.5 bg-[#f9bd22]/80 rounded-xs shadow-[0_0_6px_#f9bd22]" />
            </div>

            {/* Building 2 windows */}
            <div className="grid grid-cols-3 gap-2 mb-16" style={{ animationDelay: '1.2s' }}>
              <div className="w-2 h-3 bg-[#f9bd22]/60 rounded-xs" />
              <div className="w-2 h-3 bg-[#f0ecf4]/15 rounded-xs" />
              <div className="w-2 h-3 bg-[#f9bd22]/80 rounded-xs animate-window-twinkle" />
              <div className="w-2 h-3 bg-[#006398]/60 rounded-xs" />
              <div className="w-2 h-3 bg-[#f9bd22]/70 rounded-xs" />
              <div className="w-2 h-3 bg-[#f0ecf4]/20 rounded-xs" />
            </div>

            {/* Building 3 windows */}
            <div className="grid grid-cols-2 gap-2 mb-6 animate-window-twinkle" style={{ animationDelay: '2.5s' }}>
              <div className="w-2.5 h-3.5 bg-[#f9bd22]/80 rounded-xs shadow-[0_0_8px_#f9bd22]" />
              <div className="w-2.5 h-3.5 bg-[#f9bd22]/70 rounded-xs" />
              <div className="w-2.5 h-3.5 bg-[#f0ecf4]/20 rounded-xs" />
              <div className="w-2.5 h-3.5 bg-[#f9bd22]/60 rounded-xs" />
            </div>

            {/* Building 4 windows */}
            <div className="grid grid-cols-3 gap-1.5 mb-14 animate-window-twinkle" style={{ animationDelay: '0.8s' }}>
              <div className="w-2 h-3 bg-[#f0ecf4]/20 rounded-xs" />
              <div className="w-2 h-3 bg-[#f9bd22]/85 rounded-xs shadow-[0_0_6px_#f9bd22]" />
              <div className="w-2 h-3 bg-[#f0ecf4]/15 rounded-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LAYER 5 — UI (Fixed Score, Buttons, Navigation, Top HUD on uppermost plane)
          ========================================================================= */}
      {(header || hud) && (
        <div className="relative z-50 pointer-events-auto">
          {header}
          {hud}
        </div>
      )}

      {/* =========================================================================
          LAYER 3 — COMIC PANELS (Stable container so all button clicks register immediately)
          ========================================================================= */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      {footer && (
        <footer className="relative z-20">
          {footer}
        </footer>
      )}

      {/* =========================================================================
          LAYER 4 — CHARACTER (Spider-Man Foreground Perch with High Parallax Separation)
          ========================================================================= */}
      {showForegroundSpidey && (
        <aside
          className="fixed bottom-0 right-2 sm:right-6 z-30 pointer-events-auto select-none"
          style={{
            transform: `translate3d(${offsets.charX}px, ${offsets.charY}px, 45px)`,
            transition: 'transform 0.09s ease-out'
          }}
          aria-label="Spider-Man interactive comic mascot"
        >
          {/* Interactive Speech Bubble */}
          {spideyBubble && (
            <div className="absolute -top-16 right-4 sm:right-8 bg-white border-3 border-[#1b1b20] p-2.5 px-4 bubble-bottom ink-shadow-md z-40 max-w-[220px] animate-bounce">
              <span className="font-comic text-xs font-black text-[#dc2626] uppercase block leading-tight">
                {spideyBubble}
              </span>
            </div>
          )}

          {/* Action Silhouette & Web Line Perched on Architectural Cornice */}
          <div
            onClick={handleSpideyClick}
            className="group cursor-pointer relative animate-spidey-perch"
            title="Click Spidey for comic lore insight!"
          >
            {/* Comic Aura Halo */}
            <div className="absolute -inset-2 bg-radial from-[#dc2626]/20 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Web Line Tether rising to upper roof */}
            <div className="absolute -top-24 right-14 w-0.5 h-28 bg-gradient-to-t from-white via-white/80 to-transparent opacity-70 pointer-events-none -rotate-12" />

            {/* Architectural Cornice / Perch Base */}
            <div className="w-28 sm:w-36 h-8 bg-[#121522] border-t-3 border-l-3 border-[#1b1b20] absolute -bottom-1 -right-2 shadow-2xl skew-x-6">
              <div className="w-full h-1 bg-[#dc2626]/60" />
            </div>

            {/* Authentic Comic Spidey Silhouette SVG with Mask & Eyes */}
            <svg
              className="w-24 sm:w-32 h-28 sm:h-36 relative z-10 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform"
              viewBox="0 0 120 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Spider-Man Crouching / Perched Heroic Contour */}
              <path
                d="M45,135 C35,130 25,120 28,105 C30,95 38,90 42,82 C44,78 40,70 38,62 C35,50 40,35 55,28 C68,22 82,26 88,38 C94,48 92,60 88,68 C85,74 88,80 94,86 C102,94 105,108 98,120 C92,130 80,135 70,136 Z"
                fill="#121522"
                stroke="#dc2626"
                strokeWidth="2.5"
              />
              {/* Suit Inking & Muscle Contours */}
              <path
                d="M50,42 C54,32 66,30 74,34 C80,37 82,45 80,52 C78,59 72,64 64,63 C56,62 50,54 50,42 Z"
                fill="#dc2626"
                opacity="0.85"
              />
              {/* Web Lines on Mask */}
              <path
                d="M65,33 L65,63 M53,46 L77,46 M55,38 L75,54 M75,38 L55,54"
                stroke="#1b1b20"
                strokeWidth="1.2"
              />
              {/* Iconic Expressive Comic Lenses */}
              <polygon
                points="54,43 62,45 59,50 52,48"
                fill="#ffffff"
                stroke="#1b1b20"
                strokeWidth="1.8"
                className="filter drop-shadow-[0_0_3px_#ffffff]"
              />
              <polygon
                points="76,43 68,45 71,50 78,48"
                fill="#ffffff"
                stroke="#1b1b20"
                strokeWidth="1.8"
                className="filter drop-shadow-[0_0_3px_#ffffff]"
              />
              {/* Shoulder & Web Shooter Gauntlet Highlight */}
              <path
                d="M38,82 Q48,74 58,88 L52,102 Q42,94 38,82 Z"
                fill="#006398"
                opacity="0.75"
                stroke="#1b1b20"
                strokeWidth="1.5"
              />
              <path
                d="M86,84 Q76,78 68,90 L74,104 Q82,96 86,84 Z"
                fill="#006398"
                opacity="0.75"
                stroke="#1b1b20"
                strokeWidth="1.5"
              />
              {/* Spider Emblem on Chest */}
              <ellipse cx="64" cy="78" rx="4" ry="6" fill="#1b1b20" />
              <path
                d="M60,74 L54,70 M60,78 L52,78 M60,82 L53,86 M68,74 L74,70 M68,78 L76,78 M68,82 L75,86"
                stroke="#1b1b20"
                strokeWidth="1.2"
              />
            </svg>

            {/* Comic Click Cue */}
            <div className="bg-[#f9bd22] border-2 border-[#1b1b20] text-[#1b1b20] font-comic text-[9px] font-black px-1.5 py-0.5 ink-shadow-sm uppercase text-center mt-[-6px] relative z-20">
              CLICK SPIDEY
            </div>
          </div>
        </aside>
      )}

      {/* Floating Toggle for Layer 4 Character Perch */}
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40">
        <button
          onClick={() => setShowForegroundSpidey((prev) => !prev)}
          className="bg-[#1b1b20]/90 hover:bg-[#1b1b20] text-white p-1.5 px-2.5 rounded-none border border-white/30 font-comic text-[10px] font-black flex items-center gap-1.5 ink-shadow-sm backdrop-blur-xs cursor-pointer uppercase transition-colors"
          title={showForegroundSpidey ? "Minimize Spidey Perch" : "Show Spidey Perch"}
        >
          {showForegroundSpidey ? (
            <>
              <EyeOff className="w-3 h-3 text-[#f9bd22]" />
              <span className="hidden md:inline">HIDE SPIDEY</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3 text-[#22c55e]" />
              <span className="hidden md:inline">SHOW SPIDEY</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
