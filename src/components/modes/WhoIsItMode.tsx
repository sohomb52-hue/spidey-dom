import React, { useState } from 'react';
import { RogueDossier } from '../../types';
import { LikeButton } from '../common/LikeButton';
import { playSound } from '../../utils/audio';
import { ComicImpactBurst, ComicPanelWebCorner } from '../ComicActionOverlay';

interface WhoIsItModeProps {
  dossier: RogueDossier;
  currentIndex: number;
  totalDossiers: number;
  onGuess: (suspectId: string) => void;
  onTriggerWeb: (e: React.MouseEvent) => void;
}

export const WhoIsItMode: React.FC<WhoIsItModeProps> = ({
  dossier,
  currentIndex,
  totalDossiers,
  onGuess,
  onTriggerWeb
}) => {
  const [activeGuess, setActiveGuess] = useState<{ id: string; isCorrect: boolean } | null>(null);
  const [impact, setImpact] = useState<{
    type: 'correct' | 'wrong' | null;
    text: string;
    subtext: string;
    points?: number;
  } | null>(null);

  const handleGuess = (id: string, e: React.MouseEvent) => {
    const isCorrect = id === dossier.id;
    setActiveGuess({ id, isCorrect });
    onTriggerWeb(e);

    if (isCorrect) {
      playSound('bam');
      setImpact({
        type: 'correct',
        text: 'BAM!',
        subtext: 'ROGUE CAPTURED!',
        points: 250
      });
    } else {
      playSound('wrong');
      setImpact({
        type: 'wrong',
        text: 'OOF!',
        subtext: 'INNOCENT ALIBI!',
        points: 0
      });
    }

    setTimeout(() => {
      setImpact(null);
      setActiveGuess(null);
      onGuess(id);
    }, 450);
  };

  return (
    <section className="space-y-4 preserve-3d">
      {impact && (
        <ComicImpactBurst
          type={impact.type}
          text={impact.text}
          subtext={impact.subtext}
          points={impact.points}
        />
      )}

      <div
        key={dossier.id}
        className="border-4 sm:border-6 border-[#1b1b20] bg-white p-4 sm:p-6 depth-shadow-comic animate-panel-enter animate-web-pull relative overflow-visible"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <ComicPanelWebCorner position="top-right" variant="web" />
        <ComicPanelWebCorner position="bottom-left" variant="badge" />

        <div className="flex flex-wrap items-center justify-between border-b-3 border-[#1b1b20] pb-3 mb-4 gap-2">
          <div>
            <span className="bg-[#b8121d] text-white font-comic text-xs font-black px-2 py-0.5 uppercase ink-shadow-sm">
              ROGUES GALLERY DOSSIER #{currentIndex + 1} OF {totalDossiers}
            </span>
            <h3 className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20] mt-1">
              WHO IS THIS MULTIVERSE ADVERSARY?
            </h3>
          </div>
          <span className="font-comic text-xs font-black bg-[#ffdf9f] px-2.5 py-1 border border-[#1b1b20] ink-shadow-sm">
            3 INK CLUES
          </span>
        </div>

        {/* Clues and Mugshot Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6 items-stretch preserve-3d">
          {/* Classified Dossier Suspect Shadow / Image Box */}
          <div
            className="lg:col-span-4 border-3 border-[#1b1b20] bg-[#1b1b20] p-3 text-white flex flex-col items-center justify-between depth-shadow-comic"
            style={{ transform: 'translateZ(10px)' }}
          >
            <span className="font-comic text-[10px] font-black uppercase tracking-wider bg-[#b8121d] text-white px-2 py-0.5 mb-2 border border-white/20">
              CLASSIFIED SURVEILLANCE PHOTO
            </span>
            <div className="relative w-full h-44 overflow-hidden border-2 border-white/30 bg-black depth-shadow-comic">
              <img
                src={dossier.image}
                alt="Classified suspect surveillance"
                className="w-full h-full object-cover filter contrast-125 saturate-50 hover:saturate-100 transition-all duration-300 hover:scale-105"
              />
              <div className="absolute top-2 left-2 bg-[#b8121d] text-white text-[9px] font-mono px-1 py-0.2 font-bold uppercase">
                SECURITY CAM #07
              </div>
            </div>
            {/* Like button below surveillance photo */}
            <div className="mt-2 w-full flex justify-center bg-white/10 p-1.5 border border-white/20">
              <LikeButton
                id={`rogue-dossier-${dossier.id}`}
                initialLikes={890}
                label="LIKE MUGSHOT"
                compact
              />
            </div>
          </div>

          {/* 3 Sequential Panels with Ink Reveals */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3 preserve-3d">
            {dossier.clues.map((clue, idx) => (
              <div
                key={idx}
                className="border-3 border-[#1b1b20] bg-[#f0ecf4] p-4 depth-shadow-comic relative flex flex-col justify-between animate-bubble-expand"
                style={{ transform: `translateZ(${12 + idx * 4}px)` }}
              >
                <div>
                  <span className="font-comic text-[10px] font-black bg-[#1b1b20] text-white px-1.5 py-0.5 uppercase block w-max mb-2">
                    CLUE #0{idx + 1}
                  </span>
                  <p className="font-comic text-xs sm:text-sm font-black text-[#1b1b20] uppercase leading-snug">
                    "{clue}"
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#1b1b20]/20 flex justify-end text-[10px] font-mono text-[#5b403d]">
                  ARCHIVE DOSSIER
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guess Options */}
        <div className="bg-[#eae7ee] border-3 border-[#1b1b20] p-4 depth-shadow-comic preserve-3d">
          <label className="font-comic text-xs sm:text-sm font-black text-[#1b1b20] uppercase block mb-2">
            IDENTITY SUSPECT SELECTION:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 preserve-3d">
            {dossier.options.map((opt) => {
              const isSelected = activeGuess?.id === opt.id;
              const isCorrect = activeGuess?.isCorrect;
              return (
                <button
                  key={opt.id}
                  onClick={(e) => handleGuess(opt.id, e)}
                  className={`border-3 border-[#1b1b20] p-3.5 font-comic text-sm sm:text-base font-black uppercase ink-btn text-center transition-all cursor-pointer depth-shadow-comic ${
                    isSelected
                      ? isCorrect
                        ? 'bg-[#22c55e] text-white animate-answer-forward ring-4 ring-[#22c55e]'
                        : 'bg-[#dc2626] text-white animate-answer-recoil ring-4 ring-[#1b1b20]'
                      : 'bg-white hover:bg-[#cce5ff] text-[#1b1b20]'
                  }`}
                  style={{ transform: isSelected ? undefined : 'translateZ(6px)' }}
                >
                  {opt.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
