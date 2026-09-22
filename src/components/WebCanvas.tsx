import React, { useEffect, useRef } from 'react';

interface WebLine {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  progress: number;
  alpha: number;
}

export const WebCanvas: React.FC<{
  registerShooter?: (fn: (sx: number, sy: number, tx: number, ty: number) => void) => void;
}> = ({ registerShooter }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webLinesRef = useRef<WebLine[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const shootWeb = (sx: number, sy: number, tx: number, ty: number) => {
      webLinesRef.current.push({
        sx,
        sy,
        tx,
        ty,
        progress: 0,
        alpha: 1
      });
    };

    if (registerShooter) {
      registerShooter(shootWeb);
    }

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const lines = webLinesRef.current;

      for (let i = lines.length - 1; i >= 0; i--) {
        const w = lines[i];
        w.progress += 0.09;
        if (w.progress >= 1) {
          w.alpha -= 0.04;
        }

        const currentX = w.sx + (w.tx - w.sx) * Math.min(w.progress, 1);
        const currentY = w.sy + (w.ty - w.sy) * Math.min(w.progress, 1);

        // White web core
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(w.alpha, 0)})`;
        ctx.lineWidth = 4;
        ctx.moveTo(w.sx, w.sy);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Ink outline for comic style
        ctx.beginPath();
        ctx.strokeStyle = `rgba(27, 27, 32, ${Math.max(w.alpha, 0)})`;
        ctx.lineWidth = 1.5;
        ctx.moveTo(w.sx, w.sy);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        if (w.alpha <= 0) {
          lines.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [registerShooter]);

  return <canvas ref={canvasRef} id="web-canvas" className="pointer-events-none fixed inset-0 z-50 w-full h-full" />;
};
