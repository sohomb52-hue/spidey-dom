/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { playSound } from '../utils/audio';
import { Sparkles, Radio } from 'lucide-react';

interface CinematicIntroProps {
  onEnter: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onEnter }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [webShot, setWebShot] = useState(false);

  const handleEnter = () => {
    if (isTransitioning) return;
    playSound('thwip');
    setWebShot(true);
    setIsTransitioning(true);

    // Zoom and comic panel transition sequence (fast, punchy 650ms)
    setTimeout(() => {
      onEnter();
    }, 650);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0c0d14] flex items-center justify-center overflow-hidden transition-all duration-700 ${
        isTransitioning
          ? 'scale-125 opacity-0 pointer-events-none'
          : 'scale-100 opacity-100'
      }`}
    >
      {/* BACKGROUND LAYER: Dark New York City Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07080d] via-[#101322] to-[#1a0808]" />

      {/* Atmospheric Spider-Man Red & Blue Spotlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#dc2626]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#006398]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Comic Halftone Texture Overlay */}
      <div className="comic-halftone absolute inset-0 opacity-15 pointer-events-none" />
      <div className="comic-speed-lines-dark absolute inset-0 opacity-30 pointer-events-none" />

      {/* Animated Web Strands in Night Wind */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0"
          y1="0"
          x2="45%"
          y2="38%"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className="animate-pulse"
        />
        <line
          x1="100%"
          y1="0"
          x2="55%"
          y2="38%"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          className="animate-pulse"
        />
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="38%"
          stroke="#ffffff"
          strokeWidth="2"
        />
        {/* Subtle web arcs */}
        <path
          d="M 15% 10% Q 30% 25% 45% 38%"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
        />
        <path
          d="M 85% 10% Q 70% 25% 55% 38%"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
        />
      </svg>

      {/* Subtle NYC Skyline Silhouette with Distant Window Lights */}
      <div className="absolute bottom-0 inset-x-0 h-44 sm:h-56 pointer-events-none flex items-end justify-center opacity-85">
        <svg
          viewBox="0 0 1200 300"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Back distant towers */}
          <rect x="50" y="90" width="70" height="210" fill="#0f111a" />
          <rect x="130" y="140" width="50" height="160" fill="#0a0c12" />
          <rect x="200" y="60" width="90" height="240" fill="#141724" />
          <polygon points="245,20 235,60 255,60" fill="#141724" />
          <rect x="310" y="110" width="65" height="190" fill="#0c0e16" />
          <rect x="400" y="80" width="110" height="220" fill="#141724" />
          <rect x="530" y="130" width="75" height="170" fill="#0c0e16" />
          {/* Empire-state style tower */}
          <rect x="630" y="50" width="95" height="250" fill="#151828" />
          <polygon points="677,10 670,50 684,50" fill="#dc2626" />
          <rect x="745" y="100" width="80" height="200" fill="#0a0c12" />
          <rect x="840" y="70" width="100" height="230" fill="#141724" />
          <rect x="960" y="120" width="70" height="180" fill="#0c0e16" />
          <rect x="1050" y="90" width="90" height="210" fill="#151828" />

          {/* Distant window lights */}
          <circle cx="230" cy="90" r="1.5" fill="#ffd54f" opacity="0.8" />
          <circle cx="245" cy="110" r="1.5" fill="#ffd54f" opacity="0.7" />
          <circle cx="260" cy="130" r="1.5" fill="#ffffff" opacity="0.9" />
          <circle cx="430" cy="100" r="1.5" fill="#ffd54f" opacity="0.8" />
          <circle cx="450" cy="130" r="1.5" fill="#ffd54f" opacity="0.7" />
          <circle cx="470" cy="115" r="1.5" fill="#ffffff" opacity="0.6" />
          <circle cx="660" cy="80" r="2" fill="#ffd54f" opacity="0.9" />
          <circle cx="680" cy="100" r="2" fill="#ffd54f" opacity="0.8" />
          <circle cx="670" cy="130" r="1.5" fill="#ffffff" opacity="0.7" />
          <circle cx="870" cy="95" r="1.5" fill="#ffd54f" opacity="0.8" />
          <circle cx="890" cy="120" r="1.5" fill="#ffffff" opacity="0.9" />
        </svg>
      </div>

      {/* Web Shooting FX across screen during transition */}
      {webShot && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          <div className="w-full h-2 bg-white blur-xs shadow-[0_0_30px_#ffffff] rotate-12 animate-ping" />
          <div className="w-full h-2 bg-white blur-xs shadow-[0_0_30px_#dc2626] -rotate-12 animate-ping" />
          <div className="absolute text-5xl sm:text-7xl font-comic font-black text-white bg-[#dc2626] px-6 py-2 border-4 border-white ink-shadow-lg rotate-3 animate-bounce">
            THWIP!!
          </div>
        </div>
      )}

      {/* FOREGROUND: The Living Comic Panel Presentation */}
      <div className="relative z-20 max-w-2xl w-full mx-4 p-4 sm:p-6">
        {/* Main Angled Comic Panel */}
        <div className="border-4 sm:border-6 border-[#1b1b20] bg-[#fffbf0] text-[#1b1b20] p-6 sm:p-8 ink-shadow-red-lg relative overflow-hidden -rotate-1 shadow-2xl">
          {/* Comic Dots Background */}
          <div className="comic-dots-red absolute inset-0 opacity-15 pointer-events-none" />

          {/* Top Yellow Corner Caption */}
          <div className="flex items-center justify-between border-b-3 border-[#1b1b20] pb-3 mb-5">
            <div className="bg-[#f9bd22] border-2 border-[#1b1b20] px-3 py-1 ink-shadow-sm -rotate-1">
              <span className="font-comic text-xs sm:text-sm font-black text-[#1b1b20] uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#dc2626] animate-spin" />
                MARVEL COMICS GROUP • ISSUE #300
              </span>
            </div>
            <span className="bg-[#dc2626] text-white font-comic text-[10px] sm:text-xs font-black px-2 py-0.5 border border-[#1b1b20] uppercase">
              APPROVED BY COMICS CODE
            </span>
          </div>

          {/* Narrative Comic Caption */}
          <div className="mb-4 bg-white border-2 border-[#1b1b20] p-2.5 max-w-md ink-shadow-sm rotate-0.5">
            <p className="font-comic text-xs sm:text-sm font-black text-[#5b403d] uppercase tracking-wide leading-tight">
              "THE NIGHT IS DARK OVER MANHATTAN... BUT YOUR SPIDER-SENSE IS TINGLING!"
            </p>
          </div>

          {/* Title Revealed Through the Comic Panel */}
          <div className="text-center my-6 relative">
            <span className="font-comic text-xs sm:text-sm font-black text-[#dc2626] uppercase tracking-widest bg-white px-3 py-1 border-2 border-[#1b1b20] ink-shadow-sm inline-block mb-2">
              THE DEFINITIVE MULTIVERSE TRIVIA ARCADE
            </span>
            <h1 className="font-comic text-4xl sm:text-6xl md:text-7xl font-black uppercase text-[#dc2626] leading-none tracking-tight drop-shadow-[4px_4px_0_#1b1b20]">
              SPIDER-VERSE:
            </h1>
            <h2 className="font-comic text-3xl sm:text-5xl md:text-6xl font-black uppercase text-[#1b1b20] leading-tight tracking-tight mt-1">
              FACT ATTACK!
            </h2>
            <div className="flex justify-center items-center gap-2 mt-2 font-comic text-xs sm:text-sm font-black text-[#5b403d] uppercase">
              <span className="bg-[#f9bd22] text-[#1b1b20] px-2 py-0.5 border border-[#1b1b20]">
                6 ARCADE GAMES
              </span>
              <span>•</span>
              <span className="bg-[#006398] text-white px-2 py-0.5 border border-[#1b1b20]">
                3D WEB THROWER
              </span>
              <span>•</span>
              <span className="bg-[#dc2626] text-white px-2 py-0.5 border border-[#1b1b20]">
                CANON LORE
              </span>
            </div>
          </div>

          {/* Primary CTA: "THWIP! ENTER THE SPIDER-VERSE" */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleEnter}
              disabled={isTransitioning}
              className="w-full sm:w-auto bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-lg sm:text-xl font-black py-4 px-8 border-3 border-[#1b1b20] ink-shadow-lg hover:-translate-y-1 active:translate-y-0.5 ink-btn flex items-center justify-center gap-3 group cursor-pointer"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">
                🕸️
              </span>
              <span className="uppercase tracking-wide">
                THWIP! ENTER THE SPIDER-VERSE
              </span>
              <Sparkles className="w-5 h-5 text-[#f9bd22]" />
            </button>

            {/* Quick Skip Option */}
            <button
              onClick={() => onEnter()}
              className="font-comic text-xs font-black text-[#5b403d] hover:text-[#1b1b20] underline uppercase py-2 px-3 cursor-pointer"
            >
              SKIP INTRO →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
