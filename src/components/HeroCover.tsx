import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audio';
import { LikeButton } from './common/LikeButton';
import { ComicTiltCard } from './ComicTiltCard';
import { Gamepad2, Target, Users, Sparkles, Radio, Play, ArrowRight } from 'lucide-react';
import { WebPageId } from '../types';
import {
  GAME_THUMB_WEB_THROWER,
  GAME_THUMB_SPIDER_ID,
  GAME_THUMB_FACT_ATTACK
} from '../data/spiderArtAssets';

interface HeroCoverProps {
  onStartAdventure: (e: React.MouseEvent) => void;
  onNavigatePage?: (page: WebPageId) => void;
}

export const HeroCover: React.FC<HeroCoverProps> = ({ onStartAdventure, onNavigatePage }) => {
  const [captionStep, setCaptionStep] = useState<number>(0);

  // Dynamic Comic Captions (Section 5)
  useEffect(() => {
    const t1 = setTimeout(() => setCaptionStep(1), 250);
    const t2 = setTimeout(() => setCaptionStep(2), 650);
    const t3 = setTimeout(() => setCaptionStep(3), 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section
      id="cover-section"
      className="relative border-4 sm:border-6 border-[#1b1b20] bg-[#fffbf0] p-2 sm:p-4 ink-shadow-red-multi overflow-hidden"
    >
      {/* Vintage Corner Red Ribbon */}
      <div className="absolute top-0 right-0 z-30 bg-[#dc2626] text-white font-comic font-black text-xs py-1 px-8 rotate-45 translate-x-7 translate-y-2 border-2 border-[#1b1b20] ink-shadow-sm uppercase">
        TRUE BELIEVER!
      </div>

      {/* Dynamic Comic Captions Row (Section 5) */}
      <div className="flex flex-wrap items-center gap-2 mb-3 z-30 relative">
        {captionStep >= 1 && (
          <div className="bg-[#f9bd22] border-2 border-[#1b1b20] px-3 py-1 ink-shadow-sm -rotate-1 transition-all duration-300">
            <span className="font-comic text-[11px] sm:text-xs font-black text-[#1b1b20] uppercase tracking-wider">
              "MEANWHILE..."
            </span>
          </div>
        )}
        {captionStep >= 2 && (
          <div className="bg-white border-2 border-[#1b1b20] px-3 py-1 ink-shadow-sm rotate-1 transition-all duration-300">
            <span className="font-comic text-[11px] sm:text-xs font-black text-[#dc2626] uppercase tracking-wider">
              "IN NEW YORK CITY..."
            </span>
          </div>
        )}
        {captionStep >= 3 && (
          <div className="bg-[#dc2626] text-white border-2 border-[#1b1b20] px-3 py-1 ink-shadow-sm -rotate-0.5 spidey-tingle-anim transition-all duration-300">
            <span className="font-comic text-[11px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-[#f9bd22] animate-spin" />
              "THE SPIDER-SENSE IS CALLING!"
            </span>
          </div>
        )}
      </div>

      {/* 2.5D Layered Comic Backdrop with Attached NYC Skyline & Action Pose */}
      <div className="relative w-full min-h-[450px] sm:min-h-[420px] md:h-[480px] border-3 sm:border-4 border-[#1b1b20] overflow-hidden flex items-end">
        {/* Layer 1: Skyline Artwork */}
        <img
          alt="Classic Spider-Man high-rise comic skyline of New York City during golden hour"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center filter saturate-125 contrast-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBscJXRK3PQxN14y7ZBa1HeEaeJRivX4LKWY0Ibqt4SLEc47fjTssLmWcgB8nRfEs5MlZLLlpioR8yVyrBKCqXaIJpydiDP0fO9ukdl2-_V95w5kfbLtXTQ8uaWCLjKubu0o_Esu-lk57P7BXM3JoWYUIg4ildlwySRBvjLN-d7T9i120roNbYcyNQUK93Q3jRF24wvFBIoE17uFrubqnzGr8fAc6-oa-t-NmYbb_I1Hvj_vWU-Rw4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#991b1b]/95 via-[#1b1b20]/45 to-transparent pointer-events-none" />
        <div className="comic-dots-red absolute inset-0 opacity-20 pointer-events-none" />
        <div className="comic-speed-lines absolute inset-0 opacity-25 pointer-events-none" />

        {/* Dynamic Web Line Across Top Corner */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="20" x2="35%" y2="55%" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="4 3" />
          <line x1="100%" y1="0" x2="65%" y2="45%" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="4 3" />
        </svg>

        {/* Top Left Stan Lee Style Caption Box */}
        <div className="absolute top-4 left-4 z-20 bg-[#f9bd22] border-2 border-[#1b1b20] p-2.5 max-w-xs ink-shadow-md -rotate-1">
          <span className="font-comic text-[10px] font-black text-[#261a00] uppercase block tracking-wider">
            STAN LEE PRESENTS:
          </span>
          <p className="font-comic text-xs sm:text-sm font-black text-[#1b1b20] leading-tight uppercase">
            "IN THE MIGHTY TRADITION OF MULTIVERSE MARVELS!"
          </p>
        </div>

        {/* Top Right "THIS IS A GAME" Badge (Section 5) */}
        <div className="absolute top-4 right-14 sm:right-16 z-20 bg-[#1b1b20] text-[#f9bd22] border-2 border-white px-3 py-1 ink-shadow-sm rotate-2">
          <span className="font-comic text-xs font-black uppercase flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-[#dc2626]" />
            THIS IS A PLAYABLE COMIC GAME
          </span>
        </div>

        {/* Main Splash Dialogue & Hero Typography */}
        <div className="relative z-20 p-4 md:p-8 w-full flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="max-w-2xl">
            {/* Spider-Man Comic Dialogue Speech Bubble */}
            <div className="relative bg-white border-3 border-[#1b1b20] p-3.5 sm:p-4 mb-4 bubble-bottom ink-shadow-lg max-w-lg -rotate-0.5">
              <div className="flex items-start gap-2">
                <span className="bg-[#dc2626] text-white text-xs font-comic font-black px-1.5 py-0.5 uppercase tracking-wider">
                  SPIDEY:
                </span>
                <p className="font-comic text-sm sm:text-base font-black text-[#1b1b20] leading-snug uppercase">
                  "YOUR SPIDER-SENSE IS TINGLING! DIVE INTO 6 MULTIVERSE MINI-GAMES, 3D WEB SHOOTING & CANON FACTS!"
                </p>
              </div>
            </div>

            {/* Kinetic Red Comic Title with 3D Pop */}
            <div className="bg-white/95 border-3 sm:border-4 border-[#1b1b20] p-3 sm:p-5 ink-shadow-red inline-block rotate-0.5">
              <h1 className="font-comic text-3xl sm:text-5xl md:text-6xl font-black text-[#dc2626] leading-none uppercase tracking-tighter drop-shadow-[2px_2px_0_#1b1b20]">
                SPIDER-VERSE: FACT ATTACK!
              </h1>
              <p className="font-comic text-sm sm:text-lg md:text-xl font-black text-[#1b1b20] uppercase leading-none mt-1 sm:mt-2">
                6 INTERACTIVE COMIC GAMES • <span className="bg-[#dc2626] text-white px-2 py-0.5">3D WEB THROWER</span>
              </p>
            </div>
          </div>

          {/* Hero Action Trigger: THWIP! Starburst Button & Image Like Button */}
          <div className="relative flex-shrink-0 flex flex-col items-center">
            <button
              onClick={(e) => {
                playSound('thwip');
                onStartAdventure(e);
              }}
              className="relative group cursor-pointer ink-btn transition-transform focus:outline-none"
              title="Start Spider-Man Trivia Adventure!"
            >
              {/* Starburst Explosion Graphic */}
              <div className="w-36 h-36 md:w-44 md:h-44 relative flex items-center justify-center transform group-hover:scale-105 group-active:scale-95 transition-transform duration-150">
                <img
                  alt="Comic book explosion starburst graphic"
                  className="w-full h-full object-contain filter drop-shadow-[4px_4px_0_#1b1b20]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuASanwD--QfQc952DXLesH3zXTiP3DO1UnWbUe9a66DY8z3gulxnVhfXv3P3lH-VxcT9tRHU_TBdRPkyLgHVY9uO7Mwqp21hjjO2Z2lPI633vLv89LjaTiBab78aBBbsdWE-sMP-BHkcza6_8cipfkfqGF0wX3QMcADsL0nLm1pJ4Fz9x1fonq1YeKeHWCT74CBQ1hjjuur-fBTaERV-dNUp8VlWsKZW5YrPatVWoLvhE1PKgIhtsk"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                  <span className="font-comic text-2xl md:text-3xl leading-none text-[#1b1b20] font-black uppercase tracking-tighter drop-shadow-xs">
                    THWIP!
                  </span>
                  <span className="font-comic text-[11px] md:text-xs font-black text-white uppercase bg-[#dc2626] px-2 py-0.5 border border-[#1b1b20] mt-1 shadow-xs">
                    START PLAYING
                  </span>
                </div>
              </div>
            </button>

            {/* Like button below Starburst image */}
            <div className="mt-1 bg-white p-1 border-2 border-[#1b1b20] ink-shadow-sm">
              <LikeButton id="hero-starburst" initialLikes={845} label="LIKE THWIP" compact />
            </div>
          </div>
        </div>
      </div>

      {/* Comic Panel Footer Banner for NYC Skyline image with Like button below it */}
      <div className="mt-2 bg-[#fff0f0] border-3 border-[#1b1b20] px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#dc2626] text-white font-comic text-[10px] font-black px-2 py-0.5 uppercase">
            PANEL ARTWORK #01
          </span>
          <span className="font-comic text-xs font-black text-[#1b1b20] uppercase">
            "NEW YORK CITY: THE WEB-SLINGER'S ROOFTOP PLAYGROUND"
          </span>
        </div>
        {/* Like Button directly below the skyline image */}
        <LikeButton id="hero-skyline" initialLikes={1962} label="LIKE THIS SKYLINE" />
      </div>

      {/* 3 Quick Game Launch Cards with High-Quality Distinct Comic-Style Action Thumbnails */}
      {onNavigatePage && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Web Thrower 3D (Rooftop Action Shot) */}
          <ComicTiltCard maxTilt={10} scaleOnHover={1.03} className="h-full">
            <div
              onClick={() => {
                playSound('thwip');
                onNavigatePage('web_thrower');
              }}
              className="cursor-pointer bg-white hover:bg-[#fff0f0] border-4 border-[#1b1b20] depth-shadow-comic flex flex-col justify-between ink-btn group h-full transition-all duration-200 overflow-hidden"
            >
              <div>
                {/* Comic Card Header Badge */}
                <div className="bg-[#dc2626] text-white px-3 py-1 flex items-center justify-between border-b-2 border-[#1b1b20]">
                  <span className="font-comic text-[10px] font-black uppercase tracking-wider">
                    GAME #01 • 3D ROOFTOP ACTION
                  </span>
                  <span className="bg-[#1b1b20] text-[#facc15] font-comic text-[9px] font-black px-1.5 py-0.2 border border-white/40">
                    MEDIUM
                  </span>
                </div>

                {/* Rooftop Target Action Shot Visual */}
                <div className="relative h-32 sm:h-36 overflow-hidden border-b-3 border-[#1b1b20] bg-black">
                  <img
                    src={GAME_THUMB_WEB_THROWER}
                    alt="Web Thrower 3D Rooftop Target Action"
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#1b1b20]/90 text-white font-comic text-[10px] font-black px-2 py-0.5 border border-white/30">
                    ROOFTOP TARGET SHOOTER
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3">
                  <h4 className="font-comic text-base sm:text-lg font-black uppercase text-[#1b1b20] group-hover:text-[#dc2626] leading-tight">
                    WEB THROWER 3D
                  </h4>
                  <p className="font-comic text-xs text-[#5b403d] font-bold mt-1 line-clamp-2">
                    Sling pressurized webs at flying Green Goblin gliders over NYC rooftops in 3D!
                  </p>
                </div>
              </div>

              {/* Card Footer with CTA & Like Button */}
              <div className="p-2.5 bg-[#fbf8f2] border-t-2 border-[#1b1b20] flex items-center justify-between">
                <LikeButton id="cover-web-thrower" initialLikes={940} label="LIKE" compact />
                <span className="font-comic text-xs font-black text-[#dc2626] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  PLAY GAME <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </ComicTiltCard>

          {/* Card 2: Multiverse Identi-Match (Character Detective Lineup) */}
          <ComicTiltCard maxTilt={10} scaleOnHover={1.03} className="h-full">
            <div
              onClick={() => {
                playSound('thwip');
                onNavigatePage('spider_id');
              }}
              className="cursor-pointer bg-white hover:bg-[#fff0f0] border-4 border-[#1b1b20] depth-shadow-comic flex flex-col justify-between ink-btn group h-full transition-all duration-200 overflow-hidden"
            >
              <div>
                {/* Header Badge */}
                <div className="bg-[#0284c7] text-white px-3 py-1 flex items-center justify-between border-b-2 border-[#1b1b20]">
                  <span className="font-comic text-[10px] font-black uppercase tracking-wider">
                    GAME #02 • CHARACTER DETECTIVE
                  </span>
                  <span className="bg-[#1b1b20] text-[#38bdf8] font-comic text-[9px] font-black px-1.5 py-0.2 border border-white/40">
                    HARD
                  </span>
                </div>

                {/* Character Detective Lineup Visual */}
                <div className="relative h-32 sm:h-36 overflow-hidden border-b-3 border-[#1b1b20] bg-black">
                  <img
                    src={GAME_THUMB_SPIDER_ID}
                    alt="Multiverse Identi-Match Lineup"
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#1b1b20]/90 text-white font-comic text-[10px] font-black px-2 py-0.5 border border-white/30">
                    MULTIVERSE VARIANTS
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3">
                  <h4 className="font-comic text-base sm:text-lg font-black uppercase text-[#1b1b20] group-hover:text-[#0284c7] leading-tight">
                    IDENTIFY SPIDERS
                  </h4>
                  <p className="font-comic text-xs text-[#5b403d] font-bold mt-1 line-clamp-2">
                    Test your Spider-Sense by matching multiverse heroes from Earth-616 to 2099!
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-2.5 bg-[#fbf8f2] border-t-2 border-[#1b1b20] flex items-center justify-between">
                <LikeButton id="cover-spider-id" initialLikes={780} label="LIKE" compact />
                <span className="font-comic text-xs font-black text-[#0284c7] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  PLAY GAME <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </ComicTiltCard>

          {/* Card 3: Arcade Hub / Fact Attack (Comic Battle Starburst) */}
          <ComicTiltCard maxTilt={10} scaleOnHover={1.03} className="h-full">
            <div
              onClick={() => {
                playSound('thwip');
                onNavigatePage('arcade');
              }}
              className="cursor-pointer bg-white hover:bg-[#fff0f0] border-4 border-[#1b1b20] depth-shadow-comic flex flex-col justify-between ink-btn group h-full transition-all duration-200 overflow-hidden"
            >
              <div>
                {/* Header Badge */}
                <div className="bg-[#1b1b20] text-white px-3 py-1 flex items-center justify-between border-b-2 border-[#1b1b20]">
                  <span className="font-comic text-[10px] font-black uppercase text-[#facc15] tracking-wider">
                    ARCADE HUB • 6 MINI-GAMES
                  </span>
                  <span className="bg-[#dc2626] text-white font-comic text-[9px] font-black px-1.5 py-0.2 border border-white/40">
                    ALL MODES
                  </span>
                </div>

                {/* Comic Battle Starburst Visual */}
                <div className="relative h-32 sm:h-36 overflow-hidden border-b-3 border-[#1b1b20] bg-black">
                  <img
                    src={GAME_THUMB_FACT_ATTACK}
                    alt="Spider-Verse Arcade Hub"
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#1b1b20]/90 text-[#facc15] font-comic text-[10px] font-black px-2 py-0.5 border border-white/30">
                    6 PLAYABLE MINI-GAMES
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3">
                  <h4 className="font-comic text-base sm:text-lg font-black uppercase text-[#1b1b20] group-hover:text-[#dc2626] leading-tight">
                    ARCADE CABINET
                  </h4>
                  <p className="font-comic text-xs text-[#5b403d] font-bold mt-1 line-clamp-2">
                    Enter the full arcade: Fact Attack, Web of Knowledge, Quotes & Speed Reflex!
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-2.5 bg-[#fbf8f2] border-t-2 border-[#1b1b20] flex items-center justify-between">
                <LikeButton id="cover-arcade-hub" initialLikes={1250} label="LIKE" compact />
                <span className="font-comic text-xs font-black text-[#dc2626] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  ALL GAMES <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </ComicTiltCard>
        </div>
      )}
    </section>
  );
};

