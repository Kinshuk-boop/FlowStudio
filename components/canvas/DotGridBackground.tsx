'use client';

import React, { useEffect, useRef } from 'react';

interface Dot {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
}

export default function DotGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    const dots: Dot[] = [];
    const DOT_SPACING = 30;
    const BASE_RADIUS = 1.2;
    const IMPACT_RADIUS = 150;
    const REPULSION_STRENGTH = 18;
    const SPRING_STIFFNESS = 0.08;
    const DAMPING = 0.85;

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = document.documentElement.scrollHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      dots.length = 0;
      const cols = Math.ceil(width / DOT_SPACING) + 2;
      const rows = Math.ceil(height / DOT_SPACING) + 2;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const ox = i * DOT_SPACING;
          const oy = j * DOT_SPACING;
          dots.push({ originX: ox, originY: oy, x: ox, y: oy, vx: 0, vy: 0, baseRadius: BASE_RADIUS, radius: BASE_RADIUS, alpha: 0.12, targetAlpha: 0.12 });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY + window.scrollY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.active = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    resize();

    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.2;
      mouse.y += (mouse.targetY - mouse.y) * 0.2;
      ctx.clearRect(0, 0, width, height);

      if (mouse.active && mouse.x > 0) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, IMPACT_RADIUS * 1.5);
        glow.addColorStop(0, 'rgba(255,255,255,0.025)');
        glow.addColorStop(0.5, 'rgba(255,255,255,0.008)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      for (const dot of dots) {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < IMPACT_RADIUS && mouse.active) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - dist / IMPACT_RADIUS) * REPULSION_STRENGTH;
          dot.vx += Math.cos(angle) * force;
          dot.vy += Math.sin(angle) * force;
          const intensity = 1 - dist / IMPACT_RADIUS;
          dot.targetAlpha = 0.12 + intensity * 0.45;
          dot.radius = dot.baseRadius + intensity * 1.4;
        } else {
          dot.targetAlpha = 0.12;
          dot.radius += (dot.baseRadius - dot.radius) * 0.1;
        }

        dot.vx += (dot.originX - dot.x) * SPRING_STIFFNESS;
        dot.vy += (dot.originY - dot.y) * SPRING_STIFFNESS;
        dot.vx *= DAMPING;
        dot.vy *= DAMPING;
        dot.x += dot.vx;
        dot.y += dot.vy;
        dot.alpha += (dot.targetAlpha - dot.alpha) * 0.1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${dot.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}
