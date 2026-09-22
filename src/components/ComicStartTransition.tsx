/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { playSound } from '../utils/audio';
import { Radio, Zap } from 'lucide-react';

interface ComicStartTransitionProps {
  onComplete: () => void;
  gameTitle?: string;
}

export const ComicStartTransition: React.FC<ComicStartTransitionProps> = ({
  onComplete,
  gameTitle = 'TRIVIA CHALLENGE'
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    playSound('thwip');

    const t1 = setTimeout(() => {
      setStep(2);
      playSound('click');
    }, 180);

    const t2 = setTimeout(() => {
      setStep(3);
      playSound('spider-sense');
    }, 380);

    const t3 = setTimeout(() => {
      setStep(4);
      playSound('bam');
    }, 580);

    const t4 = setTimeout(() => {
      onComplete();
    }, 780);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#1b1b20]/90 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden">
      {/* Speed lines backdrop */}
      <div className="comic-speed-lines absolute inset-0 opacity-40 pointer-events-none" />

      <div className="relative max-w-lg w-full">
        {/* PANEL 01: Top left entrance */}
        {step >= 1 && (
          <div
            className={`transition-all duration-200 bg-[#fff0f0] border-4 border-[#1b1b20] p-3 mb-2 ink-shadow-md -rotate-1 ${
              step === 1 ? 'scale-105 translate-y-0' : 'opacity-80'
            }`}
          >
            <span className="bg-[#dc2626] text-white font-comic text-[10px] font-black px-1.5 py-0.5 uppercase">
              PANEL 01
            </span>
            <p className="font-comic text-xs font-black text-[#1b1b20] uppercase mt-1">
              "THE MULTIVERSE THREAT EMERGES ACROSS THE TIMELINES..."
            </p>
          </div>
        )}

        {/* PANEL 02: Middle right entrance */}
        {step >= 2 && (
          <div
            className={`transition-all duration-200 bg-[#ffdf9f] border-4 border-[#1b1b20] p-3 mb-2 ink-shadow-md rotate-1.5 ${
              step === 2 ? 'scale-105 translate-x-2' : 'opacity-80'
            }`}
          >
            <span className="bg-[#006398] text-white font-comic text-[10px] font-black px-1.5 py-0.5 uppercase">
              PANEL 02
            </span>
            <p className="font-comic text-xs font-black text-[#261a00] uppercase mt-1">
              "PETER PARKER READIES HIS WEB-SHOOTERS FOR {gameTitle}!"
            </p>
          </div>
        )}

        {/* PANEL 03: Big slamming center climax */}
        {step >= 3 && (
          <div
            className={`bg-[#dc2626] border-4 sm:border-6 border-[#1b1b20] p-6 text-white ink-shadow-xl text-center transform -rotate-1 transition-all duration-200 ${
              step === 4 ? 'scale-110 shake-comic' : 'scale-100'
            }`}
          >
            <div className="inline-flex items-center gap-1.5 bg-[#1b1b20] text-[#f9bd22] font-comic text-xs font-black px-3 py-1 uppercase mb-2 border border-white">
              <Radio className="w-3.5 h-3.5 animate-spin" />
              PANEL 03: CLIMAX
            </div>

            <h3 className="font-comic text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white leading-tight drop-shadow-[2px_2px_0_#1b1b20]">
              YOUR SPIDER-SENSE HAS BEEN ACTIVATED!
            </h3>

            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="bg-[#f9bd22] text-[#1b1b20] font-comic text-sm font-black px-3 py-1 border-2 border-[#1b1b20]">
                ⚡ BAM!
              </span>
              <span className="bg-white text-[#dc2626] font-comic text-sm font-black px-3 py-1 border-2 border-[#1b1b20]">
                🕸️ SLAM INTO ACTION!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
