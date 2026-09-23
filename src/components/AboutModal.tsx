import React from 'react';
import { X, BookOpen, Award, Sparkles, Shield, Heart } from 'lucide-react';
import { ComicsCodeSeal } from './icons/SpiderVerseBadges';
import { playSound } from '../utils/audio';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplayIntro?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onReplayIntro
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#1b1b20]/80 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="comic-halftone absolute inset-0 pointer-events-none" />

      <div className="relative bg-[#fffbf0] border-4 sm:border-6 border-[#1b1b20] max-w-2xl w-full p-5 sm:p-7 ink-shadow-red-multi z-10 max-h-[90vh] overflow-y-auto">
        {/* Top Header Banner */}
        <div className="flex items-center justify-between border-b-4 border-[#1b1b20] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <ComicsCodeSeal className="w-8 h-10 flex-shrink-0" />
            <div>
              <span className="bg-[#dc2626] text-white font-comic text-[10px] font-black px-2 py-0.5 uppercase border border-[#1b1b20]">
                ORIGIN STORY & CREDITS
              </span>
              <h2
                id="about-modal-title"
                className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20] leading-none mt-1"
              >
                ABOUT SPIDER-VERSE: FACT ATTACK
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-8 h-8 bg-[#eae7ee] hover:bg-[#dc2626] hover:text-white border-2 border-[#1b1b20] flex items-center justify-center font-black text-[#1b1b20] transition-colors ink-btn cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Narrative Stan Lee Homage Box */}
        <div className="bg-[#ffdf9f] border-3 border-[#1b1b20] p-4 mb-4 bubble-bottom ink-shadow-sm">
          <span className="font-comic text-[10px] sm:text-[11px] font-black text-[#765700] uppercase block">
            STAN LEE & STEVE DITKO TRIBUTE • ISSUE #1962
          </span>
          <p className="font-comic text-sm sm:text-base font-black text-[#1b1b20] uppercase leading-tight mt-1">
            "THAT PERSON WHO HELPS OTHERS SIMPLY BECAUSE IT SHOULD OR MUST BE DONE, AND BECAUSE IT IS THE RIGHT THING TO DO, IS INDEED WITHOUT A DOUBT, A REAL SUPERHERO!"
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-white border-2 border-[#1b1b20] p-3 ink-shadow-sm">
            <div className="flex items-center gap-1.5 text-[#dc2626] mb-1">
              <Award className="w-4 h-4" />
              <span className="font-comic text-xs font-black uppercase">100% CANON</span>
            </div>
            <p className="text-xs text-[#5b403d] font-semibold leading-relaxed">
              Researched directly from Amazing Fantasy #15 through Edge of Spider-Verse and modern crossover lore.
            </p>
          </div>

          <div className="bg-white border-2 border-[#1b1b20] p-3 ink-shadow-sm">
            <div className="flex items-center gap-1.5 text-[#006398] mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="font-comic text-xs font-black uppercase">6 MINI-GAMES</span>
            </div>
            <p className="text-xs text-[#5b403d] font-semibold leading-relaxed">
              3D Web Thrower, Ident-a-Spidey, Rogue Dossiers, Quote Detectives, and Speed Reflexes.
            </p>
          </div>

          <div className="bg-white border-2 border-[#1b1b20] p-3 ink-shadow-sm">
            <div className="flex items-center gap-1.5 text-[#22c55e] mb-1">
              <Shield className="w-4 h-4" />
              <span className="font-comic text-xs font-black uppercase">COMICS CODE</span>
            </div>
            <p className="text-xs text-[#5b403d] font-semibold leading-relaxed">
              Crafted with authentic hand-inked borders, halftone Ben-Day dots, sound typography, and classic Marvel aesthetic.
            </p>
          </div>
        </div>

        {/* Lore & Instructions */}
        <div className="bg-[#f0ecf4]/80 border-3 border-[#1b1b20] p-4 mb-5 text-xs sm:text-sm text-[#1b1b20] font-semibold space-y-2">
          <p>
            Welcome to the definitive Spider-Man Multiverse interactive trivia experience! Test your knowledge across Earth-616, Earth-65 (Spider-Gwen), Earth-1610 (Miles Morales), Earth-928 (Spider-Man 2099), Earth-90214 (Spider-Man Noir), and beyond.
          </p>
          <p>
            Earn score combos, unlock collectible Multiverse Badges, explore the verified Comic Canon Archives, and test your web-slinging aim on the rooftop water towers.
          </p>
        </div>

        {/* Creator Section Badge */}
        <div className="bg-[#0c0d14] text-[#fffbf0] border-3 border-[#1b1b20] p-4 mb-5 ink-shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-comic text-[10px] font-black uppercase tracking-wider text-[#ffdf9f] bg-[#dc2626] px-2 py-0.5 border border-[#1b1b20] inline-block mb-1">
                BEHIND THE MASK • CREATOR
              </span>
              <h3 className="font-comic text-xl sm:text-2xl font-black uppercase text-white tracking-wide leading-none">
                SOHOM BANERJEE
              </h3>
              <p className="font-comic text-xs text-[#ffdf9f] uppercase tracking-wide mt-1">
                Built with curiosity. Powered by the Spider-Sense.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://github.com/sohomb52-hue"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('thwip')}
                aria-label="Visit Sohom Banerjee's GitHub profile github.com/sohomb52-hue (opens in a new tab)"
                className="bg-[#1b1b20] hover:bg-[#2b2d3e] text-white border border-[#f9bd22]/60 hover:border-[#f9bd22] px-3 py-2 text-xs font-comic font-black uppercase flex items-center gap-1.5 transition-colors ink-btn"
              >
                <span>&lt;/&gt; GITHUB</span>
              </a>
              <a
                href="https://www.instagram.com/spideyinthehouse_x?stkn=MXFvZjIxNzFuYXRvYw=="
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('thwip')}
                aria-label="Follow Sohom Banerjee on Instagram @spideyinthehouse_x (opens in a new tab)"
                className="bg-[#1b1b20] hover:bg-[#2b2d3e] text-white border border-[#dc2626]/60 hover:border-[#dc2626] px-3 py-2 text-xs font-comic font-black uppercase flex items-center gap-1.5 transition-colors ink-btn"
              >
                <span>◎ INSTAGRAM</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-3 border-[#1b1b20]">
          {onReplayIntro && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onReplayIntro();
              }}
              className="bg-[#f9bd22] hover:bg-[#e0a618] text-[#1b1b20] font-comic text-xs font-black px-4 py-2 border-2 border-[#1b1b20] uppercase ink-btn cursor-pointer flex items-center gap-1.5"
            >
              <span>🎬 WATCH CINEMATIC INTRO</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="ml-auto bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-xs sm:text-sm font-black px-5 py-2 border-2 border-[#1b1b20] uppercase ink-btn ink-shadow-sm cursor-pointer"
          >
            EXCELSIOR! CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
