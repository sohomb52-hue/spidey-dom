import React from 'react';
import { GameMode } from '../types';

interface ComicFooterProps {
  onSelectMode: (mode: GameMode) => void;
  onToggleSFX: () => void;
}

export const ComicFooter: React.FC<ComicFooterProps> = ({ onSelectMode, onToggleSFX }) => {
  return (
    <footer className="w-full py-8 sm:py-12 px-4 sm:px-8 flex flex-col items-center justify-center gap-6 border-t-4 border-[#1b1b20] bg-[#1b1b20] text-[#ffdf9f]">
      {/* Footer Brand Title */}
      <div className="text-center">
        <h2 className="font-comic text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-[#dc3132] leading-none">
          SPIDER-VERSE: FACT ATTACK
        </h2>
        <p className="text-xs sm:text-sm text-[#f0ecf4] font-semibold mt-1 tracking-wider uppercase">
          THE DEFINITIVE WEB-SLINGER MULTIVERSE INTERACTIVE COMPENDIUM
        </p>
      </div>

      {/* Navigation / Archives Links */}
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-comic text-xs font-black uppercase tracking-wider">
        <button
          onClick={() => onSelectMode('canon')}
          className="text-[#f0ecf4] hover:text-white transition-colors duration-150"
        >
          Comic Canon Archives
        </button>
        <button
          onClick={onToggleSFX}
          className="text-[#f0ecf4] hover:text-white transition-colors duration-150"
        >
          Soundtrack & SFX
        </button>
        <button
          onClick={() => onSelectMode('badges')}
          className="text-[#f0ecf4] hover:text-white transition-colors duration-150"
        >
          Multiverse Badges
        </button>
        <button
          onClick={() => onSelectMode('tf')}
          className="text-[#f0ecf4] hover:text-white transition-colors duration-150"
        >
          Hall of Fame
        </button>
        <span className="text-[#dcd9e0]/60">Privacy & Disclaimer</span>
      </nav>

      {/* Vintage Comics Code Stamp & Copyright */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center border-t border-[#dcd9e0]/20 pt-4 w-full max-w-4xl justify-between">
        <p className="text-xs text-[#f0ecf4]/80">
          © 1962-2024 MARVEL TRIBUTE MULTIVERSE TRIVIA. APPROVED BY THE COMICS CODE AUTHORITY.
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-[#ffdf9f] font-bold">
          <span>EXCELSIOR!</span>
          <span>•</span>
          <span>WITH GREAT POWER COMES GREAT TRIVIA!</span>
        </div>
      </div>
    </footer>
  );
};
