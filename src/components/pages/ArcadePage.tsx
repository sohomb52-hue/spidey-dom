import React from 'react';
import { arcadeGamesList } from '../../data/spiderCharactersData';
import { ArcadeGame, WebPageId, GameMode } from '../../types';
import { playSound } from '../../utils/audio';
import { LikeButton } from '../common/LikeButton';
import { ComicTiltCard } from '../ComicTiltCard';
import { Gamepad2, Zap, Flame, Trophy, Play, Sparkles } from 'lucide-react';

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
                6 MULTIVERSE MINI-GAMES
              </span>
            </div>
            <h1 className="font-comic text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-wide leading-none">
              SPIDER-VERSE ARCADE CABINET
            </h1>
            <p className="text-white/90 font-comic text-sm sm:text-base font-semibold mt-2 leading-relaxed">
              Step into the neon ink arcade of Earth-616! Sling webs on NYC rooftops, identify multiverse Spider-heroes, beat the clock, and master the canonical archives.
            </p>
          </div>

          {/* Quick Stats Box */}
          <div className="bg-[#1b1b20] border-3 border-white p-3.5 ink-shadow-md text-center min-w-[200px] flex-shrink-0">
            <span className="font-comic text-[10px] font-black uppercase text-[#f9bd22] block mb-1">
              CURRENT HERO SCORE
            </span>
            <span className="font-comic text-3xl font-black text-white">
              {score.toLocaleString()} PTS
            </span>
            <div className="mt-2 pt-2 border-t border-white/20 flex justify-between text-xs font-comic text-white/90">
              <span>STREAK: <span className="text-[#f9bd22]">🔥 {streak}</span></span>
              <span>GAMES: <span className="text-white font-bold">6 / 6</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* The 6 Arcade Games: 3D Animated Grid with Mouse-Tracking 3D Tilt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {arcadeGamesList.map((game: ArcadeGame) => (
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
                </div>

                {/* Interactive Like Button directly below game cover image */}
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
        ))}
      </div>
    </section>
  );
};
