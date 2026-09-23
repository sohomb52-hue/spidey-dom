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

/**
 * Layered foreground Spider-Man element that perches directly across
 * the upper border of a comic panel, breaking the flat 2D frame.
 */
export const ComicPanelForegroundPerch: React.FC<{
  senseActive?: boolean;
  mood?: 'curious' | 'alert' | 'victory' | 'warning';
}> = ({ senseActive = false, mood = 'curious' }) => {
  return (
    <div
      className="absolute -top-10 sm:-top-12 right-6 sm:right-12 z-30 pointer-events-none select-none flex flex-col items-center animate-spidey-perch"
      aria-hidden="true"
    >
      {/* Spider-Sense Radiating Wavy Arcs when tension activates */}
      {senseActive && (
        <div className="relative -mb-2 flex items-center justify-center">
          <div className="absolute -top-3 w-16 h-8 flex justify-between px-1">
            <span className="text-yellow-400 font-black text-xs spidey-tingle-anim">⚡</span>
            <span className="text-red-500 font-black text-sm spidey-tingle-anim">⚡</span>
            <span className="text-yellow-400 font-black text-xs spidey-tingle-anim">⚡</span>
          </div>
          <svg width="60" height="24" viewBox="0 0 60 24" fill="none" className="spidey-tingle-anim">
            <path
              d="M10 20 C18 6 42 6 50 20"
              stroke="#f9bd22"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M5 16 C16 0 44 0 55 16"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 2"
            />
          </svg>
        </div>
      )}

      {/* Crouching Spider-Man Mask & Hands gripping the border */}
      <div className="relative">
        <svg width="68" height="54" viewBox="0 0 68 54" fill="none">
          {/* Mask Base Outline */}
          <ellipse
            cx="34"
            cy="24"
            rx="24"
            ry="20"
            fill="#dc2626"
            stroke="#1b1b20"
            strokeWidth="3"
          />
          {/* Webbing Lines on Mask */}
          <path
            d="M34 4 L34 44 M10 24 L58 24 M16 12 L52 36 M16 36 L52 12"
            stroke="#1b1b20"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
          <ellipse cx="34" cy="24" rx="12" ry="10" stroke="#1b1b20" strokeWidth="1.5" fill="none" />

          {/* Mask Eyes (White lenses with bold black ink bevel) */}
          <path
            d="M20 18 C24 16 30 20 28 26 C24 28 18 24 20 18 Z"
            fill="#ffffff"
            stroke="#1b1b20"
            strokeWidth="2.5"
          />
          <path
            d="M48 18 C44 16 38 20 40 26 C44 28 50 24 48 18 Z"
            fill="#ffffff"
            stroke="#1b1b20"
            strokeWidth="2.5"
          />

          {/* Left Hand Gripping the Panel Border */}
          <rect
            x="4"
            y="38"
            width="14"
            height="12"
            rx="4"
            fill="#dc2626"
            stroke="#1b1b20"
            strokeWidth="2.5"
          />
          <line x1="8" y1="42" x2="8" y2="48" stroke="#1b1b20" strokeWidth="1.5" />
          <line x1="12" y1="42" x2="12" y2="48" stroke="#1b1b20" strokeWidth="1.5" />

          {/* Right Hand Gripping the Panel Border */}
          <rect
            x="50"
            y="38"
            width="14"
            height="12"
            rx="4"
            fill="#dc2626"
            stroke="#1b1b20"
            strokeWidth="2.5"
          />
          <line x1="54" y1="42" x2="54" y2="48" stroke="#1b1b20" strokeWidth="1.5" />
          <line x1="58" y1="42" x2="58" y2="48" stroke="#1b1b20" strokeWidth="1.5" />
        </svg>

        {/* Small "THWIP!" or Sound tag if mood is alert */}
        {mood === 'alert' && (
          <div className="absolute -top-3 -left-8 bg-[#f9bd22] text-[#1b1b20] border-2 border-[#1b1b20] font-comic font-black text-[9px] px-1.5 py-0.2 -rotate-12 ink-shadow-sm">
            ALERT!
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Animated Web Shoot transition across screen when pulling the next panel
 */
export const ComicWebPullEffect: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {/* Dynamic diagonal web line */}
      <div className="absolute w-[120%] h-3 bg-white border-y-2 border-[#1b1b20] shadow-[0_0_20px_#ffffff] -rotate-15 animate-ping" />
      <div className="absolute w-[120%] h-2 bg-white blur-xs rotate-25 animate-pulse" />

      {/* Floating sound effect burst */}
      <div className="bg-[#dc2626] text-white border-4 border-[#1b1b20] px-6 py-3 font-comic text-4xl sm:text-5xl font-black uppercase rotate-6 ink-shadow-xl animate-impact-pop">
        THWIP!!
      </div>
    </div>
  );
};
