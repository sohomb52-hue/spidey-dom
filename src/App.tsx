/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
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
import { PersistentNavBar } from './components/PersistentNavBar';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
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
import { NotFoundComicPage } from './components/pages/NotFoundComicPage';
import { ComicFeedbackToast, ComicToast } from './components/common/ComicFeedbackToast';
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
import { CompactCreatorFooter } from './components/CompactCreatorFooter';
import { useSpiderAuth } from './context/AuthContext';
import { SpiderAuthPage } from './components/auth/SpiderAuthPage';
import { SpiderGuestPromptModal } from './components/auth/SpiderGuestPromptModal';
import { SpiderLoadingWeb } from './components/auth/SpiderLoadingWeb';

const pageMeta: Record<WebPageId, { title: string; desc: string }> = {
  cover: {
    title: 'Spider-Verse: Fact Attack | Multiverse Trivia Comic',
    desc: 'Spider-Verse: Fact Attack is an interactive Spider-Man trivia game where you test your knowledge, discover random facts and unlock comic-book challenges.'
  },
  auth: {
    title: 'Spider-Verse: Multiverse Hero Check-In & Identity',
    desc: 'Enter the Spider-Verse with your secret identity to save score, streak, XP, and comic discoveries to Cloud Firestore.'
  },
  arcade: {
    title: 'Spider-Verse: Arcade & Challenges — 6 Playable Mini-Games',
    desc: 'Play 6 interactive Spider-Man mini-games: Web Thrower 3D, Identify Spiders, Fact Attack, Speed Reflexes, and more.'
  },
  web_thrower: {
    title: 'Spider-Verse: 3D Web Thrower Arena | Rooftop Defense',
    desc: 'Target and web-sling NYC rooftop villains in full 3D interactive comic action.'
  },
  spider_id: {
    title: 'Spider-Verse: Identify The Hero | Multiverse Variants',
    desc: 'Test your Spider-Sense by matching multiverse heroes from Earth-616 to Earth-928.'
  },
  trivia: {
    title: 'Spider-Verse: Challenges & Trivia | Multiverse Canon',
    desc: 'Face authentic comic trivia challenges, quote detectives, and rapid-fire Spider-Sense speed tests.'
  },
  canon: {
    title: 'Spider-Verse: Comic Canon Archives | Marvel History',
    desc: 'Explore the complete verified comic history from Amazing Fantasy #15 through modern multiverse crossover events.'
  },
  vault: {
    title: 'Spider-Verse: Achievements & Badges Vault',
    desc: 'View unlocked collectible Multiverse Badges and trophies earned through heroic trivia feats.'
  },
  profile: {
    title: 'Spider-Verse: Player Profile & Dossier',
    desc: 'Check your Spider-Sense accuracy, total score rating, and Multiverse hero standing.'
  },
  '404': {
    title: "404 — Lost in the Web | Spider-Verse: Fact Attack",
    desc: 'Looks like this page got caught in another web. Swing safely back to Spider-Verse Home.'
  }
};

