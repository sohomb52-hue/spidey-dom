/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audio';
import { Sparkles, Radio, ArrowRight } from 'lucide-react';

interface CinematicIntroProps {
  onEnter: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onEnter }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [webShot, setWebShot] = useState(false);
  const [panelStep, setPanelStep] = useState<number>(1);

  // Vertical storytelling beats:
  // Step 1: CALM (City skyline under moonlight)
  // Step 2: SPIDER-MAN ARRIVES (Swinging in, perching with sound effect)
  // Step 3: SPIDER-SENSE TENSION & CHALLENGE REVEAL
  useEffect(() => {
    const t1 = setTimeout(() => {
      setPanelStep(2);
      playSound('thwip');
    }, 450);

    const t2 = setTimeout(() => {
      setPanelStep(3);
      playSound('spider-sense');
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleEnter = () => {
    if (isTransitioning) return;
    playSound('thwip');
    setWebShot(true);
    setIsTransitioning(true);

    // Zoom and comic panel transition sequence (punchy 600ms)
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <aside
      aria-label="Spider-Verse Cinematic Intro"
      className={`fixed inset-0 z-50 bg-[#07080e] flex items-center justify-center p-3 sm:p-6 overflow-y-auto transition-all duration-700 ${
        isTransitioning
          ? 'scale-110 opacity-0 pointer-events-none filter blur-sm'
          : 'scale-100 opacity-100'
      }`}
    >
      {/* ATMOSPHERIC BACKGROUND: Gotham-to-Queens Midnight Sky with Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06070d] via-[#0d1222] to-[#1a0808]" />

      {/* Spider-Man Spotlight Flares */}
      <div className="absolute top-10 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-[#dc2626]/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-[#006398]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Halftone & Speed lines textures */}
      <div className="comic-halftone absolute inset-0 opacity-20 pointer-events-none" />
      <div className="comic-speed-lines-dark absolute inset-0 opacity-25 pointer-events-none" />

      {/* Web Pull Effect across screen during transition */}
      {webShot && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="w-full h-3 bg-white blur-xs shadow-[0_0_30px_#ffffff] rotate-12 animate-ping" />
          <div className="w-full h-3 bg-white blur-xs shadow-[0_0_30px_#dc2626] -rotate-12 animate-ping" />
          <div className="absolute text-5xl sm:text-7xl font-comic font-black text-white bg-[#dc2626] px-8 py-3 border-4 border-white ink-shadow-xl rotate-3 animate-impact-pop">
            THWIP!!
          </div>
        </div>
      )}

      {/* VERTICAL STORYTELLING COMIC PAGE CONTAINER */}
      <div className="relative z-20 max-w-2xl w-full my-auto flex flex-col gap-3 sm:gap-4">
        {/* PANEL 1 (TOP): "THE CITY NEVER SLEEPS..." (Atmospheric & Calm) */}
        <section
          aria-label="Panel 1: Manhattan Skyline"
          className="border-3 sm:border-4 border-[#1b1b20] bg-[#111422] p-3 sm:p-4 ink-shadow-md relative overflow-hidden -rotate-0.5"
        >
          <div className="absolute top-0 left-0 bg-[#f9bd22] border-b-2 border-r-2 border-[#1b1b20] px-2.5 py-0.5 z-10 ink-shadow-sm">
            <span className="font-comic text-[10px] sm:text-[11px] font-black text-[#1b1b20] uppercase tracking-wider">
              NEW YORK CITY. 02:14 AM.
            </span>
          </div>

          <div className="h-20 sm:h-24 relative flex items-end justify-between px-2 pt-6">
            <p className="font-comic text-xs sm:text-sm font-black text-white/90 uppercase tracking-wide max-w-sm drop-shadow-[1px_1px_0_#1b1b20] z-10 leading-tight">
              "A cold autumn wind sweeps across the rooftops of Manhattan. But the city is never truly at rest..."
            </p>

            {/* Skyline Silhouette */}
            <svg
              className="absolute right-0 bottom-0 h-18 sm:h-22 w-64 pointer-events-none opacity-80"
              viewBox="0 0 240 80"
              fill="none"
            >
              <rect x="10" y="20" width="30" height="60" fill="#0c0e18" />
              <rect x="45" y="35" width="25" height="45" fill="#07080f" />
              <rect x="75" y="10" width="40" height="70" fill="#151a2d" />
              <polygon points="95,0 90,10 100,10" fill="#dc2626" />
              <circle cx="95" cy="20" r="1.5" fill="#ffd54f" />
              <circle cx="85" cy="35" r="1.2" fill="#ffffff" />
              <circle cx="105" cy="45" r="1.2" fill="#ffd54f" />
              <rect x="120" y="25" width="35" height="55" fill="#0c0e18" />
              <rect x="160" y="15" width="45" height="65" fill="#151a2d" />
              <rect x="210" y="30" width="28" height="50" fill="#07080f" />
            </svg>
          </div>
        </section>

        {/* PANEL 2 (CENTER): SPIDER-MAN ARRIVES! (Action, Arrival & Spider-Sense Tension) */}
        <section
          aria-label="Panel 2: Spider-Man Arrives"
          className={`border-4 sm:border-5 border-[#1b1b20] bg-[#fffbf0] text-[#1b1b20] p-4 sm:p-6 ink-shadow-red-lg relative overflow-hidden transition-all duration-500 ${
            panelStep >= 2 ? 'opacity-100 translate-y-0 rotate-0.5' : 'opacity-40 translate-y-3'
          }`}
        >
          {/* Halftone Dotting */}
          <div className="comic-dots-red absolute inset-0 opacity-15 pointer-events-none" />

          {/* Action Callout & Sound Effect */}
          <div className="flex items-center justify-between border-b-3 border-[#1b1b20] pb-2 mb-3">
            <div className="bg-[#dc2626] text-white border-2 border-[#1b1b20] px-2.5 py-0.5 ink-shadow-sm -rotate-1">
              <span className="font-comic text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#f9bd22] animate-spin" />
                SPIDER-MAN ARRIVES!
              </span>
            </div>
            <span className="bg-[#f9bd22] text-[#1b1b20] font-comic text-[10px] sm:text-[11px] font-black px-2 py-0.5 border border-[#1b1b20] uppercase">
              EARTH-616 CANON
            </span>
          </div>

          {/* Main Visual: Spider-Man Crouching on Ledge with Web & Speech Bubble */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Spider-Man Character Artwork with radiating Spider-Sense */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center relative py-1">
              {/* Spider-Sense Radiating Waves */}
              {panelStep >= 3 && (
                <div className="absolute -top-3 w-32 flex justify-between px-2 spidey-tingle-anim">
                  <span className="text-[#f9bd22] font-black text-sm">⚡</span>
                  <span className="text-[#dc2626] font-black text-base">⚡</span>
                  <span className="text-[#f9bd22] font-black text-sm">⚡</span>
                </div>
              )}

              {/* Spider-Man Illustrated Crouch Asset */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white border-3 border-[#1b1b20] rounded-sm p-2 flex items-center justify-center ink-shadow-sm relative rotate-1">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Mask Head */}
                  <ellipse cx="50" cy="46" rx="34" ry="38" fill="#dc2626" stroke="#1b1b20" strokeWidth="4" />
                  {/* Mask Web Lines */}
                  <path d="M50 8 L50 84 M16 46 L84 46 M26 22 L74 70 M26 70 L74 22" stroke="#1b1b20" strokeWidth="2.5" />
                  <ellipse cx="50" cy="46" rx="18" ry="20" stroke="#1b1b20" strokeWidth="2" fill="none" />
                  {/* Big Comic Eyes */}
                  <path d="M30 38 C36 34 44 42 42 50 C36 52 28 46 30 38 Z" fill="#ffffff" stroke="#1b1b20" strokeWidth="4" />
                  <path d="M70 38 C64 34 56 42 58 50 C64 52 72 46 70 38 Z" fill="#ffffff" stroke="#1b1b20" strokeWidth="4" />
                </svg>

                {/* Sound effect badge */}
                <div className="absolute -bottom-2 -right-3 bg-[#dc2626] text-white border-2 border-[#1b1b20] font-comic font-black text-[10px] px-2 py-0.5 rotate-6 ink-shadow-sm">
                  THWIP!
                </div>
              </div>
            </div>

            {/* Spidey's Speech Bubble (Dialogue) */}
            <div className="sm:col-span-7 bg-white border-3 border-[#1b1b20] p-3 sm:p-4 bubble-left depth-shadow-comic relative -rotate-0.5">
              <span className="bg-[#1b1b20] text-[#f9bd22] text-[9px] font-comic font-black px-1.5 py-0.5 uppercase block w-max mb-1">
                SPIDEY SAYS
              </span>
              <p className="font-comic text-xs sm:text-sm font-black text-[#1b1b20] uppercase leading-tight">
                "MY SPIDER-SENSE IS TINGLING! MYSTERIO IS WEAVING FAKE NEWS ACROSS THE MULTIVERSE! CAN YOU SEPARATE CANON TRUTH FROM VILLAINOUS ILLUSIONS?"
              </p>
            </div>
          </div>
        </section>

        {/* PANEL 3 (BOTTOM): THE ISSUE TITLE & CALL TO ACTION */}
        <section
          aria-label="Panel 3: Issue Masthead and Play Action"
          className="border-4 sm:border-5 border-[#1b1b20] bg-[#fffbf0] p-4 sm:p-5 ink-shadow-lg text-center relative overflow-hidden -rotate-0.5"
        >
          {/* Masthead Header */}
          <div className="flex items-center justify-between border-b-2 border-[#1b1b20] pb-2 mb-3">
            <span className="font-comic text-[10px] sm:text-xs font-black text-[#dc2626] uppercase tracking-wider">
              MARVEL COMICS GROUP • ISSUE #300
            </span>
            <span className="bg-[#1b1b20] text-white font-comic text-[9px] sm:text-[10px] font-black px-2 py-0.5 uppercase">
              AUTHENTIC ANNOTATED EDITION
            </span>
          </div>

          <h1 className="font-comic text-3xl sm:text-5xl font-black uppercase text-[#dc2626] leading-none tracking-tight drop-shadow-[3px_3px_0_#1b1b20]">
            SPIDER-VERSE: FACT ATTACK!
          </h1>
          <p className="font-comic text-xs sm:text-sm font-black text-[#5b403d] uppercase tracking-wider mt-1">
            AN INTERACTIVE DIGITAL COMIC & TRIVIA ADVENTURE
          </p>

          <div className="flex flex-wrap justify-center items-center gap-2 my-3 font-comic text-[11px] font-black text-[#1b1b20] uppercase">
            <span className="bg-[#f9bd22] px-2 py-0.5 border border-[#1b1b20]">
              6 ARCADE EXPERIENCES
            </span>
            <span>•</span>
            <span className="bg-[#006398] text-white px-2 py-0.5 border border-[#1b1b20]">
              3D WEB SLINGER
            </span>
            <span>•</span>
            <span className="bg-[#22c55e] text-white px-2 py-0.5 border border-[#1b1b20]">
              STAN LEE CANON
            </span>
          </div>

          {/* Primary Action Button (Huge Touch Target, Accessible) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleEnter}
              disabled={isTransitioning}
              className="w-full sm:w-auto bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-base sm:text-lg font-black py-3.5 px-8 border-3 border-[#1b1b20] ink-shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 ink-btn flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span className="text-xl group-hover:scale-125 transition-transform">
                🕸️
              </span>
              <span className="uppercase tracking-wide">
                THWIP! OPEN ISSUE #1 (ENTER)
              </span>
              <ArrowRight className="w-5 h-5 text-[#f9bd22] group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Accessible Instant Skip */}
            <button
              type="button"
              onClick={() => onEnter()}
              className="font-comic text-xs font-black text-[#5b403d] hover:text-[#1b1b20] underline uppercase py-2 px-3 cursor-pointer"
            >
              SKIP INTRO →
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
};
