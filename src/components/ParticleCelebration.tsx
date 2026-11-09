import React, { useEffect, useRef } from 'react';

interface ParticleCelebrationProps {
  type?: 'coins' | 'confetti' | 'trophy';
  duration?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  alpha: number;
  shape: 'coin' | 'ribbon' | 'star';
}

export const ParticleCelebration: React.FC<ParticleCelebrationProps> = ({
  type = 'confetti',
  duration = 2400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const colors =
      type === 'coins'
        ? ['#FFC857', '#FFB300', '#FFE082', '#FFF59D', '#F59E0B']
        : ['#8257FF', '#388BFF', '#FFC857', '#35C98B', '#FF626C', '#FFFFFF'];

    const particleCount = type === 'coins' ? 45 : 75;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * Math.PI) / 1.5 + Math.PI / 6;
      const speed = Math.random() * 12 + 6;
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 80,
        y: height * 0.45,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.sin(angle) * speed,
        size: type === 'coins' ? Math.random() * 8 + 8 : Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        alpha: 1,
        shape: type === 'coins' ? 'coin' : Math.random() > 0.4 ? 'ribbon' : 'star',
      });
    }

    const startTime = Date.now();

    const loop = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.vRot;

        if (elapsed > duration - 600) {
          p.alpha = Math.max(0, 1 - (elapsed - (duration - 600)) / 600);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'coin') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#D97706';
          ctx.stroke();
          // Inner ring
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.shape === 'star') {
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(
              Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size,
              -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size
            );
            ctx.lineTo(
              Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.5),
              -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size * 0.5)
            );
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Ribbon
          ctx.fillRect(-p.size, -p.size * 0.4, p.size * 2, p.size * 0.8);
        }

        ctx.restore();
      });

      if (elapsed < duration) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [type, duration]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
