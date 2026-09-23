/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { playSound } from '../../utils/audio';
import { ShieldAlert, ArrowRight, UserPlus, X, Play } from 'lucide-react';

interface SpiderGuestPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onContinueAsGuest: () => void;
}

export const SpiderGuestPromptModal: React.FC<SpiderGuestPromptModalProps> = ({
  isOpen,
  onClose,
  onGoToLogin,
  onGoToRegister,
  onContinueAsGuest
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-prompt-title"
      className="fixed inset-0 z-50 bg-[#1b1b20]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-[#fffbf0] border-4 border-[#1b1b20] max-w-lg w-full ink-shadow-xl relative overflow-hidden">
        {/* Halftone Texture Overlay */}
        <div className="comic-halftone absolute inset-0 opacity-15 pointer-events-none" />

        {/* Top Header */}
        <div className="bg-[#dc2626] text-white py-2 px-4 border-b-4 border-[#1b1b20] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white text-[#dc2626] text-[10px] font-comic font-black px-1.5 py-0.5 border border-[#1b1b20] uppercase">
              SECURITY DISPATCH
            </span>
            <span className="font-comic text-xs font-black uppercase tracking-wider">
              SPIDER-VERSE ID REQUIRED
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="text-white hover:text-[#f9bd22] cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 relative z-10 text-center">
          <div className="w-14 h-14 mx-auto mb-3 bg-[#fee2e2] border-3 border-[#1b1b20] rounded-full flex items-center justify-center ink-shadow-sm">
            <ShieldAlert className="w-7 h-7 text-[#dc2626]" />
          </div>

          <h2
            id="guest-prompt-title"
            className="font-comic text-2xl font-black uppercase text-[#1b1b20] tracking-tight mb-2"
          >
            YOUR SPIDER-SENSE NEEDS AN ID.
          </h2>

          <p className="font-mono text-sm text-[#5b403d] font-bold max-w-md mx-auto mb-6">
            Log in to save your progress, achievements, discovered comic facts and global score rating to Cloud Firestore!
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => {
                playSound('thwip');
                onGoToLogin();
              }}
              className="py-3 bg-[#dc2626] hover:bg-[#b8121d] text-white border-2 border-[#1b1b20] font-comic text-sm font-black uppercase tracking-wider ink-shadow-sm ink-btn cursor-pointer flex items-center justify-center gap-2"
            >
              <span>LOG IN</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('thwip');
                onGoToRegister();
              }}
              className="py-3 bg-[#f9bd22] hover:bg-[#e0a618] text-[#1b1b20] border-2 border-[#1b1b20] font-comic text-sm font-black uppercase tracking-wider ink-shadow-sm ink-btn cursor-pointer flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>CREATE ACCOUNT</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('click');
              onContinueAsGuest();
            }}
            className="font-comic text-xs font-black uppercase text-[#5b403d] hover:text-[#1b1b20] hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
          >
            <Play className="w-3.5 h-3.5" />
            <span>PLAY THIS ROUND AS UNTRACKED GUEST</span>
          </button>
        </div>
      </div>
    </div>
  );
};
