import React from 'react';
import { GameMode } from '../types';
import { playSound } from '../utils/audio';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface ComicPageNavProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onTriggerWeb: (e: React.MouseEvent) => void;
}

const ORDERED_MODES: { id: GameMode; label: string; issue: string }[] = [
  { id: 'tf', label: 'FACT ATTACK (TRUE/FALSE)', issue: 'PANEL #01 / 07' },
  { id: 'mcq', label: 'WEB OF KNOWLEDGE', issue: 'PANEL #02 / 07' },
  { id: 'clues', label: 'WHO IS IT? (ROGUES)', issue: 'PANEL #03 / 07' },
  { id: 'who_said_it', label: 'WHO SAID IT? (QUOTES)', issue: 'PANEL #04 / 07' },
  { id: 'speed', label: 'SPIDER-SENSE SPEED', issue: 'PANEL #05 / 07' },
  { id: 'canon', label: 'COMIC CANON ARCHIVES', issue: 'PANEL #06 / 07' },
  { id: 'badges', label: 'MULTIVERSE VAULT', issue: 'PANEL #07 / 07' },
  { id: 'profile', label: 'PLAYER DOSSIER', issue: 'BACK COVER' }
];

export const ComicPageNav: React.FC<ComicPageNavProps> = ({
  currentMode,
  onSelectMode,
  onTriggerWeb
}) => {
  const currentIndex = ORDERED_MODES.findIndex((m) => m.id === currentMode);
  const activeMode = ORDERED_MODES[currentIndex] || ORDERED_MODES[0];

  const handlePrev = (e: React.MouseEvent) => {
    playSound('thwip');
    onTriggerWeb(e);
    const prevIdx = (currentIndex - 1 + ORDERED_MODES.length) % ORDERED_MODES.length;
    onSelectMode(ORDERED_MODES[prevIdx].id);
  };

  const handleNext = (e: React.MouseEvent) => {
    playSound('thwip');
    onTriggerWeb(e);
    const nextIdx = (currentIndex + 1) % ORDERED_MODES.length;
    onSelectMode(ORDERED_MODES[nextIdx].id);
  };

  return (
    <nav aria-label="Comic Panel Flip Navigation" className="relative my-4 border-4 border-[#1b1b20] bg-white p-2.5 ink-shadow-md flex flex-wrap items-center justify-between gap-3 overflow-hidden">
      {/* Interactive Folded Comic Page Corner */}
      <div
        onClick={handleNext}
        title="Flip to next comic panel!"
        className="absolute top-0 right-0 w-8 h-8 cursor-pointer z-20 group"
      >
        <div className="w-0 h-0 border-t-[32px] border-t-[#f9bd22] border-l-[32px] border-l-transparent drop-shadow-xs group-hover:scale-110 transition-transform" />
        <span className="absolute top-0.5 right-1 text-[8px] font-comic font-black text-[#1b1b20]">
          FLIP
        </span>
      </div>

      {/* Prev Panel Button */}
      <button
        type="button"
        onClick={handlePrev}
        className="bg-[#eae7ee] hover:bg-[#cce5ff] text-[#1b1b20] border-2 border-[#1b1b20] px-3 py-1.5 font-comic text-xs font-black uppercase flex items-center gap-1.5 ink-btn ink-shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>← PREVIOUS PANEL</span>
      </button>

      {/* Active Panel Issue Indicator */}
      <div className="text-center flex flex-col items-center">
        <span className="font-comic text-[11px] font-black text-[#b8121d] uppercase tracking-wider flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" /> {activeMode.issue}
        </span>
        <span className="font-comic text-xs sm:text-sm font-black text-[#1b1b20] uppercase">
          {activeMode.label}
        </span>
      </div>

      {/* Next Panel Button */}
      <button
        type="button"
        onClick={handleNext}
        className="bg-[#b8121d] hover:bg-[#dc3132] text-white border-2 border-[#1b1b20] px-3.5 py-1.5 font-comic text-xs font-black uppercase flex items-center gap-1.5 ink-btn ink-shadow-sm"
      >
        <span>NEXT PANEL →</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};
