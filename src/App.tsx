/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { GameMode, BadgeItem, WebPageId } from './types';
import {
  tfQuestions,
  mcqQuestions,
  rogueDossiers,
  speedQuestions,
  whoSaidItQuestions,
  badgeList
} from './data/triviaData';
import { playSound, setSfxMuted } from './utils/audio';

import { ComicHeader } from './components/ComicHeader';
import { ComicHUD } from './components/ComicHUD';
import { HeroCover } from './components/HeroCover';
import { ModeNavigation } from './components/ModeNavigation';
import { ComicPageNav } from './components/ComicPageNav';
import { FactAttackMode } from './components/modes/FactAttackMode';
import { WebOfKnowledgeMode } from './components/modes/WebOfKnowledgeMode';
import { WhoIsItMode } from './components/modes/WhoIsItMode';
import { WhoSaidItMode } from './components/modes/WhoSaidItMode';
import { SpeedMode } from './components/modes/SpeedMode';
import { ComicCanonMode } from './components/modes/ComicCanonMode';
import { BadgesVaultMode } from './components/modes/BadgesVaultMode';
import { ProfileMode } from './components/modes/ProfileMode';
import { ArcadePage } from './components/pages/ArcadePage';
import { WebThrowerGame } from './components/games/WebThrowerGame';
import { SpiderIdGame } from './components/games/SpiderIdGame';
import { ComicTiltCard } from './components/ComicTiltCard';
import { RealStoryModal } from './components/RealStoryModal';
import { SpideyTipDrawer } from './components/SpideyTipDrawer';
import { WebCanvas } from './components/WebCanvas';
import { CinematicIntro } from './components/CinematicIntro';
import { ComicStartTransition } from './components/ComicStartTransition';
import { IssueCompleteModal } from './components/IssueCompleteModal';
import { ComicEnvironment25D } from './components/ComicEnvironment25D';

