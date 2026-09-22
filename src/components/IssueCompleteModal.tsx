/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { playSound } from '../utils/audio';
import { Trophy, ArrowRight, Sparkles, X, RotateCcw, BookOpen, Award } from 'lucide-react';
import { BadgeItem } from '../types';

interface IssueCompleteModalProps {
  isOpen: boolean;
  score: number;
  factsMastered: number;
  bestCombo: number;
  sensePercent: number;
  badges: BadgeItem[];
  onPlayAgain: () => void;
  onExploreFacts: () => void;
  onViewAchievements: () => void;
  onClose: () => void;
}

export const IssueCompleteModal: React.FC<IssueCompleteModalProps> = ({
  isOpen,
  score,
  factsMastered,
  bestCombo,
  sensePercent,
  badges,
  onPlayAgain,
  onExploreFacts,
  onViewAchievements,
  onClose
}) => {
  if (!isOpen) return null;

  const unlockedBadges = badges.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1b1b20]/85 backdrop-blur-xs overflow-y-auto">
      {/* Comic Action Speed Lines */}
      <div className="comic-speed-lines absolute inset-0 opacity-40 pointer-events-none" />

      <div className="relative bg-[#fffbf0] border-4 sm:border-6 border-[#1b1b20] max-w-xl w-full p-5 sm:p-7 ink-shadow-red-lg z-10 my-6 -rotate-0.5">
        {/* Top Comic Header Banner */}
        <div className="flex items-center justify-between border-b-4 border-[#1b1b20] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#dc2626] text-white font-comic text-xs sm:text-sm font-black px-3 py-1 uppercase border-2 border-[#1b1b20] ink-shadow-sm rotate-1">
              FINALE CLIMAX!
            </span>
            <span className="bg-[#f9bd22] text-[#1b1b20] font-comic text-xs font-black px-2 py-1 uppercase border-2 border-[#1b1b20]">
              MARVEL ISSUE #300
            </span>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-8 h-8 bg-white border-2 border-[#1b1b20] flex items-center justify-center font-black text-[#1b1b20] hover:bg-[#dc2626] hover:text-white transition-colors ink-btn cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title: ISSUE COMPLETE */}
        <div className="text-center my-3">
          <h2 className="font-comic text-3xl sm:text-5xl font-black uppercase text-[#dc2626] tracking-tight leading-none drop-shadow-[2px_2px_0_#1b1b20]">
            ISSUE COMPLETE!
          </h2>
          <p className="font-comic text-xs sm:text-sm font-black text-[#5b403d] uppercase tracking-wider mt-1">
            "ANOTHER TRIUMPH IN THE ANNOTATED MULTIVERSE!"
          </p>
        </div>

        {/* The 3 Core Stats (Section 11) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 my-5">
          {/* Stat 1: Spider-Sense % */}
          <div className="bg-white border-3 border-[#1b1b20] p-3 text-center ink-shadow-sm rotate-0.5">
            <span className="font-comic text-[9px] sm:text-[10px] font-black uppercase text-[#dc2626] block">
              YOUR SPIDER-SENSE
            </span>
            <span className="font-comic text-2xl sm:text-3xl font-black text-[#1b1b20]">
              {sensePercent}%
            </span>
          </div>

          {/* Stat 2: Facts Mastered */}
          <div className="bg-white border-3 border-[#1b1b20] p-3 text-center ink-shadow-sm -rotate-0.5">
            <span className="font-comic text-[9px] sm:text-[10px] font-black uppercase text-[#006398] block">
              FACTS MASTERED
            </span>
            <span className="font-comic text-2xl sm:text-3xl font-black text-[#1b1b20]">
              {factsMastered}
            </span>
          </div>

          {/* Stat 3: Best Combo */}
          <div className="bg-white border-3 border-[#1b1b20] p-3 text-center ink-shadow-sm rotate-1">
            <span className="font-comic text-[9px] sm:text-[10px] font-black uppercase text-[#f9bd22] block">
              BEST COMBO
            </span>
            <span className="font-comic text-2xl sm:text-3xl font-black text-[#1b1b20]">
              ×{String(bestCombo).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Collectible Comic Stickers / Badges Unlocked (Section 11) */}
        <div className="bg-white border-3 border-[#1b1b20] p-3.5 mb-5 ink-shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-comic text-[11px] font-black uppercase text-[#1b1b20] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f9bd22]" />
              COLLECTIBLE COMIC STICKERS UNLOCKED
            </span>
            <span className="text-[10px] font-mono text-[#5b403d] font-bold">STICKER-VAULT</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {unlockedBadges.map((badge, idx) => (
              <div
                key={badge.id || idx}
                className="bg-[#fff0f0] border-2 border-[#1b1b20] p-2 text-center rounded-sm hover:-translate-y-1 transition-transform cursor-pointer group"
                title={badge.description}
              >
                <div className="text-2xl group-hover:scale-125 transition-transform mb-1">
                  {badge.emoji || '🕷️'}
                </div>
                <span className="font-comic text-[10px] font-black uppercase text-[#dc2626] block truncate">
                  {badge.name}
                </span>
                <span className="text-[9px] font-mono text-[#5b403d] block uppercase">
                  UNLOCKED
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Prompt */}
        <div className="text-center mb-4">
          <span className="font-comic text-sm sm:text-base font-black text-[#1b1b20] uppercase bg-[#ffdf9f] px-4 py-1 border-2 border-[#1b1b20] ink-shadow-sm inline-block">
            READY FOR THE NEXT ISSUE?
          </span>
        </div>

        {/* 3 Action Buttons (Section 11) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => {
              playSound('click');
              onPlayAgain();
            }}
            className="bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-xs sm:text-sm font-black py-3 px-3 border-3 border-[#1b1b20] ink-shadow-sm hover:-translate-y-0.5 ink-btn flex items-center justify-center gap-1.5 uppercase cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              onExploreFacts();
            }}
            className="bg-[#006398] hover:bg-[#004e78] text-white font-comic text-xs sm:text-sm font-black py-3 px-3 border-3 border-[#1b1b20] ink-shadow-sm hover:-translate-y-0.5 ink-btn flex items-center justify-center gap-1.5 uppercase cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>EXPLORE FACTS</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              onViewAchievements();
            }}
            className="bg-[#f9bd22] hover:bg-[#e0a618] text-[#1b1b20] font-comic text-xs sm:text-sm font-black py-3 px-3 border-3 border-[#1b1b20] ink-shadow-sm hover:-translate-y-0.5 ink-btn flex items-center justify-center gap-1.5 uppercase cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>ACHIEVEMENTS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
