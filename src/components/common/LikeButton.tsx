import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface LikeButtonProps {
  id: string;
  initialLikes?: number;
  label?: string;
  className?: string;
  compact?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  id,
  initialLikes = 616,
  label = 'LIKE',
  className = '',
  compact = false
}) => {
  // Load initial like state from localStorage if available
  const [liked, setLiked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`spidey_like_${id}`) === 'true';
    } catch {
      return false;
    }
  });

  const [likesCount, setLikesCount] = useState<number>(() => {
    try {
      const savedCount = localStorage.getItem(`spidey_like_count_${id}`);
      if (savedCount !== null) return parseInt(savedCount, 10);
      const isLiked = localStorage.getItem(`spidey_like_${id}`) === 'true';
      return isLiked ? initialLikes + 1 : initialLikes;
    } catch {
      return initialLikes;
    }
  });

  const [popping, setPopping] = useState<boolean>(false);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !liked;
    const newCount = newLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    setLiked(newLiked);
    setLikesCount(newCount);
    setPopping(true);
    setTimeout(() => setPopping(false), 400);

    if (newLiked) {
      playSound('correct');
    } else {
      playSound('click');
    }

    try {
      localStorage.setItem(`spidey_like_${id}`, String(newLiked));
      localStorage.setItem(`spidey_like_count_${id}`, String(newCount));
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      <button
        type="button"
        id={`like-btn-${id}`}
        onClick={handleToggleLike}
        title={liked ? 'Unlike this comic illustration' : 'Like this comic illustration'}
        className={`font-comic font-black uppercase text-xs tracking-wider border-2 border-[#1b1b20] ink-btn flex items-center gap-1.5 transition-all duration-150 ${
          compact ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5'
        } ${
          liked
            ? 'bg-[#b8121d] text-white ink-shadow-sm border-[#1b1b20]'
            : 'bg-white text-[#1b1b20] hover:bg-[#ffdf9f] ink-shadow-sm'
        } ${popping ? 'scale-110' : ''}`}
      >
        <Heart
          className={`w-3.5 h-3.5 transition-transform ${
            liked ? 'fill-white text-white scale-110' : 'text-[#b8121d] fill-none'
          } ${popping ? 'animate-bounce' : ''}`}
        />
        <span>{liked ? 'LIKED!' : label}</span>
        <span
          className={`px-1.5 py-0.2 rounded-none font-mono text-[11px] font-black border border-[#1b1b20] ${
            liked ? 'bg-white text-[#b8121d]' : 'bg-[#eae7ee] text-[#1b1b20]'
          }`}
        >
          {likesCount.toLocaleString()}
        </span>
      </button>

      {liked && (
        <span className="text-[10px] font-comic font-bold text-[#b8121d] hidden sm:inline animate-pulse">
          ★ TRUE FAN!
        </span>
      )}
    </div>
  );
};
