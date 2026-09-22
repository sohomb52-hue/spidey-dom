import React, { useState } from 'react';
import { spiderCharactersList } from '../../data/spiderCharactersData';
import { SpiderCharacter } from '../../types';
import { LikeButton } from '../common/LikeButton';
import { ComicTiltCard } from '../ComicTiltCard';
import { playSound } from '../../utils/audio';
import { Shield, Sparkles, HelpCircle, CheckCircle2, XCircle, RotateCw, BookOpen, UserCheck, Trophy } from 'lucide-react';

interface SpiderIdGameProps {
  onBackToArcade: () => void;
  onAddScore: (points: number) => void;
}

export const SpiderIdGame: React.FC<SpiderIdGameProps> = ({ onBackToArcade, onAddScore }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [revealedClues, setRevealedClues] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [unlockedIds, setUnlockedIds] = useState<string[]>(['peter-616']);
  const [viewMode, setViewMode] = useState<'challenge' | 'spidindex'>('challenge');

  const currentHero: SpiderCharacter = spiderCharactersList[currentIndex];

  const handleRevealNextClue = () => {
    playSound('click');
    setRevealedClues((prev) => Math.min(prev + 1, 3));
  };

  const handleGuess = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    // Correct if option contains the real name or alias
    const correctMatch = option.toLowerCase().includes(currentHero.alias.toLowerCase()) ||
      option.toLowerCase().includes(currentHero.realName.toLowerCase()) ||
      option.includes(currentHero.earth);

    if (correctMatch) {
      playSound('correct');
      setIsCorrect(true);
      // More points if guessed with fewer clues
      const points = (4 - revealedClues) * 150;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
      onAddScore(points);
      if (!unlockedIds.includes(currentHero.id)) {
        setUnlockedIds((prev) => [...prev, currentHero.id]);
      }
    } else {
      playSound('wrong');
      setIsCorrect(false);
      setStreak(0);
    }
  };

  const handleNextHero = () => {
    playSound('thwip');
    setIsAnswered(false);
    setSelectedOption(null);
    setIsCorrect(false);
    setRevealedClues(1);
    setIsCardFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % spiderCharactersList.length);
  };

  return (
    <section className="space-y-6" id="spider-id-game">
      {/* Top Crimson Comic Banner */}
      <div className="border-4 border-[#1b1b20] bg-gradient-to-r from-[#dc2626] via-[#b8121d] to-[#991b1b] text-white p-4 sm:p-5 ink-shadow-red-multi relative overflow-hidden">
        <div className="comic-dots-red absolute inset-0 opacity-25 pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1b1b20] text-[#f9bd22] font-comic text-xs font-black px-2.5 py-0.5 uppercase border-2 border-white">
                ARCADE GAME #02
              </span>
              <span className="bg-white text-[#dc2626] font-comic text-xs font-black px-2 py-0.5 uppercase">
                MULTIVERSE IDENTI-MATCH
              </span>
            </div>
            <h2 className="font-comic text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-wide mt-1">
              IDENTIFY THE SPIDER-MAN VARIANT
            </h2>
            <p className="text-white/90 font-comic text-xs sm:text-sm font-semibold max-w-xl mt-0.5">
              Study the costume, signature power, and Earth timeline clues to identify which Spider-Man is behind the mask across the multiverse!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'challenge' ? 'spidindex' : 'challenge')}
              className="bg-[#f9bd22] hover:bg-[#ffdf9f] text-[#1b1b20] border-3 border-[#1b1b20] px-3.5 py-2 font-comic text-xs sm:text-sm font-black uppercase ink-btn ink-shadow-sm flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>{viewMode === 'challenge' ? 'SPIDER-DEX ARCHIVE' : 'PLAY IDENTI-MATCH'}</span>
            </button>

            <button
              onClick={onBackToArcade}
              className="bg-white hover:bg-[#ffdf9f] text-[#1b1b20] border-3 border-[#1b1b20] px-3.5 py-2 font-comic text-xs sm:text-sm font-black uppercase ink-btn ink-shadow-sm"
            >
              ← ALL 6 GAMES
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Challenge Game */}
      {viewMode === 'challenge' ? (
        <div className="border-4 border-[#1b1b20] bg-white p-4 sm:p-6 ink-shadow-lg">
          {/* Status Tracker */}
          <div className="flex flex-wrap items-center justify-between border-b-3 border-[#1b1b20] pb-3 mb-5 gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#b8121d] text-white font-comic text-xs font-black px-2 py-0.5 uppercase">
                SUSPECT #{currentIndex + 1} OF {spiderCharactersList.length}
              </span>
              <span className="bg-[#ffdf9f] text-[#261a00] font-comic text-xs font-black px-2 py-0.5 border border-[#1b1b20] uppercase">
                {currentHero.earthTag}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-comic font-black">
              <span>
                IDENTIFIED: <span className="text-[#dc2626] font-bold">{unlockedIds.length} / {spiderCharactersList.length}</span>
              </span>
              <span>
                SCORE: <span className="text-[#006398]">{score}</span>
              </span>
              <span>
                STREAK: <span className="text-[#765700]">🔥 {streak}</span>
              </span>
            </div>
          </div>

          {/* Interactive 3D Perspective Card Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 Cols: 3D Flip Card for Spider-Man Portrait & Specs with Mouse-Tracking Tilt */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <ComicTiltCard maxTilt={14} scaleOnHover={1.02} className="w-full max-w-sm">
                <div
                  className={`relative w-full h-80 sm:h-96 border-4 border-[#1b1b20] bg-white ink-shadow-lg transition-transform duration-700 preserve-3d cursor-pointer ${
                    isCardFlipped ? 'rotate-y-180' : ''
                  }`}
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  title="Click to flip 3D character card!"
                >
                  {/* FRONT: Portrait & Mystery Reveal */}
                  <div className="absolute inset-0 backface-hidden flex flex-col justify-between bg-black p-3 text-white overflow-hidden">
                    <div className="flex justify-between items-center z-10">
                      <span className="bg-[#dc2626] text-white text-[10px] font-comic font-black px-1.5 py-0.5 uppercase border border-white">
                        {isAnswered ? currentHero.earth : 'UNKNOWN EARTH'}
                      </span>
                      <span className="bg-white/20 text-white text-[9px] font-comic font-black px-1 py-0.5 flex items-center gap-1">
                        <RotateCw className="w-3 h-3" /> FLIP 3D CARD
                      </span>
                    </div>

                    <div className="relative flex-1 my-2 overflow-hidden border-2 border-white/30 bg-black flex items-center justify-center">
                      <img
                        src={currentHero.image}
                        alt="Spider-Man Multiverse Variant"
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          isAnswered ? 'filter-none scale-100' : 'filter contrast-150 brightness-75 blur-[1px]'
                        }`}
                      />
                      {!isAnswered && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                          <span className="font-comic text-4xl sm:text-5xl font-black text-[#f9bd22] drop-shadow-md animate-pulse">
                            ?
                          </span>
                        </div>
                      )}
                      <div className="comic-halftone absolute inset-0 pointer-events-none" />
                    </div>

                    <div className="text-center z-10 bg-[#1b1b20] p-1.5 border border-white/20">
                      <p className="font-comic text-xs font-black uppercase text-[#f9bd22]">
                        {isAnswered ? currentHero.alias : 'IDENTITY CLASSIFIED'}
                      </p>
                    </div>
                  </div>

                  {/* BACK: Classified Multiverse Specs */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#fff0f0] border-4 border-[#1b1b20] p-4 text-[#1b1b20] flex flex-col justify-between overflow-y-auto">
                    <div>
                      <div className="flex justify-between items-center mb-2 border-b-2 border-[#1b1b20] pb-1">
                        <span className="bg-[#dc2626] text-white text-[10px] font-comic font-black px-2 py-0.5 uppercase">
                          MULTIVERSE DOSSIER
                        </span>
                        <span className="font-comic text-xs font-black text-[#dc2626]">{currentHero.earth}</span>
                      </div>

                      <h4 className="font-comic text-lg font-black uppercase text-[#1b1b20]">
                        {isAnswered ? currentHero.realName : '???'}
                      </h4>
                      <p className="text-[11px] font-bold text-[#5b403d] mt-1">
                        <span className="text-[#dc2626]">SUIT:</span> {currentHero.suitDescription}
                      </p>
                      <p className="text-[11px] font-bold text-[#006398] mt-2">
                        <span className="text-[#006398]">SIGNATURE POWER:</span> {currentHero.signaturePower}
                      </p>
                      <p className="text-[11px] font-bold text-[#5b403d] mt-2">
                        <span className="text-[#765700]">DEBUT:</span> {currentHero.firstAppearance}
                      </p>
                    </div>

                    <div className="bg-white border-2 border-[#1b1b20] p-2 mt-2">
                      <p className="font-comic text-[10px] italic text-[#1b1b20] font-black">
                        "{currentHero.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              </ComicTiltCard>

              {/* Like Button directly below the Spider-Man Variant Portrait */}
              <div className="mt-3 w-full max-w-sm flex justify-center bg-[#f0ecf4] p-2 border-2 border-[#1b1b20] ink-shadow-sm">
                <LikeButton
                  id={`spider-hero-${currentHero.id}`}
                  initialLikes={1500 + currentIndex * 140}
                  label={`LIKE ${isAnswered ? currentHero.alias : 'HERO'}`}
                  compact
                />
              </div>
            </div>

            {/* Right 7 Cols: Clues & Identity Options */}
            <div className="lg:col-span-7 space-y-4">
              {/* Clues Box */}
              <div className="bg-[#f0ecf4] border-3 border-[#1b1b20] p-4 ink-shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-comic text-xs font-black text-[#1b1b20] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#dc2626]" /> IDENTITY CLUES REVEALED ({revealedClues}/3):
                  </span>
                  {revealedClues < 3 && !isAnswered && (
                    <button
                      onClick={handleRevealNextClue}
                      className="bg-[#f9bd22] hover:bg-[#ffdf9f] text-[#1b1b20] border-2 border-[#1b1b20] text-[10px] font-comic font-black px-2 py-0.5 uppercase ink-btn"
                    >
                      + REVEAL NEXT CLUE
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {currentHero.clues.slice(0, revealedClues).map((clue, idx) => (
                    <div
                      key={idx}
                      className="bg-white border-2 border-[#1b1b20] p-3 flex items-start gap-2 ink-shadow-sm animate-fadeIn"
                    >
                      <span className="bg-[#dc2626] text-white font-mono text-xs font-bold w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="font-comic text-xs sm:text-sm font-black text-[#1b1b20] leading-snug">
                        "{clue}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identification Options */}
              <div className="bg-white border-3 border-[#1b1b20] p-4 ink-shadow-sm">
                <label className="font-comic text-xs sm:text-sm font-black text-[#1b1b20] uppercase block mb-3">
                  SELECT THE MATCHING SPIDER-MAN HERO:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentHero.options.map((option, idx) => {
                    let btnStyle = 'bg-white hover:bg-[#cce5ff] text-[#1b1b20]';
                    if (isAnswered) {
                      const isTarget = option.toLowerCase().includes(currentHero.alias.toLowerCase()) ||
                        option.toLowerCase().includes(currentHero.realName.toLowerCase()) ||
                        option.includes(currentHero.earth);
                      if (isTarget) {
                        btnStyle = 'bg-[#22c55e] text-white border-green-800';
                      } else if (selectedOption === option) {
                        btnStyle = 'bg-[#dc2626] text-white border-red-800';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleGuess(option)}
                        className={`border-2 border-[#1b1b20] p-3 text-left font-comic text-xs sm:text-sm font-black uppercase ink-btn transition-colors flex items-center justify-between gap-2 ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {isAnswered && (
                          <span>
                            {(option.toLowerCase().includes(currentHero.alias.toLowerCase()) ||
                              option.toLowerCase().includes(currentHero.realName.toLowerCase())) ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : selectedOption === option ? (
                              <XCircle className="w-4 h-4 text-white" />
                            ) : null}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reveal Result Banner & Next Button */}
              {isAnswered && (
                <div
                  className={`border-3 border-[#1b1b20] p-4 ink-shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCorrect ? 'bg-[#fff0f0] text-[#991b1b]' : 'bg-[#fff0f0] text-[#1b1b20]'
                  }`}
                >
                  <div>
                    <span className={`font-comic text-xs font-black px-2 py-0.5 uppercase border border-[#1b1b20] ${
                      isCorrect ? 'bg-[#22c55e] text-white' : 'bg-[#dc2626] text-white'
                    }`}>
                      {isCorrect ? 'CORRECT! IDENTITY CONFIRMED!' : 'INCORRECT MATCH!'}
                    </span>
                    <h4 className="font-comic text-lg sm:text-xl font-black uppercase text-[#1b1b20] mt-1">
                      {currentHero.alias} ({currentHero.earth})
                    </h4>
                    <p className="text-xs text-[#5b403d] font-semibold mt-0.5">
                      {currentHero.loreSnippet}
                    </p>
                  </div>

                  <button
                    onClick={handleNextHero}
                    className="bg-[#dc2626] hover:bg-[#b8121d] text-white border-2 border-[#1b1b20] px-5 py-2.5 font-comic text-sm font-black uppercase ink-btn whitespace-nowrap ink-shadow-sm flex-shrink-0"
                  >
                    NEXT HERO →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Full Multiverse Spider-Dex Archive */
        <div className="border-4 border-[#1b1b20] bg-white p-4 sm:p-6 ink-shadow-lg">
          <div className="flex flex-wrap items-center justify-between border-b-3 border-[#1b1b20] pb-3 mb-6 gap-2">
            <div>
              <span className="bg-[#b8121d] text-white font-comic text-xs font-black px-2 py-0.5 uppercase">
                MULTIVERSE DOSSIER ARCHIVES
              </span>
              <h3 className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20] mt-1">
                ALL 10 IDENTIFIED SPIDER-MAN VARIANTS
              </h3>
            </div>
            <span className="bg-[#ffdf9f] px-3 py-1 font-comic text-xs font-black border border-[#1b1b20]">
              COLLECTED: {unlockedIds.length} / {spiderCharactersList.length}
            </span>
          </div>

          {/* 3D Bento Grid of all 10 Spider-Man Variants with Mouse-Tracking 3D Tilt */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spiderCharactersList.map((hero) => {
              const isUnlocked = unlockedIds.includes(hero.id);
              return (
                <ComicTiltCard key={hero.id} maxTilt={12} scaleOnHover={1.03}>
                  <div className="h-full border-3 border-[#1b1b20] bg-[#f0ecf4] p-4 ink-shadow-md hover:ink-shadow-red flex flex-col justify-between transition-shadow duration-200">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-[#dc2626] text-white font-comic text-[10px] font-black px-1.5 py-0.5 uppercase border border-[#1b1b20]">
                          {hero.earth}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-[#5b403d]">
                          {hero.earthTag}
                        </span>
                      </div>

                      {/* Variant Image */}
                      <div className="border-2 border-[#1b1b20] overflow-hidden mb-2 bg-black relative h-48">
                        <img
                          src={hero.image}
                          alt={hero.alias}
                          className="w-full h-full object-cover filter contrast-110"
                        />
                        <div className="comic-halftone absolute inset-0 pointer-events-none" />
                      </div>

                      {/* Like button below each Spider-Man character portrait */}
                      <div className="mb-2 p-1 bg-white border border-[#1b1b20] flex justify-between items-center">
                        <span className="text-[9px] font-comic font-black text-[#5b403d] uppercase">
                          PORTRAIT ART
                        </span>
                        <LikeButton
                          id={`dex-hero-${hero.id}`}
                          initialLikes={1200 + hero.alias.length * 40}
                          label="LIKE HERO"
                          compact
                        />
                      </div>

                      <h4 className="font-comic text-base font-black uppercase text-[#1b1b20]">
                        {hero.alias}
                      </h4>
                      <p className="text-xs text-[#dc2626] font-black font-comic">
                        {hero.realName}
                      </p>
                      <p className="text-[11px] text-[#5b403d] font-semibold mt-1.5 leading-relaxed">
                        {hero.loreSnippet}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-[#1b1b20] mt-3 flex justify-between items-center text-[10px] font-comic font-black">
                      <span className="text-[#006398]">{hero.firstAppearance}</span>
                      <span className="text-[#765700]">⚡ {hero.signaturePower.split(',')[0]}</span>
                    </div>
                  </div>
                </ComicTiltCard>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
