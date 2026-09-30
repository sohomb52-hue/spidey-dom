import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playSound } from '../../utils/audio';
import { useSpiderAuth } from '../../context/AuthContext';
import { LikeButton } from '../common/LikeButton';
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
  Award
} from 'lucide-react';

interface SpiderSenseGameProps {
  onBackToArcade: () => void;
  onAddScore?: (points: number) => void;
}

type DangerAction = 'LEFT' | 'RIGHT' | 'JUMP' | 'DUCK' | 'WEB';
type GameDifficultyMode = 'TRAINING' | 'ARCADE' | 'INSANE';

interface DangerEvent {
  id: number;
  type: 'car' | 'debris' | 'projectile' | 'enemy' | 'electric' | 'web_trap';
  name: string;
  icon: string;
  requiredAction: DangerAction;
  actionHint: string;
  direction: 'left' | 'right' | 'top' | 'center';
  windowSeconds: number;
  spawnTime: number;
}

export const SpiderSenseGame: React.FC<SpiderSenseGameProps> = ({
  onBackToArcade,
  onAddScore
}) => {
  const { userProfile, recordSession } = useSpiderAuth();

  // Local storage stats
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('spider_sense_reaction_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      gamesPlayed: 0,
      highestScore: 2450,
      highestCombo: 7,
      fastestReaction: 0.28,
      averageReaction: 0.44
    };
  });

  const [gameMode, setGameMode] = useState<GameDifficultyMode>('ARCADE');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);
  const [reactionTimesList, setReactionTimesList] = useState<number[]>([]);
  const [activeDanger, setActiveDanger] = useState<DangerEvent | null>(null);
  const [feedbackText, setFeedbackText] = useState<{ text: string; color: string; sub?: string } | null>(null);
  const [spiderSenseAura, setSpiderSenseAura] = useState<boolean>(false);
  const [spideyPose, setSpideyPose] = useState<'READY' | 'JUMP' | 'DUCK' | 'DODGE_L' | 'DODGE_R' | 'WEB' | 'HIT'>('READY');
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  const dangerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextSpawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeDangerRef = useRef<DangerEvent | null>(null);

  // Sync ref with state
  useEffect(() => {
    activeDangerRef.current = activeDanger;
  }, [activeDanger]);

  // Awaken title based on combo
  const getSenseTitle = (c: number) => {
    if (c >= 20) return '🕷️ SPIDER-SENSE MASTER';
    if (c >= 10) return 'SPIDER-SENSE x3';
    if (c >= 5) return 'SPIDER-SENSE x2';
    if (c >= 3) return 'SPIDER-SENSE AWAKENED';
    return null;
  };

  // Danger Definitions Pool
  const dangerPool: Omit<DangerEvent, 'id' | 'spawnTime' | 'windowSeconds'>[] = [
    {
      type: 'car',
      name: 'CHARGING SPEEDER CAB',
      icon: '🚗',
      requiredAction: 'JUMP',
      actionHint: 'JUMP OVER IT! [↑ JUMP]',
      direction: 'left'
    },
    {
      type: 'debris',
      name: 'FALLING MASONRY BRICKS',
      icon: '🧱',
      requiredAction: 'LEFT',
      actionHint: 'VAULT ASIDE! [← LEFT]',
      direction: 'top'
    },
    {
      type: 'projectile',
      name: 'PUMPKIN BOMB GLIDER MISSILE',
      icon: '💥',
      requiredAction: 'WEB',
      actionHint: 'WEB TRAP IN MID-AIR! [SPACE / WEB]',
      direction: 'right'
    },
    {
      type: 'enemy',
      name: 'RHINO CRUSHING CHARGE',
      icon: '👊',
      requiredAction: 'DUCK',
      actionHint: 'DUCK UNDER THE SWING! [↓ DUCK]',
      direction: 'center'
    },
    {
      type: 'electric',
      name: 'ELECTRO VOLTAGE SHOCK',
      icon: '⚡',
      requiredAction: 'RIGHT',
      actionHint: 'EVADE RIGHT! [→ RIGHT]',
      direction: 'left'
    },
    {
      type: 'web_trap',
      name: 'SYMBIOTE TENDRIL NET',
      icon: '🕸️',
      requiredAction: 'WEB',
      actionHint: 'FIRE COUNTER WEB! [SPACE / WEB]',
      direction: 'center'
    }
  ];

  // Spawn Next Danger Routine
  const spawnDanger = useCallback(() => {
    if (!isPlaying || gameOver) return;

    // Clear previous danger timeout
    if (dangerTimeoutRef.current) {
      clearTimeout(dangerTimeoutRef.current);
    }

    const template = dangerPool[Math.floor(Math.random() * dangerPool.length)];

    // Calculate dynamic reaction window based on score & mode
    let baseWindow = 0.95;
    if (gameMode === 'TRAINING') baseWindow = 1.35;
    else if (gameMode === 'INSANE') baseWindow = 0.55;

    // Gradually compress window with score (down to 0.40s in Arcade)
    const compression = Math.min(0.35, Math.floor(score / 500) * 0.04);
    const windowSeconds = Math.max(0.38, baseWindow - compression);

    const newDanger: DangerEvent = {
      ...template,
      id: Date.now(),
      windowSeconds,
      spawnTime: performance.now()
    };

    setActiveDanger(newDanger);
    setSpiderSenseAura(true);
    setSpideyPose('READY');
    playSound('spider-sense');

    // Danger expiration timer (player did not react in time)
    dangerTimeoutRef.current = setTimeout(() => {
      handleDangerMiss();
    }, windowSeconds * 1000);
  }, [isPlaying, gameOver, gameMode, score]);

  // Handle Miss / Expired Reaction
  const handleDangerMiss = useCallback(() => {
    if (!activeDangerRef.current) return;

    playSound('bam');
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 350);

    setSpideyPose('HIT');
    setSpiderSenseAura(false);
    setActiveDanger(null);
    setFeedbackText({
      text: '💥 HIT! TOO SLOW!',
      color: '#ef4444',
      sub: 'LIVES -1 • COMBO RESET'
    });

    setCombo(0);

    // If Arcade or Insane, deduct life
    if (gameMode !== 'TRAINING') {
      setLives((prevLives) => {
        const next = prevLives - 1;
        if (next <= 0) {
          triggerGameOver();
          return 0;
        }
        return next;
      });
    }

    // Schedule next attack if still alive
    nextSpawnTimeoutRef.current = setTimeout(() => {
      setFeedbackText(null);
      setSpideyPose('READY');
      spawnDanger();
    }, 1100);
  }, [gameMode, spawnDanger]);

  // Handle Player Action Input
  const handleAction = useCallback((action: DangerAction) => {
    if (!isPlaying || gameOver || !activeDangerRef.current) return;

    const danger = activeDangerRef.current;
    const now = performance.now();
    const deltaSeconds = (now - danger.spawnTime) / 1000;

    // Clear danger expiration timer
    if (dangerTimeoutRef.current) {
      clearTimeout(dangerTimeoutRef.current);
      dangerTimeoutRef.current = null;
    }

    setActiveDanger(null);
    setSpiderSenseAura(false);

    // Update Pose based on action
    if (action === 'JUMP') setSpideyPose('JUMP');
    else if (action === 'DUCK') setSpideyPose('DUCK');
    else if (action === 'LEFT') setSpideyPose('DODGE_L');
    else if (action === 'RIGHT') setSpideyPose('DODGE_R');
    else if (action === 'WEB') setSpideyPose('WEB');

    // Check if player executed CORRECT action
    const isCorrect = action === danger.requiredAction;

    if (isCorrect) {
      playSound('correct');

      // Record reaction time
      setLastReactionTime(parseFloat(deltaSeconds.toFixed(3)));
      setReactionTimesList((prev) => [...prev, deltaSeconds]);

      // Calculate rating & XP
      let ratingText = 'GOOD';
      let ratingColor = '#22c55e';
      let earnedXP = 75;

      if (deltaSeconds < 0.30) {
        ratingText = '⚡ PERFECT!';
        ratingColor = '#facc15';
        earnedXP = 250;
      } else if (deltaSeconds <= 0.60) {
        ratingText = '✓ GREAT!';
        ratingColor = '#38bdf8';
        earnedXP = 150;
      }

      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));

      const comboMultiplier = Math.min(5, Math.floor(newCombo / 3) + 1);
      const points = earnedXP * comboMultiplier;

      setScore((s) => s + points);
      if (onAddScore) {
        onAddScore(points);
      }

      setFeedbackText({
        text: ratingText,
        color: ratingColor,
        sub: `${deltaSeconds.toFixed(2)}s • +${points} PTS`
      });

      // Schedule next attack
      const nextDelay = gameMode === 'INSANE' ? 600 : gameMode === 'TRAINING' ? 1400 : 900;
      nextSpawnTimeoutRef.current = setTimeout(() => {
        setFeedbackText(null);
        setSpideyPose('READY');
        spawnDanger();
      }, nextDelay);
    } else {
      // Wrong Action Input
      playSound('wrong');
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);

      setSpideyPose('HIT');
      setCombo(0);

      setFeedbackText({
        text: '❌ WRONG REACTION!',
        color: '#ef4444',
        sub: `Needed ${danger.requiredAction}!`
      });

      if (gameMode !== 'TRAINING') {
        setLives((prevLives) => {
          const next = prevLives - 1;
          if (next <= 0) {
            triggerGameOver();
            return 0;
          }
          return next;
        });
      }

      nextSpawnTimeoutRef.current = setTimeout(() => {
        setFeedbackText(null);
        setSpideyPose('READY');
        spawnDanger();
      }, 1200);
    }
  }, [isPlaying, gameOver, combo, gameMode, onAddScore, spawnDanger]);

  // Game Over trigger
  const triggerGameOver = useCallback(() => {
    playSound('bam');
    setGameOver(true);
    setIsPlaying(false);

    const finalScore = score;
    const finalMaxCombo = maxCombo;
    const fastest = reactionTimesList.length > 0 ? Math.min(...reactionTimesList) : stats.fastestReaction;
    const average =
      reactionTimesList.length > 0
        ? reactionTimesList.reduce((a, b) => a + b, 0) / reactionTimesList.length
        : stats.averageReaction;

    const isBest = finalScore > stats.highestScore || fastest < stats.fastestReaction;
    if (isBest) {
      setIsNewHighScore(true);
      playSound('unlock');
    }

    // Update Stats
    const updatedStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      highestScore: Math.max(stats.highestScore, finalScore),
      highestCombo: Math.max(stats.highestCombo, finalMaxCombo),
      fastestReaction: parseFloat(fastest.toFixed(3)),
      averageReaction: parseFloat(average.toFixed(3))
    };
    setStats(updatedStats);
    try {
      localStorage.setItem('spider_sense_reaction_stats', JSON.stringify(updatedStats));
    } catch {
      // ignore
    }

    // Record session to Firestore
    if (recordSession) {
      recordSession({
        gameMode: 'spider_sense_reaction',
        score: finalScore,
        questionsAnswered: reactionTimesList.length,
        correctAnswers: reactionTimesList.length,
        accuracy: 100,
        bestStreak: finalMaxCombo,
        xpEarned: Math.floor(finalScore / 5),
        completedAt: new Date().toISOString(),
        factsDiscovered: 0
      }).catch(() => {
        // network safe
      });
    }
  }, [score, maxCombo, reactionTimesList, stats, recordSession]);

  // Start / Restart Game
  const startGame = (mode: GameDifficultyMode = gameMode) => {
    // Clear any pending timeouts
    if (dangerTimeoutRef.current) clearTimeout(dangerTimeoutRef.current);
    if (nextSpawnTimeoutRef.current) clearTimeout(nextSpawnTimeoutRef.current);

    setGameMode(mode);
    setScore(0);
    setLives(mode === 'TRAINING' ? 99 : 3);
    setCombo(0);
    setMaxCombo(0);
    setLastReactionTime(null);
    setReactionTimesList([]);
    setFeedbackText(null);
    setSpideyPose('READY');
    setSpiderSenseAura(false);
    setIsNewHighScore(false);
    setGameOver(false);
    setIsPlaying(true);

    playSound('thwip');

    // Spawn first danger after brief countdown
    nextSpawnTimeoutRef.current = setTimeout(() => {
      spawnDanger();
    }, 800);
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) {
        if (e.code === 'Space' && !isPlaying) {
          e.preventDefault();
          startGame(gameMode);
        }
        return;
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        handleAction('LEFT');
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        handleAction('RIGHT');
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        handleAction('JUMP');
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        handleAction('DUCK');
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleAction('WEB');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, gameMode, handleAction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (dangerTimeoutRef.current) clearTimeout(dangerTimeoutRef.current);
      if (nextSpawnTimeoutRef.current) clearTimeout(nextSpawnTimeoutRef.current);
    };
  }, []);

  return (
    <section
      className={`space-y-4 max-w-5xl mx-auto select-none ${screenShake ? 'shake-comic' : ''}`}
      id="spider-sense-cabinet"
    >
      {/* Header Banner */}
      <div className="border-4 sm:border-6 border-[#1b1b20] bg-gradient-to-r from-[#180b2a] via-[#4338ca] to-[#dc2626] text-white p-4 sm:p-6 ink-shadow-red-multi relative overflow-hidden">
        <div className="comic-dots-yellow absolute inset-0 opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#1b1b20] text-[#facc15] font-comic text-xs font-black px-2.5 py-0.5 border border-white/40 uppercase">
                ARCADE GAME #08 • SPIDER-SENSE
              </span>
              <span className="bg-[#dc2626] text-white font-comic text-[10px] font-black px-2 py-0.5 border border-white/40 uppercase">
                {gameMode} MODE
              </span>
            </div>
            <h2 className="font-comic text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
              ⚡ SPIDER-SENSE: REAL-TIME REFLEX DUEL
            </h2>
            <p className="font-comic text-xs sm:text-sm text-white/90 font-semibold mt-0.5">
              “YOUR REFLEXES VS THE MULTIVERSE.” React before the danger strikes! Jump, duck, dodge, or web!
            </p>
          </div>

          <button
            onClick={onBackToArcade}
            className="self-start sm:self-center bg-white hover:bg-[#ffdf9f] text-[#1b1b20] border-3 border-[#1b1b20] px-4 py-2 font-comic text-xs sm:text-sm font-black uppercase ink-btn ink-shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ARCADE</span>
          </button>
        </div>
      </div>

      {/* Comic In-Game Live HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-4 border-[#1b1b20] bg-white p-3 sm:p-4 depth-shadow-comic font-comic">
        <div className="border-2 border-[#1b1b20] bg-[#fff0f0] p-2 text-center">
          <span className="text-[10px] font-black uppercase text-[#dc2626] block">LIVES REMAINING</span>
          <span className="text-xl sm:text-2xl font-black text-[#dc2626]">
            {gameMode === 'TRAINING' ? '❤️ ∞' : '❤️'.repeat(Math.max(0, lives)) || '💀'}
          </span>
        </div>

        <div className="border-2 border-[#1b1b20] bg-[#f0ecf4] p-2 text-center">
          <span className="text-[10px] font-black uppercase text-[#1b1b20] block">SCORE</span>
          <span className="text-xl sm:text-2xl font-black text-[#1b1b20]">{score.toLocaleString()}</span>
        </div>

        <div className="border-2 border-[#1b1b20] bg-[#fefce8] p-2 text-center">
          <span className="text-[10px] font-black uppercase text-[#854d0e] block">
            {getSenseTitle(combo) || 'COMBO STREAK'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#b45309] flex items-center justify-center gap-1">
            <Zap className="w-4 h-4" /> x{combo}
          </span>
        </div>

        <div className="border-2 border-[#1b1b20] bg-[#1b1b20] text-white p-2 text-center">
          <span className="text-[10px] font-black uppercase text-[#facc15] block">LAST REACTION</span>
          <span className="text-xl sm:text-2xl font-black text-white">
            {lastReactionTime !== null ? `${lastReactionTime}s` : '---'}
          </span>
        </div>
      </div>

      {/* Main Game Stage Scene */}
      <div
        className={`relative border-4 sm:border-6 border-[#1b1b20] bg-gradient-to-b from-[#0f0919] via-[#24113a] to-[#1e1b4b] h-[360px] sm:h-[440px] overflow-hidden depth-shadow-comic flex flex-col justify-between p-4 ${
          spiderSenseAura ? 'ring-4 ring-[#facc15]' : ''
        }`}
      >
        {/* City Skyline Background Silhouettes */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg viewBox="0 0 800 440" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 440 L0 260 L60 260 L60 210 L120 210 L120 280 L180 280 L180 180 L230 180 L230 140 L240 140 L240 280 L310 280 L310 200 L370 200 L370 120 L420 120 L420 300 L500 300 L500 170 L560 170 L560 260 L640 260 L640 160 L700 160 L700 440 Z" fill="#090514"/>
          </svg>
        </div>

        {/* Top Danger Announcement Banner */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#1b1b20] text-white font-comic text-xs font-black px-2.5 py-1 border border-white/30 uppercase">
              MODE: {gameMode}
            </span>
          </div>

          {activeDanger && (
            <div className="bg-[#dc2626] text-white font-comic font-black text-sm sm:text-base px-4 py-1 border-3 border-[#1b1b20] shadow-[3px_3px_0px_0px_#1b1b20] animate-bounce flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span>DANGER: {activeDanger.name}!</span>
            </div>
          )}
        </div>

        {/* Center Stage: Spider-Man and Incoming Hazard */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          {/* Active Hazard Flying In */}
          {activeDanger && (
            <div
              className={`absolute transition-all duration-200 z-20 flex flex-col items-center ${
                activeDanger.direction === 'left'
                  ? 'left-6 sm:left-14 bottom-16'
                  : activeDanger.direction === 'right'
                  ? 'right-6 sm:right-14 bottom-16'
                  : activeDanger.direction === 'top'
                  ? 'top-8'
                  : 'right-1/4 top-16'
              }`}
            >
              <div className="text-5xl sm:text-6xl filter drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse">
                {activeDanger.icon}
              </div>
              <span className="bg-[#1b1b20] text-[#facc15] font-comic text-[11px] font-black px-2 py-0.5 border border-white mt-1 uppercase shadow-md">
                {activeDanger.actionHint}
              </span>
            </div>
          )}

          {/* Central Spider-Man Character Illustration */}
          <div className="relative flex flex-col items-center">
            {/* Spider-Sense Radiating Waves on Head */}
            {spiderSenseAura && (
              <div className="absolute -top-14 flex items-center justify-center animate-ping">
                <span className="font-comic font-black text-3xl sm:text-4xl text-[#facc15] drop-shadow-[0_0_8px_#facc15]">
                  ⚡ ⚡ ⚡
                </span>
              </div>
            )}

            {/* Pose-dependent SVG character */}
            <div
              className={`w-36 h-36 sm:w-44 sm:h-44 transition-transform duration-150 ${
                spideyPose === 'JUMP'
                  ? '-translate-y-16 scale-105'
                  : spideyPose === 'DUCK'
                  ? 'translate-y-8 scale-90'
                  : spideyPose === 'DODGE_L'
                  ? '-translate-x-14 rotate-[-12deg]'
                  : spideyPose === 'DODGE_R'
                  ? 'translate-x-14 rotate-[12deg]'
                  : spideyPose === 'WEB'
                  ? 'scale-110'
                  : spideyPose === 'HIT'
                  ? 'rotate-[-25deg] scale-95 opacity-80'
                  : 'scale-100'
              }`}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[4px_4px_0_#1b1b20]">
                {/* Spidey Torso in Combat Ready Stance */}
                <ellipse cx="100" cy="120" rx="30" ry="38" fill="#dc2626" stroke="#1b1b20" strokeWidth="5"/>
                <path d="M78 110 Q100 95 122 110 L118 145 Q100 155 82 145 Z" fill="#1d4ed8" stroke="#1b1b20" strokeWidth="3"/>
                <circle cx="100" cy="122" r="6" fill="#1b1b20"/>

                {/* Mask / Head */}
                <ellipse cx="100" cy="70" rx="26" ry="32" fill="#dc2626" stroke="#1b1b20" strokeWidth="5"/>
                <g stroke="#1b1b20" strokeWidth="2.5" fill="none">
                  <line x1="100" y1="38" x2="100" y2="102"/>
                  <path d="M78 60 Q100 70 122 60"/>
                  <path d="M76 80 Q100 90 124 80"/>
                </g>
                {/* White Eyes */}
                <path d="M82 65 Q94 58 97 70 Q92 78 80 73 Z" fill="#ffffff" stroke="#1b1b20" strokeWidth="3.5"/>
                <path d="M118 65 Q106 58 103 70 Q108 78 120 73 Z" fill="#ffffff" stroke="#1b1b20" strokeWidth="3.5"/>

                {/* Web stream if pose is WEB */}
                {spideyPose === 'WEB' && (
                  <path d="M115 110 L180 80 L195 75" stroke="#ffffff" strokeWidth="6" strokeLinecap="round"/>
                )}
              </svg>
            </div>

            {/* In-Game Comic Feedback Popup ("PERFECT!", "GREAT!", "HIT!") */}
            {feedbackText && (
              <div
                className="absolute -top-10 font-comic font-black text-2xl sm:text-3xl px-3 py-1 border-3 border-black shadow-[3px_3px_0px_0px_#1b1b20] -rotate-3 animate-impact-pop z-30"
                style={{ backgroundColor: feedbackText.color, color: '#1b1b20' }}
              >
                <div>{feedbackText.text}</div>
                {feedbackText.sub && (
                  <div className="text-xs font-bold text-black uppercase tracking-wider">
                    {feedbackText.sub}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Start Screen Overlay */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 text-white z-20">
            <div className="bg-[#1b1b20] border-4 border-white p-6 max-w-md ink-shadow-red-multi">
              <span className="text-4xl block mb-2">⚡</span>
              <h3 className="font-comic text-3xl sm:text-4xl font-black uppercase text-[#facc15]">
                SPIDER-SENSE DUEL
              </h3>
              <p className="font-comic text-xs sm:text-sm text-white/90 font-bold mt-2 leading-relaxed">
                incoming hazards test your real-time reflexes! When danger enters the screen, react instantly with the corresponding maneuver!
              </p>

              {/* Mode Selection Tabs */}
              <div className="my-4 pt-3 border-t-2 border-white/20">
                <span className="font-comic text-[11px] font-black text-white/70 uppercase block mb-1.5">
                  SELECT DIFFICULTY MODE:
                </span>
                <div className="grid grid-cols-3 gap-2 font-comic text-xs font-black uppercase">
                  {(['TRAINING', 'ARCADE', 'INSANE'] as GameDifficultyMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setGameMode(mode)}
                      className={`py-1.5 px-2 border-2 transition-all cursor-pointer ${
                        gameMode === mode
                          ? 'bg-[#dc2626] text-white border-white scale-105 shadow-sm'
                          : 'bg-[#2a2a35] text-white/80 border-white/30 hover:bg-[#3a3a48]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => startGame(gameMode)}
                className="w-full py-3 bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-base font-black uppercase border-3 border-white shadow-[4px_4px_0px_0px_#1b1b20] cursor-pointer ink-btn"
              >
                COMMENCE REFLEX TEST →
              </button>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-center p-6 text-white z-30 animate-impact-pop">
            <div className="bg-[#1b1b20] border-4 sm:border-6 border-white p-6 sm:p-8 max-w-lg w-full ink-shadow-red-multi">
              <div className="bg-[#dc2626] text-white font-comic font-black text-2xl sm:text-3xl px-4 py-1 border-3 border-white inline-block -rotate-2 mb-2">
                💥 SENSES OVERLOADED!
              </div>

              <h3 className="font-comic text-xl sm:text-2xl font-black uppercase text-white mt-1">
                REFLEX DUEL FINISHED
              </h3>

              {isNewHighScore && (
                <div className="bg-[#facc15] text-[#1b1b20] font-comic text-xs font-black py-1 px-3 border border-black mt-1 uppercase inline-block">
                  🏆 NEW HIGH SCORE!
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-5 text-left font-comic">
                <div className="bg-[#2a2a35] p-2 border border-white/20">
                  <span className="text-[10px] text-white/60 uppercase block">SCORE</span>
                  <span className="text-lg font-black text-[#facc15]">{score.toLocaleString()}</span>
                </div>
                <div className="bg-[#2a2a35] p-2 border border-white/20">
                  <span className="text-[10px] text-white/60 uppercase block">BEST COMBO</span>
                  <span className="text-lg font-black text-white">x{maxCombo}</span>
                </div>
                <div className="bg-[#2a2a35] p-2 border border-white/20">
                  <span className="text-[10px] text-white/60 uppercase block">FASTEST</span>
                  <span className="text-lg font-black text-[#38bdf8]">
                    {stats.fastestReaction}s
                  </span>
                </div>
                <div className="bg-[#2a2a35] p-2 border border-white/20">
                  <span className="text-[10px] text-white/60 uppercase block">AVERAGE</span>
                  <span className="text-lg font-black text-[#22c55e]">
                    {stats.averageReaction}s
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => startGame(gameMode)}
                  className="w-full sm:flex-1 py-2.5 bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-sm font-black uppercase border-2 border-white shadow-[3px_3px_0px_0px_#1b1b20] cursor-pointer flex items-center justify-center gap-1.5 ink-btn"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>PLAY AGAIN</span>
                </button>
                <button
                  type="button"
                  onClick={onBackToArcade}
                  className="w-full sm:flex-1 py-2.5 bg-white hover:bg-[#eaeaea] text-[#1b1b20] font-comic text-sm font-black uppercase border-2 border-[#1b1b20] shadow-[3px_3px_0px_0px_#1b1b20] cursor-pointer flex items-center justify-center gap-1.5 ink-btn"
                >
                  <span>BACK TO ARCADE</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE & DESKTOP 5-WAY TOUCH CONTROLS */}
      <div className="border-4 sm:border-5 border-[#1b1b20] bg-white p-3 sm:p-4 depth-shadow-comic">
        <div className="flex items-center justify-between mb-2">
          <span className="font-comic text-xs font-black text-[#5b403d] uppercase">
            REFLEX CONTROLS (TAP OR KEYBOARD):
          </span>
          <span className="font-comic text-[10px] font-bold text-[#1b1b20] uppercase hidden sm:inline">
            KEYBOARD: ←, →, ↑, ↓, SPACE
          </span>
        </div>

        {/* 5 Large, Comfortable Comic Action Buttons */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 font-comic">
          <button
            type="button"
            disabled={!isPlaying || gameOver}
            onClick={() => handleAction('LEFT')}
            className="p-3 sm:p-4 bg-[#f0ece1] hover:bg-[#38bdf8] hover:text-white disabled:opacity-40 border-3 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] active:scale-95 transition-all text-center flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="text-xl sm:text-2xl">←</span>
            <span className="text-[10px] sm:text-xs font-black uppercase mt-1">LEFT</span>
          </button>

          <button
            type="button"
            disabled={!isPlaying || gameOver}
            onClick={() => handleAction('RIGHT')}
            className="p-3 sm:p-4 bg-[#f0ece1] hover:bg-[#38bdf8] hover:text-white disabled:opacity-40 border-3 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] active:scale-95 transition-all text-center flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="text-xl sm:text-2xl">→</span>
            <span className="text-[10px] sm:text-xs font-black uppercase mt-1">RIGHT</span>
          </button>

          <button
            type="button"
            disabled={!isPlaying || gameOver}
            onClick={() => handleAction('JUMP')}
            className="p-3 sm:p-4 bg-[#fefce8] hover:bg-[#facc15] disabled:opacity-40 border-3 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] active:scale-95 transition-all text-center flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="text-xl sm:text-2xl">↑</span>
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#854d0e] mt-1">JUMP</span>
          </button>

          <button
            type="button"
            disabled={!isPlaying || gameOver}
            onClick={() => handleAction('DUCK')}
            className="p-3 sm:p-4 bg-[#fefce8] hover:bg-[#facc15] disabled:opacity-40 border-3 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] active:scale-95 transition-all text-center flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="text-xl sm:text-2xl">↓</span>
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#854d0e] mt-1">DUCK</span>
          </button>

          <button
            type="button"
            disabled={!isPlaying || gameOver}
            onClick={() => handleAction('WEB')}
            className="p-3 sm:p-4 bg-[#fff0f0] hover:bg-[#dc2626] hover:text-white disabled:opacity-40 border-3 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] active:scale-95 transition-all text-center flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="text-xl sm:text-2xl">🕸️</span>
            <span className="text-[10px] sm:text-xs font-black uppercase text-[#991b1b] mt-1">WEB</span>
          </button>
        </div>
      </div>

      {/* Footer Stats and Like Button */}
      <div className="border-4 border-[#1b1b20] bg-white p-4 depth-shadow-comic flex flex-wrap items-center justify-between gap-4 font-comic">
        <div className="flex items-center gap-3 text-xs font-bold text-[#5b403d]">
          <span className="font-black text-[#1b1b20] uppercase">TIMING RANKS:</span>
          <span>⚡ &lt;0.30s PERFECT (+250 XP) • ✓ 0.30-0.60s GREAT (+150 XP) • 0.60-0.90s GOOD (+75 XP)</span>
        </div>

        <div className="flex items-center gap-3">
          <LikeButton id="game-spider-sense" initialLikes={2150} label="LIKE GAME" compact />
          <div className="bg-[#f0ece1] border-2 border-[#1b1b20] px-3 py-1 text-xs font-black uppercase">
            🏆 BEST: {stats.highestScore.toLocaleString()} PTS (⚡ {stats.fastestReaction}s)
          </div>
        </div>
      </div>
    </section>
  );
};
