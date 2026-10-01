/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Search,
  ExternalLink,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ChevronDown,
  ChevronUp,
  Globe,
  Zap,
  AlertCircle
} from 'lucide-react';
import { playSound } from '../../utils/audio';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  sources?: GroundingSource[];
  searchQueries?: string[];
  isError?: boolean;
  retryPrompt?: string;
}

interface ChatBotWidgetProps {
  initialOpen?: boolean;
  userStats?: Record<string, any>;
  onNavigatePage?: (page: string) => void;
}

const QUICK_PROMPTS = [
  '⚡ What are the latest Spider-Man comic and movie news?',
  '🕸️ Explain the difference between Earth-616 and Earth-1610',
  '🧠 Give me a difficult Spider-Man trivia question',
];

export const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({
  initialOpen = false,
  userStats,
  onNavigatePage
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [hasUnread, setHasUnread] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-1',
        role: 'model',
        text: "Hey there, True Believer! 🕷️ I'm SPIDEY, your AI assistant with live Google Search Grounding. Ask me anything about comic canon, latest multiverse news, arcade strategies, or general knowledge!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [expandedSourcesMap, setExpandedSourcesMap] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      textareaRef.current?.focus();
    }
  }, [isOpen, messages, scrollToBottom]);

  // Handle Global Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        playSound('click');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Setup Web Speech API for Speech-to-Text
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      playSound('click');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Toggle sources accordion per message
  const toggleSources = (msgId: string) => {
    setExpandedSourcesMap((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
    playSound('click');
  };

  // Send message to backend /api/chat with Google Search Grounding
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInputValue('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    playSound('thwip');

    try {
      // Build turn history for server
      const historyPayload = messages.slice(-12).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          userStats,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || `Server error: ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.reply || 'Spider-Sense tingling, but received an empty transmission.';

      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: Array.isArray(data.sources) && data.sources.length > 0 ? data.sources : undefined,
        searchQueries: Array.isArray(data.searchQueries) && data.searchQueries.length > 0 ? data.searchQueries : undefined,
      };

      setMessages((prev) => [...prev, modelMessage]);
      playSound('correct');

      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err: any) {
      console.error('[ChatBotWidget] Chat error:', err);
      const errMsg = err?.message || 'Failed to reach Spidey AI network.';
      setErrorMessage(errMsg);

      const errorMessageObj: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: `⚡ Spider-Sense connection alert: ${errMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        retryPrompt: text,
      };

      setMessages((prev) => [...prev, errorMessageObj]);
      playSound('wrong');
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

  return (
    <div className="fixed bottom-6 right-6 z-50 font-comic select-none">
      {/* ================================================== */}
      {/* 1. FLOATING LAUNCHER BUTTON                        */}
      {/* ================================================== */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            playSound('thwip');
          }}
          className="relative bg-[#dc2626] hover:bg-[#b8121d] text-white p-4 rounded-full border-3 border-[#1b1b20] ink-shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer group"
          aria-label="Open Spidey AI Chat with Google Search Grounding"
        >
          <div className="relative">
            <MessageSquare className="w-7 h-7 fill-white text-white" />
            <Sparkles className="w-3.5 h-3.5 text-[#facc15] absolute -top-1.5 -right-1.5 animate-pulse" />
          </div>

          {/* Unread Badge Indicator */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 bg-[#facc15] text-[#1b1b20] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1b1b20] animate-bounce">
              !
            </span>
          )}

          {/* Hover Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#1b1b20] text-white text-xs font-black px-3 py-1 border border-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ink-shadow-xs uppercase">
            LIVE SEARCH AI CHAT
          </span>
        </button>
      )}

      {/* ================================================== */}
      {/* 2. ELEVATED CHAT PANEL MODAL                       */}
      {/* ================================================== */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[410px] h-[82vh] max-h-[620px] bg-[#fffbf0] border-4 border-[#1b1b20] ink-shadow-2xl flex flex-col justify-between overflow-hidden animate-in zoom-in duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#dc2626] via-[#b8121d] to-[#1e1b4b] text-white p-3.5 border-b-3 border-[#1b1b20] flex items-center justify-between relative overflow-hidden">
            <div className="comic-dots-red absolute inset-0 opacity-30 pointer-events-none" />
            <div className="relative z-10 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1b1b20] border-2 border-white flex items-center justify-center text-lg">
                🕷️
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black uppercase tracking-wide leading-none">
                    SPIDEY AI
                  </h3>
                  <span className="bg-[#facc15] text-[#1b1b20] text-[9px] font-black px-1.5 py-0.2 uppercase border border-[#1b1b20] flex items-center gap-0.5">
                    <Globe className="w-2.5 h-2.5" /> LIVE SEARCH
                  </span>
                </div>
                <p className="text-[10px] text-white/90 font-semibold mt-0.5">
                  Powered by Gemini 2.5 & Google Grounding
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  playSound('click');
                }}
                className="bg-[#1b1b20] hover:bg-[#2b2b32] text-white p-1.5 border border-white cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed Viewport */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-radial from-[#ffffff] via-[#fffbf0] to-[#fef3c7]/40 text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const hasSources = msg.sources && msg.sources.length > 0;
              const hasQueries = msg.searchQueries && msg.searchQueries.length > 0;
              const isExpanded = expandedSourcesMap[msg.id];

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender Tag & Timestamp */}
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className={`text-[10px] font-black uppercase ${isUser ? 'text-[#0284c7]' : 'text-[#dc2626]'}`}>
                      {isUser ? 'YOU' : 'SPIDEY'}
                    </span>
                    <span className="text-[9px] text-gray-400 font-sans">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] p-3 border-2 border-[#1b1b20] ink-shadow-xs text-xs sm:text-[13px] font-sans font-medium leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-[#0284c7] text-white rounded-tl-xl rounded-tr-sm rounded-bl-xl rounded-br-none'
                        : msg.isError
                        ? 'bg-[#fee2e2] text-[#991b1b] border-[#dc2626]'
                        : 'bg-white text-[#1b1b20] rounded-tl-sm rounded-tr-xl rounded-bl-none rounded-br-xl'
                    }`}
                  >
                    {msg.text}

                    {/* Inline Retry Button for errors */}
                    {msg.isError && msg.retryPrompt && (
                      <div className="mt-2 pt-2 border-t border-[#dc2626]/30">
                        <button
                          type="button"
                          onClick={() => handleSendMessage(msg.retryPrompt)}
                          className="bg-[#dc2626] hover:bg-[#b8121d] text-white px-2.5 py-1 font-comic text-[10px] font-black uppercase flex items-center gap-1 border border-[#1b1b20] ink-btn cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>RETRY QUESTION</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ================================================== */}
                  {/* GOOGLE SEARCH GROUNDING & CITATIONS DISPLAY        */}
                  {/* ================================================== */}
                  {!isUser && (hasSources || hasQueries) && (
                    <div className="mt-1.5 max-w-[90%] space-y-1">
                      {/* Search Queries Chip */}
                      {hasQueries && (
                        <div className="flex flex-wrap gap-1 items-center text-[10px] font-comic font-black text-[#5b403d] bg-[#fef08a] px-2 py-0.5 border border-[#1b1b20]/40">
                          <Search className="w-3 h-3 text-[#dc2626]" />
                          <span>SEARCHED:</span>
                          <span className="italic font-sans text-gray-700">
                            "{msg.searchQueries?.join(', ')}"
                          </span>
                        </div>
                      )}

                      {/* Collapsible Sources Pill */}
                      {hasSources && (
                        <div className="bg-white border-2 border-[#1b1b20] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleSources(msg.id)}
                            className="w-full bg-[#f8fafc] hover:bg-gray-100 p-1.5 px-2.5 flex items-center justify-between text-[10px] font-comic font-black text-[#1b1b20] uppercase cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5 text-[#0284c7]">
                              <Globe className="w-3 h-3" />
                              <span>LIVE WEB SOURCES ({msg.sources?.length})</span>
                            </span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          {isExpanded && (
                            <div className="p-2 space-y-1.5 border-t border-gray-200 bg-white">
                              {msg.sources?.map((src, idx) => (
                                <a
                                  key={idx}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between gap-2 p-1.5 bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#0284c7]/30 text-[11px] font-sans text-[#0369a1] font-semibold transition-colors group"
                                >
                                  <span className="truncate max-w-[240px]">
                                    {src.title || src.url}
                                  </span>
                                  <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Live Loading State */}
            {isLoading && (
              <div className="flex flex-col items-start animate-in fade-in duration-150">
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-black uppercase text-[#dc2626]">
                    SPIDEY
                  </span>
                  <span className="text-[9px] text-[#0284c7] font-comic font-bold flex items-center gap-1 animate-pulse">
                    <Search className="w-2.5 h-2.5" /> SEARCHING LIVE WEB & COMPUTING...
                  </span>
                </div>
                <div className="bg-white border-2 border-[#1b1b20] p-3 rounded-tl-sm rounded-tr-xl rounded-bl-none rounded-br-xl flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#dc2626] rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-[#0284c7] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-[#facc15] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Start Prompt Suggestions */}
          {messages.length <= 2 && !isLoading && (
            <div className="p-2 bg-[#fef08a]/60 border-t-2 border-[#1b1b20] space-y-1.5">
              <span className="text-[10px] font-black text-[#5b403d] uppercase block px-1">
                💡 TRY ASKING:
              </span>
              <div className="flex flex-col gap-1">
                {QUICK_PROMPTS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="text-left bg-white hover:bg-[#fffdf0] text-[#1b1b20] border border-[#1b1b20] p-1.5 px-2 text-[10px] font-comic font-bold transition-all hover:translate-x-1 cursor-pointer truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar & Controls */}
          <div className="p-3 bg-white border-t-3 border-[#1b1b20] space-y-2">
            <div className="relative flex items-center gap-1.5">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Spidey anything with live Google search..."
                rows={1}
                maxLength={4000}
                disabled={isLoading}
                className="flex-1 resize-none bg-[#f8fafc] border-2 border-[#1b1b20] p-2 pr-16 text-xs font-sans text-[#1b1b20] focus:outline-none focus:bg-white focus:border-[#dc2626] max-h-24 leading-normal"
              />

              <div className="absolute right-2 flex items-center gap-1">
                {/* Speech to text mic button */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  disabled={isLoading}
                  title={isListening ? 'Stop voice input' : 'Speak message'}
                  className={`p-1.5 rounded-none border border-[#1b1b20] cursor-pointer transition-colors ${
                    isListening
                      ? 'bg-[#dc2626] text-white animate-pulse'
                      : 'bg-white hover:bg-gray-100 text-[#1b1b20]'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-[#dc2626] hover:bg-[#b8121d] disabled:opacity-40 text-white p-1.5 border border-[#1b1b20] ink-btn cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-gray-500 font-sans px-1">
              <span>Press <strong className="text-[#1b1b20]">Enter</strong> to send • <strong className="text-[#1b1b20]">Shift + Enter</strong> for newline</span>
              <span>{inputValue.length}/4000</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
