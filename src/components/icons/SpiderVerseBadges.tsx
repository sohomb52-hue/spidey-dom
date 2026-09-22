import React from 'react';

/**
 * Image 5 & 6: SPIDER-VERSE FACT ATTACK! #01 Badge
 */
export const SpiderVerseLogoBadge: React.FC<{ className?: string }> = ({ className = 'h-10' }) => {
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 280 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-w-full drop-shadow-[2px_2px_0px_#1b1b20]"
      >
        {/* Outer Red Badge Container with thick black border */}
        <rect
          x="3"
          y="3"
          width="274"
          height="78"
          rx="10"
          fill="#E23636"
          stroke="#1b1b20"
          strokeWidth="6"
        />
        {/* Red light dot top left */}
        <circle cx="25" cy="18" r="4" fill="#ffffff" opacity="0.75" />

        {/* Left White Circular Spider Emblem */}
        <circle cx="48" cy="42" r="26" fill="#ffffff" stroke="#1b1b20" strokeWidth="4" />
        
        {/* Spider Body */}
        <ellipse cx="48" cy="43" rx="7" ry="11" fill="#E23636" stroke="#1b1b20" strokeWidth="3" />
        <circle cx="48" cy="30" r="4.5" fill="#1b1b20" />
        
        {/* Spider Legs */}
        {/* Left legs */}
        <path d="M42 35 C34 33 30 36 29 41" stroke="#1b1b20" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M41 41 C32 41 28 45 28 50" stroke="#1b1b20" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M42 46 C34 48 31 53 32 58" stroke="#1b1b20" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M43 51 C37 55 35 60 38 64" stroke="#1b1b20" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Right legs */}
        <path d="M54 35 C62 33 66 36 67 41" stroke="#1b1b20" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M55 41 C64 41 68 45 68 50" stroke="#1b1b20" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M54 46 C62 48 65 53 64 58" stroke="#1b1b20" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M53 51 C59 55 61 60 58 64" stroke="#1b1b20" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Text: SPIDER-VERSE */}
        <text
          x="84"
          y="35"
          fill="#ffffff"
          stroke="#1b1b20"
          strokeWidth="3.5"
          paintOrder="stroke fill"
          fontFamily="'Anybody', sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="0.04em"
        >
          SPIDER-VERSE
        </text>

        {/* Yellow Box: FACT ATTACK! #01 */}
        <rect
          x="82"
          y="44"
          width="180"
          height="28"
          fill="#FBBF24"
          stroke="#1b1b20"
          strokeWidth="4"
        />
        <text
          x="90"
          y="64"
          fill="#1b1b20"
          fontFamily="'Anybody', sans-serif"
          fontWeight="900"
          fontSize="15"
          letterSpacing="0.08em"
        >
          FACT ATTACK! #01
        </text>
      </svg>
    </div>
  );
};

/**
 * Image 7 & 8: Spider-Sense Radar Target with White Eyes
 */
export const SpiderSenseRadarBadge: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[3px_3px_0px_#1b1b20]"
      >
        {/* Outer Black Border */}
        <circle cx="80" cy="80" r="77" fill="#1b1b20" />
        {/* Outer Yellow Ring */}
        <circle cx="80" cy="80" r="72" fill="#FBBF24" />
        {/* Black Inner Border */}
        <circle cx="80" cy="80" r="66" fill="#1b1b20" />
        {/* Red Target Surface */}
        <circle cx="80" cy="80" r="61" fill="#DC2626" />

        {/* Radar / Web Lines */}
        {/* Concentric rings */}
        <circle cx="80" cy="80" r="44" stroke="#1b1b20" strokeWidth="4" fill="none" />
        <circle cx="80" cy="80" r="24" stroke="#1b1b20" strokeWidth="4" fill="none" />
        {/* Crosshair lines */}
        <line x1="80" y1="19" x2="80" y2="141" stroke="#1b1b20" strokeWidth="4" />
        <line x1="19" y1="80" x2="141" y2="80" stroke="#1b1b20" strokeWidth="4" />
        {/* Diagonal web rays */}
        <line x1="37" y1="37" x2="123" y2="123" stroke="#1b1b20" strokeWidth="4" />
        <line x1="37" y1="123" x2="123" y2="37" stroke="#1b1b20" strokeWidth="4" />

        {/* White Spider Mask Eyes with thick ink outlines and blue rim */}
        {/* Left Eye */}
        <path
          d="M36 70 C48 64 68 70 76 80 C68 88 48 88 36 70 Z"
          fill="#ffffff"
          stroke="#1b1b20"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path
          d="M44 67 C54 66 66 70 72 75"
          stroke="#5bb8fe"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right Eye */}
        <path
          d="M124 70 C112 64 92 70 84 80 C92 88 112 88 124 70 Z"
          fill="#ffffff"
          stroke="#1b1b20"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path
          d="M116 67 C106 66 94 70 88 75"
          stroke="#5bb8fe"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

