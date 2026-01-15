'use client';

import { useRef, useEffect } from 'react';
import { useNoiseGenerator } from '../hooks';

interface BackgroundLayerProps {
  width: number;
  height: number;
  time: number;
}

export function BackgroundLayer({ width, height, time }: BackgroundLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { noise2D } = useNoiseGenerator();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create gradient background with noise-influenced colors
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const noiseVal = noise2D(time * 0.001, 0) * 0.5 + 0.5;
    
    gradient.addColorStop(0, `hsl(${220 + noiseVal * 20}, 70%, 15%)`);
    gradient.addColorStop(1, `hsl(${260 + noiseVal * 20}, 60%, 10%)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
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
