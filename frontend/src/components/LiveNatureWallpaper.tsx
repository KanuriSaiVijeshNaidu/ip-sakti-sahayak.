"use client";

import { useEffect, useRef, useState } from "react";
import { Stars, PauseFill, PlayFill } from "react-bootstrap-icons";

interface TwinkleStar {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  phase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  decay: number;
  active: boolean;
  size: number;
}

export default function LiveNatureWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isAnimationRunning, setIsAnimationRunning] = useState(true);
  const [mode, setMode] = useState<"standard" | "meteor">("standard");

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

    // 1. Create Twinkling Stars Background Field
    const starCount = Math.min(Math.floor((width * height) / 4500), 220);
    const twinkleStars: TwinkleStar[] = [];
    for (let i = 0; i < starCount; i++) {
      twinkleStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.5,
        baseAlpha: Math.random() * 0.55 + 0.25,
        alpha: 0.5,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 2. Shooting Stars Pool
    const shootingStars: ShootingStar[] = [];
    const maxShootingStars = mode === "meteor" ? 6 : 3;

    const spawnShootingStar = () => {
      if (shootingStars.length >= maxShootingStars) return;
      const startX = Math.random() * (width * 0.95);
      const startY = Math.random() * (height * 0.45);
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.2; // ~45 degrees diagonal
      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 90 + 70,
        speed: Math.random() * 10 + 12,
        angle,
        opacity: 1.0,
        decay: Math.random() * 0.015 + 0.012,
        active: true,
        size: Math.random() * 1.5 + 1.2,
      });
    };

    let tick = 0;
    let nextSpawnTick = 40;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Render Twinkling Stars
      for (let i = 0; i < twinkleStars.length; i++) {
        const s = twinkleStars[i];
        s.alpha = s.baseAlpha + Math.sin(tick * s.pulseSpeed + s.phase) * 0.35;
        const clampedAlpha = Math.max(0.1, Math.min(1, s.alpha));

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${clampedAlpha})`;
        ctx.shadowBlur = s.size > 1.2 ? 4 : 0;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
        ctx.restore();
      }

      // Periodically spawn shooting star
      if (tick >= nextSpawnTick) {
        spawnShootingStar();
        nextSpawnTick = tick + Math.floor(Math.random() * (mode === "meteor" ? 45 : 90)) + 35;
      }

      // Render Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const st = shootingStars[i];
        if (!st.active) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Compute tail coordinates
        const tailX = st.x - Math.cos(st.angle) * st.length;
        const tailY = st.y - Math.sin(st.angle) * st.length;

        ctx.save();
        const grad = ctx.createLinearGradient(st.x, st.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${st.opacity})`);
        grad.addColorStop(0.3, `rgba(240, 240, 255, ${st.opacity * 0.6})`);
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = st.size;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Glowing Star Head
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${st.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ffffff";
        ctx.fill();
        ctx.restore();

        // Advance position
        st.x += Math.cos(st.angle) * st.speed;
        st.y += Math.sin(st.angle) * st.speed;
        st.opacity -= st.decay;

        if (st.opacity <= 0.02 || st.x > width + 100 || st.y > height + 100) {
          st.active = false;
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
    };
  }, [isAnimationRunning, mode]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-black"
    >
      {/* 1. Deep Obsidian Darkened Space Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#050508] to-[#020204]" />

      {/* 2. Soft monochrome cosmic haze / nebula depth */}
      <div className="absolute -top-32 -left-32 w-[42rem] h-[42rem] rounded-full bg-white/[0.025] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[38rem] h-[38rem] rounded-full bg-white/[0.02] blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-[36rem] h-[36rem] rounded-full bg-zinc-400/[0.015] blur-[130px] pointer-events-none" />

      {/* 3. Subtle grid / mesh texture for luxury modern depth */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* 4. Canvas layer with white shooting stars and twinkling cosmos */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 5. Minimalist Darkened Controls Pill (Bottom Left) */}
      <div className="absolute bottom-24 sm:bottom-3 left-3 pointer-events-auto z-30 flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/90 rounded-full px-2.5 py-1 shadow-lg text-xs font-semibold text-zinc-300">
        <button
          onClick={() => setMode(mode === "standard" ? "meteor" : "standard")}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          title="Toggle Shooting Star Shower Mode"
        >
          <Stars className="w-3.5 h-3.5 text-zinc-200" />
          <span className="text-[11px] font-mono text-zinc-300">
            {mode === "meteor" ? "Meteor Shower" : "Cosmic Stars"}
          </span>
        </button>
        <span className="text-zinc-700">|</span>
        <button
          onClick={() => setIsAnimationRunning(!isAnimationRunning)}
          className="hover:text-white transition-colors cursor-pointer p-0.5"
          title={isAnimationRunning ? "Pause Stars Animation" : "Resume Stars Animation"}
        >
          {isAnimationRunning ? (
            <PauseFill className="w-3 h-3 text-zinc-400 hover:text-white" />
          ) : (
            <PlayFill className="w-3 h-3 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
