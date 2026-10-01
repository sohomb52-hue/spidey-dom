/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { arcadeGamesList } from '../../data/spiderCharactersData';
import { ArcadeGame, WebPageId, GameMode } from '../../types';
import { playSound } from '../../utils/audio';
import { LikeButton } from '../common/LikeButton';
import { ComicTiltCard } from '../ComicTiltCard';
import { getDailyChallenge, DailyChallengeMission } from '../../data/arcadeLevelsData';
import {
  Gamepad2,
  Zap,
  Flame,
  Trophy,
  Play,
  Sparkles,
  Calendar,
  Star,
  ShieldCheck,
  Radio,
  SlidersHorizontal,
  RefreshCw,
  Award
} from 'lucide-react';

interface ArcadePageProps {
  onLaunchGame: (page: WebPageId, triviaMode?: GameMode) => void;
  onTriggerWeb: (e: React.MouseEvent) => void;
  score: number;
  streak: number;
}

export const ArcadePage: React.FC<ArcadePageProps> = ({
  onLaunchGame,
  onTriggerWeb,
  score,
  streak
}) => {
  const dailyMission = useMemo(() => getDailyChallenge(), []);
  const [customModifier, setCustomModifier] = useState<string | null>(null);
  const [isRollingModifier, setIsRollingModifier] = useState<boolean>(false);

  // Read level progress from localStorage for display badges
  const swingProgress = useMemo(() => {
    try {
      const saved = localStorage.getItem('spider_web_swing_levels_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { 1: { unlocked: true, stars: 0, bestScore: 0 } };
  }, []);

  const senseProgress = useMemo(() => {
    try {
      const saved = localStorage.getItem('spider_sense_reaction_levels_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { 1: { unlocked: true, stars: 0, bestScore: 0 } };
  }, []);

  const throwerProgress = useMemo(() => {
    try {
      const saved = localStorage.getItem('spider_web_thrower_levels_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { 1: { unlocked: true, stars: 0, bestScore: 0 } };
  }, []);

  // Compute total stars
  const swingStars = Object.values(swingProgress).reduce((acc: number, curr: any) => acc + (curr.stars || 0), 0);
  const senseStars = Object.values(senseProgress).reduce((acc: number, curr: any) => acc + (curr.stars || 0), 0);
  const throwerStars = Object.values(throwerProgress).reduce((acc: number, curr: any) => acc + (curr.stars || 0), 0);
  const totalStars = swingStars + senseStars + throwerStars;

  // Procedural / AI Modifier Roll
  const handleRollModifier = () => {
    playSound('thwip');
    setIsRollingModifier(true);

    const modifiers = [
      '⚡ HYPERSONIC GLIDER SPRINT (Obstacle speed +25%, Score Multiplier 2.0x)',
      '🕸️ LOW GRAVITY WEB FLOAT (Float time +40%, Token Value +50%)',
      '💥 DOUBLE PUMPKIN BARRAGE (Hazard density doubled, XP Reward +300)',
      '🎯 SUB-SECOND REFLEX CRISIS (Reaction window halved, Perfect Dodge Bonus 3.0x)',
      '🌌 MULTIVERSE GLITCH STORM (Randomized sky visual anomaly, Infinite Boost)',
    ];

    setTimeout(() => {
      const rolled = modifiers[Math.floor(Math.random() * modifiers.length)];
      setCustomModifier(rolled);
      setIsRollingModifier(false);
      playSound('unlock');
    }, 450);
  };

  return (
    <section className="space-y-6" id="arcade-portal">
      {/* Red Comic Hero Banner */}
      <div className="border-4 border-[#1b1b20] bg-gradient-to-r from-[#dc2626] via-[#b8121d] to-[#7f1d1d] text-white p-5 sm:p-7 ink-shadow-red-multi relative overflow-hidden">
        <div className="comic-dots-red absolute inset-0 opacity-30 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[#1b1b20] text-[#f9bd22] font-comic text-xs font-black px-2.5 py-0.5 uppercase border border-white">
                THE SPIDER-ARCADE
              </span>
              <span className="bg-white text-[#dc2626] font-comic text-xs font-black px-2 py-0.5 uppercase">
                {arcadeGamesList.length} MULTIVERSE ARCADE GAMES
              </span>
            </div>
            <h1 className="font-comic text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-wide leading-none">
              SPIDER-VERSE ARCADE CABINET
            </h1>
            <p className="text-white/90 font-comic text-sm sm:text-base font-semibold mt-2 leading-relaxed">
              Step into the neon ink arcade of Earth-616! Master 2.5D New York pendulum web-swinging, precognitive danger detection, and canon trivia.
            </p>
          </div>

          {/* Quick Stats Box */}
          <div className="bg-[#1b1b20] border-3 border-white p-3.5 ink-shadow-md text-center min-w-[210px] flex-shrink-0">
            <span className="font-comic text-[10px] font-black uppercase text-[#f9bd22] block mb-1">
              CURRENT HERO SCORE
            </span>
            <span className="font-comic text-3xl font-black text-white">
              {score.toLocaleString()} PTS
            </span>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-xs font-comic text-white/90">
              <span>STREAK: <span className="text-[#f9bd22]">🔥 {streak}</span></span>
              <span>STARS: <span className="text-[#facc15] font-bold">⭐ {totalStars}/54</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* DAILY MULTIVERSE CHALLENGE BANNER                  */}
      {/* ================================================== */}
      <div className="border-4 border-[#1b1b20] bg-[#fffbf0] p-4 sm:p-5 ink-shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-none bg-[#1b1b20] text-[#facc15] border-2 border-[#1b1b20] flex items-center justify-center text-2xl flex-shrink-0 ink-shadow-xs">
              <Calendar className="w-6 h-6 text-[#facc15]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#dc2626] text-white font-comic text-[10px] font-black px-2 py-0.5 uppercase border border-[#1b1b20]">
                  DAILY BOUNTY • {dailyMission.dateKey}
                </span>
                <span className="bg-[#16a34a] text-white font-comic text-[10px] font-black px-2 py-0.5 uppercase">
                  +{dailyMission.xpReward} XP BOUNTY
                </span>
              </div>
              <h3 className="font-comic text-lg sm:text-xl font-black uppercase text-[#1b1b20] mt-1 leading-tight">
                {dailyMission.title}: {dailyMission.objective}
              </h3>
              <p className="text-xs text-[#5b403d] font-comic font-bold mt-0.5">
                CONDITION: <span className="text-[#dc2626]">{dailyMission.condition} ({dailyMission.targetValue} {dailyMission.targetUnit})</span> • MODIFIER: <span className="text-[#4338ca]">{dailyMission.modifierText}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={(e) => {
                playSound('thwip');
                onTriggerWeb(e);
                onLaunchGame(dailyMission.gameId);
              }}
              className="bg-[#dc2626] hover:bg-[#b8121d] text-white border-2 border-[#1b1b20] px-4 py-2.5 font-comic text-xs font-black uppercase flex items-center gap-2 ink-btn ink-shadow-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>LAUNCH DAILY MISSION</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* PROCEDURAL & AI CUSTOM MODIFIER GENERATOR          */}
      {/* ================================================== */}
      <div className="border-3 border-[#1b1b20] bg-white p-3.5 sm:p-4 ink-shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#facc15] border-2 border-[#1b1b20] flex items-center justify-center flex-shrink-0 font-bold">
            🎲
          </div>
          <div>
            <span className="font-comic text-[10px] font-black text-[#dc2626] uppercase block">
              CUSTOM MULTIVERSE MODIFIER
            </span>
            <span className="font-comic text-xs sm:text-sm font-black text-[#1b1b20] uppercase">
              {customModifier || 'Roll a dynamic gameplay modifier to test your spider skills with custom multipliers!'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRollModifier}
          disabled={isRollingModifier}
          className="bg-[#1b1b20] hover:bg-[#2b2b32] text-[#facc15] border-2 border-[#1b1b20] px-3.5 py-1.5 font-comic text-xs font-black uppercase flex items-center justify-center gap-1.5 ink-btn cursor-pointer flex-shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRollingModifier ? 'animate-spin' : ''}`} />
          <span>{isRollingModifier ? 'GENERATING...' : 'ROLL MODIFIER'}</span>
        </button>
      </div>

      {/* ================================================== */}
      {/* THE 8 ARCADE GAMES GRID                            */}
      {/* ================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {arcadeGamesList.map((game: ArcadeGame) => {
          const isSwing = game.id === 'web_swing';
          const isSense = game.id === 'spider_sense_reaction';
          const isThrower = game.id === 'web_thrower';
          const gameStars = isSwing ? swingStars : isSense ? senseStars : isThrower ? throwerStars : null;

          return (
            <ComicTiltCard
              key={game.id}
              maxTilt={12}
              scaleOnHover={1.03}
              className="h-full"
            >
              <div className="h-full border-4 border-[#1b1b20] bg-white p-4 sm:p-5 ink-shadow-lg hover:ink-shadow-red flex flex-col justify-between relative overflow-hidden group transition-shadow duration-200">
                {/* Top Red Badge & Game Number */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-[#dc2626] text-white font-comic text-[10px] font-black px-2 py-0.5 uppercase border border-[#1b1b20]">
                      GAME #{game.number} • {game.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {gameStars !== null && (
                        <span className="bg-[#fef08a] text-[#1b1b20] font-comic text-[10px] font-black px-2 py-0.5 border border-[#1b1b20] uppercase flex items-center gap-0.5">
                          ⭐ {gameStars}/18
                        </span>
                      )}
                      <span
                        className={`font-comic text-[10px] font-black px-2 py-0.5 border border-[#1b1b20] uppercase ${
                          game.difficulty === 'EXTREME'
                            ? 'bg-[#1b1b20] text-[#f9bd22]'
                            : game.difficulty === 'HARD'
                            ? 'bg-[#dc2626] text-white'
                            : game.difficulty === 'MEDIUM'
                            ? 'bg-[#006398] text-white'
                            : 'bg-[#22c55e] text-white'
                        }`}
                      >
                        {game.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Game Cover Art with 3D Depth */}
                  <div className="border-3 border-[#1b1b20] overflow-hidden mb-3 bg-black relative h-44 group-hover:scale-[1.01] transition-transform">
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover filter contrast-110 saturate-110"
                    />
                    <div className="comic-halftone absolute inset-0 pointer-events-none" />
                    <div className="absolute top-2 right-2 bg-black/80 text-white font-comic text-xl p-1.5 border border-white/50">
                      {game.icon}
                    </div>

                    {/* Upgraded Engine Badge */}
                    {(isSwing || isSense || isThrower) && (
                      <div className="absolute bottom-2 left-2 bg-[#16a34a] text-white font-comic text-[9px] font-black px-2 py-0.5 border border-white uppercase shadow-sm">
                        ✓ 6 STAGES & PROGRESSION
                      </div>
                    )}
                  </div>

                  {/* Interactive Like Button */}
                  <div className="mb-3 p-1.5 bg-[#f0ecf4] border-2 border-[#1b1b20] flex justify-between items-center">
                    <span className="text-[10px] font-comic font-black text-[#5b403d] uppercase">
                      GAME ARTWORK
                    </span>
                    <LikeButton
                      id={`arcade-game-${game.id}`}
                      initialLikes={1800 + parseInt(game.number, 10) * 160}
                      label="LIKE GAME"
                      compact
                    />
                  </div>

                  <h3 className="font-comic text-xl font-black uppercase text-[#1b1b20] leading-tight">
                    {game.title}
                  </h3>
                  <p className="font-comic text-xs font-black uppercase text-[#dc2626] mt-0.5">
                    {game.tagline}
                  </p>

                  {/* Features Pill Tags */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {game.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="bg-[#fff0f0] text-[#991b1b] border border-[#dc2626]/30 text-[10px] font-comic font-black px-2 py-0.5 uppercase"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Launch Action Button */}
                <div className="pt-3 border-t-2 border-[#1b1b20] mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      playSound('thwip');
                      onTriggerWeb(e);
                      onLaunchGame(game.page, game.triviaSubMode);
                    }}
                    className="w-full bg-[#dc2626] hover:bg-[#b8121d] text-white border-2 border-[#1b1b20] py-2.5 px-4 font-comic text-sm font-black uppercase flex items-center justify-center gap-2 ink-btn ink-shadow-sm cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>LAUNCH GAME #{game.number}</span>
                  </button>
                </div>
              </div>
            </ComicTiltCard>
          );
        })}
      </div>
    </section>
  );
};
