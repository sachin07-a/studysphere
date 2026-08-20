import React, { useRef, useEffect } from 'react';

interface ProductivityOrbProps {
  score: number;
  tier: string;
}

export const ProductivityOrb: React.FC<ProductivityOrbProps> = ({ score, tier }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Determine color scheme from score
    const getColor = () => {
      if (score >= 88) return { core: '#06b6d4', glow: '#3b82f6', particle: '#a855f7' };
      if (score >= 75) return { core: '#6366f1', glow: '#06b6d4', particle: '#38bdf8' };
      if (score >= 50) return { core: '#f59e0b', glow: '#fbbf24', particle: '#10b981' };
      return { core: '#3b82f6', glow: '#6366f1', particle: '#818cf8' };
    };

    const colors = getColor();

    // Particle field
    const numParticles = 40;
    const particles = Array.from({ length: numParticles }, (_, i) => ({
      angle: (i / numParticles) * Math.PI * 2,
      radius: 48 + Math.random() * 22,
      speed: 0.015 + Math.random() * 0.015,
      size: 1.5 + Math.random() * 2,
      offsetY: (Math.random() - 0.5) * 16,
      opacity: 0.3 + Math.random() * 0.7,
    }));

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 1. Outer Glow Aura
      const auraGradient = ctx.createRadialGradient(
        centerX, centerY, 10,
        centerX, centerY, 75
      );
      auraGradient.addColorStop(0, colors.glow + '55');
      auraGradient.addColorStop(0.5, colors.core + '22');
      auraGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 75, 0, Math.PI * 2);
      ctx.fill();

      // 2. Orbital Rings
      const drawRing = (tilt: number, rotSpeed: number, color: string, alpha: number) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(time * rotSpeed);
        ctx.scale(1, tilt);

        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, 52, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };

      drawRing(0.4, 0.4, colors.particle, 0.6);
      drawRing(0.3, -0.6, colors.core, 0.4);

      // 3. Floating 3D Core Sphere with Pulsing Depth
      const pulse = Math.sin(time * 1.5) * 3;
      const coreRadius = 32 + pulse;

      const sphereGrad = ctx.createRadialGradient(
        centerX - 10, centerY - 10, 4,
        centerX, centerY, coreRadius
      );
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.2, colors.core);
      sphereGrad.addColorStop(0.7, colors.glow);
      sphereGrad.addColorStop(1, '#070a13');

      ctx.save();
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 24;
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. Rotating Energy Particles
      particles.forEach(p => {
        p.angle += p.speed;
        const x = centerX + Math.cos(p.angle) * p.radius;
        const y = centerY + Math.sin(p.angle) * (p.radius * 0.45) + p.offsetY + Math.sin(time + p.angle) * 4;

        ctx.fillStyle = colors.particle;
        ctx.globalAlpha = p.opacity * (0.6 + 0.4 * Math.sin(p.angle));
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [score, tier]);

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={180}
        height={180}
        className="w-[180px] h-[180px] cursor-pointer transition-transform duration-300 hover:scale-105"
        title="Productivity Energy Core"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-bold font-mono tracking-tight text-white drop-shadow-md">
          {score}
        </span>
        <span className="text-[10px] uppercase font-semibold tracking-wider text-cyan-400">
          SCORE
        </span>
      </div>
    </div>
  );
};