export default function App() {
  // Navigation: Multi-page web pages architecture
  const [currentPage, setCurrentPage] = useState<WebPageId>('cover');
  const [currentMode, setCurrentMode] = useState<GameMode>('tf');

  // Cinematic Intro state - defaults to true so it serves as the first page!
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // About & Contact modals state
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [contactOpen, setContactOpen] = useState<boolean>(false);

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

  // Firebase Multiverse Persistent State (Cloud Firestore & Auth)
  const {
    user,
    userProfile,
    unlockedAchievementIds,
    loading: authLoading,
    syncAnswerResult,
    recordFact,
    recordAchievement
  } = useSpiderAuth();

  const [guestPromptOpen, setGuestPromptOpen] = useState<boolean>(false);

  // Synchronize authenticated user stats from Cloud Firestore
  useEffect(() => {
    if (userProfile) {
      setScore(userProfile.totalScore);
      setStreak(userProfile.currentStreak);
      setTriviaCleared(userProfile.factsDiscovered);
    }
  }, [userProfile]);

  // Synchronize unlocked badges from Cloud Firestore
  useEffect(() => {
    if (unlockedAchievementIds && unlockedAchievementIds.length > 0) {
      setBadges((prev) =>
        prev.map((b) => ({
          ...b,
          unlocked: b.unlocked || unlockedAchievementIds.includes(b.id)
        }))
      );
    }
  }, [unlockedAchievementIds]);

  // Success / Error Feedback Toast state (Requirements 12 & 13)
  const [toast, setToast] = useState<ComicToast | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({
      id: String(Date.now()),
      type,
      title,
      message
    });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Sync document title and SEO meta description on every page change (Requirements 5 & 6)
  useEffect(() => {
    const meta = pageMeta[currentPage] || pageMeta.cover;
    document.title = meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', meta.desc);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', meta.title);
    }
  }, [currentPage]);

  // URL Hash synchronization & 404 route handling (Requirement 8)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) return;
      const validPages: WebPageId[] = [
        'cover',
        'auth',
        'arcade',
        'web_thrower',
        'spider_id',
        'trivia',
        'canon',
        'vault',
        'profile',
        '404'
      ];
      if (validPages.includes(hash as WebPageId)) {
        setCurrentPage(hash as WebPageId);
      } else {
        setCurrentPage('404');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

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
    if (next) {
      playSound('thwip');
      showToast('info', 'SPIDER-AUDIO ONLINE', 'Sound effects enabled.');
    } else {
      showToast('info', 'AUDIO MUTED', 'Sound effects silenced.');
    }
  };

  const navigateToPage = (page: WebPageId, triviaSubMode?: GameMode) => {
    playSound('thwip');
    setCurrentPage(page);
    window.location.hash = page === 'cover' ? '' : page;
    if (triviaSubMode) {
      setCurrentMode(triviaSubMode);
    }
    showToast(
      'info',
      'WEB CONNECTION ESTABLISHED',
      `Swung to ${page === 'cover' ? 'Home Cover' : page.replace('_', ' ').toUpperCase()}`
    );
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
    if (mode === 'canon') {
      navigateToPage('canon');
    } else if (mode === 'badges') {
      navigateToPage('vault');
    } else if (mode === 'profile') {
      navigateToPage('profile');
    } else {
      setCurrentMode(mode);
      setCurrentPage('trivia');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartAdventure = (e: React.MouseEvent) => {
    triggerWebFX(e);
    launchGameWithTransition('arcade');
  };

  const handleAddScore = (points: number) => {
    setScore((s) => s + points);
    setTriviaCleared((tc) => tc + 1);
    registerScoreBurst(points);
    syncAnswerResult(true, points, streak);
    showToast('success', 'THWIP! COMIC POINTS ADDED', `+${points} PTS recorded in your dossier.`);
  };

  // 1. Fact Attack (True/False) Handler
  const handleTFAnswer = async (userChoice: boolean) => {
    const q = tfQuestions[tfIndex];
    const isCorrect = userChoice === q.isTrue;
    const gained = isCorrect ? 200 * combo : 0;
    const newStreak = isCorrect ? streak + 1 : 0;

    syncAnswerResult(isCorrect, gained, newStreak);

    if (isCorrect) {
      playSound('correct');
      setScore((s) => s + gained);
      registerScoreBurst(gained);
      setCombo((c) => Math.min(c + 1, 5));
      setStreak(newStreak);
      setTriviaCleared((tc) => tc + 1);
      showToast('success', 'THWIP! CORRECT!', `+${gained} PTS • Spider-Sense Combo x${Math.min(combo + 1, 5)}!`);
      const isNew = await recordFact(`tf_${q.id}`, `Fact Attack: True or False #${q.id}`);
      if (isNew) {
        showToast('success', 'NEW FACT DISCOVERED!', 'Saved to your permanent Multiverse archive.');
      }
      recordAchievement('spider_recruit');
      if (newStreak >= 5) recordAchievement('spider_sense');
      if (triviaCleared + 1 >= 10) recordAchievement('wall_crawler');
    } else {
      playSound('wrong');
      setCombo(1);
      setStreak(0);
      showToast('error', "OOF! THAT DIDN'T WORK.", 'True comic canon revealed!');
    }

    const nextIdx = tfIndex + 1;
    if (nextIdx >= tfQuestions.length) {
      setIssueCompleteOpen(true);
      playSound('bam');
      showToast('success', 'ISSUE COMPLETE!', 'You cleared all Fact Attack panels!');
    }
    setTfIndex((idx) => (idx + 1) % tfQuestions.length);
  };

  // 2. MCQ Handler
  const handleMCQAnswer = async (choiceIndex: number) => {
    const q = mcqQuestions[mcqIndex];
    const isCorrect = choiceIndex === q.correctIndex;
    const gained = isCorrect ? 300 * combo : 0;
    const newStreak = isCorrect ? streak + 1 : 0;

    syncAnswerResult(isCorrect, gained, newStreak);

    if (isCorrect) {
      playSound('correct');
      setScore((s) => s + gained);
      setCombo((c) => Math.min(c + 1, 5));
      setStreak(newStreak);
      setTriviaCleared((tc) => tc + 1);

      setModalCorrect(true);
      setModalBadge('EXCELSIOR! CORRECT!');
      setModalScore(`+${gained} PTS`);
      recordFact(`mcq_${q.id}`, q.storyTitle);
      recordAchievement('spider_recruit');
      if (newStreak >= 5) recordAchievement('spider_sense');
      if (triviaCleared + 1 >= 10) recordAchievement('wall_crawler');
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
  const handleClueGuess = async (suspectId: string) => {
    const dossier = rogueDossiers[dossierIndex];
    const isCorrect = suspectId === dossier.id;
    const gained = isCorrect ? 400 * combo : 0;
    const newStreak = isCorrect ? streak + 1 : 0;

    syncAnswerResult(isCorrect, gained, newStreak);

    if (isCorrect) {
      playSound('correct');
      setScore((s) => s + gained);
      setCombo((c) => Math.min(c + 1, 5));
      setStreak(newStreak);
      setTriviaCleared((tc) => tc + 1);

      setModalCorrect(true);
      setModalBadge(`BAM! YOU NABBED ${dossier.alias.toUpperCase()}!`);
      setModalScore(`+${gained} PTS`);
      recordFact(`rogue_${dossier.id}`, dossier.alias);
      recordAchievement('spider_recruit');
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
  const handleWhoSaidItAnswer = async (choiceIndex: number) => {
    const q = whoSaidItQuestions[whoSaidItIndex];
    const isCorrect = choiceIndex === q.correctIndex;
    const gained = isCorrect ? 350 * combo : 0;
    const newStreak = isCorrect ? streak + 1 : 0;

    syncAnswerResult(isCorrect, gained, newStreak);

    if (isCorrect) {
      playSound('correct');
      setScore((s) => s + gained);
      setCombo((c) => Math.min(c + 1, 5));
      setStreak(newStreak);
      setTriviaCleared((tc) => tc + 1);

      setModalCorrect(true);
      setModalBadge('THWIP! QUOTE NAILED!');
      setModalScore(`+${gained} PTS`);
      recordFact(`quote_${q.id}`, `${q.character} Quote`);
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
    const bonus = isCorrect ? Math.round(timeLeft * 50) : 0;
    const newStreak = isCorrect ? streak + 1 : 0;

    syncAnswerResult(isCorrect, bonus, newStreak);

    if (isCorrect) {
      playSound('correct');
      setScore((s) => s + bonus);
      setCombo((c) => Math.min(c + 1, 5));
      setStreak(newStreak);
      setTriviaCleared((tc) => tc + 1);

      setModalCorrect(true);
      setModalBadge('LIGHTNING REFLEXES!');
      setModalScore(`+${bonus} PTS`);
      recordFact(`speed_${q.id}`, q.explanationTitle);
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
        <PersistentNavBar
          currentPage={currentPage}
          onNavigatePage={navigateToPage}
          onOpenAbout={() => setAboutOpen(true)}
          onOpenContact={() => setContactOpen(true)}
          onReplayIntro={() => setShowIntro(true)}
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
      footer={<CompactCreatorFooter />}
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
                          loading="lazy"
                          decoding="async"
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToPage('web_thrower');
                      }}
                      className="mt-3 w-full bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-xs font-black py-2 border border-[#1b1b20] uppercase ink-btn cursor-pointer"
                    >
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
                          loading="lazy"
                          decoding="async"
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToPage('spider_id');
                      }}
                      className="mt-3 w-full bg-[#006398] hover:bg-[#004e78] text-white font-comic text-xs font-black py-2 border border-[#1b1b20] uppercase ink-btn cursor-pointer"
                    >
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
                          loading="lazy"
                          decoding="async"
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToPage('trivia', 'tf');
                      }}
                      className="mt-3 w-full bg-[#f9bd22] hover:bg-[#e0a618] text-[#1b1b20] font-comic text-xs font-black py-2 border border-[#1b1b20] uppercase ink-btn cursor-pointer"
                    >
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

        {/* PAGE 9: CUSTOM 404 COMIC PAGE (Requirement 8) */}
        {currentPage === '404' && (
          <NotFoundComicPage
            onReturnHome={() => navigateToPage('cover')}
            onReturnToGame={() => launchGameWithTransition('arcade')}
          />
        )}
      </main>

      {/* Comic Feedback Toast Notification (Requirements 12 & 13) */}
      <ComicFeedbackToast toast={toast} onDismiss={() => setToast(null)} />

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

      {/* Persistent Navigation About & Contact Modals */}
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        onReplayIntro={() => setShowIntro(true)}
      />
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </ComicEnvironment25D>
  );
}