/**
 * Image 9 & 10: Bot Guide Assistant (Cute red spider robot with glasses on yellow starburst)
 */
export const SpiderBotGuide: React.FC<{ className?: string; onClick?: () => void }> = ({ className = 'w-16 h-16', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
      title="Bot Guide Assistant"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[2px_2px_0px_#1b1b20]"
      >
        {/* 12-point jagged yellow starburst */}
        <polygon
          points="60,2 73,20 95,12 95,35 116,42 105,62 118,80 97,85 94,108 73,100 60,118 47,100 26,108 23,85 2,80 15,62 4,42 25,35 25,12 47,20"
          fill="#FDE047"
          stroke="#1b1b20"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* Antenna */}
        <line x1="60" y1="42" x2="60" y2="28" stroke="#1b1b20" strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="27" r="5" fill="#10B981" stroke="#1b1b20" strokeWidth="3" />

        {/* Spider Robot Legs */}
        <path d="M36 60 C22 56 16 68 18 84" stroke="#1b1b20" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M84 60 C98 56 104 68 102 84" stroke="#1b1b20" strokeWidth="4.5" strokeLinecap="round" fill="none" />

        {/* Red Round Head/Body */}
        <circle cx="60" cy="65" r="26" fill="#DC2626" stroke="#1b1b20" strokeWidth="4.5" />

        {/* Round Eyeglasses Frames */}
        <line x1="50" y1="62" x2="70" y2="62" stroke="#1b1b20" strokeWidth="3" />
        <circle cx="45" cy="62" r="10" fill="#60A5FA" stroke="#1b1b20" strokeWidth="3.5" />
        <circle cx="75" cy="62" r="10" fill="#60A5FA" stroke="#1b1b20" strokeWidth="3.5" />

        {/* Eyeglass glints */}
        <circle cx="43" cy="59" r="3" fill="#ffffff" />
        <circle cx="73" cy="59" r="3" fill="#ffffff" />

        {/* Smile */}
        <path d="M53 74 C57 78 63 78 67 74" stroke="#1b1b20" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};

/**
 * Image 13 & 14: Spider-Man with Microphone ("LISTEN UP, TIGER!")
 */
export const SpideyWithMic: React.FC<{ className?: string; text?: string }> = ({
  className = 'w-48 h-48',
  text = '"LISTEN UP, TIGER!"'
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[4px_4px_0px_#1b1b20]"
      >
        {/* Golden Circular Background */}
        <circle cx="80" cy="80" r="72" fill="#FBBF24" stroke="#1b1b20" strokeWidth="6" />

        {/* Starburst flash in background */}
        <polygon
          points="80,18 96,44 126,30 120,62 148,74 126,94 136,124 106,120 90,146 72,126 44,140 44,110 16,104 34,80 18,54 48,54 54,24"
          fill="#FEF08A"
          stroke="#1b1b20"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Spidey Shoulders/Torso */}
        <path
          d="M32 152 C32 118 52 108 80 108 C108 108 128 118 128 152 Z"
          fill="#DC2626"
          stroke="#1b1b20"
          strokeWidth="4.5"
        />
        {/* Blue shoulders */}
        <path d="M32 128 C30 140 32 152 32 152 L46 152 C46 136 38 126 32 128 Z" fill="#2563EB" stroke="#1b1b20" strokeWidth="3" />
        <path d="M128 128 C130 140 128 152 128 152 L114 152 C114 136 122 126 128 128 Z" fill="#2563EB" stroke="#1b1b20" strokeWidth="3" />

        {/* Webbing on Chest */}
        <line x1="80" y1="108" x2="80" y2="152" stroke="#1b1b20" strokeWidth="2.5" />
        <line x1="60" y1="120" x2="100" y2="120" stroke="#1b1b20" strokeWidth="2.5" />
        <line x1="50" y1="136" x2="110" y2="136" stroke="#1b1b20" strokeWidth="2.5" />

        {/* Head */}
        <ellipse cx="80" cy="62" rx="34" ry="42" fill="#DC2626" stroke="#1b1b20" strokeWidth="4.5" />
        {/* Head Webbing */}
        <line x1="80" y1="20" x2="80" y2="104" stroke="#1b1b20" strokeWidth="2.5" />
        <line x1="46" y1="62" x2="114" y2="62" stroke="#1b1b20" strokeWidth="2.5" />
        <path d="M54 42 C64 52 96 52 106 42" stroke="#1b1b20" strokeWidth="2.5" fill="none" />
        <path d="M50 78 C62 70 98 70 110 78" stroke="#1b1b20" strokeWidth="2.5" fill="none" />
        <path d="M58 92 C68 86 92 86 102 92" stroke="#1b1b20" strokeWidth="2.5" fill="none" />

        {/* Big White Eyes */}
        <path
          d="M56 50 C64 45 74 52 74 66 C68 72 56 68 56 50 Z"
          fill="#ffffff"
          stroke="#1b1b20"
          strokeWidth="4"
        />
        <path
          d="M104 50 C96 45 86 52 86 66 C92 72 104 68 104 50 Z"
          fill="#ffffff"
          stroke="#1b1b20"
          strokeWidth="4"
        />
        <path d="M60 48 C66 48 72 54 72 60" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M100 48 C94 48 88 54 88 60" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Spider-Man's Hand holding a Vintage Microphone */}
        <rect x="42" y="86" width="14" height="26" rx="3" fill="#DC2626" stroke="#1b1b20" strokeWidth="3" />
        {/* Mic head */}
        <circle cx="49" cy="80" r="9" fill="#1b1b20" stroke="#1b1b20" strokeWidth="2" />
        <circle cx="49" cy="80" r="7" fill="#DC2626" />
        <line x1="44" y1="80" x2="54" y2="80" stroke="#1b1b20" strokeWidth="1.5" />
        <line x1="49" y1="75" x2="49" y2="85" stroke="#1b1b20" strokeWidth="1.5" />
      </svg>

      {/* Speech Label Box */}
      <div className="bg-[#FBBF24] border-2 border-[#1b1b20] px-2 py-0.5 ink-shadow-sm -mt-5 z-10">
        <span className="font-comic font-black text-xs text-[#1b1b20] uppercase tracking-wide">
          {text}
        </span>
      </div>
    </div>
  );
};

/**
 * Vintage Comics Code Authority Seal Logo Badge
 */
export const ComicsCodeSeal: React.FC<{ className?: string }> = ({ className = 'w-9 h-11' }) => {
  return (
    <div
      className={`bg-white border-2 border-[#1b1b20] flex flex-col items-center justify-between p-0.5 ink-shadow-sm -rotate-2 select-none ${className}`}
      title="Approved by the Comics Code Authority"
    >
      <span className="text-[7px] leading-tight font-black uppercase text-[#1b1b20] tracking-tighter">
        COMICS
      </span>
      <div className="w-4 h-4 rounded-full border border-[#1b1b20] flex items-center justify-center bg-[#DC2626] text-white">
        <span className="text-[9px] font-black leading-none">★</span>
      </div>
      <span className="text-[6px] leading-tight font-bold uppercase text-[#1b1b20]">
        CODE
      </span>
    </div>
  );
};
