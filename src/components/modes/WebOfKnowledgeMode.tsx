import React, { useState } from 'react';
import { MCQQuestion } from '../../types';
import { playSound } from '../../utils/audio';
import { ComicImpactBurst, ComicPanelWebCorner, ComicPanelForegroundPerch } from '../ComicActionOverlay';

interface WebOfKnowledgeModeProps {
  question: MCQQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (index: number) => void;
  onTriggerWeb: (e: React.MouseEvent) => void;
}

export const WebOfKnowledgeMode: React.FC<WebOfKnowledgeModeProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onTriggerWeb
}) => {
  const letters = ['A', 'B', 'C', 'D'];
  const [selectedIdx, setSelectedIdx] = useState<{ index: number; isCorrect: boolean } | null>(null);
  const [impact, setImpact] = useState<{
    type: 'correct' | 'wrong' | null;
    text: string;
    subtext: string;
    points?: number;
  } | null>(null);

  const handleClick = (idx: number, e: React.MouseEvent) => {
    if (selectedIdx !== null) return;
    const isCorrect = idx === question.correctIndex;
    setSelectedIdx({ index: idx, isCorrect });
    onTriggerWeb(e);

    if (isCorrect) {
      playSound('bam');
      setImpact({
        type: 'correct',
        text: 'BAM!',
        subtext: 'LORE MASTER!',
        points: 300
      });
    } else {
      playSound('wrong');
      setImpact({
        type: 'wrong',
        text: 'OOF!',
        subtext: 'ARCHIVE MISMATCH!',
        points: 0
      });
    }

    // Cinematic Pause for Comic Impact
    setTimeout(() => {
      setImpact(null);
      setSelectedIdx(null);
      onAnswer(idx);
    }, 450);
  };

  return (
    <section className="space-y-4 preserve-3d" aria-label="Web of Knowledge Challenge">
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
        className="border-4 sm:border-6 border-[#1b1b20] bg-white p-4 sm:p-6 depth-shadow-comic relative overflow-visible animate-panel-enter animate-web-pull"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Layered Foreground Element */}
        <ComicPanelForegroundPerch
          senseActive={currentIndex % 2 === 1}
          mood={selectedIdx ? (selectedIdx.isCorrect ? 'victory' : 'warning') : 'curious'}
        />
        <ComicPanelWebCorner position="top-right" variant="web" />
        <ComicPanelWebCorner position="bottom-left" variant="badge" />

        <div className="bg-[#006398] text-white border-b-3 border-r-3 border-[#1b1b20] absolute top-0 left-0 px-4 py-1 font-comic text-xs font-black uppercase ink-shadow-sm z-10">
          PANEL 02: THE DAILY BUGLE QUESTIONNAIRE
        </div>

        <div className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-comic text-[11px] font-black text-[#006398] uppercase bg-[#cce5ff] px-2 py-0.5 border border-[#1b1b20] ink-shadow-sm">
              QUESTION #{currentIndex + 1} OF {totalQuestions}
            </span>
          </div>

          <div
            className="bg-[#ffdf9f] border-3 sm:border-4 border-[#1b1b20] p-4 sm:p-5 mb-6 depth-shadow-comic -rotate-0.5 animate-bubble-expand relative"
            style={{ transform: 'translateZ(12px)' }}
          >
            <span className="font-comic text-[11px] font-black text-[#765700] uppercase block">
              {question.archiveRef}:
            </span>
            <h3 className="font-comic text-lg sm:text-xl md:text-2xl font-black uppercase text-[#1b1b20] leading-tight mt-1">
              "{question.question}"
            </h3>
          </div>

          {/* 4 Grid Options with Comic Letter Labels & 3D forward/recoil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 preserve-3d">
            {question.options.map((opt, idx) => {
              const isChosen = selectedIdx?.index === idx;
              const isCorrect = selectedIdx?.isCorrect;
              return (
                <button
                  key={idx}
                  onClick={(e) => handleClick(idx, e)}
                  className={`border-3 border-[#1b1b20] p-4 text-left depth-shadow-comic transition-all ink-btn flex items-center gap-3 cursor-pointer ${
                    isChosen
                      ? isCorrect
                        ? 'bg-[#22c55e] text-white animate-answer-forward ring-4 ring-[#22c55e]'
                        : 'bg-[#dc2626] text-white animate-answer-recoil ring-4 ring-[#1b1b20]'
                      : 'bg-[#f0ecf4] hover:bg-[#cce5ff] text-[#1b1b20]'
                  }`}
                  style={{ transform: isChosen ? undefined : 'translateZ(6px)' }}
                >
                  <span className={`w-8 h-8 rounded-none flex items-center justify-center font-comic font-black text-sm flex-shrink-0 border border-[#1b1b20] ${
                    isChosen ? 'bg-white text-[#1b1b20]' : 'bg-[#1b1b20] text-white'
                  }`}>
                    {letters[idx]}
                  </span>
                  <span className="font-comic text-sm sm:text-base font-black uppercase leading-snug">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
