import React, { useState } from 'react';
import { WhoSaidItQuestion } from '../../types';
import { LikeButton } from '../common/LikeButton';
import { Quote, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';
import { ComicImpactBurst, ComicPanelWebCorner } from '../ComicActionOverlay';

interface WhoSaidItModeProps {
  question: WhoSaidItQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (choiceIndex: number) => void;
  onTriggerWeb: (e: React.MouseEvent) => void;
}

export const WhoSaidItMode: React.FC<WhoSaidItModeProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onTriggerWeb
}) => {
  const [selectedIdx, setSelectedIdx] = useState<{ index: number; isCorrect: boolean } | null>(null);
  const [impact, setImpact] = useState<{
    type: 'correct' | 'wrong' | null;
    text: string;
    subtext: string;
    points?: number;
  } | null>(null);

  const handleSelect = (idx: number, e: React.MouseEvent) => {
    const isCorrect = idx === question.correctIndex;
    setSelectedIdx({ index: idx, isCorrect });
    onTriggerWeb(e);

    if (isCorrect) {
      playSound('bam');
      setImpact({
        type: 'correct',
        text: 'POW!',
        subtext: 'CHARACTER IDENTIFIED!',
        points: 200
      });
    } else {
      playSound('wrong');
      setImpact({
        type: 'wrong',
        text: 'OOF!',
        subtext: 'WRONG MOUTH!',
        points: 0
      });
    }

    setTimeout(() => {
      setImpact(null);
      setSelectedIdx(null);
      onAnswer(idx);
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
        key={question.id}
        className="border-4 sm:border-6 border-[#1b1b20] bg-white p-4 sm:p-6 depth-shadow-comic animate-panel-enter animate-web-pull relative overflow-visible"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <ComicPanelWebCorner position="top-right" variant="web" />
        <ComicPanelWebCorner position="bottom-left" variant="badge" />

        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b-3 border-[#1b1b20] pb-3 mb-5 gap-2">
          <div>
            <span className="bg-[#b8121d] text-white font-comic text-xs font-black px-2 py-0.5 uppercase ink-shadow-sm">
              QUOTE CHALLENGE #{currentIndex + 1} OF {totalQuestions}
            </span>
            <h3 className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20] mt-1">
              WHO SPOKE THESE WORDS IN CANON?
            </h3>
          </div>
          <span className="bg-[#ffdf9f] px-2.5 py-1 font-comic text-xs font-black border border-[#1b1b20] ink-shadow-sm">
            {question.issueRef}
          </span>
        </div>

        {/* Comic Dialogue & Speaker Illustration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-6 items-center preserve-3d">
          {/* Character Comic Portrait Box */}
          <div
            className="md:col-span-4 border-3 border-[#1b1b20] bg-[#eae7ee] p-3 depth-shadow-comic flex flex-col items-center"
            style={{ transform: 'translateZ(10px)' }}
          >
            <span className="font-comic text-[10px] font-black uppercase tracking-wider text-[#5b403d] mb-1">
              MYSTERY SPEAKER ARCHIVE
            </span>
            <div className="w-full h-44 border-2 border-[#1b1b20] overflow-hidden bg-black relative depth-shadow-comic">
              <img
                src={question.characterImage}
                alt="Mystery Speaker Artwork"
                className="w-full h-full object-cover filter contrast-110 saturate-90 hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 comic-halftone pointer-events-none" />
            </div>

            {/* Like Button directly below speaker portrait */}
            <div className="mt-2 pt-2 border-t border-[#1b1b20]/20 w-full flex justify-center bg-white/60 p-1">
              <LikeButton
                id={`who-said-it-img-${question.id}`}
                initialLikes={720 + question.id * 85}
                label="LIKE PORTRAIT"
                compact
              />
            </div>
          </div>

          {/* Speech Bubble with Comic Dialogue */}
          <div
            className="md:col-span-8 bg-[#ffdf9f] border-4 border-[#1b1b20] p-5 sm:p-6 depth-shadow-floating relative bubble-bottom -rotate-0.5 animate-bubble-expand"
            style={{ transform: 'translateZ(18px)' }}
          >
            <Quote className="w-8 h-8 text-[#765700] mb-2 opacity-50" />
            <h4 className="font-comic text-xl sm:text-2xl md:text-3xl font-black uppercase text-[#1b1b20] leading-snug">
              "{question.quote}"
            </h4>
            <div className="mt-3 pt-2 border-t border-[#765700]/30 flex items-center justify-between text-xs font-comic font-black text-[#765700]">
              <span>SPEECH BALLOON ARCHIVE</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> CANON DIALOGUE
              </span>
            </div>
          </div>
        </div>

        {/* 4 Comic Panel Options */}
        <div className="bg-[#f0ecf4] border-3 border-[#1b1b20] p-4 depth-shadow-comic preserve-3d">
          <label className="font-comic text-xs sm:text-sm font-black text-[#1b1b20] uppercase block mb-3">
            SELECT THE CANONICAL SPEAKER:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 preserve-3d">
            {question.options.map((opt, idx) => {
              const isSelected = selectedIdx?.index === idx;
              const isCorrect = selectedIdx?.isCorrect;
              return (
                <button
                  key={idx}
                  onClick={(e) => handleSelect(idx, e)}
                  className={`border-3 border-[#1b1b20] p-3.5 text-left font-comic text-sm sm:text-base font-black uppercase ink-btn transition-all flex items-center gap-3 cursor-pointer depth-shadow-comic ${
                    isSelected
                      ? isCorrect
                        ? 'bg-[#22c55e] text-white animate-answer-forward ring-4 ring-[#22c55e]'
                        : 'bg-[#dc2626] text-white animate-answer-recoil ring-4 ring-[#1b1b20]'
                      : 'bg-white hover:bg-[#cce5ff] text-[#1b1b20]'
                  }`}
                  style={{ transform: isSelected ? undefined : 'translateZ(6px)' }}
                >
                  <span className={`w-7 h-7 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 border border-[#1b1b20] ${
                    isSelected ? 'bg-white text-[#1b1b20]' : 'bg-[#1b1b20] text-white'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-tight">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
