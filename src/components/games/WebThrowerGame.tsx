import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../../utils/audio';
import { Target, Crosshair, RefreshCw, Zap, Trophy, ShieldAlert, Sparkles } from 'lucide-react';
import { LikeButton } from '../common/LikeButton';

interface TargetItem {
  id: number;
  type: 'goblin' | 'vulture' | 'docock' | 'mysterio' | 'bonus';
  name: string;
  x: number; // percentage 0 - 90
  y: number; // percentage 10 - 70
  speedX: number;
  points: number;
  emoji: string;
  isHit: boolean;
  hitText?: string;
  hitX?: number;
  hitY?: number;
}

interface WebSplat {
  id: number;
  x: number;
  y: number;
  scale: number;
  text?: string;
}

export const WebThrowerGame: React.FC<{
  onBackToArcade: () => void;
  onAddScore?: (points: number) => void;
}> = ({ onBackToArcade, onAddScore }) => {
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('web_thrower_high_score') || '1450', 10);
  });
  const [ammo, setAmmo] = useState<number>(10);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(1);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [splats, setSplats] = useState<WebSplat[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize targets pool
  const spawnTarget = (): TargetItem => {
    const types: ('goblin' | 'vulture' | 'docock' | 'mysterio' | 'bonus')[] = [
      'goblin',
      'vulture',
      'docock',
      'mysterio',
      'bonus'
    ];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const startLeft = Math.random() > 0.5;

    let points = 150;
    let emoji = '👺';
    let name = 'GREEN GOBLIN';

    if (chosenType === 'vulture') {
      points = 100;
      emoji = '🦅';
      name = 'THE VULTURE';
    } else if (chosenType === 'docock') {
      points = 200;
      emoji = '🐙';
      name = 'DOC OCK TENTACLE';
    } else if (chosenType === 'mysterio') {
      points = 175;
      emoji = '🔮';
      name = 'MYSTERIO DRONE';
    } else if (chosenType === 'bonus') {
      points = 350;
      emoji = '⭐';
      name = 'GOLDEN SPIDER-COIN';
    }

    return {
      id: Date.now() + Math.random(),
      type: chosenType,
      name,
      x: startLeft ? -10 : 105,
      y: 15 + Math.random() * 55,
      speedX: (startLeft ? 1 : -1) * (0.35 + Math.random() * 0.45),
      points,
      emoji,
      isHit: false
    };
  };

  const startGame = () => {
    playSound('thwip');
    setScore(0);
    setAmmo(10);
    setTimeLeft(45);
    setCombo(1);
    setGameOver(false);
    setGameActive(true);
    setSplats([]);

    // Initial 4 targets
    const initialTargets: TargetItem[] = [
      {
        id: 1,
        type: 'goblin',
        name: 'GREEN GOBLIN',
        x: 10,
        y: 25,
        speedX: 0.4,
        points: 150,
        emoji: '👺',
        isHit: false
      },
      {
        id: 2,
        type: 'vulture',
        name: 'THE VULTURE',
        x: 80,
        y: 40,
        speedX: -0.35,
        points: 100,
        emoji: '🦅',
        isHit: false
      },
      {
        id: 3,
        type: 'docock',
        name: 'DOC OCK',
        x: 40,
        y: 60,
        speedX: 0.3,
        points: 200,
        emoji: '🐙',
        isHit: false
      }
    ];
    setTargets(initialTargets);
  };

  // Timer loop
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && gameActive) {
      playSound('wrong');
      setGameActive(false);
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('web_thrower_high_score', score.toString());
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameActive, score, highScore]);

  // Target movement loop
  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      setTargets((prev) => {
        let updated = prev
          .map((t) => {
            if (t.isHit) return t;
            const nextX = t.x + t.speedX;
            return { ...t, x: nextX };
          })
          .filter((t) => t.x >= -15 && t.x <= 115);

        // Keep 4 targets active
        while (updated.length < 4) {
          updated.push(spawnTarget());
        }
        return updated;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [gameActive]);

  // Handle Aiming / Crosshair
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCrosshairPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  // Throw Web Action
  const handleThrowWeb = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameActive || ammo <= 0) {
      if (ammo <= 0) {
        playSound('wrong');
      }
      return;
    }

    playSound('thwip');
    const newAmmo = ammo - 1;
    setAmmo(newAmmo);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check target collision (within 9% tolerance)
    let hitSomething = false;
    const soundWords = ['THWIP!', 'BAM!', 'POW!', 'WHAM!', 'ZAP!'];
    const chosenWord = soundWords[Math.floor(Math.random() * soundWords.length)];

    setTargets((prev) => {
      return prev.map((t) => {
        if (t.isHit) return t;
        const dist = Math.hypot(t.x - clickX, t.y - clickY);
        if (dist < 9) {
          hitSomething = true;
          playSound('correct');
          const pointsEarned = t.points * combo;
          setScore((s) => s + pointsEarned);
          if (onAddScore) {
            onAddScore(pointsEarned);
          }
          setCombo((c) => Math.min(c + 1, 8));
          return {
            ...t,
            isHit: true,
            hitText: `+${pointsEarned} ${chosenWord}`,
            hitX: clickX,
            hitY: clickY
          };
        }
        return t;
      });
    });

    if (!hitSomething) {
      setCombo(1);
    }

    // Add web splat graphic
    const newSplat: WebSplat = {
      id: Date.now(),
      x: clickX,
      y: clickY,
      scale: 1,
      text: hitSomething ? chosenWord : undefined
    };
    setSplats((s) => [...s.slice(-6), newSplat]);

    // Remove splat after 1.5s
    setTimeout(() => {
      setSplats((s) => s.filter((sp) => sp.id !== newSplat.id));
    }, 1500);
  };

  const handleReload = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    setAmmo(10);
  };

  return (
    <section className="space-y-4" id="web-thrower-game">
      {/* Top Banner with Red Comic Theme */}
      <div className="border-4 border-[#1b1b20] bg-gradient-to-r from-[#dc2626] via-[#b8121d] to-[#991b1b] text-white p-4 sm:p-5 ink-shadow-red-multi relative overflow-hidden">
        <div className="comic-halftone absolute inset-0 opacity-20 pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1b1b20] text-[#f9bd22] font-comic text-xs font-black px-2.5 py-0.5 uppercase border-2 border-white">
                ARCADE GAME #01
              </span>
              <span className="bg-white text-[#dc2626] font-comic text-xs font-black px-2 py-0.5 uppercase">
                3D ROOFTOP ACTION
              </span>
            </div>
            <h2 className="font-comic text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-wide mt-1">
              WEB THROWER 3D: TARGET PATROL
            </h2>
            <p className="text-white/90 font-comic text-xs sm:text-sm font-semibold max-w-xl mt-0.5">
              Aim with your cursor and click to launch high-velocity web fluid at gliding villains! Keep your streak alive before time expires!
            </p>
          </div>

          <button
            onClick={onBackToArcade}
            className="bg-white hover:bg-[#ffdf9f] text-[#1b1b20] border-3 border-[#1b1b20] px-4 py-2 font-comic text-xs sm:text-sm font-black uppercase ink-btn ink-shadow-sm"
          >
            ← ALL 6 GAMES
          </button>
        </div>
      </div>

      {/* Game HUD Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 border-4 border-[#1b1b20] bg-white p-3 sm:p-4 ink-shadow-md font-comic">
        <div className="border-2 border-[#1b1b20] bg-[#fff0f0] p-2 text-center">
          <span className="text-[10px] font-black uppercase text-[#dc2626] block">SCORE</span>
          <span className="text-xl sm:text-2xl font-black text-[#dc2626]">{score}</span>
        </div>

        <div className="border-2 border-[#1b1b20] bg-[#f0ecf4] p-2 text-center">
          <span className="text-[10px] font-black uppercase text-[#1b1b20] block">HIGH SCORE</span>
          <span className="text-xl sm:text-2xl font-black text-[#1b1b20] flex items-center justify-center gap-1">
            <Trophy className="w-4 h-4 text-[#f9bd22]" /> {highScore}
          </span>
        </div>

        <div className="border-2 border-[#1b1b20] bg-[#fff5ea] p-2 text-center">
          <span className="text-[10px] font-black uppercase text-[#765700] block">WEB AMMO</span>
          <span className="text-xl sm:text-2xl font-black text-[#765700] flex items-center justify-center gap-1">
            🕸️ {ammo}/10
          </span>
        </div>

        <div className="border-2 border-[#1b1b20] bg-[#ffdf9f] p-2 text-center">
          <span className="text-[10px] font-black uppercase text-[#261a00] block">STREAK COMBO</span>
          <span className="text-xl sm:text-2xl font-black text-[#261a00] flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 text-[#b8121d]" /> x{combo}.0
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 border-2 border-[#1b1b20] bg-[#1b1b20] text-white p-2 text-center flex flex-col justify-center">
          <span className="text-[10px] font-black uppercase text-[#f9bd22] block">TIME LEFT</span>
          <span className="text-xl sm:text-2xl font-black text-white">{timeLeft}s</span>
        </div>
      </div>

      {/* 3D Perspective Interactive Canvas / Rooftop Arena */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onClick={handleThrowWeb}
        className="relative w-full h-[450px] sm:h-[500px] border-4 border-[#1b1b20] bg-gradient-to-b from-[#111827] via-[#1e1b4b] to-[#450a0a] overflow-hidden cursor-crosshair select-none ink-shadow-xl perspective-1000"
      >
        {/* NYC Rooftop 3D Parallax Skyline Silhouette Layer */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute bottom-0 inset-x-0 h-44 bg-[radial-gradient(#dc2626_1px,transparent_1px)] [background-size:16px_16px]" />
          {/* Distant building blocks */}
          <div className="absolute bottom-0 left-[5%] w-24 h-48 bg-[#090d16] border-t-2 border-r-2 border-red-500/30" />
          <div className="absolute bottom-0 left-[22%] w-32 h-64 bg-[#0c1222] border-t-2 border-l-2 border-red-500/40" />
          <div className="absolute bottom-0 left-[45%] w-28 h-56 bg-[#090d16] border-t-2 border-red-500/20" />
          <div className="absolute bottom-0 right-[25%] w-36 h-72 bg-[#0c1222] border-t-2 border-r-2 border-red-500/40" />
          <div className="absolute bottom-0 right-[5%] w-24 h-52 bg-[#090d16] border-t-2 border-l-2 border-red-500/20" />
        </div>

        {/* Comic Halftone Overlay on Sky */}
        <div className="absolute inset-0 comic-dots-red pointer-events-none opacity-20" />

        {/* Moving Targets / Villains */}
        {targets.map((target) => (
          <div
            key={target.id}
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: `translate(-50%, -50%) scale(${target.isHit ? 0.8 : 1})`,
              transition: 'transform 0.2s ease'
            }}
            className={`absolute pointer-events-none transition-opacity ${
              target.isHit ? 'opacity-40 filter grayscale' : 'opacity-100'
            }`}
          >
            <div className="relative group">
              {/* Comic Target Container */}
              <div
                className={`p-2 sm:p-3 border-3 border-[#1b1b20] ${
                  target.type === 'bonus'
                    ? 'bg-[#f9bd22]'
                    : target.type === 'goblin'
                    ? 'bg-[#22c55e]'
                    : target.type === 'vulture'
                    ? 'bg-[#006398]'
                    : 'bg-[#dc2626]'
                } ink-shadow-md flex flex-col items-center justify-center`}
              >
                <span className="text-3xl sm:text-4xl filter drop-shadow-md">{target.emoji}</span>
                <span className="font-comic text-[9px] sm:text-[10px] font-black uppercase text-[#1b1b20] bg-white px-1 mt-1 border border-[#1b1b20] whitespace-nowrap">
                  {target.name}
                </span>
                <span className="font-mono text-[9px] font-bold text-white bg-[#1b1b20] px-1 mt-0.5">
                  +{target.points}
                </span>
              </div>

              {/* Wrapped in Web Effect when hit */}
              {target.isHit && (
                <div className="absolute inset-0 flex items-center justify-center text-4xl animate-spin">
                  🕸️
                </div>
              )}

              {/* Comic Sound Word Popup */}
              {target.isHit && target.hitText && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#dc2626] text-white border-2 border-[#1b1b20] px-2 py-0.5 font-comic text-xs font-black uppercase ink-shadow-sm whitespace-nowrap animate-bounce">
                  {target.hitText}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Web Splats Left by Web Shoots */}
        {splats.map((splat) => (
          <div
            key={splat.id}
            style={{
              left: `${splat.x}%`,
              top: `${splat.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            className="absolute pointer-events-none z-20 flex flex-col items-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 border-2 border-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-ping">
              <span className="text-2xl">🕸️</span>
            </div>
            {splat.text && (
              <span className="bg-[#f9bd22] text-[#1b1b20] border-2 border-[#1b1b20] font-comic font-black text-xs px-2 py-0.5 uppercase ink-shadow-sm -mt-3">
                {splat.text}
              </span>
            )}
          </div>
        ))}

        {/* Custom 3D Web Shooter Crosshair following mouse */}
        <div
          style={{
            left: `${crosshairPos.x}%`,
            top: `${crosshairPos.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          className="absolute pointer-events-none z-30 transition-transform duration-75"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-[#dc2626] flex items-center justify-center animate-spin">
            <div className="w-3 h-3 bg-[#dc2626] rounded-full shadow-[0_0_10px_#dc2626]" />
          </div>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1b1b20] text-white text-[8px] font-comic font-black px-1 border border-white uppercase">
            TARGET-LOCK
          </div>
        </div>

        {/* Start / Game Over Overlay */}
        {!gameActive && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-40">
            {gameOver ? (
              <div className="bg-white border-4 border-[#1b1b20] p-6 sm:p-8 max-w-md w-full ink-shadow-xl text-[#1b1b20]">
                <span className="bg-[#dc2626] text-white font-comic text-xs font-black px-2 py-0.5 uppercase">
                  TIME'S UP! PATROL COMPLETED
                </span>
                <h3 className="font-comic text-3xl font-black uppercase text-[#1b1b20] mt-2">
                  PATROL DEBRIEF
                </h3>
                <div className="my-4 p-4 bg-[#fff0f0] border-2 border-[#1b1b20]">
                  <p className="font-comic text-sm font-black text-[#5b403d] uppercase">FINAL SCORE</p>
                  <p className="font-comic text-4xl font-black text-[#dc2626]">{score}</p>
                  {score >= highScore && score > 0 && (
                    <span className="font-comic text-xs font-black text-[#765700] bg-[#ffdf9f] px-2 py-0.5 border border-[#1b1b20] inline-block mt-1">
                      ⭐ NEW PERSONAL HIGH SCORE!
                    </span>
                  )}
                </div>
                <button
                  onClick={startGame}
                  className="w-full bg-[#dc2626] hover:bg-[#b8121d] text-white border-3 border-[#1b1b20] py-3 font-comic text-base font-black uppercase ink-btn ink-shadow-md"
                >
                  PLAY AGAIN 🎯
                </button>
              </div>
            ) : (
              <div className="bg-white border-4 border-[#1b1b20] p-6 sm:p-8 max-w-md w-full ink-shadow-xl text-[#1b1b20]">
                <span className="bg-[#dc2626] text-white font-comic text-xs font-black px-2 py-0.5 uppercase">
                  MISSION BRIEFING
                </span>
                <h3 className="font-comic text-2xl sm:text-3xl font-black uppercase text-[#1b1b20] mt-2">
                  WEB THROWER 3D
                </h3>
                <p className="text-xs sm:text-sm text-[#5b403d] font-semibold my-3 leading-relaxed">
                  The Sinister Six rogues are invading NYC airspace! Aim your cursor and click anywhere on the screen to sling webbing at targets. Reload your cartridge when empty!
                </p>
                <div className="flex justify-center gap-3 text-2xl my-2">
                  <span>👺</span>
                  <span>🦅</span>
                  <span>🐙</span>
                  <span>🔮</span>
                  <span>⭐</span>
                </div>
                <button
                  onClick={startGame}
                  className="w-full mt-3 bg-[#dc2626] hover:bg-[#b8121d] text-white border-3 border-[#1b1b20] py-3.5 font-comic text-lg font-black uppercase ink-btn ink-shadow-md"
                >
                  START WEB THROWER (45s) 🚀
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls Bar: Reload Web Cartridge & Like Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-4 border-[#1b1b20] bg-[#f0ecf4] p-3 sm:p-4 ink-shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReload}
            className="bg-[#006398] hover:bg-[#004f7a] text-white border-2 border-[#1b1b20] px-4 py-2 font-comic text-xs sm:text-sm font-black uppercase flex items-center gap-2 ink-btn ink-shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RELOAD WEB CARTRIDGE (AMMO: {ammo}/10)</span>
          </button>
          <span className="font-comic text-xs text-[#5b403d] hidden sm:inline font-bold">
            (Click anywhere on screen to shoot!)
          </span>
        </div>

        {/* Like Button directly below the Web Thrower Game Canvas */}
        <div className="flex items-center gap-2">
          <span className="font-comic text-[11px] font-black uppercase text-[#5b403d]">
            LIKE THIS GAME:
          </span>
          <LikeButton
            id="game-web-thrower-canvas"
            initialLikes={2480}
            label="LIKE WEB THROWER"
            compact
          />
        </div>
      </div>
    </section>
  );
};
