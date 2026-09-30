import React, { useState, useMemo, useRef } from 'react';
import { CANON_EVENTS, CanonEventCaseFile, CanonCategory } from '../../data/canonArchivesData';
import { arcadeGamesList } from '../../data/spiderCharactersData';
import { ArcadeGame, WebPageId, GameMode } from '../../types';
import { ComicTiltCard } from '../ComicTiltCard';
import { CanonCaseFileModal } from './CanonCaseFileModal';
import { WebOfHistoryTimeline } from './WebOfHistoryTimeline';
import { playSound } from '../../utils/audio';
import { LikeButton } from '../common/LikeButton';
import { useSpiderAuth } from '../../context/AuthContext';
import {
  Search,
  SlidersHorizontal,
  Shuffle,
  ShieldCheck,
  Globe2,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
  Users,
  AlertTriangle,
  Compass,
  FileText,
  ChevronDown,
  Gamepad2,
  Play,
  LayoutGrid
} from 'lucide-react';

interface ComicCanonModeProps {
  onTriggerWeb: (e: React.MouseEvent) => void;
  onNavigatePage?: (page: WebPageId, triviaMode?: GameMode) => void;
}

type SortOption = 'CHRONOLOGICAL' | 'MOST_IMPORTANT' | 'RANDOM';