export default function App() {
  // Navigation: Multi-page web pages architecture
  const [currentPage, setCurrentPage] = useState<WebPageId>('cover');
  const [currentMode, setCurrentMode] = useState<GameMode>('tf');

  // Cinematic Intro state
  const [showIntro, setShowIntro] = useState<boolean>(false);

  // Comic Start Transition state (Section 8)
  const [transitionGame, setTransitionGame] = useState<{
    title: string;
    page: WebPageId;
    triviaMode?: GameMode;
  } | null>(null);

  // Issue Complete Finale Modal state (Section 11)
  const [issueCompleteOpen, setIssueCompleteOpen] = useState<boolean>(false);

  // Game stats
  const [score, setScore] = useState<number>(1200);
  const [combo, setCombo] = useState<number>(1);
  const [streak, setStreak] = useState<number>(3);
  const [triviaCleared, setTriviaCleared] = useState<number>(4);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [latestPoints, setLatestPoints] = useState<number | null>(null);

  // Question trackers
  const [tfIndex, setTfIndex] = useState<number>(0);
  const [mcqIndex, setMcqIndex] = useState<number>(0);
  const [dossierIndex, setDossierIndex] = useState<number>(0);
  const [whoSaidItIndex, setWhoSaidItIndex] = useState<number>(0);
  const [speedIndex, setSpeedIndex] = useState<number>(0);
  const [badges, setBadges] = useState<BadgeItem[]>(badgeList);

  // Real Story Modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalCorrect, setModalCorrect] = useState<boolean>(true);
  const [modalBadge, setModalBadge] = useState<string>('THWIP! CORRECT!');
  const [modalScore, setModalScore] = useState<string>('+200 PTS');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalBody, setModalBody] = useState<string>('');
  const [modalNextCallback, setModalNextCallback] = useState<() => void>(() => () => {});

  // Bot Guide / Tip drawer
  const [tipDrawerOpen, setTipDrawerOpen] = useState<boolean>(false);

  // Web shooter callback ref
  const shootWebRef = useRef<((sx: number, sy: number, tx: number, ty: number) => void) | null>(null);

  const triggerWebFX = (e: React.MouseEvent) => {
    if (shootWebRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const sx = rect.x + rect.width / 2;
      const sy = rect.y + rect.height / 2;
      const tx = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
      const ty = window.innerHeight * 0.35 + (Math.random() - 0.5) * 150;
      shootWebRef.current(sx, sy, tx, ty);
    }
  };

  const handleToggleSFX = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    setSfxMuted(!next);
    if (next) playSound('thwip');
  };

  const navigateToPage = (page: WebPageId, triviaSubMode?: GameMode) => {
    playSound('click');
    setCurrentPage(page);
    if (triviaSubMode) {
      setCurrentMode(triviaSubMode);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const launchGameWithTransition = (page: WebPageId, triviaMode?: GameMode) => {
    const gameName =
      page === 'web_thrower'
        ? 'WEB THROWER 3D'
        : page === 'spider_id'
        ? 'IDENTIFY SPIDERS'
        : triviaMode === 'tf'
        ? 'FACT ATTACK: TRUE OR FICTION'
        : triviaMode === 'mcq'
        ? 'WEB OF KNOWLEDGE'
        : triviaMode === 'who_said_it'
        ? 'WHO SAID IT?'
        : triviaMode === 'speed'
        ? 'SPIDER-SENSE SPEED REFLEX'
        : 'TRIVIA CHALLENGE';

    setTransitionGame({ title: gameName, page, triviaMode });
  };

  const handleTransitionComplete = () => {
    if (transitionGame) {
      navigateToPage(transitionGame.page, transitionGame.triviaMode);
      setTransitionGame(null);
    }
  };

  const registerScoreBurst = (pts: number) => {
    setLatestPoints(pts);
    setTimeout(() => setLatestPoints(null), 1400);
  };

  const switchTriviaMode = (mode: GameMode) => {
    playSound('click');
    setCurrentMode(mode);
    setCurrentPage('trivia');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartAdventure = (e: React.MouseEvent) => {
    triggerWebFX(e);
    launchGameWithTransition('arcade');
  };

  const handleAddScore = (points: number) => {
    setScore((s) => s + points);
    setTriviaCleared((tc) => tc + 1);
    registerScoreBurst(points);
  };

  // 1. Fact Attack (True/False) Handler
  const handleTFAnswer = (userChoice: boolean) => {
    const q = tfQuestions[tfIndex];
    const isCorrect = userChoice === q.isTrue;

    if (isCorrect) {
      playSound('correct');
      const gained = 200 * combo;
      setScore((s) => s + gained);
      registerScoreBurst(gained);
      setCombo((c) => Math.min(c + 1, 5));
      setStreak((st) => st + 1);
      setTriviaCleared((tc) => tc + 1);

      setModalCorrect(true);
      setModalBadge('THWIP! CORRECT!');
      setModalScore(`+${gained} PTS`);
    } else {
      playSound('wrong');
      setCombo(1);
      setStreak(0);

      setModalCorrect(false);
      setModalBadge('OOF! FICTION DETECTED!');
      setModalScore('0 PTS');
    }

    setModalTitle(q.storyTitle);
    setModalBody(q.storyBody);
    setModalNextCallback(() => () => {
      const nextIdx = tfIndex + 1;
      if (nextIdx >= tfQuestions.length) {
        setIssueCompleteOpen(true);
      }
      setTfIndex((idx) => (idx + 1) % tfQuestions.length);
      setModalOpen(false);
    });
    setModalOpen(true);
  };

  // 2. MCQ Handler
  const handleMCQAnswer = (choiceIndex: number) => {
    const q = mcqQuestions[mcqIndex];
    const isCorrect = choiceIndex === q.correctIndex;

    if (isCorrect) {
      playSound('correct');
      const gained = 300 * combo;
      setScore((s) => s + gained);
      setCombo((c) => Math.min(c + 1, 5));
      setStreak((st) => st + 1);
      setTriviaCleared((tc) => tc + 1);

      setModalCorrect(true);
      setModalBadge('EXCELSIOR! CORRECT!');
      setModalScore(`+${gained} PTS`);
    } else {
      playSound('wrong');
      setCombo(1);
      setStreak(0);

      setModalCorrect(false);
      setModalBadge('WRONG ALIAS, TIGER!');
      setModalScore('0 PTS');
    }

    setModalTitle(q.storyTitle);
    setModalBody(q.storyBody);
    setModalNextCallback(() => () => {
      setMcqIndex((idx) => (idx + 1) % mcqQuestions.length);
      setModalOpen(false);
    });
    setModalOpen(true);
  };

  // 3. Rogue Dossier Handler
  const handleClueGuess = (suspectId: string) => {
    const dossier = rogueDossiers[dossierIndex];
    const isCorrect = suspectId === dossier.id;

    if (isCorrect) {
      playSound('correct');
      const gained = 400 * combo;
      setScore((s) => s + gained);
      setCombo((c) => Math.min(c + 1, 5));
      setStreak((st) => st + 1);
      setTriviaCleared((tc) => tc + 1);

      setModalCorrect(true);
      setModalBadge(`BAM! YOU NABBED ${dossier.alias.toUpperCase()}!`);
      setModalScore(`+${gained} PTS`);
    } else {
      playSound('wrong');
      setCombo(1);
      setStreak(0);

      setModalCorrect(false);
      setModalBadge('MISIDENTIFIED ROGUE!');
      setModalScore('0 PTS');
    }

    setModalTitle(dossier.storyTitle);
    setModalBody(dossier.storyBody);
    setModalNextCallback(() => () => {
      setDossierIndex((idx) => (idx + 1) % rogueDossiers.length);
      setModalOpen(false);
    });
    setModalOpen(true);
  };

  // 4. Who Said It Quote Handler
  const handleWhoSaidItAnswer = (choiceIndex: number) => {
    const q = whoSaidItQuestions[whoSaidItIndex];
    const isCorrect = choiceIndex === q.correctIndex;

    if (isCorrect) {
      playSound('correct');
      const gained = 350 * combo;
      setScore((s) => s + gained);
      setCombo((c) => Math.min(c + 1, 5));
      setStreak((st) => st + 1);
      setTriviaCleared((tc) => tc + 1);

      setModalCorrect(true);
      setModalBadge('THWIP! QUOTE NAILED!');
      setModalScore(`+${gained} PTS`);
    } else {
      playSound('wrong');
      setCombo(1);
      setStreak(0);

      setModalCorrect(false);
      setModalBadge('WRONG SPEAKER, TIGER!');
      setModalScore('0 PTS');
    }

    setModalTitle(q.character);
    setModalBody(q.comicContext);
    setModalNextCallback(() => () => {
      setWhoSaidItIndex((idx) => (idx + 1) % whoSaidItQuestions.length);
      setModalOpen(false);
    });
    setModalOpen(true);
  };

  // 5. Speed Challenge Handler
  const handleSpeedAnswer = (choiceIndex: number, timeLeft: number) => {
    const q = speedQuestions[speedIndex];
    const isCorrect = choiceIndex === q.correctIndex;

    if (isCorrect) {
      playSound('correct');
      const bonus = Math.round(timeLeft * 50);
      setScore((s) => s + bonus);
      setCombo((c) => Math.min(c + 1, 5));
      setStreak((st) => st + 1);
      setTriviaCleared((tc) => tc + 1);

      setModalCorrect(true);
      setModalBadge('LIGHTNING REFLEXES!');
      setModalScore(`+${bonus} PTS`);
    } else {
      playSound('wrong');
      setCombo(1);
      setStreak(0);

      setModalCorrect(false);
      setModalBadge('TOO SLOW / MISSED!');
      setModalScore('0 PTS');
    }

    setModalTitle(q.explanationTitle);
    setModalBody(q.explanationBody);
    setModalNextCallback(() => () => {
      setSpeedIndex((idx) => (idx + 1) % speedQuestions.length);
      setModalOpen(false);
    });
    setModalOpen(true);
  };

  const handleSpeedExpired = () => {
    playSound('wrong');
    const q = speedQuestions[speedIndex];
    setCombo(1);
    setStreak(0);

    setModalCorrect(false);
    setModalBadge("TIME'S UP!");
    setModalScore('0 PTS');
    setModalTitle(q.explanationTitle);
    setModalBody(`Time ran out before you answered! ${q.explanationBody}`);
    setModalNextCallback(() => () => {
      setSpeedIndex((idx) => (idx + 1) % speedQuestions.length);
      setModalOpen(false);
    });
    setModalOpen(true);
  };

  return (
    <ComicEnvironment25D
      header={
        <ComicHeader
          currentPage={currentPage}
          onSelectPage={navigateToPage}
          sfxEnabled={sfxEnabled}
          onToggleSFX={handleToggleSFX}
          onOpenBotGuide={() => {
            playSound('click');
            setTipDrawerOpen(true);
          }}
        />
      }
      hud={
        <ComicHUD
          score={score}
          combo={combo}
          triviaCleared={triviaCleared}
          totalTrivia={50}
          streak={streak}
          latestPoints={latestPoints}
          onTriggerSpiderSense={() => {
            playSound('spider-sense');
            setCombo((c) => Math.min(c + 1, 5));
            registerScoreBurst(100);
            setScore((s) => s + 100);
            if (shootWebRef.current) {
              const startX = window.innerWidth / 2;
              const targetX = startX + (Math.random() - 0.5) * 260;
              shootWebRef.current(startX, 60, targetX, 320);
            }
          }}
        />
      }
      footer={
        <footer className="w-full py-8 sm:py-12 px-4 sm:px-8 flex flex-col items-center justify-center gap-6 border-t-4 border-[#1b1b20] bg-[#1b1b20] text-[#ffdf9f]">
          <div className="text-center">
            <h2 className="font-comic text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-[#dc3132] leading-none">
              SPIDER-VERSE: FACT ATTACK
            </h2>
            <p className="text-xs sm:text-sm text-[#f0ecf4] font-semibold mt-1 tracking-wider uppercase">
              THE DEFINITIVE WEB-SLINGER MULTIVERSE INTERACTIVE COMPENDIUM
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-comic text-xs font-black uppercase tracking-wider">
            <button
              onClick={() => navigateToPage('arcade')}
              className="text-[#dc2626] bg-white px-2 py-0.5 border border-white hover:bg-[#ffdf9f] transition-colors duration-150 cursor-pointer"
            >
              🕹️ 6 Games Arcade
            </button>
            <button
              onClick={() => navigateToPage('web_thrower')}
              className="text-[#f0ecf4] hover:text-[#dc2626] transition-colors duration-150 cursor-pointer"
            >
              🎯 Web Thrower 3D
            </button>
            <button
              onClick={() => navigateToPage('spider_id')}
              className="text-[#f0ecf4] hover:text-[#006398] transition-colors duration-150 cursor-pointer"
            >
              👥 Identify Spider-Man
            </button>
            <button
              onClick={() => navigateToPage('canon')}
              className="text-[#f0ecf4] hover:text-white transition-colors duration-150 cursor-pointer"
            >
              Comic Canon Archives
            </button>
            <button
              onClick={handleToggleSFX}
              className="text-[#f0ecf4] hover:text-white transition-colors duration-150 cursor-pointer"
            >
              Soundtrack & SFX
            </button>
            <button
              onClick={() => navigateToPage('vault')}
              className="text-[#f0ecf4] hover:text-white transition-colors duration-150 cursor-pointer"
            >
              Multiverse Badges
            </button>
            <button
              onClick={() => navigateToPage('profile')}
              className="text-[#f0ecf4] hover:text-white transition-colors duration-150 cursor-pointer"
            >
              Hero Dossier
            </button>
          </nav>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-center border-t border-[#dcd9e0]/20 pt-4 w-full max-w-4xl justify-between">
            <p className="text-xs text-[#f0ecf4]/80">
              © 1962-2024 MARVEL TRIBUTE MULTIVERSE TRIVIA. APPROVED BY THE COMICS CODE AUTHORITY.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ffdf9f] font-bold">
              <span>EXCELSIOR!</span>
              <span>•</span>
              <span>WITH GREAT POWER COMES GREAT TRIVIA!</span>
            </div>
          </div>
        </footer>
      }
    >
      {/* Interactive Web Canvas FX */}
      <WebCanvas
        registerShooter={(fn) => {
          shootWebRef.current = fn;
        }}
      />

      {/* Main Adventure Canvas Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 relative">
        {/* PAGE 1: COVER SPLASH */}
        {currentPage === 'cover' && (
          <div className="space-y-8">
            {/* Cinematic Intro & Issue Climax quick bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#1b1b20] text-white p-2.5 px-4 border-3 border-[#1b1b20] ink-shadow-sm">
              <div className="flex items-center gap-2">
                <span className="bg-[#dc2626] text-white font-comic text-[10px] font-black px-2 py-0.5 uppercase">
                  IMMERSIVE EXPERIENCE
                </span>
                <span className="font-comic text-xs font-black text-[#f9bd22]">
                  LIVING SPIDER-MAN COMIC BOOK
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowIntro(true)}
                  className="bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-xs font-black px-3 py-1 border border-white uppercase ink-btn cursor-pointer"
                >
                  🎬 PLAY CINEMATIC INTRO
                </button>
                <button
                  onClick={() => setIssueCompleteOpen(true)}
                  className="bg-[#f9bd22] hover:bg-[#e0a618] text-[#1b1b20] font-comic text-xs font-black px-3 py-1 border border-black uppercase ink-btn cursor-pointer"
                >
                  🏆 ISSUE SCORECARD
                </button>
              </div>
            </div>

            <HeroCover
              onStartAdventure={handleStartAdventure}
              onNavigatePage={(p) => launchGameWithTransition(p)}
            />

            {/* Featured 6 Games Arcade Preview Section on Cover */}
            <div className="border-4 border-[#1b1b20] bg-white p-4 sm:p-6 ink-shadow-red-multi">
              <div className="flex flex-wrap items-center justify-between border-b-3 border-[#1b1b20] pb-3 mb-5 gap-2">
                <div>
                  <span className="bg-[#dc2626] text-white font-comic text-xs font-black px-2 py-0.5 uppercase">
                    FEATURED ARCADE
                  </span>
                  <h2 className="font-comic text-2xl sm:text-3xl font-black uppercase text-[#1b1b20] mt-1">
                    6 MULTIVERSE COMIC GAMES
                  </h2>
                </div>
                <button
                  onClick={() => launchGameWithTransition('arcade')}
                  className="bg-[#dc2626] hover:bg-[#b8121d] text-white border-2 border-[#1b1b20] px-4 py-2 font-comic text-xs sm:text-sm font-black uppercase ink-btn ink-shadow-sm cursor-pointer"
                >
                  EXPLORE FULL ARCADE (6 GAMES) →
                </button>
              </div>

              {/* 3 Prominent Game Cards on Cover with Mouse-Tracking 3D Tilt */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <ComicTiltCard maxTilt={14} scaleOnHover={1.03}>
                  <div
                    onClick={() => navigateToPage('web_thrower')}
                    className="h-full border-3 border-[#1b1b20] bg-[#fff0f0] p-4 ink-shadow-md hover:ink-shadow-red cursor-pointer flex flex-col justify-between group transition-shadow duration-200"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-[#dc2626] text-white font-comic text-[10px] font-black px-2 py-0.5 uppercase">
                          GAME #01
                        </span>
                        <span className="text-xl">🎯</span>
                      </div>
                      <div className="h-32 bg-black border-2 border-[#1b1b20] overflow-hidden mb-2 relative">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBscJXRK3PQxN14y7ZBa1HeEaeJRivX4LKWY0Ibqt4SLEc47fjTssLmWcgB8nRfEs5MlZLLlpioR8yVyrBKCqXaIJpydiDP0fO9ukdl2-_V95w5kfbLtXTQ8uaWCLjKubu0o_Esu-lk57P7BXM3JoWYUIg4ildlwySRBvjLN-d7T9i120roNbYcyNQUK93Q3jRF24wvFBIoE17uFrubqnzGr8fAc6-oa-t-NmYbb_I1Hvj_vWU-Rw4"
                          alt="Web Thrower 3D"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="comic-halftone absolute inset-0 pointer-events-none" />
                      </div>
                      <h3 className="font-comic text-lg font-black uppercase text-[#1b1b20]">
                        WEB THROWER 3D
                      </h3>
                      <p className="text-xs text-[#5b403d] font-semibold mt-1">
                        Sling web fluid at gliding Sinister Six villains across NYC rooftops with interactive crosshairs!
                      </p>
                    </div>
                    <button className="mt-3 w-full bg-[#dc2626] text-white font-comic text-xs font-black py-2 border border-[#1b1b20] uppercase ink-btn cursor-pointer">
                      PLAY WEB THROWER →
                    </button>
                  </div>
                </ComicTiltCard>

                <ComicTiltCard maxTilt={14} scaleOnHover={1.03}>
                  <div
                    onClick={() => navigateToPage('spider_id')}
                    className="h-full border-3 border-[#1b1b20] bg-[#f0ecf4] p-4 ink-shadow-md hover:ink-shadow-red cursor-pointer flex flex-col justify-between group transition-shadow duration-200"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-[#006398] text-white font-comic text-[10px] font-black px-2 py-0.5 uppercase">
                          GAME #02
                        </span>
                        <span className="text-xl">👥</span>
                      </div>
                      <div className="h-32 bg-black border-2 border-[#1b1b20] overflow-hidden mb-2 relative">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFk5sX611T905P2P_E7h8566Q-8Fk_x2y8M5N5kG70kR8Q7H7P5uP-8yJ3k_mQ_7H0k8F4P8H407"
                          alt="Identify Spider-Man Characters"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            // Fallback comic asset
                            (e.target as HTMLImageElement).src =
                              'https://lh3.googleusercontent.com/aida-public/AB6AXuBscJXRK3PQxN14y7ZBa1HeEaeJRivX4LKWY0Ibqt4SLEc47fjTssLmWcgB8nRfEs5MlZLLlpioR8yVyrBKCqXaIJpydiDP0fO9ukdl2-_V95w5kfbLtXTQ8uaWCLjKubu0o_Esu-lk57P7BXM3JoWYUIg4ildlwySRBvjLN-d7T9i120roNbYcyNQUK93Q3jRF24wvFBIoE17uFrubqnzGr8fAc6-oa-t-NmYbb_I1Hvj_vWU-Rw4';
                          }}
                        />
                        <div className="comic-halftone absolute inset-0 pointer-events-none" />
                      </div>
                      <h3 className="font-comic text-lg font-black uppercase text-[#1b1b20]">
                        IDENTIFY SPIDER-MAN HEROES
                      </h3>
                      <p className="text-xs text-[#5b403d] font-semibold mt-1">
                        Inspect 3D cards, decipher secret identity clues, and collect all 10 multiverse Spider-Man variants!
                      </p>
                    </div>
                    <button className="mt-3 w-full bg-[#006398] text-white font-comic text-xs font-black py-2 border border-[#1b1b20] uppercase ink-btn cursor-pointer">
                      PLAY IDENTI-MATCH →
                    </button>
                  </div>
                </ComicTiltCard>

                <ComicTiltCard maxTilt={14} scaleOnHover={1.03}>
                  <div
                    onClick={() => navigateToPage('trivia', 'tf')}
                    className="h-full border-3 border-[#1b1b20] bg-[#fffdf0] p-4 ink-shadow-md hover:ink-shadow-red cursor-pointer flex flex-col justify-between group transition-shadow duration-200"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-[#f9bd22] text-[#1b1b20] font-comic text-[10px] font-black px-2 py-0.5 uppercase border border-[#1b1b20]">
                          GAME #03
                        </span>
                        <span className="text-xl">⚡</span>
                      </div>
                      <div className="h-32 bg-black border-2 border-[#1b1b20] overflow-hidden mb-2 relative">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_s1f4y1M7J09k0M0u7B5N5kG70kR8Q7H7P5uP-8yJ3k_mQ_7H0k8F4P8H407"
                          alt="Fact Attack Trivia"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://lh3.googleusercontent.com/aida-public/AB6AXuBscJXRK3PQxN14y7ZBa1HeEaeJRivX4LKWY0Ibqt4SLEc47fjTssLmWcgB8nRfEs5MlZLLlpioR8yVyrBKCqXaIJpydiDP0fO9ukdl2-_V95w5kfbLtXTQ8uaWCLjKubu0o_Esu-lk57P7BXM3JoWYUIg4ildlwySRBvjLN-d7T9i120roNbYcyNQUK93Q3jRF24wvFBIoE17uFrubqnzGr8fAc6-oa-t-NmYbb_I1Hvj_vWU-Rw4';
                          }}
                        />
                        <div className="comic-halftone absolute inset-0 pointer-events-none" />
                      </div>
                      <h3 className="font-comic text-lg font-black uppercase text-[#1b1b20]">
                        FACT ATTACK: TRUE OR FICTION
                      </h3>
                      <p className="text-xs text-[#5b403d] font-semibold mt-1">
                        Rapid-fire comic canon truths versus webbed myths with authentic comic panel popups!
                      </p>
                    </div>
                    <button className="mt-3 w-full bg-[#f9bd22] text-[#1b1b20] font-comic text-xs font-black py-2 border border-[#1b1b20] uppercase ink-btn cursor-pointer">
                      PLAY FACT ATTACK →
                    </button>
                  </div>
                </ComicTiltCard>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: ARCADE HUB (THE 6 GAMES PAGE) */}
        {currentPage === 'arcade' && (
          <ArcadePage
            onLaunchGame={launchGameWithTransition}
            onTriggerWeb={triggerWebFX}
            score={score}
            streak={streak}
          />
        )}

        {/* PAGE 3: WEB THROWER 3D GAME */}
        {currentPage === 'web_thrower' && (
          <WebThrowerGame onBackToArcade={() => navigateToPage('arcade')} />
        )}

        {/* PAGE 4: IDENTIFY SPIDER-MAN CHARACTERS GAME */}
        {currentPage === 'spider_id' && (
          <SpiderIdGame
            onBackToArcade={() => navigateToPage('arcade')}
            onAddScore={handleAddScore}
          />
        )}

        {/* PAGE 5: TRIVIA CHALLENGES */}
        {currentPage === 'trivia' && (
          <div className="space-y-6">
            <div id="panel-container">
              <ModeNavigation currentMode={currentMode} onSelectMode={switchTriviaMode} />
              <ComicPageNav
                currentMode={currentMode}
                onSelectMode={switchTriviaMode}
                onTriggerWeb={triggerWebFX}
              />
            </div>

            <div className="mt-4">
              {currentMode === 'tf' && (
                <FactAttackMode
                  question={tfQuestions[tfIndex]}
                  currentIndex={tfIndex}
                  totalQuestions={tfQuestions.length}
                  combo={combo}
                  streak={streak}
                  onAnswer={handleTFAnswer}
                  onTriggerWeb={triggerWebFX}
                />
              )}

              {currentMode === 'mcq' && (
                <WebOfKnowledgeMode
                  question={mcqQuestions[mcqIndex]}
                  currentIndex={mcqIndex}
                  totalQuestions={mcqQuestions.length}
                  onAnswer={handleMCQAnswer}
                  onTriggerWeb={triggerWebFX}
                />
              )}

              {currentMode === 'clues' && (
                <WhoIsItMode
                  dossier={rogueDossiers[dossierIndex]}
                  currentIndex={dossierIndex}
                  totalDossiers={rogueDossiers.length}
                  onGuess={handleClueGuess}
                  onTriggerWeb={triggerWebFX}
                />
              )}

              {currentMode === 'who_said_it' && (
                <WhoSaidItMode
                  question={whoSaidItQuestions[whoSaidItIndex]}
                  currentIndex={whoSaidItIndex}
                  totalQuestions={whoSaidItQuestions.length}
                  onAnswer={handleWhoSaidItAnswer}
                  onTriggerWeb={triggerWebFX}
                />
              )}

              {currentMode === 'speed' && (
                <SpeedMode
                  question={speedQuestions[speedIndex]}
                  currentIndex={speedIndex}
                  totalQuestions={speedQuestions.length}
                  onAnswer={handleSpeedAnswer}
                  onTimeExpired={handleSpeedExpired}
                  onTriggerWeb={triggerWebFX}
                />
              )}
            </div>
          </div>
        )}

        {/* PAGE 6: COMIC CANON */}
        {currentPage === 'canon' && (
          <ComicCanonMode onTriggerWeb={triggerWebFX} />
        )}

        {/* PAGE 7: BADGES VAULT */}
        {currentPage === 'vault' && (
          <BadgesVaultMode badges={badges} />
        )}

        {/* PAGE 8: PLAYER PROFILE DOSSIER */}
        {currentPage === 'profile' && (
          <ProfileMode
            score={score}
            triviaCleared={triviaCleared}
            streak={streak}
            badges={badges}
          />
        )}
      </main>

      {/* Comic Start Panel Slam Transition (Section 8) */}
      {transitionGame && (
        <ComicStartTransition
          gameTitle={transitionGame.title}
          onComplete={handleTransitionComplete}
        />
      )}

      {/* Cinematic Intro (Section 4) */}
      {showIntro && (
        <CinematicIntro onEnter={() => setShowIntro(false)} />
      )}

      {/* Issue Complete Comic Finale Modal (Section 11) */}
      <IssueCompleteModal
        isOpen={issueCompleteOpen}
        score={score}
        factsMastered={triviaCleared}
        bestCombo={combo}
        sensePercent={Math.min(50 + combo * 10, 100)}
        badges={badges}
        onPlayAgain={() => {
          setIssueCompleteOpen(false);
          launchGameWithTransition('arcade');
        }}
        onExploreFacts={() => {
          setIssueCompleteOpen(false);
          navigateToPage('canon');
        }}
        onViewAchievements={() => {
          setIssueCompleteOpen(false);
          navigateToPage('vault');
        }}
        onClose={() => setIssueCompleteOpen(false)}
      />

      {/* Comic Real Story Modal */}
      <RealStoryModal
        isOpen={modalOpen}
        isCorrect={modalCorrect}
        badgeText={modalBadge}
        scoreText={modalScore}
        title={modalTitle}
        body={modalBody}
        onNext={modalNextCallback}
        onClose={() => setModalOpen(false)}
      />

      {/* Floating Spidey Lore Tips Assistant (from Image 11) */}
      <SpideyTipDrawer
        isOpen={tipDrawerOpen}
        onClose={() => setTipDrawerOpen(false)}
        onOpen={() => setTipDrawerOpen(true)}
      />
    </ComicEnvironment25D>
  );
}
