/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playSound } from '../../utils/audio';
import { useSpiderAuth } from '../../context/AuthContext';
import { LikeButton } from '../common/LikeButton';
import {
  SPIDER_SENSE_LEVELS,
  SpiderSenseLevelConfig,
  ArcadeDifficulty,
  DIFFICULTY_MULTIPLIERS
} from '../../data/arcadeLevelsData';
import {
  Zap,
  Heart,
  Timer,
  RotateCcw,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  Trophy,
  Flame,
  Award,
  Star,
  Play,
  Pause,
  ArrowRight,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

interface SpiderSenseGameProps {
  onBackToArcade: () => void;
  onAddScore?: (points: number) => void;
}

type DangerAction = 'LEFT' | 'RIGHT' | 'JUMP' | 'DUCK' | 'WEB';

interface DangerInstance {
  id: number;
  type: 'car' | 'debris' | 'projectile' | 'enemy' | 'electric' | 'web_trap' | 'laser';
  name: string;
  icon: string;
  requiredAction: DangerAction;
  actionHint: string;
  direction: 'left' | 'right' | 'top' | 'center' | 'bottom';
  windowSeconds: number;
  spawnTime: number;
  resolved: boolean;
  success?: boolean;
}

export const SpiderSenseGame: React.FC<SpiderSenseGameProps> = ({
  onBackToArcade,
  onAddScore
}) => {
  const { userProfile, recordSession, syncAnswerResult } = useSpiderAuth();

  // Local storage for Spider-Sense level progression
  const [levelProgress, setLevelProgress] = useState<Record<number, { unlocked: boolean; stars: number; bestScore: number; fastestMs: number }>>(() => {
    try {
      const saved = localStorage.getItem('spider_sense_reaction_levels_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      1: { unlocked: true, stars: 0, bestScore: 0, fastestMs: 0 },
      2: { unlocked: false, stars: 0, bestScore: 0, fastestMs: 0 },
      3: { unlocked: false, stars: 0, bestScore: 0, fastestMs: 0 },
      4: { unlocked: false, stars: 0, bestScore: 0, fastestMs: 0 },
      5: { unlocked: false, stars: 0, bestScore: 0, fastestMs: 0 },
      6: { unlocked: false, stars: 0, bestScore: 0, fastestMs: 0 },
    };
  });

  // Selected Level & Difficulty
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<ArcadeDifficulty>('NORMAL');
  const [inLevelSelect, setInLevelSelect] = useState<boolean>(true);

  // Game UI Flow State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [levelVictory, setLevelVictory] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Gameplay Live Stats
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [threatsCleared, setThreatsCleared] = useState<number>(0);
  const [perfectDodges, setPerfectDodges] = useState<number>(0);
  const [fastestReactionSec, setFastestReactionSec] = useState<number | null>(null);
  const [lastReactionSec, setLastReactionSec] = useState<number | null>(null);

  // Active Threat & Spider-Sense Gauge
  const [activeDanger, setActiveDanger] = useState<DangerInstance | null>(null);
  const [spiderSenseEnergy, setSpiderSenseEnergy] = useState<number>(0); // 0 to 100
  const [isSlowMoActive, setIsSlowMoActive] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<{ text: string; color: string; sub?: string } | null>(null);
  const [spideyPose, setSpideyPose] = useState<'READY' | 'JUMP' | 'DUCK' | 'DODGE_L' | 'DODGE_R' | 'WEB' | 'HIT'>('READY');
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [levelStarsWon, setLevelStarsWon] = useState<number>(0);

  const dangerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nextSpawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeDangerRef = useRef<DangerInstance | null>(null);
  const slowMoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentLevelConfig = SPIDER_SENSE_LEVELS.find((l) => l.id === selectedLevelId) || SPIDER_SENSE_LEVELS[0];

  // Sync ref
  useEffect(() => {
    activeDangerRef.current = activeDanger;
  }, [activeDanger]);

  // Save Progress
  const saveProgress = (levelId: number, stars: number, finalScore: number, reactionMs: number) => {
    setLevelProgress((prev) => {
      const current = prev[levelId] || { unlocked: true, stars: 0, bestScore: 0, fastestMs: 0 };
      const updatedStars = Math.max(current.stars, stars);
      const updatedScore = Math.max(current.bestScore, finalScore);
      const updatedFastest = current.fastestMs === 0 ? reactionMs : Math.min(current.fastestMs, reactionMs || 9999);

      const nextLevelId = levelId + 1;
      const nextLevelState = prev[nextLevelId] || { unlocked: false, stars: 0, bestScore: 0, fastestMs: 0 };

      const updated = {
        ...prev,
        [levelId]: {
          unlocked: true,
          stars: updatedStars,
          bestScore: updatedScore,
          fastestMs: updatedFastest,
        },
        ...(stars > 0 && nextLevelId <= SPIDER_SENSE_LEVELS.length
          ? { [nextLevelId]: { ...nextLevelState, unlocked: true } }
          : {}),
      };

      try {
        localStorage.setItem('spider_sense_reaction_levels_v2', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Threat Definitions Master Pool
  const DANGER_TEMPLATES: Record<string, { name: string; icon: string; requiredAction: DangerAction; actionHint: string; direction: 'left' | 'right' | 'top' | 'bottom' | 'center' }> = {
    car: {
      name: 'CHARGING SPEEDER CAB',
      icon: '🚗',
      requiredAction: 'JUMP',
      actionHint: 'JUMP OVER IT! [↑ JUMP / W]',
      direction: 'left',
    },
    debris: {
      name: 'FALLING MASONRY BRICKS',
      icon: '🧱',
      requiredAction: 'LEFT',
      actionHint: 'VAULT ASIDE! [← LEFT / A]',
      direction: 'top',
    },
    projectile: {
      name: 'PUMPKIN BOMB MISSILE',
      icon: '💥',
      requiredAction: 'WEB',
      actionHint: 'WEB TRAP IN MID-AIR! [SPACE / WEB]',
      direction: 'right',
    },
    enemy: {
      name: 'RHINO CRUSHING CHARGE',
      icon: '🦏',
      requiredAction: 'DUCK',
      actionHint: 'DUCK UNDER THE CRUSH! [↓ DUCK / S]',
      direction: 'center',
    },
    electric: {
      name: 'ELECTRO VOLTAGE SHOCK',
      icon: '⚡',
      requiredAction: 'RIGHT',
      actionHint: 'EVADE RIGHT! [→ RIGHT / D]',
      direction: 'left',
    },
    web_trap: {
      name: 'SYMBIOTE TENDRIL NET',
      icon: '🕸️',
      requiredAction: 'WEB',
      actionHint: 'FIRE COUNTER-WEB SHIELD! [SPACE / WEB]',
      direction: 'center',
    },
    laser: {
      name: 'OSCORP DRONE LASER SWEEP',
      icon: '🎯',
      requiredAction: 'DUCK',
      actionHint: 'DUCK UNDER THE LASER! [↓ DUCK / S]',
      direction: 'top',
    },
  };

  // Spawn Next Threat
  const spawnThreat = useCallback(() => {
    if (!isPlaying || isPaused || gameOver || levelVictory) return;

    const level = currentLevelConfig;
    const diffMult = DIFFICULTY_MULTIPLIERS[difficulty];

    const allowedTypes = level.allowedThreatTypes;
    const randomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    const template = DANGER_TEMPLATES[randomType] || DANGER_TEMPLATES.car;

    const windowSec = level.baseReactionWindow * diffMult.windowScale * (isSlowMoActive ? 2.0 : 1.0);

    const newDanger: DangerInstance = {
      id: Date.now() + Math.random(),
      type: randomType,
      name: template.name,
      icon: template.icon,
      requiredAction: template.requiredAction,
      actionHint: template.actionHint,
      direction: template.direction,
      windowSeconds: windowSec,
      spawnTime: performance.now(),
      resolved: false,
    };

    setActiveDanger(newDanger);
    setSpideyPose('READY');
    playSound('spider-sense');

    // Timeout if player fails to react in time
    if (dangerTimerRef.current) clearTimeout(dangerTimerRef.current);
    dangerTimerRef.current = setTimeout(() => {
      handleThreatTimeout();
    }, windowSec * 1000);
  }, [isPlaying, isPaused, gameOver, levelVictory, currentLevelConfig, difficulty, isSlowMoActive]);

  // Handle Threat Timeout (Player failed to react)
  const handleThreatTimeout = () => {
    const danger = activeDangerRef.current;
    if (!danger || danger.resolved) return;

    danger.resolved = true;
    danger.success = false;
    setActiveDanger(null);

    playSound('hit');
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 400);

    setCombo(0);
    setSpideyPose('HIT');
    setFeedbackText({
      text: '💥 HIT! TOO SLOW!',
      color: '#dc2626',
      sub: 'Spider-Sense reaction window missed!',
    });

    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setGameOver(true);
        playSound('game_over');
        saveProgress(selectedLevelId, 0, score, 0);
        if (onAddScore) onAddScore(score);
      } else {
        // Schedule next threat
        scheduleNextSpawn();
      }
      return next;
    });
  };

  // Schedule Next Threat Spawn
  const scheduleNextSpawn = useCallback(() => {
    if (nextSpawnTimerRef.current) clearTimeout(nextSpawnTimerRef.current);
    const delay = Math.floor(Math.random() * (currentLevelConfig.spawnIntervalMax - currentLevelConfig.spawnIntervalMin + 1)) + currentLevelConfig.spawnIntervalMin;
    nextSpawnTimerRef.current = setTimeout(() => {
      spawnThreat();
    }, isSlowMoActive ? delay * 1.5 : delay);
  }, [currentLevelConfig, isSlowMoActive, spawnThreat]);

  // Handle User Reaction Action
  const handleAction = useCallback((action: DangerAction) => {
    if (!isPlaying || isPaused || gameOver || levelVictory) return;

    const danger = activeDangerRef.current;
    if (!danger || danger.resolved) {
      // False alarm penalty (acting when no danger)
      playSound('wrong');
      setCombo(0);
      setFeedbackText({ text: 'FALSE ALARM!', color: '#991b1b', sub: 'No incoming threat!' });
      return;
    }

    danger.resolved = true;
    if (dangerTimerRef.current) clearTimeout(dangerTimerRef.current);

    const reactionSec = (performance.now() - danger.spawnTime) / 1000;
    setLastReactionSec(parseFloat(reactionSec.toFixed(3)));
    setFastestReactionSec((prev) => (prev === null ? reactionSec : Math.min(prev, reactionSec)));

    const isCorrect = action === danger.requiredAction;

    if (isCorrect) {
      danger.success = true;
      const diffMult = DIFFICULTY_MULTIPLIERS[difficulty];
      const isPerfect = reactionSec <= danger.windowSeconds * 0.45;

      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      if (isPerfect) {
        setPerfectDodges((prev) => prev + 1);
        playSound('perfect');
      } else {
        playSound('correct');
      }

      // Points calculation
      const basePts = isPerfect ? 500 : 250;
      const timeBonus = Math.max(0, Math.round((danger.windowSeconds - reactionSec) * 200));
      const comboMult = Math.min(5, 1 + Math.floor(newCombo / 3));
      const slowMoBonus = isSlowMoActive ? 2 : 1;
      const totalPts = Math.round((basePts + timeBonus) * diffMult.scoreMult * comboMult * slowMoBonus);

      setScore((prev) => prev + totalPts);

      // Spider-Sense energy refill
      setSpiderSenseEnergy((prev) => Math.min(100, prev + (isPerfect ? 18 : 10)));

      // Set pose based on action
      if (action === 'JUMP') setSpideyPose('JUMP');
      else if (action === 'DUCK') setSpideyPose('DUCK');
      else if (action === 'LEFT') setSpideyPose('DODGE_L');
      else if (action === 'RIGHT') setSpideyPose('DODGE_R');
      else if (action === 'WEB') setSpideyPose('WEB');

      setFeedbackText({
        text: isPerfect ? `⚡ PERFECT REFLEX! +${totalPts}` : `✓ DODGED! +${totalPts}`,
        color: isPerfect ? '#facc15' : '#22c55e',
        sub: `${reactionSec.toFixed(3)}s reaction • ${comboMult}x combo multiplier`,
      });

      // Advance threats cleared
      const nextCleared = threatsCleared + 1;
      setThreatsCleared(nextCleared);

      // Check Level Victory
      if (nextCleared >= currentLevelConfig.threatCount) {
        setLevelVictory(true);
        playSound('level_complete');

        let stars = 1;
        if (score + totalPts >= currentLevelConfig.targetScore) stars++;
        if (perfectDodges + (isPerfect ? 1 : 0) >= currentLevelConfig.perfectDodgeTarget) stars++;
        setLevelStarsWon(stars);

        saveProgress(selectedLevelId, stars, score + totalPts, Math.round(reactionSec * 1000));
        if (onAddScore) onAddScore(score + totalPts);
        syncAnswerResult(true, currentLevelConfig.xpReward, newCombo);
        recordSession({
          gameMode: `spider_sense_lvl_${currentLevelConfig.id}`,
          score: score + totalPts,
          questionsAnswered: currentLevelConfig.threatCount,
          correctAnswers: nextCleared,
          accuracy: Math.round((nextCleared / currentLevelConfig.threatCount) * 100),
          bestStreak: Math.max(maxCombo, newCombo),
          xpEarned: currentLevelConfig.xpReward,
          completedAt: new Date().toISOString(),
          factsDiscovered: 1,
        });
        return;
      }

      scheduleNextSpawn();
    } else {
      // Wrong Action
      danger.success = false;
      playSound('wrong');
      setCombo(0);
      setSpideyPose('HIT');
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 400);

      setFeedbackText({
        text: `WRONG MOVE! Needed [${danger.requiredAction}]`,
        color: '#dc2626',
        sub: `Tried ${action} instead!`,
      });

      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setGameOver(true);
          playSound('game_over');
          saveProgress(selectedLevelId, 0, score, 0);
          if (onAddScore) onAddScore(score);
        } else {
          scheduleNextSpawn();
        }
        return next;
      });
    }

    setActiveDanger(null);
  }, [isPlaying, isPaused, gameOver, levelVictory, difficulty, combo, isSlowMoActive, threatsCleared, currentLevelConfig, selectedLevelId, score, perfectDodges, maxCombo, onAddScore, syncAnswerResult, recordSession, scheduleNextSpawn]);

  // Activate Spider-Sense Slow-Mo Mode
  const triggerSpiderSenseSlowMo = useCallback(() => {
    if (spiderSenseEnergy >= 40 && !isSlowMoActive) {
      setIsSlowMoActive(true);
      setSpiderSenseEnergy((prev) => Math.max(0, prev - 40));
      playSound('slowmo');

      setFeedbackText({
        text: '⚡ SPIDER-SENSE TIME WARP ACTIVATED!',
        color: '#facc15',
        sub: 'Reaction window expanded • 2x Score Multiplier Active!',
      });

      if (slowMoTimeoutRef.current) clearTimeout(slowMoTimeoutRef.current);
      slowMoTimeoutRef.current = setTimeout(() => {
        setIsSlowMoActive(false);
      }, 5000);
    }
  }, [spiderSenseEnergy, isSlowMoActive]);

  // Keyboard Controller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        handleAction('JUMP');
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        handleAction('DUCK');
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        handleAction('LEFT');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        handleAction('RIGHT');
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleAction('WEB');
      } else if (e.code === 'KeyE') {
        triggerSpiderSenseSlowMo();
      } else if (e.code === 'Escape' || e.code === 'KeyP') {
        if (isPlaying && !gameOver && !levelVictory) {
          setIsPaused((prev) => !prev);
          playSound('click');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, gameOver, levelVictory, handleAction, triggerSpiderSenseSlowMo]);

  // Start Level with countdown sequence
  const startLevel = (levelId: number) => {
    setSelectedLevelId(levelId);
    setInLevelSelect(false);
    setIsPlaying(false);
    setIsPaused(false);
    setLevelVictory(false);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setCombo(0);
    setMaxCombo(0);
    setThreatsCleared(0);
    setPerfectDodges(0);
    setSpiderSenseEnergy(0);
    setIsSlowMoActive(false);
    setFeedbackText(null);
    setSpideyPose('READY');
    setCountdown(3);

    playSound('click');

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev > 1) {
          playSound('tick');
          return prev - 1;
        }
        clearInterval(timer);
        playSound('spider-sense');
        setIsPlaying(true);
        setTimeout(() => {
          spawnThreat();
        }, 500);
        return null;
      });
    }, 700);
  };

  return (
    <section className="space-y-6" id="spider-sense-danger-game">
      {/* Red Comic Hero Banner */}
      <div className="border-4 sm:border-6 border-[#1b1b20] bg-gradient-to-r from-[#180b2a] via-[#4338ca] to-[#dc2626] text-white p-4 sm:p-6 ink-shadow-red-multi relative overflow-hidden">
        <div className="comic-dots-red absolute inset-0 opacity-25 pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-[#facc15] text-[#1b1b20] font-comic text-xs font-black px-2.5 py-0.5 uppercase border border-white">
                ARCADE ENGINE #08
              </span>
              <span className="bg-[#dc2626] text-white font-comic text-xs font-black px-2 py-0.5 uppercase">
                REFLEX RADAR TEST
              </span>
            </div>
            <h1 className="font-comic text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              SPIDER-SENSE: DANGER DETECTOR
            </h1>
            <p className="font-comic text-xs sm:text-sm font-semibold text-white/90 mt-1 max-w-xl">
              Precognitive reflex defense against gliders, charging speeders, lightning strikes, and multi-hazard volleys!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToArcade}
              className="bg-white hover:bg-[#ffdf9f] text-[#1b1b20] border-2 border-[#1b1b20] px-3.5 py-2 font-comic text-xs font-black uppercase flex items-center gap-1.5 ink-btn ink-shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>EXIT TO ARCADE</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 1. STAGE SELECTOR SCREEN (If inLevelSelect)        */}
      {/* ================================================== */}
      {inLevelSelect && (
        <div className="border-4 border-[#1b1b20] bg-[#fffbf0] p-5 sm:p-7 ink-shadow-lg space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-3 border-[#1b1b20] pb-4">
            <div>
              <h2 className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20]">
                SELECT REFLEX STAGE & DIFFICULTY
              </h2>
              <p className="font-comic text-xs text-[#5b403d] font-bold mt-0.5">
                Dodge incoming attacks within millisecond windows to earn ⭐⭐⭐ stars and unlock boss climax stages!
              </p>
            </div>

            {/* Difficulty Selector */}
            <div className="flex items-center gap-1.5 bg-white border-2 border-[#1b1b20] p-1 ink-shadow-xs">
              {(['EASY', 'NORMAL', 'HARD', 'SPIDER_SENSE'] as ArcadeDifficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setDifficulty(d);
                  }}
                  className={`px-2.5 py-1 font-comic text-[10px] sm:text-xs font-black uppercase transition-all cursor-pointer ${
                    difficulty === d
                      ? 'bg-[#dc2626] text-white'
                      : 'bg-transparent text-[#1b1b20] hover:bg-gray-100'
                  }`}
                >
                  {d.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Level Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPIDER_SENSE_LEVELS.map((lvl) => {
              const prog = levelProgress[lvl.id] || { unlocked: lvl.unlockedByDefault || false, stars: 0, bestScore: 0, fastestMs: 0 };
              const isLocked = !prog.unlocked;

              return (
                <div
                  key={lvl.id}
                  className={`border-3 border-[#1b1b20] p-4 flex flex-col justify-between transition-all relative overflow-hidden ${
                    isLocked
                      ? 'bg-gray-100 opacity-60 border-dashed'
                      : 'bg-white hover:bg-[#fffdf0] ink-shadow-md hover:scale-[1.01]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#1b1b20] text-white font-comic text-[10px] font-black px-2 py-0.5 uppercase">
                        STAGE {lvl.id} • {lvl.threatCount} THREATS
                      </span>
                      {isLocked ? (
                        <span className="flex items-center gap-1 font-comic text-[10px] font-black text-gray-500 uppercase">
                          <Lock className="w-3 h-3" /> LOCKED
                        </span>
                      ) : (
                        <div className="flex gap-1 text-[#facc15]">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= prog.stars ? 'fill-[#facc15] text-[#facc15]' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 className="font-comic text-lg font-black uppercase text-[#1b1b20] leading-tight">
                      {lvl.name}
                    </h3>
                    <p className="font-comic text-[11px] font-black text-[#4338ca] uppercase">
                      {lvl.subtitle}
                    </p>
                    <p className="text-xs text-[#5b403d] font-sans mt-2 line-clamp-2">
                      {lvl.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-gray-200 grid grid-cols-2 gap-2 text-[10px] font-comic font-bold text-[#1b1b20]">
                      <div>WINDOW: <span className="font-black text-[#dc2626]">{lvl.baseReactionWindow}s</span></div>
                      <div>PERFECT TARGET: <span className="font-black text-[#facc15]">⭐ {lvl.perfectDodgeTarget}</span></div>
                      <div>BEST SCORE: <span className="font-black">{prog.bestScore.toLocaleString()}</span></div>
                      <div>XP REWARD: <span className="font-black text-[#16a34a]">+{lvl.xpReward} XP</span></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-[#1b1b20]">
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => startLevel(lvl.id)}
                      className={`w-full py-2 px-3 font-comic text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-transform ${
                        isLocked
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#4338ca] hover:bg-[#3730a3] text-white border-2 border-[#1b1b20] ink-btn cursor-pointer'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isLocked ? 'LOCKED (CLEAR STAGE ' + (lvl.id - 1) + ')' : 'START STAGE'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* 2. LIVE GAMEPLAY ARENA VIEWPORT                    */}
      {/* ================================================== */}
      {!inLevelSelect && (
        <div className="border-4 sm:border-6 border-[#1b1b20] bg-black p-2 sm:p-4 ink-shadow-xl space-y-3">
          {/* Top HUD Bar */}
          <div className="bg-[#1b1b20] text-white p-2.5 sm:p-3 border-2 border-white/40 flex flex-wrap items-center justify-between gap-3 text-xs font-comic font-black uppercase">
            <div className="flex items-center gap-3">
              <span className="bg-[#4338ca] px-2 py-0.5 border border-white">
                STAGE {currentLevelConfig.id}: {currentLevelConfig.name}
              </span>
              <span className="text-[#facc15]">
                WAVE: <span className="text-white font-mono">{threatsCleared}/{currentLevelConfig.threatCount}</span>
              </span>
            </div>

            {/* Lives Hearts */}
            <div className="flex items-center gap-1">
              <span>LIVES:</span>
              <div className="flex gap-1 text-[#dc2626]">
                {[1, 2, 3].map((l) => (
                  <Heart
                    key={l}
                    className={`w-4 h-4 ${l <= lives ? 'fill-[#dc2626]' : 'text-gray-500'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span>SCORE: <span className="text-[#38bdf8] font-mono">{score.toLocaleString()}</span></span>
              <span className={`px-2 py-0.5 border ${combo > 1 ? 'bg-[#dc2626] text-white animate-pulse' : 'bg-white/10 text-white/70'}`}>
                {combo}x COMBO
              </span>
              {fastestReactionSec && (
                <span className="hidden sm:inline text-green-400">
                  FASTEST: {fastestReactionSec.toFixed(3)}s
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPaused((prev) => !prev);
                  playSound('click');
                }}
                className="bg-white hover:bg-gray-200 text-[#1b1b20] px-2.5 py-1 font-comic text-[11px] font-black border border-white cursor-pointer"
              >
                {isPaused ? 'RESUME' : 'PAUSE'}
              </button>
              <button
                type="button"
                onClick={() => setInLevelSelect(true)}
                className="bg-[#dc2626] hover:bg-[#b8121d] text-white px-2.5 py-1 font-comic text-[11px] font-black border border-white cursor-pointer"
              >
                STAGES
              </button>
            </div>
          </div>

          {/* Central Combat Radar Viewport */}
          <div
            className={`relative w-full h-[380px] sm:h-[450px] border-3 border-[#1b1b20] overflow-hidden select-none bg-radial from-[#1e1b4b] via-[#0f0919] to-black flex flex-col justify-between p-4 ${
              screenShake ? 'shake-comic' : ''
            }`}
          >
            {/* Halftone Overlay */}
            <div className="comic-halftone absolute inset-0 opacity-15 pointer-events-none" />

            {/* Spider-Sense Radar Ring Grid */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[280px] h-[280px] rounded-full border-2 border-dashed border-[#4338ca]/30 animate-spin [animation-duration:30s]" />
              <div className="w-[180px] h-[180px] rounded-full border border-dashed border-[#dc2626]/40 animate-spin [animation-duration:15s]" />
              <div className="w-[90px] h-[90px] rounded-full border border-[#facc15]/30" />
            </div>

            {/* Top Feedback Banner */}
            <div className="relative z-20 text-center min-h-[50px]">
              {feedbackText && (
                <div className="inline-block bg-[#1b1b20] border-2 border-white px-4 py-1.5 ink-shadow-sm animate-in zoom-in duration-150">
                  <div className="font-comic text-sm sm:text-base font-black uppercase" style={{ color: feedbackText.color }}>
                    {feedbackText.text}
                  </div>
                  {feedbackText.sub && (
                    <div className="font-comic text-[10px] text-white/90 uppercase font-bold">
                      {feedbackText.sub}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Center: Incoming Threat Trajectory & Spider-Man Arena */}
            <div className="relative z-20 flex-1 flex items-center justify-center">
              {/* Active Incoming Threat Card */}
              {activeDanger && (
                <div
                  className={`absolute p-3 sm:p-4 bg-white border-3 border-[#1b1b20] text-[#1b1b20] ink-shadow-lg animate-in zoom-in duration-100 max-w-xs text-center z-30 ${
                    activeDanger.direction === 'left' ? 'left-4 sm:left-12' :
                    activeDanger.direction === 'right' ? 'right-4 sm:right-12' :
                    activeDanger.direction === 'top' ? 'top-2' :
                    'inset-x-auto'
                  }`}
                >
                  <div className="bg-[#dc2626] text-white font-comic text-[10px] font-black px-2 py-0.5 uppercase mb-1 spidey-tingle-anim inline-block">
                    ⚡ SPIDER-SENSE WARNING!
                  </div>
                  <div className="text-3xl my-1">{activeDanger.icon}</div>
                  <h4 className="font-comic text-xs sm:text-sm font-black uppercase text-[#1b1b20] leading-tight">
                    {activeDanger.name}
                  </h4>
                  <div className="mt-2 bg-[#facc15] text-[#1b1b20] font-comic text-xs font-black px-2.5 py-1 border border-[#1b1b20] uppercase animate-pulse">
                    {activeDanger.actionHint}
                  </div>
                </div>
              )}

              {/* Spider-Man Center Hero Sprite */}
              <div className="relative flex flex-col items-center">
                {/* Radar Waves if Danger Active */}
                {activeDanger && (
                  <div className="absolute -inset-10 rounded-full border-4 border-[#dc2626] animate-ping opacity-75 pointer-events-none" />
                )}

                {/* Hero Character Sphere & Pose */}
                <div
                  className={`w-24 h-24 rounded-full border-4 border-[#1b1b20] flex items-center justify-center shadow-2xl transition-all duration-150 ${
                    spideyPose === 'HIT' ? 'bg-[#991b1b] scale-90 rotate-12' :
                    spideyPose === 'JUMP' ? 'bg-[#0284c7] -translate-y-8 scale-110' :
                    spideyPose === 'DUCK' ? 'bg-[#b45309] translate-y-6 scale-95' :
                    spideyPose === 'DODGE_L' ? 'bg-[#0284c7] -translate-x-8 -rotate-12' :
                    spideyPose === 'DODGE_R' ? 'bg-[#0284c7] translate-x-8 rotate-12' :
                    spideyPose === 'WEB' ? 'bg-[#facc15] scale-115' :
                    'bg-[#dc2626]'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-3xl">🕷️</span>
                    <div className="font-comic text-[9px] font-black text-white uppercase mt-0.5">
                      {spideyPose}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center pointer-events-none z-40 animate-in zoom-in duration-200">
                <div className="text-center font-comic font-black text-white">
                  <div className="text-7xl sm:text-9xl text-[#facc15] drop-shadow-[0_6px_0_#1b1b20]">
                    {countdown}
                  </div>
                  <div className="text-xl sm:text-2xl uppercase tracking-widest text-[#dc2626]">
                    BRACE YOUR SPIDER-SENSE!
                  </div>
                </div>
              </div>
            )}

            {/* Level Victory Modal */}
            {levelVictory && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-[#fffdf0] border-4 sm:border-6 border-[#1b1b20] p-6 max-w-md w-full text-center ink-shadow-2xl space-y-4 animate-in zoom-in duration-200">
                  <div className="bg-[#16a34a] text-white font-comic text-xs font-black px-3 py-1 uppercase inline-block border-2 border-[#1b1b20] -rotate-2">
                    REFLEX STAGE CLEARED!
                  </div>
                  <h3 className="font-comic text-3xl font-black uppercase text-[#1b1b20]">
                    {currentLevelConfig.name}
                  </h3>

                  {/* Stars Won */}
                  <div className="flex justify-center gap-2 text-[#facc15] my-2">
                    {[1, 2, 3].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 ${
                          star <= levelStarsWon ? 'fill-[#facc15] text-[#facc15] animate-bounce' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="bg-white border-2 border-[#1b1b20] p-3 text-left font-comic text-xs font-bold text-[#1b1b20] space-y-1">
                    <div className="flex justify-between">
                      <span>THREATS CLEARED:</span>
                      <span className="font-black text-[#dc2626]">{threatsCleared}/{currentLevelConfig.threatCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FINAL SCORE:</span>
                      <span className="font-black text-[#38bdf8]">{score.toLocaleString()} PTS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PERFECT DODGES:</span>
                      <span className="font-black text-[#facc15]">⭐ {perfectDodges}/{currentLevelConfig.perfectDodgeTarget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FASTEST REACTION:</span>
                      <span className="font-black text-[#16a34a]">{fastestReactionSec ? `${fastestReactionSec.toFixed(3)}s` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-1 text-[#16a34a]">
                      <span>XP REWARD:</span>
                      <span className="font-black">+{currentLevelConfig.xpReward} XP</span>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => startLevel(selectedLevelId)}
                      className="bg-white text-[#1b1b20] border-2 border-[#1b1b20] px-4 py-2 font-comic text-xs font-black uppercase ink-btn cursor-pointer"
                    >
                      RETRY
                    </button>
                    {selectedLevelId < SPIDER_SENSE_LEVELS.length ? (
                      <button
                        type="button"
                        onClick={() => startLevel(selectedLevelId + 1)}
                        className="bg-[#4338ca] text-white border-2 border-[#1b1b20] px-5 py-2 font-comic text-xs font-black uppercase ink-btn flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>NEXT STAGE</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setInLevelSelect(true)}
                        className="bg-[#16a34a] text-white border-2 border-[#1b1b20] px-5 py-2 font-comic text-xs font-black uppercase ink-btn cursor-pointer"
                      >
                        STAGE SELECT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Modal */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-[#fffdf0] border-4 sm:border-6 border-[#1b1b20] p-6 text-center max-w-sm w-full ink-shadow-2xl space-y-4 animate-in zoom-in duration-200">
                  <div className="bg-[#dc2626] text-white font-comic text-xs font-black px-3 py-1 uppercase inline-block border-2 border-[#1b1b20] rotate-2">
                    REFLEX OVERLOAD!
                  </div>
                  <h3 className="font-comic text-2xl font-black uppercase text-[#1b1b20]">
                    KNOCKED OUT!
                  </h3>
                  <p className="font-comic text-xs font-bold text-[#5b403d]">
                    Threats Cleared: <span className="text-[#dc2626] font-black">{threatsCleared}</span> • Score: <span className="text-[#38bdf8] font-black">{score.toLocaleString()}</span>
                  </p>

                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => startLevel(selectedLevelId)}
                      className="bg-[#dc2626] text-white border-2 border-[#1b1b20] px-5 py-2 font-comic text-xs font-black uppercase ink-btn flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>TRY AGAIN</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInLevelSelect(true)}
                      className="bg-white text-[#1b1b20] border-2 border-[#1b1b20] px-4 py-2 font-comic text-xs font-black uppercase ink-btn cursor-pointer"
                    >
                      STAGES
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom On-Screen Tactile Action Controls (Responsive Mobile & Desktop) */}
          <div className="bg-[#fffbf0] border-2 border-[#1b1b20] p-3 space-y-3">
            {/* Top row: Spider-Sense Slow-Mo Trigger */}
            <div className="flex items-center justify-between gap-3 bg-white p-2 border border-[#1b1b20]">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-7 h-7 rounded-full bg-[#facc15] border border-[#1b1b20] flex items-center justify-center text-xs">
                  ⚡
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-comic font-black uppercase">
                    <span>SPIDER-SENSE TIME WARP</span>
                    <span>{spiderSenseEnergy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 border border-[#1b1b20]">
                    <div
                      className="h-full bg-gradient-to-r from-[#facc15] to-[#4338ca] transition-all"
                      style={{ width: `${spiderSenseEnergy}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={triggerSpiderSenseSlowMo}
                disabled={spiderSenseEnergy < 40 || isSlowMoActive}
                className="bg-[#4338ca] hover:bg-[#3730a3] disabled:opacity-40 text-white border-2 border-[#1b1b20] px-3 py-1 font-comic text-[10px] font-black uppercase ink-btn cursor-pointer"
              >
                SLOW-MO [E]
              </button>
            </div>

            {/* Responsive On-Screen Action Buttons Grid */}
            <div className="grid grid-cols-5 gap-2 font-comic text-xs font-black uppercase">
              <button
                type="button"
                onClick={() => handleAction('LEFT')}
                className="bg-white hover:bg-[#ffdf9f] text-[#1b1b20] border-2 border-[#1b1b20] py-3.5 px-2 flex flex-col items-center justify-center ink-btn ink-shadow-xs active:scale-95 cursor-pointer"
              >
                <span className="text-base">←</span>
                <span className="text-[10px] mt-0.5">LEFT [A]</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('JUMP')}
                className="bg-[#0284c7] hover:bg-[#0369a1] text-white border-2 border-[#1b1b20] py-3.5 px-2 flex flex-col items-center justify-center ink-btn ink-shadow-xs active:scale-95 cursor-pointer"
              >
                <span className="text-base">↑</span>
                <span className="text-[10px] mt-0.5">JUMP [W]</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('WEB')}
                className="bg-[#dc2626] hover:bg-[#b8121d] text-white border-2 border-[#1b1b20] py-3.5 px-2 flex flex-col items-center justify-center ink-btn ink-shadow-xs active:scale-95 cursor-pointer"
              >
                <span className="text-base">🕸️</span>
                <span className="text-[10px] mt-0.5">WEB [SPACE]</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('DUCK')}
                className="bg-[#b45309] hover:bg-[#92400e] text-white border-2 border-[#1b1b20] py-3.5 px-2 flex flex-col items-center justify-center ink-btn ink-shadow-xs active:scale-95 cursor-pointer"
              >
                <span className="text-base">↓</span>
                <span className="text-[10px] mt-0.5">DUCK [S]</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('RIGHT')}
                className="bg-white hover:bg-[#ffdf9f] text-[#1b1b20] border-2 border-[#1b1b20] py-3.5 px-2 flex flex-col items-center justify-center ink-btn ink-shadow-xs active:scale-95 cursor-pointer"
              >
                <span className="text-base">→</span>
                <span className="text-[10px] mt-0.5">RIGHT [D]</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
