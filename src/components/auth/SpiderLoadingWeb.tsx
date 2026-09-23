/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const SpiderLoadingWeb: React.FC<{ message?: string }> = ({
  message = 'CONNECTING TO THE SPIDER-VERSE...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
      <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
        {/* Animated Web Radar Rings */}
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#dc2626] animate-spin [animation-duration:8s]" />
        <div className="absolute inset-2 rounded-full border-2 border-[#006398]/60 animate-ping [animation-duration:2s]" />
        <div className="absolute inset-4 rounded-full border-2 border-[#1b1b20] bg-white flex items-center justify-center ink-shadow-sm">
          <span className="text-2xl animate-bounce">🕷️</span>
        </div>
      </div>
      <div className="font-comic text-lg sm:text-xl font-black text-[#1b1b20] uppercase tracking-wider">
        {message}
      </div>
      <p className="font-mono text-xs text-[#5b403d] font-bold mt-1 uppercase">
        Consulting the Web of Life & Destiny...
      </p>
    </div>
  );
};
