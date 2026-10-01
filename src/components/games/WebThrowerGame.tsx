/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playSound } from '../../utils/audio';
import { useSpiderAuth } from '../../context/AuthContext';
import { LikeButton } from '../common/LikeButton';
import {
  WEB_THROWER_LEVELS,
  WebThrowerLevelConfig,
  ArcadeDifficulty,
  DIFFICULTY_MULTIPLIERS
} from '../../data/arcadeLevelsData';
import {
  Target,
  Crosshair,
  RefreshCw,
  Zap,
  Trophy,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
  Star,
  Play,
  Pause,
  ArrowRight,
  Lock,
  CheckCircle2,
  RotateCcw,
  Gauge,
  Flame,
  Radio
} from 'lucide-react';

interface WebThrowerGameProps {
  onBackToArcade: () => void;
  onAddScore?: (points: number) => void;
}

interface TargetItem {
  id: number;
  type: 'goblin' | 'vulture' | 'docock' | 'mysterio' | 'drone' | 'bonus' | 'pumpkin_bomb';
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  points: number;
  icon: string;
  isHit: boolean;
  hitProgress: number;
  bobPhase: number;
  isDecoy?: boolean;
}

interface WebProjectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  radius: number;
  life: number;
  trail: { x: number; y: number }[];
}

interface WebSplat {
  id: number;
  x: number;
  y: number;
  scale: number;
  maxScale: number;
  life: number;
  color: string;
  text?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  size: number;
  life: number;
}

