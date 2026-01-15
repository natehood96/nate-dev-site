'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useNoiseGenerator } from '../hooks';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

interface ParticleLayerProps {
  width: number;
  height: number;
  time: number;
  particleCount?: number;
}

export function ParticleLayer({ width, height, time, particleCount = 100 }: ParticleLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const { noise2D } = useNoiseGenerator(123);

  // Initialize particles
  useMemo(() => {
    if (particlesRef.current.length !== particleCount) {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.3,
      }));
    }
  }, [particleCount, width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      // Apply noise-based force
      const noiseX = noise2D(particle.x * 0.01, time * 0.0001);
      const noiseY = noise2D(particle.y * 0.01, time * 0.0001 + 100);
      
      particle.vx += noiseX * 0.1;
      particle.vy += noiseY * 0.1;
      
      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
      ctx.fill();
    });
  }, [width, height, time, noise2D]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0"
    />
  );
}
