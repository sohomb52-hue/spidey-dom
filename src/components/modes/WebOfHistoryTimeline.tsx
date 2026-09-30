import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CanonEventCaseFile } from '../../data/canonArchivesData';
import { playSound } from '../../utils/audio';
import { LikeButton } from '../common/LikeButton';
import { ComicTiltCard } from '../ComicTiltCard';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  Globe2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Users,
  Compass,
  Zap,
  Target,
  FileText,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface WebOfHistoryTimelineProps {
  events: CanonEventCaseFile[];
  onSelectEvent: (event: CanonEventCaseFile, e: React.MouseEvent) => void;
  onTriggerWeb: (e: React.MouseEvent) => void;
}

type EraKey = 'ALL' | 'SILVER' | 'BRONZE' | 'MODERN' | 'MILLENNIUM' | 'MULTIVERSE';

interface EraDefinition {
  key: EraKey;
  label: string;
  sublabel: string;
  startYear: number;
  endYear: number;
  badgeColor: string;
  themeColor: string;
}

const ERAS: EraDefinition[] = [
  {
    key: 'ALL',
    label: 'ALL ERAS',
    sublabel: '1962 – 2022',
    startYear: 1960,
    endYear: 2030,
    badgeColor: 'bg-[#1b1b20]',
    themeColor: '#dc2626'
  },
  {
    key: 'SILVER',
    label: 'SILVER AGE',
    sublabel: '1962 – 1970',
    startYear: 1962,
    endYear: 1970,
    badgeColor: 'bg-[#dc2626]',
    themeColor: '#dc2626'
  },
  {
    key: 'BRONZE',
    label: 'BRONZE AGE',
    sublabel: '1971 – 1983',
    startYear: 1971,
    endYear: 1983,
    badgeColor: 'bg-[#b45309]',
    themeColor: '#b45309'
  },
  {
    key: 'MODERN',
    label: 'SYMBIOTE & 90s',
    sublabel: '1984 – 1999',
    startYear: 1984,
    endYear: 1999,
    badgeColor: 'bg-[#4338ca]',
    themeColor: '#4338ca'
  },
  {
    key: 'MILLENNIUM',
    label: 'NEW MILLENNIUM',
    sublabel: '2000 – 2013',
    startYear: 2000,
    endYear: 2013,
    badgeColor: 'bg-[#0f766e]',
    themeColor: '#0f766e'
  },
  {
    key: 'MULTIVERSE',
    label: 'SPIDER-VERSE ERA',
    sublabel: '2014 – PRESENT',
    startYear: 2014,
    endYear: 2030,
    badgeColor: 'bg-[#c026d3]',
    themeColor: '#c026d3'
  }
];

