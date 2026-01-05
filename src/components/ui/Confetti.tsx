"use client";

import { useEffect, useRef } from "react";

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"];
    const shapes = ['square', 'circle', 'triangle'] as const;
    const particles: Particle[] = [];
    
    // Reduce count on mobile for performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 80 : 150;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
      shape: typeof shapes[number];
      gravity: number;
      drag: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height - canvas!.height;
        this.vx = Math.random() * 6 - 3;
        this.vy = Math.random() * 4 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 8 + 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Physics variation for natural feel
        this.gravity = 0.05 + Math.random() * 0.05;
        this.drag = 0.99; // Air resistance
      }

      update() {
        this.vy += this.gravity;
        this.vx *= this.drag;
        this.vy *= this.drag;
        
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas!.height) {
          this.y = -20;
          this.x = Math.random() * canvas!.width;
          this.vy = Math.random() * 4 + 2; // Reset velocity
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;

        switch (this.shape) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(this.size / 2, this.size / 2);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case 'square':
          default:
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId: number;

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
}
