"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  category: "ayush" | "ip" | "reg" | "tech" | "global";
  pulse: number;
}

const KNOWLEDGE_NODES: { label: string; category: Node["category"] }[] = [
  { label: "Withania somnifera (Ashwagandha)", category: "ayush" },
  { label: "Curcuma longa (Haridra)", category: "ayush" },
  { label: "Charaka Samhita Monographs", category: "ayush" },
  { label: "Ayurvedic Formulary (AFI)", category: "ayush" },
  { label: "Patents Act §3(p) TKDL Defense", category: "ip" },
  { label: "Section 3(e) Synergistic Efficacy", category: "ip" },
  { label: "Trade Marks Act Form TM-A", category: "ip" },
  { label: "GI Tag Geographical Indications", category: "ip" },
  { label: "D&C Rules Rule 158B Licensing", category: "reg" },
  { label: "Schedule T Good Mfg Practices", category: "reg" },
  { label: "FSSAI Ayurveda Aahara Regs", category: "reg" },
  { label: "NBA 2002 Form III ABS Clearance", category: "reg" },
  { label: "Sovereign SHA-256 Merkle Ledger", category: "tech" },
  { label: "BGE-M3 Dense Vector Space", category: "tech" },
  { label: "CRAG Zero-Hallucination Gate", category: "tech" },
  { label: "WIPO PCT International Filings", category: "global" },
];

const CATEGORY_COLORS: Record<Node["category"], { core: string; glow: string }> = {
  ayush:  { core: "#34d399", glow: "rgba(52, 211, 153, 0.4)" },
  ip:     { core: "#60a5fa", glow: "rgba(96, 165, 250, 0.4)" },
  reg:    { core: "#fbbf24", glow: "rgba(251, 191, 36, 0.4)" },
  tech:   { core: "#a78bfa", glow: "rgba(167, 139, 250, 0.4)" },
  global: { core: "#2dd4bf", glow: "rgba(45, 212, 191, 0.4)" },
};

export default function KnowledgeNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initialize nodes
    const nodes: Node[] = KNOWLEDGE_NODES.map((item, idx) => {
      const angle = (idx / KNOWLEDGE_NODES.length) * Math.PI * 2;
      const radiusOffset = 140 + (idx % 3) * 60;
      return {
        x: width / 2 + Math.cos(angle) * (radiusOffset + Math.random() * 40),
        y: height / 2 + Math.sin(angle) * (radiusOffset * 0.7 + Math.random() * 30),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: idx % 3 === 0 ? 5 : 3.5,
        label: item.label,
        category: item.category,
        pulse: Math.random() * Math.PI,
      };
    });

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connections between close nodes
      const maxDistance = 160;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Subtle moving light packet
            if (!prefersReducedMotion && (i + j) % 3 === 0) {
              const t = ((frameCount * 0.01 + (i * 0.2)) % 1);
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
              ctx.beginPath();
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(167, 243, 208, 0.6)";
              ctx.fill();
            }
          }
        }
      }

      // Draw mouse interactive field
      if (mouseX > 0 && mouseY > 0) {
        for (let i = 0; i < nodes.length; i++) {
          const dx = nodes[i].x - mouseX;
          const dy = nodes[i].y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.45;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      for (const node of nodes) {
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          // Boundary bounce with gentle damping
          if (node.x < 30 || node.x > width - 30) node.vx *= -1;
          if (node.y < 30 || node.y > height - 30) node.vy *= -1;

          node.pulse += 0.02;
        }

        const colors = CATEGORY_COLORS[node.category];
        const pulseSize = node.radius + Math.sin(node.pulse) * 1.2;

        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = colors.glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = colors.core;
        ctx.fill();

        // Node label
        ctx.font = "10px 'Plus Jakarta Sans', system-ui, sans-serif";
        ctx.fillStyle = "rgba(226, 232, 240, 0.75)";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[440px] md:min-h-[560px] flex items-center justify-center overflow-hidden pointer-events-auto">
      {/* Ambient background glow orb */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-amber-500/5 blur-[100px] translate-x-32 -translate-y-20 pointer-events-none -z-10" />

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        title="Interactive AYURLEX Knowledge Mesh (Hover to interact)"
      />

      {/* Floating Center Identity Orb */}
      <div className="absolute pointer-events-none flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center shadow-emerald-glow">
          <span className="text-2xl">🏛️</span>
        </div>
        <span className="mt-2 text-[10px] font-mono uppercase tracking-widest text-emerald-400/90 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
          AYURLEX Nexus
        </span>
      </div>
    </div>
  );
}