export const WebOfHistoryTimeline: React.FC<WebOfHistoryTimelineProps> = ({
  events,
  onSelectEvent,
  onTriggerWeb
}) => {
  // Sort events strictly chronologically
  const chronologicalEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return parseInt(a.eventNumber, 10) - parseInt(b.eventNumber, 10);
    });
  }, [events]);

  const [activeEventId, setActiveEventId] = useState<string>(
    chronologicalEvents[0]?.id || 'canon-01'
  );
  const [selectedEra, setSelectedEra] = useState<EraKey>('ALL');

  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrubberContainerRef = useRef<HTMLDivElement>(null);

  // Filter events by selected era
  const currentEraDef = useMemo(() => {
    return ERAS.find((e) => e.key === selectedEra) || ERAS[0];
  }, [selectedEra]);

  const filteredTimelineEvents = useMemo(() => {
    if (selectedEra === 'ALL') return chronologicalEvents;
    return chronologicalEvents.filter(
      (ev) => ev.year >= currentEraDef.startYear && ev.year <= currentEraDef.endYear
    );
  }, [chronologicalEvents, selectedEra, currentEraDef]);

  // Active event object
  const activeEvent = useMemo(() => {
    return (
      chronologicalEvents.find((e) => e.id === activeEventId) ||
      chronologicalEvents[0]
    );
  }, [chronologicalEvents, activeEventId]);

  const activeIndex = useMemo(() => {
    return chronologicalEvents.findIndex((e) => e.id === activeEventId);
  }, [chronologicalEvents, activeEventId]);

  // Step prev/next
  const handlePrevMilestone = () => {
    if (activeIndex > 0) {
      const prev = chronologicalEvents[activeIndex - 1];
      setActiveEventId(prev.id);
      playSound('thwip');
      scrollToNode(prev.id);
    }
  };

  const handleNextMilestone = () => {
    if (activeIndex < chronologicalEvents.length - 1) {
      const next = chronologicalEvents[activeIndex + 1];
      setActiveEventId(next.id);
      playSound('thwip');
      scrollToNode(next.id);
    }
  };

  const scrollToNode = (id: string) => {
    const el = nodeRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNodeClick = (event: CanonEventCaseFile, e: React.MouseEvent) => {
    setActiveEventId(event.id);
    playSound('thwip');
    onTriggerWeb(e);
  };

  return (
    <section className="space-y-8 animate-fadeIn" id="web-of-history-timeline">
      {/* ================================================== */}
      {/* 1. CHRONO-HEADER & ERA NAVIGATION RAILS           */}
      {/* ================================================== */}
      <div className="border-4 sm:border-6 border-[#1b1b20] bg-[#fffdf8] p-5 sm:p-8 depth-shadow-comic relative overflow-hidden">
        {/* Halftone texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#1b1b20 2px, transparent 2px)',
            backgroundSize: '14px 14px'
          }}
        />

        {/* Decorative Great Web SVG in top right */}
        <div
          aria-hidden="true"
          className="absolute -top-10 -right-10 w-72 h-72 opacity-15 pointer-events-none text-[#dc2626]"
        >
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
            <path d="M100 0 L100 200 M0 100 L200 100 M29 29 L171 171 M171 29 L29 171" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="30" />
            <circle cx="100" cy="100" r="65" />
            <circle cx="100" cy="100" r="95" />
          </svg>
        </div>

        <div className="relative z-10 space-y-4">
          {/* Top Label & Counter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#1b1b20] text-[#facc15] font-comic text-xs font-black px-3 py-1 uppercase border border-white/30 tracking-wider">
                🕸️ THE GREAT WEB OF DESTINY
              </span>
              <span className="font-comic text-xs font-bold text-[#5b403d] uppercase hidden sm:inline">
                CHRONOLOGICAL CANON NAVIGATION
              </span>
            </div>

            <div className="bg-[#f0ece1] border-2 border-[#1b1b20] px-3 py-1 font-comic text-xs font-black text-[#1b1b20] uppercase shadow-[2px_2px_0px_0px_#1b1b20]">
              MILESTONE {activeIndex + 1} OF {chronologicalEvents.length} • {activeEvent.year}
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="font-comic text-3xl sm:text-5xl font-black uppercase text-[#1b1b20] leading-none tracking-tight">
              WEB OF <span className="text-[#dc2626]">HISTORY</span>
            </h2>
            <p className="font-comic text-xs sm:text-sm text-[#5b403d] font-bold mt-2 max-w-2xl leading-relaxed">
              Trace the unbroken thread of Spider-Man history from the 1962 radioactive spider bite to the modern Multiverse war.
              Connected by animated web strands, click any milestone node along the web to anchor your case file investigation.
            </p>
          </div>

          {/* Era Chips Selector */}
          <div className="pt-2">
            <span className="font-comic text-[11px] font-black text-[#5b403d] uppercase block mb-2">
              SELECT COMIC PUBLICATION ERA:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {ERAS.map((era) => {
                const isSelected = selectedEra === era.key;
                return (
                  <button
                    key={era.key}
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setSelectedEra(era.key);
                    }}
                    className={`px-3 py-1.5 border-2 border-[#1b1b20] font-comic text-xs font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? `${era.badgeColor} text-white shadow-[3px_3px_0px_0px_#1b1b20] -translate-y-0.5`
                        : 'bg-white hover:bg-[#fff0f0] text-[#1b1b20] shadow-[1px_1px_0px_0px_#1b1b20]'
                    }`}
                  >
                    <span>{era.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">({era.sublabel})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horizontal Mini-Scrubber Track */}
          <div className="pt-3 border-t-2 border-[#1b1b20]/20">
            <div className="flex items-center justify-between text-[11px] font-comic font-black text-[#5b403d] uppercase mb-1.5">
              <span>CHRONOLOGICAL MILESTONE SCRUBBER:</span>
              <span>1962 — 2022</span>
            </div>

            <div
              ref={scrubberContainerRef}
              className="bg-[#1b1b20] p-2 border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] flex items-center gap-1.5 overflow-x-auto scrollbar-thin"
            >
              {chronologicalEvents.map((ev, idx) => {
                const isActive = ev.id === activeEventId;
                const isAlt = !ev.isMainCanon;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    title={`${ev.year}: ${ev.title} (${ev.keyIssue})`}
                    onClick={(e) => {
                      setActiveEventId(ev.id);
                      playSound('thwip');
                      onTriggerWeb(e);
                      scrollToNode(ev.id);
                    }}
                    className={`flex-shrink-0 px-2 py-1 border transition-all cursor-pointer font-comic text-[10px] font-black uppercase ${
                      isActive
                        ? 'bg-[#dc2626] text-white border-white scale-110 shadow-sm'
                        : isAlt
                        ? 'bg-[#0369a1] hover:bg-[#0284c7] text-white border-white/30'
                        : 'bg-[#2b2b32] hover:bg-[#3f3f4a] text-white/80 border-white/20'
                    }`}
                  >
                    <span>{ev.year}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 2. CHRONO-ANCHOR DOSSIER (ACTIVE MILESTONE SPOTLIGHT) */}
      {/* ================================================== */}
      <div className="border-4 sm:border-5 border-[#1b1b20] bg-white p-5 sm:p-7 depth-shadow-comic relative overflow-hidden">
        {/* Animated Web Strand header background accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#dc2626] via-[#facc15] to-[#0284c7]" />

        <div className="flex flex-col lg:flex-row items-stretch gap-6">
          {/* Left Column: Comic Cover / Panel Artwork */}
          <div className="w-full lg:w-72 flex-shrink-0 flex flex-col justify-between">
            <div className="border-3 border-[#1b1b20] bg-black overflow-hidden relative shadow-[4px_4px_0px_0px_#1b1b20]">
              <img
                src={activeEvent.coverImageUrl}
                alt={activeEvent.title}
                className="w-full h-56 sm:h-64 object-cover filter contrast-105"
              />
              <div className="comic-halftone absolute inset-0 pointer-events-none" />

              {/* Sound Effect Comic Burst */}
              <div className="absolute top-2 right-2 bg-[#facc15] text-[#1b1b20] font-comic font-black text-xs px-2 py-0.5 border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] -rotate-6">
                {activeEvent.soundEffect}
              </div>

              {/* Year Stamp */}
              <div className="absolute bottom-2 left-2 bg-[#dc2626] text-white font-comic font-black text-xs px-2.5 py-0.5 border border-white uppercase shadow-sm">
                YEAR {activeEvent.year}
              </div>
            </div>

            {/* Like Button & Navigation Steppers */}
            <div className="mt-4 pt-3 border-t-2 border-[#1b1b20] flex items-center justify-between gap-2">
              <LikeButton
                id={`timeline-active-${activeEvent.id}`}
                initialLikes={720 + parseInt(activeEvent.eventNumber, 10) * 45}
                label="LIKE EVENT"
                compact
              />

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={activeIndex === 0}
                  onClick={handlePrevMilestone}
                  className="p-1.5 bg-[#f0ece1] hover:bg-[#dc2626] hover:text-white disabled:opacity-30 disabled:pointer-events-none border-2 border-[#1b1b20] font-comic text-xs font-black cursor-pointer shadow-[2px_2px_0px_0px_#1b1b20] transition-colors"
                  title="Previous Canon Milestone"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={activeIndex === chronologicalEvents.length - 1}
                  onClick={handleNextMilestone}
                  className="p-1.5 bg-[#f0ece1] hover:bg-[#dc2626] hover:text-white disabled:opacity-30 disabled:pointer-events-none border-2 border-[#1b1b20] font-comic text-xs font-black cursor-pointer shadow-[2px_2px_0px_0px_#1b1b20] transition-colors"
                  title="Next Canon Milestone"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Chrono-Anchor Case Info */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              {/* Badges Line */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-[#1b1b20] text-[#facc15] font-comic text-[10px] font-black px-2 py-0.5 border border-[#1b1b20] uppercase">
                  EVENT #{activeEvent.eventNumber} • {activeEvent.publicationEra}
                </span>

                {/* Canon Status Badge */}
                {activeEvent.isMainCanon ? (
                  <span className="bg-[#16a34a] text-white font-comic text-[10px] font-black px-2 py-0.5 border border-[#14532d] uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>✓ CANON CONFIRMED</span>
                  </span>
                ) : (
                  <span className="bg-[#0284c7] text-white font-comic text-[10px] font-black px-2 py-0.5 border border-[#0369a1] uppercase flex items-center gap-1">
                    <Globe2 className="w-3 h-3" />
                    <span>◈ ALTERNATE UNIVERSE ({activeEvent.universe})</span>
                  </span>
                )}

                <span className="bg-[#f0ece1] text-[#1b1b20] font-comic text-[10px] font-black px-2 py-0.5 border border-[#1b1b20] uppercase">
                  {activeEvent.keyIssue}
                </span>
              </div>

              {/* Event Title */}
              <h3 className="font-comic text-2xl sm:text-3xl font-black uppercase text-[#1b1b20] leading-tight">
                {activeEvent.title}
              </h3>
              <p className="font-comic text-xs font-black text-[#dc2626] uppercase tracking-wide mt-0.5">
                {activeEvent.comicStoryline}
              </p>

              {/* What Happened Section */}
              <div className="mt-3 bg-[#fdfaf3] border-2 border-[#1b1b20] p-3 shadow-[2px_2px_0px_0px_#1b1b20]">
                <span className="font-comic text-[10px] font-black text-[#5b403d] uppercase block mb-1">
                  WHAT HAPPENED?
                </span>
                <p className="font-comic text-xs sm:text-sm text-[#1b1b20] font-bold leading-relaxed">
                  {activeEvent.whatHappened}
                </p>
              </div>

              {/* Canon Fact & Why It Matters Snippet Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="bg-[#f0fdf4] border-2 border-[#16a34a] p-2.5">
                  <div className="flex items-center gap-1 text-[10px] font-comic font-black text-[#15803d] uppercase mb-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>CANON FACT</span>
                  </div>
                  <p className="text-xs font-bold text-[#14532d] leading-relaxed line-clamp-3">
                    {activeEvent.canonFact}
                  </p>
                </div>

                <div className="bg-[#fefce8] border-2 border-[#ca8a04] p-2.5">
                  <span className="font-comic text-[10px] font-black text-[#854d0e] uppercase block mb-0.5">
                    WHY THIS MATTERS
                  </span>
                  <p className="text-xs font-semibold text-[#713f12] leading-relaxed line-clamp-3">
                    {activeEvent.whyItMatters}
                  </p>
                </div>
              </div>

              {/* Speech Bubble Quote */}
              {activeEvent.speechQuote && (
                <div className="mt-3 relative bg-white border-2 border-[#1b1b20] p-3 italic text-xs font-comic font-bold text-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20]">
                  “{activeEvent.speechQuote.text}”
                  <span className="block not-italic text-[10px] font-black text-[#dc2626] uppercase mt-1">
                    — {activeEvent.speechQuote.speaker} ({activeEvent.year}) • {activeEvent.speechQuote.caption}
                  </span>
                </div>
              )}
            </div>

            {/* Read Full Case File Primary Action CTA */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 text-[11px] font-comic">
                <span className="font-black text-[#5b403d] uppercase">KEY CHARACTERS:</span>
                <span className="font-bold text-[#1b1b20]">
                  {activeEvent.importantCharacters.slice(0, 3).join(', ')}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => onSelectEvent(activeEvent, e)}
                className="px-5 py-2.5 bg-[#dc2626] hover:bg-[#b8121d] text-white font-comic text-xs sm:text-sm font-black uppercase border-3 border-[#1b1b20] shadow-[4px_4px_0px_0px_#1b1b20] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[0px] active:translate-y-[0px] cursor-pointer flex items-center gap-2 transition-all"
              >
                <span>OPEN FULL CASE DOSSIER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* 3. THE ANIMATED WEB STRAND CHRONOLOGICAL TRACK     */}
      {/* ================================================== */}
      <div className="border-4 sm:border-6 border-[#1b1b20] bg-[#fbf8f2] p-4 sm:p-8 depth-shadow-comic relative overflow-hidden">
        {/* Background Radial Web Net */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #1b1b20 2px, transparent 2px), linear-gradient(to right, rgba(220,38,38,0.1) 1px, transparent 1px)`,
            backgroundSize: '24px 24px, 48px 48px'
          }}
        />

        <div className="relative z-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="bg-[#dc2626] text-white font-comic text-xs font-black px-3 py-1 uppercase border border-[#1b1b20] inline-block shadow-[2px_2px_0px_0px_#1b1b20]">
              THE CHRONOLOGICAL WEB LINE
            </span>
            <h3 className="font-comic text-2xl sm:text-4xl font-black uppercase text-[#1b1b20] mt-2">
              FOLLOW THE WEBBED STRANDS
            </h3>
            <p className="font-comic text-xs sm:text-sm text-[#5b403d] font-bold mt-1">
              Click any node on the timeline below to anchor into that continuity milestone!
            </p>
          </div>

          {/* Chronological Vertical Track with Connecting Animated Web Strands */}
          <div className="relative max-w-4xl mx-auto space-y-0">
            {filteredTimelineEvents.map((event, idx) => {
              const isActive = event.id === activeEventId;
              const isEven = idx % 2 === 0;
              const isAlt = !event.isMainCanon;

              return (
                <div
                  key={event.id}
                  ref={(el) => {
                    nodeRefs.current[event.id] = el;
                  }}
                  className="relative pb-10"
                >
                  {/* Animated Web Strand Connecting to Next Event (if not last) */}
                  {idx < filteredTimelineEvents.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 -bottom-2 w-10 h-14 -translate-x-1/2 pointer-events-none z-0"
                    >
                      <svg viewBox="0 0 40 60" className="w-full h-full overflow-visible">
                        {/* Shadow line */}
                        <line x1="20" y1="0" x2="20" y2="60" stroke="#1b1b20" strokeWidth="4" />
                        {/* Animated web pulse line */}
                        <line
                          x1="20"
                          y1="0"
                          x2="20"
                          y2="60"
                          stroke={isAlt ? '#06b6d4' : '#dc2626'}
                          strokeWidth="3"
                          className={isAlt ? 'animate-dimensional-web' : 'animate-web-strand animate-web-glow'}
                        />
                        {/* Small web anchor cross-threads */}
                        <line x1="10" y1="20" x2="30" y2="20" stroke={isAlt ? '#d946ef' : '#facc15'} strokeWidth="2" />
                        <line x1="8" y1="40" x2="32" y2="40" stroke={isAlt ? '#d946ef' : '#facc15'} strokeWidth="2" />
                        <circle cx="20" cy="30" r="3" fill="#ffffff" stroke="#1b1b20" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}

                  {/* Node Anchor Center Marker */}
                  <div className="flex items-center justify-center mb-3 relative z-10">
                    <button
                      type="button"
                      onClick={(e) => handleNodeClick(event, e)}
                      className={`group relative flex items-center gap-2 px-3 py-1 border-3 border-[#1b1b20] transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#dc2626] text-white scale-105 shadow-[4px_4px_0px_0px_#1b1b20]'
                          : isAlt
                          ? 'bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-[2px_2px_0px_0px_#1b1b20]'
                          : 'bg-white hover:bg-[#fff0f0] text-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20]'
                      }`}
                    >
                      {/* Pulse Ring when Active */}
                      {isActive && (
                        <span className="absolute -inset-1 border-2 border-[#dc2626] animate-ping opacity-60 pointer-events-none" />
                      )}

                      <span className="text-sm">🕸️</span>
                      <span className="font-comic text-xs font-black uppercase tracking-wider">
                        MILESTONE #{event.eventNumber} • {event.year}
                      </span>
                    </button>
                  </div>

                  {/* Comic Milestone Card */}
                  <div
                    onClick={(e) => handleNodeClick(event, e)}
                    className={`border-4 border-[#1b1b20] bg-white p-4 sm:p-5 relative z-10 cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'shadow-[6px_6px_0px_0px_#dc2626,8px_8px_0px_0px_#1b1b20] ring-2 ring-[#dc2626]'
                        : 'shadow-[4px_4px_0px_0px_#1b1b20] hover:shadow-[6px_6px_0px_0px_#1b1b20] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Thumbnail & Key Details */}
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-black border-2 border-[#1b1b20] overflow-hidden relative shadow-[2px_2px_0px_0px_#1b1b20]">
                          <img
                            src={event.coverImageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover filter contrast-105"
                          />
                          <div className="comic-halftone absolute inset-0 pointer-events-none" />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="bg-[#1b1b20] text-white font-comic text-[9px] font-black px-1.5 py-0.2 uppercase">
                              {event.year}
                            </span>
                            <span className="bg-[#f0ece1] text-[#1b1b20] font-comic text-[9px] font-black px-1.5 py-0.2 uppercase border border-[#1b1b20]/30">
                              {event.keyIssue}
                            </span>
                            {isAlt ? (
                              <span className="bg-[#0284c7] text-white font-comic text-[9px] font-black px-1.5 py-0.2 uppercase">
                                ◈ {event.universe}
                              </span>
                            ) : (
                              <span className="bg-[#16a34a] text-white font-comic text-[9px] font-black px-1.5 py-0.2 uppercase">
                                ✓ CANON
                              </span>
                            )}
                          </div>

                          <h4 className="font-comic text-base sm:text-xl font-black uppercase text-[#1b1b20] leading-tight">
                            {event.title}
                          </h4>
                          <p className="font-comic text-xs font-semibold text-[#5b403d] line-clamp-2 mt-1">
                            {event.whatHappened}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEvent(event, e);
                          }}
                          className="px-3 py-1.5 bg-[#1b1b20] hover:bg-[#dc2626] text-white font-comic text-xs font-black uppercase border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>READ CASE FILE</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
