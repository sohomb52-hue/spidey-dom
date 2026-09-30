import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Zap,
  Minimize2,
  Maximize2,
  Trash2,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { WebPageId } from '../../types';
import { playSound } from '../../utils/audio';
import { SpiderSenseRadarBadge, SpiderBotGuide } from '../icons/SpiderVerseBadges';
import { useSpiderAuth } from '../../context/AuthContext';
import {
  GAME_THUMB_WEB_THROWER,
  GAME_THUMB_FACT_ATTACK,
  GAME_THUMB_SPIDER_SENSE,
} from '../../data/spiderArtAssets';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'spidey';
  text: string;
  timestamp: string;
  isError?: boolean;
  retryPrompt?: string;
  reaction?: 'thwip' | 'bam' | null;
  richCards?: RichCardPreview[];
}

export interface RichCardPreview {
  type: 'web_swing' | 'spider_sense' | 'canon_timeline' | 'vault';
  title: string;
  subtitle: string;
  badge: string;
  page: WebPageId;
  image?: string;
  buttonText: string;
}

interface SpideyChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onNavigatePage: (page: WebPageId) => void;
}

type TopicCategory = 'all' | 'prompts' | 'games' | 'canon' | 'villains';

// Quick action prompts that send real dynamic queries to Gemini
const QUICK_ACTIONS = [
  {
    label: 'GIVE ME A FACT',
    icon: '🕸️',
    badge: 'PROMPT',
    query: 'Give me one surprising but accurate Spider-Man canon fact. Do not repeat a fact from earlier in this conversation.',
    bg: 'bg-[#fee2e2]',
  },
  {
    label: 'QUIZ ME',
    icon: '🧠',
    badge: 'TRIVIA',
    query: 'Create one Spider-Man trivia question appropriate for my current conversation. Wait for my answer.',
    bg: 'bg-[#fef08a]',
  },
  {
    label: 'TELL ME A JOKE',
    icon: '😄',
    badge: 'HUMOR',
    query: 'Tell me a short Spider-Man-style joke.',
    bg: 'bg-[#ffdf9f]',
  },
  {
    label: 'WHAT SHOULD I PLAY?',
    icon: '🎮',
    badge: 'RECOMMEND',
    query: 'Based on the available arcade games and my current progress, recommend something I can play.',
    bg: 'bg-[#dbeafe]',
  },
  {
    label: 'PLAY WEB SWING',
    icon: '🕹️',
    badge: 'ARCADE',
    page: 'arcade' as WebPageId,
    bg: 'bg-[#dcfce7]',
  },
  {
    label: 'WEB OF HISTORY',
    icon: '📜',
    badge: 'CANON',
    page: 'canon' as WebPageId,
    bg: 'bg-[#fce7f3]',
  },
  {
    label: 'BADGES VAULT',
    icon: '🏆',
    badge: 'TROPHIES',
    page: 'vault' as WebPageId,
    bg: 'bg-[#fef3c7]',
  },
];

const TOPIC_CHIPS: Array<{ category: TopicCategory; label: string; query: string }> = [
  { category: 'prompts', label: '💥 Random Obscure Fact', query: 'Give me one surprising but accurate Spider-Man canon fact. Do not repeat a fact from earlier in this conversation.' },
  { category: 'prompts', label: '🧠 Trivia Challenge', query: 'Create one Spider-Man trivia question appropriate for my current conversation. Wait for my answer.' },
  { category: 'prompts', label: '🕷️ Spidey Joke', query: 'Tell me a short Spider-Man-style joke.' },
  { category: 'games', label: '🎮 Recommend a Game', query: 'Based on the available arcade games and my current progress, recommend something I can play.' },
  { category: 'games', label: '🕹️ Web Swing Pro Tips', query: 'What is the best technique to survive and score high in Web Swing?' },
  { category: 'canon', label: '🕸️ Earth-616 vs 1610', query: 'Explain the difference between Earth-616 and the Ultimate Universe (Earth-1610).' },
  { category: 'canon', label: '💔 The Night Gwen Stacy Died', query: 'What happened to Gwen Stacy in Amazing Spider-Man #121?' },
  { category: 'canon', label: '⚡ How Spider-Sense Works', query: 'Explain how Spider-Mans spider-sense works in comic canon.' },
  { category: 'villains', label: '🎃 Green Goblin vs Doc Ock', query: 'Who would win in a fight: Green Goblin or Doctor Octopus?' },
  { category: 'villains', label: '🖤 Venom & Eddie Brock', query: 'Tell me about Venom and Eddie Brocks comic origin.' },
  { category: 'all', label: '🥱 Im Bored! Suggest something', query: 'Im bored. What should I explore or play on this website?' },
];

