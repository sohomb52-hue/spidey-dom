import React, { useState, useEffect } from 'react';
import { TFQuestion } from '../../types';
import { SpideyWithMic, SpiderSenseRadarBadge } from '../icons/SpiderVerseBadges';
import { CheckCircle2, XCircle, Lightbulb, HelpCircle, Radio, Sparkles } from 'lucide-react';
import { LikeButton } from '../common/LikeButton';
import { playSound } from '../../utils/audio';
import { ComicImpactBurst, ComicPanelWebCorner } from '../ComicActionOverlay';

interface FactAttackModeProps {
  question: TFQuestion;
  currentIndex: number;
  totalQuestions: number;
  combo: number;
  streak: number;
  onAnswer: (userChoice: boolean) => void;
  onTriggerWeb: (e: React.MouseEvent) => void;
}

export const FactAttackMode: React.FC<FactAttackModeProps> = ({
  question,
  currentIndex,
  totalQuestions,
  combo,
  streak,
  onAnswer,
  onTriggerWeb
}) => {
  const [showHint, setShowHint] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [impact, setImpact] = useState<{
    type: 'correct' | 'wrong' | null;
    text: string;
    subtext: string;
    points?: number;
    combo?: number;
  } | null>(null);
  const [activeChoice, setActiveChoice] = useState<{ choice: boolean; isCorrect: boolean } | null>(null);
  const [spiderSenseTension, setSpiderSenseTension] = useState(false);

  // Cinematic tension: Spider-Sense radar activates before challenging questions
  useEffect(() => {
    if (question.difficulty === 'hard' || currentIndex % 2 === 1) {
      setSpiderSenseTension(true);
      playSound('spider-sense');
      const t = setTimeout(() => setSpiderSenseTension(false), 900);
      return () => clearTimeout(t);
    }
  }, [question.id, currentIndex, question.difficulty]);

  const handleChoice = (choice: boolean, e: React.MouseEvent) => {
    onTriggerWeb(e);
    const isCorrect = choice === question.isTrue;
    setActiveChoice({ choice, isCorrect });

    if (isCorrect) {
      playSound('bam');
      setImpact({
        type: 'correct',
        text: 'BAM!',
        subtext: 'CANON TRUTH!',
        points: 100 * Math.max(combo, 1),
        combo
      });
    } else {
      playSound('wrong');
      setShaking(true);
      setImpact({
        type: 'wrong',
        text: 'OOF!',
        subtext: "MYSTERIO'S ILLUSION!",
        points: 0
      });
      setTimeout(() => setShaking(false), 450);
    }

    // Cinematic Pause: Allow 450ms for the impact graphic & score burst to sink in
    setTimeout(() => {
      setImpact(null);
      setActiveChoice(null);
      onAnswer(choice);
    }, 450);
  };

  return (
    <section className="space-y-4 preserve-3d">
      {/* Cinematic Comic Impact Starburst Overlay */}
      {impact && (
        <ComicImpactBurst
          type={impact.type}
          text={impact.text}
          subtext={impact.subtext}
          points={impact.points}
          combo={impact.combo}
        />
      )}

      {/* Spider-Sense Tension Banner */}
      {spiderSenseTension && (
        <div className="bg-[#dc2626] text-white border-3 border-[#1b1b20] p-2.5 px-4 ink-shadow-md flex items-center justify-between animate-bounce">
          <span className="font-comic text-xs sm:text-sm font-black uppercase flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#f9bd22] animate-spin" />
            ⚡ SPIDER-SENSE TINGLING: MYSTERIO DECEPTION DETECTED! ⚡
          </span>
          <span className="bg-[#f9bd22] text-[#1b1b20] font-comic text-[10px] font-black px-2 py-0.5 border border-[#1b1b20] uppercase hidden sm:inline">
            INTUITION BOOST
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Dramatic Comic Scene (8 cols) - physically enters from depth */}
        <article
          key={question.id}
          className={`lg:col-span-8 bg-[#fffbf0] border-4 sm:border-6 border-[#1b1b20] p-4 sm:p-7 depth-shadow-comic relative overflow-visible flex flex-col justify-between min-h-[420px] -rotate-0.5 animate-panel-enter animate-web-pull ${
            shaking ? 'shake-comic' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Layered Foreground Web Overlays (breaks flat card boundary) */}
          <ComicPanelWebCorner position="top-right" variant="web" />
          <ComicPanelWebCorner position="bottom-left" variant="badge" />

          {/* Comic Dots Background */}
          <div className="comic-dots-red absolute inset-0 opacity-15 pointer-events-none rounded-sm" />

          {/* Comic Caption Anchor Header */}
          <div className="absolute top-0 left-0 bg-[#f9bd22] border-b-3 border-r-3 border-[#1b1b20] px-3 sm:px-4 py-1.5 flex items-center gap-2 z-10 ink-shadow-sm">
            <span className="font-comic text-[11px] sm:text-xs font-black text-[#1b1b20] uppercase tracking-wide">
              COMIC CAPTION: "BACK IN THE MULTIVERSE..."
            </span>
            <span className="text-[10px] sm:text-xs bg-white px-1.5 py-0.5 border border-[#1b1b20] font-mono font-bold">
              {question.issueRef}
            </span>
          </div>

          <div className="pt-9">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="font-comic text-[11px] font-black text-white uppercase bg-[#dc2626] px-2.5 py-0.5 border-2 border-[#1b1b20] ink-shadow-sm">
                ISSUE FACT #{String(currentIndex + 1).padStart(2, '0')} OF {totalQuestions}
              </span>
              <span className="font-comic text-[11px] font-black text-[#5b403d] uppercase bg-white px-2 py-0.5 border border-[#1b1b20]">
                DIFFICULTY: {question.difficulty}
              </span>
            </div>

            {/* The Question expands into an Authentic Comic Speech Bubble */}
            <div className="bg-white border-3 sm:border-4 border-[#1b1b20] p-5 sm:p-6 my-4 bubble-bottom depth-shadow-comic relative rotate-0.5 animate-bubble-expand">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#1b1b20] text-[#f9bd22] text-[10px] font-comic font-black px-2 py-0.5 uppercase">
                  QUESTION PANEL
                </span>
                <span className="text-xs font-bold text-[#5b403d]">CAN YOU ANSWER THIS?</span>
              </div>
              <h3 className="font-comic text-xl sm:text-2xl md:text-3xl font-black text-[#1b1b20] uppercase leading-tight relative z-10">
                "{question.statement}"
              </h3>
            </div>

            {/* Hint Box if unlocked */}
            {showHint && (
              <div className="bg-[#ffdf9f] border-2 border-[#1b1b20] p-3 my-2 ink-shadow-sm flex items-start gap-2 animate-bubble-expand">
                <Lightbulb className="w-5 h-5 text-[#765700] flex-shrink-0 mt-0.5" />
                <p className="font-comic text-xs font-bold text-[#261a00] uppercase">
                  SPIDEY SAYS: "{question.spideyHint}"
                </p>
              </div>
            )}

            <p className="text-xs sm:text-sm text-[#5b403d] font-bold mt-3">
              Careful, Webhead! Is this authentic Marvel lore or a trick spun by Mysterio?
            </p>
          </div>

          {/* Interactive True / False Comic Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 preserve-3d">
            <button
              onClick={(e) => handleChoice(true, e)}
              className={`bg-[#dc2626] hover:bg-[#b8121d] text-white py-4 px-6 border-3 sm:border-4 border-[#1b1b20] depth-shadow-comic hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 ink-btn flex items-center justify-center gap-3 group cursor-pointer transition-all ${
                activeChoice?.choice === true
                  ? activeChoice.isCorrect
                    ? 'animate-answer-forward ring-4 ring-[#22c55e]'
                    : 'animate-answer-recoil ring-4 ring-[#1b1b20]'
                  : ''
              }`}
            >
              <CheckCircle2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="font-comic text-[10px] font-black uppercase text-white/80 block leading-none">
                  LORE FACT
                </span>
                <span className="font-comic text-lg sm:text-xl font-black uppercase tracking-wide leading-none">
                  TRUE
                </span>
              </div>
            </button>

            <button
              onClick={(e) => handleChoice(false, e)}
              className={`bg-[#006398] hover:bg-[#004e78] text-white py-4 px-6 border-3 sm:border-4 border-[#1b1b20] depth-shadow-comic hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 ink-btn flex items-center justify-center gap-3 group cursor-pointer transition-all ${
                activeChoice?.choice === false
                  ? activeChoice.isCorrect
                    ? 'animate-answer-forward ring-4 ring-[#22c55e]'
                    : 'animate-answer-recoil ring-4 ring-[#1b1b20]'
                  : ''
              }`}
            >
              <XCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="font-comic text-[10px] font-black uppercase text-white/80 block leading-none">
                  LORE FICTION
                </span>
                <span className="font-comic text-lg sm:text-xl font-black uppercase tracking-wide leading-none">
                  FALSE
                </span>
              </div>
            </button>
          </div>
        </article>

        {/* Right Side: Spider-Sense Radar & Spidey Commentary (4 cols) */}
        <aside
          aria-label="Spidey's Commentary"
          className="lg:col-span-4 bg-[#f9bd22]/20 border-4 sm:border-6 border-[#1b1b20] p-4 sm:p-5 depth-shadow-floating flex flex-col justify-between relative overflow-visible rotate-0.5 hover:rotate-0 transition-transform duration-300"
          style={{ transform: 'translateZ(18px)' }}
        >
          <ComicPanelWebCorner position="top-right" variant="web" />
          <div className="comic-dots-yellow absolute inset-0 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-[#dc2626] text-white font-comic text-[11px] font-black px-2 py-0.5 uppercase inline-block border-2 border-[#1b1b20]">
                SPIDER-SENSE RADAR
              </div>
              <div className="bg-[#cce5ff] text-[#001d31] font-comic text-[10px] font-black px-1.5 py-0.5 border border-[#1b1b20] uppercase">
                TALKING GUIDE
              </div>
            </div>

            {/* Comic Reaction Speech Bubble */}
            <div className="bg-white border-3 border-[#1b1b20] p-3.5 depth-shadow-comic mb-3 relative bubble-bottom">
              <p className="font-comic text-xs sm:text-sm text-[#1b1b20] uppercase leading-tight font-black">
                {showHint
                  ? `"${question.spideyHint}"`
                  : `"HEY TRUE BELIEVER! THINK YOU'VE GOT WHAT IT TAKES TO BEAT THE TRIVIA GOBLIN? LOCK IN YOUR ANSWER BEFORE MY SPIDER-SENSE TINGLES OUT!"`}
              </p>
            </div>

            {/* Mascot Avatar Graphic Box */}
            <div className="w-full bg-white border-3 border-[#1b1b20] relative flex flex-col items-center justify-center p-3 overflow-hidden ink-shadow-sm">
              <SpideyWithMic
                className="w-36 h-36"
                text={showHint ? '"CHECK MY HINT!"' : '"LISTEN UP, TIGER!"'}
              />
              {/* Like Button directly below the Spidey artwork */}
              <div className="mt-2 pt-2 border-t border-[#1b1b20]/20 w-full flex justify-center">
                <LikeButton
                  id={`spidey-guide-${question.id}`}
                  initialLikes={1240}
                  label="LIKE SPIDEY GUIDE"
                  compact
                />
              </div>
            </div>

            {/* Tap for a Spidey Hint button */}
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full mt-3 bg-[#ffdf9f] hover:bg-[#f9bd22] border-2 border-[#1b1b20] py-2 px-3 depth-shadow-comic font-comic text-xs font-black uppercase text-[#261a00] flex items-center justify-center gap-2 ink-btn cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#765700]" />
              <span>{showHint ? 'HIDE SPIDEY HINT' : 'TAP FOR A SPIDEY HINT!'}</span>
            </button>
          </div>

          <div className="relative z-10 pt-4 border-t-2 border-[#1b1b20] flex justify-between items-center text-xs font-comic font-black mt-3">
            <span>
              STREAK MULTIPLIER: <span className="text-[#dc2626]">x{combo}.0</span>
            </span>
            <span className="text-[#765700] uppercase">READY TO THWIP!</span>
          </div>
        </aside>
      </div>
    </section>
  );
};

