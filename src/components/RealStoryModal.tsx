import React from 'react';
import { ArrowRight, X } from 'lucide-react';
import { playSound } from '../utils/audio';

interface RealStoryModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  badgeText: string;
  scoreText: string;
  title: string;
  body: string;
  onNext: () => void;
  onClose: () => void;
}

export const RealStoryModal: React.FC<RealStoryModalProps> = ({
  isOpen,
  isCorrect,
  badgeText,
  scoreText,
  title,
  body,
  onNext,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1b20]/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="comic-halftone absolute inset-0 pointer-events-none" />
      <div className="relative bg-white border-4 border-[#1b1b20] max-w-xl w-full p-4 sm:p-6 ink-shadow-xl z-10">
        {/* Header Banner */}
        <div className="flex items-start justify-between border-b-4 border-[#1b1b20] pb-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-white font-comic text-xs sm:text-sm font-black px-2.5 py-1 uppercase border-2 border-[#1b1b20] ${
                isCorrect ? 'bg-[#b8121d]' : 'bg-[#006398]'
              }`}
            >
              {badgeText}
            </span>
            <span className="text-[#006398] font-comic text-base sm:text-lg font-black">
              {scoreText}
            </span>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-8 h-8 bg-[#eae7ee] border-2 border-[#1b1b20] flex items-center justify-center font-black text-[#1b1b20] hover:bg-[#b8121d] hover:text-white transition-colors ink-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comic Did You Know Speech Bubble */}
        <div className="bg-[#ffdf9f] border-3 border-[#1b1b20] p-4 mb-4 relative bubble-bottom ink-shadow-sm">
          <span className="font-comic text-[10px] sm:text-[11px] font-black text-[#765700] uppercase block">
            DID YOU KNOW? COMIC HISTORY ARCHIVE:
          </span>
          <p className="font-comic text-base sm:text-lg font-black text-[#1b1b20] uppercase leading-tight mt-1">
            "{title}"
          </p>
        </div>

        {/* Canonical Comic Explanations */}
        <div className="bg-[#f0ecf4]/60 border-3 border-[#1b1b20] p-4 mb-6">
          <p className="text-sm sm:text-base text-[#1b1b20] font-semibold leading-relaxed">
            {body}
          </p>
        </div>

        {/* Next Panel Action Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              playSound('click');
              onNext();
            }}
            className="bg-[#b8121d] text-white py-3 px-6 border-3 border-[#1b1b20] ink-shadow-md font-comic text-sm sm:text-base font-black uppercase hover:-translate-x-0.5 hover:-translate-y-0.5 ink-btn flex items-center gap-2"
          >
            <span>NEXT PANEL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
