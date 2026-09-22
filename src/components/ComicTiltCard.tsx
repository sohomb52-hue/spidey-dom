/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface ComicTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt in degrees (default 12)
  glare?: boolean;
  scaleOnHover?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * ComicTiltCard
 * A high-craft, mouse-tracking 3D tilt container using motion/react.
 * Dynamically pivots in 3D space with perspective and an authentic
 * comic foil/gloss reflection sheen based on cursor position.
 */
export const ComicTiltCard: React.FC<ComicTiltCardProps> = ({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
  scaleOnHover = 1.025,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized motion values (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for natural, buttery responsive tilt and smooth snap-back
  const springConfig = { stiffness: 320, damping: 24, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Map mouse movement to 3D rotation angles
  // Moving up (negative Y) tilts top forward (positive rotateX)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Dynamic comic gloss/glare position percentage
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], ['0%', '100%']);

  // Dynamic comic gloss/glare radial background computed at top-level
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255, 255, 255, 0.35) 0%, rgba(220, 38, 38, 0.08) 35%, rgba(255, 255, 255, 0) 70%)`
  );

  // Handle cursor tracking across the card bounds
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly reset tilt back to zero
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      style={{ perspective: 1100 }}
      className="w-full h-full"
    >
      <motion.div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          scale: isHovered ? scaleOnHover : 1,
        }}
        transition={{
          scale: { duration: 0.2, ease: 'easeOut' },
        }}
        className={`relative will-change-transform select-none ${className}`}
      >
        {/* Card Content with 3D child preservation */}
        <div style={{ transform: 'translateZ(0px)' }} className="w-full h-full">
          {children}
        </div>

        {/* Dynamic Comic Hologram / Foil Glare Overlay */}
        {glare && (
          <motion.div
            style={{
              background: glareBackground,
              opacity: isHovered ? 1 : 0,
            }}
            className="pointer-events-none absolute inset-0 rounded-none z-30 mix-blend-overlay transition-opacity duration-200"
          />
        )}
      </motion.div>
    </div>
  );
};
