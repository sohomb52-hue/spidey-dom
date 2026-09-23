/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Gamepad2, Compass, AlertCircle } from 'lucide-react';
import { playSound } from '../../utils/audio';
import { WebPageId } from '../../types';

interface NotFoundComicPageProps {
  onReturnHome: () => void;
  onReturnToGame: (page?: WebPageId) => void;
}

export const NotFoundComicPage: React.FC<NotFoundComicPageProps> = ({
  onReturnHome,
  onReturnToGame
}) => {
  return (
    <section
      aria-label="404 Page Not Found"
      className="max-w-4xl mx-auto my-6 px-4 py-8"
    >
      {/* Outer Comic Issue Frame */}
      <div className="relative border-4 sm:border-6 border-[#1b1b20] bg-[#fffbf0] p-5 sm:p-8 ink-shadow-red-multi overflow-hidden">
        {/* Halftone Texture Overlay */}
        <div className="comic-halftone absolute inset-0 opacity-20 pointer-events-none" />

        {/* Vintage Top Corner Comics Issue Stamp */}
        <div className="flex items-center justify-between border-b-4 border-[#1b1b20] pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-[#dc2626] text-white font-comic text-xs font-black px-2 py-0.5 border border-[#1b1b20] uppercase">
              CLASSIFIED ISSUE #404
            </span>
            <span className="font-comic text-xs sm:text-sm font-black text-[#5b403d] uppercase tracking-wider hidden xs:inline">
              LOST DIMENSION ANOMALY
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-[#dc2626] bg-[#fee2e2] px-2 py-0.5 border border-[#1b1b20]">
            STATUS: OFF-CANON
          </span>
        </div>

        {/* Comic Art & Action Speech Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Comic Web Art Visual */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 border-4 border-[#1b1b20] bg-[#121522] rounded-full flex items-center justify-center overflow-hidden ink-shadow-lg">
              {/* Spider Web Strings */}
              <svg
                className="absolute inset-0 w-full h-full text-white/20 animate-spin"
                style={{ animationDuration: '60s' }}
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <circle cx="50" cy="50" r="15" strokeDasharray="3 2" />
                <circle cx="50" cy="50" r="28" strokeDasharray="4 2" />
                <circle cx="50" cy="50" r="42" strokeDasharray="4 3" />
                <line x1="50" y1="0" x2="50" y2="100" />
                <line x1="0" y1="50" x2="100" y2="50" />
                <line x1="15" y1="15" x2="85" y2="85" />
                <line x1="85" y1="15" x2="15" y2="85" />
              </svg>

              {/* Trapped Spider Badge */}
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-5xl sm:text-6xl animate-bounce">🕸️</span>
                <span className="font-comic text-2xl font-black text-[#f9bd22] drop-shadow-[2px_2px_0_#1b1b20] mt-1">
                  404
                </span>
              </div>

              {/* Action lines */}
              <div className="absolute inset-0 comic-speed-lines opacity-20 pointer-events-none" />
            </div>

            <div className="mt-3 bg-[#f9bd22] border-2 border-[#1b1b20] px-3 py-1 -rotate-2 ink-shadow-sm">
              <span className="font-comic text-[11px] font-black uppercase text-[#1b1b20]">
                "MULTIVERSE STRAND SEVERED!"
              </span>
            </div>
          </div>

          {/* Right Column: Comic Headlines & Dialogue Bubble */}
          <div className="md:col-span-7 space-y-4">
            {/* Impact Headline as requested */}
            <div className="bg-[#dc2626] text-white border-3 sm:border-4 border-[#1b1b20] p-4 sm:p-5 ink-shadow-md rotate-0.5">
              <span className="font-comic text-xs font-black uppercase bg-[#1b1b20] text-[#f9bd22] px-2 py-0.5 border border-white inline-block mb-1.5">
                PETER PARKER SIXTH SENSE REPORT:
              </span>
              <h1 className="font-comic text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none drop-shadow-[2px_2px_0_#1b1b20]">
                THWIP! YOU'RE LOST.
              </h1>
            </div>

            {/* Comic Speech Dialogue as requested */}
            <div className="relative bg-white border-3 border-[#1b1b20] p-4 bubble-bottom ink-shadow-sm -rotate-0.5">
              <p className="font-comic text-base sm:text-lg font-black text-[#1b1b20] uppercase leading-snug">
                "LOOKS LIKE THIS PAGE GOT CAUGHT IN ANOTHER WEB."
              </p>
              <p className="text-xs sm:text-sm text-[#5b403d] font-semibold mt-1.5 leading-relaxed">
                Even Miguel O'Hara's dimensional gizmos can't locate this URL strand across the Multiverse. Don't worry, true believer—your points, streaks, and badges are safely stored in Earth-616!
              </p>
            </div>

            {/* Action Buttons: Home & Game */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  playSound('thwip');
                  onReturnHome();
                }}
                className="flex-1 bg-[#1b1b20] hover:bg-[#2d2d38] text-white font-comic text-sm font-black py-3 px-5 border-2 border-[#1b1b20] uppercase flex items-center justify-center gap-2 ink-btn ink-shadow-sm cursor-pointer"
              >
                <Home className="w-4 h-4 text-[#f9bd22]" />
                <span>RETURN TO HOME BASE</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound('thwip');
                  onReturnToGame('arcade');
                }}
                className="flex-1 bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-sm font-black py-3 px-5 border-2 border-[#1b1b20] uppercase flex items-center justify-center gap-2 ink-btn ink-shadow-sm cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>RETURN TO ARCADE GAME</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Comic Footer Strip */}
        <div className="mt-8 pt-3 border-t-3 border-[#1b1b20] flex flex-wrap items-center justify-between text-xs font-comic font-black text-[#5b403d] uppercase gap-2">
          <span>SPIDER-VERSE RESCUE PROTOCOL READY</span>
          <span className="text-[#dc2626]">THWIP! • SWING SAFELY BACK TO REALITY</span>
        </div>
      </div>
    </section>
  );
};
