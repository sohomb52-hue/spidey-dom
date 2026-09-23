/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, X, Radio, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

export interface ComicToast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ComicFeedbackToastProps {
  toast: ComicToast | null;
  onDismiss: () => void;
}

export const ComicFeedbackToast: React.FC<ComicFeedbackToastProps> = ({
  toast,
  onDismiss
}) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] pointer-events-auto animate-in slide-in-from-bottom-4 duration-200"
    >
      <div
        className={`border-3 sm:border-4 border-[#1b1b20] p-3 sm:p-4 ink-shadow-md flex items-center justify-between gap-3 ${
          isSuccess
            ? 'bg-[#22c55e] text-white'
            : isError
            ? 'bg-[#dc2626] text-white'
            : 'bg-[#f9bd22] text-[#1b1b20]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 border-2 border-[#1b1b20] flex items-center justify-center font-comic font-black text-lg flex-shrink-0 ${
              isSuccess
                ? 'bg-white text-[#22c55e]'
                : isError
                ? 'bg-white text-[#dc2626]'
                : 'bg-[#1b1b20] text-[#f9bd22]'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            ) : isError ? (
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </div>

          <div>
            <span className="font-comic text-xs sm:text-sm font-black uppercase tracking-wider block leading-tight">
              {toast.title}
            </span>
            {toast.message && (
              <span className="font-sans text-[11px] sm:text-xs font-bold opacity-90 block leading-tight mt-0.5">
                {toast.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playSound('click');
            onDismiss();
          }}
          className="p-1 bg-[#1b1b20] text-white hover:bg-black border border-white/40 ink-btn cursor-pointer flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
