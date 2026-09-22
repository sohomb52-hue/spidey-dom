import React, { useState } from 'react';
import { BadgeItem } from '../../types';
import { LikeButton } from '../common/LikeButton';
import { Shield, Zap, Flame, Award, Building2, Radio } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface ProfileModeProps {
  score: number;
  triviaCleared: number;
  streak: number;
  badges: BadgeItem[];
}

export const ProfileMode: React.FC<ProfileModeProps> = ({
  score,
  triviaCleared,
  streak,
  badges
}) => {
  const [playerName, setPlayerName] = useState<string>('PETER_PARKER_FAN_616');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Stats calculation
  const accuracy = Math.min(94, 60 + Math.min(triviaCleared * 3, 34));
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;
  const bestStreak = Math.max(streak, 8);
  const cityProgressPercent = Math.min(100, Math.round((score / 5000) * 100));

  return (
    <section className="space-y-6 preserve-3d" id="profile-section">
      <div
        className="border-4 sm:border-6 border-[#1b1b20] bg-white p-4 sm:p-6 depth-shadow-comic animate-panel-enter"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Profile Card Header */}
        <div className="flex flex-wrap items-center justify-between border-b-3 border-[#1b1b20] pb-3 mb-6 gap-2">
          <div>
            <span className="bg-[#b8121d] text-white font-comic text-xs font-black px-2 py-0.5 uppercase ink-shadow-sm">
              DAILY BUGLE CITIZEN DOSSIER
            </span>
            <h3 className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20] mt-1">
              WEB-SLINGER PLAYER DOSSIER
            </h3>
          </div>
          <span className="bg-[#eae7ee] px-3 py-1 font-comic text-xs sm:text-sm font-black border-2 border-[#1b1b20] ink-shadow-sm">
            HERO RANK: {score >= 2000 ? 'MULTIVERSE VETERAN' : 'FRIENDLY NEIGHBORHOOD'}
          </span>
        </div>

        {/* Top Bento: Avatar & Identity */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mb-6 preserve-3d">
          {/* Avatar Comic Box */}
          <div
            className="md:col-span-4 border-3 border-[#1b1b20] bg-[#eae7ee] p-4 depth-shadow-comic flex flex-col items-center"
            style={{ transform: 'translateZ(12px)' }}
          >
            <span className="font-comic text-[10px] font-black uppercase text-[#5b403d] mb-1">
              OFFICIAL SPIDER-AVATAR
            </span>
            <div className="w-40 h-40 border-3 border-[#1b1b20] bg-white overflow-hidden relative ink-shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=600&auto=format&fit=crop&q=80"
                alt="Player Spider-Verse Comic Avatar"
                className="w-full h-full object-cover filter contrast-120 saturate-110 hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 comic-halftone pointer-events-none" />
            </div>

            {/* Like button directly below player avatar image */}
            <div className="mt-3 pt-2 border-t border-[#1b1b20]/20 w-full flex justify-center bg-white p-1.5 border border-[#1b1b20]">
              <LikeButton
                id="player-avatar"
                initialLikes={1610}
                label="LIKE AVATAR"
                compact
              />
            </div>
          </div>

          {/* Identity & Core Figures */}
          <div className="md:col-span-8 space-y-4 preserve-3d">
            <div
              className="bg-[#ffdf9f] border-3 border-[#1b1b20] p-4 depth-shadow-comic"
              style={{ transform: 'translateZ(10px)' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-comic text-xs font-black text-[#765700] uppercase">
                  PLAYER CODENAME:
                </span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="font-comic text-[10px] font-black underline text-[#1b1b20] uppercase cursor-pointer"
                >
                  {isEditing ? 'DONE' : 'EDIT NAME'}
                </button>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                  className="w-full mt-1 bg-white border-2 border-[#1b1b20] px-2 py-1 font-comic text-lg font-black text-[#1b1b20] focus:outline-none"
                />
              ) : (
                <h4 className="font-comic text-2xl sm:text-3xl font-black text-[#1b1b20] uppercase leading-tight mt-1">
                  {playerName}
                </h4>
              )}
            </div>

            {/* High Impact Comic Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 preserve-3d">
              <div
                className="bg-white border-2 border-[#1b1b20] p-3 text-center depth-shadow-comic hover:translate-y-[-2px] transition-transform"
                style={{ transform: 'translateZ(14px)' }}
              >
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block">
                  TOTAL SCORE
                </span>
                <span className="font-comic text-xl sm:text-2xl font-black text-[#b8121d]">
                  {score.toLocaleString()}
                </span>
              </div>

              <div
                className="bg-white border-2 border-[#1b1b20] p-3 text-center depth-shadow-comic hover:translate-y-[-2px] transition-transform"
                style={{ transform: 'translateZ(14px)' }}
              >
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block">
                  FACTS CLEARED
                </span>
                <span className="font-comic text-xl sm:text-2xl font-black text-[#006398]">
                  {triviaCleared}
                </span>
              </div>

              <div
                className="bg-white border-2 border-[#1b1b20] p-3 text-center depth-shadow-comic hover:translate-y-[-2px] transition-transform"
                style={{ transform: 'translateZ(14px)' }}
              >
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block">
                  BEST STREAK
                </span>
                <span className="font-comic text-xl sm:text-2xl font-black text-[#765700] flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 text-[#765700]" /> {bestStreak}
                </span>
              </div>

              <div
                className="bg-white border-2 border-[#1b1b20] p-3 text-center depth-shadow-comic hover:translate-y-[-2px] transition-transform"
                style={{ transform: 'translateZ(14px)' }}
              >
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block">
                  BADGES
                </span>
                <span className="font-comic text-xl sm:text-2xl font-black text-[#1b1b20] flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-[#765700]" /> {unlockedBadgesCount} / {badges.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comic Visualized Meters (Spider-Sense Accuracy, Web Chain, City Progress) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t-3 border-[#1b1b20] preserve-3d">
          {/* Accuracy: Spider-Sense Meter */}
          <div
            className="border-3 border-[#1b1b20] bg-[#f0ecf4] p-4 depth-shadow-comic"
            style={{ transform: 'translateZ(8px)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-comic text-xs font-black uppercase text-[#b8121d] flex items-center gap-1">
                <Radio className="w-4 h-4" /> SPIDER-SENSE ACCURACY
              </span>
              <span className="font-comic text-sm font-black">{accuracy}%</span>
            </div>
            <div className="w-full bg-white border-2 border-[#1b1b20] h-6 p-0.5 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#006398] via-[#f9bd22] to-[#b8121d] transition-all duration-500"
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <p className="text-[11px] font-semibold text-[#5b403d] mt-2">
              Reflects true intuition when detecting Mysterio's falsehoods!
            </p>
          </div>

          {/* Streak: Web Chain */}
          <div
            className="border-3 border-[#1b1b20] bg-[#f0ecf4] p-4 depth-shadow-comic"
            style={{ transform: 'translateZ(8px)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-comic text-xs font-black uppercase text-[#006398] flex items-center gap-1">
                <Zap className="w-4 h-4" /> STREAK WEB CHAIN
              </span>
              <span className="font-comic text-sm font-black">{streak} LINKS</span>
            </div>
            <div className="flex items-center gap-1 py-1 overflow-x-auto">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-5 border-2 border-[#1b1b20] flex items-center justify-center font-comic text-[9px] font-black ${
                    i < streak ? 'bg-[#b8121d] text-white' : 'bg-white text-gray-400'
                  }`}
                >
                  🕸️
                </div>
              ))}
            </div>
            <p className="text-[11px] font-semibold text-[#5b403d] mt-2">
              Consecutive comic answers unbroken by Doc Ock!
            </p>
          </div>

          {/* XP: City Progress */}
          <div
            className="border-3 border-[#1b1b20] bg-[#f0ecf4] p-4 depth-shadow-comic"
            style={{ transform: 'translateZ(8px)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-comic text-xs font-black uppercase text-[#765700] flex items-center gap-1">
                <Building2 className="w-4 h-4" /> NYC CITY PATROL XP
              </span>
              <span className="font-comic text-sm font-black">{cityProgressPercent}%</span>
            </div>
            <div className="w-full bg-white border-2 border-[#1b1b20] h-6 p-0.5 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ffdf9f] to-[#f9bd22] transition-all duration-500"
                style={{ width: `${cityProgressPercent}%` }}
              />
            </div>
            <p className="text-[11px] font-semibold text-[#5b403d] mt-2">
              Patrolling Queens, Brooklyn, and Manhattan rooftops.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
