"use client";

import { useEffect, useRef, useState } from "react";

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawWave = (
      yOffset: number,
      amplitude: number,
      frequency: number,
      phase: number,
      color: string,
      lineWidth: number
    ) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      for (let x = 0; x < canvas.width; x += 2) {
        const y =
          yOffset +
          Math.sin((x * frequency + phase) * 0.01) * amplitude +
          Math.sin((x * frequency * 0.5 + phase * 1.5) * 0.01) * (amplitude * 0.5);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    };

    const animate = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.5;

      const numWaves = 15;
      const baseY = canvas.height * 0.5;

      for (let i = 0; i < numWaves; i++) {
        const progress = i / numWaves;
        const yOffset = baseY + (i - numWaves / 2) * 30;
        const amplitude = 40 + progress * 60;
        const frequency = 1 + progress * 0.5;
        const phase = time + i * 20;
        
        // Gradient from indigo (240) to purple (270) hue
        const hue = 240 + progress * 30;
        const saturation = 80;
        const lightness = 50 + progress * 10;
        const alpha = 0.3 + progress * 0.4;
        const color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        const lineWidth = 1 + progress * 1.5;

        drawWave(yOffset, amplitude, frequency, phase, color, lineWidth);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
    />
  );
}
