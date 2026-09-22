import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt in degrees (default: 14)
  glare?: boolean; // whether to show holographic comic sheen
  scaleOnHover?: number; // scale factor on hover (default: 1.03)
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = '',
  maxTilt = 14,
  glare = true,
  scaleOnHover = 1.03,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth spring physics for organic comic book feel
  const springConfig = { damping: 18, stiffness: 220, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Calculate 3D rotations:
  // Mouse moving UP tilts card UP (positive rotateX), mouse DOWN tilts card DOWN (negative rotateX)
  // Mouse moving RIGHT tilts card RIGHT (positive rotateY), mouse LEFT tilts card LEFT (negative rotateY)
  const rotateX = useTransform(smoothMouseY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-maxTilt, maxTilt]);

  // Glare position values (0% to 100%)
  const glareX = useTransform(smoothMouseX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(smoothMouseY, [0, 1], ['0%', '100%']);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(Math.max(0, Math.min(1, x)));
      mouseY.set(Math.max(0, Math.min(1, y)));
    },
    [mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Smoothly spring back to flat center
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <div
      style={{ perspective: 1000 }}
      className="inline-block w-full h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        animate={{
          scale: isHovered ? scaleOnHover : 1,
          zIndex: isHovered ? 20 : 1
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={`relative transition-shadow duration-300 select-none ${className}`}
      >
        {/* Card Content with 3D child depth */}
        <div style={{ transform: 'translateZ(18px)' }} className="w-full h-full flex flex-col justify-between">
          {children}
        </div>

        {/* Dynamic Holographic Foil Comic Sheen Glare */}
        {glare && isHovered && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-inherit overflow-hidden z-30"
            style={{
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255, 255, 255, 0.28) 0%, rgba(220, 38, 38, 0.08) 35%, transparent 68%)`,
              mixBlendMode: 'overlay'
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
