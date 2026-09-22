import React from 'react';
import { BadgeItem } from '../../types';

interface BadgesVaultModeProps {
  badges: BadgeItem[];
}

export const BadgesVaultMode: React.FC<BadgesVaultModeProps> = ({ badges }) => {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <section className="space-y-4 preserve-3d" id="badges-section">
      <div
        className="border-4 sm:border-6 border-[#1b1b20] bg-white p-4 sm:p-6 depth-shadow-comic animate-panel-enter"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex flex-wrap items-center justify-between border-b-3 border-[#1b1b20] pb-3 mb-6 gap-2">
          <div>
            <span className="bg-[#765700] text-white font-comic text-xs font-black px-2 py-0.5 uppercase ink-shadow-sm">
              COLLECTOR CARD DECK
            </span>
            <h3 className="font-comic text-xl sm:text-2xl font-black uppercase text-[#1b1b20] mt-1">
              YOUR UNLOCKED MULTIVERSE BADGES
            </h3>
          </div>
          <span className="bg-[#eae7ee] px-3 py-1 font-comic text-xs sm:text-sm font-black border-2 border-[#1b1b20] ink-shadow-sm">
            {unlockedCount} OF {badges.length} ACHIEVED!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 preserve-3d">
          {badges.map((badge, idx) => (
            <div
              key={badge.id}
              className="border-3 border-[#1b1b20] bg-white p-4 depth-shadow-comic text-center flex flex-col items-center justify-between hover:translate-y-[-6px] transition-all duration-200 cursor-pointer"
              style={{ transform: `translateZ(${10 + (idx % 5) * 3}px)` }}
            >
              <div
                className={`w-16 h-16 rounded-full ${badge.colorBg} border-3 border-[#1b1b20] flex items-center justify-center text-3xl mb-2 ink-shadow-sm`}
              >
                {badge.emoji}
              </div>
              <h4 className="font-comic text-sm font-black uppercase text-[#1b1b20]">
                {badge.name}
              </h4>
              <p className="text-xs text-[#5b403d] font-semibold mt-1">
                {badge.description}
              </p>
              <span className="mt-3 text-[10px] font-comic font-black uppercase bg-[#b8121d] text-white px-2 py-0.5 border border-[#1b1b20] ink-shadow-sm">
                UNLOCKED
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
