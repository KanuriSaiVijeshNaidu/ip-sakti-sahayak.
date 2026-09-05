"use client";

import { useEffect, useRef, useState } from "react";

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
  type: "tulsi" | "ashwagandha" | "petal" | "dew";
  hue: number;
}

export default function LiveNatureWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMotionActive, setIsMotionActive] = useState(true);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsMotionActive(false);
      return;
    }

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

    // Generate natural Ayurvedic floating elements
    const leafCount = Math.min(Math.floor(width / 45), 35);
    const leaves: ParticleLeaf[] = [];

    const types: ("tulsi" | "ashwagandha" | "petal" | "dew")[] = [
      "tulsi",
      "tulsi",
      "ashwagandha",
      "petal",
      "dew",
      "dew",
    ];

    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 14 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        vx: (Math.random() - 0.5) * 0.35 + 0.15,
        vy: Math.random() * 0.45 + 0.25,
        swayFreq: Math.random() * 0.015 + 0.008,
        swayAmp: Math.random() * 1.6 + 0.8,
        phase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.35 + 0.15,
        type: types[Math.floor(Math.random() * types.length)],
        hue: Math.random() * 25 + 140, // Ayurvedic greens (140 to 165)
      });
    }

    // Draw single Ayurvedic leaf shape
    const drawLeaf = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      opacity: number,
      type: "tulsi" | "ashwagandha" | "petal" | "dew",
      hue: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.globalAlpha = opacity;

      if (type === "dew") {
        // Glowing morning dew particle
        const grad = c.createRadialGradient(0, 0, 0, 0, 0, size * 0.35);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        grad.addColorStop(0.5, "rgba(209, 250, 229, 0.6)");
        grad.addColorStop(1, "rgba(16, 185, 129, 0)");
        c.fillStyle = grad;
        c.beginPath();
        c.arc(0, 0, size * 0.35, 0, Math.PI * 2);
        c.fill();
      } else if (type === "petal") {
        // Soft herbal floral petal (saffron/gold tint)
        c.fillStyle = "rgba(251, 191, 36, 0.25)";
        c.strokeStyle = "rgba(245, 158, 11, 0.4)";
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(0, -size);
        c.quadraticCurveTo(size * 0.6, 0, 0, size);
        c.quadraticCurveTo(-size * 0.6, 0, 0, -size);
        c.fill();
        c.stroke();
      } else {
        // Tulsi / Ashwagandha leaf
        const leafGrad = c.createLinearGradient(0, -size, 0, size);
        leafGrad.addColorStop(0, `hsla(${hue}, 65%, 48%, 0.35)`);
        leafGrad.addColorStop(1, `hsla(${hue + 10}, 75%, 35%, 0.2)`);
        c.fillStyle = leafGrad;
        c.strokeStyle = `hsla(${hue}, 70%, 30%, 0.35)`;
        c.lineWidth = 1;

        c.beginPath();
        c.moveTo(0, -size);
        c.bezierCurveTo(size * 0.7, -size * 0.4, size * 0.8, size * 0.4, 0, size);
        c.bezierCurveTo(-size * 0.8, size * 0.4, -size * 0.7, -size * 0.4, 0, -size);
        c.fill();
        c.stroke();

        // Central vein
        c.beginPath();
        c.moveTo(0, -size * 0.85);
        c.lineTo(0, size * 0.85);
        c.strokeStyle = `hsla(${hue}, 80%, 25%, 0.25)`;
        c.stroke();
      }

      c.restore();
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Mouse smooth interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i];

        // Natural sway physics
        leaf.phase += leaf.swayFreq;
        const swayX = Math.sin(leaf.phase) * leaf.swayAmp;
        leaf.x += leaf.vx + swayX;
        leaf.y += leaf.vy;
        leaf.rotation += leaf.rotationSpeed;

        // Subtle interactive mouse repulsion / breeze
        const dx = leaf.x - mx;
        const dy = leaf.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 180;
        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 1.8;
          leaf.x += (dx / dist) * force;
          leaf.y += (dy / dist) * force;
          leaf.rotation += 0.02 * force;
        }

        // Screen wrap-around
        if (leaf.y > height + 40) {
          leaf.y = -40;
          leaf.x = Math.random() * width;
        }
        if (leaf.x > width + 40) leaf.x = -40;
        if (leaf.x < -40) leaf.x = width + 40;

        drawLeaf(
          ctx,
          leaf.x,
          leaf.y,
          leaf.size,
          leaf.rotation,
          leaf.opacity,
          leaf.type,
          leaf.hue
        );
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMotionActive]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Living Ambient Gradient Orbs (Organic mesh background) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-300/15 blur-3xl animate-pulse [animation-duration:8s]" />
      <div className="absolute top-1/4 -right-40 w-[30rem] h-[30rem] rounded-full bg-teal-200/15 blur-3xl animate-pulse [animation-duration:11s]" />
      <div className="absolute -bottom-32 left-1/3 w-[28rem] h-[28rem] rounded-full bg-amber-200/15 blur-3xl animate-pulse [animation-duration:9s]" />

      {/* Subtle organic botanical lattice watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#059669_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.035]" />

      {/* HTML5 Canvas with floating Ayurvedic elements */}
      {isMotionActive && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.85 }}
        />
      )}
    </div>
  );
}
