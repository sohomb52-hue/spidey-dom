/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WebPageId } from '../types';
import { playSound } from '../utils/audio';
import { ComicsCodeSeal, SpiderBotGuide } from './icons/SpiderVerseBadges';
import { useSpiderAuth } from '../context/AuthContext';
import {
  Home,
  Info,
  Mail,
  Gamepad2,
  BookOpen,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Menu,
  X,
  Film,
  User,
  Zap,
  LogIn,
  LogOut
} from 'lucide-react';

interface PersistentNavBarProps {
  currentPage: WebPageId;
  onNavigatePage: (page: WebPageId) => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onReplayIntro: () => void;
  sfxEnabled: boolean;
  onToggleSFX: () => void;
  onOpenBotGuide: () => void;
}

export const PersistentNavBar: React.FC<PersistentNavBarProps> = ({
  currentPage,
  onNavigatePage,
  onOpenAbout,
  onOpenContact,
  onReplayIntro,
  sfxEnabled,
  onToggleSFX,
  onOpenBotGuide
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userProfile, logOut } = useSpiderAuth();

  const handleNavClick = (page: WebPageId) => {
    playSound('thwip');
    onNavigatePage(page);
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    playSound('thwip');
    onNavigatePage('cover');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    playSound(mobileMenuOpen ? 'click' : 'thwip');
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <aside
      aria-label="Global Navigation Bar"
      className="sticky top-0 z-40 w-full bg-white border-b-4 border-[#1b1b20] shadow-[0_4px_0_0_#dc2626]"
    >
      {/* Top Marvel Comics Crimson Ribbon */}
      <div className="w-full bg-gradient-to-r from-[#dc2626] via-[#b8121d] to-[#991b1b] text-white py-1 px-3 sm:px-6 border-b-2 border-[#1b1b20] flex justify-between items-center text-[11px] font-comic uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="bg-white px-2 py-0.5 text-[#dc2626] font-black border border-[#1b1b20]">
            MARVEL COMICS GROUP
          </span>
          <span className="hidden sm:inline text-white/90 font-bold">
            SPIDER-VERSE MULTIVERSE HUB • ISSUE #1962
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onReplayIntro();
            }}
            className="hover:underline flex items-center gap-1 text-[#f9bd22] font-black cursor-pointer"
            title="Play the cinematic opening again"
            aria-label="Play the cinematic opening again"
          >
            <Film className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">REPLAY INTRO</span>
          </button>
          <span className="hidden md:inline font-mono text-white/80">
            APPROVED BY THE COMICS CODE AUTHORITY
          </span>
        </div>
      </div>

      {/* Main Persistent Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
        {/* Clickable Spider-Man Logo (Requirement 17) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleLogoClick}
            aria-label="Return to Spider-Verse home"
            title="Return to Spider-Verse home"
            className="flex items-center gap-2 text-left cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#dc2626] transition-transform active:scale-95"
          >
            <div className="relative">
              <ComicsCodeSeal className="w-7 h-9 hidden sm:flex flex-shrink-0 group-hover:rotate-3 group-hover:scale-105 transition-transform" />
              {/* Subtle spider web accent icon */}
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px]">🕸️</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-comic text-xl sm:text-2xl font-black uppercase text-[#dc2626] tracking-tight group-hover:text-[#b8121d] transition-colors">
                  SPIDER-VERSE
                </span>
                <span className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20] tracking-tight">
                  FACT ATTACK
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="bg-[#dc2626] text-white font-comic text-[9px] font-black px-1.5 py-0.5 uppercase border border-[#1b1b20]">
                  ARCADE & TRIVIA
                </span>
                <span className="text-[10px] text-[#5b403d] font-bold hidden md:inline">
                  THE DEFINITIVE MULTIVERSE COMPENDIUM
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links (Focused Structure: HOME, PLAY, FACTS, CHALLENGES, ACHIEVEMENTS, ABOUT, CONTACT) */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1.5">
          {/* HOME */}
          <button
            type="button"
            onClick={() => handleNavClick('cover')}
            className={`font-comic uppercase text-xs tracking-wider px-2.5 py-1.5 font-black border-2 transition-all flex items-center gap-1.5 cursor-pointer ink-btn ${
              currentPage === 'cover'
                ? 'bg-[#1b1b20] text-white border-[#1b1b20] ink-shadow-sm'
                : 'bg-white text-[#1b1b20] border-transparent hover:border-[#1b1b20] hover:bg-[#fff0f0]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>HOME</span>
          </button>

          {/* PLAY (Arcade & mini-games) */}
          <button
            type="button"
            onClick={() => handleNavClick('arcade')}
            className={`font-comic uppercase text-xs tracking-wider px-2.5 py-1.5 font-black border-2 transition-all flex items-center gap-1.5 cursor-pointer ink-btn ${
              currentPage === 'arcade' || currentPage === 'web_thrower' || currentPage === 'spider_id'
                ? 'bg-[#dc2626] text-white border-[#1b1b20] ink-shadow-sm'
                : 'bg-white text-[#dc2626] border-transparent hover:border-[#dc2626] hover:bg-[#fff0f0]'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>PLAY</span>
          </button>

          {/* FACTS (Canon Archives) */}
          <button
            type="button"
            onClick={() => handleNavClick('canon')}
            className={`font-comic uppercase text-xs tracking-wider px-2.5 py-1.5 font-black border-2 transition-all flex items-center gap-1.5 cursor-pointer ink-btn ${
              currentPage === 'canon'
                ? 'bg-[#1b1b20] text-white border-[#1b1b20] ink-shadow-sm'
                : 'bg-white text-[#1b1b20] border-transparent hover:border-[#1b1b20] hover:bg-[#fff0f0]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>FACTS</span>
          </button>

          {/* CHALLENGES (Trivia modes) */}
          <button
            type="button"
            onClick={() => handleNavClick('trivia')}
            className={`font-comic uppercase text-xs tracking-wider px-2.5 py-1.5 font-black border-2 transition-all flex items-center gap-1.5 cursor-pointer ink-btn ${
              currentPage === 'trivia'
                ? 'bg-[#1b1b20] text-white border-[#1b1b20] ink-shadow-sm'
                : 'bg-white text-[#1b1b20] border-transparent hover:border-[#1b1b20] hover:bg-[#fff0f0]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f9bd22]" />
            <span>CHALLENGES</span>
          </button>

          {/* ACHIEVEMENTS (Vault) */}
          <button
            type="button"
            onClick={() => handleNavClick('vault')}
            className={`font-comic uppercase text-xs tracking-wider px-2.5 py-1.5 font-black border-2 transition-all flex items-center gap-1.5 cursor-pointer ink-btn ${
              currentPage === 'vault'
                ? 'bg-[#f9bd22] text-[#1b1b20] border-[#1b1b20] ink-shadow-sm'
                : 'bg-white text-[#1b1b20] border-transparent hover:border-[#1b1b20] hover:bg-[#fffdf0]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-[#b45309]" />
            <span>ACHIEVEMENTS</span>
          </button>

          {/* DOSSIER (Profile) */}
          <button
            type="button"
            onClick={() => handleNavClick('profile')}
            className={`font-comic uppercase text-xs tracking-wider px-2.5 py-1.5 font-black border-2 transition-all flex items-center gap-1.5 cursor-pointer ink-btn ${
              currentPage === 'profile'
                ? 'bg-[#1b1b20] text-white border-[#1b1b20] ink-shadow-sm'
                : 'bg-white text-[#1b1b20] border-transparent hover:border-[#1b1b20] hover:bg-[#fff0f0]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#006398]" />
            <span>DOSSIER</span>
          </button>

          {/* Divider */}
          <div className="h-5 w-0.5 bg-[#1b1b20]/30 mx-1" aria-hidden="true" />

          {/* ABOUT / CREATOR */}
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onOpenAbout();
            }}
            className="font-comic uppercase text-xs tracking-wider px-2.5 py-1.5 font-black border-2 border-transparent hover:border-[#1b1b20] text-[#1b1b20] hover:bg-[#ffdf9f] transition-all flex items-center gap-1.5 cursor-pointer ink-btn"
          >
            <Info className="w-3.5 h-3.5 text-[#006398]" />
            <span>ABOUT / CREATOR</span>
          </button>

          {/* CONTACT */}
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onOpenContact();
            }}
            className="font-comic uppercase text-xs tracking-wider px-2.5 py-1.5 font-black border-2 border-transparent hover:border-[#1b1b20] text-[#1b1b20] hover:bg-[#ffdf9f] transition-all flex items-center gap-1.5 cursor-pointer ink-btn"
          >
            <Mail className="w-3.5 h-3.5 text-[#dc2626]" />
            <span>CONTACT</span>
          </button>
        </nav>

        {/* Right Actions: Auth Status, Spidey Bot, Audio Toggle, Mobile Burger */}
        <div className="flex items-center gap-2">
          {/* Dedicated Firebase Authentication / Hero Codename Button */}
          {user ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleNavClick('profile')}
                className="bg-[#dcfce7] hover:bg-[#bbf7d0] border-2 border-[#1b1b20] px-2.5 py-1 flex items-center gap-1.5 ink-shadow-sm font-comic text-xs font-black uppercase text-[#15803d] cursor-pointer min-h-[36px]"
                title="View Hero Dossier & Cloud Stats"
              >
                <User className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="max-w-[110px] truncate hidden sm:inline">
                  {userProfile?.displayName || user.displayName || 'HERO'}
                </span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  playSound('thwip');
                  await logOut();
                  handleNavClick('cover');
                }}
                className="bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#1b1b20] p-1.5 ink-shadow-sm text-[#b8121d] cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                title="Exit the Spider-Verse (Log out)"
                aria-label="Exit the Spider-Verse"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleNavClick('auth')}
              className="bg-[#dc2626] hover:bg-[#b8121d] text-white border-2 border-[#1b1b20] px-2.5 py-1 flex items-center gap-1.5 ink-shadow-sm font-comic text-xs font-black uppercase ink-btn cursor-pointer min-h-[36px]"
              title="Log in to save your Spider-Verse progress"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">LOG IN</span>
            </button>
          )}

          {/* Spidey Bot Guide */}
          <button
            type="button"
            onClick={onOpenBotGuide}
            className="bg-[#fee2e2] hover:bg-[#fecaca] border-2 border-[#1b1b20] px-2.5 py-1 flex items-center gap-1.5 ink-shadow-sm font-comic text-[11px] font-black uppercase text-[#991b1b] ink-btn cursor-pointer min-h-[36px]"
            title="Open Spidey Bot Assistant"
            aria-label="Open Spidey Bot Assistant"
          >
            <SpiderBotGuide className="w-4 h-4" />
            <span className="hidden sm:inline">BOT</span>
          </button>

          {/* SFX Mute/Unmute */}
          <button
            type="button"
            onClick={onToggleSFX}
            className="bg-[#eae7ee] border-2 border-[#1b1b20] px-2.5 py-1 flex items-center gap-1.5 ink-shadow-sm font-comic text-xs uppercase ink-btn cursor-pointer min-h-[36px]"
            title={sfxEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            aria-label={sfxEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {sfxEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#dc2626]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-gray-500" />
            )}
            <span className="font-bold hidden xs:inline">{sfxEnabled ? 'SFX ON' : 'SFX OFF'}</span>
          </button>

          {/* Polished Spider-Man Comic Mobile Menu Toggle Button (Requirement 3) */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="lg:hidden min-h-[44px] min-w-[44px] p-2 bg-[#dc2626] hover:bg-[#b8121d] text-white border-2 border-[#1b1b20] ink-shadow-sm ink-btn cursor-pointer flex items-center justify-center gap-1 font-comic text-xs font-black uppercase"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-comic-menu"
          >
            {mobileMenuOpen ? (
              <>
                <X className="w-5 h-5" />
                <span className="hidden xs:inline">CLOSE</span>
              </>
            ) : (
              <>
                <Menu className="w-5 h-5" />
                <span className="hidden xs:inline">MENU</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comic-Panel Mobile Navigation Menu (Requirement 3 & 16) */}
      {mobileMenuOpen && (
        <div
          id="mobile-comic-menu"
          role="navigation"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden bg-[#fffbf0] border-t-4 border-b-4 border-[#1b1b20] p-4 ink-shadow-xl animate-in slide-in-from-top-3 fade-in duration-200 relative overflow-hidden"
        >
          {/* Halftone pattern & web graphic overlay */}
          <div className="comic-halftone absolute inset-0 opacity-15 pointer-events-none" />

          {/* Mobile Menu Dispatch Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#1b1b20]/30 relative z-10">
            <div className="flex items-center gap-2">
              <span className="bg-[#dc2626] text-white text-[10px] font-comic font-black px-2 py-0.5 uppercase border border-[#1b1b20]">
                DISPATCH
              </span>
              <span className="font-comic text-xs font-black uppercase text-[#1b1b20]">
                SPIDER-VERSE ISSUES & SECTIONS
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-comic font-black text-[#dc2626] uppercase hover:underline cursor-pointer"
            >
              ✕ DISMISS
            </button>
          </div>

          {/* Mobile Auth Banner */}
          <div className="mb-3 p-3 bg-white border-2 border-[#1b1b20] ink-shadow-sm flex items-center justify-between relative z-10">
            {user ? (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#dcfce7] border-2 border-[#1b1b20] flex items-center justify-center font-comic font-black text-xs text-[#15803d] flex-shrink-0">
                    🕷️
                  </div>
                  <div className="min-w-0">
                    <div className="font-comic text-xs font-black uppercase text-[#1b1b20] truncate">
                      {userProfile?.displayName || user.displayName || 'HERO'}
                    </div>
                    <div className="font-mono text-[9px] text-[#15803d] font-bold">
                      FIRESTORE CLOUD SYNC
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    playSound('thwip');
                    await logOut();
                    handleNavClick('cover');
                  }}
                  className="px-2.5 py-1 bg-[#fee2e2] border border-[#1b1b20] font-comic text-[11px] font-black uppercase text-[#b8121d] cursor-pointer"
                >
                  EXIT
                </button>
              </>
            ) : (
              <>
                <div>
                  <div className="font-comic text-xs font-black uppercase text-[#dc2626]">
                    GUEST WEBSLINGER
                  </div>
                  <div className="font-mono text-[9px] text-[#5b403d]">
                    Connect ID to save scores & discoveries
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavClick('auth')}
                  className="px-3 py-1.5 bg-[#dc2626] text-white border-2 border-[#1b1b20] font-comic text-xs font-black uppercase ink-shadow-sm cursor-pointer"
                >
                  LOG IN
                </button>
              </>
            )}
          </div>

          {/* Primary Navigation Grid with Large Touch Targets (min-h-[48px]) */}
          <div className="grid grid-cols-2 gap-2 relative z-10">
            {/* HOME */}
            <button
              type="button"
              onClick={() => handleNavClick('cover')}
              className={`p-3 min-h-[48px] border-2 border-[#1b1b20] font-comic text-xs font-black uppercase flex items-center gap-2.5 cursor-pointer ink-btn ink-shadow-sm ${
                currentPage === 'cover' ? 'bg-[#1b1b20] text-white' : 'bg-white text-[#1b1b20] hover:bg-[#fff0f0]'
              }`}
            >
              <Home className="w-4 h-4 text-[#f9bd22] flex-shrink-0" />
              <span>HOME</span>
            </button>

            {/* PLAY (Arcade) */}
            <button
              type="button"
              onClick={() => handleNavClick('arcade')}
              className={`p-3 min-h-[48px] border-2 border-[#1b1b20] font-comic text-xs font-black uppercase flex items-center gap-2.5 cursor-pointer ink-btn ink-shadow-sm ${
                currentPage === 'arcade' ? 'bg-[#dc2626] text-white' : 'bg-white text-[#dc2626] hover:bg-[#fff0f0]'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-[#dc2626] flex-shrink-0" />
              <span>PLAY (ARCADE)</span>
            </button>

            {/* FACTS (Canon) */}
            <button
              type="button"
              onClick={() => handleNavClick('canon')}
              className={`p-3 min-h-[48px] border-2 border-[#1b1b20] font-comic text-xs font-black uppercase flex items-center gap-2.5 cursor-pointer ink-btn ink-shadow-sm ${
                currentPage === 'canon' ? 'bg-[#1b1b20] text-white' : 'bg-white text-[#1b1b20] hover:bg-[#fff0f0]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#dc2626] flex-shrink-0" />
              <span>FACTS (CANON)</span>
            </button>

            {/* CHALLENGES (Trivia) */}
            <button
              type="button"
              onClick={() => handleNavClick('trivia')}
              className={`p-3 min-h-[48px] border-2 border-[#1b1b20] font-comic text-xs font-black uppercase flex items-center gap-2.5 cursor-pointer ink-btn ink-shadow-sm ${
                currentPage === 'trivia' ? 'bg-[#1b1b20] text-white' : 'bg-white text-[#1b1b20] hover:bg-[#fff0f0]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#f9bd22] flex-shrink-0" />
              <span>CHALLENGES</span>
            </button>

            {/* ACHIEVEMENTS (Vault) */}
            <button
              type="button"
              onClick={() => handleNavClick('vault')}
              className={`p-3 min-h-[48px] border-2 border-[#1b1b20] font-comic text-xs font-black uppercase flex items-center gap-2.5 cursor-pointer ink-btn ink-shadow-sm ${
                currentPage === 'vault' ? 'bg-[#f9bd22] text-[#1b1b20]' : 'bg-white text-[#1b1b20] hover:bg-[#fffdf0]'
              }`}
            >
              <Trophy className="w-4 h-4 text-[#b45309] flex-shrink-0" />
              <span>ACHIEVEMENTS</span>
            </button>

            {/* DOSSIER (Profile) */}
            <button
              type="button"
              onClick={() => handleNavClick('profile')}
              className={`p-3 min-h-[48px] border-2 border-[#1b1b20] font-comic text-xs font-black uppercase flex items-center gap-2.5 cursor-pointer ink-btn ink-shadow-sm ${
                currentPage === 'profile' ? 'bg-[#1b1b20] text-white' : 'bg-white text-[#1b1b20] hover:bg-[#fff0f0]'
              }`}
            >
              <User className="w-4 h-4 text-[#006398] flex-shrink-0" />
              <span>HERO DOSSIER</span>
            </button>
          </div>

          {/* Secondary Options: About, Contact, Cinematic Intro */}
          <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t-2 border-[#1b1b20]/20 relative z-10">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                playSound('click');
                onOpenAbout();
              }}
              className="p-3 min-h-[48px] bg-white border-2 border-[#1b1b20] font-comic text-xs font-black uppercase flex items-center gap-2 text-[#1b1b20] hover:bg-[#ffdf9f] cursor-pointer ink-btn ink-shadow-sm"
            >
              <Info className="w-4 h-4 text-[#006398] flex-shrink-0" />
              <span>ABOUT / CREATOR</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                playSound('click');
                onOpenContact();
              }}
              className="p-3 min-h-[48px] bg-white border-2 border-[#1b1b20] font-comic text-xs font-black uppercase flex items-center gap-2 text-[#1b1b20] hover:bg-[#ffdf9f] cursor-pointer ink-btn ink-shadow-sm"
            >
              <Mail className="w-4 h-4 text-[#dc2626] flex-shrink-0" />
              <span>BUGLE CONTACT</span>
            </button>
          </div>

          {/* Replay Cinematic Intro Full-width CTA */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              playSound('click');
              onReplayIntro();
            }}
            className="w-full mt-3 p-3 min-h-[48px] bg-[#f9bd22] hover:bg-[#e0a618] text-[#1b1b20] border-2 border-[#1b1b20] font-comic text-xs font-black uppercase flex items-center justify-center gap-2 cursor-pointer ink-btn ink-shadow-sm relative z-10"
          >
            <Film className="w-4 h-4 text-[#1b1b20]" />
            <span>PLAY CINEMATIC OPENING INTRO</span>
          </button>
        </div>
      )}
    </aside>
  );
};
