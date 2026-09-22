import React from 'react';
import { Zap, Radio } from 'lucide-react';

interface ComicImpactProps {
  type: 'correct' | 'wrong' | 'sense' | null;
  text?: string;
  subtext?: string;
  points?: number;
  combo?: number;
}

export const ComicImpactBurst: React.FC<ComicImpactProps> = ({
  type,
  text,
  subtext,
  points,
  combo
}) => {
  if (!type) return null;

  const isCorrect = type === 'correct';
  const isSense = type === 'sense';

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
      aria-live="assertive"
    >
      {/* Background Action Speed Rays Flare */}
      <div className="absolute inset-0 comic-speed-lines opacity-40 animate-pulse" />

      {/* Spider-Sense Tingle Radar Wave */}
      {isSense && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full border-4 border-[#dc2626] spidey-tingle-anim opacity-60" />
          <div className="w-[300px] h-[300px] rounded-full border-4 border-[#f9bd22] spidey-tingle-anim opacity-80" />
          <div className="bg-[#1b1b20] text-[#f9bd22] border-4 border-[#dc2626] px-6 py-3 ink-shadow-xl -rotate-2 flex items-center gap-3 animate-bounce">
            <Radio className="w-6 h-6 text-[#dc2626] animate-spin" />
            <div className="text-center">
              <span className="font-comic text-xs font-black uppercase text-[#dc2626] tracking-widest block">
                PETER PARKER SIXTH SENSE
              </span>
              <span className="font-comic text-xl sm:text-2xl font-black text-white uppercase">
                ⚡ SPIDER-SENSE TINGLING! ⚡
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Comic Impact Starburst Graphic */}
      {!isSense && (
        <div className="relative flex flex-col items-center justify-center animate-impact-pop">
          {/* Jagged Starburst Background SVG */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className={`w-full h-full filter drop-shadow-[6px_6px_0px_#1b1b20] ${
                isCorrect ? 'text-[#f9bd22]' : 'text-[#dc2626]'
              }`}
            >
              {/* Authentic 16-point comic starburst */}
              <polygon
                points="100,5 125,50 175,25 155,75 195,100 155,125 175,175 125,150 100,195 75,150 25,175 45,125 5,100 45,75 25,25 75,50"
                fill="currentColor"
                stroke="#1b1b20"
                strokeWidth="5"
                strokeLinejoin="miter"
              />
              {/* Inner Halftone Starburst */}
              <polygon
                points="100,25 118,60 155,42 140,80 170,100 140,120 155,158 118,140 100,175 82,140 45,158 60,120 30,100 60,80 45,42 82,60"
                fill={isCorrect ? '#dc2626' : '#1b1b20'}
                stroke="#1b1b20"
                strokeWidth="3"
              />
            </svg>

            {/* Impact Text (BAM! / OOF! / THWIP!) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center -rotate-6 select-none">
              <span className="font-comic text-4xl sm:text-6xl font-black text-white uppercase drop-shadow-[4px_4px_0_#1b1b20] tracking-wider leading-none">
                {text || (isCorrect ? 'BAM!' : 'OOF!')}
              </span>
              {subtext && (
                <span className="font-comic text-sm sm:text-base font-black text-[#ffdf9f] uppercase drop-shadow-[2px_2px_0_#1b1b20] tracking-wide mt-1">
                  {subtext}
                </span>
              )}
            </div>
          </div>

          {/* Floating Score Burst Ejection */}
          {points && points > 0 && (
            <div className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 bg-[#22c55e] text-white border-3 sm:border-4 border-[#1b1b20] px-4 py-2 ink-shadow-lg font-comic font-black text-xl sm:text-3xl rotate-12 score-burst-anim">
              +{points} PTS!
              {combo && combo > 1 && (
                <span className="block text-xs text-[#f9bd22] font-black">
                  COMBO ×{combo}!
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Layered foreground web corners that overlap panel edges,
 * breaking flat boxes and giving depth to comic borders.
 */
export const ComicPanelWebCorner: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant?: 'web' | 'tear' | 'badge';
}> = ({ position = 'top-right', variant = 'web' }) => {
  const positionClasses = {
    'top-left': 'top-[-10px] left-[-10px]',
    'top-right': 'top-[-10px] right-[-10px]',
    'bottom-left': 'bottom-[-10px] left-[-10px]',
    'bottom-right': 'bottom-[-10px] right-[-10px]'
  }[position];

  if (variant === 'web') {
    return (
      <div
        className={`absolute ${positionClasses} z-20 pointer-events-none select-none`}
        aria-hidden="true"
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          {position === 'top-right' && (
            <>
              <path d="M48 0 L0 0 L48 48 Z" fill="#ffffff" opacity="0.9" stroke="#1b1b20" strokeWidth="2" />
              <path d="M48 12 C32 12 36 32 48 36" stroke="#1b1b20" strokeWidth="1.5" fill="none" />
              <path d="M48 24 C20 24 24 48 36 48" stroke="#1b1b20" strokeWidth="1.5" fill="none" />
              <line x1="48" y1="0" x2="16" y2="32" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 2" />
            </>
          )}
          {position === 'top-left' && (
            <>
              <path d="M0 0 L48 0 L0 48 Z" fill="#ffffff" opacity="0.9" stroke="#1b1b20" strokeWidth="2" />
              <path d="M0 12 C16 12 12 32 0 36" stroke="#1b1b20" strokeWidth="1.5" fill="none" />
              <line x1="0" y1="0" x2="32" y2="32" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 2" />
            </>
          )}
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`absolute ${positionClasses} z-20 pointer-events-none select-none`}
      aria-hidden="true"
    >
      <div className="bg-[#dc2626] text-white font-comic text-[9px] font-black px-1.5 py-0.5 border-2 border-[#1b1b20] ink-shadow-sm rotate-12">
        MARVEL
      </div>
    </div>
  );
};
