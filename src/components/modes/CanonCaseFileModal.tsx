import React, { useState, useEffect } from 'react';
import { CanonEventCaseFile } from '../../data/canonArchivesData';
import { playSound } from '../../utils/audio';
import { LikeButton } from '../common/LikeButton';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Globe2,
  BookOpen,
  Calendar,
  Sparkles,
  Users,
  AlertTriangle,
  FileText,
  Volume2,
  CheckCircle2,
  Share2,
  Zap,
  Bookmark
} from 'lucide-react';

interface CanonCaseFileModalProps {
  event: CanonEventCaseFile;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onTriggerWeb?: (e: React.MouseEvent) => void;
  onRecordFact?: (factTitle: string) => void;
}

export const CanonCaseFileModal: React.FC<CanonCaseFileModalProps> = ({
  event,
  onClose,
  onNext,
  onPrev,
  onTriggerWeb,
  onRecordFact
}) => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'evidence' | 'quote'>('dossier');
  const [isWebStamped, setIsWebStamped] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playSound('click');
        onClose();
      } else if (e.key === 'ArrowRight') {
        playSound('thwip');
        onNext();
      } else if (e.key === 'ArrowLeft') {
        playSound('thwip');
        onPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Reset web stamped state when event changes
  useEffect(() => {
    setIsWebStamped(false);
  }, [event.id]);

  const handleWebStamp = (e: React.MouseEvent) => {
    playSound('thwip');
    setIsWebStamped(true);
    if (onTriggerWeb) {
      onTriggerWeb(e);
    }
    if (onRecordFact) {
      onRecordFact(event.title);
    }
  };

  const handleShareCitation = () => {
    playSound('click');
    const textToCopy = `🕷️ CANON ARCHIVE FILE #${event.eventNumber}: ${event.title} (${event.keyIssue}) - Verified Spider-Verse Continuity.`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-file-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl my-auto bg-[#fffdf8] border-4 sm:border-6 border-[#1b1b20] depth-shadow-comic text-[#1b1b20] overflow-hidden"
        style={{
          boxShadow: '10px 10px 0px 0px #1b1b20, 18px 18px 0px 0px rgba(220,38,38,0.35)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Classified Manila Header */}
        <div className="bg-[#1b1b20] text-white px-4 sm:px-6 py-2.5 flex items-center justify-between border-b-4 border-[#1b1b20]">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#dc2626] text-white font-comic text-xs font-black px-2 py-0.5 uppercase border border-white tracking-widest animate-pulse">
              TOP SECRET // CLASSIFIED
            </span>
            <span className="font-mono text-xs sm:text-sm text-[#f9bd22] font-black tracking-widest hidden xs:inline">
              CASE FILE #{event.eventNumber} // {event.keyIssue.split('(')[0].trim().toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Prev / Next file navigation */}
            <button
              onClick={() => {
                playSound('thwip');
                onPrev();
              }}
              title="Previous Case File (Left Arrow)"
              className="p-1 sm:px-2 sm:py-0.5 bg-[#333] hover:bg-[#dc2626] text-white font-comic text-xs font-black border border-white/40 rounded-none cursor-pointer flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PREV</span>
            </button>
            <button
              onClick={() => {
                playSound('thwip');
                onNext();
              }}
              title="Next Case File (Right Arrow)"
              className="p-1 sm:px-2 sm:py-0.5 bg-[#333] hover:bg-[#dc2626] text-white font-comic text-xs font-black border border-white/40 rounded-none cursor-pointer flex items-center gap-1 transition-colors"
            >
              <span className="hidden sm:inline">NEXT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="p-1 text-white hover:text-[#dc2626] hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-[#1b1b20]"
              aria-label="Close Case File"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Case File Sub-Banner with Barcode & Status */}
        <div className="bg-[#f3eedf] px-4 sm:px-6 py-2 border-b-3 border-[#1b1b20] flex flex-wrap items-center justify-between gap-2 text-xs font-comic font-black">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-widest bg-white px-2 py-0.5 border border-[#1b1b20]">
              ||||| | |||| || | ||| #{event.id.toUpperCase()}
            </span>
            <span className="text-[#5b403d] uppercase hidden sm:inline">
              ARCHIVE CITATION: {event.keyIssue}
            </span>
          </div>

          {/* Status Badge */}
          {event.statusBadge === 'CANON_CONFIRMED' ? (
            <div className="flex items-center gap-1.5 bg-[#dcfce7] text-[#14532d] px-2.5 py-0.5 border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20]">
              <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
              <span className="font-comic font-black tracking-wide">
                ✓ CANON CONFIRMED • {event.universe}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#f3e8ff] text-[#581c87] px-2.5 py-0.5 border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20]">
              <Globe2 className="w-4 h-4 text-[#9333ea]" />
              <span className="font-comic font-black tracking-wide">
                ◈ ALTERNATE UNIVERSE • {event.universeTag}
              </span>
            </div>
          )}
        </div>

        {/* Modal Main Content Grid */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Comic Panel Illustration & Quick Facts */}
            <div className="md:col-span-5 flex flex-col space-y-4">
              {/* Comic Visual Card with Sound FX Stamp */}
              <div className="relative border-4 border-[#1b1b20] bg-white overflow-hidden shadow-[5px_5px_0px_0px_#1b1b20]">
                {/* Visual Image */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-[#1b1b20]">
                  <img
                    src={event.coverImageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover filter contrast-110 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Sound FX Stamp */}
                  <div className="absolute top-3 left-3 bg-[#facc15] text-[#1b1b20] font-comic font-black text-xs sm:text-sm px-2.5 py-1 border-2 border-[#1b1b20] shadow-[3px_3px_0px_0px_#1b1b20] transform -rotate-6">
                    {event.soundEffect}
                  </div>

                  {/* Event Number Badge */}
                  <div className="absolute top-3 right-3 bg-[#dc2626] text-white font-comic font-black text-sm px-2.5 py-0.5 border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20]">
                    #{event.eventNumber}
                  </div>

                  {/* Caption on image */}
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <span className="text-[10px] font-comic font-black bg-[#1b1b20] px-1.5 py-0.5 uppercase border border-white/60">
                      {event.publicationEra}
                    </span>
                    <h4 className="font-comic text-base font-black uppercase text-white mt-1 drop-shadow-md">
                      {event.comicStoryline}
                    </h4>
                  </div>
                </div>

                {/* Like Button & Web Stamp directly beneath art */}
                <div className="p-3 bg-[#faf7f0] border-t-3 border-[#1b1b20] flex items-center justify-between gap-2">
                  <LikeButton
                    id={`modal-canon-${event.id}`}
                    initialLikes={840 + parseInt(event.eventNumber, 10) * 45}
                    label="LIKE DOSSIER"
                    compact
                  />

                  <button
                    onClick={handleWebStamp}
                    className={`px-3 py-1 font-comic text-xs font-black uppercase border-2 border-[#1b1b20] cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95 ${
                      isWebStamped
                        ? 'bg-[#16a34a] text-white shadow-[2px_2px_0px_0px_#1b1b20]'
                        : 'bg-[#dc2626] hover:bg-[#b8121d] text-white shadow-[2px_2px_0px_0px_#1b1b20]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#f9bd22]" />
                    <span>{isWebStamped ? 'EVIDENCE STAMPED!' : 'WEB-STAMP FILE'}</span>
                  </button>
                </div>
              </div>

              {/* Dossier Quick Spec Sheet */}
              <div className="border-3 border-[#1b1b20] bg-white p-3.5 shadow-[4px_4px_0px_0px_#1b1b20] space-y-2.5 text-xs font-comic">
                <div className="flex items-center gap-1.5 text-[#b8121d] font-black pb-1.5 border-b border-[#1b1b20]/20">
                  <FileText className="w-3.5 h-3.5" />
                  <span>CASE FILE SPECIFICATIONS</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-[#5b403d] font-bold block uppercase">KEY ISSUE</span>
                    <span className="font-black text-[#1b1b20]">{event.keyIssue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5b403d] font-bold block uppercase">ERA & YEAR</span>
                    <span className="font-black text-[#1b1b20]">{event.publicationEra}</span>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-[#1b1b20]/20">
                  <span className="text-[10px] text-[#5b403d] font-bold block uppercase">PRIMARY CHARACTERS</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {event.importantCharacters.map((char, i) => (
                      <span
                        key={i}
                        className="bg-[#e0f2fe] text-[#0369a1] px-1.5 py-0.5 text-[10px] font-black border border-[#0284c7]"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                {event.villainAntagonist && (
                  <div className="pt-1.5 border-t border-[#1b1b20]/20">
                    <span className="text-[10px] text-[#dc2626] font-black block uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      ANTAGONIST / THREAT
                    </span>
                    <span className="bg-[#fee2e2] text-[#991b1b] px-2 py-0.5 text-[11px] font-black border border-[#dc2626] inline-block mt-0.5">
                      {event.villainAntagonist}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Case File Tabs & In-Depth Lore */}
            <div className="md:col-span-7 flex flex-col space-y-4">
              {/* Event Title Header */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#dc2626] text-white font-comic text-xs font-black px-2 py-0.5 uppercase border border-[#1b1b20]">
                    CANON EVENT #{event.eventNumber}
                  </span>
                  <span className="text-xs font-comic font-black text-[#5b403d] uppercase">
                    {event.universeTag}
                  </span>
                </div>
                <h3
                  id="case-file-title"
                  className="font-comic text-2xl sm:text-3xl font-black uppercase text-[#1b1b20] mt-1.5 leading-tight tracking-tight"
                >
                  {event.title}
                </h3>
                <p className="font-comic text-xs text-[#5b403d] font-bold italic mt-0.5">
                  Storyline: {event.comicStoryline}
                </p>
              </div>

              {/* Navigation Tabs: Dossier, Canon Evidence, Comic Quote */}
              <div className="flex flex-wrap border-b-3 border-[#1b1b20] gap-1">
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveTab('dossier');
                  }}
                  className={`px-3 py-1.5 font-comic text-xs font-black uppercase border-t-2 border-x-2 border-[#1b1b20] transition-colors cursor-pointer ${
                    activeTab === 'dossier'
                      ? 'bg-[#1b1b20] text-white -mb-0.5 pb-2 shadow-[2px_0px_0px_0px_#1b1b20]'
                      : 'bg-[#eae7ee] text-[#1b1b20] hover:bg-white'
                  }`}
                >
                  CASE DOSSIER & VERDICT
                </button>

                <button
                  onClick={() => {
                    playSound('click');
                    setActiveTab('evidence');
                  }}
                  className={`px-3 py-1.5 font-comic text-xs font-black uppercase border-t-2 border-x-2 border-[#1b1b20] transition-colors cursor-pointer ${
                    activeTab === 'evidence'
                      ? 'bg-[#dc2626] text-white -mb-0.5 pb-2 shadow-[2px_0px_0px_0px_#1b1b20]'
                      : 'bg-[#eae7ee] text-[#1b1b20] hover:bg-white'
                  }`}
                >
                  CANON FACT & SECRETS
                </button>

                <button
                  onClick={() => {
                    playSound('spider-sense');
                    setActiveTab('quote');
                  }}
                  className={`px-3 py-1.5 font-comic text-xs font-black uppercase border-t-2 border-x-2 border-[#1b1b20] transition-colors cursor-pointer ${
                    activeTab === 'quote'
                      ? 'bg-[#f59e0b] text-[#1b1b20] -mb-0.5 pb-2 shadow-[2px_0px_0px_0px_#1b1b20]'
                      : 'bg-[#eae7ee] text-[#1b1b20] hover:bg-white'
                  }`}
                >
                  SPEECH BUBBLE & QUOTE
                </button>
              </div>

              {/* Tab 1: Dossier & Verdict */}
              {activeTab === 'dossier' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* WHAT HAPPENED */}
                  <div className="border-3 border-[#1b1b20] bg-white p-4 shadow-[4px_4px_0px_0px_#1b1b20]">
                    <div className="flex items-center gap-1.5 text-xs font-comic font-black text-[#dc2626] uppercase mb-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>WHAT HAPPENED? (INCIDENT REPORT)</span>
                    </div>
                    <p className="text-sm font-semibold text-[#1b1b20] leading-relaxed">
                      {event.whatHappened}
                    </p>
                  </div>

                  {/* WHY IT MATTERS */}
                  <div className="border-3 border-[#1b1b20] bg-[#fefce8] p-4 shadow-[4px_4px_0px_0px_#1b1b20]">
                    <div className="flex items-center gap-1.5 text-xs font-comic font-black text-[#854d0e] uppercase mb-1.5">
                      <Sparkles className="w-4 h-4 text-[#eab308]" />
                      <span>WHY IT MATTERS TO SPIDER-MAN’S DESTINY</span>
                    </div>
                    <p className="text-sm font-semibold text-[#713f12] leading-relaxed">
                      {event.whyItMatters}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Canon Fact & Editorial Secrets */}
              {activeTab === 'evidence' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* THE CANON FACT */}
                  <div className="border-3 border-[#1b1b20] bg-[#f0fdf4] p-4 shadow-[4px_4px_0px_0px_#1b1b20]">
                    <div className="flex items-center gap-1.5 text-xs font-comic font-black text-[#15803d] uppercase mb-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                      <span>THE VERIFIED CANON FACT (DEBUNKING MISCONCEPTIONS)</span>
                    </div>
                    <p className="text-sm font-bold text-[#14532d] leading-relaxed">
                      {event.canonFact}
                    </p>
                  </div>

                  {/* EDITORIAL SECRET */}
                  <div className="border-3 border-[#1b1b20] bg-white p-4 shadow-[4px_4px_0px_0px_#1b1b20]">
                    <div className="flex items-center gap-1.5 text-xs font-comic font-black text-[#7c2d12] uppercase mb-1.5">
                      <Users className="w-4 h-4 text-[#ea580c]" />
                      <span>BEHIND-THE-PAGES FACT CHECK (CREATOR ARCHIVE)</span>
                    </div>
                    <p className="text-sm font-semibold text-[#431407] leading-relaxed">
                      {event.editorialSecret}
                    </p>
                    <div className="mt-3 pt-2 border-t border-[#1b1b20]/20 flex justify-between items-center text-[11px] font-comic font-bold text-[#5b403d]">
                      <span>VERIFICATION SOURCE:</span>
                      <span className="font-mono text-[#1b1b20] font-black">{event.verifiedBy}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Iconic Comic Quote & Speech Bubble */}
              {activeTab === 'quote' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Comic Speech Bubble */}
                  <div className="relative border-4 border-[#1b1b20] bg-white p-5 shadow-[6px_6px_0px_0px_#1b1b20] rotate-[-0.5deg]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-[#facc15] text-[#1b1b20] text-[10px] font-comic font-black px-2 py-0.5 border border-[#1b1b20] uppercase">
                        SPEAKER: {event.speechQuote.speaker.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-comic font-black text-[#5b403d]">
                        {event.speechQuote.caption}
                      </span>
                    </div>

                    <div className="relative my-2 pl-4 border-l-4 border-[#dc2626]">
                      <p className="font-comic text-lg sm:text-xl font-black text-[#1b1b20] italic tracking-tight leading-snug">
                        “{event.speechQuote.text}”
                      </p>
                    </div>

                    {/* Speech bubble tail icon indicator */}
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#1b1b20]/20">
                      <span className="text-xs font-comic font-black text-[#dc2626]">
                        {event.keyIssue}
                      </span>
                      <button
                        onClick={() => playSound('spider-sense')}
                        className="flex items-center gap-1 text-xs font-comic font-black text-[#1b1b20] hover:text-[#dc2626] cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-[#dc2626]" />
                        <span>REPLAY SPIDER-SENSE FX</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary of Impact */}
                  <div className="border-3 border-[#1b1b20] bg-[#faf7ee] p-3 text-xs font-comic font-bold text-[#5b403d] flex items-center justify-between">
                    <span>TIMELINE STATUS: {event.isMainCanon ? 'Core Earth-616 Continuity Anchor' : 'Multiverse Timeline Branch'}</span>
                    <span className="text-[#1b1b20] font-black uppercase">{event.universeTag}</span>
                  </div>
                </div>
              )}

              {/* Bottom Action Footer in Right Column */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t-2 border-[#1b1b20]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareCitation}
                    className="px-3 py-1.5 bg-white hover:bg-[#fff0f0] text-[#1b1b20] font-comic text-xs font-black uppercase border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#dc2626]" />
                    <span>{copiedLink ? 'CITATION COPIED!' : 'SHARE CITATION'}</span>
                  </button>

                  <button
                    onClick={handleWebStamp}
                    className="px-3 py-1.5 bg-[#facc15] hover:bg-[#f59e0b] text-[#1b1b20] font-comic text-xs font-black uppercase border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>LOG TO DOSSIER</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playSound('thwip');
                      onNext();
                    }}
                    className="px-4 py-1.5 bg-[#1b1b20] hover:bg-[#dc2626] text-white font-comic text-xs font-black uppercase border-2 border-[#1b1b20] shadow-[2px_2px_0px_0px_#1b1b20] cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <span>NEXT CASE FILE</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Manila File Tab Bar */}
        <div className="bg-[#1b1b20] text-white/90 px-4 sm:px-6 py-2 border-t-3 border-[#1b1b20] flex items-center justify-between text-[11px] font-comic">
          <div className="flex items-center gap-2">
            <span className="text-[#f9bd22] font-black">SPIDER-VERSE CANON ARCHIVE</span>
            <span className="hidden sm:inline text-white/60">• FILE VERIFIED ACCORDING TO MARVEL COMICS GROUP CONTINUITY</span>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="hover:underline text-white font-black uppercase cursor-pointer"
          >
            [ CLOSE CASE FILE (ESC) ]
          </button>
        </div>
      </div>
    </div>
  );
};
