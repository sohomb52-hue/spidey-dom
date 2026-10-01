/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playSound } from '../../utils/audio';
import { useSpiderAuth } from '../../context/AuthContext';
import { LikeButton } from '../common/LikeButton';
import {
  WEB_SWING_LEVELS,
  WebSwingLevelConfig,
  ArcadeDifficulty,
  DIFFICULTY_MULTIPLIERS
} from '../../data/arcadeLevelsData';
import {
  Trophy,
  Zap,
  RotateCcw,
  ArrowLeft,
  Flame,
  ShieldAlert,
  Sparkles,
  Compass,
  Star,
  Play,
  Pause,
  ArrowRight,
  Lock,
  CheckCircle2,
  SlidersHorizontal,
  Target,
  Gauge
} from 'lucide-react';

interface WebSwingGameProps {
  onBackToArcade: () => void;
  onAddScore?: (points: number) => void;
}

export interface BuildingAnchorPoint {
  id: string;
  x: number;
  y: number;
  type: 'roof_corner_left' | 'roof_corner_right' | 'antenna_spire' | 'water_tower';
  buildingIndex: number;
  score?: number;
}

interface Building {
  id: number;
  x: number;
  width: number;
  height: number;
  color: string;
  windows: { x: number; y: number; lit: boolean }[];
  hvacOnTop?: boolean;
  antennaOnTop?: boolean;
  anchors: BuildingAnchorPoint[];
}