const INITIAL_WELCOME: ChatMessage = {
  id: 'msg-welcome',
  sender: 'spidey',
  timestamp: 'Live Comm',
  text: `Hey there, True Believer! 🕷️ I'm Spidey, your AI companion on Spider-Verse Fact Attack!

Ask me literally anything—comic canon, multiverse lore, movie vs comic differences, game tips, or general trivia. Every answer is generated live!`,
  richCards: [
    {
      type: 'web_swing',
      title: 'WEB SWING ARCADE',
      subtitle: 'Physics swinging arcade simulation',
      badge: 'ARCADE',
      page: 'arcade',
      image: GAME_THUMB_WEB_THROWER,
      buttonText: 'PLAY WEB SWING 🎮',
    },
    {
      type: 'canon_timeline',
      title: 'WEB OF HISTORY',
      subtitle: '60+ years of comic milestones',
      badge: 'TIMELINE',
      page: 'canon',
      image: GAME_THUMB_FACT_ATTACK,
      buttonText: 'OPEN TIMELINE 🕸️',
    },
  ],
};

export const SpideyChatDrawer: React.FC<SpideyChatDrawerProps> = ({
  isOpen,
  onClose,
  onOpen,
  onNavigatePage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeCategory, setActiveCategory] = useState<TopicCategory>('all');
  const [sfxMuted, setSfxMuted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [tingleBurst, setTingleBurst] = useState(false);

  const { userProfile } = useSpiderAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on message update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  const playSfx = (name: 'thwip' | 'spider-sense' | 'click' | 'correct' | 'bam') => {
    if (!sfxMuted) {
      playSound(name);
    }
  };

  // Periodic 'THWIP!' sound effect while Gemini is thinking/loading
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isLoading && !sfxMuted) {
      playSfx('thwip');
      timer = setInterval(() => {
        playSfx('thwip');
      }, 1100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading, sfxMuted]);

  // Contextual helper to attach action cards when games/archives are mentioned
  const extractRichCards = (text: string): RichCardPreview[] => {
    const cards: RichCardPreview[] = [];
    const lower = text.toLowerCase();

    if (lower.includes('web swing') || (lower.includes('swing') && lower.includes('arcade'))) {
      cards.push({
        type: 'web_swing',
        title: 'WEB SWING ARCADE',
        subtitle: 'Can you stay airborne past 2,000m?',
        badge: 'ARCADE',
        page: 'arcade',
        image: GAME_THUMB_WEB_THROWER,
        buttonText: 'PLAY WEB SWING 🎮',
      });
    }

    if (lower.includes('spider-sense reaction') || (lower.includes('reflex') && lower.includes('dodge'))) {
      cards.push({
        type: 'spider_sense',
        title: 'SPIDER-SENSE REACTION',
        subtitle: 'Test millisecond reflexes against villains',
        badge: 'REFLEX TEST',
        page: 'arcade',
        image: GAME_THUMB_SPIDER_SENSE,
        buttonText: 'TEST REFLEXES ⚡',
      });
    }

    if (lower.includes('web of history') || lower.includes('canon archive') || lower.includes('timeline')) {
      cards.push({
        type: 'canon_timeline',
        title: 'WEB OF HISTORY',
        subtitle: 'Explore 60+ years of comic chronology',
        badge: 'CANON ARCHIVE',
        page: 'canon',
        image: GAME_THUMB_FACT_ATTACK,
        buttonText: 'OPEN TIMELINE 🕸️',
      });
    }

    if (lower.includes('achievement') || lower.includes('vault') || lower.includes('badge')) {
      cards.push({
        type: 'vault',
        title: 'BADGES VAULT',
        subtitle: 'Inspect unlocked Spider-Verse trophies',
        badge: 'TROPHY ROOM',
        page: 'vault',
        buttonText: 'VIEW ACHIEVEMENTS 🏆',
      });
    }

    return cards.slice(0, 2);
  };

  // Pure open-ended Gemini conversation dispatcher
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if (!textToSend || isLoading) return;

    playSfx('thwip');

    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Prepare full conversation history for context awareness
    const historyPayload = messages
      .filter((m) => !m.isError && m.text.trim())
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          userStats: userProfile
            ? {
                displayName: userProfile.displayName,
                totalXP: userProfile.totalXP,
                totalScore: userProfile.totalScore,
                currentStreak: userProfile.currentStreak,
                bestStreak: userProfile.bestStreak,
                factsDiscovered: userProfile.factsDiscovered,
                achievementsUnlocked: userProfile.achievementsUnlocked,
              }
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.reply) {
        throw new Error(data?.error || 'Empty reply received from Gemini API');
      }

      playSfx('spider-sense');

      const spideyMsg: ChatMessage = {
        id: `spd-${Date.now()}`,
        sender: 'spidey',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        richCards: extractRichCards(data.reply),
      };

      setMessages((prev) => [...prev, spideyMsg]);
    } catch (err: any) {
      console.error('Gemini chat request error:', err);
      playSfx('bam');

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'spidey',
        text: '🕷️ SPIDER-SENSE INTERRUPTED\n\n"My web connection just snapped. Give me another shot."',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        retryPrompt: textToSend,
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    playSfx('click');
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddReaction = (msgId: string, type: 'thwip' | 'bam') => {
    playSfx(type === 'thwip' ? 'correct' : 'bam');
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, reaction: m.reaction === type ? null : type } : m
      )
    );
  };

  const handleSpiderSenseTingle = () => {
    setTingleBurst(true);
    playSfx('spider-sense');
    setTimeout(() => setTingleBurst(false), 800);
    handleSendMessage('Tell me what your spider-sense is tingling about right now!');
  };

  const filteredChips =
    activeCategory === 'all'
      ? TOPIC_CHIPS
      : TOPIC_CHIPS.filter((c) => c.category === activeCategory);

  return (
    <>
      {/* ================================================== */}
      {/* FLOATING ACTION TRIGGER DOCK                       */}
      {/* ================================================== */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => {
            playSfx('thwip');
            if (isOpen) {
              onClose();
            } else {
              onOpen();
            }
          }}
          className={`group relative p-2 pr-4 bg-gradient-to-r from-[#dc2626] via-[#b8121d] to-[#991b1b] text-white border-3 border-[#1b1b20] rounded-full ink-shadow-lg flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer ${
            tingleBurst ? 'ring-4 ring-[#facc15] scale-110' : ''
          }`}
          title="Chat with Spidey - Open-Ended AI Companion"
          aria-label="Open Spidey AI Chatbot"
        >
          {/* Spidey Emblem with Radar Waves */}
          <div className="relative w-9 h-9 rounded-full bg-white border-2 border-[#1b1b20] flex items-center justify-center overflow-hidden flex-shrink-0">
            <SpiderSenseRadarBadge className="w-8 h-8 group-hover:rotate-6 transition-transform" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] border border-[#1b1b20] rounded-full animate-ping" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] border border-[#1b1b20] rounded-full" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-comic text-xs font-black uppercase text-[#ffdf9f] tracking-wide group-hover:text-white">
                🕷️ SPIDEY AI
              </span>
              <span className="bg-[#22c55e] text-[#1b1b20] font-mono text-[8px] font-black px-1 py-0.2 rounded-xs uppercase">
                GEMINI
              </span>
            </div>
            <div className="font-comic text-[10px] font-bold text-white/95 uppercase leading-tight mt-0.5">
              FACT CHECKER & LORE
            </div>
          </div>
        </button>
      </div>

      {/* ================================================== */}
      {/* COMIC CHAT WINDOW (PURE GEMINI AI)                 */}
      {/* ================================================== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-4 bg-[#1b1b20]/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className={`w-full bg-[#fbf9f4] border-4 border-[#1b1b20] ink-shadow-2xl flex flex-col transition-all duration-200 sm:rounded-none relative overflow-hidden ${
              isMaximized
                ? 'sm:max-w-4xl h-[94vh] max-h-[94vh]'
                : 'sm:max-w-md md:max-w-lg h-[90vh] sm:h-[630px] max-h-[90vh]'
            }`}
          >
            {/* 1. TOP COMIC BOOK HEADER */}
            <div className="bg-gradient-to-r from-[#dc2626] via-[#b8121d] to-[#991b1b] text-white p-2.5 sm:p-3 border-b-3 border-[#1b1b20] flex items-center justify-between select-none relative z-10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div
                  onClick={handleSpiderSenseTingle}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-[#1b1b20] flex items-center justify-center overflow-hidden flex-shrink-0 ink-shadow-sm cursor-pointer hover:rotate-6 transition-all ${
                    tingleBurst ? 'ring-4 ring-[#facc15] scale-110' : ''
                  }`}
                  title="Click to trigger Spider-Sense pulse!"
                >
                  <SpiderSenseRadarBadge className="w-8 h-8 sm:w-9 sm:h-9" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 leading-none">
                    <h3 className="font-comic text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-1">
                      <span>🕷️ SPIDEY</span>
                    </h3>
                    <span className="bg-[#facc15] text-[#1b1b20] font-comic text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 border border-[#1b1b20] uppercase">
                      GEMINI AI
                    </span>
                  </div>
                  <div className="font-comic text-[10px] sm:text-[11px] font-black text-[#ffdf9f] uppercase tracking-wide mt-0.5 line-clamp-1">
                    “YOUR FRIENDLY NEIGHBORHOOD AI”
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block animate-pulse" />
                    <span className="font-mono text-[8px] sm:text-[9px] font-bold text-white/90 uppercase tracking-widest">
                      🟢 SPIDER-SENSE ONLINE
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-1">
                {/* Spider-Sense Tingle Button */}
                <button
                  type="button"
                  onClick={handleSpiderSenseTingle}
                  className="hidden xs:flex p-1 sm:p-1.5 bg-[#facc15] hover:bg-[#eab308] text-[#1b1b20] border-2 border-[#1b1b20] items-center gap-1 font-comic text-[9px] sm:text-[10px] font-black uppercase transition-all ink-btn cursor-pointer"
                  title="Trigger Spider-Sense Alert"
                >
                  <Zap className="w-3 h-3 fill-current" />
                  <span>TINGLE!</span>
                </button>

                {/* SFX Mute/Unmute */}
                <button
                  type="button"
                  onClick={() => setSfxMuted(!sfxMuted)}
                  className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-[#1b1b20] border border-white/40 transition-colors ink-btn cursor-pointer"
                  title={sfxMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {sfxMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                {/* Clear Chat */}
                <button
                  type="button"
                  onClick={() => {
                    playSfx('click');
                    setMessages([INITIAL_WELCOME]);
                  }}
                  className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-[#1b1b20] border border-white/40 transition-colors ink-btn cursor-pointer"
                  title="Clear Conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Expand / Minimize Window */}
                <button
                  type="button"
                  onClick={() => {
                    playSfx('click');
                    setIsMaximized(!isMaximized);
                  }}
                  className="hidden sm:block p-1.5 bg-white/20 hover:bg-white text-white hover:text-[#1b1b20] border border-white/40 transition-colors ink-btn cursor-pointer"
                  title={isMaximized ? 'Restore Size' : 'Maximize Window'}
                >
                  {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    playSfx('click');
                    onClose();
                  }}
                  className="p-1.5 bg-[#facc15] hover:bg-[#ef4444] text-[#1b1b20] hover:text-white border-2 border-[#1b1b20] font-black transition-colors ink-btn cursor-pointer"
                  title="Close Spidey Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. QUICK ACTIONS HORIZONTAL SCROLL AREA */}
            <div className="bg-[#fee2e2] border-b-2 border-[#1b1b20] px-2.5 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none touch-pan-x flex-shrink-0">
              <div className="flex items-center gap-1 text-[9px] font-comic font-black text-[#991b1b] uppercase whitespace-nowrap mr-0.5 flex-shrink-0">
                <Zap className="w-3 h-3 fill-[#dc2626] text-[#dc2626]" />
                <span>QUICK ACTIONS:</span>
              </div>
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (action.page) {
                      playSfx('thwip');
                      onNavigatePage(action.page);
                      onClose();
                    } else if (action.query) {
                      handleSendMessage(action.query);
                    }
                  }}
                  disabled={isLoading}
                  className={`${action.bg} hover:brightness-95 active:scale-95 disabled:opacity-50 text-[#1b1b20] border-2 border-[#1b1b20] px-2.5 py-1 text-[10px] font-comic font-black uppercase whitespace-nowrap ink-shadow-xs flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0`}
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                  <span className="bg-[#1b1b20] text-white text-[7px] px-1 py-0.2 rounded-xs font-mono font-bold">
                    {action.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* 3. TOPIC CATEGORY FILTER TABS */}
            <div className="bg-[#eae7ee] border-b-2 border-[#1b1b20] px-2.5 py-1 flex items-center gap-1 overflow-x-auto scrollbar-none select-none touch-pan-x flex-shrink-0">
              {(['all', 'prompts', 'games', 'canon', 'villains'] as TopicCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    playSfx('click');
                    setActiveCategory(cat);
                  }}
                  className={`font-comic text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 border-2 transition-all cursor-pointer whitespace-nowrap ink-btn flex-shrink-0 ${
                    activeCategory === cat
                      ? 'bg-[#1b1b20] text-white border-[#1b1b20] ink-shadow-xs'
                      : 'bg-white text-[#1b1b20] border-transparent hover:border-[#1b1b20]'
                  }`}
                >
                  {cat === 'all' && '🔥 ALL TOPICS'}
                  {cat === 'prompts' && '⚡ QUICK PROMPTS'}
                  {cat === 'games' && '🎮 ARCADE'}
                  {cat === 'canon' && '🕸️ CANON'}
                  {cat === 'villains' && '😈 VILLAINS'}
                </button>
              ))}
            </div>

            {/* 4. CHAT MESSAGES CANVAS */}
            <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2.5 sm:space-y-3 comic-halftone-grid">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Compact Sender Header */}
                  <div className="flex items-center gap-1 mb-0.5 px-1 text-[9px] sm:text-[10px] font-comic font-black uppercase text-[#5b403d]">
                    {msg.sender === 'user' ? (
                      <>
                        <span>YOU</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <SpiderBotGuide className="w-3 h-3" />
                        <span className="text-[#dc2626]">SPIDEY</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </>
                    )}
                  </div>

                  {/* Compact Message Bubble */}
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] px-3 py-2 sm:px-3.5 sm:py-2.5 border-2 border-[#1b1b20] ink-shadow-sm relative leading-snug ${
                      msg.sender === 'user'
                        ? 'bg-[#dc2626] text-white font-bold rounded-xl rounded-tr-none'
                        : msg.isError
                        ? 'bg-[#fee2e2] text-[#991b1b] font-medium rounded-xl rounded-tl-none border-l-4 border-l-[#ef4444]'
                        : 'bg-[#fffdf0] text-[#1b1b20] font-medium rounded-xl rounded-tl-none border-l-4 border-l-[#b8121d]'
                    }`}
                  >
                    {/* Error State with Try Again Button */}
                    {msg.isError ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 font-comic text-xs font-black uppercase text-[#dc2626]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>SPIDER-SENSE INTERRUPTED</span>
                        </div>
                        <p className="text-xs font-medium text-[#1b1b20]">
                          "My web connection just snapped. Give me another shot."
                        </p>
                        {msg.retryPrompt && (
                          <button
                            type="button"
                            onClick={() => handleSendMessage(msg.retryPrompt)}
                            disabled={isLoading}
                            className="bg-[#dc2626] hover:bg-[#b8121d] text-white border border-[#1b1b20] px-3 py-1 font-comic text-[10px] font-black uppercase flex items-center gap-1.5 ink-shadow-xs transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>TRY AGAIN</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      /* Standard Message Text */
                      <div className="whitespace-pre-line text-xs sm:text-[13px] font-sans space-y-1.5 sm:space-y-2">
                        {msg.text.split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="leading-snug">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Compact Embedded Action Cards */}
                    {msg.richCards && msg.richCards.length > 0 && !msg.isError && (
                      <div className="mt-2 pt-2 border-t border-[#1b1b20]/20 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {msg.richCards.map((card, cardIdx) => (
                          <div
                            key={cardIdx}
                            className="bg-white border border-[#1b1b20] p-2 ink-shadow-xs flex flex-col justify-between hover:bg-[#fffdf0] transition-colors"
                          >
                            <div className="flex items-start gap-1.5 mb-1.5">
                              {card.image && (
                                <img
                                  src={card.image}
                                  alt={card.title}
                                  className="w-8 h-8 object-cover border border-[#1b1b20] flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0">
                                <span className="bg-[#dc2626] text-white font-comic text-[7px] font-black px-1 py-0.2 border border-[#1b1b20] uppercase">
                                  {card.badge}
                                </span>
                                <h4 className="font-comic text-[11px] font-black uppercase text-[#1b1b20] leading-tight truncate mt-0.5">
                                  {card.title}
                                </h4>
                                <p className="text-[9px] text-[#5b403d] leading-tight line-clamp-1">
                                  {card.subtitle}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                playSfx('thwip');
                                onNavigatePage(card.page);
                                onClose();
                              }}
                              className="w-full bg-[#ffdf9f] hover:bg-[#facc15] text-[#1b1b20] border border-[#1b1b20] py-0.5 font-comic text-[9px] sm:text-[10px] font-black uppercase flex items-center justify-center gap-1 ink-btn transition-transform active:scale-95 cursor-pointer"
                            >
                              <span>{card.buttonText}</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Compact Footer (Copy & Reactions) */}
                    {msg.sender === 'spidey' && !msg.isError && (
                      <div className="mt-1.5 pt-1.5 border-t border-[#1b1b20]/15 flex items-center justify-between text-[9px]">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleAddReaction(msg.id, 'thwip')}
                            className={`px-1.5 py-0.5 border text-[9px] font-comic font-black uppercase transition-all cursor-pointer ${
                              msg.reaction === 'thwip'
                                ? 'bg-[#22c55e] text-white border-[#1b1b20]'
                                : 'bg-white hover:bg-gray-100 text-[#1b1b20] border-gray-300'
                            }`}
                          >
                            THWIP! 👍
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddReaction(msg.id, 'bam')}
                            className={`px-1.5 py-0.5 border text-[9px] font-comic font-black uppercase transition-all cursor-pointer ${
                              msg.reaction === 'bam'
                                ? 'bg-[#dc2626] text-white border-[#1b1b20]'
                                : 'bg-white hover:bg-gray-100 text-[#1b1b20] border-gray-300'
                            }`}
                          >
                            BAM! 💥
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="flex items-center gap-1 text-[#5b403d] hover:text-[#1b1b20] font-comic font-bold uppercase transition-colors cursor-pointer"
                          title="Copy quote"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-[#16a34a]" />
                              <span className="text-[#16a34a]">COPIED!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span>COPY</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* 5. THINKING / LOADING STATE (As Specified in Prompt Requirement 11) */}
              {isLoading && (
                <div className="flex flex-col items-start animate-in fade-in duration-200">
                  <div className="flex items-center gap-1 mb-0.5 px-1 text-[9px] font-comic font-black uppercase text-[#dc2626]">
                    <Zap className="w-3 h-3 fill-[#facc15] text-[#facc15] animate-bounce" />
                    <span>🕷️ SPIDEY IS THINKING...</span>
                  </div>

                  <div className="px-3.5 py-2.5 bg-[#fffdf0] border-2 border-[#1b1b20] border-l-4 border-l-[#b8121d] rounded-xl rounded-tl-none ink-shadow-sm flex flex-col gap-1">
                    <div className="font-comic text-xs font-black text-[#1b1b20] tracking-wider flex items-center gap-1.5">
                      <span className="text-[#dc2626] animate-pulse">THWIP...</span>
                      <span className="text-[#b8121d] animate-pulse [animation-delay:250ms]">THWIP...</span>
                      <span className="text-[#991b1b] animate-pulse [animation-delay:500ms]">THWIP...</span>
                    </div>
                    <div className="flex gap-1 items-center mt-0.5">
                      <span className="w-2 h-2 bg-[#dc2626] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-[#facc15] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-[#2563eb] rounded-full animate-bounce" />
                      <span className="font-comic text-[10px] font-bold text-[#5b403d] ml-1">
                        Webbing up response from Gemini...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 6. FILTERED TOPIC CHIPS SLIDER */}
            <div className="bg-[#f0edf5] border-t-2 border-[#1b1b20] p-1.5 sm:p-2 overflow-x-auto scrollbar-none flex gap-1.5 select-none relative z-10 touch-pan-x flex-shrink-0">
              {filteredChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip.query)}
                  disabled={isLoading}
                  className="bg-white hover:bg-[#ffdf9f] active:scale-95 text-[#1b1b20] border-2 border-[#1b1b20] px-2.5 py-1 text-[10px] font-comic font-black uppercase whitespace-nowrap ink-shadow-xs transition-transform disabled:opacity-50 cursor-pointer flex-shrink-0"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* 7. OPEN-ENDED INPUT BAR */}
            <div className="p-2 sm:p-2.5 bg-white border-t-3 border-[#1b1b20] flex gap-1.5 sm:gap-2 items-center relative z-10 flex-shrink-0">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask Spidey anything: canon lore, powers, game tips, math, jokes..."
                disabled={isLoading}
                className="flex-1 bg-[#fffdf0] border-2 border-[#1b1b20] px-3 py-2 text-xs sm:text-sm font-sans font-medium text-[#1b1b20] focus:outline-hidden focus:border-[#dc2626] focus:bg-white placeholder:text-gray-400 rounded-xs resize-none max-h-24 overflow-y-auto"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                className="bg-[#dc2626] hover:bg-[#b8121d] text-white border-2 border-[#1b1b20] px-3.5 sm:px-4 py-2 font-comic text-xs font-black uppercase ink-shadow-sm flex items-center gap-1 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer rounded-xs flex-shrink-0"
                title="Send message to Gemini"
                aria-label="Send message"
              >
                <Send className="w-3 h-3" />
                <span>THWIP!</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
