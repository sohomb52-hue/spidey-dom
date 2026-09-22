import React, { useState } from 'react';
import { SpiderSenseRadarBadge, SpiderBotGuide, SpideyWithMic } from './icons/SpiderVerseBadges';
import { spideyQuotes } from '../data/triviaData';
import { playSound } from '../utils/audio';
import { X, Sparkles } from 'lucide-react';

interface SpideyTipDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const SpideyTipDrawer: React.FC<SpideyTipDrawerProps> = ({
  isOpen,
  onClose,
  onOpen
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const nextTip = () => {
    playSound('thwip');
    setQuoteIndex((prev) => (prev + 1) % spideyQuotes.length);
  };

  return (
    <>
      {/* Floating Bottom-Right Pill from Image 11 */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => {
            playSound('click');
            onOpen();
          }}
          className="bg-white border-3 border-[#1b1b20] p-1.5 pr-3 rounded-full ink-shadow-md flex items-center gap-2 hover:bg-[#ffdf9f] transition-all ink-btn"
          title="Open Spidey's Multiverse Lore Tips"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <SpiderSenseRadarBadge className="w-8 h-8" />
          </div>
          <div className="text-left">
            <div className="font-comic text-[9px] font-black text-[#b8121d] uppercase leading-none">
              SPIDEY'S MULTIVERSE TIP:
            </div>
            <div className="font-comic text-[11px] font-black text-[#1b1b20] uppercase leading-tight">
              "CLICK ME FOR LORE TIPS!"
            </div>
          </div>
        </button>
      </div>

      {/* Modal / Overlay when opened */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1b20]/60 backdrop-blur-xs">
          <div className="relative bg-white border-4 border-[#1b1b20] max-w-md w-full p-5 ink-shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b-3 border-[#1b1b20] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <SpiderBotGuide className="w-7 h-7" />
                <h3 className="font-comic text-base sm:text-lg font-black uppercase text-[#1b1b20]">
                  SPIDEY'S MULTIVERSE BROADCAST
                </h3>
              </div>
              <button
                onClick={() => {
                  playSound('click');
                  onClose();
                }}
                className="w-7 h-7 bg-[#eae7ee] border-2 border-[#1b1b20] flex items-center justify-center font-black hover:bg-[#b8121d] hover:text-white transition-colors ink-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center my-3">
              <SpideyWithMic className="w-32 h-32" text='"WEBHEAD RADIO!"' />
              <div className="bg-[#ffdf9f] border-3 border-[#1b1b20] p-4 mt-3 w-full ink-shadow-sm relative bubble-bottom">
                <p className="font-comic text-sm sm:text-base font-black text-[#1b1b20] uppercase leading-snug">
                  "{spideyQuotes[quoteIndex]}"
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-3 border-t-2 border-[#1b1b20]">
              <span className="text-xs font-comic font-black text-[#5b403d]">
                TIP #{quoteIndex + 1} OF {spideyQuotes.length}
              </span>
              <button
                onClick={nextTip}
                className="bg-[#b8121d] text-white py-2 px-4 border-2 border-[#1b1b20] font-comic text-xs font-black uppercase ink-shadow-sm hover:bg-[#991b1b] ink-btn flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ANOTHER SPIDEY GEM!</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