export const ComicCanonMode: React.FC<ComicCanonModeProps> = ({ onTriggerWeb, onNavigatePage }) => {
  const [activeCategory, setActiveCategory] = useState<CanonCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('CHRONOLOGICAL');
  const [randomSeed, setRandomSeed] = useState<number>(0);
  const [selectedEvent, setSelectedEvent] = useState<CanonEventCaseFile | null>(null);
  const [showAllGames, setShowAllGames] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'TIMELINE'>('GRID');

  const archiveRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { recordFact } = useSpiderAuth();

  // Categories list per requirements
  const filterCategories: { id: CanonCategory; label: string }[] = [
    { id: 'ALL', label: 'ALL EVENTS' },
    { id: 'ORIGIN', label: 'ORIGIN' },
    { id: 'VILLAINS', label: 'VILLAINS' },
    { id: 'ALLIES', label: 'ALLIES' },
    { id: 'LOSS', label: 'LOSS' },
    { id: 'MULTIVERSE', label: 'MULTIVERSE' },
    { id: 'MAJOR_EVENTS', label: 'MAJOR EVENTS' },
    { id: 'LEGACY', label: 'LEGACY' }
  ];

  // Filtering & Search
  const filteredEvents = useMemo(() => {
    let result = [...CANON_EVENTS];

    // Category filter
    if (activeCategory !== 'ALL') {
      result = result.filter((event) => event.categories.includes(activeCategory));
    }

    // Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((event) => {
        const titleMatch = event.title.toLowerCase().includes(q);
        const storylineMatch = event.comicStoryline.toLowerCase().includes(q);
        const issueMatch = event.keyIssue.toLowerCase().includes(q);
        const universeMatch =
          event.universe.toLowerCase().includes(q) || event.universeTag.toLowerCase().includes(q);
        const villainMatch = event.villainAntagonist?.toLowerCase().includes(q) || false;
        const charMatch = event.importantCharacters.some((c) => c.toLowerCase().includes(q));
        const whatMatch = event.whatHappened.toLowerCase().includes(q);
        const factMatch = event.canonFact.toLowerCase().includes(q);
        const whyMatch = event.whyItMatters.toLowerCase().includes(q);

        return (
          titleMatch ||
          storylineMatch ||
          issueMatch ||
          universeMatch ||
          villainMatch ||
          charMatch ||
          whatMatch ||
          factMatch ||
          whyMatch
        );
      });
    }

    // Sorting
    if (sortBy === 'CHRONOLOGICAL') {
      result.sort((a, b) => a.year - b.year);
    } else if (sortBy === 'MOST_IMPORTANT') {
      result.sort((a, b) => a.importanceRank - b.importanceRank);
    } else if (sortBy === 'RANDOM') {
      // Deterministic shuffle with seed
      result.sort((a, b) => {
        const hashA = (a.id.charCodeAt(6) * 17 + randomSeed) % 100;
        const hashB = (b.id.charCodeAt(6) * 17 + randomSeed) % 100;
        return hashA - hashB;
      });
    }

    return result;
  }, [activeCategory, searchQuery, sortBy, randomSeed]);

  // Handle Explore Archive button (smooth scroll)
  const handleExploreClick = () => {
    playSound('thwip');
    if (archiveRef.current) {
      archiveRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Random Canon Event button
  const handleRandomEventClick = () => {
    playSound('spider-sense');
    const randomIndex = Math.floor(Math.random() * CANON_EVENTS.length);
    const chosen = CANON_EVENTS[randomIndex];
    setSelectedEvent(chosen);
    if (recordFact) {
      recordFact(chosen.title, 'canon');
    }
  };

  // Navigation inside the case file modal
  const handleNextEvent = () => {
    if (!selectedEvent) return;
    const currentIndex = CANON_EVENTS.findIndex((e) => e.id === selectedEvent.id);
    const nextIndex = (currentIndex + 1) % CANON_EVENTS.length;
    const nextEvent = CANON_EVENTS[nextIndex];
    setSelectedEvent(nextEvent);
    if (recordFact) {
      recordFact(nextEvent.title, 'canon');
    }
  };

  const handlePrevEvent = () => {
    if (!selectedEvent) return;
    const currentIndex = CANON_EVENTS.findIndex((e) => e.id === selectedEvent.id);
    const prevIndex = (currentIndex - 1 + CANON_EVENTS.length) % CANON_EVENTS.length;
    const prevEvent = CANON_EVENTS[prevIndex];
    setSelectedEvent(prevEvent);
    if (recordFact) {
      recordFact(prevEvent.title, 'canon');
    }
  };

  const handleOpenEvent = (event: CanonEventCaseFile, e: React.MouseEvent) => {
    playSound('thwip');
    onTriggerWeb(e);
    setSelectedEvent(event);
    if (recordFact) {
      recordFact(event.title, 'canon');
    }
  };

  return (
    <section className="space-y-8 preserve-3d animate-fadeIn pb-12">
      {/* ================================================== */}
      {/* 1. HERO SECTION                                   */}
      {/* ================================================== */}
      <div
        className="relative border-4 sm:border-6 border-[#1b1b20] bg-[#fffdf8] p-6 sm:p-10 depth-shadow-comic overflow-hidden"
        style={{
          boxShadow: '8px 8px 0px 0px #1b1b20, 14px 14px 0px 0px rgba(220,38,38,0.25)'
        }}
      >
        {/* Large stylized spider-web pattern in the background */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-80 h-80 sm:w-96 sm:h-96 opacity-15 pointer-events-none select-none text-[#dc2626]"
        >
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
            <path d="M100 0 L100 200 M0 100 L200 100 M29 29 L171 171 M171 29 L29 171" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="25" />
            <circle cx="100" cy="100" r="50" />
            <circle cx="100" cy="100" r="75" />
            <circle cx="100" cy="100" r="95" />
            <path d="M100 25 C115 35 135 35 150 25 M100 50 C130 70 170 70 200 50" />
          </svg>
        </div>

        {/* Halftone dot pattern overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#1b1b20 2px, transparent 2px)',
            backgroundSize: '14px 14px'
          }}
        />

        <div className="relative z-10 max-w-4xl">
          {/* Top Label & Status Indicator Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-comic text-xs font-black text-white uppercase bg-[#dc2626] px-2.5 py-1 border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] tracking-wider">
                SPIDER-VERSE // CLASSIFIED ARCHIVE
              </span>
              <span className="font-mono text-xs font-bold text-[#5b403d] uppercase hidden sm:inline">
                EARTH-616 & MULTIVERSE CONTINUITY
              </span>
            </div>

            {/* Status indicator: 🕷️ CANON DATABASE | 20+ VERIFIED EVENTS */}
            <div className="flex items-center gap-2 bg-[#f3eedf] px-3 py-1 border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20]">
              <span className="text-sm">🕷️</span>
              <div className="leading-none text-left">
                <div className="font-comic text-[10px] font-black text-[#dc2626] uppercase">
                  CANON DATABASE
                </div>
                <div className="font-comic text-xs font-black text-[#1b1b20] uppercase tracking-wide">
                  20+ VERIFIED EVENTS
                </div>
              </div>
            </div>
          </div>

          {/* Large Main Heading */}
          <h1 className="font-comic text-4xl sm:text-6xl md:text-7xl font-black uppercase text-[#1b1b20] tracking-tight leading-[0.95]">
            CANON <span className="text-[#dc2626]">ARCHIVES</span>
          </h1>

          {/* Subheading */}
          <div className="mt-3 inline-block bg-[#facc15] px-3 py-1 border-2 border-[#1b1b20] shadow-[3px_3px_0px_0px_#1b1b20] transform -rotate-0.5">
            <h2 className="font-comic text-sm sm:text-lg font-black uppercase text-[#1b1b20] tracking-tight">
              “THE MOMENTS THAT CHANGED SPIDER-MAN FOREVER.”
            </h2>
          </div>

          {/* Description */}
          <p className="font-comic text-sm sm:text-base text-[#5b403d] font-bold mt-4 max-w-2xl leading-relaxed">
            From the bite that created Spider-Man to the choices that reshaped the Spider-Verse,
            explore the events that define the web-slinger. Every case file is cross-referenced
            against landmark comic continuity with verified citations and behind-the-scenes creator secrets.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mt-6 pt-2">
            <button
              onClick={handleExploreClick}
              className="px-5 py-2.5 bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-sm font-black uppercase border-3 border-[#1b1b20] shadow-[4px_4px_0px_0px_#1b1b20] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] transition-all cursor-pointer flex items-center gap-2 group"
            >
              <Compass className="w-4 h-4 text-[#facc15] group-hover:rotate-45 transition-transform" />
              <span>EXPLORE THE ARCHIVE</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              onClick={handleRandomEventClick}
              className="px-5 py-2.5 bg-white hover:bg-[#fff0f0] text-[#1b1b20] font-comic text-sm font-black uppercase border-3 border-[#1b1b20] shadow-[4px_4px_0px_0px_#1b1b20] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] transition-all cursor-pointer flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4 text-[#dc2626]" />
              <span>RANDOM CANON EVENT</span>
            </button>

            <button
              onClick={() => {
                playSound('thwip');
                setViewMode('TIMELINE');
                setTimeout(() => {
                  timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="px-5 py-2.5 bg-[#facc15] hover:bg-[#eab308] text-[#1b1b20] font-comic text-sm font-black uppercase border-3 border-[#1b1b20] shadow-[4px_4px_0px_0px_#1b1b20] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] transition-all cursor-pointer flex items-center gap-2 group"
            >
              <span className="text-base group-hover:scale-125 transition-transform">🕸️</span>
              <span>WEB OF HISTORY TIMELINE</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 2. CANON CHALLENGE GAMES & SIMULATIONS             */}
      {/* ================================================== */}
      <div className="border-4 sm:border-5 border-[#1b1b20] bg-white p-4 sm:p-7 depth-shadow-comic relative overflow-hidden">
        {/* Comic Halftone texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#1b1b20 2px, transparent 2px)',
            backgroundSize: '12px 12px'
          }}
        />

        <div className="relative z-10">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-[#1b1b20] pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#dc2626] text-white font-comic text-xs font-black px-2 py-0.5 uppercase border border-[#1b1b20]">
                  CANON CHALLENGE GAMES
                </span>
                <span className="font-comic text-xs font-bold text-[#5b403d] uppercase hidden sm:inline">
                  TEST YOUR COMIC KNOWLEDGE
                </span>
              </div>
              <h3 className="font-comic text-2xl sm:text-3xl font-black uppercase text-[#1b1b20] leading-none">
                TRAINING SIMULATIONS: THE MASK IN ACTION
              </h3>
            </div>

            {/* Toggle / View All button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setShowAllGames(!showAllGames);
                }}
                className="bg-[#facc15] hover:bg-[#eab308] text-[#1b1b20] font-comic text-xs font-black px-3.5 py-2 border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] uppercase cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>{showAllGames ? 'SHOW TOP 3 GAMES' : 'VIEW ALL 6 GAMES'}</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(showAllGames ? arcadeGamesList : arcadeGamesList.slice(0, 3)).map((game) => (
              <ComicTiltCard key={game.id} maxTilt={10} scaleOnHover={1.03} className="h-full">
                <div
                  onClick={(e) => {
                    playSound('thwip');
                    onTriggerWeb(e);
                    if (onNavigatePage) {
                      onNavigatePage(game.page, game.triviaSubMode);
                    }
                  }}
                  className="h-full border-3 sm:border-4 border-[#1b1b20] bg-white depth-shadow-comic flex flex-col justify-between ink-btn group cursor-pointer overflow-hidden transition-all duration-200"
                >
                  <div>
                    {/* Header Badge */}
                    <div className="bg-[#1b1b20] text-white px-3 py-1 flex items-center justify-between border-b-2 border-[#1b1b20]">
                      <span className="font-comic text-[10px] font-black uppercase tracking-wider text-[#facc15]">
                        GAME #{game.number} • {game.category}
                      </span>
                      <span
                        className={`font-comic text-[9px] font-black px-1.5 py-0.2 border border-white/40 uppercase ${
                          game.difficulty === 'EXTREME'
                            ? 'bg-[#dc2626] text-white'
                            : game.difficulty === 'HARD'
                            ? 'bg-[#ea580c] text-white'
                            : game.difficulty === 'MEDIUM'
                            ? 'bg-[#0284c7] text-white'
                            : 'bg-[#16a34a] text-white'
                        }`}
                      >
                        {game.difficulty}
                      </span>
                    </div>

                    {/* Distinct High-Quality Comic-Style Image */}
                    <div className="relative h-36 sm:h-40 overflow-hidden border-b-3 border-[#1b1b20] bg-black">
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        loading="lazy"
                        className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="comic-halftone absolute inset-0 pointer-events-none opacity-30" />
                      <div className="absolute bottom-2 left-2 bg-[#1b1b20]/90 text-white font-comic text-[10px] font-black px-2 py-0.5 border border-white/30 uppercase">
                        {game.tagline}
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-3.5">
                      <h4 className="font-comic text-base sm:text-lg font-black uppercase text-[#1b1b20] group-hover:text-[#dc2626] leading-tight transition-colors">
                        {game.title}
                      </h4>
                      <p className="font-comic text-xs text-[#5b403d] font-bold mt-1 line-clamp-2">
                        {game.features.join(' • ')}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 bg-[#fbf8f2] border-t-2 border-[#1b1b20] flex items-center justify-between"
                  >
                    <LikeButton
                      id={`canon-game-${game.id}`}
                      initialLikes={850 + parseInt(game.number, 10) * 60}
                      label="LIKE"
                      compact
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        playSound('thwip');
                        onTriggerWeb(e);
                        if (onNavigatePage) {
                          onNavigatePage(game.page, game.triviaSubMode);
                        }
                      }}
                      className="font-comic text-xs font-black text-[#dc2626] hover:text-[#b8121d] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      PLAY GAME <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </ComicTiltCard>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. INTERACTIVE FILTER & SEARCH SYSTEM              */}
      {/* ================================================== */}
      <div
        ref={archiveRef}
        className="border-4 border-[#1b1b20] bg-white p-4 sm:p-6 depth-shadow-comic space-y-4"
      >
        {/* Top Control Bar: Search Input, View Mode Switcher & Sorting */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-3 border-[#1b1b20]">
          {/* Search Field */}
          <div className="relative flex-1 max-w-xl">
            <label htmlFor="canon-search-input" className="sr-only">
              Search the Archive
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-[#dc2626]" />
            </div>
            <input
              id="canon-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔎 SEARCH THE ARCHIVE (character, villain, issue, universe, keyword)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#fbf8f2] border-3 border-[#1b1b20] text-xs sm:text-sm font-comic font-black text-[#1b1b20] placeholder-[#8a726f] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#dc2626] shadow-[2px_2px_0px_0px_#1b1b20]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-comic font-black text-[#5b403d] hover:text-[#dc2626] cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* View Mode Switcher & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle: Grid vs Web of History Timeline */}
            <div className="flex items-center bg-[#1b1b20] p-1 border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20]">
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setViewMode('GRID');
                }}
                className={`px-3 py-1.5 font-comic text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'GRID'
                    ? 'bg-[#dc2626] text-white shadow-sm'
                    : 'bg-transparent text-white/80 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>CASE FILES GRID</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound('thwip');
                  setViewMode('TIMELINE');
                }}
                className={`px-3 py-1.5 font-comic text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'TIMELINE'
                    ? 'bg-[#dc2626] text-white shadow-sm'
                    : 'bg-transparent text-white/80 hover:text-white'
                }`}
              >
                <span>🕸️</span>
                <span>WEB OF HISTORY</span>
              </button>
            </div>

            {/* Sorting Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-comic text-xs font-black text-[#5b403d] uppercase flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                SORT:
              </span>

              <button
                onClick={() => {
                  playSound('click');
                  setSortBy('CHRONOLOGICAL');
                }}
                className={`px-2.5 py-1.5 font-comic text-xs font-black uppercase border-2 border-[#1b1b20] cursor-pointer transition-transform ${
                  sortBy === 'CHRONOLOGICAL'
                    ? 'bg-[#1b1b20] text-white shadow-[2px_2px_0px_0px_#dc2626] translate-y-[-1px]'
                    : 'bg-[#eae7ee] text-[#1b1b20] hover:bg-white'
                }`}
              >
                CHRONO
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setSortBy('MOST_IMPORTANT');
                }}
                className={`px-2.5 py-1.5 font-comic text-xs font-black uppercase border-2 border-[#1b1b20] cursor-pointer transition-transform ${
                  sortBy === 'MOST_IMPORTANT'
                    ? 'bg-[#dc2626] text-white shadow-[2px_2px_0px_0px_#1b1b20] translate-y-[-1px]'
                    : 'bg-[#eae7ee] text-[#1b1b20] hover:bg-white'
                }`}
              >
                KEY
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setSortBy('RANDOM');
                  setRandomSeed((s) => s + 1);
                }}
                className={`px-2.5 py-1.5 font-comic text-xs font-black uppercase border-2 border-[#1b1b20] cursor-pointer transition-transform ${
                  sortBy === 'RANDOM'
                    ? 'bg-[#facc15] text-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] translate-y-[-1px]'
                    : 'bg-[#eae7ee] text-[#1b1b20] hover:bg-white'
                }`}
              >
                RANDOM
              </button>
            </div>
          </div>
        </div>

        {/* Filter Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {filterCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={(e) => {
                  playSound('click');
                  onTriggerWeb(e);
                  setActiveCategory(cat.id);
                }}
                className={`px-3.5 py-1.5 font-comic text-xs font-black uppercase border-2 border-[#1b1b20] cursor-pointer transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#dc2626] text-white shadow-[3px_3px_0px_0px_#1b1b20] translate-y-[-2px]'
                    : 'bg-[#fbf8f2] text-[#1b1b20] hover:bg-[#fff0f0] hover:border-[#dc2626]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary & Count */}
        <div className="flex items-center justify-between pt-2 text-xs font-comic font-black text-[#5b403d] border-t border-[#1b1b20]/20">
          <div>
            DISPLAYING{' '}
            <span className="text-[#dc2626] text-sm">{filteredEvents.length}</span> OF{' '}
            {CANON_EVENTS.length} CANON CASE FILES
            {searchQuery && (
              <span className="ml-2 bg-[#ffdad6] text-[#b8121d] px-2 py-0.5 border border-[#1b1b20]">
                FILTERED BY: "{searchQuery}"
              </span>
            )}
          </div>
          <span className="hidden sm:inline uppercase">
            CLICK ANY CASE FILE FOR FULL DOSSIER & VERDICT
          </span>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. CASE FILE EVENT CARDS GRID OR WEB OF HISTORY    */}
      {/* ================================================== */}
      <div ref={timelineRef}>
        {viewMode === 'TIMELINE' ? (
          <WebOfHistoryTimeline
            events={filteredEvents.length > 0 ? filteredEvents : CANON_EVENTS}
            onSelectEvent={handleOpenEvent}
            onTriggerWeb={onTriggerWeb}
          />
        ) : filteredEvents.length === 0 ? (
        <div className="border-4 border-[#1b1b20] bg-white p-8 text-center depth-shadow-comic space-y-3">
          <div className="text-4xl">🕸️</div>
          <h3 className="font-comic text-xl font-black uppercase text-[#1b1b20]">
            NO CANON EVENTS MATCH YOUR SEARCH
          </h3>
          <p className="font-comic text-xs text-[#5b403d] font-bold max-w-md mx-auto">
            Our Spider-Bots searched through the Multiverse Archives but could not find matching case files for "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('ALL');
            }}
            className="px-4 py-2 bg-[#dc2626] text-white font-comic text-xs font-black uppercase border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] cursor-pointer"
          >
            RESET ARCHIVE FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 preserve-3d">
          {filteredEvents.map((event, idx) => {
            // Alternating tilt for comic panel flavor
            const tiltClass = idx % 2 === 0 ? 'hover:rotate-[-0.5deg]' : 'hover:rotate-[0.5deg]';

            return (
              <article
                key={event.id}
                className={`border-4 border-[#1b1b20] bg-[#fffdf8] depth-shadow-comic flex flex-col justify-between transition-transform duration-200 ${tiltClass}`}
                style={{
                  boxShadow: '6px 6px 0px 0px #1b1b20'
                }}
              >
                <div>
                  {/* Top Bar: Event Number, Universe & Canon Status Badge */}
                  <div className="bg-[#1b1b20] text-white px-3.5 py-2 flex items-center justify-between border-b-3 border-[#1b1b20]">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#dc2626] text-white font-comic text-xs font-black px-1.5 py-0.5 border border-white/60">
                        #{event.eventNumber}
                      </span>
                      <span className="font-comic text-[11px] font-black uppercase text-[#f9bd22]">
                        {event.universeTag}
                      </span>
                    </div>

                    {/* Distinctive Status Badge */}
                    {event.statusBadge === 'CANON_CONFIRMED' ? (
                      <span className="bg-[#16a34a] text-white font-comic text-[10px] font-black px-2 py-0.5 border border-white tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        ✓ CANON CONFIRMED
                      </span>
                    ) : (
                      <span className="bg-[#9333ea] text-white font-comic text-[10px] font-black px-2 py-0.5 border border-white tracking-wider flex items-center gap-1">
                        <Globe2 className="w-3 h-3" />
                        ◈ ALTERNATE UNIVERSE
                      </span>
                    )}
                  </div>

                  {/* Comic Panel Visual with Sound Effect Badge */}
                  <div className="relative border-b-3 border-[#1b1b20] bg-[#1b1b20] h-44 overflow-hidden group">
                    <img
                      src={event.coverImageUrl}
                      alt={event.title}
                      loading="lazy"
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                    {/* Sound FX Sticker */}
                    <div className="absolute top-2.5 left-2.5 bg-[#facc15] text-[#1b1b20] font-comic font-black text-xs px-2 py-0.5 border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] transform -rotate-6">
                      {event.soundEffect}
                    </div>

                    {/* Era & Year Tag */}
                    <div className="absolute top-2.5 right-2.5 bg-black/80 text-white font-comic text-[10px] font-black px-2 py-0.5 border border-white/40">
                      {event.publicationEra}
                    </div>

                    {/* Comic Title on visual */}
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <div className="text-[10px] font-comic font-black text-[#facc15] uppercase tracking-wide">
                        {event.comicStoryline}
                      </div>
                      <div className="font-mono text-[11px] font-bold text-white/90 truncate">
                        {event.keyIssue}
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Title, What Happened, Canon Fact, Why It Matters */}
                  <div className="p-4 space-y-3.5">
                    {/* Event Title */}
                    <h3 className="font-comic text-xl font-black uppercase text-[#1b1b20] leading-tight tracking-tight">
                      {event.title}
                    </h3>

                    {/* WHAT HAPPENED? Section */}
                    <div className="border-l-3 border-[#dc2626] pl-2.5 py-0.5">
                      <span className="font-comic text-[11px] font-black text-[#dc2626] block uppercase tracking-wide">
                        WHAT HAPPENED?
                      </span>
                      <p className="text-xs font-semibold text-[#1b1b20] leading-relaxed line-clamp-3 mt-0.5">
                        {event.whatHappened}
                      </p>
                    </div>

                    {/* DETAILED CANON FACT Section */}
                    <div className="bg-[#f0fdf4] border-2 border-[#16a34a] p-2.5">
                      <div className="flex items-center gap-1 font-comic text-[10px] font-black text-[#15803d] uppercase">
                        <Sparkles className="w-3 h-3 text-[#16a34a]" />
                        <span>THE CANON FACT</span>
                      </div>
                      <p className="text-xs font-bold text-[#14532d] leading-relaxed mt-0.5 line-clamp-3">
                        {event.canonFact}
                      </p>
                    </div>

                    {/* WHY IT MATTERS Section */}
                    <div className="bg-[#fefce8] border-2 border-[#ca8a04] p-2.5">
                      <span className="font-comic text-[10px] font-black text-[#854d0e] block uppercase">
                        WHY IT MATTERS
                      </span>
                      <p className="text-xs font-semibold text-[#713f12] leading-relaxed mt-0.5 line-clamp-2">
                        {event.whyItMatters}
                      </p>
                    </div>

                    {/* Important Characters & Villain Tags */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[10px] font-comic font-black text-[#5b403d] uppercase mr-1">
                          CHARACTERS:
                        </span>
                        {event.importantCharacters.slice(0, 3).map((char, i) => (
                          <span
                            key={i}
                            className="bg-[#e0f2fe] text-[#0369a1] text-[9px] font-comic font-black px-1.5 py-0.5 border border-[#bae6fd]"
                          >
                            {char}
                          </span>
                        ))}
                        {event.importantCharacters.length > 3 && (
                          <span className="text-[9px] font-comic font-bold text-[#5b403d]">
                            +{event.importantCharacters.length - 3} MORE
                          </span>
                        )}
                      </div>

                      {event.villainAntagonist && (
                        <div className="flex items-center gap-1 text-[10px] font-comic">
                          <span className="font-black text-[#dc2626] uppercase">VILLAIN:</span>
                          <span className="bg-[#fee2e2] text-[#991b1b] font-black px-1.5 py-0.5 border border-[#fecaca] truncate max-w-[200px]">
                            {event.villainAntagonist}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Like Button & Read Full File CTA */}
                <div className="p-3 bg-[#f5f0e6] border-t-3 border-[#1b1b20] flex items-center justify-between gap-2">
                  <LikeButton
                    id={`canon-card-${event.id}`}
                    initialLikes={450 + parseInt(event.eventNumber, 10) * 35}
                    label="LIKE FILE"
                    compact
                  />

                  <button
                    onClick={(e) => handleOpenEvent(event, e)}
                    className="px-3.5 py-1.5 bg-[#1b1b20] hover:bg-[#dc2626] text-white font-comic text-xs font-black uppercase border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[0px] active:translate-y-[0px] cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <span>READ THE FULL FILE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        )}
      </div>

      {/* ================================================== */}
      {/* 4. MODAL: DETAILED CASE FILE DOSSIER               */}
      {/* ================================================== */}
      {selectedEvent && (
        <CanonCaseFileModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onNext={handleNextEvent}
          onPrev={handlePrevEvent}
          onTriggerWeb={onTriggerWeb}
          onRecordFact={(title) => {
            if (recordFact) {
              recordFact(title, 'canon');
            }
          }}
        />
      )}
    </section>
  );
};
