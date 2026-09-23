/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BadgeItem } from '../../types';
import { LikeButton } from '../common/LikeButton';
import {
  Shield,
  Zap,
  Flame,
  Award,
  Building2,
  Radio,
  LogOut,
  LogIn,
  UserCheck,
  Calendar,
  Gamepad2,
  Sparkles,
  Trophy,
  BookOpen
} from 'lucide-react';
import { playSound } from '../../utils/audio';
import { useSpiderAuth } from '../../context/AuthContext';

interface ProfileModeProps {
  score: number;
  triviaCleared: number;
  streak: number;
  badges: BadgeItem[];
  onNavigateToAuth?: () => void;
}

export const ProfileMode: React.FC<ProfileModeProps> = ({
  score: localScore,
  triviaCleared: localTriviaCleared,
  streak: localStreak,
  badges,
  onNavigateToAuth
}) => {
  const {
    user,
    userProfile,
    unlockedAchievementIds,
    discoveredFactIds,
    recentGameSessions,
    logOut
  } = useSpiderAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  // Authenticated figures vs local session fallback
  const isAuth = Boolean(user && userProfile);
  const displayName = isAuth
    ? userProfile?.displayName || user?.displayName || 'TRUE BELIEVER'
    : 'GUEST RECON WEBSLINGER';

  const totalScore = isAuth ? userProfile?.totalScore ?? localScore : localScore;
  const currentStreak = isAuth ? userProfile?.currentStreak ?? localStreak : localStreak;
  const bestStreak = isAuth ? userProfile?.bestStreak ?? Math.max(localStreak, 8) : Math.max(localStreak, 8);
  const factsDiscovered = isAuth ? (userProfile?.factsDiscovered ?? discoveredFactIds.length) : localTriviaCleared;
  const gamesPlayed = isAuth ? userProfile?.gamesPlayed ?? 1 : 1;
  const totalQuestions = isAuth ? userProfile?.totalQuestions ?? Math.max(localTriviaCleared, 1) : Math.max(localTriviaCleared, 1);
  const correctAnswers = isAuth ? userProfile?.correctAnswers ?? localTriviaCleared : localTriviaCleared;
  
  const accuracy = totalQuestions > 0
    ? Math.min(100, Math.round((correctAnswers / totalQuestions) * 100))
    : Math.min(94, 60 + Math.min(localTriviaCleared * 3, 34));

  const xp = isAuth ? (userProfile?.totalXP ?? Math.floor(totalScore * 0.8)) : Math.floor(localScore * 0.8);
  const unlockedBadgesCount = isAuth ? unlockedAchievementIds.length : badges.filter((b) => b.unlocked).length;
  const cityProgressPercent = Math.min(100, Math.round((totalScore / 5000) * 100));

  const handleLogoutClick = async () => {
    playSound('thwip');
    setLoggingOut(true);
    try {
      await logOut();
      if (onNavigateToAuth) {
        onNavigateToAuth();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <section className="space-y-6 preserve-3d" id="profile-section">
      <div
        className="border-4 sm:border-6 border-[#1b1b20] bg-white p-4 sm:p-6 depth-shadow-comic animate-panel-enter"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Profile Card Header */}
        <div className="flex flex-wrap items-center justify-between border-b-3 border-[#1b1b20] pb-3 mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#b8121d] text-white font-comic text-xs font-black px-2 py-0.5 uppercase ink-shadow-sm">
                DAILY BUGLE CITIZEN DOSSIER
              </span>
              {isAuth ? (
                <span className="bg-[#dcfce7] text-[#15803d] border border-[#15803d] font-comic text-[10px] font-black px-1.5 py-0.5 uppercase flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>FIRESTORE SYNC ACTIVE</span>
                </span>
              ) : (
                <span className="bg-[#fee2e2] text-[#b8121d] border border-[#b8121d] font-comic text-[10px] font-black px-1.5 py-0.5 uppercase">
                  UNLINKED GUEST SESSION
                </span>
              )}
            </div>
            <h3 className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20] mt-1">
              WEB-SLINGER HERO HQ
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-[#eae7ee] px-3 py-1 font-comic text-xs sm:text-sm font-black border-2 border-[#1b1b20] ink-shadow-sm">
              HERO RANK: {totalScore >= 2000 ? 'MULTIVERSE VETERAN' : 'FRIENDLY NEIGHBORHOOD'}
            </span>
            {isAuth ? (
              <button
                type="button"
                onClick={handleLogoutClick}
                disabled={loggingOut}
                className="bg-[#fee2e2] hover:bg-[#fecaca] text-[#b8121d] border-2 border-[#1b1b20] px-3 py-1 font-comic text-xs font-black uppercase ink-shadow-sm cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95"
                title="Log out and secure your progress"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>EXIT THE SPIDER-VERSE</span>
              </button>
            ) : (
              onNavigateToAuth && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('thwip');
                    onNavigateToAuth();
                  }}
                  className="bg-[#dc2626] hover:bg-[#b8121d] text-white border-2 border-[#1b1b20] px-3 py-1 font-comic text-xs font-black uppercase ink-shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>LOG IN / SAVE</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Guest Warning Banner if not authenticated */}
        {!isAuth && onNavigateToAuth && (
          <div className="mb-6 bg-[#fff8db] border-3 border-[#b45309] p-3 sm:p-4 text-[#78350f] flex flex-col sm:flex-row items-center justify-between gap-3 ink-shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕸️</span>
              <div>
                <p className="font-comic font-black text-xs sm:text-sm uppercase">
                  PLAYING AS GUEST — YOUR SPIDER-SENSE NEEDS AN ID!
                </p>
                <p className="text-xs font-mono">
                  Log in or create a hero account to save your score, streak, XP and unlocked facts across devices.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playSound('thwip');
                onNavigateToAuth();
              }}
              className="px-3 py-1.5 bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-xs font-black uppercase border-2 border-[#1b1b20] ink-shadow-sm whitespace-nowrap cursor-pointer"
            >
              CONNECT SPIDER-VERSE ID
            </button>
          </div>
        )}

        {/* Top Bento: Avatar & Identity Greeting */}
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
                loading="lazy"
                decoding="async"
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
            {/* Personalized Comic Hero Greeting Panel (Requirement 11) */}
            <div
              className="bg-[#ffdf9f] border-3 border-[#1b1b20] p-4 depth-shadow-comic relative overflow-hidden"
              style={{ transform: 'translateZ(10px)' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-comic text-xs font-black text-[#765700] uppercase">
                  AUTHENTICATED SPIDER-SENSE IDENTITY:
                </span>
                <span className="font-mono text-[11px] font-bold text-[#1b1b20]/70">
                  {user?.email || 'OFFLINE DOSSIER'}
                </span>
              </div>
              <h4 className="font-comic text-2xl sm:text-3xl font-black text-[#1b1b20] uppercase leading-tight mt-1 flex items-center gap-2">
                <span>HEY, {displayName}!</span>
                <span className="text-xl">🕷️</span>
              </h4>
              <p className="font-mono text-xs text-[#765700] font-bold mt-1 uppercase">
                YOUR SPIDER-SENSE IS CALIBRATED TO FREQUENCY 616-MCU.
              </p>
            </div>

            {/* High Impact Comic Stats Row (Requirement 11) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 preserve-3d">
              <div
                className="bg-white border-2 border-[#1b1b20] p-3 text-center depth-shadow-comic hover:translate-y-[-2px] transition-transform"
                style={{ transform: 'translateZ(14px)' }}
              >
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block">
                  TOTAL SCORE
                </span>
                <span className="font-comic text-xl sm:text-2xl font-black text-[#b8121d]">
                  {totalScore.toLocaleString()}
                </span>
              </div>

              <div
                className="bg-white border-2 border-[#1b1b20] p-3 text-center depth-shadow-comic hover:translate-y-[-2px] transition-transform"
                style={{ transform: 'translateZ(14px)' }}
              >
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block">
                  FACTS DISCOVERED
                </span>
                <span className="font-comic text-xl sm:text-2xl font-black text-[#006398]">
                  {factsDiscovered} / 100
                </span>
              </div>

              <div
                className="bg-white border-2 border-[#1b1b20] p-3 text-center depth-shadow-comic hover:translate-y-[-2px] transition-transform"
                style={{ transform: 'translateZ(14px)' }}
              >
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block">
                  CURRENT STREAK
                </span>
                <span className="font-comic text-xl sm:text-2xl font-black text-[#dc2626] flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 text-[#dc2626]" /> × {currentStreak.toString().padStart(2, '0')}
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
                  <Trophy className="w-4 h-4 text-[#765700]" /> × {bestStreak.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Second Row: XP, Games Played, Accuracy, Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 preserve-3d">
              <div
                className="bg-white border-2 border-[#1b1b20] p-3 text-center depth-shadow-comic"
                style={{ transform: 'translateZ(12px)' }}
              >
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block">
                  HERO XP
                </span>
                <span className="font-comic text-lg sm:text-xl font-black text-[#15803d] flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#15803d]" /> {xp.toLocaleString()}
                </span>
              </div>

              <div
                className="bg-white border-2 border-[#1b1b20] p-3 text-center depth-shadow-comic"
                style={{ transform: 'translateZ(12px)' }}
              >
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block">
                  GAMES PLAYED
                </span>
                <span className="font-comic text-lg sm:text-xl font-black text-[#1b1b20] flex items-center justify-center gap-1">
                  <Gamepad2 className="w-3.5 h-3.5 text-[#5b403d]" /> {gamesPlayed}
                </span>
              </div>

              <div
                className="bg-white border-2 border-[#1b1b20] p-3 text-center depth-shadow-comic"
                style={{ transform: 'translateZ(12px)' }}
              >
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block">
                  ACCURACY
                </span>
                <span className="font-comic text-lg sm:text-xl font-black text-[#006398]">
                  {accuracy}%
                </span>
              </div>

              <div
                className="bg-white border-2 border-[#1b1b20] p-3 text-center depth-shadow-comic"
                style={{ transform: 'translateZ(12px)' }}
              >
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block">
                  ACHIEVEMENTS
                </span>
                <span className="font-comic text-lg sm:text-xl font-black text-[#765700] flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#765700]" /> {unlockedBadgesCount} / {badges.length}
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
              <span className="font-comic text-sm font-black">{currentStreak} LINKS</span>
            </div>
            <div className="flex items-center gap-1 py-1 overflow-x-auto">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-5 border-2 border-[#1b1b20] flex items-center justify-center font-comic text-[9px] font-black ${
                    i < currentStreak ? 'bg-[#b8121d] text-white' : 'bg-white text-gray-400'
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

        {/* Real-Time Firestore Game Sessions History Panel (Requirement 8) */}
        {isAuth && recentGameSessions.length > 0 && (
          <div className="mt-6 pt-5 border-t-3 border-[#1b1b20]">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-[#1b1b20] text-white font-comic text-xs font-black px-2 py-0.5 uppercase tracking-wider">
                FIRESTORE GAME LOG
              </span>
              <span className="font-mono text-xs text-[#5b403d] font-bold">
                LAST {recentGameSessions.length} RECENT SESSIONS SAVED
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentGameSessions.slice(0, 6).map((session) => (
                <div
                  key={session.id}
                  className="bg-[#fffbf0] border-2 border-[#1b1b20] p-3 ink-shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-comic text-xs font-black uppercase text-[#dc2626] block">
                        {session.gameMode}
                      </span>
                      <span className="font-mono text-[10px] text-[#5b403d]">
                        {new Date(session.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="bg-[#f9bd22] text-[#1b1b20] font-comic text-xs font-black px-1.5 py-0.5 border border-[#1b1b20]">
                      +{session.score} PTS
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#1b1b20]/20 flex items-center justify-between text-[11px] font-mono">
                    <span>Accuracy: {session.accuracy}%</span>
                    <span>Streak: ×{session.bestStreak}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
