import React from 'react';
import { GameMode } from '../types';

interface ModeNavigationProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

export const ModeNavigation: React.FC<ModeNavigationProps> = ({ currentMode, onSelectMode }) => {
  const tabs: { id: GameMode; label: string; icon: string; isVault?: boolean }[] = [
    { id: 'tf', label: '1. FACT ATTACK', icon: '⚡' },
    { id: 'mcq', label: '2. WEB OF KNOWLEDGE', icon: '🕸️' },
    { id: 'clues', label: '3. WHO IS IT?', icon: '🎭' },
    { id: 'who_said_it', label: '4. WHO SAID IT?', icon: '💬' },
    { id: 'speed', label: '5. SPIDER-SENSE', icon: '⏱️' },
    { id: 'canon', label: '6. COMIC CANON', icon: '📚' },
    { id: 'badges', label: 'VAULT', icon: '🏆' },
    { id: 'profile', label: 'DOSSIER', icon: '👤', isVault: true }
  ];

  return (
    <nav aria-label="Game Mode Tabs" className="flex flex-wrap gap-2 border-b-4 border-[#1b1b20] pb-3">
      {tabs.map((tab) => {
        const isActive = currentMode === tab.id;
        const baseClass = tab.isVault ? 'ml-auto' : '';

        let colorClass = 'bg-[#eae7ee] text-[#1b1b20] hover:bg-[#cce5ff]';
        if (tab.isVault) {
          colorClass = isActive
            ? 'bg-[#f9bd22] text-[#261a00]'
            : 'bg-[#ffdf9f] text-[#261a00] hover:bg-[#f9bd22]';
        } else if (isActive) {
          colorClass = 'bg-[#b8121d] text-white';
        }

        return (
          <button
            key={tab.id}
            onClick={() => onSelectMode(tab.id)}
            className={`font-comic text-xs sm:text-sm uppercase px-3 py-1.5 border-3 border-[#1b1b20] ink-shadow-sm font-black ink-btn flex items-center gap-1.5 ${colorClass} ${baseClass}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
