/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { playSound } from '../utils/audio';

export const CompactCreatorFooter: React.FC = () => {
  return (
    <footer
      aria-label="Creator and Project Credits"
      className="w-full bg-[#0c0d14] text-[#fffbf0] border-t-2 border-[#1b1b20] relative overflow-hidden py-7 sm:py-9 px-4 sm:px-8 select-none"
    >
      {/* Background Halftone Texture (Very subtle, 6% opacity) */}
      <div
        className="comic-halftone absolute inset-0 opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Red & Blue Atmospheric Vignette Accents */}
      <div
        className="absolute -top-12 -left-12 w-64 h-32 bg-[#dc2626]/12 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-12 -right-12 w-64 h-32 bg-[#006398]/15 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Small Web Details (Corner SVG web line accents) */}
      <svg
        className="absolute top-0 left-0 w-24 h-24 text-white/10 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <path d="M0 0 L100 0 M0 0 L0 100" strokeWidth="2" stroke="#dc2626" strokeOpacity="0.4" />
        <path d="M0 25 Q25 25 25 0" />
        <path d="M0 50 Q50 50 50 0" />
        <path d="M0 75 Q75 75 75 0" />
        <path d="M0 100 Q100 100 100 0" />
        <line x1="0" y1="0" x2="80" y2="80" />
        <line x1="0" y1="0" x2="35" y2="70" />
        <line x1="0" y1="0" x2="70" y2="35" />
      </svg>

      <svg
        className="absolute top-0 right-0 w-24 h-24 text-white/10 pointer-events-none -scale-x-100"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
      >
        <path d="M0 0 L100 0 M0 0 L0 100" strokeWidth="2" stroke="#006398" strokeOpacity="0.4" />
        <path d="M0 25 Q25 25 25 0" />
        <path d="M0 50 Q50 50 50 0" />
        <path d="M0 75 Q75 75 75 0" />
        <path d="M0 100 Q100 100 100 0" />
        <line x1="0" y1="0" x2="80" y2="80" />
        <line x1="0" y1="0" x2="35" y2="70" />
        <line x1="0" y1="0" x2="70" y2="35" />
      </svg>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Side: Brand & Creator Identity (STRONGEST ELEMENT) */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          {/* Comic Title */}
          <div className="flex items-center gap-2">
            <span className="font-comic text-[10px] font-black uppercase tracking-wider text-white bg-[#dc2626] px-2 py-0.5 border border-[#1b1b20] -rotate-1 shadow-xs">
              CANON EDITION
            </span>
            <h2 className="font-comic text-base sm:text-lg font-black uppercase text-[#fffbf0] tracking-wide">
              SPIDER-VERSE: FACT ATTACK
            </h2>
          </div>

          {/* CREATOR NAME: STRONGEST ELEMENT IN THE FOOTER */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5 my-0.5">
            <span className="font-comic text-xs sm:text-sm font-black uppercase text-[#ffdf9f]/90 tracking-wider">
              Created by
            </span>
            <span className="font-comic text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-white tracking-wider drop-shadow-[2px_2px_0_#dc2626] sm:drop-shadow-[3px_3px_0_#dc2626] hover:text-[#f9bd22] transition-colors leading-none">
              SOHOM BANERJEE
            </span>
          </div>

          {/* Small Comic Caption */}
          <div className="inline-flex items-center gap-2 bg-[#161824] border border-[#f9bd22]/40 px-3 py-1 rounded-xs ink-shadow-sm">
            <span className="text-[#f9bd22] text-xs">⚡</span>
            <p className="font-comic text-xs font-bold text-[#ffdf9f] uppercase tracking-wide leading-none">
              Built with curiosity. Powered by the Spider-Sense.
            </p>
          </div>
        </div>

        {/* Right Side: Two Accessible Comic Badges for GitHub & Instagram */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {/* GitHub Social Badge */}
          <a
            href="https://github.com/sohomb52-hue"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('thwip')}
            aria-label="Visit Sohom Banerjee's GitHub profile github.com/sohomb52-hue (opens in a new tab)"
            className="group relative flex items-center gap-3 bg-[#141622] hover:bg-[#1f2235] text-[#fffbf0] border border-[#fffbf0]/25 hover:border-[#f9bd22] px-4 py-2.5 rounded-xs transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 min-h-[44px] min-w-[170px] ink-shadow-sm cursor-pointer"
          >
            {/* Subtle top indicator bar */}
            <div className="absolute -top-[1px] left-3 right-3 h-[2px] bg-[#f9bd22]/0 group-hover:bg-[#f9bd22] transition-colors" />

            {/* Icon Graphic */}
            <div className="w-8 h-8 rounded-xs bg-[#1b1b20] border border-[#f9bd22]/50 flex items-center justify-center text-[#f9bd22] group-hover:scale-110 transition-transform flex-shrink-0">
              <svg
                className="w-4 h-4 fill-currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </div>

            <div className="text-left">
              <span className="text-[10px] font-mono text-[#f9bd22] font-black uppercase block leading-none">
                &lt; / &gt; GITHUB
              </span>
              <span className="font-comic text-xs sm:text-sm font-black uppercase text-white group-hover:text-[#f9bd22] transition-colors block leading-tight mt-0.5">
                VIEW MY CODE
              </span>
            </div>
          </a>

          {/* Instagram Social Badge */}
          <a
            href="https://www.instagram.com/spideyinthehouse_x?stkn=MXFvZjIxNzFuYXRvYw=="
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound('thwip')}
            aria-label="Follow Sohom Banerjee on Instagram @spideyinthehouse_x (opens in a new tab)"
            className="group relative flex items-center gap-3 bg-[#141622] hover:bg-[#1f2235] text-[#fffbf0] border border-[#fffbf0]/25 hover:border-[#dc2626] px-4 py-2.5 rounded-xs transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 min-h-[44px] min-w-[170px] ink-shadow-sm cursor-pointer"
          >
            {/* Subtle top indicator bar */}
            <div className="absolute -top-[1px] left-3 right-3 h-[2px] bg-[#dc2626]/0 group-hover:bg-[#dc2626] transition-colors" />

            {/* Icon Graphic */}
            <div className="w-8 h-8 rounded-xs bg-[#1b1b20] border border-[#dc2626]/50 flex items-center justify-center text-[#dc2626] group-hover:scale-110 transition-transform flex-shrink-0">
              <svg
                className="w-4 h-4 fill-none stroke-currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>

            <div className="text-left">
              <span className="text-[10px] font-mono text-[#dc2626] font-black uppercase block leading-none">
                ◎ INSTAGRAM
              </span>
              <span className="font-comic text-xs sm:text-sm font-black uppercase text-white group-hover:text-[#ff8a80] transition-colors block leading-tight mt-0.5">
                FOLLOW THE CREATOR
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Dynamic Copyright Year & Comics Code Attribution */}
      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2 text-[11px] font-mono text-white/60 relative z-10">
        <p>
          © {new Date().getFullYear()} Sohom Banerjee. All rights reserved.
        </p>
        <p className="text-[10px] uppercase font-comic text-[#ffdf9f]/80">
          Created with curiosity • Powered by the Spider-Sense
        </p>
      </div>
    </footer>
  );
};
