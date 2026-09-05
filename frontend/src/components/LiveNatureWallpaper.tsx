"use client";

import { useEffect, useRef, useState } from "react";
import { ImageFill, PauseFill, PlayFill } from "react-bootstrap-icons";

interface ParticleLeaf {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  swayFreq: number;
  swayAmp: number;
  phase: number;
  opacity: number;
  hue: number;
  isSparkle: boolean;
}

const WALLPAPERS = [
  { id: "motion-botanical", name: "3D Botanical", src: "/live-wallpaper.jpg" },
  { id: "nature-forest", name: "Ayurvedic Forest", src: "/nature-forest.jpg" },
];

export default function LiveNatureWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeBgIdx, setActiveBgIdx] = useState(0);
  const [isAnimationRunning, setIsAnimationRunning] = useState(true);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  const currentBg = WALLPAPERS[activeBgIdx];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Create floating leaves & golden pollen particles
    const count = Math.min(Math.floor(width / 35), 32);
    const particles: ParticleLeaf[] = [];

    for (let i = 0; i < count; i++) {
      const isSparkle = Math.random() > 0.65;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isSparkle ? Math.random() * 4 + 2 : Math.random() * 16 + 12,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        vx: (Math.random() - 0.5) * 0.4 + 0.2,
        vy: isSparkle ? -(Math.random() * 0.35 + 0.15) : Math.random() * 0.55 + 0.25,
        swayFreq: Math.random() * 0.02 + 0.008,
        swayAmp: Math.random() * 2.0 + 0.8,
        phase: Math.random() * Math.PI * 2,
        opacity: isSparkle ? Math.random() * 0.6 + 0.3 : Math.random() * 0.45 + 0.25,
        hue: Math.random() * 30 + 135,
        isSparkle,
      });
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse tracking
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.isSparkle) {
          // Floating golden pollen / dew essence
          p.y += p.vy;
          p.x += Math.sin(tick * 0.02 + p.phase) * 0.4;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          grad.addColorStop(0.5, "rgba(251, 191, 36, 0.7)");
          grad.addColorStop(1, "rgba(16, 185, 129, 0)");
          ctx.fillStyle = grad;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          ctx.restore();
        } else {
          // Floating Ayurvedic botanical leaf
          p.phase += p.swayFreq;
          p.x += p.vx + Math.sin(p.phase) * p.swayAmp;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;

          // Mouse interactive breeze
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 0) {
            const force = (1 - dist / 160) * 2.2;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
            p.rotation += 0.03 * force;
          }

          if (p.y > height + 40) {
            p.y = -40;
            p.x = Math.random() * width;
          }
          if (p.x > width + 40) p.x = -40;
          if (p.x < -40) p.x = width + 40;

          // Draw realistic translucent leaf
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.opacity;

          const size = p.size;
          const grad = ctx.createLinearGradient(0, -size, 0, size);
          grad.addColorStop(0, `hsla(${p.hue}, 68%, 52%, 0.75)`);
          grad.addColorStop(1, `hsla(${p.hue + 15}, 75%, 32%, 0.4)`);
          ctx.fillStyle = grad;
          ctx.strokeStyle = `hsla(${p.hue}, 75%, 28%, 0.6)`;
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.bezierCurveTo(size * 0.75, -size * 0.4, size * 0.75, size * 0.4, 0, size);
          ctx.bezierCurveTo(-size * 0.75, size * 0.4, -size * 0.75, -size * 0.4, 0, -size);
          ctx.fill();
          ctx.stroke();

          // Leaf center vein
          ctx.beginPath();
          ctx.moveTo(0, -size * 0.85);
          ctx.lineTo(0, size * 0.85);
          ctx.strokeStyle = `hsla(${p.hue}, 85%, 22%, 0.5)`;
          ctx.stroke();

          ctx.restore();
        }
      }

      if (isAnimationRunning) {
        animId = requestAnimationFrame(render);
      }
    };

    if (isAnimationRunning) {
      animId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isAnimationRunning]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Full-bleed Live Wallpaper Background with Ken Burns breathing drift */}
      <div
        className="absolute -inset-8 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentBg.src})`,
          animation: isAnimationRunning ? "kenBurns 40s infinite alternate ease-in-out" : "none",
          filter: "brightness(1.02) saturate(1.05)",
          opacity: 0.88,
        }}
      />

      {/* 2. Soft atmospheric daylight overlay to ensure readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/75 backdrop-blur-[1px]" />

      {/* 3. Luminous sunbeams from top-right corner */}
      <div className="absolute -top-20 -right-20 w-[36rem] h-[36rem] rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-[30rem] h-[30rem] rounded-full bg-emerald-200/25 blur-3xl pointer-events-none" />

      {/* 4. Canvas layer with floating leaves & rising sunbeam pollen */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 5. Live Wallpaper Floating Selector Pill (Interactive control) */}
      <div className="absolute bottom-3 left-3 pointer-events-auto z-30 flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-white/80 rounded-full px-2.5 py-1 shadow-md text-xs font-semibold text-gray-700">
        <button
          onClick={() => setActiveBgIdx((prev) => (prev + 1) % WALLPAPERS.length)}
          className="flex items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer"
          title="Switch Live Nature Wallpaper"
        >
          <ImageFill className="w-3 h-3 text-emerald-600" />
          <span className="text-[11px]">{currentBg.name}</span>
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => setIsAnimationRunning(!isAnimationRunning)}
          className="hover:text-emerald-700 transition-colors cursor-pointer p-0.5"
          title={isAnimationRunning ? "Pause Live Motion" : "Resume Live Motion"}
        >
          {isAnimationRunning ? (
            <PauseFill className="w-3 h-3 text-gray-500" />
          ) : (
            <PlayFill className="w-3 h-3 text-emerald-600" />
          )}
        </button>
      </div>
    </div>
  );
}
