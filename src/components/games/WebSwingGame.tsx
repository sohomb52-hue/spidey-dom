import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playSound } from '../../utils/audio';
import { useSpiderAuth } from '../../context/AuthContext';
import { LikeButton } from '../common/LikeButton';
import {
  Trophy,
  Zap,
  RotateCcw,
  ArrowLeft,
  Flame,
  ShieldAlert,
  Sparkles,
  Compass
} from 'lucide-react';

interface WebSwingGameProps {
  onBackToArcade: () => void;
  onAddScore?: (points: number) => void;
}

interface Building {
  x: number;
  width: number;
  height: number;
  color: string;
  hasSpikes?: boolean;
}

interface Token {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  type: 'drone' | 'pumpkin_bomb' | 'electric_tower';
  warned: boolean;
  dodged: boolean;
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
  const { userProfile, recordSession } = useSpiderAuth();

  // Local storage stats
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('spider_web_swing_stats');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      gamesPlayed: 0,
      highestScore: 1850,
      longestDistance: 450,
      highestCombo: 3,
      tokensCollected: 0
    };
  });

  // Game UI State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [tokensCount, setTokensCount] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [spiderSensePercent, setSpiderSensePercent] = useState<number>(85);
  const [isSpiderSenseTingling, setIsSpiderSenseTingling] = useState<boolean>(false);
  const [emergencyCharges, setEmergencyCharges] = useState<number>(3);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Mutable Game Engine State
  const gameRef = useRef({
    distanceMeters: 0,
    scoreVal: 0,
    comboVal: 1,
    maxComboVal: 1,
    tokensVal: 0,
    cameraX: 0,
    // Spider-Man physics state
    player: {
      x: 150,
      y: 180,
      vx: 5.5,
      vy: 0,
      radius: 18,
      rotation: 0,
      isWebbed: false,
      webAnchorX: 0,
      webAnchorY: 0,
      webLength: 0,
      swingAngle: 0,
      angularVelocity: 0,
      lastSwingApexTime: 0
    },
    isHoldingWeb: false,
    buildings: [] as Building[],
    tokens: [] as Token[],
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    nextBuildingX: 0,
    difficultyName: 'Easy',
    gameOverTriggered: false,
    lastFrameTime: performance.now()
  });

  // Difficulty Tier calculation
  const getDifficultyTier = (dist: number) => {
    if (dist < 500) return { name: 'Easy', speed: 5.2, freq: 0.15, gapMin: 70, gapMax: 150 };
    if (dist < 1500) return { name: 'Medium', speed: 6.8, freq: 0.35, gapMin: 90, gapMax: 200 };
    if (dist < 3000) return { name: 'Hard', speed: 8.5, freq: 0.55, gapMin: 120, gapMax: 260 };
    return { name: 'INSANE', speed: 10.5, freq: 0.8, gapMin: 150, gapMax: 320 };
  };

  // Trigger floating comic text
  const addFloatingText = (text: string, x: number, y: number, color = '#facc15', size = 20) => {
    gameRef.current.floatingTexts.push({
      id: Math.random(),
      text,
      x,
      y,
      color,
      size,
      life: 1.0
    });
  };

  // Add impact particles
  const addParticles = (x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      gameRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 4 + 2,
        life: 1.0,
        maxLife: 1.0
      });
    }
  };

  // Spawn buildings up to horizon
  const generateWorldAhead = (targetX: number) => {
    const g = gameRef.current;
    const tier = getDifficultyTier(g.distanceMeters);

    while (g.nextBuildingX < targetX + 1000) {
      const width = Math.floor(Math.random() * 180) + 160;
      const height = Math.floor(Math.random() * 190) + 130;
      const colors = ['#1e1b4b', '#18181b', '#0f172a', '#1e293b', '#261a15'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const hasSpikes = tier.name !== 'Easy' && Math.random() < 0.25;

      const building: Building = {
        x: g.nextBuildingX,
        width,
        height,
        color,
        hasSpikes
      };
      g.buildings.push(building);

      // Spawn collectible tokens in arcs above buildings and gaps
      if (Math.random() < 0.75) {
        const tokenY = 480 - height - (Math.random() * 140 + 60);
        g.tokens.push({
          id: Math.random(),
          x: g.nextBuildingX + width * 0.5,
          y: Math.max(50, tokenY),
          collected: false
        });
      }

      // Spawn obstacles in gaps or above rooftops
      if (Math.random() < tier.freq) {
        const types: ('drone' | 'pumpkin_bomb' | 'electric_tower')[] = [
          'drone',
          'pumpkin_bomb',
          'electric_tower'
        ];
        const chosen = types[Math.floor(Math.random() * types.length)];
        const obsY = Math.random() * 220 + 80;
        g.obstacles.push({
          id: Math.random(),
          x: g.nextBuildingX + width + 40,
          y: obsY,
          width: chosen === 'electric_tower' ? 26 : 34,
          height: chosen === 'electric_tower' ? 50 : 34,
          vx: chosen === 'drone' ? -1.5 : 0,
          vy: chosen === 'drone' ? Math.sin(Date.now() * 0.005) * 1.2 : 0,
          type: chosen,
          warned: false,
          dodged: false
        });
      }

      // Gap size variation
      const gap = Math.floor(Math.random() * (tier.gapMax - tier.gapMin)) + tier.gapMin;
      g.nextBuildingX += width + gap;
    }

    // Prune distant past entities (behind camera - 600px)
    const pruneX = g.cameraX - 600;
    g.buildings = g.buildings.filter((b) => b.x + b.width > pruneX);
    g.tokens = g.tokens.filter((t) => t.x > pruneX);
    g.obstacles = g.obstacles.filter((o) => o.x + o.width > pruneX);
  };

  // Find best web attachment anchor point ahead of player
  const findWebAnchor = (playerX: number, playerY: number) => {
    const g = gameRef.current;
    // Look for buildings ahead of player
    let bestAnchor: { x: number; y: number } | null = null;
    let minScore = Infinity;

    // Search buildings
    for (const b of g.buildings) {
      // Anchor can be at top corners or spire of building
      const candidateX = b.x + b.width * 0.4;
      const candidateY = 480 - b.height;

      // Must be ahead of player and above or reasonable angle
      const dx = candidateX - playerX;
      const dy = candidateY - playerY;

      if (dx > 40 && dx < 380 && candidateY < playerY + 50) {
        const dist = Math.hypot(dx, dy);
        // Prefer anchors around 45-60 degree forward angle
        const score = dist + Math.abs(dx - 180) * 0.6;
        if (score < minScore) {
          minScore = score;
          bestAnchor = { x: candidateX, y: candidateY };
        }
      }
    }

    // If no building rooftop found, attach to a high skyscraper spire / helicopter in sky
    if (!bestAnchor) {
      bestAnchor = {
        x: playerX + 220,
        y: Math.max(30, playerY - 240)
      };
    }

    return bestAnchor;
  };

  // Shoot web action
  const shootWeb = () => {
    const g = gameRef.current;
    if (g.gameOverTriggered) return;

    const anchor = findWebAnchor(g.player.x, g.player.y);
    const dx = g.player.x - anchor.x;
    const dy = g.player.y - anchor.y;
    const dist = Math.hypot(dx, dy);

    g.player.isWebbed = true;
    g.player.webAnchorX = anchor.x;
    g.player.webAnchorY = anchor.y;
    g.player.webLength = Math.max(90, dist);
    g.player.swingAngle = Math.atan2(dx, dy);

    // Initial angular velocity from linear velocity
    const tangentVx = g.player.vx * Math.cos(g.player.swingAngle) - g.player.vy * Math.sin(g.player.swingAngle);
    g.player.angularVelocity = tangentVx / g.player.webLength;

    playSound('thwip');
    addFloatingText('THWIP!', g.player.x, g.player.y - 30, '#ffffff', 18);
  };

  // Release web action
  const releaseWeb = () => {
    const g = gameRef.current;
    if (!g.player.isWebbed || g.gameOverTriggered) return;

    // Centrifugal velocity launch
    const L = g.player.webLength;
    const theta = g.player.swingAngle;
    const omega = g.player.angularVelocity;

    // Linear velocity vector from circular motion
    let launchVx = omega * L * Math.cos(theta);
    let launchVy = -omega * L * Math.sin(theta);

    // Ensure positive forward momentum
    if (launchVx < 3.5) launchVx = 4.5;

    // Perfect swing bonus check (released on upward forward swing)
    const isUpwardForward = launchVx > 7.0 && launchVy < -1.5;
    if (isUpwardForward) {
      const bonusPts = 100 * g.comboVal;
      g.scoreVal += bonusPts;
      g.comboVal = Math.min(5, g.comboVal + 1);
      g.maxComboVal = Math.max(g.maxComboVal, g.comboVal);
      playSound('correct');
      addFloatingText(`PERFECT SWING! +${bonusPts}`, g.player.x, g.player.y - 45, '#facc15', 22);
      addParticles(g.player.x, g.player.y, '#facc15', 16);
    }

    g.player.vx = launchVx;
    g.player.vy = launchVy;
    g.player.isWebbed = false;
  };

  // Emergency Web Recovery (SPACE or Touch Button)
  const triggerEmergencyWeb = () => {
    const g = gameRef.current;
    if (g.gameOverTriggered || emergencyCharges <= 0) return;

    setEmergencyCharges((c) => c - 1);
    playSound('combo');

    // Instant upward boost and emergency anchor
    g.player.vy = -12;
    g.player.vx = Math.max(6, g.player.vx);
    g.player.isWebbed = false;

    addFloatingText('⚡ EMERGENCY THWIP!', g.player.x, g.player.y - 40, '#22d3ee', 24);
    addParticles(g.player.x, g.player.y, '#22d3ee', 20);
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 220);
  };

  // Crash / Game Over Trigger
  const triggerGameOver = useCallback((reason: string) => {
    const g = gameRef.current;
    if (g.gameOverTriggered) return;
    g.gameOverTriggered = true;

    playSound('bam');
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 450);

    const finalScore = Math.floor(g.scoreVal);
    const finalDistance = Math.floor(g.distanceMeters);
    const finalTokens = g.tokensVal;
    const finalMaxCombo = g.maxComboVal;
    const xpEarned = Math.floor(finalScore / 8) + finalTokens * 10;

    setScore(finalScore);
    setDistance(finalDistance);
    setMaxCombo(finalMaxCombo);
    setTokensCount(finalTokens);
    setGameOver(true);
    setIsPlaying(false);

    // Check personal best
    const isBest = finalScore > stats.highestScore || finalDistance > stats.longestDistance;
    if (isBest) {
      setIsNewHighScore(true);
      playSound('unlock');
    }

    // Update Local Stats
    const updatedStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      highestScore: Math.max(stats.highestScore, finalScore),
      longestDistance: Math.max(stats.longestDistance, finalDistance),
      highestCombo: Math.max(stats.highestCombo, finalMaxCombo),
      tokensCollected: stats.tokensCollected + finalTokens
    };
    setStats(updatedStats);
    try {
      localStorage.setItem('spider_web_swing_stats', JSON.stringify(updatedStats));
    } catch {
      // ignore
    }

    // Sync to user profile XP & session
    if (onAddScore) {
      onAddScore(finalScore);
    }
    if (recordSession) {
      recordSession({
        gameMode: 'web_swing',
        score: finalScore,
        questionsAnswered: finalDistance,
        correctAnswers: finalTokens,
        accuracy: 100,
        bestStreak: finalMaxCombo,
        xpEarned,
        completedAt: new Date().toISOString(),
        factsDiscovered: 0
      }).catch(() => {
        // network safe
      });
    }
  }, [stats, onAddScore, recordSession]);

  // Start new game run
  const startGame = () => {
    const g = gameRef.current;
    g.distanceMeters = 0;
    g.scoreVal = 0;
    g.comboVal = 1;
    g.maxComboVal = 1;
    g.tokensVal = 0;
    g.cameraX = 0;
    g.player = {
      x: 150,
      y: 180,
      vx: 5.5,
      vy: 0,
      radius: 18,
      rotation: 0,
      isWebbed: false,
      webAnchorX: 0,
      webAnchorY: 0,
      webLength: 0,
      swingAngle: 0,
      angularVelocity: 0,
      lastSwingApexTime: 0
    };
    g.isHoldingWeb = false;
    g.buildings = [];
    g.tokens = [];
    g.obstacles = [];
    g.particles = [];
    g.floatingTexts = [];
    g.nextBuildingX = 50;
    g.gameOverTriggered = false;
    g.lastFrameTime = performance.now();

    // Initial platform
    generateWorldAhead(800);

    setScore(0);
    setDistance(0);
    setTokensCount(0);
    setCombo(1);
    setMaxCombo(1);
    setEmergencyCharges(3);
    setSpiderSensePercent(90);
    setIsSpiderSenseTingling(false);
    setIsNewHighScore(false);
    setGameOver(false);
    setIsPlaying(true);

    playSound('thwip');
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isPlaying && !gameOver) {
          startGame();
        } else if (isPlaying) {
          triggerEmergencyWeb();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  // Main 60FPS Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    let active = true;

    const gameLoop = (currentTime: number) => {
      if (!active) return;
      const g = gameRef.current;
      const dt = Math.min((currentTime - g.lastFrameTime) / 1000, 0.05); // cap at 50ms
      g.lastFrameTime = currentTime;

      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameIdRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animFrameIdRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // 1. Difficulty & Speed
      const tier = getDifficultyTier(g.distanceMeters);
      g.difficultyName = tier.name;

      // 2. Physics Update
      const gravity = 0.38;

      if (!g.player.isWebbed) {
        // Freefall physics
        g.player.vy += gravity;
        g.player.x += g.player.vx;
        g.player.y += g.player.vy;

        // Air drag
        g.player.vx *= 0.996;

        // Rotation follows trajectory
        g.player.rotation = Math.atan2(g.player.vy, g.player.vx) * 0.7;
      } else {
        // Taut web pendulum physics
        const L = g.player.webLength;
        // Angular acceleration = (-g / L) * sin(theta)
        const angularAccel = (-gravity / (L * 0.08)) * Math.sin(g.player.swingAngle);
        g.player.angularVelocity += angularAccel * dt * 60;
        // Damping
        g.player.angularVelocity *= 0.998;

        g.player.swingAngle += g.player.angularVelocity * dt * 60;

        // Position along circle
        g.player.x = g.player.webAnchorX + L * Math.sin(g.player.swingAngle);
        g.player.y = g.player.webAnchorY + L * Math.cos(g.player.swingAngle);

        // Approximate linear velocities
        g.player.vx = g.player.angularVelocity * L * Math.cos(g.player.swingAngle);
        g.player.vy = -g.player.angularVelocity * L * Math.sin(g.player.swingAngle);

        g.player.rotation = g.player.swingAngle * 0.8;
      }

      // Update distance & base score
      g.distanceMeters = Math.max(0, Math.floor((g.player.x - 150) / 10));
      g.scoreVal += 0.25 * g.comboVal; // continuous score per distance

      // Smooth camera follow
      g.cameraX = g.player.x - 220;

      // World generation ahead
      generateWorldAhead(g.player.x + 800);

      // 3. Collision Detection with Buildings
      const playerBottom = g.player.y + g.player.radius;
      const playerTop = g.player.y - g.player.radius;
      const playerRight = g.player.x + g.player.radius;
      const playerLeft = g.player.x - g.player.radius;

      // Check ground crash (below canvas height 480)
      if (playerBottom >= 480) {
        triggerGameOver('Hit the street below!');
        return;
      }

      for (const b of g.buildings) {
        const buildingTop = 480 - b.height;
        // Horizontal overlap
        if (playerRight > b.x && playerLeft < b.x + b.width) {
          // Rooftop landing
          if (playerBottom >= buildingTop && playerTop < buildingTop) {
            if (b.hasSpikes) {
              triggerGameOver('Crashed into high-voltage rooftop spikes!');
              return;
            }
            // If soft landing on top of building, allow running / bounce
            if (g.player.vy > 0) {
              g.player.y = buildingTop - g.player.radius;
              g.player.vy = -Math.abs(g.player.vy) * 0.45; // spring bounce
              playSound('click');
              addFloatingText('BOUNCE!', g.player.x, g.player.y - 20, '#ffffff', 14);
            }
          }
          // Face crash into side of building
          else if (playerBottom > buildingTop + 15) {
            triggerGameOver('Slammed into skyscraper wall!');
            return;
          }
        }
      }

      // 4. Tokens Collection Check
      for (const token of g.tokens) {
        if (!token.collected) {
          const dist = Math.hypot(token.x - g.player.x, token.y - g.player.y);
          if (dist < g.player.radius + 18) {
            token.collected = true;
            g.tokensVal += 1;
            const tokenPts = 50 * g.comboVal;
            g.scoreVal += tokenPts;
            playSound('correct');
            addFloatingText(`+${tokenPts} TOKEN!`, token.x, token.y - 15, '#facc15', 18);
            addParticles(token.x, token.y, '#facc15', 10);
          }
        }
      }

      // 5. Obstacles & Spider-Sense Check
      let anyHazardNearby = false;

      for (const obs of g.obstacles) {
        // Move obstacles
        obs.x += obs.vx;
        obs.y += obs.vy;

        const distToObs = Math.hypot(obs.x - g.player.x, obs.y - g.player.y);

        // Spider-Sense Early Warning (within 350px)
        if (distToObs < 350 && obs.x > g.player.x && !obs.warned) {
          obs.warned = true;
          anyHazardNearby = true;
          playSound('spider-sense');
          addFloatingText('⚡ SPIDER-SENSE TINGLING!', g.player.x, g.player.y - 50, '#facc15', 20);
        }

        // Perfect Dodge check: when passing obstacle without hitting
        if (g.player.x > obs.x + obs.width && !obs.dodged && obs.warned) {
          obs.dodged = true;
          const dodgePts = 150 * g.comboVal;
          g.scoreVal += dodgePts;
          g.comboVal = Math.min(5, g.comboVal + 1);
          g.maxComboVal = Math.max(g.maxComboVal, g.comboVal);
          playSound('correct');
          addFloatingText(`PERFECT DODGE! +${dodgePts}`, g.player.x, g.player.y - 45, '#38bdf8', 22);
          addParticles(g.player.x, g.player.y, '#38bdf8', 14);
        }

        // Collision with Obstacle
        if (
          playerRight > obs.x &&
          playerLeft < obs.x + obs.width &&
          playerBottom > obs.y &&
          playerTop < obs.y + obs.height
        ) {
          triggerGameOver(`Collided with ${obs.type.replace('_', ' ')}!`);
          return;
        }
      }

      setIsSpiderSenseTingling(anyHazardNearby);

      // Periodically sync React UI state
      if (Math.random() < 0.15) {
        setScore(Math.floor(g.scoreVal));
        setDistance(Math.floor(g.distanceMeters));
        setCombo(g.comboVal);
        setTokensCount(g.tokensVal);
        setSpiderSensePercent(Math.min(100, Math.floor(75 + Math.sin(Date.now() * 0.003) * 20)));
      }

      // ==========================================
      // 6. RENDER SCENE TO CANVAS
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Apply camera translation
      ctx.translate(-g.cameraX, 0);

      // Parallax Sky & Skyline
      // Background Sky Gradient
      const skyGrad = ctx.createLinearGradient(g.cameraX, 0, g.cameraX, 480);
      skyGrad.addColorStop(0, '#150824');
      skyGrad.addColorStop(0.45, '#4a154b');
      skyGrad.addColorStop(0.75, '#b91c1c');
      skyGrad.addColorStop(1, '#ea580c');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(g.cameraX, 0, canvas.width, canvas.height);

      // Parallax Distant Skyline Silhouettes (moves at 0.25x speed)
      ctx.fillStyle = '#10071d';
      const bgOffset = (g.cameraX * 0.25) % 300;
      for (let i = -1; i < 4; i++) {
        const bx = g.cameraX - bgOffset + i * 300;
        ctx.fillRect(bx, 200, 70, 280);
        ctx.fillRect(bx + 80, 160, 50, 320);
        ctx.fillRect(bx + 140, 240, 60, 240);
        ctx.fillRect(bx + 210, 180, 80, 300);
      }

      // Foreground Buildings
      for (const b of g.buildings) {
        const bTop = 480 - b.height;

        // Building body
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, bTop, b.width, b.height);

        // Building border comic line
        ctx.strokeStyle = '#1b1b20';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(b.x, bTop, b.width, b.height);

        // Rooftop ledge line
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(b.x, bTop, b.width, 6);

        // Glowing Windows Grid
        ctx.fillStyle = '#fde047';
        for (let wy = bTop + 20; wy < 460; wy += 26) {
          for (let wx = b.x + 16; wx < b.x + b.width - 16; wx += 24) {
            // Some windows lit
            const hash = (Math.sin(wx * 11 + wy * 17) * 10000) % 1;
            if (hash > 0.4) {
              ctx.fillRect(wx, wy, 8, 12);
            }
          }
        }

        // Spikes on Roof
        if (b.hasSpikes) {
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#1b1b20';
          ctx.lineWidth = 2;
          for (let sx = b.x + 8; sx < b.x + b.width - 12; sx += 18) {
            ctx.beginPath();
            ctx.moveTo(sx, bTop);
            ctx.lineTo(sx + 8, bTop - 16);
            ctx.lineTo(sx + 16, bTop);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        }

        // Rooftop Water Tower / Antenna on select buildings
        if (b.width > 200) {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(b.x + 25, bTop - 32, 28, 32);
          ctx.strokeStyle = '#1b1b20';
          ctx.lineWidth = 2;
          ctx.strokeRect(b.x + 25, bTop - 32, 28, 32);
        }
      }

      // Collectible Golden Tokens
      for (const token of g.tokens) {
        if (!token.collected) {
          // Token glow
          ctx.beginPath();
          ctx.arc(token.x, token.y, 16, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
          ctx.fill();

          // Token coin
          ctx.beginPath();
          ctx.arc(token.x, token.y, 11, 0, Math.PI * 2);
          ctx.fillStyle = '#facc15';
          ctx.fill();
          ctx.strokeStyle = '#1b1b20';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Spider emblem in token
          ctx.fillStyle = '#1b1b20';
          ctx.beginPath();
          ctx.arc(token.x, token.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Obstacles Rendering
      for (const obs of g.obstacles) {
        if (obs.type === 'drone') {
          // Oscillation
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#1b1b20';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

          // Red scanner eye
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'pumpkin_bomb') {
          // Flying pumpkin bomb
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, 14, 0, Math.PI * 2);
          ctx.fillStyle = '#ea580c';
          ctx.fill();
          ctx.strokeStyle = '#1b1b20';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Eyes and mouth
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2 - 4, obs.y + obs.height / 2 - 3, 2, 0, Math.PI * 2);
          ctx.arc(obs.x + obs.width / 2 + 4, obs.y + obs.height / 2 - 3, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Electric Tower
          ctx.fillStyle = '#eab308';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#1b1b20';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

          // Spark lines
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(obs.x - 5, obs.y + 10);
          ctx.lineTo(obs.x + obs.width + 5, obs.y + 20);
          ctx.stroke();
        }
      }

      // Render Taut Web Line
      if (g.player.isWebbed) {
        // Elastic white web cord
        ctx.beginPath();
        ctx.moveTo(g.player.webAnchorX, g.player.webAnchorY);
        ctx.lineTo(g.player.x, g.player.y);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Web anchor splat node
        ctx.beginPath();
        ctx.arc(g.player.webAnchorX, g.player.webAnchorY, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#1b1b20';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Render Spider-Man Character
      ctx.save();
      ctx.translate(g.player.x, g.player.y);
      ctx.rotate(g.player.rotation);

      // Spider-Sense tingling warning aura
      if (anyHazardNearby) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, -10, 26, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -10, 32, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      }

      // Spidey Body
      // Torso (Red & Blue Spandex)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1b1b20';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Royal blue flanks
      ctx.fillStyle = '#1d4ed8';
      ctx.beginPath();
      ctx.arc(0, 2, 12, Math.PI * 0.2, Math.PI * 0.8);
      ctx.fill();

      // Mask / Head
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(6, -8, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1b1b20';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // White expressive eyes with black rim
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(9, -9, 4.5, 2.5, Math.PI * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1b1b20';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Legs / Arms in swing pose
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      // Arm reaching for web
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.lineTo(g.player.isWebbed ? 14 : 8, -18);
      ctx.stroke();

      ctx.restore();

      // Render Particles
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt * 1.8;

        if (p.life <= 0) {
          g.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Render Floating Comic Texts
      for (let i = g.floatingTexts.length - 1; i >= 0; i--) {
        const ft = g.floatingTexts[i];
        ft.y -= dt * 35;
        ft.life -= dt * 1.2;

        if (ft.life <= 0) {
          g.floatingTexts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.font = `900 ${ft.size}px 'Anybody', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = ft.color;
        ctx.strokeStyle = '#1b1b20';
        ctx.lineWidth = 4;
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      active = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying, triggerGameOver]);

  // Touch & Mouse Input Listeners for Continuous Web Swing
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isPlaying && !gameOver) {
      startGame();
      return;
    }
    if (isPlaying) {
      gameRef.current.isHoldingWeb = true;
      shootWeb();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isPlaying) {
      gameRef.current.isHoldingWeb = false;
      releaseWeb();
    }
  };

  return (
    <section
      className={`space-y-4 max-w-5xl mx-auto select-none ${screenShake ? 'shake-comic' : ''}`}
      id="web-swing-cabinet"
    >
      {/* Comic Header Banner */}
      <div className="border-4 sm:border-6 border-[#1b1b20] bg-gradient-to-r from-[#dc2626] via-[#991b1b] to-[#1e1b4b] text-white p-4 sm:p-6 ink-shadow-red-multi relative overflow-hidden">
        <div className="comic-dots-red absolute inset-0 opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#1b1b20] text-[#facc15] font-comic text-xs font-black px-2.5 py-0.5 border border-white/40 uppercase">
                ARCADE GAME #07 • WEB SWING
              </span>
              <span className="bg-[#dc2626] text-white font-comic text-[10px] font-black px-2 py-0.5 border border-white/40 uppercase">
                HARD
              </span>
            </div>
            <h2 className="font-comic text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
              🕸️ WEB SWING: ENDLESS ROOFTOP RUN
            </h2>
            <p className="font-comic text-xs sm:text-sm text-white/90 font-semibold mt-0.5">
              “HOW LONG CAN YOU STAY IN THE AIR?” Hold to shoot & swing, release to launch into NYC skies!
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
          <span className="text-[10px] font-black uppercase text-[#dc2626] block">DISTANCE</span>
          <span className="text-xl sm:text-2xl font-black text-[#dc2626]">{distance}m</span>
        </div>

        <div className="border-2 border-[#1b1b20] bg-[#f0ecf4] p-2 text-center">
          <span className="text-[10px] font-black uppercase text-[#1b1b20] block">SCORE</span>
          <span className="text-xl sm:text-2xl font-black text-[#1b1b20]">{score.toLocaleString()}</span>
        </div>

        <div className="border-2 border-[#1b1b20] bg-[#fefce8] p-2 text-center">
          <span className="text-[10px] font-black uppercase text-[#854d0e] block">COMBO</span>
          <span className="text-xl sm:text-2xl font-black text-[#b45309] flex items-center justify-center gap-1">
            <Zap className="w-4 h-4" /> x{combo}
          </span>
        </div>

        <div className="border-2 border-[#1b1b20] bg-[#1b1b20] text-white p-2 text-center">
          <span className="text-[10px] font-black uppercase text-[#facc15] block">
            {isSpiderSenseTingling ? '⚡ SENSE TINGLING!' : 'SPIDER-SENSE'}
          </span>
          <span
            className={`text-xl sm:text-2xl font-black ${
              isSpiderSenseTingling ? 'text-[#facc15] animate-pulse' : 'text-white'
            }`}
          >
            {spiderSensePercent}%
          </span>
        </div>
      </div>

      {/* Main Game Stage / Canvas Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative border-4 sm:border-6 border-[#1b1b20] bg-[#150824] h-[380px] sm:h-[480px] overflow-hidden depth-shadow-comic cursor-pointer touch-none"
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="w-full h-full object-cover"
        />

        {/* Start Overlay Screen */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-center p-6 text-white z-20">
            <div className="bg-[#1b1b20] border-4 border-white p-6 max-w-md ink-shadow-red-multi">
              <span className="text-4xl block mb-2">🕸️</span>
              <h3 className="font-comic text-3xl sm:text-4xl font-black uppercase text-[#facc15]">
                WEB SWING 3D
              </h3>
              <p className="font-comic text-xs sm:text-sm text-white/90 font-bold mt-2 leading-relaxed">
                Hold Click or Touch to shoot web cord and swing across the Manhattan skyline. Release at the peak for maximum speed & perfect bonus!
              </p>

              <div className="my-4 pt-3 border-t-2 border-white/20 text-xs font-comic font-black text-left space-y-1">
                <div className="flex justify-between text-white/80">
                  <span>DESKTOP:</span>
                  <span className="text-[#facc15]">HOLD CLICK (SWING) • SPACE (EMERGENCY)</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>MOBILE:</span>
                  <span className="text-[#facc15]">TOUCH & HOLD TO SWING • RELEASE TO FLY</span>
                </div>
              </div>

              <button
                type="button"
                onClick={startGame}
                className="w-full py-3 bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-base font-black uppercase border-3 border-white shadow-[4px_4px_0px_0px_#1b1b20] cursor-pointer ink-btn"
              >
                START SWINGING →
              </button>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-center p-6 text-white z-30 animate-impact-pop">
            <div className="bg-[#1b1b20] border-4 sm:border-6 border-white p-6 sm:p-8 max-w-lg w-full ink-shadow-red-multi">
              {/* Comic Impact Text "BAM!" */}
              <div className="bg-[#facc15] text-[#1b1b20] font-comic font-black text-3xl sm:text-4xl px-4 py-1 border-3 border-black inline-block -rotate-3 mb-3 shadow-[4px_4px_0px_0px_#dc2626]">
                💥 BAM! CRASH!
              </div>

              <h3 className="font-comic text-2xl sm:text-3xl font-black uppercase text-white">
                WEB SWING COMPLETE
              </h3>

              {isNewHighScore && (
                <div className="bg-[#dc2626] text-white font-comic text-xs font-black py-1 px-3 border border-white mt-1 uppercase inline-block">
                  🏆 NEW HIGH SCORE!
                </div>
              )}

              {/* Game Stats Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-5 text-left font-comic">
                <div className="bg-[#2a2a35] p-2 border border-white/20">
                  <span className="text-[10px] text-white/60 uppercase block">SCORE</span>
                  <span className="text-lg font-black text-[#facc15]">{score.toLocaleString()}</span>
                </div>
                <div className="bg-[#2a2a35] p-2 border border-white/20">
                  <span className="text-[10px] text-white/60 uppercase block">DISTANCE</span>
                  <span className="text-lg font-black text-white">{distance}m</span>
                </div>
                <div className="bg-[#2a2a35] p-2 border border-white/20">
                  <span className="text-[10px] text-white/60 uppercase block">BEST COMBO</span>
                  <span className="text-lg font-black text-[#38bdf8]">x{maxCombo}</span>
                </div>
                <div className="bg-[#2a2a35] p-2 border border-white/20">
                  <span className="text-[10px] text-white/60 uppercase block">TOKENS</span>
                  <span className="text-lg font-black text-[#22c55e]">{tokensCount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={startGame}
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

        {/* Mobile On-Screen Emergency Recovery Button */}
        {isPlaying && (
          <div className="absolute bottom-4 right-4 z-20">
            <button
              type="button"
              disabled={emergencyCharges <= 0}
              onPointerDown={(e) => {
                e.stopPropagation();
                triggerEmergencyWeb();
              }}
              className="bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-40 text-white font-comic text-xs font-black uppercase px-4 py-2.5 border-3 border-[#1b1b20] shadow-[3px_3px_0px_0px_#1b1b20] flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 text-[#facc15]" />
              <span>EMERGENCY THWIP ({emergencyCharges})</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Game Controls & High-Score Card */}
      <div className="border-4 border-[#1b1b20] bg-white p-4 depth-shadow-comic flex flex-wrap items-center justify-between gap-4 font-comic">
        <div className="flex items-center gap-4 text-xs font-bold text-[#5b403d]">
          <div>
            <span className="font-black text-[#1b1b20] uppercase block">CONTROLS:</span>
            <span>HOLD MOUSE / TOUCH → SWING • RELEASE → LAUNCH • SPACE → EMERGENCY RECOVERY</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LikeButton id="game-web-swing" initialLikes={1420} label="LIKE GAME" compact />
          <div className="bg-[#f0ece1] border-2 border-[#1b1b20] px-3 py-1 text-xs font-black uppercase">
            🏆 BEST: {stats.highestScore.toLocaleString()} PTS ({stats.longestDistance}m)
          </div>
        </div>
      </div>
    </section>
  );
};