export const WebThrowerGame: React.FC<WebThrowerGameProps> = ({
  onBackToArcade,
  onAddScore
}) => {
  const { userProfile, recordSession, syncAnswerResult } = useSpiderAuth();

  // Local storage for level progress
  const [levelProgress, setLevelProgress] = useState<Record<number, { unlocked: boolean; stars: number; bestScore: number; bestAccuracy: number }>>(() => {
    try {
      const saved = localStorage.getItem('spider_web_thrower_levels_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      1: { unlocked: true, stars: 0, bestScore: 0, bestAccuracy: 0 },
      2: { unlocked: false, stars: 0, bestScore: 0, bestAccuracy: 0 },
      3: { unlocked: false, stars: 0, bestScore: 0, bestAccuracy: 0 },
      4: { unlocked: false, stars: 0, bestScore: 0, bestAccuracy: 0 },
      5: { unlocked: false, stars: 0, bestScore: 0, bestAccuracy: 0 },
      6: { unlocked: false, stars: 0, bestScore: 0, bestAccuracy: 0 },
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

  // Live Gameplay Telemetry
  const [score, setScore] = useState<number>(0);
  const [ammo, setAmmo] = useState<number>(15);
  const [maxAmmo, setMaxAmmo] = useState<number>(15);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [shotsFired, setShotsFired] = useState<number>(0);
  const [shotsHit, setShotsHit] = useState<number>(0);
  const [spiderSenseEnergy, setSpiderSenseEnergy] = useState<number>(0);
  const [isSlowMoActive, setIsSlowMoActive] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [levelStarsWon, setLevelStarsWon] = useState<number>(0);
  const [lockedTargetName, setLockedTargetName] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const crosshairRef = useRef<{ x: number; y: number }>({ x: 450, y: 240 });

  const currentLevelConfig = WEB_THROWER_LEVELS.find((l) => l.id === selectedLevelId) || WEB_THROWER_LEVELS[0];

  // =========================================================================
  // 2D BALLISTIC PHYSICS & PROJECTILE ENGINE MUTABLE STATE
  // =========================================================================
  const engineRef = useRef({
    level: currentLevelConfig,
    difficulty: difficulty,
    scoreVal: 0,
    comboVal: 1,
    maxComboVal: 1,
    ammoVal: 15,
    timeLeftVal: 45,
    shotsFiredVal: 0,
    shotsHitVal: 0,
    spiderSenseEnergy: 0,
    isSlowMoActive: false,
    slowMoTimer: 0,

    targets: [] as TargetItem[],
    projectiles: [] as WebProjectile[],
    splats: [] as WebSplat[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],

    lockedTarget: null as TargetItem | null,
    gameOverTriggered: false,
    victoryTriggered: false,
    lastFrameTime: performance.now(),
    lastSpawnTime: performance.now(),
  });

  // Save progress helper
  const saveProgress = (levelId: number, stars: number, finalScore: number, accuracyPct: number) => {
    setLevelProgress((prev) => {
      const current = prev[levelId] || { unlocked: true, stars: 0, bestScore: 0, bestAccuracy: 0 };
      const updatedStars = Math.max(current.stars, stars);
      const updatedScore = Math.max(current.bestScore, finalScore);
      const updatedAcc = Math.max(current.bestAccuracy, accuracyPct);

      const nextLevelId = levelId + 1;
      const nextLevelState = prev[nextLevelId] || { unlocked: false, stars: 0, bestScore: 0, bestAccuracy: 0 };

      const updated = {
        ...prev,
        [levelId]: {
          unlocked: true,
          stars: updatedStars,
          bestScore: updatedScore,
          bestAccuracy: updatedAcc,
        },
        ...(stars > 0 && nextLevelId <= WEB_THROWER_LEVELS.length
          ? { [nextLevelId]: { ...nextLevelState, unlocked: true } }
          : {}),
      };

      try {
        localStorage.setItem('spider_web_thrower_levels_v2', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Spawn dynamic villain target
  const spawnTarget = useCallback((config: WebThrowerLevelConfig, canvasWidth: number, canvasHeight: number): TargetItem => {
    const allowed = config.allowedTargetTypes;
    const type = allowed[Math.floor(Math.random() * allowed.length)];
    const startFromLeft = Math.random() > 0.5;

    let name = 'GREEN GOBLIN';
    let icon = '👺';
    let points = 250;
    let radius = 24;
    let speed = (1.8 + Math.random() * 1.6) * config.speedMultiplier;

    if (type === 'vulture') {
      name = 'THE VULTURE';
      icon = '🦅';
      points = 180;
      radius = 26;
      speed = (2.2 + Math.random() * 1.8) * config.speedMultiplier;
    } else if (type === 'docock') {
      name = 'DOC OCK TENTACLE';
      icon = '🐙';
      points = 320;
      radius = 28;
      speed = (1.5 + Math.random() * 1.2) * config.speedMultiplier;
    } else if (type === 'mysterio') {
      name = 'MYSTERIO DRONE';
      icon = '🔮';
      points = 260;
      radius = 22;
      speed = (2.0 + Math.random() * 1.5) * config.speedMultiplier;
    } else if (type === 'bonus') {
      name = 'GOLDEN SPIDER-TOKEN';
      icon = '⭐';
      points = 500;
      radius = 18;
      speed = (2.8 + Math.random() * 2.0) * config.speedMultiplier;
    } else if (type === 'pumpkin_bomb') {
      name = 'PUMPKIN BOMB';
      icon = '💥';
      points = 400;
      radius = 16;
      speed = (3.2 + Math.random() * 2.2) * config.speedMultiplier;
    } else {
      name = 'OSCORP DRONE';
      icon = '🎯';
      points = 150;
      radius = 20;
      speed = (1.9 + Math.random() * 1.4) * config.speedMultiplier;
    }

    const startX = startFromLeft ? -30 : canvasWidth + 30;
    const startY = 70 + Math.random() * (canvasHeight - 160);
    const vx = (startFromLeft ? 1 : -1) * speed;

    return {
      id: Date.now() + Math.random(),
      type,
      name,
      x: startX,
      y: startY,
      vx,
      vy: (Math.random() - 0.5) * 1.2,
      radius,
      points,
      icon,
      isHit: false,
      hitProgress: 0,
      bobPhase: Math.random() * Math.PI * 2,
      isDecoy: type === 'mysterio' && Math.random() > 0.6,
    };
  }, []);

  // Start Level with countdown sequence
  const startLevel = (levelId: number) => {
    const config = WEB_THROWER_LEVELS.find((l) => l.id === levelId) || WEB_THROWER_LEVELS[0];
    setSelectedLevelId(levelId);
    setInLevelSelect(false);
    setIsPlaying(false);
    setIsPaused(false);
    setLevelVictory(false);
    setGameOver(false);
    setScore(0);
    setAmmo(18);
    setMaxAmmo(18);
    setTimeLeft(config.timeLimitSeconds);
    setCombo(1);
    setMaxCombo(1);
    setShotsFired(0);
    setShotsHit(0);
    setSpiderSenseEnergy(0);
    setIsSlowMoActive(false);
    setLockedTargetName(null);
    setCountdown(3);

    // Reset Engine State
    engineRef.current = {
      level: config,
      difficulty: difficulty,
      scoreVal: 0,
      comboVal: 1,
      maxComboVal: 1,
      ammoVal: 18,
      timeLeftVal: config.timeLimitSeconds,
      shotsFiredVal: 0,
      shotsHitVal: 0,
      spiderSenseEnergy: 0,
      isSlowMoActive: false,
      slowMoTimer: 0,
      targets: [],
      projectiles: [],
      splats: [],
      particles: [],
      floatingTexts: [],
      lockedTarget: null,
      gameOverTriggered: false,
      victoryTriggered: false,
      lastFrameTime: performance.now(),
      lastSpawnTime: performance.now(),
    };

    // Spawn initial 4 targets
    const initialTargets: TargetItem[] = [];
    for (let i = 0; i < 4; i++) {
      initialTargets.push(spawnTarget(config, 900, 480));
    }
    engineRef.current.targets = initialTargets;

    playSound('click');

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev > 1) {
          playSound('tick');
          return prev - 1;
        }
        clearInterval(timer);
        playSound('thwip');
        setIsPlaying(true);
        return null;
      });
    }, 700);
  };

  // =========================================================================
  // SHOOT WEB PROJECTILE ACTION (2D Ballistics)
  // =========================================================================
  const shootWeb = useCallback(() => {
    if (!isPlaying || isPaused || gameOver || levelVictory) return;
    const engine = engineRef.current;

    if (engine.ammoVal <= 0) {
      playSound('wrong');
      engine.floatingTexts.push({
        id: Date.now(),
        text: 'OUT OF WEB-FLUID! RELOAD!',
        x: crosshairRef.current.x,
        y: crosshairRef.current.y - 20,
        color: '#dc2626',
        size: 13,
        life: 0.6,
      });
      return;
    }

    engine.ammoVal--;
    setAmmo(engine.ammoVal);
    engine.shotsFiredVal++;
    setShotsFired(engine.shotsFiredVal);

    playSound('web_shoot');

    // Launch origin: Bottom center of screen (Spider-Man's wrist)
    const originX = 450;
    const originY = 470;
    const targetX = crosshairRef.current.x;
    const targetY = crosshairRef.current.y;

    const dx = targetX - originX;
    const dy = targetY - originY;
    const dist = Math.hypot(dx, dy) || 1;

    // High velocity projectile with slight parabolic trajectory
    const speed = 26.0;
    const projectile: WebProjectile = {
      id: Date.now() + Math.random(),
      x: originX,
      y: originY,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed - 1.5, // slight upward arc
      targetX,
      targetY,
      radius: 6,
      life: 1.0,
      trail: [{ x: originX, y: originY }],
    };

    engine.projectiles.push(projectile);
  }, [isPlaying, isPaused, gameOver, levelVictory]);

  // Reload Web Fluid
  const reloadWeb = useCallback(() => {
    if (!isPlaying || isPaused || gameOver || levelVictory) return;
    const engine = engineRef.current;
    if (engine.ammoVal < maxAmmo) {
      engine.ammoVal = maxAmmo;
      setAmmo(maxAmmo);
      playSound('powerup');
      engine.floatingTexts.push({
        id: Date.now(),
        text: 'WEB CARTRIDGE RELOADED!',
        x: crosshairRef.current.x,
        y: crosshairRef.current.y - 30,
        color: '#38bdf8',
        size: 13,
        life: 0.7,
      });
    }
  }, [isPlaying, isPaused, gameOver, levelVictory, maxAmmo]);

  // Activate Spider-Sense Slow-Mo Mode
  const triggerSpiderSenseSlowMo = useCallback(() => {
    const engine = engineRef.current;
    if (engine.spiderSenseEnergy >= 40 && !engine.isSlowMoActive) {
      engine.isSlowMoActive = true;
      engine.slowMoTimer = 4.0;
      engine.spiderSenseEnergy = Math.max(0, engine.spiderSenseEnergy - 40);
      setSpiderSenseEnergy(engine.spiderSenseEnergy);
      setIsSlowMoActive(true);
      playSound('slowmo');

      engine.floatingTexts.push({
        id: Date.now(),
        text: '⚡ SPIDER-SENSE MATRIX ACTIVATED!',
        x: 450,
        y: 200,
        color: '#facc15',
        size: 16,
        life: 1.2,
      });
    }
  }, []);

  // Mouse / Pointer Move Handler
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = 900 / rect.width;
    const scaleY = 480 / rect.height;

    const x = Math.max(0, Math.min(900, (e.clientX - rect.left) * scaleX));
    const y = Math.max(0, Math.min(480, (e.clientY - rect.top) * scaleY));

    crosshairRef.current = { x, y };

    // Dynamic Target Lock-on Detection
    const engine = engineRef.current;
    let locked: TargetItem | null = null;
    for (const t of engine.targets) {
      if (!t.isHit && Math.hypot(t.x - x, t.y - y) <= t.radius + 18) {
        locked = t;
        break;
      }
    }
    engine.lockedTarget = locked;
    setLockedTargetName(locked ? locked.name : null);
  };

  // Keyboard Controller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        shootWeb();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        reloadWeb();
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
  }, [isPlaying, isPaused, gameOver, levelVictory, shootWeb, reloadWeb, triggerSpiderSenseSlowMo]);

  // Main 60 FPS Canvas Ballistics & Target Simulation Loop
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver || levelVictory) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = (currentTime: number) => {
      const engine = engineRef.current;
      const rawDt = Math.min((currentTime - engine.lastFrameTime) / 1000, 0.05);
      engine.lastFrameTime = currentTime;

      const timeScale = engine.isSlowMoActive ? 0.38 : 1.0;
      const dt = rawDt * timeScale;

      const level = engine.level;
      const diffMult = DIFFICULTY_MULTIPLIERS[engine.difficulty];

      // Update Slow-Mo Timer
      if (engine.isSlowMoActive) {
        engine.slowMoTimer -= rawDt;
        if (engine.slowMoTimer <= 0) {
          engine.isSlowMoActive = false;
          setIsSlowMoActive(false);
        }
      }

      // Update Game Timer
      engine.timeLeftVal -= dt;
      setTimeLeft(Math.max(0, Math.ceil(engine.timeLeftVal)));

      if (engine.timeLeftVal <= 0 && !engine.victoryTriggered && !engine.gameOverTriggered) {
        // Evaluate Level Result
        const accuracy = engine.shotsFiredVal > 0 ? Math.round((engine.shotsHitVal / engine.shotsFiredVal) * 100) : 0;
        if (engine.scoreVal >= level.targetScore) {
          engine.victoryTriggered = true;
          setLevelVictory(true);
          playSound('level_complete');

          let stars = 1;
          if (engine.scoreVal >= level.targetScore * 1.3) stars++;
          if (accuracy >= level.accuracyTarget) stars++;
          setLevelStarsWon(stars);

          saveProgress(level.id, stars, engine.scoreVal, accuracy);
          if (onAddScore) onAddScore(engine.scoreVal);
          syncAnswerResult(true, level.xpReward, engine.maxComboVal);
          recordSession({
            gameMode: `web_thrower_lvl_${level.id}`,
            score: engine.scoreVal,
            questionsAnswered: engine.shotsFiredVal,
            correctAnswers: engine.shotsHitVal,
            accuracy,
            bestStreak: engine.maxComboVal,
            xpEarned: level.xpReward,
            completedAt: new Date().toISOString(),
            factsDiscovered: 1,
          });
        } else {
          engine.gameOverTriggered = true;
          setGameOver(true);
          playSound('game_over');
          saveProgress(level.id, 0, engine.scoreVal, accuracy);
          if (onAddScore) onAddScore(engine.scoreVal);
        }
        return;
      }

      // =====================================================================
      // 1. SPAWN TARGETS DYNAMICALLY
      // =====================================================================
      if (currentTime - engine.lastSpawnTime > (engine.isSlowMoActive ? 2200 : 1200) && engine.targets.length < 7) {
        engine.targets.push(spawnTarget(level, canvas.width, canvas.height));
        engine.lastSpawnTime = currentTime;
      }

      // =====================================================================
      // 2. SIMULATE TARGET MOVEMENT & FLIGHT ARCS
      // =====================================================================
      for (let i = engine.targets.length - 1; i >= 0; i--) {
        const t = engine.targets[i];
        if (t.isHit) {
          t.hitProgress += dt * 3.5;
          if (t.hitProgress >= 1.0) {
            engine.targets.splice(i, 1);
          }
          continue;
        }

        // Sinusoidal flight arc bobbing
        t.x += t.vx * dt * 60;
        t.y += (t.vy + Math.sin(currentTime * 0.004 + t.bobPhase) * 1.2) * dt * 60;

        // Despawn offscreen
        if (t.x < -60 || t.x > canvas.width + 60) {
          engine.targets.splice(i, 1);
        }
      }

      // =====================================================================
      // 3. SIMULATE WEB PROJECTILE BALLISTICS (2D Physics Engine)
      // =====================================================================
      for (let i = engine.projectiles.length - 1; i >= 0; i--) {
        const proj = engine.projectiles[i];

        // Apply gravity and trajectory integration
        proj.vy += 4.5 * dt; // slight downward drop
        proj.x += proj.vx * dt * 60;
        proj.y += proj.vy * dt * 60;

        proj.trail.push({ x: proj.x, y: proj.y });
        if (proj.trail.length > 8) proj.trail.shift();

        proj.life -= dt * 1.8;

        // Projectile Collision Detection with Villain Targets
        let hitTarget = false;
        for (const t of engine.targets) {
          if (!t.isHit && Math.hypot(proj.x - t.x, proj.y - t.y) <= proj.radius + t.radius) {
            hitTarget = true;
            t.isHit = true;
            t.hitProgress = 0.1;

            engine.shotsHitVal++;
            setShotsHit(engine.shotsHitVal);

            // Combo & Points
            const newCombo = engine.comboVal + 1;
            engine.comboVal = Math.min(5, newCombo);
            engine.maxComboVal = Math.max(engine.maxComboVal, newCombo);
            setCombo(engine.comboVal);
            setMaxCombo(engine.maxComboVal);

            const isBullseye = Math.hypot(proj.x - t.x, proj.y - t.y) < t.radius * 0.45;
            const basePts = t.points * (isBullseye ? 1.5 : 1.0);
            const slowMoBonus = engine.isSlowMoActive ? 2 : 1;
            const ptsEarned = Math.round(basePts * diffMult.scoreMult * engine.comboVal * slowMoBonus);

            engine.scoreVal += ptsEarned;
            setScore(engine.scoreVal);

            // Spider-Sense Energy Refill
            engine.spiderSenseEnergy = Math.min(100, engine.spiderSenseEnergy + (isBullseye ? 18 : 10));
            setSpiderSenseEnergy(Math.round(engine.spiderSenseEnergy));

            if (isBullseye) {
              playSound('perfect');
            } else {
              playSound('bam');
            }

            // Web Splat Decal
            engine.splats.push({
              id: Date.now() + Math.random(),
              x: t.x,
              y: t.y,
              scale: 0.2,
              maxScale: 1.0,
              life: 1.2,
              color: '#ffffff',
              text: isBullseye ? 'BULLSEYE!' : 'THWIP!',
            });

            // Comic Floating Text
            engine.floatingTexts.push({
              id: Date.now() + Math.random(),
              text: isBullseye ? `🎯 BULLSEYE! +${ptsEarned}` : `+${ptsEarned} (${engine.comboVal}x)`,
              x: t.x,
              y: t.y - 25,
              color: isBullseye ? '#facc15' : '#38bdf8',
              size: isBullseye ? 15 : 13,
              life: 0.8,
            });

            // Web Fluid Spark Particles
            for (let p = 0; p < 12; p++) {
              engine.particles.push({
                x: t.x,
                y: t.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: '#ffffff',
                size: 3.5,
                life: 0.4,
                maxLife: 0.4,
              });
            }
            break;
          }
        }

        if (hitTarget || proj.life <= 0 || proj.y < -30 || proj.x < -30 || proj.x > canvas.width + 30) {
          if (!hitTarget && proj.life <= 0) {
            // Missed shot breaks combo
            engine.comboVal = 1;
            setCombo(1);
          }
          engine.projectiles.splice(i, 1);
        }
      }

      // =====================================================================
      // 4. CANVAS RENDERING
      // =====================================================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, level.skyColors[0]);
      skyGrad.addColorStop(0.6, level.skyColors[1]);
      skyGrad.addColorStop(1, level.skyColors[2]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Halftone Dots
      ctx.fillStyle = 'rgba(27, 27, 32, 0.08)';
      for (let x = 0; x < canvas.width; x += 12) {
        for (let y = 0; y < canvas.height; y += 12) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Skyline Rooftops Backdrop
      ctx.fillStyle = 'rgba(15, 17, 26, 0.7)';
      for (let b = 0; b < 10; b++) {
        const bx = b * 100;
        const bh = 140 + (b % 4) * 40;
        ctx.fillRect(bx, canvas.height - bh, 90, bh);
        ctx.strokeStyle = '#1b1b20';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, canvas.height - bh, 90, bh);
      }

      // Render Active Villain Targets
      for (const t of engine.targets) {
        ctx.save();
        ctx.translate(t.x, t.y);

        if (t.isHit) {
          // Shrink & spin on web hit
          const scale = 1.0 - t.hitProgress;
          ctx.scale(scale, scale);
          ctx.rotate(t.hitProgress * Math.PI * 4);
        }

        // Target Body Sphere
        ctx.beginPath();
        ctx.arc(0, 0, t.radius, 0, Math.PI * 2);
        ctx.fillStyle = t.type === 'bonus' ? '#facc15' : t.type === 'pumpkin_bomb' ? '#ea580c' : '#1b1b20';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Target Emoji / Icon
        ctx.font = `${t.radius * 1.2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t.icon, 0, 0);

        // Lock-On Diamond Ring if hovered
        if (engine.lockedTarget?.id === t.id && !t.isHit) {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(-t.radius - 8, -t.radius - 8, (t.radius + 8) * 2, (t.radius + 8) * 2);
        }

        ctx.restore();
      }

      // Render Web Projectiles
      for (const proj of engine.projectiles) {
        // Web Line Beam from origin
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.moveTo(450, 470);
        ctx.lineTo(proj.x, proj.y);
        ctx.stroke();

        // Projectile Head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1b1b20';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Render Web Splats
      for (let s = engine.splats.length - 1; s >= 0; s--) {
        const splat = engine.splats[s];
        splat.scale = Math.min(splat.maxScale, splat.scale + dt * 4);
        splat.life -= dt;

        if (splat.life <= 0) {
          engine.splats.splice(s, 1);
        } else {
          ctx.save();
          ctx.translate(splat.x, splat.y);
          ctx.scale(splat.scale, splat.scale);

          // Web Webbing Spidersplat
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 2.5;
          for (let r = 0; r < 8; r++) {
            const rad = (r * Math.PI) / 4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(rad) * 28, Math.sin(rad) * 28);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(0, 0, 16, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Render Particles & Floating Text
      for (let p = engine.particles.length - 1; p >= 0; p--) {
        const part = engine.particles[p];
        part.x += part.vx;
        part.y += part.vy;
        part.life -= dt;

        if (part.life <= 0) {
          engine.particles.splice(p, 1);
        } else {
          ctx.fillStyle = part.color;
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size * (part.life / part.maxLife), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let f = engine.floatingTexts.length - 1; f >= 0; f--) {
        const ft = engine.floatingTexts[f];
        ft.y -= 25 * dt;
        ft.life -= dt;

        if (ft.life <= 0) {
          engine.floatingTexts.splice(f, 1);
        } else {
          ctx.font = `black ${ft.size}px 'Anybody', sans-serif`;
          ctx.fillStyle = ft.color;
          ctx.strokeStyle = '#1b1b20';
          ctx.lineWidth = 3;
          ctx.strokeText(ft.text, ft.x, ft.y);
          ctx.fillText(ft.text, ft.x, ft.y);
        }
      }

      // Render Interactive Crosshair
      const ch = crosshairRef.current;
      ctx.save();
      ctx.translate(ch.x, ch.y);

      // Outer Red Crosshair Circle
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.strokeStyle = engine.lockedTarget ? '#facc15' : '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Crosshair Lines
      ctx.beginPath();
      ctx.moveTo(-24, 0);
      ctx.lineTo(-8, 0);
      ctx.moveTo(8, 0);
      ctx.lineTo(24, 0);
      ctx.moveTo(0, -24);
      ctx.lineTo(0, -8);
      ctx.moveTo(0, 8);
      ctx.lineTo(0, 24);
      ctx.stroke();

      // Center Dot
      ctx.fillStyle = engine.lockedTarget ? '#facc15' : '#dc2626';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isPaused, gameOver, levelVictory, spawnTarget, saveProgress, syncAnswerResult, recordSession, onAddScore]);

  return (
    <section className="space-y-6" id="web-thrower-arcade-game">
      {/* Header Banner */}
      <div className="border-4 sm:border-6 border-[#1b1b20] bg-gradient-to-r from-[#dc2626] via-[#b8121d] to-[#1e1b4b] text-white p-4 sm:p-6 ink-shadow-red-multi relative overflow-hidden">
        <div className="comic-dots-red absolute inset-0 opacity-25 pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-[#1b1b20] text-[#facc15] font-comic text-xs font-black px-2.5 py-0.5 uppercase border border-white">
                ARCADE ENGINE #01
              </span>
              <span className="bg-white text-[#dc2626] font-comic text-xs font-black px-2 py-0.5 uppercase">
                2D BALLISTIC WEB SNIPER
              </span>
            </div>
            <h1 className="font-comic text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              WEB THROWER 3D
            </h1>
            <p className="font-comic text-xs sm:text-sm font-semibold text-white/90 mt-1 max-w-xl">
              Ballistic projectile physics, dynamic lock-on reticles, Spider-Sense slow-mo, and progressive villain stages!
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
                SELECT SNIPER STAGE & DIFFICULTY
              </h2>
              <p className="font-comic text-xs text-[#5b403d] font-bold mt-0.5">
                Target flying villains and pumpkin bombs to earn ⭐⭐⭐ stars and unlock boss climax gauntlets!
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
            {WEB_THROWER_LEVELS.map((lvl) => {
              const prog = levelProgress[lvl.id] || { unlocked: lvl.unlockedByDefault || false, stars: 0, bestScore: 0, bestAccuracy: 0 };
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
                        STAGE {lvl.id} • {lvl.timeLimitSeconds}s LIMIT
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
                    <p className="font-comic text-[11px] font-black text-[#dc2626] uppercase">
                      {lvl.subtitle}
                    </p>
                    <p className="text-xs text-[#5b403d] font-sans mt-2 line-clamp-2">
                      {lvl.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-gray-200 grid grid-cols-2 gap-2 text-[10px] font-comic font-bold text-[#1b1b20]">
                      <div>TARGET SCORE: <span className="font-black text-[#dc2626]">{lvl.targetScore.toLocaleString()}</span></div>
                      <div>ACCURACY GOAL: <span className="font-black text-[#facc15]">⭐ {lvl.accuracyTarget}%</span></div>
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
                          : 'bg-[#dc2626] hover:bg-[#b8121d] text-white border-2 border-[#1b1b20] ink-btn cursor-pointer'
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
      {/* 2. PLAYABLE CANVAS VIEWPORT                        */}
      {/* ================================================== */}
      {!inLevelSelect && (
        <div className="border-4 sm:border-6 border-[#1b1b20] bg-black p-2 sm:p-4 ink-shadow-xl space-y-3">
          {/* Top HUD Bar */}
          <div className="bg-[#1b1b20] text-white p-2.5 sm:p-3 border-2 border-white/40 flex flex-wrap items-center justify-between gap-3 text-xs font-comic font-black uppercase">
            <div className="flex items-center gap-3">
              <span className="bg-[#dc2626] px-2 py-0.5 border border-white">
                STAGE {currentLevelConfig.id}: {currentLevelConfig.name}
              </span>
              <span className="text-[#facc15]">
                TIME: <span className="text-white font-mono">{timeLeft}s</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span>SCORE: <span className="text-[#38bdf8] font-mono">{score.toLocaleString()}</span></span>
              <span>AMMO: <span className="text-[#facc15] font-mono">{ammo}/{maxAmmo}</span></span>
              <span className={`px-2 py-0.5 border ${combo > 1 ? 'bg-[#dc2626] text-white animate-pulse' : 'bg-white/10 text-white/70'}`}>
                {combo}x COMBO
              </span>
              <span className="text-green-400 font-mono hidden sm:inline">
                ACC: {shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 0}%
              </span>
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

          {/* Main 2D Canvas Container */}
          <div
            ref={containerRef}
            className={`relative w-full h-[420px] sm:h-[480px] border-3 border-[#1b1b20] overflow-hidden select-none bg-black cursor-crosshair ${
              screenShake ? 'shake-comic' : ''
            }`}
            onPointerMove={handlePointerMove}
            onPointerDown={(e) => {
              handlePointerMove(e);
              shootWeb();
            }}
          >
            <canvas
              ref={canvasRef}
              width={900}
              height={480}
              className="w-full h-full object-cover block pointer-events-none"
            />

            {/* Lock-on HUD Indicator Overlay */}
            {lockedTargetName && (
              <div className="absolute top-3 left-3 bg-[#1b1b20] border-2 border-[#facc15] px-3 py-1 font-comic text-[11px] font-black text-[#facc15] uppercase tracking-wider pointer-events-none animate-pulse">
                🎯 LOCK-ON: {lockedTargetName}
              </div>
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center pointer-events-none z-30 animate-in zoom-in duration-200">
                <div className="text-center font-comic font-black text-white">
                  <div className="text-7xl sm:text-9xl text-[#facc15] drop-shadow-[0_6px_0_#1b1b20]">
                    {countdown}
                  </div>
                  <div className="text-xl sm:text-2xl uppercase tracking-widest text-[#dc2626]">
                    LOCK & LOAD WEBS!
                  </div>
                </div>
              </div>
            )}

            {/* Pause Overlay */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-30">
                <div className="bg-[#fffdf0] border-4 border-[#1b1b20] p-6 text-center max-w-sm w-full ink-shadow-xl space-y-4">
                  <h3 className="font-comic text-2xl font-black uppercase text-[#1b1b20]">
                    GAME PAUSED
                  </h3>
                  <p className="font-comic text-xs font-bold text-[#5b403d]">
                    Aim crosshair and Click / Press SPACE to fire web-fluid. Press 'R' to reload cartridges.
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPaused(false)}
                      className="bg-[#dc2626] text-white px-4 py-2 border-2 border-[#1b1b20] font-comic text-xs font-black uppercase ink-btn cursor-pointer"
                    >
                      RESUME
                    </button>
                    <button
                      type="button"
                      onClick={() => startLevel(selectedLevelId)}
                      className="bg-white text-[#1b1b20] px-4 py-2 border-2 border-[#1b1b20] font-comic text-xs font-black uppercase ink-btn cursor-pointer"
                    >
                      RESTART
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stage Victory Modal */}
            {levelVictory && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-40 p-4">
                <div className="bg-[#fffdf0] border-4 sm:border-6 border-[#1b1b20] p-6 sm:p-8 max-w-md w-full text-center ink-shadow-2xl space-y-4 animate-in zoom-in duration-200">
                  <div className="bg-[#16a34a] text-white font-comic text-xs font-black px-3 py-1 uppercase inline-block border-2 border-[#1b1b20] -rotate-2">
                    SNIPER TRIAL CLEARED!
                  </div>
                  <h3 className="font-comic text-3xl font-black uppercase text-[#1b1b20]">
                    {currentLevelConfig.name}
                  </h3>

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
                      <span>FINAL SCORE:</span>
                      <span className="font-black text-[#38bdf8]">{score.toLocaleString()} PTS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ACCURACY:</span>
                      <span className="font-black text-[#facc15]">{shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MAX COMBO:</span>
                      <span className="font-black text-[#16a34a]">{maxCombo}x</span>
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
                    {selectedLevelId < WEB_THROWER_LEVELS.length ? (
                      <button
                        type="button"
                        onClick={() => startLevel(selectedLevelId + 1)}
                        className="bg-[#dc2626] text-white border-2 border-[#1b1b20] px-5 py-2 font-comic text-xs font-black uppercase ink-btn flex items-center gap-1.5 cursor-pointer"
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
              <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center z-40 p-4">
                <div className="bg-[#fffdf0] border-4 sm:border-6 border-[#1b1b20] p-6 text-center max-w-sm w-full ink-shadow-2xl space-y-4 animate-in zoom-in duration-200">
                  <div className="bg-[#dc2626] text-white font-comic text-xs font-black px-3 py-1 uppercase inline-block border-2 border-[#1b1b20] rotate-2">
                    TIME EXPIRED!
                  </div>
                  <h3 className="font-comic text-2xl font-black uppercase text-[#1b1b20]">
                    TARGET GOAL MISSED!
                  </h3>
                  <p className="font-comic text-xs font-bold text-[#5b403d]">
                    Score: <span className="text-[#38bdf8] font-black">{score.toLocaleString()}</span> / Goal: {currentLevelConfig.targetScore.toLocaleString()}
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

          {/* Bottom Interactive Controls HUD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#fffbf0] border-2 border-[#1b1b20] p-3 text-xs font-comic font-black uppercase text-[#1b1b20]">
            {/* Spider-Sense Slow-Mo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#facc15] border-2 border-[#1b1b20] flex items-center justify-center flex-shrink-0">
                ⚡
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span>SPIDER-SENSE SLOW-MO</span>
                  <span>{spiderSenseEnergy}%</span>
                </div>
                <div className="w-full bg-gray-200 h-3 border border-[#1b1b20] p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#facc15] to-[#dc2626] transition-all"
                    style={{ width: `${spiderSenseEnergy}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={triggerSpiderSenseSlowMo}
                disabled={spiderSenseEnergy < 40 || isSlowMoActive}
                className="bg-[#facc15] hover:bg-[#eab308] disabled:opacity-40 text-[#1b1b20] border-2 border-[#1b1b20] px-2.5 py-1 text-[10px] font-black cursor-pointer ink-btn"
              >
                SLOW-MO [E]
              </button>
            </div>

            {/* Reload Web Cartridge */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0284c7] border-2 border-[#1b1b20] flex items-center justify-center text-white flex-shrink-0">
                🔄
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span>WEB CARTRIDGES</span>
                  <span>{ammo}/{maxAmmo}</span>
                </div>
                <div className="w-full bg-gray-200 h-3 border border-[#1b1b20] p-0.5">
                  <div
                    className="h-full bg-[#0284c7] transition-all"
                    style={{ width: `${(ammo / maxAmmo) * 100}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={reloadWeb}
                disabled={ammo === maxAmmo}
                className="bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-40 text-white border-2 border-[#1b1b20] px-2.5 py-1 text-[10px] font-black cursor-pointer ink-btn"
              >
                RELOAD [R]
              </button>
            </div>

            {/* Controls Guide */}
            <div className="text-[10px] text-[#5b403d] flex items-center justify-end gap-2">
              <span>CLICK / [SPACE] = SHOOT WEB • [R] = RELOAD • [E] = SLOW-MO MATRIX</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
