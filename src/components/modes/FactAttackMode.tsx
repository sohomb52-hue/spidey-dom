import React, { useState, useEffect } from 'react';
import { TFQuestion } from '../../types';
import { SpideyWithMic } from '../icons/SpiderVerseBadges';
import { CheckCircle2, XCircle, Lightbulb, HelpCircle, Radio, ArrowRight } from 'lucide-react';
import { LikeButton } from '../common/LikeButton';
import { playSound } from '../../utils/audio';
import { ComicImpactBurst, ComicPanelWebCorner, ComicPanelForegroundPerch, ComicWebPullEffect } from '../ComicActionOverlay';

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
  streak: _streak,
  onAnswer,
  onTriggerWeb
}) => {
  const [showHint, setShowHint] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [spiderSenseTension, setSpiderSenseTension] = useState(false);

  // Cinematic Visual Narrative Flow: 'challenge' -> 'impact' -> 'reveal' -> 'pulling_next'
  const [narrativeState, setNarrativeState] = useState<'challenge' | 'impact' | 'reveal'>('challenge');
  const [activeChoice, setActiveChoice] = useState<{ choice: boolean; isCorrect: boolean } | null>(null);
  const [webPullActive, setWebPullActive] = useState(false);

  const [impact, setImpact] = useState<{
    type: 'correct' | 'wrong' | null;
    text: string;
    subtext: string;
    points?: number;
    combo?: number;
  } | null>(null);

  // Reset narrative states whenever question changes
  useEffect(() => {
    setNarrativeState('challenge');
    setActiveChoice(null);
    setShowHint(false);
    setImpact(null);
    setWebPullActive(false);

    // Spider-Sense tension wave activates before challenging questions or every alternate issue
    if (question.difficulty === 'Multiverse Veteran' || currentIndex % 2 === 1) {
      setSpiderSenseTension(true);
      playSound('spider-sense');
      const timer = setTimeout(() => {
        setSpiderSenseTension(false);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [question.id, currentIndex, question.difficulty]);

  // Step: Player Answers -> Comic Impact
  const handleChoice = (choice: boolean, e: React.MouseEvent) => {
    if (activeChoice !== null || narrativeState !== 'challenge') return;
    onTriggerWeb(e);

    const isCorrect = choice === question.isTrue;
    setActiveChoice({ choice, isCorrect });
    setNarrativeState('impact');

    const pointsGained = isCorrect ? 200 * Math.max(combo, 1) : 0;

    if (isCorrect) {
      playSound('bam');
      setImpact({
        type: 'correct',
        text: 'BAM!',
        subtext: 'CANON TRUTH!',
        points: pointsGained,
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

    // Cinematic Pause: 450ms for the impact starburst and sound to register
    // Then seamlessly flip to the Fact Reveal beat
    setTimeout(() => {
      setImpact(null);
      setNarrativeState('reveal');
      playSound(isCorrect ? 'correct' : 'click');
    }, 450);
  };

  // Step: Next Panel (Web pulls next challenge)
  const handleAdvanceNext = (e: React.MouseEvent) => {
    if (!activeChoice) return;
    onTriggerWeb(e);
    playSound('thwip');
    setWebPullActive(true);

    // Intentional 250ms web travel pause before delivering the next challenge
    setTimeout(() => {
      onAnswer(activeChoice.choice);
    }, 280);
  };

  return (
    <section className="space-y-4 preserve-3d relative" aria-label="Spider-Verse Fact Attack Challenge">
      {/* Dynamic Comic Impact Starburst Overlay */}
      {impact && (
        <ComicImpactBurst
          type={impact.type}
          text={impact.text}
          subtext={impact.subtext}
          points={impact.points}
          combo={impact.combo}
        />
      )}

      {/* Web Pull Effect across screen */}
      <ComicWebPullEffect active={webPullActive} />

      {/* Spider-Sense Tension Banner (Tension beat) */}
      {spiderSenseTension && (
        <div
          role="status"
          aria-live="polite"
          className="bg-[#dc2626] text-white border-3 border-[#1b1b20] p-2.5 px-4 ink-shadow-md flex items-center justify-between spidey-tingle-anim"
        >
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
        {/* Main Dramatic Comic Panel (8 cols) */}
        <article
          key={`${question.id}-${narrativeState}`}
          className={`lg:col-span-8 bg-[#fffbf0] border-4 sm:border-6 border-[#1b1b20] p-4 sm:p-7 depth-shadow-comic relative overflow-visible flex flex-col justify-between min-h-[440px] -rotate-0.5 animate-panel-enter animate-web-pull ${
            shaking ? 'shake-comic' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Layered Foreground Elements (Spider-Man crouching on border + web corners) */}
          <ComicPanelForegroundPerch
            senseActive={spiderSenseTension}
            mood={narrativeState === 'reveal' ? (activeChoice?.isCorrect ? 'victory' : 'warning') : 'curious'}
          />
          <ComicPanelWebCorner position="top-left" variant="badge" />
          <ComicPanelWebCorner position="bottom-right" variant="web" />

          {/* Comic Halftone Texture */}
          <div className="comic-dots-red absolute inset-0 opacity-15 pointer-events-none rounded-sm" />

          {/* Comic Caption Header Bar */}
          <div className="absolute top-0 left-0 bg-[#f9bd22] border-b-3 border-r-3 border-[#1b1b20] px-3 sm:px-4 py-1.5 flex items-center gap-2 z-10 ink-shadow-sm">
            <span className="font-comic text-[11px] sm:text-xs font-black text-[#1b1b20] uppercase tracking-wide">
              {narrativeState === 'reveal' ? 'CANON VERIFIED ARCHIVE' : 'COMIC CAPTION: "EARTH-616"'}
            </span>
            <span className="text-[10px] sm:text-xs bg-white px-1.5 py-0.5 border border-[#1b1b20] font-mono font-bold">
              {question.issueRef}
            </span>
          </div>

          {/* =========================================================================
              PHASE A: FACT CHALLENGE (Discover & Tension)
              ========================================================================= */}
          {narrativeState !== 'reveal' ? (
            <div className="pt-9">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="font-comic text-[11px] font-black text-white uppercase bg-[#dc2626] px-2.5 py-0.5 border-2 border-[#1b1b20] ink-shadow-sm">
                  ISSUE FACT #{String(currentIndex + 1).padStart(2, '0')} OF {totalQuestions}
                </span>
                <span className="font-comic text-[11px] font-black text-[#5b403d] uppercase bg-white px-2 py-0.5 border border-[#1b1b20]">
                  DIFFICULTY: {question.difficulty}
                </span>
              </div>

              {/* Speech Bubble Expands into Question */}
              <div className="bg-white border-3 sm:border-4 border-[#1b1b20] p-5 sm:p-6 my-4 bubble-bottom depth-shadow-comic relative rotate-0.5 animate-bubble-expand">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#1b1b20] text-[#f9bd22] text-[10px] font-comic font-black px-2 py-0.5 uppercase">
                    QUESTION PANEL
                  </span>
                  <span className="text-xs font-bold text-[#5b403d]">IS THIS REAL CANON OR A MYTH?</span>
                </div>
                <h3 className="font-comic text-xl sm:text-2xl md:text-3xl font-black text-[#1b1b20] uppercase leading-tight relative z-10">
                  "{question.statement}"
                </h3>
              </div>

              {/* Spidey Hint Accordion */}
              {showHint && (
                <div className="bg-[#ffdf9f] border-2 border-[#1b1b20] p-3 my-2 ink-shadow-sm flex items-start gap-2 animate-bubble-expand">
                  <Lightbulb className="w-5 h-5 text-[#765700] flex-shrink-0 mt-0.5" />
                  <p className="font-comic text-xs font-bold text-[#261a00] uppercase">
                    SPIDEY SAYS: "{question.spideyHint}"
                  </p>
                </div>
              )}

              <p className="text-xs sm:text-sm text-[#5b403d] font-bold mt-2">
                Careful, Webhead! Trust your Spider-Sense and lock in your verdict below!
              </p>
            </div>
          ) : (
            /* =========================================================================
               PHASE B: FACT REVEAL (Reward & Canon Story Payoff)
               ========================================================================= */
            <div className="pt-9 animate-panel-enter">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span
                  className={`font-comic text-xs font-black text-white uppercase px-3 py-1 border-2 border-[#1b1b20] ink-shadow-sm ${
                    activeChoice?.isCorrect ? 'bg-[#22c55e]' : 'bg-[#dc2626]'
                  }`}
                >
                  {activeChoice?.isCorrect ? '✓ CANON ACCURACY VERIFIED!' : '✕ MYSTERIO DECEPTION REVEALED!'}
                </span>
                <span className="font-comic text-xs font-black text-[#006398] uppercase bg-white px-2 py-0.5 border border-[#1b1b20]">
                  ISSUE #{String(currentIndex + 1).padStart(2, '0')} REVEAL
                </span>
              </div>

              {/* Story Title Banner */}
              <div className="bg-[#ffdf9f] border-3 border-[#1b1b20] p-4 my-3 bubble-bottom ink-shadow-sm rotate-0.5">
                <span className="font-comic text-[10px] font-black text-[#765700] uppercase block">
                  CANON COMIC LORE:
                </span>
                <h3 className="font-comic text-lg sm:text-xl font-black text-[#1b1b20] uppercase leading-tight mt-1">
                  "{question.storyTitle}"
                </h3>
              </div>

              {/* Story Narrative Explanation Body */}
              <div className="bg-white border-3 border-[#1b1b20] p-4 sm:p-5 ink-shadow-sm">
                <p className="text-sm sm:text-base text-[#1b1b20] font-semibold leading-relaxed">
                  {question.storyBody}
                </p>
                <div className="mt-3 pt-2 border-t border-[#1b1b20]/20 flex items-center justify-between text-xs font-comic font-black text-[#5b403d] uppercase">
                  <span>DOCUMENTED IN: {question.issueRef}</span>
                  <span className="text-[#dc2626]">
                    VERDICT: {question.isTrue ? 'CANON TRUE' : 'CANON FICTION'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Row: Buttons change depending on phase */}
          {narrativeState !== 'reveal' ? (
            /* Interactive TRUE / FALSE Buttons with Physical Tactile Responses */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 preserve-3d">
              <button
                type="button"
                onClick={(e) => handleChoice(true, e)}
                disabled={activeChoice !== null}
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
                type="button"
                onClick={(e) => handleChoice(false, e)}
                disabled={activeChoice !== null}
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
          ) : (
            /* NEXT PANEL (THWIP!) Action Button */
            <div className="pt-5 flex flex-wrap items-center justify-between gap-3 border-t-3 border-[#1b1b20] mt-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#1b1b20] text-[#f9bd22] font-comic text-xs font-black px-2.5 py-1 uppercase">
                  SCORE REWARD: {activeChoice?.isCorrect ? `+${200 * Math.max(combo, 1)} PTS` : '0 PTS'}
                </span>
                {combo > 1 && activeChoice?.isCorrect && (
                  <span className="bg-[#22c55e] text-white font-comic text-xs font-black px-2 py-1 uppercase border border-[#1b1b20]">
                    COMBO ×{combo}!
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleAdvanceNext}
                className="bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-sm sm:text-base font-black px-6 py-3 border-3 border-[#1b1b20] uppercase ink-btn ink-shadow-md flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer ml-auto"
              >
                <span>THWIP! NEXT PANEL (TURN PAGE)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </article>

        {/* Right Side: Spidey Mascot Guide & Spider-Sense Station (4 cols) */}
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
                {narrativeState === 'reveal'
                  ? activeChoice?.isCorrect
                    ? `"EXCELSIOR! You caught the webline! Stan Lee would be proud of that canon precision!"`
                    : `"OOF! Don't sweat it, Tiger! Even Peter Parker fell for Mysterio's smoke and mirrors once or twice!"`
                  : showHint
                  ? `"${question.spideyHint}"`
                  : `"HEY TRUE BELIEVER! THINK YOU'VE GOT WHAT IT TAKES TO BEAT THE TRIVIA GOBLIN? LOCK IN YOUR ANSWER BEFORE MY SPIDER-SENSE TINGLES OUT!"`}
              </p>
            </div>

            {/* Mascot Avatar Graphic Box */}
            <div className="w-full bg-white border-3 border-[#1b1b20] relative flex flex-col items-center justify-center p-3 overflow-hidden ink-shadow-sm">
              <SpideyWithMic
                className="w-36 h-36"
                text={
                  narrativeState === 'reveal'
                    ? activeChoice?.isCorrect
                      ? '"BAM! BULLSEYE!"'
                      : '"WATCH YOUR STEP!"'
                    : showHint
                    ? '"CHECK MY HINT!"'
                    : '"LISTEN UP, TIGER!"'
                }
              />
              <div className="mt-2 pt-2 border-t border-[#1b1b20]/20 w-full flex justify-center">
                <LikeButton
                  id={`spidey-guide-${question.id}`}
                  initialLikes={1240}
                  label="LIKE SPIDEY GUIDE"
                  compact
                />
              </div>
            </div>

            {/* Tap for a Spidey Hint button (only in challenge phase) */}
            {narrativeState !== 'reveal' && (
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="w-full mt-3 bg-[#ffdf9f] hover:bg-[#f9bd22] border-2 border-[#1b1b20] py-2 px-3 depth-shadow-comic font-comic text-xs font-black uppercase text-[#261a00] flex items-center justify-center gap-2 ink-btn cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-[#765700]" />
                <span>{showHint ? 'HIDE SPIDEY HINT' : 'TAP FOR A SPIDEY HINT!'}</span>
              </button>
            )}
          </div>

          <div className="relative z-10 pt-4 border-t-2 border-[#1b1b20] flex justify-between items-center text-xs font-comic font-black mt-3">
            <span>
              STREAK MULTIPLIER: <span className="text-[#dc2626]">x{combo}.0</span>
            </span>
            <span className="text-[#765700] uppercase">
              {narrativeState === 'reveal' ? 'READY FOR NEXT PANEL' : 'READY TO THWIP!'}
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
};
