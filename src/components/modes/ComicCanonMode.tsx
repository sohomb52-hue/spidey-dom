import React, { useState } from 'react';
import { canonEntries } from '../../data/triviaData';
import { BookOpen, Zap, Music, Shield, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';
import { LikeButton } from '../common/LikeButton';

export const ComicCanonMode: React.FC<{ onTriggerWeb: (e: React.MouseEvent) => void }> = ({
  onTriggerWeb
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = canonEntries.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.universe === activeFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'bolt':
        return <Zap className="w-4 h-4 text-[#006398]" />;
      case 'music':
        return <Music className="w-4 h-4 text-[#765700]" />;
      case 'shield':
        return <Shield className="w-4 h-4 text-[#b8121d]" />;
      default:
        return <BookOpen className="w-4 h-4 text-[#b8121d]" />;
    }
  };

  const getUniverseColor = (uni: string) => {
    switch (uni) {
      case '616':
        return 'bg-[#b8121d] text-white';
      case '1610':
        return 'bg-[#006398] text-white';
      case '65':
        return 'bg-[#ffdf9f] text-[#261a00]';
      case '928':
        return 'bg-[#765700] text-white';
      case '199999':
        return 'bg-[#dc3132] text-white';
      default:
        return 'bg-[#1b1b20] text-white';
    }
  };

  const filters = [
    { id: 'all', label: 'ALL' },
    { id: '616', label: 'Earth-616' },
    { id: '1610', label: 'Earth-1610 (Miles)' },
    { id: '65', label: 'Earth-65 (Gwen)' },
    { id: '928', label: 'Earth-928 (2099)' },
    { id: '199999', label: 'MCU' }
  ];

  return (
    <section className="space-y-4 preserve-3d">
      <div
        className="border-4 sm:border-6 border-[#1b1b20] bg-white p-4 sm:p-6 depth-shadow-comic animate-panel-enter"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-3 border-[#1b1b20] pb-3 gap-3 mb-6">
          <div>
            <span className="font-comic text-[11px] font-black text-[#b8121d] uppercase bg-[#ffdad6] px-2 py-0.5 border border-[#1b1b20] ink-shadow-sm">
              MULTIVERSE REPOSITORY
            </span>
            <h3 className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20] mt-1">
              CANONICAL CONTINUITY ARCHIVES
            </h3>
          </div>

          {/* Continuity Filter Buttons */}
          <div className="flex flex-wrap gap-1.5 preserve-3d">
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={(e) => {
                    playSound('click');
                    onTriggerWeb(e);
                    setActiveFilter(f.id);
                  }}
                  className={`px-3 py-1.5 text-xs font-comic font-black uppercase border-2 border-[#1b1b20] ink-btn cursor-pointer transition-transform ${
                    isActive
                      ? 'bg-[#1b1b20] text-white depth-shadow-comic translate-y-[-1px]'
                      : 'bg-[#eae7ee] text-[#1b1b20] hover:bg-[#cce5ff]'
                  }`}
                  style={{ transform: isActive ? 'translateZ(8px)' : undefined }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Grid of Lore Cards with Illustrations and Like Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 preserve-3d">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="border-3 border-[#1b1b20] bg-[#f0ecf4] p-4 depth-shadow-comic flex flex-col justify-between hover:translate-y-[-4px] transition-transform duration-200"
              style={{ transform: `translateZ(${10 + (idx % 3) * 4}px)` }}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`font-comic text-[10px] font-black px-1.5 py-0.5 border border-[#1b1b20] uppercase ${getUniverseColor(
                      item.universe
                    )}`}
                  >
                    {item.universeLabel}
                  </span>
                  <span className="font-mono text-xs text-[#5b403d] font-bold">
                    {item.year}
                  </span>
                </div>

                {/* Comic Continuity Illustration */}
                <div className="border-2 border-[#1b1b20] overflow-hidden mb-2 bg-white depth-shadow-comic">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-36 object-cover filter contrast-105 hover:scale-105 transition-transform duration-300"
                  />
                  {/* Like Button directly below the comic illustration */}
                  <div className="p-1.5 bg-white border-t-2 border-[#1b1b20] flex justify-between items-center">
                    <span className="text-[10px] font-comic font-black text-[#5b403d] uppercase">
                      COMIC COVER ART
                    </span>
                    <LikeButton
                      id={`canon-img-${item.id}`}
                      initialLikes={450 + parseInt(item.year, 10)}
                      label="LIKE ART"
                      compact
                    />
                  </div>
                </div>

                <h4 className="font-comic text-base sm:text-lg font-black uppercase text-[#1b1b20]">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#5b403d] font-semibold mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1b1b20] mt-3 flex justify-between items-center text-xs font-comic font-black">
                <span className="text-[#006398]">{item.keyIssue}</span>
                {getIcon(item.iconType)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