interface Token {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  type: 'token' | 'web_fluid';
  bobOffset: number;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  type: 'drone' | 'pumpkin_bomb' | 'electric_tower' | 'falling_debris';
  warned: boolean;
  dodged: boolean;
  bobPhase: number;
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

export const WebSwingGame: React.FC<WebSwingGameProps> = ({
  onBackToArcade,
  onAddScore
}) => {
  const { userProfile, recordSession, syncAnswerResult } = useSpiderAuth();

  // Local storage for level progress & high scores
  const [levelProgress, setLevelProgress] = useState<Record<number, { unlocked: boolean; stars: number; bestScore: number; bestDist: number }>>(() => {
    try {
      const saved = localStorage.getItem('spider_web_swing_levels_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      1: { unlocked: true, stars: 0, bestScore: 0, bestDist: 0 },
      2: { unlocked: false, stars: 0, bestScore: 0, bestDist: 0 },
      3: { unlocked: false, stars: 0, bestScore: 0, bestDist: 0 },
      4: { unlocked: false, stars: 0, bestScore: 0, bestDist: 0 },
      5: { unlocked: false, stars: 0, bestScore: 0, bestDist: 0 },
      6: { unlocked: false, stars: 0, bestScore: 0, bestDist: 0 },
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
  const [distance, setDistance] = useState<number>(0);
  const [tokensCount, setTokensCount] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [spiderSenseEnergy, setSpiderSenseEnergy] = useState<number>(0);
  const [isSlowMoActive, setIsSlowMoActive] = useState<boolean>(false);
  const [boostEnergy, setBoostEnergy] = useState<number>(100);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [levelStarsWon, setLevelStarsWon] = useState<number>(0);

  // Physics Telemetry for HUD
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [gForce, setGForce] = useState<number>(1.0);
  const [hasTargetedAnchor, setHasTargetedAnchor] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const keysPressedRef = useRef<Record<string, boolean>>({});

  const currentLevelConfig = WEB_SWING_LEVELS.find((l) => l.id === selectedLevelId) || WEB_SWING_LEVELS[0];

  // =========================================================================
  // LIGHTWEIGHT 2D PHYSICS ENGINE & ANCHOR DETECTION MUTABLE STATE
  // =========================================================================
  const engineRef = useRef({
    level: currentLevelConfig,
    difficulty: difficulty,
    distanceMeters: 0,
    scoreVal: 0,
    comboVal: 1,
    maxComboVal: 1,
    tokensVal: 0,
    cameraX: 0,

    // 2D Rigid/Verlet Point Particle Physics
    player: {
      x: 120,
      y: 160,
      vx: 6.5,
      vy: 0,
      ax: 0,
      ay: 0,
      mass: 1.0,
      radius: 18,
      rotation: 0,
      angularVelocity: 0,
      // Rope / Web-Swinging Constraint State
      isWebbed: false,
      anchorX: 0,
      anchorY: 0,
      ropeLength: 0,
      ropeAngle: 0,
      tensionForce: 0,
      lastSwingTime: 0,
      webExtendProgress: 1.0, // 0 to 1 for web shooting animation
    },

    targetedAnchor: null as BuildingAnchorPoint | null,
    isHoldingWeb: false,
    spiderSenseEnergy: 0,
    isSlowMoActive: false,
    slowMoTimer: 0,
    boostEnergy: 100,
    buildings: [] as Building[],
    tokens: [] as Token[],
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    nextBuildingX: 0,
    buildingCounter: 0,
    gameOverTriggered: false,
    victoryTriggered: false,
    lastFrameTime: performance.now(),
    dangerNearby: false,
  });

  // Save progress helper
  const saveProgress = (levelId: number, stars: number, finalScore: number, finalDist: number) => {
    setLevelProgress((prev) => {
      const current = prev[levelId] || { unlocked: true, stars: 0, bestScore: 0, bestDist: 0 };
      const updatedStars = Math.max(current.stars, stars);
      const updatedScore = Math.max(current.bestScore, finalScore);
      const updatedDist = Math.max(current.bestDist, finalDist);

      const nextLevelId = levelId + 1;
      const nextLevelState = prev[nextLevelId] || { unlocked: false, stars: 0, bestScore: 0, bestDist: 0 };

      const updated = {
        ...prev,
        [levelId]: {
          unlocked: true,
          stars: updatedStars,
          bestScore: updatedScore,
          bestDist: updatedDist,
        },
        ...(stars > 0 && nextLevelId <= WEB_SWING_LEVELS.length
          ? { [nextLevelId]: { ...nextLevelState, unlocked: true } }
          : {}),
      };

      try {
        localStorage.setItem('spider_web_swing_levels_v2', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // =========================================================================
  // DYNAMIC ANCHOR POINT DETECTION SYSTEM
  // Analyzes building height, distance, and forward elevation angle
  // =========================================================================
  const detectBestAnchorPoint = useCallback((
    px: number,
    py: number,
    buildings: Building[]
  ): BuildingAnchorPoint | null => {
    let bestAnchor: BuildingAnchorPoint | null = null;
    let highestScore = -Infinity;

    const MIN_DISTANCE = 40;
    const MAX_DISTANCE = 380;
    const MIN_FORWARD_DX = 15;
    const IDEAL_ELEVATION_RAD = 0.85; // ~48 degrees upward

    for (const b of buildings) {
      // Filter out buildings far behind or way ahead of player view
      if (b.x + b.width < px - 60 || b.x > px + 500) continue;

      for (const anchor of b.anchors) {
        const dx = anchor.x - px;
        const dy = anchor.y - py; // negative if anchor is above player
        const dist = Math.hypot(dx, dy);

        // Constraint check: Must be in front, above, and within attachment radius
        if (dx >= MIN_FORWARD_DX && dy <= -12 && dist >= MIN_DISTANCE && dist <= MAX_DISTANCE) {
          // Angle of web relative to forward horizontal
          const elevationAngle = Math.atan2(-dy, dx);
          const angleFitness = Math.max(0, 1.0 - Math.abs(elevationAngle - IDEAL_ELEVATION_RAD) / 1.1);
          const distanceFitness = 1.0 - dist / MAX_DISTANCE;
          const heightAdvantage = Math.min(1.0, (py - anchor.y) / 250);

          // Weight score prioritizing forward swing momentum and height
          const totalScore = angleFitness * 0.45 + distanceFitness * 0.35 + heightAdvantage * 0.2;

          if (totalScore > highestScore) {
            highestScore = totalScore;
            bestAnchor = {
              ...anchor,
              score: totalScore,
            };
          }
        }
      }
    }

    return bestAnchor;
  }, []);

  // Generate buildings ahead with rich candidate anchor points
  const generateWorldAhead = (targetX: number, config: WebSwingLevelConfig) => {
    const engine = engineRef.current;
    let currX = engine.nextBuildingX;

    while (currX < targetX + 1800) {
      const bIndex = ++engine.buildingCounter;
      const width = Math.floor(Math.random() * (260 - 150 + 1)) + 150;
      const height = Math.floor(
        Math.random() * (config.buildingHeightMax - config.buildingHeightMin + 1)
      ) + config.buildingHeightMin;

      const color = config.buildingColors[Math.floor(Math.random() * config.buildingColors.length)];
      const hvacOnTop = Math.random() > 0.45;
      const antennaOnTop = Math.random() > 0.55;

      // Create rich candidate anchor points on rooftop corners and fixtures
      const anchors: BuildingAnchorPoint[] = [
        {
          id: `anc_${bIndex}_left`,
          x: currX + 12,
          y: height + 8,
          type: 'roof_corner_left',
          buildingIndex: bIndex,
        },
        {
          id: `anc_${bIndex}_right`,
          x: currX + width - 12,
          y: height + 8,
          type: 'roof_corner_right',
          buildingIndex: bIndex,
        },
      ];

      if (hvacOnTop) {
        anchors.push({
          id: `anc_${bIndex}_hvac`,
          x: currX + 40,
          y: height - 16,
          type: 'water_tower',
          buildingIndex: bIndex,
        });
      }

      if (antennaOnTop) {
        anchors.push({
          id: `anc_${bIndex}_antenna`,
          x: currX + width - 25,
          y: height - 35,
          type: 'antenna_spire',
          buildingIndex: bIndex,
        });
      }

      // Windows
      const windows: { x: number; y: number; lit: boolean }[] = [];
      const cols = Math.floor(width / 32);
      const rows = Math.floor(height / 36);

      for (let r = 1; r < rows; r++) {
        for (let c = 1; c < cols; c++) {
          windows.push({
            x: c * 32,
            y: r * 36,
            lit: Math.random() > 0.42,
          });
        }
      }

      const building: Building = {
        id: bIndex,
        x: currX,
        width,
        height,
        color,
        windows,
        hvacOnTop,
        antennaOnTop,
        anchors,
      };

      engine.buildings.push(building);

      // Spawn Spider Tokens along arc heights
      if (Math.random() > 0.3) {
        const tokenX = currX + width * 0.5 + (Math.random() - 0.5) * 60;
        const tokenY = height - Math.floor(Math.random() * 100 + 40);
        engine.tokens.push({
          id: Date.now() + Math.random(),
          x: tokenX,
          y: Math.max(70, tokenY),
          collected: false,
          type: Math.random() > 0.82 ? 'web_fluid' : 'token',
          bobOffset: Math.random() * Math.PI * 2,
        });
      }

      // Spawn Obstacles (Drones, Pumpkin Bombs, Falling Debris, High Voltage Towers)
      if (Math.random() < config.obstacleFrequency && config.allowedObstacles.length > 0) {
        const obsType = config.allowedObstacles[Math.floor(Math.random() * config.allowedObstacles.length)];
        const obsX = currX + width + Math.floor(Math.random() * 45);
        const obsY = Math.floor(Math.random() * (height - 70) + 60);

        engine.obstacles.push({
          id: Date.now() + Math.random(),
          x: obsX,
          y: obsY,
          width: obsType === 'electric_tower' ? 36 : 28,
          height: obsType === 'electric_tower' ? 90 : 28,
          vx: obsType === 'pumpkin_bomb' ? -2.8 : obsType === 'drone' ? -1.2 : 0,
          vy: obsType === 'falling_debris' ? 2.8 : 0,
          type: obsType,
          warned: false,
          dodged: false,
          bobPhase: Math.random() * Math.PI * 2,
        });
      }

      const gap = Math.floor(Math.random() * (config.gapMax - config.gapMin + 1)) + config.gapMin;
      currX += width + gap;
    }

    engine.nextBuildingX = currX;
  };

  // Start Level with countdown sequence
  const startLevel = (levelId: number) => {
    const config = WEB_SWING_LEVELS.find((l) => l.id === levelId) || WEB_SWING_LEVELS[0];
    setSelectedLevelId(levelId);
    setInLevelSelect(false);
    setIsPlaying(false);
    setIsPaused(false);
    setLevelVictory(false);
    setGameOver(false);
    setScore(0);
    setDistance(0);
    setTokensCount(0);
    setCombo(1);
    setMaxCombo(1);
    setSpiderSenseEnergy(0);
    setIsSlowMoActive(false);
    setBoostEnergy(100);
    setCountdown(3);

    // Reset physics state
    engineRef.current = {
      level: config,
      difficulty: difficulty,
      distanceMeters: 0,
      scoreVal: 0,
      comboVal: 1,
      maxComboVal: 1,
      tokensVal: 0,
      cameraX: 0,
      player: {
        x: 120,
        y: 160,
        vx: config.baseSpeed,
        vy: 0,
        ax: 0,
        ay: 0,
        mass: 1.0,
        radius: 18,
        rotation: 0,
        angularVelocity: 0,
        isWebbed: false,
        anchorX: 0,
        anchorY: 0,
        ropeLength: 0,
        ropeAngle: 0,
        tensionForce: 0,
        lastSwingTime: 0,
        webExtendProgress: 1.0,
      },
      targetedAnchor: null,
      isHoldingWeb: false,
      spiderSenseEnergy: 0,
      isSlowMoActive: false,
      slowMoTimer: 0,
      boostEnergy: 100,
      buildings: [],
      tokens: [],
      obstacles: [],
      particles: [],
      floatingTexts: [],
      nextBuildingX: 0,
      buildingCounter: 0,
      gameOverTriggered: false,
      victoryTriggered: false,
      lastFrameTime: performance.now(),
      dangerNearby: false,
    };

    generateWorldAhead(1200, config);
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
  // WEB ATTACH ACTION (Uses dynamically detected anchor)
  // =========================================================================
  const handleWebShoot = useCallback(() => {
    if (!isPlaying || isPaused || gameOver || levelVictory) return;
    const engine = engineRef.current;
    const player = engine.player;

    engine.isHoldingWeb = true;

    if (!player.isWebbed) {
      // Use currently targeted anchor or calculate best candidate
      const target = engine.targetedAnchor || detectBestAnchorPoint(player.x, player.y, engine.buildings);

      if (target) {
        player.isWebbed = true;
        player.anchorX = target.x;
        player.anchorY = target.y;

        const rx = player.x - target.x;
        const ry = player.y - target.y;
        player.ropeLength = Math.max(55, Math.hypot(rx, ry));
        player.ropeAngle = Math.atan2(rx, ry);

        // Convert current linear velocity into radial and tangential momentum
        const unitR = { x: rx / player.ropeLength, y: ry / player.ropeLength };
        const unitT = { x: -unitR.y, y: unitR.x };
        const tangentialSpeed = player.vx * unitT.x + player.vy * unitT.y;

        player.angularVelocity = tangentialSpeed / player.ropeLength;
        player.lastSwingTime = performance.now();
        player.webExtendProgress = 0.2; // Start web shoot visual beam

        playSound('web_shoot');

        // Spawn anchor impact particles
        for (let i = 0; i < 8; i++) {
          engine.particles.push({
            x: target.x,
            y: target.y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            color: '#ffffff',
            size: 3.5,
            life: 0.35,
            maxLife: 0.35,
          });
        }
      }
    }
  }, [isPlaying, isPaused, gameOver, levelVictory, detectBestAnchorPoint]);

  // =========================================================================
  // WEB RELEASE ACTION (Translates tangential velocity into linear impulse)
  // =========================================================================
  const handleWebRelease = useCallback(() => {
    const engine = engineRef.current;
    const player = engine.player;
    engine.isHoldingWeb = false;

    if (player.isWebbed) {
      player.isWebbed = false;

      // Project tangential momentum to linear velocity
      const tangentialLinearSpeed = player.angularVelocity * player.ropeLength;
      const rx = player.x - player.anchorX;
      const ry = player.y - player.anchorY;
      const dist = Math.hypot(rx, ry) || 1;
      const unitT = { x: -ry / dist, y: rx / dist };

      // Compute continuous velocity
      player.vx = tangentialLinearSpeed * unitT.x;
      player.vy = tangentialLinearSpeed * unitT.y;

      // Apex Timing Bonus: If released near the lowest point / forward trajectory
      const angleDeviation = Math.abs(player.ropeAngle);
      if (angleDeviation < 0.28 && player.vx > 4.0) {
        const diffMult = DIFFICULTY_MULTIPLIERS[engine.difficulty].scoreMult;
        const bonus = Math.round(200 * diffMult * engine.comboVal);
        player.vx += 2.2; // apex slingshot kick
        player.vy -= 1.8;

        engine.scoreVal += bonus;
        setScore(engine.scoreVal);

        engine.floatingTexts.push({
          id: Date.now() + Math.random(),
          text: 'PERFECT APEX SLINGSHOT! +200',
          x: player.x,
          y: player.y - 32,
          color: '#facc15',
          size: 13,
          life: 0.85,
        });

        playSound('combo');
      } else {
        playSound('web_release');
      }
    }
  }, []);

  // Trigger Spider-Sense Slow-Mo ability
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
        text: '⚡ SPIDER-SENSE TIME WARP!',
        x: engine.player.x,
        y: engine.player.y - 45,
        color: '#facc15',
        size: 15,
        life: 1.2,
      });
    }
  }, []);

  // Trigger Web-Zip Boost
  const triggerBoost = useCallback(() => {
    const engine = engineRef.current;
    if (engine.boostEnergy >= 25) {
      engine.boostEnergy -= 25;
      setBoostEnergy(Math.round(engine.boostEnergy));
      engine.player.vx = Math.min(engine.player.vx + 5.0, engine.level.maxSpeed + 4);
      engine.player.vy -= 3.0;
      playSound('thwip');

      for (let i = 0; i < 12; i++) {
        engine.particles.push({
          x: engine.player.x - 15,
          y: engine.player.y + (Math.random() - 0.5) * 20,
          vx: -Math.random() * 9 - 4,
          vy: (Math.random() - 0.5) * 3,
          color: '#dc2626',
          size: 3.5,
          life: 0.4,
          maxLife: 0.4,
        });
      }
    }
  }, []);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        handleWebShoot();
      } else if (e.code === 'KeyE' || e.code === 'KeyS') {
        triggerSpiderSenseSlowMo();
      } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyW') {
        triggerBoost();
      } else if (e.code === 'Escape' || e.code === 'KeyP') {
        if (isPlaying && !gameOver && !levelVictory) {
          setIsPaused((prev) => !prev);
          playSound('click');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = false;
      if (e.code === 'Space') {
        handleWebRelease();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, isPaused, gameOver, levelVictory, handleWebShoot, handleWebRelease, triggerSpiderSenseSlowMo, triggerBoost]);

  // =========================================================================
  // MAIN 60 FPS CANVAS PHYSICS & ROPE-CONSTRAINT SIMULATION LOOP
  // =========================================================================
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver || levelVictory) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const physicsLoop = (currentTime: number) => {
      const engine = engineRef.current;
      const rawDt = Math.min((currentTime - engine.lastFrameTime) / 1000, 0.05);
      engine.lastFrameTime = currentTime;

      const timeScale = engine.isSlowMoActive ? 0.38 : 1.0;
      const dt = rawDt * timeScale;

      const player = engine.player;
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

      // Passive boost refill
      engine.boostEnergy = Math.min(100, engine.boostEnergy + rawDt * 10);
      setBoostEnergy(Math.round(engine.boostEnergy));

      // Dynamic Anchor Point Scanner
      const activeBestAnchor = detectBestAnchorPoint(player.x, player.y, engine.buildings);
      engine.targetedAnchor = activeBestAnchor;
      setHasTargetedAnchor(activeBestAnchor !== null);

      // =====================================================================
      // 1. SUB-STEPPED NUMERICAL PHYSICS INTEGRATION (Verlet & Distance Constraints)
      // =====================================================================
      const SUB_STEPS = 3;
      const subDt = dt / SUB_STEPS;
      const gravityAcc = level.gravity * 240; // scaled pixels/sec^2

      for (let step = 0; step < SUB_STEPS; step++) {
        if (player.isWebbed) {
          // ROPE-SWINGING CONSTRAINT INTEGRATION
          // Vector from anchor to player
          let rx = player.x - player.anchorX;
          let ry = player.y - player.anchorY;
          let dist = Math.hypot(rx, ry) || 1;

          player.ropeAngle = Math.atan2(rx, ry);

          // Angular Acceleration: alpha = -(g / L) * sin(theta)
          const angularAcc = -(gravityAcc / player.ropeLength) * Math.sin(player.ropeAngle);
          player.angularVelocity += angularAcc * subDt;

          // Air torque influence (A/D or Arrow keys)
          if (keysPressedRef.current['KeyA'] || keysPressedRef.current['ArrowLeft']) {
            player.angularVelocity -= 0.16 * subDt;
          }
          if (keysPressedRef.current['KeyD'] || keysPressedRef.current['ArrowRight']) {
            player.angularVelocity += 0.16 * subDt;
          }

          // Light air drag
          player.angularVelocity *= 0.9992;
          player.ropeAngle += player.angularVelocity * subDt;

          // Re-project position onto constrained circle arc
          player.x = player.anchorX + player.ropeLength * Math.sin(player.ropeAngle);
          player.y = player.anchorY + player.ropeLength * Math.cos(player.ropeAngle);

          // Update linear velocity derived from angular velocity
          const linearTangential = player.angularVelocity * player.ropeLength;
          player.vx = linearTangential * Math.cos(player.ropeAngle);
          player.vy = -linearTangential * Math.sin(player.ropeAngle);

          // Centripetal acceleration (G-Force calculation)
          const centripetalAcc = (linearTangential * linearTangential) / player.ropeLength;
          player.tensionForce = player.mass * (gravityAcc * Math.cos(player.ropeAngle) + centripetalAcc);

          player.rotation = player.ropeAngle;
        } else {
          // AIRBORNE FREE-FALL GRAVITY INTEGRATION
          player.vy += gravityAcc * subDt;
          player.vy = Math.min(player.vy, 16); // Terminal velocity

          // Air control influence
          if (keysPressedRef.current['KeyA'] || keysPressedRef.current['ArrowLeft']) {
            player.vx = Math.max(3.0, player.vx - 4.5 * subDt);
          }
          if (keysPressedRef.current['KeyD'] || keysPressedRef.current['ArrowRight']) {
            player.vx = Math.min(level.maxSpeed * diffMult.speedScale, player.vx + 4.5 * subDt);
          }

          player.x += player.vx * diffMult.speedScale * subDt * 60;
          player.y += player.vy * subDt * 60;

          // Rotation follows flight angle
          player.rotation = Math.atan2(player.vy, player.vx) * 0.4;
          player.tensionForce = 0;
        }
      }

      // Smooth camera interpolation
      engine.cameraX = player.x - 170;

      // Update distance & physics telemetry
      const curDist = Math.floor(player.x / 10);
      engine.distanceMeters = curDist;
      setDistance(curDist);

      const totalVelocity = Math.hypot(player.vx, player.vy);
      setSpeedKmh(Math.round(totalVelocity * 5.2));
      setGForce(parseFloat((1.0 + (player.tensionForce / 400)).toFixed(1)));

      // Expand procedural city skyline ahead
      generateWorldAhead(player.x, level);

      // Level Victory Check
      if (curDist >= level.targetDistance && !engine.victoryTriggered) {
        engine.victoryTriggered = true;
        setLevelVictory(true);
        playSound('level_complete');

        let starsWon = 1;
        if (engine.scoreVal >= level.targetScore) starsWon++;
        if (engine.tokensVal >= level.tokenTarget) starsWon++;
        setLevelStarsWon(starsWon);

        saveProgress(level.id, starsWon, engine.scoreVal, curDist);
        if (onAddScore) onAddScore(engine.scoreVal);
        syncAnswerResult(true, level.xpReward, engine.comboVal);
        recordSession({
          gameMode: `web_swing_lvl_${level.id}`,
          score: engine.scoreVal,
          questionsAnswered: engine.tokensVal,
          correctAnswers: engine.tokensVal,
          accuracy: 100,
          bestStreak: engine.maxComboVal,
          xpEarned: level.xpReward,
          completedAt: new Date().toISOString(),
          factsDiscovered: 1,
        });
        return;
      }

      // Bottom Street Crash Check
      if (player.y > canvas.height - 30 && !engine.gameOverTriggered) {
        engine.gameOverTriggered = true;
        setGameOver(true);
        setScreenShake(true);
        playSound('game_over');

        saveProgress(level.id, 0, engine.scoreVal, curDist);
        if (onAddScore) onAddScore(engine.scoreVal);
        return;
      }

      // Building Rooftop & Ledge Collision
      for (const b of engine.buildings) {
        if (
          player.x + player.radius > b.x &&
          player.x - player.radius < b.x + b.width &&
          player.y + player.radius > b.height
        ) {
          if (!engine.gameOverTriggered) {
            engine.gameOverTriggered = true;
            setGameOver(true);
            setScreenShake(true);
            playSound('hit');

            saveProgress(level.id, 0, engine.scoreVal, curDist);
            if (onAddScore) onAddScore(engine.scoreVal);
            return;
          }
        }
      }

      // Token Pickup Collision
      for (const t of engine.tokens) {
        if (!t.collected) {
          const dx = player.x - t.x;
          const dy = player.y - t.y;
          if (Math.hypot(dx, dy) < player.radius + 18) {
            t.collected = true;
            engine.tokensVal++;
            setTokensCount(engine.tokensVal);

            if (t.type === 'web_fluid') {
              engine.spiderSenseEnergy = Math.min(100, engine.spiderSenseEnergy + 30);
              engine.boostEnergy = 100;
              playSound('powerup');
              engine.floatingTexts.push({
                id: Date.now() + Math.random(),
                text: 'WEB FLUID MAX! +500',
                x: t.x,
                y: t.y - 20,
                color: '#38bdf8',
                size: 14,
                life: 0.85,
              });
            } else {
              engine.comboVal = Math.min(5, engine.comboVal + 1);
              engine.maxComboVal = Math.max(engine.maxComboVal, engine.comboVal);
              setCombo(engine.comboVal);
              setMaxCombo(engine.maxComboVal);

              engine.spiderSenseEnergy = Math.min(100, engine.spiderSenseEnergy + 8);
              setSpiderSenseEnergy(Math.round(engine.spiderSenseEnergy));

              const pts = Math.round(200 * diffMult.scoreMult * engine.comboVal);
              engine.scoreVal += pts;
              setScore(engine.scoreVal);
              playSound('token');

              engine.floatingTexts.push({
                id: Date.now() + Math.random(),
                text: `+${pts} (${engine.comboVal}x)`,
                x: t.x,
                y: t.y - 20,
                color: '#facc15',
                size: 13,
                life: 0.7,
              });
            }

            for (let i = 0; i < 8; i++) {
              engine.particles.push({
                x: t.x,
                y: t.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: t.type === 'web_fluid' ? '#38bdf8' : '#facc15',
                size: 3,
                life: 0.4,
                maxLife: 0.4,
              });
            }
          }
        }
      }

      // Obstacle Collision
      let hasDangerClose = false;
      for (const obs of engine.obstacles) {
        obs.x += obs.vx * diffMult.speedScale * dt * 60;
        obs.y += obs.vy * diffMult.speedScale * dt * 60;

        const distToPlayer = Math.hypot(player.x - obs.x, player.y - obs.y);
        if (distToPlayer < 190) {
          hasDangerClose = true;
          if (!obs.warned) {
            obs.warned = true;
            playSound('spider-sense');
          }
        }

        if (distToPlayer < player.radius + obs.width * 0.5) {
          if (!engine.gameOverTriggered) {
            engine.gameOverTriggered = true;
            setGameOver(true);
            setScreenShake(true);
            playSound('hit');

            saveProgress(level.id, 0, engine.scoreVal, curDist);
            if (onAddScore) onAddScore(engine.scoreVal);
            return;
          }
        }
      }
      engine.dangerNearby = hasDangerClose;

      // =====================================================================
      // 2. CANVAS RENDERING WITH DYNAMIC ANCHOR RETICLE & WEB BEAM
      // =====================================================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Atmospheric Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, level.skyColors[0]);
      skyGrad.addColorStop(0.5, level.skyColors[1]);
      skyGrad.addColorStop(1, level.skyColors[2]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Halftone Comic Dot Pattern
      ctx.fillStyle = 'rgba(27, 27, 32, 0.08)';
      for (let x = 0; x < canvas.width; x += 12) {
        for (let y = 0; y < canvas.height; y += 12) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Parallax Far Skyline (0.15x speed)
      const bgOffset = engine.cameraX * 0.15;
      ctx.fillStyle = 'rgba(15, 17, 26, 0.45)';
      for (let i = -1; i < 12; i++) {
        const sx = i * 160 - (bgOffset % 160);
        const sh = 180 + (i % 3) * 60;
        ctx.fillRect(sx, canvas.height - sh, 120, sh);
      }

      // Parallax Midground Buildings (0.4x speed)
      const midOffset = engine.cameraX * 0.4;
      ctx.fillStyle = 'rgba(24, 20, 36, 0.7)';
      for (let i = -1; i < 10; i++) {
        const mx = i * 220 - (midOffset % 220);
        const mh = 220 + (i % 4) * 45;
        ctx.fillRect(mx, canvas.height - mh, 160, mh);
      }

      // Foreground Playable Buildings
      for (const b of engine.buildings) {
        const screenX = b.x - engine.cameraX;
        if (screenX + b.width > -60 && screenX < canvas.width + 60) {
          // Building Mass
          ctx.fillStyle = b.color;
          ctx.fillRect(screenX, b.height, b.width, canvas.height - b.height);

          // Ink Outline
          ctx.strokeStyle = '#1b1b20';
          ctx.lineWidth = 3;
          ctx.strokeRect(screenX, b.height, b.width, canvas.height - b.height);

          // Roof Edge Rim
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(screenX, b.height, b.width, 5);

          // Lit Windows
          for (const win of b.windows) {
            ctx.fillStyle = win.lit ? '#fef08a' : '#1e293b';
            ctx.fillRect(screenX + win.x, b.height + win.y, 14, 18);
            ctx.strokeStyle = '#1b1b20';
            ctx.lineWidth = 1;
            ctx.strokeRect(screenX + win.x, b.height + win.y, 14, 18);
          }

          // HVAC unit
          if (b.hvacOnTop) {
            ctx.fillStyle = '#334155';
            ctx.fillRect(screenX + 25, b.height - 18, 30, 18);
            ctx.strokeRect(screenX + 25, b.height - 18, 30, 18);
          }
          // Antenna Spire
          if (b.antennaOnTop) {
            ctx.beginPath();
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = 2.5;
            ctx.moveTo(screenX + b.width - 25, b.height);
            ctx.lineTo(screenX + b.width - 25, b.height - 35);
            ctx.stroke();

            ctx.fillStyle = Math.sin(currentTime * 0.006) > 0 ? '#ef4444' : '#7f1d1d';
            ctx.beginPath();
            ctx.arc(screenX + b.width - 25, b.height - 35, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // =====================================================================
      // 3. RENDER DYNAMIC TARGETED ANCHOR RETICLE & AIMING TETHER
      // =====================================================================
      if (engine.targetedAnchor && !player.isWebbed) {
        const ancScreenX = engine.targetedAnchor.x - engine.cameraX;
        const ancScreenY = engine.targetedAnchor.y;
        const playerScreenX = player.x - engine.cameraX;

        // Aiming Dashed Web Tether
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.moveTo(playerScreenX, player.y);
        ctx.lineTo(ancScreenX, ancScreenY);
        ctx.stroke();
        ctx.restore();

        // Animated Targeting Diamond Reticle
        ctx.save();
        ctx.translate(ancScreenX, ancScreenY);
        ctx.rotate(currentTime * 0.003);

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-8, -8, 16, 16);

        ctx.strokeStyle = '#1b1b20';
        ctx.lineWidth = 1;
        ctx.strokeRect(-9, -9, 18, 18);

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Reticle "ATTACH READY" Badge
        ctx.fillStyle = '#1b1b20';
        ctx.fillRect(ancScreenX - 28, ancScreenY - 22, 56, 14);
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('◈ ATTACH', ancScreenX - 22, ancScreenY - 12);
      }

      // =====================================================================
      // 4. RENDER ATTACHED WEB LINE WITH TENSILE WAVES
      // =====================================================================
      if (player.isWebbed) {
        const anchorScreenX = player.anchorX - engine.cameraX;
        const playerScreenX = player.x - engine.cameraX;

        // Outer Dark Ink Stroke
        ctx.beginPath();
        ctx.strokeStyle = '#1b1b20';
        ctx.lineWidth = 4.5;
        ctx.moveTo(playerScreenX, player.y);
        ctx.lineTo(anchorScreenX, player.anchorY);
        ctx.stroke();

        // Inner Glowing White Core
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.moveTo(playerScreenX, player.y);
        ctx.lineTo(anchorScreenX, player.anchorY);
        ctx.stroke();

        // Anchor Star Burst
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(anchorScreenX, player.anchorY, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Collectible Tokens
      for (const t of engine.tokens) {
        if (!t.collected) {
          const screenX = t.x - engine.cameraX;
          if (screenX > -30 && screenX < canvas.width + 30) {
            const bobY = t.y + Math.sin(currentTime * 0.006 + t.bobOffset) * 6;

            if (t.type === 'web_fluid') {
              ctx.fillStyle = '#0284c7';
              ctx.fillRect(screenX - 8, bobY - 12, 16, 24);
              ctx.strokeStyle = '#1b1b20';
              ctx.lineWidth = 2;
              ctx.strokeRect(screenX - 8, bobY - 12, 16, 24);

              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 10px sans-serif';
              ctx.fillText('⚡', screenX - 5, bobY + 4);
            } else {
              ctx.beginPath();
              ctx.fillStyle = '#facc15';
              ctx.arc(screenX, bobY, 12, 0, Math.PI * 2);
              ctx.fill();

              ctx.strokeStyle = '#1b1b20';
              ctx.lineWidth = 2.5;
              ctx.stroke();

              ctx.fillStyle = '#1b1b20';
              ctx.beginPath();
              ctx.arc(screenX, bobY, 4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // Obstacles
      for (const obs of engine.obstacles) {
        const screenX = obs.x - engine.cameraX;
        if (screenX > -50 && screenX < canvas.width + 50) {
          if (obs.type === 'pumpkin_bomb') {
            ctx.fillStyle = '#ea580c';
            ctx.beginPath();
            ctx.arc(screenX, obs.y, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#1b1b20';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(screenX - 4, obs.y - 2, 2.5, 0, Math.PI * 2);
            ctx.arc(screenX + 4, obs.y - 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (obs.type === 'drone') {
            ctx.fillStyle = '#334155';
            ctx.fillRect(screenX - 16, obs.y - 8, 32, 16);
            ctx.strokeStyle = '#1b1b20';
            ctx.lineWidth = 2;
            ctx.strokeRect(screenX - 16, obs.y - 8, 32, 16);

            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(screenX, obs.y, 4, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = '#eab308';
            ctx.fillRect(screenX - 12, obs.y - 40, 24, 80);
            ctx.strokeStyle = '#1b1b20';
            ctx.lineWidth = 2;
            ctx.strokeRect(screenX - 12, obs.y - 40, 24, 80);
          }
        }
      }

      // =====================================================================
      // 5. RENDER SPIDER-MAN HERO SPRITE
      // =====================================================================
      const playerScreenX = player.x - engine.cameraX;

      ctx.save();
      ctx.translate(playerScreenX, player.y);
      ctx.rotate(player.rotation);

      if (engine.dangerNearby || engine.isSlowMoActive) {
        ctx.beginPath();
        ctx.arc(0, 0, player.radius + 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Suit Body
      ctx.beginPath();
      ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      ctx.strokeStyle = '#1b1b20';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Blue Flanks
      ctx.beginPath();
      ctx.arc(0, 0, player.radius, Math.PI * 0.3, Math.PI * 0.7);
      ctx.fillStyle = '#0284c7';
      ctx.fill();

      // Mask Lenses
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-5, -4, 5, 7, -0.3, 0, Math.PI * 2);
      ctx.ellipse(5, -4, 5, 7, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1b1b20';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.restore();

      // Particles & Floating Text
      for (let i = engine.particles.length - 1; i >= 0; i--) {
        const p = engine.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt;

        if (p.life <= 0) {
          engine.particles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x - engine.cameraX, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = engine.floatingTexts.length - 1; i >= 0; i--) {
        const ft = engine.floatingTexts[i];
        ft.y -= 25 * dt;
        ft.life -= dt;

        if (ft.life <= 0) {
          engine.floatingTexts.splice(i, 1);
        } else {
          ctx.font = `black ${ft.size}px 'Anybody', sans-serif`;
          ctx.fillStyle = ft.color;
          ctx.strokeStyle = '#1b1b20';
          ctx.lineWidth = 3;
          const textX = ft.x - engine.cameraX;
          ctx.strokeText(ft.text, textX, ft.y);
          ctx.fillText(ft.text, textX, ft.y);
        }
      }

      animId = requestAnimationFrame(physicsLoop);
    };

    animId = requestAnimationFrame(physicsLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isPaused, gameOver, levelVictory, detectBestAnchorPoint, saveProgress, syncAnswerResult, recordSession, onAddScore]);

  return (
    <section className="space-y-6" id="web-swing-arcade-game">
      {/* Header Banner */}
      <div className="border-4 sm:border-6 border-[#1b1b20] bg-gradient-to-r from-[#dc2626] via-[#991b1b] to-[#1e1b4b] text-white p-4 sm:p-6 ink-shadow-red-multi relative overflow-hidden">
        <div className="comic-dots-red absolute inset-0 opacity-25 pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-[#1b1b20] text-[#facc15] font-comic text-xs font-black px-2.5 py-0.5 uppercase border border-white">
                ARCADE ENGINE #07
              </span>
              <span className="bg-white text-[#dc2626] font-comic text-xs font-black px-2 py-0.5 uppercase">
                2D ROPE-CONSTRAINT PHYSICS
              </span>
            </div>
            <h1 className="font-comic text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              WEB SWING: NEW YORK
            </h1>
            <p className="font-comic text-xs sm:text-sm font-semibold text-white/90 mt-1 max-w-xl">
              Lightweight 2D physics engine, dynamic rooftop anchor detection, Spider-Sense slow-mo, and progressive multiverse stages!
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
      {/* 1. LEVEL SELECTOR SCREEN (If inLevelSelect)         */}
      {/* ================================================== */}
      {inLevelSelect && (
        <div className="border-4 border-[#1b1b20] bg-[#fffbf0] p-5 sm:p-7 ink-shadow-lg space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-3 border-[#1b1b20] pb-4">
            <div>
              <h2 className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20]">
                SELECT STAGE & DIFFICULTY
              </h2>
              <p className="font-comic text-xs text-[#5b403d] font-bold mt-0.5">
                Clear target distances and collect tokens to earn ⭐⭐⭐ stars and unlock deeper stages!
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
            {WEB_SWING_LEVELS.map((lvl) => {
              const prog = levelProgress[lvl.id] || { unlocked: lvl.unlockedByDefault || false, stars: 0, bestScore: 0, bestDist: 0 };
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
                        STAGE {lvl.id} • {lvl.theme.toUpperCase()}
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
                      <div>TARGET: <span className="font-black text-[#dc2626]">{lvl.targetDistance}m</span></div>
                      <div>TOKENS: <span className="font-black text-[#facc15]">⭐ {lvl.tokenTarget}</span></div>
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
          {/* Top HUD Bar with Physics Telemetry */}
          <div className="bg-[#1b1b20] text-white p-2.5 sm:p-3 border-2 border-white/40 flex flex-wrap items-center justify-between gap-3 text-xs font-comic font-black uppercase">
            <div className="flex items-center gap-3">
              <span className="bg-[#dc2626] px-2 py-0.5 border border-white">
                STAGE {currentLevelConfig.id}: {currentLevelConfig.name}
              </span>
              <span className="text-[#facc15]">
                DIST: <span className="text-white font-mono">{distance}m / {currentLevelConfig.targetDistance}m</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span>SCORE: <span className="text-[#38bdf8] font-mono">{score.toLocaleString()}</span></span>
              <span>TOKENS: <span className="text-[#facc15] font-mono">⭐ {tokensCount}/{currentLevelConfig.tokenTarget}</span></span>
              <span className="text-green-400 font-mono hidden sm:inline">
                SPEED: {speedKmh} KM/H
              </span>
              <span className="text-[#facc15] font-mono hidden md:inline">
                G-FORCE: {gForce}G
              </span>
              <span className={`px-2 py-0.5 border ${combo > 1 ? 'bg-[#dc2626] text-white animate-pulse' : 'bg-white/10 text-white/70'}`}>
                {combo}x COMBO
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
            className={`relative w-full h-[420px] sm:h-[480px] border-3 border-[#1b1b20] overflow-hidden select-none bg-black ${
              screenShake ? 'shake-comic' : ''
            }`}
            onMouseDown={handleWebShoot}
            onMouseUp={handleWebRelease}
            onTouchStart={(e) => {
              e.preventDefault();
              handleWebShoot();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleWebRelease();
            }}
          >
            <canvas
              ref={canvasRef}
              width={900}
              height={480}
              className="w-full h-full object-cover block"
            />

            {/* Anchor Target Indicator HUD Overlay in Viewport */}
            <div className="absolute top-3 left-3 bg-black/70 border border-white/40 px-2.5 py-1 text-[10px] font-comic font-black text-white uppercase flex items-center gap-1.5 pointer-events-none backdrop-blur-xs">
              <Target className={`w-3.5 h-3.5 ${hasTargetedAnchor ? 'text-[#facc15] animate-pulse' : 'text-gray-400'}`} />
              <span>{hasTargetedAnchor ? 'ROOFTOP ANCHOR LOCKED [HOLD SPACE]' : 'SEARCHING ANCHORS...'}</span>
            </div>

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center pointer-events-none z-30 animate-in zoom-in duration-200">
                <div className="text-center font-comic font-black text-white">
                  <div className="text-7xl sm:text-9xl text-[#facc15] drop-shadow-[0_6px_0_#1b1b20]">
                    {countdown}
                  </div>
                  <div className="text-xl sm:text-2xl uppercase tracking-widest text-[#dc2626]">
                    READY TO THWIP!
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
                    Hold SPACE / Touch screen to attach rope-web. Release at bottom arc for apex boost.
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
                    STAGE CLEARED!
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
                      <span>DISTANCE REACHED:</span>
                      <span className="font-black text-[#dc2626]">{distance}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FINAL SCORE:</span>
                      <span className="font-black text-[#38bdf8]">{score.toLocaleString()} PTS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TOKENS COLLECTED:</span>
                      <span className="font-black text-[#facc15]">⭐ {tokensCount}/{currentLevelConfig.tokenTarget}</span>
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
                    {selectedLevelId < WEB_SWING_LEVELS.length ? (
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
                    SPLANTED!
                  </div>
                  <h3 className="font-comic text-2xl font-black uppercase text-[#1b1b20]">
                    CRASHED IN TRAFFIC!
                  </h3>
                  <p className="font-comic text-xs font-bold text-[#5b403d]">
                    Distance: <span className="text-[#dc2626] font-black">{distance}m</span> • Score: <span className="text-[#38bdf8] font-black">{score.toLocaleString()}</span>
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

            {/* Web Boost Energy */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0284c7] border-2 border-[#1b1b20] flex items-center justify-center text-white flex-shrink-0">
                🚀
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span>WEB BOOST</span>
                  <span>{boostEnergy}%</span>
                </div>
                <div className="w-full bg-gray-200 h-3 border border-[#1b1b20] p-0.5">
                  <div
                    className="h-full bg-[#0284c7] transition-all"
                    style={{ width: `${boostEnergy}%` }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={triggerBoost}
                disabled={boostEnergy < 25}
                className="bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-40 text-white border-2 border-[#1b1b20] px-2.5 py-1 text-[10px] font-black cursor-pointer ink-btn"
              >
                BOOST [SHIFT]
              </button>
            </div>

            {/* Physics Controls Guide */}
            <div className="text-[10px] text-[#5b403d] flex items-center justify-end gap-2">
              <span>HOLD [SPACE / TOUCH] = ATTACH WEB • RELEASE = APEX IMPULSE • [A/D] = TORQUE</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
