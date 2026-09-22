import React from 'react';
import { WebPageId } from '../types';
import { ComicsCodeSeal, SpiderBotGuide } from './icons/SpiderVerseBadges';
import { Volume2, VolumeX, Trophy, Gamepad2, Target, Users, BookOpen } from 'lucide-react';

interface ComicHeaderProps {
  currentPage: WebPageId;
  onSelectPage: (page: WebPageId) => void;
  sfxEnabled: boolean;
  onToggleSFX: () => void;
  onOpenBotGuide: () => void;
}

export const ComicHeader: React.FC<ComicHeaderProps> = ({
  currentPage,
  onSelectPage,
  sfxEnabled,
  onToggleSFX,
  onOpenBotGuide
}) => {
  const pages: { id: WebPageId; label: string; icon?: React.ReactNode; isArcade?: boolean }[] = [
    { id: 'cover', label: 'ISSUE COVER' },
    { id: 'arcade', label: '🕹️ 6 GAMES ARCADE', isArcade: true },
    { id: 'web_thrower', label: '🎯 WEB THROWER' },
    { id: 'spider_id', label: '👥 IDENTIFY HEROES' },
    { id: 'trivia', label: '⚡ FACT TRIVIA' },
    { id: 'canon', label: '📚 CANON ARCHIVE' },
    { id: 'vault', label: '🏆 VAULT' },
    { id: 'profile', label: '👤 DOSSIER' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b-4 border-[#1b1b20] shadow-[0_4px_0_0_#dc2626]">
      {/* Top Marvel Crimson Ribbon Banner */}
      <aside
        aria-label="Issue Header"
        className="w-full bg-gradient-to-r from-[#dc2626] via-[#b8121d] to-[#991b1b] text-white py-1 px-4 border-b-2 border-[#1b1b20] flex justify-between items-center text-xs font-comic uppercase tracking-wider overflow-hidden"
      >
        <div className="flex items-center gap-2">
          <span className="bg-white px-2 py-0.5 text-[#dc2626] font-black border border-[#1b1b20]">
            MARVEL COMICS GROUP
          </span>
          <span className="hidden sm:inline text-white/90 font-bold">
            SPIDER-VERSE MULTIVERSE HUB #1962
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[#f9bd22] text-[#1b1b20] font-black px-1.5 py-0.2 border border-[#1b1b20]">
            SPECIAL COLLECTOR'S EDITION
          </span>
          <span className="hidden md:inline font-mono text-white/90">
            APPROVED BY COMICS CODE AUTHORITY
          </span>
        </div>
      </aside>

      {/* Main Comic App Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap justify-between items-center gap-3">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <ComicsCodeSeal className="w-8 h-10 hidden xs:flex flex-shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h1
                onClick={() => onSelectPage('cover')}
                className="font-comic text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-[#dc2626] leading-none cursor-pointer hover:opacity-90 flex items-center gap-1.5"
              >
                <span>SPIDER-VERSE:</span>
                <span className="text-[#1b1b20]">FACT ATTACK</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-comic text-[10px] sm:text-xs font-black text-white uppercase bg-[#dc2626] px-1.5 py-0.2 border border-[#1b1b20]">
                6 ARCADE GAMES INCLUDED
              </span>
              <span className="text-[11px] text-[#5b403d] font-bold hidden sm:inline">
                MULTIVERSE INTERACTIVE COMIC BOOK
              </span>
            </div>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2">
          {pages.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPage(item.id)}
                className={`font-comic uppercase text-xs tracking-wider px-2.5 py-1 font-black transition-all ink-btn border-2 ${
                  item.isArcade
                    ? isActive
                      ? 'bg-[#dc2626] text-white border-[#1b1b20] ink-shadow-sm'
                      : 'bg-[#fff0f0] text-[#dc2626] border-[#dc2626] hover:bg-[#dc2626] hover:text-white'
                    : isActive
                    ? 'bg-[#1b1b20] text-white border-[#1b1b20] ink-shadow-sm'
                    : 'bg-white text-[#5b403d] border-transparent hover:border-[#1b1b20] hover:text-[#1b1b20]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bot Guide Assistant */}
          <button
            onClick={onOpenBotGuide}
            className="bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#1b1b20] px-2.5 py-1 flex items-center gap-1.5 ink-shadow-sm font-comic text-[11px] font-black uppercase text-[#991b1b] ink-btn"
            title="Spidey Bot Lore Guide"
          >
            <SpiderBotGuide className="w-5 h-5" />
            <span className="hidden sm:inline">SPIDEY BOT</span>
          </button>

          {/* SFX Toggle */}
          <button
            onClick={onToggleSFX}
            className="bg-[#eae7ee] border-2 border-[#1b1b20] px-2.5 py-1 flex items-center gap-1.5 ink-shadow-sm font-comic text-xs uppercase ink-btn"
            title={sfxEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {sfxEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#dc2626]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-gray-500" />
            )}
            <span className="font-bold">{sfxEnabled ? 'SFX: ON' : 'SFX: OFF'}</span>
          </button>

          {/* Arcade Shortcut */}
          <button
            onClick={() => onSelectPage('arcade')}
            className={`border-2 border-[#1b1b20] px-3 py-1 font-comic text-xs font-black uppercase flex items-center gap-1.5 ink-shadow-sm ink-btn ${
              currentPage === 'arcade' ? 'bg-[#dc2626] text-white' : 'bg-[#f9bd22] text-[#1b1b20] hover:bg-[#ffdf9f]'
            }`}
            title="6 Games Arcade"
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden xs:inline">ARCADE</span>
          </button>
        </div>
      </div>

      {/* Mobile Page Navigation Scroller Bar */}
      <div className="lg:hidden bg-[#fff0f0] border-t-2 border-[#1b1b20] px-3 py-1.5 overflow-x-auto flex gap-2 no-scrollbar">
        {pages.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`whitespace-nowrap font-comic uppercase text-[11px] font-black px-2.5 py-1 border-2 border-[#1b1b20] ink-btn ${
                isActive ? 'bg-[#dc2626] text-white' : 'bg-white text-[#1b1b20]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
