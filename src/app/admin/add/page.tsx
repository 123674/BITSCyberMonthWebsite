"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // VERY FEW particles
    const points = Array.from({ length: 22 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      size: 0.7 + Math.random() * 0.8,
    }));

    const animate = () => {
      // Pure black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move extremely slowly
      points.forEach((point) => {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce softly at edges
        if (point.x < 0 || point.x > canvas.width) {
          point.vx *= -1;
        }

        if (point.y < 0 || point.y > canvas.height) {
          point.vy *= -1;
        }
      });

      // Draw very subtle connecting lines
      points.forEach((point, i) => {
        points.slice(i + 1).forEach((other) => {
          const dx = point.x - other.x;
          const dy = point.y - other.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          // Only connect nearby particles
          if (distance < 170) {
            const opacity =
              0.09 * (1 - distance / 170);

            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);

            ctx.strokeStyle = `rgba(25, 85, 120, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Tiny blue points
      points.forEach((point) => {
        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          point.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = "rgba(35, 100, 135, 0.35)";
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-full w-full"
      />
    </main>
  );
}