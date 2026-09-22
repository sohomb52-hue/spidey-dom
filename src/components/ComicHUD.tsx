import React, { useState } from 'react';
import { Zap, Radio, Flame, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ComicHUDProps {
  score: number;
  combo: number;
  triviaCleared: number;
  totalTrivia: number;
  streak: number;
  latestPoints?: number | null;
  onTriggerSpiderSense?: () => void;
}

export const ComicHUD: React.FC<ComicHUDProps> = ({
  score,
  combo,
  triviaCleared,
  totalTrivia,
  streak,
  latestPoints,
  onTriggerSpiderSense
}) => {
  const [pulseActive, setPulseActive] = useState(false);
  const sensePercent = Math.min(45 + combo * 12, 100);

  const handleSenseClick = () => {
    playSound('spider-sense');
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 900);
    if (onTriggerSpiderSense) {
      onTriggerSpiderSense();
    }
  };

  return (
    <section className="bg-[#eae7ee] border-b-4 border-[#1b1b20] py-2 px-3 sm:px-6 relative z-30">
      <div className="comic-halftone absolute inset-0 pointer-events-none" />

      {/* Comic Floating Score Burst (Section 10) */}
      {latestPoints && latestPoints > 0 && (
        <div className="absolute left-8 -bottom-10 z-50 pointer-events-none score-burst-anim">
          <div className="bg-[#f9bd22] text-[#1b1b20] border-3 border-[#1b1b20] px-3 py-1 ink-shadow-md font-comic font-black text-lg sm:text-xl rotate-3 flex items-center gap-1">
            <span>+{latestPoints}</span>
            <span className="text-xs bg-[#dc2626] text-white px-1 py-0.5 border border-[#1b1b20]">
              THWIP!
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 relative z-10">
        {/* Left: 🕷 SPIDER-SENSE & Score Display (Section 10) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            onClick={handleSenseClick}
            title="Click to trigger Spider-Sense radar tingle!"
            className={`bg-white border-2 border-[#1b1b20] px-3 py-1.5 ink-shadow-sm flex items-center gap-2 cursor-pointer hover:bg-[#fff0f0] transition-colors ${
              pulseActive ? 'spidey-tingle-anim' : ''
            }`}
          >
            <span className="text-base sm:text-lg">🕷️</span>
            <div className="flex flex-col">
              <span className="font-comic text-[9px] font-black text-[#dc2626] uppercase tracking-wider leading-none">
                SPIDER-SENSE
              </span>
              <span className="font-comic text-lg sm:text-xl font-black text-[#1b1b20] leading-none mt-0.5">
                {score.toLocaleString()}{' '}
                <span className="text-[10px] text-[#006398] font-bold">PTS</span>
              </span>
            </div>
          </div>

          {/* COMBO ×07 with reward flame effect */}
          <div
            className={`border-2 border-[#1b1b20] px-2.5 py-1.5 ink-shadow-sm flex items-center gap-1.5 transition-all ${
              combo > 1
                ? 'bg-[#dc2626] text-white spider-sense-active animate-bounce'
                : 'bg-[#ffdf9f] text-[#261a00]'
            }`}
          >
            {combo > 1 ? (
              <Flame className="w-4 h-4 text-[#f9bd22] fill-[#f9bd22]" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-[#765700] fill-[#765700]" />
            )}
            <span className="font-comic text-[11px] font-black uppercase">
              COMBO:
            </span>
            <span className="font-comic text-base sm:text-lg font-black leading-none">
              ×{String(combo).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Center: Interactive Spider-Sense Readiness Bar (Section 8) */}
        <div
          onClick={handleSenseClick}
          className="flex items-center gap-2 flex-grow max-w-xs sm:max-w-md cursor-pointer group"
          title="Click to activate Spider-Sense wave"
        >
          <span className="font-comic text-[10px] sm:text-[11px] font-black uppercase whitespace-nowrap flex items-center gap-1 text-[#dc2626] group-hover:underline">
            <Radio className="w-3.5 h-3.5 animate-spin" /> SPIDER-SENSE:
          </span>
          <div className="w-full bg-[#e4e1e9] border-2 border-[#1b1b20] h-5 p-0.5 ink-shadow-sm relative overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                sensePercent > 75
                  ? 'bg-gradient-to-r from-[#dc2626] via-[#f9bd22] to-[#dc2626]'
                  : 'bg-gradient-to-r from-[#006398] via-[#5bb8fe] to-[#dc2626]'
              }`}
              style={{ width: `${sensePercent}%` }}
            />
            <div className="absolute inset-0 comic-dots-yellow pointer-events-none" />
          </div>
          <span className="font-comic text-xs font-black min-w-[34px] text-right text-[#1b1b20]">
            {sensePercent}%
          </span>
        </div>

        {/* Right: Stats Quick Tickers */}
        <div className="flex items-center gap-2 font-comic text-xs font-black">
          <div className="bg-white border-2 border-[#1b1b20] px-2 py-1 ink-shadow-sm">
            TRIVIA: <span className="text-[#dc2626]">{triviaCleared}</span>/{totalTrivia}
          </div>
          <div className="bg-white border-2 border-[#1b1b20] px-2 py-1 ink-shadow-sm hidden xs:block">
            STREAK: <span className="text-[#006398]">{streak}</span> 🔥
          </div>
        </div>
      </div>
    </section>
  );
};
