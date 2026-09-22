import React, { useEffect, useState, useRef } from 'react';
import { SpeedQuestion } from '../../types';
import { playSound } from '../../utils/audio';
import { Zap } from 'lucide-react';
import { ComicImpactBurst, ComicPanelWebCorner } from '../ComicActionOverlay';

interface SpeedModeProps {
  question: SpeedQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (choiceIndex: number, timeLeft: number) => void;
  onTimeExpired: () => void;
  onTriggerWeb: (e: React.MouseEvent) => void;
}

export const SpeedMode: React.FC<SpeedModeProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onTimeExpired,
  onTriggerWeb
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(10.0);
  const timerRef = useRef<number | null>(null);

  const [selectedIdx, setSelectedIdx] = useState<{ index: number; isCorrect: boolean } | null>(null);
  const [impact, setImpact] = useState<{
    type: 'correct' | 'wrong' | null;
    text: string;
    subtext: string;
    points?: number;
  } | null>(null);

  useEffect(() => {
    setTimeLeft(10.0);
    setSelectedIdx(null);
    setImpact(null);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.15) {
          if (timerRef.current) clearInterval(timerRef.current);
          onTimeExpired();
          return 0.0;
        }
        const next = Math.max(0, prev - 0.1);
        if (Math.round(next * 10) % 10 === 0 && next <= 3) {
          playSound('tick');
        }
        return parseFloat(next.toFixed(1));
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question, onTimeExpired]);

  const handleChoose = (idx: number, e: React.MouseEvent) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const isCorrect = idx === question.correctIndex;
    setSelectedIdx({ index: idx, isCorrect });
    onTriggerWeb(e);

    if (isCorrect) {
      playSound('bam');
      setImpact({
        type: 'correct',
        text: 'THWIP!',
        subtext: 'REFLEX RECORD!',
        points: Math.round(100 + timeLeft * 20)
      });
    } else {
      playSound('wrong');
      setImpact({
        type: 'wrong',
        text: 'WHAM!',
        subtext: 'OUTPACED!',
        points: 0
      });
    }

    setTimeout(() => {
      setImpact(null);
      setSelectedIdx(null);
      onAnswer(idx, timeLeft);
    }, 450);
  };

  const percent = (timeLeft / 10.0) * 100;

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
        className="border-4 sm:border-6 border-[#1b1b20] bg-white p-4 sm:p-6 depth-shadow-comic relative overflow-visible animate-panel-enter animate-web-pull"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <ComicPanelWebCorner position="top-right" variant="web" />
        <ComicPanelWebCorner position="bottom-left" variant="badge" />

        <div className="flex flex-wrap items-center justify-between border-b-3 border-[#1b1b20] pb-3 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Zap className="text-[#b8121d] w-6 h-6 fill-[#b8121d]" />
            <h3 className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20]">
              SPIDER-SENSE TIMED CHALLENGE #{currentIndex + 1}
            </h3>
          </div>
          <div className="bg-[#b8121d] text-white px-3 py-1 font-comic text-base sm:text-lg font-black border-2 border-[#1b1b20] ink-shadow-sm">
            <span>{timeLeft.toFixed(1)}</span>s
          </div>
        </div>

        {/* Animated Progress Meter for Timer */}
        <div className="w-full bg-[#eae7ee] border-3 border-[#1b1b20] h-6 p-0.5 ink-shadow-sm mb-6">
          <div
            className="h-full bg-gradient-to-r from-[#f9bd22] via-[#b8121d] to-[#dc3132] transition-all duration-100"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Question Prompt */}
        <div
          className="bg-[#ffdf9f] border-3 sm:border-4 border-[#1b1b20] p-4 sm:p-6 text-center depth-shadow-floating mb-6 -rotate-0.5 animate-bubble-expand relative"
          style={{ transform: 'translateZ(14px)' }}
        >
          <span className="font-comic text-[11px] font-black text-[#765700] uppercase tracking-wider">
            RAPID-FIRE REFLEX:
          </span>
          <h4 className="font-comic text-xl sm:text-2xl md:text-3xl font-black uppercase text-[#1b1b20] mt-2">
            "{question.prompt}"
          </h4>
        </div>

        {/* 3 Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 preserve-3d">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIdx?.index === idx;
            const isCorrect = selectedIdx?.isCorrect;
            return (
              <button
                key={idx}
                onClick={(e) => handleChoose(idx, e)}
                className={`border-3 border-[#1b1b20] py-4 px-4 font-comic text-sm sm:text-base font-black uppercase ink-btn text-center transition-all cursor-pointer depth-shadow-comic ${
                  isSelected
                    ? isCorrect
                      ? 'bg-[#22c55e] text-white animate-answer-forward ring-4 ring-[#22c55e]'
                      : 'bg-[#dc2626] text-white animate-answer-recoil ring-4 ring-[#1b1b20]'
                    : 'bg-white hover:bg-[#cce5ff] text-[#1b1b20]'
                }`}
                style={{ transform: isSelected ? undefined : 'translateZ(6px)' }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
